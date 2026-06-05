import {
  compressCommandCenterList,
  compressCommandCenterSentence,
  compressCurrentFocusSentence,
  compressNextActionList,
} from "@/lib/clinicalDisplayLanguage";
import { buildProgressionAwareCurrentFocus } from "@/lib/currentFocusProgressionAwareness";

export type PatientEntryPreviewCaseData = {
  id: string;
  generated_output?: unknown;
  current_longitudinal_state?: unknown;
  clinical_attention_state?: unknown;
  reasoning_stale?: boolean | null;
  plan_stale?: boolean | null;
  modules_stale?: boolean | null;
};

export type PatientEntryPreviewEventData = {
  id: string;
  created_at: string;
  event_payload?: unknown;
  current_state_snapshot?: unknown;
  clinical_attention_snapshot?: unknown;
};

export type PatientEntryPreviewData = {
  caseData: PatientEntryPreviewCaseData | null;
  recentEvents: PatientEntryPreviewEventData[];
};

export type PatientEntryPreviewSignal = {
  label: "Current Focus" | "Attention Required" | "Since Last Visit" | "Next Action";
  value: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readUnknown = (source: unknown, keys: string[]): unknown => {
  if (!isRecord(source)) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const readText = (source: unknown, keys: string[]): string | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
};

const readBoolean = (source: unknown, keys: string[]): boolean | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "true" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "no") return false;
  }

  return null;
};

const readTextList = (source: unknown, keys: string[]): string[] => {
  const value = readUnknown(source, keys);

  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string | number | boolean =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean"
      )
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value.trim()];

  return [];
};

const joinReadableList = (items: string[]): string => {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const appendPeriod = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  return /[.!?]$/.test(trimmedValue) ? trimmedValue : `${trimmedValue}.`;
};

export function derivePatientEntryPreviewSignals({
  caseData,
  recentEvents,
}: PatientEntryPreviewData): PatientEntryPreviewSignal[] {
  if (!caseData) return [];

  const generatedOutput = caseData.generated_output;
  const operationalPrioritization = readUnknown(generatedOutput, [
    "operational_prioritization",
  ]);
  const structuredPlanDetails = readUnknown(generatedOutput, [
    "structured_plan_details",
  ]);
  const progressionState = readUnknown(generatedOutput, ["progression_state"]);
  const latestEvent = recentEvents[0] || null;
  const latestEventPayload = latestEvent?.event_payload;
  const latestEventCurrentStateSnapshot = latestEvent?.current_state_snapshot;
  const latestEventClinicalAttentionSnapshot =
    latestEvent?.clinical_attention_snapshot;

  const currentFocus = readText(operationalPrioritization, [
    "currentOperationalEmphasis",
    "current_operational_emphasis",
  ]);

  const attentionStatement =
    readText(caseData.clinical_attention_state, [
      "attentionStatement",
      "attention_statement",
    ]) ||
    readText(latestEventClinicalAttentionSnapshot, [
      "attentionStatement",
      "attention_statement",
    ]);

  const requiresOperationalReview = readBoolean(caseData.clinical_attention_state, [
    "requiresOperationalReview",
    "requires_operational_review",
  ]);
  const reassessmentRecommended = readBoolean(caseData.clinical_attention_state, [
    "reassessmentRecommended",
    "reassessment_recommended",
  ]);
  const attentionDrivers = readTextList(caseData.clinical_attention_state, [
    "attentionDrivers",
    "attention_drivers",
  ]);

  const currentStateFunctionalChanges = readTextList(
    caseData.current_longitudinal_state,
    ["functionalChanges", "functional_changes"]
  );
  const latestEventFunctionalChanges = readTextList(latestEventPayload, [
    "functionalChanges",
    "functional_changes",
  ]);
  const sinceLastVisitFunctionalChanges = currentStateFunctionalChanges.length
    ? currentStateFunctionalChanges
    : latestEventFunctionalChanges;
  const sinceLastVisitMilestone =
    readText(caseData.current_longitudinal_state, [
      "milestoneAchieved",
      "milestone_achieved",
    ]) ||
    readText(latestEventPayload, ["milestoneAchieved", "milestone_achieved"]);
  const sinceLastVisitTreatmentDirectionChanged =
    readBoolean(caseData.current_longitudinal_state, [
      "treatmentDirectionChanged",
      "treatment_direction_changed",
    ]) ??
    readBoolean(latestEventPayload, [
      "treatmentDirectionChanged",
      "treatment_direction_changed",
    ]);
  const sinceLastVisitReasonTreatmentChanged =
    readText(caseData.current_longitudinal_state, [
      "reasonTreatmentChanged",
      "reason_treatment_changed",
    ]) ||
    readText(latestEventPayload, [
      "reasonTreatmentChanged",
      "reason_treatment_changed",
    ]);
  const sinceLastVisitLimitingFactor =
    readText(caseData.current_longitudinal_state, [
      "currentDominantBarrier",
      "current_dominant_barrier",
      "currentLimitingFactor",
      "current_limiting_factor",
    ]) ||
    readText(latestEventPayload, [
      "currentDominantBarrier",
      "current_dominant_barrier",
      "currentLimitingFactor",
      "current_limiting_factor",
    ]) ||
    readText(latestEventCurrentStateSnapshot, [
      "currentDominantBarrier",
      "current_dominant_barrier",
      "currentLimitingFactor",
      "current_limiting_factor",
    ]);
  const sinceLastVisitProgressionStatus =
    readText(caseData.current_longitudinal_state, [
      "progressionStatus",
      "progression_status",
    ]) ||
    readText(latestEventPayload, ["progressionStatus", "progression_status"]);

  const sinceLastVisitSummaryItems = [
    sinceLastVisitFunctionalChanges.length
      ? `Recent visit notes indicate ${joinReadableList(sinceLastVisitFunctionalChanges)}.`
      : null,
    sinceLastVisitMilestone
      ? `A milestone was noted: ${sinceLastVisitMilestone}.`
      : null,
    sinceLastVisitTreatmentDirectionChanged === true
      ? `Treatment direction changed${
          sinceLastVisitReasonTreatmentChanged
            ? ` because ${sinceLastVisitReasonTreatmentChanged}`
            : ""
        }.`
      : sinceLastVisitTreatmentDirectionChanged === false
        ? "Treatment direction remains consistent with the prior visit."
        : null,
    sinceLastVisitLimitingFactor || sinceLastVisitProgressionStatus
      ? `Current visit context centers on ${[
          sinceLastVisitLimitingFactor,
          sinceLastVisitProgressionStatus
            ? `progression described as ${sinceLastVisitProgressionStatus}`
            : null,
        ]
          .filter(Boolean)
          .join(" with ")}.`
      : null,
  ].filter((item): item is string => Boolean(item));

  const immediateActions = readTextList(structuredPlanDetails, [
    "immediateActions",
    "immediate_actions",
  ]);
  const reassessmentTriggers = readTextList(operationalPrioritization, [
    "reassessmentTriggers",
    "reassessment_triggers",
  ]);
  const progressionReassessmentTriggers = readTextList(progressionState, [
    "reassessmentTriggers",
    "reassessment_triggers",
  ]);
  const nextActionItems = [
    ...immediateActions,
    ...reassessmentTriggers.map((trigger) => `Reassess if ${trigger}.`),
    ...progressionReassessmentTriggers.map(
      (trigger) => `Check progression if ${trigger}.`
    ),
    ...(requiresOperationalReview
      ? ["Review the current treatment direction."]
      : []),
    ...(reassessmentRecommended
      ? ["Reassess before advancing the plan."]
      : []),
  ].filter(Boolean);

  const attentionItems = [
    attentionStatement ? appendPeriod(attentionStatement) : null,
    !attentionStatement && attentionDrivers.length
      ? appendPeriod(attentionDrivers[0])
      : null,
    requiresOperationalReview ? "Review current treatment direction." : null,
    reassessmentRecommended ? "Reassessment is recommended." : null,
  ].filter((item): item is string => Boolean(item));

  const progressionAwareCurrentFocus = currentFocus
    ? buildProgressionAwareCurrentFocus({
        currentFocus,
        progressionState,
        currentLongitudinalState: caseData.current_longitudinal_state,
        clinicalAttentionState: caseData.clinical_attention_state,
        latestEventPayload,
      })
    : null;

  return [
    progressionAwareCurrentFocus
      ? {
          label: "Current Focus" as const,
          value: compressCurrentFocusSentence(progressionAwareCurrentFocus),
        }
      : null,
    attentionItems.length
      ? {
          label: "Attention Required" as const,
          value: compressCommandCenterSentence(attentionItems.join(" ")),
        }
      : null,
    sinceLastVisitSummaryItems.length
      ? {
          label: "Since Last Visit" as const,
          value: compressCommandCenterList(sinceLastVisitSummaryItems)[0],
        }
      : null,
    nextActionItems.length
      ? {
          label: "Next Action" as const,
          value: compressNextActionList(nextActionItems, 1)[0],
        }
      : null,
  ].filter((signal): signal is PatientEntryPreviewSignal => Boolean(signal));
}
