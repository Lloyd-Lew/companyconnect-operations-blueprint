import { describe, expect, it } from "vitest";
import {
  InMemoryAuditStore,
  InMemoryLifecycleStore,
  DeterministicNotificationAdapter
} from "../src/adapters/inMemoryAdapters.js";
import { LifecycleService } from "../src/application/lifecycleService.js";

const lead = {
  companyAlias: "Northstar Services",
  contactAlias: "Alex Example",
  employeeBand: "51-200" as const,
  requestedService: "automation" as const,
  processPain: "manual_handoffs" as const,
  syntheticDataConfirmed: true as const
};

describe("LifecycleService", () => {
  it("replays the original result when an idempotency key is reused", () => {
    const service = new LifecycleService(
      new InMemoryLifecycleStore(),
      new InMemoryAuditStore(),
      new DeterministicNotificationAdapter(),
      () => "2026-08-18T00:00:00.000Z"
    );
    const initial = service.start(lead, "demo-key");
    const replay = service.start(lead, "demo-key");
    expect(initial.replayed).toBe(false);
    expect(replay.replayed).toBe(true);
    expect(replay.lifecycle.id).toBe(initial.lifecycle.id);
  });

  it("creates a retry-ready state when a synthetic downstream notification fails", () => {
    const audit = new InMemoryAuditStore();
    const service = new LifecycleService(
      new InMemoryLifecycleStore(),
      audit,
      new DeterministicNotificationAdapter(),
      () => "2026-08-18T00:00:00.000Z"
    );
    const created = service.start(lead, "approval-key");
    const approved = service.approve(created.lifecycle.id, true);
    expect(approved.state).toBe("invoice_pending_retry");
    expect(audit.list().some((event) => event.event === "notification.retry_required")).toBe(true);
    const support = service.handleSupport({
      lifecycleId: created.lifecycle.id,
      message: "Synthetic support question requiring a human decision.",
      simulatedKnowledgeMatch: false
    });
    expect(support.lifecycle.state).toBe("invoice_pending_retry");
    expect(service.getKpis()).toMatchObject({ retryRequired: 1, supportEscalations: 1 });
  });
});
