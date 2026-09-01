const productAppSlugs = new Set([
  "reviewloop",
  "leadpocket",
  "expirydesk",
  "clientdock",
  "sitepulse",
  "workshoprecall",
  "opsqr",
  "invoicenudge",
  "cronbeacon",
  "logsentry",
]);
document.querySelectorAll("[data-app-path]").forEach((link) => {
  const slug = link.dataset.appPath;
  if (!productAppSlugs.has(slug)) return;
  if (
    location.hostname === "oneix.ltd" ||
    location.hostname.endsWith(".oneix.ltd")
  ) {
    link.href = `https://${slug}.oneix.ltd/signup`;
  } else {
    link.href = `https://${slug}.vercel.app/signup`;
  }
});
