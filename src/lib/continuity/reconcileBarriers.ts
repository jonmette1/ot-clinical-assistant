import type { ProgressionReadiness } from "@/lib/progression/buildProgressionReadiness";

export type ReconcileBarriersInput = {
  activeBarriers?: string[] | null;
  dominantBarriers?: string[] | null;
  currentLimitingFactor?: string | null;
  progressionStatus?: string | null;
  milestoneAchieved?: string | null;
  functionalChanges?: string[] | string | null;
  progressionReadiness?: ProgressionReadiness | null;
  clinicalAttentionState?: unknown;
  currentSafetyOrRegressionSignals?: string[] | string | null;
  medicalChange?: string | null;
  treatmentDirectionChanged?: boolean | null;
};

export type ReconciledBarriers = {
  activeBarriers: string[];
  monitoringBarriers: string[];
  resolvedBarriers: string[];
  dominantBarrier: string | null;
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
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  return typeof value === "string" && value.trim() ? [value.trim()] : [];
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
      /\b(?:no|not|without|denies?|denied)\s+(?:current\s+|new\s+|recent\s+|reported\s+|documented\s+|additional\s+|further\s+|any\s+)*(?:falls?|near\s*falls?|injur(?:y|ies)|unsafe\s+(?:transfer|mobility|performance)|loss of balance)(?:\s+(?:or|and)\s+(?:falls?|near\s*falls?|injur(?:y|ies)))?\b/g,
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

const hasRegression = (text: string): boolean =>
  /\b(regression|regressed|decline|declined|declining|deterioration|deteriorating|worse|worsening|loss of (?:function|consistency)|lost (?:function|consistency))\b/.test(
    text,
  );

const hasWorseningFunctionalChange = (text: string): boolean =>
  hasRegression(text) ||
  /\b(unsafe|increased (?:assistance|cueing|support)|more (?:assistance|cueing|support)|new (?:fall|near fall|injury)|less consistent|loss of consistency|unresolved|remains? (?:a |an )?(?:hazard|barrier|limitation|unsafe))\b/.test(
    stripNegatedSafetyEvents(text),
  );

const hasPositiveProgression = (status: string): boolean =>
  status.includes("progressing as expected") ||
  status.includes("progressing faster than expected") ||
  status.includes("improv");

const hasExplicitImprovement = (text: string): boolean =>
  /\b(improv(?:e|ed|ement|ing)|better|more consistent|improved consistency|reduced (?:assistance|cueing|caregiver support|support requirement)|less (?:assistance|cueing|caregiver support)|decreased (?:assistance|cueing|caregiver support)|completed? (?:a |the )?(?:transfer|transfers)|independent(?:ly)?|safe(?:ly)? completed|improved safety|hazard (?:corrected|removed|resolved)|barrier (?:corrected|removed|resolved))\b/.test(
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

const domainTerms = [
  ["transfer", "mobility", "sit to stand", "bed", "toilet", "shower"],
  ["caregiver", "support", "training", "cueing"],
  ["environment", "environmental", "hazard", "equipment", "grab bar", "stairs", "setup"],
  ["balance", "stability", "fall", "safety", "unsafe"],
  ["bath", "bathing", "shower"],
  ["toilet", "toileting"],
  ["pain", "injury", "medical", "wound"],
  ["cognition", "cognitive", "sequencing", "memory"],
];

const significantWords = (value: string): string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(
      (word) =>
        word.length >= 4 &&
        ![
          "active",
          "barrier",
          "current",
          "limitation",
          "limited",
          "requirement",
          "significant",
          "performance",
          "functional",
          "remains",
        ].includes(word),
    );

const isRelated = (barrier: string, evidence: string): boolean => {
  const normalizedBarrier = normalize(barrier);
  const normalizedEvidence = normalize(evidence);
  if (!normalizedBarrier || !normalizedEvidence) return false;
  if (
    normalizedBarrier.includes(normalizedEvidence) ||
    normalizedEvidence.includes(normalizedBarrier)
  ) {
    return true;
  }

  const barrierWords = significantWords(normalizedBarrier);
  const evidenceWords = new Set(significantWords(normalizedEvidence));
  if (barrierWords.some((word) => evidenceWords.has(word))) return true;

  return domainTerms.some(
    (terms) =>
      terms.some((term) => normalizedBarrier.includes(term)) &&
      terms.some((term) => normalizedEvidence.includes(term)),
  );
};

const isSafetyRelevantBarrier = (barrier: string): boolean =>
  /\b(safety|unsafe|fall|balance|stability|transfer|mobility|injur)\b/.test(
    normalize(barrier),
  );

export function reconcileBarriers({
  activeBarriers,
  dominantBarriers,
  currentLimitingFactor,
  progressionStatus,
  milestoneAchieved,
  functionalChanges,
  progressionReadiness,
  clinicalAttentionState,
  currentSafetyOrRegressionSignals,
  medicalChange,
  treatmentDirectionChanged,
}: ReconcileBarriersInput): ReconciledBarriers {
  const barriers = uniqueStrings([
    ...asTextList(activeBarriers),
    ...asTextList(dominantBarriers),
  ]);

  if (barriers.length === 0) {
    return {
      activeBarriers: [],
      monitoringBarriers: [],
      resolvedBarriers: [],
      dominantBarrier: null,
    };
  }

  const status = normalize(progressionStatus);
  const milestone = normalize(milestoneAchieved);
  const changes = asTextList(functionalChanges).map(normalize);
  const limitingFactor = normalize(currentLimitingFactor);
  const medical = normalize(medicalChange);
  const attentionCategory = normalize(
    readText(clinicalAttentionState, ["category", "attentionCategory", "attention_category"]),
  );
  const attentionStatement = normalize(
    readText(clinicalAttentionState, ["attentionStatement", "attention_statement"]),
  );
  const attentionDrivers = readTextList(clinicalAttentionState, [
    "attentionDrivers",
    "attention_drivers",
  ]).map(normalize);
  const currentSignals = asTextList(currentSafetyOrRegressionSignals).map(normalize);
  const evidenceItems = [milestone, ...changes].filter(Boolean);
  const negativeItems = [
    status,
    ...changes,
    ...currentSignals,
    attentionStatement,
    ...attentionDrivers,
  ].filter(Boolean);
  const negativeText = negativeItems.join(" ");

  const regressionDetected = hasRegression(status) || hasRegression(negativeText);
  const currentSafetyEvent = hasCurrentSafetyEvent(negativeText);
  const currentMedicalChange =
    hasMeaningfulMedicalChange(medical) ||
    (attentionCategory === "medical" && hasMeaningfulMedicalChange(attentionStatement));
  const reassessmentRecommended =
    readBoolean(clinicalAttentionState, [
      "reassessmentRecommended",
      "reassessment_recommended",
    ]) === true;
  const positiveProgression = hasPositiveProgression(status);
  const readinessSupportsMonitoring =
    progressionReadiness === "emerging" ||
    progressionReadiness === "ready_for_evaluation";

  const reconciled = barriers.map((barrier) => {
    const limitingFactorMatches = isRelated(barrier, limitingFactor);
    const relatedNegativeEvidence = negativeItems.some(
      (item) => isRelated(barrier, item) && hasWorseningFunctionalChange(item),
    );
    const safetyReinforcesBarrier =
      currentSafetyEvent && (isSafetyRelevantBarrier(barrier) || isRelated(barrier, negativeText));
    const medicalReinforcesBarrier =
      currentMedicalChange &&
      (isSafetyRelevantBarrier(barrier) || isRelated(barrier, `${medical} ${attentionStatement}`));
    const clinicianConfirmedCurrentBarrier =
      treatmentDirectionChanged === true && limitingFactorMatches;
    const activeOverride =
      regressionDetected ||
      reassessmentRecommended ||
      relatedNegativeEvidence ||
      limitingFactorMatches ||
      safetyReinforcesBarrier ||
      medicalReinforcesBarrier ||
      clinicianConfirmedCurrentBarrier;

    if (activeOverride) return { barrier, disposition: "active" as const };

    const relatedImprovementEvidence = evidenceItems.some(
      (item) => isRelated(barrier, item) && hasExplicitImprovement(item),
    );
    const milestoneSupportsBarrier = Boolean(milestone) && isRelated(barrier, milestone);

    if (
      progressionReadiness === "ready_for_evaluation" &&
      relatedImprovementEvidence &&
      !isSafetyRelevantBarrier(barrier)
    ) {
      return { barrier, disposition: "resolved" as const };
    }

    if (
      positiveProgression &&
      readinessSupportsMonitoring &&
      (relatedImprovementEvidence || milestoneSupportsBarrier || isSafetyRelevantBarrier(barrier))
    ) {
      return { barrier, disposition: "monitoring" as const };
    }

    return { barrier, disposition: "active" as const };
  });

  const reconciledActiveBarriers = reconciled
    .filter(({ disposition }) => disposition === "active")
    .map(({ barrier }) => barrier);
  const monitoringBarriers = reconciled
    .filter(({ disposition }) => disposition === "monitoring")
    .map(({ barrier }) => barrier);
  const resolvedBarriers = reconciled
    .filter(({ disposition }) => disposition === "resolved")
    .map(({ barrier }) => barrier);
  const dominantBarrier =
    asTextList(dominantBarriers).find((barrier) => reconciledActiveBarriers.includes(barrier)) ||
    reconciledActiveBarriers[0] ||
    null;

  return {
    activeBarriers: reconciledActiveBarriers,
    monitoringBarriers,
    resolvedBarriers,
    dominantBarrier,
  };
}
