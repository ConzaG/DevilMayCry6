// main.js

import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: screenWidth,
  height: screenHeight,
  scene: [GameScene, GameOverScene], 
  physics: {
    default: "arcade",
  },
};
