export type ProgressionStatus =
  | "Progressing As Expected"
  | "Progressing Faster Than Expected"
  | "Minimal Progress"
  | "Plateau Emerging"
  | "Regression Detected"
  | string;

export type AttentionCategory =
  | "Function"
  | "Safety"
  | "Participation"
  | "Caregiver"
  | "Environment"
  | "Medical";

export type ProgressionCheckInput = {
  caseId: string;
  functionalChanges?: string[] | string | null;
  currentDominantBarrier: string;
  secondaryBarrier?: string | null;
  progressionStatus: ProgressionStatus;
  treatmentDirectionChanged: boolean;
  milestoneAchieved?: string | null;
  caregiverChange?: string | null;
  environmentalChange?: string | null;
  medicalChange?: string | null;
  reasonTreatmentChanged?: string | null;
};

export type LongitudinalEvent = {
  eventType: "progression_check";
  eventDate: string;
  caseId: string;
  functionalChanges: string[];
  currentDominantBarrier: string;
  secondaryBarrier: string | null;
  progressionStatus: ProgressionStatus;
  treatmentDirectionChanged: boolean;
  milestoneAchieved: string | null;
  caregiverChange: string | null;
  environmentalChange: string | null;
  medicalChange: string | null;
  reasonTreatmentChanged: string | null;
  reassessmentRecommended: boolean;
};

export type CurrentLongitudinalState = {
  lastUpdatedAt: string;
  lastEventType: LongitudinalEvent["eventType"];
  currentDominantBarrier: string;
  secondaryBarrier: string | null;
  progressionStatus: ProgressionStatus;
  functionalChanges: string[];
  milestoneAchieved: string | null;
  caregiverChange: string | null;
  environmentalChange: string | null;
  medicalChange: string | null;
  treatmentDirectionChanged: boolean;
  reasonTreatmentChanged: string | null;
  reassessmentRecommended: boolean;
  eventCount: number;
  mostRecentEvent: LongitudinalEvent;
};

export type ClinicalAttentionState = {
  lastUpdatedAt: string;
  category: AttentionCategory;
  attentionStatement: string;
  attentionDrivers: string[];
  requiresOperationalReview: boolean;
  reassessmentRecommended: boolean;
  progressionStatus: ProgressionStatus;
};

export type OperationalPrioritization = Record<string, unknown> & {
  currentOperationalEmphasis?: string;
  emphasisRationale?: string[];
  dominantBarriers?: string[];
  adjacentOperationalPriorities?: Array<Record<string, unknown>>;
  reassessmentTriggers?: string[];
  continuitySummary?: string;
  longitudinalRefresh?: Record<string, unknown>;
};
