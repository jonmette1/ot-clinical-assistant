import type { ConclusionType } from "@/lib/buildConclusionEvidence";

export type ChangeExplanationType =
  | "changed"
  | "stable"
  | "progressing"
  | "deferred"
  | "monitoring";

export type ChangeFactor = {
  factorLabel: string;
  changeType: "improved" | "worsened" | "unchanged" | "new";
  explanation: string;
  clinicalImpact: string;
};

export type ConclusionChangeExplanation = {
  conclusionType: ConclusionType;
  explanationType: ChangeExplanationType;
  summary: string;
  factors: ChangeFactor[];
};

type ChangeExplanationInputs = {
  progressionState?: unknown;
  continuityInterpretation?: unknown;
  longitudinalState?: unknown;
  visitHistory?: unknown;
};

type BuildConclusionChangeExplanationInput = ChangeExplanationInputs & {
  conclusionType: ConclusionType;
  conclusion: string;
};

type BuildConclusionChangeExplanationSetInput = ChangeExplanationInputs & {
  conclusions: Record<ConclusionType, string>;
};

type SignalContext = {
  improvementSignal: string | null;
  safetySignal: string | null;
  unresolvedBarrier: string | null;
  reassessmentSignal: string | null;
  stableSignal: boolean;
  treatmentDirectionChanged: boolean | null;
  readiness: string;
  milestone: string | null;
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
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function asTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asText).filter((item): item is string => Boolean(item));
  }
  const text = asText(value);
  return text ? [text] : [];
}

function readBoolean(source: unknown, paths: string[][]): boolean | null {
  const value = readFirst(source, paths);
  return typeof value === "boolean" ? value : null;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clinicianLabel(value: string): string {
  const cleaned = value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? cleaned[0].toUpperCase() + cleaned.slice(1) : cleaned;
}

function latestVisit(visitHistory: unknown): Record<string, unknown> | null {
  if (!Array.isArray(visitHistory)) return null;
  return visitHistory.find(isRecord) || null;
}

function describesImprovement(value: string): boolean {
  return /\b(improv(?:e|ed|ement|ing)|progress(?:ed|ing|ion)?|fewer|less assist|reduced assist|increas(?:ed|ing) independence|more independent|safer|met|achiev(?:e|ed|ement)|advanc(?:e|ed|ing)|faster than expected)\b/i.test(
    value
  );
}

function describesSafetyConcern(value: string): boolean {
  return /\b(fall|falls|near fall|declin(?:e|ed|ing)|regress(?:ion|ed|ing)?|worsen(?:ed|ing)?|unsafe|instab(?:ility|le)?|injur(?:y|ies|ed)|hospital(?:ization|ized)?|new pain|increased assist|more assist|medical change)\b/i.test(
    value
  );
}

function describesStablePattern(value: string): boolean {
  return /\b(stable|unchanged|no meaningful change|no change|maintain|plateau|limited progress|minimal progress)\b/i.test(
    value
  );
}

function inferActivity(value: string): string {
  const normalized = normalize(value);
  if (normalized.includes("shower")) return "Shower transfer performance";
  if (normalized.includes("toilet")) return "Toilet transfer performance";
  if (normalized.includes("bed transfer")) return "Bed transfer performance";
  if (normalized.includes("transfer")) return "Transfer performance";
  if (normalized.includes("caregiver")) return "Caregiver carryover";
  if (normalized.includes("bathroom")) return "Bathroom task performance";
  if (normalized.includes("mobility")) return "Mobility performance";
  if (normalized.includes("pain")) return "Pain-limited performance";
  return "Functional performance";
}

function collectSignalContext(input: ChangeExplanationInputs): SignalContext {
  const visit = latestVisit(input.visitHistory);
  const payload = visit?.event_payload;
  const currentSnapshot = visit?.current_state_snapshot;
  const previousSnapshot = visit?.previous_state_snapshot;

  const functionalChanges = [
    ...asTextList(
      readFirst(payload, [["functionalChanges"], ["functional_changes"], ["patientStatusUpdates"]])
    ),
    ...asTextList(
      readFirst(currentSnapshot, [["functionalChanges"], ["functional_changes"]])
    ),
    ...asTextList(
      readFirst(input.longitudinalState, [["functionalChanges"], ["functional_changes"]])
    ),
  ];

  const milestone =
    asText(readFirst(payload, [["milestoneAchieved"], ["milestone_achieved"]])) ||
    asText(readFirst(currentSnapshot, [["milestoneAchieved"], ["milestone_achieved"]])) ||
    asText(readFirst(input.longitudinalState, [["milestoneAchieved"], ["milestone_achieved"]])) ||
    asTextList(readFirst(input.progressionState, [["activeMilestones"]]))[0] ||
    null;

  const statusSignals = [
    asText(readFirst(payload, [["progressionStatus"], ["progression_status"]])),
    asText(readFirst(currentSnapshot, [["progressionStatus"], ["progression_status"]])),
    asText(readFirst(input.longitudinalState, [["progressionStatus"], ["progression_status"]])),
  ].filter((item): item is string => Boolean(item));

  const allChangeSignals = [...functionalChanges, ...statusSignals, ...(milestone ? [milestone] : [])];
  const improvementSignal = allChangeSignals.find(describesImprovement) || null;
  const safetySignal = allChangeSignals.find(describesSafetyConcern) || null;

  const activeBarriers = asTextList(
    readFirst(input.progressionState, [["activeBarriers"], ["active_barriers"]])
  );
  const currentBarrier =
    asText(
      readFirst(input.longitudinalState, [
        ["currentDominantBarrier"],
        ["current_dominant_barrier"],
        ["currentLimitingFactor"],
        ["current_limiting_factor"],
      ])
    ) || activeBarriers[0] || null;
  const previousBarrier = asText(
    readFirst(previousSnapshot, [
      ["currentDominantBarrier"],
      ["current_dominant_barrier"],
      ["currentLimitingFactor"],
      ["current_limiting_factor"],
    ])
  );
  const unresolvedBarrier = currentBarrier || previousBarrier;

  const reassessmentSignal =
    asTextList(
      readFirst(input.progressionState, [["reassessmentTriggers"], ["reassessment_triggers"]])
    )[0] ||
    asTextList(
      readFirst(input.continuityInterpretation, [
        ["continuityAlerts"],
        ["continuity_alerts"],
        ["operationalDriftSignals"],
      ])
    )[0] ||
    null;

  const treatmentDirectionChanged =
    readBoolean(payload, [["treatmentDirectionChanged"], ["treatment_direction_changed"]]) ??
    readBoolean(currentSnapshot, [["treatmentDirectionChanged"], ["treatment_direction_changed"]]) ??
    readBoolean(input.longitudinalState, [["treatmentDirectionChanged"], ["treatment_direction_changed"]]);

  const stableSignal =
    statusSignals.some(describesStablePattern) ||
    (treatmentDirectionChanged === false && !improvementSignal && !safetySignal);

  return {
    improvementSignal,
    safetySignal,
    unresolvedBarrier,
    reassessmentSignal,
    stableSignal,
    treatmentDirectionChanged,
    readiness:
      normalize(
        asText(
          readFirst(input.progressionState, [
            ["advancementReadiness"],
            ["advancement_readiness"],
          ])
        ) || ""
      ),
    milestone,
  };
}

function classifyExplanation(context: SignalContext): ChangeExplanationType {
  const hasSafetyConstraint = Boolean(context.safetySignal || context.reassessmentSignal);

  if (context.improvementSignal && hasSafetyConstraint) return "deferred";
  if (context.treatmentDirectionChanged === true) return "changed";
  if (context.improvementSignal || context.readiness === "high") return "progressing";
  if (context.stableSignal) return "stable";
  if (hasSafetyConstraint || context.unresolvedBarrier) return "monitoring";
  return "stable";
}

const CONCLUSION_LABELS: Record<ConclusionType, string> = {
  current_focus: "current focus",
  attention_required: "attention priority",
  next_action: "next action",
};

function buildSummary(
  conclusionType: ConclusionType,
  explanationType: ChangeExplanationType
): string {
  const label = CONCLUSION_LABELS[conclusionType];
  const summaries: Record<ChangeExplanationType, string> = {
    changed: `The ${label} changed because the latest review documented a meaningful shift in treatment direction.`,
    stable: `The ${label} remains appropriate because no meaningful new evidence supports changing it.`,
    progressing: `The ${label} reflects documented improvement while preserving the clinical review needed before further advancement.`,
    deferred: `Improvement is present, but a safety or reassessment concern prevents the ${label} from advancing further.`,
    monitoring: `The ${label} remains active because the issue is still clinically relevant, even if it is not newly dominant.`,
  };
  return summaries[explanationType];
}

function improvementFactor(context: SignalContext): ChangeFactor | null {
  const source = context.improvementSignal || context.milestone;
  if (!source) return null;
  const activity = inferActivity(source);
  return {
    factorLabel: activity,
    changeType: "improved",
    explanation: `${activity} improved compared with the prior status rather than remaining unchanged.`,
    clinicalImpact:
      context.readiness === "high"
        ? "This supports clinician review of whether the current plan can advance."
        : "This supports progression-oriented treatment while confirming readiness before changing the plan.",
  };
}

function unresolvedFactor(context: SignalContext): ChangeFactor | null {
  if (!context.unresolvedBarrier) return null;
  const barrier = clinicianLabel(context.unresolvedBarrier);
  return {
    factorLabel: "Unresolved limitation",
    changeType: "unchanged",
    explanation: `${barrier} remains active after the latest review despite any documented gains.`,
    clinicalImpact: "This continuing limitation keeps the maintained conclusion clinically relevant.",
  };
}

function safetyFactor(context: SignalContext): ChangeFactor | null {
  const source = context.safetySignal || context.reassessmentSignal;
  if (!source) return null;
  const normalized = normalize(source);
  const activity = inferActivity(source).toLowerCase();

  if (context.safetySignal && normalized.includes("near fall")) {
    return {
      factorLabel: "New safety event",
      changeType: "new",
      explanation: context.improvementSignal
        ? `A newly reported near-fall increased concern about ${activity} despite otherwise positive functional progression.`
        : `A newly reported near-fall increased concern about ${activity} compared with the prior status.`,
      clinicalImpact: "Advancement should remain deferred until safety reliability is confirmed.",
    };
  }
  if (context.safetySignal && /\bfall\b/.test(normalized)) {
    return {
      factorLabel: "New safety event",
      changeType: "new",
      explanation: context.improvementSignal
        ? "A newly reported fall increased safety concern despite otherwise positive functional progression."
        : "A newly reported fall increased safety concern compared with the prior status.",
      clinicalImpact: "The new event outweighs advancement signals until current risk is reviewed.",
    };
  }

  return {
    factorLabel: context.safetySignal ? "Safety change" : "Reassessment need",
    changeType: context.safetySignal ? "worsened" : "new",
    explanation: context.safetySignal
      ? `${clinicianLabel(activity)} became less reliable than the prior status indicated.`
      : "A current reassessment concern limits confidence in advancing the maintained conclusion.",
    clinicalImpact: "The plan should preserve safety and reassessment safeguards before progression.",
  };
}

function stableFactor(): ChangeFactor {
  return {
    factorLabel: "Clinical pattern",
    changeType: "unchanged",
    explanation: "The latest review did not document a meaningful shift in the pattern supporting this conclusion.",
    clinicalImpact: "Maintaining the conclusion avoids changing treatment direction without new clinical evidence.",
  };
}

export function buildConclusionChangeExplanation(
  input: BuildConclusionChangeExplanationInput
): ConclusionChangeExplanation {
  const context = collectSignalContext(input);
  const explanationType = classifyExplanation(context);
  const factors = [
    improvementFactor(context),
    unresolvedFactor(context),
    safetyFactor(context),
  ].filter((factor): factor is ChangeFactor => Boolean(factor));

  if (factors.length === 0 || (explanationType === "stable" && !context.improvementSignal)) {
    factors.unshift(stableFactor());
  }

  return {
    conclusionType: input.conclusionType,
    explanationType,
    summary: buildSummary(input.conclusionType, explanationType),
    factors: factors.slice(0, 3),
  };
}

export function buildConclusionChangeExplanationSet(
  input: BuildConclusionChangeExplanationSetInput
): Record<ConclusionType, ConclusionChangeExplanation> {
  return {
    current_focus: buildConclusionChangeExplanation({
      ...input,
      conclusionType: "current_focus",
      conclusion: input.conclusions.current_focus,
    }),
    attention_required: buildConclusionChangeExplanation({
      ...input,
      conclusionType: "attention_required",
      conclusion: input.conclusions.attention_required,
    }),
    next_action: buildConclusionChangeExplanation({
      ...input,
      conclusionType: "next_action",
      conclusion: input.conclusions.next_action,
    }),
  };
}
