// GameScene.js

import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy1 from '../entities/Enemy1';
import Enemy2 from '../entities/Enemy2';


export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    //Environment
    this.load.image('platform', 'assets/Environment/platform.png');
    this.load.image('backgroundgamescene', 'assets/Environment/background.jpg');

    //Sprites
    this.load.spritesheet('dude', 'assets/SpriteImages/dude.png', { frameWidth: 48, frameHeight: 24 });
    this.load.spritesheet('sword_slash', 'assets/SpriteImages/Sword.png', { frameWidth: 550, frameHeight: 400 });
    this.load.spritesheet('shoot', 'assets/SpriteImages/Laser.png', { frameWidth: 256, frameHeight: 64 });

    this.load.spritesheet('enemy1', 'assets/SpriteImages/Enemy1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('enemy2', 'assets/Others/skull.svg');
    this.load.spritesheet('enemy2explosion', 'assets/SpriteImages/Enemy2Explosion.png', { frameWidth: 320, frameHeight: 320 });

    //Sounds
    this.load.audio('SwordSound', 'assets/Sounds/SwordSound.mp3');
    this.load.audio('LaserSound', 'assets/Sounds/LaserSound.mp3');
    this.load.audio('GameSceneSound', 'assets/Sounds/GameSceneSound.mp3');

  }

  init(data) {
    this.username = data.username;
  }

  create() {
    // Imposta lo sfondo della scena
    //this.add.image(0, 0, 'backgroundgamescene').setOrigin(0);

    //musica di sottofondo
    const backgroundMusic = this.sound.add('GameSceneSound', { loop: true });
        backgroundMusic.setVolume(0.2);
        backgroundMusic.play();

        this.events.on('shutdown', () => {
          backgroundMusic.stop();
      });
  
      this.events.once('destroy', () => {
          backgroundMusic.stop();
      });

    // Imposta la dimensione della mappa
    this.mapWidth = 1900;
    this.mapHeight = 1000;

    // Creazione delle piattaforme
    this.platforms = this.physics.add.staticGroup();
    this.createInitialPlatforms();
    // Rendi invisibili tutte le piattaforme
    this.platforms.getChildren().forEach(platform => {
      platform.setVisible(false);
    });

    // Creazione del giocatore
    this.player = new Player(this, 800, 500);
    this.player.setScale(2);

    // Creazione degli nemici
    this.enemies = this.physics.add.group();
    this.createEnemies();

    
    this.anims.create({
      key: 'enemy1-right',
      frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 2 }), // Imposta i frame per l'animazione verso destra
      frameRate: 10, // Velocità di riproduzione dell'animazione
      repeat: -1 // Ripeti l'animazione all'infinito
    });

    this.anims.create({
      key: 'enemy1-left',
      frames: this.anims.generateFrameNumbers('enemy1', { start: 3, end: 5 }), // Imposta i frame per l'animazione verso sinistra
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy1-up',
      frames: this.anims.generateFrameNumbers('enemy1', { start: 6, end: 8 }), // Imposta i frame per l'animazione verso l'alto
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy1-down',
      frames: this.anims.generateFrameNumbers('enemy1', { start: 9, end: 11 }), // Imposta i frame per l'animazione verso il basso
      frameRate: 10,
      repeat: -1
    });

    // Creazione dei tasti della tastiera
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z,
      shoot: Phaser.Input.Keyboard.KeyCodes.X,
      trasform: Phaser.Input.Keyboard.KeyCodes.SPACE
    });


    // Imposta i limiti della telecamera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player);

    // Abilita il controllo della telecamera tramite i bordi della finestra di gioco
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.5);

    this.physics.add.collider(this.player, this.platforms);

    // Aggiungi un testo per visualizzare lo stile
    this.styleText = this.add.text(20, 20, 'Style: E', { font: '24px Arial', fill: '#ffffff' });

    // Creazione del timer
    this.totalTime = 10 * 60;
    this.remainingTime = this.totalTime;

    const timerY = 20; // Distanza dal bordo superiore dello schermo

    this.timerText = this.add.text(this.cameras.main.centerX, timerY, '10:00', { font: '24px Arial', fill: '#ffffff' }).setOrigin(0.5, 0);
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

  }

  updateTimer() {
    // Riduci il tempo rimanente di un secondo
    this.remainingTime--;

    // Calcola i minuti e i secondi rimanenti
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    // Aggiorna il testo del timer
    this.timerText.setText(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

    // Se il timer è scaduto, passa alla scena "GameWinScene"
    if (this.remainingTime === 0) {
      this.scene.start('GameWinScene');
    }
  }

  createInitialPlatforms() {
    // Crea piattaforme iniziali
    for (let i = 0; i < 20; i++) {
      this.platforms.create(400 + i * 400, 1200, 'platform').setScale(3).refreshBody();
    }
    for (let i = 0; i < 20; i++) {
      this.platforms.create(400 + i * 400, 80, 'platform').setScale(3).refreshBody();
    }
  }

  createEnemies() {
    const spawnEnemies = () => {
        const minDistanceFromPlayer = 300; // Distanza minima desiderata dal giocatore
        for (let i = 0; i < 10; i++) {
            let randomX, randomY;
            do {
                randomX = Phaser.Math.Between(0, this.mapWidth);
                randomY = Phaser.Math.Between(0, this.mapHeight);
            } while (Phaser.Math.Distance.Between(randomX, randomY, this.player.x, this.player.y) < minDistanceFromPlayer);
            
            // Seleziona casualmente quale tipo di nemico spawnare
            const enemyType = Phaser.Math.Between(1, 2); // Scegli tra i numeri 1 e 2
            let enemy;

            if (enemyType === 1) {
                // Crea un nemico di tipo Enemy1
                enemy = new Enemy1(this, randomX, randomY, 'enemy1');
            } else {
                // Crea un nemico di tipo Enemy2
                enemy = new Enemy2(this, randomX, randomY, 'enemy2');
                enemy.setScale(0.5);
            }
            
            this.enemies.add(enemy);
        }
    };

    // Esegui la funzione di spawn dei nemici ogni 5 secondi
    this.time.addEvent({
        delay: 5000,
        callback: spawnEnemies,
        callbackScope: this,
        loop: true
    });
}



  update() {
    // Movimento del giocatore
    this.player.update(this.cursors);

    // Movimento dei nemici
    this.enemies.children.iterate(enemy => {
      enemy.update(this.player);

      // Controlla il tipo di nemico
      if (enemy instanceof Enemy1) {
          // Se il nemico è di tipo Enemy, gestisci le animazioni
          if (enemy.body.velocity.x > 0) {
              enemy.play('enemy1-right', true);
          } else if (enemy.body.velocity.x < 0) {
              enemy.play('enemy1-left', true);
          } else if (enemy.body.velocity.y < 0) {
              enemy.play('enemy1-up', true);
          } else if (enemy.body.velocity.y > 0) {
              enemy.play('enemy1-down', true);
          } else {
              enemy.anims.stop();
          }
      }
  });

    // Controllo delle collisioni tra giocatore e nemici
    this.physics.overlap(this.player, this.enemies, this.playerHit, null, this);

    // Controllo dell'input per l'attacco con la spada
    if (Phaser.Input.Keyboard.JustDown(this.cursors.attack)) {
      this.player.attack();
    }

    // Controllo dell'input per l'attacco con la pistola
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shoot)) {
      this.player.shoot();
    }

    //STYLE ********************************************
    const playerStyleGrade = this.player.getStyleGrade();

    // Calcola la posizione minima e massima consentita per il testo dello stile
    const minTextX = this.cameras.main.scrollX + 20;
    const minTextY = this.cameras.main.scrollY + 20;
    const maxTextX = this.cameras.main.scrollX + this.cameras.main.width - 20 - this.styleText.width;
    const maxTextY = this.cameras.main.scrollY + this.cameras.main.height - 20 - this.styleText.height;

    // Calcola la posizione del testo dello stile in base alla posizione del giocatore rispetto al centro della telecamera
    let textX = this.cameras.main.scrollX + this.cameras.main.width / 4 - this.styleText.width / 2;
    let textY = this.cameras.main.scrollY + this.cameras.main.height / 4 - this.styleText.height / 2;

    // Aggiorna la posizione del testo dello stile se si trova al di fuori dei limiti della telecamera
    if (textX < minTextX) {
      textX = minTextX;
    } else if (textX > maxTextX) {
      textX = maxTextX;
    }

    if (textY < minTextY) {
      textY = minTextY;
    } else if (textY > maxTextY) {
      textY = maxTextY;
    }

    // Imposta la posizione del testo dello stile
    this.styleText.setPosition(textX, textY);

    //Timer
    this.timerText.setPosition(textX + 510, textY);

    // Aggiorna il testo dello stile con il grado corrente
    this.styleText.setText('Style: ' + this.player.style.grade);

    // Controlla se il grado dello stile del giocatore è "A"
    if (playerStyleGrade === 'A' || playerStyleGrade === 'B' || playerStyleGrade === 'S') {
      // Mostra il testo "MUSIC STARTS PLAYING" solo se non è già stato creato
      if (!this.musicText) {
        this.musicText = this.add.text(textX + 370, textY + 500, 'MUSIC STARTS PLAYING...', { font: 'italic 24px Arial', fill: '#D6D5C9' });
        this.musicText.setOrigin(0);

        setTimeout(() => {
          this.musicText.destroy();
          this.musicText = null;
        }, 0);
      }
    }
    else if (playerStyleGrade === 'SS') {
      if (!this.musicText) {
        this.musicText = this.add.text(textX + 370, textY + 500, 'I CAN FEEL IT... MY BODY...', { font: 'italic 24px Arial', fill: '#A22C29' });
        this.musicText.setOrigin(0);

        setTimeout(() => {
          this.musicText.destroy();
          this.musicText = null;
        }, 0);
      }
    }
  }
}
