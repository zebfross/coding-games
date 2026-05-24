import Phaser from "phaser";
import { input, DIR_VEC, type Direction } from "../systems/input";
import { World, TILE } from "../scenes/World";

const STEP_DURATION = 150;

export class Player extends Phaser.GameObjects.Sprite {
  tileX: number;
  tileY: number;
  facing: Direction = "down";
  private busy = false;
  private world: World;

  constructor(world: World, tileX: number, tileY: number) {
    const { px, py } = world.tileToPixel(tileX, tileY);
    super(world, px, py, "player");
    this.world = world;
    this.tileX = tileX;
    this.tileY = tileY;
    this.setDisplaySize(TILE, TILE);
    world.add.existing(this);

    input.on("step", this.handleStep);
  }

  override destroy(fromScene?: boolean) {
    input.off("step", this.handleStep);
    super.destroy(fromScene);
  }

  private handleStep = (dir: Direction) => {
    this.world.bus.emit("input", { dir });
    this.tryStep(dir);
  };

  private tryStep(dir: Direction) {
    if (this.busy) return;
    this.setFacing(dir);
    const { dx, dy } = DIR_VEC[dir];
    const tx = this.tileX + dx;
    const ty = this.tileY + dy;

    if (!this.world.isWalkable(tx, ty)) {
      this.world.bump(tx, ty, dir);
      return;
    }

    this.tileX = tx;
    this.tileY = ty;
    this.busy = true;
    const { px, py } = this.world.tileToPixel(tx, ty);
    this.scene.tweens.add({
      targets: this,
      x: px,
      y: py,
      duration: STEP_DURATION,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.busy = false;
        this.world.onPlayerEnter(tx, ty);
      }
    });
  }

  private setFacing(dir: Direction) {
    this.facing = dir;
    if (dir === "left") this.setFlipX(true);
    else if (dir === "right") this.setFlipX(false);
  }
}
