import Phaser from "phaser";

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
  ["flavor-mint", "flavor-mint.png"]
];

export class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }

  preload() {
    for (const [key, file] of IMAGE_ASSETS) {
      this.load.image(key, `${SPRITE_PATH}/${file}`);
    }
  }

  create() {
    this.scene.start("World");
    this.scene.launch("HUD");
  }
}
