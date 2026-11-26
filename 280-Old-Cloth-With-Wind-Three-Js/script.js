import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 2.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- SHADERS ---

const vertexShader = `
    uniform float uTime;
    uniform float uWindStrength;
    uniform float uFabricFreq;
    
    varying vec2 vUv;
    varying float vZ;

    void main() {
        vUv = uv;
        vec3 pos = position;

        // WIND LOGIC
        float looseFactor = 1.0 - uv.y; 
        float pinInfluence = pow(looseFactor, 1.8);

        float wave1 = sin(uv.x * 5.0 + uTime * 2.0);
        float wave2 = sin(uv.x * 12.0 + uTime * 4.0 + uv.y * 5.0); 
        float wave3 = sin(uTime * 1.5); 
        
        float ripples = (wave1 * 0.5 + wave2 * 0.2 + wave3 * 0.3);

        float displacement = (uWindStrength * 2.0 + ripples * uFabricFreq) * pinInfluence;
        
        pos.y += (sin(displacement) * 0.1) * pinInfluence;
        pos.z += displacement;

        vZ = displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uRatio; 
    
    // Geometry
    uniform float uEdgeScale;
    uniform float uEdgeAmp;
    uniform float uFrameSize;
    uniform float uPhotoInset;
    uniform vec3 uPaperColor;
    
    // FX
    uniform float uScratchAmp;
    uniform float uGrainAmp;
    uniform float uVignette;
    uniform float uSeed;
    uniform float uShadowOpacity; 
    
    // EDGE SHADOW
    uniform vec3 uEdgeShadowColor; 
    uniform float uEdgeShadowOpacity; 
    
    varying vec2 vUv;
    varying float vZ;

    // --- Noise Utils ---
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    float fbm(vec2 x) {
        float v = 0.0; float a = 0.5; vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) { v += a * snoise(x + uSeed); x = rot * x * 2.0 + shift; a *= 0.5; }
        return v;
    }

    void main() {
        vec2 uv = vUv - 0.5;
        vec2 aspectUV = uv;
        aspectUV.x *= uRatio; 

        // 1. SHAPE
        float noise = fbm(aspectUV * uEdgeScale); 
        float dist = max(abs(uv.x), abs(uv.y));
        float raggedDist = dist + noise * uEdgeAmp;

        float borderLimit = 0.5 - uFrameSize; 
        float alpha = 1.0 - smoothstep(borderLimit, borderLimit + 0.01, raggedDist);
        if (alpha < 0.01) discard;

        // 2. PAPER
        float paperGrain = fbm(vUv * 60.0);
        vec3 paperCol = uPaperColor - paperGrain * 0.05;

        // 3. PHOTO/VIDEO
        vec4 photoTex = texture2D(uTexture, vUv);
        float photoNoise = snoise(aspectUV * 30.0) * 0.005;
        float photoDist = max(abs(uv.x), abs(uv.y)) + photoNoise;
        float photoLimit = borderLimit - uPhotoInset;
        float photoMask = 1.0 - smoothstep(photoLimit, photoLimit + 0.02, photoDist);

        // 4. GRUNGE
        float scratches = snoise(vec2(vUv.x * 300.0, vUv.y * 3.0));
        float dust = fbm(vUv * 40.0 + uSeed);
        
        vec3 grungePhoto = photoTex.rgb;
        grungePhoto = mix(grungePhoto, vec3(0.6, 0.5, 0.4), dust * uGrainAmp); 
        grungePhoto -= scratches * uScratchAmp;
        float len = length(uv); 
        grungePhoto -= len * uVignette;

        // Mix Paper and Photo
        vec3 finalRGB = mix(paperCol, grungePhoto, photoMask);

        // 5. CLOTH SHADOWS
        finalRGB += vZ * uShadowOpacity;

        // 6. EDGE SHADOW
        float edgeShadowFactor = smoothstep(borderLimit - 0.05, borderLimit, raggedDist);
        finalRGB = mix(finalRGB, uEdgeShadowColor, edgeShadowFactor * uEdgeShadowOpacity);

        gl_FragColor = vec4(finalRGB, 1.0);
    }
`;

// --- GEOMETRY ---
const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uTexture: { value: null },
        uRatio: { value: 1.0 },
        uTime: { value: 0 },
        
        // WIND
        uWindStrength: { value: 0.2 }, 
        uFabricFreq: { value: 0.45 },
        uShadowOpacity: { value: 0.4 },

        // DEFAULTS
        uEdgeScale: { value: 8.8 },
        uEdgeAmp: { value: 0.0328 },
        uFrameSize: { value: 0.0 },    
        uPhotoInset: { value: 0.013 }, 
        uPaperColor: { value: new THREE.Color(0xf0ebe0) }, 
        
        // FX
        uScratchAmp: { value: 0.0106272 },
        uGrainAmp: { value: 0.034925 },
        uVignette: { value: 0.0 },
        uSeed: { value: 0.0 },
        
        // EDGE SHADOW
        uEdgeShadowColor: { value: new THREE.Color(0x000000) },
        uEdgeShadowOpacity: { value: 0.071 } 
    },
    side: THREE.DoubleSide,
    transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.0; 
scene.add(mesh);


// --- GUI ---
const params = {
    loadFile: function() { document.getElementById('fileInput').click(); },
    
    // Scene
    bgColor: '#111111',

    // Wind
    windForce: 0.2,
    fabricDetail: 0.45,
    shadowOpacity: 0.4,

    // Shape
    edgeScale: 8.8,
    edgeAmp: 0.07,
    frameSize: 0.0,
    photoInset: 0.013,
    paperColor: '#f0ebe0',
    edgeShadowColor: '#000000',
    edgeShadowOpacity: 0.071,
    
    // Grunge
    scratchAmp: 0.0106272,
    grainAmp: 0.034925,
    vignette: 0.0,
    seed: 0.0
};

const gui = new GUI({ title: 'Settings' });

// SCENE
const fScene = gui.addFolder('Scene');
fScene.addColor(params, 'bgColor').name('Background Color').onChange(v => scene.background.set(v));

// WIND
const fWind = gui.addFolder('🌬 WIND (Cloth)');
fWind.add(params, 'windForce', 0.0, 2.0).name('Wind Force');
fWind.add(params, 'fabricDetail', 0.0, 1.0).name('Fabric Detail').onChange(v => material.uniforms.uFabricFreq.value = v);
fWind.add(params, 'shadowOpacity', 0.0, 1.0).name('Cloth Shadow Opacity').onChange(v => material.uniforms.uShadowOpacity.value = v);

// FRAME & SHAPE
const fShape = gui.addFolder('Frame & Shape');
fShape.add(params, 'edgeScale', 1.0, 20.0).name('Edge Scale').onChange(v => material.uniforms.uEdgeScale.value = v);
fShape.add(params, 'edgeAmp', 0.0, 0.2).name('Edge Amplitude').onChange(v => material.uniforms.uEdgeAmp.value = v);
fShape.add(params, 'frameSize', 0.0, 0.2).name('Frame Crop').onChange(v => material.uniforms.uFrameSize.value = v);
fShape.add(params, 'photoInset', 0.0, 0.2).name('Inner Border').onChange(v => material.uniforms.uPhotoInset.value = v);
fShape.addColor(params, 'paperColor').name('Cloth Color').onChange(v => material.uniforms.uPaperColor.value.set(v));

const fEdge = fShape.addFolder('Torn Edge Shadow');
fEdge.addColor(params, 'edgeShadowColor').name('Color').onChange(v => material.uniforms.uEdgeShadowColor.value.set(v));
fEdge.add(params, 'edgeShadowOpacity', 0.0, 1.0).name('Opacity').onChange(v => material.uniforms.uEdgeShadowOpacity.value = v);

// GRUNGE FX
const fFx = gui.addFolder('Grunge FX');
fFx.add(params, 'grainAmp', 0.0, 0.275).name('Grain Strength').onChange(v => material.uniforms.uGrainAmp.value = v);
fFx.add(params, 'scratchAmp', 0.0, 0.0648).name('Scratches').onChange(v => material.uniforms.uScratchAmp.value = v);
fFx.add(params, 'vignette', 0.0, 1.0).name('Vignette').onChange(v => material.uniforms.uVignette.value = v);
fFx.add(params, 'seed', 0.0, 5.0).name('Variation (Seed)').onChange(v => material.uniforms.uSeed.value = v);

gui.add(params, 'loadFile').name('📷 🎥 Load File...');


// --- FILE LOADING (IMAGE & VIDEO) ---
const textureLoader = new THREE.TextureLoader();
const defaultUrl = 'https://iili.io/fvTp5sS.md.jpg';
let currentVideoElement = null; // Keep track to stop playback

function applyTexture(texture, width, height) {
    material.uniforms.uTexture.value = texture;
    
    // Calculate aspect ratio
    const aspect = width / height;
    material.uniforms.uRatio.value = aspect;
    
    // Scale mesh
    const baseHeight = 1.3;
    mesh.scale.set(baseHeight * aspect, baseHeight, 1);
}

function loadDefaultImage() {
    textureLoader.load(defaultUrl, (tex) => {
        applyTexture(tex, tex.image.width, tex.image.height);
    });
}

// Initial Load
loadDefaultImage();

// Handle File Input
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Cleanup previous video if exists
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement.removeAttribute('src');
        currentVideoElement.load();
        currentVideoElement = null;
    }

    const objectUrl = URL.createObjectURL(file);

    // Check if Video
    if (file.type.startsWith('video')) {
        const video = document.createElement('video');
        video.src = objectUrl;
        video.loop = true;
        video.muted = true; // Auto-play often requires muted
        video.playsInline = true;
        video.crossOrigin = "anonymous";
        video.play();
        
        currentVideoElement = video;

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        // Wait for metadata to get dimensions
        video.addEventListener('loadedmetadata', () => {
             applyTexture(videoTexture, video.videoWidth, video.videoHeight);
        });

    } else {
        // Assume Image
        textureLoader.load(objectUrl, (tex) => {
            applyTexture(tex, tex.image.width, tex.image.height);
        });
    }
});


// --- ANIMATION ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    material.uniforms.uTime.value = time;
    
    let gust = (Math.sin(time * 0.7) + Math.sin(time * 2.3) * 0.5) + 0.5; 
    gust = Math.max(0.0, gust); 
    
    material.uniforms.uWindStrength.value = gust * params.windForce * 0.3;

    controls.update();
    renderer.render(scene, camera);
}
animate();