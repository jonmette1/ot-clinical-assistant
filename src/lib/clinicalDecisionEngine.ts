export type Severity = 1 | 2 | 3;
export type SafetyRiskLevel = "low" | "medium" | "high";

export type GoalCategory =
  | "Independence"
  | "Safety"
  | "Efficiency"
  | "Endurance"
  | "Participation"
  | "Caregiver Burden"
  | "Consistency"
  | "Skill Acquisition";

export type BarrierType =
  | "Physical"
  | "Cognitive"
  | "Sensory"
  | "Behavioral"
  | "Endurance"
  | "Environmental"
  | "Support System"
  | "Pain";

export type StrategyType =
  | "Compensation"
  | "Remediation"
  | "Adaptation"
  | "Caregiver Support"
  | "Routine/Behavioral"
  | "Energy Conservation"
  | "Safety Containment";

export type ClinicalLens =
  | "Neurological"
  | "Orthopedic"
  | "Cardiopulmonary"
  | "Cognitive"
  | "Developmental"
  | "Mental Health"
  | "Chronic/Progressive";

export type EnvironmentContext =
  | "Home – Bathroom"
  | "Home – Bedroom"
  | "Home – Entry/Exit"
  | "Home – General Mobility"
  | "Community / Work / School";

export type SupportLevel =
  | "Independent"
  | "Intermittent Support"
  | "Full-Time Caregiver"
  | "Unreliable Support";

export type ClinicalDecisionInput = {
  goalCategory: GoalCategory;
  dominantBarrier: BarrierType;
  dominantBarrierSeverity: Severity;
  secondaryBarrier?: BarrierType;
  secondaryBarrierSeverity?: Severity;
  safetyRiskLevel: SafetyRiskLevel;
  supportLevel: SupportLevel;
  clinicalLens: ClinicalLens[];
  environmentContext: EnvironmentContext[];
};

export type ClinicalDecisionModel = {
  goalCategory: GoalCategory;
  dominantBarrier: BarrierType;
  dominantBarrierSeverity: Severity;
  secondaryBarrier?: BarrierType;
  secondaryBarrierSeverity?: Severity;
  safetyRiskLevel: SafetyRiskLevel;
  supportLevel: SupportLevel;
  clinicalLens: ClinicalLens[];
  environmentContext: EnvironmentContext[];
  selectedStrategies: StrategyType[];
  primaryStrategy: StrategyType;
  secondaryStrategies: StrategyType[];
  strategyScores: Record<StrategyType, number>;
  scoringNotes: string[];
  reasoningSummary: string;
};

export const GOAL_CATEGORIES: GoalCategory[] = [
  "Independence",
  "Safety",
  "Efficiency",
  "Endurance",
  "Participation",
  "Caregiver Burden",
  "Consistency",
  "Skill Acquisition",
];

export const BARRIER_TYPES: BarrierType[] = [
  "Physical",
  "Cognitive",
  "Sensory",
  "Behavioral",
  "Endurance",
  "Environmental",
  "Support System",
  "Pain",
];

export const STRATEGY_TYPES: StrategyType[] = [
  "Compensation",
  "Remediation",
  "Adaptation",
  "Caregiver Support",
  "Routine/Behavioral",
  "Energy Conservation",
  "Safety Containment",
];

export const CLINICAL_LENSES: ClinicalLens[] = [
  "Neurological",
  "Orthopedic",
  "Cardiopulmonary",
  "Cognitive",
  "Developmental",
  "Mental Health",
  "Chronic/Progressive",
];

export const ENVIRONMENT_CONTEXTS: EnvironmentContext[] = [
  "Home – Bathroom",
  "Home – Bedroom",
  "Home – Entry/Exit",
  "Home – General Mobility",
  "Community / Work / School",
];

export const SUPPORT_LEVELS: SupportLevel[] = [
  "Independent",
  "Intermittent Support",
  "Full-Time Caregiver",
  "Unreliable Support",
];

const BARRIER_STRATEGY_BIAS: Record<BarrierType, StrategyType[]> = {
  Physical: ["Compensation", "Remediation"],
  Cognitive: ["Caregiver Support", "Routine/Behavioral"],
  Sensory: ["Adaptation", "Routine/Behavioral"],
  Behavioral: ["Routine/Behavioral", "Caregiver Support"],
  Endurance: ["Energy Conservation"],
  Environmental: ["Adaptation"],
  "Support System": ["Caregiver Support"],
  Pain: ["Compensation", "Adaptation"],
};

const GOAL_STRATEGY_BOOSTS: Record<GoalCategory, StrategyType[]> = {
  Independence: ["Remediation", "Compensation"],
  Safety: ["Safety Containment", "Adaptation"],
  Efficiency: ["Adaptation", "Compensation"],
  Endurance: ["Energy Conservation"],
  Participation: ["Routine/Behavioral"],
  "Caregiver Burden": ["Caregiver Support", "Adaptation"],
  Consistency: ["Routine/Behavioral"],
  "Skill Acquisition": ["Remediation"],
};

export function buildClinicalDecisionModel(
  input: ClinicalDecisionInput
): ClinicalDecisionModel {
  const strategyScores = createEmptyStrategyScores();
  const scoringNotes: string[] = [];

  applyBarrierScores({
    scores: strategyScores,
    barrier: input.dominantBarrier,
    severity: input.dominantBarrierSeverity,
    multiplier: 3,
    label: "Dominant barrier",
    scoringNotes,
  });

  if (input.secondaryBarrier && input.secondaryBarrierSeverity) {
    applyBarrierScores({
      scores: strategyScores,
      barrier: input.secondaryBarrier,
      severity: input.secondaryBarrierSeverity,
      multiplier: 1.5,
      label: "Secondary barrier",
      scoringNotes,
    });
  }

  applyGoalBoosts({
    scores: strategyScores,
    goalCategory: input.goalCategory,
    scoringNotes,
  });

  applySupportModifier({
    scores: strategyScores,
    supportLevel: input.supportLevel,
    scoringNotes,
  });

  applySafetyOverride({
    scores: strategyScores,
    safetyRiskLevel: input.safetyRiskLevel,
    scoringNotes,
  });

  const selectedStrategies = selectFinalStrategies({
    scores: strategyScores,
    safetyRiskLevel: input.safetyRiskLevel,
  });

  const primaryStrategy = selectedStrategies[0];
  const secondaryStrategies = selectedStrategies.slice(1);

  return {
    goalCategory: input.goalCategory,
    dominantBarrier: input.dominantBarrier,
    dominantBarrierSeverity: input.dominantBarrierSeverity,
    secondaryBarrier: input.secondaryBarrier,
    secondaryBarrierSeverity: input.secondaryBarrierSeverity,
    safetyRiskLevel: input.safetyRiskLevel,
    supportLevel: input.supportLevel,
    clinicalLens: input.clinicalLens,
    environmentContext: input.environmentContext,
    selectedStrategies,
    primaryStrategy,
    secondaryStrategies,
    strategyScores,
    scoringNotes,
    reasoningSummary: buildReasoningSummary({
      input,
      selectedStrategies,
    }),
  };
}

function createEmptyStrategyScores(): Record<StrategyType, number> {
  return STRATEGY_TYPES.reduce((acc, strategy) => {
    acc[strategy] = 0;
    return acc;
  }, {} as Record<StrategyType, number>);
}

function applyBarrierScores(args: {
  scores: Record<StrategyType, number>;
  barrier: BarrierType;
  severity: Severity;
  multiplier: number;
  label: string;
  scoringNotes: string[];
}) {
  const { scores, barrier, severity, multiplier, label, scoringNotes } = args;

  const strategies = BARRIER_STRATEGY_BIAS[barrier];

  strategies.forEach((strategy, index) => {
    const rankWeight = index === 0 ? 2 : 1;
    const points = severity * multiplier * rankWeight;

    scores[strategy] += points;

    scoringNotes.push(
      `${label}: ${barrier} boosted ${strategy} by ${points}.`
    );
  });
}

function applyGoalBoosts(args: {
  scores: Record<StrategyType, number>;
  goalCategory: GoalCategory;
  scoringNotes: string[];
}) {
  const { scores, goalCategory, scoringNotes } = args;

  const strategies = GOAL_STRATEGY_BOOSTS[goalCategory];

  strategies.forEach((strategy) => {
    scores[strategy] += 2;
    scoringNotes.push(
      `Goal category: ${goalCategory} boosted ${strategy} by 2.`
    );
  });
}

function applySupportModifier(args: {
  scores: Record<StrategyType, number>;
  supportLevel: SupportLevel;
  scoringNotes: string[];
}) {
  const { scores, supportLevel, scoringNotes } = args;

  if (supportLevel === "Independent") {
    scores["Caregiver Support"] -= 5;
    scoringNotes.push(
      "Support modifier: Independent reduced Caregiver Support by 5."
    );
  }

  if (supportLevel === "Intermittent Support") {
    scores["Caregiver Support"] += 1;
    scoringNotes.push(
      "Support modifier: Intermittent Support boosted Caregiver Support by 1."
    );
  }

  if (supportLevel === "Full-Time Caregiver") {
    scores["Caregiver Support"] += 5;
    scoringNotes.push(
      "Support modifier: Full-Time Caregiver boosted Caregiver Support by 5."
    );
  }

  if (supportLevel === "Unreliable Support") {
    scores["Caregiver Support"] -= 10;
    scoringNotes.push(
      "Support modifier: Unreliable Support reduced Caregiver Support by 10."
    );
  }
}

function applySafetyOverride(args: {
  scores: Record<StrategyType, number>;
  safetyRiskLevel: SafetyRiskLevel;
  scoringNotes: string[];
}) {
  const { scores, safetyRiskLevel, scoringNotes } = args;

  if (safetyRiskLevel !== "high") return;

  scores["Safety Containment"] += 100;
  scores["Compensation"] += 50;
  scores["Caregiver Support"] += 50;
  scores["Remediation"] -= 25;

  scoringNotes.push(
    "Safety override: high safety risk forced priority toward Safety Containment, Compensation, and Caregiver Support."
  );

  scoringNotes.push(
    "Safety override: high safety risk suppressed Remediation-first planning."
  );
}

function selectFinalStrategies(args: {
  scores: Record<StrategyType, number>;
  safetyRiskLevel: SafetyRiskLevel;
}): StrategyType[] {
  const { scores, safetyRiskLevel } = args;

  if (safetyRiskLevel === "high") {
    return ["Safety Containment", "Compensation", "Caregiver Support"];
  }

  const sortedStrategies = STRATEGY_TYPES.slice().sort((a, b) => {
    const scoreDifference = scores[b] - scores[a];

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return STRATEGY_TYPES.indexOf(a) - STRATEGY_TYPES.indexOf(b);
  });

const relevantStrategies = sortedStrategies.filter(
  (strategy) => scores[strategy] > 0
);

return relevantStrategies.slice(0, 3);
}

function buildReasoningSummary(args: {
  input: ClinicalDecisionInput;
  selectedStrategies: StrategyType[];
}): string {
  const { input, selectedStrategies } = args;

  const secondaryBarrierText = input.secondaryBarrier
    ? ` Secondary barrier is ${input.secondaryBarrier} with severity ${input.secondaryBarrierSeverity}.`
    : "";

  return `The engine selected ${selectedStrategies.join(
    ", "
  )} because the primary goal is ${input.goalCategory}, the dominant barrier is ${
    input.dominantBarrier
  } with severity ${
    input.dominantBarrierSeverity
  }, and safety risk is ${input.safetyRiskLevel}.${secondaryBarrierText}`;
}