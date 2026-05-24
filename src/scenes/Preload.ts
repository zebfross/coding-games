import Phaser from "phaser";
import { getDefaultPack } from "../data/packs";

const SPRITE_PATH = "assets/sprites";

const IMAGE_ASSETS: Array<[key: string, file: string]> = [
  ["grass", "grass.png"],
  ["tree", "tree.png"],
  ["player", "player.png"],
  ["bunny", "bunny.png"],
  ["frog", "frog.png"],
  ["cat", "cat.png"],
  ["dog", "dog.png"],
  ["cow", "cow.png"],
  ["pig", "pig.png"],
  ["carrot", "carrot.png"],
  ["apple", "apple.png"],
  ["ice-cream-truck", "ice-cream-truck.png"],
  ["flavor-strawberry", "flavor-strawberry.png"],
  ["flavor-vanilla", "flavor-vanilla.png"],
  ["flavor-mint", "flavor-mint.png"],
  ["road", "road.png"],
  ["car-red", "car-red.png"],
  ["car-blue", "car-blue.png"],
  ["car-yellow", "car-yellow.png"],
  ["game-over", "game-over.jpg"]
];

export class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }

  preload() {
    for (const [key, file] of IMAGE_ASSETS) {
      this.load.image(key, `${SPRITE_PATH}/${file}`);
    }
  }

  create() {
    this.scene.start("World", { pack: getDefaultPack() });
    this.scene.launch("HUD");
  }
}
