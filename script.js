// === Создаём сцену ===
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;

// Рендер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Свет
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);

// === Объекты ===
// Куб
const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({
  color: 0x00fff7,
  metalness: 0.4,
  roughness: 0.3
});
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

// Сфера
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0x0088ff,
  metalness: 0.5,
  roughness: 0.2
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.x = 2;
scene.add(sphere);

// === Текст (3D буквы) ===
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', font => {
  const textGeo = new THREE.TextGeometry('ONEIX', {
    font: font,
    size: 0.8,
    height: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5
  });
  const textMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4 });
  const textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-2.2, -1, 0);
  scene.add(textMesh);

  // === Анимация взрыва букв ===
  anime({
    targets: textMesh.position,
    y: [-1, 1, -1],
    duration: 3000,
    easing: 'easeInOutSine',
    loop: true
  });

  anime({
    targets: textMesh.rotation,
    y: [0, Math.PI * 2],
    duration: 6000,
    easing: 'easeInOutQuad',
    loop: true
  });
});

// === Анимации ===
anime({
  targets: cube.rotation,
  x: [0, Math.PI * 2],
  y: [0, Math.PI * 2],
  duration: 4000,
  easing: 'easeInOutSine',
  loop: true,
  direction: 'alternate'
});

anime({
  targets: sphere.position,
  y: [0, 1, 0],
  x: [2, -2, 2],
  duration: 5000,
  easing: 'easeInOutQuad',
  loop: true
});

// === Цикл рендера ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// === Адаптация под размер окна ===
window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
