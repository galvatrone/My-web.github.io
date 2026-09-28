/* clientdock: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".clientdock-page");
  if (!page) return;
  const oneix =
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd");
  page.querySelectorAll("[data-start]").forEach((link) => {
    link.href = oneix
      ? "https://clientdock.oneix.ltd/signup"
      : "https://clientdock.oneix.ltd/signup";
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
  let selected = 0;
  let approved = false;
  const files = [
    {
      title: "A clearer<br>direction.",
      label: "ATLAS / DESIGN STUDIO",
      meta: "Brand direction · Version 02",
    },
    {
      title: "A shared<br>starting point.",
      label: "ATLAS / PROJECT BRIEF",
      meta: "Project brief · Version 01",
    },
  ];
  function render() {
    const file = files[selected];
    page
      .querySelectorAll("[data-file]")
      .forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === selected)),
      );
    page.querySelector("[data-doc-title]").innerHTML = file.title;
    page.querySelector("[data-doc-label]").textContent = file.label;
    page.querySelector("[data-doc-meta]").textContent = file.meta;
    page.querySelector("[data-approval-status]").textContent =
      selected === 1
        ? "Reference document"
        : approved
          ? "Approved ✓"
          : "Awaiting your approval";
    page.querySelector("[data-review-copy]").textContent =
      selected === 1
        ? "The brief keeps scope and context close to the work."
        : approved
          ? "The decision is recorded in this example."
          : "Review the direction, then record your decision.";
    const button = page.querySelector("[data-approve]");
    button.hidden = selected === 1;
    button.disabled = approved;
    button.textContent = approved
      ? "Approved in this example ✓"
      : "Approve this example ✓";
    page.querySelector("[data-pending]").textContent = approved ? "0" : "1";
    reveal(page.querySelector(".cd-document"));
  }
  page.querySelectorAll("[data-file]").forEach((button, i) =>
    button.addEventListener("click", () => {
      selected = i;
      render();
    }),
  );
  page.querySelector("[data-approve]").addEventListener("click", () => {
    approved = true;
    page.querySelector("[data-activity]").textContent =
      "Alex / Client approved Brand direction v02 in this example.";
    render();
  });
  page.querySelector("[data-reset]").addEventListener("click", () => {
    approved = false;
    selected = 0;
    page.querySelector("[data-activity]").textContent =
      "Jamie / Team shared Brand direction v02 for review.";
    render();
  });
})();
