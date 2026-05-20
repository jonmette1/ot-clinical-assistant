export type AdvancementReadiness = "low" | "partial" | "high";

export type ProgressionPhase =
  | "stabilization"
  | "foundational_participation"
  | "supported_functional_execution"
  | "reduced_dependency"
  | "environmental_optimization"
  | "maintenance_readiness";

export type ProgressionState = {
  currentPhase: ProgressionPhase;
  advancementReadiness: AdvancementReadiness;
  activeMilestones: string[];
  activeBarriers: string[];
  regressionRisks: string[];
  reassessmentTriggers: string[];
  caregiverDependencyState: string;
  environmentalLimitationState: string;
  continuitySummary: string;
};