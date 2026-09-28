// Local-only marketing-page QA. Requires a running static server and Playwright.
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4174";
const products = process.argv.slice(2);
const output = path.resolve(__dirname, "../screenshots");
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/sbin/chromium",
    args: ["--no-sandbox"],
  });
  const results = [];
  for (const product of products) {
    if (!/^[a-z]+$/.test(product)) throw new Error("Invalid product name");
    for (const [width, height] of [
      [360, 800],
      [390, 844],
      [430, 900],
      [768, 1024],
      [1024, 768],
      [1440, 1100],
      [844, 390],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width < 700,
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(response.status() + " " + response.url());
      });
      await page.goto(`${base}/${product}/`, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
      });
      for (const button of await page.locator("main button").all()) {
        if ((await button.isVisible()) && (await button.isEnabled())) {
          await button.click();
          await page.waitForTimeout(250);
        }
      }
      for (const detail of await page.locator("details").all()) {
        await detail.locator("summary").click();
        if (!(await detail.locator("p").isVisible()))
          errors.push("FAQ failed to expand");
        await detail.locator("summary").click();
      }
      for (const anchor of await page.locator('.nav a[href^="#"]').all()) {
        await anchor.click();
        if (!page.url().endsWith(await anchor.getAttribute("href")))
          errors.push("Anchor navigation failed");
      }
      errors.push(
        ...(await page.evaluate(() => {
          const failures = [];
          if (document.documentElement.scrollWidth > innerWidth)
            failures.push("Horizontal page overflow");
          const ids = [...document.querySelectorAll("[id]")].map(
            (element) => element.id,
          );
          if (new Set(ids).size !== ids.length) failures.push("Duplicate IDs");
          for (const link of document.querySelectorAll('a[href^="#"]'))
            if (!document.getElementById(link.hash.slice(1)))
              failures.push("Missing anchor " + link.hash);
          for (const control of document.querySelectorAll(
            "button, summary, .button, .nav a",
          )) {
            const bounds = control.getBoundingClientRect();
            if (bounds.height > 0 && bounds.height < 43.9)
              failures.push(
                "Touch target below 44px: " + control.textContent.trim(),
              );
          }
          return failures;
        })),
      );
      for (const href of await page
        .locator("[data-start]")
        .evaluateAll((links) => links.map((link) => link.href))) {
        if (href !== `https://${product}.oneix.ltd/signup`)
          errors.push("Wrong signup target: " + href);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      const first = page.locator("main button:visible").first();
      if (await first.count()) {
        await first.focus();
        await page.keyboard.press("Enter");
      }
      if (
        await page.evaluate(() =>
          document
            .getAnimations()
            .some((animation) => animation.playState === "running"),
        )
      )
        errors.push("Animation active with reduced motion");
      await page.reload({ waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        scrollTo(0, 0);
      });
      await page.screenshot({
        path: `/tmp/${product}-${width}-hero.jpg`,
        quality: 82,
      });
      let sectionIndex = 0;
      for (const section of await page.locator("main > section").all()) {
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({
          path: `/tmp/${product}-${width}-section-${sectionIndex++}.jpg`,
          quality: 80,
        });
      }
      await page.screenshot({
        path: `/tmp/${product}-${width}-full.jpg`,
        fullPage: true,
        quality: 80,
      });
      if (width === 1440) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: path.join(output, `${product}-desktop.jpg`),
          quality: 90,
        });
        await page.screenshot({
          path: path.join(output, `${product}-full.jpg`),
          fullPage: true,
          quality: 85,
        });
      }
      if (width === 390)
        await page.screenshot({
          path: path.join(output, `${product}-mobile.jpg`),
          fullPage: true,
          quality: 85,
        });
      results.push({ product, width, height, errors });
      await context.close();
    }
  }
  await browser.close();
  fs.writeFileSync(
    "/tmp/oneix-portfolio-qa.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => result.errors.length)) process.exitCode = 1;
})();
