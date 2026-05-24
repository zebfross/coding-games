const KEY = "coding-games.progress.v1";

export interface Progress {
  unlockedZones: string[];
  completedPuzzles: string[];
  lastPosition?: { zone: string; x: number; y: number };
}

const DEFAULT: Progress = {
  unlockedZones: ["forest"],
  completedPuzzles: []
};

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function save(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // localStorage may be unavailable in private mode
  }
}

export function reset(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
