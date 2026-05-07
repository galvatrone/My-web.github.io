// ============================================================
// LOADER
// ============================================================
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const loader = document.getElementById('loader');

let loadPct = 0;
const loadInterval = setInterval(() => {
  loadPct += Math.random() * 4 + 1;
  if (loadPct >= 100) {
    loadPct = 100;
    clearInterval(loadInterval);
  }
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
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
  }
});

function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = rx - 18 + 'px';
    cursorRing.style.top = ry - 18 + 'px';
  }
  requestAnimationFrame(animCursor);
}
animCursor();


// ============================================================
// THREE.JS SCENE
// ============================================================
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// ============================================================
// HERO SCENE PHASES
// ============================================================
const HERO_PHASES = {
  droneApproach: [0.00, 0.18],
  canvasHold: [0.18, 0.34],
  canvasDrop: [0.34, 0.54],
  textLift: [0.54, 0.76],
  sceneRelease: [0.76, 1.00]
};


// ============================================================
// BACKGROUND PARALLAX
// ============================================================
const cityBg = document.getElementById('city-bg');
const cityBgImage = document.getElementById('city-bg-image');
const deliverySection = document.getElementById('delivery');

function updateCityBgParallax() {
  if (!cityBg || !cityBgImage) return;
  const maxShift = Math.max(0, cityBgImage.offsetHeight - window.innerHeight);
  const stopScroll = deliverySection
    ? Math.max(1, deliverySection.offsetTop - window.innerHeight)
    : Math.max(1, maxShift);
  const progress = Math.max(0, Math.min(1, scrollY / stopScroll));
  const imageY = -(maxShift * progress);
  const releaseY = -Math.max(0, scrollY - stopScroll);
  cityBgImage.style.transform = `translate3d(0, ${imageY}px, 0)`;
  cityBg.style.transform = `translate3d(0, ${releaseY}px, 0)`;
}


// ============================================================
// MODEL CONTAINER
// ============================================================
const droneGroup = new THREE.Group();
scene.add(droneGroup);

let loadedDrone = null;
let droneReady = false;
const rotors = [];

function frameModelToOrigin(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  object.position.sub(center);

  const maxAxis = Math.max(size.x, size.y, size.z);
  const targetSize = 3.2;
  const scale = targetSize / Math.max(maxAxis, 0.0001);
  object.scale.setScalar(scale);

  const box2 = new THREE.Box3().setFromObject(object);
  const center2 = new THREE.Vector3();
  box2.getCenter(center2);
  object.position.sub(center2);
}

function loadDroneModel() {
  if (!THREE.GLTFLoader) {
    console.error('GLTFLoader is missing in HTML');
    return;
  }

  const gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load(
    './assets/models/drone/drone.glb',
    (gltf) => {
      if (loadedDrone) droneGroup.remove(loadedDrone);

      const object = gltf.scene;

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Логируем имена — удали после настройки
          console.log('mesh:', child.name);
        }
        object.traverse((child) => {
          // логируем ВСЕ объекты, не только меши
          console.log(child.type, '|', child.name, '| parent:', child.parent?.name);
        });
        // Ищем лопасти по имени
        const name = (child.name || '').toLowerCase();
        if (
          name.includes('prop') ||
          name.includes('rotor') ||
          name.includes('blade') ||
          name.includes('fan') ||
          name.includes('vint') ||
          name.includes('screw')
        ) {
          rotors.push({
            obj: child,
            dir: rotors.length % 2 === 0 ? 1 : -1
          });
        }
      });

      frameModelToOrigin(object);
      object.rotation.y = Math.PI * 0.25;

      droneGroup.add(object);
      loadedDrone = object;
      droneReady = true;
      object.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }

     object.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;

    // Определяем форму меша по bounding box
    const box = new THREE.Box3().setFromObject(child);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxS = Math.max(size.x, size.y, size.z);
    const minS = Math.min(size.x, size.y, size.z);

    // Лопасть = широкая и плоская: одна ось намного короче двух других
    const flatRatio = minS / maxS;
    const spreadRatio = Math.max(size.x, size.z) / (size.y + 0.001);

    if (flatRatio < 0.15 && spreadRatio > 3) {
      console.log('🔵 Rotor candidate:', child.name, 'parent:', child.parent?.name,
        '| size:', size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3));
      rotors.push({
        obj: child.parent, // крутим родительский Object3D
        dir: rotors.length % 2 === 0 ? 1 : -1
      });
    }
  }
});
    });
      console.log(`Rotors found: ${rotors.length}`);
    },
    (xhr) => {
      if (xhr.total > 0) {
        console.log('GLB: ' + Math.round(xhr.loaded / xhr.total * 100) + '%');
      }
    },
    (err) => {
      console.error('GLB load error:', err);
    }
  );
}

loadDroneModel();


// ============================================================
// LIGHTING
// ============================================================
const rimLight = new THREE.DirectionalLight(0x00e5ff, 2.8);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(0x7b2fff, 1.2);
fillLight.position.set(5, -2, 3);
scene.add(fillLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(2, 8, 2);
keyLight.castShadow = true;
scene.add(keyLight);

const ambientLight = new THREE.AmbientLight(0x10131a, 1.8);
scene.add(ambientLight);

const bounceLight = new THREE.PointLight(0x00e5ff, 2, 10);
bounceLight.position.set(0, -2, 0);
scene.add(bounceLight);

const moonLight = new THREE.DirectionalLight(0x8899cc, 0.5);
moonLight.position.set(0, 20, -10);
scene.add(moonLight);

scene.fog = new THREE.FogExp2(0x03030c, 0.008);


// ============================================================
// PARTICLES
// ============================================================
const partGeo = new THREE.BufferGeometry();
const partCount = 600;
const partPos = new Float32Array(partCount * 3);
const partVel = new Float32Array(partCount * 3);

for (let i = 0; i < partCount; i++) {
  partPos[i * 3]     = (Math.random() - 0.5) * 80;
  partPos[i * 3 + 1] = Math.random() * 25 - 2;
  partPos[i * 3 + 2] = (Math.random() - 0.5) * 80;

  partVel[i * 3]     = (Math.random() - 0.5) * 0.01;
  partVel[i * 3 + 1] = Math.random() * 0.004;
  partVel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
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
let introPhase = 0;
let introT = 0;
let scrollY = 0;
let time = 0;
let activeStoryPanelIdx = -1;
let heroIntroPlayed = false;

function runHeroIntroTimeline() {
  if (heroIntroPlayed || typeof anime === 'undefined') return;

  const canvasRig = document.getElementById('hero-canvas-rig');
  const rigLines = document.querySelectorAll('#hero-canvas-rig .hero-rig-line');
  const canvasFrame = document.getElementById('hero-canvas-frame');
  const textRig = document.getElementById('hero-text-rig');
  const centerLine = document.querySelector('#hero-text-rig .hero-rig-line--center');

  if (!canvasRig || !canvasFrame || !textRig) return;

  heroIntroPlayed = true;

  anime.remove([canvasRig, rigLines, canvasFrame, textRig]);

  anime.set(canvasRig, {
    opacity: 0,
    translateX: '-50%',
    translateY: '-18vh',
    scale: 0.92
  });
  anime.set(rigLines, {
    opacity: 0,
    scaleY: 0,
    transformOrigin: 'top center'
  });
  anime.set(canvasFrame, {
    scale: 0.96,
    rotate: 0.8
  });
  anime.set(textRig, {
    opacity: 0,
    translateX: '-50%',
    translateY: '-10vh'
  });
  anime.set(centerLine, {
    opacity: 0,
    scaleY: 0,
    transformOrigin: 'top center'
  });
  anime.set(heroCopy, {
    opacity: 1,
    translateY: 0,
    filter: 'blur(0px)'
  });
  anime.set(heroStats, {
    opacity: 1,
    translateY: 0,
    filter: 'blur(0px)'
  });

  anime.timeline({
    easing: 'easeOutExpo'
  })
  .add({
    targets: canvasRig,
    opacity: [0, 1],
    translateX: ['-50%', '-50%'],
    translateY: ['-18vh', '0vh'],
    scale: [0.92, 1],
    duration: 980
  }, 0)
  .add({
    targets: rigLines,
    opacity: [0, 0.72],
    scaleY: [0, 1],
    duration: 720,
    delay: anime.stagger(120)
  }, 120)
  .add({
    targets: canvasFrame,
    scale: [0.96, 1],
    rotate: [0.8, 0],
    duration: 860
  }, 0)
  .add({
    targets: textRig,
    opacity: 0,
    translateX: '-50%',
    duration: 1
  }, 0)
  .add({
    targets: rigLines,
    scaleY: [1, 1.45],
    opacity: [0.72, 0.48],
    duration: 760,
    easing: 'easeInQuad'
  }, '+=380')
  .add({
    targets: canvasRig,
    translateX: '-50%',
    translateY: ['0vh', '108vh'],
    rotate: [0, -3],
    opacity: [1, 0.92],
    duration: 1160,
    easing: 'easeInCubic'
  }, '-=760')
  .add({
    targets: canvasFrame,
    rotate: [0, -4],
    scale: [1, 0.96],
    duration: 1160,
    easing: 'easeInCubic'
  }, '-=1160')
  .add({
    targets: rigLines,
    opacity: [0.48, 0],
    duration: 420,
    easing: 'linear'
  }, '-=320')
  .add({
    targets: centerLine,
    opacity: [0, 0.68],
    scaleY: [0, 1],
    duration: 580,
    easing: 'easeOutQuad'
  }, '+=80')
  .add({
    targets: textRig,
    opacity: [0, 1],
    translateX: ['-50%', '-50%'],
    translateY: ['-10vh', '0vh'],
    duration: 860,
    easing: 'easeOutExpo'
  }, '-=420')
  .add({
    targets: heroCopy,
    opacity: [1, 0],
    translateY: [0, -42],
    filter: ['blur(0px)', 'blur(10px)'],
    duration: 640,
    easing: 'easeOutQuad'
  }, '-=760')
  .add({
    targets: heroStats,
    opacity: [1, 0],
    translateY: [0, -30],
    filter: ['blur(0px)', 'blur(8px)'],
    duration: 520,
    easing: 'easeOutQuad'
  }, '-=620');
}

function buildSplitTitle(titleEl) {
  if (!titleEl || titleEl.dataset.splitReady === 'true') return;

  const lines = titleEl.innerHTML.split('<br>');
  titleEl.innerHTML = '';

  lines.forEach((lineText) => {
    const line = document.createElement('span');
    line.className = 'split-line';

    lineText
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .forEach((wordText) => {
        const word = document.createElement('span');
        word.className = 'split-word';

        const main = document.createElement('span');
        main.className = 'split-word__main';
        main.textContent = wordText;

        const clone = document.createElement('span');
        clone.className = 'split-word__clone';
        clone.textContent = wordText;

        word.appendChild(main);
        word.appendChild(clone);
        line.appendChild(word);
      });

    titleEl.appendChild(line);
  });

  titleEl.dataset.splitReady = 'true';
}

function animateStoryPanel(panelEl, immediate = false) {
  if (!panelEl || typeof anime === 'undefined') return;

  const words = panelEl.querySelectorAll('.split-word');
  const tag = panelEl.querySelector('.panel-tag');
  const text = panelEl.querySelector('.panel-text');
  const specs = panelEl.querySelectorAll('.spec-list li');

  anime.remove(words);
  anime.remove(tag);
  anime.remove(text);
  anime.remove(specs);

  anime.set(words, { translateY: immediate ? '0%' : '100%' });
  anime.set(tag, { translateY: immediate ? 0 : 18, opacity: immediate ? 1 : 0 });
  anime.set(text, { translateY: immediate ? 0 : 20, opacity: immediate ? 1 : 0 });
  anime.set(specs, { translateY: immediate ? 0 : 18, opacity: immediate ? 1 : 0 });

  if (immediate) return;

  anime({
    targets: words,
    translateY: ['100%', '0%'],
    duration: 720,
    delay: anime.stagger(80, { from: 'center' }),
    easing: 'easeInOutQuad'
  });

  anime({
    targets: tag,
    translateY: [18, 0],
    opacity: [0, 1],
    duration: 480,
    easing: 'easeOutQuad'
  });

  anime({
    targets: text,
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 520,
    delay: 120,
    easing: 'easeOutQuad'
  });

  anime({
    targets: specs,
    translateY: [18, 0],
    opacity: [0, 1],
    duration: 480,
    delay: anime.stagger(90, { start: 220 }),
    easing: 'easeOutQuad'
  });
}

function setupStoryPanels() {
  const panels = document.querySelectorAll('.story-panel');
  panels.forEach((panel, idx) => {
    buildSplitTitle(panel.querySelector('.panel-title'));
    animateStoryPanel(panel, idx === 0);
  });
  activeStoryPanelIdx = 0;
}

camera.position.set(-6, 2, -1.5);
camera.lookAt(0, 0, 0);


// ============================================================
// START INTRO AFTER LOADER
// ============================================================
setTimeout(() => {
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 800);
  }
  runHeroIntroTimeline();
  introPhase = 1;
}, 3200);


// ============================================================
// SCROLL STORY PANELS
// ============================================================
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  updateCityBgParallax();
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

  if (panelIdx !== activeStoryPanelIdx) {
    const nextPanel = document.querySelector(`#panel-${panelIdx}`);
    animateStoryPanel(nextPanel);
    activeStoryPanelIdx = panelIdx;
  }
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

  // Вращение лопастей
  rotors.forEach(r => {
    r.obj.rotation.y += r.dir * 0.5;
  });

  // Particles
  const posArr = partGeo.attributes.position.array;
  for (let i = 0; i < partCount; i++) {
    posArr[i * 3]     += partVel[i * 3];
    posArr[i * 3 + 1] += partVel[i * 3 + 1];
    posArr[i * 3 + 2] += partVel[i * 3 + 2];
    if (posArr[i * 3 + 1] > 22) posArr[i * 3 + 1] = -2;
  }
  partGeo.attributes.position.needsUpdate = true;

  bounceLight.intensity = 1.8 + Math.sin(time * 3) * 0.4;

  // Intro / scroll camera
  if (introPhase === 1) {
    introT += 0.008;
    camera.position.set(
      -6 + introT * 0.5,
      2 - introT * 0.3,
      -1.5 + Math.sin(introT * 0.5) * 0.3
    );
    camera.lookAt(0, 0, 0);
    droneGroup.rotation.y = introT * 0.3;
    if (introT > 2.5) { introPhase = 2; introT = 0; }

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

    if (t >= 1) { introPhase = 3; introT = 0; }

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
      const cruiseH = 8, arcH = 5;
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
  updateCityBgParallax();
});

window.addEventListener('load', updateCityBgParallax);
window.addEventListener('load', setupStoryPanels);
