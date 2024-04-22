// Player.js

import Phaser from 'phaser';
import Style from './Style';


export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta le proprietà del giocatore
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        // Inizializza la vita del giocatore
        this.health = 100;
        this.lastDamageTime = 0;
        this.healthBar = scene.add.graphics();
        

        // Crea le animazioni del giocatore
        this.createPlayerAnimations(scene.anims);

        // Crea l'animazione per lo slash della spada
        scene.anims.create({
            key: 'slash',
            frames: scene.anims.generateFrameNumbers('sword_slash', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

         // Crea l'animazione per lo sparo della pistola
         scene.anims.create({
            key: 'shoot',
            frames: scene.anims.generateFrameNumbers('shoot', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        // Imposta lo stile del giocatore
        this.style = new Style();

        // Imposta la scena come proprietà del giocatore
        this.scene = scene;
    }

    createPlayerAnimations(anims) {
        // Crea le animazioni per il giocatore
        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 6 }],
            frameRate: 20
        });

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers('dude', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    }

    //ATTACCO CON LA SPADA
    attack() {
        // Verifica se è passato almeno un secondo dall'ultimo attacco
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastAttackTime < 1000) { 
            return; 
        }

        this.scene.sound.play('SwordSound');

        // Determina la direzione del giocatore
        const isFacingLeft = this.body.velocity.x < 0;
        const isFacingRight = this.body.velocity.x > 0;
        const isFacingUp = this.body.velocity.y < 0;
        const isFacingDown = this.body.velocity.y > 0;

        // Ruota lo slash in base alla direzione del giocatore
        let rotationAngle = 0;
        if (isFacingLeft) {
            rotationAngle = 3; // Ruota di 180 gradi (verso sinistra)
        } else if (isFacingRight) {
            rotationAngle = 0; // Nessuna rotazione (verso destra)
        } else if (isFacingUp) {
            rotationAngle = 4.5; // Ruota di 270 gradi (verso l'alto)
        } else if (isFacingDown) {
            rotationAngle = 1.5; // Ruota di 90 gradi (verso il basso)
        }

        const slash = this.scene.physics.add.sprite(this.x, this.y, 'sword_slash');

        // Imposta la rotazione dello sprite dello slash
        slash.setRotation(rotationAngle);
        const scaleValue = 0.7;
        slash.setScale(scaleValue);

        // Imposta le dimensioni dell'hitbox in base alla scala dello sprite
        const newWidth = slash.width * scaleValue;
        const newHeight = slash.height * scaleValue;
        slash.setSize(newWidth, newHeight);

        slash.play('slash');
        slash.on('animationcomplete', () => {
            slash.destroy();
        });

        // Rileva le collisioni tra lo slash e i nemici
        this.scene.physics.overlap(slash, this.scene.enemies, (slash, enemy) => {
            enemy.destroy();
            this.style.addKill('sword');
            
        });

        // Aggiorna il tempo dell'ultimo attacco
        this.lastAttackTime = currentTime;
    }

    //ATTACCO CON LASER
    shoot() {
        // Verifica se l'animazione del laser è già in corso
        if (this.isShooting) {
            return;
        }


        // Trova il nemico più vicino al giocatore
        let nearestEnemy = null;
        let nearestDistance = Number.MAX_VALUE;
        this.scene.enemies.children.iterate(enemy => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
    
        if (!nearestEnemy) {
            // Se non ci sono nemici, interrompi la funzione
            return;
        }
    
        this.scene.sound.play('LaserSound');

        // Crea il laser tra il giocatore e il nemico più vicino
        const laser = this.scene.add.sprite(this.x, this.y, 'laser');
        laser.anims.play('shoot'); // Imposta l'animazione 'shoot' per il laser
        this.scene.physics.add.existing(laser); // Aggiunge il laser alla fisica
    
        // Calcola l'angolo tra il giocatore e il nemico
        const angle = Phaser.Math.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
        // Imposta la rotazione del laser
        laser.rotation = angle;
    
        // Calcola la lunghezza del laser
        const distanceX = nearestEnemy.x - this.x;
        const distanceY = nearestEnemy.y - this.y;
        const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
        // Imposta la lunghezza e la posizione del laser
        laser.setScale(length / laser.width, 1);
        laser.setPosition(this.x + distanceX / 2, this.y + distanceY / 2);
    
        // Distruggi il nemico quando viene colpito dal laser
        nearestEnemy.destroy();
        this.style.addKill('laser');

        // Imposta lo stato di sparatoria su true
        this.isShooting = true;
    
        // Distruggi il laser dopo un certo periodo di tempo
        this.scene.time.delayedCall(500, () => {
            laser.destroy();
            // Ripristina lo stato di sparatoria su false
            this.isShooting = false;
        });
    }    

    //ATTACCO SPECIALE
    killAllEnemies() {
        this.scene.enemies.getChildren().forEach(enemy => enemy.destroy());
    }

    
      
    updateHealthBar() {
        // Cancella la barra della vita precedente
        this.healthBar.clear();

        // Imposta lo stile della barra della vita
        this.healthBar.fillStyle(0xff0000);

        // Calcola la lunghezza della barra della vita in base alla percentuale di hp rimanenti
        const barLength = (this.health / 100) * 100; 

        this.healthBar.fillRect(this.x - 50, this.y - 50, barLength, 10);
    } 
    
    getStyleGrade() {
        return this.style.grade;
    }
    
    update(cursors) {
        // Movimento del giocatore
        if (cursors && cursors.left.isDown) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } else if (cursors && cursors.right.isDown) {
            this.setVelocityX(160);
            this.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }
    
        if (cursors && cursors.up.isDown) {
            this.setVelocityY(-160);
        } else if (cursors && cursors.down.isDown) {
            this.setVelocityY(160);
        } else {
            this.setVelocityY(0);
        }
    
        // Aggiorna la barra della vita
        this.updateHealthBar();
    
        // Controlla le collisioni con i nemici e gestisce l'attacco
        this.scene.physics.overlap(this, this.scene.enemies, (player, enemy) => enemy.playerHit(player, this.scene), null, this);
    }    
}
