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


// ====== Project detail overlay & slideshow ======
(function(){
  const viewBtns = document.querySelectorAll('.view-project');
  const detail = document.getElementById('project-detail');
  if (!detail) return; // если нет overlay, ничего не делаем

  const slidesContainer = detail.querySelector('.slides');
  const titleEl = detail.querySelector('.detail-title');
  const descEl = detail.querySelector('.detail-desc');
  const demoLink = detail.querySelector('.detail-demo');
  const closeBtn = detail.querySelector('#detail-close');
  const prevBtn = detail.querySelector('.slide-prev');
  const nextBtn = detail.querySelector('.slide-next');
  const projectGrid = document.querySelector('.project-grid');

  let slides = [];
  let current = 0;

  function isVideo(url){
    return /\.(mp4|webm|ogg)$/i.test(url);
  }

  function renderSlide(index){
    slidesContainer.innerHTML = '';
    const src = slides[index];
    if (!src) return;
    if (isVideo(src)){
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = false;
      v.className = 'detail-media';
      slidesContainer.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = titleEl.textContent || 'project image';
      img.className = 'detail-media';
      slidesContainer.appendChild(img);
    }
  }

function openDetailFromCard(card){
  const title = card.dataset.title || '';
  const desc = card.dataset.desc || '';
  const images = (card.dataset.images || '').split(',').map(s=>s.trim()).filter(Boolean);
  const demo = card.dataset.demo || '#';

  slides = images.length ? images : [card.querySelector('img')?.src].filter(Boolean);
  current = 0;
  titleEl.textContent = title;

  // --- 💡 Добавлено условие для карточки Website Stack ---
  if (title.toLowerCase().includes('website')) {
    descEl.innerHTML = `
      ${desc}<br><br>
      🌐 <a href="https://www.oneix.ltd" target="_blank">oneix.ltd</a><br>
      🚀 <a href="https://www.oneix.ltd/drones" target="_blank">Vector</a><br>
      🧠 <a href="https://www.oneix.ltd/drone" target="_blank">NeoSwarm</a><br>
      🤖 <a href="https://www.oneix.ltd/crossfit" target="_blank">Cross fit platform Club</a>
    `;
  } else {
    descEl.textContent = desc;
  }
  // ------------------------------------------------------

  demoLink.href = demo;
  demoLink.textContent = demo === '#' ? 'Демо недоступно' : 'Открыть демо';

  renderSlide(current);

  detail.classList.add('active');
  detail.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  if (projectGrid) projectGrid.classList.add('dimmed');
}


  function closeDetail(){
    detail.classList.remove('active');
    detail.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (projectGrid) projectGrid.classList.remove('dimmed');
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const card = e.currentTarget.closest('.project-card');
      if (!card) return;
      openDetailFromCard(card);
    });
  });

  closeBtn.addEventListener('click', closeDetail);
  prevBtn.addEventListener('click', ()=>{
    if (slides.length===0) return;
    current = (current - 1 + slides.length) % slides.length;
    renderSlide(current);
  });
  nextBtn.addEventListener('click', ()=>{
    if (slides.length===0) return;
    current = (current + 1) % slides.length;
    renderSlide(current);
  });

  // keyboard support
  document.addEventListener('keydown', (e)=>{
    if (detail.classList.contains('active')){
      if (e.key === 'Escape') closeDetail();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    }
  });

})();
