const KEY = "coding-games.progress.v1";

export interface Progress {
  unlockedZones: string[];
  completedPuzzles: string[];
  tutorialProgress: Record<string, number>;
  lastPosition?: { zone: string; x: number; y: number };
}

const DEFAULT: Progress = {
  unlockedZones: ["forest"],
  completedPuzzles: [],
  tutorialProgress: {}
};

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...structuredClone(DEFAULT), ...parsed };
  } catch {
    return structuredClone(DEFAULT);
  }
}

export function save(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // localStorage may be unavailable (private mode, quota)
  }
}

export function reset(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
