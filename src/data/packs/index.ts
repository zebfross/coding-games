import type { ZonePack } from "../pack";
import { forestPack } from "./forest";

/**
 * Built-in zone packs shipped with the game. External packs (URL-loaded,
 * localStorage, level editor output) consume the same ZonePack shape.
 */
const BUILTIN: Record<string, ZonePack> = {
  [forestPack.id]: forestPack
};

export const DEFAULT_PACK_ID = forestPack.id;

export function getPack(id: string): ZonePack | undefined {
  return BUILTIN[id];
}

export function getDefaultPack(): ZonePack {
  return forestPack;
}

export function listPacks(): ZonePack[] {
  return Object.values(BUILTIN);
}
