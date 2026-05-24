import Phaser from "phaser";

const SPRITE_PATH = "assets/sprites";

/** Assets shipped as PNGs in /public/assets/sprites. */
const IMAGE_ASSETS: Array<[key: string, file: string]> = [
  ["grass", "grass.png"],
  ["tree", "tree.png"],
  ["player", "player.png"],
  ["bunny", "bunny.png"]
];

export class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }

  preload() {
    for (const [key, file] of IMAGE_ASSETS) {
      this.load.image(key, `${SPRITE_PATH}/${file}`);
    }
  }

  create() {
    this.makeProceduralFallbacks();
    this.scene.start("World");
    this.scene.launch("HUD");
  }

  /**
   * Procedural placeholders for assets that haven't been generated yet.
   * Remove an entry from here once a real PNG exists in /public/assets/sprites.
   */
  private makeProceduralFallbacks() {
    const SIZE = 256;
    const g = this.add.graphics();

    if (!this.textures.exists("frog")) {
      g.fillStyle(0x4ab84a); g.fillCircle(128, 152, 80);
      g.fillStyle(0xffffff); g.fillCircle(88, 88, 32); g.fillCircle(168, 88, 32);
      g.fillStyle(0x000000); g.fillCircle(88, 88, 16); g.fillCircle(168, 88, 16);
      g.fillStyle(0x2d6b1e); g.fillRect(80, 168, 96, 12);
      g.generateTexture("frog", SIZE, SIZE);
      g.clear();
    }

    g.destroy();
  }
}
