// GameOverScene.js

import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('game-over');
    }

    preload() {
        this.load.image('backgroundGameover', 'assets/Others/skull.svg');
    }


    create() {
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'backgroundGameover');
        background.width = 800;
        background.setDisplaySize(this.cameras.main.width/1.3, this.cameras.main.height/1.3); 

        this.add.text(this.cameras.main.width / 2, 100, 'GAME OVER', { fontSize: '32px', fill: 'red' }).setOrigin(0.5);

        //pulsante per ricominciare il gioco
        const restartButton = this.add.text(this.cameras.main.width/2, 400, 'Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive(); 
        restartButton.on('pointerdown', () => {
            // Al click del pulsante, ricarica la pagina
            window.location.reload();
        });
    }
}
