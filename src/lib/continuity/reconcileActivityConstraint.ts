import type { ReconciledBarriers } from "@/lib/continuity/reconcileBarriers";
import type { ProgressionReadiness } from "@/lib/progression/buildProgressionReadiness";

export type ActivityConstraintRelevance =
  | "constraining"
  | "monitor_only"
  | "not_currently_constraining";

export type ReconcileActivityConstraintInput = {
  currentDominantBarrier?: string | null;
  primaryTargetActivity?: string | null;
  functionalChanges?: string[] | string | null;
  milestoneAchieved?: string | null;
  progressionStatus?: string | null;
  progressionReadiness?: ProgressionReadiness | null;
  reconciledBarrierState?: ReconciledBarriers | null;
  currentSafetyOrRegressionSignals?: string[] | string | null;
  medicalChange?: string | null;
  reassessmentRecommended?: boolean | null;
  treatmentDirectionChanged?: boolean | null;
  caregiverChange?: string | null;
  environmentalChange?: string | null;
};

export type ReconciledActivityConstraint = {
  relevance: ActivityConstraintRelevance;
  barrier: string | null;
  targetActivity: string | null;
  blockingWeightEligible: boolean;
  evidence: string[];
  reason: string;
};

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

const unique = (items: string[]): string[] => Array.from(new Set(items.filter(Boolean)));

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

const hasCurrentSafetyOrRegression = (text: string): boolean =>
  /\b(regression|regressed|decline|declined|declining|deteriorat(?:ion|ing)|worse|worsening|fell|falls?|near\s*falls?|injur(?:y|ies)|injured|unsafe|loss of balance|increased (?:assistance|cueing|support)|more (?:assistance|cueing|support)|less consistent|loss of consistency|lost consistency)\b/.test(
    stripNegatedSafetyEvents(text),
  );

const hasMeaningfulMedicalChange = (value: string | null | undefined): boolean => {
  const normalized = normalize(value);
  return (
    Boolean(normalized) &&
    ![
      "none",
      "no",
      "no change",
      "no medical change",
      "unchanged",
      "not applicable",
      "n/a",
    ].includes(normalized)
  );
};

const activityAliases = (activity: string): string[] => {
  const normalized = normalize(activity);
  const aliases = [normalized];

  if (/(toilet|toileting)/.test(normalized)) {
    aliases.push("toilet", "toileting", "toilet transfer", "bathroom transfer");
  }
  if (/(shower|bath|bathing)/.test(normalized)) {
    aliases.push("shower", "bathing", "shower transfer", "bathroom transfer");
  }
  if (/(transfer|mobility)/.test(normalized)) {
    aliases.push("transfer", "transfers", "mobility");
  }
  if (/(dress|dressing)/.test(normalized)) aliases.push("dress", "dressing");
  if (/(stand|standing)/.test(normalized)) aliases.push("stand", "standing");

  return unique(aliases.filter((alias) => alias.length >= 4));
};

const barrierAliases = (barrier: string): string[] => {
  const normalized = normalize(barrier);
  const aliases = [normalized];

  for (const term of [
    "pain",
    "balance",
    "weakness",
    "strength",
    "fatigue",
    "endurance",
    "cueing",
    "cognition",
    "caregiver",
    "environment",
    "equipment",
    "safety",
  ]) {
    if (normalized.includes(term)) aliases.push(term);
  }

  return unique(aliases.filter((alias) => alias.length >= 4));
};

const includesAny = (text: string, terms: string[]): boolean =>
  terms.some((term) => text.includes(term));

const splitEvidenceClauses = (value: string): string[] =>
  normalize(value)
    .split(/[.;]|\bbut\b|\bhowever\b|\bwhile\b/)
    .map((clause) => clause.trim())
    .filter(Boolean);

const isActivityLinked = (value: string, targetAliases: string[]): boolean =>
  includesAny(normalize(value), targetAliases);

const hasExplicitActivityConstraint = (
  value: string,
  targetAliases: string[],
  barrierTerms: string[],
): boolean =>
  splitEvidenceClauses(value).some((clause) => {
    const activityLinked = includesAny(clause, targetAliases);
    const barrierLinked = includesAny(clause, barrierTerms);
    const negatedConstraint =
      /\b(?:no longer|does not|doesn't|not currently)\s+(?:appear to )?(?:limit|limits|limiting|constrain|constrains|constraining|interfere)\b/.test(
        clause,
      );
    const limitingLanguage =
      /\b(limit(?:s|ed|ing)?|constrain(?:s|ed|ing)?|prevent(?:s|ed|ing)?|interfer(?:e|es|ed|ing)|unable|cannot|can't|difficulty|restricted|remains? (?:the )?(?:primary |main )?(?:barrier|limitation|constraint)|continues? to (?:limit|constrain|interfere))\b/.test(
        clause,
      );

    return activityLinked && barrierLinked && limitingLanguage && !negatedConstraint;
  });

const hasPositiveProgression = (status: string): boolean =>
  /\b(progressing|improv(?:e|ed|ement|ing)|better|faster than expected)\b/.test(status);

const hasGenericImprovement = (text: string): boolean =>
  /\b(doing better|improv(?:e|ed|ement|ing)|progress(?:ing|ed)?|better)\b/.test(text);

const hasActivityImprovement = (value: string, targetAliases: string[]): boolean =>
  splitEvidenceClauses(value).some(
    (clause) =>
      includesAny(clause, targetAliases) &&
      /\b(improv(?:e|ed|ement|ing)|better|progress(?:ing|ed)?|reduced|less (?:assistance|cueing|support)|increased independence|more consistent|improved consistency|improved safety|safer|completed?|performs?)\b/.test(
        clause,
      ),
  );

const hasResidualInconsistency = (value: string, targetAliases: string[]): boolean =>
  splitEvidenceClauses(value).some(
    (clause) =>
      includesAny(clause, targetAliases) &&
      /\b(still inconsistent|inconsistent|variable|not consistent|requires? (?:intermittent )?(?:assistance|cueing)|continues? to require (?:assistance|cueing)|monitor(?:ing)? required)\b/.test(
        clause,
      ),
  );

const hasStrongReducedConstraintEvidence = (
  value: string,
  targetAliases: string[],
): boolean =>
  splitEvidenceClauses(value).some(
    (clause) =>
      includesAny(clause, targetAliases) &&
      /\b(supervision(?: level| only|-level)?|independent setup|setup independently|independent(?:ly)?|less assistance|reduced assistance|without physical assistance|less cueing|reduced cueing|improved consistency|consistently|improved safety|safe(?:ly)?|no longer limit(?:s|ing|ed)?|no longer constrain(?:s|ing|ed)?)\b/.test(
        clause,
      ),
  );

const result = ({
  relevance,
  barrier,
  targetActivity,
  evidence,
  reason,
}: {
  relevance: ActivityConstraintRelevance;
  barrier: string | null;
  targetActivity: string | null;
  evidence: string[];
  reason: string;
}): ReconciledActivityConstraint => ({
  relevance,
  barrier,
  targetActivity,
  blockingWeightEligible: relevance === "constraining",
  evidence: unique(evidence),
  reason,
});

export function reconcileActivityConstraint({
  currentDominantBarrier,
  primaryTargetActivity,
  functionalChanges,
  milestoneAchieved,
  progressionStatus,
  progressionReadiness,
  reconciledBarrierState,
  currentSafetyOrRegressionSignals,
  medicalChange,
  reassessmentRecommended,
  treatmentDirectionChanged,
  caregiverChange,
  environmentalChange,
}: ReconcileActivityConstraintInput): ReconciledActivityConstraint {
  const barrier = currentDominantBarrier?.trim() || null;
  const targetActivity = primaryTargetActivity?.trim() || null;
  const changes = asTextList(functionalChanges);
  const safetySignals = asTextList(currentSafetyOrRegressionSignals);
  const contextualEvidence = [caregiverChange, environmentalChange].filter(
    (item): item is string => Boolean(item?.trim()),
  );
  const evidenceItems = unique([
    ...changes,
    ...(milestoneAchieved ? [milestoneAchieved] : []),
    ...safetySignals,
    ...contextualEvidence,
  ]);

  if (!barrier || !targetActivity) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: evidenceItems,
      reason: "Barrier or target activity evidence is incomplete, so blocking authority is preserved.",
    });
  }

  const targetAliases = activityAliases(targetActivity);
  const barrierTerms = barrierAliases(barrier);
  const normalizedStatus = normalize(progressionStatus);
  const combinedSafetyText = normalize([progressionStatus, ...safetySignals, ...changes].join(" "));
  const currentSafetyOrRegression = hasCurrentSafetyOrRegression(combinedSafetyText);

  if (currentSafetyOrRegression) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: evidenceItems,
      reason: "Current safety, regression, worsening assistance, cueing, or consistency evidence preserves the constraint.",
    });
  }

  if (hasMeaningfulMedicalChange(medicalChange) || reassessmentRecommended === true) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: unique([...evidenceItems, ...(medicalChange ? [medicalChange] : [])]),
      reason: "A current medical or reassessment override prevents activity-specific de-escalation.",
    });
  }

  const explicitConstraintEvidence = evidenceItems.filter((item) =>
    hasExplicitActivityConstraint(item, targetAliases, barrierTerms),
  );
  if (explicitConstraintEvidence.length > 0) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: explicitConstraintEvidence,
      reason: "Current evidence explicitly links the barrier to limitation of the target activity.",
    });
  }

  if (treatmentDirectionChanged === true) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: evidenceItems,
      reason: "The clinician-selected dominant barrier remains constraining after a treatment-direction change.",
    });
  }

  const linkedMilestone =
    Boolean(milestoneAchieved) && isActivityLinked(milestoneAchieved || "", targetAliases);
  const linkedImprovement = evidenceItems.some((item) =>
    hasActivityImprovement(item, targetAliases),
  );
  const residualInconsistency = evidenceItems.some((item) =>
    hasResidualInconsistency(item, targetAliases),
  );
  const strongReducedConstraintEvidence = evidenceItems.some((item) =>
    hasStrongReducedConstraintEvidence(item, targetAliases),
  );
  const positiveProgression =
    hasPositiveProgression(normalizedStatus) || linkedMilestone || linkedImprovement;
  const barrierIsMonitoring = reconciledBarrierState?.monitoringBarriers.some(
    (item) => normalize(item) === normalize(barrier),
  );
  const genericImprovementOnly =
    evidenceItems.some((item) => hasGenericImprovement(normalize(item))) &&
    !linkedMilestone &&
    !linkedImprovement;

  if (
    positiveProgression &&
    progressionReadiness === "ready_for_evaluation" &&
    (linkedMilestone || linkedImprovement) &&
    strongReducedConstraintEvidence &&
    !residualInconsistency
  ) {
    return result({
      relevance: "not_currently_constraining",
      barrier,
      targetActivity,
      evidence: evidenceItems.filter(
        (item) =>
          isActivityLinked(item, targetAliases) &&
          (hasActivityImprovement(item, targetAliases) ||
            hasStrongReducedConstraintEvidence(item, targetAliases)),
      ),
      reason: "Activity-linked gains and evaluation readiness reduce the barrier's blocking authority for the current target activity.",
    });
  }

  if (
    positiveProgression &&
    (linkedMilestone || linkedImprovement || barrierIsMonitoring) &&
    (residualInconsistency || progressionReadiness === "emerging" || barrierIsMonitoring)
  ) {
    return result({
      relevance: "monitor_only",
      barrier,
      targetActivity,
      evidence: evidenceItems.filter((item) => isActivityLinked(item, targetAliases)),
      reason: "The target activity is improving, but residual consistency or confirmation needs support continued monitoring.",
    });
  }

  if (genericImprovementOnly) {
    return result({
      relevance: "constraining",
      barrier,
      targetActivity,
      evidence: evidenceItems,
      reason: "Generic improvement is not activity-linked evidence and is insufficient to reduce blocking authority.",
    });
  }

  if (positiveProgression && (linkedMilestone || linkedImprovement)) {
    return result({
      relevance: "monitor_only",
      barrier,
      targetActivity,
      evidence: evidenceItems.filter((item) => isActivityLinked(item, targetAliases)),
      reason: "Activity-linked improvement is present, but evidence is not strong enough to remove the constraint.",
    });
  }

  return result({
    relevance: "constraining",
    barrier,
    targetActivity,
    evidence: evidenceItems,
    reason: "Evidence is insufficient to safely de-escalate the existing barrier–activity relationship.",
  });
}
