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
    const SIZE = 64;

    // grass tile
    g.fillStyle(0x7ac74f); g.fillRect(0, 0, SIZE, SIZE);
    g.fillStyle(0x5fa83a);
    for (let i = 0; i < 12; i++) {
      g.fillRect(Math.floor(Math.random() * (SIZE - 4)), Math.floor(Math.random() * (SIZE - 4)), 4, 4);
    }
    g.generateTexture("grass", SIZE, SIZE);
    g.clear();

    // tree (occupies a 64x64 tile, drawn slightly taller visually)
    g.fillStyle(0x5d3a1a); g.fillRect(28, 40, 8, 18);
    g.fillStyle(0x2d6b1e); g.fillCircle(32, 28, 22);
    g.fillStyle(0x3d8b2e); g.fillCircle(26, 22, 10);
    g.generateTexture("tree", SIZE, SIZE);
    g.clear();

    // player (chunky orange character with eyes & feet)
    g.fillStyle(0xff7a3b); g.fillRoundedRect(14, 12, 36, 44, 10);
    g.fillStyle(0xffffff); g.fillCircle(24, 26, 6); g.fillCircle(40, 26, 6);
    g.fillStyle(0x000000); g.fillCircle(25, 27, 2.5); g.fillCircle(41, 27, 2.5);
    g.fillStyle(0xd95a1f); g.fillRoundedRect(18, 50, 12, 8, 3);
    g.fillStyle(0xd95a1f); g.fillRoundedRect(34, 50, 12, 8, 3);
    g.generateTexture("player", SIZE, SIZE);
    g.clear();

    // bunny (white round body, ears, pink nose)
    g.fillStyle(0xffffff); g.fillCircle(32, 38, 18);
    g.fillStyle(0xffffff); g.fillRoundedRect(20, 12, 8, 20, 4);
    g.fillStyle(0xffffff); g.fillRoundedRect(36, 12, 8, 20, 4);
    g.fillStyle(0xffb6c1); g.fillRoundedRect(22, 16, 4, 12, 2);
    g.fillStyle(0xffb6c1); g.fillRoundedRect(38, 16, 4, 12, 2);
    g.fillStyle(0x000000); g.fillCircle(26, 36, 2.5); g.fillCircle(38, 36, 2.5);
    g.fillStyle(0xff8aa1); g.fillCircle(32, 42, 2.5);
    g.generateTexture("bunny", SIZE, SIZE);
    g.clear();

    // frog (green round body, big eyes)
    g.fillStyle(0x4ab84a); g.fillCircle(32, 38, 20);
    g.fillStyle(0xffffff); g.fillCircle(22, 22, 8); g.fillCircle(42, 22, 8);
    g.fillStyle(0x000000); g.fillCircle(22, 22, 4); g.fillCircle(42, 22, 4);
    g.fillStyle(0x2d6b1e); g.fillRect(20, 42, 24, 3);
    g.generateTexture("frog", SIZE, SIZE);
    g.clear();

    g.destroy();
  }
}
