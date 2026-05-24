import Phaser from "phaser";
import type { World } from "../scenes/World";
import type { Direction } from "../systems/input";

export interface PuzzleContext<TConfig = unknown> {
  world: World;
  scene: Phaser.Scene;
  tile: { x: number; y: number };
  sprite: Phaser.GameObjects.Sprite;
  config: TConfig;
  markComplete(): void;
}

export interface PuzzlePlugin<TConfig = unknown> {
  /** Unique type identifier, referenced by puzzle placements in data. */
  type: string;
  /** Can the player walk onto this tile? Defaults to false (it's an obstacle that triggers onBump). */
  walkable?: boolean;
  /** Called once when the puzzle is placed in the world. Use for setup / extra decorations. */
  install?(ctx: PuzzleContext<TConfig>): void;
  /** Called when the player tries to step onto a non-walkable puzzle tile. */
  onBump?(ctx: PuzzleContext<TConfig>, from: Direction): void;
  /** Called when the player steps onto a walkable puzzle tile. */
  onEnter?(ctx: PuzzleContext<TConfig>, from: Direction): void;
}
