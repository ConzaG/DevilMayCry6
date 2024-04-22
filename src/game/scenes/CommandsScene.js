// CommandsScene.js

import Phaser from 'phaser';

export default class CommandsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CommandsScene' });
    }

    preload() {
        // Carica l'immagine contenente le spiegazioni dei comandi
        this.load.image('commandsImage', 'assets/Others/commands.png');
    }

    create() {
        // Aggiungi l'immagine delle spiegazioni dei comandi al centro della scena
        const commandsImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'commandsImage');

        // Imposta la dimensione dell'immagine per adattarla alla dimensione della finestra
        commandsImage.displayWidth = this.cameras.main.width - 200;
        commandsImage.displayHeight = this.cameras.main.height - 200;

        // Aggiungi un evento per tornare alla scena precedente quando viene premuto un tasto
        this.input.keyboard.once('keydown', () => {
            // Torna alla scena precedente
            this.scene.resume('GameScene'); 
            this.scene.stop('CommandsScene'); 
        });

        const button = this.add.text(1500, 860, 'TURN HOME', { font: '32px Arial', fill: 'white' })
            .setOrigin(0.5)
            .setInteractive();

        // Gestisci l'evento di clic sul bottone
        button.on('pointerdown', () => {
            this.scene.start('GameStartScene'); 
        });
    }
}
