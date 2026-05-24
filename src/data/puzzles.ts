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
  { id: "forest-bunny", type: "cause-effect", zone: "forest",
    tile: { x: 18, y: 8 },  texture: "bunny",
    config: { speech: "Bunny!" } },
  { id: "forest-frog", type: "cause-effect", zone: "forest",
    tile: { x: 12, y: 14 }, texture: "frog",
    config: { speech: "Frog! Ribbit!" } },
  { id: "forest-cat", type: "cause-effect", zone: "forest",
    tile: { x: 5, y: 7 },   texture: "cat",
    config: { speech: "Meow! I'm a cat." } },
  { id: "forest-dog", type: "cause-effect", zone: "forest",
    tile: { x: 21, y: 12 }, texture: "dog",
    config: { speech: "Woof! Hello puppy!" } },
  { id: "forest-cow", type: "cause-effect", zone: "forest",
    tile: { x: 8, y: 4 },   texture: "cow",
    config: { speech: "Moo! I'm a cow." } },
  { id: "forest-pig", type: "cause-effect", zone: "forest",
    tile: { x: 19, y: 5 },  texture: "pig",
    config: { speech: "Oink oink! Piggy!" } },
  { id: "forest-carrot", type: "cause-effect", zone: "forest",
    tile: { x: 4, y: 13 },  texture: "carrot",
    config: { speech: "A crunchy carrot!" } },
  { id: "forest-apple", type: "cause-effect", zone: "forest",
    tile: { x: 22, y: 8 },  texture: "apple",
    config: { speech: "A juicy apple!" } }
];
