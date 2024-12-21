var d = Object.defineProperty;
var c = (a, t, i) =>
  t in a
    ? d(a, t, { enumerable: !0, configurable: !0, writable: !0, value: i })
    : (a[t] = i);
var e = (a, t, i) => c(a, typeof t != "symbol" ? t + "" : t, i);
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const h of s)
      if (h.type === "childList")
        for (const n of h.addedNodes)
          n.tagName === "LINK" && n.rel === "modulepreload" && r(n);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(s) {
    const h = {};
    return (
      s.integrity && (h.integrity = s.integrity),
      s.referrerPolicy && (h.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (h.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (h.credentials = "omit")
        : (h.credentials = "same-origin"),
      h
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const h = i(s);
    fetch(s.href, h);
  }
})();
class l {
  constructor(t, i) {
    e(this, "x");
    e(this, "y");
    e(this, "targetX");
    e(this, "targetY");
    e(this, "speed");
    e(this, "isFollowing", !1);
    e(this, "inYard", !1);
    e(this, "sprite");
    e(this, "spriteLoaded", !1);
    e(this, "frame", 0);
    e(this, "direction", 0);
    e(this, "frameWidth", 128);
    e(this, "frameHeight", 128);
    e(this, "animationSpeed", 30);
    e(this, "animationCounter", 0);
    (this.x = t),
      (this.y = i),
      (this.targetX = t),
      (this.targetY = i),
      (this.speed = 0.005),
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
  update(t, i, r) {
    if (this.inYard) return;
    this.isFollowing || this.patrol(r);
    const s = t.x - this.x,
      h = t.y - this.y,
      n = Math.hypot(s, h);
    Math.abs(s) > Math.abs(h)
      ? (this.direction = s > 0 ? 1 : 3)
      : (this.direction = h > 0 ? 2 : 0),
      n < 50 &&
        !this.isFollowing &&
        t.canAcceptFollower() &&
        ((this.isFollowing = !0), t.incrementCounter()),
      i.addAnimalToYard(this, t) &&
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
    let i = !1;
    for (; !i; )
      (this.targetX = Math.random() * window.innerWidth),
        (this.targetY = Math.random() * window.innerHeight),
        (i = !t.some((r) =>
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
const o = {
  size: { WIDTH: window.innerWidth || 800, HEIGHT: window.innerHeight || 600 },
  hero: { MAX_FOLLOWERS: 5, SPEED: 0.01, RADIUS: 20 },
  animal: { SPEED: 2e-4, PATROL_DISTANCE: 50, PATROL_DELAY: 2e3, RADIUS: 10 },
  yard: { WIDTH: 100, HEIGHT: 100 },
  game: { INITIAL_ANIMALS: 5, MAX_ANIMALS: 10, SPAWN_INTERVAL: 3e3 },
};
class m {
  constructor(t, i) {
    e(this, "_x");
    e(this, "_y");
    e(this, "targetX");
    e(this, "targetY");
    e(this, "_counter", 0);
    e(this, "maxFollowers", o.hero.MAX_FOLLOWERS);
    e(this, "speed", o.hero.SPEED);
    e(this, "sprite");
    e(this, "spriteLoaded", !1);
    e(this, "frame", 0);
    e(this, "frameWidth", 50);
    e(this, "frameHeight", 50);
    e(this, "animationSpeed", 10);
    e(this, "animationCounter", 0);
    (this._x = t),
      (this._y = i),
      (this.targetX = t),
      (this.targetY = i),
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
  moveTo(t, i) {
    (this.targetX = t),
      (this.targetY = i),
      console.log("this._counter", this._counter);
  }
  update() {
    const t = this.targetX - this.x,
      i = this.targetY - this.y,
      r = Math.hypot(t, i);
    r > 1 &&
      ((this._x += (t / r) * this.speed * 100),
      (this._y += (i / r) * this.speed * 100),
      this.animationCounter++,
      this.animationCounter >= this.animationSpeed &&
        ((this.frame = (this.frame + 1) % 4), (this.animationCounter = 0)));
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
    if (!this.spriteLoaded) return;
    const i = this.targetX > this._x ? 2 : this.targetX < this._x ? 1 : 0;
    t.drawImage(
      this.sprite,
      this.frame * this.frameWidth,
      i * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this._x - this.frameWidth / 2,
      this._y - this.frameHeight / 2,
      this.frameWidth,
      this.frameHeight
    );
  }
}
class g {
  constructor(t, i) {
    e(this, "x");
    e(this, "y");
    e(this, "width", 100);
    e(this, "height", 100);
    e(this, "score", 0);
    e(this, "farmImage");
    e(this, "imageLoaded", !1);
    (this.x = t),
      (this.y = i),
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
  addAnimalToYard(t, i) {
    return t.x > this.x &&
      t.x < this.x + this.width &&
      t.y > this.y &&
      t.y < this.y + this.height
      ? (this.score++, i.resetCounter(), !0)
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
class u {
  constructor(t) {
    e(this, "width");
    e(this, "height");
    e(this, "canvas");
    e(this, "ctx");
    e(this, "hero");
    e(this, "animals", []);
    e(this, "yard");
    e(this, "score", 0);
    e(this, "music");
    e(this, "spawnInterval", 3e3);
    e(this, "maxAnimals", 10);
    e(this, "initialAnimals", 5);
    e(this, "loop", () => {
      this.update(), this.draw(), requestAnimationFrame(this.loop);
    });
    (this.width = o.size.WIDTH),
      (this.height = o.size.HEIGHT),
      (this.canvas = this.createCanvas(t)),
      (this.ctx = this.canvas.getContext("2d")),
      (this.hero = new m(this.width / 2, this.height / 2)),
      (this.yard = new g(this.width - 120, this.height - 120)),
      (this.music = new Audio("./music/west-winds.ogg")),
      (this.music.loop = !0),
      (this.music.volume = 0.5),
      this.createScoreElement(),
      this.spawnAnimals(this.initialAnimals),
      this.startAnimalGenerator(),
      this.initEvents(),
      this.loop(),
      this.createMusicControl();
  }
  createMusicControl() {
    const t = document.createElement("button");
    (t.innerText = "Toggle Music"),
      (t.style.position = "absolute"),
      (t.style.top = "10px"),
      (t.style.left = "10px"),
      t.addEventListener("click", () => {
        this.music.paused
          ? (this.music.play(), (t.innerText = "Pause Music"))
          : (this.music.pause(), (t.innerText = "Play Music"));
      }),
      document.body.appendChild(t);
  }
  createCanvas(t) {
    const i = document.createElement("canvas");
    return (
      (i.id = t),
      (i.width = this.width),
      (i.height = this.height),
      (i.style.border = "1px solid black"),
      document.body.appendChild(i),
      i
    );
  }
  initEvents() {
    this.canvas.addEventListener("click", (t) => {
      const i = this.canvas.getBoundingClientRect(),
        r = t.clientX - i.left,
        s = t.clientY - i.top;
      this.hero.moveTo(r, s);
    });
  }
  spawnAnimals(t) {
    for (let i = 0; i < t; i++) {
      let r, s;
      do (r = Math.random() * this.width), (s = Math.random() * this.height);
      while (this.isInYard(r, s));
      this.animals.push(new l(r, s));
    }
  }
  isInYard(t, i) {
    return (
      t > this.yard.getX() &&
      t < this.yard.getX() + this.yard.getWidth() &&
      i > this.yard.getY() &&
      i < this.yard.getY() + this.yard.getHeight()
    );
  }
  startAnimalGenerator() {
    setInterval(() => {
      this.animals.length < this.maxAnimals && this.spawnAnimals(1);
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
    const i = document.getElementById("score");
    i && (i.innerText = ` Score: ${t}`);
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
  p = new u(f);
p.start();
