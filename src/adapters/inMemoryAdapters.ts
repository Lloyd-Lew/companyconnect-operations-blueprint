import type { AuditEvent, LifecycleRecord } from "../domain/types.js";
import type { AuditStore, LifecycleStore, NotificationPort } from "../ports/operationsPorts.js";

export class InMemoryLifecycleStore implements LifecycleStore {
  private readonly records = new Map<string, LifecycleRecord>();
  private readonly idempotency = new Map<string, string>();

  getByIdempotencyKey(key: string): LifecycleRecord | undefined {
    const id = this.idempotency.get(key);
    return id ? this.records.get(id) : undefined;
  }

  getById(id: string): LifecycleRecord | undefined {
    return this.records.get(id);
  }

  save(record: LifecycleRecord): LifecycleRecord {
    this.records.set(record.id, record);
    this.idempotency.set(record.idempotencyKey, record.id);
    return record;
  }

  list(): LifecycleRecord[] {
    return [...this.records.values()];
  }
}

export class InMemoryAuditStore implements AuditStore {
  private readonly events: AuditEvent[] = [];

  append(event: AuditEvent): void {
    this.events.push(event);
  }

  list(): AuditEvent[] {
    return [...this.events];
  }
}

export class DeterministicNotificationAdapter implements NotificationPort {
  notify(input: {
    lifecycleId: string;
    correlationId: string;
    simulateFailure: boolean;
  }): { delivered: true } | { delivered: false; retryable: true; reason: string } {
    if (input.simulateFailure) {
      return { delivered: false, retryable: true, reason: "simulated_notification_timeout" };
    }
    return { delivered: true };
  }
}
