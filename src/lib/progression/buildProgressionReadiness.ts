import type { AdvancementReadiness } from "@/lib/progression/progressionTypes";

export type ProgressionReadiness =
  | "not_ready"
  | "emerging"
  | "ready_for_evaluation";

export type BuildProgressionReadinessInput = {
  progressionStatus?: string | null;
  milestoneAchieved?: string | null;
  functionalChanges?: string[] | string | null;
  advancementReadiness?: AdvancementReadiness | string | null;
  reassessmentRecommended?: boolean | null;
  requiresOperationalReview?: boolean | null;
  medicalChange?: string | null;
  safetyOrRegressionText?: string[] | string | null;
};

const normalize = (value: string | null | undefined): string =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

const asTextList = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value)) return value.map(normalize).filter(Boolean);

  const normalized = normalize(value);
  return normalized ? [normalized] : [];
};

const hasNegativeStatus = (status: string): boolean =>
  ["regression", "declin", "worsen", "deteriorat"].some((term) => status.includes(term));

const hasPositiveStatus = (status: string): boolean =>
  status === "progressing as expected" ||
  status === "progressing faster than expected" ||
  status === "improving" ||
  status.includes("progressing as expected") ||
  status.includes("progressing faster than expected") ||
  status.includes("improv");

const hasActiveDeterioration = (text: string): boolean =>
  /\b(regression|regressed|decline|declined|declining|deterioration|deteriorating|worse|worsening|unsafe|new fall|recent fall|increased falls|loss of function|reduced function|less consistent|less reliable)\b/.test(
    text
  );

export function buildProgressionReadiness({
  progressionStatus,
  milestoneAchieved,
  functionalChanges,
  advancementReadiness,
  reassessmentRecommended,
  requiresOperationalReview,
  medicalChange,
  safetyOrRegressionText,
}: BuildProgressionReadinessInput): ProgressionReadiness {
  const normalizedStatus = normalize(progressionStatus);
  const normalizedReadiness = normalize(advancementReadiness);
  const negativeSignalText = [
    normalizedStatus,
    ...asTextList(functionalChanges),
    ...asTextList(safetyOrRegressionText),
  ].join(" ");

  const regressionDetected =
    hasNegativeStatus(normalizedStatus) || hasActiveDeterioration(negativeSignalText);
  const plateauWithReassessmentConcern =
    normalizedStatus.includes("plateau") && reassessmentRecommended === true;
  const normalizedMedicalChange = normalize(medicalChange);
  const medicalReviewNeeded =
    Boolean(normalizedMedicalChange) &&
    !["none", "no change", "no medical change", "unchanged"].includes(normalizedMedicalChange);
  const operationalReviewDueToNegativeChange =
    requiresOperationalReview === true &&
    (regressionDetected || plateauWithReassessmentConcern || medicalReviewNeeded);

  if (
    regressionDetected ||
    plateauWithReassessmentConcern ||
    medicalReviewNeeded ||
    reassessmentRecommended === true ||
    operationalReviewDueToNegativeChange ||
    normalizedReadiness === "low"
  ) {
    return "not_ready";
  }

  if (!hasPositiveStatus(normalizedStatus)) return "not_ready";

  const hasMilestone = Boolean(normalize(milestoneAchieved));
  const hasEvaluationReadiness =
    normalizedReadiness === "partial" || normalizedReadiness === "high";

  if (hasMilestone && hasEvaluationReadiness) return "ready_for_evaluation";

  return "emerging";
}
