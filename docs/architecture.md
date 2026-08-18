# Architecture

## Component responsibilities

```mermaid
flowchart TB
  Client[API client using synthetic data] --> API[Express API boundary]
  API --> Validation[Zod validation]
  API --> Service[Lifecycle service]
  Service --> Domain[Qualification and lifecycle rules]
  Service --> Store[Lifecycle store port]
  Service --> Notify[Notification port]
  Service --> Audit[Audit store port]
  Store --> Memory[(In-memory record adapter)]
  Notify --> Deterministic[Deterministic notification adapter]
  Audit --> AuditMemory[(In-memory audit adapter)]
```

The API layer is responsible for parsing requests and translating known errors into HTTP responses. The application service owns lifecycle orchestration. The domain layer owns deterministic qualification rules and valid lifecycle states. Ports prevent the domain/application layers from depending on an actual CRM, messaging service, support platform, database, or LLM provider.

## Lifecycle sequence

```mermaid
sequenceDiagram
  participant C as Client
  participant A as API
  participant S as Lifecycle service
  participant L as Lifecycle store
  participant U as Audit store
  C->>A: POST /v1/lifecycles + Idempotency-Key
  A->>S: start(valid synthetic lead, key)
  S->>L: find by key
  alt existing key
    L-->>S: existing lifecycle
    S->>U: lifecycle.replayed
    S-->>A: original lifecycle
  else new key
    S->>S: qualify and create quote brief
    S->>L: save awaiting approval lifecycle
    S->>U: lifecycle.created
    S-->>A: created lifecycle
  end
```

## Failure and retry boundary

```mermaid
flowchart LR
  A[Approval command] --> B[Create synthetic project and invoice identifiers]
  B --> C{Notification adapter}
  C -->|Delivered| D[Operational state]
  C -->|Synthetic timeout| E[Invoice pending retry state]
  E --> F[Structured retry-required audit event]
```

The sample does not run a queue or automated retry worker. It intentionally models the state and audit boundary where a production system would use durable storage, retry scheduling, idempotent external calls, and monitoring.

## System boundaries

| Inside this repository                                                                                    | Explicitly outside this repository                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Synthetic lead data, deterministic scoring, in-memory records, API responses, audit metadata, tests, docs | Real CRM credentials, customer records, payments, emails, webhooks, queues, production persistence, LLM calls, user authentication, deployment secrets, customer SLAs |
