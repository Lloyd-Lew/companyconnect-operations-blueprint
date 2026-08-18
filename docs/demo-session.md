# Demonstration Session

This is a reproducible, synthetic demonstration. Replace all identifiers with the values returned by your local instance.

## 1. Start a lifecycle

Use the README lifecycle command. The first request returns `201` and a lifecycle in `awaiting_approval`.

## 2. Prove idempotency

Repeat the exact same lifecycle request with the same `Idempotency-Key`. The API returns `200` and `replayed: true`; it does not create a second lifecycle.

## 3. Approve the synthetic quote path

Call the approval route with `simulateNotificationFailure: false`. The lifecycle enters `operational`, and synthetic project/invoice identifiers are returned.

## 4. Prove failure behavior

Create another synthetic lifecycle, then approve it with:

```json
{ "simulateNotificationFailure": true }
```

The lifecycle moves to `invoice_pending_retry`. Inspect `/v1/audit-events` to find a `notification.retry_required` event. The workflow does not pretend that downstream notification succeeded.

## 5. Prove human escalation

Post a support request with `simulatedKnowledgeMatch: false`. The resulting disposition is `human_escalation_required`; the system does not manufacture an authoritative response.

## 6. Inspect synthetic KPIs

Call `GET /v1/kpis`. The counters derive only from in-memory synthetic lifecycle records created during this session.
