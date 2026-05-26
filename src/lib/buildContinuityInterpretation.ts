import type { ProgressionState } from "@/lib/progression/progressionTypes";

type ReassessmentPressureLevel = "low" | "moderate" | "high";

type BuildContinuityInterpretationInput = {
  progression_state?: Partial<ProgressionState> | Record<string, unknown>;
  operational_prioritization?: Record<string, unknown>;
  clinicalDecisionModel?: Record<string, unknown>;
  clinicalDecisionInput?: Record<string, unknown>;
  follow_up_status?: Record<string, unknown>;
  reasoning_stale?: boolean;
  plan_stale?: boolean;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function buildContinuityInterpretation(
  input: BuildContinuityInterpretationInput
) {
  const progressionState = input?.progression_state || {};
  const operationalPrioritization = input?.operational_prioritization || {};
  const clinicalDecisionModel = input?.clinicalDecisionModel || {};
  const clinicalDecisionInput = input?.clinicalDecisionInput || {};
  const followUpStatus = input?.follow_up_status || {};

  const regressionRisks = asStringArray(progressionState?.regressionRisks);
  const progressionTriggers = asStringArray(progressionState?.reassessmentTriggers);
  const prioritizationTriggers = asStringArray(
    operationalPrioritization?.reassessmentTriggers
  );
  const combinedTriggers = [
    ...progressionTriggers,
    ...prioritizationTriggers,
  ];

  const supportState = asString(progressionState?.caregiverDependencyState);
  const environmentState = asString(progressionState?.environmentalLimitationState);
  const phase = asString(progressionState?.currentPhase);
  const readiness = asString(progressionState?.advancementReadiness);
  const followUpLabel = asString(
    followUpStatus?.status || followUpStatus?.state
  ).toLowerCase();
  const dominantBarrier = asString(
    clinicalDecisionModel?.dominantBarrier || clinicalDecisionInput?.dominantBarrier
  );
  const secondaryBarrier = asString(
    clinicalDecisionModel?.secondaryBarrier || clinicalDecisionInput?.secondaryBarrier
  );
  const supportLevel = asString(
    clinicalDecisionModel?.supportLevel || clinicalDecisionInput?.supportLevel
  );
  const safetyRiskLevel = asString(
    clinicalDecisionModel?.safetyRiskLevel || clinicalDecisionInput?.safetyRiskLevel
  );

  const barrierList: string[] = [
    ...asStringArray(progressionState?.activeBarriers),
    dominantBarrier,
    secondaryBarrier,
  ].filter(Boolean);

  const strategyList = asStringArray(clinicalDecisionModel?.selectedStrategies);

  const caregiverSignals: string[] = [];
  if (supportState.includes("unreliable") || supportState.includes("training")) {
    caregiverSignals.push("caregiver feasibility strain");
  }
  if (
    supportLevel === "Unreliable Support" ||
    supportLevel === "Intermittent Support"
  ) {
    caregiverSignals.push("variable caregiver support reliability");
  }
  if (strategyList.includes("Caregiver Support") && supportLevel === "Independent") {
    caregiverSignals.push("caregiver carryover expectation mismatch");
  }

  const dominantInstabilityDrivers = [
    ...new Set([
      ...barrierList.slice(0, 4),
      ...regressionRisks.slice(0, 3),
      ...caregiverSignals,
    ]),
  ].slice(0, 5);

  const operationalChangeClassification: string[] = [];
  if (phase === "stabilization" || regressionRisks.length >= 2 || safetyRiskLevel === "high") {
    operationalChangeClassification.push("Escalating Instability");
  }
  if (phase === "environmental_optimization" || environmentState.includes("limits")) {
    operationalChangeClassification.push("Stable Limitation");
  }
  if (phase === "reduced_dependency" && readiness !== "low") {
    operationalChangeClassification.push("Reduced Dependency");
  }
  if (environmentState.includes("partially") || environmentState.includes("supports")) {
    operationalChangeClassification.push("Environmental Improvement");
  }
  if (
    barrierList.some((b) => b.toLowerCase().includes("sequencing")) ||
    barrierList.some((b) => b.toLowerCase().includes("cognitive"))
  ) {
    operationalChangeClassification.push("Execution Variability");
  }
  if (combinedTriggers.length > 0 || input?.reasoning_stale || input?.plan_stale) {
    operationalChangeClassification.push("Reassessment Required");
  }

  const operationalDriftSignals: string[] = [];
  if (input?.reasoning_stale || input?.plan_stale) {
    operationalDriftSignals.push("case reasoning and plan state are stale");
  }
  if (combinedTriggers.length > 0) {
    operationalDriftSignals.push("reassessment triggers remain active");
  }
  if (followUpLabel.includes("missed") || followUpLabel.includes("delayed")) {
    operationalDriftSignals.push("follow-up status indicates execution delay");
  }

  const continuityAlerts = [
    ...new Set([
      ...combinedTriggers.slice(0, 3),
      ...regressionRisks.slice(0, 2),
      ...operationalDriftSignals.slice(0, 2),
    ]),
  ].slice(0, 5);

  let reassessmentPressureLevel: ReassessmentPressureLevel = "low";
  if (
    input?.reasoning_stale ||
    input?.plan_stale ||
    regressionRisks.length >= 2 ||
    combinedTriggers.length >= 2
  ) {
    reassessmentPressureLevel = "high";
  } else if (regressionRisks.length > 0 || combinedTriggers.length > 0) {
    reassessmentPressureLevel = "moderate";
  }

  const currentContinuityCondition =
    phase
      ? `continuity operating in ${phase} phase with active constraint carryover`
      : "continuity condition not yet deterministically classified";

  const continuitySummary =
    reassessmentPressureLevel === "high"
      ? "Operational continuity remains unstable with active reassessment pressure across safety, caregiver, or environment constraints."
      : reassessmentPressureLevel === "moderate"
      ? "Operational continuity is partially stable but remains constrained by unresolved execution and support variability."
      : "Operational continuity is currently stable within existing support and environmental constraints.";

  return {
    continuity_interpretation: {
      currentContinuityCondition,
      operationalChangeClassification: Array.from(
        new Set(operationalChangeClassification)
      ),
      dominantInstabilityDrivers,
      reassessmentPressureLevel,
      operationalDriftSignals,
      continuityAlerts,
      continuitySummary,
    },
  };
}
