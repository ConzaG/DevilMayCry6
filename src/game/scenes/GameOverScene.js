// GameOverScene.js

import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('game-over');
    }

    create() {
        // Aggiungi testo per indicare il game over
        this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: 'red' }).setOrigin(0.5);

        // Aggiungi un pulsante per ricominciare il gioco
        const restartButton = this.add.text(400, 400, 'Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive(); // Rendi il pulsante interattivo
        restartButton.on('pointerdown', () => {
            // Al click del pulsante, ricarica la pagina
            window.location.reload();
        });
    }
}
