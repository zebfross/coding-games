import Phaser from "phaser";

export type Direction = "up" | "down" | "left" | "right";

export const DIR_VEC: Record<Direction, { dx: number; dy: number }> = {
  up:    { dx: 0,  dy: -1 },
  down:  { dx: 0,  dy: 1 },
  left:  { dx: -1, dy: 0 },
  right: { dx: 1,  dy: 0 }
};

class InputManager {
  private held = new Set<Direction>();
  private events = new Phaser.Events.EventEmitter();

  press(dir: Direction) {
    // Ignore OS-level keyboard auto-repeat: one physical press = one step.
    if (this.held.has(dir)) return;
    this.held.add(dir);
    this.events.emit("step", dir);
  }

  release(dir: Direction) {
    this.held.delete(dir);
  }

  releaseAll() {
    this.held.clear();
  }

  on(event: "step", fn: (dir: Direction) => void): void { this.events.on(event, fn); }
  off(event: "step", fn: (dir: Direction) => void): void { this.events.off(event, fn); }
}

export const input = new InputManager();

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
