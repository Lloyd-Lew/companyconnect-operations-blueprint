# CompanyConnect Operations Blueprint

> **A client-safe, runnable TypeScript reference system for AI-assisted lead-to-cash, operations, support, KPI, and audit workflows.**

This repository demonstrates how CompanyConnect designs serious business systems: validation before automation, explicit ownership, idempotent workflow boundaries, safe AI-assisted recommendations, retry-aware handoffs, structured audit events, and executive visibility. It uses **synthetic data and in-memory adapters only**. It is not a customer system, hosted SaaS product, or production deployment.

| In 60 seconds     | Answer                                                                                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Problem**       | Disconnected lead, quote, approval, onboarding, operations, invoice, support, and reporting handoffs create delay, re-entry, and weak ownership.                                                                                                                                           |
| **Who it is for** | Business leaders, operations teams, technical buyers, and developers evaluating how CompanyConnect engineers operating systems.                                                                                                                                                            |
| **What it does**  | Runs a synthetic lifecycle from lead intake through qualification, CRM-style opportunity, quote brief, approval, onboarding, invoice trigger, support disposition, KPI snapshot, and audit trail.                                                                                          |
| **How it works**  | An Express API coordinates strict domain rules and in-memory ports; deterministic adapters expose the seam where real CRM, payment, project, support, and AI systems would integrate.                                                                                                      |
| **Proof**         | Real HTTP endpoints, TypeScript strict checks, automated tests, CI, CodeQL, dependency controls, architecture documentation, a benchmark harness, and stable releases.                                                                                                                     |
| **Next step**     | [Explore the CompanyConnect technical proof portfolio](https://github.com/Lloyd-Lew/companyconnect-systems-portfolio) or [discuss a similar implementation](https://calendar.app.google/4SoivAXFkCpeQLVw5?utm_source=github&utm_medium=technical_proof&utm_campaign=operations_blueprint). |

## System map

```mermaid
flowchart LR
  A[Synthetic lead intake] --> B[Validation + idempotency]
  B --> C[Qualification + owner]
  C --> D[CRM-style opportunity]
  D --> E[Quote brief]
  E --> F[Approval]
  F --> G[Onboarding + project]
  G --> H[Invoice trigger]
  H --> I[Support disposition]
  I --> J[KPI snapshot]
  J --> K[Structured audit events]
```

The detailed component and sequence views are in the [architecture guide](docs/architecture.md). Read the [technical review](docs/technical-review.md) for an enterprise due-diligence route and the [threat model](docs/threat-model.md) for what this reference implementation does—and does not—protect.

## Run it locally

**Prerequisite:** Node.js 22 or newer.

```bash
git clone https://github.com/Lloyd-Lew/companyconnect-operations-blueprint.git
cd companyconnect-operations-blueprint
cp .env.example .env
npm ci
npm run dev
```

In a second terminal, verify the service boundary:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/status
```

Create a fully synthetic lifecycle. The `Idempotency-Key` protects this command from duplicate creation if it is retried.

```bash
curl -X POST http://localhost:3000/v1/lifecycles \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: northstar-demo-001' \
  -d '{
    "companyAlias": "Northstar Services",
    "contactAlias": "Alex Example",
    "employeeBand": "51-200",
    "requestedService": "automation",
    "processPain": "manual_handoffs",
    "syntheticDataConfirmed": true
  }'
```

Use the returned `lifecycle.id` to approve the synthetic implementation path.

```bash
curl -X POST http://localhost:3000/v1/lifecycles/<lifecycle-id>/approve \
  -H 'Content-Type: application/json' \
  -d '{"simulateNotificationFailure": false}'
```

The full route catalogue is in [`openapi.yaml`](openapi.yaml), and an importable [Postman collection](postman/CompanyConnect-Operations-Blueprint.postman_collection.json) is included. The [demo session](docs/demo-session.md) shows the happy path, an idempotent replay, and a simulated retry condition.

## Verify it

```bash
npm run check
npm test
npm run build
npm run format:check
npm audit --audit-level=low
npm run benchmark
```

The benchmark is deliberately local and synthetic. It prints machine-specific in-memory execution timing and does **not** represent production throughput, customer volume, platform uptime, cost, or AI accuracy.

### Verify the public API contract

The API surface is described in [`openapi.yaml`](openapi.yaml). Run the focused contract-alignment check after changing a public route or contract documentation:

```bash
npm run verify:contract
```

This check exercises every documented public route against the synthetic reference implementation and confirms that the documented idempotency and synthetic-data boundaries remain explicit. It is not a formal OpenAPI conformance certification or production integration test.

## Architecture and engineering evidence

| Concern                | Implementation evidence                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation             | Zod validates every state-changing request and requires `syntheticDataConfirmed: true` for lifecycle creation.                                 |
| Idempotency            | A caller-provided `Idempotency-Key` replays the original lifecycle rather than duplicating a record.                                           |
| State control          | A lifecycle can be approved only from `awaiting_approval`; invalid transitions return a conflict.                                              |
| Integration boundaries | `LifecycleStore`, `AuditStore`, and `NotificationPort` separate domain logic from infrastructure.                                              |
| Failure behavior       | A synthetic notification timeout produces `invoice_pending_retry` and an audit event instead of a silent success.                              |
| Support safety         | A bounded synthetic knowledge match can return a draft disposition; otherwise the workflow requires human escalation.                          |
| Auditability           | Events contain correlation IDs and redacted metadata; raw customer records, emails, secrets, and live system URLs are not accepted or logged.  |
| Security               | Secret scanning, push protection, Dependabot, CodeQL, `SECURITY.md`, dependency audit, protected-branch rule, and `CODEOWNERS` are configured. |

## Production interpretation

This is a reference design. A real implementation would begin with discovery, process ownership, data classification, access controls, integration contracts, rate limits, queues/retries, persistent storage, observability, monitoring, test environments, deployment architecture, and user enablement. The reference system intentionally does **not** perform these production functions.

Read [operational boundaries and limitations](docs/operational-boundaries.md) before relying on this material in any real environment.

## Technical due diligence

| Question                                  | Evidence                                                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How is the system structured?             | [Architecture](docs/architecture.md)                                                                                                                                    |
| What are the API contracts?               | [OpenAPI specification](openapi.yaml) and [API guide](docs/api.md)                                                                                                      |
| How are security and data safety handled? | [Security policy](SECURITY.md), [threat model](docs/threat-model.md), and [data boundaries](docs/operational-boundaries.md)                                             |
| How is quality checked?                   | [GitHub Actions](https://github.com/Lloyd-Lew/companyconnect-operations-blueprint/actions), CodeQL, tests, strict TypeScript, linting, formatting, and dependency audit |
| Can it be reproduced?                     | [Developer runbook](docs/runbook.md), Docker assets, dev container, Postman collection, and demo session                                                                |
| What is not represented?                  | [Limitations](docs/operational-boundaries.md)                                                                                                                           |

## Related CompanyConnect evidence

The [CompanyConnect Systems Portfolio](https://github.com/Lloyd-Lew/companyconnect-systems-portfolio) explains the business problems and service paths behind this technical proof. The [Lead-to-Quote Automation Demonstrator](https://github.com/Lloyd-Lew/lead-to-quote-automation-demo) is a more focused API example. The deployed [CompanyConnect Engineering Hub](https://lloyd-lew.github.io/companyconnect-engineering-hub/) provides a concise technical proof, trust, and due-diligence route across the public ecosystem.

If your organisation is evaluating CRM, workflow automation, integrations, dashboards, or AI-enabled operations, [book a technical discovery call](https://calendar.app.google/4SoivAXFkCpeQLVw5?utm_source=github&utm_medium=technical_proof&utm_campaign=operations_blueprint) or start with the [Operational Bottleneck Brief](https://github.com/Lloyd-Lew/companyconnect-systems-portfolio/blob/main/templates/operational-bottleneck-brief.md).
