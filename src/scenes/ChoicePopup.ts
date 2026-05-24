import Phaser from "phaser";
import { audio } from "../systems/audio";
import type { ChoiceConfig, ChoiceOption } from "../puzzles/choice";

interface InitData {
  config: ChoiceConfig;
  onClose: () => void;
}

const OPTION_BUTTON_R = 96;
const OPTION_SPACING = 240;

export class ChoicePopup extends Phaser.Scene {
  private onClose: (() => void) | null = null;
  private locked = false;

  constructor() { super("ChoicePopup"); }

  init(data: InitData) {
    this.onClose = data.onClose;
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
  }

  create(data: InitData) {
    const { width, height } = this.scale;

    // dim backdrop that swallows taps so the world doesn't get them
    this.add.rectangle(0, 0, width, height, 0x000000, 0.55)
      .setOrigin(0)
      .setInteractive();

    this.add.text(width / 2, 80, data.config.prompt, {
      fontFamily: "system-ui, sans-serif",
      fontSize: "44px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    audio.say(data.config.prompt);

    const opts = data.config.options;
    const startX = width / 2 - ((opts.length - 1) * OPTION_SPACING) / 2;
    const y = height / 2 + 20;

    opts.forEach((opt, i) => {
      const x = startX + i * OPTION_SPACING;
      this.buildOption(x, y, opt);
    });

    this.input.keyboard?.on("keydown-ESC", () => this.close());
  }

  private buildOption(x: number, y: number, opt: ChoiceOption) {
    const bg = this.add.circle(x, y, OPTION_BUTTON_R, 0xffffff, 0.95)
      .setStrokeStyle(6, 0x1c8a3a);
    const sprite = this.add.sprite(x, y, opt.texture)
      .setDisplaySize(OPTION_BUTTON_R * 1.5, OPTION_BUTTON_R * 1.5);

    bg.setInteractive({ useHandCursor: true });
    bg.on("pointerdown", () => this.pick(opt, sprite));
    sprite.setInteractive({ useHandCursor: true });
    sprite.on("pointerdown", () => this.pick(opt, sprite));
  }

  private pick(opt: ChoiceOption, sprite: Phaser.GameObjects.Sprite) {
    if (this.locked) return;
    this.locked = true;
    audio.say(opt.speech);

    // celebratory bounce on the chosen sprite, then close
    const baseX = sprite.scaleX;
    const baseY = sprite.scaleY;
    this.tweens.add({
      targets: sprite,
      scaleX: baseX * 1.3,
      scaleY: baseY * 1.3,
      duration: 200,
      yoyo: true,
      repeat: 1,
      ease: "Quad.easeOut"
    });
    this.time.delayedCall(1100, () => this.close());
  }

  private close() {
    this.onClose?.();
    this.scene.stop();
  }
}
