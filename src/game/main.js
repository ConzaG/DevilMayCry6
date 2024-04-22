// main.js

import Phaser from "phaser";
import GameStartScene from "./scenes/GameStartScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import GameWinScene from "./scenes/GameWinScene";
import CommandsScene from "./scenes/CommandsScene";

const screenWidth = window.innerWidth + 10;
const screenHeight = window.innerHeight + 10;

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: screenWidth,
  height: screenHeight,
  scene: [ GameStartScene, GameScene, GameOverScene, GameWinScene, CommandsScene ], 
  physics: {
    default: "arcade",
  },
};
