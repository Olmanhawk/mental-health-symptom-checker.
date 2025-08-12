---
name: Playwright Testing Conventions (Auto)
type: auto
autoAttach: true
files:
  - "playwright.config.*"
  - "tests/**/*"
  - "**/*.spec.*"
  - "**/*.test.*"
tags:
  - testing
  - accessibility
---

- Write deterministic tests; avoid brittle selectors. Prefer data-testids or role-based queries.
- Use timeouts explicitly and avoid arbitrary waits; rely on `expect` with locators.
- Include basic a11y checks using `@axe-core/playwright` where page content allows.
- Ensure test isolation: reset state between tests; avoid sharing mutable globals.
- Record failures with useful artifacts (screenshots, traces) but avoid storing secrets.