import type { ConstraintProgressionNarrative } from "@/lib/buildConstraintProgressionNarrative";
import type { SessionFocus } from "@/lib/buildSessionFocus";

export type OrientationBrief = {
  headline: string;
  briefText: string;
  estimatedDurationSeconds: number;
  sections: {
    context?: string;
    sessionFocus?: string;
    attentionRequired?: string;
  };
};

type BuildOrientationBriefInput = {
  quickOrientationSummary?: string | null;
  currentFocus?: string | null;
  sessionFocus?: SessionFocus | string | null;
  attentionRequired?: string | null;
  progressionConstraint?: ConstraintProgressionNarrative | string | null;
};

const FALLBACK_CONTEXT =
  "Current performance remains guided by the maintained treatment priorities and support needs.";
const FALLBACK_FOCUS = "the maintained treatment focus";
const FALLBACK_SESSION_FOCUS =
  "continue the maintained treatment emphasis while observing current performance";
const MIN_WORDS = 50;
const MAX_SPOKEN_WORDS = 82;
const WORDS_PER_SECOND = 2.75;

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function withoutTerminalPunctuation(value: string): string {
  return value.replace(/[.!?]+$/, "");
}

function lowercaseFirst(value: string): string {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

function asSentence(value: string): string {
  const text = cleanText(value);
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function truncateWords(value: string, limit: number): string {
  const words = cleanText(value).split(" ").filter(Boolean);
  if (words.length <= limit) return asSentence(words.join(" "));

  const selected = words.slice(0, limit);
  const danglingWord = /^(?:a|an|and|before|but|for|in|of|on|or|the|to|whether|with)$/i;
  while (selected.length > 1 && danglingWord.test(selected.at(-1) || "")) {
    selected.pop();
  }
  return `${withoutTerminalPunctuation(selected.join(" "))}.`;
}

function wordCount(value: string): number {
  return cleanText(value).split(" ").filter(Boolean).length;
}

function constraintHeadline(
  progressionConstraint?: ConstraintProgressionNarrative | string | null
): string {
  if (typeof progressionConstraint === "string") return cleanText(progressionConstraint);
  return cleanText(progressionConstraint?.headline || progressionConstraint?.summary);
}

function sessionFocusText(sessionFocus?: SessionFocus | string | null): {
  headline: string;
  rationale: string;
} {
  if (typeof sessionFocus === "string") {
    return { headline: cleanText(sessionFocus), rationale: "" };
  }

  return {
    headline: cleanText(sessionFocus?.headline),
    rationale: cleanText(sessionFocus?.rationale),
  };
}

function isMeaningfulAttention(value?: string | null): boolean {
  const attention = cleanText(value).toLowerCase();
  if (!attention) return false;

  return !(
    attention.startsWith("no active review need") ||
    attention.startsWith("no active review issue") ||
    attention.startsWith("no clinical attention statement")
  );
}

export function buildOrientationBrief({
  quickOrientationSummary,
  currentFocus,
  sessionFocus,
  attentionRequired,
  progressionConstraint,
}: BuildOrientationBriefInput): OrientationBrief {
  const maintainedFocus = cleanText(currentFocus) || FALLBACK_FOCUS;
  const currentReality =
    constraintHeadline(progressionConstraint) ||
    cleanText(quickOrientationSummary) ||
    maintainedFocus ||
    FALLBACK_CONTEXT;
  const maintainedSessionFocus = sessionFocusText(sessionFocus);
  const sessionHeadline = maintainedSessionFocus.headline || FALLBACK_SESSION_FOCUS;

  const context = [
    truncateWords(currentReality, 14),
    `Current treatment priority: ${asSentence(
      lowercaseFirst(withoutTerminalPunctuation(truncateWords(maintainedFocus, 10)))
    )}`,
  ].join(" ");

  let session = [
    `For today’s visit, ${asSentence(
      lowercaseFirst(withoutTerminalPunctuation(truncateWords(sessionHeadline, 16)))
    )}`,
    maintainedSessionFocus.rationale
      ? truncateWords(maintainedSessionFocus.rationale, 14)
      : "Use current performance to guide the visit without adding new conclusions.",
  ].join(" ");

  const attention = isMeaningfulAttention(attentionRequired)
    ? `Keep in mind: ${asSentence(
        lowercaseFirst(withoutTerminalPunctuation(truncateWords(cleanText(attentionRequired), 14)))
      )}`
    : undefined;

  let briefText = [context, session, attention].filter(Boolean).join(" ");
  const orientationClosers = [
    "Carry this maintained understanding into the home while remaining responsive to current performance and support needs.",
    "Keep the current priorities visible as the visit unfolds and the patient responds to today’s treatment.",
  ];
  for (const closer of orientationClosers) {
    if (wordCount(briefText) >= MIN_WORDS) break;
    session = `${session} ${closer}`;
    briefText = [context, session, attention].filter(Boolean).join(" ");
  }

  if (wordCount(briefText) > MAX_SPOKEN_WORDS) {
    briefText = truncateWords(briefText, MAX_SPOKEN_WORDS);
  }

  const estimatedDurationSeconds = Math.min(
    30,
    Math.max(20, Math.round(wordCount(briefText) / WORDS_PER_SECOND))
  );

  return {
    headline: `Today: ${withoutTerminalPunctuation(truncateWords(sessionHeadline, 16))}`,
    briefText,
    estimatedDurationSeconds,
    sections: {
      context,
      sessionFocus: session,
      ...(attention ? { attentionRequired: attention } : {}),
    },
  };
}
