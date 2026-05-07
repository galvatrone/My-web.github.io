# Vector Autonomous Systems – Codex Instructions

## Read first
Before generating any UI or animation code:
- Read design-system/MASTER.md
- Read design-system/animation.md
- Reuse existing code from assets/app.js and index.html

## Core rule
DO NOT create UI or animations from scratch if existing code exists.

---

## Animation System

Use Motion library:
https://github.com/motiondivision/motion

Rules:
- Use animate() for UI animations
- Use scroll() for scroll-driven animations
- Replace Anime.js gradually
- Keep Three.js untouched

Do NOT:
- Use Anime.js for new features
- Create custom animation engines

---

## Project Stack

- HTML + CSS + JS
- Three.js (3D drone)
- Motion (UI animations)

---

## Style

Aerospace premium startup UI:
- Dark background
- Neon cyan accents
- Clean layout
- Investor-ready look

Avoid:
- messy layouts
- random colors
- gaming style