import { compressNextActionList } from "@/lib/clinicalDisplayLanguage";
import { reconcileBarriers } from "@/lib/continuity/reconcileBarriers";
import { reconcileActivityConstraint } from "@/lib/continuity/reconcileActivityConstraint";
import { reconcileReassessmentTriggers } from "@/lib/continuity/reconcileReassessmentTriggers";
import { buildProgressionReadiness } from "@/lib/progression/buildProgressionReadiness";

export type CommandCenterNextActionInput = {
  structuredPlanDetails?: {
    immediateActions?: string[];
  } | null;
  operationalPrioritization?: {
    currentOperationalEmphasis?: string;
    dominantBarriers?: string[];
    reassessmentTriggers?: string[];
    longitudinalRefresh?: Record<string, unknown>;
  } | null;
  progressionState?: {
    advancementReadiness?: string;
    activeBarriers?: string[];
    reassessmentTriggers?: string[];
  } | null;
  clinicalAttentionState?: unknown;
  currentLongitudinalState?: unknown;
  latestEventPayload?: unknown;
  primaryTargetActivity?: string | null;
  limit?: number;
};

export type CommandCenterNextActionResult = {
  primaryAction: string;
  supportingActions: string[];
  actions: string[];
  staleGeneratedPlanActionsSuppressed: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readUnknown = (source: unknown, keys: string[]): unknown => {
  if (!isRecord(source)) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const readText = (source: unknown, keys: string[]): string | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return null;
};

const readBoolean = (source: unknown, keys: string[]): boolean | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "no") return false;
  }

  return null;
};

const readTextList = (source: unknown, keys: string[]): string[] => {
  const value = readUnknown(source, keys);

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string | number | boolean =>
        typeof item === "string" || typeof item === "number" || typeof item === "boolean"
      )
      .map(String)
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value];

  return [];
};

const normalizeSignalText = (value: string | null | undefined): string =>
  (value || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const compactUnique = (items: Array<string | null | undefined>): string[] =>
  Array.from(new Set(items.filter((item): item is string => Boolean(item?.trim()))));

const getMostRecentEvent = (currentLongitudinalState: unknown): unknown =>
  readUnknown(currentLongitudinalState, ["mostRecentEvent", "most_recent_event"]);

const stripNegatedSafetyEvents = (signalText: string): string =>
  signalText
    .replace(
      /\b(?:no|not|without|denies?|denied)\s+(?:current\s+|new\s+|recent\s+|reported\s+|documented\s+|additional\s+|further\s+|any\s+)*(?:falls?|near\s*falls?|injur(?:y|ies)|unsafe\s+(?:transfer|mobility|performance))(?:\s+(?:or|and)\s+(?:falls?|near\s*falls?|injur(?:y|ies)))?\b/g,
      " "
    )
    .replace(
      /\b(?:falls?|near\s*falls?|injur(?:y|ies))\s+(?:did not|didn't|has not|hasn't)\s+occur\b/g,
      " "
    );

const includesSafetyReviewSignal = (signalText: string): boolean =>
  /\b(falls?|fell|near\s*falls?|injury|injuries|injured|wound|hospital|er|emergency|new pain|worsening pain|new symptom|worsening symptom|unsafe|decline|declined|declining|regression)\b/.test(
    stripNegatedSafetyEvents(signalText)
  );

const hasMeaningfulMedicalChange = (medicalChange: string | null): boolean => {
  const normalized = normalizeSignalText(medicalChange);
  return (
    Boolean(normalized) &&
    !["none", "no", "no change", "no medical change", "unchanged", "not applicable", "n/a"].includes(
      normalized
    )
  );
};

const deriveMonitoringContext = (...sources: Array<string | null | undefined>): string => {
  const source = normalizeSignalText(sources.join(" "));

  if (source.includes("toilet transfer")) return "toilet transfer safety";
  if (source.includes("shower transfer")) return "shower transfer safety";
  if (source.includes("bathroom transfer")) return "bathroom transfer safety";
  if (source.includes("transfer") || source.includes("mobility")) return "transfer safety";
  if (source.includes("bath") || source.includes("shower")) return "bathing safety";
  if (source.includes("toilet")) return "toileting safety";
  if (source.includes("caregiver")) return "caregiver-supported safety";
  if (source.includes("environment") || source.includes("equipment")) {
    return "environmental safety";
  }

  return "functional safety";
};

const deriveBarrierMonitoringContext = (
  barrier: string | null | undefined,
  targetActivity: string | null | undefined,
): string => {
  const normalizedBarrier = normalizeSignalText(barrier);
  if (normalizedBarrier.includes("pain")) return "pain tolerance during higher-demand activity";
  if (normalizedBarrier.includes("fatigue") || normalizedBarrier.includes("endurance")) {
    return "activity tolerance during higher-demand activity";
  }

  return deriveMonitoringContext(targetActivity, barrier);
};

const textMentionsBarrier = (value: string, barrier: string | null): boolean => {
  const normalizedBarrier = normalizeSignalText(barrier);
  if (!normalizedBarrier) return false;

  const barrierTerms = [normalizedBarrier, "pain", "balance", "fatigue", "weakness"].filter(
    (term) => normalizedBarrier.includes(term) || term === normalizedBarrier,
  );
  const normalizedValue = normalizeSignalText(value);
  return barrierTerms.some((term) => term.length >= 4 && normalizedValue.includes(term));
};

export function buildCommandCenterNextActions({
  structuredPlanDetails,
  operationalPrioritization,
  progressionState,
  clinicalAttentionState,
  currentLongitudinalState,
  latestEventPayload,
  primaryTargetActivity,
  limit = 3,
}: CommandCenterNextActionInput): CommandCenterNextActionResult {
  const mostRecentEvent = getMostRecentEvent(currentLongitudinalState) || latestEventPayload;
  const progressionStatus =
    readText(currentLongitudinalState, ["progressionStatus", "progression_status"]) ||
    readText(clinicalAttentionState, ["progressionStatus", "progression_status"]) ||
    readText(mostRecentEvent, ["progressionStatus", "progression_status"]);
  const milestoneAchieved =
    readText(currentLongitudinalState, ["milestoneAchieved", "milestone_achieved"]) ||
    readText(mostRecentEvent, ["milestoneAchieved", "milestone_achieved"]);
  const advancementReadiness = progressionState?.advancementReadiness || null;
  const latestCurrentDominantBarrier =
    readText(currentLongitudinalState, ["currentDominantBarrier", "current_dominant_barrier"]) ||
    readText(mostRecentEvent, ["currentDominantBarrier", "current_dominant_barrier"]);
  const reasonTreatmentChanged =
    readText(currentLongitudinalState, ["reasonTreatmentChanged", "reason_treatment_changed"]) ||
    readText(mostRecentEvent, ["reasonTreatmentChanged", "reason_treatment_changed"]);
  const medicalChange =
    readText(currentLongitudinalState, ["medicalChange", "medical_change"]) ||
    readText(mostRecentEvent, ["medicalChange", "medical_change"]);
  const attentionStatement = readText(clinicalAttentionState, [
    "attentionStatement",
    "attention_statement",
  ]);
  const attentionDrivers = readTextList(clinicalAttentionState, [
    "attentionDrivers",
    "attention_drivers",
  ]);
  const functionalChanges = compactUnique([
    ...readTextList(currentLongitudinalState, ["functionalChanges", "functional_changes"]),
    ...readTextList(mostRecentEvent, ["functionalChanges", "functional_changes"]),
  ]);

  const normalizedSignals = normalizeSignalText(
    [
      progressionStatus,
      latestCurrentDominantBarrier,
      reasonTreatmentChanged,
      medicalChange,
      attentionStatement,
      ...attentionDrivers,
      ...functionalChanges,
    ].join(" ")
  );

  const hasRegressionOrDecline =
    normalizedSignals.includes("regression") || normalizedSignals.includes("declin");
  const hasSafetyReviewSignal =
    hasMeaningfulMedicalChange(medicalChange) || includesSafetyReviewSignal(normalizedSignals);
  const reassessmentRecommended =
    readBoolean(clinicalAttentionState, ["reassessmentRecommended", "reassessment_recommended"]) === true ||
    readBoolean(currentLongitudinalState, ["reassessmentRecommended", "reassessment_recommended"]) === true ||
    readBoolean(mostRecentEvent, ["reassessmentRecommended", "reassessment_recommended"]) === true ||
    hasRegressionOrDecline ||
    hasSafetyReviewSignal;
  const treatmentDirectionChanged =
    readBoolean(currentLongitudinalState, ["treatmentDirectionChanged", "treatment_direction_changed"]) ===
      true ||
    readBoolean(mostRecentEvent, ["treatmentDirectionChanged", "treatment_direction_changed"]) === true;
  const requiresOperationalReview =
    readBoolean(clinicalAttentionState, ["requiresOperationalReview", "requires_operational_review"]) ===
      true || treatmentDirectionChanged;
  const safetyOrRegressionText = [
    latestCurrentDominantBarrier || "",
    attentionStatement || "",
    ...attentionDrivers,
    ...functionalChanges,
  ];
  const progressionReadiness = buildProgressionReadiness({
    progressionStatus,
    milestoneAchieved,
    functionalChanges,
    advancementReadiness,
    reassessmentRecommended,
    requiresOperationalReview,
    medicalChange,
    safetyOrRegressionText,
  });
  const reconciledReassessmentTriggers = reconcileReassessmentTriggers({
    operationalReassessmentTriggers: operationalPrioritization?.reassessmentTriggers,
    progressionReassessmentTriggers: progressionState?.reassessmentTriggers,
    latestProgressionStatus: progressionStatus,
    latestMilestoneAchieved: milestoneAchieved,
    latestFunctionalChanges: functionalChanges,
    clinicalAttentionState,
    progressionReadiness,
    treatmentDirectionChanged,
    reassessmentRecommended,
    medicalChange,
    currentSafetyOrRegressionSignals: safetyOrRegressionText,
  });
  const reconciledBarriers = reconcileBarriers({
    activeBarriers: progressionState?.activeBarriers,
    dominantBarriers: operationalPrioritization?.dominantBarriers,
    currentLimitingFactor: latestCurrentDominantBarrier,
    progressionStatus,
    milestoneAchieved,
    functionalChanges,
    progressionReadiness,
    clinicalAttentionState,
    currentSafetyOrRegressionSignals: [attentionStatement || "", ...attentionDrivers, ...functionalChanges],
    medicalChange,
    treatmentDirectionChanged,
  });
  const activityConstraint = reconcileActivityConstraint({
    currentDominantBarrier:
      latestCurrentDominantBarrier ||
      reconciledBarriers.dominantBarrier ||
      operationalPrioritization?.dominantBarriers?.[0],
    primaryTargetActivity,
    functionalChanges,
    milestoneAchieved,
    progressionStatus,
    progressionReadiness,
    reconciledBarrierState: reconciledBarriers,
    currentSafetyOrRegressionSignals: safetyOrRegressionText,
    medicalChange,
    reassessmentRecommended,
    treatmentDirectionChanged,
    caregiverChange: readText(currentLongitudinalState, ["caregiverChange", "caregiver_change"]),
    environmentalChange: readText(currentLongitudinalState, [
      "environmentalChange",
      "environmental_change",
    ]),
  });
  const remainingEligibleBarrier = reconciledBarriers.activeBarriers.find(
    (barrier) => !textMentionsBarrier(barrier, activityConstraint.barrier),
  );
  const effectiveDominantBarrier = activityConstraint.blockingWeightEligible
    ? reconciledBarriers.dominantBarrier
    : remainingEligibleBarrier || null;
  const monitoringBarrier = reconciledBarriers.monitoringBarriers[0] || null;

  const newerClinicalMeaningActive = reassessmentRecommended || requiresOperationalReview;
  const generatedPlanActions = structuredPlanDetails?.immediateActions || [];
  const staleGeneratedPlanActionsSuppressed = newerClinicalMeaningActive && generatedPlanActions.length > 0;

  const safetyAction = effectiveDominantBarrier
    ? `Reassess safety and current function around ${effectiveDominantBarrier} before advancing or continuing the prior plan.`
    : "Reassess safety and current function before advancing or continuing the prior plan.";
  const focusReviewAction = reasonTreatmentChanged
    ? `Review treatment focus because ${reasonTreatmentChanged}.`
    : effectiveDominantBarrier
    ? `Review treatment focus around ${effectiveDominantBarrier} before relying on prior plan actions.`
    : "Review treatment focus before relying on prior plan actions.";
  const monitoringContext = activityConstraint.blockingWeightEligible
    ? deriveMonitoringContext(
        monitoringBarrier,
        effectiveDominantBarrier,
        primaryTargetActivity,
        operationalPrioritization?.currentOperationalEmphasis,
      )
    : deriveBarrierMonitoringContext(activityConstraint.barrier, primaryTargetActivity);
  const readinessEvaluationAction =
    `Evaluate readiness for progression while continuing ${monitoringContext} monitoring.`;
  const emergingReadinessAction =
    `Continue ${monitoringContext} monitoring and monitor whether improving consistency is sustained.`;
  const hasRefreshedOperationalPrioritization = isRecord(
    operationalPrioritization?.longitudinalRefresh
  );
  const shouldElevateOperationalPrioritization =
    newerClinicalMeaningActive || hasRefreshedOperationalPrioritization || generatedPlanActions.length === 0;
  const operationalEmphasisIsEligible =
    activityConstraint.blockingWeightEligible ||
    !textMentionsBarrier(
      operationalPrioritization?.currentOperationalEmphasis || "",
      activityConstraint.barrier,
    );
  const operationalEmphasisAction = shouldElevateOperationalPrioritization && operationalEmphasisIsEligible
    ? operationalPrioritization?.currentOperationalEmphasis
      ? `Use the current operational focus: ${operationalPrioritization.currentOperationalEmphasis}`
      : effectiveDominantBarrier
      ? `Reorient treatment around ${effectiveDominantBarrier}.`
      : null
    : null;

  const prioritizedActions = [
    ...(reassessmentRecommended ? [safetyAction] : []),
    ...(treatmentDirectionChanged ? [focusReviewAction] : []),
    ...(progressionReadiness === "ready_for_evaluation" ? [readinessEvaluationAction] : []),
    ...(progressionReadiness === "emerging" ? [emergingReadinessAction] : []),
    ...(requiresOperationalReview && !treatmentDirectionChanged ? [focusReviewAction] : []),
    ...reconciledReassessmentTriggers.activeTriggers
      .filter(
        (trigger) =>
          activityConstraint.blockingWeightEligible ||
          !textMentionsBarrier(trigger, activityConstraint.barrier),
      )
      .map((trigger) => `Reassess if ${trigger}.`),
    ...(operationalEmphasisAction ? [operationalEmphasisAction] : []),
    ...(attentionStatement ? [attentionStatement] : []),
    ...attentionDrivers.map((driver) => `Monitor ${driver}.`),
    ...(newerClinicalMeaningActive ? [] : generatedPlanActions),
    ...(newerClinicalMeaningActive
      ? generatedPlanActions.map((action) => `Prior plan action to reconsider: ${action}`)
      : []),
  ];

  const actionsBeforeTriggerMonitoring = compressNextActionList(prioritizedActions, limit);
  const monitoringActions = [
    ...(!activityConstraint.blockingWeightEligible && activityConstraint.barrier
      ? [`Continue monitoring ${deriveBarrierMonitoringContext(activityConstraint.barrier, primaryTargetActivity)}.`]
      : []),
    ...reconciledBarriers.monitoringBarriers.map(
      (barrier) => `Continue monitoring ${deriveMonitoringContext(barrier)}.`,
    ),
    ...reconciledReassessmentTriggers.monitoringTriggers.map(
      (trigger) => `Continue monitoring for ${trigger}.`,
    ),
  ];
  const actions =
    actionsBeforeTriggerMonitoring.length > 0
      ? compressNextActionList(
          [actionsBeforeTriggerMonitoring[0], ...monitoringActions, ...actionsBeforeTriggerMonitoring.slice(1)],
          limit
        )
      : actionsBeforeTriggerMonitoring;

  return {
    primaryAction: actions[0] || "Continue current focus. Update progression when new findings are available.",
    supportingActions: actions.slice(1),
    actions,
    staleGeneratedPlanActionsSuppressed,
  };
}
