document.addEventListener("DOMContentLoaded", () => {
  // Minimal GSAP intro; delete this whole function + CDN if not needed
  const animateTextColumns = () => {
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });
    tl.to(".text-item", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: { amount: 3, from: "start" }
    }).to(".rotated-item", { opacity: 1, filter: "blur(0px)", stagger: 0.2 }, "-=2");
  };
  setTimeout(animateTextColumns, 200);

  const container = document.querySelector(".hero-section");
  if (!container) return;

  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  const config = {
    imageLifespan: 600,
    removalDelay: 16,
    mouseThreshold: isMobile ? 20 : 40,
    scrollThreshold: 50,
    inDuration: 600,
    outDuration: 800,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    touchImageInterval: 40,
    minMovementForImage: isMobile ? 3 : 5,
    minImageSize: isMobile ? 120 : 160,
    maxImageSize: isMobile ? 260 : 340,
    baseRotation: 30,
    maxRotationFactor: 3,
    speedSmoothingFactor: 0.25
  };

  const images = [
    "Image/image1.png",
    "Image/image2.png",
    "Image/image3.png",
    "Image/image4.png",
    "Image/image5.png",
    "Image/image6.png",
    "Image/image7.png",
    "Image/image8.png",
    "Image/image9.png",
    "Image/image10.png",
    "Image/image11.png",
    "Image/image12.png",
    "Image/image13.png",
    "Image/image14.png"
];

  const trail = [];
  let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, prevMouseX = 0, prevMouseY = 0;
  let isMoving = false, isCursorInContainer = false, isTouching = false, isScrolling = false;
  let lastRemovalTime = 0, lastTouchImageTime = 0, lastScrollTime = 0, lastMoveTime = Date.now();
  let smoothedSpeed = 0, maxSpeed = 0, imageIndex = 0;

  const rectOf = () => container.getBoundingClientRect();

  const isInContainer = (x, y) => {
    const r = rectOf();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  document.addEventListener("mouseover", function initPos(e) {
    mouseX = lastMouseX = prevMouseX = e.clientX;
    mouseY = lastMouseY = prevMouseY = e.clientY;
    isCursorInContainer = isInContainer(mouseX, mouseY);
    document.removeEventListener("mouseover", initPos);
  });

  const movedBeyond = (th) => {
    const dx = mouseX - lastMouseX, dy = mouseY - lastMouseY;
    return Math.hypot(dx, dy) > th;
  };

  const movedAtAll = (min) => {
    const dx = mouseX - prevMouseX, dy = mouseY - prevMouseY;
    return Math.hypot(dx, dy) > min;
  };

  const calculateSpeed = () => {
    const now = Date.now();
    const dt = now - lastMoveTime;
    if (dt <= 0) return 0;
    const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
    const raw = dist / dt;
    maxSpeed = Math.max(maxSpeed, raw || 0.5);
    const norm = Math.min(raw / (maxSpeed || 0.5), 1);
    smoothedSpeed = smoothedSpeed * (1 - config.speedSmoothingFactor) + norm * config.speedSmoothingFactor;
    lastMoveTime = now;
    return smoothedSpeed;
  };

  const createFlameImage = (speed) => {
    const imageSrc = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    const size = config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
    const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
    const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;

    const img = document.createElement("img");
    img.className = "trail-img";
    img.src = imageSrc;
    img.width = img.height = size;

    const r = rectOf();
    const x = mouseX - r.left, y = mouseY - r.top;

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
    container.appendChild(img);

    requestAnimationFrame(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
    });

    trail.push({
      element: img,
      rotation: rot,
      removeTime: Date.now() + config.imageLifespan
    });
  };

  const tryCreateTrail = () => {
    if (!isCursorInContainer) return;
    if ((isMoving || isTouching || isScrolling) && movedBeyond(config.mouseThreshold) && movedAtAll(config.minMovementForImage)) {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      const speed = calculateSpeed();
      createFlameImage(speed);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    }
  };

  const tryCreateTouchTrail = () => {
    if (!isCursorInContainer || !isTouching || !movedAtAll(config.minMovementForImage)) return;
    const now = Date.now();
    if (now - lastTouchImageTime < config.touchImageInterval) return;
    lastTouchImageTime = now;
    const speed = calculateSpeed();
    createFlameImage(speed);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  };

  const tryCreateScrollTrail = () => {
    if (!isCursorInContainer || !isScrolling) return;
    lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    createFlameImage(0.5);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  };

  const removeOldImages = () => {
    const now = Date.now();
    if (now - lastRemovalTime < config.removalDelay || !trail.length) return;
    if (now >= trail[0].removeTime) {
      const imgObj = trail.shift();
      const el = imgObj.element;
      el.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      el.style.transform = `translate(-50%, -50%) rotate(${imgObj.rotation + 360}deg) scale(0)`;
      setTimeout(() => el.remove(), config.outDuration);
      lastRemovalTime = now;
    }
  };

  document.addEventListener("mousemove", (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    isCursorInContainer = isInContainer(mouseX, mouseY);
    if (isCursorInContainer && movedAtAll(config.minMovementForImage)) {
      isMoving = true;
      clearTimeout(window.moveTimeout);
      window.moveTimeout = setTimeout(() => (isMoving = false), 100);
    }
  }, { passive: true });

  container.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    prevMouseX = mouseX = t.clientX;
    prevMouseY = mouseY = t.clientY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    isCursorInContainer = true;
    isTouching = true;
    lastMoveTime = Date.now();
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - prevMouseX);
    const dy = Math.abs(t.clientY - prevMouseY);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = t.clientX;
    mouseY = t.clientY;
    isCursorInContainer = true;
    if (dy > dx) return;
    tryCreateTouchTrail();
  }, { passive: true });

  container.addEventListener("touchend", () => { isTouching = false; }, { passive: true });

  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (!isInContainer(t.clientX, t.clientY)) {
      isCursorInContainer = false;
      isTouching = false;
    }
  }, { passive: true });

  window.addEventListener("scroll", () => {
    isCursorInContainer = isInContainer(mouseX, mouseY);
    if (!isCursorInContainer) return;

    const now = Date.now();
    if (now - lastScrollTime < config.scrollThreshold) return;
    lastScrollTime = now;

    isScrolling = true;
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => (isScrolling = false), 100);

    requestAnimationFrame(() => { if (isScrolling) tryCreateScrollTrail(); });
  }, { passive: true });

  (function loop() {
    if (isMoving || isTouching || isScrolling) tryCreateTrail();
    removeOldImages();
    requestAnimationFrame(loop);
  })();
});
