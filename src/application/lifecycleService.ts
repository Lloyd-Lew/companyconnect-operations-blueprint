import { randomUUID } from "node:crypto";
import { qualify } from "../domain/qualification.js";
import type {
  AuditEvent,
  LifecycleRecord,
  SupportRequest,
  SyntheticLead
} from "../domain/types.js";
import type { AuditStore, LifecycleStore, NotificationPort } from "../ports/operationsPorts.js";
import { DomainError } from "./errors.js";

type Clock = () => string;

export class LifecycleService {
  constructor(
    private readonly lifecycleStore: LifecycleStore,
    private readonly auditStore: AuditStore,
    private readonly notificationPort: NotificationPort,
    private readonly clock: Clock = () => new Date().toISOString()
  ) {}

  start(
    lead: SyntheticLead,
    idempotencyKey: string
  ): { lifecycle: LifecycleRecord; replayed: boolean } {
    if (!idempotencyKey.trim()) {
      throw new DomainError("Idempotency-Key is required.", 400, "idempotency_key_required");
    }

    const existing = this.lifecycleStore.getByIdempotencyKey(idempotencyKey);
    if (existing) {
      this.audit(existing.correlationId, "lifecycle.replayed", existing.id, { replayed: true });
      return { lifecycle: existing, replayed: true };
    }

    const now = this.clock();
    const id = randomUUID();
    const correlationId = randomUUID();
    const qualification = qualify(lead);
    const lifecycle: LifecycleRecord = {
      id,
      idempotencyKey,
      correlationId,
      state: "awaiting_approval",
      lead,
      qualification,
      opportunityId: `opp_${randomUUID()}`,
      quoteBrief: `${lead.requestedService} blueprint for ${lead.companyAlias}; priority: ${qualification.tier}; owner: ${qualification.ownerRole}.`,
      createdAt: now,
      updatedAt: now
    };
    this.lifecycleStore.save(lifecycle);
    this.audit(correlationId, "lifecycle.created", id, {
      qualificationTier: qualification.tier,
      score: qualification.score,
      requestedService: lead.requestedService,
      syntheticDataConfirmed: true
    });
    return { lifecycle, replayed: false };
  }

  approve(lifecycleId: string, simulateNotificationFailure: boolean): LifecycleRecord {
    const lifecycle = this.requireLifecycle(lifecycleId);
    if (lifecycle.state !== "awaiting_approval") {
      throw new DomainError(
        "Only awaiting approval lifecycles can be approved.",
        409,
        "invalid_lifecycle_state"
      );
    }

    const updated: LifecycleRecord = {
      ...lifecycle,
      projectId: `project_${randomUUID()}`,
      invoiceId: `invoice_${randomUUID()}`,
      updatedAt: this.clock()
    };
    const notification = this.notificationPort.notify({
      lifecycleId,
      correlationId: updated.correlationId,
      simulateFailure: simulateNotificationFailure
    });
    updated.state = notification.delivered ? "operational" : "invoice_pending_retry";
    this.lifecycleStore.save(updated);
    this.audit(updated.correlationId, "lifecycle.approved", lifecycleId, {
      projectCreated: true,
      invoiceTriggered: true,
      notificationDelivered: notification.delivered
    });
    if (!notification.delivered) {
      this.audit(updated.correlationId, "notification.retry_required", lifecycleId, {
        retryable: notification.retryable,
        reason: notification.reason
      });
    }
    return updated;
  }

  handleSupport(input: SupportRequest): {
    lifecycle: LifecycleRecord;
    disposition: "draft_available" | "human_escalation_required";
  } {
    const lifecycle = this.requireLifecycle(input.lifecycleId);
    const disposition = input.simulatedKnowledgeMatch
      ? "draft_available"
      : "human_escalation_required";
    const updated: LifecycleRecord = {
      ...lifecycle,
      supportDisposition: disposition,
      updatedAt: this.clock()
    };
    this.lifecycleStore.save(updated);
    this.audit(updated.correlationId, "support.request_processed", updated.id, {
      disposition,
      messageLength: input.message.length,
      rawMessageStored: false
    });
    return { lifecycle: updated, disposition };
  }

  getKpis(): {
    totalLifecycles: number;
    awaitingApproval: number;
    operational: number;
    retryRequired: number;
    supportEscalations: number;
  } {
    const records = this.lifecycleStore.list();
    return {
      totalLifecycles: records.length,
      awaitingApproval: records.filter((record) => record.state === "awaiting_approval").length,
      operational: records.filter((record) => record.state === "operational").length,
      retryRequired: records.filter((record) => record.state === "invoice_pending_retry").length,
      supportEscalations: records.filter(
        (record) => record.supportDisposition === "human_escalation_required"
      ).length
    };
  }

  listAuditEvents(): AuditEvent[] {
    return this.auditStore.list();
  }

  private requireLifecycle(id: string): LifecycleRecord {
    const lifecycle = this.lifecycleStore.getById(id);
    if (!lifecycle) {
      throw new DomainError("Lifecycle was not found.", 404, "lifecycle_not_found");
    }
    return lifecycle;
  }

  private audit(
    correlationId: string,
    event: string,
    lifecycleId: string | undefined,
    metadata: AuditEvent["metadata"]
  ): void {
    this.auditStore.append({
      id: `audit_${randomUUID()}`,
      timestamp: this.clock(),
      correlationId,
      event,
      lifecycleId,
      metadata
    });
  }
}
