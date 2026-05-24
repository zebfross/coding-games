export type PuzzleType =
  | "cause-effect"
  | "move-to-target"
  | "sequence"
  | "repetition"
  | "matching"
  | "planning";

export interface PuzzleDef {
  id: string;
  type: PuzzleType;
  zone: string;
  location: { x: number; y: number };
  prompt: { voice: string; icon?: string };
  reward?: { sfx?: string; animation?: string };
  unlocks?: string[];
}

export const puzzles: PuzzleDef[] = [];
