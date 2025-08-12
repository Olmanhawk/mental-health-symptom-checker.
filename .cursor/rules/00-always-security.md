---
name: Secure Coding Mandates (Always)
type: always
purpose: Enforce non-negotiable security practices across all interactions.
tags:
  - security
  - compliance
---

- Never hardcode secrets, credentials, API keys, tokens, or certificates in code.
- Do not include `.env` or secret config files in any AI context or edits.
- Use environment variables or a secure secret manager; reference via configuration, not literals.
- Strip or mask sensitive values in logs, errors, or test artifacts.
- Prefer input validation and output encoding for any user-supplied data (XSS/Injection prevention).
- Avoid unsafe eval, new Function, or dynamic code execution.
- Enforce dependency hygiene: verify licenses, avoid known-vulnerable packages, and pin stable versions.
- Ensure third-party calls time out, handle errors explicitly, and do not leak stack traces in production.
- Prefer secure-by-default APIs (HTTPS, SameSite cookies, CSRF protections where applicable).