function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const simplex = new SimplexNoise();
const particles = [];

let time;

class Particle {constructor() {_defineProperty(this, "pos",
    new Vector());_defineProperty(this, "vel",
    new Vector());_defineProperty(this, "acc",
    new Vector());_defineProperty(this, "gravity",
    new Vector(0, 0.02));_defineProperty(this, "color",
    '#fff');}

  update(e, dt) {
    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    this.acc.set(0, 0);
    this.pos.add(this.vel);
    const noisePos = this.pos._.mult(0.008);
    const noise = simplex.noise3D(...noisePos.xy, time);
    this.pos.add(Vector.fa(noise * PI, 0.1));
  }
  draw(e) {
    beginPath();
    rect(this.pos.x - 2 | 0, this.pos.y - 2 | 0, 4);
    fill(this.color);
  }}


class Firework extends Particle {
  constructor() {
    super();
    this.posPrev = new Vector();
    this.init();
  }
  init() {
    this.pos.set(
    random(0.1, 0.9) * width,
    height);

    this.vel.set(
    random(-1, 1) * 1,
    random(0.7, 1) * -7);

    this.sparkleCount = round(random(18, 48));
  }
  update(e, dt) {
    this.posPrev.set(this.pos);
    super.update(e, dt);
    if (this.pos.y > height && this.vel.y > 0) {
      this.init();
    } else
    if (this.pos._.sub(this.posPrev).dot(new Vector(0, 1)) > 0.9) {
      this.explode();
      this.init();
    }
  }
  explode() {
    const shape = random(['random', 'circle', 'star', 'smiley', 'heart']);
    // const shape = 'smiley';
    const scl = random(0.5, 1);
    const rng = random();
    const rngAngle = rng * TAU;
    const rng2 = random();
    const colorBase = random(360);
    const colorRange = random(60);
    const colorOffsetAngle = random(TAU);
    for (let i = 0; i < this.sparkleCount; i++) {
      const t = i / this.sparkleCount;
      const T = t * TAU;
      const p = new Sparkle();
      p.pos.set(this.pos);
      p.vel.set(this.vel).mult(0.1);
      switch (shape) {
        case 'random':{
            p.vel.add(Vector.fa(T, random(0.2, 1.1)));
            break;
          }
        case 'circle':{
            p.vel.add(Vector.fa(T, random(0.9, 1)));
            break;
          }
        case 'star':{
            const _points = [3, 4, 5, 7, 12];
            const points = _points[floor(_points.length * rng2)] * 2;
            const aIndex = floor(t * points);
            const a = Vector.fa(aIndex / points * TAU + rngAngle, aIndex % 2 ? random(0.9, 1) : random(0.4, 0.45));
            const bIndex = aIndex + 1;
            const b = Vector.fa(bIndex / points * TAU + rngAngle, bIndex % 2 ? random(0.9, 1) : random(0.4, 0.45));
            const c = lerp(a, b, t * points % 1);
            p.vel.add(c);
            break;
          }
        case 'smiley':{
            const offsetAngle = lerp(-0.3, 0.3, rng) * PI;
            if (t < 0.4) {
              p.vel.add(Vector.fa(offsetAngle + t / 0.4 * TAU, random(0.9, 1)));
            } else
            if (t < 0.6) {
              p.vel.add(Vector.fa(offsetAngle + map(t, 0.4, 0.6, 0, 1) * TAU, random(0.18, 0.2))).
              add(Vector.fa(offsetAngle + PI + QUARTER_PI, 0.4));
            } else
            if (t < 0.8) {
              p.vel.add(Vector.fa(offsetAngle + map(t, 0.6, 0.8, 0, 1) * TAU, random(0.18, 0.2))).
              add(Vector.fa(offsetAngle + PI + QUARTER_PI + HALF_PI, 0.4));
            } else
            {
              p.vel.add(Vector.fa(offsetAngle + map(i / (this.sparkleCount - 1), 0.8, 1, 0.1, 0.4) * TAU, random(0.65, 0.7)));
            }
            break;
          }

        case 'heart':{
            const v = new Vector(
            16 * sin(T) ** 3,
            13 * cos(T) - 5 * cos(2 * T) - 2 * cos(3 * T) - cos(4 * T)).

            mult(0.0625).
            rotate(PI);
            p.vel.add(v);
            break;
          }}


      p.vel.mult(scl);

      const colorA = hsl(colorBase - colorRange, 100, 50);
      const colorB = hsl(colorBase + colorRange, 100, 50);
      const colorMix = sin((t * PI + colorOffsetAngle) % PI) * 100;
      p.color = `color-mix(in oklch, ${colorA}, ${colorB} ${colorMix}%)`;

      addParticle(p);
    }
  }}


class Sparkle extends Particle {
  constructor() {
    super();
    this.created = performance.now();
    this.lifetime = random(2000, 2500);
    this.gravity.set(0, 0.005);
    this.color = '#fff';
  }
  draw(e) {
    const size = lerp(4, 0, (e - this.created) / this.lifetime);
    const sizeHalf = size * 0.5;
    beginPath();
    rect(this.pos.x - sizeHalf | 0, this.pos.y - sizeHalf | 0, size);
    fill(this.color);
  }}


function setup() {
  for (let i = 0; i < 20; i++) {
    const p = new Firework();
    addParticle(p);
  }
}

function addParticle(p) {
  if (particles.length > 12000) {
    return;
  }
  particles.push(p);
}

function draw(e) {
  background(hsl(0, 0, 0, 0.1));

  time = e * 0.001;

  push();
  font(`${map(sin(time * 2), -1, 1, 216, 226)}px "Gabarito"`);
  textBaseline('center');
  textAlign('center');
  translate(width_half, height_half);
  fillText('2026', 0, 0);
  font(`${map(cos(time * 2), -1, 1, 232, 242)}px "Gabarito"`);
  compositeOperation(compOper.xor);
  fillText('2026', 0, 0);
  pop();

  // translate(width_half, height);
  // scale(height / 1440);
  // translate(-width_half, -height);

  // compositeOperation(compOper.lighter);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.draw(e);
    p.update(e, canvasFrameDelta);
    if (p instanceof Sparkle) {
      if (p.created + p.lifetime < e) {
        particles.splice(i, 1);
      }
    }
  }
}