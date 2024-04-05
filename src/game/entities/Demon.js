// Demon.js
import Phaser from 'phaser';

export default class Demon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'demon');

        // Aggiungi il personaggio demonio alla scena e attivalo
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta le proprietà del personaggio demonio
        this.setScale(2); // Scala il personaggio demonio se necessario
        this.setCollideWorldBounds(true); // Assicura che il personaggio demonio collida con i bordi del mondo
        this.setGravityY(300); // Aggiungi gravità al personaggio demonio se necessario

        // Aggiungi altre logiche o comportamenti al personaggio demonio qui

        // Aggiungi le animazioni se necessario
        scene.anims.create({
            key: 'demon_idle',
            frames: scene.anims.generateFrameNumbers('demon', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Avvia l'animazione di idle per il personaggio demonio
        this.play('demon_idle');
    }

    // Aggiungi altri metodi o funzionalità specifiche per il personaggio demonio qui
}
