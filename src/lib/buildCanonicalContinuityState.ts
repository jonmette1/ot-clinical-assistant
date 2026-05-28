import { buildCanonicalCasePayload } from "@/lib/buildCanonicalCasePayload";
import { buildContinuityInterpretation } from "@/lib/buildContinuityInterpretation";
import { buildProgressionState } from "@/lib/buildProgressionState";

type BuildCanonicalContinuityStateInput = {
  caseData: Record<string, unknown> | null | undefined;
  follow_up_status?: Record<string, unknown>;
  reasoning_stale?: boolean;
  plan_stale?: boolean;
  modules_stale?: boolean;
};

export function buildCanonicalContinuityState({
  caseData,
  follow_up_status,
  reasoning_stale,
  plan_stale,
  modules_stale,
}: BuildCanonicalContinuityStateInput) {
  const generatedOutput = caseData?.generated_output as
    | Record<string, unknown>
    | undefined;

  const canonicalPayload = buildCanonicalCasePayload(caseData);
  const clinicalDecisionInput = canonicalPayload.clinicalDecisionInput;
  const clinicalDecisionModel = canonicalPayload.clinicalDecisionModel;

  const staleState = {
    reasoning_stale: Boolean(reasoning_stale ?? caseData?.reasoning_stale),
    plan_stale: Boolean(plan_stale ?? caseData?.plan_stale),
    modules_stale: Boolean(modules_stale ?? caseData?.modules_stale),
  };

  const progressionState = buildProgressionState({
    canonicalCasePayload: canonicalPayload,
  });

  const continuityInterpretation = buildContinuityInterpretation({
    progression_state: progressionState,
    operational_prioritization:
      generatedOutput?.operational_prioritization as
        | Record<string, unknown>
        | undefined,
    clinicalDecisionModel,
    clinicalDecisionInput,
    follow_up_status,
    reasoning_stale: staleState.reasoning_stale,
    plan_stale: staleState.plan_stale,
  });

  const continuityInterpretationPayload =
    "continuity_interpretation" in continuityInterpretation
      ? continuityInterpretation.continuity_interpretation
      : continuityInterpretation;

  const continuityAssemblyState = {
    progression_state: progressionState,
    continuity_interpretation: continuityInterpretationPayload,
    staleState,
  };

  return {
    canonicalPayload,
    clinicalDecisionInput,
    clinicalDecisionModel,
    progressionState,
    continuityInterpretation,
    staleState,
    continuityAssemblyState,
  };
}
