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
  // NW clearing
  { id: "forest-bunny", type: "cause-effect", zone: "forest",
    tile: { x: 6, y: 5 },  texture: "bunny",
    config: { speech: "Bunny!" } },
  { id: "forest-cow", type: "cause-effect", zone: "forest",
    tile: { x: 10, y: 7 }, texture: "cow",
    config: { speech: "Moo! I'm a cow." } },

  // NE clearing
  { id: "forest-cat", type: "cause-effect", zone: "forest",
    tile: { x: 30, y: 5 }, texture: "cat",
    config: { speech: "Meow! I'm a cat." } },
  { id: "forest-pig", type: "cause-effect", zone: "forest",
    tile: { x: 34, y: 7 }, texture: "pig",
    config: { speech: "Oink oink! Piggy!" } },

  // Far east edge: discovered after walking through the trees
  { id: "forest-ice-cream-truck", type: "choice", zone: "forest",
    tile: { x: 37, y: 12 }, texture: "ice-cream-truck",
    config: {
      prompt: "Pick a flavor!",
      options: [
        { id: "strawberry", texture: "flavor-strawberry", speech: "Strawberry! Sweet and pink." },
        { id: "vanilla",    texture: "flavor-vanilla",    speech: "Vanilla! Yum." },
        { id: "mint",       texture: "flavor-mint",       speech: "Mint! Cool and fresh." }
      ]
    } },

  // SW clearing
  { id: "forest-frog", type: "cause-effect", zone: "forest",
    tile: { x: 6, y: 17 },  texture: "frog",
    config: { speech: "Frog! Ribbit!" } },
  { id: "forest-carrot", type: "cause-effect", zone: "forest",
    tile: { x: 10, y: 20 }, texture: "carrot",
    config: { speech: "A crunchy carrot!" } },

  // SE clearing
  { id: "forest-dog", type: "cause-effect", zone: "forest",
    tile: { x: 30, y: 17 }, texture: "dog",
    config: { speech: "Woof! Hello puppy!" } },
  { id: "forest-apple", type: "cause-effect", zone: "forest",
    tile: { x: 34, y: 20 }, texture: "apple",
    config: { speech: "A juicy apple!" } }
];
