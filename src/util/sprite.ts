import Phaser from "phaser";

/**
 * Returns the sprite's base scale (the scale at which it was placed in the world),
 * which World records via setData after calling setDisplaySize. Animations should
 * tween relative to this so they don't accidentally inflate after running once.
 */
export function getBaseScale(sprite: Phaser.GameObjects.Sprite): { x: number; y: number } {
  return {
    x: sprite.getData("baseScaleX") ?? sprite.scaleX,
    y: sprite.getData("baseScaleY") ?? sprite.scaleY
  };
}
