/**
 * ============================================================
 * LEADPOCKET
 * Product experience
 * Oneix Software
 * ============================================================
 */

(() => {
  "use strict";

  const root = document.querySelector(".leadpocket-page");

  if (!root) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ============================================================
     01. UTILITIES
     ============================================================ */

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);


  /* ============================================================
     02. PAGE READY
     ============================================================ */

  requestAnimationFrame(() => {
    root.classList.add("lp-ready");
  });


  /* ============================================================
     03. SCROLL REVEAL
     ============================================================ */

  const revealTargets = [
    ".lp-section-heading",
    ".lp-problem-step",
    ".lp-transformation-copy",
    ".lp-lead-card-demo",
    ".lp-pipeline-column",
    ".lp-priority-copy",
    ".lp-agenda",
    ".lp-features-heading",
    ".lp-feature-card",
    ".lp-audience-grid article",
    ".lp-pricing-intro",
    ".lp-pricing-card",
    ".lp-faq-heading",
    ".lp-faq details",
    ".lp-final-content"
  ];

  const revealElements = $$(revealTargets.join(","));

  revealElements.forEach((element, index) => {
    element.classList.add("lp-reveal");

    element.style.setProperty(
      "--lp-reveal-delay",
      `${(index % 4) * 55}ms`
    );
  });

  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("lp-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("lp-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* ============================================================
     04. NAV ACTIVE SECTION
     ============================================================ */

  const navigationLinks = $$(".lp-nav a[href^='#']");

  const navigationSections = navigationLinks
    .map((link) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return null;

      return document.querySelector(id);
    })
    .filter(Boolean);

  if (navigationSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            link.classList.toggle(
              "lp-nav-active",
              link.getAttribute("href") ===
                `#${entry.target.id}`
            );
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    navigationSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* ============================================================
     05. SMOOTH INTERNAL NAVIGATION
     ============================================================ */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      try {
        history.replaceState(null, "", targetId);
      } catch {
        // Ignore environments where history mutation is unavailable.
      }
    });
  });


  /* ============================================================
     06. HERO PRODUCT WINDOW PARALLAX
     ============================================================ */

  const productPreview = $(".lp-product-preview");
  const appWindow = $(".lp-app-window");

  if (
    productPreview &&
    appWindow &&
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    let animationFrame = null;

    let targetRotateX = 0;
    let targetRotateY = 0;

    let currentRotateX = 0;
    let currentRotateY = 0;

    const renderPreview = () => {
      currentRotateX +=
        (targetRotateX - currentRotateX) * 0.08;

      currentRotateY +=
        (targetRotateY - currentRotateY) * 0.08;

      appWindow.style.transform = `
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
      `;

      const stillMoving =
        Math.abs(targetRotateX - currentRotateX) > 0.01 ||
        Math.abs(targetRotateY - currentRotateY) > 0.01;

      if (stillMoving) {
        animationFrame =
          requestAnimationFrame(renderPreview);
      } else {
        animationFrame = null;
      }
    };

    const requestRender = () => {
      if (animationFrame !== null) return;

      animationFrame =
        requestAnimationFrame(renderPreview);
    };

    productPreview.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          productPreview.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width;

        const y =
          (event.clientY - rect.top) / rect.height;

        targetRotateY =
          clamp((x - 0.5) * 5, -2.5, 2.5);

        targetRotateX =
          clamp((0.5 - y) * 4, -2, 2);

        requestRender();
      }
    );

    productPreview.addEventListener(
      "pointerleave",
      () => {
        targetRotateX = 1;
        targetRotateY = -2;

        requestRender();
      }
    );
  }


  /* ============================================================
     07. HERO DASHBOARD LIVE STATE
     ============================================================ */

  const leadRows = $$(".lp-lead-row");

  let activeLeadIndex = 0;
  let leadInterval = null;

  const activateLead = (index) => {
    if (!leadRows.length) return;

    leadRows.forEach((row, rowIndex) => {
      row.classList.toggle(
        "lp-lead-active",
        rowIndex === index
      );
    });

    activeLeadIndex = index;
  };

  if (leadRows.length) {
    activateLead(0);

    leadRows.forEach((row, index) => {
      row.addEventListener("mouseenter", () => {
        activateLead(index);
      });
    });

    if (!reduceMotion) {
      leadInterval = window.setInterval(() => {
        activateLead(
          (activeLeadIndex + 1) %
            leadRows.length
        );
      }, 3200);
    }
  }


  /* ============================================================
     08. METRIC COUNTERS
     ============================================================ */

  const metricNumbers = $$(".lp-metric strong");

  const animateCounter = (
    element,
    target,
    duration = 900
  ) => {
    if (reduceMotion) {
      element.textContent = target;

      return;
    }

    const startTime = performance.now();

    const update = (time) => {
      const progress = clamp(
        (time - startTime) / duration,
        0,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      element.textContent =
        Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if (metricNumbers.length) {
    const metricsObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            const target =
              Number.parseInt(
                element.textContent,
                10
              ) || 0;

            animateCounter(element, target);

            observer.unobserve(element);
          });
        },
        {
          threshold: 0.6
        }
      );

    metricNumbers.forEach((number) => {
      metricsObserver.observe(number);
    });
  }


  /* ============================================================
     09. PIPELINE INTERACTION
     ============================================================ */

  const pipelineCards = $$(".lp-pipeline-card");

  pipelineCards.forEach((card) => {
    card.setAttribute("tabindex", "0");

    const activate = () => {
      pipelineCards.forEach((item) => {
        item.classList.remove(
          "lp-pipeline-selected"
        );
      });

      card.classList.add(
        "lp-pipeline-selected"
      );
    };

    card.addEventListener("click", activate);

    card.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          activate();
        }
      }
    );
  });


  /* ============================================================
     10. PIPELINE POINTER DEPTH
     ============================================================ */

  if (
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    pipelineCards.forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          card.style.setProperty(
            "--lp-pointer-x",
            `${x * 100}%`
          );

          card.style.setProperty(
            "--lp-pointer-y",
            `${y * 100}%`
          );
        }
      );
    });
  }


  /* ============================================================
     11. AGENDA INTERACTION
     ============================================================ */

  const agendaItems = $$(".lp-agenda-item");

  agendaItems.forEach((item) => {
    item.addEventListener("click", () => {
      agendaItems.forEach((agendaItem) => {
        agendaItem.classList.remove(
          "lp-agenda-selected"
        );
      });

      item.classList.add(
        "lp-agenda-selected"
      );
    });
  });


  /* ============================================================
     12. FEATURE CARD SPOTLIGHT
     ============================================================ */

  const featureCards = $$(".lp-feature-card");

  if (
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    featureCards.forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          card.style.setProperty(
            "--lp-spot-x",
            `${x}px`
          );

          card.style.setProperty(
            "--lp-spot-y",
            `${y}px`
          );
        }
      );
    });
  }


  /* ============================================================
     13. FAQ
     Only one item open at a time
     ============================================================ */

  const faqItems = $$(".lp-faq details");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });


  /* ============================================================
     14. NAVIGATION SCROLLED STATE
     ============================================================ */

  const topbar = $(".lp-topbar");

  const updateTopbar = () => {
    if (!topbar) return;

    topbar.classList.toggle(
      "lp-topbar-scrolled",
      window.scrollY > 30
    );
  };

  updateTopbar();

  window.addEventListener(
    "scroll",
    updateTopbar,
    {
      passive: true
    }
  );


  /* ============================================================
     15. PRODUCT GLOW MOVEMENT
     ============================================================ */

  const previewGlow = $(".lp-preview-glow");

  if (
    previewGlow &&
    productPreview &&
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    productPreview.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          productPreview.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        previewGlow.style.transform = `
          translate(
            ${(x - 0.5) * 25}px,
            ${(y - 0.5) * 20}px
          )
        `;
      }
    );

    productPreview.addEventListener(
      "pointerleave",
      () => {
        previewGlow.style.transform =
          "translate(0, 0)";
      }
    );
  }


  /* ============================================================
     16. HERO STATUS PULSE
     ============================================================ */

  const statusDot = $(".lp-status-dot");

  if (statusDot && !reduceMotion) {
    window.setInterval(() => {
      statusDot.classList.add(
        "lp-status-pulse"
      );

      window.setTimeout(() => {
        statusDot.classList.remove(
          "lp-status-pulse"
        );
      }, 900);
    }, 4200);
  }


  /* ============================================================
     17. PRICING CARD POINTER GLOW
     ============================================================ */

  const pricingCard = $(".lp-pricing-card");

  if (
    pricingCard &&
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    pricingCard.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          pricingCard.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) /
            rect.width) *
          100;

        const y =
          ((event.clientY - rect.top) /
            rect.height) *
          100;

        pricingCard.style.setProperty(
          "--lp-price-x",
          `${x}%`
        );

        pricingCard.style.setProperty(
          "--lp-price-y",
          `${y}%`
        );
      }
    );
  }


  /* ============================================================
     18. CLEANUP
     ============================================================ */

  window.addEventListener(
    "pagehide",
    () => {
      if (leadInterval) {
        window.clearInterval(
          leadInterval
        );
      }
    },
    {
      once: true
    }
  );

})();
