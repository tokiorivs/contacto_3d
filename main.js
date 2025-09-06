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

// 4. Crear las partículas de estrellas
const starCount = 9000; // Número de estrellas
const positions = new Float32Array(starCount * 3); // Cada partícula tiene 3 coordenadas (x, y, z)
const colors = new Float32Array(starCount * 3); // Array para los colores (r, g, b)
const starSizes = new Float32Array(starCount); // Array para los tamaños

// Paleta de colores para las estrellas
const colorPalette = [
    new THREE.Color(0xffff00), // Amarillo
    new THREE.Color(0x00aaff), // Azul
    new THREE.Color(0xff00ff)  // Rosa
];

for (let i = 0; i < starCount; i++) {
    // Posición inicial aleatoria
    positions[i * 3] = (Math.random() - 0.5) * 80; // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;    // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80; // Z
    
    // Asignar un color aleatorio de la paleta
    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = randomColor.r;
    colors[i * 3 + 1] = randomColor.g;
    colors[i * 3 + 2] = randomColor.b;

    // Asignar un tamaño aleatorio
    starSizes[i] = Math.random() * 0.8 + 0.1;
}

const rainGeometry = new THREE.BufferGeometry();
rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
rainGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
rainGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

// Función para crear una textura de círculo
const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    const size = 64; // Aumentamos el tamaño para más detalle en el degradado
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    const center = size / 2;

    // Crear un degradado radial (el "blur")
    const gradient = context.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');   // Centro blanco opaco
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)'); // Borde interior del resplandor
    gradient.addColorStop(1, 'rgba(255,255,255,0)');     // Borde exterior totalmente transparente

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center, center, center, 0, 2 * Math.PI);
    context.fill();

    return new THREE.CanvasTexture(canvas);
};

const circleTexture = createCircleTexture();

const rainMaterial = new THREE.PointsMaterial({
    size: 0.1, // El tamaño base se multiplicará por el atributo 'size'
    transparent: true,
    vertexColors: true, // ¡Importante! Habilita los colores por vértice
    sizeAttenuation: true, // Hace que las partículas lejanas se vean más pequeñas
    map: circleTexture, // Usa la textura de círculo
    blending: THREE.AdditiveBlending, // Mezcla aditiva para un efecto de brillo
    depthWrite: false // Evita que las partículas se oculten entre sí de forma extraña
});

const stars = new THREE.Points(rainGeometry, rainMaterial);
scene.add(stars);

// 5. Animación
const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Hacer que las estrellas titilen cambiando la opacidad
    stars.material.opacity = 0.5 + Math.sin(elapsedTime * 0.5) * 0.2;

    // Movimiento de deriva lento y constante
    stars.rotation.y = elapsedTime * 0.02;

    // Renderizar la escena
    renderer.render(scene, camera);

    // Llamar a animate en el siguiente frame
    window.requestAnimationFrame(animate);
};

animate();