  // Удаляем intro после анимации
  setTimeout(() => {
    const intro = document.querySelector('.intro-screen');
    if (intro) intro.style.display = 'none';
  }, 5000); // 5 секунд (анимация + пауза)

  // Обновление параллакса дыма и переменных
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--smoke-move-left', `${scrollY * 0.3}px`);
    document.documentElement.style.setProperty('--smoke-move-right', `${-scrollY * 0.3}px`);

    const smokeLeft = document.querySelector('.smoke-left');
    const smokeRight = document.querySelector('.smoke-right');

    if (smokeLeft) {
      smokeLeft.style.transform = `translateY(${scrollY * 0.3}px) translateX(-20px)`;
    }
    if (smokeRight) {
      smokeRight.style.transform = `translateY(${-scrollY * 0.3}px) translateX(20px)`;
    }
  });
function reveal() {
  const revealsLeft = document.querySelectorAll('.reveal-left');
  const revealsRight = document.querySelectorAll('.reveal-right');

  const windowHeight = window.innerHeight;
  const revealPoint = 150; // точка, когда элемент появляется

  revealsLeft.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  revealsRight.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);


  // Получаем все кнопки и секции
  const buttons = document.querySelectorAll('.portfolio-btn');
  const sections = document.querySelectorAll('.portfolio-content');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Убираем .active у всех кнопок и секций
      buttons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      // Добавляем .active только на нажатую кнопку и соответствующую секцию
      btn.classList.add('active');
      sections[index].classList.add('active');
    });
  });
