var d = Object.defineProperty;
var l = (h, t, e) =>
  t in h
    ? d(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (h[t] = e);
var i = (h, t, e) => l(h, typeof t != "symbol" ? t + "" : t, e);
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const a of s)
      if (a.type === "childList")
        for (const n of a.addedNodes)
          n.tagName === "LINK" && n.rel === "modulepreload" && r(n);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerPolicy && (a.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (a.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (a.credentials = "omit")
        : (a.credentials = "same-origin"),
      a
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = e(s);
    fetch(s.href, a);
  }
})();
class c {
  constructor(t, e) {
    i(this, "x");
    i(this, "y");
    i(this, "targetX");
    i(this, "targetY");
    i(this, "speed");
    i(this, "isFollowing", !1);
    i(this, "inYard", !1);
    i(this, "sprite");
    i(this, "spriteLoaded", !1);
    i(this, "frame", 0);
    i(this, "direction", 0);
    i(this, "frameWidth", 128);
    i(this, "frameHeight", 128);
    i(this, "animationSpeed", 20);
    i(this, "animationCounter", 0);
    (this.x = t),
      (this.y = e),
      (this.targetX = t),
      (this.targetY = e),
      (this.speed = 5e-5),
      (this.sprite = new Image()),
      (this.sprite.src = "./ram_walk.png"),
      (this.sprite.onload = () => {
        this.spriteLoaded = !0;
      }),
      (this.sprite.onerror = () => {
        console.error("Failed to load sprite image!");
      });
  }
  isInYard() {
    return this.inYard;
  }
  update(t, e, r) {
    if (this.inYard) return;
    this.isFollowing || this.patrol(r);
    const s = t.x - this.x,
      a = t.y - this.y,
      n = Math.hypot(s, a);
    Math.abs(s) > Math.abs(a)
      ? (this.direction = s > 0 ? 1 : 3)
      : (this.direction = a > 0 ? 2 : 0),
      n < 50 &&
        !this.isFollowing &&
        t.canAcceptFollower() &&
        ((this.isFollowing = !0),
        t.incrementCounter(),
        (this.speed = t.getSpeed())),
      e.addAnimalToYard(this, t) &&
        ((this.inYard = !0), (this.isFollowing = !1)),
      this.isFollowing &&
        ((this.x += (t.x - this.x) * this.speed),
        (this.y += (t.y - this.y) * this.speed));
  }
  patrol(t) {
    Math.hypot(this.targetX - this.x, this.targetY - this.y) < 1 &&
      (setTimeout(() => {
        this.chooseNewTarget(t);
      }, Math.random() * 2e3),
      this.chooseNewTarget(t)),
      (this.x += (this.targetX - this.x) * this.speed),
      (this.y += (this.targetY - this.y) * this.speed);
  }
  chooseNewTarget(t) {
    let e = !1;
    for (; !e; )
      (this.targetX = Math.random() * window.innerWidth),
        (this.targetY = Math.random() * window.innerHeight),
        (e = !t.some((r) =>
          r === this
            ? !1
            : Math.hypot(this.targetX - r.x, this.targetY - r.y) < 50
        ));
  }
  draw(t) {
    this.spriteLoaded
      ? (t.drawImage(
          this.sprite,
          this.frame * this.frameWidth,
          this.direction * this.frameHeight,
          this.frameWidth,
          this.frameHeight,
          this.x - this.frameWidth / 2,
          this.y - this.frameHeight / 2,
          this.frameWidth,
          this.frameHeight
        ),
        this.animationCounter++,
        this.animationCounter >= this.animationSpeed &&
          ((this.frame = (this.frame + 1) % 4), (this.animationCounter = 0)))
      : ((t.fillStyle = this.inYard
          ? "green"
          : this.isFollowing
          ? "cyan"
          : "white"),
        t.beginPath(),
        t.arc(this.x, this.y, 10, 0, Math.PI * 2),
        t.fill());
  }
}
class m {
  constructor(t, e) {
    i(this, "width");
    i(this, "height");
    (this.width = t), (this.height = e);
  }
  createRandomAnimal() {
    let t, e;
    return (
      (t = Math.random() * this.width),
      (e = Math.random() * this.height),
      new c(t, e)
    );
  }
  createMultipleAnimals(t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.createRandomAnimal());
    return e;
  }
}
const o = {
  size: { WIDTH: window.innerWidth || 800, HEIGHT: window.innerHeight || 600 },
  hero: { MAX_FOLLOWERS: 5, SPEED: 0.01, RADIUS: 20 },
  animal: { SPEED: 2e-4, PATROL_DISTANCE: 50, PATROL_DELAY: 2e3, RADIUS: 10 },
  yard: { WIDTH: 100, HEIGHT: 100 },
  game: { INITIAL_ANIMALS: 5, MAX_ANIMALS: 10, SPAWN_INTERVAL: 3e3 },
};
class g {
  constructor(t, e) {
    i(this, "_x");
    i(this, "_y");
    i(this, "targetX");
    i(this, "targetY");
    i(this, "_counter", 0);
    i(this, "maxFollowers", o.hero.MAX_FOLLOWERS);
    i(this, "speed", o.hero.SPEED);
    i(this, "sprite");
    i(this, "spriteLoaded", !1);
    i(this, "frame", 0);
    i(this, "frameWidth", 48);
    i(this, "frameHeight", 48);
    i(this, "animationSpeed", 60);
    i(this, "animationCounter", 0);
    i(this, "direction", 0);
    (this._x = t),
      (this._y = e),
      (this.targetX = t),
      (this.targetY = e),
      (this.sprite = new Image()),
      (this.sprite.src = "./george.png"),
      (this.sprite.onload = () => {
        this.spriteLoaded = !0;
      }),
      (this.sprite.onerror = () => {
        console.error("Failed to load sprite image!");
      });
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t;
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t;
  }
  get counter() {
    return this._counter;
  }
  set counter(t) {
    this._counter = t;
  }
  moveTo(t, e) {
    (this.targetX = t), (this.targetY = e);
  }
  getSpeed() {
    return this.speed;
  }
  update() {
    const t = this.targetX - this.x,
      e = this.targetY - this.y,
      r = Math.hypot(t, e);
    r > 1 &&
      ((this._x += (t / r) * this.speed * 100),
      (this._y += (e / r) * this.speed * 100),
      this.animationCounter++,
      this.animationCounter >= this.animationSpeed &&
        ((this.frame = (this.frame + 1) % 4), (this.animationCounter = 0))),
      Math.abs(t) > Math.abs(e)
        ? (this.direction = t > 0 ? 1 : 3)
        : (this.direction = e > 0 ? 2 : 0);
  }
  incrementCounter() {
    this._counter < this.maxFollowers && this._counter++;
  }
  resetCounter() {
    this._counter = 0;
  }
  canAcceptFollower() {
    return this._counter < this.maxFollowers;
  }
  draw(t) {
    this.spriteLoaded
      ? t.drawImage(
          this.sprite,
          this.frame * this.frameWidth,
          this.direction * this.frameHeight,
          this.frameWidth,
          this.frameHeight,
          this.x - this.frameWidth / 2,
          this.y - this.frameHeight / 2,
          this.frameWidth,
          this.frameHeight
        )
      : ((t.fillStyle = "red"),
        t.beginPath(),
        t.arc(this.x, this.y, 10, 0, Math.PI * 2),
        t.fill());
  }
}
class u {
  constructor(t, e) {
    i(this, "x");
    i(this, "y");
    i(this, "width", 100);
    i(this, "height", 100);
    i(this, "score", 0);
    i(this, "farmImage");
    i(this, "imageLoaded", !1);
    (this.x = t),
      (this.y = e),
      (this.farmImage = new Image()),
      (this.farmImage.src = "./unnamed.png"),
      (this.farmImage.onload = () => {
        this.imageLoaded = !0;
      }),
      (this.farmImage.onerror = () => {
        console.error("Failed to load farm image!");
      });
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
  addAnimalToYard(t, e) {
    return t.x > this.x &&
      t.x < this.x + this.width &&
      t.y > this.y &&
      t.y < this.y + this.height
      ? (this.score++, e.resetCounter(), !0)
      : !1;
  }
  getScore() {
    return this.score;
  }
  draw(t) {
    this.imageLoaded
      ? t.drawImage(this.farmImage, this.x, this.y, this.width, this.height)
      : ((t.fillStyle = "yellow"),
        t.fillRect(this.x, this.y, this.width, this.height));
  }
}
class p {
  constructor(t) {
    i(this, "width");
    i(this, "height");
    i(this, "canvas");
    i(this, "ctx");
    i(this, "hero");
    i(this, "animals", []);
    i(this, "yard");
    i(this, "score", 0);
    i(this, "music");
    i(this, "spawnInterval", 3e3);
    i(this, "maxAnimals", 10);
    i(this, "initialAnimals", 5);
    i(this, "animalFactory");
    i(this, "loop", () => {
      this.update(), this.draw(), requestAnimationFrame(this.loop);
    });
    (this.width = o.size.WIDTH),
      (this.height = o.size.HEIGHT),
      (this.canvas = this.createCanvas(t)),
      (this.ctx = this.canvas.getContext("2d")),
      (this.hero = new g(this.width / 2, this.height / 2)),
      (this.yard = new u(this.width - 120, this.height - 120)),
      (this.music = new Audio("./music/west-winds.ogg")),
      (this.music.loop = !0),
      (this.music.volume = 0.5),
      (this.animalFactory = new m(this.width, this.height)),
      this.createScoreElement(),
      this.spawnAnimals(this.initialAnimals),
      this.startAnimalGenerator(),
      this.initEvents(),
      this.loop(),
      this.createMusicControl();
  }
  createMusicControl() {
    const t = document.createElement("button");
    (t.style.position = "absolute"),
      (t.style.top = "10px"),
      (t.style.left = "10px"),
      (t.style.width = "50px"),
      (t.style.height = "50px"),
      (t.style.border = "none"),
      (t.style.borderRadius = "50%"),
      (t.style.backgroundColor = "blue"),
      (t.style.backgroundSize = "cover"),
      (t.style.backgroundRepeat = "no-repeat"),
      (t.style.backgroundImage = "url('./music_on.png')"),
      t.addEventListener("click", () => {
        this.music.paused
          ? (this.music.play(),
            (t.style.backgroundImage = "url('./music_on.png')"))
          : (this.music.pause(),
            (t.style.backgroundImage = "url('./music_off.png')"));
      }),
      document.body.appendChild(t);
  }
  createCanvas(t) {
    const e = document.createElement("canvas");
    return (
      (e.id = t),
      (e.width = this.width),
      (e.height = this.height),
      document.body.appendChild(e),
      e
    );
  }
  initEvents() {
    this.canvas.addEventListener("click", (t) => {
      const e = this.canvas.getBoundingClientRect(),
        r = t.clientX - e.left,
        s = t.clientY - e.top;
      this.hero.moveTo(r, s);
    });
  }
  spawnAnimals(t) {
    const e = this.animalFactory.createMultipleAnimals(t);
    this.animals.push(...e.filter((r) => !this.isInYard(r.x, r.y)));
  }
  isInYard(t, e) {
    return (
      t > this.yard.getX() &&
      t < this.yard.getX() + this.yard.getWidth() &&
      e > this.yard.getY() &&
      e < this.yard.getY() + this.yard.getHeight()
    );
  }
  startAnimalGenerator() {
    setInterval(() => {
      if (this.animals.length < this.maxAnimals) {
        const t = this.animalFactory.createRandomAnimal();
        this.isInYard(t.x, t.y) || this.animals.push(t);
      }
    }, this.spawnInterval);
  }
  update() {
    this.hero.update(),
      this.animals.forEach((t) => {
        t.update(this.hero, this.yard, this.animals);
      }),
      (this.animals = this.animals.filter((t) => !t.isInYard())),
      this.updateScoreElement(this.yard.getScore());
  }
  createScoreElement() {
    const t = document.createElement("div");
    return (
      (t.id = "score"),
      (t.innerText = `Score: ${this.score}`),
      document.body.appendChild(t),
      t
    );
  }
  updateScoreElement(t) {
    const e = document.getElementById("score");
    e && (e.innerText = ` Score: ${t}`);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height),
      this.yard.draw(this.ctx),
      this.hero.draw(this.ctx),
      this.animals.forEach((t) => t.draw(this.ctx));
  }
  start() {
    this.loop(), setTimeout(() => this.music.play(), 1e3);
  }
}
const f = "gameCanvas",
  y = new p(f);
y.start();
