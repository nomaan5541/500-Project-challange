const layerHeights = [
  [0.25, 0.25, 0.1, 0.25, 0.15],
  [0.25, 0.25, 0.1, 0.25, 0.15],
  [0.25, 0.25, 0.1, 0.25, 0.15],
  [0.25, 0.25, 0.25, 0.25],
  [0.25, 0.25, 0.25, 0.25],
  [0.25, 0.25, 0.25, 0.25],
  [0.25, 0.1, 0.25, 0.1, 0.25, 0.05],
  [0.25, 0.25, 0.25, 0.25],
  [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
  [0.1, 0.18, 0.18, 0.18, 0.18, 0.18],
  [0.25, 0.25, 0.25, 0.25]
];
const colors = [
  ["#ac4601", "#e3a33d", "#cb453b", "#da6825", "#fcf1a5"],
  ["#551609", "#8c380c", "#551609", "#8c380c", "#551609"],
  ["#85330f", "#eebc9a", "#85330f", "#eebc9a", "#fcc9c6"],
  ["#ad3701", "#ad3701", "#e7b47c", "#fdbf08"],
  ["#8b3815", "#3f0d05", "#8b3815", "#3f0d05"],
  ["#7c2508", "#ccd579", "#7c2508", "#ccd579"],
  ["#a93c14", "#761c09", "#e4b87c", "#761c09", "#d6602b", "#d45001"],
  ["#9f2533", "#f27f9a", "#9f2533", "#f27f9a"],
  ["#522f82", "#4d77b7", "#51998f", "#7da020", "#dfb227", "#e67f41", "#b91d62", "#fdeddf"],
  ["#893c10", "#d45001", "#fdeab1", "#f3be7c", "#fdeab1", "#d45001"],
  ["#e7675a", "#fbb39e", "#e7675a", "#fbb39e"]
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// slices
const radius = 5;
const totalHeight = 2;
const slices = 10;
const angle = (Math.PI * 2) / slices;
const offset = 0.5; 


function createSliceShape(radius, angle) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, -angle / 2, angle / 2, false);
  shape.lineTo(0, 0);
  return shape;
}

function createLayer(shape, height, color) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false
  });

  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, height, 0);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.8
  });

  return new THREE.Mesh(geometry, material);
}

function createLayers(shape, heights, colors, totalHeight) {
  const group = new THREE.Group();
  let currentY = 0;

  for (let j = 0; j < heights.length; j++) {
    const h = heights[j] * totalHeight;

    const layer = createLayer(shape, h, colors[j]);
    layer.position.y = currentY;

    currentY += h;
    group.add(layer);
  }

  return { group, totalHeight: currentY };
}

function addSprinkles(group, radius, angle, topY, count = 60) {
  const edgeMargin = 0.05;
  const innerMargin = 0.05;
  const minR = radius * innerMargin;
  const maxR = radius * (1 - edgeMargin);
  
  for (let i = 0; i < count; i++) {
    const geo = new THREE.SphereGeometry(0.05, 8, 8);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${Math.random() * 360}, 80%, 60%)`)
    });

    const sprinkle = new THREE.Mesh(geo, mat);

    const r = Math.sqrt(Math.random()) * (maxR - minR) + minR;
    const a = (Math.random() - 0.5) * angle;

    sprinkle.position.set(
      Math.cos(a) * r,
      topY + 0.05,
      Math.sin(a) * r
    );

    group.add(sprinkle);
  }
}

function addRaspberries(group, radius, angle, topY) {
  const count = 3;

  const baseR = radius * 0.8;

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const a = -angle / 2 + t * angle;

    const cluster = new THREE.Group();

    const coreGeo = new THREE.SphereGeometry(0.2, 10, 10); //szie
    const coreMat = new THREE.MeshStandardMaterial({
      color: "#b11226",
      roughness: 0.7
    });

    const core = new THREE.Mesh(coreGeo, coreMat);
    cluster.add(core);

    const dropletCount = 500;

    for (let j = 0; j < dropletCount; j++) {
      const geo = new THREE.SphereGeometry(0.04, 8, 8); //size

      const mat = new THREE.MeshStandardMaterial({
        color: "#d7263d",
        roughness: 0.8
      });

      const dot = new THREE.Mesh(geo, mat);

      const theta = Math.random() * Math.PI * 2;
      const u = Math.random();
      const v = Math.random();
   
      const r = 0.2 * Math.cbrt(u);
      const phi = Math.acos(2 * v - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      dot.position.set(x, y, z);
      
      dot.scale.setScalar(0.8 + Math.random() * 0.6);

      cluster.add(dot);
    }

    cluster.position.set(
      Math.cos(a) * baseR,
      topY + 0.05,
      Math.sin(a) * baseR
    );

    cluster.scale.set(1.3, 1.3, 0.9);

    group.add(cluster);
  }
}

function addCaramelMesh(group, radius, angle, topY) {
  const lines = 10;
  const segments = [];

  const material = new THREE.LineBasicMaterial({
    color: "#d45001",
    linewidth: 2
  });

  const meshGroup = new THREE.Group();

  for (let i = 0; i <= lines; i++) {
    const t = i / lines;
    const a = -angle / 2 + t * angle;

    const rOuter = radius * 0.995;
    const rInner = radius * 0.005;

    const geo1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(Math.cos(a) * rInner, topY + 0.02, Math.sin(a) * rInner),
      new THREE.Vector3(Math.cos(a) * rOuter, topY + 0.02, Math.sin(a) * rOuter)
    ]);

    const line1 = new THREE.Line(geo1, material);
    meshGroup.add(line1);

    const rr = rInner + (rOuter - rInner) * (i / lines);

    const steps = 20;
    const points = [];

    for (let j = 0; j <= steps; j++) {
      const ta = -angle / 2 + (j / steps) * angle;

      points.push(
        new THREE.Vector3(
          Math.cos(ta) * rr,
          topY + 0.02,
          Math.sin(ta) * rr
        )
      );
    }

    const geo2 = new THREE.BufferGeometry().setFromPoints(points);
    const line2 = new THREE.Line(geo2, material);
    meshGroup.add(line2);
  }

  group.add(meshGroup);
}

function addCookieSandwich(group, radius, angle, topY) {
  const cookieRadius = radius * 0.15;
  const cookieHeight = 0.16;

  const cookieGroup = new THREE.Group();

  
  const a = 0; 
  const r = radius * 0.75;

  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;

  const cookieGeo = new THREE.CylinderGeometry(cookieRadius, cookieRadius, cookieHeight, 32);
  const cookieMat = new THREE.MeshStandardMaterial({
    color: "#4b2a1a",
    roughness: 0.9
  });

  const bottom = new THREE.Mesh(cookieGeo, cookieMat);
  bottom.position.y = topY + 0.16;
  cookieGroup.add(bottom);

  const creamGeo = new THREE.CylinderGeometry(cookieRadius * 0.95, cookieRadius * 0.95, cookieHeight * 0.6, 32);
  const creamMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.6
  });

  const cream = new THREE.Mesh(creamGeo, creamMat);
  cream.position.y = topY + 0.32;
  cookieGroup.add(cream);

  const top = new THREE.Mesh(cookieGeo, cookieMat.clone());
  top.position.y = topY + 0.44;
  cookieGroup.add(top);

  cookieGroup.position.set(x, 0, z);

  group.add(cookieGroup);
}

function addLemonSlice(group, radius, angle, topY) {
  const lemonRadius = radius * 0.15;
  const lemonHeight = 0.08;

  const lemonGroup = new THREE.Group();

  const a = 0;
  const r = radius * 0.75;
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  const baseY = topY + 0.12;

  const outerGeo = new THREE.CylinderGeometry(lemonRadius, lemonRadius, lemonHeight, 48);
  const outerMat = new THREE.MeshStandardMaterial({
    color: "#f7d51d",
    roughness: 0.6
  });

  const outer = new THREE.Mesh(outerGeo, outerMat);
  outer.position.y = baseY;
  lemonGroup.add(outer);

  
  const innerRadius = lemonRadius * 0.90;

  const innerGeo = new THREE.CylinderGeometry(innerRadius, innerRadius, lemonHeight * 0.9, 48);
  const innerMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.7
  });

  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.position.y = baseY + 0.005;
  lemonGroup.add(inner);

  
  const segmentCount = 8;
  const gap = 0.18;

  for (let i = 0; i < segmentCount; i++) {
  const shape = new THREE.Shape();

  const fullAngle = (Math.PI * 2) / segmentCount;

  const startAngle = i * fullAngle + gap / 2;
  const endAngle = (i + 1) * fullAngle - gap / 2;

  const outerR = innerRadius * 0.95;
  const innerR = innerRadius * 0.25; // החור באמצע

  // קשת חיצונית
  shape.absarc(0, 0, outerR, startAngle, endAngle, false);

  // קשת פנימית (חוזרים אחורה)
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);

  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape);

  const mat = new THREE.MeshStandardMaterial({
    color: "#fff11c",
    side: THREE.DoubleSide,
    roughness: 0.4,
    transparent: true,
    opacity: 0.9
  });

  const segment = new THREE.Mesh(geo, mat);

  segment.rotation.x = -Math.PI / 2;
  segment.position.y = baseY + lemonHeight / 2 + 0.002;

  lemonGroup.add(segment);
}

  lemonGroup.position.set(x, 0, z);

  group.add(lemonGroup);
}

function addTopping(i, group, radius, angle, topY) {
  switch (i) {
    case 0:
      addRaspberries(group, radius, angle, topY);
      break;
    case 1:
      addCookieSandwich(group, radius, angle, topY);
      break;
    case 2:
      addSprinkles(group, radius, angle, topY);
      break;
    case 3:
      addLemonSlice(group, radius, angle, topY);
      break;
    case 4:
      addRaspberries(group, radius, angle, topY);
      break;
    case 5:
      addCookieSandwich(group, radius, angle, topY);
      break;
    case 6:
      addCaramelMesh(group, radius, angle, topY);
      break;
    case 7:
      addRaspberries(group, radius, angle, topY);
      break;
    case 8:
      addSprinkles(group, radius, angle, topY);
      break;
    case 9:
      addCaramelMesh(group, radius, angle, topY);
      break;

    default:
      addSprinkles(group, radius, angle, topY);
  }
}

function createSlice(i, radius, angle, totalHeight, offset) {
  const heights = layerHeights[i];
  const sliceColors = colors[i];

  const sliceGroup = new THREE.Group();
  const shape = createSliceShape(radius, angle);

  const { group: layersGroup, totalHeight: topY } =
    createLayers(shape, heights, sliceColors, totalHeight);

  sliceGroup.add(layersGroup);

  addTopping(i, sliceGroup, radius, angle, topY)
  
  const theta = i * angle;
  sliceGroup.rotation.y = theta;
  sliceGroup.translateX(offset);

  return sliceGroup;
}

function setupLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.2); ///0.4
  scene.add(ambient);

  const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
  topLight.position.set(5, 10, 7);
  scene.add(topLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);
  
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
  keyLight.position.set(0, 8, -8);
  scene.add(keyLight);
}


const cakeGroup = new THREE.Group();
for (let i = 0; i < slices; i++) {
  const slice = createSlice(i, radius, angle, totalHeight, offset);
  cakeGroup.add(slice);
}

scene.add(cakeGroup);
setupLighting(scene)


// camera
camera.position.z = 12;
camera.position.y = 6;
camera.lookAt(0, 0, 0);

// animate

function animate() {
  requestAnimationFrame(animate);
  cakeGroup.rotation.y += 0.003;
  renderer.render(scene, camera);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

animate();
window.addEventListener("resize", onWindowResize);