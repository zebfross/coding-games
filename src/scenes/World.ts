import Phaser from "phaser";
import { Player } from "../entities/Player";
import { puzzles as allPuzzles, type PuzzlePlacement } from "../data/puzzles";
import { getPlugin } from "../puzzles/registry";
import type { PuzzleContext, PuzzlePlugin } from "../puzzles/types";
import type { Direction } from "../systems/input";

export const TILE = 64;
const MAP_W = 24;
const MAP_H = 16;

type TileType = "grass" | "tree";

interface PlacedPuzzle {
  placement: PuzzlePlacement;
  plugin: PuzzlePlugin<any>;
  context: PuzzleContext<any>;
  complete: boolean;
}

export class World extends Phaser.Scene {
  private tiles: TileType[][] = [];
  private placedPuzzles = new Map<string, PlacedPuzzle>();
  private player!: Player;

  constructor() { super("World"); }

  create() {
    this.buildMap();
    this.placePuzzlesForZone("forest");

    this.player = new Player(this, Math.floor(MAP_W / 2), Math.floor(MAP_H / 2));

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setZoom(1.5);
  }

  tileToPixel(x: number, y: number) {
    return { px: x * TILE + TILE / 2, py: y * TILE + TILE / 2 };
  }

  isWalkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return false;
    if (this.tiles[y]?.[x] === "tree") return false;
    const puzzle = this.puzzleAt(x, y);
    if (puzzle && !(puzzle.plugin.walkable ?? false)) return false;
    return true;
  }

  bump(x: number, y: number, from: Direction): void {
    const puzzle = this.puzzleAt(x, y);
    if (puzzle && puzzle.plugin.onBump) {
      puzzle.plugin.onBump(puzzle.context, from);
    }
  }

  onPlayerEnter(x: number, y: number): void {
    const puzzle = this.puzzleAt(x, y);
    if (puzzle && puzzle.plugin.onEnter) {
      // Direction the player came from is unknown here; pass facing later if needed.
      puzzle.plugin.onEnter(puzzle.context, this.player.facing);
    }
  }

  private puzzleAt(x: number, y: number): PlacedPuzzle | undefined {
    return this.placedPuzzles.get(`${x},${y}`);
  }

  private buildMap() {
    this.tiles = [];
    for (let y = 0; y < MAP_H; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < MAP_W; x++) {
        row.push("grass");
      }
      this.tiles.push(row);
    }

    // border of trees
    for (let x = 0; x < MAP_W; x++) {
      this.tiles[0]![x] = "tree";
      this.tiles[MAP_H - 1]![x] = "tree";
    }
    for (let y = 0; y < MAP_H; y++) {
      this.tiles[y]![0] = "tree";
      this.tiles[y]![MAP_W - 1] = "tree";
    }

    // a few interior trees for character
    const interior: Array<[number, number]> = [
      [5, 4], [6, 4], [15, 3], [9, 11], [3, 10], [20, 11], [16, 13]
    ];
    for (const [tx, ty] of interior) {
      this.tiles[ty]![tx] = "tree";
    }

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const { px, py } = this.tileToPixel(x, y);
        this.add.image(px, py, "grass");
        if (this.tiles[y]![x] === "tree") {
          this.add.image(px, py, "tree");
        }
      }
    }
  }

  private placePuzzlesForZone(zone: string) {
    const placements = allPuzzles.filter(p => p.zone === zone);
    for (const placement of placements) {
      const plugin = getPlugin(placement.type);
      if (!plugin) {
        console.warn(`Unknown puzzle type "${placement.type}" for placement "${placement.id}"`);
        continue;
      }
      const { px, py } = this.tileToPixel(placement.tile.x, placement.tile.y);
      const sprite = this.add.sprite(px, py, placement.texture);

      const placed: PlacedPuzzle = {
        placement,
        plugin,
        complete: false,
        context: {
          world: this,
          scene: this,
          tile: { ...placement.tile },
          sprite,
          config: placement.config,
          markComplete: () => { placed.complete = true; }
        }
      };
      this.placedPuzzles.set(`${placement.tile.x},${placement.tile.y}`, placed);
      plugin.install?.(placed.context);
    }
  }
}
