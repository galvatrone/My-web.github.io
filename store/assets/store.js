/** ONEIX Store — product catalogue, pricing and lightweight UI motion. */
(() => {
  "use strict";

  const PRODUCTS = [
    {
      id: "leadpocket",
      name: "LeadPocket",
      symbol: "LP",
      category: "revenue",
      label: "LEADS",
      accent: "#f2b66d",
      copy: "Keep every promising enquiry moving.",
      plans: [
        { name: "Solo", month: 15, year: 139 },
        { name: "Team", month: 29, year: 268 },
      ],
    },
    {
      id: "reviewloop",
      name: "ReviewLoop",
      symbol: "RL",
      category: "reputation",
      label: "REVIEWS",
      accent: "#73e7d1",
      copy: "Turn completed work into public proof.",
      plans: [
        { name: "Early Adopter", month: 19, year: 176 },
        { name: "Standard", month: 39, year: 361 },
      ],
    },
    {
      id: "invoicenudge",
      name: "InvoiceNudge",
      symbol: "IN",
      category: "revenue",
      label: "INVOICES",
      accent: "#77a7ff",
      copy: "Keep unpaid invoices from going quiet.",
      plans: [{ name: "Starter", month: 15, year: 139 }],
    },
    {
      id: "sitepulse",
      name: "SitePulse",
      symbol: "SP",
      category: "operations",
      label: "MONITORING",
      accent: "#8de17f",
      copy: "Know when the web misses a beat.",
      plans: [{ name: "Starter", month: 10, year: 92 }],
    },
    {
      id: "clientdock",
      name: "ClientDock",
      symbol: "CD",
      category: "customers",
      label: "CLIENTS",
      accent: "#bb8cff",
      copy: "Give client work one calm place to land.",
      plans: [{ name: "Starter", month: 15, year: 139 }],
    },
    {
      id: "cronbeacon",
      name: "CronBeacon",
      symbol: "CB",
      category: "operations",
      label: "SCHEDULES",
      accent: "#ff9276",
      copy: "Treat silence from scheduled jobs as a signal.",
      plans: [{ name: "Starter", month: 12, year: 111 }],
    },
    {
      id: "expirydesk",
      name: "ExpiryDesk",
      symbol: "ED",
      category: "operations",
      label: "RENEWALS",
      accent: "#f2c75c",
      copy: "See every renewal before it becomes urgent.",
      plans: [{ name: "Starter", month: 19, year: 176 }],
    },
    {
      id: "logsentry",
      name: "LogSentry",
      symbol: "LS",
      category: "operations",
      label: "LOGS",
      accent: "#ff79bd",
      copy: "Find the event that explains what changed.",
      plans: [{ name: "Starter", month: 19, year: 176 }],
    },
    {
      id: "opsqr",
      name: "OpsQR",
      symbol: "OQ",
      category: "customers",
      label: "ASSETS",
      accent: "#62e7ff",
      copy: "Put the right checklist on the physical asset.",
      plans: [{ name: "Starter", month: 19, year: 176 }],
    },
    {
      id: "workshoprecall",
      name: "WorkshopRecall",
      symbol: "WR",
      category: "revenue",
      label: "RETENTION",
      accent: "#e5a1ff",
      copy: "Bring service customers back at the right time.",
      plans: [{ name: "Starter", month: 29, year: 268 }],
    },
  ];

  const DEMOS = {
    leadpocket: {
      metrics: [
        ["Active leads", "18"],
        ["Due today", "4"],
        ["Overdue", "3"],
      ],
      rows: [
        ["SG", "Sarah Georgiou", "Kitchen renovation", "Call · 14:30"],
        ["AP", "Andreas Petrou", "Solar installation", "Overdue"],
      ],
    },
    reviewloop: {
      metrics: [
        ["Rating", "4.9"],
        ["New reviews", "12"],
        ["Waiting", "6"],
      ],
      rows: [
        ["MG", "Maria Georgiou", "Five-star review", "Published"],
        ["AP", "Andreas Petrou", "Request sent", "8 min ago"],
      ],
    },
    invoicenudge: {
      metrics: [
        ["Outstanding", "€8.4k"],
        ["Overdue", "€2.1k"],
        ["Paid", "€12.9k"],
      ],
      rows: [
        ["AT", "Atlas Studio", "INV-1048 · €1,240", "Due in 3d"],
        ["NV", "Nova Works", "INV-1039 · €860", "Nudge sent"],
      ],
    },
    sitepulse: {
      metrics: [
        ["Uptime", "99.98%"],
        ["Latency", "126ms"],
        ["Incidents", "2"],
      ],
      rows: [
        ["OX", "oneix.ltd", "200 OK", "Online"],
        ["CO", "Checkout", "503 response", "Incident"],
      ],
    },
    clientdock: {
      metrics: [
        ["Projects", "8"],
        ["Approvals", "3"],
        ["Requests", "2"],
      ],
      rows: [
        ["BD", "Brand direction", "Design package", "Approved"],
        ["PB", "Project brief", "Client document", "Review"],
      ],
    },
    cronbeacon: {
      metrics: [
        ["Jobs", "18"],
        ["Healthy", "17"],
        ["Missing", "1"],
      ],
      rows: [
        ["DB", "Database backup", "Every day · 02:00", "Healthy"],
        ["BI", "Billing sync", "Expected · 12:30", "Missing"],
      ],
    },
    expirydesk: {
      metrics: [
        ["Renewals", "8"],
        ["Due soon", "3"],
        ["Overdue", "1"],
      ],
      rows: [
        ["SS", "SSL certificate", "Due in 8 days", "Priority"],
        ["CT", "Client contract", "Due in 42 days", "Planned"],
      ],
    },
    logsentry: {
      metrics: [
        ["Events", "6"],
        ["Errors", "2"],
        ["Rules", "4"],
      ],
      rows: [
        ["500", "Checkout failed", "api.checkout", "Inspect"],
        ["401", "Token rejected", "auth.session", "Matched"],
      ],
    },
    opsqr: {
      metrics: [
        ["Assets", "48"],
        ["Checks open", "3"],
        ["Complete", "45"],
      ],
      rows: [
        ["AC", "Unit AC-204", "Filter inspection", "Open"],
        ["PV", "Pump PV-18", "Safety checklist", "Complete"],
      ],
    },
    workshoprecall: {
      metrics: [
        ["Due soon", "14"],
        ["Ready", "8"],
        ["Returned", "11"],
      ],
      rows: [
        ["MG", "Maria · BMW 320i", "Next service 12 Sep", "Ready"],
        ["AP", "Andreas · Ford Focus", "Reminder in 2 days", "Soon"],
      ],
    },
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [
    ...context.querySelectorAll(selector),
  ];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  let billing = "monthly";
  let filter = "all";

  const money = (value) =>
    Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`;
  const firstYear = (year) => Math.round(year * 20) / 100;
  const productPage = (id) => `./${id}/`;
  const signupPage = (id) => `https://${id}.oneix.ltd/signup`;

  function renderConsoleTabs() {
    const host = $("[data-product-tabs]");
    if (!host) return;
    host.innerHTML = PRODUCTS.map(
      (product, index) => `
      <button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}" class="${index === 0 ? "active" : ""}" data-console-product="${product.id}" style="--tab-accent:${product.accent}">
        <span>${String(index + 1).padStart(2, "0")}</span><strong>${product.name}</strong><small>${product.label}</small>
      </button>`,
    ).join("");
  }

  function selectProduct(id) {
    const product = PRODUCTS.find((entry) => entry.id === id);
    if (!product) return;
    $$("[data-console-product]").forEach((button) => {
      const active = button.dataset.consoleProduct === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    const preview = $("[data-preview]");
    if (!preview) return;
    preview.style.setProperty("--active-accent", product.accent);
    $("[data-preview-index]").textContent = String(
      PRODUCTS.indexOf(product) + 1,
    ).padStart(2, "0");
    $("[data-preview-category]").textContent = product.label;
    $("[data-preview-symbol]").textContent = product.symbol;
    $("[data-preview-name]").textContent = product.name;
    $("[data-preview-copy]").textContent = product.copy;

    const demo = DEMOS[product.id];
    const demoPanel = $("[data-preview-demo]");
    if (demo && demoPanel) {
      demoPanel.setAttribute("aria-label", product.name + " interface example");
      $("[data-demo-metrics]").innerHTML = demo.metrics
        .map(
          ([label, value]) =>
            "<div><span>" +
            label +
            "</span><strong>" +
            value +
            "</strong></div>",
        )
        .join("");
      const productIndex = PRODUCTS.indexOf(product) + 1;
      $("[data-demo-chart]").innerHTML = [42, 66, 51, 78, 63, 88, 74]
        .map((value, index) => {
          const height = 34 + ((value + productIndex * index * 7) % 58);
          return '<i style="--bar:' + height + '%"></i>';
        })
        .join("");
      $("[data-demo-rows]").innerHTML = demo.rows
        .map(
          ([avatar, name, detail, status]) =>
            "<div><i>" +
            avatar +
            "</i><span><strong>" +
            name +
            "</strong><small>" +
            detail +
            "</small></span><em>" +
            status +
            "</em></div>",
        )
        .join("");
    }

    $("[data-preview-price]").textContent =
      `${money(product.plans[0].month)}/mo`;
    $("[data-preview-promo]").textContent = money(
      firstYear(product.plans[0].year),
    );
    $("[data-preview-page]").href = productPage(product.id);
    $("[data-preview-signup]").href = signupPage(product.id);

    if (!reduced && window.Motion?.animate) {
      window.Motion.animate(
        preview,
        { opacity: [0.65, 1], transform: ["translateY(5px)", "translateY(0)"] },
        { duration: 0.24 },
      );
    }
  }

  function priceMarkup(product) {
    return product.plans
      .map((plan) => {
        if (billing === "monthly") {
          return `<div class="product-plan"><span>${plan.name}</span><strong>${money(plan.month)}<small>/month</small></strong></div>`;
        }
        return `<div class="product-plan annual"><span>${plan.name}</span><strong>${money(firstYear(plan.year))}<small>/first year</small></strong><del>${money(plan.year)}/year after</del></div>`;
      })
      .join("");
  }

  function renderProducts() {
    const grid = $("[data-product-grid]");
    if (!grid) return;
    const visible = PRODUCTS.filter(
      (product) => filter === "all" || product.category === filter,
    );
    grid.innerHTML = visible
      .map(
        (product) => `
      <article class="product-card" style="--product-accent:${product.accent}">
        <header><span>${String(PRODUCTS.indexOf(product) + 1).padStart(2, "0")} / ${product.label}</span><i>${product.symbol}</i></header>
        <div class="product-card-copy"><h3>${product.name}</h3><p>${product.copy}</p></div>
        <div class="product-plans">${priceMarkup(product)}</div>
        ${billing === "annual" ? '<p class="promo-note"><strong>−80%</strong> launch price shown · renews at regular annual price</p>' : '<p class="promo-note">30 days free · no card required to register</p>'}
        <footer><a href="${productPage(product.id)}">Product details <span>↗</span></a><a class="card-start" href="${signupPage(product.id)}">Start free <span>→</span></a></footer>
      </article>`,
      )
      .join("");

    if (!reduced && window.Motion?.animate) {
      window.Motion.animate(
        $$(".product-card", grid),
        { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
        { duration: 0.32, delay: (index) => index * 0.035 },
      );
    }
  }

  renderConsoleTabs();
  renderProducts();

  $$("[data-filter], [data-billing]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active")),
    );
  });

  $("[data-product-tabs]")?.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$("[data-console-product]");
    const current = tabs.indexOf(document.activeElement);
    let next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : current + (event.key === "ArrowRight" ? 1 : -1);
    next = (next + tabs.length) % tabs.length;
    tabs[next].focus();
    selectProduct(tabs[next].dataset.consoleProduct);
  });

  document.addEventListener("click", (event) => {
    const consoleButton = event.target.closest("[data-console-product]");
    if (consoleButton) selectProduct(consoleButton.dataset.consoleProduct);

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      filter = filterButton.dataset.filter;
      $$("[data-filter]").forEach((button) => {
        const active = button === filterButton;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderProducts();
    }

    const billingButton = event.target.closest("[data-billing]");
    if (billingButton) {
      billing = billingButton.dataset.billing;
      $$("[data-billing]").forEach((button) => {
        const active = button === billingButton;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      renderProducts();
    }
  });

  $$('a[href^="#"]').forEach((link) =>
    link.addEventListener("click", (event) => {
      const target = $(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }),
  );

  const topbar = $(".store-topbar");
  addEventListener(
    "scroll",
    () => topbar?.classList.toggle("scrolled", scrollY > 24),
    { passive: true },
  );

  if (!coarse && !reduced) {
    const productConsole = $("[data-console]");
    productConsole?.addEventListener("pointermove", (event) => {
      const rect = productConsole.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      productConsole.style.setProperty("--rx", `${y * -2.5}deg`);
      productConsole.style.setProperty("--ry", `${x * 3.5}deg`);
    });
    productConsole?.addEventListener("pointerleave", () => {
      productConsole.style.setProperty("--rx", "0deg");
      productConsole.style.setProperty("--ry", "0deg");
    });
  }
})();
