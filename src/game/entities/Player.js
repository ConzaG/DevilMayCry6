// Player.js

import Phaser from 'phaser';

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

    attack() {
        // Verifica se è passato almeno un secondo dall'ultimo attacco
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastAttackTime < 1000) { // Imposta 1000 millisecondi (1 secondo)
            return; // Esci dalla funzione se non è passato abbastanza tempo
        }

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

        // Imposta la scala dello sprite dello slash per renderlo più piccolo
        const scaleValue = 1; // Imposta il valore di scala desiderato
        slash.setScale(scaleValue); // Modifica il valore della scala in base alle tue esigenze

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
        });

        // Aggiorna il tempo dell'ultimo attacco
        this.lastAttackTime = currentTime;
    }


    updateHealthBar() {
        // Cancella la barra della vita precedente
        this.healthBar.clear();

        // Imposta lo stile della barra della vita
        this.healthBar.fillStyle(0xff0000);

        // Calcola la lunghezza della barra della vita in base alla percentuale di hp rimanenti
        const barLength = (this.health / 100) * 100; // La barra sarà lunga 100 pixel, quindi la percentuale di hp rimanenti è uguale alla lunghezza della barra

        // Disegna la barra della vita
        this.healthBar.fillRect(this.x - 50, this.y - 50, barLength, 10);
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

        if (Phaser.Input.Keyboard.JustDown(cursors.attack)) {
            this.attack();
        }

        this.updateHealthBar();
        this.scene.physics.overlap(this, this.scene.enemies, (player, enemy) => enemy.playerHit(player, this.scene), null, this);
    }
}