"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { buildClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import {
  buildClinicalDecisionInputFromCase,
  buildClinicalNormalizationInsight,
} from "@/lib/buildClinicalDecisionInput";

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
  pathways?: Pathway[];
  clinicalConsiderations?: string[];
  firstSessionPriorities?: string[];
  caregiverGuidance?: string[];
  equipmentPlan?: EquipmentPlanItem[];
selectedPathwaySummary?: string;
selectedPathwayIndex?: number;

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
  output_payload: GeneratedOutput | null;
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

clinical_decision_model?: any;

environment: {
    bathroom_type?: string;
    stairs_present?: string;
    space_constraints?: string;
    safety_hazards?: string[];
    equipment_present?: string[];
  } | null;
  generated_output: GeneratedOutput | null;
};

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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


// ==============================
// STATE: FEASIBILITY (EDIT MODE)
// ==============================

const [editableFeasibility, setEditableFeasibility] = useState({
  financial_constraint: "unknown",
  environmental_constraint: "unknown",
  equipment_access: "unknown",
});

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
const [caregiverScript, setCaregiverScript] = useState<CaregiverScript | null>(null);
const [isGeneratingCaregiverScript, setIsGeneratingCaregiverScript] = useState(false);
const [caregiverScriptError, setCaregiverScriptError] = useState("");
const [transferDetails, setTransferDetails] = useState<TransferMobilityDetails | null>(null);
const [isGeneratingTransferDetails, setIsGeneratingTransferDetails] = useState(false);

const [adlPrivacy, setAdlPrivacy] = useState<AdlPrivacySupport | null>(null);
const [isGeneratingAdlPrivacy, setIsGeneratingAdlPrivacy] = useState(false);
const [equipmentFeasibility, setEquipmentFeasibility] = useState<EquipmentFeasibilityPlan | null>(null);
const [isGeneratingEquipmentFeasibility, setIsGeneratingEquipmentFeasibility] = useState(false);

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
  typedCase.generated_output?.clinicalDetailModules?.caregiverScript;

if (savedScript) {
  setCaregiverScript(savedScript);
} else {
  setCaregiverScript(null);
}

  const savedTransferDetails =
    typedCase.generated_output?.clinicalDetailModules?.transferDetails;

  if (savedTransferDetails) {
    setTransferDetails(savedTransferDetails);
  } else {
    setTransferDetails(null);
  }

const savedAdlPrivacy =
  typedCase.generated_output?.clinicalDetailModules?.adlPrivacy;

if (savedAdlPrivacy) {
  setAdlPrivacy(savedAdlPrivacy);
} else {
  setAdlPrivacy(null);
}

const savedEquipmentFeasibility =
  typedCase.generated_output?.clinicalDetailModules?.equipmentFeasibility;

if (savedEquipmentFeasibility) {
  setEquipmentFeasibility(savedEquipmentFeasibility);
} else {
  setEquipmentFeasibility(null);
}

  setCurrentGenerationId(typedCase.current_generation_id);
  console.log("Loaded current_generation_id:", typedCase.current_generation_id);
}

      const { data: generationData, error: generationError } = await supabase
  .from("generations")
.select("id, created_at, prompt_version, output_payload")
  .eq("case_id", resolvedParams.id)
  .order("created_at", { ascending: true })

if (!generationError) {
const gens = (generationData as GenerationRow[]) || [];
setGenerations(gens);

if (gens.length > 0) {
  setLatestGeneratedPlan(gens[0].output_payload as GeneratedPlan);
}
}

      setLoading(false);
    }

    loadCase();
  }, [params]);
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
      .select("id, created_at, prompt_version, output_payload");

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
  if (!caseData?.id) return;

  const updatedCaseData = {
  ...caseData,
  title: editableTitle,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
};

const clinicalDecisionInput =
  buildClinicalDecisionInputFromCase(updatedCaseData);

  const clinicalDecisionModel = buildClinicalDecisionModel({
    goalCategory: clinicalDecisionInput.goalCategory as any,
    dominantBarrier: clinicalDecisionInput.dominantBarrier as any,
    dominantBarrierSeverity:
      clinicalDecisionInput.dominantBarrierSeverity as 1 | 2 | 3,
    secondaryBarrier: clinicalDecisionInput.secondaryBarrier as any,
    secondaryBarrierSeverity:
      clinicalDecisionInput.secondaryBarrierSeverity
        ? undefined
        : clinicalDecisionInput.secondaryBarrierSeverity,
    safetyRiskLevel: clinicalDecisionInput.safetyRiskLevel as any,
    supportLevel: clinicalDecisionInput.supportLevel as any,
    clinicalLens: clinicalDecisionInput.clinicalLens as any,
    environmentContext: clinicalDecisionInput.environmentContext as any,
  });

  try {
    const { error } = await supabase
      .from("cases")
      .update({
        title: editableTitle,
        client_info: editableClientInfo,
        caregiver_info: editableCaregiverInfo,
        feasibility_context: editableFeasibility,
        clinical_decision_input: clinicalDecisionInput,
      })
      .eq("id", caseData.id);

    if (error) throw error;

    setCaseData({
      ...caseData,
      title: editableTitle,
      client_info: editableClientInfo,
      caregiver_info: editableCaregiverInfo,
      feasibility_context: editableFeasibility,
      clinical_decision_input: clinicalDecisionInput,
    });

    setIsEditing(false);
  } catch (error: any) {
    console.error("Failed to save case edits:", error);
    alert(`Failed to save changes: ${error?.message || JSON.stringify(error)}`);
  }
}

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
  executiveBriefing.priorities.length
    ? executiveBriefing.priorities.map((i) => `• ${i}`).join("\n")
    : "—"
}

Dominant Risks:
${
  executiveBriefing.risks.length
    ? executiveBriefing.risks.map((i) => `• ${i}`).join("\n")
    : "—"
}

Caregiver / Environment Considerations:
${
  executiveBriefing.considerations.length
    ? executiveBriefing.considerations.map((i) => `• ${i}`).join("\n")
    : "—"
}

CURRENT TREATMENT APPROACH
--------------------------
${selectedPathway?.title || "—"}

Type:
${selectedPathway?.type || "—"}

Operational Priorities:
${
  selectedPathway?.interventions?.length
    ? selectedPathway.interventions.map((i) => `• ${i}`).join("\n")
    : "—"
}

Expected Advantage:
${selectedPathway?.upside || "—"}

Operational Tradeoff:
${selectedPathway?.tradeoff || "—"}

STRUCTURED PLAN DETAILS
-----------------------
Patient Snapshot:
${generated?.patientSnapshot || "—"}

Plan Overview:
${generated?.summary?.planSummary || generated?.selectedPathwaySummary || "—"}

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

async function handleCopySummary() {
  const summary = buildCaseSummaryText();

  if (!summary) return;

  await navigator.clipboard.writeText(summary);
  setCopyMessage("Summary copied to clipboard.");

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
      const updatedOutput = {
        ...(caseData.generated_output || {}),
        clinicalDetailModules: {
          ...(caseData.generated_output?.clinicalDetailModules || {}),
          caregiverScript: result.data,
        },
      };

      const { error } = await supabase
        .from("cases")
        .update({
          generated_output: updatedOutput,
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
      });

    } catch (e) {
      console.error("Failed to persist caregiver script", e);
    }
  } catch (err: any) {
    setCaregiverScriptError(err.message || "Something went wrong.");
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
      const updatedOutput = {
        ...(caseData.generated_output || {}),
        clinicalDetailModules: {
          ...(caseData.generated_output?.clinicalDetailModules || {}),
          transferDetails: result.data,
        },
      };

      const { error } = await supabase
        .from("cases")
        .update({
          generated_output: updatedOutput,
        })
        .eq("id", caseData.id);

      if (error) {
        throw error;
      }

      setCaseData({
        ...caseData,
        generated_output: updatedOutput,
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
  const updatedOutput = {
    ...(caseData.generated_output || {}),
    clinicalDetailModules: {
      ...(caseData.generated_output?.clinicalDetailModules || {}),
      adlPrivacy: result.data,
    },
  };

  const { error } = await supabase
    .from("cases")
    .update({
      generated_output: updatedOutput,
    })
    .eq("id", caseData.id);

  if (error) {
    throw error;
  }

  setCaseData({
    ...caseData,
    generated_output: updatedOutput,
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

   const updatedGeneratedOutput = {
  ...(caseData.generated_output || {}),
  clinicalDetailModules: {
    ...((caseData.generated_output as any)?.clinicalDetailModules || {}),
    equipmentFeasibility: result.data,
  },
};

const { error: updateError } = await supabase
  .from("cases")
  .update({
    generated_output: updatedGeneratedOutput,
  })
  .eq("id", caseData.id);

if (updateError) {
  throw updateError;
}

setEquipmentFeasibility(result.data);

setCaseData({
  ...caseData,
  generated_output: updatedGeneratedOutput,
});

  } catch (err) {
    console.error("Equipment feasibility generation failed:", err);
  } finally {
    setIsGeneratingEquipmentFeasibility(false);
  }
}

const orderedGenerations = [...generations].sort(
  (a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
);

const visibleGenerations = showAllVersions
  ? orderedGenerations
  : orderedGenerations.slice(0, 5);

const getVersionNumber = (generationId: string) =>
  orderedGenerations.findIndex((g) => g.id === generationId) + 1;

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

 const generated = caseData.generated_output as GeneratedOutput | null;

const liveClinicalDecisionInput = buildClinicalDecisionInputFromCase(caseData);

const liveClinicalDecisionModel =
  buildClinicalDecisionModel(liveClinicalDecisionInput);

const normalizationInsight =
  buildClinicalNormalizationInsight(caseData);

const levels = caseData.functional_status?.adl_assist_levels;

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

const selectedPathwayIndex =
  typeof generated?.selectedPathwayIndex === "number"
    ? generated.selectedPathwayIndex
    : 0;

const selectedPathway =
  generated?.pathways?.[selectedPathwayIndex] ??
  generated?.pathways?.[0] ??
  null;

const caregiverGuidance: string[] =
  generated?.caregiverGuidance?.length
    ? generated.caregiverGuidance
    : selectedPathway?.interventions ?? [];

const clinicalFocusLabel =
  caseData.case_classification?.clinical_focus === "transfers_mobility"
    ? "Transfers & Mobility"
    : caseData.case_classification?.clinical_focus === "caregiver_training"
    ? "Caregiver Training"
    : "ADL / Home Safety";

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
  title: caseData.title || "Untitled Case",
  patientSnapshot: generated?.patientSnapshot || "",
  selectedPathwayTitle: selectedPathway?.title || "",
  selectedPathwayType: selectedPathway?.type || "",
  interventions: selectedPathway?.interventions || [],
  summary: generated?.summary || null,
  caregiverGuidance: caregiverGuidance || [],
};
const executiveBriefing = (() => {
  const risks: string[] = generated?.summary?.topRisks || [];
  const pathwayInterventions: string[] = selectedPathway?.interventions || [];
  const caregiverItems: string[] =
    generated?.summary?.caregiverExpectations || [];

  const selectedDrivers: string[] = selectedPathway?.selectionDrivers || [];
  const pathwayPriorities: string[] = selectedPathway?.prioritizes || [];
  const pathwayTradeoffs: string[] = selectedPathway?.tradeoff
    ? [selectedPathway.tradeoff]
    : [];
  const pathwayRisks: string[] = selectedPathway?.operationalRisk
    ? [selectedPathway.operationalRisk]
    : [];

  const matches = (item: string, terms: string[]) =>
    terms.some((term) => item.toLowerCase().includes(term));

  const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

  if (briefingLens === "transfers_mobility") {
    return {
      title: "Transfers & Mobility Briefing",
      priorities: unique([
        ...pathwayInterventions.filter((item) =>
          matches(item, ["transfer", "mobility", "balance", "position", "stair", "step", "shower"])
        ),
        ...pathwayPriorities.filter((item) =>
          matches(item, ["transfer", "mobility", "balance", "position", "stair", "step", "shower"])
        ),
      ]),
      risks: unique(
        risks.filter((item) =>
          matches(item, ["fall", "transfer", "mobility", "stair", "step", "night", "bathroom"])
        )
      ),
      considerations: unique([...pathwayTradeoffs, ...pathwayRisks]),
    };
  }

  if (briefingLens === "caregiver_training") {
    return {
      title: "Caregiver Training Briefing",
      priorities: unique([...caregiverGuidance, ...caregiverItems]),
      risks: unique([
        ...pathwayRisks,
        ...risks.filter((item) =>
          matches(item, ["cognitive", "cue", "supervision", "caregiver", "unsafe", "anxiety", "freezing"])
        ),
      ]),
      considerations: unique([
        ...pathwayTradeoffs,
        ...selectedDrivers.filter((item) =>
          matches(item, ["caregiver", "cognitive", "supervision", "unsafe"])
        ),
      ]),
    };
  }

  return {
    title: "ADL / Home Safety Briefing",
    priorities: unique([...selectedDrivers, ...pathwayInterventions]),
    risks: unique(risks),
    considerations: unique([...pathwayTradeoffs, ...caregiverItems]),
  };
})();

  const handleRestoreSelectedVersion = async () => {
  if (!selectedGeneration || !caseData?.id) return;

  try {
    setIsRestoringVersion(true);

    const { error } = await supabase
      .from("cases")
      .update({
        generated_output: selectedGeneration.output_payload,
        current_generation_id: selectedGeneration.id,
      })
      .eq("id", caseData.id);

    if (error) {
      throw error;
    }

    setCaseData({
      ...caseData,
      generated_output: selectedGeneration.output_payload,
      current_generation_id: selectedGeneration.id,
    });

    const savedModules =
  selectedGeneration.output_payload?.clinicalDetailModules;

setCaregiverScript(savedModules?.caregiverScript || null);
setTransferDetails(savedModules?.transferDetails || null);
setAdlPrivacy(savedModules?.adlPrivacy || null);

    setCurrentGenerationId(selectedGeneration.id);
    setSelectedGeneration(null);
  } catch (error) {
    console.error("Failed to restore selected version:", error);
    alert("Failed to restore this version as current.");
  } finally {
    setIsRestoringVersion(false);
  }
};

const handleSaveSelectedPathway = async (index: number) => {
  if (!caseData?.id) return;

  try {
    const updatedGeneratedOutput = {
      ...(caseData.generated_output || {}),
      selectedPathwayIndex: index,
    };

    const { error } = await supabase
      .from("cases")
      .update({
        generated_output: updatedGeneratedOutput,
      })
      .eq("id", caseData.id);

    if (error) {
      console.error("Failed to save selected pathway:", error.message);
      return;
    }

    setCaseData((prev: any) => ({
      ...prev,
      generated_output: updatedGeneratedOutput,
    }));

    console.log("Selected pathway saved:", index);
  } catch (err) {
    console.error("Unexpected save error:", err);
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

    const clinicalDecisionInput =
      buildClinicalDecisionInputFromCase(updatedCasePayload);

    const clinicalDecisionModel =
      buildClinicalDecisionModel(clinicalDecisionInput);

    const focusRegenerationPayload = {
      ...updatedCasePayload,
      clinical_decision_input: clinicalDecisionInput,
      clinicalDecisionModel,
    };

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(focusRegenerationPayload),
    });

    const aiData = await aiResponse.json();

    console.log("Clinical focus AI response:", aiData);

    if (!aiData.success || !aiData.plan) {
      alert(`AI generation failed: ${aiData.error || "Unknown error"}`);
      return;
    }

    const plan = aiData.plan;

    const { data: insertedGenerations, error: generationError } = await supabase
      .from("generations")
      .insert([
        {
          case_id: caseData.id,
          prompt_version: `v1-ai-${focus}`,
          input_payload: focusRegenerationPayload,
          output_payload: plan,
        },
      ])
      .select("id, created_at, prompt_version, output_payload");

    if (generationError) throw generationError;

    const newGeneration = insertedGenerations?.[0];

    console.log("New focus generation:", newGeneration);

    const { error: caseUpdateError } = await supabase
      .from("cases")
      .update({
        case_classification: updatedCasePayload.case_classification,
        clinical_decision_input: clinicalDecisionInput,
        generated_output: plan,
        current_generation_id:
          newGeneration?.id || caseData.current_generation_id,
      })
      .eq("id", caseData.id);

    if (caseUpdateError) throw caseUpdateError;

    setCaseData((prev: any) => ({
      ...prev,
      case_classification: updatedCasePayload.case_classification,
      clinical_decision_input: clinicalDecisionInput,
      generated_output: plan,
      current_generation_id: newGeneration?.id || prev.current_generation_id,
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
};

const clinicalDecisionInput =
  buildClinicalDecisionInputFromCase(updatedCasePayload);

const clinicalDecisionModel = buildClinicalDecisionModel(clinicalDecisionInput);

const regenerationPayload = {
  ...updatedCasePayload,
  clinical_decision_input: clinicalDecisionInput,
  clinicalDecisionModel,
};

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(regenerationPayload),
    });

    const aiData = await aiResponse.json();

    if (!aiData.success || !aiData.plan) {
      alert(`AI generation failed: ${aiData.error || "Unknown error"}`);
      return;
    }

    const plan = aiData.plan;

    const { data: insertedGenerations, error: generationError } = await supabase
      .from("generations")
      .insert([
        {
          case_id: caseData.id,
          prompt_version: `v1-ai-${caseData.case_classification?.clinical_focus || "adl_home_safety"}-regenerated`,
          input_payload: regenerationPayload,
          output_payload: plan,
        },
      ])
      .select("id, created_at, prompt_version, output_payload");

    if (generationError) throw generationError;

    const newGeneration = insertedGenerations?.[0];

const { error: caseUpdateError } = await supabase
  .from("cases")
  .update({
    title: updatedCasePayload.title,
    client_info: updatedCasePayload.client_info,
    caregiver_info: updatedCasePayload.caregiver_info,
    feasibility_context: updatedCasePayload.feasibility_context,

    clinical_decision_input: clinicalDecisionInput,
    

    generated_output: plan,
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

  clinical_decision_input: clinicalDecisionInput,
  

  generated_output: plan,
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

return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CASE HEADER + BASIC DETAILS */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
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
      {caseData.title || "Untitled Case"}
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
    Created: {new Date(caseData.created_at).toLocaleString()}
  </p>

  <p className="text-sm text-gray-400 mt-1">
    Clinical Focus:{" "}
    <span className="text-white font-medium">
      {caseData.case_classification?.clinical_focus === "transfers_mobility"
        ? "Transfers & Mobility"
        : caseData.case_classification?.clinical_focus === "caregiver_training"
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
            <p>
              <strong>Age Range:</strong>{" "}
              {caseData.patient_profile?.age_range || "—"}
            </p>
            <p>
              <strong>Primary Diagnosis:</strong>{" "}
              {caseData.patient_profile?.primary_diagnosis || "—"}
            </p>
            <p>
              <strong>Current Assistance Level:</strong>{" "}
              {caseData.functional_status?.current_assistance_level || "—"}
            </p>
            <p>
              <strong>Key Barriers:</strong>{" "}
              {caseData.functional_status?.key_barriers?.length
                ? caseData.functional_status.key_barriers.join(", ")
                : "—"}
            </p>
            <p>
              <strong>Primary Goal:</strong>{" "}
              {caseData.goals_preferences?.primary_goal || "—"}
            </p>
{/* EDIT MODE: CLIENT / CAREGIVER / FEASIBILITY */}
{isEditing ? (
  <div className="grid gap-3 md:grid-cols-2">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Client Name</label>
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
      <label className="block text-xs text-gray-400 mb-1">Client Phone</label>
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
      <label className="block text-xs text-gray-400 mb-1">Client Email</label>
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
      <label className="block text-xs text-gray-400 mb-1">Client Address</label>
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
      <label className="block text-xs text-gray-400 mb-1">Caregiver Name</label>
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
      <label className="block text-xs text-gray-400 mb-1">Caregiver Relationship</label>
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
      <label className="block text-xs text-gray-400 mb-1">Caregiver Phone</label>
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

{/* DECISION ENGINE SUMMARY */}
<div className="md:col-span-2 mt-4 border-t border-gray-800 pt-4">
  <h3 className="text-sm font-semibold text-gray-300 mb-3">
    Decision Engine Summary
  </h3>

  <div className="grid gap-3 md:grid-cols-2 text-sm">

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Goal Category</div>
      <div className="text-white">
        {liveClinicalDecisionModel.goalCategory || "—"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Dominant Barrier</div>
      <div className="text-white">
        {liveClinicalDecisionModel.dominantBarrier || "—"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Barrier Severity</div>
      <div className="text-white">
        {liveClinicalDecisionModel.dominantBarrierSeverity || "—"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Safety Risk</div>
      <div className="text-white">
        {liveClinicalDecisionModel.safetyRiskLevel || "—"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Support Level</div>
      <div className="text-white">
        {liveClinicalDecisionModel.supportLevel || "—"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
      <div className="text-gray-500 text-xs mb-1">Secondary Barrier</div>
      <div className="text-white">
        {liveClinicalDecisionModel.secondaryBarrier || "None"}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 md:col-span-2">
      <div className="text-gray-500 text-xs mb-1">Selected Strategies</div>
      <div className="text-white">
        {liveClinicalDecisionModel.selectedStrategies?.length
          ? liveClinicalDecisionModel.selectedStrategies.join(", ")
          : "—"}
      </div>
    </div>
    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 md:col-span-2">
      <div className="text-gray-500 text-xs mb-2">Normalization Notes</div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 md:col-span-2">
      <div className="text-gray-500 text-xs mb-2">Barrier Scores</div>

      <div className="grid gap-2 md:grid-cols-4">
        {normalizationInsight.sortedScores.map(([barrier, score]) => (
          <div
            key={barrier}
            className="rounded border border-gray-800 bg-gray-950 px-2 py-2"
          >
            <div className="text-xs text-gray-500">{barrier}</div>
            <div className="text-sm font-semibold text-white">{score}</div>
          </div>
        ))}
      </div>
    </div>

      {normalizationInsight.notes.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
          {normalizationInsight.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400">—</div>
      )}
    </div>
  </div>
</div>

{/* FEASIBILITY CONTEXT */}
<div className="md:col-span-2 mt-4 border-t border-gray-800 pt-4">
  <h3 className="text-sm font-semibold text-gray-300 mb-3">
    Real-World Constraints
  </h3>

  <div className="grid gap-3 md:grid-cols-3">
    <div>
      <label className="block text-xs text-gray-400 mb-1">
        Financial Constraint
      </label>
      <select
        value={editableFeasibility.financial_constraint}
        onChange={(e) =>
          setEditableFeasibility((prev) => ({
            ...prev,
            financial_constraint: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      >
        <option value="unknown">Unknown</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">
        Environmental Constraint
      </label>
      <select
        value={editableFeasibility.environmental_constraint}
        onChange={(e) =>
          setEditableFeasibility((prev) => ({
            ...prev,
            environmental_constraint: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      >
        <option value="unknown">Unknown</option>
        <option value="flexible">Flexible</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-1">
        Equipment Access
      </label>
      <select
        value={editableFeasibility.equipment_access}
        onChange={(e) =>
          setEditableFeasibility((prev) => ({
            ...prev,
            equipment_access: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
      >
        <option value="unknown">Unknown</option>
        <option value="out_of_pocket">Out of pocket</option>
        <option value="insurance_dme">Insurance / DME</option>
        <option value="borrowed">Borrowed</option>
        <option value="mixed">Mixed</option>
      </select>
    </div>
  </div>
</div>

  </div>

) : (
  <>
  {/* DISPLAY MODE: CLIENT / CAREGIVER / FEASIBILITY */}
    <p>
      <strong>Client Name:</strong>{" "}
      {caseData.client_info?.client_name || "—"}
    </p>
    <p>
      <strong>Client Phone:</strong>{" "}
      {caseData.client_info?.phone || "—"}
    </p>
    <p>
      <strong>Client Email:</strong>{" "}
      {caseData.client_info?.email || "—"}
    </p>
    <p>
      <strong>Client Address:</strong>{" "}
      {caseData.client_info?.address || "—"}
    </p>
    <p>
      <strong>Caregiver Name:</strong>{" "}
      {caseData.caregiver_info?.caregiver_name || "—"}
    </p>
    <p>
      <strong>Caregiver Relationship:</strong>{" "}
      {caseData.caregiver_info?.relationship || "—"}
    </p>
    <p>
      <strong>Caregiver Phone:</strong>{" "}
      {caseData.caregiver_info?.phone || "—"}
    </p>
{/* FEASIBILITY CONTEXT DISPLAY */}
<div className="mt-4 border-t border-gray-800 pt-4">
  <h3 className="text-sm font-semibold text-gray-300 mb-2">
    Real-World Constraints
  </h3>

  <p>
    <strong>Financial:</strong>{" "}
    {caseData.feasibility_context?.financial_constraint || "—"}
  </p>
  <p>
    <strong>Environment:</strong>{" "}
    {caseData.feasibility_context?.environmental_constraint || "—"}
  </p>
  <p>
    <strong>Equipment Access:</strong>{" "}
    {caseData.feasibility_context?.equipment_access || "—"}
  </p>
</div>

  </>
)}
<p>
  <strong>Case Type:</strong>{" "}
  {caseData.case_classification?.case_type || "—"}
</p>

<p>
  <strong>Primary Goal:</strong>{" "}
  {caseData.goals_preferences?.primary_goal || "—"}
</p>

<p>
  <strong>Bathroom Type:</strong>{" "}
  {caseData.environment?.bathroom_type || "—"}
</p>
<p>
  <strong>Stairs Present:</strong>{" "}
  {caseData.environment?.stairs_present || "—"}
</p>
          </div>
        </div>

{/* CLINICAL FOCUS CONTROLS */}

<div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
  <div className="mb-4">
    <h2 className="text-2xl font-semibold">
      Clinical Focus
    </h2>

    <p className="text-sm text-gray-400 mt-1">
      Choose how the current plan is emphasized for review. This does not regenerate or change the treatment plan.
    </p>
  </div>

  <div className="grid grid-cols-3 gap-2">
    {["adl_home_safety", "transfers_mobility", "caregiver_training"].map((focus) => (
      <button
        key={focus}
        type="button"
        disabled={briefingLens === focus}
        onClick={() => {
          console.log("Selected clinical focus:", focus);
          setBriefingLens(
            focus as "adl_home_safety" | "transfers_mobility" | "caregiver_training"
          );
        }}
        className={`w-full py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
          briefingLens === focus
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        {focus === "adl_home_safety"
          ? "ADL / Home Safety"
          : focus === "transfers_mobility"
          ? "Transfers & Mobility"
          : "Caregiver Training"}
      </button>
    ))}
  </div>
</div>      
{/* EXECUTIVE BRIEFING */}

<div className="rounded-xl border border-cyan-800 bg-gray-900 p-6">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-2xl font-semibold">
        {executiveBriefing.title}
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        Focused briefing based on the selected clinical lens.
      </p>
    </div>

    <span className="text-xs tracking-wide text-cyan-400">
      Briefing Lens
    </span>
  </div>

  <div className="mt-4 grid gap-3 md:grid-cols-3">
    <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cyan-400 mb-2">
        Priority Focus
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.priorities.length > 0 ? (
          executiveBriefing.priorities.slice(0, 4).map((item: string, index: number) => (
            <div
              key={index}
              className="rounded-md bg-cyan-950/40 border border-cyan-900/60 px-2 py-1 text-xs text-cyan-100"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">No priorities identified.</div>
        )}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-red-400 mb-2">
        Dominant Risks
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.risks.length > 0 ? (
          executiveBriefing.risks.slice(0, 4).map((item: string, index: number) => (
            <div
              key={index}
              className="rounded-md bg-red-950/30 border border-red-900/50 px-2 py-1 text-xs text-red-100"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">No major risks identified.</div>
        )}
      </div>
    </div>

    <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400 mb-2">
        Caregiver / Environment
      </div>

      <div className="flex flex-wrap gap-2">
        {executiveBriefing.considerations.length > 0 ? (
          executiveBriefing.considerations.slice(0, 4).map((item: string, index: number) => (
            <div
              key={index}
              className="rounded-md bg-emerald-950/30 border border-emerald-900/50 px-2 py-1 text-xs text-emerald-100"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500">
            No additional considerations identified.
          </div>
        )}
      </div>
    </div>
  </div>
</div>

{/* ACTIVE OPERATIONAL PATHWAY */}

<div className="mt-6 rounded-xl border border-emerald-700 bg-emerald-950/20 p-6">
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <div className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
        Recommended Treatment Approach
      </div>

      <h2 className="text-2xl font-semibold text-white">
        {selectedPathway?.type || selectedPathway?.title || "No pathway selected"}
      </h2>

      <p className="mt-2 text-sm text-emerald-100/80 max-w-3xl">
        {generated?.selectedPathwaySummary ||
          "This approach represents the primary operational direction for treatment emphasis."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
  <button className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-800/40 transition">
    View Clinical Summary
  </button>

  <button className="rounded-lg border border-gray-700 bg-gray-900/40 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800/40 transition">
    Copy Summary
  </button>
</div>
    </div>

    <div className="rounded-lg bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200 border border-emerald-700">
      Recommended
    </div>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-3">
    <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
      <h3 className="text-sm font-semibold text-emerald-300 mb-3">
        Why This Was Selected
      </h3>

      <ul className="space-y-2 text-sm text-gray-200">
        {(selectedPathway?.selectionDrivers || []).slice(0, 3).map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
      <h3 className="text-sm font-semibold text-emerald-300 mb-3">
        Prioritizes
      </h3>

      <ul className="space-y-2 text-sm text-gray-200">
        {(selectedPathway?.prioritizes || []).slice(0, 3).map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
      <h3 className="text-sm font-semibold text-emerald-300 mb-3">
        Main Tradeoff
      </h3>

      <p className="text-sm text-gray-200">
        {selectedPathway?.tradeoff || "No tradeoff identified."}
      </p>
    </div>
  </div>

  <div className="mt-6">
    <h3 className="text-sm font-semibold text-emerald-300 mb-3">
      Operational Actions
    </h3>

    <ul className="grid gap-2 md:grid-cols-2 text-sm text-gray-200">
      {(selectedPathway?.interventions || []).map((item, index) => (
        <li
          key={index}
          className="rounded-lg border border-emerald-900/60 bg-black/20 px-3 py-2"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
</div>

{/* Alternative Treatment Approaches */}

{generated?.pathways && generated.pathways.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-300">
          Alternative Treatment Approaches
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Other viable treatment directions generated from the same authoritative plan.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowAlternativeApproaches((prev) => !prev)}
        className="text-sm text-blue-400 hover:text-blue-300 transition"
      >
        {showAlternativeApproaches ? "Hide" : "Show"}
      </button>
    </div>

    {showAlternativeApproaches && (
      <div className="space-y-4">
        {generated.pathways.map((pathway, index) => (
          <div
            key={`${pathway.type}-${index}`}
            className="rounded-lg border border-gray-800/60 p-4 bg-gray-950/60 opacity-80"
          >
            <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">
              {String(pathway.type).replaceAll("_", " ")}
            </p>

            <h4 className="text-sm font-semibold mb-2">
              {pathway.title}
            </h4>

            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 mb-3">
              {pathway.interventions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className="text-xs text-gray-400">
              <strong>Timeline:</strong> {pathway.timeline}
            </p>

            <p className="text-xs text-gray-400">
              <strong>Upside:</strong> {pathway.upside}
            </p>

            <p className="text-xs text-gray-500">
              <strong>Tradeoff:</strong> {pathway.tradeoff}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/* STRUCTURED PLAN DETAILS */}

{generated?.patientSnapshot && (
  <details className="rounded-xl border border-green-800 bg-gray-900 p-6">
    <summary className="flex cursor-pointer items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Structured Plan Details</h2>
        <p className="mt-1 text-sm text-gray-400">
          Reference detail for deeper review when needed.
        </p>
      </div>

      <span className="text-xs tracking-wide text-green-400">
        Show
      </span>
    </summary>

    <div className="mt-6 border-t border-gray-800 pt-4">
      <h3 className="text-lg font-semibold mb-2">Patient Snapshot</h3>
      <p className="text-gray-300">{generated.patientSnapshot}</p>
    </div>
  </details>
)}



     {/* DETAIL MODULE: FAMILY / CAREGIVER SCRIPT */}

<div className="mt-6 rounded-xl border border-purple-800 bg-gray-950 p-6">
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



        {/* VERSION HISTORY */}

       <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
  <h3 className="text-xl font-semibold mb-3">Version History</h3>
  <button
  type="button"
  onClick={() => setShowAllVersions(prev => !prev)}
  className="text-xs text-blue-400 hover:underline mb-3"
>
  {showAllVersions ? "Show fewer versions" : "Show all versions"}
</button>
  <p className="text-xs text-gray-500 mb-4">
  Showing the 5 most recent saved versions.
</p>

 {generations.length === 0 ? (
  <p className="text-sm text-gray-400">No prior generations found.</p>
) : (
  <ul className="space-y-3 text-sm text-gray-300">
  {visibleGenerations.map((generation) => (
      <li
        key={generation.id}
className={`rounded-lg px-4 py-3 transition ${
  currentGenerationId === generation.id
    ? "border border-green-600 bg-green-900/20"
    : selectedGeneration?.id === generation.id
    ? "border border-blue-500 bg-blue-950/30"
    : "border border-gray-800 hover:border-blue-500"
}`}
      >
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedGeneration(generation)}
            className="text-left flex-1"
          >
            <p className="flex items-center gap-2">
              <strong>Version {getVersionNumber(generation.id)}:</strong>

              {currentGenerationId === generation.id && (
                <span className="rounded-full border border-green-700 bg-green-900/30 px-2 py-0.5 text-xs text-green-300">
                  Current
                </span>
              )}

              {selectedGeneration?.id === generation.id && (
                <span className="rounded-full border border-blue-700 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">
                  Viewing
                </span>
              )}

              <span>
                {generation.prompt_version || "Unknown prompt version"}
              </span>

              <span className="text-xs text-gray-500">
                {generation.prompt_version?.includes("transfers_mobility")
                  ? "Transfers"
                  : generation.prompt_version?.includes("caregiver_training")
                  ? "Caregiver"
                  : generation.prompt_version?.includes("adl_home_safety")
                  ? "ADL"
                  : ""}
              </span>
            </p>

            <p className="text-gray-400">
              {new Date(generation.created_at).toLocaleString()}
            </p>
          </button>

<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteGeneration(generation.id);
  }}
  className="text-xs text-red-400 hover:text-red-300"
>
  Delete
</button>
          
        </div>
      </li>
    ))}
  </ul>
)}
</div> 

{selectedGeneration?.output_payload && (
  <div className="space-y-6">
    <div className="rounded-xl border border-blue-800 bg-gray-900 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            Viewing Version {getVersionNumber(selectedGeneration.id)}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Previewing the full saved plan for this version.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestoreSelectedVersion}
            disabled={isRestoringVersion}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {isRestoringVersion ? "Restoring..." : "Restore this version"}
          </button>

          <button
            type="button"
            onClick={() => setSelectedGeneration(null)}
            className="text-sm text-blue-400 underline"
          >
            Close preview
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Restoring this version will replace the current live plan with this saved version.
      </p>
    </div>

    {selectedGeneration.output_payload.patientSnapshot && (
      <div className="rounded-xl border border-green-800 bg-gray-900 p-6">
        <h3 className="text-lg font-semibold mb-2">Patient Snapshot</h3>
        <p className="text-gray-300">
          {selectedGeneration.output_payload.patientSnapshot}
        </p>
      </div>
    )}

    {selectedGeneration.output_payload.summary && (
      <div className="rounded-xl border border-yellow-700 bg-gray-900 p-6">
        <h3 className="text-xl font-semibold mb-4">Plan Overview</h3>

        <p className="text-xs text-gray-500 mb-2">
          Overview of selected plan. See pathway below for full details.
        </p>

        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-300">
          <div>
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <span className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs font-semibold uppercase text-white">
              {selectedGeneration.output_payload.summary.safetyLevel || "—"}
            </span>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs text-gray-400 mb-1">Plan</p>
            <p className="text-base text-white leading-relaxed">
              {selectedGeneration.output_payload.summary.planSummary || "—"}
            </p>
          </div>

          {(selectedGeneration.output_payload.summary.topRisks ?? []).length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Top Risks</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm leading-snug">
                {(selectedGeneration.output_payload.summary.topRisks ?? []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {(selectedGeneration.output_payload.summary.caregiverExpectations ?? []).length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Caregiver Expectations</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm leading-snug">
                {(selectedGeneration.output_payload.summary.caregiverExpectations ?? []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedGeneration.output_payload.pathways &&
          selectedGeneration.output_payload.pathways.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">Treatment Approaches</p>

              <div className="space-y-4">
                {selectedGeneration.output_payload.pathways.map((pathway, index) => (
                  <div
                    key={`${pathway.type}-${index}`}
                   className="rounded-lg border border-gray-800/60 p-4 bg-gray-950/60 opacity-80"
                  >
                    <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">
                      {String(pathway.type).replaceAll("_", " ")}
                    </p>

                    <h4 className="text-sm font-semibold mb-2">
                      {pathway.title}
                    </h4>

                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 mb-3">
                      {(pathway.interventions ?? []).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <p className="text-xs text-gray-400">
                      <strong>Timeline:</strong> {pathway.timeline}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong>Upside:</strong> {pathway.upside}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Tradeoff:</strong> {pathway.tradeoff}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    )}

    <div className="rounded-xl border border-purple-800 bg-gray-950 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Family / Caregiver Script
      </h3>

      {selectedGeneration.output_payload.clinicalDetailModules?.caregiverScript ? (
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Conversation Goal
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.conversationGoal || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Before Task Script
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.beforeTaskScript || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              During Task Script
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.duringTaskScript || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              If Patient Struggles
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.ifPatientStruggles || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              If Patient Resists
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.ifPatientResists || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              Reassurance Language
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.reassuranceLanguage || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-purple-400 mb-1">
              When to Be Firm
            </p>
            <p>{selectedGeneration.output_payload.clinicalDetailModules.caregiverScript.whenToBeFirm || "—"}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No script saved for this version.</p>
      )}
    </div>

    <div className="grid gap-6">
      <div className="rounded-xl border border-blue-800 bg-gray-950 p-6">
        <h3 className="text-lg font-semibold mb-4">Transfer & Mobility Details</h3>

        {selectedGeneration.output_payload.clinicalDetailModules?.transferDetails ? (
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Setup Adjustments</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.transferDetails.setupAdjustments ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Transfer Cues</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.transferDetails.transferCues ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Surface Variations</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.transferDetails.surfaceVariations ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">Stop Rules</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.transferDetails.stopRules ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No transfer details saved for this version.</p>
        )}
      </div>

      <div className="rounded-xl border border-emerald-800 bg-gray-950 p-6">
        <h3 className="text-lg font-semibold mb-4">ADL Privacy & Dignity Support</h3>

        {selectedGeneration.output_payload.clinicalDetailModules?.adlPrivacy ? (
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Privacy Setup</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.adlPrivacy.privacySetup ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Respectful Cueing</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.adlPrivacy.respectfulCueing ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">When to Step In</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.adlPrivacy.whenToStepIn ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">When to Step Back</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.adlPrivacy.whenToStepBack ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Dignity Warnings</p>
              <ul className="list-disc pl-5 space-y-1">
                {(selectedGeneration.output_payload.clinicalDetailModules.adlPrivacy.dignityWarnings ?? []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No ADL privacy support saved for this version.</p>
        )}
      </div>
    </div>

    {selectedGeneration.output_payload.functionalProblemAreas &&
      selectedGeneration.output_payload.functionalProblemAreas.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-xl font-semibold mb-3">Functional Problem Areas</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.functionalProblemAreas.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    {selectedGeneration.output_payload.taskBreakdown &&
      selectedGeneration.output_payload.taskBreakdown.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-xl font-semibold mb-3">Task Breakdown</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.taskBreakdown.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    {selectedGeneration.output_payload.clinicalConsiderations &&
      selectedGeneration.output_payload.clinicalConsiderations.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-xl font-semibold mb-3">Clinical Considerations</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.clinicalConsiderations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

    {selectedGeneration.output_payload.firstSessionPriorities &&
      selectedGeneration.output_payload.firstSessionPriorities.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="text-xl font-semibold mb-3">First Session Priorities</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.firstSessionPriorities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
  </div>
)}

      </div>
        {/* CASE ACTION BUTTONS */}
   <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-xl border border-gray-800 bg-gray-950/95 p-2 shadow-lg backdrop-blur"> 

<button
  type="button"
  onClick={handleRegenerateCurrentPlan}
  disabled={isRegeneratingPlan}
  className="min-w-[96px] rounded-lg bg-purple-700 px-3 py-2 text-xs font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
>
 {isRegeneratingPlan ? "Generating..." : "Regenerate"}
</button>

<button
  type="button"
  onClick={handleSaveCurrentVersion}
  disabled={isSavingCurrentVersion}
  className="rounded-lg bg-green-700 px-3 py-2 text-xs font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
>
  {isSavingCurrentVersion ? "Saving..." : "Save"}
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
    </main>
  );
}