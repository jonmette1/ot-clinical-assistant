import type { CurrentLongitudinalState, LongitudinalEvent } from "@/lib/longitudinal/longitudinalTypes";

export function updateCurrentStateFromEvent({
  previousState,
  event,
}: {
  previousState?: Partial<CurrentLongitudinalState> | null;
  event: LongitudinalEvent;
}): CurrentLongitudinalState {
  const previousEventCount =
    typeof previousState?.eventCount === "number" ? previousState.eventCount : 0;

  // Current state mutation: this replaces only the mutable current longitudinal state, not the baseline or history.
  return {
    lastUpdatedAt: event.eventDate,
    lastEventType: event.eventType,
    currentDominantBarrier: event.currentDominantBarrier,
    secondaryBarrier: event.secondaryBarrier,
    progressionStatus: event.progressionStatus,
    functionalChanges: event.functionalChanges,
    milestoneAchieved: event.milestoneAchieved,
    caregiverChange: event.caregiverChange,
    environmentalChange: event.environmentalChange,
    medicalChange: event.medicalChange,
    treatmentDirectionChanged: event.treatmentDirectionChanged,
    reasonTreatmentChanged: event.reasonTreatmentChanged,
    reassessmentRecommended: event.reassessmentRecommended,
    eventCount: previousEventCount + 1,
    mostRecentEvent: event,
  };
}
