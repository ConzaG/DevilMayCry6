import Phaser from 'phaser';

export default class Enemy2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); // Assicurati di passare correttamente la texture alla superclasse
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta la velocità del nemico
        this.speed = 300;

        // Inizializza la barra della vita del nemico
        this.healthBar = scene.add.graphics();
        this.damagePerHit = 20;
        this.lastDamageTime = 0;

        this.anims.create({
            key: 'enemy2explosion',
            frames: this.anims.generateFrameNumbers('enemy2explosion', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        }); 
        
    }
    
    playerHit(player) {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastDamageTime < 1000) { 
            return;
        }
        
        // Applica i danni al giocatore
        player.health -= this.damagePerHit;
        this.lastDamageTime = currentTime; 

        if (player.health <= 0) {
            // Se la vita del giocatore è 0 o meno, avvia la scena di game over
            this.scene.scene.start('game-over');
        } else {
            // Aggiorna la barra della vita del giocatore solo se la vita è maggiore di 0
            player.updateHealthBar();
            // Avvia l'animazione di esplosione
            this.play('enemy2explosion', true);
            this.scene.sound.setVolume(0.1);
            this.scene.sound.play('ExplosionSound');

            setTimeout(() => {
                this.destroy();
            }, 1000);
        }
    }

    update(player) {
        // Programma il movimento del nemico verso il giocatore
        this.scene.physics.moveToObject(this, player, this.speed);

        // Controlla la collisione con il player
        this.scene.physics.overlap(this, player, this.enemyHit, null, this);
    }
}
