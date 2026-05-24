import Phaser from "phaser";

export type Direction = "up" | "down" | "left" | "right";

export const DIR_VEC: Record<Direction, { dx: number; dy: number }> = {
  up:    { dx: 0,  dy: -1 },
  down:  { dx: 0,  dy: 1 },
  left:  { dx: -1, dy: 0 },
  right: { dx: 1,  dy: 0 }
};

const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 200;

class InputManager {
  private held = new Set<Direction>();
  private events = new Phaser.Events.EventEmitter();
  private repeatTimer: number | null = null;

  press(dir: Direction) {
    if (this.held.has(dir)) return;
    this.held.add(dir);
    this.events.emit("step", dir);
    this.scheduleRepeat(REPEAT_DELAY);
  }

  release(dir: Direction) {
    this.held.delete(dir);
    if (this.held.size === 0) this.clearRepeat();
  }

  releaseAll() {
    this.held.clear();
    this.clearRepeat();
  }

  getHeldDir(): Direction | null {
    for (const d of this.held) return d;
    return null;
  }

  on(event: "step", fn: (dir: Direction) => void): void { this.events.on(event, fn); }
  off(event: "step", fn: (dir: Direction) => void): void { this.events.off(event, fn); }

  private scheduleRepeat(delay: number) {
    this.clearRepeat();
    this.repeatTimer = window.setTimeout(() => this.tick(), delay);
  }

  private tick() {
    const dir = this.getHeldDir();
    if (!dir) return;
    this.events.emit("step", dir);
    this.scheduleRepeat(REPEAT_INTERVAL);
  }

  private clearRepeat() {
    if (this.repeatTimer !== null) {
      window.clearTimeout(this.repeatTimer);
      this.repeatTimer = null;
    }
  }
}

export const input = new InputManager();

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
