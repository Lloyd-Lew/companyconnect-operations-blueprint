# Security Policy

This is a public reference implementation. It must not contain customer records, credentials, private URLs, production configurations, raw workflow exports, or live integration tokens.

## Report a vulnerability privately

Do not open a public issue for a suspected security concern. Email [letsconnect@companyconnect.tech](mailto:letsconnect@companyconnect.tech?subject=Security%20report%20-%20CompanyConnect%20Operations%20Blueprint) with a concise description, affected path or URL, safe reproduction steps, and expected impact. Do not send credentials or customer data unless essential and explicitly requested through a secure channel.

CompanyConnect will acknowledge credible reports, assess exposure, restrict or remove public material if needed, and rotate affected values when applicable.

## Security baseline

The public repository uses secret scanning, push protection, Dependabot security updates, CodeQL, a dependency audit in CI, a generated SBOM artifact, a protected default branch rule, and a public contribution safety gate. These controls reduce risk in the reference repository; they are not a claim of production certification.
