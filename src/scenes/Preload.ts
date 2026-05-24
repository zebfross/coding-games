import Phaser from "phaser";

export class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }

  create() {
    this.makePlaceholderTextures();
    this.scene.start("World");
    this.scene.launch("HUD");
  }

  private makePlaceholderTextures() {
    const g = this.add.graphics();

    // grass tile (48x48)
    g.fillStyle(0x7ac74f); g.fillRect(0, 0, 48, 48);
    g.fillStyle(0x5fa83a);
    for (let i = 0; i < 8; i++) {
      g.fillRect(Math.floor(Math.random() * 44), Math.floor(Math.random() * 44), 4, 4);
    }
    g.generateTexture("grass", 48, 48);
    g.clear();

    // tree
    g.fillStyle(0x5d3a1a); g.fillRect(20, 30, 8, 14);
    g.fillStyle(0x2d6b1e); g.fillCircle(24, 22, 18);
    g.fillStyle(0x3d8b2e); g.fillCircle(20, 18, 8);
    g.generateTexture("tree", 48, 48);
    g.clear();

    // player (chunky orange character with eyes)
    g.fillStyle(0xff7a3b); g.fillRoundedRect(8, 8, 32, 40, 8);
    g.fillStyle(0xffffff); g.fillCircle(18, 22, 5); g.fillCircle(30, 22, 5);
    g.fillStyle(0x000000); g.fillCircle(19, 23, 2); g.fillCircle(31, 23, 2);
    g.fillStyle(0xd95a1f); g.fillRoundedRect(12, 40, 10, 6, 2);
    g.fillStyle(0xd95a1f); g.fillRoundedRect(26, 40, 10, 6, 2);
    g.generateTexture("player", 48, 48);
    g.clear();

    g.destroy();
  }
}
