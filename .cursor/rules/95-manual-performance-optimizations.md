---
name: Performance Optimizations (Manual)
type: manual
purpose: Invoke when optimizing hot paths or addressing performance regressions.
tags:
  - performance
---

- Measure before and after; add simple metrics where possible.
- Prefer algorithmic improvements over micro-optimizations.
- Avoid unnecessary reflows/repaints in DOM updates; batch and minimize layout thrashing.
- Defer non-critical work; use requestIdleCallback where appropriate.
- Keep payloads small; lazy-load large assets and avoid unused code.