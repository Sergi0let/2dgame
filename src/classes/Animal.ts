import {
  Coordinates,
  Drawable,
  Follower,
  Updatable,
  YardInteractable,
} from "../types";

export class Animal implements Coordinates, Drawable, Updatable {
  public x: number;
  public y: number;
  private targetX: number;
  private targetY: number;
  private speed: number;
  private isFollowing: boolean = false;
  private inYard: boolean = false;
  private sprite: HTMLImageElement;
  private spriteLoaded: boolean = false;
  private frame: number = 0;
  private direction: number = 0;
  private frameWidth: number = 128;
  private frameHeight: number = 128;
  private animationSpeed: number = 20;
  private animationCounter: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.speed = 0.00005;

    this.sprite = new Image();
    this.sprite.src = "./ram_walk.png";
    this.sprite.onload = () => {
      this.spriteLoaded = true;
    };
    this.sprite.onerror = () => {
      console.error("Failed to load sprite image!");
    };
  }

  public isInYard(): boolean {
    return this.inYard;
  }

  update(hero: Follower, yard: YardInteractable, animals: Animal[]) {
    if (this.inYard) return;

    if (!this.isFollowing) {
      this.patrol(animals);
    }

    const dx = hero.x - this.x;
    const dy = hero.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 1 : 3;
    } else {
      this.direction = dy > 0 ? 2 : 0;
    }

    if (distance < 50 && !this.isFollowing && hero.canAcceptFollower()) {
      this.isFollowing = true;
      hero.incrementCounter();
      this.speed = hero.getSpeed();
    }

    if (yard.addAnimalToYard(this, hero)) {
      this.inYard = true;
      this.isFollowing = false;
    }

    if (this.isFollowing) {
      this.x += (hero.x - this.x) * this.speed;
      this.y += (hero.y - this.y) * this.speed;
    }
  }

  private patrol(animals: Animal[]) {
    const distanceToTarget = Math.hypot(
      this.targetX - this.x,
      this.targetY - this.y
    );
    if (distanceToTarget < 1) {
      setTimeout(() => {
        this.chooseNewTarget(animals);
      }, Math.random() * 2000);
      this.chooseNewTarget(animals);
    }

    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;
  }

  private chooseNewTarget(animals: Animal[]) {
    let validTarget = false;

    while (!validTarget) {
      this.targetX = Math.random() * window.innerWidth;
      this.targetY = Math.random() * window.innerHeight;

      validTarget = !animals.some((animal) => {
        if (animal === this) return false;

        const distance = Math.hypot(
          this.targetX - animal.x,
          this.targetY - animal.y
        );
        return distance < 50;
      });
    }
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

      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.frame = (this.frame + 1) % 4;
        this.animationCounter = 0;
      }
    } else {
      ctx.fillStyle = this.inYard
        ? "green"
        : this.isFollowing
        ? "cyan"
        : "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
