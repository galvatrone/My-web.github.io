// Удаляем intro после анимации
setTimeout(() => {
  const intro = document.querySelector('.intro-screen');
  if (intro) intro.style.display = 'none';
}, 5000); // 5 секунд (анимация + пауза)

 window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--smoke-move-left', `${scrollY * 0.3}px`);
    document.documentElement.style.setProperty('--smoke-move-right', `${-scrollY * 0.3}px`);
  });

   const smokeLeft = document.querySelector('.smoke-left');
  const smokeRight = document.querySelector('.smoke-right');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;

    smokeLeft.style.transform = `translateY(${scroll * 0.3}px) translateX(-20px)`;
    smokeRight.style.transform = `translateY(${-scroll * 0.3}px) translateX(20px)`;
  });