import type {
  AttentionCategory,
  ClinicalAttentionState,
  CurrentLongitudinalState,
  LongitudinalEvent,
} from "@/lib/longitudinal/longitudinalTypes";

type AttentionDecision = {
  category: AttentionCategory;
  statement: string;
  drivers: string[];
};

const NO_ACTIVE_REVIEW_STATEMENT =
  "No active review need was identified from the latest progression check.";

const SAFETY_SIGNAL_PATTERN =
  /\b(fall|falls|fell|near[- ]?fall|loss of balance|unsafe|safety event|unsteady|instability|inconsistent|inconsistency|variable performance|fluctuat(?:e|es|ed|ing))\b/i;

const ADVANCEMENT_SIGNAL_PATTERN =
  /\b(advance|advancement|ready|readiness|reduce supervision|less supervision|independent|independence)\b/i;

function cleanText(value: string | null | undefined): string | null {
  const cleaned = value?.trim().replace(/[.]+$/, "");
  return cleaned || null;
}

function uniqueDrivers(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(values.map(cleanText).filter((value): value is string => Boolean(value)))
  ).slice(0, 2);
}

function combinedEventText(event: LongitudinalEvent): string {
  return [
    ...event.functionalChanges,
    event.currentDominantBarrier,
    event.secondaryBarrier,
    event.caregiverChange,
    event.environmentalChange,
    event.medicalChange,
    event.reasonTreatmentChanged,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildAttentionDecision(event: LongitudinalEvent): AttentionDecision {
  const safetyDriver = [
    event.medicalChange,
    ...event.functionalChanges,
    event.currentDominantBarrier,
    event.secondaryBarrier,
    event.caregiverChange,
    event.environmentalChange,
  ].find((value) => value && SAFETY_SIGNAL_PATTERN.test(value));

  if (safetyDriver || event.progressionStatus === "Regression Detected") {
    return {
      category: "Safety",
      statement:
        event.progressionStatus === "Regression Detected"
          ? "Functional safety should be reassessed before continuing the current progression plan."
          : "Safety and performance consistency should be verified before progression decisions.",
      drivers: uniqueDrivers([
        safetyDriver,
        event.progressionStatus === "Regression Detected"
          ? `Regression detected with ${event.currentDominantBarrier} as the current limiting factor`
          : null,
      ]),
    };
  }

  const progressionVerificationNeeded =
    event.progressionStatus === "Progressing Faster Than Expected" ||
    (event.treatmentDirectionChanged &&
      ADVANCEMENT_SIGNAL_PATTERN.test(combinedEventText(event)));

  if (progressionVerificationNeeded) {
    return {
      category: "Function",
      statement: "Advancement readiness should be verified before progressing the current plan.",
      drivers: uniqueDrivers([
        event.reasonTreatmentChanged,
        ...event.functionalChanges,
        event.currentDominantBarrier,
      ]),
    };
  }

  if (event.caregiverChange) {
    return {
      category: "Caregiver",
      statement:
        "Caregiver support requirements should be reassessed before changing supervision or task demands.",
      drivers: uniqueDrivers([event.caregiverChange, event.currentDominantBarrier]),
    };
  }

  if (event.environmentalChange) {
    return {
      category: "Environment",
      statement:
        "Environmental fit and equipment needs should be reviewed before progressing the task plan.",
      drivers: uniqueDrivers([event.environmentalChange, event.currentDominantBarrier]),
    };
  }

  if (
    event.progressionStatus === "Plateau Emerging" ||
    event.progressionStatus === "Minimal Progress"
  ) {
    return {
      category: "Function",
      statement:
        event.progressionStatus === "Plateau Emerging"
          ? "The continued plateau should be reassessed before maintaining the current recommendation."
          : "Limited progress should be reassessed to determine whether the current recommendation remains appropriate.",
      drivers: uniqueDrivers([
        event.currentDominantBarrier,
        event.secondaryBarrier,
        ...event.functionalChanges,
      ]),
    };
  }

  if (event.medicalChange) {
    return {
      category: "Medical",
      statement:
        "The functional implications of the medical change should be reassessed before continuing the current plan.",
      drivers: uniqueDrivers([event.medicalChange, event.currentDominantBarrier]),
    };
  }

  if (event.treatmentDirectionChanged) {
    return {
      category: "Function",
      statement:
        "The basis for changing treatment direction should be reviewed before updating the current recommendation.",
      drivers: uniqueDrivers([event.reasonTreatmentChanged, event.currentDominantBarrier]),
    };
  }

  return {
    category: "Function",
    statement: NO_ACTIVE_REVIEW_STATEMENT,
    drivers: [],
  };
}

export function buildClinicalAttentionState({
  currentState,
  event,
}: {
  currentState: CurrentLongitudinalState;
  event: LongitudinalEvent;
}): ClinicalAttentionState {
  const attention = buildAttentionDecision(event);

  // Clinical attention mutation: derive one deterministic review priority rather than restating progress.
  return {
    lastUpdatedAt: currentState.lastUpdatedAt,
    category: attention.category,
    attentionStatement: attention.statement,
    attentionDrivers: attention.drivers,
    requiresOperationalReview: event.treatmentDirectionChanged,
    reassessmentRecommended: currentState.reassessmentRecommended,
    progressionStatus: currentState.progressionStatus,
  };
}
