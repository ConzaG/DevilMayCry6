import Phaser from "phaser";

export class Game extends Phaser.Scene {
  platforms
  player
  cursors
  stars
  score = 0
  scoreText

  preload() {
    this.load.image('platform', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.platforms = this.physics.add.staticGroup();

    // Crea piattaforme iniziali
    this.platforms = this.physics.add.staticGroup();
    this.createInitialPlatforms();

    // Crea il giocatore
    this.player = this.physics.add.sprite(800, 500, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.createPlayerAnimations();
    this.physics.add.collider(this.platforms, this.player);
    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
 
    // Aggiunta delle linee rosse verticali a destra e sinistra della mappa 
    const wallThickness = 50;
    this.createVerticalLine(-wallThickness, 0, this.game.config.height, wallThickness); // Sinistra
    this.createVerticalLine(this.game.config.width, 0, this.game.config.height, wallThickness); // Destra
    this.createHorizontalLine(0, -wallThickness, this.game.config.width, wallThickness); // Alto

    // Crea i nemici
    this.createEnemies();
}

//PLAYER ****************************************************************************************************************************************
createPlayerAnimations() {
  // Crea le animazioni per il giocatore
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}

handlePlayerMovement() {
  // Movimento del giocatore
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
    this.player.anims.play('left', true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
    this.player.anims.play('right', true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }

  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-160);
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(160);
  } else {
    this.player.setVelocityY(0);
  }
}

//NEMICI ****************************************************************************************************************************************
createEnemies() {
  // Crea un gruppo per i nemici
  this.enemies = this.physics.add.group();

  // Aggiungi un nemico
  const enemy = this.enemies.create(600, 200, 'enemy');
  
  // Imposta la velocità del nemico
  const enemySpeed = 100;

  // Programma il movimento del nemico verso il giocatore
  this.updateEnemyMovement(enemy, enemySpeed);
}

updateEnemyMovement(enemy, speed) {
  this.physics.moveToObject(enemy, this.player, speed);
}


//MAP ****************************************************************************************************************************************
createInitialPlatforms() {
  // Crea piattaforme iniziali
  for (let i = 0; i < 5; i++) {
    this.platforms.create(800 + i * 400, 900, 'platform').setScale(3).refreshBody();
    this.platforms.create(-400 + i * 400, 900, 'platform').setScale(3).refreshBody();
  }
}

//TEST
createVerticalLine(x, y, height, wallThickness) {
  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000);
  graphics.fillRect(x, y, wallThickness, height);
}

//TEST
createHorizontalLine(x, y, width, wallThickness) {
  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000);
  graphics.fillRect(x, y, width, wallThickness);
}


update() {
  // Movimento del giocatore
  this.handlePlayerMovement();

  // Aggiornamento del movimento dei nemici
  this.enemies.children.iterate(enemy => {
    this.updateEnemyMovement(enemy, 100); // Imposta la velocità del nemico
  });
}
}

