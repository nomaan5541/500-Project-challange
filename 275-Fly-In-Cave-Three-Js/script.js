import * as THREE from 'three';
    import { createNoise2D } from 'simplex-noise';
    import GUI from 'lil-gui';

    // === CONFIGURATION ===
    const params = {
        speed: 6.0,
        showCeiling: true, 
        
        // Terrain settings
        scale: 30.0,           
        heightMultiplier: 3.6, 
        detailStrength: 0.27,   
        valleyWidth: 25.0,     
        
        // Visuals
        flatShading: false,
        wireframe: false,
        
        // Colors
        bgColor: '#b6c2cc',
        fogDensity: 0.0104,
        groundColor: '#1a1a1a',
        ceilingColor: '#5e6a75',
        
        // Lighting
        ambientInt: 0.6,
        camLightInt: 1.5
    };

    // === SCENE INIT ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(params.bgColor);
    scene.fog = new THREE.FogExp2(params.bgColor, params.fogDensity);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 0, 40);

    // Renderer setup with high precision and dithering support to fix banding
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    // === LIGHTING ===
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, params.ambientInt);
    scene.add(hemiLight);

    const camLight = new THREE.PointLight(0xffaa00, params.camLightInt, 120, 1.5);
    scene.add(camLight);

    // === NOISE & GEOMETRY ===
    const noise2D = createNoise2D();

    const CHUNK_WIDTH = 250; 
    const CHUNK_LENGTH = 60; 
    const SEGMENTS_W = 100; 
    const SEGMENTS_L = 30; 
    const CHUNK_COUNT = 6; 

    const chunks = [];

    /**
     * Calculates precise height for any coordinate.
     */
    function getElevation(x, z, isTop) {
        // Offset for top to ensure unique look
        const offset = isTop ? 9999 : 0; 
        
        // 1. Main Mountains
        let y = noise2D((x + offset) / params.scale, (z + offset) / params.scale) * params.heightMultiplier;
        
        // 2. Fine Detail
        const detailScale = params.scale * 0.4;
        y += noise2D((x + offset) / detailScale, (z + offset) / detailScale) * (params.heightMultiplier * params.detailStrength);

        // 3. Valley Curve (Clear center)
        const dist = Math.abs(x);
        const valley = Math.pow(dist / params.valleyWidth, 2.5);
        y += valley;

        return y;
    }

    /**
     * Creates the mesh group.
     */
    function createChunk(index) {
        const geometry = new THREE.PlaneGeometry(CHUNK_WIDTH, CHUNK_LENGTH, SEGMENTS_W, SEGMENTS_L);
        geometry.rotateX(-Math.PI / 2); // Lay flat

        // Material with Dithering enabled to prevent color banding
        const matGround = new THREE.MeshStandardMaterial({
            color: params.groundColor,
            roughness: 0.9,
            flatShading: params.flatShading,
            wireframe: params.wireframe,
            side: THREE.DoubleSide,
            dithering: true // Fixes gradient banding
        });

        const matCeil = new THREE.MeshStandardMaterial({
            color: params.ceilingColor,
            roughness: 0.9,
            flatShading: params.flatShading,
            wireframe: params.wireframe,
            side: THREE.DoubleSide,
            dithering: true // Fixes gradient banding
        });

        const meshGround = new THREE.Mesh(geometry.clone(), matGround);
        const meshCeil = new THREE.Mesh(geometry.clone(), matCeil);
        
        meshCeil.visible = params.showCeiling;

        const group = new THREE.Group();
        group.add(meshGround);
        group.add(meshCeil);

        // Store index to calculate exact position later
        group.userData = { 
            meshGround, 
            meshCeil,
            index: index 
        };

        return group;
    }

    /**
     * Updates geometry based on strict world coordinates.
     */
    function updateChunk(chunk) {
        // Calculate Z based on index to ensure perfect seam
        const zPosition = chunk.userData.index * -CHUNK_LENGTH;
        chunk.position.z = zPosition;

        const geoG = chunk.userData.meshGround.geometry;
        const posG = geoG.attributes.position;
        
        const geoC = chunk.userData.meshCeil.geometry;
        const posC = geoC.attributes.position;

        for (let i = 0; i < posG.count; i++) {
            const x = posG.getX(i);
            
            // Get local Z (depth relative to chunk center)
            const localZ = posG.getZ(i);
            // Calculate exact World Z
            const worldZ = zPosition + localZ;

            // --- GROUND ---
            const hGround = getElevation(x, worldZ, false);
            posG.setY(i, -5 + hGround);

            // --- CEILING ---
            const hCeil = getElevation(x, worldZ, true);
            posC.setY(i, 5 - hCeil);
        }

        posG.needsUpdate = true;
        geoG.computeVertexNormals();

        posC.needsUpdate = true;
        geoC.computeVertexNormals();
    }

    // === INITIALIZATION ===
    for(let i = 0; i < CHUNK_COUNT; i++) {
        const chunk = createChunk(i);
        updateChunk(chunk);
        chunks.push(chunk);
        scene.add(chunk);
    }

    // === ANIMATION LOOP ===
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const dt = clock.getDelta();
        
        // Move camera
        camera.position.z -= params.speed * dt;
        camLight.position.copy(camera.position);

        // Logic to recycle chunks
        // We move in -Z. Chunks with higher index (more negative Z) are in front.
        // We look for the chunk furthest behind the camera.
        
        // Find current max index to know where to place recycled chunk
        let maxIndex = 0;
        chunks.forEach(c => { if (c.userData.index > maxIndex) maxIndex = c.userData.index; });

        chunks.forEach(chunk => {
             // If chunk is fully behind camera
             if (chunk.position.z > camera.position.z + CHUNK_LENGTH) {
                 // Move to the front by assigning next index
                 chunk.userData.index = maxIndex + 1;
                 maxIndex++; 
                 updateChunk(chunk);
             }
        });

        renderer.render(scene, camera);
    }

    animate();

    // === GUI ===
    const gui = new GUI({ container: document.getElementById('gui-container'), width: 320 });
    gui.title("Tunnel Controls");

    const f1 = gui.addFolder('Flight');
    f1.add(params, 'speed', 0, 50).name('Speed');

    const f2 = gui.addFolder('Visuals');
    f2.add(params, 'showCeiling').name('Show Ceiling').onChange(v => {
        chunks.forEach(c => c.userData.meshCeil.visible = v);
    });
    f2.add(params, 'flatShading').name('Flat Shading').onChange(v => {
        chunks.forEach(c => {
            c.userData.meshGround.material.flatShading = v;
            c.userData.meshGround.material.needsUpdate = true;
            c.userData.meshCeil.material.flatShading = v;
            c.userData.meshCeil.material.needsUpdate = true;
        });
        chunks.forEach(c => updateChunk(c));
    });
    f2.add(params, 'wireframe').name('Wireframe').onChange(v => {
        chunks.forEach(c => {
            c.userData.meshGround.material.wireframe = v;
            c.userData.meshCeil.material.wireframe = v;
        });
    });

    const f3 = gui.addFolder('Terrain Generator');
    const refresh = () => chunks.forEach(c => updateChunk(c));
    f3.add(params, 'scale', 10, 150).name('Noise Scale').onChange(refresh);
    f3.add(params, 'heightMultiplier', 1, 20).name('Height').onChange(refresh);
    f3.add(params, 'detailStrength', 0, 1).name('Detail').onChange(refresh);
    f3.add(params, 'valleyWidth', 5, 50).name('Valley Width').onChange(refresh);

    const f4 = gui.addFolder('Colors & Atmosphere');
    const updateColors = () => {
        scene.background.set(params.bgColor);
        scene.fog.color.set(params.bgColor);
        scene.fog.density = params.fogDensity;
        hemiLight.intensity = params.ambientInt;
        camLight.intensity = params.camLightInt;
        chunks.forEach(c => {
            c.userData.meshGround.material.color.set(params.groundColor);
            c.userData.meshCeil.material.color.set(params.ceilingColor);
        });
    };
    f4.addColor(params, 'bgColor').name('Background').onChange(updateColors);
    f4.addColor(params, 'groundColor').name('Ground Color').onChange(updateColors);
    f4.addColor(params, 'ceilingColor').name('Ceiling Color').onChange(updateColors);
    f4.add(params, 'fogDensity', 0, 0.1).name('Fog Density').onChange(updateColors);
    f4.add(params, 'camLightInt', 0, 3).name('Light Intensity').onChange(updateColors);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });