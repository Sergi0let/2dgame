export class MusicButton {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private isMusicOn: boolean;
  private musicOnImage: HTMLImageElement;
  private musicOffImage: HTMLImageElement;
  private isMusicOnLoaded: boolean = false;
  private isMusicOffLoaded: boolean = false;
  private toggleCallback: () => void;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    musicOnImageSrc: string,
    musicOffImageSrc: string,
    toggleCallback: () => void
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isMusicOn = true;

    this.musicOnImage = new Image();
    this.musicOnImage.src = musicOnImageSrc;
    this.musicOnImage.onload = () => {
      this.isMusicOnLoaded = true;
    };

    this.musicOffImage = new Image();
    this.musicOffImage.src = musicOffImageSrc;
    this.musicOffImage.onload = () => {
      this.isMusicOffLoaded = true;
    };

    this.toggleCallback = toggleCallback;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const image = this.isMusicOn ? this.musicOnImage : this.musicOffImage;

    // Перевірка, чи зображення завантажено
    if (
      (this.isMusicOn && this.isMusicOnLoaded) ||
      (!this.isMusicOn && this.isMusicOffLoaded)
    ) {
      ctx.drawImage(image, this.x, this.y, this.width, this.height);
    } else {
      // Якщо зображення не завантажено, малюємо запасний прямокутник
      ctx.fillStyle = "gray";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  handleClick(x: number, y: number): boolean {
    if (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    ) {
      this.isMusicOn = !this.isMusicOn;
      this.toggleCallback();
      return true;
    }
    return false;
  }
}
