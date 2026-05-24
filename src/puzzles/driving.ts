import { input } from "../systems/input";
import type { PuzzlePlugin } from "./types";

/**
 * Driving mini-game: walk into the car, the world pauses, and the
 * DrivingGame scene takes over. Player dodges oncoming traffic in lanes
 * using up/down arrows. Exits via the X button or ESC.
 */
export const driving: PuzzlePlugin<Record<string, never>> = {
  type: "driving",
  walkable: false,
  onBump(ctx) {
    input.releaseAll();
    ctx.scene.scene.pause();
    ctx.scene.scene.launch("DrivingGame", {
      onClose: () => ctx.scene.scene.resume()
    });
  }
};
