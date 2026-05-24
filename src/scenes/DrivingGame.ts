import Phaser from "phaser";
import { audio } from "../systems/audio";
import { input, type Direction } from "../systems/input";

interface InitData {
  onClose: () => void;
}

const ROAD_SCROLL_PX_PER_FRAME = 5;
const TRAFFIC_SPEED_PX_PER_FRAME = 7;
const SPAWN_INTERVAL_MS = 1500;
const PLAYER_X = 200;
const CAR_DISPLAY = 150;
const COLLISION_COOLDOWN_MS = 900;
const STARTING_HEARTS = 5;
/** Car sprites have ~15-20% transparent padding around the visible car shape;
 *  use 60% of display size for collision so it feels fair to a 3yo. */
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
  private hearts = STARTING_HEARTS;
  private heartIcons: Phaser.GameObjects.Text[] = [];
  private gameIsOver = false;
  private stepHandler: ((dir: Direction) => void) | null = null;
  private playerBox = new Phaser.Geom.Rectangle();
  private trafficBox = new Phaser.Geom.Rectangle();

  constructor() { super("DrivingGame"); }

  init() {
    this.laneIndex = 1;
    this.traffic = [];
    this.heartIcons = [];
    this.spawnTimer = 0;
    this.collisionCooldown = 0;
    this.hearts = STARTING_HEARTS;
    this.gameIsOver = false;
  }

  create(data: InitData) {
    this.onClose = data.onClose;
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#7ac74f");

    const roadDisplayH = Math.min(420, height * 0.65);
    this.roadTile = this.add.tileSprite(width / 2, height / 2, width, roadDisplayH, "road");

    const laneOffset = roadDisplayH * 0.18;
    this.laneYs = [height / 2 - laneOffset, height / 2 + laneOffset];

    // Player faces right (going right on the road); source art faces left, so flip.
    this.playerCar = this.add.sprite(PLAYER_X, this.laneYs[this.laneIndex]!, "car-red")
      .setDisplaySize(CAR_DISPLAY, CAR_DISPLAY)
      .setFlipX(true);

    this.add.text(width / 2, 56, "Dodge the cars!", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "36px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5
    }).setOrigin(0.5);

    this.buildHearts();
    this.buildExitButton();

    const kb = this.input.keyboard;
    kb?.on("keydown-ESC", () => this.close());

    this.stepHandler = (dir: Direction) => {
      if (this.gameIsOver) return;
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
    if (this.gameIsOver) return;
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
        this.onCollision();
      }
    }
  }

  private onCollision() {
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
    this.loseHeart();
  }

  private buildHearts() {
    const startX = 40;
    const y = 100;
    const spacing = 56;
    for (let i = 0; i < STARTING_HEARTS; i++) {
      const heart = this.add.text(startX + i * spacing, y, "♥", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "56px",
        color: "#e74c3c",
        stroke: "#000000",
        strokeThickness: 4
      }).setOrigin(0.5);
      this.heartIcons.push(heart);
    }
  }

  private loseHeart() {
    if (this.hearts <= 0) return;
    this.hearts -= 1;
    const icon = this.heartIcons[this.hearts];
    if (icon) {
      icon.setColor("#444444");
      this.tweens.add({
        targets: icon,
        scale: { from: 1.5, to: 1 },
        duration: 250,
        ease: "Back.easeOut"
      });
    }
    if (this.hearts === 0) this.triggerGameOver();
  }

  private triggerGameOver() {
    this.gameIsOver = true;
    audio.say("Game over!");
    // Freeze traffic in place visually — they keep their positions but stop moving
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setInteractive();
    this.add.text(width / 2, height / 2 - 120, "Game Over", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "84px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.makeButton(width / 2, height / 2 + 20, "Play Again", 0x1c8a3a, () => {
      this.scene.restart({ onClose: this.onClose });
    });
    this.makeButton(width / 2, height / 2 + 130, "Quit", 0xc0392b, () => this.close());
  }

  private makeButton(x: number, y: number, label: string, color: number, onClick: () => void) {
    const bg = this.add.rectangle(x, y, 320, 84, color, 0.95)
      .setStrokeStyle(6, 0xffffff)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: "system-ui, sans-serif",
      fontSize: "40px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    bg.on("pointerdown", onClick);
  }

  private buildExitButton() {
    const { width } = this.scale;
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
