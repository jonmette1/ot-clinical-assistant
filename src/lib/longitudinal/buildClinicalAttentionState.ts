import type {
  AttentionCategory,
  ClinicalAttentionState,
  CurrentLongitudinalState,
  LongitudinalEvent,
} from "@/lib/longitudinal/longitudinalTypes";

function getCategory(event: LongitudinalEvent): AttentionCategory {
  if (event.medicalChange) return "Medical";
  if (event.caregiverChange) return "Caregiver";
  if (event.environmentalChange) return "Environment";
  if (event.progressionStatus === "Regression Detected") return "Safety";
  if (event.milestoneAchieved) return "Participation";
  return "Function";
}

function buildAttentionStatement(event: LongitudinalEvent, category: AttentionCategory): string {
  if (event.treatmentDirectionChanged && event.reasonTreatmentChanged) {
    return `Treatment attention should shift because ${event.reasonTreatmentChanged}.`;
  }

  if (event.progressionStatus === "Regression Detected") {
    return `Functional performance requires attention due to regression with ${event.currentDominantBarrier} as the current dominant barrier.`;
  }

  if (event.progressionStatus === "Plateau Emerging") {
    return `Progression requires attention because ${event.currentDominantBarrier} continues to limit participation.`;
  }

  if (category === "Caregiver" && event.caregiverChange) {
    return `Caregiver context requires attention: ${event.caregiverChange}.`;
  }

  if (category === "Environment" && event.environmentalChange) {
    return `Environmental context requires attention: ${event.environmentalChange}.`;
  }

  if (category === "Medical" && event.medicalChange) {
    return `Medical change requires attention: ${event.medicalChange}.`;
  }

  if (event.milestoneAchieved) {
    return `Progression milestone achieved: ${event.milestoneAchieved}.`;
  }

  return `Current function requires attention around ${event.currentDominantBarrier}.`;
}

export function buildClinicalAttentionState({
  currentState,
  event,
}: {
  currentState: CurrentLongitudinalState;
  event: LongitudinalEvent;
}): ClinicalAttentionState {
  const category = getCategory(event);
  const attentionDrivers = [
    event.currentDominantBarrier,
    event.secondaryBarrier,
    ...event.functionalChanges,
    event.caregiverChange,
    event.environmentalChange,
    event.medicalChange,
    event.milestoneAchieved,
  ].filter((item): item is string => Boolean(item));

  // Clinical attention mutation: derived from the latest current state/event so the case can answer what matters today.
  return {
    lastUpdatedAt: currentState.lastUpdatedAt,
    category,
    attentionStatement: buildAttentionStatement(event, category),
    attentionDrivers: Array.from(new Set(attentionDrivers)).slice(0, 8),
    requiresOperationalReview: event.treatmentDirectionChanged,
    reassessmentRecommended: currentState.reassessmentRecommended,
    progressionStatus: currentState.progressionStatus,
  };
}
