type AttentionRequiredHeadlineInput = {
  attentionStatement?: string | null;
  category?: string | null;
  attentionDrivers?: string[] | null;
  progressionStatus?: string | null;
  functionalChanges?: string[] | null;
  milestoneAchieved?: string | null;
  caregiverChange?: string | null;
  environmentalChange?: string | null;
  medicalChange?: string | null;
  currentDominantBarrier?: string | null;
};

const NO_ACTIVE_REVIEW_PREFIX = "no active review need";
const REVIEW_LANGUAGE_PATTERN =
  /\b(verify|verified|review|reviewed|reassess|reassessed|monitor|confirmed?|confirmation)\b/i;
const PROGRESS_REPORT_PATTERN =
  /\b(milestone|achiev(?:e|ed|ement)|improv(?:e|ed|ement|ing)|progress(?:ed|ing|ion)?|demonstrates?|reduced?|increased?)\b/i;
const SAFETY_PATTERN =
  /\b(fall|falls|fell|near[- ]?fall|loss of balance|unsafe|safety|unsteady|instability|inconsistent|inconsistency|variable|fluctuat(?:e|es|ed|ing)|regression)\b/i;
const CAREGIVER_PATTERN =
  /\b(caregiver|cueing|cue|standby assistance|stand-by assistance|supervision|support needs?|support requirements?)\b/i;
const ENVIRONMENT_PATTERN =
  /\b(bathroom|home setup|environment|equipment|grab bar|shower chair|tub bench|hazard|stairs|space constraint)\b/i;
const TRANSFER_PATTERN = /\b(transfer|sit[- ]?to[- ]?stand|stand[- ]?pivot)\b/i;
const BATHING_PATTERN = /\b(bath|bathing|shower|tub)\b/i;
const PLATEAU_PATTERN = /\b(plateau|minimal progress|limited progress)\b/i;

function cleanText(value: string | null | undefined): string {
  return value?.trim() || "";
}

function combinedSignalText(input: AttentionRequiredHeadlineInput): string {
  return [
    input.attentionStatement,
    input.category,
    ...(input.attentionDrivers || []),
    input.progressionStatus,
    ...(input.functionalChanges || []),
    input.milestoneAchieved,
    input.caregiverChange,
    input.environmentalChange,
    input.medicalChange,
    input.currentDominantBarrier,
  ]
    .map(cleanText)
    .filter(Boolean)
    .join(" ");
}

function progressionVerificationHeadline(signalText: string): string {
  if (TRANSFER_PATTERN.test(signalText)) {
    return "Transfer consistency should be verified before progression decisions.";
  }

  if (CAREGIVER_PATTERN.test(signalText)) {
    return "Caregiver support needs should be reassessed before advancing independence expectations.";
  }

  if (ENVIRONMENT_PATTERN.test(signalText) && BATHING_PATTERN.test(signalText)) {
    return "Bathroom setup should be reviewed before increasing bathing independence expectations.";
  }

  return "Recent improvement should be confirmed under routine conditions before reducing support.";
}

export function buildAttentionRequiredHeadline(
  input: AttentionRequiredHeadlineInput
): string {
  const attentionStatement = cleanText(input.attentionStatement);
  const signalText = combinedSignalText(input);

  if (attentionStatement.toLowerCase().startsWith(NO_ACTIVE_REVIEW_PREFIX)) {
    return attentionStatement;
  }

  if (SAFETY_PATTERN.test(signalText)) {
    return "Recent safety concern should be reviewed before advancing the plan.";
  }

  if (
    attentionStatement &&
    REVIEW_LANGUAGE_PATTERN.test(attentionStatement) &&
    !PROGRESS_REPORT_PATTERN.test(attentionStatement)
  ) {
    return attentionStatement;
  }

  const statementIsProgressReport = PROGRESS_REPORT_PATTERN.test(attentionStatement);
  const hasProgressVerificationSignal =
    statementIsProgressReport ||
    PROGRESS_REPORT_PATTERN.test(
      [
        ...(input.functionalChanges || []),
        input.milestoneAchieved,
        input.progressionStatus === "Progressing Faster Than Expected"
          ? input.progressionStatus
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    );

  if (hasProgressVerificationSignal) {
    return progressionVerificationHeadline(signalText);
  }

  if (input.caregiverChange || input.category?.toLowerCase() === "caregiver") {
    return "Caregiver support requirements should be reassessed before reducing supervision.";
  }

  if (input.environmentalChange || input.category?.toLowerCase() === "environment") {
    return BATHING_PATTERN.test(signalText)
      ? "Bathroom setup should be reviewed before increasing bathing independence expectations."
      : "Environmental fit and equipment needs should be reviewed before progressing the plan.";
  }

  if (PLATEAU_PATTERN.test(signalText)) {
    return "Current performance pattern should be reassessed before continuing the same treatment direction.";
  }

  if (attentionStatement) {
    return "Current performance should be reviewed before continuing the existing recommendation.";
  }

  return "No active review need was identified from the latest progression check.";
}
