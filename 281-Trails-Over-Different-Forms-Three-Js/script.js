import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

        // --- CONFIGURATION ---
        const CONFIG = {
            // Scene
            bgColor: '#0a0a0a',
            baseOpacity: 0.16755,
            shapeOpacity: 0.3,
            
            // Global Transform (New)
            sceneRotationX: 0.0,    // Tilt forward/back
            sceneRotationY: 0.0,    // Tilt left/right (Requested)
            
            // Geometry
            shape: 0,               // City Blocks
            shapeSize: 4.0,
            amplitude: 1.0,         
            shapeRotZ: 0.0,
            shapeScaleX: 1.0,
            
            // Signals
            lineSpeed: 0.2,
            signalDensity: 0.203,
            trailLength: 0.155688,
            
            // Colors
            color1: '#7ae4ff',
            useColor2: false, color2: '#a5a3ff',
            useColor3: false, color3: '#c8ff00',
            useColor4: false, color4: '#ff007b',

            // System
            linesCount: 100,
            segments: 1000
        };

        // --- SCENE ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(CONFIG.bgColor);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(-10, 0, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // --- SHADERS ---

        const vertexShader = `
            uniform int uShapeType; 
            uniform float uSize;
            uniform float uAmplitude;
            uniform float uRotZ;
            uniform float uScaleX;
            uniform float uTime;
            
            varying vec2 vUv;
            varying float vZ;          
            varying float vLineIndex;  
            varying float vHeightNorm; 

            vec2 rotate(vec2 v, float a) {
                float s = sin(a);
                float c = cos(a);
                return mat2(c, -s, s, c) * v;
            }

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f*f*(3.0-2.0*f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            
            float voronoi(vec2 p) {
                vec2 n = floor(p);
                vec2 f = fract(p);
                float m = 8.0;
                for(int j=-1; j<=1; j++)
                for(int i=-1; i<=1; i++) {
                    vec2 g = vec2(float(i),float(j));
                    vec2 o = hash(n + g) * vec2(0.5) + 0.5;
                    o = 0.5 + 0.5*sin(uTime * 0.5 + 6.2831*o);
                    vec2 r = g + o - f;
                    float d = dot(r,r);
                    m = min(m, d);
                }
                return sqrt(m);
            }

            float hSphere(vec2 p, float r) { float d = length(p); return (d < r) ? sqrt(r*r - d*d) : 0.0; }
            float hBox(vec2 p, float s) { float limit = s * 0.7; if(abs(p.x) < limit && abs(p.y) < limit) return s * 0.6; return 0.0; }
            float hPyramid(vec2 p, float s) { float d = max(abs(p.x), abs(p.y)); return (d < s) ? (s - d) * 1.5 : 0.0; }
            float hTorus(vec2 p, float s) { float d = abs(length(p) - s * 0.7); float minor = s * 0.25; return (d < minor) ? sqrt(minor*minor - d*d) : 0.0; }

            float hCity(vec2 p, float s) { if(abs(p.x) > s || abs(p.y) > s * 0.8) return 0.0; vec2 id = floor(p); vec2 g = fract(p) - 0.5; float h = hash(id); if(abs(g.x) < 0.4 && abs(g.y) < 0.4 && h > 0.3) return h * 2.0; return 0.0; }
            float hRobot(vec2 p, float s) { float d = length(p); if(d > s*0.6) return 0.0; float h = s*0.4; if(abs(p.x) < s*0.25 && abs(p.y - s*0.15) < s*0.1) h = 0.0; return h; }
            float hHexHive(vec2 p, float s) { if(length(p) > s) return 0.0; vec2 q = p * 1.5; q.x *= 1.1547; bool isOdd = fract(q.y * 0.5) > 0.5; if(isOdd) q.x += 0.5; vec2 hexUv = fract(q) - 0.5; if (max(abs(hexUv.x), abs(hexUv.y)) < 0.45) return hash(floor(q)) * s * 0.5 + 0.2; return 0.0; }
            float hTurbine(vec2 p, float s) { float d = length(p); if(d > s || d < s*0.2) return 0.0; return s * 0.5 * max(0.0, sin(atan(p.y, p.x) * 8.0 + d * 2.0)); }
            float hCircuit(vec2 p, float s) { if(max(abs(p.x), abs(p.y)) > s*0.8) return 0.0; float chip = (max(abs(p.x), abs(p.y)) < s*0.3) ? s*0.4 : 0.0; float trace = step(0.9, sin(p.x*10.0)*sin(p.y*10.0)) * s * 0.1; return max(chip, trace); }
            float hMountain(vec2 p, float s) { if(length(p) > s) return 0.0; return pow(noise(p*1.5)+noise(p*3.5)*0.5, 2.0) * s * 0.8; }
            float hGalaxy(vec2 p, float s) { float d = length(p); if(d > s) return 0.0; float spiral = sin(atan(p.y,p.x)*3.0 - d*3.0); return max(exp(-d*2.0)*s, smoothstep(0.0,1.0,spiral)*s*0.3*(1.0-d/s)); }
            float hAcoustic(vec2 p, float s) { if(abs(p.x) > s) return 0.0; float h = abs(sin(floor(p.x*4.0)*132.1)) * s * 0.8 * (1.0-abs(p.x)/s); return (abs(p.y) < h) ? (h - abs(p.y))*0.5 + 0.2 : 0.0; }
            float hMatrix(vec2 p, float s) { if(max(abs(p.x), abs(p.y)) > s) return 0.0; if(hash(vec2(floor(p.x*4.0), floor(p.y*4.0))) > 0.5) return s * 0.3; return 0.0; }
            float hShield(vec2 p, float s) { float d = length(p); if(d>s) return 0.0; return sqrt(s*s-d*d)*0.6 + sin(p.x*5.0)*sin(p.y*5.0)*0.1; }
            float hPortal(vec2 p, float s) { float d = length(p); return (d<s && d>s*0.8) ? s*0.5 : 0.0; }
            float hData(vec2 p, float s) { float h = hash(floor(p*2.0)); return (h>0.7 && max(abs(p.x), abs(p.y)) < s) ? h*s : 0.0; }

            float hLiquid(vec2 p, float s) { if(length(p) > s * 1.2) return 0.0; vec2 p1 = vec2(sin(uTime*0.8), cos(uTime*0.7)) * s * 0.4; vec2 p2 = vec2(sin(uTime*0.5+2.0), cos(uTime*0.6)) * s * 0.4; vec2 p3 = vec2(0.0); float d = 0.0; d += 1.0 / length(p - p1); d += 1.0 / length(p - p2); d += 1.0 / length(p - p3); if(d > 4.0/s) return s * 0.5; return max(0.0, (d - 2.0/s) * s * 0.2); }
            float hVoronoi(vec2 p, float s) { if(length(p) > s) return 0.0; float v = voronoi(p * 1.5); return smoothstep(0.5, 0.0, v) * s * 0.7; }
            float hPyramidGrid(vec2 p, float s) { if(max(abs(p.x), abs(p.y)) > s) return 0.0; vec2 tile = fract(p * 2.0) - 0.5; float d = max(abs(tile.x), abs(tile.y)); return (0.5 - d) * 2.0 * s * 0.4; }
            float hVortex(vec2 p, float s) { float d = length(p); if(d > s) return 0.0; return -1.0 * (1.0 - smoothstep(0.0, s, d)) * s * 0.8; }
            float hCrystal(vec2 p, float s) { if(length(p) > s) return 0.0; float a = abs(p.x) + abs(p.y); float b = abs(p.x * 0.7 + p.y * 0.7); float c = abs(p.x * 0.7 - p.y * 0.7); float h = max(max(a, b), c); return max(0.0, (s - h)) * 1.2; }
            float hGlitch(vec2 p, float s) { if(max(abs(p.x), abs(p.y)) > s) return 0.0; float n = hash(floor(p * 5.0) + floor(uTime * 5.0)); return n * s * 0.5; }
            float hRipple(vec2 p, float s) { float d = length(p); if(d > s) return 0.0; float waves = sin(d * 10.0 - uTime * 3.0); return waves * s * 0.1 * (1.0 - d/s) + 0.2; }
            float hWaffle(vec2 p, float s) { if(max(abs(p.x), abs(p.y)) > s) return 0.0; vec2 grid = step(0.1, fract(p * 2.0)); return grid.x * grid.y * s * 0.3; }
            float hStadium(vec2 p, float s) { float d = length(vec2(p.x * 0.5, p.y)); if (d > s * 0.8) return 0.0; return floor((s*0.8 - d) * 4.0) * 0.2 * s; }
            float hBlackHole(vec2 p, float s) { float d = length(p); if(d > s) return 0.0; return -1.0 / (d + 0.5) * s * 0.5; }

            float getHeight(vec2 p) {
                int t = uShapeType;
                if(t==0) return hSphere(p, uSize);
                if(t==1) return hBox(p, uSize);
                if(t==2) return hPyramid(p, uSize);
                if(t==3) return hTorus(p, uSize);
                if(t==4) return hCity(p, uSize);
                if(t==5) return hRobot(p, uSize);
                if(t==6) return hHexHive(p, uSize);
                if(t==7) return hTurbine(p, uSize);
                if(t==8) return hCircuit(p, uSize);
                if(t==9) return hMountain(p, uSize);
                if(t==10) return hGalaxy(p, uSize);
                if(t==11) return hAcoustic(p, uSize);
                if(t==12) return hMatrix(p, uSize);
                if(t==13) return hShield(p, uSize);
                if(t==14) return hPortal(p, uSize);
                if(t==15) return hData(p, uSize);
                if(t==16) return hLiquid(p, uSize);
                if(t==17) return hVoronoi(p, uSize);
                if(t==18) return hPyramidGrid(p, uSize);
                if(t==19) return hVortex(p, uSize);
                if(t==20) return hCrystal(p, uSize);
                if(t==21) return hGlitch(p, uSize);
                if(t==22) return hRipple(p, uSize);
                if(t==23) return hWaffle(p, uSize);
                if(t==24) return hStadium(p, uSize);
                if(t==25) return hBlackHole(p, uSize);
                return 0.0;
            }

            void main() {
                vUv = uv;
                vLineIndex = uv.y;
                vec3 pos = position;
                vec2 p = pos.xy;
                p.x /= uScaleX;
                p = rotate(p, -uRotZ);
                float h = getHeight(p);
                float transition = smoothstep(0.0, 0.1, abs(h) + 0.01);
                pos.z += h * transition * uAmplitude;
                vZ = pos.z;
                vHeightNorm = smoothstep(0.0, uSize * 0.5 * uAmplitude, abs(h));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uTime;
            uniform float uTrailLength;
            uniform float uDensity;
            uniform float uBaseOpacity;
            uniform float uShapeOpacity;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;
            uniform vec3 uColor4;
            uniform vec4 uActiveColors;

            varying vec2 vUv;
            varying float vZ;
            varying float vLineIndex;
            varying float vHeightNorm;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            vec3 getSignalColor(float seed) {
                float rnd = random(vec2(seed, 55.0));
                vec3 col = uColor1; 
                if (uActiveColors.y > 0.5 && rnd > 0.25 && rnd < 0.5) col = uColor2;
                else if (uActiveColors.z > 0.5 && rnd > 0.5 && rnd < 0.75) col = uColor3;
                else if (uActiveColors.w > 0.5 && rnd > 0.75) col = uColor4;
                return col;
            }

            void main() {
                float seed = floor(vLineIndex * 3000.0);
                float speed = 0.5 + random(vec2(seed, 10.0));
                float offset = random(vec2(seed, 20.0)) * 20.0;
                float rnd = random(vec2(seed, 30.0));
                float isVisible = step(1.0 - uDensity, rnd);

                // Base Lines: Always Main Color
                float gridAlpha = mix(uBaseOpacity, uShapeOpacity, vHeightNorm);
                vec3 finalColor = uColor1 * gridAlpha;

                // Signal: Can be Multi-color
                if (isVisible > 0.5) {
                    vec3 signalCol = getSignalColor(seed);
                    
                    float t = vUv.x * 4.0 - uTime * speed + offset;
                    float phase = fract(t);
                    float len = max(uTrailLength, 0.002);
                    float trailStart = 1.0 - len;
                    float trail = smoothstep(trailStart, 1.0, phase);
                    float brightness = pow(trail, 12.0) * 3.0; 
                    if(phase < trailStart) brightness = 0.0;
                    
                    finalColor += signalCol * brightness;
                }

                // Contour: Always Main Color
                if (uShapeOpacity > 0.01) {
                    float formGlow = smoothstep(0.1, 1.0, abs(vZ)) * 0.2;
                    finalColor += uColor1 * formGlow * uShapeOpacity;
                }

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        function createGeometry() {
            const numLines = CONFIG.linesCount;
            const segments = CONFIG.segments; 
            const width = 120; 
            const height = 18;
            
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const uvs = [];
            const indices = [];

            for (let i = 0; i < numLines; i++) {
                const y = (i / (numLines - 1)) * height - (height / 2);
                for (let j = 0; j <= segments; j++) {
                    const x = (j / segments) * width - (width / 2);
                    positions.push(x, y, 0);
                    uvs.push(j / segments, i / numLines);
                    if (j < segments) {
                        const idx = i * (segments + 1) + j;
                        indices.push(idx, idx + 1);
                    }
                }
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            return geometry;
        }

        const mesh = new THREE.LineSegments(
            createGeometry(),
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color(CONFIG.color1) },
                    uColor2: { value: new THREE.Color(CONFIG.color2) },
                    uColor3: { value: new THREE.Color(CONFIG.color3) },
                    uColor4: { value: new THREE.Color(CONFIG.color4) },
                    uActiveColors: { value: new THREE.Vector4(1, 0, 0, 0) },
                    
                    uShapeType: { value: CONFIG.shape },
                    uSize: { value: CONFIG.shapeSize },
                    uAmplitude: { value: CONFIG.amplitude },
                    uRotZ: { value: CONFIG.shapeRotZ },
                    uScaleX: { value: CONFIG.shapeScaleX },
                    
                    uTrailLength: { value: CONFIG.trailLength },
                    uBaseOpacity: { value: CONFIG.baseOpacity },
                    uShapeOpacity: { value: CONFIG.shapeOpacity },
                    uDensity: { value: CONFIG.signalDensity }
                },
                transparent: true,
                depthTest: false,
                blending: THREE.AdditiveBlending
            })
        );
        scene.add(mesh);

        // --- GUI ---
        const gui = new GUI({ container: document.getElementById('gui-container'), title: 'System Control' });
        
        const fScene = gui.addFolder('Scene');
        fScene.addColor(CONFIG, 'bgColor').name('Background').onChange(v => scene.background.set(v));
        fScene.add(CONFIG, 'sceneRotationY', -3.14, 3.14).name('Global Tilt Y').onChange(v => mesh.rotation.y = v);
        fScene.add(CONFIG, 'sceneRotationX', -2, 2).name('Global Tilt X').onChange(v => mesh.rotation.x = v);
        fScene.add(CONFIG, 'baseOpacity', 0.0, 0.5).name('Straight Opacity').onChange(v => mesh.material.uniforms.uBaseOpacity.value = v);
        fScene.add(CONFIG, 'shapeOpacity', 0.0, 1.0).name('Form Opacity').onChange(v => mesh.material.uniforms.uShapeOpacity.value = v);

        const shapes = { 
            'Sphere': 0, 'Box': 1, 'Pyramid': 2, 'Torus': 3, 
            'City Blocks': 4, 'Robot Head': 5, 
            'Hex Hive': 6, 'Turbine': 7, 'Circuit Board': 8, 
            'Mountain Terrain': 9, 'Spiral Galaxy': 10, 
            'Acoustic Wave': 11, 'Digital Rain': 12, 
            'Shield Dome': 13, 'Portal': 14, 'Abstract Data': 15,
            'Liquid Metal': 16, 'Voronoi Cells': 17, 'Pyramid Grid': 18,
            'Vortex (Sinkhole)': 19, 'Crystalline': 20, 'Glitch Noise': 21,
            'Ripple Pond': 22, 'Waffle Iron': 23, 'Stadium': 24, 'Black Hole': 25
        };
        const fGeo = gui.addFolder('Geometry');
        fGeo.add(CONFIG, 'shape', shapes).name('Form Type').onChange(v => mesh.material.uniforms.uShapeType.value = v);
        fGeo.add(CONFIG, 'shapeSize', 0.5, 10.0).name('Size').onChange(v => mesh.material.uniforms.uSize.value = v);
        fGeo.add(CONFIG, 'amplitude', 0.1, 5.0).name('Amplitude (Z)').onChange(v => mesh.material.uniforms.uAmplitude.value = v);
        fGeo.add(CONFIG, 'shapeRotZ', 0, 6.28).name('Rotate Z').onChange(v => mesh.material.uniforms.uRotZ.value = v);
        fGeo.add(CONFIG, 'shapeScaleX', 0.2, 3.0).name('Scale X').onChange(v => mesh.material.uniforms.uScaleX.value = v);

        const fSig = gui.addFolder('Signals');
        fSig.add(CONFIG, 'lineSpeed', 0.0, 1.0).name('Speed');
        fSig.add(CONFIG, 'signalDensity', 0.0, 1.0).name('Density').onChange(v => mesh.material.uniforms.uDensity.value = v);
        fSig.add(CONFIG, 'trailLength', 0.001, 0.5).name('Trail Length').onChange(v => mesh.material.uniforms.uTrailLength.value = v);

        const fColors = gui.addFolder('Signal Colors');
        function updateActiveColors() {
            mesh.material.uniforms.uActiveColors.value.set(
                1.0, CONFIG.useColor2 ? 1.0 : 0.0, CONFIG.useColor3 ? 1.0 : 0.0, CONFIG.useColor4 ? 1.0 : 0.0
            );
        }
        updateActiveColors();
        fColors.addColor(CONFIG, 'color1').name('Main Color').onChange(v => mesh.material.uniforms.uColor1.value.set(v));
        fColors.add(CONFIG, 'useColor2').name('Use Color 2').onChange(updateActiveColors);
        fColors.addColor(CONFIG, 'color2').name('Color 2').onChange(v => mesh.material.uniforms.uColor2.value.set(v));
        fColors.add(CONFIG, 'useColor3').name('Use Color 3').onChange(updateActiveColors);
        fColors.addColor(CONFIG, 'color3').name('Color 3').onChange(v => mesh.material.uniforms.uColor3.value.set(v));
        fColors.add(CONFIG, 'useColor4').name('Use Color 4').onChange(updateActiveColors);
        fColors.addColor(CONFIG, 'color4').name('Color 4').onChange(v => mesh.material.uniforms.uColor4.value.set(v));

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const dt = clock.getDelta();
            mesh.material.uniforms.uTime.value += dt * CONFIG.lineSpeed;
            controls.update();
            renderer.render(scene, camera);
        }
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        animate();