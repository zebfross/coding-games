import Phaser from "phaser";
import { input } from "../systems/input";

const SPEED = 180;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setSize(32, 32).setOffset(8, 12);
    }
  }

  override preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    const v = input.getVector();
    const len = Math.hypot(v.x, v.y);
    if (len === 0) {
      this.setVelocity(0, 0);
      return;
    }
    this.setVelocity((v.x / len) * SPEED, (v.y / len) * SPEED);
    if (v.x < 0) this.setFlipX(true);
    else if (v.x > 0) this.setFlipX(false);
  }
}
