/**
 * ============================================================
 * REVIEWLOOP — ONEIX
 * Reputation Engine interactions
 * ============================================================
 */

(() => {
  "use strict";

  const root = document.querySelector(".reviewloop-page");
  if (!root) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);


  /* ============================================================
     READY
     ============================================================ */

  requestAnimationFrame(() => {
    root.classList.add("rl-ready");
  });


  /* ============================================================
     TOPBAR
     ============================================================ */

  const topbar = $(".rl-topbar");

  const updateTopbar = () => {
    if (!topbar) return;

    topbar.classList.toggle(
      "rl-topbar-scrolled",
      window.scrollY > 30
    );
  };

  updateTopbar();

  window.addEventListener(
    "scroll",
    updateTopbar,
    { passive: true }
  );


  /* ============================================================
     SMOOTH NAVIGATION
     ============================================================ */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });


  /* ============================================================
     ACTIVE NAV
     ============================================================ */

  const navLinks = $$('.rl-nav a[href^="#"]');

  const navSections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return null;

      return $(href);
    })
    .filter(Boolean);

  if (
    navSections.length &&
    "IntersectionObserver" in window
  ) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "rl-nav-active",
              link.getAttribute("href") ===
                `#${entry.target.id}`
            );
          });
        });
      },
      {
        threshold: 0,
        rootMargin: "-25% 0px -65% 0px"
      }
    );

    navSections.forEach((section) => {
      navObserver.observe(section);
    });
  }


  /* ============================================================
     SCROLL REVEALS
     ============================================================ */

  const revealSelectors = [
    ".rl-section-heading",
    ".rl-problem-flow article",
    ".rl-loop-copy",
    ".rl-app-preview",
    ".rl-review-wall > article",
    ".rl-feature-card",
    ".rl-audience-layout > div",
    ".rl-pricing-copy",
    ".rl-price-card",
    ".rl-faq-heading",
    ".rl-faq-list",
    ".rl-final"
  ];

  const revealElements = $$(
    revealSelectors.join(",")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("rl-reveal");

    element.style.setProperty(
      "--rl-delay",
      `${(index % 4) * 65}ms`
    );
  });

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("rl-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "rl-visible"
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* ============================================================
     HERO REPUTATION ENGINE — PARALLAX
     ============================================================ */

  const engine = $(".rl-engine");
  const engineCenter = $(".rl-engine-center");
  const scoreCard = $(".rl-score-card");
  const floatingReview = $(".rl-floating-review");

  if (
    engine &&
    finePointer &&
    !reduceMotion
  ) {
    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let frame = null;

    const render = () => {
      currentX +=
        (targetX - currentX) * 0.065;

      currentY +=
        (targetY - currentY) * 0.065;


      if (engineCenter) {
        engineCenter.style.marginLeft =
          `${currentX * 8}px`;

        engineCenter.style.marginTop =
          `${currentY * 6}px`;
      }


      if (scoreCard) {
        scoreCard.style.transform = `
          translate3d(
            ${currentX * 15}px,
            ${currentY * 12}px,
            50px
          )
          rotateY(${-10 + currentX * 4}deg)
          rotateX(${currentY * -3}deg)
          rotateZ(3deg)
        `;
      }


      if (floatingReview) {
        floatingReview.style.transform = `
          translate3d(
            ${currentX * -18}px,
            ${currentY * -13}px,
            65px
          )
          rotateY(${9 + currentX * 4}deg)
          rotateX(${currentY * -3}deg)
          rotateZ(-3deg)
        `;
      }


      const moving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001;

      if (moving) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
      }
    };


    const requestRender = () => {
      if (frame !== null) return;

      frame = requestAnimationFrame(render);
    };


    engine.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          engine.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        targetX = clamp(
          (x - 0.5) * 2,
          -1,
          1
        );

        targetY = clamp(
          (y - 0.5) * 2,
          -1,
          1
        );

        engine.style.setProperty(
          "--mouse-x",
          `${x * 100}%`
        );

        engine.style.setProperty(
          "--mouse-y",
          `${y * 100}%`
        );

        requestRender();
      }
    );


    engine.addEventListener(
      "pointerleave",
      () => {
        targetX = 0;
        targetY = 0;

        requestRender();
      }
    );
  }


  /* ============================================================
     REPUTATION LOOP
     Job → Request → Review
     ============================================================ */

  const loopNodes = [
    $(".rl-node-job"),
    $(".rl-node-request"),
    $(".rl-node-review")
  ].filter(Boolean);

  let loopStep = 0;
  let loopTimer = null;


  const activateLoopStep = (index) => {
    loopNodes.forEach((node, nodeIndex) => {
      node.classList.toggle(
        "rl-node-active",
        nodeIndex === index
      );

      node.classList.toggle(
        "rl-node-complete",
        nodeIndex < index
      );
    });
  };


  const startLoop = () => {
    if (
      reduceMotion ||
      loopNodes.length === 0
    ) {
      return;
    }

    activateLoopStep(0);

    loopTimer = window.setInterval(() => {
      loopStep =
        (loopStep + 1) %
        loopNodes.length;

      activateLoopStep(loopStep);

      if (loopStep === 2) {
        triggerReviewArrival();
      }
    }, 2200);
  };


  /* ============================================================
     REVIEW ARRIVAL
     ============================================================ */

  let reviewArrivalTimer = null;

  const triggerReviewArrival = () => {
    if (!floatingReview) return;

    floatingReview.classList.remove(
      "rl-review-arrived"
    );

    void floatingReview.offsetWidth;

    floatingReview.classList.add(
      "rl-review-arrived"
    );

    clearTimeout(reviewArrivalTimer);

    reviewArrivalTimer =
      window.setTimeout(() => {
        floatingReview.classList.remove(
          "rl-review-arrived"
        );
      }, 1300);
  };


  startLoop();


  /* ============================================================
     LOOP RINGS ROTATION
     ============================================================ */

  const rings = $$(".rl-loop-ring");

  if (
    rings.length &&
    !reduceMotion
  ) {
    rings.forEach((ring, index) => {
      ring.classList.add(
        `rl-ring-motion-${index + 1}`
      );
    });
  }


  /* ============================================================
     HERO RATING COUNT
     ============================================================ */

  const heroRating =
    $(".rl-score-main > strong");

  const finalRating =
    $(".rl-final-rating strong");

  const animateRating = (
    element,
    start,
    end,
    duration
  ) => {
    if (!element) return;

    if (reduceMotion) {
      element.textContent =
        end.toFixed(1);

      return;
    }

    const startTime =
      performance.now();

    const update = (time) => {
      const progress = clamp(
        (time - startTime) /
          duration,
        0,
        1
      );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      const value =
        start +
        (end - start) *
          eased;

      element.textContent =
        value.toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };


  if (
    heroRating &&
    "IntersectionObserver" in window
  ) {
    const ratingObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            animateRating(
              heroRating,
              4.6,
              4.9,
              1200
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.4
        }
      );

    ratingObserver.observe(heroRating);
  }


  if (
    finalRating &&
    "IntersectionObserver" in window
  ) {
    const finalRatingObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            animateRating(
              finalRating,
              4.6,
              4.9,
              1000
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.5
        }
      );

    finalRatingObserver.observe(
      finalRating
    );
  }


  /* ============================================================
     DASHBOARD METRIC COUNT-UP
     ============================================================ */

  const metrics = $$(".rl-metrics strong");

  const metricTargets = [
    {
      element: metrics[0],
      from: 4.5,
      to: 4.9,
      decimal: true
    },
    {
      element: metrics[1],
      from: 0,
      to: 48
    },
    {
      element: metrics[2],
      from: 0,
      to: 72
    },
    {
      element: metrics[3],
      from: 0,
      to: 6
    }
  ].filter(
    (metric) => metric.element
  );


  const animateMetric = (
    metric,
    duration = 1000
  ) => {
    const startTime =
      performance.now();

    const render = (time) => {
      const progress =
        clamp(
          (time - startTime) /
            duration,
          0,
          1
        );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      const value =
        metric.from +
        (metric.to -
          metric.from) *
          eased;

      metric.element.textContent =
        metric.decimal
          ? value.toFixed(1)
          : Math.round(value);

      if (progress < 1) {
        requestAnimationFrame(render);
      }
    };

    requestAnimationFrame(render);
  };


  const metricsContainer =
    $(".rl-metrics");

  if (
    metricsContainer &&
    metricTargets.length
  ) {
    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      metricTargets.forEach(
        (metric) => {
          metric.element.textContent =
            metric.decimal
              ? metric.to.toFixed(1)
              : metric.to;
        }
      );
    } else {
      const metricObserver =
        new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(
              (entry) => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }

                metricTargets.forEach(
                  (metric, index) => {
                    window.setTimeout(
                      () => {
                        animateMetric(
                          metric,
                          850
                        );
                      },
                      index * 100
                    );
                  }
                );

                observer.unobserve(
                  entry.target
                );
              }
            );
          },
          {
            threshold: 0.4
          }
        );

      metricObserver.observe(
        metricsContainer
      );
    }
  }


  /* ============================================================
     APP WINDOW TILT
     ============================================================ */

  const appPreview =
    $(".rl-app-preview");

  const appWindow =
    $(".rl-app-window");

  if (
    appPreview &&
    appWindow &&
    finePointer &&
    !reduceMotion
  ) {
    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let frame = null;


    const render = () => {
      currentX +=
        (targetX - currentX) *
        0.08;

      currentY +=
        (targetY - currentY) *
        0.08;


      appWindow.style.transform = `
        perspective(1400px)
        rotateY(${-4 + currentX * 3}deg)
        rotateX(${2 - currentY * 2.5}deg)
        translate3d(
          ${currentX * 5}px,
          ${currentY * 4}px,
          0
        )
      `;


      const moving =
        Math.abs(
          targetX - currentX
        ) > 0.005 ||
        Math.abs(
          targetY - currentY
        ) > 0.005;


      if (moving) {
        frame =
          requestAnimationFrame(
            render
          );
      } else {
        frame = null;
      }
    };


    const requestRender = () => {
      if (frame !== null) return;

      frame =
        requestAnimationFrame(
          render
        );
    };


    appPreview.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          appPreview.getBoundingClientRect();

        targetX =
          clamp(
            (
              (event.clientX -
                rect.left) /
              rect.width -
              0.5
            ) * 2,
            -1,
            1
          );

        targetY =
          clamp(
            (
              (event.clientY -
                rect.top) /
              rect.height -
              0.5
            ) * 2,
            -1,
            1
          );

        requestRender();
      }
    );


    appPreview.addEventListener(
      "pointerleave",
      () => {
        targetX = 0;
        targetY = 0;

        requestRender();
      }
    );
  }


  /* ============================================================
     REVIEW WALL — 3D CARDS
     ============================================================ */

  const reviewCards =
    $$(".rl-review-wall > article");

  if (
    finePointer &&
    !reduceMotion
  ) {
    reviewCards.forEach((card) => {
      let frame = null;

      let targetX = 0;
      let targetY = 0;

      let currentX = 0;
      let currentY = 0;


      const render = () => {
        currentX +=
          (targetX - currentX) *
          0.1;

        currentY +=
          (targetY - currentY) *
          0.1;

        card.style.transform = `
          perspective(1000px)
          rotateX(${currentY * -3}deg)
          rotateY(${currentX * 3}deg)
          translateY(-3px)
        `;

        const moving =
          Math.abs(
            targetX - currentX
          ) > 0.01 ||
          Math.abs(
            targetY - currentY
          ) > 0.01;

        if (moving) {
          frame =
            requestAnimationFrame(
              render
            );
        } else {
          frame = null;
        }
      };


      const requestRender = () => {
        if (frame !== null) return;

        frame =
          requestAnimationFrame(
            render
          );
      };


      card.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          targetX =
            clamp(
              (
                (event.clientX -
                  rect.left) /
                rect.width -
                0.5
              ) * 2,
              -1,
              1
            );

          targetY =
            clamp(
              (
                (event.clientY -
                  rect.top) /
                rect.height -
                0.5
              ) * 2,
              -1,
              1
            );

          card.style.setProperty(
            "--rl-card-x",
            `${
              (
                (event.clientX -
                  rect.left) /
                rect.width
              ) * 100
            }%`
          );

          card.style.setProperty(
            "--rl-card-y",
            `${
              (
                (event.clientY -
                  rect.top) /
                rect.height
              ) * 100
            }%`
          );

          requestRender();
        }
      );


      card.addEventListener(
        "pointerleave",
        () => {
          targetX = 0;
          targetY = 0;

          requestRender();
        }
      );
    });
  }


  /* ============================================================
     FEATURE CARDS — CURSOR SPOTLIGHT
     ============================================================ */

  const featureCards =
    $$(".rl-feature-card");

  if (finePointer) {
    featureCards.forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left;

          const y =
            event.clientY -
            rect.top;

          card.style.setProperty(
            "--rl-feature-x",
            `${x}px`
          );

          card.style.setProperty(
            "--rl-feature-y",
            `${y}px`
          );
        }
      );
    });
  }


  /* ============================================================
     REVIEW REQUEST BUTTON
     Small demo interaction
     ============================================================ */

  const requestButton =
    $(".rl-mini-request button");

  if (requestButton) {
    requestButton.addEventListener(
      "click",
      () => {
        if (
          requestButton.classList.contains(
            "rl-request-sent"
          )
        ) {
          return;
        }

        requestButton.classList.add(
          "rl-request-sent"
        );

        requestButton.textContent =
          "Sent ✓";

        triggerReviewArrival();
      }
    );
  }


  /* ============================================================
     DASHBOARD REQUEST BUTTON
     ============================================================ */

  const dashboardRequest =
    $(".rl-dashboard-header button");

  if (dashboardRequest) {
    dashboardRequest.addEventListener(
      "click",
      () => {
        const original =
          dashboardRequest.textContent;

        dashboardRequest.textContent =
          "Request created ✓";

        dashboardRequest.classList.add(
          "rl-dashboard-requested"
        );

        window.setTimeout(() => {
          dashboardRequest.textContent =
            original;

          dashboardRequest.classList.remove(
            "rl-dashboard-requested"
          );
        }, 1800);
      }
    );
  }


  /* ============================================================
     FAQ — ONE OPEN AT A TIME
     ============================================================ */

  const faqItems =
    $$(".rl-faq-list details");

  faqItems.forEach((item) => {
    item.addEventListener(
      "toggle",
      () => {
        if (!item.open) return;

        faqItems.forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      }
    );
  });


  /* ============================================================
     CLEANUP
     ============================================================ */

  window.addEventListener(
    "pagehide",
    () => {
      if (loopTimer) {
        clearInterval(loopTimer);
      }

      if (reviewArrivalTimer) {
        clearTimeout(
          reviewArrivalTimer
        );
      }
    }
  );

})();