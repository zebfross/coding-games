import { audio } from "../systems/audio";
import { getBaseScale } from "../util/sprite";
import type { PuzzlePlugin } from "./types";

export interface CauseEffectConfig {
  /** Spoken when the player bumps into this thing. */
  speech: string;
}

/**
 * Cause-effect: walk into a thing, it speaks and does a little dance.
 * Closest analog to a 3-year-old's letter-says-animal-name toy.
 */
export const causeEffect: PuzzlePlugin<CauseEffectConfig> = {
  type: "cause-effect",
  walkable: false,
  onBump(ctx) {
    audio.say(ctx.config.speech);
    const base = getBaseScale(ctx.sprite);
    // Kill any prior bounce/pulse so we always start from the true base scale
    ctx.scene.tweens.killTweensOf(ctx.sprite);
    ctx.sprite.setScale(base.x, base.y);
    ctx.scene.tweens.add({
      targets: ctx.sprite,
      scaleX: base.x * 1.25,
      scaleY: base.y * 1.25,
      yoyo: true,
      duration: 140,
      repeat: 1,
      ease: "Quad.easeOut",
      onComplete: () => ctx.sprite.setScale(base.x, base.y)
    });
  }
};
