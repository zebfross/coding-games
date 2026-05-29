import type { ZonePack } from "../pack";

/**
 * Every puzzle in the forest lives inside a little house. The toddler
 * walks up to a house (the `house` plugin's onBump opens the door into
 * a HouseInterior scene) and discovers what's inside — bunny, ice cream
 * truck, driving car, etc. The wrapper puzzle keeps the same `id` the
 * tutorial / hints know about, so "Walk to the bunny" pulses the
 * bunny-house and completes when the toddler bumps it.
 *
 * House textures alternate between `house-1` (large mushroom-roof cabin)
 * and `house-2` (small cozy cabin) for visual variety across the map.
 */
export const forestPack: ZonePack = {
  id: "forest",
  name: "Forest",
  width: 40,
  height: 24,
  spawn: { x: 20, y: 12 },

  // 40 chars per row, 24 rows. '.' = grass, 'T' = tree.
  // Tree clusters divide the map into NW / NE / center / SW / SE clearings.
  tiles: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "T......................................T",
    "T...................T....T.............T",
    "T............TT..........TT............T",
    "T..T.........T...........T...........T.T",
    "T.............T...........T............T",
    "T.......T....T.........................T",
    "T................................T.....T",
    "T......................................T",
    "T......................................T",
    "T......................................T",
    "T...TT....T..................T.T...T...T",
    "T.....T....T..................T...T....T",
    "T......................................T",
    "T......................................T",
    "T......................................T",
    "T......................................T",
    "T............T............T............T",
    "T.............T..........T.............T",
    "T............T............T............T",
    "T......T.........................T.....T",
    "T...................T..................T",
    "T......................................T",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
  ],

  puzzles: [
    // NW clearing
    { id: "forest-bunny", type: "house",
      tile: { x: 6, y: 5 },  texture: "house-1", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "bunny",
          config: { speech: "Bunny!" } }
      } },
    { id: "forest-cow", type: "house",
      tile: { x: 10, y: 7 }, texture: "house-2", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "cow",
          config: { speech: "Moo! I'm a cow." } }
      } },

    // NE clearing
    { id: "forest-cat", type: "house",
      tile: { x: 30, y: 5 }, texture: "house-1", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "cat",
          config: { speech: "Meow! I'm a cat." } }
      } },
    { id: "forest-pig", type: "house",
      tile: { x: 34, y: 7 }, texture: "house-2", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "pig",
          config: { speech: "Oink oink! Piggy!" } }
      } },

    // Far east: ice cream truck house
    { id: "forest-ice-cream-truck", type: "house",
      tile: { x: 37, y: 12 }, texture: "house-1", displayScale: 1.5,
      config: {
        contains: {
          type: "choice", texture: "ice-cream-truck", displayScale: 1.4,
          config: {
            prompt: "Pick a flavor!",
            options: [
              { id: "strawberry", texture: "flavor-strawberry", speech: "Strawberry! Sweet and pink." },
              { id: "vanilla",    texture: "flavor-vanilla",    speech: "Vanilla! Yum." },
              { id: "mint",       texture: "flavor-mint",       speech: "Mint! Cool and fresh." }
            ]
          }
        }
      } },

    // Far west: driving car house — mirrors the ice cream truck on the east
    { id: "forest-driving-car", type: "house",
      tile: { x: 2, y: 12 }, texture: "house-2", displayScale: 1.5,
      config: {
        contains: { type: "driving", texture: "car-red", displayScale: 1.2,
          config: {} }
      } },

    // SW clearing
    { id: "forest-frog", type: "house",
      tile: { x: 6, y: 17 },  texture: "house-1", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "frog",
          config: { speech: "Frog! Ribbit!" } }
      } },
    { id: "forest-carrot", type: "house",
      tile: { x: 10, y: 20 }, texture: "house-2", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "carrot",
          config: { speech: "A crunchy carrot!" } }
      } },

    // SE clearing
    { id: "forest-dog", type: "house",
      tile: { x: 30, y: 17 }, texture: "house-1", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "dog",
          config: { speech: "Woof! Hello puppy!" } }
      } },
    { id: "forest-apple", type: "house",
      tile: { x: 34, y: 20 }, texture: "house-2", displayScale: 1.5,
      config: {
        contains: { type: "cause-effect", texture: "apple",
          config: { speech: "A juicy apple!" } }
      } }
  ],

  tutorial: [
    {
      id: "first-move",
      prompt: "Press an arrow to move!",
      completeOn: { event: "input" }
    },
    {
      id: "find-bunny",
      prompt: "Walk to the bunny's house!",
      hint: { kind: "pulse-puzzle", puzzleId: "forest-bunny" },
      completeOn: { event: "puzzle-bumped", puzzleId: "forest-bunny" }
    },
    {
      id: "find-frog",
      prompt: "Now find the frog's house!",
      hint: { kind: "pulse-puzzle", puzzleId: "forest-frog" },
      completeOn: { event: "puzzle-bumped", puzzleId: "forest-frog" }
    },
    {
      id: "done",
      prompt: "Great job! Now explore the houses!",
      completeOn: { event: "input" }
    }
  ]
};
