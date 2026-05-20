import type {
  ClinicalDecisionInput,
  ClinicalDecisionModel,
} from "@/lib/clinicalDecisionEngine";

import type {
  AdvancementReadiness,
  ProgressionState,
} from "@/lib/progression/progressionTypes";

import {
  compactUnique,
  hasStrategy,
  limitMilestones,
  toNumber,
} from "@/lib/progression/progressionUtils";


type BuildProgressionStateInput = {
  canonicalCasePayload: any;
};


function getWorstTransferLevel(caseData: any): number {
  const adlLevels = caseData?.functional_status?.adl_assist_levels || {};

  const values = [
    toNumber(adlLevels.bed_transfer),
    toNumber(adlLevels.toilet_transfer),
    toNumber(adlLevels.shower_transfer),
  ];

  return Math.min(...values);
}



export function buildProgressionState({
  canonicalCasePayload,
}: BuildProgressionStateInput): ProgressionState {
  const caseData = canonicalCasePayload || {};

  const clinicalDecisionInput =
    caseData.clinicalDecisionInput as ClinicalDecisionInput | undefined;

  const clinicalDecisionModel =
    caseData.clinicalDecisionModel as ClinicalDecisionModel | undefined;

  const functionalStatus = caseData.functional_status || {};
  const environment = caseData.environment || {};
  const caregiver = caseData.caregiverSupport || caseData.caregiver_info || {};

  const adlLevels = functionalStatus.adl_assist_levels || {};
  const worstTransferLevel = getWorstTransferLevel(caseData);
  const currentAssistLevel = toNumber(functionalStatus.current_assistance_level);

  const showerTransfer = toNumber(adlLevels.shower_transfer);
  const toiletTransfer = toNumber(adlLevels.toilet_transfer);
  const bedTransfer = toNumber(adlLevels.bed_transfer);

  const selectedStrategies = clinicalDecisionModel?.selectedStrategies || [];
  const safetyRiskLevel =
    clinicalDecisionModel?.safetyRiskLevel ||
    clinicalDecisionInput?.safetyRiskLevel ||
    "medium";

  const dominantBarrier =
    clinicalDecisionModel?.dominantBarrier ||
    clinicalDecisionInput?.dominantBarrier ||
    "Physical";

  const secondaryBarrier =
    clinicalDecisionModel?.secondaryBarrier ||
    clinicalDecisionInput?.secondaryBarrier;

  const supportLevel =
    clinicalDecisionModel?.supportLevel ||
    clinicalDecisionInput?.supportLevel ||
    "Independent";

  const bathroom = environment.bathroom_assessment || {};
  const generalMobility =
    environment.general_mobility || functionalStatus.general_mobility_summary || {};
  const transferSurfaces =
    environment.transfer_surfaces ||
    functionalStatus.transfer_surface_summary ||
    {};

  const safetyHazards: string[] = bathroom.safety_hazards || [];
  const grabBarsStatus = bathroom.grab_bars_status;
  const bathSeating = bathroom.bath_seating;
  const bathroomType = bathroom.bathroom_type;

  const recentFalls = generalMobility.recent_falls;
  const endurance = generalMobility.endurance;
  const sitToStandDifficulty = transferSurfaces.sit_to_stand_difficulty;

  const caregiverAvailability = caregiver.availability;
  const caregiverPhysicalCapacity = caregiver.physical_capacity;
  const caregiverTrainingLevel = caregiver.training_level;
  const caregiverConfidence = caregiver.confidence;
  const caregiverIsPrimarySupport = caregiver.is_primary_support;

  const activeMilestones: string[] = [];
  const activeBarriers: string[] = [];
  const regressionRisks: string[] = [];
  const reassessmentTriggers: string[] = [];

  if (worstTransferLevel <= 3) {
    activeBarriers.push("significant transfer assistance requirement");
    activeMilestones.push("safer assisted transfer setup");
  }

  if (showerTransfer <= 4) {
    activeBarriers.push("shower transfer limitation");
    activeMilestones.push("safer shower transfer participation");
  }

  if (toiletTransfer <= 4) {
    activeBarriers.push("toilet transfer limitation");
    activeMilestones.push("safer toilet transfer participation");
  }

  if (bedTransfer <= 4) {
    activeBarriers.push("bed transfer limitation");
  }

  if (sitToStandDifficulty === "moderate" || sitToStandDifficulty === "severe") {
    activeBarriers.push("sit-to-stand instability");
  }

  if (endurance === "low") {
    activeBarriers.push("limited activity tolerance");
    activeMilestones.push("improved ADL activity tolerance");
  }

  if (safetyHazards.length > 0) {
    activeBarriers.push("bathroom safety hazard");
  }

const transferDrivenCase =
  showerTransfer <= 4 ||
  toiletTransfer <= 4 ||
  bedTransfer <= 4 ||
  dominantBarrier === "Physical";

if (
  transferDrivenCase &&
  grabBarsStatus === "none"
) {
  activeBarriers.push("missing bathroom grab bars");
}

  if (bathroomType === "tub_shower_combo" && showerTransfer <= 4) {
    activeBarriers.push("tub/shower access demand");
  }

  if (dominantBarrier === "Cognitive" || secondaryBarrier === "Cognitive") {
    activeBarriers.push("cognitive sequencing demand");
  }

  if (
  dominantBarrier === "Cognitive" ||
  secondaryBarrier === "Cognitive"
) {
  activeMilestones.push("structured task sequencing consistency");
}

  if (dominantBarrier === "Pain" || secondaryBarrier === "Pain") {
    activeBarriers.push("pain-limited task performance");
  }

  if (hasStrategy(selectedStrategies, "Safety Containment")) {
    activeMilestones.push("safe task access boundaries");
  }

  if (hasStrategy(selectedStrategies, "Compensation")) {
    activeMilestones.push("effective task/environment modification");
  }

if (hasStrategy(selectedStrategies, "Routine/Behavioral")) {
  activeMilestones.push("consistent structured routine participation");
}

if (hasStrategy(selectedStrategies, "Energy Conservation")) {
  activeMilestones.push("improved activity pacing tolerance");
}

if (hasStrategy(selectedStrategies, "Adaptation")) {
  activeMilestones.push("improved environmental task access");
}

  if (hasStrategy(selectedStrategies, "Caregiver Support")) {
    activeMilestones.push("caregiver-supported carryover");
  }

  if (recentFalls === "yes") {
    regressionRisks.push("recent fall history");
    reassessmentTriggers.push("fall history requires safety review");
  }

  if (safetyRiskLevel === "high") {
    regressionRisks.push("high safety risk");
    reassessmentTriggers.push("high safety risk requires reassessment if unresolved");
  }

  if (worstTransferLevel <= 2) {
    regressionRisks.push("high physical assistance requirement");
  }

  if (
    supportLevel === "Unreliable Support" ||
    caregiverAvailability === "rarely_available" ||
    caregiverAvailability === "intermittent_availability" ||
    caregiverPhysicalCapacity === "cannot_provide_physical_assist" ||
    caregiverConfidence === "low_confidence"
  ) {
    regressionRisks.push("caregiver support mismatch");
    reassessmentTriggers.push("caregiver support mismatch");
  }

  if (safetyHazards.length >= 2) {
    regressionRisks.push("multiple unresolved environmental hazards");
  }

  if (caseData.reasoning_stale || caseData.plan_stale) {
    reassessmentTriggers.push("case reasoning or plan is stale");
  }

let caregiverDependencyState =
  "caregiver dependency requires further evaluation";

if (
  worstTransferLevel <= 4 ||
  hasStrategy(selectedStrategies, "Caregiver Support")
) {
  caregiverDependencyState =
    "caregiver support required for carryover";
}

if (supportLevel === "Unreliable Support") {
  caregiverDependencyState = "caregiver support currently unreliable";
} else if (supportLevel === "Intermittent Support") {
  caregiverDependencyState = "intermittent caregiver support required";
} else if (
  supportLevel === "Full-Time Caregiver" ||
  caregiverIsPrimarySupport
) {
  caregiverDependencyState =
    "caregiver support required for carryover";
}

if (caregiverTrainingLevel === "needs_training") {
  caregiverDependencyState =
    "caregiver training required for safe carryover";
}

  let environmentalLimitationState = "environment supports progression";

  if (safetyHazards.length >= 2 || grabBarsStatus === "none") {
    environmentalLimitationState = "environment significantly limits progression";
  } else if (
    safetyHazards.length === 1 ||
    bathSeating === "none" ||
    bathroomType === "tub_shower_combo"
  ) {
    environmentalLimitationState = "environment partially limits progression";
  }

  let currentPhase: ProgressionState["currentPhase"] =
    "foundational_participation";

  let advancementReadiness: AdvancementReadiness = "partial";

const functionallyIndependent =
  worstTransferLevel >= 5 &&
  currentAssistLevel >= 4 &&
  supportLevel !== "Full-Time Caregiver";

console.log("PROGRESSION PHASE DEBUG", {
  safetyRiskLevel,
  worstTransferLevel,
  currentAssistLevel,
  supportLevel,
  functionallyIndependent,
  selectedStrategies,
  dominantBarrier,
  environmentalLimitationState,
});

if (
  !functionallyIndependent &&
  (
    worstTransferLevel <= 1 ||
    (
      hasStrategy(selectedStrategies, "Safety Containment") &&
      regressionRisks.length >= 2
    )
  )
) {
  currentPhase = "stabilization";
  advancementReadiness = "low";

} else if (
  worstTransferLevel === 2 ||
  currentAssistLevel === 3 ||
  (
    dominantBarrier === "Cognitive"
  ) ||
  (
    hasStrategy(selectedStrategies, "Routine/Behavioral") &&
    !functionallyIndependent
  )
) {
  currentPhase = "foundational_participation";
  advancementReadiness = "partial";
} else if (
  worstTransferLevel === 4 ||
  currentAssistLevel === 4 ||
  hasStrategy(selectedStrategies, "Caregiver Support") ||
  hasStrategy(selectedStrategies, "Compensation")
) {
  currentPhase = "supported_functional_execution";
  advancementReadiness = "partial";
} else if (worstTransferLevel >= 5 || currentAssistLevel >= 5) {
  currentPhase = "reduced_dependency";
  advancementReadiness = regressionRisks.length > 0 ? "partial" : "high";
}

if (
  currentPhase !== "stabilization" &&
  (
    dominantBarrier === "Environmental" ||
    environmentalLimitationState === "environment significantly limits progression"
  )
) {
  currentPhase = "environmental_optimization";
  advancementReadiness = regressionRisks.length > 0 ? "low" : "partial";
}
  const primaryBarrier =
    activeBarriers[0] || "current functional limitations";

  const primaryFocus =
    currentPhase === "stabilization"
      ? "Progression should remain focused on safety stabilization."
      : currentPhase === "environmental_optimization"
      ? "Progression should remain focused on resolving environmental constraints."
      : "Progression should remain focused on supported functional carryover.";

  return {
    currentPhase,
    advancementReadiness,
    activeMilestones: limitMilestones(
  activeMilestones,
  currentPhase
),
    activeBarriers: compactUnique(activeBarriers),
    regressionRisks: compactUnique(regressionRisks),
    reassessmentTriggers: compactUnique(reassessmentTriggers),
    caregiverDependencyState,
    environmentalLimitationState,
    continuitySummary: `${primaryBarrier} continues to shape safe task participation. ${primaryFocus}`,
  };
}