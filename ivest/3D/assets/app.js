// ============================================================
// LOADER
// ============================================================
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const loader = document.getElementById('loader');
let loadPct = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 4 + 1;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loadInterval); }
  loaderBar.style.width = loadPct + '%';
  loaderPct.textContent = Math.floor(loadPct) + '%';
}, 60);


// ============================================================
// CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
});
function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx - 18 + 'px';
  cursorRing.style.top = ry - 18 + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();


// ============================================================
// THREE.JS SCENE
// ============================================================
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // прозрачный, фон дадим картинкой
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


// ============================================================
// BACKGROUND TEXTURE
// ============================================================
// картинка: invest/3D/assets/img/Back.png
{
  const loaderTex = new THREE.TextureLoader();
  const bgTexture = loaderTex.load('invest/3D/assets/img/Back.png');
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTexture;
}


// ============================================================
// MATERIALS (более "авиа")
// ============================================================
const hullMat = new THREE.MeshPhysicalMaterial({
  color: 0x151a22,
  metalness: 0.5,
  roughness: 0.25,
  clearcoat: 0.9,
  clearcoatRoughness: 0.15
});

const hullAccentMat = new THREE.MeshPhysicalMaterial({
  color: 0x1f2a38,
  metalness: 0.65,
  roughness: 0.18,
  clearcoat: 1,
  clearcoatRoughness: 0.08
});

const carbonMat = new THREE.MeshStandardMaterial({
  color: 0x101318,
  metalness: 0.7,
  roughness: 0.35
});

const metalMat = new THREE.MeshStandardMaterial({
  color: 0x6b7584,
  metalness: 1.0,
  roughness: 0.22
});

const propMat = new THREE.MeshStandardMaterial({
  color: 0x1b2230,
  metalness: 0.7,
  roughness: 0.35,
  transparent: true,
  opacity: 0.9
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x7fd9ff,
  transmission: 0.6,
  transparent: true,
  opacity: 0.5,
  roughness: 0.05,
  metalness: 0,
  thickness: 0.2
});

const ledMat = new THREE.MeshStandardMaterial({
  color: 0x20e0ff,
  emissive: 0x20e0ff,
  emissiveIntensity: 1.0,
  metalness: 0.3,
  roughness: 0.3
});


// вспомогательный spline‑корпус
function makeLoftedHull() {
  const points = [];
  const len = 2.4; // длина корпуса
  const segs = 24;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const x = -len / 2 + t * len;
    // профиль ширины/высоты по длине (чуть как самолет)
    const width = 0.45 + Math.sin(t * Math.PI) * 0.25;
    const height = 0.28 + Math.sin(t * Math.PI) * 0.12;
    points.push({ x, width, height });
  }

  const geo = new THREE.BufferGeometry();
  const radialSeg = 18;
  const verts = [];
  const normals = [];
  const uvs = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    for (let j = 0; j <= radialSeg; j++) {
      const a = (j / radialSeg) * Math.PI * 2;
      const y = Math.sin(a) * p.height;
      const z = Math.cos(a) * p.width;
      verts.push(p.x, y, z);
      normals.push(0, Math.sign(y), Math.sign(z));
      uvs.push(i / (points.length - 1), j / radialSeg);
    }
  }

  // индексы
  const idx = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < radialSeg; j++) {
      const a = i * (radialSeg + 1) + j;
      const b = a + radialSeg + 1;
      idx.push(a, b, a + 1);
      idx.push(b, b + 1, a + 1);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}


// ============================================================
// DRONE CONSTRUCTION (aэродинамичный)
// ============================================================
const droneGroup = new THREE.Group();
scene.add(droneGroup);

// основной фюзеляж
const hull = new THREE.Mesh(makeLoftedHull(), hullMat);
droneGroup.add(hull);

// верхняя "спинка"
const dorsal = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.22, 1.2, 10, 24),
  hullAccentMat
);
dorsal.rotation.z = Math.PI / 2;
dorsal.scale.set(1, 0.7, 0.7);
dorsal.position.set(0.1, 0.23, 0);
droneGroup.add(dorsal);

// носовая "кокпит" область
const nose = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 24, 16),
  hullAccentMat
);
nose.scale.set(1.3, 0.8, 0.75);
nose.position.set(1.1, 0.06, 0);
droneGroup.add(nose);

// хвостовой конус
const tail = new THREE.Mesh(
  new THREE.CylinderGeometry(0.0, 0.18, 0.6, 14),
  carbonMat
);
tail.rotation.z = Math.PI / 2;
tail.position.set(-1.25, 0.02, 0);
droneGroup.add(tail);

// вертикальный стабилизатор
const vFin = new THREE.Mesh(
  new THREE.BoxGeometry(0.05, 0.45, 0.7),
  carbonMat
);
vFin.position.set(-1.0, 0.32, 0);
droneGroup.add(vFin);

// горизонтальный стабилизатор
const hFin = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.04, 1.1),
  carbonMat
);
hFin.position.set(-0.95, 0.05, 0);
droneGroup.add(hFin);

// камера/гимбал под носом
const gimbal = new THREE.Group();
gimbal.position.set(0.95, -0.18, 0);

const gArm = new THREE.Mesh(
  new THREE.TorusGeometry(0.14, 0.015, 10, 28),
  metalMat
);
gArm.rotation.y = Math.PI / 2;
gimbal.add(gArm);

const camBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.28, 0.2, 0.22),
  carbonMat
);
camBody.position.set(0.12, 0, 0);
gimbal.add(camBody);

const camLens = new THREE.Mesh(
  new THREE.CylinderGeometry(0.06, 0.06, 0.1, 20),
  glassMat
);
camLens.rotation.z = Math.PI / 2;
camLens.position.set(0.22, 0, 0);
gimbal.add(camLens);

droneGroup.add(gimbal);

// грузовой отсек (низ)
const cargoBay = new THREE.Mesh(
  new THREE.BoxGeometry(1.1, 0.3, 0.7),
  carbonMat
);
cargoBay.position.set(0, -0.32, 0);
droneGroup.add(cargoBay);

// LED‑полоса вдоль борта
const ledStrip = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 0.03, 0.03),
  ledMat
);
ledStrip.position.set(0, -0.2, 0.41);
droneGroup.add(ledStrip);


// ARMS + ROTORS
const armDefs = [
  { key: 'frontRight', side:  1, front:  1 },
  { key: 'rearRight',  side:  1, front: -1 },
  { key: 'frontLeft',  side: -1, front:  1 },
  { key: 'rearLeft',   side: -1, front: -1 }
];

const rotors = [];

armDefs.forEach((cfg, i) => {
  const armGroup = new THREE.Group();

  const armLen = 1.8;
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, armLen, 12),
    carbonMat
  );
  arm.rotation.z = Math.PI / 2;
  armGroup.add(arm);

  // поворот по диагонали
  const angle = Math.atan2(cfg.side, cfg.front);
  armGroup.rotation.y = angle;
  armGroup.position.set(0.3 * cfg.front, 0.03, 0.25 * cfg.side);

  // моторный блок
  const motorGroup = new THREE.Group();
  motorGroup.position.set(armLen / 2, 0, 0); // конец цилиндра по X (в локале)

  const motor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.18, 18),
    metalMat
  );
  motor.rotation.z = Math.PI / 2;
  motorGroup.add(motor);

  const motorCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.06, 18),
    carbonMat
  );
  motorCap.rotation.z = Math.PI / 2;
  motorCap.position.x = 0.12;
  motorGroup.add(motorCap);

  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.015, 12, 40),
    ledMat
  );
  glowRing.rotation.y = Math.PI / 2;
  glowRing.position.set(0.02, 0.02, 0);
  motorGroup.add(glowRing);

  // пропеллер
  const propGroup = new THREE.Group();
  propGroup.position.set(0.18, 0, 0);

  for (let b = 0; b < 2; b++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.015, 0.08),
      propMat
    );
    blade.rotation.x = Math.PI / 12;
    blade.rotation.z = b * Math.PI / 2;
    propGroup.add(blade);
  }

  motorGroup.add(propGroup);
  armGroup.add(motorGroup);
  droneGroup.add(armGroup);

  rotors.push({ group: propGroup, dir: i % 2 === 0 ? 1 : -1 });
});

// посадочные стойки
[-0.5, 0.5].forEach(z => {
  [-0.7, 0.7].forEach(x => {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6),
      carbonMat
    );
    leg.position.set(x, -0.45, z);
    droneGroup.add(leg);

    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.03, 0.06),
      ledMat
    );
    foot.position.set(x, -0.72, z);
    droneGroup.add(foot);
  });
});


// ============================================================
// LIGHTING
// ============================================================
const rimLight = new THREE.DirectionalLight(0x00e5ff, 3.0);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(0x7b2fff, 1.5);
fillLight.position.set(5, -2, 3);
scene.add(fillLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(2, 8, 2);
keyLight.castShadow = true;
scene.add(keyLight);

const ambientLight = new THREE.AmbientLight(0x05050f, 2.0);
scene.add(ambientLight);

const bounceLight = new THREE.PointLight(0x00e5ff, 2, 10);
bounceLight.position.set(0, -2, 0);
scene.add(bounceLight);

const moonLight = new THREE.DirectionalLight(0x8899cc, 0.6);
moonLight.position.set(0, 20, -10);
scene.add(moonLight);

// лёгкий туман
scene.fog = new THREE.FogExp2(0x03030c, 0.008);


// ============================================================
// PARTICLES
// ============================================================
const partGeo = new THREE.BufferGeometry();
const partCount = 600;
const partPos = new Float32Array(partCount * 3);
const partVel = new Float32Array(partCount * 3);
for (let i = 0; i < partCount; i++) {
  partPos[i*3]   = (Math.random() - 0.5) * 80;
  partPos[i*3+1] = Math.random() * 25 - 2;
  partPos[i*3+2] = (Math.random() - 0.5) * 80;
  partVel[i*3]   = (Math.random() - 0.5) * 0.01;
  partVel[i*3+1] = Math.random() * 0.004;
  partVel[i*3+2] = (Math.random() - 0.5) * 0.01;
}
partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
const particles = new THREE.Points(
  partGeo,
  new THREE.PointsMaterial({
    color: 0x88aaff,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  })
);
scene.add(particles);


// ============================================================
// STATE
// ============================================================
let introPhase = 0; // 0=loading, 1=rear, 2=fly-in, 3=scroll
let introT = 0;
let scrollY = 0;
let time = 0;

camera.position.set(-6, 2, -1.5);
camera.lookAt(0, 0, 0);

// запускаем интро после лоадера
setTimeout(() => {
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 800);
  introPhase = 1;
}, 3200);


// ============================================================
// SCROLL STORY PANELS
// ============================================================
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  updatePanels();
  updateScrollDots();
});

function updatePanels() {
  const storyEl = document.getElementById('scroll-story');
  if (!storyEl) return;
  const storyTop = storyEl.offsetTop;
  const storyH = storyEl.offsetHeight;
  const viewH = window.innerHeight;
  const progress = Math.max(
    0,
    Math.min(1, (scrollY - storyTop) / Math.max(1, storyH - viewH))
  );
  const panelIdx = Math.min(3, Math.floor(progress * 4));
  document.querySelectorAll('.story-panel').forEach((p, i) => {
    p.classList.toggle('active', i === panelIdx);
  });
}

function updateScrollDots() {
  const storyEl = document.getElementById('scroll-story');
  if (!storyEl) return;
  const storyTop = storyEl.offsetTop;
  const storyH = storyEl.offsetHeight;
  const progress = Math.max(
    0,
    Math.min(1, (scrollY - storyTop) / Math.max(1, storyH - window.innerHeight))
  );
  const idx = Math.min(3, Math.floor(progress * 4));
  document.querySelectorAll('.progress-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}


// ============================================================
// RENDER LOOP
// ============================================================
function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  // ротора
  rotors.forEach(r => {
    r.group.rotation.x += r.dir * 0.45;
  });

  // частицы
  const posArr = partGeo.attributes.position.array;
  for (let i = 0; i < partCount; i++) {
    posArr[i*3]   += partVel[i*3];
    posArr[i*3+1] += partVel[i*3+1];
    posArr[i*3+2] += partVel[i*3+2];
    if (posArr[i*3+1] > 22) posArr[i*3+1] = -2;
  }
  partGeo.attributes.position.needsUpdate = true;

  // LED pulse
  ledStrip.material.emissiveIntensity = 0.7 + Math.sin(time * 4) * 0.3;
  bounceLight.intensity = 1.8 + Math.sin(time * 3) * 0.4;

  // интро / скролл
  if (introPhase === 1) {
    introT += 0.008;
    camera.position.set(
      -6 + introT * 0.5,
      2 - introT * 0.3,
      -1.5 + Math.sin(introT * 0.5) * 0.3
    );
    camera.lookAt(0, 0, 0);
    droneGroup.rotation.y = introT * 0.3;
    if (introT > 2.5) {
      introPhase = 2;
      introT = 0;
    }
  } else if (introPhase === 2) {
    introT += 0.015;
    const t = Math.min(1, introT);
    const ease = 1 - Math.pow(1 - t, 3);
    droneGroup.position.y = -8 + ease * 8;
    droneGroup.rotation.x = ease * -0.15;
    camera.position.set(
      -3 + ease * 3,
      1.5 - ease * 0.5,
      -1.5 + ease * 3.5
    );
    camera.lookAt(0, ease * 0.3, 0);
    if (t >= 1) {
      introPhase = 3;
      introT = 0;
    }
  } else if (introPhase === 3) {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const sp = Math.max(0, Math.min(1, scrollY / Math.max(1, maxScroll)));
    const floatY = Math.sin(time * 1.2) * 0.08;

    if (sp < 0.15) {
      camera.position.set(3.5, 1.5, 3);
      camera.lookAt(0, 0, 0);
      droneGroup.position.set(0, floatY, 0);
      droneGroup.rotation.y += (0.2 - droneGroup.rotation.y) * 0.03;
      droneGroup.rotation.x += (-0.1 - droneGroup.rotation.x) * 0.03;
      droneGroup.rotation.z += (Math.sin(time * 0.8) * 0.02 - droneGroup.rotation.z) * 0.05;
    } else if (sp < 0.35) {
      const p = (sp - 0.15) / 0.20;
      camera.position.set(3.5 - p * 1, 1.5 + p * 1.5, 3 - p * 1.5);
      camera.lookAt(0, 0.2, 0);
      droneGroup.rotation.y += (0.5 + p * 0.3 - droneGroup.rotation.y) * 0.04;
      droneGroup.position.y = floatY;
    } else if (sp < 0.55) {
      const p = (sp - 0.35) / 0.20;
      camera.position.set(2 - p, 3 - p * 5, 1.5 - p * 0.5);
      camera.lookAt(0, -0.3, 0);
      droneGroup.rotation.y += (Math.PI * 0.25 - droneGroup.rotation.y) * 0.04;
      droneGroup.position.y = floatY;
    } else if (sp < 0.75) {
      const p = (sp - 0.55) / 0.20;
      camera.position.set(0, 0.5 + p * 0.5, 4 + p * 0.5);
      camera.lookAt(0, 0, 0);
      droneGroup.rotation.y += (Math.PI * 0.5 - droneGroup.rotation.y) * 0.04;
      droneGroup.position.y = floatY;
    } else {
      const p = (sp - 0.75) / 0.25;

      const startX = -14, endX = 14;
      const cruiseH = 8;
      const arcH = 5;
      const arcY = Math.sin(p * Math.PI) * arcH;

      droneGroup.position.set(
        startX + p * (endX - startX),
        cruiseH + arcY,
        0
      );

      droneGroup.rotation.z = Math.cos(p * Math.PI) * -0.15;
      droneGroup.rotation.y = -Math.PI / 2;

      camera.position.set(
        droneGroup.position.x - 6,
        droneGroup.position.y + 1.5,
        droneGroup.position.z + 3
      );
      camera.lookAt(droneGroup.position);
    }

    // лёгкий дополнительный wobble
    droneGroup.position.y += Math.sin(time * 1.5) * 0.002;
  }

  renderer.render(scene, camera);
}
animate();


// ============================================================
// RESIZE
// ============================================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});