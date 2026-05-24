import Phaser from "phaser";
import { input, Direction, isTouchDevice } from "../systems/input";

const KEY_TO_DIR: Record<string, Direction> = {
  UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right",
  W: "up", S: "down", A: "left", D: "right"
};

export class HUD extends Phaser.Scene {
  private dpad: Phaser.GameObjects.Container | null = null;

  constructor() { super({ key: "HUD", active: false }); }

  create() {
    const kb = this.input.keyboard;
    if (kb) {
      for (const [keyName, dir] of Object.entries(KEY_TO_DIR)) {
        const key = kb.addKey(keyName);
        key.on("down", () => input.press(dir));
        key.on("up", () => input.release(dir));
      }
    }

    if (isTouchDevice()) this.buildDpad();

    window.addEventListener("blur", () => input.releaseAll());
    this.scale.on("resize", () => this.layoutDpad());
  }

  private buildDpad() {
    const c = this.add.container(0, 0);
    const R = 56;
    const offsets: Array<[number, number, string, Direction]> = [
      [0, -R * 1.3, "▲", "up"],
      [0, R * 1.3, "▼", "down"],
      [-R * 1.3, 0, "◀", "left"],
      [R * 1.3, 0, "▶", "right"]
    ];
    for (const [dx, dy, label, dir] of offsets) {
      const bg = this.add.circle(dx, dy, R, 0xffffff, 0.75).setStrokeStyle(4, 0x1c8a3a);
      const txt = this.add.text(dx, dy, label, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "44px",
        color: "#1c8a3a"
      }).setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerdown", () => input.press(dir));
      bg.on("pointerup", () => input.release(dir));
      bg.on("pointerout", () => input.release(dir));
      bg.on("pointerupoutside", () => input.release(dir));
      c.add([bg, txt]);
    }
    this.dpad = c;
    this.layoutDpad();
  }

  private layoutDpad() {
    if (!this.dpad) return;
    const pad = 140;
    this.dpad.setPosition(pad, this.scale.height - pad);
  }
}
