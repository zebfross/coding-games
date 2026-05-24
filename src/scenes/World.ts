import Phaser from "phaser";
import { Player } from "../entities/Player";

const TILE = 48;
const MAP_W = 30;
const MAP_H = 20;

export class World extends Phaser.Scene {
  private player!: Player;

  constructor() { super("World"); }

  create() {
    // grass background
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        this.add.image(x * TILE + TILE / 2, y * TILE + TILE / 2, "grass");
      }
    }

    // scattered trees act as obstacles
    const trees = this.physics.add.staticGroup();
    const treePositions: Array<[number, number]> = [
      [3, 3], [4, 3], [5, 3],
      [10, 6], [11, 7], [12, 6],
      [15, 12], [16, 12], [17, 13],
      [22, 4], [23, 5],
      [25, 14], [26, 15],
      [7, 16], [8, 16]
    ];
    for (const [tx, ty] of treePositions) {
      const t = trees.create(tx * TILE + TILE / 2, ty * TILE + TILE / 2, "tree") as Phaser.Physics.Arcade.Sprite;
      if (t.body) (t.body as Phaser.Physics.Arcade.StaticBody).setSize(32, 24).setOffset(8, 20);
    }

    this.physics.world.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);

    this.player = new Player(this, (MAP_W * TILE) / 2, (MAP_H * TILE) / 2);
    this.physics.add.collider(this.player, trees);

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }
}
