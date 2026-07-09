import { animate, scroll, stagger, inView } from "https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm";
import * as THREE from "three";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

document.documentElement.classList.add("js");

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const moonElement = document.querySelector("#moon-3d");

const ruTranslations = {
  loaderStatus: "Установка связи с Луной",
  navMission: "Миссия",
  navPlatform: "Платформа",
  navLaunch: "Запуск",
  navPreorder: "Предзаказ",
  heroTitle: "Космос становится<br><em>доставляемым.</em>",
  heroLead:
    "Автономная платформа на поверхности Луны собирает образцы и отправляет их электромагнитным импульсом — без запуска нового корабля для каждой доставки.",
  heroReserve: "Зарезервировать образец",
  heroLearn: "Узнать, как это работает",
  heroSurface: "Лунная поверхность · 00°",
  rockHint: "Удерживайте и вращайте · 360°",
  preorderTitle: "Ваш фрагмент<br>другого мира.",
  preorderLead:
    "Оставьте заявку на место в ранней программе доставки научных и коллекционных лунных образцов. Финальная доступность зависит от миссии, разрешений и научной верификации.",
  depositLabel: "Депозит за бронирование",
  depositNote:
    "Оставшаяся сумма запрашивается только после начала работы платформы и подтверждения выделения вашего образца.",
  sampleClass: "Класс",
  sampleMass: "Масса образца",
  sampleOrigin: "Происхождение",
  sampleRegolith: "Лунный реголит",
  requestAccess: "Запросить ранний доступ",
  depositLegal:
    "Депозит $100 резервирует приоритет. Он не гарантирует доставку и регулируется финальными условиями программы.",
  missionTitle: "Одна система.<br><em>Шесть фаз миссии.</em>",
  missionLead:
    "LELP разделяет постоянную лунную инфраструктуру и возвращаемую полезную нагрузку. Платформа садится один раз, после чего повторяет цикл сбора, упаковки и запуска.",
  missionFactMass: "масса платформы",
  missionFactPower: "возобновляемая энергия",
  missionFactPayload: "диапазон образцов MVP",
  missionEarth: "Запуск с Земли",
  missionEarthText:
    "Коммерческая ракета выводит компактный транспортный аппарат на околоземную орбиту.",
  missionLanding: "Посадка на Луну",
  missionLandingText:
    "Посадочный модуль разворачивает LELP, солнечные панели, связь и систему пробоотбора.",
  missionSurvey: "Разведка и сбор",
  missionSurveyText:
    "Камеры картируют местность, а роботизированный инструмент отбирает камни и реголит.",
  missionPackage: "Проверка и упаковка",
  missionPackageText:
    "Материал идентифицируется, взвешивается, герметизируется и регистрируется.",
  missionLaunch: "Электромагнитный запуск",
  missionLaunchText:
    "Суперконденсаторы питают ускоритель, а сама платформа остаётся на Луне.",
  missionGuidance: "Наведение и возврат",
  missionGuidanceText:
    "Лёгкая ступень корректирует траекторию к орбите или будущей системе возврата.",
  platformTitle: "Инженерия<br>постоянного<br><em>присутствия.</em>",
  platformLead:
    "Модульная алюминиево-титановая конструкция объединяет автономную навигацию, накопление энергии, работу с полезной нагрузкой и электромагнитный запуск.",
  metricSize: "см<br>габарит MVP",
  metricMass: "кг<br>масса платформы",
  metricSample: "г<br>образцы MVP",
  systemsTitle: "Система, рассчитанная<br><em>на повторение.</em>",
  systemAutonomy: "Автономность",
  systemAutonomyText:
    "Бортовой компьютер, камеры, IMU и связь для дистанционной работы.",
  systemEnergy: "Энергия",
  systemEnergyText:
    "Солнечные панели, Li-ion батареи и импульсные суперконденсаторы.",
  systemPayload: "Полезная нагрузка",
  systemPayloadText:
    "Манипулятор, пробоотборник, контейнер и сменный магазин капсул.",
  launchTitle: "Импульс.<br>Тишина.<br><em>Траектория.</em>",
  launchLead:
    "Линейный электромагнитный ускоритель передаёт капсуле начальную скорость. Миниатюрная электрореактивная система корректирует курс, но не используется для отрыва от поверхности.",
  modeDemo: "м/с · наземная проверка",
  modeHop: "м/с · лунная логистика",
  modeOrbit: "м/с · с kick-stage",
  roadmapTitle: "Путь на Луну<br><em>начинается в лаборатории.</em>",
  roadmapProgress: "Текущая зрелость программы · Фаза 0",
  road0: "Концепт и реализуемость",
  road0Text: "Архитектура миссии, CAD, расчёты ускорителя и бизнес-проверка.",
  road0Detail:
    "Результаты: базовые требования, бюджеты массы и энергии, модель траектории и предварительный реестр рисков.",
  road1: "Лабораторный прототип",
  road1Text:
    "Ускоритель 50 см, инструментированные капсулы и высокоскоростная съёмка.",
  road1Detail:
    "Проверка: повторяемое ускорение, силовая электроника, тепловой режим и целостность капсулы.",
  road2: "Вакуум и реголит",
  road2Text:
    "Термовакуумная работа, имитатор лунного реголита и автономная загрузка.",
  road2Detail:
    "Проверка: устойчивость к пыли, обработка образцов, накопление энергии и удалённое восстановление.",
  road3: "Инженерная модель",
  road3Text:
    "Космическая электроника и программа квалификационных испытаний.",
  road3Detail:
    "Результаты: вибрация, удар, радиация и надёжность для интеграции лётного изделия.",
  road4: "Лунный демонстратор",
  road4Text:
    "Интеграция с коммерческим посадочным модулем и демонстрация на Луне.",
  road4Detail:
    "Миссия: сбор, упаковка, зарядка и первый автономный электромагнитный запуск на Луне.",
  road5: "Коммерческая логистика",
  road5Text:
    "Регулярные перевозки между лунной поверхностью и будущей орбитальной инфраструктурой.",
  road5Detail:
    "Рост: научные образцы, грузовые классы, лицензирование и Lunar Logistics as a Service.",
  finalTitle: "Первая линия доставки<br><em>за пределами Земли.</em>",
  finalLead:
    "Следите за разработкой LELP или запросите участие в ранней программе полезной нагрузки.",
  contactProject: "Связаться с проектом",
  footerLegal:
    "Проект на стадии концепта. Визуализации и характеристики могут изменяться.",
  backTop: "Наверх ↑",
  formTitle: "Запросить ранний доступ",
  formLead:
    "Расскажите, что вас интересует: лунный образец, научная нагрузка, инвестиции или партнёрство.",
  formName: "Имя и фамилия",
  formCompany: "Компания / организация",
  formInterest: "Направление",
  formChoose: "Выберите вариант",
  formSample: "Бронирование лунного образца",
  formPayload: "Научная полезная нагрузка",
  formPartner: "Инвестиции / партнёрство",
  formMedia: "СМИ / научный запрос",
  formMessage: "Сообщение",
  formMessagePlaceholder: "Расскажите о вашем интересе к LELP...",
  formConsent:
    "Я согласен, что мои данные могут использоваться для ответа на этот запрос.",
  formSubmit: "Отправить запрос",
  formResponse:
    "Запрос будет отправлен безопасно. Автоматическое подтверждение придёт на ваш email.",
  formSending: "Отправка запроса…",
  formSent:
    "Запрос успешно отправлен. Проверьте почту — автоматическое подтверждение уже в пути.",
  formError:
    "Не удалось отправить запрос. Попробуйте ещё раз позже или напишите на michaelok929@gmail.com.",
};

document.querySelectorAll("[data-i18n]").forEach((element) => {
  element.dataset.en = element.textContent;
});
document.querySelectorAll("[data-i18n-html]").forEach((element) => {
  element.dataset.enHtml = element.innerHTML;
});
document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
  element.dataset.enPlaceholder = element.getAttribute("placeholder");
});

function setLanguage(language) {
  const selected = language === "ru" ? "ru" : "en";
  document.documentElement.lang = selected;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent =
      selected === "ru"
        ? ruTranslations[element.dataset.i18n] || element.dataset.en
        : element.dataset.en;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML =
      selected === "ru"
        ? ruTranslations[element.dataset.i18nHtml] || element.dataset.enHtml
        : element.dataset.enHtml;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute(
      "placeholder",
      selected === "ru"
        ? ruTranslations[element.dataset.i18nPlaceholder] ||
            element.dataset.enPlaceholder
        : element.dataset.enPlaceholder,
    );
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-label-en]").forEach((element) => {
    const label =
      selected === "ru" ? element.dataset.labelRu : element.dataset.labelEn;
    element.dataset.label = label;
    element.setAttribute("aria-label", label);
  });

  localStorage.setItem("lelp-language", selected);
  queueMicrotask(() => updateRoadmapStatus());
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
setLanguage(localStorage.getItem("lelp-language") || "en");

const siteLoader = document.querySelector("#site-loader");
document.body.classList.add("is-loading");

if (!reduced && siteLoader) {
  animate(
    ".loader-earth",
    { rotate: [0, 360] },
    { duration: 8, repeat: Infinity, ease: "linear" },
  );
  animate(
    ".loader-orbit",
    { rotate: [0, 360] },
    { duration: 4.8, repeat: Infinity, ease: "linear" },
  );
  animate(
    ".loader-moon",
    { rotate: [0, -360] },
    { duration: 2.4, repeat: Infinity, ease: "linear" },
  );
}

const loaderStartedAt = performance.now();
addEventListener("load", () => {
  const elapsed = performance.now() - loaderStartedAt;
  const remaining = Math.max(0, 900 - elapsed);

  setTimeout(() => {
    if (!siteLoader) return;
    animate(
      siteLoader,
      { opacity: [1, 0], scale: [1, 1.015] },
      { duration: reduced ? 0.01 : 0.45, ease: "ease-out" },
    ).finished.then(() => {
      siteLoader.hidden = true;
      document.body.classList.remove("is-loading");
    });
  }, remaining);
});

function createRockViewer() {
  const element = document.querySelector("#rock-viewer-3d");
  if (!element) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.15, 5);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  element.prepend(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 3.4;
  controls.maxDistance = 7;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.75;

  controls.addEventListener("start", () => {
    controls.autoRotate = false;
  });
  controls.addEventListener("end", () => {
    controls.autoRotate = !reduced;
  });

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);

  scene.add(new THREE.HemisphereLight(0xddeaff, 0x111722, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x4c8df6, 1.4);
  rimLight.position.set(4, -1, -2);
  scene.add(rimLight);

  const modelBase =
    "assets/3D_model/moon/10021-79_SFM_Web-Resolution-Model_Coordinate-Registered";

  new MTLLoader().load(
    `${modelBase}.mtl`,
    (materials) => {
      materials.preload();

      new OBJLoader()
        .setMaterials(materials)
        .load(
          `${modelBase}.obj`,
          (model) => {
            const bounds = new THREE.Box3().setFromObject(model);
            const center = bounds.getCenter(new THREE.Vector3());
            const size = bounds.getSize(new THREE.Vector3());
            const scale = 2.8 / Math.max(size.x, size.y, size.z);

            model.position.sub(center);
            model.scale.setScalar(scale);
            model.rotation.set(-0.2, 0.35, 0.08);
            modelRoot.add(model);
            element.classList.add("is-ready");
          },
          undefined,
          () => {
            element.querySelector(".rock-loader").textContent =
              "SAMPLE / LOAD ERROR";
          },
        );
    },
    undefined,
    () => {
      element.querySelector(".rock-loader").textContent =
        "MATERIAL / LOAD ERROR";
    },
  );

  const clock = new THREE.Clock();
  const renderFrame = () => {
    const elapsed = clock.getElapsedTime();
    modelRoot.position.y = reduced ? 0 : Math.sin(elapsed * 0.75) * 0.09;
    modelRoot.rotation.z = reduced ? 0 : Math.sin(elapsed * 0.38) * 0.025;
    controls.update();
    renderer.render(scene, camera);
  };

  renderFrame();
  new IntersectionObserver(
    ([entry]) => {
      renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
    },
    { rootMargin: "250px" },
  ).observe(element);

  function resize() {
    renderer.setSize(element.clientWidth, element.clientHeight, false);
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
  }

  resize();
  new ResizeObserver(resize).observe(element);
}

initializeNearViewport("#rock-viewer-3d", createRockViewer);

function createMoon() {
  if (!moonElement) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  moonElement.prepend(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    "assets/moon/lroc_color_4k.webp",
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      textureLoader.load(
        "assets/moon/ldem_4k.png",
        (heightMap) => {
          heightMap.colorSpace = THREE.NoColorSpace;
          heightMap.anisotropy = Math.min(
            8,
            renderer.capabilities.getMaxAnisotropy(),
          );

          const geometry = new THREE.SphereGeometry(2, 192, 192);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            displacementMap: heightMap,
            displacementScale: 0.052,
            displacementBias: -0.026,
            bumpMap: heightMap,
            bumpScale: 0.035,
            roughness: 0.94,
            metalness: 0,
          });

          const moon = new THREE.Mesh(geometry, material);
          moon.rotation.set(0.08, -1.6, -0.03);
          scene.add(moon);

          const sunlight = new THREE.DirectionalLight(0xf5f8ff, 4.2);
          sunlight.position.set(-3.5, 2.8, 4);
          scene.add(sunlight);

          const earthshine = new THREE.DirectionalLight(0x3d78d8, 0.6);
          earthshine.position.set(4, -2, 1);
          scene.add(earthshine);
          scene.add(new THREE.AmbientLight(0x101b2e, 0.34));

          let pointerX = 0;
          let pointerY = 0;

          addEventListener(
            "pointermove",
            (event) => {
              pointerX = event.clientX / innerWidth - 0.5;
              pointerY = event.clientY / innerHeight - 0.5;
            },
            { passive: true },
          );

          const clock = new THREE.Clock();

          const renderFrame = () => {
            const elapsed = clock.getElapsedTime();

            if (!reduced) {
              moon.rotation.y += 0.00045;
              moon.rotation.x +=
                (0.08 + pointerY * 0.08 - moon.rotation.x) * 0.025;
              moon.rotation.z +=
                (-0.03 - pointerX * 0.06 - moon.rotation.z) * 0.025;
              moon.position.y = Math.sin(elapsed * 0.18) * 0.018;
            }

            renderer.render(scene, camera);
          };

          renderFrame();
          new IntersectionObserver(
            ([entry]) => {
              renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
            },
            { rootMargin: "200px" },
          ).observe(moonElement);

          moonElement.classList.add("is-ready");
        },
        undefined,
        () => {
          moonElement.querySelector(".moon-loader").textContent =
            "LDEM / LOAD ERROR";
        },
      );
    },
    undefined,
    () => {
      moonElement.querySelector(".moon-loader").textContent = "LROC / LOAD ERROR";
    },
  );

  function resizeMoon() {
    const size = moonElement.clientWidth;
    renderer.setSize(size, moonElement.clientHeight, false);
    camera.aspect = moonElement.clientWidth / moonElement.clientHeight;
    camera.updateProjectionMatrix();
  }

  resizeMoon();
  new ResizeObserver(resizeMoon).observe(moonElement);
}

createMoon();

function createLaunchMoon() {
  const element = document.querySelector("#launch-moon-3d");
  if (!element) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  element.prepend(renderer.domElement);

  const loader = new THREE.TextureLoader();

  Promise.all([
    loader.loadAsync("assets/moon/lroc_color_4k.webp"),
    loader.loadAsync("assets/moon/ldem_4k.png"),
  ])
    .then(([colorMap, heightMap]) => {
      colorMap.colorSpace = THREE.SRGBColorSpace;
      heightMap.colorSpace = THREE.NoColorSpace;

      const anisotropy = Math.min(
        8,
        renderer.capabilities.getMaxAnisotropy(),
      );
      colorMap.anisotropy = anisotropy;
      heightMap.anisotropy = anisotropy;

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(2, 160, 160),
        new THREE.MeshStandardMaterial({
          map: colorMap,
          displacementMap: heightMap,
          displacementScale: 0.052,
          displacementBias: -0.026,
          bumpMap: heightMap,
          bumpScale: 0.035,
          roughness: 0.95,
          metalness: 0,
        }),
      );

      moon.rotation.set(-0.14, 0.72, 0.12);
      scene.add(moon);

      const sunlight = new THREE.DirectionalLight(0xffffff, 4.8);
      sunlight.position.set(4.5, 2.2, 3.5);
      scene.add(sunlight);

      const rimLight = new THREE.DirectionalLight(0x346bc4, 0.45);
      rimLight.position.set(-4, -1, 1);
      scene.add(rimLight);
      scene.add(new THREE.AmbientLight(0x081326, 0.18));

      const renderFrame = () => {
        if (!reduced) moon.rotation.y -= 0.00028;
        renderer.render(scene, camera);
      };

      renderFrame();
      new IntersectionObserver(
        ([entry]) => {
          renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
        },
        { rootMargin: "200px" },
      ).observe(element);

      element.classList.add("is-ready");
    })
    .catch(() => {
      element.querySelector(".moon-loader").textContent = "LROC / LOAD ERROR";
    });

  function resize() {
    renderer.setSize(element.clientWidth, element.clientHeight, false);
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
  }

  resize();
  new ResizeObserver(resize).observe(element);
}

function initializeNearViewport(selector, initializer) {
  const element = document.querySelector(selector);
  if (!element) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      initializer();
    },
    { rootMargin: "600px" },
  );

  observer.observe(element);
}

initializeNearViewport("#launch-moon-3d", createLaunchMoon);

function createFinalMoon() {
  const element = document.querySelector("#final-moon-3d");
  if (!element) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;
  element.prepend(renderer.domElement);

  const loader = new THREE.TextureLoader();

  Promise.all([
    loader.loadAsync("assets/moon/lroc_color_4k.webp"),
    loader.loadAsync("assets/moon/ldem_4k.png"),
  ])
    .then(([colorMap, heightMap]) => {
      colorMap.colorSpace = THREE.SRGBColorSpace;
      heightMap.colorSpace = THREE.NoColorSpace;

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(2, 160, 160),
        new THREE.MeshStandardMaterial({
          map: colorMap,
          displacementMap: heightMap,
          displacementScale: 0.052,
          displacementBias: -0.026,
          bumpMap: heightMap,
          bumpScale: 0.035,
          roughness: 0.95,
          metalness: 0,
        }),
      );

      moon.rotation.set(0.32, 2.42, -0.16);
      scene.add(moon);

      const sunlight = new THREE.DirectionalLight(0xf7f9ff, 4.6);
      sunlight.position.set(-4.2, 3.5, 2.4);
      scene.add(sunlight);

      const blueRim = new THREE.DirectionalLight(0x2e66bd, 0.55);
      blueRim.position.set(4, -2, 1);
      scene.add(blueRim);
      scene.add(new THREE.AmbientLight(0x071124, 0.16));

      const renderFrame = () => {
        if (!reduced) moon.rotation.y += 0.0002;
        renderer.render(scene, camera);
      };

      renderFrame();
      new IntersectionObserver(
        ([entry]) => {
          renderer.setAnimationLoop(entry.isIntersecting ? renderFrame : null);
        },
        { rootMargin: "200px" },
      ).observe(element);

      element.classList.add("is-ready");
    })
    .catch(() => {
      element.querySelector(".moon-loader").textContent = "LROC / LOAD ERROR";
    });

  function resize() {
    renderer.setSize(element.clientWidth, element.clientHeight, false);
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
  }

  resize();
  new ResizeObserver(resize).observe(element);
}

initializeNearViewport("#final-moon-3d", createFinalMoon);

function calculateLaunchTrajectory() {
  const section = document.querySelector(".launch");
  const moon = document.querySelector("#launch-moon-3d");
  const svg = document.querySelector(".trajectory");
  const path = svg?.querySelector("path");
  const origin = svg?.querySelector(".trajectory-origin");

  if (!section || !moon || !svg || !path || !origin) return null;

  const sectionRect = section.getBoundingClientRect();
  const moonRect = moon.getBoundingClientRect();
  const width = section.clientWidth;
  const height = section.clientHeight;
  const radius = moonRect.width * 0.465;

  const p0 = {
    x: moonRect.left - sectionRect.left + moonRect.width / 2 - radius * 0.55,
    y: moonRect.top - sectionRect.top + moonRect.height / 2 + radius * 0.83,
  };
  const p2 = {
    x: 0,
    y: height * 0.04,
  };
  const control = {
    x: (p0.x + p2.x) / 2,
    y: p2.y,
  };

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const pathData = `M ${p0.x} ${p0.y} Q ${control.x} ${control.y} ${p2.x} ${p2.y}`;
  path.setAttribute("d", pathData);
  origin.setAttribute("cx", p0.x);
  origin.setAttribute("cy", p0.y);

  return { p0, control, p2, pathData };
}

calculateLaunchTrajectory();
addEventListener("resize", calculateLaunchTrajectory, { passive: true });

if (reduced) {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
} else {
  animate(
    ".stars",
    { x: [0, 7, 0], y: [0, -5, 0], opacity: [0.56, 0.72, 0.56] },
    { duration: 24, repeat: Infinity, ease: "ease-in-out" },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: .7, ease: [.22, 1, .36, 1] });
    }, { margin: "0px 0px -10% 0px" });
  });

  const moon = document.querySelector(".moon");
  scroll(animate(moon, { y: [0, -120], scale: [1, 1.06] }, { ease: "linear" }), {
    target: document.querySelector(".hero"),
    offset: ["start start", "end start"]
  });

  const steps = document.querySelectorAll(".step");
  inView(".mission-track", () => {
    animate(steps, { opacity: [0, 1], y: [25, 0] }, { delay: stagger(.1), duration: .55 });
    animate(".track-line i", { width: ["0%", "100%"] }, { duration: 1.2, ease: "ease-out" });
  });

  const launchSection = document.querySelector(".launch");
  const capsules = document.querySelectorAll(".capsule");

  inView(launchSection, () => {
    const curve = calculateLaunchTrajectory();
    if (!curve) return;

    capsules.forEach((capsule) => {
      capsule.style.offsetPath = `path("${curve.pathData}")`;
    });

    const animations = [...capsules].map((capsule, index) =>
      animate(
        capsule,
        {
          offsetDistance: ["0%", "100%"],
          scale: [0.72, 1, 0.92, 0.78, 0.6, 0.38],
          opacity: [0, 1, 1, 0.92, 0.68, 0],
        },
        {
          duration: 6.4,
          delay: index * -0.91,
          repeat: Infinity,
          ease: "linear",
        },
      ),
    );

    return () => animations.forEach((animation) => animation.stop());
  });

  animate(
    ".trajectory-origin",
    { opacity: [0.35, 1, 0.35], scale: [0.75, 1.45, 0.75] },
    { duration: 1.8, repeat: Infinity, ease: "ease-in-out" },
  );
}

const dialog = document.querySelector("#contact-dialog");
const roadmapItems = document.querySelectorAll(".roadmap-list li");
const roadmapProgress = document.querySelector(".roadmap-progress");

function updateRoadmapStatus() {
  const activeItem = document.querySelector(".roadmap-list li.active");
  const status = roadmapProgress?.querySelector("span");
  if (!activeItem || !status) return;

  const index = [...roadmapItems].indexOf(activeItem);
  const title = activeItem.querySelector("h3")?.textContent;
  const trl = activeItem.querySelector("b")?.textContent;
  const prefix = document.documentElement.lang === "ru" ? "Выбрано" : "Selected";

  status.textContent = `${prefix} · ${title} · ${trl}`;
  roadmapProgress.style.setProperty(
    "--roadmap-progress",
    `${((index + 1) / roadmapItems.length) * 100}%`,
  );
}

roadmapItems.forEach((item) => {
  item.querySelector("button").addEventListener("click", () => {
    roadmapItems.forEach((entry) => entry.classList.remove("active"));
    item.classList.add("active");
    updateRoadmapStatus();
    animate(
      item.querySelector("button"),
      { x: [-6, 0], opacity: [0.72, 1] },
      { duration: 0.28, ease: "ease-out" },
    );
  });
});
updateRoadmapStatus();

document.querySelectorAll(".open-dialog").forEach((button) => button.addEventListener("click", () => dialog.showModal()));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const earlyAccessForm = document.querySelector("#early-access-form");
const formStatus = document.querySelector("#form-status");
const formReturnUrl = document.querySelector("#form-return-url");

if (formReturnUrl) {
  formReturnUrl.value = `${location.origin}${location.pathname}?submitted=1`;
}

if (new URLSearchParams(location.search).get("submitted") === "1") {
  const language = document.documentElement.lang;
  formStatus.hidden = false;
  formStatus.classList.add("is-success");
  formStatus.textContent =
    language === "ru"
      ? ruTranslations.formSent
      : "Request sent successfully. Check your inbox — an automatic confirmation is on its way.";
  dialog.showModal();
  history.replaceState({}, "", location.pathname + location.hash);
}
