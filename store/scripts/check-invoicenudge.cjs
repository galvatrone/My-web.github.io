const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/sbin/chromium', args: ['--no-sandbox'] });
  const results = [];
  for (const [width, height] of [[360,800],[390,844],[430,900],[768,1024],[1024,768],[1440,1000],[844,390]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 700, hasTouch: width < 700 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    page.on('response', r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto('http://127.0.0.1:4173/invoicenudge/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `/tmp/invoice-${width}-hero.png` });
    const failures = await page.evaluate(() => {
      const fail = [];
      if(document.documentElement.scrollWidth > innerWidth) fail.push('Horizontal overflow');
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      if(new Set(ids).size !== ids.length) fail.push('Duplicate IDs');
      for (const a of document.querySelectorAll('a[href^="#"]')) if(!document.getElementById(a.hash.slice(1))) fail.push(`Missing anchor ${a.hash}`);
      for (const el of document.querySelectorAll('button, summary, .button, .nav a')) {
        const r = el.getBoundingClientRect();
        if(r.height < 44) fail.push(`Small touch target: ${el.textContent.trim()} (${r.height})`);
      }
      return fail;
    });
    errors.push(...failures);
    for (const section of ['.in-payment-desk', '.in-ledger-section', '.in-workflow', '.in-pricing', '.in-faq', '.in-closing']) {
      const locator = page.locator(section);
      await locator.scrollIntoViewIfNeeded();
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
      await locator.screenshot({ path: `/tmp/invoice-${width}-${section.slice(1)}.png` });
    }
    for(const state of ['due','reminder','paid','issued']) {
      await page.locator(`[data-stage="${state}"]`).click();
      if(await page.locator('.in-payment-desk').getAttribute('data-state') !== state) errors.push(`Stage failed ${state}`);
      if(await page.locator('[data-stage][aria-pressed="true"]').count() !== 1) errors.push('Selection is not exclusive');
      if(state === 'reminder' && !(await page.locator('[data-reminder]').isVisible())) errors.push('Missing reminder');
      if(state === 'paid' && !(await page.locator('.in-paid-stamp').isVisible())) errors.push('Missing paid status');
      if(state === 'reminder') await page.locator('.in-payment-desk').screenshot({path:`/tmp/invoice-${width}-reminder.png`});
    }
    for (const expected of ['due', 'reminder', 'paid', 'issued']) {
      await page.locator('[data-next]').click();
      if(await page.locator('.in-payment-desk').getAttribute('data-state') !== expected) errors.push(`Next failed ${expected}`);
    }
    await page.locator('[data-stage="paid"]').click();
    await page.locator('[data-reset]').click();
    if(await page.locator('.in-payment-desk').getAttribute('data-state') !== 'issued') errors.push('Reset failed');
    for(const detail of await page.locator('details').all()) {
      await detail.locator('summary').click();
      if(!(await detail.locator('p').isVisible())) errors.push('FAQ failed');
      await detail.locator('summary').click();
    }
    for(const link of await page.locator('.nav a[href^="#"]').all()) {
      await link.click();
      const hash = await link.getAttribute('href');
      if(!page.url().endsWith(hash)) errors.push(`Navigation failed ${hash}`);
    }
    await page.locator('[data-stage="due"]').focus();
    await page.keyboard.press('Enter');
    if(await page.locator('.in-payment-desk').getAttribute('data-state') !== 'due') errors.push('Keyboard stage failed');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('[data-stage="paid"]').click();
    if(await page.evaluate(() => document.getAnimations().some(a => a.playState === 'running'))) errors.push('Active reduced-motion animation');
    await page.screenshot({ path: `/tmp/invoice-${width}-full.png`, fullPage: true });
    results.push({width,height,errors,signup:await page.locator('[data-start]').first().getAttribute('href')});
    await context.close();
  }
  // The product still works when optional animation code is unavailable.
  const page = await browser.newPage();
  await page.route('**/motion-12.23.12.js', route => route.abort());
  await page.goto('http://127.0.0.1:4173/invoicenudge/');
  await page.locator('[data-stage="paid"]').click();
  if(await page.locator('.in-payment-desk').getAttribute('data-state') !== 'paid') throw new Error('Motion fallback failed');
  await browser.close();
  fs.writeFileSync('/tmp/invoicenudge-qa.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  if(results.some(r => r.errors.length)) process.exitCode = 1;
})();
