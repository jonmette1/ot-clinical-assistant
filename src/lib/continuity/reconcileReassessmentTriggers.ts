import type { ProgressionReadiness } from "@/lib/progression/buildProgressionReadiness";

export type ReconcileReassessmentTriggersInput = {
  operationalReassessmentTriggers?: string[] | null;
  progressionReassessmentTriggers?: string[] | null;
  latestProgressionStatus?: string | null;
  latestMilestoneAchieved?: string | null;
  latestFunctionalChanges?: string[] | string | null;
  clinicalAttentionState?: unknown;
  progressionReadiness?: ProgressionReadiness | null;
  treatmentDirectionChanged?: boolean | null;
  reassessmentRecommended?: boolean | null;
  medicalChange?: string | null;
  currentSafetyOrRegressionSignals?: string[] | string | null;
};

export type ReconciledReassessmentTriggers = {
  activeTriggers: string[];
  monitoringTriggers: string[];
  clearedTriggers: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalize = (value: string | null | undefined): string =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

const asTextList = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value))
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const readText = (source: unknown, keys: string[]): string | null => {
  if (!isRecord(source)) return null;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
};

const readTextList = (source: unknown, keys: string[]): string[] => {
  if (!isRecord(source)) return [];

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }

  return [];
};

const readBoolean = (source: unknown, keys: string[]): boolean | null => {
  if (!isRecord(source)) return null;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = normalize(value);
      if (normalized === "true" || normalized === "yes") return true;
      if (normalized === "false" || normalized === "no") return false;
    }
  }

  return null;
};

const uniqueStrings = (values: Array<string | null | undefined>): string[] =>
  Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );

const stripNegatedSafetyEvents = (text: string): string =>
  text
    .replace(
      /\b(?:no|not|without|denies?|denied)\s+(?:current\s+|new\s+|recent\s+|reported\s+|documented\s+|additional\s+|further\s+|any\s+)*(?:falls?|near\s*falls?|near\s+falls?|injur(?:y|ies)|unsafe\s+(?:transfer|mobility|performance))(?:\s+(?:or|and)\s+(?:falls?|near\s*falls?|near\s+falls?|injur(?:y|ies)))?\b/g,
      " ",
    )
    .replace(
      /\b(?:falls?|near\s*falls?|injur(?:y|ies))\s+(?:did not|didn't|has not|hasn't)\s+occur\b/g,
      " ",
    );

const hasCurrentSafetyEvent = (text: string): boolean =>
  /\b(fell|falls?|near\s*falls?|injur(?:y|ies)|injured|unsafe\s+(?:transfer|mobility|performance)|loss of balance|hospital(?:ization|ized)?|emergency|er visit)\b/.test(
    stripNegatedSafetyEvents(text),
  );

const hasCurrentWorsening = (text: string): boolean =>
  /\b(regression|regressed|decline|declined|declining|deterioration|deteriorating|worse|worsening|loss of (?:function|consistency)|lost (?:function|consistency)|less consistent|less reliable|increased assistance|new caregiver concern|caregiver concern|new environmental concern|environmental concern)\b/.test(
    text,
  );

const hasMeaningfulMedicalChange = (medicalChange: string): boolean =>
  Boolean(medicalChange) &&
  ![
    "none",
    "no",
    "no change",
    "no medical change",
    "unchanged",
    "not applicable",
    "n/a",
  ].includes(medicalChange);

const hasPositiveProgression = (status: string): boolean =>
  status.includes("progressing as expected") ||
  status.includes("progressing faster than expected") ||
  status.includes("improv");

const hasStableProgression = (status: string): boolean =>
  status.includes("stable") || status.includes("maintain");

const isHistoricalOrConditionalTrigger = (trigger: string): boolean =>
  /\b(history|historical|prior|previous|if|when|occurrence|recurrence|monitor|unresolved|stale|risk|requires? (?:review|reassessment)|trigger)\b/.test(
    trigger,
  );

const isHistoricalSafetyTrigger = (trigger: string): boolean =>
  isHistoricalOrConditionalTrigger(trigger) &&
  /\b(fall|near\s*fall|injur|unsafe|safety|medical|hospital|emergency|wound|pain)\b/.test(
    trigger,
  );

export function reconcileReassessmentTriggers({
  operationalReassessmentTriggers,
  progressionReassessmentTriggers,
  latestProgressionStatus,
  latestMilestoneAchieved,
  latestFunctionalChanges,
  clinicalAttentionState,
  progressionReadiness,
  treatmentDirectionChanged,
  reassessmentRecommended,
  medicalChange,
  currentSafetyOrRegressionSignals,
}: ReconcileReassessmentTriggersInput): ReconciledReassessmentTriggers {
  const triggers = uniqueStrings([
    ...asTextList(operationalReassessmentTriggers),
    ...asTextList(progressionReassessmentTriggers),
  ]);

  if (triggers.length === 0) {
    return { activeTriggers: [], monitoringTriggers: [], clearedTriggers: [] };
  }

  const status = normalize(latestProgressionStatus);
  const milestone = normalize(latestMilestoneAchieved);
  const attentionCategory = normalize(
    readText(clinicalAttentionState, [
      "category",
      "attentionCategory",
      "attention_category",
    ]),
  );
  const attentionStatement = readText(clinicalAttentionState, [
    "attentionStatement",
    "attention_statement",
  ]);
  const attentionDrivers = readTextList(clinicalAttentionState, [
    "attentionDrivers",
    "attention_drivers",
  ]);
  const currentSignalText = normalize(
    [
      ...asTextList(latestFunctionalChanges),
      ...asTextList(currentSafetyOrRegressionSignals),
      attentionStatement,
      ...attentionDrivers,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const currentReassessmentRecommended =
    reassessmentRecommended === true ||
    readBoolean(clinicalAttentionState, [
      "reassessmentRecommended",
      "reassessment_recommended",
    ]) === true;
  const currentMedicalChange = normalize(medicalChange);
  const currentUrgentSignal =
    status.includes("regression") ||
    hasCurrentWorsening(currentSignalText) ||
    hasCurrentSafetyEvent(currentSignalText) ||
    hasMeaningfulMedicalChange(currentMedicalChange) ||
    attentionCategory === "medical" ||
    attentionCategory === "safety" ||
    currentReassessmentRecommended;

  if (currentUrgentSignal) {
    return {
      activeTriggers: triggers,
      monitoringTriggers: [],
      clearedTriggers: [],
    };
  }

  const hasLongitudinalEvidence = Boolean(
    status || milestone || currentSignalText || treatmentDirectionChanged === true,
  );
  const positiveOrStableProgression =
    hasPositiveProgression(status) || hasStableProgression(status);
  const readinessSupportsReview =
    progressionReadiness === "emerging" ||
    progressionReadiness === "ready_for_evaluation";
  const improvedTrajectorySupportsClearing =
    (hasPositiveProgression(status) || Boolean(milestone)) &&
    readinessSupportsReview;

  const activeTriggers: string[] = [];
  const monitoringTriggers: string[] = [];
  const clearedTriggers: string[] = [];

  for (const trigger of triggers) {
    const normalizedTrigger = normalize(trigger);
    const historicalOrConditional =
      isHistoricalOrConditionalTrigger(normalizedTrigger);

    if (!hasLongitudinalEvidence || !historicalOrConditional) {
      activeTriggers.push(trigger);
      continue;
    }

    if (improvedTrajectorySupportsClearing) {
      clearedTriggers.push(trigger);
      continue;
    }

    if (
      isHistoricalSafetyTrigger(normalizedTrigger) &&
      positiveOrStableProgression
    ) {
      monitoringTriggers.push(trigger);
      continue;
    }

    if (historicalOrConditional) {
      monitoringTriggers.push(trigger);
      continue;
    }

    activeTriggers.push(trigger);
  }

  return { activeTriggers, monitoringTriggers, clearedTriggers };
}
