import Phaser from "phaser";
import type { World } from "../scenes/World";
import { getBaseScale } from "../util/sprite";

const PULSE_FACTOR = 1.18;

class HintSystem {
  private world: World | null = null;
  private tween: Phaser.Tweens.Tween | null = null;
  private target: Phaser.GameObjects.Sprite | null = null;

  start(world: World) {
    this.stop();
    this.world = world;
  }

  stop() {
    this.clear();
    this.world = null;
  }

  pulse(puzzleId: string) {
    this.clear();
    if (!this.world) return;
    const puzzle = this.world.getPuzzleById(puzzleId);
    if (!puzzle) return;
    this.target = puzzle.context.sprite;
    const base = getBaseScale(this.target);
    this.world.tweens.killTweensOf(this.target);
    this.target.setScale(base.x, base.y);
    this.tween = this.world.tweens.add({
      targets: this.target,
      scaleX: base.x * PULSE_FACTOR,
      scaleY: base.y * PULSE_FACTOR,
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  clear() {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    if (this.target) {
      const base = getBaseScale(this.target);
      this.target.setScale(base.x, base.y);
      this.target = null;
    }
  }
}

export const hints = new HintSystem();
