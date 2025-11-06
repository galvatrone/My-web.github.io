// === Анимируем вращение карточки при скролле ===
const card = document.querySelector('.card3d');
const faces = document.querySelectorAll('.card-face');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = scrollY / maxScroll; // от 0 до 1

  // Основное вращение
  anime({
    targets: card,
    rotateY: progress * 360,       // полный оборот при прокрутке
    rotateX: Math.sin(progress * Math.PI) * 20, // лёгкий наклон
    duration: 500,
    easing: 'easeOutQuad'
  });

  // Эффект неонового дыхания
  const glowIntensity = 15 + Math.abs(Math.sin(scrollY * 0.01)) * 30;
  card.style.boxShadow = `0 0 ${glowIntensity}px #00fff7, 0 0 ${glowIntensity * 1.5}px #00d0ff`;

  // Подсвечиваем активную грань
  const currentFace = Math.floor(progress * 4) % 4; // 0..3
  faces.forEach((face, i) => {
    face.style.opacity = (i === currentFace) ? 1 : 0.1;
    face.style.filter = (i === currentFace) ? 'blur(0px)' : 'blur(4px)';
  });
});
