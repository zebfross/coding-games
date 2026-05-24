export interface ZoneDef {
  id: string;
  name: string;
  tilemap?: string;
  spawn: { x: number; y: number };
  puzzles: string[];
  unlocksAfter?: string;
}

export const zones: ZoneDef[] = [
  {
    id: "forest",
    name: "Forest",
    spawn: { x: 15, y: 10 },
    puzzles: []
  }
];
