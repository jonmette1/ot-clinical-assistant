export const CASELOAD_SYSTEM_VIEWS = [
  { id: "all", label: "All Patients" },
  { id: "needs-attention", label: "Needs Attention" },
  { id: "recent-change", label: "Recent Change" },
  { id: "monitor-closely", label: "Monitor Closely" },
  { id: "reassessment-due", label: "Reassessment Due" },
  { id: "safety-concern", label: "Safety Concern" },
] as const;

export type CaseloadViewId = (typeof CASELOAD_SYSTEM_VIEWS)[number]["id"];

export const CASELOAD_SORT_OPTIONS = [
  { id: "clinical-priority", label: "Clinical priority" },
  { id: "alphabetical", label: "Patient name" },
  { id: "recent-update", label: "Recent clinical update" },
] as const;

export type CaseloadSortId = (typeof CASELOAD_SORT_OPTIONS)[number]["id"];

export type CaseloadStatus =
  | "Safety Concern"
  | "Needs Attention"
  | "Reassessment Due"
  | "Monitor Closely"
  | "Progressing"
  | "Stable";

export type CaseloadCaseData = {
  id: string;
  title: string | null;
  created_at: string;
  patient_profile: {
    primary_diagnosis?: string;
  } | null;
  client_info: {
    client_name?: string;
  } | null;
  case_classification: {
    case_type?: string;
  } | null;
  functional_status: {
    other_key_barriers?: string;
    general_mobility_summary?: {
      recent_falls?: string | boolean;
    };
  } | null;
  goals_preferences: {
    other_target_activity?: string;
  } | null;
  environment: {
    other_safety_hazards?: string;
    other_equipment_present?: string;
  } | null;
  target_activities?: string[] | null;
  generated_output?: unknown;
  current_longitudinal_state?: unknown;
  clinical_attention_state?: unknown;
  reasoning_stale?: boolean | null;
  plan_stale?: boolean | null;
  modules_stale?: boolean | null;
};

export type CaseloadEventData = {
  id: string;
  case_id: string;
  created_at: string;
  event_payload?: unknown;
  current_state_snapshot?: unknown;
  clinical_attention_snapshot?: unknown;
};

export type PatientCaseloadSummary = {
  caseRow: CaseloadCaseData;
  patientName: string;
  clinicalContext: string;
  status: CaseloadStatus;
  currentFocus: string;
  recentChange: string;
  hasMeaningfulRecentChange: boolean;
  hasActiveAttention: boolean;
  hasReassessmentSignal: boolean;
  hasSafetyConcern: boolean;
  shouldMonitorClosely: boolean;
  lastClinicalUpdateAt: string | null;
  searchText: string;
};

const SAFETY_PATTERN =
  /\b(fall|falls|fell|near[- ]?fall|loss of balance|unsafe|safety concern|safety event|unsteady|instability)\b/i;
const MONITOR_PATTERN =
  /\b(minimal progress|plateau|monitor|inconsistent|inconsistency|variable|fluctuat|declin|regress)\b/i;
const PROGRESSING_PATTERN = /\b(progressing|improv|milestone|advance|advancement)\b/i;
const NEGATED_SAFETY_PATTERN =
  /\b(no|without|denies?|not reporting|no recent)\s+(new\s+|recent\s+)?(falls?|near[- ]?falls?)\b/i;
const NO_ACTIVE_REVIEW_PATTERN = /\bno active review need\b/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function readUnknown(source: unknown, keys: string[]): unknown {
  if (!isRecord(source)) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function readText(source: unknown, keys: string[]): string | null {
  const value = readUnknown(source, keys);

  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function readBoolean(source: unknown, keys: string[]): boolean | null {
  const value = readUnknown(source, keys);

  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y"].includes(normalized)) return true;
    if (["false", "no", "n"].includes(normalized)) return false;
  }

  return null;
}

function readTextList(source: unknown, keys: string[]): string[] {
  const value = readUnknown(source, keys);

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string | number | boolean =>
        ["string", "number", "boolean"].includes(typeof item)
      )
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function documentedText(value?: string | null): string | null {
  return value?.trim() || null;
}

function formatClinicalLabel(value?: string | null): string | null {
  const documentedValue = documentedText(value);
  if (!documentedValue) return null;

  return documentedValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function conciseLine(value: string, maxLength = 150): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, Math.max(lastSpace, maxLength - 24)).trim()}…`;
}

function sentence(value: string): string {
  const normalized = conciseLine(value).replace(/[.]+$/, "");
  return normalized ? `${normalized}.` : normalized;
}

function containsSafetySignal(values: Array<string | null | undefined>): boolean {
  return values.some((value) => {
    if (!value) return false;
    return SAFETY_PATTERN.test(value) && !NEGATED_SAFETY_PATTERN.test(value);
  });
}

function hasAffirmativeFallHistory(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return ["yes", "true", "fall", "falls", "recent fall", "near fall", "near_falls"].includes(
    normalized
  );
}

function resolvePatientName(caseRow: CaseloadCaseData): string {
  return (
    documentedText(caseRow.client_info?.client_name) ||
    documentedText(caseRow.title) ||
    "Unnamed Patient"
  );
}

function resolveClinicalContext(caseRow: CaseloadCaseData): string {
  const diagnosis = documentedText(caseRow.patient_profile?.primary_diagnosis);
  const caseType = formatClinicalLabel(caseRow.case_classification?.case_type);

  if (diagnosis && caseType && !diagnosis.toLowerCase().includes(caseType.toLowerCase())) {
    return `${diagnosis} · ${caseType}`;
  }

  return diagnosis || caseType || "Clinical context not documented";
}

function resolveRecentChange({
  currentState,
  eventPayload,
}: {
  currentState: unknown;
  eventPayload: unknown;
}): { text: string; meaningful: boolean } {
  const functionalChanges = readTextList(currentState, [
    "functionalChanges",
    "functional_changes",
  ]);
  const eventFunctionalChanges = readTextList(eventPayload, [
    "functionalChanges",
    "functional_changes",
  ]);
  const change = functionalChanges[0] || eventFunctionalChanges[0];
  if (change) return { text: sentence(change), meaningful: true };

  const milestone =
    readText(currentState, ["milestoneAchieved", "milestone_achieved"]) ||
    readText(eventPayload, ["milestoneAchieved", "milestone_achieved"]);
  if (milestone) return { text: sentence(milestone), meaningful: true };

  const caregiverChange =
    readText(currentState, ["caregiverChange", "caregiver_change"]) ||
    readText(eventPayload, ["caregiverChange", "caregiver_change"]);
  if (caregiverChange) return { text: sentence(caregiverChange), meaningful: true };

  const environmentalChange =
    readText(currentState, ["environmentalChange", "environmental_change"]) ||
    readText(eventPayload, ["environmentalChange", "environmental_change"]);
  if (environmentalChange) return { text: sentence(environmentalChange), meaningful: true };

  const medicalChange =
    readText(currentState, ["medicalChange", "medical_change"]) ||
    readText(eventPayload, ["medicalChange", "medical_change"]);
  if (medicalChange) return { text: sentence(medicalChange), meaningful: true };

  const treatmentDirectionChanged =
    readBoolean(currentState, ["treatmentDirectionChanged", "treatment_direction_changed"]) ??
    readBoolean(eventPayload, ["treatmentDirectionChanged", "treatment_direction_changed"]);
  if (treatmentDirectionChanged) {
    const reason =
      readText(currentState, ["reasonTreatmentChanged", "reason_treatment_changed"]) ||
      readText(eventPayload, ["reasonTreatmentChanged", "reason_treatment_changed"]);
    return {
      text: reason ? sentence(`Treatment direction changed: ${reason}`) : "Treatment direction changed.",
      meaningful: true,
    };
  }

  return { text: "No meaningful change recorded.", meaningful: false };
}

function resolveStatus({
  caseRow,
  currentState,
  attentionState,
  eventPayload,
  progressionState,
  reassessmentTriggers,
}: {
  caseRow: CaseloadCaseData;
  currentState: unknown;
  attentionState: unknown;
  eventPayload: unknown;
  progressionState: unknown;
  reassessmentTriggers: string[];
}): {
  status: CaseloadStatus;
  hasActiveAttention: boolean;
  hasReassessmentSignal: boolean;
  hasSafetyConcern: boolean;
  shouldMonitorClosely: boolean;
} {
  const attentionCategory = readText(attentionState, ["category"]);
  const attentionStatement = readText(attentionState, [
    "attentionStatement",
    "attention_statement",
  ]);
  const attentionDrivers = readTextList(attentionState, [
    "attentionDrivers",
    "attention_drivers",
  ]);
  const progressionStatus =
    readText(currentState, ["progressionStatus", "progression_status"]) ||
    readText(attentionState, ["progressionStatus", "progression_status"]) ||
    readText(eventPayload, ["progressionStatus", "progression_status"]) ||
    readText(progressionState, ["advancementReadiness", "advancement_readiness"]);
  const recentChanges = [
    ...readTextList(currentState, ["functionalChanges", "functional_changes"]),
    ...readTextList(eventPayload, ["functionalChanges", "functional_changes"]),
    readText(currentState, ["caregiverChange", "caregiver_change"]),
    readText(currentState, ["environmentalChange", "environmental_change"]),
    readText(currentState, ["medicalChange", "medical_change"]),
  ];

  const hasSafetyConcern =
    attentionCategory?.toLowerCase() === "safety" ||
    containsSafetySignal([attentionStatement, ...attentionDrivers, ...recentChanges]) ||
    hasAffirmativeFallHistory(
      caseRow.functional_status?.general_mobility_summary?.recent_falls
    );
  const requiresOperationalReview = readBoolean(attentionState, [
    "requiresOperationalReview",
    "requires_operational_review",
  ]);
  const hasActiveAttention =
    requiresOperationalReview === true ||
    caseRow.reasoning_stale === true ||
    caseRow.plan_stale === true ||
    (Boolean(attentionStatement) && !NO_ACTIVE_REVIEW_PATTERN.test(attentionStatement || ""));
  const reassessmentRecommended =
    readBoolean(attentionState, ["reassessmentRecommended", "reassessment_recommended"]) ??
    readBoolean(currentState, ["reassessmentRecommended", "reassessment_recommended"]);
  const hasReassessmentSignal =
    reassessmentRecommended === true || reassessmentTriggers.length > 0;
  const shouldMonitorClosely = MONITOR_PATTERN.test(progressionStatus || "");

  const status: CaseloadStatus = hasSafetyConcern
    ? "Safety Concern"
    : hasActiveAttention
      ? "Needs Attention"
      : hasReassessmentSignal
        ? "Reassessment Due"
        : shouldMonitorClosely
          ? "Monitor Closely"
          : PROGRESSING_PATTERN.test(progressionStatus || "")
            ? "Progressing"
            : "Stable";

  return {
    status,
    hasActiveAttention,
    hasReassessmentSignal,
    hasSafetyConcern,
    shouldMonitorClosely,
  };
}

export function derivePatientCaseloadSummary({
  caseRow,
  latestEvent,
}: {
  caseRow: CaseloadCaseData;
  latestEvent?: CaseloadEventData | null;
}): PatientCaseloadSummary {
  const generatedOutput = caseRow.generated_output;
  const operationalPrioritization = readUnknown(generatedOutput, [
    "operational_prioritization",
  ]);
  const progressionState = readUnknown(generatedOutput, ["progression_state"]);
  const currentState = caseRow.current_longitudinal_state || latestEvent?.current_state_snapshot;
  const attentionState =
    caseRow.clinical_attention_state || latestEvent?.clinical_attention_snapshot;
  const eventPayload = latestEvent?.event_payload;
  const reassessmentTriggers = [
    ...readTextList(operationalPrioritization, [
      "reassessmentTriggers",
      "reassessment_triggers",
    ]),
    ...readTextList(progressionState, ["reassessmentTriggers", "reassessment_triggers"]),
  ];
  const currentFocus = readText(operationalPrioritization, [
    "currentOperationalEmphasis",
    "current_operational_emphasis",
  ]);
  const fallbackFocus =
    caseRow.target_activities?.find((activity) => documentedText(activity)) ||
    documentedText(caseRow.goals_preferences?.other_target_activity) ||
    documentedText(caseRow.functional_status?.other_key_barriers);
  const recentChange = resolveRecentChange({ currentState, eventPayload });
  const patientName = resolvePatientName(caseRow);
  const clinicalContext = resolveClinicalContext(caseRow);
  const statusSignals = resolveStatus({
    caseRow,
    currentState,
    attentionState,
    eventPayload,
    progressionState,
    reassessmentTriggers,
  });

  return {
    caseRow,
    patientName,
    clinicalContext,
    status: statusSignals.status,
    currentFocus: currentFocus
      ? sentence(currentFocus)
      : fallbackFocus
        ? sentence(fallbackFocus)
        : "Current focus not documented.",
    recentChange: recentChange.text,
    hasMeaningfulRecentChange: recentChange.meaningful,
    hasActiveAttention: statusSignals.hasActiveAttention,
    hasReassessmentSignal: statusSignals.hasReassessmentSignal,
    hasSafetyConcern: statusSignals.hasSafetyConcern,
    shouldMonitorClosely: statusSignals.shouldMonitorClosely,
    lastClinicalUpdateAt:
      latestEvent?.created_at ||
      readText(currentState, ["lastUpdatedAt", "last_updated_at"]) ||
      null,
    searchText: [
      patientName,
      clinicalContext,
      caseRow.title,
      caseRow.case_classification?.case_type,
      caseRow.functional_status?.other_key_barriers,
      caseRow.goals_preferences?.other_target_activity,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

export function matchesCaseloadView(
  patient: PatientCaseloadSummary,
  view: CaseloadViewId
): boolean {
  switch (view) {
    case "needs-attention":
      return patient.hasActiveAttention;
    case "recent-change":
      return patient.hasMeaningfulRecentChange;
    case "monitor-closely":
      return patient.shouldMonitorClosely;
    case "reassessment-due":
      return patient.hasReassessmentSignal;
    case "safety-concern":
      return patient.hasSafetyConcern;
    case "all":
    default:
      return true;
  }
}

const STATUS_PRIORITY: Record<CaseloadStatus, number> = {
  "Safety Concern": 0,
  "Needs Attention": 1,
  "Reassessment Due": 2,
  "Monitor Closely": 4,
  Progressing: 5,
  Stable: 6,
};

export function filterAndSortCaseload({
  patients,
  view,
  searchTerm,
  caseType,
  sort,
}: {
  patients: PatientCaseloadSummary[];
  view: CaseloadViewId;
  searchTerm: string;
  caseType: string;
  sort: CaseloadSortId;
}): PatientCaseloadSummary[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return patients
    .filter(
      (patient) =>
        matchesCaseloadView(patient, view) &&
        (!normalizedSearch || patient.searchText.includes(normalizedSearch)) &&
        (caseType === "all" ||
          patient.caseRow.case_classification?.case_type === caseType)
    )
    .sort((a, b) => {
      if (sort === "alphabetical") return a.patientName.localeCompare(b.patientName);

      if (sort === "recent-update") {
        const updateDifference =
          Date.parse(b.lastClinicalUpdateAt || "") - Date.parse(a.lastClinicalUpdateAt || "");
        if (Number.isFinite(updateDifference) && updateDifference !== 0) return updateDifference;
        return a.patientName.localeCompare(b.patientName);
      }

      const aPriority = a.hasMeaningfulRecentChange
        ? Math.min(STATUS_PRIORITY[a.status], 3)
        : STATUS_PRIORITY[a.status];
      const bPriority = b.hasMeaningfulRecentChange
        ? Math.min(STATUS_PRIORITY[b.status], 3)
        : STATUS_PRIORITY[b.status];

      return aPriority - bPriority || a.patientName.localeCompare(b.patientName);
    });
}
