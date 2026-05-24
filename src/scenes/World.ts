import Phaser from "phaser";
import { Player } from "../entities/Player";
import type { PuzzlePlacement, ZonePack } from "../data/pack";
import { getDefaultPack } from "../data/packs";
import { getPlugin } from "../puzzles/registry";
import type { PuzzleContext, PuzzlePlugin } from "../puzzles/types";
import type { Direction } from "../systems/input";
import { tutorial } from "../systems/tutorial";
import { hints } from "../systems/hints";

export const TILE = 64;

type TileType = "grass" | "tree";

interface PlacedPuzzle {
  placement: PuzzlePlacement;
  plugin: PuzzlePlugin<any>;
  context: PuzzleContext<any>;
  complete: boolean;
}

export class World extends Phaser.Scene {
  readonly bus = new Phaser.Events.EventEmitter();
  pack!: ZonePack;
  private tiles: TileType[][] = [];
  private placedPuzzles = new Map<string, PlacedPuzzle>();
  player!: Player;

  constructor() { super("World"); }

  create(data?: { pack?: ZonePack }) {
    this.pack = data?.pack ?? getDefaultPack();
    this.placedPuzzles = new Map();

    this.buildMap();
    this.placePuzzles();

    this.player = new Player(this, this.pack.spawn.x, this.pack.spawn.y);

    const widthPx = this.pack.width * TILE;
    const heightPx = this.pack.height * TILE;
    this.cameras.main.setBounds(0, 0, widthPx, heightPx);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setZoom(1.5);

    hints.start(this);
    tutorial.start(this, this.pack.id, this.pack.tutorial);

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
    if (x < 0 || y < 0 || x >= this.pack.width || y >= this.pack.height) return false;
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
    const { width, height, tiles: rows } = this.pack;
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      const rowStr = rows[y] ?? "";
      const row: TileType[] = [];
      for (let x = 0; x < width; x++) {
        row.push(rowStr[x] === "T" ? "tree" : "grass");
      }
      this.tiles.push(row);
    }

    // One TileSprite for the grass ground — single draw call, native 256px
    // texture repeats every 4 tiles for natural variation
    this.add.tileSprite(0, 0, width * TILE, height * TILE, "grass").setOrigin(0);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.tiles[y]![x] !== "tree") continue;
        const { px, py } = this.tileToPixel(x, y);
        this.add.image(px, py, "tree").setDisplaySize(TILE, TILE);
      }
    }
  }

  private placePuzzles() {
    for (const placement of this.pack.puzzles) {
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
