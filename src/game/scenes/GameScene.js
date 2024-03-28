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
        this.load.spritesheet('sword_slash', 'assets/Sword.png', { frameWidth: 550, frameHeight: 400 }); // Assicurati di specificare correttamente frameWidth e frameHeight
        // Carica altre risorse se necessario
    }

    create() {
      // Creazione delle piattaforme
      this.platforms = this.physics.add.staticGroup();
      this.createInitialPlatforms();

      // Creazione del giocatore
      this.player = new Player(this, 800, 500);
      this.player.setScale(3);

      // Creazione degli nemici
      this.enemies = this.physics.add.group();
      this.createEnemies();

       // Creazione dei tasti della tastiera
      this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.Z
    });


     /*  // Creazione delle linee verticali rosse da eliminare
      const wallThickness = 50;
      this.createVerticalLine(-wallThickness, 0, this.game.config.height, wallThickness); // Sinistra
      this.createVerticalLine(this.game.config.width, 0, this.game.config.height, wallThickness); // Destra
*/
      this.physics.add.collider(this.player, this.platforms); 
  }
  

 /*  createVerticalLine(x, y, height, wallThickness) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(x, y, wallThickness, height);
} */

createInitialPlatforms() {
  for (let i = 0; i < 5; i++) {
      this.platforms.create(800 + i * 400, 900, 'platform').setScale(3).refreshBody();
      this.platforms.create(-400 + i * 400, 900, 'platform').setScale(3).refreshBody();
  }
}


createEnemies() {
  this.enemies = this.physics.add.group();

  for (let i = 0; i < 10; i++) {
      const randomX = Phaser.Math.Between(0, this.game.config.width);
      const randomY = Phaser.Math.Between(0, this.game.config.height);
      const enemy = new Enemy(this, randomX, randomY, 'enemy');
      this.enemies.add(enemy);
  }
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

      // Esegui altre operazioni di aggiornamento se necessario
    }
}
