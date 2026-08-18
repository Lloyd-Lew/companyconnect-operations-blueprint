# API Guide

The API is intentionally small and uses JSON. It accepts synthetic data only. The canonical contract is [`openapi.yaml`](../openapi.yaml).

| Route                              | Purpose                                                    | Key behavior                                                                              |
| ---------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `GET /health`                      | Process health probe                                       | Returns `200` when the service is reachable.                                              |
| `GET /status`                      | Demonstration boundary                                     | States that the implementation is synthetic, in-memory, and has no external integrations. |
| `POST /v1/lifecycles`              | Starts a synthetic business lifecycle                      | Requires `Idempotency-Key`; validates synthetic-data confirmation.                        |
| `POST /v1/lifecycles/{id}/approve` | Simulates quote approval through project and invoice paths | Can model a retryable downstream notification timeout.                                    |
| `POST /v1/support-requests`        | Models a bounded support disposition                       | Returns a synthetic draft disposition or human escalation.                                |
| `GET /v1/kpis`                     | Returns aggregate synthetic lifecycle counts               | Never represents customer or production metrics.                                          |
| `GET /v1/audit-events`             | Returns structured, redacted synthetic audit events        | Excludes raw lead or support content.                                                     |

## Error model

Known application errors follow this shape:

```json
{
  "error": {
    "code": "idempotency_key_required",
    "message": "Idempotency-Key is required."
  }
}
```

Validation errors return `400`. Unknown lifecycle identifiers return `404`. Invalid state transitions return `409`. Unexpected server errors use a generic `500` response and do not expose internal details.
