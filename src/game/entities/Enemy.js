// Enemy.js

import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta la velocità del nemico
        this.speed = 100;

        // Inizializza la barra della vita del nemico
        this.healthBar = scene.add.graphics();
    }
    
    playerHit(player) {
        const currentTime = this.scene.time.now;
        if (currentTime - player.lastDamageTime < 1000) { // Verifica se è passato 1 secondo
            return; // Esci se non è passato abbastanza tempo
        }
        // Applica i danni al giocatore
        player.health -= 10;
        player.lastDamageTime = currentTime; // Aggiorna il tempo dell'ultimo danno

        if (player.health <= 0) {
        // Se la vita del giocatore è 0 o meno, avvia la scena di game over
        this.scene.scene.start('game-over');
        } else {
        // Aggiorna la barra della vita del giocatore solo se la vita è maggiore di 0
        player.updateHealthBar();
    }
    }

    update(player) {
        // Programma il movimento del nemico verso il giocatore
        this.scene.physics.moveToObject(this, player, this.speed);

        // Controlla la collisione con il player
        this.scene.physics.overlap(this, player, this.enemyHit, null, this);
    }
}
