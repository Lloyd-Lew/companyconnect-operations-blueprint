import { describe, expect, it } from "vitest";
import { qualify } from "../src/domain/qualification.js";

describe("qualification", () => {
  it("assigns a deterministic priority recommendation for a high-fit synthetic lead", () => {
    const result = qualify({
      companyAlias: "Northstar Services",
      contactAlias: "Alex Example",
      employeeBand: "51-200",
      requestedService: "ai",
      processPain: "manual_handoffs",
      syntheticDataConfirmed: true
    });
    expect(result).toEqual({
      score: 85,
      tier: "priority",
      ownerRole: "Revenue Operations Lead",
      recommendedNextAction:
        "Schedule a technical systems discovery session within one business day."
    });
  });
});
