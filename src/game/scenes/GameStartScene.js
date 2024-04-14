// GameStartScene.js
import Phaser from 'phaser';

export default class GameStartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStartScene' });
    }

    preload() {
        this.load.image('background', 'assets/Environment/StartingScreen.jpeg');
        this.load.audio('background_music', 'assets/Sounds/StartSceneSound.mp3');
    }

    create() {  
        this.cameras.main.setBackgroundColor('#000000');

        const bgWidth = this.cameras.main.width;
        const bgHeight = this.cameras.main.height;


        const backgroundMusic = this.sound.add('background_music', { loop: true });
        backgroundMusic.setVolume(0.04); 
        backgroundMusic.play();

        this.add.image(bgWidth / 2, bgHeight / 2, 'background')
            .setOrigin(0.5)
            .setDisplaySize(bgWidth - 150, bgHeight -150);

        this.add.text(300, 200 , 'Enter your username:', { font: '24px Arial', fill: '#ffffff' });

        const input = document.createElement('input');
        input.type = 'text';
        input.style = 'position: absolute; left: 300px; top: 250px; width: 200px; height: 40px; font-size: 24px;';

        document.body.appendChild(input);

        this.add.text(bgWidth/2 - 120, 700, 'PRESS ENTER TO START', { font: '28px Arial', fill: '#ffffff' });

        this.add.text(bgWidth/2 - 100, 40, 'Soup&Dungeon', { font: '50px Blackletter', fill: '#ffffff' });

        this.input.keyboard.once('keydown-ENTER', () => {
            const username = input.value.trim();
            if (username !== '') {
                input.style = "display: none";
                backgroundMusic.stop();
                this.scene.start('GameScene', { username: username });
            }
        });
    }
}