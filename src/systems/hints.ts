import Phaser from "phaser";
import type { World } from "../scenes/World";

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
    this.tween = this.world.tweens.add({
      targets: this.target,
      scaleX: 1.18,
      scaleY: 1.18,
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
      this.target.setScale(1);
      this.target = null;
    }
  }
}

export const hints = new HintSystem();
