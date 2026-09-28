/**
 * ============================================================
 * ONEIX SOFTWARE STORE
 * Interactive product showroom
 * ============================================================
 */

(() => {
  "use strict";

  const root = document.querySelector(".oneix-store");

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
     PRODUCT DATA

     Store presentation data only.
     App URLs remain separate from the marketing pages.
     ============================================================ */

  const products = {
    leads: {
      id: "leadpocket",
      name: "LeadPocket",
      category: "OPPORTUNITY / FOLLOW-UP",

      headline:
        "Never lose a warm lead to a forgotten follow-up.",

      description:
        "Capture incoming opportunities, give each one an owner and keep the next action visible until the opportunity is closed.",

      accent: "#f2b66d",

      href: "./leadpocket/",

      button: "Explore LeadPocket",

      flow: [
        "Capture",
        "Own",
        "Follow up",
        "Close"
      ]
    },

    reviews: {
      id: "reviewloop",
      name: "ReviewLoop",
      category: "REVIEWS / REPUTATION",

      headline:
        "Turn completed work into public proof.",

      description:
        "Keep review requests visible after the work is finished and make it easier to follow through while the customer experience is still fresh.",

      accent: "#73e7d1",

      href: "./reviewloop/",

      button: "Explore ReviewLoop",

      flow: [
        "Complete",
        "Request",
        "Review",
        "Build trust"
      ]
    },

    payments: {
      id: "invoicenudge",
      name: "InvoiceNudge",
      category: "INVOICES / FOLLOW-UP",

      headline:
        "Keep unpaid invoices from going quiet.",

      description:
        "Keep outstanding invoices visible and make payment follow-up a clear recurring workflow instead of something remembered too late.",

      accent: "#77a7ff",

      href: "./invoicenudge/",

      button: "Explore InvoiceNudge",

      flow: [
        "Invoice",
        "Track",
        "Follow up",
        "Paid"
      ]
    },

    operations: {
      id: "sitepulse",
      name: "SitePulse",
      category: "MONITORING / OPERATIONS",

      headline:
        "Know when something needs attention.",

      description:
        "Keep important operational signals visible so problems are easier to notice before they disappear into dashboards, logs or routine.",

      accent: "#8de17f",

      href: "./sitepulse/",

      button: "Explore SitePulse",

      flow: [
        "Monitor",
        "Detect",
        "Alert",
        "Resolve"
      ]
    },

    customers: {
      id: "workshoprecall",
      name: "WorkshopRecall",
      category: "CUSTOMERS / RECALL",

      headline:
        "Bring past customers back at the right time.",

      description:
        "Keep previous customers visible and surface the right moment to reconnect instead of relying on memory or scattered customer records.",

      accent: "#e5a1ff",

      href: "./workshoprecall/",

      button: "Explore WorkshopRecall",

      flow: [
        "Remember",
        "Schedule",
        "Remind",
        "Return"
      ]
    }
  };



  const productVisuals = {
    leadpocket: {
      short: "LP", nav: ["Leads", "Today", "Pipeline"], eyebrow: "SATURDAY", title: "Follow-ups", action: "+ New lead",
      stats: [["New", "12", ""], ["Active", "18", ""], ["Overdue", "3", "danger"], ["Won", "7", "success"]],
      rows: [["SG", "Sarah Georgiou", "Kitchen renovation", "Call · 14:30", "Today", "today"], ["AP", "Andreas Petrou", "Solar installation", "Follow up · 2h", "Overdue", "overdue"], ["MK", "Marios Kyriakou", "Website enquiry", "Received now", "New", "new"]]
    },
    reviewloop: {
      short: "RL", nav: ["Overview", "Requests", "Reviews"], eyebrow: "REPUTATION", title: "Review activity", action: "+ Request",
      stats: [["Rating", "4.9", "success"], ["Reviews", "48", ""], ["Waiting", "6", "danger"], ["This month", "+12", "success"]],
      rows: [["MG", "Maria Georgiou", "Left a five-star review", "★★★★★", "New", "new"], ["AP", "Andreas Petrou", "Review request sent", "8 minutes ago", "Sent", "today"], ["EK", "Elena Kyriakou", "Waiting for response", "2 days", "Waiting", "overdue"]]
    },
    invoicenudge: {
      short: "IN", nav: ["Invoices", "Due soon", "Overdue"], eyebrow: "RECEIVABLES", title: "Payment timeline", action: "+ Invoice",
      stats: [["Outstanding", "€8,420", ""], ["Overdue", "€2,180", "danger"], ["Due this week", "€3,600", ""], ["Paid", "€12.9k", "success"]],
      rows: [["AT", "Atlas Studio", "INV-1048 · €1,240", "Due in 3 days", "Due", "today"], ["NV", "Nova Works", "INV-1039 · €860", "Nudge sent", "Overdue", "overdue"], ["HM", "Harbor Media", "INV-1042 · €2,100", "Paid today", "Paid", "new"]]
    },
    sitepulse: {
      short: "SP", nav: ["Monitors", "Incidents", "Reports"], eyebrow: "LIVE MONITORING", title: "Endpoint health", action: "+ Monitor",
      stats: [["Uptime", "99.98%", "success"], ["Median", "126 ms", ""], ["Incidents", "2", "danger"], ["Checks", "18", ""]],
      rows: [["OX", "oneix.ltd", "200 OK", "126 ms", "Online", "new"], ["API", "api.example.com", "200 OK", "84 ms", "Online", "new"], ["CO", "checkout", "Degraded", "642 ms", "Watch", "overdue"]]
    },
    workshoprecall: {
      short: "WR", nav: ["Customers", "Vehicles", "Reminders"], eyebrow: "SERVICE RECALL", title: "Returns due", action: "+ Customer",
      stats: [["Due soon", "14", ""], ["Ready", "8", "success"], ["Overdue", "3", "danger"], ["Returned", "11", "success"]],
      rows: [["MG", "Maria Georgiou", "BMW 320i · last 12 Mar", "Next service 12 Sep", "Ready", "today"], ["AP", "Andreas Petrou", "Ford Focus · last 4 Apr", "Reminder in 2 days", "Soon", "new"], ["EK", "Elena Kyriakou", "Toyota Yaris · last 18 Feb", "Return overdue", "Overdue", "overdue"]]
    }
  };


  /* ============================================================
     TOPBAR
     ============================================================ */

  const topbar = $(".store-topbar");

  const updateTopbar = () => {
    if (!topbar) return;

    topbar.classList.toggle(
      "store-topbar-scrolled",
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
     SMOOTH SCROLL
     ============================================================ */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion
          ? "auto"
          : "smooth",

        block: "start"
      });
    });
  });


  /* ============================================================
     HERO 3D UNIVERSE
     ============================================================ */

  const universe = $(".product-universe");

  const mainUniverseCard = $(
    ".universe-card-main"
  );

  const floatingCards = $$(
    ".universe-card-secondary"
  );

  if (
    universe &&
    mainUniverseCard &&
    finePointer &&
    !reduceMotion
  ) {
    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame = null;

    const renderUniverse = () => {
      currentX +=
        (targetX - currentX) * 0.065;

      currentY +=
        (targetY - currentY) * 0.065;


      /* Main card */

      mainUniverseCard.style.transform = `
        translate(-50%, -50%)
        rotateY(${-9 + currentX * 5}deg)
        rotateX(${4 - currentY * 4}deg)
        translateZ(70px)
      `;


      /* Orbit movement */

      universe.style.setProperty(
        "--universe-x",
        `${currentX}`
      );

      universe.style.setProperty(
        "--universe-y",
        `${currentY}`
      );


      /* Floating cards move at
         different depth speeds */

      floatingCards.forEach(
        (card, index) => {
          const depth =
            4 + index * 1.7;

          card.style.translate = `
            ${currentX * depth}px
            ${currentY * depth}px
          `;
        }
      );


      const moving =
        Math.abs(targetX - currentX) >
          0.001 ||
        Math.abs(targetY - currentY) >
          0.001;

      if (moving) {
        animationFrame =
          requestAnimationFrame(
            renderUniverse
          );
      } else {
        animationFrame = null;
      }
    };


    const requestRender = () => {
      if (animationFrame !== null) return;

      animationFrame =
        requestAnimationFrame(
          renderUniverse
        );
    };


    universe.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          universe.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        targetX =
          clamp(
            (x - 0.5) * 2,
            -1,
            1
          );

        targetY =
          clamp(
            (y - 0.5) * 2,
            -1,
            1
          );

        requestRender();
      }
    );


    universe.addEventListener(
      "pointerleave",
      () => {
        targetX = 0;
        targetY = 0;

        requestRender();
      }
    );
  }


  /* ============================================================
     PRODUCT CARD 3D TILT
     ============================================================ */

  const productCards = $$(
    "[data-product-card]"
  );

  if (
    productCards.length &&
    finePointer &&
    !reduceMotion
  ) {
    productCards.forEach((card) => {
      let frame = null;

      let targetRX = 0;
      let targetRY = 0;

      let currentRX = 0;
      let currentRY = 0;


      const render = () => {
        currentRX +=
          (targetRX - currentRX) *
          0.11;

        currentRY +=
          (targetRY - currentRY) *
          0.11;

        card.style.transform = `
          perspective(1100px)
          rotateX(${currentRX}deg)
          rotateY(${currentRY}deg)
          translateY(-2px)
        `;

        const moving =
          Math.abs(
            targetRX - currentRX
          ) > 0.01 ||
          Math.abs(
            targetRY - currentRY
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

          const x =
            (event.clientX -
              rect.left) /
            rect.width;

          const y =
            (event.clientY -
              rect.top) /
            rect.height;


          /* Maximum tilt ~4 degrees */

          targetRY =
            clamp(
              (x - 0.5) * 8,
              -4,
              4
            );

          targetRX =
            clamp(
              (0.5 - y) * 7,
              -3.5,
              3.5
            );


          /* Cursor glow */

          card.style.setProperty(
            "--card-x",
            `${x * 100}%`
          );

          card.style.setProperty(
            "--card-y",
            `${y * 100}%`
          );

          requestRender();
        }
      );


      card.addEventListener(
        "pointerleave",
        () => {
          targetRX = 0;
          targetRY = 0;

          requestRender();
        }
      );
    });
  }


  /* ============================================================
     PRODUCT CARD DEPTH
     ============================================================ */

  if (
    finePointer &&
    !reduceMotion
  ) {
    productCards.forEach((card) => {
      const content =
        $(".product-card-content", card);

      const visual =
        card.querySelector(
          [
            ".leadpocket-card-ui",
            ".review-card-ui",
            ".invoice-card-ui",
            ".pulse-card-ui",
            ".client-card-ui",
            ".cron-card-ui",
            ".expiry-card-ui",
            ".log-card-ui",
            ".qr-card-ui",
            ".recall-card-ui"
          ].join(",")
        );

      const footer =
        $("footer", card);

      if (content) {
        content.style.transform =
          "translateZ(18px)";
      }

      if (visual) {
        visual.style.transformStyle =
          "preserve-3d";

        visual.style.translate =
          "0 0 28px";
      }

      if (footer) {
        footer.style.transform =
          "translateZ(14px)";
      }
    });
  }


  /* ============================================================
     SOLUTION SELECTOR
     ============================================================ */

  const solutionTabs = $$(
    ".solution-tab"
  );

  const solutionStage = $(
    ".solution-stage"
  );

  const solutionTitle = $(
    "[data-product-title]"
  );

  const solutionHeadline = $(
    "[data-product-headline]"
  );

  const solutionDescription = $(
    "[data-product-description]"
  );

  const solutionLink = $(
    "[data-product-link]"
  );

  const solutionCategory = $(
    ".solution-category"
  );

  const solutionFlow = $(
    ".solution-flow"
  );

  const solutionVisual = $(
    ".solution-visual"
  );


  const updateSolution = (
    solutionKey
  ) => {
    const product =
      products[solutionKey];

    if (!product) return;


    /* Tabs */

    solutionTabs.forEach((tab) => {
      const active =
        tab.dataset.solution ===
        solutionKey;

      tab.classList.toggle(
        "active",
        active
      );

      tab.setAttribute(
        "aria-selected",
        active ? "true" : "false"
      );
    });


    if (!solutionStage) return;


    /* Transition out */

    solutionStage.classList.add(
      "solution-changing"
    );


    window.setTimeout(
      () => {

        solutionStage.dataset.activeProduct =
          product.id;

        solutionStage.style.setProperty(
          "--active-accent",
          product.accent
        );


        if (solutionTitle) {
          solutionTitle.textContent =
            product.name;
        }


        if (solutionHeadline) {
          solutionHeadline.textContent =
            product.headline;
        }


        if (solutionDescription) {
          solutionDescription.textContent =
            product.description;
        }


        if (solutionCategory) {
          solutionCategory.textContent =
            product.category;

          solutionCategory.style.color =
            product.accent;
        }


        if (solutionLink) {
          solutionLink.href =
            product.href;

          solutionLink.innerHTML = `
            ${product.button}
            <span>↗</span>
          `;

          solutionLink.style.color =
            product.accent;

          solutionLink.style.borderColor =
            `${product.accent}40`;

          solutionLink.style.background =
            `${product.accent}12`;
        }


        /* Workflow */

        if (solutionFlow) {
          solutionFlow.innerHTML =
            product.flow
              .map(
                (step, index) => {
                  const arrow =
                    index <
                    product.flow.length - 1
                      ? "<i>→</i>"
                      : "";

                  return `
                    <span>${step}</span>
                    ${arrow}
                  `;
                }
              )
              .join("");
        }



        /* Product-specific compact interface */
        const visual = productVisuals[product.id];
        const visualSidebar = $(".solution-dashboard aside");
        const visualMain = $(".solution-dashboard-main");

        if (visual && visualSidebar && visualMain) {
          visualSidebar.innerHTML = `
            <strong>${visual.short}</strong>
            ${visual.nav.map((item, index) => `<span class="${index === 0 ? "active" : ""}">${item}</span>`).join("")}
          `;

          visualMain.innerHTML = `
            <header>
              <div><small>${visual.eyebrow}</small><strong>${visual.title}</strong></div>
              <button type="button">${visual.action}</button>
            </header>
            <div class="solution-stats">
              ${visual.stats.map(([label, value, tone]) => `<div class="${tone}"><span>${label}</span><strong>${value}</strong></div>`).join("")}
            </div>
            <div class="solution-leads">
              ${visual.rows.map(([avatar, name, detail, action, state, tone]) => `
                <article>
                  <i>${avatar}</i>
                  <div><strong>${name}</strong><span>${detail}</span></div>
                  <div><small>NEXT</small><strong>${action}</strong></div>
                  <em class="${tone}">${state}</em>
                </article>
              `).join("")}
            </div>
          `;
        }


        /* Visual accent */

        const glow = $(
          ".solution-visual-glow"
        );

        if (glow) {
          glow.style.background =
            `${product.accent}18`;
        }


        solutionStage.classList.remove(
          "solution-changing"
        );

      },
      reduceMotion ? 0 : 170
    );
  };


  solutionTabs.forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        updateSolution(
          tab.dataset.solution
        );
      }
    );
  });


  /* ============================================================
     SOLUTION WINDOW TILT
     ============================================================ */

  const solutionWindow = $(
    ".solution-window"
  );

  if (
    solutionVisual &&
    solutionWindow &&
    finePointer &&
    !reduceMotion
  ) {
    let frame = null;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    const render = () => {
      currentX +=
        (targetX - currentX) *
        0.08;

      currentY +=
        (targetY - currentY) *
        0.08;


      solutionWindow.style.transform = `
        rotateY(${-4 + currentX * 3}deg)
        rotateX(${2 - currentY * 2}deg)
        translate3d(
          ${currentX * 5}px,
          ${currentY * 4}px,
          0
        )
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


    solutionVisual.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          solutionVisual.getBoundingClientRect();

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


    solutionVisual.addEventListener(
      "pointerleave",
      () => {
        targetX = 0;
        targetY = 0;

        requestRender();
      }
    );
  }


  /* ============================================================
     SCROLL REVEALS
     ============================================================ */

  const revealSelectors = [
    ".store-section-heading",
    ".solution-tabs",
    ".solution-stage",
    ".product-card",
    ".philosophy-title",
    ".philosophy-principles article",
    ".store-final-cta"
  ];

  const revealElements = $$(
    revealSelectors.join(",")
  );


  revealElements.forEach(
    (element, index) => {
      element.classList.add(
        "store-reveal"
      );

      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 60}ms`
      );
    }
  );


  if (reduceMotion) {
    revealElements.forEach(
      (element) => {
        element.classList.add(
          "store-visible"
        );
      }
    );
  } else {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "store-visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.1,

          rootMargin:
            "0px 0px -60px 0px"
        }
      );


    revealElements.forEach(
      (element) => {
        revealObserver.observe(
          element
        );
      }
    );
  }


  /* ============================================================
     HERO PARALLAX
     ============================================================ */

  const hero = $(".store-hero");

  const heroCopy = $(".store-hero-copy");

  if (
    hero &&
    heroCopy &&
    finePointer &&
    !reduceMotion
  ) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          hero.getBoundingClientRect();

        const x =
          (
            event.clientX -
            rect.left
          ) / rect.width;

        const y =
          (
            event.clientY -
            rect.top
          ) / rect.height;


        heroCopy.style.transform = `
          translate3d(
            ${(x - 0.5) * -5}px,
            ${(y - 0.5) * -4}px,
            0
          )
        `;
      }
    );


    hero.addEventListener(
      "pointerleave",
      () => {
        heroCopy.style.transform =
          "translate3d(0,0,0)";
      }
    );
  }


  /* ============================================================
     FINAL PRODUCT STACK
     ============================================================ */

  const finalStack = $(
    ".store-final-stack"
  );

  const finalCards = finalStack
    ? $$(
        ".store-final-stack > div"
      )
    : [];


  if (
    finalStack &&
    finalCards.length &&
    finePointer &&
    !reduceMotion
  ) {
    finalStack.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          finalStack.getBoundingClientRect();

        const x =
          (
            event.clientX -
            rect.left
          ) / rect.width;

        const y =
          (
            event.clientY -
            rect.top
          ) / rect.height;


        finalCards.forEach(
          (card, index) => {
            const strength =
              3 + index * 1.3;

            card.style.marginLeft =
              `${
                (x - 0.5) *
                strength
              }px`;

            card.style.marginTop =
              `${
                (y - 0.5) *
                strength
              }px`;
          }
        );
      }
    );


    finalStack.addEventListener(
      "pointerleave",
      () => {
        finalCards.forEach(
          (card) => {
            card.style.marginLeft =
              "0px";

            card.style.marginTop =
              "0px";
          }
        );
      }
    );
  }


  /* ============================================================
     MARQUEE PAUSE ON HOVER
     ============================================================ */

  const marquee = $(
    ".product-marquee"
  );

  const marqueeTrack = $(
    ".product-marquee-track"
  );

  if (
    marquee &&
    marqueeTrack &&
    finePointer
  ) {
    marquee.addEventListener(
      "mouseenter",
      () => {
        marqueeTrack.style.animationPlayState =
          "paused";
      }
    );

    marquee.addEventListener(
      "mouseleave",
      () => {
        marqueeTrack.style.animationPlayState =
          "running";
      }
    );
  }


  /* ============================================================
     NAV ACTIVE SECTION
     ============================================================ */

  const navLinks = $$(
    '.store-nav a[href^="#"]'
  );

  const navSections =
    navLinks
      .map((link) => {
        const id =
          link.getAttribute("href");

        if (
          !id ||
          id === "#"
        ) {
          return null;
        }

        return document.querySelector(
          id
        );
      })
      .filter(Boolean);


  if (navSections.length) {
    const navObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              navLinks.forEach(
                (link) => {
                  link.classList.toggle(
                    "store-nav-active",

                    link.getAttribute(
                      "href"
                    ) ===
                      `#${entry.target.id}`
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-25% 0px -65% 0px",

          threshold: 0
        }
      );


    navSections.forEach(
      (section) => {
        navObserver.observe(
          section
        );
      }
    );
  }


  /* ============================================================
     INITIAL STATE
     ============================================================ */

  updateSolution("leads");

  requestAnimationFrame(() => {
    root.classList.add(
      "store-ready"
    );
  });

})();