import Phaser from "phaser";
import { audio } from "../systems/audio";
import { input, type Direction } from "../systems/input";

interface InitData {
  onClose: () => void;
}

const ROAD_SCROLL_PX_PER_FRAME = 5;
const TRAFFIC_SPEED_PX_PER_FRAME = 7;
const SPAWN_INTERVAL_MS = 1500;
const PLAYER_X = 180;
const CAR_DISPLAY = 110;
const COLLISION_COOLDOWN_MS = 900;
/** Car sprites have ~20% transparent padding in their PNGs and we want
 *  collision to feel forgiving for a 3yo, so use ~60% of the display size. */
const HITBOX_RATIO = 0.6;

function carHitbox(car: Phaser.GameObjects.Sprite, out: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
  const w = car.displayWidth * HITBOX_RATIO;
  const h = car.displayHeight * HITBOX_RATIO;
  out.setTo(car.x - w / 2, car.y - h / 2, w, h);
  return out;
}

export class DrivingGame extends Phaser.Scene {
  private onClose: (() => void) | null = null;
  private roadTile!: Phaser.GameObjects.TileSprite;
  private playerCar!: Phaser.GameObjects.Sprite;
  private laneIndex = 1;
  private laneYs: number[] = [];
  private traffic: Phaser.GameObjects.Sprite[] = [];
  private spawnTimer = 0;
  private collisionCooldown = 0;
  private stepHandler: ((dir: Direction) => void) | null = null;
  // Reused per-frame to avoid per-tick allocations
  private playerBox = new Phaser.Geom.Rectangle();
  private trafficBox = new Phaser.Geom.Rectangle();

  constructor() { super("DrivingGame"); }

  init() {
    this.laneIndex = 1;
    this.traffic = [];
    this.spawnTimer = 0;
    this.collisionCooldown = 0;
  }

  create(data: InitData) {
    this.onClose = data.onClose;
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#7ac74f");

    // Road fills the middle band of the screen. Native art ~280 tall; we
    // display it taller so it dominates the view.
    const roadDisplayH = Math.min(420, height * 0.65);
    this.roadTile = this.add.tileSprite(width / 2, height / 2, width, roadDisplayH, "road");

    // Two lanes on the road, above and below the dashed center line.
    // The road art has grass borders eating ~15% top/bottom, so lanes
    // sit ~15% off-center.
    const laneOffset = roadDisplayH * 0.18;
    this.laneYs = [height / 2 - laneOffset, height / 2 + laneOffset];

    this.playerCar = this.add.sprite(PLAYER_X, this.laneYs[this.laneIndex]!, "car-red")
      .setDisplaySize(CAR_DISPLAY, CAR_DISPLAY);

    this.add.text(width / 2, 56, "Dodge the cars!", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "36px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5
    }).setOrigin(0.5);

    // Exit button (top-right)
    const exitX = width - 70;
    const exitY = 70;
    const exitBg = this.add.circle(exitX, exitY, 36, 0xc0392b, 0.95)
      .setStrokeStyle(5, 0xffffff)
      .setInteractive({ useHandCursor: true });
    this.add.text(exitX, exitY, "✕", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "40px",
      color: "#ffffff"
    }).setOrigin(0.5);
    exitBg.on("pointerdown", () => this.close());

    const kb = this.input.keyboard;
    kb?.on("keydown-ESC", () => this.close());

    this.stepHandler = (dir: Direction) => {
      if (dir === "up") this.changeLane(-1);
      else if (dir === "down") this.changeLane(1);
    };
    input.on("step", this.stepHandler);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.stepHandler) input.off("step", this.stepHandler);
      this.stepHandler = null;
    });
  }

  override update(_time: number, delta: number) {
    const dt = delta / 16;

    this.roadTile.tilePositionX += ROAD_SCROLL_PX_PER_FRAME * dt;

    this.spawnTimer += delta;
    if (this.spawnTimer >= SPAWN_INTERVAL_MS) {
      this.spawnTimer = 0;
      this.spawnTraffic();
    }

    if (this.collisionCooldown > 0) this.collisionCooldown -= delta;

    const playerBox = carHitbox(this.playerCar, this.playerBox);
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i]!;
      car.x -= TRAFFIC_SPEED_PX_PER_FRAME * dt;

      if (car.x < -120) {
        car.destroy();
        this.traffic.splice(i, 1);
        continue;
      }

      if (this.collisionCooldown <= 0 &&
          Phaser.Geom.Rectangle.Overlaps(playerBox, carHitbox(car, this.trafficBox))) {
        this.collisionCooldown = COLLISION_COOLDOWN_MS;
        this.cameras.main.shake(180, 0.006);
        audio.say("Honk!");
        this.tweens.add({
          targets: this.playerCar,
          alpha: { from: 1, to: 0.3 },
          duration: 120,
          yoyo: true,
          repeat: 3
        });
      }
    }
  }

  private changeLane(delta: number) {
    const next = Phaser.Math.Clamp(this.laneIndex + delta, 0, this.laneYs.length - 1);
    if (next === this.laneIndex) return;
    this.laneIndex = next;
    this.tweens.add({
      targets: this.playerCar,
      y: this.laneYs[this.laneIndex]!,
      duration: 160,
      ease: "Quad.easeOut"
    });
  }

  private spawnTraffic() {
    const lane = Phaser.Math.Between(0, this.laneYs.length - 1);
    const texture = Phaser.Math.RND.pick(["car-blue", "car-yellow"]);
    const car = this.add.sprite(this.scale.width + 100, this.laneYs[lane]!, texture)
      .setDisplaySize(CAR_DISPLAY, CAR_DISPLAY);
    this.traffic.push(car);
  }

  private close() {
    this.onClose?.();
    this.scene.stop();
  }
}
