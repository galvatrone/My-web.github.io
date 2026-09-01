import * as THREE from "three";
import { animate, createTimeline, stagger } from "animejs";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isMobile = window.matchMedia("(max-width: 780px)").matches;
const maxDpr = isMobile ? 1.35 : 1.75;

const products = [
  { name: "ReviewLoop", color: 0x64e3f2, phase: 0.1 },
  { name: "LeadPocket", color: 0xf2b66d, phase: 0.7 },
  { name: "ExpiryDesk", color: 0xf07b6d, phase: 1.4 },
  { name: "ClientDock", color: 0xb8a7f2, phase: 2.0 },
  { name: "SitePulse", color: 0x82e0b1, phase: 2.7 },
  { name: "WorkshopRecall", color: 0xe0a15f, phase: 3.3 },
  { name: "OpsQR", color: 0x7db8ff, phase: 3.9 },
  { name: "InvoiceNudge", color: 0x8bd6c2, phase: 4.5 },
  { name: "CronBeacon", color: 0xf28c9d, phase: 5.1 },
  { name: "LogSentry", color: 0xd6e36c, phase: 5.7 },
];

function initReveals() {
  if (reduceMotion) return;

  animate("[data-reveal]", {
    y: [22, 0],
    opacity: [0, 1],
    duration: 900,
    delay: stagger(120),
    ease: "outCubic",
  });

  const productCards = document.querySelectorAll(".product-card");

  if (productCards.length > 0) {
    animate(productCards, {
      y: [18, 0],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(45),
      ease: "outCubic",
      autoplay: true,
    });
  }
}

function bindPointerDepth(root) {
  const targets = root.querySelectorAll(".card, .system-field, .journey-field");

  root.addEventListener("pointermove", (event) => {
    for (const target of targets) {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      if (x >= -20 && x <= 120 && y >= -20 && y <= 120) {
        target.style.setProperty("--mx", `${x}%`);
        target.style.setProperty("--my", `${y}%`);
      }
    }
  });
}

function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setClearColor(0x000000, 0);

  return renderer;
}

function resizeRenderer(renderer, camera, canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width !== Math.round(width * renderer.getPixelRatio())) {
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }
}

function makeNode(color, radius = 0.052) {
  const geometry = new THREE.SphereGeometry(radius, 20, 12);
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

function makeLine(points, color, opacity = 0.42) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });

  return new THREE.Line(geometry, material);
}

function initStoreScene(canvas) {
  if (!canvas || reduceMotion) return null;

  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 12);
  const focusLabel = document.querySelector("[data-store-focus]");
  const group = new THREE.Group();
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const nodes = [];
  let active = true;
  let raf = 0;

  camera.position.set(0, 0.24, 4.2);
  scene.add(group);

  const core = makeNode(0xedf7fa, 0.12);
  core.scale.set(1, 1, 1);
  group.add(core);

  const coreRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.003, 8, 96),
    new THREE.MeshBasicMaterial({
      color: 0x64e3f2,
      transparent: true,
      opacity: 0.44,
    }),
  );
  coreRing.rotation.x = Math.PI / 2.6;
  group.add(coreRing);

  products.forEach((product, index) => {
    const angle = (index / products.length) * Math.PI * 2;
    const depth = index % 2 === 0 ? -0.42 : 0.34;
    const radius = isMobile ? 1.18 : 1.42;
    const node = makeNode(product.color);

    node.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.84, depth);
    node.userData = product;
    nodes.push(node);
    group.add(node);

    group.add(
      makeLine(
        [new THREE.Vector3(0, 0, 0), node.position],
        product.color,
        0.28,
      ),
    );
  });

  const particleCount = isMobile ? 90 : 180;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.7 + Math.random() * 1.85;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
    particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 1.4;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x64e3f2,
      size: 0.011,
      transparent: true,
      opacity: 0.5,
    }),
  );
  group.add(particles);

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodes)[0];
    focusLabel.value = hit ? hit.object.userData.name : "System view";
  });

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active && !raf) tick();
  });
  observer.observe(canvas);

  function tick(time = 0) {
    if (!active) {
      raf = 0;
      return;
    }

    resizeRenderer(renderer, camera, canvas);
    const t = time * 0.001;

    group.rotation.y += ((pointer.x || 0) * 0.16 - group.rotation.y) * 0.045;
    group.rotation.x += ((pointer.y || 0) * -0.08 - group.rotation.x) * 0.04;
    core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.045);
    coreRing.rotation.z = t * 0.16;

    nodes.forEach((node, index) => {
      const product = products[index];
      node.position.z +=
        (Math.sin(t * 0.8 + product.phase) * 0.18 - node.position.z) * 0.018;
      node.scale.setScalar(1 + Math.sin(t * 2.6 + product.phase) * 0.1);
    });

    particles.rotation.z = t * 0.025;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  tick();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(raf);
    renderer.dispose();
    scene.traverse((item) => {
      item.geometry?.dispose?.();
      item.material?.dispose?.();
    });
  };
}

function initReviewLoopScene(canvas) {
  if (!canvas || reduceMotion) return null;

  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 10);
  const group = new THREE.Group();
  const nodes = [];
  const pointer = new THREE.Vector2();
  let active = true;
  let raf = 0;

  camera.position.set(0, 0.08, 4.4);
  scene.add(group);

  const positions = [
    [-1.65, 0, 0.24],
    [-0.72, 0.72, -0.24],
    [0.08, 0.1, 0.36],
    [-1.05, -0.78, -0.1],
    [1.16, -0.8, -0.16],
    [1.62, 0.08, 0.22],
  ];

  positions.forEach((position, index) => {
    const node = makeNode(
      index >= 4 ? 0x82e0b1 : 0x64e3f2,
      index === 5 ? 0.085 : 0.062,
    );
    node.position.fromArray(position);
    nodes.push(node);
    group.add(node);

    if (index > 0 && index < 3) {
      group.add(
        makeLine([nodes[index - 1].position, node.position], 0x64e3f2, 0.32),
      );
    }
  });

  group.add(makeLine([nodes[2].position, nodes[3].position], 0xf2b66d, 0.34));
  group.add(makeLine([nodes[2].position, nodes[4].position], 0x82e0b1, 0.34));
  group.add(makeLine([nodes[4].position, nodes[5].position], 0x82e0b1, 0.38));

  const signal = makeNode(0xedf7fa, 0.04);
  group.add(signal);

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active && !raf) tick();
  });
  observer.observe(canvas);

  function tick(time = 0) {
    if (!active) {
      raf = 0;
      return;
    }

    resizeRenderer(renderer, camera, canvas);
    const t = time * 0.001;
    const travel = (Math.sin(t * 0.7) + 1) / 2;
    const segment = Math.min(
      Math.floor(travel * (positions.length - 1)),
      positions.length - 2,
    );
    const local = travel * (positions.length - 1) - segment;
    const from = nodes[segment].position;
    const to = nodes[segment + 1].position;

    signal.position.lerpVectors(from, to, local);
    signal.scale.setScalar(1 + Math.sin(t * 8) * 0.12);
    group.rotation.y += ((pointer.x || 0) * 0.11 - group.rotation.y) * 0.04;
    group.rotation.x += ((pointer.y || 0) * -0.06 - group.rotation.x) * 0.035;

    nodes.forEach((node, index) => {
      node.scale.setScalar(1 + Math.sin(t * 2.1 + index) * 0.055);
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  tick();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(raf);
    renderer.dispose();
    scene.traverse((item) => {
      item.geometry?.dispose?.();
      item.material?.dispose?.();
    });
  };
}

function initJourneyChoreography() {
  const pulse = document.querySelector(".journey-pulse");
  const state = document.querySelector("[data-journey-state]");

  if (!pulse || reduceMotion) return;

  const path = document.querySelector(".journey-path.main");
  const branchA = document.querySelector(".journey-path.branch-a");
  const branchB = document.querySelector(".journey-path.branch-b");
  const labels = [
    "Customer captured",
    "Request sent",
    "Opened",
    "Feedback routed",
    "Review published",
  ];

  createTimeline({ loop: true })
    .add(pulse, {
      translateX: [78, 222],
      translateY: [230, 156],
      duration: 900,
      ease: "inOutCubic",
      onBegin: () => {
        state.textContent = labels[0];
      },
    })
    .add(pulse, {
      translateX: 320,
      translateY: 220,
      duration: 760,
      ease: "inOutCubic",
      onBegin: () => {
        state.textContent = labels[1];
      },
    })
    .add(pulse, {
      translateX: 520,
      translateY: 356,
      duration: 820,
      ease: "inOutCubic",
      onBegin: () => {
        state.textContent = labels[2];
      },
    })
    .add(pulse, {
      translateX: 566,
      translateY: 218,
      duration: 720,
      ease: "inOutCubic",
      onBegin: () => {
        state.textContent = labels[4];
      },
    });

  animate([path, branchA, branchB], {
    strokeDashoffset: [80, 0],
    duration: 2400,
    delay: stagger(160),
    loop: true,
    ease: "linear",
  });
}

function initScrollDepth() {
  if (reduceMotion) return;

  const hero = document.querySelector(".store-hero, .reviewloop-hero");
  if (!hero) return;

  window.addEventListener(
    "scroll",
    () => {
      const progress = Math.min(
        window.scrollY / Math.max(hero.offsetHeight, 1),
        1,
      );
      hero.style.setProperty("--scroll-depth", progress.toFixed(3));
      hero.style.transform = `translateY(${progress * -10}px)`;
    },
    { passive: true },
  );
}

initReveals();
bindPointerDepth(document);
initStoreScene(document.querySelector('[data-three="store"]'));
initReviewLoopScene(document.querySelector('[data-three="reviewloop"]'));
initJourneyChoreography();
initScrollDepth();
