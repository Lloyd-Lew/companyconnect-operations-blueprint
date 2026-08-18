export type ServiceInterest = "crm" | "automation" | "ai" | "integration" | "operations";
export type LifecycleState =
  | "awaiting_approval"
  | "onboarding"
  | "invoice_pending_retry"
  | "operational"
  | "support_escalated";

export interface SyntheticLead {
  companyAlias: string;
  contactAlias: string;
  employeeBand: "1-10" | "11-50" | "51-200" | "201+";
  requestedService: ServiceInterest;
  processPain: "manual_handoffs" | "slow_follow_up" | "reporting_gap" | "data_reentry";
  syntheticDataConfirmed: true;
}

export interface Qualification {
  score: number;
  tier: "priority" | "standard" | "nurture";
  recommendedNextAction: string;
  ownerRole: "Revenue Operations Lead" | "Solutions Consultant";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  correlationId: string;
  event: string;
  lifecycleId?: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface LifecycleRecord {
  id: string;
  idempotencyKey: string;
  correlationId: string;
  state: LifecycleState;
  lead: SyntheticLead;
  qualification: Qualification;
  opportunityId: string;
  quoteBrief: string;
  projectId?: string;
  invoiceId?: string;
  supportDisposition?: "draft_available" | "human_escalation_required";
  createdAt: string;
  updatedAt: string;
}

export interface SupportRequest {
  lifecycleId: string;
  message: string;
  simulatedKnowledgeMatch: boolean;
}
