import { input } from "../systems/input";
import type { PuzzlePlugin } from "./types";

/**
 * A puzzle nested inside a house. Shape mirrors PuzzlePlacement minus
 * the tile coords (the inside has no grid) and the id (the wrapping
 * house's id is what the tutorial / hint system tracks).
 */
export interface NestedPuzzle {
  /** Plugin type identifier — "cause-effect" | "choice" | "driving" | etc. */
  type: string;
  /** Texture key for the sprite shown inside the cabin. */
  texture: string;
  /** Visual scale relative to the on-tile default (~140px inside). Default 1. */
  displayScale?: number;
  /** Plugin-specific config — same shape the nested plugin's onBump expects. */
  config: Record<string, unknown>;
}

export interface HouseConfig {
  contains: NestedPuzzle;
}

/**
 * House: walk into it, the player slides onto the house tile (SMW-style
 * "walk onto the level icon"), then the door opens into an interior
 * scene where the actual puzzle lives.
 *
 * Pauses World while the interior is open and clears held inputs so
 * the player doesn't keep walking after the interior closes.
 */
export const house: PuzzlePlugin<HouseConfig> = {
  type: "house",
  walkable: false,
  onBump(ctx) {
    input.releaseAll();
    const player = ctx.world.player;
    // Slide the player onto the house tile (~150ms), settle briefly,
    // then open the interior. The settle delay gives the eye time to
    // register "yep, I'm at the door" before the scene transitions.
    player.moveTo(ctx.tile.x, ctx.tile.y, () => {
      ctx.scene.time.delayedCall(120, () => {
        ctx.scene.scene.pause();
        ctx.scene.scene.launch("HouseInterior", {
          contains: ctx.config.contains,
          onClose: () => ctx.scene.scene.resume()
        });
      });
    });
  }
};
