/**
 * Per-zone tutorial steps. The tutorial system plays each step in order,
 * persists the index, and never replays a completed step.
 *
 * To add a new step: append to the array. To reset for testing,
 * call `progress.reset()` in the browser console.
 */

export type TutorialTrigger =
  | { event: "input" }
  | { event: "puzzle-bumped"; puzzleId: string }
  | { event: "puzzle-entered"; puzzleId: string }
  | { event: "puzzle-completed"; puzzleId: string };

export type HintSpec =
  | { kind: "pulse-puzzle"; puzzleId: string };

export interface TutorialStep {
  id: string;
  prompt: string;
  hint?: HintSpec;
  completeOn: TutorialTrigger;
}

export const tutorials: Record<string, TutorialStep[]> = {
  forest: [
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
