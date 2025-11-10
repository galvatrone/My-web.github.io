// =====================
// Helpers & setup
// =====================
const logo = document.getElementById('logo3d');
const letters = [...logo.querySelectorAll('span')];
const cardsWrap = document.getElementById('cards');
const cards = [...cardsWrap.querySelectorAll('.card')];

// Проставим data-letter = реальный символ (для псевдо-толщины)
letters.forEach((el) => el.setAttribute('data-letter', el.textContent.trim()));

// Неоновый лёгкий “дыхательный” эффект у всего логотипа (бесконечно)
anime({
  targets: '#logo3d',
  scale: [{ value: 1 }, { value: 1.06 }, { value: 1 }],
  duration: 3200,
  easing: 'easeInOutSine',
  loop: true
});

// =====================
// Главная timeline (управляется скроллом)
// 0%..50% — работа с буквами ONEIX
// 50%..100% — появление card-стека и пролёт “замены”
// =====================
const tl = anime.timeline({
  autoplay: false,
  easing: 'easeInOutExpo'
});

// Шаг 1: Вход логотипа (слегка прилетает из Z, прозрачность 0→1)
tl.add({
  targets: '#logo3d',
  translateZ: [-300, 0],
  opacity: [0, 1],
  duration: 900
});

// Шаг 2: “Взрыв” букв (разлёт в 3D с вращением) — stagger
tl.add({
  targets: letters,
  translateX: () => anime.random(-220, 220),
  translateY: () => anime.random(-120, 120),
  translateZ: () => anime.random(-480, 480),
  rotateX: () => anime.random(-360, 360),
  rotateY: () => anime.random(-360, 360),
  opacity: [{ value: 1 }, { value: 0.45 }],
  duration: 1300,
  delay: anime.stagger(90)
});

// Шаг 3: Сборка букв обратно + лёгкий “подпрыг”
tl.add({
  targets: letters,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotateX: 0,
  rotateY: 0,
  opacity: 1,
  duration: 1100,
  easing: 'spring(1, 70, 12, 0)'
});

// Шаг 4: Подмена сцены — логотип отходит назад и бледнеет
tl.add({
  targets: '#logo3d',
  translateZ:  -260,
  opacity:     0.15,
  duration:    700
});

// Шаг 5: Появление карточек (прозрачность и выезд вперёд со степенью)
tl.add({
  targets: '.card-stack',
  opacity: [0, 1],
  duration: 500
}, '-=300'); // Чуть перекрываем с шагом 4

// Шаг 6: “Лифт” карточек — выезд второй на место первой, первая уходит “в небеса”
tl.add({
  targets: cards.map((c, i) => c),
  translateZ: (el, i) => [-720 + i * 120, -300 + i * 90], // раскрытие стопки
  rotateY: (el, i) => [-0.08 + i * 0.12, 0.1 + i * 0.08],
  duration: 1000,
  delay: anime.stagger(80),
  easing: 'easeOutCubic'
});

// Шаг 7: Имитация “замены”: верхняя карта улетает вверх и растворяется, следующая занимает “первое” место
tl.add({
  targets: cards[0],
  translateY: [-0, -280],
  translateZ: [ -300,  260],
  rotateX: [0, 0.6],
  opacity: [1, 0],
  duration: 900,
  easing: 'easeInCubic'
});

tl.add({
  targets: cards[1],
  translateZ: { value: 40, duration: 700, easing: 'easeOutBack' },
  rotateY: { value: 0, duration: 700, easing: 'easeOutCubic' }
}, '-=600');


// =====================
// Привязка к скроллу: tl.seek(progress)
// =====================
const total = 1; // мы будем нормализовать в [0..1]
const scrollLen = () => document.body.scrollHeight - window.innerHeight;

function onScroll() {
  const p = Math.min(1, Math.max(0, window.scrollY / scrollLen())); // 0..1
  tl.seek(tl.duration * p);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load',   onScroll);
window.addEventListener('resize', onScroll);

// =====================
// Курсор-параллакс: лёгкий наклон логотипа и карт при движении мыши
// =====================
const sceneEl = document.getElementById('scene');
sceneEl.addEventListener('mousemove', (e) => {
  const { clientX: x, clientY: y } = e;
  const cx = (x / window.innerWidth  - 0.5) * 2; // -1..1
  const cy = (y / window.innerHeight - 0.5) * 2; // -1..1

  const rotY = cx * 0.25; // поворот вокруг Y
  const rotX = -cy * 0.2; // поворот вокруг X

  logo.style.transform  = `rotateY(${rotY}turn) rotateX(${rotX}turn)`;
  cardsWrap.style.transform = `translateZ(-40px) rotateY(${rotY}turn) rotateX(${rotX * 0.7}turn)`;
});
