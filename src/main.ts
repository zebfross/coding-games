import Phaser from "phaser";
import { Boot } from "./scenes/Boot";
import { Preload } from "./scenes/Preload";
import { World } from "./scenes/World";
import { HUD } from "./scenes/HUD";
import { audio } from "./systems/audio";

audio.init();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#a8e6a3",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { x: 0, y: 0 }, debug: false }
  },
  scene: [Boot, Preload, World, HUD]
});
