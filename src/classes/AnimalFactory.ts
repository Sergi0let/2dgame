import { Animal } from "../classes/Animal";

export class AnimalFactory {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  createRandomAnimal(): Animal {
    let x, y;

    x = Math.random() * this.width;
    y = Math.random() * this.height;

    return new Animal(x, y);
  }

  createMultipleAnimals(count: number): Animal[] {
    const animals: Animal[] = [];
    for (let i = 0; i < count; i++) {
      animals.push(this.createRandomAnimal());
    }
    return animals;
  }
}
