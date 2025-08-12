---
name: JS/HTML/CSS Style & Architecture (Auto)
type: auto
autoAttach: true
files:
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.cjs"
  - "**/*.ts"
  - "**/*.jsx"
  - "**/*.tsx"
  - "**/*.html"
  - "**/*.css"
  - "playwright.config.*"
  - "tests/**/*"
tags:
  - style
  - architecture
---

- Prefer clear, descriptive identifiers; avoid abbreviations and single-letter names.
- Use early returns and minimal nesting; handle errors and edge cases first.
- Keep functions small and focused; extract helpers for repeated logic.
- For DOM code, avoid implicit global selectors; scope queries to nearest container when possible.
- For validation, prefer schema-based validation when practical; otherwise, centralize input checks.
- Export explicit, typed APIs when using TypeScript; when using JS, document shapes with JSDoc typedefs.
- Avoid side effects in modules; keep top-level code idempotent and free of I/O.
- Ensure accessibility: semantic HTML, proper labels, and ARIA only when necessary.
- Maintain separation of concerns: presentation (CSS), structure (HTML), behavior (JS).