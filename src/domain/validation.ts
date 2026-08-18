import { z } from "zod";

export const leadSchema = z.object({
  companyAlias: z.string().trim().min(2).max(80),
  contactAlias: z.string().trim().min(2).max(80),
  employeeBand: z.enum(["1-10", "11-50", "51-200", "201+"]),
  requestedService: z.enum(["crm", "automation", "ai", "integration", "operations"]),
  processPain: z.enum(["manual_handoffs", "slow_follow_up", "reporting_gap", "data_reentry"]),
  syntheticDataConfirmed: z.literal(true)
});

export const supportRequestSchema = z.object({
  lifecycleId: z.string().uuid(),
  message: z.string().trim().min(10).max(600),
  simulatedKnowledgeMatch: z.boolean()
});

export const approveSchema = z.object({
  simulateNotificationFailure: z.boolean().default(false)
});
