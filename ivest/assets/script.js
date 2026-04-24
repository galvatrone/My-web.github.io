(function () {
  const content = window.VectorContent || {};

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const renderCards = (selector, items, renderer) => {
    const root = $(selector);
    if (!root || !Array.isArray(items)) return;
    root.innerHTML = items.map(renderer).join("");
  };

  const safeText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value || "";
  };

  safeText("#hero-lead", content.heroLead);
  safeText("#problem-intro", content.problemIntro);
  safeText("#footer-vision", content.footerVision);

  renderCards("#hero-pillars", content.heroPillars, (item) => `
    <article class="pillar-card">
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  renderCards("#reasons-list", content.reasons, (item, index) => `
    <article class="reason-card">
      <div class="reason-card__icon" aria-hidden="true">${index + 1}</div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </div>
    </article>
  `);

  renderCards("#team-grid", content.team, (member) => `
    <article class="team-card">
      <!-- TODO: Replace placeholder portrait with real headshot -->
      <div class="team-card__avatar" aria-hidden="true">${escapeHtml(member.initials)}</div>
      <h3>${escapeHtml(member.name)}</h3>
      <p class="team-card__title">${escapeHtml(member.title)}</p>
      <p>${escapeHtml(member.bio)}</p>
    </article>
  `);

  renderCards("#pitch-panels", content.pitchPanels, (item) => `
    <article class="pitch-panel">
      <strong>${escapeHtml(item.stat)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `);

  const quoteRoot = $("#pitch-quote");
  if (quoteRoot && content.pitchQuote) {
    quoteRoot.innerHTML = `
      <p class="quote-card__eyebrow">QUOTE / PRESS</p>
      <blockquote>${escapeHtml(content.pitchQuote.quote)}</blockquote>
      <p class="quote-card__source">${escapeHtml(content.pitchQuote.source)}</p>
    `;
  }

  renderCards("#problem-stats", content.problemStats, (item) => `
    <article class="stat-card">
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `);

  renderCards("#solution-features", content.solutionFeatures, (item) => `
    <article class="feature-item">
      <span class="feature-item__icon" aria-hidden="true"></span>
      <p>${escapeHtml(item)}</p>
    </article>
  `);

  renderCards("#expert-grid", content.experts, (item) => `
    <article class="expert-card">${escapeHtml(item)}</article>
  `);

  renderCards("#segment-grid", content.segments, (item) => `
    <article class="segment-card" data-segment="${escapeHtml(item.slug || '')}">
      <div class="segment-card__top">
        <p>${escapeHtml(item.title)}</p>
        <span>${escapeHtml(item.subtitle)}</span>
      </div>
      <div class="segment-card__bottom">
        <strong>${escapeHtml(item.tam)}</strong>
      </div>
    </article>
  `);

  renderCards("#phase-grid", content.phases, (item) => `
    <article class="phase-card">
      <span class="phase-card__step">${escapeHtml(item.step)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  renderCards("#spec-list", content.specs, (item) => `
    <article class="spec-item">
      <span class="spec-item__icon" aria-hidden="true"></span>
      <div>
        <h3>${escapeHtml(item.label)}</h3>
        <p>${escapeHtml(item.value)}</p>
      </div>
    </article>
  `);

  renderCards("#powertrain-benefits", content.powertrainBenefits, (item) => `
    <article class="benefit-chip">${escapeHtml(item)}</article>
  `);

  renderCards("#comparison-body", content.comparisonRows, (row) => `
    <tr>
      <th scope="row">${escapeHtml(row[0])}</th>
      <td>${escapeHtml(row[1])}</td>
      <td class="comparison-table__highlight">${escapeHtml(row[2])}</td>
    </tr>
  `);

  renderCards("#logistics-flow", content.logisticsFlow, (item, index) => `
    <article class="timeline-step">
      <span>${index + 1}</span>
      <p>${escapeHtml(item)}</p>
    </article>
  `);

  renderCards("#safety-list", content.safety, (item) => `
    <article class="safety-item">
      <span class="safety-item__icon" aria-hidden="true"></span>
      <p>${escapeHtml(item)}</p>
    </article>
  `);

  renderCards("#traction-list", content.traction, (item) => `
    <article class="traction-item">${escapeHtml(item)}</article>
  `);

  renderCards("#social-stats", content.socialStats, (item) => `
    <article class="stat-card stat-card--proof">
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `);

  const commentRoot = $("#featured-comment");
  if (commentRoot && content.featuredComment) {
    commentRoot.innerHTML = `
      <p class="comment-card__label">FEATURED COMMENT</p>
      <blockquote>${escapeHtml(content.featuredComment.quote)}</blockquote>
      <p class="comment-card__source">${escapeHtml(content.featuredComment.source)}</p>
    `;
  }

  renderCards("#about-grid", content.about, (item) => `
    <article class="info-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  renderCards("#rewards-grid", content.rewards, (item) => `
    <article class="info-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  renderCards("#discussion-grid", content.discussion, (item) => `
    <article class="info-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  renderCards("#faq-grid", content.faqs, (item) => `
    <details class="faq-card">
      <summary>${escapeHtml(item.q)}</summary>
      <p>${escapeHtml(item.a)}</p>
    </details>
  `);

  renderCards("#why-us-grid", content.whyUs, (item) => `
    <article class="info-card info-card--why">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `);

  const tabLinks = $$("[data-tab-link]");
  const tabSections = tabLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveTab = (id) => {
    tabLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && tabSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.45, rootMargin: "-15% 0px -45% 0px" }
    );

    tabSections.forEach((section) => sectionObserver.observe(section));
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const nav = $("[data-mobile-nav]");
      const toggle = $("[data-mobile-nav-toggle]");
      if (nav && toggle) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = $$(".reveal");

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const tabBar = $("[data-tab-bar]");
  const header = $(".site-header");

  const handleScrollState = () => {
    const scrolled = window.scrollY > 120;
    if (tabBar) tabBar.classList.toggle("is-elevated", scrolled);
    if (header) header.classList.toggle("is-elevated", scrolled);
  };

  handleScrollState();
  window.addEventListener("scroll", handleScrollState, { passive: true });

  const mobileToggle = $("[data-mobile-nav-toggle]");
  const mobileNav = $("[data-mobile-nav]");
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const modal = $("[data-video-modal]");
  const modalFrame = $("[data-video-frame]");
  const placeholderMarkup =
    '<p class="video-modal__empty">Добавьте URL видео в `assets/content.js` для активации modal player.</p>';

  const openVideo = () => {
    if (!modal || !modalFrame) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (content.videoUrl) {
      modalFrame.innerHTML = `
        <iframe
          src="${escapeHtml(content.videoUrl)}"
          title="Vector overview video"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
    } else {
      modalFrame.innerHTML = placeholderMarkup;
    }
  };

  const closeVideo = () => {
    if (!modal || !modalFrame) return;
    modal.hidden = true;
    modalFrame.innerHTML = placeholderMarkup;
    document.body.classList.remove("modal-open");
  };

  $$("[data-video-open]").forEach((trigger) => {
    trigger.addEventListener("click", openVideo);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openVideo();
      }
    });
  });

  $$("[data-video-close]").forEach((trigger) => trigger.addEventListener("click", closeVideo));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeVideo();
  });
})();
