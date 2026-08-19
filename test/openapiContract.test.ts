import { readFile } from "node:fs/promises";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/api/app.js";

const lead = {
  companyAlias: "Northstar Services",
  contactAlias: "Alex Example",
  employeeBand: "51-200",
  requestedService: "automation",
  processPain: "manual_handoffs",
  syntheticDataConfirmed: true
};

describe("OpenAPI-to-runtime alignment", () => {
  it("documents every public Operations Blueprint route and its key client-safety boundaries", async () => {
    const contract = await readFile(new URL("../openapi.yaml", import.meta.url), "utf8");

    for (const path of [
      "/health:",
      "/status:",
      "/v1/lifecycles:",
      "/v1/lifecycles/{lifecycleId}/approve:",
      "/v1/support-requests:",
      "/v1/kpis:",
      "/v1/audit-events:"
    ]) {
      expect(contract).toContain(path);
    }

    expect(contract).toContain("Idempotency-Key");
    expect(contract).toContain("syntheticDataConfirmed");
    expect(contract).toContain("in-memory");
  });

  it("exercises each documented public route against the reference implementation", async () => {
    const app = createApp();

    expect((await request(app).get("/health")).status).toBe(200);
    expect((await request(app).get("/status")).status).toBe(200);

    const created = await request(app)
      .post("/v1/lifecycles")
      .set("Idempotency-Key", "openapi-contract-key")
      .send(lead);
    expect(created.status).toBe(201);

    const replayed = await request(app)
      .post("/v1/lifecycles")
      .set("Idempotency-Key", "openapi-contract-key")
      .send(lead);
    expect(replayed.status).toBe(200);
    expect(replayed.body.lifecycle.id).toBe(created.body.lifecycle.id);

    const approved = await request(app)
      .post(`/v1/lifecycles/${created.body.lifecycle.id}/approve`)
      .send({ simulateNotificationFailure: false });
    expect(approved.status).toBe(200);

    const support = await request(app).post("/v1/support-requests").send({
      lifecycleId: created.body.lifecycle.id,
      message: "Please provide a synthetic onboarding status update.",
      simulatedKnowledgeMatch: true
    });
    expect(support.status).toBe(201);

    const kpis = await request(app).get("/v1/kpis");
    expect(kpis.status).toBe(200);
    expect(kpis.body.source).toBe("synthetic_lifecycle_records");

    const audit = await request(app).get("/v1/audit-events");
    expect(audit.status).toBe(200);
    expect(audit.body.events.length).toBeGreaterThan(0);
  });
});
