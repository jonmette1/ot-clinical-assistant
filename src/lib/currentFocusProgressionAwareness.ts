type AwarenessTrend = "progress" | "faster_progress" | "regression" | "stabilization" | null;

type CurrentFocusProgressionAwarenessInput = {
  currentFocus: string;
  progressionState?: unknown;
  currentLongitudinalState?: unknown;
  clinicalAttentionState?: unknown;
  latestEventPayload?: unknown;
  dominantBarriers?: unknown;
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

const joinReadableList = (items: string[]) => {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const asTextList = (value: unknown): string[] => {
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

const hasExistingTrajectoryLanguage = (currentFocus: string) => {
  const normalized = normalize(currentFocus);

  return [
    "moving in the right direction",
    "moving ahead faster",
    "becoming less reliable",
    "clinically stable",
    "stabilizing without clear advancement",
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

  if (normalized.includes("faster than expected")) return "faster_progress";

  if (normalized.includes("progressing") || normalized.includes("improv")) {
    return "progress";
  }

  if (
    normalized.includes("plateau") ||
    normalized.includes("minimal progress") ||
    normalized.includes("no meaningful change") ||
    normalized.includes("no change") ||
    normalized === "stable" ||
    normalized.includes("unchanged") ||
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
    normalized.includes("less reliable") ||
    normalized.includes("reduced")
  ) {
    return "regression";
  }

  if (
    normalized.includes("improv") ||
    normalized.includes("more consistent") ||
    normalized.includes("more reliable") ||
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
  const rawSubject = match?.[1]?.trim() || "Current functional performance";
  const normalized = normalize(rawSubject);

  if (normalized.includes("toilet transfer")) return "Toilet transfer skills";
  if (normalized.includes("shower transfer")) return "Shower transfer skills";
  if (normalized.includes("bathroom transfer")) return "Bathroom transfer performance";
  if (normalized.includes("transfer")) return "Transfer performance";
  if (normalized.includes("bath") || normalized.includes("shower")) return "Bathing participation";
  if (normalized.includes("toilet")) return "Toileting participation";

  return rawSubject;
};

const addArea = (areas: string[], area: string) => {
  if (!areas.includes(area)) areas.push(area);
};

const deriveAttentionAreas = ({
  currentFocus,
  dominantBarriers,
}: {
  currentFocus: string;
  dominantBarriers?: unknown;
}) => {
  const sourceItems = [...asTextList(dominantBarriers), currentFocus];
  const source = normalize(sourceItems.join(" "));
  const areas: string[] = [];

  if (source.includes("transfer") || source.includes("mobility")) {
    addArea(areas, "transfer stability");
  }

  if (source.includes("balance") || source.includes("strength") || source.includes("movement")) {
    addArea(areas, "physical movement control");
  }

  if (source.includes("caregiver") || source.includes("support")) {
    addArea(areas, "caregiver-supported consistency");
  }

  if (
    source.includes("bathroom") ||
    source.includes("shower") ||
    source.includes("toilet") ||
    source.includes("environment") ||
    source.includes("equipment") ||
    source.includes("setup")
  ) {
    addArea(areas, "environmental safety");
  }

  if (source.includes("sequencing") || source.includes("cue") || source.includes("cognitive")) {
    addArea(areas, "task sequencing reliability");
  }

  if (source.includes("endurance") || source.includes("fatigue")) {
    addArea(areas, "activity tolerance");
  }

  if (source.includes("safety") || areas.length < 2) {
    addArea(areas, "safety preservation");
  }

  return areas.slice(0, 3);
};

const deriveProgressEvidence = (signal: ProgressionAwarenessSignal) => {
  if (signal.milestoneAchieved) return `, with documented milestone: ${signal.milestoneAchieved}`;
  if (signal.functionalChange) return `, with documented change: ${signal.functionalChange}`;

  const readiness = normalize(signal.advancementReadiness);
  if (readiness === "high") return ", with stronger advancement readiness requiring clinician review";
  if (readiness === "partial") return ", with emerging advancement readiness requiring clinician review";

  return "";
};

const buildProgressionSignal = ({
  progressionState,
  currentLongitudinalState,
  clinicalAttentionState,
  latestEventPayload,
}: Omit<CurrentFocusProgressionAwarenessInput, "currentFocus" | "dominantBarriers">): ProgressionAwarenessSignal | null => {
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
  dominantBarriers,
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
  const subjectIsPlural = normalize(subject).endsWith("skills");
  const movementVerb = subjectIsPlural ? "are" : "is";
  const fragileVerb = subjectIsPlural ? "remain" : "remains";
  const attentionAreas = deriveAttentionAreas({ currentFocus: trimmedFocus, dominantBarriers });
  const attentionText = joinReadableList(attentionAreas);

  if (signal.trend === "regression") {
    return `Recent setbacks suggest ${subject.toLowerCase()} ${movementVerb} becoming less reliable. Focus should return to ${attentionText} before pursuing advancement goals.`;
  }

  if (signal.trend === "stabilization") {
    return `${subject} ${fragileVerb} clinically fragile. Focus remains on ${attentionText} before advancing treatment expectations.`;
  }

  if (signal.trend === "faster_progress") {
    return `${subject} ${movementVerb} moving ahead faster than expected${deriveProgressEvidence(signal)}, while clinical caution remains appropriate. Upcoming focus is centered on ${attentionText}.`;
  }

  return `${subject} ${movementVerb} moving in the right direction${deriveProgressEvidence(signal)}, while clinical caution remains appropriate. Upcoming focus is centered on ${attentionText}.`;
}
