export type Direction = "up" | "down" | "left" | "right";

class InputManager {
  private pressed = new Set<Direction>();

  press(dir: Direction) { this.pressed.add(dir); }
  release(dir: Direction) { this.pressed.delete(dir); }
  releaseAll() { this.pressed.clear(); }

  isPressed(dir: Direction) { return this.pressed.has(dir); }

  getVector(): { x: number; y: number } {
    let x = 0, y = 0;
    if (this.pressed.has("left")) x -= 1;
    if (this.pressed.has("right")) x += 1;
    if (this.pressed.has("up")) y -= 1;
    if (this.pressed.has("down")) y += 1;
    return { x, y };
  }
}

export const input = new InputManager();

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
