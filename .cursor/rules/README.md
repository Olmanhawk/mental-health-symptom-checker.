# Cursor Rules for Audit

These rules live in `.cursor/rules` and guide the AI during audits.

- `00-always-security.md` (Always): Applied to all interactions.
- `10-auto-style-architecture.md` (Auto): Applies when JS/TS/HTML/CSS files are in context.
- `20-auto-playwright-testing.md` (Auto): Applies when Playwright config or tests are in context.
- `90-manual-dependency-management.md` (Manual): Include with `@rule:Dependency Management Guidance`.
- `95-manual-performance-optimizations.md` (Manual): Include with `@rule:Performance Optimizations`.

Tip: Start with a zero-trust posture. Reveal only the minimum files or folders needed via `@file:` or `@folder:` in prompts.