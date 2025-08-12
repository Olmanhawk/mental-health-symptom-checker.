---
name: Dependency Management Guidance (Manual)
type: manual
purpose: Provide guidance when adding, updating, or removing dependencies.
tags:
  - dependencies
  - security
  - maintenance
---

- Prefer well-maintained libraries with recent releases and strong community adoption.
- Check for known vulnerabilities (e.g., `npm audit`), license compatibility, and transitive risk.
- Pin to the latest stable version; avoid unnecessary major upgrades in a single change.
- Remove unused dependencies and lockfiles only with justification.
- Avoid expanding the dependency surface area if native or existing utilities suffice.