import { Coordinates, Follower, YardInteractable } from "../types";

export class Yard implements YardInteractable {
  private x: number;
  private y: number;
  private width: number = 100;
  private height: number = 100;
  private score: number = 0;
  private farmImage: HTMLImageElement;
  private imageLoaded: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    // Завантаження зображення ферми
    this.farmImage = new Image();
    this.farmImage.src = "./unnamed.png"; // Вкажіть правильний шлях до зображення
    this.farmImage.onload = () => {
      this.imageLoaded = true; // Встановлення прапорця після завантаження
    };
    this.farmImage.onerror = () => {
      console.error("Failed to load farm image!");
    };
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  addAnimalToYard(animal: Coordinates, hero: Follower) {
    const isInside =
      animal.x > this.x &&
      animal.x < this.x + this.width &&
      animal.y > this.y &&
      animal.y < this.y + this.height;

    if (isInside) {
      this.score++;
      hero.resetCounter();
      return true;
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.imageLoaded) {
      // Малюємо зображення ферми, якщо воно завантажено
      ctx.drawImage(this.farmImage, this.x, this.y, this.width, this.height);
    } else {
      // Якщо зображення не завантажено, малюємо жовтий прямокутник
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
