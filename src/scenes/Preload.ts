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
  ["apple", "apple.png"]
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
   * Remove a block here once a real PNG exists in /public/assets/sprites
   * and add the key to IMAGE_ASSETS above.
   */
  private makeProceduralFallbacks() {
    const SIZE = 256;
    const g = this.add.graphics();

    if (!this.textures.exists("ice-cream-truck")) {
      // truck body
      g.fillStyle(0xffffff); g.fillRoundedRect(28, 100, 200, 100, 12);
      g.lineStyle(6, 0x000000); g.strokeRoundedRect(28, 100, 200, 100, 12);
      // window
      g.fillStyle(0x9ed8ff); g.fillRoundedRect(56, 116, 76, 56, 6);
      g.lineStyle(4, 0x000000); g.strokeRoundedRect(56, 116, 76, 56, 6);
      // serving counter
      g.fillStyle(0xff7aa6); g.fillRoundedRect(146, 132, 70, 40, 4);
      g.lineStyle(4, 0x000000); g.strokeRoundedRect(146, 132, 70, 40, 4);
      // wheels
      g.fillStyle(0x222222); g.fillCircle(70, 210, 22); g.fillCircle(186, 210, 22);
      g.fillStyle(0x888888); g.fillCircle(70, 210, 10); g.fillCircle(186, 210, 10);
      // giant cone on top
      g.fillStyle(0xd99457); g.fillTriangle(112, 100, 144, 100, 128, 60);
      g.lineStyle(4, 0x000000); g.strokeTriangle(112, 100, 144, 100, 128, 60);
      g.fillStyle(0xffe0ec); g.fillCircle(128, 56, 18);
      g.lineStyle(4, 0x000000); g.strokeCircle(128, 56, 18);
      g.generateTexture("ice-cream-truck", SIZE, SIZE);
      g.clear();
    }

    const flavor = (key: string, scoopColor: number) => {
      if (this.textures.exists(key)) return;
      // cone
      g.fillStyle(0xd99457); g.fillTriangle(96, 140, 160, 140, 128, 230);
      g.lineStyle(6, 0x000000); g.strokeTriangle(96, 140, 160, 140, 128, 230);
      // waffle pattern hint
      g.lineStyle(2, 0x000000);
      g.lineBetween(108, 160, 152, 160);
      g.lineBetween(116, 180, 144, 180);
      // scoop
      g.fillStyle(scoopColor); g.fillCircle(128, 110, 50);
      g.lineStyle(6, 0x000000); g.strokeCircle(128, 110, 50);
      // highlight
      g.fillStyle(0xffffff, 0.4); g.fillCircle(112, 96, 10);
      g.generateTexture(key, SIZE, SIZE);
      g.clear();
    };
    flavor("flavor-vanilla", 0xfff3c4);
    flavor("flavor-chocolate", 0x6f3a1f);
    flavor("flavor-strawberry", 0xff8aa1);
    flavor("flavor-mint", 0xa6e3c1);

    g.destroy();
  }
}
