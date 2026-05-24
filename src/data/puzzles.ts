/**
 * Puzzle placements: where each puzzle instance lives in the world.
 * Behavior comes from the plugin matching `type` (see src/puzzles/registry.ts).
 */
export interface PuzzlePlacement {
  id: string;
  type: string;
  zone: string;
  tile: { x: number; y: number };
  /** Texture key for the sprite shown on the tile. */
  texture: string;
  /** Plugin-specific config; shape depends on the plugin. */
  config: Record<string, unknown>;
}

export const puzzles: PuzzlePlacement[] = [
  {
    id: "forest-bunny",
    type: "cause-effect",
    zone: "forest",
    tile: { x: 18, y: 8 },
    texture: "bunny",
    config: { speech: "Bunny!" }
  },
  {
    id: "forest-frog",
    type: "cause-effect",
    zone: "forest",
    tile: { x: 12, y: 14 },
    texture: "frog",
    config: { speech: "Ribbit! I'm a frog." }
  }
];
