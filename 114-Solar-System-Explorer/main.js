const planets = [
	{
		name: "Mercury",
		radius: 0.383,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/mercury.jpg",
		desc: `Closest to the Sun. Rocky and scorching by day, freezing by night.<br>🪐 4,879 km | 🌡️ 167°C | 🧱 5.43 g/cm³ | 💡 Year lasts 88 Earth days`
	},
	{
		name: "Venus",
		radius: 0.949,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/venus.jpg",
		desc: `Thick toxic clouds. hottest planet.<br>🪐 12,104 km | 🌡️ 464°C | 🧱 5.24 g/cm³ | 💡 Day longer than year`
	},
	{
		name: "Earth",
		radius: 1.0,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/earth.jpg",
		desc: `Our home: oceans, continents, and atmosphere.<br>🪐 12,742 km | 🌡️ 15°C | 🧱 5.51 g/cm³ | 💡 Only planet known to support life 🌱`
	},
	{
		name: "Mars",
		radius: 0.532,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/mars.jpg",
		desc: `The red planet with ancient volcanoes.<br>🪐 6,779 km | 🌡️ -63°C | 🧱 3.93 g/cm³ | 💡 Olympus Mons is 22 km tall`
	},
	{
		name: "Jupiter",
		radius: 11.21,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/jupiter.jpg",
		desc: `Largest gas giant with a giant storm.<br>🪐 139,820 km | 🌡️ -145°C | 🧱 1.33 g/cm³ | 💡 Great Red Spot: a storm bigger than Earth`
	},
	{
		name: "Saturn",
		radius: 9.45,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/saturne.jpg",
		desc: `Famous for icy rings.<br>🪐 116,460 km | 🌡️ -178°C | 🧱 0.69 g/cm³ | 💡 Rings span 282,000 km but are thin`
	},
	{
		name: "Uranus",
		radius: 4.01,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/uranus.jpg",
		desc: `Rotates on its side.<br>🪐 50,724 km | 🌡️ -224°C | 🧱 1.27 g/cm³ | 💡 Spins sideways, tilt ~98°`
	},
	{
		name: "Neptune",
		radius: 3.88,
		texture:
			"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/neptune.jpg",
		desc: `Deep blue with fierce storms.<br>🪐 49,244 km | 🌡️ -214°C | 🧱 1.64 g/cm³ | 💡 Winds reach 2,100 km/h`
	}
];

let currentPlanetIndex = 0;
let scene, camera, renderer, sphere, nextSphere, ring;
let light;

const container = document.getElementById("container");
const planetName = document.getElementById("planetName");
const planetDesc = document.getElementById("planetDesc");
const planetInfo = document.getElementById("planetInfo");
const realSizeToggle = document.getElementById("realSizeToggle");

let useRealSize = false;
const BASE_RADIUS = 1.5;

const textureLoader = new THREE.TextureLoader();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
	camera.position.z = 6;

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(800, 800);
	container.innerHTML = "";
	container.appendChild(renderer.domElement);

	light = new THREE.PointLight(0xffffff, 1.2);
	light.position.set(5, 5, 5);
	scene.add(light);

	loadPlanet(currentPlanetIndex, false);
	animate();
}

function getPlanetRadius(index) {
	const maxRadius = Math.max(...planets.map((p) => p.radius));
	return useRealSize
		? BASE_RADIUS * (planets[index].radius / maxRadius)
		: BASE_RADIUS;
}

function loadPlanet(index, isSlide = true, direction = 1) {
	const planet = planets[index];
	const planetRadius = getPlanetRadius(index);

	textureLoader.load(planet.texture, (texture) => {
		const geometry = new THREE.SphereGeometry(planetRadius, 64, 64);
		const material = new THREE.MeshStandardMaterial({ map: texture });
		nextSphere = new THREE.Mesh(geometry, material);

		if (ring) {
			scene.remove(ring);
			ring = null;
		}

		if (planet.name === "Saturn") {
			const ringTexture = textureLoader.load(
				"https://raw.githubusercontent.com/alexandrevacassin/codepen/refs/heads/main/planets/saturne-2.png"
			);
			const innerRadius = planetRadius * 1.4;
			const outerRadius = planetRadius * 2;
			const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
			const ringMat = new THREE.MeshBasicMaterial({
				map: ringTexture,
				side: THREE.DoubleSide,
				transparent: true
			});
			ring = new THREE.Mesh(ringGeo, ringMat);
			ring.rotation.x = -Math.PI / 2.2;
		}

		if (isSlide && sphere) {
			const slideDistance = useRealSize ? 3 : 5;
			nextSphere.position.x = direction * slideDistance;
			if (ring) ring.position.x = direction * slideDistance;

			scene.add(nextSphere);
			if (ring) scene.add(ring);

			let progress = 0;
			const slide = () => {
				progress += 0.05;
				const t = Math.min(progress, 1);
				sphere.position.x -= (slideDistance / 20) * direction;
				nextSphere.position.x -= (slideDistance / 20) * direction;
				if (ring) ring.position.x -= (slideDistance / 20) * direction;

				if (t < 1) {
					requestAnimationFrame(slide);
				} else {
					scene.remove(sphere);
					sphere = nextSphere;
					nextSphere = null;
				}
			};
			slide();
		} else {
			if (sphere) scene.remove(sphere);
			sphere = nextSphere;
			scene.add(sphere);
			if (ring) scene.add(ring);
		}

		planetInfo.classList.remove("show");
		setTimeout(() => {
			planetName.innerHTML = planet.name;
			planetDesc.innerHTML = planet.desc;
			planetInfo.classList.add("show");
		}, 300);
	});
}

function animate() {
	requestAnimationFrame(animate);
	if (sphere) sphere.rotation.y += 0.003;
	if (nextSphere) nextSphere.rotation.y += 0.003;
	if (ring) ring.rotation.z += 0.0002;
	renderer.render(scene, camera);
}

document.getElementById("prevBtn").addEventListener("click", () => {
	currentPlanetIndex =
		(currentPlanetIndex - 1 + planets.length) % planets.length;
	loadPlanet(currentPlanetIndex, true, -1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
	currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
	loadPlanet(currentPlanetIndex, true, 1);
});

realSizeToggle.addEventListener("change", () => {
	useRealSize = realSizeToggle.checked;
	loadPlanet(currentPlanetIndex, false);
});

init();
