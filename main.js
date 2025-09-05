import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// 1. Configuración básica de la escena
const scene = new THREE.Scene();
const container = document.querySelector('.main-container');
const canvas = document.getElementById('bg-canvas');

const sizes = {
    width: container.clientWidth,
    height: container.clientHeight
};

// 2. Cámara
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 30; // Ajustamos la posición de la cámara para ver las partículas
scene.add(camera);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Crear las partículas de lluvia
const rainCount = 10000; // Número de gotas de lluvia
const positions = new Float32Array(rainCount * 3); // Cada partícula tiene 3 coordenadas (x, y, z)

for (let i = 0; i < rainCount * 3; i++) {
    // Posición inicial aleatoria
    positions[i * 3] = (Math.random() - 0.5) * 60; // X
    positions[i * 3 + 1] = Math.random() * 100;    // Y (altura)
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z (profundidad)
}

const rainGeometry = new THREE.BufferGeometry();
rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.05,
    transparent: true,
    opacity: 0.7
});

const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

// 5. Animación
const animate = () => {
    // Mover las partículas
    const positions = rain.geometry.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
        // Bajar la gota de lluvia
        positions[i * 3 + 1] -= 0.2; // Velocidad de caída
        
        // Si la gota llega al "suelo" (fuera de la vista), la reiniciamos arriba
        if (positions[i * 3 + 1] < -50) {
            positions[i * 3 + 1] = 50;
        }
    }
    rain.geometry.attributes.position.needsUpdate = true; // ¡Importante! Notifica a Three.js que las posiciones han cambiado

    // Renderizar la escena
    renderer.render(scene, camera);

    // Llamar a animate en el siguiente frame
    window.requestAnimationFrame(animate);
};

animate();