export interface Coordinates {
  x: number;
  y: number;
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Updatable extends Coordinates {
  update(hero: Follower, yard: YardInteractable, animals: Updatable[]): void;
}

export interface Follower {
  getSpeed(): number;
  x: number;
  y: number;
  incrementCounter(): void;
  resetCounter(): void;
  canAcceptFollower(): boolean;
}

export interface YardInteractable {
  addAnimalToYard(animal: Coordinates, hero: Follower): boolean;
  getScore(): number;
}
