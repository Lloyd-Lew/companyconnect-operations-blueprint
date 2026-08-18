import express, { type Express, type NextFunction, type Request, type Response } from "express";
import {
  InMemoryAuditStore,
  InMemoryLifecycleStore,
  DeterministicNotificationAdapter
} from "../adapters/inMemoryAdapters.js";
import { DomainError } from "../application/errors.js";
import { LifecycleService } from "../application/lifecycleService.js";
import { approveSchema, leadSchema, supportRequestSchema } from "../domain/validation.js";

export function createApp(service = createDefaultService()): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok", service: "companyconnect-operations-blueprint" });
  });

  app.get("/status", (_request, response) => {
    response.status(200).json({
      mode: "synthetic_reference_implementation",
      persistence: "in_memory",
      externalIntegrations: "disabled",
      customerData: "not accepted"
    });
  });

  app.post("/v1/lifecycles", (request, response, next) => {
    try {
      const lead = leadSchema.parse(request.body);
      const idempotencyKey = request.header("Idempotency-Key") ?? "";
      const result = service.start(lead, idempotencyKey);
      response.status(result.replayed ? 200 : 201).json({
        replayed: result.replayed,
        lifecycle: result.lifecycle
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/lifecycles/:lifecycleId/approve", (request, response, next) => {
    try {
      const input = approveSchema.parse(request.body ?? {});
      const lifecycle = service.approve(
        request.params.lifecycleId,
        input.simulateNotificationFailure
      );
      response.status(200).json({ lifecycle });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/support-requests", (request, response, next) => {
    try {
      const input = supportRequestSchema.parse(request.body);
      response.status(201).json(service.handleSupport(input));
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/kpis", (_request, response) => {
    response.status(200).json({ source: "synthetic_lifecycle_records", kpis: service.getKpis() });
  });

  app.get("/v1/audit-events", (_request, response) => {
    response.status(200).json({ events: service.listAuditEvents() });
  });

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof DomainError) {
      response
        .status(error.statusCode)
        .json({ error: { code: error.code, message: error.message } });
      return;
    }
    if (isZodError(error)) {
      response.status(400).json({ error: { code: "validation_error", message: error.message } });
      return;
    }
    response
      .status(500)
      .json({ error: { code: "internal_error", message: "Unexpected internal error." } });
  });

  return app;
}

export function createDefaultService(): LifecycleService {
  return new LifecycleService(
    new InMemoryLifecycleStore(),
    new InMemoryAuditStore(),
    new DeterministicNotificationAdapter()
  );
}

function isZodError(error: unknown): error is { name: "ZodError"; message: string } {
  return (
    typeof error === "object" && error !== null && "name" in error && error.name === "ZodError"
  );
}
