import Phaser from "phaser";
import { input, type Direction } from "../systems/input";
import { getPlugin } from "../puzzles/registry";
import type { NestedPuzzle } from "../puzzles/house";
import type { World } from "./World";

interface InitData {
  contains: NestedPuzzle;
  onClose: () => void;
}

/** Base on-screen pixel size for the inner item before displayScale. */
const INNER_BASE_PX = 240;

/**
 * The view shown when the player bumps a house in the world. Full-bleed
 * cabin background with the contained puzzle's item sitting on the rug.
 *
 * Any input — tap the item, press SPACE/ENTER, or push any direction —
 * runs the nested plugin's onBump as if the player had bumped it in the
 * world. Tap the door button or press ESC to return to the world.
 *
 * This scene doesn't have grid movement: the toddler walked into the
 * house, so the "go-bump-the-thing" loop already finished. Inside is a
 * single-tap interaction so we don't reintroduce navigation friction.
 */
export class HouseInterior extends Phaser.Scene {
  private onClose: (() => void) | null = null;
  private contains!: NestedPuzzle;
  private innerSprite!: Phaser.GameObjects.Sprite;
  private stepHandler: ((dir: Direction) => void) | null = null;

  constructor() { super("HouseInterior"); }

  init(data: InitData) {
    this.onClose = data.onClose;
    this.contains = data.contains;
  }

  create() {
    const { width, height } = this.scale;

    // Cover-fit cabin background — the rug sits a little below center
    const bg = this.add.image(width / 2, height / 2, "house-interior");
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);

    // The contained puzzle's item, centered higher so it doesn't crowd
    // the exit pill at the bottom of the screen
    const scale = this.contains.displayScale ?? 1;
    const size = INNER_BASE_PX * scale;
    const itemX = width / 2;
    const itemY = height * 0.5;
    this.innerSprite = this.add.sprite(itemX, itemY, this.contains.texture)
      .setDisplaySize(size, size)
      .setInteractive({ useHandCursor: true });
    // baseScale data is used by causeEffect's bounce + hints.pulse so the
    // sprite returns to its true display size after any tween.
    this.innerSprite.setData("baseScaleX", this.innerSprite.scaleX);
    this.innerSprite.setData("baseScaleY", this.innerSprite.scaleY);
    this.innerSprite.on("pointerdown", () => this.triggerInner());

    this.buildBackPill();
    this.wireKeyboard();

    // D-pad input: DOWN exits (toward the camera, the way you came in);
    // any other direction counts as a "bump" on the inner item.
    this.stepHandler = (dir) => {
      if (dir === "down") this.close();
      else this.triggerInner();
    };
    input.on("step", this.stepHandler);

    // Quick fade-in so the cabin doesn't snap in after the World pause
    this.cameras.main.fadeIn(180, 0, 0, 0);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.stepHandler) input.off("step", this.stepHandler);
      this.stepHandler = null;
    });
  }

  /**
   * Big bottom-center "🚪 Back" pill — primary exit target. Sized for
   * thumb-tap on a tablet held by a 3yo. Down-arrow / ESC also work.
   */
  private buildBackPill() {
    const { width, height } = this.scale;
    const pillW = 300;
    const pillH = 84;
    const x = width / 2;
    const y = height - 70;

    const bg = this.add.rectangle(x, y, pillW, pillH, 0x1c8a3a, 0.95)
      .setStrokeStyle(6, 0xffffff)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, "🚪 Back", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "40px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    bg.on("pointerdown", () => this.close());
  }

  private wireKeyboard() {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on("keydown-SPACE",     () => this.triggerInner());
    kb.on("keydown-ENTER",     () => this.triggerInner());
    // ESC / BACKSPACE retained as keyboard fallbacks; primary exit is
    // the back pill or DOWN arrow
    kb.on("keydown-ESC",       () => this.close());
    kb.on("keydown-BACKSPACE", () => this.close());
  }

  private triggerInner() {
    const plugin = getPlugin(this.contains.type);
    if (!plugin?.onBump) return;
    // Construct a PuzzleContext that points at this scene + this sprite.
    // Built-in plugins (cause-effect, choice, driving) all key off
    // ctx.scene / ctx.sprite / ctx.config; ctx.world is included for
    // forward compatibility with plugins that might walk back to the map.
    const world = this.scene.get("World") as World;
    plugin.onBump({
      world,
      scene: this,
      tile: { x: 0, y: 0 },
      sprite: this.innerSprite,
      config: this.contains.config,
      markComplete: () => { /* houses don't mark inner completion */ }
    }, "up");
  }

  private close() {
    this.onClose?.();
    this.scene.stop();
  }
}
