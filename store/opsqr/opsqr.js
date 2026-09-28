/* opsqr: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".opsqr-page");
  if (!page) return;
  page
    .querySelectorAll("[data-start]")
    .forEach((link) => (link.href = "https://opsqr.oneix.ltd/signup"));
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
    if (reduced.matches) transition?.complete();
  });
  const scene = page.querySelector(".oq-scene");
  const checks = [...page.querySelectorAll("[data-check]")];
  const complete = page.querySelector("[data-complete]");
  let scanned = false;
  function reset() {
    scanned = false;
    scene.dataset.scanned = "false";
    checks.forEach((check) => {
      check.checked = false;
      check.disabled = false;
    });
    complete.disabled = true;
    complete.textContent = "Complete example check ✓";
    page.querySelector("[data-checklist]").hidden = true;
    page.querySelector("[data-scan]").hidden = false;
    page.querySelector("[data-scan-status]").textContent =
      "Ready to identify an asset";
    page.querySelector("[data-phone-note]").textContent =
      "No camera access is needed.";
  }
  page.querySelector("[data-scan]").addEventListener("click", () => {
    scanned = true;
    scene.dataset.scanned = "true";
    page.querySelector("[data-checklist]").hidden = false;
    page.querySelector("[data-scan]").hidden = true;
    page.querySelector("[data-scan-status]").textContent =
      "Asset identified · QR–0241";
    page.querySelector("[data-phone-note]").textContent =
      "Check both items to complete this local example.";
    reveal(page.querySelector(".oq-phone-content"));
  });
  checks.forEach((check) =>
    check.addEventListener("change", () => {
      complete.disabled = !scanned || !checks.every((item) => item.checked);
    }),
  );
  complete.addEventListener("click", () => {
    if (!scanned || !checks.every((item) => item.checked)) return;
    page.querySelector("[data-scan-status]").textContent =
      "Checklist completed ✓";
    page.querySelector("[data-phone-note]").textContent =
      "Example activity recorded. No real asset was changed.";
    complete.textContent = "Completed in this example ✓";
    complete.disabled = true;
    checks.forEach((check) => (check.disabled = true));
    reveal(page.querySelector(".oq-phone-content"));
  });
  page.querySelector("[data-reset]").addEventListener("click", reset);
})();
