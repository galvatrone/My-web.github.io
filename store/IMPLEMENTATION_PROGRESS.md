# ONEIX implementation progress

## Objective and constraints

Finish ten individually identifiable marketing pages, then redesign the Store around them. Work sequentially, preserve working functionality and canonical pricing. Each product owns readable HTML, CSS and JS. Shared ONEIX foundations are allowed; product scripts must not be import-only wrappers.

## Current state — 28 September 2026

- LeadPocket and ReviewLoop retain their existing custom designs. Their heroes were opened again for visual comparison with InvoiceNudge; this does not constitute a new full regression pass for those pages.
- InvoiceNudge now has its own financial editorial composition, invoice receipt, four-stage interactive payment timeline, aging ledger, workflow, pricing and FAQ. Its script owns the interaction and signup routing without importing products.js. Shared buttons, typography and FAQ primitives are reused.
- InvoiceNudge has no product-page class, so legacy product background overlays cannot leak onto it. Its own FAQ explicitly overrides the shared two-column grid.
- SitePulse, ClientDock, CronBeacon, ExpiryDesk, LogSentry, OpsQR and WorkshopRecall remain generic pages awaiting individual designs. Their HTML is formatted, their CSS is separate and their own JS handles application links without imports. Do not count this file separation as a completed redesign.
- Store still needs its final redesign after all products. Existing selection changes data but uses one generic dashboard structure. All ten gallery destinations exist, but discovery and universe objects must represent all ten distinct identities.

## InvoiceNudge evidence

- Product capabilities checked against `/home/lost/Documents/saas/oneix-saas-portfolio/invoicenudge/docs/IMPLEMENTATION_STATUS.md`: invoice records, CSV, aging, reminders, pause/snooze, paid status and promise-to-pay notes. No claims of payment processing, guaranteed collection or real demo email delivery.
- Starter price preserved at EUR 15/month.
- Browser opened at 360×800, 390×844, 430×900, 768×1024, 1024×768, 1440×1000 and 844×390. All sections scrolled into view and captured. Stage selection, Next/replay, Reset, all FAQ items and navigation anchors exercised. Keyboard stage activation and reduced-motion checked.
- No JS/console errors, missing local assets, duplicate IDs, missing anchors, horizontal page overflow or tested controls below 44px tall in the recorded run. Product interaction also tested with Motion blocked.
- Screenshots inspected for each target width, all sections and reminder state; compared desktop composition with LeadPocket and ReviewLoop. Mobile hero was shortened, skip-link hiding hardened and inherited two-column FAQ corrected after inspection.
- Local evidence: `/tmp/invoicenudge-qa.json`, `/tmp/invoice-*-hero.png`, `/tmp/invoice-*-in-*.png`, `/tmp/invoice-*-full.png`, `/tmp/invoice-comparison.jpg`. Screenshot sheets preserve whole sections, with montage padding not representing page whitespace.
- External signup URLs were checked as DOM destinations, not submitted. Live SaaS availability is not proven by these local tests and remains part of final link verification.
- Local Motion 12.23.12 browser build and MIT license are in assets/vendor. Motion only animates user-triggered state changes, is skipped on coarse pointers/reduced motion and has no continuous loop. No Three.js changes.

## Next phase

SitePulse: inspect real product capability/pricing sources, build an independent heartbeat/endpoint monitoring identity with its own CSS and JS, then complete browser and visual checks before moving on.

Remaining order: SitePulse → ClientDock → CronBeacon → ExpiryDesk → LogSentry → OpsQR → WorkshopRecall → Store → complete regression across all eleven pages. The overall goal is not complete.

## Environment

Normal shell/file sandbox access fails with `mountinfo path is not absolute`. Escalated shell calls work. apply_patch can add files but existing-file updates fail; prepared patches are applied through `git -C .. apply` with store/ paths. Preserve all unrelated worktree changes.

Static server: http://127.0.0.1:4173. Installed Playwright: `/home/lost/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`; browser: `/usr/sbin/chromium`. agent-browser CLI is unavailable. Local screenshot viewing uses base64 via escalated shell because view_image has the same sandbox failure.
