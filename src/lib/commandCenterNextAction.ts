import { compressNextActionList } from "@/lib/clinicalDisplayLanguage";

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
    reassessmentTriggers?: string[];
  } | null;
  clinicalAttentionState?: unknown;
  currentLongitudinalState?: unknown;
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

const includesSafetyReviewSignal = (signalText: string): boolean =>
  /\b(fall|falls|fell|injury|injuries|injured|wound|hospital|er|emergency|medical|pain|symptom|safety|unsafe|decline|declined|declining|regression)\b/.test(
    signalText
  );

export function buildCommandCenterNextActions({
  structuredPlanDetails,
  operationalPrioritization,
  progressionState,
  clinicalAttentionState,
  currentLongitudinalState,
  limit = 3,
}: CommandCenterNextActionInput): CommandCenterNextActionResult {
  const mostRecentEvent = getMostRecentEvent(currentLongitudinalState);
  const progressionStatus =
    readText(currentLongitudinalState, ["progressionStatus", "progression_status"]) ||
    readText(clinicalAttentionState, ["progressionStatus", "progression_status"]) ||
    readText(mostRecentEvent, ["progressionStatus", "progression_status"]);
  const currentDominantBarrier =
    readText(currentLongitudinalState, ["currentDominantBarrier", "current_dominant_barrier"]) ||
    readText(mostRecentEvent, ["currentDominantBarrier", "current_dominant_barrier"]) ||
    operationalPrioritization?.dominantBarriers?.[0] ||
    null;
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
      currentDominantBarrier,
      reasonTreatmentChanged,
      medicalChange,
      attentionStatement,
      ...attentionDrivers,
      ...functionalChanges,
    ].join(" ")
  );

  const hasRegressionOrDecline =
    normalizedSignals.includes("regression") || normalizedSignals.includes("declin");
  const hasSafetyReviewSignal = Boolean(medicalChange) || includesSafetyReviewSignal(normalizedSignals);
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

  const newerClinicalMeaningActive = reassessmentRecommended || requiresOperationalReview;
  const generatedPlanActions = structuredPlanDetails?.immediateActions || [];
  const staleGeneratedPlanActionsSuppressed = newerClinicalMeaningActive && generatedPlanActions.length > 0;

  const safetyAction = currentDominantBarrier
    ? `Reassess safety and current function around ${currentDominantBarrier} before advancing or continuing the prior plan.`
    : "Reassess safety and current function before advancing or continuing the prior plan.";
  const focusReviewAction = reasonTreatmentChanged
    ? `Review treatment focus because ${reasonTreatmentChanged}.`
    : currentDominantBarrier
    ? `Review treatment focus around ${currentDominantBarrier} before relying on prior plan actions.`
    : "Review treatment focus before relying on prior plan actions.";
  const hasRefreshedOperationalPrioritization = isRecord(
    operationalPrioritization?.longitudinalRefresh
  );
  const shouldElevateOperationalPrioritization =
    newerClinicalMeaningActive || hasRefreshedOperationalPrioritization || generatedPlanActions.length === 0;
  const operationalEmphasisAction = shouldElevateOperationalPrioritization
    ? operationalPrioritization?.currentOperationalEmphasis
      ? `Use the current operational focus: ${operationalPrioritization.currentOperationalEmphasis}`
      : currentDominantBarrier
      ? `Reorient treatment around ${currentDominantBarrier}.`
      : null
    : null;

  const prioritizedActions = [
    ...(reassessmentRecommended ? [safetyAction] : []),
    ...(requiresOperationalReview ? [focusReviewAction] : []),
    ...(operationalPrioritization?.reassessmentTriggers || []).map((trigger) => `Reassess if ${trigger}.`),
    ...(operationalEmphasisAction ? [operationalEmphasisAction] : []),
    ...(attentionStatement ? [attentionStatement] : []),
    ...attentionDrivers.map((driver) => `Monitor ${driver}.`),
    ...(progressionState?.reassessmentTriggers || []).map((trigger) => `Check progression if ${trigger}.`),
    ...(newerClinicalMeaningActive ? [] : generatedPlanActions),
    ...(newerClinicalMeaningActive
      ? generatedPlanActions.map((action) => `Prior plan action to reconsider: ${action}`)
      : []),
  ];

  const actions = compressNextActionList(prioritizedActions, limit);

  return {
    primaryAction: actions[0] || "Continue current focus. Update progression when new findings are available.",
    supportingActions: actions.slice(1),
    actions,
    staleGeneratedPlanActionsSuppressed,
  };
}
