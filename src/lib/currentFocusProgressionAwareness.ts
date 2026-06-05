type AwarenessTrend = "progress" | "regression" | "stabilization" | null;

type CurrentFocusProgressionAwarenessInput = {
  currentFocus: string;
  progressionState?: unknown;
  currentLongitudinalState?: unknown;
  clinicalAttentionState?: unknown;
  latestEventPayload?: unknown;
};

type ProgressionAwarenessSignal = {
  trend: Exclude<AwarenessTrend, null>;
  progressionStatus?: string | null;
  milestoneAchieved?: string | null;
  advancementReadiness?: string | null;
  functionalChange?: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readUnknown = (source: unknown, keys: string[]): unknown => {
  if (!isRecord(source)) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
};

const readText = (source: unknown, keys: string[]): string | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return null;
};

const readTextList = (source: unknown, keys: string[]): string[] => {
  const value = readUnknown(source, keys);

  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string | number | boolean =>
          typeof item === "string" || typeof item === "number" || typeof item === "boolean"
      )
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value.trim()];

  return [];
};

const normalize = (value: string | null | undefined) =>
  String(value || "").trim().toLowerCase();

const stripTerminalPunctuation = (value: string) => value.trim().replace(/[.!?]+$/, "");

const lowerFirst = (value: string) => {
  const trimmed = stripTerminalPunctuation(value);
  if (!trimmed) return "";

  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
};

const hasExistingTrajectoryLanguage = (currentFocus: string) => {
  const normalized = normalize(currentFocus);

  return [
    "improving",
    "improved",
    "progressing",
    "progression",
    "milestone",
    "becoming more consistent",
    "worsening",
    "declining",
    "regression",
    "stabilizing",
    "plateau",
  ].some((phrase) => normalized.includes(phrase));
};

const deriveTrendFromStatus = (status: string | null): AwarenessTrend => {
  const normalized = normalize(status);
  if (!normalized) return null;

  if (
    normalized.includes("regression") ||
    normalized.includes("worsen") ||
    normalized.includes("declin") ||
    normalized.includes("deteriorat")
  ) {
    return "regression";
  }

  if (
    normalized.includes("progressing") ||
    normalized.includes("improv") ||
    normalized.includes("faster than expected")
  ) {
    return "progress";
  }

  if (
    normalized.includes("plateau") ||
    normalized.includes("minimal progress") ||
    normalized.includes("stabiliz")
  ) {
    return "stabilization";
  }

  return null;
};

const deriveTrendFromAdvancementReadiness = (
  readiness: string | null
): AwarenessTrend => {
  const normalized = normalize(readiness);

  if (normalized === "high" || normalized.includes("ready")) return "progress";
  if (normalized === "partial" || normalized.includes("emerging")) return "progress";

  return null;
};

const deriveTrendFromFunctionalChange = (change: string | null): AwarenessTrend => {
  const normalized = normalize(change);
  if (!normalized) return null;

  if (
    normalized.includes("worse") ||
    normalized.includes("declin") ||
    normalized.includes("regress") ||
    normalized.includes("less consistent") ||
    normalized.includes("reduced")
  ) {
    return "regression";
  }

  if (
    normalized.includes("improv") ||
    normalized.includes("more consistent") ||
    normalized.includes("increased") ||
    normalized.includes("achieved") ||
    normalized.includes("better")
  ) {
    return "progress";
  }

  return null;
};

const deriveSubject = (currentFocus: string) => {
  const cleanFocus = stripTerminalPunctuation(currentFocus);
  const match = cleanFocus.match(
    /^(.+?)\s+(?:remains?|continues? to be|is|are)\s+/i
  );

  if (match?.[1]?.trim()) return match[1].trim();

  return "Current functional performance";
};

const deriveProgressQualifier = (signal: ProgressionAwarenessSignal) => {
  if (signal.milestoneAchieved) return ` after the milestone: ${signal.milestoneAchieved}`;
  if (signal.functionalChange) return ` with ${lowerFirst(signal.functionalChange)}`;

  const readiness = normalize(signal.advancementReadiness);
  if (readiness === "high") return " with stronger advancement readiness";
  if (readiness === "partial") return " with emerging advancement readiness";

  return "";
};

const deriveRegressionQualifier = (signal: ProgressionAwarenessSignal) => {
  if (signal.functionalChange) return ` with ${lowerFirst(signal.functionalChange)}`;
  if (signal.progressionStatus) return ` with ${lowerFirst(signal.progressionStatus)}`;

  return "";
};

const buildProgressionSignal = ({
  progressionState,
  currentLongitudinalState,
  clinicalAttentionState,
  latestEventPayload,
}: Omit<CurrentFocusProgressionAwarenessInput, "currentFocus">): ProgressionAwarenessSignal | null => {
  const progressionStatus =
    readText(currentLongitudinalState, ["progressionStatus", "progression_status"]) ||
    readText(clinicalAttentionState, ["progressionStatus", "progression_status"]) ||
    readText(latestEventPayload, ["progressionStatus", "progression_status"]);
  const milestoneAchieved =
    readText(currentLongitudinalState, ["milestoneAchieved", "milestone_achieved"]) ||
    readText(latestEventPayload, ["milestoneAchieved", "milestone_achieved"]);
  const advancementReadiness = readText(progressionState, [
    "advancementReadiness",
    "advancement_readiness",
  ]);
  const functionalChange =
    readTextList(currentLongitudinalState, ["functionalChanges", "functional_changes"])[0] ||
    readTextList(latestEventPayload, ["functionalChanges", "functional_changes"])[0] ||
    null;

  const statusTrend = deriveTrendFromStatus(progressionStatus);
  const functionalTrend = deriveTrendFromFunctionalChange(functionalChange);
  const readinessTrend = deriveTrendFromAdvancementReadiness(advancementReadiness);
  const trend = statusTrend || functionalTrend || (milestoneAchieved ? "progress" : readinessTrend);

  if (!trend) return null;

  return {
    trend,
    progressionStatus,
    milestoneAchieved,
    advancementReadiness,
    functionalChange,
  };
};

export function buildProgressionAwareCurrentFocus({
  currentFocus,
  progressionState,
  currentLongitudinalState,
  clinicalAttentionState,
  latestEventPayload,
}: CurrentFocusProgressionAwarenessInput): string {
  const trimmedFocus = currentFocus.trim();
  if (
    !trimmedFocus ||
    normalize(trimmedFocus) === "no operational emphasis generated" ||
    hasExistingTrajectoryLanguage(trimmedFocus)
  ) {
    return trimmedFocus;
  }

  const signal = buildProgressionSignal({
    progressionState,
    currentLongitudinalState,
    clinicalAttentionState,
    latestEventPayload,
  });

  if (!signal) return trimmedFocus;

  const subject = deriveSubject(trimmedFocus);
  const remainingReality = lowerFirst(trimmedFocus);

  if (signal.trend === "regression") {
    return `${subject} is worsening${deriveRegressionQualifier(signal)}, and ${remainingReality}.`;
  }

  if (signal.trend === "stabilization") {
    return `${subject} is stabilizing without clear advancement, and ${remainingReality}.`;
  }

  return `${subject} is improving${deriveProgressQualifier(signal)}, though ${remainingReality}.`;
}
