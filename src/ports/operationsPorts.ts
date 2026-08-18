import type { AuditEvent, LifecycleRecord } from "../domain/types.js";

export interface LifecycleStore {
  getByIdempotencyKey(key: string): LifecycleRecord | undefined;
  getById(id: string): LifecycleRecord | undefined;
  save(record: LifecycleRecord): LifecycleRecord;
  list(): LifecycleRecord[];
}

export interface AuditStore {
  append(event: AuditEvent): void;
  list(): AuditEvent[];
}

export interface NotificationPort {
  notify(input: {
    lifecycleId: string;
    correlationId: string;
    simulateFailure: boolean;
  }): { delivered: true } | { delivered: false; retryable: true; reason: string };
}
