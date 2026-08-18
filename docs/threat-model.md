# Threat Model

## Scope

This threat model concerns the public reference implementation and its GitHub supply chain. It does not assert that the demonstrator is a production threat model for a deployed customer system.

| Asset               | Threat                             | Baseline mitigation in this repository                                                          | Production follow-up                                                                               |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Source code         | Malicious or unsafe changes        | Protected branch rule, CI quality check, CodeQL, `CODEOWNERS`, contribution policy              | Add required review and restricted bypass when a second maintainer exists.                         |
| Dependencies        | Known vulnerable package           | Lock file, Dependabot, local dependency audit, CodeQL                                           | Add SBOM retention, dependency-review gate, and defined patch SLA for production repositories.     |
| Secrets             | Accidental commit                  | `.gitignore`, `.env.example`, secret scanning, push protection, security policy                 | Central secret manager, rotation, environment scopes, and access review.                           |
| Synthetic records   | Misuse as real customer data       | Required synthetic-data confirmation, explicit data-boundary docs, no raw-message audit logging | Data classification, retention controls, encryption, DPA, and privacy review.                      |
| API endpoint        | Invalid or duplicate state changes | Zod validation, idempotency key, state transition checks, generic unexpected-error response     | Authentication, authorization, rate limiting, request tracing, WAF, and load testing.              |
| Integration failure | Silent partial completion          | Deterministic failure path, retry-ready lifecycle state, structured audit event                 | Durable queues, retries, idempotent vendor APIs, dead-letter queue, alerts, and runbook.           |
| AI response         | Hallucinated or unsafe action      | No LLM call; bounded deterministic support disposition and human escalation path                | Evaluations, guardrails, human approval, audit, redaction, model governance, and incident process. |

## Disclosure

Report a potential vulnerability privately using the process in [`SECURITY.md`](../SECURITY.md). Do not include real credentials or customer data in a public issue.
