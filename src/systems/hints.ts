import Phaser from "phaser";
import type { World } from "../scenes/World";

const PULSE_FACTOR = 1.18;

class HintSystem {
  private world: World | null = null;
  private tween: Phaser.Tweens.Tween | null = null;
  private target: Phaser.GameObjects.Sprite | null = null;
  private baseScaleX = 1;
  private baseScaleY = 1;

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
    this.baseScaleX = this.target.scaleX;
    this.baseScaleY = this.target.scaleY;
    this.tween = this.world.tweens.add({
      targets: this.target,
      scaleX: this.baseScaleX * PULSE_FACTOR,
      scaleY: this.baseScaleY * PULSE_FACTOR,
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
      this.target.setScale(this.baseScaleX, this.baseScaleY);
      this.target = null;
    }
  }
}

export const hints = new HintSystem();
