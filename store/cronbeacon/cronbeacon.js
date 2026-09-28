/* cronbeacon: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".cronbeacon-page");
  if (!page) return;
  const oneix =
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd");
  page.querySelectorAll("[data-start]").forEach((link) => {
    link.href = oneix
      ? "https://cronbeacon.oneix.ltd/signup"
      : "https://cronbeacon.oneix.ltd/signup";
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
  function setScenario(healthy) {
    page.querySelector(".cb-console").dataset.healthy = String(healthy);
    page.querySelector("[data-clock]").textContent = healthy
      ? "12:30"
      : "12:35";
    page.querySelector("[data-beacon-status]").textContent = healthy
      ? "Heartbeat received"
      : "Missing heartbeat";
    page.querySelector("[data-alert-copy]").textContent = healthy
      ? "nightly-report checked in at its expected time."
      : "nightly-report is 5 minutes past its expected check-in.";
    page.querySelector("[data-job-copy]").textContent = healthy
      ? "Heartbeat received"
      : "No heartbeat received";
    page.querySelector("[data-job-symbol]").textContent = healthy ? "✓" : "!";
    page
      .querySelectorAll("[data-scenario]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String((button.dataset.scenario === "healthy") === healthy),
        ),
      );
    reveal(page.querySelector(".cb-alert"));
  }
  page
    .querySelectorAll("[data-scenario]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setScenario(button.dataset.scenario === "healthy"),
      ),
    );
})();
