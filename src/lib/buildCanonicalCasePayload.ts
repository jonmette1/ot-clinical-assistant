import { buildClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import { buildClinicalDecisionInputFromCase } from "@/lib/buildClinicalDecisionInput";

export function buildCanonicalCasePayload(caseData: any) {
  const clinicalDecisionInput = buildClinicalDecisionInputFromCase(caseData);

  const clinicalDecisionModel = buildClinicalDecisionModel({
    goalCategory: clinicalDecisionInput.goalCategory as any,
    dominantBarrier: clinicalDecisionInput.dominantBarrier as any,
    dominantBarrierSeverity:
      clinicalDecisionInput.dominantBarrierSeverity as 1 | 2 | 3,
    secondaryBarrier: clinicalDecisionInput.secondaryBarrier as any,
    secondaryBarrierSeverity:
      clinicalDecisionInput.secondaryBarrierSeverity as 1 | 2 | 3 | undefined,
    safetyRiskLevel: clinicalDecisionInput.safetyRiskLevel as any,
    supportLevel: clinicalDecisionInput.supportLevel as any,
    clinicalLens: clinicalDecisionInput.clinicalLens as any,
    environmentContext: clinicalDecisionInput.environmentContext as any,
  });

  return {
    ...caseData,
    clinicalDecisionInput,
    clinicalDecisionModel,
    clinical_focus:
      caseData?.case_classification?.clinical_focus || "adl_home_safety",
    executionFocus:
      caseData?.case_classification?.clinical_focus || "adl_home_safety",
  };
}