import { Coordinates, Drawable, Follower } from "../types";
import appConstants from "../utils/constants";

export class MainHero implements Coordinates, Drawable, Follower {
  private _x: number;
  private _y: number;
  private targetX: number;
  private targetY: number;
  private _counter: number = 0;
  private readonly maxFollowers: number = appConstants.hero.MAX_FOLLOWERS;
  private readonly speed: number = appConstants.hero.SPEED;
  private sprite: HTMLImageElement;
  private spriteLoaded: boolean = false;
  private frame: number = 0;
  private frameWidth: number = 48;
  private frameHeight: number = 48;
  private animationSpeed: number = 60;
  private animationCounter: number = 0;
  private direction: number = 0;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this.targetX = x;
    this.targetY = y;

    this.sprite = new Image();
    this.sprite.src = "./george.png";
    this.sprite.onload = () => {
      this.spriteLoaded = true;
    };
    this.sprite.onerror = () => {
      console.error("Failed to load sprite image!");
    };
  }

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }

  get counter(): number {
    return this._counter;
  }
  set counter(value: number) {
    this._counter = value;
  }

  moveTo(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
  }

  getSpeed() {
    return this.speed;
  }

  update(): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      this._x += (dx / distance) * this.speed * 100;
      this._y += (dy / distance) * this.speed * 100;

      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.frame = (this.frame + 1) % 4;
        this.animationCounter = 0;
      }
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 1 : 3;
    } else {
      this.direction = dy > 0 ? 2 : 0;
    }
  }

  incrementCounter(): void {
    if (this._counter < this.maxFollowers) {
      this._counter++;
    }
  }

  resetCounter(): void {
    this._counter = 0;
  }

  canAcceptFollower(): boolean {
    return this._counter < this.maxFollowers;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.spriteLoaded) {
      ctx.drawImage(
        this.sprite,
        this.frame * this.frameWidth,
        this.direction * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        this.x - this.frameWidth / 2,
        this.y - this.frameHeight / 2,
        this.frameWidth,
        this.frameHeight
      );
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
