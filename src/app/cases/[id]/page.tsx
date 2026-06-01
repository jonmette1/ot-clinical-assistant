"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buildClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import {
  buildClinicalDecisionInputFromCase,
  buildClinicalNormalizationInsight,
} from "@/lib/buildClinicalDecisionInput";

import { buildCanonicalCasePayload } from "@/lib/buildCanonicalCasePayload";
import { buildProgressionState } from "@/lib/buildProgressionState";
import { AdjacentOperationalPrioritiesReference } from "./components/AdjacentOperationalPrioritiesReference";
import { StructuredPlanDetails } from "./components/StructuredPlanDetails";
import { SupportingProgressionSummaries } from "./components/SupportingProgressionSummaries";
import { CaregiverFeasibilityCard } from "./components/CaregiverFeasibilityCard";
import { EnvironmentalPressureCard } from "./components/EnvironmentalPressureCard";
import { ProgressionContinuityRow } from "./components/ProgressionContinuityRow";
import { StickyOperationalHeader } from "./components/StickyOperationalHeader";
import { TransferMobilityPressureCard } from "./components/TransferMobilityPressureCard";
import { HistoricalSnapshotsSection } from "./components/HistoricalSnapshotsSection";
// ==============================
// TYPES
// ==============================


type GeneratedPlan = {
  focusApplied?: string;
  patientSnapshot?: string;
  pathways?: {
    type?: string;
    title?: string;
    interventions?: string[];
    timeline?: string;
    upside?: string;
    tradeoff?: string;
  }[];
  summary?: {
  topRisks?: string[];
  keyLimitations?: string[];
  planSummary?: string;
  caregiverExpectations?: string[];
  safetyLevel?: "low" | "medium" | "high";
};
caregiverGuidance?: string[];
clinicalDetailModules?: {
  caregiverInstructions?: string[];
};
  clinicalConsiderations?: string[];
  firstSessionPriorities?: string[];
  sessionPlan?: string[];
  taskBreakdown?: string[];
  functionalProblemAreas?: string[];
};

type Pathway = {
  type: string;
  title: string;
  interventions: string[];
  timeline: string;
  upside: string;
  tradeoff: string;

  selected?: boolean;
selectionDrivers?: string[];
primaryFocus?: string;
prioritizes?: string[];
deprioritizes?: string[];
bestFitFor?: string[];
notSelectedBecause?: string[];
operationalRisk?: string;
};

type GeneratedOutput = {
  clinicalDecisionModelUsed?: {
  primaryStrategy?: string;
  selectedStrategies?: string[];
  dominantBarrier?: string;
  secondaryBarrier?: string;
  clinicalLens?: string[];
  environmentContext?: string[];
  safetyRiskLevel?: string;
};
  focusApplied?: string;
  patientSnapshot?: string;
  taskBreakdown?: string[];
  functionalProblemAreas?: string[];
  clinicalPriorities?: string[];
  caregiverFocus?: string[];
  operational_prioritization?: {
    currentOperationalEmphasis?: string;
    emphasisRationale?: string[];
    dominantBarriers?: string[];
    adjacentOperationalPriorities?: {
      label?: string;
      rationale?: string;
      monitorFor?: string;
    }[];
    reassessmentTriggers?: string[];
    continuitySummary?: string;

  };

    continuity_interpretation?: {
    currentContinuityCondition?: string;
    operationalChangeClassification?: string[];
    dominantInstabilityDrivers?: string[];
    reassessmentPressureLevel?: "low" | "moderate" | "high";
    operationalDriftSignals?: string[];
    continuityAlerts?: string[];
    continuitySummary?: string;
  };

structured_plan_details?: {
  immediateActions?: string[];

  // Legacy render fields — keep until JSX is migrated
  safetyConsiderations?: string[];
  caregiverConsiderations?: string[];
  environmentalConsiderations?: string[];
  treatmentExecutionNotes?: string[];

  // New operational instability fields
  instabilityDrivers?: string[];
  feasibilityConstraints?: string[];
  environmentalPressures?: string[];
  executionPressurePoints?: string[];
  continuityRisks?: string[];
};

  pathways?: Pathway[];
  clinicalConsiderations?: string[];
  firstSessionPriorities?: string[];
  caregiverGuidance?: string[];
  equipmentPlan?: EquipmentPlanItem[];
selectedPathwaySummary?: string;
selectedPathwayIndex?: number;

progression_state?: {
  currentPhase?: string;
  advancementReadiness?: string;
  activeMilestones: string[];
  activeBarriers: string[];
  regressionRisks: string[];
  reassessmentTriggers: string[];
  caregiverDependencyState?: string;
  environmentalLimitationState?: string;
  continuitySummary?: string;
};

clinicalDetailModules?: {
  caregiverInstructions?: string[];
  caregiverScript?: CaregiverScript;
  transferDetails?: TransferMobilityDetails;
  adlPrivacy?: AdlPrivacySupport;
  equipmentFeasibility?: EquipmentFeasibilityPlan;
};
    sessionPlan?: string[];
  summary?: {
  topRisks?: string[];
  keyLimitations?: string[];
  planSummary?: string;
  caregiverExpectations?: string[];
  safetyLevel?: "low" | "medium" | "high";
};
};

type CaregiverScript = {
  conversationGoal?: string;
  beforeTaskScript?: string;
  duringTaskScript?: string;
  ifPatientStruggles?: string;
  ifPatientResists?: string;
  reassuranceLanguage?: string;
  whenToBeFirm?: string;
};

type TransferMobilityDetails = {
  setupAdjustments?: string[];
  transferCues?: string[];
  surfaceVariations?: string[];
  stopRules?: string[];
};

type AdlPrivacySupport = {
  privacySetup?: string[];
  respectfulCueing?: string[];
  whenToStepIn?: string[];
  whenToStepBack?: string[];
  dignityWarnings?: string[];
};

type FeasibilitySnapshot = {
  financialFeasibility?: "low" | "moderate" | "high" | "unknown";
  environmentalFeasibility?: "low" | "moderate" | "high" | "unknown";
  caregiverFlexibility?: "low" | "moderate" | "high" | "unknown";
  mainConstraint?: string;
};

type EquipmentFeasibilityItem = {
  item?: string;
  reason?: string;
  priority?: "high" | "medium" | "low" | string;
  urgency?: "immediate" | "short_term" | "optional" | string;
  costRange?: string;
  access?: string;
  coverageNotes?: string;
  immediateWorkaround?: string;
  relativeCost?: "low" | "moderate" | "high" | string;
  costComparisonNote?: string;

  idealSetup?: string;
  idealEstimatedCost?: string;
  feasibleEstimatedCost?: string;
  clinicalDecision?: string;
};

type EquipmentFeasibilityPlan = {
  feasibilitySnapshot?: FeasibilitySnapshot;
  equipmentPlan?: EquipmentFeasibilityItem[];
};

type EquipmentPlanItem = {
  item?: string;
  reason?: string;
  priority?: "high" | "medium" | "low" | string;
  urgency?: "immediate" | "short_term" | "optional" | string;
  costRange?: string;
  access?: string;
  coverageNotes?: string;
};

type GenerationRow = {
  id: string;
  created_at: string;
  prompt_version: string | null;
  input_payload: Partial<CaseDetail> & Record<string, unknown>;
  output_payload: GeneratedOutput | null;
};

type ProgressionCheckFormState = {
  functionalChanges: string;
  currentDominantBarrier: string;
  progressionStatus: string;
  treatmentDirectionChanged: boolean;
  reasonTreatmentChanged: string;
  milestoneAchieved: string;
};

type LongitudinalEventRow = {
  id?: string;
  created_at?: string;
  event_type?: string;
  event_payload?: unknown;
  previous_state_snapshot?: unknown;
  current_state_snapshot?: unknown;
  clinical_attention_snapshot?: unknown;
  operational_emphasis_snapshot?: unknown;
};

const emptyProgressionCheckForm: ProgressionCheckFormState = {
  functionalChanges: "",
  currentDominantBarrier: "",
  progressionStatus: "",
  treatmentDirectionChanged: false,
  reasonTreatmentChanged: "",
  milestoneAchieved: "",
};

type OverallTrajectory =
  | "Improving"
  | "Stable"
  | "Declining"
  | "Stable / Plateau"
  | "Stable / Limited Progress"
  | "Not enough longitudinal data";

const normalizeTrajectorySource = (value: string | null | undefined): string =>
  (value || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const mapProgressionStatusToTrajectory = (
  value: string | null | undefined
): OverallTrajectory | null => {
  const normalized = normalizeTrajectorySource(value);

  if (!normalized) return null;

  if (normalized.includes("regression") || normalized.includes("declin")) {
    return "Declining";
  }

  if (normalized.includes("plateau")) {
    return "Stable / Plateau";
  }

  if (
    normalized.includes("minimal progress") ||
    normalized.includes("limited progress") ||
    normalized.includes("not ready to advance")
  ) {
    return "Stable / Limited Progress";
  }

  if (
    normalized.includes("progressing faster") ||
    normalized.includes("faster than expected") ||
    normalized.includes("progressing as expected") ||
    normalized.includes("improving") ||
    normalized.includes("ready to advance") ||
    normalized.includes("advancing")
  ) {
    return "Improving";
  }

  if (
    normalized.includes("no meaningful change") ||
    normalized.includes("no change") ||
    normalized === "stable" ||
    normalized.includes("unchanged") ||
    normalized.includes("maintain")
  ) {
    return "Stable";
  }

  return null;
};

type SummaryValue = string | string[] | boolean | number | null | undefined;

type SummaryRow = {
  label: string;
  value: SummaryValue;
};

type ValidationComparisonRow = {
  label: string;
  previousLabel: string;
  previousValue: string | null;
  currentLabel: string;
  currentValue: string | null;
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

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return null;
};

const readNumber = (source: unknown, keys: string[]): number | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
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
      .filter((item): item is string | number | boolean =>
        typeof item === "string" || typeof item === "number" || typeof item === "boolean"
      )
      .map(String)
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value];

  return [];
};

const formatBoolean = (value: boolean | null): string | null => {
  if (value === null) return null;
  return value ? "Yes" : "No";
};

const formatDateTime = (value: string | null | undefined): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const hasSummaryValue = (value: SummaryValue): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
};

const hasAnySummaryValue = (rows: SummaryRow[]): boolean =>
  rows.some((row) => hasSummaryValue(row.value));

const renderSummaryValue = (value: SummaryValue, fallback = "Not documented yet.") => {
  if (!hasSummaryValue(value)) {
    return <span className="text-gray-500">{fallback}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1">
        {value.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <span className="text-gray-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <span>{String(value)}</span>;
};

const formatObjectSummary = (source: unknown, keys: string[]): string[] => {
  if (!isRecord(source)) return [];

  return keys
    .map((key) => {
      const value = source[key];

      if (value === undefined || value === null || value === "") return null;

      const label = key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (firstCharacter) => firstCharacter.toUpperCase())
        .trim();

      if (Array.isArray(value)) {
        const items = value
          .filter((item): item is string | number | boolean =>
            typeof item === "string" || typeof item === "number" || typeof item === "boolean"
          )
          .map(String);

        return items.length ? `${label}: ${items.join(", ")}` : null;
      }

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return `${label}: ${String(value)}`;
      }

      return null;
    })
    .filter((item): item is string => Boolean(item));
};

const joinReadableList = (items: string[]): string => {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

type CaseDetail = {
  id: string;
    current_generation_id: string | null;
  title: string | null;
  created_at: string;
  patient_profile: {
    primary_diagnosis?: string;
    age_range?: string;
  } | null;
functional_status: {
  current_assistance_level?: string;
  adl_assist_levels?: {
    bed_transfer?: string;
    toilet_transfer?: string;
    shower_transfer?: string;
  };
  key_barriers?: string[];
} | null;
  goals_preferences: {
    primary_goal?: string;
  } | null;
    client_info: {
    client_name?: string;
    phone?: string;
    email?: string;
    address?: string;
  } | null;
  caregiver_info: {
    caregiver_name?: string;
    relationship?: string;
    phone?: string;
  } | null;

    feasibility_context: {
    financial_constraint?: string;
    environmental_constraint?: string;
    equipment_access?: string;
  } | null;

case_classification: {
  case_type?: string;
  clinical_focus?: string;
} | null;

clinical_decision_input?: {
  goalCategory?: string;
  dominantBarrier?: string;
  dominantBarrierSeverity?: number;
  secondaryBarrier?: string;
  secondaryBarrierSeverity?: number;
  supportLevel?: string;
  safetyRiskLevel?: string;
  clinicalLens?: string[];
  environmentContext?: string[];
} | null;

clinical_decision_model?: unknown;
selected_pathway_index?: number | null;
reasoning_stale?: boolean;
plan_stale?: boolean;
modules_stale?: boolean;
clinician_notes?: string | null;
current_longitudinal_state?: unknown;
clinical_attention_state?: unknown;

environment: {
    bathroom_type?: string;
    stairs_present?: string;
    space_constraints?: string;
    safety_hazards?: string[];
    equipment_present?: string[];
  } | null;
  generated_output: GeneratedOutput | null;
detail_modules?: {
  caregiverScript?: CaregiverScript;
  transferDetails?: TransferMobilityDetails;
  adlPrivacy?: AdlPrivacySupport;
  equipmentFeasibility?: EquipmentFeasibilityPlan;
} | null;
};

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

// ==============================
// STATE
// ==============================

  const [showAllVersions, setShowAllVersions] = useState(false);
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
const [isRestoringVersion, setIsRestoringVersion] = useState(false);
const [isSavingCurrentVersion, setIsSavingCurrentVersion] = useState(false);
const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
const [isDeleting, setIsDeleting] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [generations, setGenerations] = useState<GenerationRow[]>([]);
const [latestGeneratedPlan, setLatestGeneratedPlan] = useState<GeneratedPlan | null>(null);
const [selectedGeneration, setSelectedGeneration] = useState<GenerationRow | null>(null);
const [copyMessage, setCopyMessage] = useState("");
const [editableTitle, setEditableTitle] = useState("");


const [editableClientInfo, setEditableClientInfo] = useState({
  client_name: "",
  phone: "",
  email: "",
  address: "",
});

const [editableCaregiverInfo, setEditableCaregiverInfo] = useState({
  caregiver_name: "",
  relationship: "",
  phone: "",
});

const [editableFunctionalStatus, setEditableFunctionalStatus] = useState({
  current_assistance_level: "",
  key_barriers: "",
});

// ==============================
// STATE: FEASIBILITY (EDIT MODE)
// ==============================

const [editableFeasibility, setEditableFeasibility] = useState({
  financial_constraint: "unknown",
  environmental_constraint: "unknown",
  equipment_access: "unknown",
});

const [clinicianNotes, setClinicianNotes] = useState("");
const [editableDecisionInputs, setEditableDecisionInputs] = useState({
  goalCategory: "Independence",
  dominantBarrier: "Physical",
  dominantBarrierSeverity: 1 as 1 | 2 | 3,
  secondaryBarrier: undefined as string | undefined,
  secondaryBarrierSeverity: undefined as 1 | 2 | 3 | undefined,
  supportLevel: "Independent",
  safetyRiskLevel: "low",
});

const [showDetails, setShowDetails] = useState(false);
const [showTaskBreakdown, setShowTaskBreakdown] = useState(false);
const [showClinicalConsiderations, setShowClinicalConsiderations] = useState(false);
const [showFirstSessionPriorities, setShowFirstSessionPriorities] = useState(false);
const [showDecisionTransparency, setShowDecisionTransparency] = useState(false);
const [showAlternativeApproaches, setShowAlternativeApproaches] = useState(false);
const [showCaregiverGuidance, setShowCaregiverGuidance] = useState(false);
const [showTransferDetails, setShowTransferDetails] = useState(false);
const [showEquipmentFeasibility, setShowEquipmentFeasibility] = useState(false);
const [showAdlPrivacySupport, setShowAdlPrivacySupport] = useState(false);
const [isRegeneratingFocus, setIsRegeneratingFocus] = useState(false);
const [isRegeneratingPlan, setIsRegeneratingPlan] = useState(false);
const [regeneratingFocus, setRegeneratingFocus] = useState<string | null>(null);
const [briefingLens, setBriefingLens] = useState<
  "adl_home_safety" | "transfers_mobility" | "caregiver_training"
>("adl_home_safety");
const [showClinicalSummary, setShowClinicalSummary] = useState(false);
const [caregiverScript, setCaregiverScript] = useState<CaregiverScript | null>(null);
const [isGeneratingCaregiverScript, setIsGeneratingCaregiverScript] = useState(false);
const [caregiverScriptError, setCaregiverScriptError] = useState("");
const [transferDetails, setTransferDetails] = useState<TransferMobilityDetails | null>(null);
const [isGeneratingTransferDetails, setIsGeneratingTransferDetails] = useState(false);

const [adlPrivacy, setAdlPrivacy] = useState<AdlPrivacySupport | null>(null);
const [isGeneratingAdlPrivacy, setIsGeneratingAdlPrivacy] = useState(false);
const [equipmentFeasibility, setEquipmentFeasibility] = useState<EquipmentFeasibilityPlan | null>(null);
const [isGeneratingEquipmentFeasibility, setIsGeneratingEquipmentFeasibility] = useState(false);
const [progressionCheckForm, setProgressionCheckForm] = useState<ProgressionCheckFormState>(emptyProgressionCheckForm);
const [isSubmittingProgressionCheck, setIsSubmittingProgressionCheck] = useState(false);
const [progressionCheckMessage, setProgressionCheckMessage] = useState("");
const [progressionCheckError, setProgressionCheckError] = useState("");
const [latestLongitudinalEvent, setLatestLongitudinalEvent] = useState<LongitudinalEventRow | null>(null);
const [recentLongitudinalEvents, setRecentLongitudinalEvents] = useState<LongitudinalEventRow[]>([]);

// ==============================
// DATA LOADING
// ==============================


  useEffect(() => {
    async function loadCase() {
      const resolvedParams = await params;
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

if (error) {
  setErrorMessage(error.message || "Failed to load case.");
} else {
  const typedCase = data as CaseDetail;
  setCaseData(typedCase);
  setEditableTitle(typedCase.title || "");
  setClinicianNotes(typedCase.clinician_notes || "");

  setEditableClientInfo({
    client_name: typedCase.client_info?.client_name || "",
    phone: typedCase.client_info?.phone || "",
    email: typedCase.client_info?.email || "",
    address: typedCase.client_info?.address || "",
  });

  setEditableCaregiverInfo({
    caregiver_name: typedCase.caregiver_info?.caregiver_name || "",
    relationship: typedCase.caregiver_info?.relationship || "",
    phone: typedCase.caregiver_info?.phone || "",
  });

  setEditableFunctionalStatus({
  current_assistance_level:
    typedCase.functional_status?.current_assistance_level || "",
  key_barriers:
    typedCase.functional_status?.key_barriers?.join(", ") || "",
});

setEditableFeasibility({
  financial_constraint:
    typedCase.feasibility_context?.financial_constraint || "unknown",
  environmental_constraint:
    typedCase.feasibility_context?.environmental_constraint || "unknown",
  equipment_access:
    typedCase.feasibility_context?.equipment_access || "unknown",
});
setEditableDecisionInputs({
  goalCategory: typedCase.clinical_decision_input?.goalCategory || "Independence",
  dominantBarrier: typedCase.clinical_decision_input?.dominantBarrier || "Physical",
  dominantBarrierSeverity:
    (typedCase.clinical_decision_input?.dominantBarrierSeverity as 1 | 2 | 3) || 1,
  secondaryBarrier: typedCase.clinical_decision_input?.secondaryBarrier,
  secondaryBarrierSeverity:
    typedCase.clinical_decision_input?.secondaryBarrierSeverity as
      | 1
      | 2
      | 3
      | undefined,
  supportLevel: typedCase.clinical_decision_input?.supportLevel || "Independent",
  safetyRiskLevel: typedCase.clinical_decision_input?.safetyRiskLevel || "low",
});
  const savedScript =
  typedCase.detail_modules?.caregiverScript ||
  typedCase.generated_output?.clinicalDetailModules?.caregiverScript;

setCaregiverScript(savedScript || null);

const savedTransferDetails =
  typedCase.detail_modules?.transferDetails ||
  typedCase.generated_output?.clinicalDetailModules?.transferDetails;

setTransferDetails(savedTransferDetails || null);

const savedAdlPrivacy =
  typedCase.detail_modules?.adlPrivacy ||
  typedCase.generated_output?.clinicalDetailModules?.adlPrivacy;

setAdlPrivacy(savedAdlPrivacy || null);

const savedEquipmentFeasibility =
  typedCase.detail_modules?.equipmentFeasibility ||
  typedCase.generated_output?.clinicalDetailModules?.equipmentFeasibility;

setEquipmentFeasibility(savedEquipmentFeasibility || null);

  setCurrentGenerationId(typedCase.current_generation_id);
  console.log("Loaded current_generation_id:", typedCase.current_generation_id);
}

      const { data: generationData, error: generationError } = await supabase
.from("generations")
.select("id, created_at, prompt_version, input_payload, output_payload")
  .eq("case_id", resolvedParams.id)
 .order("created_at", { ascending: false })

if (!generationError) {
const gens = (generationData as GenerationRow[]) || [];
setGenerations(gens);

if (gens.length > 0) {
  setLatestGeneratedPlan(gens[0].output_payload as GeneratedPlan);
}
}

const { data: longitudinalEvents, error: longitudinalEventError } = await supabase
  .from("longitudinal_events")
  .select("*")
  .eq("case_id", resolvedParams.id)
  .order("created_at", { ascending: false })
  .limit(2);

if (!longitudinalEventError) {
  const recentEvents = (longitudinalEvents as LongitudinalEventRow[]) || [];
  setRecentLongitudinalEvents(recentEvents);
  setLatestLongitudinalEvent(recentEvents[0] || null);
}

      setLoading(false);
    }

    loadCase();
  }, [params]);

  // ==============================
// OPERATIONAL HANDLERS
// save / delete / restore / regenerate
// ==============================

async function handleSubmitProgressionCheck(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!caseData?.id || isSubmittingProgressionCheck) return;

  setIsSubmittingProgressionCheck(true);
  setProgressionCheckMessage("");
  setProgressionCheckError("");

  const currentDominantBarrier = progressionCheckForm.currentDominantBarrier.trim();
  const treatmentDirectionChanged = progressionCheckForm.treatmentDirectionChanged;

  try {
    const response = await fetch("/api/progression-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId: caseData.id,
        functionalChanges: progressionCheckForm.functionalChanges.trim() || null,
        currentDominantBarrier:
          currentDominantBarrier ||
          (treatmentDirectionChanged ? "" : "No new dominant barrier identified"),
        progressionStatus: progressionCheckForm.progressionStatus.trim(),
        treatmentDirectionChanged,
        reasonTreatmentChanged: treatmentDirectionChanged
          ? progressionCheckForm.reasonTreatmentChanged.trim()
          : null,
        milestoneAchieved: progressionCheckForm.milestoneAchieved.trim() || null,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to submit progression check.");
    }

    const { data: refreshedCase, error: refreshError } = await supabase
      .from("cases")
      .select("*")
      .eq("id", caseData.id)
      .single();

    if (refreshError) throw refreshError;

    const typedCase = refreshedCase as CaseDetail;
    setCaseData(typedCase);
    setCurrentGenerationId(typedCase.current_generation_id);
    setLatestGeneratedPlan(typedCase.generated_output as GeneratedPlan | null);
    setSelectedGeneration(null);

    const { data: longitudinalEvents, error: longitudinalEventError } = await supabase
      .from("longitudinal_events")
      .select("*")
      .eq("case_id", caseData.id)
      .order("created_at", { ascending: false })
      .limit(2);

    if (longitudinalEventError) throw longitudinalEventError;

    const recentEvents = (longitudinalEvents as LongitudinalEventRow[]) || [];
    setRecentLongitudinalEvents(recentEvents);
    setLatestLongitudinalEvent(recentEvents[0] || null);
    setProgressionCheckForm(emptyProgressionCheckForm);
    setProgressionCheckMessage("Progression check saved and case data refreshed.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit progression check.";
    setProgressionCheckError(message);
  } finally {
    setIsSubmittingProgressionCheck(false);
  }
}

  async function handleDeleteCase() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this case? This cannot be undone."
  );

  if (!confirmed) return;

  setIsDeleting(true);

  const { error } = await supabase.from("cases").delete().eq("id", caseData?.id);

  if (error) {
    alert(`Delete failed: ${error.message || "Unknown error"}`);
    setIsDeleting(false);
    return;
  }

  router.push("/cases");
  router.refresh();
}

async function handleDeleteGeneration(generationId: string) {
  if (generationId === currentGenerationId) {
    alert("You cannot delete the current active version. Restore another version first, then delete this one.");
    return;
  }

  const confirmed = window.confirm(
    "Delete this saved version? This cannot be undone."
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("generations")
    .delete()
    .eq("id", generationId);

  if (error) {
    alert(`Delete failed: ${error.message || "Unknown error"}`);
    return;
  }

  setGenerations((prev) => prev.filter((g) => g.id !== generationId));

  setSelectedGeneration((prev) =>
    prev?.id === generationId ? null : prev
  );
}

async function handleSaveCurrentVersion() {
  if (!caseData?.id || !caseData.generated_output) return;

  try {
    setIsSavingCurrentVersion(true);

    const { data: insertedGenerations, error: generationError } = await supabase
      .from("generations")
      .insert([
        {
          case_id: caseData.id,
          prompt_version: "manual-snapshot",
          input_payload: caseData,
          output_payload: caseData.generated_output,
        },
      ])
      .select("id, created_at, prompt_version, input_payload, output_payload");

    if (generationError) {
      throw generationError;
    }

    const newGeneration = insertedGenerations?.[0];

    if (!newGeneration) {
      throw new Error("No generation was created.");
    }

    const { error: caseUpdateError } = await supabase
      .from("cases")
      .update({
        current_generation_id: newGeneration.id,
      })
      .eq("id", caseData.id);

    if (caseUpdateError) {
      throw caseUpdateError;
    }

    setCurrentGenerationId(newGeneration.id);

    setCaseData({
      ...caseData,
      current_generation_id: newGeneration.id,
    });

    setGenerations((prev) => [newGeneration as GenerationRow, ...prev]);
    setSelectedGeneration(null);
  } catch (error) {
    console.error("Failed to save current version:", error);
    alert("Failed to save the current plan as a version.");
  } finally {
    setIsSavingCurrentVersion(false);
  }
}

async function handleSaveCaseEdits() {


  if (!caseData?.id) {
    return;
  }


const updatedFunctionalStatus = {
  ...(caseData.functional_status || {}),
  current_assistance_level: editableFunctionalStatus.current_assistance_level,
  key_barriers: editableFunctionalStatus.key_barriers
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
};

const updatedCaseData = {
  ...caseData,
  title: editableTitle,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
  functional_status: updatedFunctionalStatus,
};


const canonicalPayload = buildCanonicalCasePayload(updatedCaseData);

const clinicalDecisionInput = canonicalPayload.clinicalDecisionInput;
const clinicalDecisionModel = canonicalPayload.clinicalDecisionModel;

  try {
    const { error } = await supabase
      .from("cases")
      .update({
        title: editableTitle,
        client_info: editableClientInfo,
        caregiver_info: editableCaregiverInfo,
        feasibility_context: editableFeasibility,
        functional_status: updatedFunctionalStatus,
        clinician_notes: clinicianNotes,
        clinical_decision_input: clinicalDecisionInput,
clinical_decision_model: clinicalDecisionModel,
reasoning_stale: true,
plan_stale: true,
modules_stale: true,
      })
      .eq("id", caseData.id);

    if (error) throw error;

const { data: savedGenerations, error: snapshotError } = await supabase
  .from("generations")
  .insert([
    {
      case_id: caseData.id,
      prompt_version: "v2-continuity-save",
input_payload: {
  ...caseData,
  title: editableTitle,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
  functional_status: updatedFunctionalStatus,
  clinician_notes: clinicianNotes,
  clinical_decision_input: clinicalDecisionInput,
  clinical_decision_model: clinicalDecisionModel,
  selected_pathway_index: caseData.selected_pathway_index,
  reasoning_stale: true,
  plan_stale: true,
  modules_stale: true,
},
      output_payload: caseData.generated_output,
    },
  ])
 .select("id, created_at, prompt_version, input_payload, output_payload");

if (snapshotError) {
  throw snapshotError;
}

const savedGeneration = savedGenerations?.[0];

if (savedGeneration) {
  setGenerations((prev) => [savedGeneration as GenerationRow, ...prev]);
}

    setCaseData({
      ...caseData,
      title: editableTitle,
      client_info: editableClientInfo,
      caregiver_info: editableCaregiverInfo,
      feasibility_context: editableFeasibility,
      functional_status: updatedFunctionalStatus,
      clinician_notes: clinicianNotes,
      clinical_decision_input: clinicalDecisionInput,
clinical_decision_model: clinicalDecisionModel,
reasoning_stale: true,
plan_stale: true,
modules_stale: true,
    });

    setIsEditing(false);
} catch (error: unknown) {
  console.error("Failed to save case edits:", error);
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  alert(`Failed to save changes: ${message}`);
}
}

// ==============================
// COPY / EXPORT HELPERS
// ==============================


function buildCaseSummaryText() {
  if (!caseData) return "";

  const generated = caseData.generated_output as GeneratedOutput | null;

  return `
==============================
CASE: ${caseData.title || "Untitled Case"}
==============================

CLINICAL FOCUS
--------------
${
  briefingLens === "adl_home_safety"
    ? "ADL / Home Safety"
    : briefingLens === "transfers_mobility"
    ? "Transfers & Mobility"
    : "Caregiver Training"
}

EXECUTIVE BRIEFING
------------------
${executiveBriefing.title}

Priority Focus:
${
  executiveBriefing.instabilityDrivers.length
    ? executiveBriefing.instabilityDrivers.map((i: string) => `• ${i}`).join("\n")
    : "—"
}

Dominant Risks:
${
  executiveBriefing.reassessmentSignals.length
    ? executiveBriefing.reassessmentSignals.map((i: string) => `• ${i}`).join("\n")
    : "—"
}

Caregiver / Environment Considerations:
${
  executiveBriefing.feasibilityConstraints.length
    ? executiveBriefing.feasibilityConstraints.map((i: string) => `• ${i}`).join("\n")
    : "—"
}

CURRENT OPERATIONAL EMPHASIS
----------------------------
${currentOperationalEmphasis || "—"}

Continuity Summary:
${operationalContinuitySummary || "—"}

Why This Matters Now:
${
  emphasisRationale.length
    ? emphasisRationale.map((i) => `• ${i}`).join("\n")
    : "—"
}

Dominant Barriers:
${
  dominantBarriers.length
    ? dominantBarriers.map((i) => `• ${i}`).join("\n")
    : "—"
}

Immediate Operational Actions:
${
  structuredPlanDetails?.immediateActions?.length
    ? structuredPlanDetails.immediateActions.map((i) => `• ${i}`).join("\n")
    : "—"
}

Reassessment Triggers:
${
  operationalReassessmentTriggers.length
    ? operationalReassessmentTriggers.map((i) => `• ${i}`).join("\n")
    : "—"
}

STRUCTURED PLAN DETAILS
-----------------------
Patient Snapshot:
${generated?.patientSnapshot || "—"}

Plan Overview:
${generated?.summary?.planSummary || operationalContinuitySummary || "—"}

Risk Level:
${generated?.summary?.safetyLevel || "—"}

Top Risks:
${
  generated?.summary?.topRisks?.length
    ? generated.summary.topRisks.map((i) => `• ${i}`).join("\n")
    : "—"
}

Caregiver Expectations:
${
  generated?.summary?.caregiverExpectations?.length
    ? generated.summary.caregiverExpectations.map((i) => `• ${i}`).join("\n")
    : "—"
}

FAMILY / CAREGIVER SCRIPT
-------------------------
${
  caregiverScript
    ? `
Conversation Goal:
${caregiverScript.conversationGoal || "—"}

Before Task:
${caregiverScript.beforeTaskScript || "—"}

During Task:
${caregiverScript.duringTaskScript || "—"}

If Patient Struggles:
${caregiverScript.ifPatientStruggles || "—"}

If Patient Resists:
${caregiverScript.ifPatientResists || "—"}

Reassurance:
${caregiverScript.reassuranceLanguage || "—"}

When to Be Firm:
${caregiverScript.whenToBeFirm || "—"}
`.trim()
    : "—"
}

TRANSFER & MOBILITY DETAILS
---------------------------
${
  transferDetails
    ? `
Setup Adjustments:
${(transferDetails.setupAdjustments ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Transfer Cues:
${(transferDetails.transferCues ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Surface Variations:
${(transferDetails.surfaceVariations ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Stop Rules:
${(transferDetails.stopRules ?? []).map((i) => `• ${i}`).join("\n") || "—"}
`.trim()
    : "—"
}

ADL PRIVACY & DIGNITY SUPPORT
-----------------------------
${
  adlPrivacy
    ? `
Privacy Setup:
${(adlPrivacy.privacySetup ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Respectful Cueing:
${(adlPrivacy.respectfulCueing ?? []).map((i) => `• ${i}`).join("\n") || "—"}

When to Step In:
${(adlPrivacy.whenToStepIn ?? []).map((i) => `• ${i}`).join("\n") || "—"}

When to Step Back:
${(adlPrivacy.whenToStepBack ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Dignity Warnings:
${(adlPrivacy.dignityWarnings ?? []).map((i) => `• ${i}`).join("\n") || "—"}
`.trim()
    : "—"
}

EQUIPMENT & FEASIBILITY PLAN
----------------------------
${
  equipmentFeasibility?.feasibilitySnapshot
    ? `
Financial Feasibility:
${mapFinancial(equipmentFeasibility.feasibilitySnapshot.financialFeasibility)}

Environmental Feasibility:
${mapEnvironment(equipmentFeasibility.feasibilitySnapshot.environmentalFeasibility)}

Caregiver Flexibility:
${mapCaregiver(equipmentFeasibility.feasibilitySnapshot.caregiverFlexibility)}

Main Constraint:
${equipmentFeasibility.feasibilitySnapshot.mainConstraint || "—"}
`.trim()
    : "—"
}

${
  equipmentFeasibility?.equipmentPlan?.length
    ? equipmentFeasibility.equipmentPlan
        .map(
          (item, index) => `
Recommendation ${index + 1}: ${item.item || "—"}

Reason:
${item.reason || "—"}

Ideal Setup:
${item.idealSetup || "—"}

Feasible Plan:
${item.item || "—"}

Immediate Workaround:
${item.immediateWorkaround || "—"}

Clinical Decision:
${item.clinicalDecision || item.costComparisonNote || "—"}
`.trim()
        )
        .join("\n\n")
    : ""
}

DECISION ENGINE TRANSPARENCY
----------------------------
Dominant Barrier:
${liveClinicalDecisionModel.dominantBarrier || "—"}

Secondary Barrier:
${liveClinicalDecisionModel.secondaryBarrier || "None"}

Safety Risk:
${liveClinicalDecisionModel.safetyRiskLevel || "—"}

Support Level:
${liveClinicalDecisionModel.supportLevel || "—"}

Selected Strategies:
${
  liveClinicalDecisionModel.selectedStrategies?.length
    ? liveClinicalDecisionModel.selectedStrategies.join(", ")
    : "—"
}

Reasoning Summary:
${liveClinicalDecisionModel.reasoningSummary || "—"}
`.trim();
}

function buildRecommendedApproachSummary() {
  return `
CURRENT OPERATIONAL EMPHASIS
----------------------------
${currentOperationalEmphasis || "—"}

CONTINUITY SUMMARY
------------------
${operationalContinuitySummary || "—"}

WHY THIS MATTERS NOW
--------------------
${
  emphasisRationale.length
    ? emphasisRationale.map((i) => `• ${i}`).join("\n")
    : "—"
}

DOMINANT BARRIERS
-----------------
${
  dominantBarriers.length
    ? dominantBarriers.map((i) => `• ${i}`).join("\n")
    : "—"
}

IMMEDIATE OPERATIONAL ACTIONS
-----------------------------
${
  structuredPlanDetails?.immediateActions?.length
    ? structuredPlanDetails.immediateActions
        .map((i) => `• ${i}`)
        .join("\n")
    : "—"
}

REASSESSMENT TRIGGERS
---------------------
${
  operationalReassessmentTriggers.length
    ? operationalReassessmentTriggers
        .map((i) => `• ${i}`)
        .join("\n")
    : "—"
}
`.trim();
}

async function handleCopySummary() {
const summary = buildCaseSummaryText();

  if (!summary) return;

  await navigator.clipboard.writeText(summary);
  setCopyMessage("Clinical summary copied.");

  setTimeout(() => setCopyMessage(""), 2000);
}

async function handleCopyRecommendedSummary() {
  const summary = buildRecommendedApproachSummary();

  if (!summary) return;

  await navigator.clipboard.writeText(summary);

  setCopyMessage("Recommended approach copied.");

  setTimeout(() => setCopyMessage(""), 2000);
}

function handleDownloadSummary() {
  const summary = buildCaseSummaryText();

  if (!summary || !caseData) return;

  const blob = new Blob([summary], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const safeTitle =
    caseData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
    "case_summary";

  link.download = `${safeTitle}_summary.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

async function handleGenerateCaregiverScript() {
  if (!caseData) return;

  setIsGeneratingCaregiverScript(true);
  setCaregiverScriptError("");

  try {
    const response = await fetch("/api/generate-detail-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
 body: JSON.stringify({
  type: "caregiver_script",
  caseData,
  generatedPlan: caseData.generated_output,
  clinicalDecisionInput: liveClinicalDecisionInput,
  clinicalDecisionModel: liveClinicalDecisionModel,
}),
    });

    const result = await response.json();
    console.log("Equipment feasibility API result:", result);
console.log("Case feasibility context being sent:", caseData.feasibility_context);
    console.log("Caregiver script result:", result);

    if (!result.success) {
      throw new Error(result.error || "Failed to generate caregiver script.");
    }

    setCaregiverScript(result.data);

    try {
const updatedDetailModules = {
  ...(caseData.detail_modules || {}),
  caregiverScript: result.data,
};

const updatedOutput = {
  ...(caseData.generated_output || {}),
};

      const { error } = await supabase
        .from("cases")
.update({
  generated_output: updatedOutput,
    detail_modules: updatedDetailModules,
  modules_stale: false,
})
        .eq("id", caseData.id);

      if (error) {
        throw error;
      }

      if (currentGenerationId) {
        const { error: generationUpdateError } = await supabase
          .from("generations")
          .update({
            output_payload: updatedOutput,
          })
          .eq("id", currentGenerationId);

        if (generationUpdateError) {
          throw generationUpdateError;
        }

        setGenerations((prev) =>
          prev.map((generation) =>
            generation.id === currentGenerationId
              ? { ...generation, output_payload: updatedOutput }
              : generation
          )
        );
      }

setCaseData({
  ...caseData,
  generated_output: updatedOutput,
    detail_modules: updatedDetailModules,
  modules_stale: false,
});

    } catch (e) {
      console.error("Failed to persist caregiver script", e);
    }
  } catch (err: unknown) {
    setCaregiverScriptError(err instanceof Error ? err.message : "Something went wrong.");
  } finally {
    setIsGeneratingCaregiverScript(false);
  }
}

async function handleGenerateTransferDetails() {
  if (!caseData) return;

  setIsGeneratingTransferDetails(true);

  try {
    const response = await fetch("/api/generate-detail-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
  type: "transfer_mobility_details",
  caseData,
  generatedPlan: caseData.generated_output,
  clinicalDecisionInput: liveClinicalDecisionInput,
  clinicalDecisionModel: liveClinicalDecisionModel,
}),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to generate transfer details.");
    }

    setTransferDetails(result.data);

    try {
const updatedDetailModules = {
  ...(caseData.detail_modules || {}),
  transferDetails: result.data,
};

const updatedOutput = {
  ...(caseData.generated_output || {}),
};

      const { error } = await supabase
        .from("cases")
.update({
  generated_output: updatedOutput,
    detail_modules: updatedDetailModules,
  modules_stale: false,
})
        .eq("id", caseData.id);

      if (error) {
        throw error;
      }

setCaseData({
  ...caseData,
  generated_output: updatedOutput,
    detail_modules: updatedDetailModules,
  modules_stale: false,
});
    } catch (e) {
      console.error("Failed to persist transfer details", e);
    }
  } catch (err) {
    console.error("Transfer detail generation failed:", err);
  } finally {
    setIsGeneratingTransferDetails(false);
  }
}


async function handleGenerateAdlPrivacy() {

  if (!caseData) return;

  setIsGeneratingAdlPrivacy(true);

  try {
    const response = await fetch("/api/generate-detail-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  type: "adl_privacy_support",
  caseData,
  generatedPlan: caseData.generated_output,
  clinicalDecisionInput: liveClinicalDecisionInput,
  clinicalDecisionModel: liveClinicalDecisionModel,
}),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to generate ADL privacy support.");
    }

    setAdlPrivacy(result.data);

    // Persist to case
try {
  const updatedDetailModules = {
  ...(caseData.detail_modules || {}),
  adlPrivacy: result.data,
};

const updatedOutput = {
  ...(caseData.generated_output || {}),
};

  const { error } = await supabase
    .from("cases")
    .update({
      generated_output: updatedOutput,
        detail_modules: updatedDetailModules,
  modules_stale: false,
    })
    .eq("id", caseData.id);

  if (error) {
    throw error;
  }

  setCaseData({
    ...caseData,
    generated_output: updatedOutput,
      detail_modules: updatedDetailModules,
  modules_stale: false,
  });
} catch (e) {
  console.error("Failed to persist ADL privacy", e);
}
  } catch (err) {
    console.error("ADL privacy generation failed:", err);
  } finally {
    setIsGeneratingAdlPrivacy(false);
  }
}

async function handleGenerateEquipmentFeasibility() {
  if (!caseData) return;

  setIsGeneratingEquipmentFeasibility(true);

  try {
    const response = await fetch("/api/generate-detail-module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  type: "equipment_feasibility_plan",
  caseData,
  generatedPlan: caseData.generated_output,
  clinicalDecisionInput: liveClinicalDecisionInput,
  clinicalDecisionModel: liveClinicalDecisionModel,
}),
    });

    const result = await response.json();

console.log(
  "Equipment feasibility API result:",
  JSON.stringify(result, null, 2)
);

console.log(
  "Case feasibility context being sent:",
  JSON.stringify(caseData.feasibility_context, null, 2)
);

    if (!result.success) {
      throw new Error(result.error || "Failed to generate equipment feasibility plan.");
    }

const updatedDetailModules = {
  ...(caseData.detail_modules || {}),
  equipmentFeasibility: result.data,
};

const updatedOutput = {
  ...(caseData.generated_output || {}),
};

const { error: updateError } = await supabase
  .from("cases")
  .update({
    generated_output: updatedOutput,
      detail_modules: updatedDetailModules,
  modules_stale: false,
  })
  .eq("id", caseData.id);

if (updateError) {
  throw updateError;
}

setEquipmentFeasibility(result.data);

setCaseData({
  ...caseData,
  generated_output: updatedOutput,
      detail_modules: updatedDetailModules,
  modules_stale: false,
});

  } catch (err) {
    console.error("Equipment feasibility generation failed:", err);
  } finally {
    setIsGeneratingEquipmentFeasibility(false);
  }
}

if (loading) {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-400">Loading case...</p>
      </div>
    </main>
  );
}

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-400">Error loading case: {errorMessage}</p>
        </div>

      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400">Case not found.</p>
        </div>
      </main>
    );
  }
const isViewingHistoricalVersion =
  Boolean(selectedGeneration) && selectedGeneration?.id !== currentGenerationId;

// ==============================
// DERIVED DISPLAY MODEL
// displayCase / generated / executiveBriefing
// ==============================

const displayCase = selectedGeneration?.input_payload
  ? ({
      ...caseData,
      ...selectedGeneration.input_payload,
      generated_output: selectedGeneration.output_payload,
      current_generation_id: selectedGeneration.id,
    } as CaseDetail)
  : caseData;

const generated = displayCase.generated_output as GeneratedOutput | null;

const progressionState = generated?.progression_state;

const liveClinicalDecisionInput = buildClinicalDecisionInputFromCase(displayCase);

const liveClinicalDecisionModel =
  buildClinicalDecisionModel(liveClinicalDecisionInput);

const normalizationInsight =
  buildClinicalNormalizationInsight(displayCase);

const levels = displayCase.functional_status?.adl_assist_levels;

const transferScores = levels
  ? [
      { label: "Bed", value: Number(levels.bed_transfer || 7) },
      { label: "Toilet", value: Number(levels.toilet_transfer || 7) },
      { label: "Shower", value: Number(levels.shower_transfer || 7) },
    ]
  : [];

const worstTransfer =
  transferScores.length > 0
    ? transferScores.reduce((worst, current) =>
        current.value < worst.value ? current : worst
      )
    : null;

 console.log("Generated summary:", generated?.summary);

const operationalPrioritization = generated?.operational_prioritization;

const structuredPlanDetails = generated?.structured_plan_details;

const currentOperationalEmphasis =
  operationalPrioritization?.currentOperationalEmphasis ||
  "No operational emphasis generated";

const emphasisRationale: string[] =
  operationalPrioritization?.emphasisRationale || [];

const dominantBarriers: string[] =
  operationalPrioritization?.dominantBarriers || [];

const adjacentOperationalPriorities =
  operationalPrioritization?.adjacentOperationalPriorities || [];

const operationalReassessmentTriggers: string[] =
  operationalPrioritization?.reassessmentTriggers || [];

const operationalContinuitySummary =
  operationalPrioritization?.continuitySummary || "";

const clinicalAttentionState = displayCase.clinical_attention_state;
const currentLongitudinalState = displayCase.current_longitudinal_state;
const latestEventPayload = latestLongitudinalEvent?.event_payload;
const latestEventCurrentStateSnapshot = latestLongitudinalEvent?.current_state_snapshot;
const latestEventClinicalAttentionSnapshot = latestLongitudinalEvent?.clinical_attention_snapshot;

const clinicalAttentionRows: SummaryRow[] = [
  {
    label: "Category",
    value: readText(clinicalAttentionState, ["category"]),
  },
  {
    label: "Attention statement",
    value: readText(clinicalAttentionState, ["attentionStatement", "attention_statement"]),
  },
  {
    label: "Attention drivers",
    value: readTextList(clinicalAttentionState, ["attentionDrivers", "attention_drivers"]),
  },
  {
    label: "Requires operational review",
    value: formatBoolean(
      readBoolean(clinicalAttentionState, ["requiresOperationalReview", "requires_operational_review"])
    ),
  },
  {
    label: "Reassessment recommended",
    value: formatBoolean(
      readBoolean(clinicalAttentionState, ["reassessmentRecommended", "reassessment_recommended"])
    ),
  },
  {
    label: "Progression status",
    value: readText(clinicalAttentionState, ["progressionStatus", "progression_status"]),
  },
];

const currentLongitudinalRows: SummaryRow[] = [
  {
    label: "Current limiting factor",
    value: readText(currentLongitudinalState, [
      "currentDominantBarrier",
      "current_dominant_barrier",
      "currentLimitingFactor",
      "current_limiting_factor",
    ]),
  },
  {
    label: "Secondary barrier",
    value: readText(currentLongitudinalState, ["secondaryBarrier", "secondary_barrier"]),
  },
  {
    label: "Progression status",
    value: readText(currentLongitudinalState, ["progressionStatus", "progression_status"]),
  },
  {
    label: "Functional changes",
    value: readTextList(currentLongitudinalState, ["functionalChanges", "functional_changes"]),
  },
  {
    label: "Milestone achieved",
    value: readText(currentLongitudinalState, ["milestoneAchieved", "milestone_achieved"]),
  },
  {
    label: "Treatment direction changed",
    value: formatBoolean(
      readBoolean(currentLongitudinalState, ["treatmentDirectionChanged", "treatment_direction_changed"])
    ),
  },
  {
    label: "Reason treatment changed",
    value: readText(currentLongitudinalState, ["reasonTreatmentChanged", "reason_treatment_changed"]),
  },
  {
    label: "Event count",
    value: readNumber(currentLongitudinalState, ["eventCount", "event_count"]),
  },
  {
    label: "Last updated",
    value: formatDateTime(readText(currentLongitudinalState, ["lastUpdatedAt", "last_updated_at"])),
  },
];

const latestEventPayloadSummary = formatObjectSummary(latestEventPayload, [
  "functionalChanges",
  "functional_changes",
  "currentDominantBarrier",
  "current_dominant_barrier",
  "progressionStatus",
  "progression_status",
  "milestoneAchieved",
  "milestone_achieved",
  "treatmentDirectionChanged",
  "treatment_direction_changed",
  "reasonTreatmentChanged",
  "reason_treatment_changed",
]);

const latestEventCurrentStateSummary = formatObjectSummary(latestEventCurrentStateSnapshot, [
  "currentDominantBarrier",
  "current_dominant_barrier",
  "secondaryBarrier",
  "secondary_barrier",
  "progressionStatus",
  "progression_status",
  "functionalChanges",
  "functional_changes",
  "milestoneAchieved",
  "milestone_achieved",
  "treatmentDirectionChanged",
  "treatment_direction_changed",
  "eventCount",
  "event_count",
]);

const latestEventClinicalAttentionSummary = formatObjectSummary(latestEventClinicalAttentionSnapshot, [
  "category",
  "attentionStatement",
  "attention_statement",
  "attentionDrivers",
  "attention_drivers",
  "requiresOperationalReview",
  "requires_operational_review",
  "reassessmentRecommended",
  "reassessment_recommended",
  "progressionStatus",
  "progression_status",
]);

const latestProgressionEventRows: SummaryRow[] = [
  {
    label: "Event type",
    value: latestLongitudinalEvent?.event_type,
  },
  {
    label: "Created",
    value: formatDateTime(latestLongitudinalEvent?.created_at),
  },
  {
    label: "Progression details",
    value: latestEventPayloadSummary,
  },
  {
    label: "Current state snapshot",
    value: latestEventCurrentStateSummary,
  },
  {
    label: "Clinical attention snapshot",
    value: latestEventClinicalAttentionSummary,
  },
];

const shouldRenderProgressionSummaryCards = Boolean(
  clinicalAttentionState ||
    currentLongitudinalState ||
    operationalPrioritization ||
    latestLongitudinalEvent
);

const operationalFocusRows: SummaryRow[] = [
  {
    label: "Current operational emphasis",
    value: operationalPrioritization?.currentOperationalEmphasis,
  },
  {
    label: "Emphasis rationale",
    value: operationalPrioritization?.emphasisRationale,
  },
  {
    label: "Dominant barriers",
    value: operationalPrioritization?.dominantBarriers,
  },
  {
    label: "Adjacent operational priorities",
    value: (operationalPrioritization?.adjacentOperationalPriorities || [])
      .map((priority) => {
        const details = [priority.rationale, priority.monitorFor ? `Monitor for ${priority.monitorFor}` : null]
          .filter(Boolean)
          .join(" — ");

        return [priority.label, details].filter(Boolean).join(": ");
      })
      .filter(Boolean),
  },
  {
    label: "Reassessment triggers",
    value: operationalPrioritization?.reassessmentTriggers,
  },
  {
    label: "Continuity summary",
    value: operationalPrioritization?.continuitySummary,
  },
];

const latestProgressionEvent = recentLongitudinalEvents[0] || latestLongitudinalEvent;
const previousProgressionEvent = recentLongitudinalEvents[1] || null;

const latestEventPreviousStateSnapshot = latestProgressionEvent?.previous_state_snapshot;
const latestEventOperationalEmphasisSnapshot =
  latestProgressionEvent?.operational_emphasis_snapshot;
const previousEventCurrentStateSnapshot = previousProgressionEvent?.current_state_snapshot;
const previousEventClinicalAttentionSnapshot =
  previousProgressionEvent?.clinical_attention_snapshot;
const previousEventOperationalEmphasisSnapshot =
  previousProgressionEvent?.operational_emphasis_snapshot;

const previousDominantBarrierForValidation =
  readText(previousEventCurrentStateSnapshot, [
    "currentDominantBarrier",
    "current_dominant_barrier",
    "currentLimitingFactor",
    "current_limiting_factor",
  ]) ||
  readText(latestEventPreviousStateSnapshot, [
    "currentDominantBarrier",
    "current_dominant_barrier",
    "currentLimitingFactor",
    "current_limiting_factor",
  ]);

const currentDominantBarrierForValidation =
  readText(latestProgressionEvent?.current_state_snapshot, [
    "currentDominantBarrier",
    "current_dominant_barrier",
    "currentLimitingFactor",
    "current_limiting_factor",
  ]) ||
  readText(currentLongitudinalState, [
    "currentDominantBarrier",
    "current_dominant_barrier",
    "currentLimitingFactor",
    "current_limiting_factor",
  ]);

const previousAttentionRequiredForValidation = readText(
  previousEventClinicalAttentionSnapshot,
  ["attentionStatement", "attention_statement"]
);

const currentAttentionRequiredForValidation =
  readText(latestProgressionEvent?.clinical_attention_snapshot, [
    "attentionStatement",
    "attention_statement",
  ]) || readText(clinicalAttentionState, ["attentionStatement", "attention_statement"]);

const previousOperationalEmphasisForValidation = readText(
  previousEventOperationalEmphasisSnapshot,
  ["currentOperationalEmphasis", "current_operational_emphasis"]
);

const currentOperationalEmphasisForValidation =
  readText(latestEventOperationalEmphasisSnapshot, [
    "currentOperationalEmphasis",
    "current_operational_emphasis",
  ]) || operationalPrioritization?.currentOperationalEmphasis || null;

const hasProgressionHistoryForValidation = Boolean(
  previousProgressionEvent ||
    (latestEventPreviousStateSnapshot && latestProgressionEvent?.current_state_snapshot)
);

const longitudinalValidationRows: ValidationComparisonRow[] = [
  {
    label: "Barrier Evolution",
    previousLabel: "Previous Dominant Barrier",
    previousValue: previousDominantBarrierForValidation,
    currentLabel: "Current Dominant Barrier",
    currentValue: currentDominantBarrierForValidation,
  },
  {
    label: "Clinical Attention Evolution",
    previousLabel: "Previous Attention Required",
    previousValue: previousAttentionRequiredForValidation,
    currentLabel: "Current Attention Required",
    currentValue: currentAttentionRequiredForValidation,
  },
  {
    label: "Operational Focus Evolution",
    previousLabel: "Previous Operational Emphasis",
    previousValue: previousOperationalEmphasisForValidation,
    currentLabel: "Current Operational Emphasis",
    currentValue: currentOperationalEmphasisForValidation,
  },
];

const clinicalAttentionRequiresOperationalReview = readBoolean(
  clinicalAttentionState,
  ["requiresOperationalReview", "requires_operational_review"]
);

const clinicalAttentionReassessmentRecommended = readBoolean(
  clinicalAttentionState,
  ["reassessmentRecommended", "reassessment_recommended"]
);

const currentStateFunctionalChanges = readTextList(currentLongitudinalState, [
  "functionalChanges",
  "functional_changes",
]);

const latestEventFunctionalChanges = readTextList(latestEventPayload, [
  "functionalChanges",
  "functional_changes",
]);

const sinceLastVisitFunctionalChanges = currentStateFunctionalChanges.length
  ? currentStateFunctionalChanges
  : latestEventFunctionalChanges;

const sinceLastVisitMilestone =
  readText(currentLongitudinalState, ["milestoneAchieved", "milestone_achieved"]) ||
  readText(latestEventPayload, ["milestoneAchieved", "milestone_achieved"]);

const sinceLastVisitTreatmentDirectionChanged =
  readBoolean(currentLongitudinalState, ["treatmentDirectionChanged", "treatment_direction_changed"]) ??
  readBoolean(latestEventPayload, ["treatmentDirectionChanged", "treatment_direction_changed"]);

const sinceLastVisitReasonTreatmentChanged =
  readText(currentLongitudinalState, ["reasonTreatmentChanged", "reason_treatment_changed"]) ||
  readText(latestEventPayload, ["reasonTreatmentChanged", "reason_treatment_changed"]);

const sinceLastVisitUpdatedAt =
  formatDateTime(readText(currentLongitudinalState, ["lastUpdatedAt", "last_updated_at"])) ||
  formatDateTime(latestLongitudinalEvent?.created_at);

const sinceLastVisitLimitingFactor =
  readText(currentLongitudinalState, [
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
  ]);

const sinceLastVisitProgressionStatus =
  readText(currentLongitudinalState, ["progressionStatus", "progression_status"]) ||
  readText(latestEventPayload, ["progressionStatus", "progression_status"]);

const sinceLastVisitSummaryItems = [
  sinceLastVisitFunctionalChanges.length
    ? `Recent visit notes indicate ${joinReadableList(sinceLastVisitFunctionalChanges)}.`
    : null,
  sinceLastVisitMilestone ? `A milestone was noted: ${sinceLastVisitMilestone}.` : null,
  sinceLastVisitTreatmentDirectionChanged === true
    ? `Treatment direction changed${
        sinceLastVisitReasonTreatmentChanged ? ` because ${sinceLastVisitReasonTreatmentChanged}` : ""
      }.`
    : sinceLastVisitTreatmentDirectionChanged === false
    ? "Treatment direction remains consistent with the prior visit."
    : null,
  sinceLastVisitLimitingFactor || sinceLastVisitProgressionStatus
    ? `Current visit context centers on ${[
        sinceLastVisitLimitingFactor,
        sinceLastVisitProgressionStatus ? `progression described as ${sinceLastVisitProgressionStatus}` : null,
      ]
        .filter(Boolean)
        .join(" with ")}.`
    : null,
].filter((item): item is string => Boolean(item));

const attentionStatement = readText(clinicalAttentionState, [
  "attentionStatement",
  "attention_statement",
]);

const attentionRequiredMetadataRows: SummaryRow[] = [
  {
    label: "Category",
    value: readText(clinicalAttentionState, ["category"]),
  },
  {
    label: "Drivers",
    value: readTextList(clinicalAttentionState, ["attentionDrivers", "attention_drivers"]),
  },
  {
    label: "Review flag",
    value: clinicalAttentionRequiresOperationalReview ? "Operational review flagged" : null,
  },
  {
    label: "Reassessment flag",
    value: clinicalAttentionReassessmentRecommended ? "Reassessment recommended" : null,
  },
];

const compressedRationaleSummary = emphasisRationale.length
  ? emphasisRationale.slice(0, 2).join(" ")
  : operationalContinuitySummary;

const continuityInterpretation =
  generated?.continuity_interpretation || {};

const currentContinuityCondition =
  continuityInterpretation?.currentContinuityCondition ||
  "Patient remains in an active stabilization state with ongoing operational variability.";

const operationalChangeClassification: string[] =
  continuityInterpretation?.operationalChangeClassification || [];

const reassessmentPressureLevel =
  continuityInterpretation?.reassessmentPressureLevel || "low";

const reassessmentPressureLabel =
  reassessmentPressureLevel === "high"
    ? "High"
    : reassessmentPressureLevel === "moderate"
    ? "Moderate"
    : "Low";

const clinicalStatus =
  displayCase.reasoning_stale ||
  displayCase.plan_stale ||
  reassessmentPressureLevel === "high"
    ? "Needs Reassessment"
    : displayCase.modules_stale || reassessmentPressureLevel === "moderate"
    ? "Monitor Closely"
    : "On Track";

const clinicalStatusExplanation =
  clinicalStatus === "Needs Reassessment"
    ? "Current case signals suggest the plan should be reviewed before relying on it."
    : clinicalStatus === "Monitor Closely"
    ? "The plan remains usable, but active pressures should be watched during the visit."
    : "The current plan appears appropriate for the available case information.";

const dominantInstabilityDrivers: string[] =
  continuityInterpretation?.dominantInstabilityDrivers || [];

const operationalDriftSignals: string[] =
  continuityInterpretation?.operationalDriftSignals || [];

const continuityAlerts: string[] =
  continuityInterpretation?.continuityAlerts || [];

const caregiverGuidance: string[] =
  generated?.caregiverGuidance?.length
    ? generated.caregiverGuidance
    : structuredPlanDetails?.feasibilityConstraints ||
      structuredPlanDetails?.caregiverConsiderations ||
      [];

const longitudinalProgressionStatus = readText(currentLongitudinalState, [
  "progressionStatus",
  "progression_status",
]);

const clinicalAttentionProgressionStatus = readText(clinicalAttentionState, [
  "progressionStatus",
  "progression_status",
]);

const progressionAdvancementReadiness =
  progressionState?.advancementReadiness || null;

const explicitTrajectoryFromProgressionStatus =
  mapProgressionStatusToTrajectory(longitudinalProgressionStatus) ||
  mapProgressionStatusToTrajectory(clinicalAttentionProgressionStatus) ||
  mapProgressionStatusToTrajectory(progressionAdvancementReadiness);

const hasHighRegressionOrReassessmentSignal =
  clinicalAttentionReassessmentRecommended === true &&
  (clinicalAttentionRequiresOperationalReview === true ||
    sinceLastVisitTreatmentDirectionChanged === true ||
    clinicalStatus === "Needs Reassessment");

const overallTrajectory: OverallTrajectory =
  explicitTrajectoryFromProgressionStatus ||
  (hasHighRegressionOrReassessmentSignal
    ? "Declining"
    : sinceLastVisitTreatmentDirectionChanged === false
    ? "Stable"
    : "Not enough longitudinal data");

const caseStatusRows: SummaryRow[] = [
  {
    label: "Clinical status",
    value: clinicalStatus,
  },
  {
    label: "Plan status",
    value:
      displayCase.reasoning_stale || displayCase.plan_stale
        ? "Review current plan before relying on it."
        : displayCase.modules_stale
        ? "Plan usable; supporting modules may need refresh."
        : "Current plan is active.",
  },
  {
    label: "Progression status",
    value:
      progressionState?.advancementReadiness ||
      progressionState?.currentPhase ||
      readText(clinicalAttentionState, ["progressionStatus", "progression_status"]),
  },
  {
    label: "Review flags",
    value: [
      clinicalAttentionRequiresOperationalReview ? "Operational review flagged" : null,
      clinicalAttentionReassessmentRecommended ? "Reassessment recommended" : null,
      displayCase.reasoning_stale ? "Reasoning stale" : null,
      displayCase.plan_stale ? "Plan stale" : null,
    ].filter(Boolean) as string[],
  },
];

const nextActionItems = [
  ...(structuredPlanDetails?.immediateActions || []),
  ...operationalReassessmentTriggers.map((trigger) => `Reassess if ${trigger}.`),
  ...(progressionState?.reassessmentTriggers || []).map((trigger) => `Check progression if ${trigger}.`),
  ...(clinicalAttentionRequiresOperationalReview ? ["Review the current treatment direction."] : []),
  ...(clinicalAttentionReassessmentRecommended ? ["Reassess before advancing the plan."] : []),
]
  .filter(Boolean)
  .slice(0, 5);

const renderCommandCenterRows = (rows: SummaryRow[], fallback: string) => (
  <dl className="mt-4 space-y-3 text-sm">
    {hasAnySummaryValue(rows) ? (
      rows.map((row) => (
        <div key={row.label}>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {row.label}
          </dt>
          <dd className="mt-1 leading-relaxed text-gray-200">
            {renderSummaryValue(row.value)}
          </dd>
        </div>
      ))
    ) : (
      <p className="text-gray-500">{fallback}</p>
    )}
  </dl>
);

    const getFocusLabel = (promptVersion?: string | null) => {
  if (promptVersion?.includes("transfers_mobility")) return "Transfers";
  if (promptVersion?.includes("caregiver_training")) return "Caregiver";
  if (promptVersion?.includes("adl_home_safety")) return "ADL";
  return "Unknown";
};

const mapFinancial = (value?: string) => {
  if (value === "low") return "Tight budget — keep costs minimal";
  if (value === "moderate") return "Some flexibility — prioritize key items";
  if (value === "high") return "Flexible — can consider better options";
  return "Unknown";
};

const mapEnvironment = (value?: string) => {
  if (value === "low") return "Space is limited — minimal changes only";
  if (value === "moderate") return "Some room to adjust setup";
  if (value === "high") return "Flexible space — multiple options work";
  return "Unknown";
};

const mapCaregiver = (value?: string) => {
  if (value === "low") return "Limited support — keep tasks simple";
  if (value === "moderate") return "Some help available";
  if (value === "high") return "Strong support — more options possible";
  return "Unknown";
};

const getPriorityBadgeClass = (priority?: string) => {
  const value = priority?.toLowerCase();

  if (value === "high") return "bg-red-700 text-white";
  if (value === "medium") return "bg-yellow-600 text-black";
  if (value === "low") return "bg-green-700 text-white";

  return "bg-gray-700 text-white";
};

const getUrgencyBadgeClass = (urgency?: string) => {
  const value = urgency?.toLowerCase();

  if (value === "immediate") return "bg-red-700 text-white";
  if (value === "short_term") return "bg-yellow-600 text-black";
  if (value === "optional") return "bg-green-700 text-white";

  return "bg-gray-700 text-white";
};

const getCostBadgeClass = (value?: string) => {
  const v = value?.toLowerCase();

  if (v === "high") return "bg-red-700 text-white";
  if (v === "moderate") return "bg-yellow-600 text-black";
  if (v === "low") return "bg-green-700 text-white";

  return "bg-gray-700 text-white";
};

const selectedPlanForExport = {
  title: displayCase.title || "Untitled Case",
  patientSnapshot: generated?.patientSnapshot || "",
  currentOperationalEmphasis,
  immediateActions: structuredPlanDetails?.immediateActions || [],
  summary: generated?.summary || null,
  caregiverGuidance: caregiverGuidance || [],
};
const executiveBriefing = (() => {
  const immediateActions: string[] =
    structuredPlanDetails?.immediateActions || [];

   const instabilityDrivers: string[] =
    structuredPlanDetails?.instabilityDrivers ||
    structuredPlanDetails?.safetyConsiderations ||
    [];

  const feasibilityConstraints: string[] =
    structuredPlanDetails?.feasibilityConstraints ||
    structuredPlanDetails?.caregiverConsiderations ||
    [];

  const environmentalPressures: string[] =
    structuredPlanDetails?.environmentalPressures ||
    structuredPlanDetails?.environmentalConsiderations ||
    [];

  const continuityRisks: string[] =
    structuredPlanDetails?.continuityRisks || [];

  const risks: string[] = generated?.summary?.topRisks || [];

  const caregiverItems: string[] =
    generated?.summary?.caregiverExpectations || [];

  const unique = (items: string[]) =>
    Array.from(new Set(items.filter(Boolean)));

  return {
    title: "Operational Briefing",

    operationalState: currentOperationalEmphasis,

    instabilityDrivers: unique([
      ...dominantBarriers,
      ...instabilityDrivers,
      ...risks,
    ]),

    feasibilityConstraints: unique([
      ...feasibilityConstraints,
      ...environmentalPressures,
      ...caregiverItems,
    ]),

    monitoringPressures: adjacentOperationalPriorities.map(
      (priority) => priority.label || "Unnamed priority"
    ),

    reassessmentSignals: operationalReassessmentTriggers,
  };
})();

const handleRestoreSelectedVersion = async () => {
  if (!selectedGeneration || !caseData?.id) return;

  try {
    setIsRestoringVersion(true);

    const restoredOutput = selectedGeneration.output_payload;
    const restoredInput = selectedGeneration.input_payload || {};

    const restoredSelectedPathwayIndex =
      typeof restoredOutput?.selectedPathwayIndex === "number"
        ? restoredOutput.selectedPathwayIndex
        : typeof caseData.selected_pathway_index === "number"
        ? caseData.selected_pathway_index
        : 0;

    const restoredDetailModules = {
      ...(caseData.detail_modules || {}),
      ...(restoredOutput?.clinicalDetailModules || {}),
    };

    const { error } = await supabase
      .from("cases")
.update({
  title: restoredInput.title ?? caseData.title,
  patient_profile: restoredInput.patient_profile ?? caseData.patient_profile,
  functional_status: restoredInput.functional_status ?? caseData.functional_status,
  goals_preferences: restoredInput.goals_preferences ?? caseData.goals_preferences,
  client_info: restoredInput.client_info ?? caseData.client_info,
  caregiver_info: restoredInput.caregiver_info ?? caseData.caregiver_info,
  feasibility_context: restoredInput.feasibility_context ?? caseData.feasibility_context,
  case_classification: restoredInput.case_classification ?? caseData.case_classification,
  clinical_decision_input:
    restoredInput.clinical_decision_input ?? caseData.clinical_decision_input,
  clinical_decision_model:
    restoredInput.clinical_decision_model ?? caseData.clinical_decision_model,
  clinician_notes: restoredInput.clinician_notes ?? caseData.clinician_notes,
  generated_output: restoredOutput,
  selected_pathway_index: restoredSelectedPathwayIndex,
  detail_modules: restoredDetailModules,
  current_generation_id: selectedGeneration.id,
})

setCaseData({
  ...caseData,
  title: restoredInput.title ?? caseData.title,
  patient_profile: restoredInput.patient_profile ?? caseData.patient_profile,
  functional_status: restoredInput.functional_status ?? caseData.functional_status,
  goals_preferences: restoredInput.goals_preferences ?? caseData.goals_preferences,
  client_info: restoredInput.client_info ?? caseData.client_info,
  caregiver_info: restoredInput.caregiver_info ?? caseData.caregiver_info,
  feasibility_context: restoredInput.feasibility_context ?? caseData.feasibility_context,
  case_classification: restoredInput.case_classification ?? caseData.case_classification,
  clinical_decision_input:
    restoredInput.clinical_decision_input ?? caseData.clinical_decision_input,
  clinical_decision_model:
    restoredInput.clinical_decision_model ?? caseData.clinical_decision_model,
  clinician_notes: restoredInput.clinician_notes ?? caseData.clinician_notes,
  generated_output: restoredOutput,
  selected_pathway_index: restoredSelectedPathwayIndex,
  detail_modules: restoredDetailModules,
  current_generation_id: selectedGeneration.id,
});

    setCaregiverScript(restoredDetailModules.caregiverScript || null);
    setTransferDetails(restoredDetailModules.transferDetails || null);
    setAdlPrivacy(restoredDetailModules.adlPrivacy || null);
    setEquipmentFeasibility(restoredDetailModules.equipmentFeasibility || null);

    setCurrentGenerationId(selectedGeneration.id);
    setSelectedGeneration(null);
  } catch (error) {
    console.error("Failed to restore selected version:", error);
    alert("Failed to restore this version as current.");
  } finally {
    setIsRestoringVersion(false);
  }
};



const handleClinicalFocusChange = async (focus: string) => {
  if (!caseData?.id || isRegeneratingFocus) return;

  try {
    setIsRegeneratingFocus(true);
    setRegeneratingFocus(focus);

    const updatedCasePayload = {
      ...caseData,
      case_classification: {
        ...(caseData.case_classification || {}),
        clinical_focus: focus,
      },
    };

    const canonicalPayload = buildCanonicalCasePayload(updatedCasePayload);
    const clinicalDecisionInput = canonicalPayload.clinicalDecisionInput;
    const clinicalDecisionModel = canonicalPayload.clinicalDecisionModel;
    const progressionState = buildProgressionState({
      canonicalCasePayload: canonicalPayload,
    });

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(canonicalPayload),
    });

const aiData = await aiResponse.json();

console.log("Clinical focus AI response:", aiData);

if (!aiData.success || !aiData.plan) {
  alert(`AI generation failed: ${aiData.error || "Unknown error"}`);
  return;
}

const planWithProgression = {
  ...aiData.plan,
  progression_state: progressionState,
};

console.log("progressionState", progressionState);
console.log("planWithProgression", planWithProgression);

    const plan = planWithProgression;


    const { data: insertedGenerations, error: generationError } = await supabase
      .from("generations")
      .insert([
        {
          case_id: caseData.id,
          prompt_version: `v1-ai-${focus}`,
          input_payload: canonicalPayload,
          output_payload: plan,
        },
      ])
.select("id, created_at, prompt_version, input_payload, output_payload")
    if (generationError) throw generationError;

    const newGeneration = insertedGenerations?.[0];

    console.log("New focus generation:", newGeneration);

    const { error: caseUpdateError } = await supabase
      .from("cases")
      .update({
        case_classification: updatedCasePayload.case_classification,
        clinical_decision_input: clinicalDecisionInput,
        clinical_decision_model: clinicalDecisionModel,
        generated_output: plan,
        reasoning_stale: false,
plan_stale: false,
modules_stale: true,
        current_generation_id:
          newGeneration?.id || caseData.current_generation_id,
      })
      .eq("id", caseData.id);

    if (caseUpdateError) throw caseUpdateError;

    setCaseData((prev) => ({
      ...(prev || caseData),
      case_classification: updatedCasePayload.case_classification,
      clinical_decision_input: clinicalDecisionInput,
      clinical_decision_model: clinicalDecisionModel,
      generated_output: plan,
      reasoning_stale: false,
plan_stale: false,
modules_stale: true,
      current_generation_id: newGeneration?.id || prev?.current_generation_id || caseData.current_generation_id,
    }));

    setLatestGeneratedPlan(plan);
    setSelectedGeneration(null);

    if (newGeneration) {
      setCurrentGenerationId(newGeneration.id);
      setGenerations((prev) => [newGeneration as GenerationRow, ...prev]);
    }
  } catch (error) {
    console.error("Failed to regenerate clinical focus:", error);
    alert("Failed to regenerate plan for this clinical focus.");
  } finally {
    setIsRegeneratingFocus(false);
    setRegeneratingFocus(null);
  }
};

async function handleRegenerateCurrentPlan() {
  if (!caseData?.id || isRegeneratingPlan) return;

  try {
    setIsRegeneratingPlan(true);

const updatedCasePayload = {
  ...caseData,
  title: editableTitle || caseData.title,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
  clinician_notes: clinicianNotes,
};

const canonicalPayload = buildCanonicalCasePayload(updatedCasePayload);
const clinicalDecisionInput = canonicalPayload.clinicalDecisionInput;
const clinicalDecisionModel = canonicalPayload.clinicalDecisionModel;
const progressionState = buildProgressionState({
  canonicalCasePayload: canonicalPayload,
});

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(canonicalPayload),
    });

    const aiData = await aiResponse.json();

    if (!aiData.success || !aiData.plan) {
      alert(`AI generation failed: ${aiData.error || "Unknown error"}`);
      return;
    }

const plan = {
  ...aiData.plan,
  progression_state: progressionState,
};

    const { data: insertedGenerations, error: generationError } = await supabase
      .from("generations")
      .insert([
        {
          case_id: caseData.id,
          prompt_version: `v1-ai-${caseData.case_classification?.clinical_focus || "adl_home_safety"}-regenerated`,
          input_payload: canonicalPayload,
          output_payload: plan,
        },
      ])
.select("id, created_at, prompt_version, input_payload, output_payload")
    if (generationError) throw generationError;

    const newGeneration = insertedGenerations?.[0];

const { error: caseUpdateError } = await supabase
  .from("cases")
  .update({
    title: updatedCasePayload.title,
    client_info: updatedCasePayload.client_info,
    caregiver_info: updatedCasePayload.caregiver_info,
    clinician_notes: clinicianNotes,

    clinical_decision_input: clinicalDecisionInput,
    clinical_decision_model: clinicalDecisionModel,
    generated_output: plan,
    reasoning_stale: false,
    plan_stale: false,
    modules_stale: true,
    current_generation_id: newGeneration?.id || caseData.current_generation_id,
  })
  .eq("id", caseData.id);

if (caseUpdateError) throw caseUpdateError;

setCaseData({
  ...caseData,
  title: updatedCasePayload.title,
  client_info: updatedCasePayload.client_info,
  caregiver_info: updatedCasePayload.caregiver_info,
  feasibility_context: updatedCasePayload.feasibility_context,
  clinician_notes: clinicianNotes,

  clinical_decision_input: clinicalDecisionInput,
  clinical_decision_model: clinicalDecisionModel,
  generated_output: plan,
  reasoning_stale: false,
  plan_stale: false,
  modules_stale: true,
  current_generation_id: newGeneration?.id || caseData.current_generation_id,
});
    setCaregiverScript(null);
    setTransferDetails(null);
    setAdlPrivacy(null);

    setLatestGeneratedPlan(plan);
    setSelectedGeneration(null);

    if (newGeneration) {
      setCurrentGenerationId(newGeneration.id);
      setGenerations((prev) => [newGeneration as GenerationRow, ...prev]);
    }

    setIsEditing(false);
  } catch (error) {
    console.error("Failed to regenerate current plan:", error);
    alert("Failed to regenerate the current plan.");
  } finally {
    setIsRegeneratingPlan(false);
  }
}

// ==============================
// RENDER LAYER
// JSX below should prefer displayCase, generated
// Do not use caseData here unless intentionally operating on live case state
// ==============================

return (
<main className="min-h-screen bg-gray-950 text-white px-6 pb-24 pt-0">
{/* OWNERSHIP: Patient Command Center — sticky orientation header for current case context. */}
<StickyOperationalHeader
  title={displayCase.title}
  isViewingHistoricalVersion={isViewingHistoricalVersion}
/>

<div className="max-w-5xl mx-auto space-y-6 pt-28 sm:pt-20">


{/* ==============================
    OWNERSHIP: PATIENT COMMAND CENTER
    Current-orientation content retained in place for Phase 1 ownership classification.
============================== */}

<section
  data-ownership="patient-command-center"
  className="rounded-3xl border border-blue-900/70 bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950/50 p-5 shadow-2xl shadow-blue-950/20 sm:p-6"
>
  <div className="mb-5 flex flex-col gap-3 border-b border-gray-800 pb-4 md:flex-row md:items-start md:justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
        Command Center
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
        Current clinical reality
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
        First-read orientation for what is happening, what needs attention, what treatment should focus on, and what should happen next.
      </p>
    </div>
  </div>

  <div className="grid gap-4 lg:grid-cols-2">
    <article className="rounded-2xl border border-gray-800 bg-gray-950/80 p-4 lg:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
        1. Case Status
      </p>
      <div className="mt-2 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Overall Trajectory
          </p>
          <h2 className="mt-1 text-3xl font-bold text-white">
            {overallTrajectory}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            Patient trajectory based on current longitudinal progression signals.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-800/70 bg-blue-950/30 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
            Clinical Status
          </p>
          <p className="mt-1 max-w-xs text-sm font-semibold text-blue-50">
            {clinicalStatus}
          </p>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-blue-100/70">
            {clinicalStatusExplanation}
          </p>
        </div>
      </div>
      {renderCommandCenterRows(caseStatusRows, "No case status details are available yet.")}
    </article>

    <article className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
        2. Since Last Visit
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">
        Change summary
      </h2>
      {sinceLastVisitSummaryItems.length > 0 ? (
        <div className="mt-4 space-y-2 text-sm leading-relaxed text-gray-200">
          {sinceLastVisitSummaryItems.map((summary, index) => (
            <p key={`${summary}-${index}`}>{summary}</p>
          ))}
          {sinceLastVisitUpdatedAt ? (
            <p className="pt-1 text-xs text-gray-500">Updated {sinceLastVisitUpdatedAt}</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          No longitudinal update has been recorded yet.
        </p>
      )}
    </article>

    <article className="rounded-2xl border border-red-900/60 bg-red-950/15 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
        3. Attention Required
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">
        {attentionStatement || "No clinical attention statement is available yet."}
      </h2>
      <div className="mt-4 rounded-2xl border border-red-900/40 bg-gray-950/40 p-3">
        {renderCommandCenterRows(attentionRequiredMetadataRows, "No secondary attention metadata is available yet.")}
      </div>
    </article>

    <article className="rounded-2xl border border-emerald-900/60 bg-emerald-950/15 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
        4. Current Focus
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">
        {currentOperationalEmphasis}
      </h2>
      {compressedRationaleSummary ? (
        <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">
          {compressedRationaleSummary}
        </p>
      ) : null}
      {dominantBarriers.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-gray-200">
          {dominantBarriers.slice(0, 3).map((barrier, index) => (
            <li key={`${barrier}-${index}`} className="flex gap-2 leading-relaxed">
              <span className="mt-1 text-emerald-300">•</span>
              <span>{barrier}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          No dominant barriers have been generated yet.
        </p>
      )}
    </article>

    <article className="rounded-2xl border border-blue-900/60 bg-blue-950/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
        5. Next Action
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">
        What to do next
      </h2>
      {nextActionItems.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-gray-200">
          {nextActionItems.map((action, index) => (
            <li key={`${action}-${index}`} className="flex gap-2 leading-relaxed">
              <span className="mt-1 text-blue-300">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          No immediate action is documented yet. Continue with the current focus and update progression when new visit findings are available.
        </p>
      )}
    </article>
  </div>
</section>

{/* OWNERSHIP: Patient Command Center — progression check workflow remains current-visit orientation. */}
<section
  data-ownership="patient-command-center"
  className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5"
>
  <div className="mb-4">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
      Progression Check
    </p>
    <h2 className="mt-1 text-xl font-semibold text-white">
      Quick progression validation
    </h2>
    <p className="mt-1 text-sm text-gray-400">
      Minimal entry point for recording whether the current treatment direction still matches the case.
    </p>
  </div>

  <form onSubmit={handleSubmitProgressionCheck} className="space-y-4">
    <div>
      <label htmlFor="functionalChanges" className="text-sm font-medium text-gray-200">
        Functional changes
      </label>
      <textarea
        id="functionalChanges"
        value={progressionCheckForm.functionalChanges}
        onChange={(event) =>
          setProgressionCheckForm((previous) => ({
            ...previous,
            functionalChanges: event.target.value,
          }))
        }
        rows={3}
        className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        placeholder="Briefly note what changed since the last visit."
      />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="currentDominantBarrier" className="text-sm font-medium text-gray-200">
          Current limiting factor
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Optional unless treatment direction changed.
        </p>
        <input
          id="currentDominantBarrier"
          type="text"
          required={progressionCheckForm.treatmentDirectionChanged}
          value={progressionCheckForm.currentDominantBarrier}
          onChange={(event) =>
            setProgressionCheckForm((previous) => ({
              ...previous,
              currentDominantBarrier: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="e.g., transfer safety, caregiver availability"
        />
      </div>

      <div>
        <label htmlFor="progressionStatus" className="text-sm font-medium text-gray-200">
          Progression status
        </label>
        <select
          id="progressionStatus"
          required
          value={progressionCheckForm.progressionStatus}
          onChange={(event) =>
            setProgressionCheckForm((previous) => ({
              ...previous,
              progressionStatus: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="Progressing As Expected">Progressing As Expected</option>
          <option value="Progressing Faster Than Expected">Progressing Faster Than Expected</option>
          <option value="Minimal Progress">Minimal Progress</option>
          <option value="Plateau Emerging">Plateau Emerging</option>
          <option value="Regression Detected">Regression Detected</option>
        </select>
      </div>
    </div>

    <div>
      <label htmlFor="milestoneAchieved" className="text-sm font-medium text-gray-200">
        Milestone achieved <span className="text-gray-500">(optional)</span>
      </label>
      <input
        id="milestoneAchieved"
        type="text"
        value={progressionCheckForm.milestoneAchieved}
        onChange={(event) =>
          setProgressionCheckForm((previous) => ({
            ...previous,
            milestoneAchieved: event.target.value,
          }))
        }
        className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        placeholder="e.g., completes toilet transfer with supervision"
      />
    </div>

    <label className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300">
      <input
        type="checkbox"
        checked={progressionCheckForm.treatmentDirectionChanged}
        onChange={(event) =>
          setProgressionCheckForm((previous) => ({
            ...previous,
            treatmentDirectionChanged: event.target.checked,
            reasonTreatmentChanged: event.target.checked
              ? previous.reasonTreatmentChanged
              : "",
          }))
        }
        className="mt-1"
      />
      <span>
        Treatment direction changed
        <span className="block text-xs text-gray-500">
          Check only if the operational emphasis should be refreshed from this progression check.
        </span>
      </span>
    </label>

    {progressionCheckForm.treatmentDirectionChanged && (
      <div>
        <label htmlFor="reasonTreatmentChanged" className="text-sm font-medium text-gray-200">
          Reason Treatment Changed
        </label>
        <textarea
          id="reasonTreatmentChanged"
          required
          value={progressionCheckForm.reasonTreatmentChanged}
          onChange={(event) =>
            setProgressionCheckForm((previous) => ({
              ...previous,
              reasonTreatmentChanged: event.target.value,
            }))
          }
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="Briefly explain why the treatment direction changed."
        />
      </div>
    )}

    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={isSubmittingProgressionCheck}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmittingProgressionCheck ? "Saving..." : "Save progression check"}
      </button>

      {progressionCheckMessage && (
        <p className="text-sm text-green-400">{progressionCheckMessage}</p>
      )}

      {progressionCheckError && (
        <p className="text-sm text-red-400">{progressionCheckError}</p>
      )}
    </div>
  </form>

  {/* OWNERSHIP: Patient Reference Workspace — supporting progression summaries remain inline for Phase 1. */}
  <SupportingProgressionSummaries
    shouldRender={shouldRenderProgressionSummaryCards}
    clinicalAttentionRows={clinicalAttentionRows}
    currentLongitudinalRows={currentLongitudinalRows}
    latestProgressionEventRows={latestProgressionEventRows}
    operationalFocusRows={operationalFocusRows}
    hasProgressionHistoryForValidation={hasProgressionHistoryForValidation}
    longitudinalValidationRows={longitudinalValidationRows}
  />
</section>

{/* OWNERSHIP: Patient Command Center — operational pressures support current treatment prioritization. */}
<section
  data-ownership="patient-command-center"
  className="rounded-2xl border border-gray-800 bg-gray-950/40 p-5"
>
  <div className="mb-4">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
      Operational Pressures
    </p>
    <h2 className="mt-1 text-xl font-semibold text-white">
      Pressures shaping what can safely happen next
    </h2>
  </div>

  <div className="grid gap-4 lg:grid-cols-3">
    <CaregiverFeasibilityCard
      caregiverGuidance={caregiverGuidance}
      fallbackFeasibilityItems={
        structuredPlanDetails?.feasibilityConstraints ||
        structuredPlanDetails?.caregiverConsiderations ||
        []
      }
    />

    <EnvironmentalPressureCard
      environmentalPressures={
        structuredPlanDetails?.environmentalPressures ||
        structuredPlanDetails?.environmentalConsiderations ||
        []
      }
    />

    <TransferMobilityPressureCard
      worstTransfer={worstTransfer}
      transferScores={transferScores}
      executionPressurePoints={
        structuredPlanDetails?.executionPressurePoints ||
        structuredPlanDetails?.treatmentExecutionNotes ||
        []
      }
    />
  </div>
</section>

{/* ==============================
    OWNERSHIP: PATIENT REFERENCE WORKSPACE
    Review, generated, context-heavy, transparency, module, snapshot, and history content retained in place for Phase 1 ownership classification.
============================== */}

<section
  data-ownership="patient-reference-workspace"
  className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-5"
>
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
      Reference Workspace
    </p>
    <h2 className="mt-1 text-xl font-semibold text-white">
      Collapsed supporting information
    </h2>
    <p className="mt-1 text-sm text-gray-400">
      Open these sections when you need case details, generated report content, modules, transparency, or history.
    </p>
  </div>

{/* ==============================
    RENDER: GENERATED PLAN
            .slice(0, 5)
            .map((item: string, index: number) => (
              <div
                key={index}
                className="rounded-md bg-red-950/30 border border-red-900/50 px-2 py-1 text-xs text-red-100"
              >
                {item}
              </div>
            ))
        ) : (
          <div className="text-xs text-gray-500">No instability drivers identified.</div>
        )}
      </div>
    </div>

    <div className="rounded-lg border border-emerald-900/60 bg-gray-950/60 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400 mb-2">
        Feasibility Constraints
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.feasibilityConstraints.length > 0 ? (
          executiveBriefing.feasibilityConstraints
            .slice(0, 5)
            .map((item: string, index: number) => (
              <div
                key={index}
                className="rounded-md bg-emerald-950/30 border border-emerald-900/50 px-2 py-1 text-xs text-emerald-100"
              >
                {item}
              </div>
            ))
        ) : (
          <div className="text-xs text-gray-500">No feasibility constraints identified.</div>
        )}
      </div>
    </div>

    <div className="rounded-lg border border-blue-900/60 bg-gray-950/60 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-400 mb-2">
        Monitoring Pressures
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.monitoringPressures.length > 0 ? (
          executiveBriefing.monitoringPressures
            .slice(0, 5)
            .map((item: string, index: number) => (
              <div
                key={index}
                className="rounded-md bg-blue-950/30 border border-blue-900/50 px-2 py-1 text-xs text-blue-100"
              >
                {item}
              </div>
            ))
        ) : (
          <div className="text-xs text-gray-500">No monitoring pressures identified.</div>
        )}
      </div>
    </div>

    <div className="rounded-lg border border-yellow-900/60 bg-gray-950/60 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-yellow-400 mb-2">
        Reassessment Signals
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.reassessmentSignals.length > 0 ? (
          executiveBriefing.reassessmentSignals
            .slice(0, 5)
            .map((item: string, index: number) => (
              <div
                key={index}
                className="rounded-md bg-yellow-950/30 border border-yellow-900/50 px-2 py-1 text-xs text-yellow-100"
              >
                {item}
              </div>
            ))
        ) : (
          <div className="text-xs text-gray-500">No reassessment signals identified.</div>
        )}
      </div>
    </div>
  </div>
</div>
</details>

{/* Adjacent Operational Priorities */}

<AdjacentOperationalPrioritiesReference
  adjacentOperationalPriorities={adjacentOperationalPriorities}
  isExpanded={showAlternativeApproaches}
  onToggle={() => setShowAlternativeApproaches((prev) => !prev)}
/>

{/* ==============================
    RENDER: STRUCTURED PLAN DETAILS
============================== */}

<StructuredPlanDetails
  patientSnapshot={generated?.patientSnapshot}
  instabilityDrivers={
    structuredPlanDetails?.instabilityDrivers ||
    structuredPlanDetails?.safetyConsiderations ||
    []
  }
/>

{/* ==============================
    RENDER: CASE HEADER / DETAILS
============================== */}

{/* CASE HEADER + BASIC DETAILS */}

<details className="rounded-xl border border-gray-800 bg-gray-900 p-6">
  <summary className="flex cursor-pointer items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold text-white">Case Details</h2>
      <p className="mt-1 text-sm text-gray-400">Entered case information and editable structured fields.</p>
    </div>
    <span className="text-xs tracking-wide text-gray-300">Show</span>
  </summary>

<div className="mt-6">
  <div className="flex items-start justify-between gap-4 mb-4">

  {/* TITLE / EDIT TITLE */}
  <div>
  {isEditing ? (
    <input
      type="text"
      value={editableTitle}
      onChange={(e) => setEditableTitle(e.target.value)}
      className="mb-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-3xl font-bold text-white"
      placeholder="Untitled Case"
    />
  ) : (
    <h1 className="text-3xl font-bold mb-2">
      {displayCase.title || "Untitled Case"}
    </h1>
  )}

  {isEditing && (
    <div className="mb-3 rounded-lg border border-orange-700 bg-orange-950/40 px-3 py-2 text-sm text-orange-200">
      Edit Mode Active — fields are not editable yet. Next step is wiring one safe input at a time.
    </div>
  )}

  {/* FOCUS + SEVERITY BADGES */}

  <div className="mb-2 flex items-center gap-2">
    {generated?.focusApplied && (
      <span className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
        Focus: {generated.focusApplied}
      </span>
    )}

    <span className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
      Severity: {worstTransfer ? `${worstTransfer.value} (${worstTransfer.label})` : "—"}
    </span>
  </div>

  <p className="text-sm text-gray-400">
    Created: {new Date(displayCase.created_at).toLocaleString()}
  </p>

  <p className="text-sm text-gray-400 mt-1">
    Clinical Focus:{" "}
    <span className="text-white font-medium">
      {displayCase.case_classification?.clinical_focus === "transfers_mobility"
        ? "Transfers & Mobility"
        : displayCase.case_classification?.clinical_focus === "caregiver_training"
        ? "Caregiver Training"
        : "ADL / Home Safety"}
    </span>
  </p>

  {!isEditing && (
    <div className="mt-4 rounded-lg border border-blue-800 bg-blue-950/30 p-4">
      <button
        type="button"
        onClick={() => setShowDecisionTransparency((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-blue-200">
          Decision Engine Transparency
        </h3>

        <span className="text-xs text-blue-300">
          {showDecisionTransparency ? "Hide" : "Show"}
        </span>
      </button>

      {showDecisionTransparency && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-blue-300">Dominant Barrier</p>
            <p className="text-white font-medium">
              {liveClinicalDecisionModel.dominantBarrier || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-blue-300">Secondary Barrier</p>
            <p className="text-white font-medium">
              {liveClinicalDecisionModel.secondaryBarrier || "None"}
            </p>
          </div>

          <div>
            <p className="text-xs text-blue-300">Safety Risk</p>
            <p className="text-white font-medium">
              {liveClinicalDecisionModel.safetyRiskLevel || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-blue-300">Support Level</p>
            <p className="text-white font-medium">
              {liveClinicalDecisionModel.supportLevel || "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-blue-300">Selected Strategies</p>
            <p className="text-white font-medium">
              {liveClinicalDecisionModel.selectedStrategies?.length
                ? liveClinicalDecisionModel.selectedStrategies.join(", ")
                : "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-blue-300">Reasoning Summary</p>
            <p className="text-gray-200 leading-relaxed">
              {liveClinicalDecisionModel.reasoningSummary || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  )}

  </div>

  <div className="hidden">
    {copyMessage && (
      <p className="text-sm text-gray-400 mt-3">{copyMessage}</p>
    )}
  </div>
  </div>

{/* CASE DETAIL SUMMARY */}
<div className="space-y-2 text-sm text-gray-300">


 {isEditing ? (
  <div className="mt-4 grid gap-3 rounded-lg border border-blue-800 bg-blue-950/20 p-4 md:grid-cols-2">
    <div>
      <label className="mb-1 block text-xs text-gray-400">Client Name</label>
      <input
        type="text"
        value={editableClientInfo.client_name}
        onChange={(e) =>
          setEditableClientInfo((prev) => ({
            ...prev,
            client_name: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">Client Phone</label>
      <input
        type="text"
        value={editableClientInfo.phone}
        onChange={(e) =>
          setEditableClientInfo((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">Client Email</label>
      <input
        type="email"
        value={editableClientInfo.email}
        onChange={(e) =>
          setEditableClientInfo((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">Client Address</label>
      <input
        type="text"
        value={editableClientInfo.address}
        onChange={(e) =>
          setEditableClientInfo((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">Caregiver Name</label>
      <input
        type="text"
        value={editableCaregiverInfo.caregiver_name}
        onChange={(e) =>
          setEditableCaregiverInfo((prev) => ({
            ...prev,
            caregiver_name: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">
        Caregiver Relationship
      </label>
      <input
        type="text"
        value={editableCaregiverInfo.relationship}
        onChange={(e) =>
          setEditableCaregiverInfo((prev) => ({
            ...prev,
            relationship: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-gray-400">Caregiver Phone</label>
      <input
        type="text"
        value={editableCaregiverInfo.phone}
        onChange={(e) =>
          setEditableCaregiverInfo((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      />
    </div>
  </div>
) : (
  <div className="mt-4 grid gap-3 rounded-lg border border-gray-800 bg-gray-950/40 p-4 md:grid-cols-2">
    <div>
      <p className="mb-1 text-xs text-gray-500">Client Name</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.client_info?.client_name || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Client Phone</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.client_info?.phone || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Client Email</p>
      <p className="break-all rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.client_info?.email || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Client Address</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.client_info?.address || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Caregiver Name</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.caregiver_info?.caregiver_name || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Caregiver Relationship</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.caregiver_info?.relationship || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Caregiver Phone</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.caregiver_info?.phone || "—"}
      </p>
    </div>
  </div>
)}

<div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">

  <div className="mb-4 flex items-center justify-between">
    <h3 className="text-sm font-semibold text-gray-200">
      Operational Case Inputs
    </h3>

    <span className="text-xs text-gray-500">
      Structured reasoning inputs
    </span>
  </div>

  <div className="grid gap-3 md:grid-cols-2">

    <div>
      <p className="mb-1 text-xs text-gray-500">Age Range</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.patient_profile?.age_range || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Primary Diagnosis</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.patient_profile?.primary_diagnosis || "—"}
      </p>
    </div>

   <div>
  <p className="mb-1 text-xs text-gray-500">Current Assistance Level</p>

  {isEditing ? (
    <input
      type="text"
      value={editableFunctionalStatus.current_assistance_level}
      onChange={(e) =>
        setEditableFunctionalStatus((prev) => ({
          ...prev,
          current_assistance_level: e.target.value,
        }))
      }
      className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
    />
  ) : (
    <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
      {displayCase.functional_status?.current_assistance_level || "—"}
    </p>
  )}
</div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Primary Goal</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.goals_preferences?.primary_goal || "—"}
      </p>
    </div>

    <div className="md:col-span-2">
      <p className="mb-1 text-xs text-gray-500">Key Barriers</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.functional_status?.key_barriers?.length
          ? displayCase.functional_status.key_barriers.join(", ")
          : "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Case Type</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.case_classification?.case_type || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Clinical Focus</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.case_classification?.clinical_focus || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Bathroom Type</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.environment?.bathroom_type || "—"}
      </p>
    </div>

    <div>
      <p className="mb-1 text-xs text-gray-500">Stairs Present</p>
      <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
        {displayCase.environment?.stairs_present || "—"}
      </p>
    </div>

<div>
  <p className="mb-1 text-xs text-gray-500">Financial Constraint</p>
  <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
    {displayCase.feasibility_context?.financial_constraint || "—"}
  </p>
</div>

<div>
  <p className="mb-1 text-xs text-gray-500">Environmental Constraint</p>
  <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
    {displayCase.feasibility_context?.environmental_constraint || "—"}
  </p>
</div>

<div>
  <p className="mb-1 text-xs text-gray-500">Equipment Access</p>
  <p className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white">
    {displayCase.feasibility_context?.equipment_access || "—"}
  </p>
</div>

  </div>
</div>

<div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-sm font-semibold text-gray-200">
      Clinician Notes
    </h3>

    <span className="text-xs text-gray-500">
      Operational context
    </span>
  </div>

  {isEditing ? (
    <textarea
      value={clinicianNotes}
      onChange={(e) => setClinicianNotes(e.target.value)}
      rows={5}
      placeholder="Add observations, visit context, caregiver concerns, patient response, or follow-up reminders..."
      className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white"
    />
  ) : (
    <div className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2">
      <p className="whitespace-pre-wrap text-sm text-gray-300">
        {displayCase.clinician_notes || "—"}
      </p>
    </div>
  )}
</div>


</div>

</div>
</details>

{/* ==============================
    RENDER: CLINICAL FOCUS / WARNINGS
{/* ==============================
    RENDER: DETAIL MODULES
============================== */}

<details className="rounded-xl border border-purple-800 bg-gray-950 p-6">
  <summary className="flex cursor-pointer items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold text-white">Detail Modules</h2>
      <p className="mt-1 text-sm text-gray-400">Generated caregiver, transfer, ADL, and equipment support modules.</p>
    </div>
    <span className="text-xs tracking-wide text-purple-300">Show</span>
  </summary>

  <div className="mt-6 space-y-6">
     {/* DETAIL MODULE: FAMILY / CAREGIVER SCRIPT */}

<div className="rounded-xl border border-purple-800 bg-gray-950 p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold">
        Family / Caregiver Script
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Plain-language support for caregiver communication and task carryover.
      </p>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setShowCaregiverGuidance((prev) => !prev)}
        className="rounded-lg border border-purple-700 px-4 py-2 text-sm font-medium text-purple-200 hover:bg-purple-950/40"
      >
        {showCaregiverGuidance ? "Hide" : "Show"}
      </button>

      <button
        type="button"
        onClick={handleGenerateCaregiverScript}
        disabled={isGeneratingCaregiverScript}
        className="shrink-0 rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
      >
        {isGeneratingCaregiverScript ? "Generating..." : "Generate"}
      </button>
    </div>
  </div>

  {caregiverScriptError && (
    <p className="text-sm text-red-400 mt-4">
      {caregiverScriptError}
    </p>
  )}

  {showCaregiverGuidance && (
    <div className="mt-4">
      {caregiverScript ? (
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Conversation Goal
            </p>
            <p>{caregiverScript.conversationGoal || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Before Task Script
            </p>
            <p>{caregiverScript.beforeTaskScript || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              During Task Script
            </p>
            <p>{caregiverScript.duringTaskScript || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              If Patient Struggles
            </p>
            <p>{caregiverScript.ifPatientStruggles || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              If Patient Resists
            </p>
            <p>{caregiverScript.ifPatientResists || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Reassurance Language
            </p>
            <p>{caregiverScript.reassuranceLanguage || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              When to Be Firm
            </p>
            <p>{caregiverScript.whenToBeFirm || "—"}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No script generated yet.
        </p>
      )}
    </div>
  )}
</div>

       {/* TRANSFER & MOBILITY DETAILS */}

<div className="mt-6 grid gap-6">
  <div className="rounded-xl border border-blue-800 bg-gray-950 p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">Transfer & Mobility Details</h3>
        <p className="text-sm text-gray-400 mt-1">
          Practical setup, cueing, surface variation, and stop-rule details.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowTransferDetails((prev) => !prev)}
          className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-950/40"
        >
          {showTransferDetails ? "Hide" : "Show"}
        </button>

        <button
          type="button"
          onClick={handleGenerateTransferDetails}
          disabled={isGeneratingTransferDetails}
          className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isGeneratingTransferDetails ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>

    {showTransferDetails && (
      <div className="mt-4">
        {transferDetails ? (
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Setup Adjustments</p>
              <ul className="list-disc pl-5 space-y-1">
                {(transferDetails.setupAdjustments ?? []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Transfer Cues</p>
              <ul className="list-disc pl-5 space-y-1">
                {(transferDetails.transferCues ?? []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Surface Variations</p>
              <ul className="list-disc pl-5 space-y-1">
                {(transferDetails.surfaceVariations ?? []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Stop Rules</p>
              <ul className="list-disc pl-5 space-y-1">
                {(transferDetails.stopRules ?? []).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No transfer details generated yet.</p>
        )}
      </div>
    )}
  </div>



<div className="rounded-xl border border-emerald-800 bg-gray-950 p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold">
        ADL Privacy & Dignity Support
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Guidance for maintaining dignity, privacy, and respectful support during sensitive ADLs.
      </p>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setShowAdlPrivacySupport((prev) => !prev)}
        className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-950/40"
      >
        {showAdlPrivacySupport ? "Hide" : "Show"}
      </button>

      <button
        type="button"
        onClick={handleGenerateAdlPrivacy}
        disabled={isGeneratingAdlPrivacy}
        className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
      >
        {isGeneratingAdlPrivacy ? "Generating..." : "Generate"}
      </button>
    </div>
  </div>

  {showAdlPrivacySupport && (
    <div className="mt-4">
      {adlPrivacy ? (
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
              Privacy Setup
            </p>

            <ul className="list-disc pl-5 space-y-1">
              {(adlPrivacy.privacySetup ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
              Respectful Cueing
            </p>

            <ul className="list-disc pl-5 space-y-1">
              {(adlPrivacy.respectfulCueing ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
              When to Step In
            </p>

            <ul className="list-disc pl-5 space-y-1">
              {(adlPrivacy.whenToStepIn ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
              When to Step Back
            </p>

            <ul className="list-disc pl-5 space-y-1">
              {(adlPrivacy.whenToStepBack ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
              Dignity Warnings
            </p>

            <ul className="list-disc pl-5 space-y-1">
              {(adlPrivacy.dignityWarnings ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No ADL privacy support generated yet.
        </p>
      )}
    </div>
  )}
</div>
</div>

{/* EQUIPMENT & FEASIBILITY PLAN */}

<div className="mt-6 rounded-xl border border-orange-500 bg-gray-900 p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold">Equipment & Feasibility Plan</h3>
      <p className="text-sm text-gray-400 mt-1">
        Compare ideal equipment setup against what is realistic based on cost, home setup, and caregiver constraints.
      </p>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setShowEquipmentFeasibility((prev) => !prev)}
        className="rounded-lg border border-orange-700 px-4 py-2 text-sm font-medium text-orange-200 hover:bg-orange-950/40"
      >
        {showEquipmentFeasibility ? "Hide" : "Show"}
      </button>

      <button
        type="button"
        onClick={handleGenerateEquipmentFeasibility}
        disabled={isGeneratingEquipmentFeasibility}
        className="shrink-0 rounded-lg bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGeneratingEquipmentFeasibility ? "Generating..." : "Generate"}
      </button>
    </div>
  </div>

  {showEquipmentFeasibility && (
    <div className="mt-4">
      {equipmentFeasibility ? (
        <div className="space-y-6 text-sm text-gray-300">
          {equipmentFeasibility.feasibilitySnapshot && (
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <h4 className="text-sm font-semibold text-gray-200 mb-3">
                Real-World Constraint Snapshot
              </h4>

              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="border-l border-gray-700 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Financial Feasibility</p>
                  <p className="text-gray-200">
                    {mapFinancial(equipmentFeasibility.feasibilitySnapshot.financialFeasibility)}
                  </p>
                </div>

                <div className="border-l border-gray-700 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Environmental Feasibility</p>
                  <p className="text-gray-200">
                    {mapEnvironment(equipmentFeasibility.feasibilitySnapshot.environmentalFeasibility)}
                  </p>
                </div>

                <div className="border-l border-gray-700 pl-3">
                  <p className="text-xs text-gray-500 mb-1">Caregiver Flexibility</p>
                  <p className="text-gray-200">
                    {mapCaregiver(equipmentFeasibility.feasibilitySnapshot.caregiverFlexibility)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 border-t border-gray-800 pt-3">
                <strong>Main Constraint:</strong>{" "}
                {equipmentFeasibility.feasibilitySnapshot.mainConstraint || "—"}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {equipmentFeasibility.equipmentPlan?.map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-700 bg-gray-950 p-5">
                <div className="mb-4 border-b border-gray-800 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                        Recommendation {i + 1}
                      </p>
                      <h4 className="text-lg font-semibold text-white">
                        {item.item || "Recommendation"}
                      </h4>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Urgency</p>
                      <p className="text-sm font-medium text-gray-200 capitalize">
                        {String(item.urgency || "—").replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 mt-3">
                    {item.reason || "—"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Ideal Setup
                    </p>
                    <p className="text-sm text-gray-200">{item.idealSetup || "—"}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {item.idealEstimatedCost || "Cost unknown"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      Feasible Plan
                    </p>
                    <p className="text-sm text-gray-200">{item.item || "—"}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {item.feasibleEstimatedCost || item.costRange || "Cost unknown"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                      What Can Be Done Today
                    </p>
                    <p className="text-sm text-gray-200">
                      {item.immediateWorkaround || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-orange-700 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-orange-300 mb-2">
                    Clinical Decision
                  </p>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    {item.clinicalDecision || item.costComparisonNote || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-400">
            Generate a realistic environmental plan that compares the ideal setup against what is feasible for this case.
          </p>

          <p className="text-xs text-gray-500 mt-1">
            This will show the ideal solution, realistic recommendation, immediate workaround, and clinical tradeoff.
          </p>
        </div>
      )}
    </div>
  )}
</div>
  </div>
</details>

<details className="rounded-xl border border-blue-800 bg-gray-900 p-6">
  <summary className="flex cursor-pointer items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold text-white">Decision Transparency</h2>
      <p className="mt-1 text-sm text-gray-400">Detailed continuity and progression diagnostics for review.</p>
    </div>
    <span className="text-xs tracking-wide text-blue-300">Show</span>
  </summary>

  <div className="mt-6 space-y-6">
    <ProgressionContinuityRow
          currentContinuityCondition={currentContinuityCondition}
      reassessmentPressureLabel={reassessmentPressureLabel}
      operationalChangeClassification={operationalChangeClassification}
      dominantInstabilityDrivers={dominantInstabilityDrivers}
      operationalDriftSignals={operationalDriftSignals}
      continuityAlerts={continuityAlerts}
    />

{progressionState && (
  <section className="mt-6 rounded-lg border border-dashed border-purple-300 bg-purple-50 p-4">
    <div className="mb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
        Dev Only — Progression State
      </p>
      <p className="mt-1 text-sm text-gray-700">
        Temporary validation display for Phase 3 progression testing.
      </p>
    </div>

    <div className="grid gap-3 text-sm md:grid-cols-2">
      <div>
        <p className="font-semibold text-gray-800">Current Phase</p>
        <p className="text-gray-700">{progressionState.currentPhase || "—"}</p>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Advancement Readiness</p>
        <p className="text-gray-700">
          {progressionState.advancementReadiness || "—"}
        </p>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Caregiver State</p>
        <p className="text-gray-700">
          {progressionState.caregiverDependencyState || "—"}
        </p>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Environment State</p>
        <p className="text-gray-700">
          {progressionState.environmentalLimitationState || "—"}
        </p>
      </div>
    </div>

    <div className="mt-4">
      <p className="font-semibold text-gray-800">Continuity Summary</p>
      <p className="mt-1 text-sm text-gray-700">
        {progressionState.continuitySummary || "—"}
      </p>
    </div>

    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
      <div>
        <p className="font-semibold text-gray-800">Active Barriers</p>
        <ul className="mt-1 list-disc pl-5 text-gray-700">
          {(progressionState.activeBarriers || []).length ? (
            progressionState.activeBarriers.map((item: string, index: number) => (
              <li key={`progression-barrier-${index}`}>{item}</li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Active Milestones</p>
        <ul className="mt-1 list-disc pl-5 text-gray-700">
          {(progressionState.activeMilestones || []).length ? (
            progressionState.activeMilestones.map((item: string, index: number) => (
              <li key={`progression-milestone-${index}`}>{item}</li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Regression Risks</p>
        <ul className="mt-1 list-disc pl-5 text-gray-700">
          {(progressionState.regressionRisks || []).length ? (
            progressionState.regressionRisks.map((item: string, index: number) => (
              <li key={`progression-risk-${index}`}>{item}</li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-gray-800">Reassessment Triggers</p>
        <ul className="mt-1 list-disc pl-5 text-gray-700">
          {(progressionState.reassessmentTriggers || []).length ? (
            progressionState.reassessmentTriggers.map((item: string, index: number) => (
              <li key={`progression-trigger-${index}`}>{item}</li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </div>
    </div>
  </section>
)}
  </div>
</details>

{/* ==============================
    RENDER: VERSION HISTORY
============================== */}

        {/* VERSION HISTORY */}

<HistoricalSnapshotsSection
  generations={generations}
  currentGenerationId={currentGenerationId}
  selectedGeneration={selectedGeneration}
  showAllVersions={showAllVersions}
  isRestoringVersion={isRestoringVersion}
  onToggleShowAllVersions={() => setShowAllVersions((prev) => !prev)}
  onSelectGeneration={(generation) => setSelectedGeneration(generation as GenerationRow)}
  onDeleteGeneration={handleDeleteGeneration}
  onRestoreSelectedVersion={handleRestoreSelectedVersion}
  onClosePreview={() => setSelectedGeneration(null)}
/>
</section>
</div>
{/* CASE ACTION BUTTONS */}
<div className="fixed bottom-4 left-4 right-4 z-40 grid grid-cols-2 gap-2 rounded-xl border border-gray-800 bg-gray-950/95 p-2 shadow-lg backdrop-blur sm:left-1/2 sm:right-auto sm:flex sm:-translate-x-1/2 sm:flex-nowrap">

  {!isEditing ? (
    <button
      type="button"
      disabled={isViewingHistoricalVersion}
      onClick={() => setIsEditing(true)}
      className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
    >
      {isViewingHistoricalVersion ? "Historical Snapshot" : "Edit Case"}
    </button>
  ) : (
    <>
      <button
        type="button"
        onClick={handleSaveCaseEdits}
        disabled={isViewingHistoricalVersion}
        className="rounded-lg bg-green-700 px-3 py-2 text-xs font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 sm:text-sm"
      >
        Cancel
      </button>
    </>
  )}

  <button
    type="button"
    onClick={handleRegenerateCurrentPlan}
    disabled={isRegeneratingPlan || isViewingHistoricalVersion}
    className="min-w-[96px] rounded-lg bg-purple-700 px-3 py-2 text-xs font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
  >
    {isRegeneratingPlan ? "Generating..." : "Regenerate"}
  </button>
<button
  type="button"
  onClick={handleSaveCurrentVersion}
  disabled={
    isSavingCurrentVersion ||
    isViewingHistoricalVersion ||
    !caseData?.generated_output
  }
  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
>
  {isSavingCurrentVersion ? "Saving..." : "Save Snapshot"}
</button>
  <button
    type="button"
    onClick={handleCopySummary}
    className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 sm:text-sm"
  >
    Copy
  </button>

  <button
    type="button"
    onClick={handleDownloadSummary}
    className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 sm:text-sm"
  >
    Download
  </button>
</div>


{showClinicalSummary && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="w-full max-w-3xl rounded-xl border border-gray-700 bg-gray-950 p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Clinical Summary
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Recommended approach summary for quick review or sharing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClinicalSummary(false)}
          className="rounded-lg border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
        >
          Close
        </button>
      </div>

      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-gray-800 bg-black/30 p-4 text-sm leading-relaxed text-gray-200">
        {buildRecommendedApproachSummary()}
      </pre>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCopyRecommendedSummary}
          className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-800/40 transition"
        >
          Copy Summary
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
