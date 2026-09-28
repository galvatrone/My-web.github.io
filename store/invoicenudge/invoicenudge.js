/* InvoiceNudge: a local, illustrative invoice timeline. No network writes. */
(() => {
  "use strict";

  const root = document.querySelector(".invoicenudge-page");
  if (!root) return;

  // Keep this product's application destination independent of Store scripts.
  const isOneix =
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd");
  root.querySelectorAll("[data-start]").forEach((link) => {
    link.href = isOneix
      ? "https://invoicenudge.oneix.ltd/signup"
      : "https://invoicenudge.oneix.ltd/signup";
  });

  const desk = root.querySelector(".in-payment-desk");
  const stages = [...desk.querySelectorAll("[data-stage]")];
  const content = desk.querySelector(".in-state-content");
  const nextButton = desk.querySelector("[data-next]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const touch = matchMedia("(pointer: coarse)");
  const states = [
    {
      id: "issued",
      status: "Issued",
      kicker: "01 / A clear starting point",
      title: "The invoice is on the record.",
      copy: "€1,240, one customer and one due date. Keep the essential details together from the start.",
      event: "02 Jun · Invoice added to the workspace",
      next: "Next: due soon →",
    },
    {
      id: "due",
      status: "Due soon",
      kicker: "02 / Three days to go",
      title: "See the due date before it passes.",
      copy: "Payment is due on 16 Jun. Nothing is overdue yet; keep the upcoming amount visible without rushing the conversation.",
      event: "13 Jun · Due in 3 days",
      next: "Next: reminder →",
    },
    {
      id: "reminder",
      status: "Overdue",
      kicker: "03 / Two days overdue",
      title: "A little context. A measured nudge.",
      copy: "The due date has passed. Review a reminder with the invoice number, amount and date before following up.",
      event: "18 Jun · Reminder preview opened",
      next: "Next: mark paid →",
    },
    {
      id: "paid",
      status: "Paid",
      kicker: "04 / Close the loop",
      title: "Payment recorded. Follow-up resolved.",
      copy: "Mark the invoice paid when the money arrives. The example is now closed; InvoiceNudge has not processed a payment.",
      event: "20 Jun · Invoice marked paid in this example",
      next: "Replay example ↺",
    },
  ];
  let currentIndex = 0;
  let animation;

  function showState(index) {
    const state = states[index];
    currentIndex = index;
    animation?.stop();
    desk.dataset.state = state.id;
    stages.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.stage === state.id),
      ),
    );
    desk.querySelector("[data-status]").textContent = state.status;
    desk.querySelector("[data-kicker]").textContent = state.kicker;
    desk.querySelector("[data-state-title]").textContent = state.title;
    desk.querySelector("[data-state-copy]").textContent = state.copy;
    desk.querySelector("[data-event]").textContent = state.event;
    desk.querySelector("[data-reminder]").hidden = state.id !== "reminder";
    desk.querySelector(".in-paid-stamp").hidden = state.id !== "paid";
    nextButton.textContent = state.next;

    // Motion is progressive enhancement; the example works without it.
    if (!reducedMotion.matches && !touch.matches && window.Motion?.animate) {
      animation = window.Motion.animate(
        content,
        { opacity: [0.55, 1], y: [5, 0] },
        { duration: 0.24, ease: "easeOut" },
      );
    }
  }

  stages.forEach((button, index) =>
    button.addEventListener("click", () => showState(index)),
  );
  nextButton.addEventListener("click", () =>
    showState((currentIndex + 1) % states.length),
  );
  desk
    .querySelector("[data-reset]")
    .addEventListener("click", () => showState(0));
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animation?.stop();
      content.style.opacity = "1";
      content.style.transform = "none";
    }
  });
})();
