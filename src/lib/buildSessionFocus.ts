import type { ConstraintProgressionNarrative } from "@/lib/buildConstraintProgressionNarrative";
import type { ProgressEvidence } from "@/lib/buildProgressEvidence";

export type SessionIntent =
  | "validate"
  | "observe"
  | "train"
  | "reassess"
  | "modify_environment"
  | "continue_plan";

export type SessionFocus = {
  headline: string;
  sessionIntent: SessionIntent;
  rationale: string;
  focusTargets: string[];
};

type BuildSessionFocusInput = {
  currentFocus?: string | null;
  attentionRequired?: string | null;
  nextAction?: string | null;
  progressionConstraint?: ConstraintProgressionNarrative | string | null;
  progressEvidence?: ProgressEvidence | null;
  clinicalDecisionModel?: unknown;
  continuityInterpretation?: unknown;
  longitudinalState?: unknown;
};

type Signal = {
  text: string;
  label?: string;
};

const SAFETY_PATTERN = /\b(safety|unsafe|fall|near[ -]?fall|loss of balance|safety margin|hazard|supervision|guarding)\b/i;
const PROGRESSION_DEFERRAL_PATTERN = /\b(defer|deferred|not ready|readiness|before (?:advanc|progress)|consisten|reliab|variab|plateau)\w*/i;
const CAREGIVER_PATTERN = /\b(caregiver|family|support person|cueing|carryover|confidence|standby assist|supervision)\b/i;
const ENVIRONMENT_PATTERN = /\b(environment|home setup|bathroom setup|equipment|device|grab bar|commode|shower chair|access barrier|clutter|lighting)\b/i;
const REASSESS_PATTERN = /\b(reassess|re-evaluat|reevaluat|new decline|regression|setback|worsen|change in status)\w*/i;
const PROGRESS_PATTERN = /\b(improv|progress|gain|reduc(?:ed|tion)|milestone|advanced?)\w*/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function clinicianText(value: string): string {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function lowerFirst(value: string): string {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

function normalize(value: string): string {
  return clinicianText(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readPath(source: unknown, path: string[]): unknown {
  let current = source;
  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function collectUnknownText(value: unknown, depth = 0): string[] {
  if (depth > 3) return [];
  if (typeof value === "string") return cleanText(value) ? [cleanText(value)] : [];
  if (Array.isArray(value)) return value.flatMap((item) => collectUnknownText(item, depth + 1));
  if (!isRecord(value)) return [];
  return Object.values(value).flatMap((item) => collectUnknownText(item, depth + 1));
}

function constraintSignals(value: BuildSessionFocusInput["progressionConstraint"]): Signal[] {
  if (typeof value === "string") return [{ text: cleanText(value) }].filter((item) => item.text);
  if (!value) return [];

  return [
    { text: cleanText(value.headline) },
    { text: cleanText(value.summary) },
    value.unresolvedLimitation
      ? {
          label: cleanText(value.unresolvedLimitation.label),
          text: cleanText(value.unresolvedLimitation.explanation),
        }
      : null,
    ...value.whatStillBlocksProgression.map((item) => ({
      label: cleanText(item.label),
      text: cleanText(item.explanation),
    })),
    { text: cleanText(value.whyRecommendationRemainsAppropriate) },
  ].filter((item): item is Signal => Boolean(item?.text));
}

function evidenceSignals(value?: ProgressEvidence | null): Signal[] {
  if (!value) return [];
  return [
    ...value.improved,
    ...value.milestones,
    ...value.stillLimiting,
    ...value.safetyConsiderations,
  ]
    .map((item) => ({ label: cleanText(item.label), text: cleanText(item.explanation) }))
    .filter((item) => item.text || item.label);
}

function findActivity(texts: string[]): string {
  const joined = texts.join(" ");
  const patterns = [
    /\b(shower transfers?)\b/i,
    /\b(toilet transfers?)\b/i,
    /\b(bath(?:ing)? transfers?)\b/i,
    /\b(bed transfers?)\b/i,
    /\b(stair (?:management|negotiation))\b/i,
    /\b(bath(?:ing)?)\b/i,
    /\b(dress(?:ing)?)\b/i,
    /\b(toilet(?:ing)?)\b/i,
    /\b(functional mobility)\b/i,
    /\b(medication management)\b/i,
    /\b(meal preparation)\b/i,
  ];

  for (const pattern of patterns) {
    const match = joined.match(pattern);
    if (match) return lowerFirst(clinicianText(match[1]));
  }

  return "the priority activity";
}

function uniqueTargets(candidates: string[], sourceConclusions: string[]): string[] {
  const conclusionValues = sourceConclusions.map(normalize).filter(Boolean);
  const selected: string[] = [];

  for (const candidate of candidates) {
    const cleaned = clinicianText(candidate).replace(/[.!?]+$/, "");
    const normalized = normalize(cleaned);
    if (!normalized || conclusionValues.includes(normalized)) continue;
    if (selected.some((item) => normalize(item) === normalized)) continue;
    selected.push(cleaned[0].toUpperCase() + cleaned.slice(1));
    if (selected.length === 3) break;
  }

  return selected;
}

function contains(pattern: RegExp, signals: Signal[]): boolean {
  return signals.some(({ label, text }) => pattern.test(`${label || ""} ${text}`));
}

function hasHighSafetyRisk(source: unknown): boolean {
  const risk = cleanText(
    readPath(source, ["safetyRiskLevel"]) ?? readPath(source, ["safety_risk_level"])
  );
  return /^(high|moderate|medium|elevated)$/i.test(risk);
}

export function buildSessionFocus(input: BuildSessionFocusInput): SessionFocus {
  const currentFocus = cleanText(input.currentFocus);
  const attentionRequired = cleanText(input.attentionRequired);
  const nextAction = cleanText(input.nextAction);
  const maintainedConclusions = [currentFocus, attentionRequired, nextAction];
  const constraints = constraintSignals(input.progressionConstraint);
  const evidence = evidenceSignals(input.progressEvidence);
  const runtimeSignals: Signal[] = [
    ...constraints,
    ...evidence,
    ...collectUnknownText(input.clinicalDecisionModel).map((text) => ({ text })),
    ...collectUnknownText(input.continuityInterpretation).map((text) => ({ text })),
    ...collectUnknownText(input.longitudinalState).map((text) => ({ text })),
    { text: attentionRequired },
    { text: nextAction },
  ].filter((item) => item.text);
  const activity = findActivity([currentFocus, ...runtimeSignals.flatMap(({ label, text }) => [label || "", text])]);

  const safetyConcern = hasHighSafetyRisk(input.clinicalDecisionModel) || contains(SAFETY_PATTERN, runtimeSignals);
  const progressExists = evidence.some(({ label, text }) => PROGRESS_PATTERN.test(`${label || ""} ${text}`));
  const progressionDeferred = contains(PROGRESSION_DEFERRAL_PATTERN, runtimeSignals);
  const caregiverConstraint = contains(CAREGIVER_PATTERN, [...constraints, ...runtimeSignals]);
  const environmentalConstraint = contains(ENVIRONMENT_PATTERN, [...constraints, ...runtimeSignals]);
  const reassessmentNeed = contains(REASSESS_PATTERN, runtimeSignals);

  const labelledTargets = [...evidence, ...constraints]
    .map(({ label }) => label || "")
    .filter(Boolean);
  const sharedTargets = uniqueTargets(labelledTargets, maintainedConclusions);

  if (safetyConcern) {
    return {
      headline: `Validate safety consistency during ${activity} and determine whether current support remains appropriate.`,
      sessionIntent: "validate",
      rationale: "Safety should be confirmed under routine conditions before support or progression expectations change.",
      focusTargets: uniqueTargets(
        [`${activity} safety`, ...sharedTargets, caregiverConstraint ? "Caregiver support level" : "Current assistance level"],
        maintainedConclusions
      ),
    };
  }

  if (progressionDeferred && progressExists) {
    return {
      headline: `Observe ${activity} under routine conditions to confirm that recent gains are consistent and progression-ready.`,
      sessionIntent: "observe",
      rationale: "Progress is present, but consistency and readiness should be verified before advancement.",
      focusTargets: uniqueTargets(
        [`${activity} consistency`, ...sharedTargets, "Readiness for progression"],
        maintainedConclusions
      ),
    };
  }

  if (caregiverConstraint) {
    return {
      headline: `Train caregiver support during ${activity} and reassess whether cueing or assistance can be adjusted.`,
      sessionIntent: "train",
      rationale: "Caregiver support and carryover remain relevant to reliable performance between visits.",
      focusTargets: uniqueTargets(
        ["Caregiver technique", `${activity} cueing`, ...sharedTargets, "Carryover between visits"],
        maintainedConclusions
      ),
    };
  }

  if (environmentalConstraint) {
    return {
      headline: `Review the routine setup for ${activity} and determine whether environmental changes are needed.`,
      sessionIntent: "modify_environment",
      rationale: "The current environment or equipment may still limit safe, reliable task performance.",
      focusTargets: uniqueTargets(
        [`${activity} setup`, "Equipment fit and placement", ...sharedTargets, "Environmental access"],
        maintainedConclusions
      ),
    };
  }

  if (reassessmentNeed) {
    return {
      headline: `Reassess ${activity} performance and determine whether the current treatment emphasis remains appropriate.`,
      sessionIntent: "reassess",
      rationale: "A change in status warrants renewed review before the current approach is continued unchanged.",
      focusTargets: uniqueTargets(
        [`${activity} performance`, ...sharedTargets, "Current support needs"],
        maintainedConclusions
      ),
    };
  }

  return {
    headline: `Continue reinforcing ${activity} while monitoring for meaningful changes in consistency or support needs.`,
    sessionIntent: "continue_plan",
    rationale: "No active review issue is present, so today’s visit should continue the maintained treatment emphasis without added urgency.",
    focusTargets: uniqueTargets(
      [`${activity} consistency`, ...sharedTargets, "Current support needs"],
      maintainedConclusions
    ),
  };
}
