/* sitepulse: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".sitepulse-page");
  if (!page) return;
  const oneix =
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd");
  page.querySelectorAll("[data-start]").forEach((link) => {
    link.href = oneix
      ? "https://sitepulse.oneix.ltd/signup"
      : "https://sitepulse.oneix.ltd/signup";
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  let transition;
  function reveal(element) {
    transition?.stop();
    if (!reduced.matches && !coarse.matches && window.Motion?.animate)
      transition = window.Motion.animate(
        element,
        { opacity: [0.6, 1] },
        { duration: 0.22 },
      );
  }
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      transition?.complete();
    }
  });
  const monitor = page.querySelector(".sp-monitor");
  const endpoints = [
    {
      domain: "oneix.ltd",
      latency: "126",
      code: "200 OK",
      health: "Operational",
      issue: false,
    },
    {
      domain: "api.example.com",
      latency: "84",
      code: "200 OK",
      health: "Operational",
      issue: false,
    },
    {
      domain: "checkout.example.com",
      latency: "642",
      code: "503 Service unavailable",
      health: "Check failed",
      issue: true,
    },
  ];
  let selected = 0;
  function render() {
    const item = endpoints[selected];
    page.querySelector("[data-domain]").textContent = item.domain;
    page.querySelector("[data-latency]").textContent = item.latency;
    page.querySelector("[data-code]").textContent = item.code;
    page.querySelector("[data-health]").textContent = "● " + item.health;
    monitor.dataset.issue = String(item.issue);
    page
      .querySelectorAll("[data-endpoint]")
      .forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === selected)),
      );
    page.querySelector("[data-check-note]").textContent =
      "Example check at 12:41. No live request is made.";
    page.querySelector("[data-check]").textContent = "Run example check ↗";
    reveal(page.querySelector(".sp-readout"));
  }
  page.querySelectorAll("[data-endpoint]").forEach((button, i) =>
    button.addEventListener("click", () => {
      selected = i;
      render();
    }),
  );
  page.querySelector("[data-check]").addEventListener("click", () => {
    page.querySelector("[data-check-note]").textContent =
      "Example check complete: " +
      endpoints[selected].code +
      " · " +
      endpoints[selected].latency +
      " ms. No network request sent.";
    page.querySelector("[data-check]").textContent = "Run again ↗";
    reveal(page.querySelector(".sp-wave"));
  });
})();
