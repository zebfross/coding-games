import type { ZonePack } from "../pack";

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
    { id: "forest-bunny", type: "cause-effect",
      tile: { x: 6, y: 5 },  texture: "bunny",
      config: { speech: "Bunny!" } },
    { id: "forest-cow", type: "cause-effect",
      tile: { x: 10, y: 7 }, texture: "cow",
      config: { speech: "Moo! I'm a cow." } },

    // NE clearing
    { id: "forest-cat", type: "cause-effect",
      tile: { x: 30, y: 5 }, texture: "cat",
      config: { speech: "Meow! I'm a cat." } },
    { id: "forest-pig", type: "cause-effect",
      tile: { x: 34, y: 7 }, texture: "pig",
      config: { speech: "Oink oink! Piggy!" } },

    // Far east edge: discovered after walking through the trees
    { id: "forest-ice-cream-truck", type: "choice",
      tile: { x: 37, y: 12 }, texture: "ice-cream-truck",
      displayScale: 2,
      config: {
        prompt: "Pick a flavor!",
        options: [
          { id: "strawberry", texture: "flavor-strawberry", speech: "Strawberry! Sweet and pink." },
          { id: "vanilla",    texture: "flavor-vanilla",    speech: "Vanilla! Yum." },
          { id: "mint",       texture: "flavor-mint",       speech: "Mint! Cool and fresh." }
        ]
      } },

    // SW clearing
    { id: "forest-frog", type: "cause-effect",
      tile: { x: 6, y: 17 },  texture: "frog",
      config: { speech: "Frog! Ribbit!" } },
    { id: "forest-carrot", type: "cause-effect",
      tile: { x: 10, y: 20 }, texture: "carrot",
      config: { speech: "A crunchy carrot!" } },

    // SE clearing
    { id: "forest-dog", type: "cause-effect",
      tile: { x: 30, y: 17 }, texture: "dog",
      config: { speech: "Woof! Hello puppy!" } },
    { id: "forest-apple", type: "cause-effect",
      tile: { x: 34, y: 20 }, texture: "apple",
      config: { speech: "A juicy apple!" } }
  ],

  tutorial: [
    {
      id: "first-move",
      prompt: "Press an arrow to move!",
      completeOn: { event: "input" }
    },
    {
      id: "find-bunny",
      prompt: "Walk to the bunny!",
      hint: { kind: "pulse-puzzle", puzzleId: "forest-bunny" },
      completeOn: { event: "puzzle-bumped", puzzleId: "forest-bunny" }
    },
    {
      id: "find-frog",
      prompt: "Now find the frog!",
      hint: { kind: "pulse-puzzle", puzzleId: "forest-frog" },
      completeOn: { event: "puzzle-bumped", puzzleId: "forest-frog" }
    },
    {
      id: "done",
      prompt: "Great job! Now explore!",
      completeOn: { event: "input" }
    }
  ]
};
