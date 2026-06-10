export type ConstraintNarrativeItem = {
  label: string;
  explanation: string;
  clinicalImpact?: string;
  sourceContext?: string;
};

export type ConstraintProgressionNarrative = {
  headline: string;
  summary: string;
  unresolvedLimitation?: {
    label: string;
    explanation: string;
    clinicalImpact: string;
  };
  whatImproved: ConstraintNarrativeItem[];
  whatStillBlocksProgression: ConstraintNarrativeItem[];
  whyRecommendationRemainsAppropriate: string;
};

type BuildConstraintProgressionNarrativeInput = {
  clinicalDecisionModel?: unknown;
  progressionState?: unknown;
  continuityInterpretation?: unknown;
  longitudinalState?: unknown;
  visitHistory?: unknown;
  currentFocus?: string | null;
  attentionRequired?: string | null;
  nextAction?: string | null;
};

type RankedNarrativeItem = ConstraintNarrativeItem & {
  priority: number;
  sourceKey: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPath(source: unknown, path: string[]): unknown {
  let current = source;
  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function readFirst(source: unknown, paths: string[][]): unknown {
  for (const path of paths) {
    const value = readPath(source, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function asTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asText).filter((item): item is string => Boolean(item));
  }
  const text = asText(value);
  return text ? [text] : [];
}

function clinicianText(value: string): string {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value: string): string {
  return clinicianText(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCase(value: string): string {
  const text = clinicianText(value).replace(/[.]+$/, "");
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

function latestVisitRecords(visitHistory: unknown): Record<string, unknown>[] {
  if (!Array.isArray(visitHistory)) return [];
  return visitHistory.filter(isRecord).slice(0, 2);
}

function collectRecentValues(
  longitudinalState: unknown,
  visitHistory: unknown,
  paths: string[][]
): string[] {
  const values = [...asTextList(readFirst(longitudinalState, paths))];
  for (const visit of latestVisitRecords(visitHistory)) {
    values.push(
      ...asTextList(readFirst(visit, paths)),
      ...asTextList(readFirst(visit.event_payload, paths)),
      ...asTextList(readFirst(visit.current_state_snapshot, paths))
    );
  }
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function hasAny(text: string, terms: string[]): boolean {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(term));
}

function isImprovement(value: string): boolean {
  return hasAny(value, [
    "improv",
    "progress",
    "fewer cue",
    "less cue",
    "reduced assist",
    "less assist",
    "increased independence",
    "more independent",
    "reduced support",
    "less support",
    "resolved",
    "achieved",
    "met goal",
  ]);
}

function isSafetyOrRegression(value: string): boolean {
  return hasAny(value, [
    "fall",
    "near fall",
    "regress",
    "declin",
    "unsafe",
    "safety",
    "loss of function",
    "increased assist",
    "more assist",
    "worsen",
  ]);
}

function describeActivity(value: string): string {
  const normalized = normalize(value);
  if (normalized.includes("shower")) return "shower transfer";
  if (normalized.includes("toilet")) return "toilet transfer";
  if (normalized.includes("bed transfer")) return "bed transfer";
  if (normalized.includes("transfer")) return "transfer performance";
  if (normalized.includes("bathing")) return "bathing performance";
  if (normalized.includes("dressing")) return "dressing performance";
  if (normalized.includes("mobility")) return "functional mobility";
  return "target activity performance";
}

function uniqueRanked(items: RankedNarrativeItem[], limit: number): ConstraintNarrativeItem[] {
  const seen = new Set<string>();
  return items
    .sort((left, right) => right.priority - left.priority)
    .filter((item) => {
      const fingerprint = normalize(`${item.label}|${item.explanation}`);
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return true;
    })
    .slice(0, limit)
    .map((item) => ({
      label: item.label,
      explanation: item.explanation,
      clinicalImpact: item.clinicalImpact,
      sourceContext: item.sourceContext,
    }));
}

export function buildConstraintProgressionNarrative(
  input: BuildConstraintProgressionNarrativeInput
): ConstraintProgressionNarrative {
  const progressionState = input.progressionState;
  const longitudinalState = input.longitudinalState;
  const clinicalDecisionModel = input.clinicalDecisionModel;
  const continuityInterpretation = input.continuityInterpretation;

  const functionalChanges = collectRecentValues(longitudinalState, input.visitHistory, [
    ["functionalChanges"],
    ["functional_changes"],
  ]);
  const achievedMilestones = collectRecentValues(longitudinalState, input.visitHistory, [
    ["milestoneAchieved"],
    ["milestone_achieved"],
  ]);
  const progressionStatus = asText(
    readFirst(longitudinalState, [["progressionStatus"], ["progression_status"]])
  );
  const advancementReadiness = asText(
    readFirst(progressionState, [["advancementReadiness"], ["advancement_readiness"]])
  );
  const treatmentDirectionChanged = readFirst(longitudinalState, [
    ["treatmentDirectionChanged"],
    ["treatment_direction_changed"],
  ]);

  const improvedCandidates: RankedNarrativeItem[] = [];
  const improvedChange = functionalChanges.find(isImprovement);
  if (improvedChange) {
    const activity = describeActivity(improvedChange);
    improvedCandidates.push({
      priority: 95,
      sourceKey: `functional:${normalize(improvedChange)}`,
      label: sentenceCase(activity),
      explanation: `${sentenceCase(activity)} shows positive change compared with the prior status.`,
      clinicalImpact: "The gain supports continued progression, but does not by itself confirm that safety and support demands are resolved.",
      sourceContext: "Most recent Patient Status update",
    });
  }

  const caregiverChange = asText(
    readFirst(longitudinalState, [["caregiverChange"], ["caregiver_change"]])
  );
  if (caregiverChange && isImprovement(caregiverChange)) {
    improvedCandidates.push({
      priority: 88,
      sourceKey: `caregiver:${normalize(caregiverChange)}`,
      label: "Caregiver carryover",
      explanation: "Caregiver support demands appear more manageable than in the prior status.",
      clinicalImpact: "Improved carryover increases feasibility between visits without removing the need to verify reliable support.",
      sourceContext: "Most recent Patient Status update",
    });
  }

  const environmentalChange = asText(
    readFirst(longitudinalState, [["environmentalChange"], ["environmental_change"]])
  );
  if (environmentalChange && isImprovement(environmentalChange)) {
    improvedCandidates.push({
      priority: 84,
      sourceKey: `environment:${normalize(environmentalChange)}`,
      label: "Environmental setup",
      explanation: "The environment appears less restrictive than it was at the prior status.",
      clinicalImpact: "This improves task feasibility, although remaining performance constraints still govern advancement.",
      sourceContext: "Most recent Patient Status update",
    });
  }

  const milestone = achievedMilestones.find(Boolean);
  if (milestone) {
    improvedCandidates.push({
      priority: 80,
      sourceKey: `milestone:${normalize(milestone)}`,
      label: "Milestone reached",
      explanation: "A documented milestone confirms meaningful progress within the current plan.",
      clinicalImpact: "The milestone supports review of readiness rather than automatic advancement.",
      sourceContext: "Current progression state",
    });
  } else if (progressionStatus && isImprovement(progressionStatus)) {
    improvedCandidates.push({
      priority: 70,
      sourceKey: `status:${normalize(progressionStatus)}`,
      label: "Positive progression",
      explanation: "The latest progression status indicates forward movement within the current plan.",
      clinicalImpact: "Progress is present, but advancement still depends on whether the active constraints have resolved.",
      sourceContext: "Current longitudinal state",
    });
  }

  const blockerCandidates: RankedNarrativeItem[] = [];
  const regressionRisks = asTextList(
    readFirst(progressionState, [["regressionRisks"], ["regression_risks"]])
  );
  const reassessmentTriggers = asTextList(
    readFirst(progressionState, [["reassessmentTriggers"], ["reassessment_triggers"]])
  );
  const safetyChange = functionalChanges.find(isSafetyOrRegression);
  const safetySignal = safetyChange || regressionRisks[0] || reassessmentTriggers.find(isSafetyOrRegression);
  const safetyRiskLevel = asText(
    readFirst(clinicalDecisionModel, [["safetyRiskLevel"], ["safety_risk_level"]])
  );

  if (safetySignal || normalize(safetyRiskLevel || "") === "high") {
    const activity = describeActivity(safetySignal || "");
    blockerCandidates.push({
      priority: 120,
      sourceKey: `safety:${normalize(safetySignal || safetyRiskLevel || "high")}`,
      label: "Safety margin",
      explanation: safetySignal && hasAny(safetySignal, ["fall", "near fall"])
        ? `A recent fall-related signal narrows the safety margin during ${activity}.`
        : "Current safety or regression signals show that performance is not yet reliable enough for automatic advancement.",
      clinicalImpact: "Safety risk requires review before expectations or support levels are advanced.",
      sourceContext: safetyChange ? "Most recent Patient Status update" : "Current progression state",
    });
  }

  const activeBarriers = asTextList(
    readFirst(progressionState, [["activeBarriers"], ["active_barriers"]])
  );
  const currentLimitingFactor = asText(
    readFirst(longitudinalState, [
      ["currentDominantBarrier"],
      ["current_dominant_barrier"],
      ["currentLimitingFactor"],
      ["current_limiting_factor"],
    ])
  );
  const dominantBarrier = currentLimitingFactor || activeBarriers[0] || asText(
    readFirst(clinicalDecisionModel, [["dominantBarrier"], ["dominant_barrier"]])
  );

  if (dominantBarrier) {
    const barrier = clinicianText(dominantBarrier);
    blockerCandidates.push({
      priority: currentLimitingFactor ? 105 : 100,
      sourceKey: `barrier:${normalize(barrier)}`,
      label: "Primary functional constraint",
      explanation: `${sentenceCase(barrier)} remains the clearest limitation because it still affects reliable performance of the target activity.`,
      clinicalImpact: "The unresolved limitation keeps treatment effort anchored to the current functional need.",
      sourceContext: currentLimitingFactor ? "Most recent Patient Status update" : "Current progression state",
    });
  }

  const caregiverDependencyState = asText(
    readFirst(progressionState, [["caregiverDependencyState"], ["caregiver_dependency_state"]])
  );
  const supportLevel = asText(
    readFirst(clinicalDecisionModel, [["supportLevel"], ["support_level"]])
  );
  const caregiverConstraint = caregiverDependencyState ||
    (supportLevel && normalize(supportLevel) !== "independent" ? supportLevel : null);
  if (caregiverConstraint && !isImprovement(caregiverConstraint)) {
    blockerCandidates.push({
      priority: 90,
      sourceKey: `caregiver-constraint:${normalize(caregiverConstraint)}`,
      label: "Caregiver carryover",
      explanation: "Caregiver carryover remains a limiting factor when gains depend on support outside the visit.",
      clinicalImpact: "Advancement should wait until support is sufficiently reliable for the expected level of performance.",
      sourceContext: "Current progression state",
    });
  }

  const environmentalLimitationState = asText(
    readFirst(progressionState, [["environmentalLimitationState"], ["environmental_limitation_state"]])
  );
  if (
    environmentalLimitationState &&
    !hasAny(environmentalLimitationState, ["not limit", "resolved", "no limitation", "optimized", "supports progression"])
  ) {
    blockerCandidates.push({
      priority: 85,
      sourceKey: `environment-constraint:${normalize(environmentalLimitationState)}`,
      label: "Environmental constraint",
      explanation: "The current environment continues to limit how safely or consistently the target activity can be completed.",
      clinicalImpact: "Performance gains may not carry over reliably until the environmental demand is addressed.",
      sourceContext: "Current progression state",
    });
  }

  const continuityPressure = asText(
    readFirst(continuityInterpretation, [
      ["reassessmentPressureLevel"],
      ["reassessment_pressure_level"],
      ["continuity_interpretation", "reassessmentPressureLevel"],
    ])
  );
  if (
    improvedCandidates.length > 0 &&
    (normalize(advancementReadiness || "") === "partial" ||
      normalize(advancementReadiness || "") === "low" ||
      normalize(continuityPressure || "") === "moderate" ||
      normalize(continuityPressure || "") === "high")
  ) {
    blockerCandidates.push({
      priority: 75,
      sourceKey: "progress-with-review",
      label: "Progress requires review",
      explanation: "Positive change is present, but the available state does not show that the active constraints have fully resolved.",
      clinicalImpact: "Improvement supports reassessment of readiness, not automatic advancement of expectations.",
      sourceContext: "Current progression state",
    });
  }

  const whatImproved = uniqueRanked(improvedCandidates, 2);
  const whatStillBlocksProgression = uniqueRanked(blockerCandidates, 2);
  const primaryBlocker = whatStillBlocksProgression[0];
  const hasImprovement = whatImproved.length > 0;
  const hasBlocker = whatStillBlocksProgression.length > 0;

  const headline = hasImprovement && hasBlocker
    ? `${whatImproved[0].label} improved, but ${primaryBlocker.label.toLowerCase()} still limits advancement.`
    : hasBlocker
      ? `${primaryBlocker.label} remains the main constraint on progression.`
      : hasImprovement
        ? `${whatImproved[0].label} shows progress that should be reviewed before advancing expectations.`
        : "The current plan remains in place while progression constraints are monitored.";

  const summary = hasImprovement && hasBlocker
    ? "Meaningful improvement is present, but unresolved safety, support, or performance demands still prevent automatic advancement."
    : hasBlocker
      ? "The unresolved limitation continues to govern what can be performed safely and reliably right now."
      : hasImprovement
        ? "Progress is evident, but the available information supports clinical review rather than an automatic change in treatment direction."
        : "No new progression signal outweighs the constraints supporting the current treatment direction.";

  const recommendationChanged = treatmentDirectionChanged === true;
  const whyRecommendationRemainsAppropriate = recommendationChanged
    ? "The current recommendation should be reviewed against the documented treatment-direction change before expectations advance."
    : "The current recommendation remains appropriate because improvement does not yet outweigh the unresolved constraint governing safe, reliable performance.";

  return {
    headline,
    summary,
    unresolvedLimitation: primaryBlocker
      ? {
          label: primaryBlocker.label,
          explanation: primaryBlocker.explanation,
          clinicalImpact: primaryBlocker.clinicalImpact || "This constraint should be resolved or reviewed before advancement.",
        }
      : undefined,
    whatImproved,
    whatStillBlocksProgression,
    whyRecommendationRemainsAppropriate,
  };
}
