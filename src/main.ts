import Phaser from "phaser";
import { Boot } from "./scenes/Boot";
import { Preload } from "./scenes/Preload";
import { World } from "./scenes/World";
import { HUD } from "./scenes/HUD";
import { audio } from "./systems/audio";

// Side-effect import: registers all puzzle plugins
import "./puzzles/registry";

audio.init();

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#a8e6a3",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Boot, Preload, World, HUD]
});
