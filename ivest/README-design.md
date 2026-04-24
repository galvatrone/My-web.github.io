# Vector Autonomous Systems Design Notes

## Change Summary
1. Rebuilt the landing page into a StartEngine-style offering layout with a wide narrative column and sticky reserve card.
2. Shifted the visual language from the previous editorial beige theme to an aerospace palette built around electric orange, blue and deep navy.
3. Centralized editable copy in `assets/content.js`, so section text, cards, FAQs and placeholders can be updated without touching markup.
4. Preserved the existing FormSubmit reserve flow and moved it into the main investor journey on `index.html`.
5. Added a sticky tab bar for `ОБЗОР / О КОМПАНИИ / НАГРАДЫ / ОБСУЖДЕНИЕ / FAQ` with active-section highlighting.
6. Expanded the page into a full 22-section investor narrative: reasons, team, pitch, problem, solution, market, specs, safety, traction and reserve CTA.
7. Added accessibility basics: skip link, proper heading order, visible focus styles, keyboard-accessible video trigger and mobile-safe sticky CTA.
8. Added lightweight interaction in `assets/script.js`: smooth scrolling, reveal-on-scroll, sticky state, mobile nav and video modal.
9. Updated `invest.html` and `privacy.html` so auxiliary pages use the same design system instead of the previous legacy layout.
10. Added OG metadata support and a local fallback social image in `assets/og-vector.svg`.

## File Tree
- `index.html` — main offering page
- `invest.html` — legacy reserve fallback page
- `privacy.html` — privacy notice
- `assets/ivest.css` — design system and layout styles
- `assets/content.js` — centralized copy and editable placeholders
- `assets/script.js` — tabs, mobile nav, smooth scroll, reveal, video modal
- `assets/og-vector.svg` — fallback Open Graph image

## Tokens
- `--color-primary`: `#f06820`
- `--color-primary-dark`: `#d85917`
- `--color-accent`: `#1e8ae8`
- `--color-accent-soft`: `#7fd4ff`
- `--color-navy`: `#0b1f3a`
- `--color-page-soft`: `#f8f9fb`
- `--color-footer`: `#f2f3f5`
- `--color-announcement`: `#fde8dc`
- `--color-text`: `#1a1a1a`
- `--color-muted`: `#666666`

## Typography
- Base font: `Inter`
- Hero H1: `clamp(44px, 5vw, 48px)`
- Section headings: `clamp(28px, 3vw, 32px)` with uppercase treatment
- Eyebrow labels: `13px`, uppercase, `0.08em`
- Body copy: `15px` to `17px`
- Legal fine print: `11px`

## Spacing
- Max shell width: `1200px`
- Primary section top spacing: `96px`
- Compact section spacing: `64px`
- Card padding: `18px` to `28px`
- Header height: `84px`
- Sticky tab height: `66px`

## Editing Notes
- Update all investor-facing copy in `assets/content.js`.
- Replace placeholder team avatars, TAM figures, partner names, video URL and offering terms before launch.
- Replace synthetic hero / demo visuals with the real H2 HYBRID render when available.
