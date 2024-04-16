// GameStartScene.js
import Phaser from 'phaser';

export default class GameStartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStartScene' });
    }

    preload() {
        this.load.image('background', 'assets/Environment/StartingScreen.jpeg');
        this.load.audio('background_music', 'assets/Sounds/StartSceneSound.mp3');
        this.load.image('skull', 'assets/Others/skull.svg');
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
            .setDisplaySize(bgWidth - 150, bgHeight - 150);

        this.add.text(bgWidth / 2 - 200, 400, 'Choose your username and press "Enter" :', { font: '24px Arial', fill: 'red' });

        const input = document.createElement('input');
        input.type = 'text';
        input.style = `
        position: absolute;
        left: 850px;
        top: 450px;
        width: 200px;
        height: 40px;
        font-size: 24px;
        background-color: rgba(255, 255, 255, 0.2); 
        border: 2px solid #ffffff; 
        color: red;
        padding: 5px;
         `;

        document.body.appendChild(input);

        this.add.text(bgWidth / 2 - 700, 40, 'Soup&Dungeon', { font: '50px Blackletter', fill: '#ffffff' });

        this.input.keyboard.once('keydown-ENTER', () => {
            const username = input.value.trim();
            if (username !== '') {
                input.style = "display: none";
                backgroundMusic.stop();
                this.scene.start('GameScene', { username: username });
            }
        });

        const skullWidth = 50;
        const skullCount = 10;
        const margin = 40;
        const totalSkullWidth = skullWidth * skullCount + margin * (skullCount - 1);
        const startX = (bgWidth - totalSkullWidth) / 2;

        for (let i = 0; i < skullCount; i++) {
            const x = startX + (skullWidth + margin) * i;
            const skull = this.add.image(x, bgHeight - 40, 'skull');
            skull.setDisplaySize(skullWidth, 50);

            // Crea un'animazione di dissolvenza in entrata e in uscita per ciascun teschio
            this.tweens.add({
                targets: skull,
                alpha: 0, // Scompare
                duration: Phaser.Math.Between(500, 2000), // Durata casuale tra 0.5 e 2 secondi
                delay: Phaser.Math.Between(0, 2000), // Delay casuale tra 0 e 2 secondi
                yoyo: true, // Ripete l'animazione in senso inverso
                repeat: -1 // Ripete infinite volte
            });
        }
    }
}