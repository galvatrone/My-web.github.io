const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
let w, h;
// JS-функция отслеживания неактивности
let idleTimer;
let idleTimeout = 30000; // 30 секунд
const idleMessage = document.getElementById("idle-message");

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (idleMessage.classList.contains("visible")) {
    idleMessage.classList.remove("visible");
    resumeStars(); // пробуждаем анимацию
  }
  idleTimer = setTimeout(() => {
    idleMessage.classList.add("visible");
    pauseStars(); // замедляем/останавливаем
  }, idleTimeout);
}
let animationPaused = false;

function pauseStars() {
  animationPaused = true;
}

function resumeStars() {
  animationPaused = false;
}

function animateStars() {
  if (!animationPaused) {
    stars.forEach(s => {
      s.y += s.v;
      if (s.y > h) {
        s.y = 0;
        s.x = Math.random() * w;
      }
    });
    drawStars();
  }
  requestAnimationFrame(animateStars);
}

["mousemove", "keydown", "mousedown", "touchstart"].forEach(evt => {
  window.addEventListener(evt, resetIdleTimer);
});

resetIdleTimer(); // запускаем при старте

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  generateStars();
}

function generateStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      v: Math.random() * 0.3 + 0.1
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function animateStars() {
  stars.forEach(s => {
    s.y += s.v;
    if (s.y > h) {
      s.y = 0;
      s.x = Math.random() * w;
    }
  });
  drawStars();
  requestAnimationFrame(animateStars);
}

// ✨ Анимация появления
function applyFadeIn() {
  const fadeInElements = document.querySelectorAll(".fade-in");
  fadeInElements.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.animation = `fadeInUp 0.8s ease ${i * 0.6 + 1}s forwards`;
  });
}



document.addEventListener("DOMContentLoaded", () => {
  applyFadeIn(); // анимация для начальных элементов
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
animateStars();

