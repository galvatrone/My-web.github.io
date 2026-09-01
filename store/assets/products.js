const productAppSlugs = new Set(["reviewloop", "leadpocket", "expirydesk", "clientdock", "sitepulse", "workshoprecall", "opsqr", "invoicenudge", "cronbeacon", "logsentry"]);
document.querySelectorAll(".signal").forEach((signal) => {
  signal.classList.add("signal-visual");
  signal.dataset.color = getComputedStyle(signal).getPropertyValue("--signal").trim() || "#64e3f2";
  const canvas = document.createElement("canvas");
  canvas.className = "signal-canvas";
  canvas.setAttribute("aria-hidden", "true");
  signal.prepend(canvas);
});
document.querySelectorAll(".product-card, .section, .hero > div").forEach((element) => { element.dataset.reveal = ""; });
document.querySelectorAll("[data-app-path]").forEach((link) => {
  const slug = link.dataset.appPath;
  if (!productAppSlugs.has(slug)) return;
  if (location.hostname === "oneix.ltd" || location.hostname.endsWith(".oneix.ltd")) {
    link.href = `https://${slug}.oneix.ltd/signup`;
  } else {
    link.href = `https://${slug}.vercel.app/signup`;
  }
});
import("./app.js").catch(() => {});
