import type { PuzzlePlugin } from "./types";
import { causeEffect } from "./causeEffect";

const plugins = new Map<string, PuzzlePlugin<any>>();

export function register<T>(plugin: PuzzlePlugin<T>): void {
  if (plugins.has(plugin.type)) {
    console.warn(`Puzzle plugin "${plugin.type}" registered twice`);
  }
  plugins.set(plugin.type, plugin as PuzzlePlugin<any>);
}

export function getPlugin(type: string): PuzzlePlugin<any> | undefined {
  return plugins.get(type);
}

// Built-in plugins. To add a new puzzle type:
//   1. Drop a file in src/puzzles/
//   2. Import + register it here
//   3. Reference its type from src/data/puzzles.ts
register(causeEffect);
