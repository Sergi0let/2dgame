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
  private spriteLoaded: boolean = false; // Перевірка стану завантаження спрайту
  private frame: number = 0;
  private frameWidth: number = 50; // Ширина одного кадру спрайту
  private frameHeight: number = 50; // Висота одного кадру спрайту
  private animationSpeed: number = 10; // Кількість кадрів перед переходом на наступний кадр
  private animationCounter: number = 0;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this.targetX = x;
    this.targetY = y;

    // Завантаження спрайту
    this.sprite = new Image();
    this.sprite.src = "./george.png"; // Замініть на правильний шлях до вашого зображення
    this.sprite.onload = () => {
      this.spriteLoaded = true; // Встановлюємо прапорець після завантаження
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
    console.log("this._counter", this._counter);
  }

  // update(): void {
  //   this.x += (this.targetX - this.x) * this.speed;
  //   this.y += (this.targetY - this.y) * this.speed;
  // }

  update(): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      this._x += (dx / distance) * this.speed * 100;
      this._y += (dy / distance) * this.speed * 100;

      // Оновлення анімації
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.frame = (this.frame + 1) % 4; // Перехід до наступного кадру (0–3)
        this.animationCounter = 0;
      }
    }
  }

  incrementCounter(): void {
    if (this._counter < this.maxFollowers) {
      this._counter++;
    }
  }

  // decrementCounter(): void {
  //   if (this._counter > 0) {
  //     this._counter--;
  //   }
  // }

  resetCounter(): void {
    this._counter = 0;
  }

  canAcceptFollower(): boolean {
    return this._counter < this.maxFollowers;
  }

  // draw(ctx: CanvasRenderingContext2D): void {
  //   ctx.fillStyle = "#e62750";
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
  //   ctx.fill();
  // }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.spriteLoaded) {
      // Якщо спрайт ще не завантажено, нічого не малюємо
      return;
    }

    // Вибір напрямку: 0 - вниз, 1 - ліворуч, 2 - праворуч, 3 - вгору
    const direction =
      this.targetX > this._x ? 2 : this.targetX < this._x ? 1 : 0;

    ctx.drawImage(
      this.sprite,
      this.frame * this.frameWidth, // Вибірка потрібного кадру по горизонталі
      direction * this.frameHeight, // Вибірка потрібного ряду по вертикалі
      this.frameWidth, // Ширина кадру
      this.frameHeight, // Висота кадру
      this._x - this.frameWidth / 2, // Позиція героя по X
      this._y - this.frameHeight / 2, // Позиція героя по Y
      this.frameWidth, // Розмір відображення кадру по X
      this.frameHeight // Розмір відображення кадру по Y
    );
  }
}
