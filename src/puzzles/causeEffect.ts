import { audio } from "../systems/audio";
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
    ctx.scene.tweens.add({
      targets: ctx.sprite,
      scaleX: { from: 1, to: 1.25 },
      scaleY: { from: 1, to: 1.25 },
      yoyo: true,
      duration: 140,
      repeat: 1,
      ease: "Quad.easeOut"
    });
  }
};
