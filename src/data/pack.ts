/**
 * A self-contained zone: tile layout, puzzle placements, and tutorial.
 * Built-in zones live in src/data/packs/. The same shape will eventually
 * be loaded from URLs / localStorage / a level editor — anything that
 * produces JSON matching this interface drops into the game as a new zone.
 */
export interface ZonePack {
  id: string;
  name: string;
  width: number;
  height: number;
  spawn: { x: number; y: number };
  /**
   * Tile rows top-to-bottom. Each string is `width` chars long.
   * '.' = grass (walkable). 'T' = tree (obstacle).
   * Unknown chars are treated as grass.
   */
  tiles: string[];
  puzzles: PuzzlePlacement[];
  tutorial: TutorialStep[];
}

export interface PuzzlePlacement {
  id: string;
  type: string;
  tile: { x: number; y: number };
  /** Texture key for the sprite shown on the tile. */
  texture: string;
  /** Plugin-specific config; shape depends on the plugin. */
  config: Record<string, unknown>;
  /**
   * Visual scale relative to one tile. Default 1. Values >1 render bigger
   * (e.g. ice cream truck at 2). Collision is always one tile.
   */
  displayScale?: number;
}

export type TutorialTrigger =
  | { event: "input" }
  | { event: "puzzle-bumped"; puzzleId: string }
  | { event: "puzzle-entered"; puzzleId: string }
  | { event: "puzzle-completed"; puzzleId: string };

export type HintSpec = { kind: "pulse-puzzle"; puzzleId: string };

export interface TutorialStep {
  id: string;
  prompt: string;
  hint?: HintSpec;
  completeOn: TutorialTrigger;
}
