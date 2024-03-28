// GameScene.js

import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 48, frameHeight: 24 });
    this.load.spritesheet('sword_slash', 'assets/Sword.png', { frameWidth: 550, frameHeight: 400 });
    this.load.spritesheet('shoot', 'assets/Pistol.png', { frameWidth: 64, frameHeight: 32 });
  }

  create() {
    // Imposta la dimensione della mappa
    this.mapWidth = 1900;
    this.mapHeight = 1000;

    // Creazione delle piattaforme
    this.platforms = this.physics.add.staticGroup();
    this.createInitialPlatforms();

    // Creazione del giocatore
    this.player = new Player(this, 800, 500);
    this.player.setScale(2);

    // Creazione degli nemici
    this.enemies = this.physics.add.group();
    this.createEnemies();

    // Creazione dei tasti della tastiera
    this.cursors = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.UP,
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    attack: Phaser.Input.Keyboard.KeyCodes.Z,
    shoot: Phaser.Input.Keyboard.KeyCodes.X 
  });


    // Imposta i limiti della telecamera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player);

    // Abilita il controllo della telecamera tramite i bordi della finestra di gioco
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.5);

    this.physics.add.collider(this.player, this.platforms); 
  }

  createInitialPlatforms() {
    // Crea piattaforme iniziali
    for (let i = 0; i < 20; i++) {
      this.platforms.create(400 + i * 400, 900, 'platform').setScale(3).refreshBody();
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
  
        const enemy = new Enemy(this, randomX, randomY, 'enemy');
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
}

}
