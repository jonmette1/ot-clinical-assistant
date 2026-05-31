import type {
  ClinicalAttentionState,
  LongitudinalEvent,
  OperationalPrioritization,
} from "@/lib/longitudinal/longitudinalTypes";

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export function refreshOperationalPrioritizationFromEvent({
  existingOperationalPrioritization,
  event,
  clinicalAttentionState,
}: {
  existingOperationalPrioritization?: OperationalPrioritization | null;
  event: LongitudinalEvent;
  clinicalAttentionState: ClinicalAttentionState;
}): OperationalPrioritization {
  const existing = existingOperationalPrioritization || {};
  const reassessmentTriggers = uniqueStrings([
    ...(Array.isArray(existing.reassessmentTriggers)
      ? existing.reassessmentTriggers.filter((item): item is string => typeof item === "string")
      : []),
    event.reassessmentRecommended ? `${event.progressionStatus} requires clinical review` : null,
    event.medicalChange ? `Medical change: ${event.medicalChange}` : null,
  ]);

  // Conditional operational prioritization refresh: called only when the clinician confirms treatment direction changed.
  return {
    ...existing,
    currentOperationalEmphasis:
      clinicalAttentionState.attentionStatement ||
      existing.currentOperationalEmphasis ||
      `Current treatment focus is shaped by ${event.currentDominantBarrier}.`,
    emphasisRationale: uniqueStrings([
      event.reasonTreatmentChanged,
      `Progression status: ${event.progressionStatus}`,
      event.secondaryBarrier ? `Secondary barrier: ${event.secondaryBarrier}` : null,
      ...event.functionalChanges,
    ]),
    dominantBarriers: uniqueStrings([
      event.currentDominantBarrier,
      event.secondaryBarrier,
      ...(Array.isArray(existing.dominantBarriers)
        ? existing.dominantBarriers.filter((item): item is string => typeof item === "string")
        : []),
    ]).slice(0, 5),
    reassessmentTriggers,
    continuitySummary:
      event.reasonTreatmentChanged ||
      event.milestoneAchieved ||
      existing.continuitySummary ||
      `${event.currentDominantBarrier} remains the current longitudinal treatment constraint.`,
    longitudinalRefresh: {
      refreshedAt: event.eventDate,
      sourceEventType: event.eventType,
      progressionStatus: event.progressionStatus,
      treatmentDirectionChanged: event.treatmentDirectionChanged,
    },
  };
}
