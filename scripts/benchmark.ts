import { performance } from "node:perf_hooks";
import {
  InMemoryAuditStore,
  InMemoryLifecycleStore,
  DeterministicNotificationAdapter
} from "../src/adapters/inMemoryAdapters.js";
import { LifecycleService } from "../src/application/lifecycleService.js";

const operations = 200;
const service = new LifecycleService(
  new InMemoryLifecycleStore(),
  new InMemoryAuditStore(),
  new DeterministicNotificationAdapter()
);
const started = performance.now();

for (let index = 0; index < operations; index += 1) {
  service.start(
    {
      companyAlias: `Synthetic Company ${index}`,
      contactAlias: `Synthetic Contact ${index}`,
      employeeBand: "11-50",
      requestedService: "automation",
      processPain: "manual_handoffs",
      syntheticDataConfirmed: true
    },
    `benchmark-${index}`
  );
}

const elapsedMs = performance.now() - started;
console.log(
  JSON.stringify({
    benchmark: "in_memory_lifecycle_creation",
    operations,
    elapsedMs: Number(elapsedMs.toFixed(3)),
    operationsPerSecond: Number(((operations / elapsedMs) * 1000).toFixed(2)),
    note: "Local synthetic benchmark only; not a production throughput claim."
  })
);
