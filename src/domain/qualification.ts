import type { Qualification, SyntheticLead } from "./types.js";

const bandScore: Record<SyntheticLead["employeeBand"], number> = {
  "1-10": 10,
  "11-50": 25,
  "51-200": 40,
  "201+": 55
};

const serviceScore: Record<SyntheticLead["requestedService"], number> = {
  crm: 20,
  automation: 25,
  ai: 30,
  integration: 25,
  operations: 30
};

export function qualify(lead: SyntheticLead): Qualification {
  const score = Math.min(
    100,
    bandScore[lead.employeeBand] + serviceScore[lead.requestedService] + 15
  );
  const tier = score >= 75 ? "priority" : score >= 50 ? "standard" : "nurture";
  const ownerRole = tier === "priority" ? "Revenue Operations Lead" : "Solutions Consultant";
  const recommendedNextAction =
    tier === "priority"
      ? "Schedule a technical systems discovery session within one business day."
      : tier === "standard"
        ? "Share the Operational Bottleneck Brief and book a strategy call."
        : "Provide a relevant systems explainer and invite a future discovery conversation.";

  return { score, tier, ownerRole, recommendedNextAction };
}
