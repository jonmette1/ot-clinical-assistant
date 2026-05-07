import type {
  BarrierType,
  ClinicalDecisionInput,
  ClinicalLens,
  EnvironmentContext,
  GoalCategory,
  SafetyRiskLevel,
  Severity,
  SupportLevel,
} from "@/lib/clinicalDecisionEngine";
type BarrierScores = Record<BarrierType, number>;
type NormalizationResult = {
  barrierScores: BarrierScores;
  notes: string[];
};

function createEmptyBarrierScores(): BarrierScores {
  return {
    Physical: 0,
    Cognitive: 0,
    Sensory: 0,
    Behavioral: 0,
    Endurance: 0,
    Environmental: 0,
    "Support System": 0,
    Pain: 0,
  };
}

function mapZoneToEnvironmentContext(zone: string): EnvironmentContext {
  if (zone === "bathroom") return "Home – Bathroom";
  if (zone === "bedroom_bed_setup") return "Home – Bedroom";
  if (zone === "outside_entrance") return "Home – Entry/Exit";
  if (zone === "transfer_surfaces") return "Home – General Mobility";

  return "Home – General Mobility";
}

function getSeverityFromAssistLevel(value: string | undefined): Severity {
  const level = Number(value || 7);

  if (level <= 2) return 3;
  if (level <= 4) return 2;
  return 1;
}

function getWorstAssistLevel(caseData: any) {
  const adlLevels = caseData.functional_status?.adl_assist_levels || {};

  const transferValues = [
    Number(adlLevels.bed_transfer || 7),
    Number(adlLevels.toilet_transfer || 7),
    Number(adlLevels.shower_transfer || 7),
  ];

  return Math.min(...transferValues);
}

function deriveGoalCategory(caseData: any): GoalCategory {
  const goalText = String(
    caseData.goals_preferences?.primary_goal || ""
  ).toLowerCase();

  if (
    goalText.includes("safe") ||
    goalText.includes("fall") ||
    goalText.includes("risk")
  ) {
    return "Safety";
  }

  if (
    goalText.includes("caregiver") ||
    goalText.includes("burden") ||
    goalText.includes("help")
  ) {
    return "Caregiver Burden";
  }

  if (
    goalText.includes("endurance") ||
    goalText.includes("fatigue") ||
    goalText.includes("tolerance")
  ) {
    return "Endurance";
  }

  if (
    goalText.includes("participate") ||
    goalText.includes("community") ||
    goalText.includes("school") ||
    goalText.includes("work")
  ) {
    return "Participation";
  }

  return "Independence";
}

function deriveClinicalLens(caseData: any): ClinicalLens[] {
  const diagnosis = String(
    caseData.patient_profile?.primary_diagnosis || ""
  ).toLowerCase();

  const caseType = caseData.case_classification?.case_type;

  const lenses: ClinicalLens[] = [];

  if (
    caseType === "neurological" ||
    diagnosis.includes("stroke") ||
    diagnosis.includes("parkinson") ||
    diagnosis.includes("tbi") ||
    diagnosis.includes("ms")
  ) {
    lenses.push("Neurological");
  }

  if (
    diagnosis.includes("dementia") ||
    diagnosis.includes("memory") ||
    diagnosis.includes("cognitive")
  ) {
    lenses.push("Cognitive");
  }

  if (
    diagnosis.includes("arthritis") ||
    diagnosis.includes("fracture") ||
    diagnosis.includes("joint") ||
    diagnosis.includes("hip") ||
    diagnosis.includes("knee")
  ) {
    lenses.push("Orthopedic");
  }

  if (
    diagnosis.includes("copd") ||
    diagnosis.includes("heart") ||
    diagnosis.includes("cardiac") ||
    diagnosis.includes("pulmonary")
  ) {
    lenses.push("Cardiopulmonary");
  }

  if (caseType === "pediatric") {
    lenses.push("Developmental");
  }

  if (
    diagnosis.includes("depression") ||
    diagnosis.includes("anxiety") ||
    diagnosis.includes("mental")
  ) {
    lenses.push("Mental Health");
  }

  if (
    diagnosis.includes("parkinson") ||
    diagnosis.includes("dementia") ||
    diagnosis.includes("progressive") ||
    diagnosis.includes("chronic")
  ) {
    lenses.push("Chronic/Progressive");
  }

  return lenses;
}

function deriveSupportLevel(caseData: any): SupportLevel {
  const caregiver = caseData.caregiver_info || caseData.caregiverSupport || {};

  if (
    caregiver.availability === "rarely_available" ||
    caregiver.availability === "intermittent_availability" ||
    caregiver.physical_capacity === "cannot_provide_physical_assist" ||
    caregiver.confidence === "low_confidence"
  ) {
    return "Unreliable Support";
  }

  if (
    caregiver.availability === "full_time_available" ||
    caregiver.is_primary_support
  ) {
    return "Full-Time Caregiver";
  }

  if (
    caregiver.availability === "part_time_available" ||
    caregiver.availability
  ) {
    return "Intermittent Support";
  }

  return "Independent";
}

function deriveSafetyRiskLevel(caseData: any, worstTransfer: number): SafetyRiskLevel {
  const recentFalls =
    caseData.functional_status?.general_mobility_summary?.recent_falls ||
    caseData.environment?.general_mobility?.recent_falls;

  const rankedZones =
    caseData.functional_status?.clinical_priority_summary?.ranked_zones || [];

  const hasHighPriorityZone = rankedZones.some(
    (zone: any) => zone.priority === "high"
  );

  if (recentFalls === "yes" || worstTransfer <= 3 || hasHighPriorityZone) {
    return "high";
  }

  if (worstTransfer <= 5) {
    return "medium";
  }

  return "low";
}

function buildBarrierScores(caseData: any): NormalizationResult {
  const scores = createEmptyBarrierScores();
const notes: string[] = [];

  const keyBarriers = caseData.functional_status?.key_barriers || [];
  const otherBarriers = String(
    caseData.functional_status?.other_key_barriers || ""
  ).toLowerCase();

  const barrierText = [...keyBarriers, otherBarriers].join(" ").toLowerCase();

  const diagnosis = String(
    caseData.patient_profile?.primary_diagnosis || ""
  ).toLowerCase();

  if (
    diagnosis.includes("dementia") ||
    diagnosis.includes("memory") ||
    diagnosis.includes("cognitive")
  ) {
    scores.Cognitive += 2;

    notes.push(
      "Cognitive score increased due to diagnosis-related cognitive impairment indicators."
    );
  }

  if (
    barrierText.includes("weakness") ||
    barrierText.includes("balance") ||
    barrierText.includes("transfer") ||
    barrierText.includes("mobility")
  ) {
    scores.Physical += 2;

    notes.push(
      "Physical score increased due to mobility, balance, or transfer-related barriers."
    );
  }

  if (
    barrierText.includes("cognition") ||
    barrierText.includes("sequencing") ||
    barrierText.includes("memory")
  ) {
    scores.Cognitive += 2;

    notes.push(
      "Cognitive score increased due to cognition, sequencing, or memory barriers."
    );
  }

  if (
    barrierText.includes("fear") ||
    barrierText.includes("anxiety") ||
    barrierText.includes("behavior")
  ) {
    scores.Behavioral += 2;

    notes.push(
      "Behavioral score increased due to fear, anxiety, or behavior-related barriers."
    );
  }

  if (
    barrierText.includes("endurance") ||
    barrierText.includes("fatigue")
  ) {
    scores.Endurance += 2;
  }

  if (barrierText.includes("pain")) {
    scores.Pain += 2;
  }

  if (
    barrierText.includes("sensory") ||
    barrierText.includes("overload") ||
    barrierText.includes("aversion")
  ) {
    scores.Sensory += 2;
  }

  const rankedZones =
    caseData.functional_status?.clinical_priority_summary?.ranked_zones || [];

  const topZone = rankedZones[0]?.zone || "";

  if (
    topZone === "bathroom" ||
    topZone === "outside_entrance" ||
    topZone === "transfer_surfaces"
  ) {
    scores.Environmental += 2;

    notes.push(
      `Environmental score increased because ${topZone} was identified as a high-priority functional zone.`
    );
  }

  const worstTransfer = getWorstAssistLevel(caseData);

  if (worstTransfer <= 4) {
    scores.Physical += 2;

    notes.push(
      "Physical score increased due to transfer assistance requirements."
    );
  }

  if (worstTransfer <= 2) {
    scores.Physical += 1;

    notes.push(
      "Physical score further increased due to severe transfer dependence."
    );
  }

  return {
    barrierScores: scores,
    notes,
  };
}
function getSortedBarrierScores(caseData: any): {
  sortedScores: [BarrierType, number][];
  notes: string[];
} {
  const normalization = buildBarrierScores(caseData);

  const scores = normalization.barrierScores;
  const notes = [...normalization.notes];

  const supportLevel = deriveSupportLevel(caseData);

  if (supportLevel === "Unreliable Support") {
    scores["Support System"] += 2;

    notes.push(
      "Support System score increased due to unreliable caregiver support."
    );
  }

  const sortedScores = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  ) as [BarrierType, number][];

  return {
    sortedScores,
    notes,
  };
}

function deriveDominantBarrier(caseData: any): BarrierType {
  const { sortedScores: sortedBarriers } = getSortedBarrierScores(caseData);

  const topBarrier = sortedBarriers[0]?.[0];

  return topBarrier || "Physical";
}

function deriveSecondaryBarrier(
  caseData: any,
  dominantBarrier: BarrierType
): BarrierType | undefined {
  const { sortedScores: sortedBarriers } = getSortedBarrierScores(caseData);

  const secondary = sortedBarriers.find(
    ([barrier, score]) => barrier !== dominantBarrier && score > 0
  );

  return secondary?.[0];
}

export function buildClinicalDecisionInputFromCase(
  caseData: any
): ClinicalDecisionInput {
  const rankedZones =
    caseData.functional_status?.clinical_priority_summary?.ranked_zones || [];

  const worstTransfer = getWorstAssistLevel(caseData);

  const dominantBarrier = deriveDominantBarrier(caseData);
  const supportLevel = deriveSupportLevel(caseData);
  const safetyRiskLevel = deriveSafetyRiskLevel(caseData, worstTransfer);

  const environmentContext = rankedZones.length
    ? rankedZones
        .slice(0, 3)
        .map((zone: any) => mapZoneToEnvironmentContext(zone.zone))
    : ["Home – General Mobility" as EnvironmentContext];

  const secondaryBarrier = deriveSecondaryBarrier(caseData, dominantBarrier);

  return {
    goalCategory: deriveGoalCategory(caseData),
    dominantBarrier,
    dominantBarrierSeverity: getSeverityFromAssistLevel(String(worstTransfer)),
    secondaryBarrier,
    secondaryBarrierSeverity: 1,
    safetyRiskLevel,
    supportLevel,
    clinicalLens: deriveClinicalLens(caseData),
    environmentContext,
  };
}
export function buildClinicalNormalizationInsight(caseData: any) {
  return getSortedBarrierScores(caseData);
}
