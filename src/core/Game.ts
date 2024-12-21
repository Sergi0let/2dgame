import { Animal } from "../classes/Animal";
import { MainHero } from "../classes/MainHero";
import { Yard } from "../classes/Yard";
import appConstants from "../utils/constants";

export class Game {
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hero: MainHero;
  private animals: Animal[] = [];
  private yard: Yard;
  private score: number = 0;
  private music: HTMLAudioElement;
  private spawnInterval: number = 3000;
  private maxAnimals: number = 10;
  private initialAnimals: number = 5;

  constructor(canvasId: string) {
    this.width = appConstants.size.WIDTH;
    this.height = appConstants.size.HEIGHT;
    this.canvas = this.createCanvas(canvasId);
    this.ctx = this.canvas.getContext("2d")!;
    this.hero = new MainHero(this.width / 2, this.height / 2);
    this.yard = new Yard(this.width - 120, this.height - 120);
    this.music = new Audio("./music/west-winds.ogg"); // Шлях до музичного файлу
    this.music.loop = true; // Музика буде повторюватися
    this.music.volume = 0.5; // Гучність (0.0 - 1.0)

    this.createScoreElement();
    this.spawnAnimals(this.initialAnimals);
    this.startAnimalGenerator();
    this.initEvents();
    this.loop();
    this.createMusicControl();
  }

  private createMusicControl() {
    const button = document.createElement("button");
    button.innerText = "Toggle Music";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "10px";

    button.addEventListener("click", () => {
      if (this.music.paused) {
        this.music.play();
        button.innerText = "Pause Music";
      } else {
        this.music.pause();
        button.innerText = "Play Music";
      }
    });

    document.body.appendChild(button);
  }
  private createCanvas(canvasId: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.id = canvasId;
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.border = "1px solid black";
    document.body.appendChild(canvas);
    return canvas;
  }

  private initEvents() {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.hero.moveTo(x, y);
    });
  }

  private spawnAnimals(count: number) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Math.random() * this.width;
        y = Math.random() * this.height;
      } while (this.isInYard(x, y));

      this.animals.push(new Animal(x, y));
    }
  }

  private isInYard(x: number, y: number): boolean {
    return (
      x > this.yard.getX() &&
      x < this.yard.getX() + this.yard.getWidth() &&
      y > this.yard.getY() &&
      y < this.yard.getY() + this.yard.getHeight()
    );
  }

  private startAnimalGenerator() {
    setInterval(() => {
      if (this.animals.length < this.maxAnimals) {
        this.spawnAnimals(1);
      }
    }, this.spawnInterval);
  }

  private loop = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  };

  private update() {
    this.hero.update();
    this.animals.forEach((animal) => {
      animal.update(this.hero, this.yard, this.animals);
    });
    this.animals = this.animals.filter((animal) => !animal.isInYard());
    this.updateScoreElement(this.yard.getScore());
  }

  private createScoreElement(): HTMLElement {
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.innerText = `Score: ${this.score}`;
    document.body.appendChild(scoreElement);
    return scoreElement;
  }

  updateScoreElement(score: number) {
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
      scoreElement.innerText = ` Score: ${score}`;
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.yard.draw(this.ctx);
    this.hero.draw(this.ctx);
    this.animals.forEach((animal) => animal.draw(this.ctx));
  }

  start() {
    this.loop();
    setTimeout(() => this.music.play(), 1000);
  }
}
