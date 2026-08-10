import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---- SCENE SETUP ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ---- CONTROLS ----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 3.0;
controls.maxDistance = 60.0;

// Initial position (POSTER mode)
camera.position.set(0, 7.6, 29.7);
controls.update();

// ---- SHADER MATERIAL ----
const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_cameraPos;
uniform vec3 u_cameraDir;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraRight;
uniform float u_fov;

// Hash and Noise functions for procedural generation
float hash(vec3 p) {
    p  = fract( p*0.3183099+.1 );
    p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}

float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix( hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)),f.x),
                   mix( hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)),f.x),
                   mix( hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

float fbm(vec3 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 4; i++) {
        f += w * noise(p);
        p *= 2.1;
        w *= 0.5;
    }
    return f;
}

void main() {
    // Normalized screen coordinates
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y;

    // Ray generation
    float fov = tan(radians(u_fov) / 2.0);
    vec3 ro = u_cameraPos;
    vec3 rd = normalize(u_cameraDir + uv.x * fov * u_cameraRight + uv.y * fov * u_cameraUp);

    // Black Hole Parameters
    const float RS = 1.0; // Schwarzschild radius
    const int MAX_STEPS = 400; // Geodesic steps
    
    vec3 p = ro;
    vec3 v = rd;
    float dt = 0.05;
    
    vec3 col = vec3(0.0);
    float alpha = 1.0;
    
    for(int i = 0; i < MAX_STEPS; i++) {
        float r2 = dot(p, p);
        float r = sqrt(r2);
        
        // Event Horizon boundary
        if (r < RS * 1.02) {
            break;
        }
        
        // Escape boundary (Background Stars)
        if (r > 60.0) {
            float st = pow(fbm(v * 40.0), 6.0) * 1.5;
            // Milky way band effect based on y-coordinate
            float band = smoothstep(0.4, 0.0, abs(v.y));
            vec3 starCol = mix(vec3(1.0, 0.8, 0.6), vec3(0.5, 0.7, 1.0), noise(v * 10.0));
            col += starCol * st * (1.0 + band * 2.0) * alpha;
            break;
        }
        
        // Accretion Disk (Thin disk on XZ plane, y=0)
        float dToPlane = abs(p.y);
        if (dToPlane < 0.15 && r > 2.5 && r < 14.0) {
            // Disk structure
            float density = smoothstep(0.15, 0.0, dToPlane);
            density *= smoothstep(2.5, 3.5, r) * smoothstep(14.0, 10.0, r);
            
            // Procedural noise / Swirl
            float angle = atan(p.z, p.x);
            float swirl = angle - u_time * (2.0 / sqrt(r)); // Keplerian velocity approximation
            float n = fbm(vec3(r * 2.0, swirl * 4.0, 0.0));
            density *= (n * 0.8 + 0.2);
            
            // Temperature Gradient (Hotter near center)
            vec3 hot = vec3(1.0, 0.95, 0.8);
            vec3 cold = vec3(0.85, 0.4, 0.1);
            vec3 diskCol = mix(cold, hot, smoothstep(14.0, 2.5, r));
            
            // Relativistic Doppler Beaming
            vec3 diskVel = normalize(vec3(-p.z, 0.0, p.x)); // Counter-clockwise rotation
            float doppler = 1.0 + dot(v, diskVel) * 0.5; // Relativistic redshift/blueshift
            doppler = pow(doppler, 4.0); // Boost effect
            
            // Emission
            vec3 emission = diskCol * density * doppler * 8.0 * dt;
            
            col += emission * alpha;
            alpha *= (1.0 - density * 2.0 * dt); // Absorption
            
            if (alpha < 0.01) break;
        }
        
        // Gravitational Lensing (Null Geodesic Equation in Cartesian)
        // a = -1.5 * RS * |L|^2 / r^5 * r_vec
        vec3 L = cross(p, v);
        vec3 accel = -1.5 * RS * dot(L, L) * p / (r2 * r2 * r);
        
        v = normalize(v + accel * dt);
        p += v * dt;
        
        // Adaptive step size (slow down near the accretion disk plane to avoid skipping)
        dt = min(max(0.01, r * 0.02), dToPlane * 0.5 + 0.01);
    }
    
    // ACES Film Tone Mapping
    col = col * 0.6; // Exposure
    col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
    
    // Gamma correction
    col = pow(col, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_cameraPos: { value: new THREE.Vector3() },
    u_cameraDir: { value: new THREE.Vector3() },
    u_cameraUp: { value: new THREE.Vector3() },
    u_cameraRight: { value: new THREE.Vector3() },
    u_fov: { value: camera.fov }
};

const planeGeo = new THREE.PlaneGeometry(2, 2);
const blackHoleMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    depthTest: false
});

const quad = new THREE.Mesh(planeGeo, blackHoleMat);
const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(quad);

// ---- UI LOGIC & EVENTS ----

// Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// UI Elements
const statDist = document.getElementById('stat-dist');
const statIncl = document.getElementById('stat-incl');
const statFps = document.getElementById('stat-fps');
const timerEl = document.getElementById('timer');
const uiLayer = document.getElementById('ui-layer');

let isHUDVisible = true;
let isCinematic = true;
let autoOrbit = true;

// Camera Mode Buttons
document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const mode = e.target.dataset.mode;
        if (mode === 'poster') camera.position.set(0, 7.6, 29.7);
        if (mode === 'edge') camera.position.set(0, 0.5, 25.0);
        if (mode === 'polar') camera.position.set(0, 20.0, 0.1);
        if (mode === 'close') camera.position.set(0, 1.5, 6.0);

        controls.update();
    });
});

// Toggle Buttons
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const t = e.target.dataset.toggle;

        if (t === 'hud') {
            isHUDVisible = !isHUDVisible;
            // Hide everything except the HUD button itself? 
            // Or just fade out the main UI but keep a tiny button to restore.
            // For simplicity, we toggle opacity on the parent, but wait, the button is inside.
            // Let's just toggle visibility of params-panel and headers.
            document.querySelector('header').style.opacity = isHUDVisible ? '1' : '0';
            document.getElementById('params-panel').style.opacity = isHUDVisible ? '1' : '0';
            e.target.classList.toggle('active');
        }

        if (t === 'auto') {
            autoOrbit = !autoOrbit;
            e.target.classList.toggle('active');
        }

        if (t === 'cine') {
            isCinematic = !isCinematic;
            e.target.classList.toggle('active');
            // Mock changing render profile
            document.getElementById('stat-profile').textContent = isCinematic ? 'CINEMATIC' : 'PERFORMANCE';
            // In a real app we might reduce MAX_STEPS here via uniform
        }

        if (t === 'sound') {
            const isActive = e.target.classList.contains('active');
            if (isActive) {
                e.target.classList.remove('active');
                e.target.textContent = '[SOUND: OFF]';
            } else {
                e.target.classList.add('active');
                e.target.textContent = '[SOUND: ON]';
            }
        }
    });
});

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === '1') document.querySelector('[data-mode="poster"]').click();
    if (key === '2') document.querySelector('[data-mode="edge"]').click();
    if (key === '3') document.querySelector('[data-mode="polar"]').click();
    if (key === '4') document.querySelector('[data-mode="close"]').click();
    if (key === 'c') document.querySelector('[data-toggle="cine"]').click();
    if (key === 'h') document.querySelector('[data-toggle="hud"]').click();
    if (key === 'r') document.querySelector('[data-toggle="auto"]').click();
    if (key === 'm') document.querySelector('[data-toggle="sound"]').click();
});

// Mission Timer
let startTime = Date.now() - 28000; // Start at 00:00:28
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
}
setInterval(updateTimer, 1000);

// ---- RENDER LOOP ----
const clock = new THREE.Clock();
let frames = 0;
let lastFpsTime = 0;

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Auto Orbit
    if (autoOrbit) {
        // Slowly rotate camera around origin
        const radius = Math.hypot(camera.position.x, camera.position.z);
        const currentAngle = Math.atan2(camera.position.z, camera.position.x);
        const newAngle = currentAngle + delta * 0.05;
        camera.position.x = Math.cos(newAngle) * radius;
        camera.position.z = Math.sin(newAngle) * radius;
        camera.lookAt(0, 0, 0);
    }

    controls.update();

    // Update Uniforms
    uniforms.u_time.value = time;
    camera.getWorldPosition(uniforms.u_cameraPos.value);
    camera.getWorldDirection(uniforms.u_cameraDir.value);
    uniforms.u_cameraUp.value.copy(camera.up).applyQuaternion(camera.quaternion);
    uniforms.u_cameraRight.value.crossVectors(uniforms.u_cameraDir.value, uniforms.u_cameraUp.value);

    // Update Stats UI
    const dist = camera.position.length();
    statDist.textContent = dist.toFixed(2);

    // Inclination: angle from XZ plane
    const incl = Math.abs(90 - THREE.MathUtils.radToDeg(camera.position.angleTo(new THREE.Vector3(0, 1, 0))));
    statIncl.textContent = incl.toFixed(1);

    // FPS Counter
    frames++;
    if (time - lastFpsTime >= 1.0) {
        statFps.textContent = frames;
        frames = 0;
        lastFpsTime = time;
    }

    renderer.render(postScene, postCamera);
}

// Start
animate();
console.log("Made by Gemini")