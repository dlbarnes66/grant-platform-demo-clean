export type PlanName = "basic" | "pro" | "advanced" | "enterprise";

export type PlanCapabilities = {
  maxUsers: number;
  aiWriter: boolean;
  grantMatching: boolean;
  crm: boolean;
  scoringEngine: boolean;
  advancedReporting: boolean;
  complianceAutomation: boolean;
  budgetAutomation: boolean;
  extraSeatsIncluded: boolean;
  vaultExpansionIncluded: boolean;
  packetExpansionIncluded: boolean;
};

export const PLAN_CAPABILITIES: Record<PlanName, PlanCapabilities> = {
  basic: {
    maxUsers: 1,
    aiWriter: false,
    grantMatching: false,
    crm: false,
    scoringEngine: false,
    advancedReporting: false,
    complianceAutomation: false,
    budgetAutomation: false,
    extraSeatsIncluded: false,
    vaultExpansionIncluded: false,
    packetExpansionIncluded: false
  },
  pro: {
    maxUsers: 5,
    aiWriter: false,
    grantMatching: true,
    crm: true,
    scoringEngine: false,
    advancedReporting: false,
    complianceAutomation: false,
    budgetAutomation: false,
    extraSeatsIncluded: false,
    vaultExpansionIncluded: false,
    packetExpansionIncluded: false
  },
  advanced: {
    maxUsers: 10,
    aiWriter: true,
    grantMatching: true,
    crm: true,
    scoringEngine: true,
    advancedReporting: true,
    complianceAutomation: true,
    budgetAutomation: true,
    extraSeatsIncluded: false,
    vaultExpansionIncluded: false,
    packetExpansionIncluded: false
  },
  enterprise: {
    maxUsers: 9999,
    aiWriter: true,
    grantMatching: true,
    crm: true,
    scoringEngine: true,
    advancedReporting: true,
    complianceAutomation: true,
    budgetAutomation: true,
    extraSeatsIncluded: true,
    vaultExpansionIncluded: true,
    packetExpansionIncluded: true
  }
};
