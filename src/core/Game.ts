import { Animal } from "../classes/Animal";
import { AnimalFactory } from "../classes/AnimalFactory";
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
  private animalFactory: AnimalFactory;

  constructor(canvasId: string) {
    this.width = appConstants.size.WIDTH;
    this.height = appConstants.size.HEIGHT;
    this.canvas = this.createCanvas(canvasId);
    this.ctx = this.canvas.getContext("2d")!;
    this.hero = new MainHero(this.width / 2, this.height / 2);
    this.yard = new Yard(this.width - 120, this.height - 120);
    this.music = new Audio("./music/west-winds.ogg");
    this.music.loop = true;
    this.music.volume = 0.5;
    this.animalFactory = new AnimalFactory(this.width, this.height);

    this.createScoreElement();
    this.spawnAnimals(this.initialAnimals);
    this.startAnimalGenerator();
    this.initEvents();
    this.loop();
    this.createMusicControl();
  }

  private createMusicControl() {
    const button = document.createElement("button");
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "blue";
    button.style.backgroundSize = "cover";
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundImage = "url('./music_on.png')";

    button.addEventListener("click", () => {
      if (this.music.paused) {
        this.music.play();
        button.style.backgroundImage = "url('./music_on.png')";
      } else {
        this.music.pause();
        button.style.backgroundImage = "url('./music_off.png')";
      }
    });

    document.body.appendChild(button);
  }

  private createCanvas(canvasId: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.id = canvasId;
    canvas.width = this.width;
    canvas.height = this.height;

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
    const newAnimals = this.animalFactory.createMultipleAnimals(count);

    this.animals.push(
      ...newAnimals.filter((animal) => !this.isInYard(animal.x, animal.y))
    );
  }

  private isInYard(x: number, y: number): boolean {
    return (
      x > this.yard.getX() &&
      x < this.yard.getX() + this.yard.getWidth() &&
      y > this.yard.getY() &&
      y < this.yard.getY() + this.yard.getHeight()
    );
  }

  private startAnimalGenerator(): void {
    setInterval(() => {
      if (this.animals.length < this.maxAnimals) {
        const newAnimal = this.animalFactory.createRandomAnimal();
        if (!this.isInYard(newAnimal.x, newAnimal.y)) {
          this.animals.push(newAnimal);
        }
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
