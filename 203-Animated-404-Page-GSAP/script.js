gsap.registerPlugin(
  Observer,
  CustomEase,
  CustomWiggle,
  Physics2DPlugin,
  ScrollTrigger
);

class confettiCannon {
  constructor(el) {
    this.el = el;
  }
  init() {
    const hero = this.el;
    this.hero = hero;

    const el = {
      hand: hero.querySelector(".pricing-hero__hand"),
      instructions: hero.querySelector(".pricing-hero__hand small"),
      rock: hero.querySelector(".pricing-hero__rock"),
      drag: hero.querySelector(".pricing-hero__drag"),
      handle: hero.querySelector(".pricing-hero__handle"),
      canvas: hero.querySelector(".pricing-hero__canvas"),
      proxy: hero.querySelector(".pricing-hero__proxy"),
      preloadImages: hero.querySelectorAll(".image-preload img"),
      xplodePreloadImages: hero.querySelectorAll(".explosion-preload img")
    };
    this.el = el;
    this.isDrawing = false;

    this.imageMap = {};
    this.imageKeys = [];

    this.el.preloadImages.forEach((img) => {
      const key = img.dataset.key;
      this.imageMap[key] = img;
      this.imageKeys.push(key);
    });

    this.explosionMap = {};
    this.explosionKeys = [];

    this.el.xplodePreloadImages.forEach((img) => {
      const key = img.dataset.key;
      this.explosionMap[key] = img;
      this.explosionKeys.push(key);
    });

    this.currentLine = null;
    this.startImage = null;
    this.circle = null;
    this.startX = 0;
    this.startY = 0;
    this.lastDistance = 0;

    this.animationIsOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    ).matches;

    this.wiggle = CustomWiggle.create("myWiggle", { wiggles: 6 });
    this.clamper = gsap.utils.clamp(1, 100);

    this.xSetter = gsap.quickTo(this.el.hand, "x", { duration: 0.1 });
    this.ySetter = gsap.quickTo(this.el.hand, "y", { duration: 0.1 });

    this.setpricingMotion();
    this.initObserver();
    this.initEvents();
  }

  initEvents() {
    if (!this.animationIsOk || ScrollTrigger.isTouch === 1) return;

    this.hero.style.cursor = "none";

    this.hero.addEventListener("mouseenter", (e) => {
      gsap.set(this.el.hand, { opacity: 1 });

      this.xSetter(e.x, e.x);
      this.ySetter(e.y, e.y);
    });

    this.hero.addEventListener("mouseleave", (e) => {
      gsap.set(this.el.hand, { opacity: 0 });
    });

    this.hero.addEventListener("mousemove", (e) => {
      this.xSetter(e.x);
      this.ySetter(e.y);
    });

    gsap.delayedCall(1, (e) => {
      this.createExplosion(window.innerWidth / 2, window.innerHeight / 2, 600);
    })
  }

  setpricingMotion() {
    gsap.set(this.el.hand, { xPercent: -50, yPercent: -50 });
  }

  initObserver() {
    if (!this.animationIsOk) return;

    if (ScrollTrigger.isTouch === 1) {
      Observer.create({
        target: this.el.proxy,
        type: "touch",
        onPress: (e) => {
          this.createExplosion(e.x, e.y, 400);
        }
      });
    } else {
      Observer.create({
        target: this.el.proxy,
        type: "pointer",
        onPress: (e) => this.startDrawing(e),
        onDrag: (e) => this.isDrawing && this.updateDrawing(e),
        onDragEnd: (e) => this.clearDrawing(e),
        onRelease: (e) => this.clearDrawing(e)
      });
    }
  }

  startDrawing(e) {
    this.isDrawing = true;

    gsap.set(this.el.instructions, { opacity: 0 });

    this.startX = e.x;
    this.startY = e.y + window.scrollY;

    // Create line
    this.currentLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    this.currentLine.setAttribute("x1", this.startX);
    this.currentLine.setAttribute("y1", this.startY);
    this.currentLine.setAttribute("x2", this.startX);
    this.currentLine.setAttribute("y2", this.startY);
    this.currentLine.setAttribute("stroke", "#fffce1");
    this.currentLine.setAttribute("stroke-width", "2");
    this.currentLine.setAttribute("stroke-dasharray", "4");

    this.circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    this.circle.setAttribute("cx", this.startX);
    this.circle.setAttribute("cy", this.startY);
    this.circle.setAttribute("r", "30");
    this.circle.setAttribute("fill", "#0e100f");

    // Create image at start point
    const randomKey = gsap.utils.random(this.imageKeys);
    const original = this.imageMap[randomKey];
    const clone = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );

    clone.setAttribute("x", this.startX - 25);
    clone.setAttribute("y", this.startY - 25);
    clone.setAttribute("width", "50");
    clone.setAttribute("height", "50");
    clone.setAttributeNS("http://www.w3.org/1999/xlink", "href", original.src);

    this.startImage = clone;

    this.el.canvas.appendChild(this.currentLine);
    this.el.canvas.appendChild(this.circle);
    this.el.canvas.appendChild(this.startImage);

    gsap.set(this.el.drag, { opacity: 1 });
    gsap.set(this.el.handle, { opacity: 1 });
    gsap.set(this.el.rock, { opacity: 0 });
  }

  updateDrawing(e) {
    if (!this.currentLine || !this.startImage) return;

    let cursorX = e.x;
    let cursorY = e.y + window.scrollY;

    let dx = cursorX - this.startX;
    let dy = cursorY - this.startY;

    let distance = Math.sqrt(dx * dx + dy * dy);
    let shrink = (distance - 30) / distance;

    let x2 = this.startX + dx * shrink;
    let y2 = this.startY + dy * shrink;

    if (distance < 30) {
      x2 = this.startX;
      y2 = this.startY;
    }

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    gsap.to(this.currentLine, {
      attr: { x2, y2 },
      duration: 0.1,
      ease: "none"
    });

    // Eased scale (starts fast, slows down)
    let raw = distance / 100;
    let eased = Math.pow(raw, 0.5);
    let clamped = this.clamper(eased);

    gsap.set([this.startImage, this.circle], {
      scale: clamped,
      rotation: `${angle + -45}_short`,
      transformOrigin: "center center"
    });

    // Move & rotate hand
    gsap.to(this.el.hand, {
      rotation: `${angle + -90}_short`,
      duration: 0.1,
      ease: "none"
    });

    this.lastDistance = distance;
  }

  createExplosion(x, y, distance = 100) {
    const count = Math.round(gsap.utils.clamp(3, 100, distance / 20));
    const angleSpread = Math.PI * 2;
    const explosion = gsap.timeline();
    const gravity = 5;
    const speed = gsap.utils.mapRange(0, 500, 0.3, 1.5, distance);
    const sizeRange = gsap.utils.mapRange(0, 500, 20, 60, distance);

    for (let i = 0; i < count; i++) {
      const randomKey = gsap.utils.random(this.explosionKeys);
      const original = this.explosionMap[randomKey];
      const img = original.cloneNode(true);

      img.className = "explosion-img";
      img.style.position = "absolute";
      img.style.pointerEvents = "none";
      img.style.height = `${gsap.utils.random(20, sizeRange)}px`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.zIndex = 4;

      this.hero.appendChild(img);

      const angle = Math.random() * angleSpread;
      const velocity = gsap.utils.random(500, 1500) * speed;

      explosion
        .to(
          img,
          {
            physics2D: {
              angle: angle * (180 / Math.PI),
              velocity: velocity,
              gravity: 3000
            },
            rotation: gsap.utils.random(-180, 180),
            duration: 1 + Math.random()
          },
          0
        )
        .to(
          img,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power1.out",
            onComplete: () => img.remove()
          },
          1
        );
    }

    return explosion;
  }

  clearDrawing(e) {
    if (!this.isDrawing) return;
    this.createExplosion(this.startX, this.startY, this.lastDistance);

    gsap.set(this.el.drag, { opacity: 0 });
    gsap.set(this.el.handle, { opacity: 0 });
    gsap.set(this.el.rock, { opacity: 1 });

    gsap.to(this.el.rock, {
      duration: 0.4,
      rotation: "+=30",
      ease: "myWiggle",
      onComplete: () => {
        gsap.set(this.el.rock, { opacity: 0 });

        gsap.set(this.el.hand, { rotation: 0, overwrite: "auto" });

        gsap.to(this.el.instructions, { opacity: 1 });
        gsap.set(this.el.drag, { opacity: 1 });
      }
    });

    this.isDrawing = false;

    // Clear all elements from SVG and reset references
    this.el.canvas.innerHTML = "";
    this.currentLine = null;
    this.startImage = null;
  }
}
const cannon = new confettiCannon(document.body);
cannon.init();