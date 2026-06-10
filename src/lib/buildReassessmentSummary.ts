import type { ConclusionChangeExplanation } from "@/lib/buildConclusionChangeExplanation";
import type { ConstraintProgressionNarrative } from "@/lib/buildConstraintProgressionNarrative";
import type { ProgressEvidence, ProgressEvidenceItem } from "@/lib/buildProgressEvidence";

export type ReassessmentSummary = {
  summary: string;
  sections: {
    currentStatus: string;
    progressObserved: string;
    remainingLimitations: string;
    rationaleForContinuedFocus: string;
    recommendation: string;
  };
};

type BuildReassessmentSummaryInput = {
  currentFocus?: string | null;
  attentionRequired?: string | null;
  nextAction?: string | null;
  changeExplanation?: ConclusionChangeExplanation | string | null;
  progressionConstraint?: ConstraintProgressionNarrative | string | null;
  progressEvidence?: ProgressEvidence | null;
};

const FALLBACK_FOCUS = "Continue the maintained treatment focus";
const FALLBACK_ATTENTION = "No additional attention priority is identified in the maintained assets";
const FALLBACK_RECOMMENDATION =
  "Continue the current focus and update progression when new findings are available.";

function cleanText(value: string | null | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function withoutTerminalPunctuation(value: string): string {
  return cleanText(value).replace(/[.!?;:]+$/g, "");
}

function asSentence(value: string): string {
  const text = cleanText(value);
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function lowercaseFirst(value: string): string {
  const text = withoutTerminalPunctuation(value);
  if (!text) return text;
  return `${text[0].toLowerCase()}${text.slice(1)}`;
}

function truncateWords(value: string, maximumWords: number): string {
  const words = cleanText(value).split(" ").filter(Boolean);
  if (words.length <= maximumWords) return asSentence(words.join(" "));
  return `${words.slice(0, maximumWords).join(" ").replace(/[,:;]+$/g, "")}…`;
}

function includesMeaningfully(container: string, candidate: string): boolean {
  const normalizedContainer = cleanText(container).toLowerCase();
  const normalizedCandidate = withoutTerminalPunctuation(candidate).toLowerCase();
  return Boolean(normalizedCandidate) && normalizedContainer.includes(normalizedCandidate);
}

function describeEvidenceItem(item: ProgressEvidenceItem): string {
  return `${withoutTerminalPunctuation(item.label)}: ${lowercaseFirst(item.explanation)}`;
}

function selectProgressEvidence(progressEvidence?: ProgressEvidence | null): ProgressEvidenceItem[] {
  if (!progressEvidence) return [];

  const candidates = [...progressEvidence.improved, ...progressEvidence.milestones];
  const selected: ProgressEvidenceItem[] = [];

  for (const candidate of candidates) {
    const duplicate = selected.some(
      (item) =>
        item.label.toLowerCase() === candidate.label.toLowerCase() ||
        includesMeaningfully(item.explanation, candidate.explanation) ||
        includesMeaningfully(candidate.explanation, item.explanation)
    );
    if (!duplicate) selected.push(candidate);
    if (selected.length === 2) break;
  }

  return selected;
}

function changeSummary(changeExplanation?: ConclusionChangeExplanation | string | null): string {
  if (typeof changeExplanation === "string") return cleanText(changeExplanation);
  return cleanText(changeExplanation?.summary);
}

function constraintText(
  progressionConstraint?: ConstraintProgressionNarrative | string | null
): string {
  if (typeof progressionConstraint === "string") return cleanText(progressionConstraint);
  if (!progressionConstraint) return "";

  const primaryConstraint =
    progressionConstraint.unresolvedLimitation || progressionConstraint.whatStillBlocksProgression[0];

  if (primaryConstraint) {
    return `${withoutTerminalPunctuation(primaryConstraint.label)}: ${lowercaseFirst(
      primaryConstraint.explanation
    )}`;
  }

  return cleanText(progressionConstraint.summary || progressionConstraint.headline);
}

function continuedFocusRationale(
  progressionConstraint: ConstraintProgressionNarrative | string | null | undefined,
  currentFocus: string
): string {
  if (typeof progressionConstraint !== "string" && progressionConstraint) {
    const maintainedRationale = cleanText(
      progressionConstraint.whyRecommendationRemainsAppropriate
    );
    if (maintainedRationale) {
      return `${asSentence(maintainedRationale)} The maintained treatment focus remains: ${asSentence(
        currentFocus
      )}`;
    }
  }

  const constraint = constraintText(progressionConstraint);
  return constraint
    ? `The maintained treatment focus remains clinically appropriate because ${lowercaseFirst(
        constraint
      )}. Current focus: ${asSentence(currentFocus)}`
    : `The maintained treatment focus remains clinically appropriate while current performance is verified. Current focus: ${asSentence(
        currentFocus
      )}`;
}

export function buildReassessmentSummary({
  currentFocus,
  attentionRequired,
  nextAction,
  changeExplanation,
  progressionConstraint,
  progressEvidence,
}: BuildReassessmentSummaryInput): ReassessmentSummary {
  const maintainedFocus = cleanText(currentFocus) || FALLBACK_FOCUS;
  const maintainedAttention = cleanText(attentionRequired) || FALLBACK_ATTENTION;
  const maintainedNextAction = cleanText(nextAction) || FALLBACK_RECOMMENDATION;

  const currentStatus = truncateWords(
    `At this reassessment, the current treatment focus: ${asSentence(maintainedFocus)} Attention required: ${asSentence(
      maintainedAttention
    )}`,
    48
  );

  const selectedEvidence = selectProgressEvidence(progressEvidence);
  const evidenceNarrative = selectedEvidence.map(describeEvidenceItem).join("; ");
  const timeframe = cleanText(progressEvidence?.timeframe);
  const maintainedChangeSummary = changeSummary(changeExplanation);
  const progressObserved = truncateWords(
    selectedEvidence.length > 0
      ? `${timeframe ? `During ${withoutTerminalPunctuation(timeframe)}, ` : ""}maintained progress evidence shows ${evidenceNarrative}. ${
          maintainedChangeSummary || "These findings support the current progression interpretation."
        }`
      : maintainedChangeSummary ||
          "The maintained assets do not yet identify objective progress evidence for this reassessment period.",
    58
  );

  const primaryConstraint = constraintText(progressionConstraint);
  const attentionAddsContext =
    primaryConstraint && !includesMeaningfully(primaryConstraint, maintainedAttention);
  const remainingLimitations = truncateWords(
    primaryConstraint
      ? `${asSentence(primaryConstraint)}${
          attentionAddsContext
            ? ` This remains clinically relevant because ${lowercaseFirst(maintainedAttention)}.`
            : ""
        }`
      : `Remaining limitations continue to require attention: ${lowercaseFirst(
          maintainedAttention
        )}.`,
    48
  );

  const rationaleForContinuedFocus = truncateWords(
    continuedFocusRationale(progressionConstraint, maintainedFocus),
    52
  );

  const recommendation = truncateWords(maintainedNextAction, 34);

  const sections = {
    currentStatus,
    progressObserved,
    remainingLimitations,
    rationaleForContinuedFocus,
    recommendation,
  };

  return {
    summary: Object.values(sections).join("\n\n"),
    sections,
  };
}
