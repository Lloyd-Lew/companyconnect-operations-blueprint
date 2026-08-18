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

describe("Operations Blueprint API", () => {
  it("reports the synthetic system boundary", async () => {
    const response = await request(createApp()).get("/status");
    expect(response.status).toBe(200);
    expect(response.body.customerData).toBe("not accepted");
  });

  it("creates, approves, and reports a synthetic lifecycle", async () => {
    const app = createApp();
    const created = await request(app)
      .post("/v1/lifecycles")
      .set("Idempotency-Key", "api-key")
      .send(lead);
    expect(created.status).toBe(201);
    const approved = await request(app)
      .post(`/v1/lifecycles/${created.body.lifecycle.id}/approve`)
      .send({ simulateNotificationFailure: false });
    expect(approved.status).toBe(200);
    expect(approved.body.lifecycle.state).toBe("operational");
    const kpis = await request(app).get("/v1/kpis");
    expect(kpis.body.kpis.operational).toBe(1);
  });

  it("rejects lifecycle creation without an idempotency key", async () => {
    const response = await request(createApp()).post("/v1/lifecycles").send(lead);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("idempotency_key_required");
  });
});
