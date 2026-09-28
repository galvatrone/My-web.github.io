/* logsentry: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".logsentry-page");
  if (!page) return;
  page
    .querySelectorAll("[data-start]")
    .forEach((link) => (link.href = "https://logsentry.oneix.ltd/signup"));
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
  const events = [
    ["12:41:08", "INFO", "web", "request completed · 200"],
    ["12:41:09", "INFO", "worker", "worker started"],
    ["12:41:09", "INFO", "queue", "batch processed · 24 items"],
    ["12:41:10", "ERROR", "payments", "payment webhook failed"],
    ["12:41:10", "INFO", "payments", "retry scheduled · attempt 2"],
    ["12:41:12", "ERROR", "payments", "signature validation failed"],
  ];
  let selected = 3;
  function select(index) {
    selected = index;
    const event = events[index];
    page
      .querySelectorAll("[data-event]")
      .forEach((row, i) =>
        row.setAttribute("aria-pressed", String(i === index)),
      );
    page.querySelector("[data-event-level]").textContent = event[1];
    page.querySelector("[data-event-title]").textContent = event[3];
    page.querySelector("[data-event-source]").textContent = event[2];
    page.querySelector("[data-event-time]").textContent = event[0];
    page.querySelector("[data-event-rule]").textContent =
      event[1] === "ERROR" ? "Severity is ERROR" : "No error-rule match";
    page.querySelector("[data-event-context]").textContent =
      event[1] === "ERROR"
        ? "Inspect the event before deciding the next action. This is illustrative data."
        : "A routine sample event. Keep it available as context for the surrounding errors.";
    reveal(page.querySelector(".ls-inspector"));
  }
  page
    .querySelectorAll("[data-event]")
    .forEach((row, i) => row.addEventListener("click", () => select(i)));
  page.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      const errors = button.dataset.filter === "error";
      page
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      page
        .querySelectorAll("[data-log-row]")
        .forEach(
          (row) => (row.hidden = errors && row.dataset.severity !== "ERROR"),
        );
      page.querySelector("[data-event-count]").textContent = errors
        ? "2 error events"
        : "6 events / 2 errors";
      if (errors && events[selected][1] !== "ERROR") select(3);
    }),
  );
  page.querySelector("[data-test-rule]").addEventListener("click", () => {
    const query = page.querySelector("#ls-rule").value.trim().toLowerCase();
    const matches = query
      ? events.filter((event) => event[3].toLowerCase().includes(query))
      : [];
    page.querySelector("[data-match-count]").textContent = matches.length;
    page.querySelector("[data-rule-result]").textContent = query
      ? matches.length
        ? matches.map((e) => e[3]).join(" · ")
        : "No sample messages match this text."
      : "Enter text to test a rule.";
    reveal(page.querySelector(".ls-rule-result"));
  });
})();
