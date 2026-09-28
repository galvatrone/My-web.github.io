/* expirydesk: independent product demo. Illustrative data, no external writes. */
(() => {
  "use strict";
  const page = document.querySelector(".expirydesk-page");
  if (!page) return;
  const oneix =
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd");
  page.querySelectorAll("[data-start]").forEach((link) => {
    link.href = oneix
      ? "https://expirydesk.oneix.ltd/signup"
      : "https://expirydesk.oneix.ltd/signup";
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
  const slider = page.querySelector("[data-days]");
  let bases = [8, 18, 42, 71];
  let renewed = false;
  function render() {
    const advance = Number(slider.value);
    page.querySelector("[data-days-output]").textContent = advance + " days";
    const counts = { attention: 0, upcoming: 0, safe: 0, expired: 0 };
    page.querySelectorAll("[data-record]").forEach((card, i) => {
      const days = bases[i] - advance;
      const state =
        days < 0
          ? "expired"
          : days <= 10
            ? "attention"
            : days <= 30
              ? "upcoming"
              : "safe";
      counts[state]++;
      card.querySelector("[data-count]").textContent = Math.abs(days);
      card.querySelector("[data-unit]").textContent =
        days < 0 ? "days overdue" : "days left";
      card.querySelector(".ed-urgency").textContent = {
        expired: "Expired",
        attention: "Attention",
        upcoming: "Upcoming",
        safe: "Safe",
      }[state];
      card.style.setProperty(
        "--urgency",
        {
          expired: "#f59b86",
          attention: "#f0aa76",
          upcoming: "#efd078",
          safe: "#c4d6a7",
        }[state],
      );
      card.style.setProperty(
        "--distance",
        Math.min(100, Math.max(0, (days / 90) * 100)) + "%",
      );
    });
    const next = Math.min(...bases) - advance;
    page.querySelector("[data-next-days]").textContent = String(
      Math.abs(next),
    ).padStart(2, "0");
    page.querySelector(".ed-next > span:not(.pf-label)").textContent =
      next < 0
        ? "days overdue"
        : next === 0
          ? "due today"
          : "days until renewal";
    page.querySelector(".ed-next p").textContent = renewed
      ? "SSL certificate"
      : next < 0
        ? "Atlas contract is overdue"
        : "Atlas workspace contract";
    page.querySelector("[data-summary]").textContent =
      counts.expired +
      " expired · " +
      counts.attention +
      " need attention · " +
      counts.upcoming +
      " upcoming · " +
      counts.safe +
      " safe";
    page.querySelector("[data-term]").textContent = renewed
      ? "Renewed"
      : advance > 8
        ? advance - 8 + " days overdue"
        : advance === 8
          ? "Due today"
          : 8 - advance + " days left";
  }
  slider.addEventListener("input", render);
  page.querySelector("[data-reset]").addEventListener("click", () => {
    bases = [8, 18, 42, 71];
    renewed = false;
    slider.value = "0";
    page.querySelector("[data-renew]").disabled = false;
    page.querySelector("[data-renew-status]").textContent = "Renewal needed";
    page.querySelector("[data-renew-event]").textContent =
      "No renewal recorded in this example yet.";
    render();
  });
  page.querySelector("[data-renew]").addEventListener("click", () => {
    bases[0] = 365 + Number(slider.value);
    renewed = true;
    page.querySelector("[data-renew]").disabled = true;
    page.querySelector("[data-renew-status]").textContent = "Renewed ✓";
    page.querySelector("[data-renew-event]").textContent =
      "Example renewal recorded. Contract now has 365 days remaining.";
    render();
    reveal(page.querySelector(".ed-renew-card"));
  });
})();
