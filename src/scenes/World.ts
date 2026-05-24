import Phaser from "phaser";
import { Player } from "../entities/Player";
import { puzzles as allPuzzles, type PuzzlePlacement } from "../data/puzzles";
import { getPlugin } from "../puzzles/registry";
import type { PuzzleContext, PuzzlePlugin } from "../puzzles/types";
import type { Direction } from "../systems/input";
import { tutorial } from "../systems/tutorial";
import { hints } from "../systems/hints";

export const TILE = 64;
const MAP_W = 40;
const MAP_H = 24;

type TileType = "grass" | "tree";

interface PlacedPuzzle {
  placement: PuzzlePlacement;
  plugin: PuzzlePlugin<any>;
  context: PuzzleContext<any>;
  complete: boolean;
}

export class World extends Phaser.Scene {
  readonly bus = new Phaser.Events.EventEmitter();
  private tiles: TileType[][] = [];
  private placedPuzzles = new Map<string, PlacedPuzzle>();
  player!: Player;

  constructor() { super("World"); }

  create() {
    this.buildMap();
    this.placePuzzlesForZone("forest");

    this.player = new Player(this, 20, 12);

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setZoom(1.5);

    hints.start(this);
    tutorial.start(this, "forest");

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      tutorial.stop();
      hints.stop();
      this.bus.removeAllListeners();
    });
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
    if (puzzle?.plugin.onBump) {
      puzzle.plugin.onBump(puzzle.context, from);
    }
    if (puzzle) this.bus.emit("puzzle-bumped", { id: puzzle.placement.id });
  }

  onPlayerEnter(x: number, y: number): void {
    const puzzle = this.puzzleAt(x, y);
    if (puzzle?.plugin.onEnter) {
      puzzle.plugin.onEnter(puzzle.context, this.player.facing);
    }
    if (puzzle) this.bus.emit("puzzle-entered", { id: puzzle.placement.id });
  }

  getPuzzleById(id: string): PlacedPuzzle | undefined {
    for (const p of this.placedPuzzles.values()) {
      if (p.placement.id === id) return p;
    }
    return undefined;
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

    // Tree clusters create natural "rooms" / clearings between them.
    // Clearings (kept empty for puzzles): NW, NE, center, SW, SE.
    const interior: Array<[number, number]> = [
      // Vertical band roughly down the middle, splitting NW from NE
      [13, 3], [14, 3], [13, 4], [14, 5], [13, 6],
      [25, 2], [25, 3], [26, 3], [25, 4], [26, 5],
      // Horizontal band roughly across the middle, splitting top from bottom
      [4, 11], [5, 11], [6, 12], [10, 11], [11, 12],
      [29, 11], [30, 12], [31, 11], [34, 12], [35, 11],
      // Bottom-half dividers (between SW and center, SE and center)
      [13, 17], [14, 18], [13, 19],
      [26, 17], [25, 18], [26, 19],
      // Scattered accents
      [8, 6], [33, 7], [3, 4], [37, 4],
      [7, 20], [33, 20], [20, 21], [20, 2]
    ];
    for (const [tx, ty] of interior) {
      if (this.tiles[ty]?.[tx] !== undefined) this.tiles[ty]![tx] = "tree";
    }

    // one TileSprite for the whole grass ground (one draw call, native 256px texture
    // repeats every 4 tiles for natural variation)
    this.add.tileSprite(0, 0, MAP_W * TILE, MAP_H * TILE, "grass").setOrigin(0);

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (this.tiles[y]![x] !== "tree") continue;
        const { px, py } = this.tileToPixel(x, y);
        this.add.image(px, py, "tree").setDisplaySize(TILE, TILE);
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
      const scale = placement.displayScale ?? 1;
      const sprite = this.add.sprite(px, py, placement.texture)
        .setDisplaySize(TILE * scale, TILE * scale);
      sprite.setData("baseScaleX", sprite.scaleX);
      sprite.setData("baseScaleY", sprite.scaleY);

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
          markComplete: () => {
            placed.complete = true;
            this.bus.emit("puzzle-completed", { id: placement.id });
          }
        }
      };
      this.placedPuzzles.set(`${placement.tile.x},${placement.tile.y}`, placed);
      plugin.install?.(placed.context);
    }
  }
}
