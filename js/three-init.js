/**
 * Three.js initialization and setup
 * For creating 3D backgrounds or interactive elements
 */

// Constants
const PARTICLE_COUNT = 1000;
const PARTICLE_DISTANCE = 80;
const CAMERA_DISTANCE = 300;

// Variables
let camera, scene, renderer;
let particles, container;
let animationFrameId;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

/**
 * Initialize Three.js scene
 * @param {string} containerId - The ID of the container element
 */
export function init(containerId = 'three-container') {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js library not loaded. 3D effects will not work.');
        return false;
    }
    
    container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container element with ID "${containerId}" not found.`);
        return false;
    }
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = CAMERA_DISTANCE;
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    
    const textureLoader = new THREE.TextureLoader();
    const sprite = textureLoader.load('assets/images/particle.png');
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * 2 * PARTICLE_DISTANCE - PARTICLE_DISTANCE;
        const y = Math.random() * 2 * PARTICLE_DISTANCE - PARTICLE_DISTANCE;
        const z = Math.random() * 2 * PARTICLE_DISTANCE - PARTICLE_DISTANCE;
        
        vertices.push(x, y, z);
        sizes.push(20);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        color: 0x3b82f6 // Blue color
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    return true;
}

/**
 * Start the animation loop
 */
export function animate() {
    animationFrameId = requestAnimationFrame(animate);
    render();
}

/**
 * Stop the animation loop
 */
export function stop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', onDocumentMouseMove);
    window.removeEventListener('resize', onWindowResize);
    
    // Remove renderer from DOM
    if (container && renderer) {
        container.removeChild(renderer.domElement);
    }
    
    // Clean up resources
    if (particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
    }
    
    scene = null;
    camera = null;
    renderer = null;
    particles = null;
}

/**
 * Handle window resize
 */
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Handle mouse movement
 * @param {Event} event - The mouse event
 */
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

/**
 * Render the scene
 */
function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}

/**
 * Create a 3D background for a page
 * @param {string} containerId - The ID of the container element
 * @returns {boolean} - Whether initialization was successful
 */
export function createBackground(containerId) {
    // Create container if it doesn't exist
    if (!document.getElementById(containerId)) {
        const container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }
    
    // Initialize Three.js
    const success = init(containerId);
    
    if (success) {
        animate();
    }
    
    return success;
}
