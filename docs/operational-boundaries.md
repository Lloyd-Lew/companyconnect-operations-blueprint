# Operational Boundaries and Limitations

## This repository is a reference implementation

The system demonstrates architecture, lifecycle design, safe boundaries, and developer workflow. It is not a production product, managed service, deployment template, customer implementation, or claim of real-world throughput, uptime, savings, or model accuracy.

## Data handling

The API deliberately requires `syntheticDataConfirmed: true` when a lifecycle is created. Do not send real personal data, customer records, confidential information, payment data, production URLs, or credentials to a local or hosted copy of this demonstration. The repository does not store raw support messages in audit events; only disposition and message length are retained in its synthetic audit metadata.

## Production gaps that require design work

| Concern                          | Demonstration treatment                       | Production requirement                                                                                                                     |
| -------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Authentication and authorization | Not implemented                               | Identity provider, role model, tenant boundaries, least privilege, session security, and authorization tests.                              |
| Persistence                      | In-memory only                                | Encrypted durable storage, schema migration, backup, retention, and recovery design.                                                       |
| Integrations                     | Deterministic local ports                     | Contract tests, secrets management, rate limits, idempotent external calls, retries, circuit breakers, and vendor-specific error handling. |
| AI assistance                    | Deterministic, bounded disposition logic      | Approved provider/model, data-processing agreement, evaluation, prompt/version control, monitoring, human review, and escalation policy.   |
| Notifications and retry          | One simulated failure state                   | Queue, durable retry policy, dead-letter path, observability, alerting, and replay controls.                                               |
| Deployment                       | Local execution and optional Docker artefacts | Environment separation, secure CI/CD, container hardening, infrastructure, monitoring, logging, backup, disaster recovery, and SLOs.       |

## No-fake-proof policy

This repository must never be extended with fabricated customers, logos, testimonials, ROI, conversion rates, uptime, production scale, security certification, performance claims, activity, contributors, or customer-like records. New public evidence should be reproducible engineering work or permission-cleared, anonymised material.
