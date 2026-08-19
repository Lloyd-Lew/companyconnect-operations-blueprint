# Technical Review Guide

This guide is for technical buyers reviewing the CompanyConnect Operations Blueprint as a **client-safe reference implementation**. It explains what can be inspected publicly and what remains intentionally outside the scope of this synthetic, in-memory demonstration.

## Publicly inspectable evidence

| Review question                                  | Evidence                                                                                                                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How is the lifecycle structured?                 | [Architecture](architecture.md) and the runnable `src/` modules                                                                                                        |
| What does the API promise?                       | [OpenAPI contract](../openapi.yaml), [API guide](api.md), and the importable Postman collection                                                                        |
| Do the documented routes align with the service? | `npm run verify:contract` exercises every documented public route and confirms idempotency and synthetic-data requirements remain explicit                             |
| How are quality and security checked?            | Tests, strict TypeScript, ESLint, Prettier, production dependency audit, CodeQL, secret scanning, push protection, Dependabot, and the repository branch rule          |
| What happens when a handoff fails?               | The demo session and lifecycle tests show a retry-ready invoice-notification state and auditable event rather than a silent success                                    |
| Is this a production deployment?                 | No. Read [Operational Boundaries](operational-boundaries.md) and the [Threat Model](threat-model.md) before extrapolating this reference design to a real environment. |

## Review boundary

The public code deliberately does not contain customer records, production credentials, live CRM configuration, private business rules, externally hosted AI calls, persistent storage, payment processing, or a production deployment. It demonstrates the separations, controls, and engineering questions that a production implementation must address; it does not claim to be one.

## Suggested review sequence

Start with the README’s 60-second system map, run the local verification commands, inspect the OpenAPI contract and contract-alignment test, then review the architecture and threat model. This sequence provides a concise evaluation path without requiring access to confidential client material.
