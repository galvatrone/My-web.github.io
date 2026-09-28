/* workshoprecall: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".workshoprecall-page");
  if (!page) return;
  page
    .querySelectorAll("[data-start]")
    .forEach((link) => (link.href = "https://workshoprecall.oneix.ltd/signup"));
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
  const states = {
    service: {
      date: "12 MARCH / SERVICE RECORDED",
      title: "The work is done. Keep the context.",
      copy: "A customer, a vehicle and the last service. Set a recommended return date so the next conversation has a starting point.",
    },
    reminder: {
      date: "12 SEPTEMBER / RECALL DUE",
      title: "A thoughtful reminder, at the right time.",
      copy: "Review the service record and the customer’s preferences before sending a reminder. This example does not send an email.",
    },
    returned: {
      date: "18 SEPTEMBER / EXAMPLE NEXT VISIT",
      title: "They’re back. Keep the story going.",
      copy: "A new service visit can become the next record in the customer’s history. This is an illustrative outcome, not a confirmed appointment.",
    },
  };
  function show(id) {
    const state = states[id];
    page
      .querySelectorAll("[data-stage]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.stage === id),
        ),
      );
    page.querySelector("[data-lifecycle-date]").textContent = state.date;
    page.querySelector("[data-lifecycle-title]").textContent = state.title;
    page.querySelector("[data-lifecycle-copy]").textContent = state.copy;
    page.querySelector("[data-message]").hidden = id !== "reminder";
    reveal(page.querySelector(".wr-state"));
  }
  page
    .querySelectorAll("[data-stage]")
    .forEach((button) =>
      button.addEventListener("click", () => show(button.dataset.stage)),
    );
  page
    .querySelector("[data-reset]")
    .addEventListener("click", () => show("service"));
})();
