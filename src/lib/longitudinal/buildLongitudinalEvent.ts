import type { LongitudinalEvent, ProgressionCheckInput } from "@/lib/longitudinal/longitudinalTypes";

function normalizeStringArray(value: ProgressionCheckInput["functionalChanges"]): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function buildLongitudinalEvent(input: ProgressionCheckInput): LongitudinalEvent {
  const progressionStatus = String(input.progressionStatus || "").trim();
  const medicalChange = nullableString(input.medicalChange);
  const reassessmentRecommended =
    progressionStatus === "Regression Detected" ||
    progressionStatus === "Plateau Emerging" ||
    Boolean(medicalChange);

  // Longitudinal event creation: every progression check is represented as an immutable event payload.
  return {
    eventType: "progression_check",
    eventDate: new Date().toISOString(),
    caseId: input.caseId,
    functionalChanges: normalizeStringArray(input.functionalChanges),
    currentDominantBarrier: String(input.currentDominantBarrier || "").trim(),
    secondaryBarrier: nullableString(input.secondaryBarrier),
    progressionStatus,
    treatmentDirectionChanged: input.treatmentDirectionChanged === true,
    milestoneAchieved: nullableString(input.milestoneAchieved),
    caregiverChange: nullableString(input.caregiverChange),
    environmentalChange: nullableString(input.environmentalChange),
    medicalChange,
    reasonTreatmentChanged: nullableString(input.reasonTreatmentChanged),
    reassessmentRecommended,
  };
}
