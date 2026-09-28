# InvoiceNudge verification

Run a static server for the Store at http://127.0.0.1:4173, then:

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright CHROMIUM_PATH=/usr/sbin/chromium node scripts/check-invoicenudge.cjs
```

If Playwright resolves normally, omit PLAYWRIGHT_MODULE. No dependencies are installed by the script. Browser contexts are isolated and no signup is submitted.

The script opens desktop, five requested responsive widths and landscape; scrolls through and captures every section; tests timeline stages, reminder/paid views, next/replay, reset, FAQ, anchors, keyboard activation and reduced motion. It records console/asset failures, duplicate IDs, overflow and controls smaller than 44px tall. It also tests interaction without the optional Motion library.

Artifacts are written to `/tmp/invoicenudge-qa.json` and `/tmp/invoice-*.png`. Inspect the screenshots after running; automated assertions alone do not prove visual quality. External signup service availability is not tested.

## Visual review completed 28 September 2026

Viewport sizes: 360×800, 390×844, 430×900, 768×1024, 1024×768, 1440×1000, 844×390.

Reviewed all sections, compact mobile receipt/stages and reminder preview. Compared hero against LeadPocket's pipeline and ReviewLoop's reputation orbit. Fixed mobile hero length, skip-link hiding and shared FAQ grid interference. No generic chart remains in this product.

Product data are illustrative and labelled. EUR 15/month Starter is preserved from the original page. Local Motion 12.23.12 is optional progressive enhancement; no continuous loops or mouse-dependent interaction are required.
