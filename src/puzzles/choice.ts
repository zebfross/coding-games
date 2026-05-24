import { input } from "../systems/input";
import type { PuzzlePlugin } from "./types";

export interface ChoiceOption {
  /** Unique within this puzzle; useful for tracking which flavor was picked. */
  id: string;
  /** Texture key for the option's sprite. */
  texture: string;
  /** Spoken when the player picks this option. */
  speech: string;
}

export interface ChoiceConfig {
  /** Spoken when the popup opens — frames the question. */
  prompt: string;
  options: ChoiceOption[];
}

/**
 * Choice puzzle: walk into the thing, an overlay opens with N options.
 * The player picks one, hears the result, and the overlay closes.
 *
 * Pauses World while the popup is open and clears held inputs so the
 * player doesn't keep walking after the popup closes.
 */
export const choice: PuzzlePlugin<ChoiceConfig> = {
  type: "choice",
  walkable: false,
  onBump(ctx) {
    input.releaseAll();
    ctx.scene.scene.pause();
    ctx.scene.scene.launch("ChoicePopup", {
      config: ctx.config,
      onClose: () => {
        ctx.scene.scene.resume();
      }
    });
  }
};
