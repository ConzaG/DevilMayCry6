import Phaser from "phaser";
import { Game } from "./scenes/Game";

// Ottieni le dimensioni della finestra del browser
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: screenWidth,
  height: screenHeight,
  scene: Game,
  physics: {
    default: "arcade",
  },
};
