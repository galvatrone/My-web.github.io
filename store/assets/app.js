import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function reveal() {
  if (reduced) return;
  const items = document.querySelectorAll(".hero > div[data-reveal], .section[data-reveal], .product-card[data-reveal]");
  items.forEach((item) => inView(item, () => animate(item, { opacity: 1, y: 0 }, { duration: 0.34, ease: "easeOut" }), { amount: 0.16 }));
  const cards = document.querySelectorAll(".product-card");
  if (cards.length) animate(cards, { opacity: 1, y: 0 }, { delay: stagger(0.055), duration: 0.32, ease: "easeOut" });
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("pointerenter", () => animate(button, { y: -3 }, { duration: 0.22, ease: "easeOut" }));
    button.addEventListener("pointerleave", () => animate(button, { y: 0 }, { duration: 0.22, ease: "easeOut" }));
  });
}

function createSignal(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { return; }
  const host = canvas.closest(".signal");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 5.2;
  const color = new THREE.Color(host?.dataset.color || "#64e3f2");
  const group = new THREE.Group();
  scene.add(group);
  const positions = [];
  for (let i = 0; i < 210; i += 1) {
    const angle = i * 0.48;
    const radius = 0.5 + (i % 14) * 0.075;
    positions.push(Math.cos(angle) * radius, (i % 17 - 8) * 0.065, Math.sin(angle) * radius);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 0.028, transparent: true, opacity: 0.76, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(points);
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05 + i * 0.32, 0.004, 8, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 - i * 0.035, blending: THREE.AdditiveBlending }));
    ring.rotation.x = 0.55 + i * 0.2;
    ring.rotation.y = i * 0.7;
    group.add(ring);
  }
  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  let targetX = 0;
  let targetY = 0;
  host.addEventListener("pointermove", (event) => {
    const rect = host.getBoundingClientRect();
    targetY = ((event.clientX - rect.left) / rect.width - 0.5) * 0.34;
    targetX = ((event.clientY - rect.top) / rect.height - 0.5) * 0.24;
  });
  host.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });
  if (reduced) { renderer.render(scene, camera); return; }
  scroll((progress) => { group.position.y = (progress - 0.5) * 0.16; }, { target: host });
  const tick = (time) => {
    group.rotation.y += 0.0009;
    group.rotation.x += (targetX - group.rotation.x) * 0.025;
    group.rotation.z += (targetY - group.rotation.z) * 0.025;
    points.rotation.z = time * 0.00004;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

try {
  document.documentElement.classList.add("motion-active");
  reveal();
  document.querySelectorAll(".signal-canvas").forEach(createSignal);
} catch (error) {
  document.documentElement.classList.remove("motion-active");
  console.warn("Oneix motion layer unavailable; static UI preserved.", error);
}
