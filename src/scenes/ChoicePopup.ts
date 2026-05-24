import Phaser from "phaser";
import { audio } from "../systems/audio";
import { input, type Direction } from "../systems/input";
import type { ChoiceConfig, ChoiceOption } from "../puzzles/choice";

interface InitData {
  config: ChoiceConfig;
  onClose: () => void;
}

const OPTION_BUTTON_R = 96;
const OPTION_SPACING = 240;
const FOCUS_SCALE = 1.12;

interface OptionView {
  option: ChoiceOption;
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Arc;
}

export class ChoicePopup extends Phaser.Scene {
  private onClose: (() => void) | null = null;
  private locked = false;
  private views: OptionView[] = [];
  private focusIndex = 0;
  private stepHandler: ((dir: Direction) => void) | null = null;

  constructor() { super("ChoicePopup"); }

  init(data: InitData) {
    this.onClose = data.onClose;
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
    this.views = [];
    this.focusIndex = 0;
    this.locked = false;
  }

  create(data: InitData) {
    const { width, height } = this.scale;

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
    opts.forEach((opt, i) => this.buildOption(startX + i * OPTION_SPACING, y, opt, i));

    this.setFocus(0);
    this.wireInput();
  }

  private buildOption(x: number, y: number, opt: ChoiceOption, index: number) {
    const container = this.add.container(x, y);
    const bg = this.add.circle(0, 0, OPTION_BUTTON_R, 0xffffff, 0.95)
      .setStrokeStyle(6, 0x1c8a3a);
    const sprite = this.add.sprite(0, 0, opt.texture)
      .setDisplaySize(OPTION_BUTTON_R * 1.5, OPTION_BUTTON_R * 1.5);
    container.add([bg, sprite]);

    bg.setInteractive({ useHandCursor: true });
    bg.on("pointerover", () => this.setFocus(index));
    bg.on("pointerdown", () => this.pickIndex(index));
    sprite.setInteractive({ useHandCursor: true });
    sprite.on("pointerdown", () => this.pickIndex(index));

    this.views.push({ option: opt, container, bg });
  }

  private wireInput() {
    // Directional input is already routed through the global `input` system
    // by HUD's keyboard listeners (and the on-screen d-pad), so listening to
    // step events handles both keyboard arrows and touch. Direct keyboard
    // handlers for arrows would double-fire and reverse the navigation.
    this.stepHandler = (dir: Direction) => {
      this.moveFocus(dir === "left" || dir === "up" ? -1 : 1);
    };
    input.on("step", this.stepHandler);

    const kb = this.input.keyboard;
    if (kb) {
      kb.on("keydown-SPACE", () => this.pickFocused());
      kb.on("keydown-ENTER", () => this.pickFocused());
      kb.on("keydown-ESC",   () => this.close());
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.stepHandler) input.off("step", this.stepHandler);
      this.stepHandler = null;
    });
  }

  private moveFocus(delta: number) {
    if (this.locked || this.views.length === 0) return;
    const n = this.views.length;
    this.setFocus((this.focusIndex + delta + n) % n);
  }

  private setFocus(index: number) {
    this.focusIndex = index;
    this.views.forEach((v, i) => {
      const focused = i === index;
      v.container.setScale(focused ? FOCUS_SCALE : 1);
      v.bg.setStrokeStyle(focused ? 10 : 6, focused ? 0xffd23f : 0x1c8a3a);
    });
  }

  private pickFocused() {
    if (this.locked) return;
    const view = this.views[this.focusIndex];
    if (view) this.pickIndex(this.focusIndex);
  }

  private pickIndex(index: number) {
    if (this.locked) return;
    const view = this.views[index];
    if (!view) return;
    this.locked = true;
    this.setFocus(index);
    audio.say(view.option.speech);

    const baseScale = FOCUS_SCALE;
    this.tweens.add({
      targets: view.container,
      scaleX: baseScale * 1.2,
      scaleY: baseScale * 1.2,
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
