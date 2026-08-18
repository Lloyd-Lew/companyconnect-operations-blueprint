# Contribution Guidance

This repository is a curated technical proof asset, not a customer-work intake channel. It accepts corrections and bounded improvements that strengthen genuine engineering evidence.

Before suggesting a change, read the [operational boundaries](docs/operational-boundaries.md), [threat model](docs/threat-model.md), and [security policy](SECURITY.md). Never submit client code, raw automation exports, credentials, customer records, production URLs, or unverified commercial claims.

Run the full local quality path before opening a pull request:

```bash
npm run check && npm test && npm run build && npm run format:check && npm audit --audit-level=low
```
