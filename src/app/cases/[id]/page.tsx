"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
};

type GeneratedOutput = {
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

clinicalDetailModules?: {
  caregiverInstructions?: string[];
  caregiverScript?: CaregiverScript;
  transferDetails?: TransferMobilityDetails;
    adlPrivacy?: AdlPrivacySupport;
    
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
  subcategory?: string;
  clinical_focus?: string;
} | null;
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

const [showDetails, setShowDetails] = useState(false);
const [showTaskBreakdown, setShowTaskBreakdown] = useState(false);
const [showClinicalConsiderations, setShowClinicalConsiderations] = useState(false);
const [showFirstSessionPriorities, setShowFirstSessionPriorities] = useState(false);
const [isRegeneratingFocus, setIsRegeneratingFocus] = useState(false);
const [isRegeneratingPlan, setIsRegeneratingPlan] = useState(false);
const [regeneratingFocus, setRegeneratingFocus] = useState<string | null>(null);
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
  const latestPlan = generationData && generationData.length > 0
  ? generationData[0].output_payload
  : null;
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

  console.log("Saving feasibility:", editableFeasibility);

  try {
    const { error } = await supabase
      .from("cases")

.update({
  title: editableTitle,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
})

      .eq("id", caseData.id);

    if (error) {
      throw error;
    }

 setCaseData({
  ...caseData,
  title: editableTitle,
  client_info: editableClientInfo,
  caregiver_info: editableCaregiverInfo,
  feasibility_context: editableFeasibility,
});

    setIsEditing(false);
  } catch (error) {
    console.error("Failed to save case edits:", error);
    alert("Failed to save changes.");
  }
}

async function handleCopySummary() {
  if (!caseData) return;

  const generated = caseData.generated_output as GeneratedOutput | null;

  const summary = `
==============================
CASE: ${caseData.title || "Untitled Case"}
==============================

CURRENT LIVE PLAN
-----------------
Patient Snapshot:
${generated?.patientSnapshot || "—"}

PLAN OVERVIEW
-------------
Risk Level:
${generated?.summary?.safetyLevel || "—"}

Plan:
${generated?.summary?.planSummary || "—"}

Top Risks:
${(generated?.summary?.topRisks ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Caregiver Expectations:
${(generated?.summary?.caregiverExpectations ?? [])
  .map((i) => `• ${i}`)
  .join("\n") || "—"}

Treatment Approaches:
${(generated?.pathways ?? [])
  .map(
    (pathway, index) => `
Approach ${index + 1}
${String(pathway.type || "—").replaceAll("_", " ")}

${pathway.title || "Untitled Approach"}

Interventions:
${(pathway.interventions ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Timeline: ${pathway.timeline || "—"}
Upside: ${pathway.upside || "—"}
Tradeoff: ${pathway.tradeoff || "—"}
`.trim()
  )
  .join("\n\n") || "—"}

CAREGIVER INSTRUCTIONS
----------------------
${(generated?.caregiverGuidance ?? []).map((i) => `• ${i}`).join("\n") || "—"}

FAMILY / CAREGIVER SCRIPT
-------------------------
${generated?.clinicalDetailModules?.caregiverScript
  ? `
Conversation Goal:
${generated.clinicalDetailModules.caregiverScript.conversationGoal || "—"}

Before Task:
${generated.clinicalDetailModules.caregiverScript.beforeTaskScript || "—"}

During Task:
${generated.clinicalDetailModules.caregiverScript.duringTaskScript || "—"}

If Patient Struggles:
${generated.clinicalDetailModules.caregiverScript.ifPatientStruggles || "—"}

If Patient Resists:
${generated.clinicalDetailModules.caregiverScript.ifPatientResists || "—"}

Reassurance:
${generated.clinicalDetailModules.caregiverScript.reassuranceLanguage || "—"}

When to Be Firm:
${generated.clinicalDetailModules.caregiverScript.whenToBeFirm || "—"}
`.trim()
  : "—"}

TRANSFER & MOBILITY DETAILS
---------------------------
${generated?.clinicalDetailModules?.transferDetails
  ? `
Setup Adjustments:
${(generated.clinicalDetailModules.transferDetails.setupAdjustments ?? []).map(i => `• ${i}`).join("\n") || "—"}

Transfer Cues:
${(generated.clinicalDetailModules.transferDetails.transferCues ?? []).map(i => `• ${i}`).join("\n") || "—"}

Surface Variations:
${(generated.clinicalDetailModules.transferDetails.surfaceVariations ?? []).map(i => `• ${i}`).join("\n") || "—"}

Stop Rules:
${(generated.clinicalDetailModules.transferDetails.stopRules ?? []).map(i => `• ${i}`).join("\n") || "—"}
`.trim()
  : "—"}

ADL PRIVACY & DIGNITY SUPPORT
-----------------------------
${generated?.clinicalDetailModules?.adlPrivacy
  ? `
Privacy Setup:
${(generated.clinicalDetailModules.adlPrivacy.privacySetup ?? []).map(i => `• ${i}`).join("\n") || "—"}

Respectful Cueing:
${(generated.clinicalDetailModules.adlPrivacy.respectfulCueing ?? []).map(i => `• ${i}`).join("\n") || "—"}

When to Step In:
${(generated.clinicalDetailModules.adlPrivacy.whenToStepIn ?? []).map(i => `• ${i}`).join("\n") || "—"}

When to Step Back:
${(generated.clinicalDetailModules.adlPrivacy.whenToStepBack ?? []).map(i => `• ${i}`).join("\n") || "—"}

Dignity Warnings:
${(generated.clinicalDetailModules.adlPrivacy.dignityWarnings ?? []).map(i => `• ${i}`).join("\n") || "—"}
`.trim()
  : "—"}
`.trim();
  await navigator.clipboard.writeText(summary);
  setCopyMessage("Summary copied to clipboard.");

  setTimeout(() => setCopyMessage(""), 2000);
}

function handleDownloadSummary() {
  if (!caseData) return;

  const generated = caseData.generated_output as GeneratedOutput | null;

  const summary = `
==============================
CASE: ${caseData.title || "Untitled Case"}
==============================

CURRENT LIVE PLAN
-----------------
Patient Snapshot:
${generated?.patientSnapshot || "—"}

PLAN OVERVIEW
-------------
Risk Level:
${generated?.summary?.safetyLevel || "—"}

Plan:
${generated?.summary?.planSummary || "—"}

Top Risks:
${(generated?.summary?.topRisks ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Caregiver Expectations:
${(generated?.summary?.caregiverExpectations ?? [])
  .map((i) => `• ${i}`)
  .join("\n") || "—"}

Treatment Approaches:
${(generated?.pathways ?? [])
  .map(
    (pathway, index) => `
Approach ${index + 1}
${String(pathway.type || "—").replaceAll("_", " ")}

${pathway.title || "Untitled Approach"}

Interventions:
${(pathway.interventions ?? []).map((i) => `• ${i}`).join("\n") || "—"}

Timeline: ${pathway.timeline || "—"}
Upside: ${pathway.upside || "—"}
Tradeoff: ${pathway.tradeoff || "—"}
`.trim()
  )
  .join("\n\n") || "—"}

CAREGIVER INSTRUCTIONS
----------------------
${(generated?.caregiverGuidance ?? []).map((i) => `• ${i}`).join("\n") || "—"}

FAMILY / CAREGIVER SCRIPT
-------------------------
${generated?.clinicalDetailModules?.caregiverScript
  ? `
Conversation Goal:
${generated.clinicalDetailModules.caregiverScript.conversationGoal || "—"}

Before Task:
${generated.clinicalDetailModules.caregiverScript.beforeTaskScript || "—"}

During Task:
${generated.clinicalDetailModules.caregiverScript.duringTaskScript || "—"}

If Patient Struggles:
${generated.clinicalDetailModules.caregiverScript.ifPatientStruggles || "—"}

If Patient Resists:
${generated.clinicalDetailModules.caregiverScript.ifPatientResists || "—"}

Reassurance:
${generated.clinicalDetailModules.caregiverScript.reassuranceLanguage || "—"}

When to Be Firm:
${generated.clinicalDetailModules.caregiverScript.whenToBeFirm || "—"}
`.trim()
  : "—"}

TRANSFER & MOBILITY DETAILS
---------------------------
${generated?.clinicalDetailModules?.transferDetails
  ? `
Setup Adjustments:
${(generated.clinicalDetailModules.transferDetails.setupAdjustments ?? []).map(i => `• ${i}`).join("\n") || "—"}

Transfer Cues:
${(generated.clinicalDetailModules.transferDetails.transferCues ?? []).map(i => `• ${i}`).join("\n") || "—"}

Surface Variations:
${(generated.clinicalDetailModules.transferDetails.surfaceVariations ?? []).map(i => `• ${i}`).join("\n") || "—"}

Stop Rules:
${(generated.clinicalDetailModules.transferDetails.stopRules ?? []).map(i => `• ${i}`).join("\n") || "—"}
`.trim()
  : "—"}

ADL PRIVACY & DIGNITY SUPPORT
-----------------------------
${generated?.clinicalDetailModules?.adlPrivacy
  ? `
Privacy Setup:
${(generated.clinicalDetailModules.adlPrivacy.privacySetup ?? []).map(i => `• ${i}`).join("\n") || "—"}

Respectful Cueing:
${(generated.clinicalDetailModules.adlPrivacy.respectfulCueing ?? []).map(i => `• ${i}`).join("\n") || "—"}

When to Step In:
${(generated.clinicalDetailModules.adlPrivacy.whenToStepIn ?? []).map(i => `• ${i}`).join("\n") || "—"}

When to Step Back:
${(generated.clinicalDetailModules.adlPrivacy.whenToStepBack ?? []).map(i => `• ${i}`).join("\n") || "—"}

Dignity Warnings:
${(generated.clinicalDetailModules.adlPrivacy.dignityWarnings ?? []).map(i => `• ${i}`).join("\n") || "—"}
`.trim()
  : "—"}
`.trim();

  const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const safeTitle = (caseData.title || "case-summary")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeTitle || "case-summary"}.txt`;
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
        {/* Detail Modules (SAFE TEST) */}
<div className="mt-6 space-y-6">
  <div className="rounded-xl border border-blue-800 bg-gray-950 p-6">
    <h3 className="text-lg font-semibold">Transfer & Mobility Details</h3>
    <p className="text-sm text-gray-400 mt-1">
      (placeholder – wiring next)
    </p>
  </div>

  <div className="rounded-xl border border-emerald-800 bg-gray-950 p-6">
    <h3 className="text-lg font-semibold">ADL Privacy & Dignity Support</h3>
    <p className="text-sm text-gray-400 mt-1">
      (placeholder – wiring next)
    </p>
  </div>
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

const selectedPathway = generated?.pathways?.[0] ?? null;

const activeGeneratedOutput = latestGeneratedPlan as GeneratedOutput | null;

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

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCasePayload),
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
          input_payload: updatedCasePayload,
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
        generated_output: plan,
        current_generation_id: newGeneration?.id || caseData.current_generation_id,
        
      })
      .eq("id", caseData.id);

    if (caseUpdateError) throw caseUpdateError;

    setCaseData((prev: any) => ({
      ...prev,
      case_classification: updatedCasePayload.case_classification,
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

    const aiResponse = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCasePayload),
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
          input_payload: updatedCasePayload,
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
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
  
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

  <div className="mt-4 grid grid-cols-3 gap-2">
    {["adl_home_safety", "transfers_mobility", "caregiver_training"].map((focus) => (
<button
  key={focus}
  type="button"
disabled={
  isRegeneratingFocus ||
  caseData.case_classification?.clinical_focus === focus
}
  onClick={() => {
    console.log("Clicked focus:", focus);
    handleClinicalFocusChange(focus);
  }}
  className={`w-full py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
    caseData.case_classification?.clinical_focus === focus
      ? "bg-blue-600 text-white"
      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
  }`}
>
{regeneratingFocus === focus
  ? "Generating..."
  : focus === "adl_home_safety"
  ? "ADL"
  : focus === "transfers_mobility"
  ? "Transfers"
  : "Caregiver"}
</button>
    ))}
  </div>
</div>

 <div className="hidden">

{copyMessage && (
  <p className="text-sm text-gray-400 mt-3">{copyMessage}</p>
)}
</div>
</div>
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
  </div>
) : (
  <>
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
  <strong>Subcategory:</strong>{" "}
  {caseData.case_classification?.subcategory || "—"}
</p>
<p>
  <strong>Primary Goal:</strong>{" "}
  {caseData.goals_preferences?.primary_goal || "—"}
</p>

{/* 👇 ADD YOUR NEW ENVIRONMENT FIELDS RIGHT HERE */}

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

{generated?.patientSnapshot && (
  <div className="rounded-xl border border-green-800 bg-gray-900 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold">Current Live Plan</h2>
      <span className="text-xs uppercase tracking-wide text-green-400">
        Latest Version
      </span>
    </div>

    <h3 className="text-lg font-semibold mb-2">Patient Snapshot</h3>
  <p className="text-gray-300">{generated.patientSnapshot}</p>
  </div>
)}

{generated?.summary && (
  <div className="rounded-xl border border-yellow-700 bg-gray-900 p-6">
   <h3 className="text-xl font-semibold mb-4">Plan Overview</h3>

<p className="text-xs text-gray-500 mb-2">Overview of selected plan. See pathway below for full details.</p>
    <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-300">
      <div>
<p className="text-xs text-gray-400 mb-1">Risk Level</p>
  <span className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs font-semibold uppercase text-white">
    {generated.summary.safetyLevel || "—"}
  </span>
</div>

<div className="md:col-span-2">
  <p className="text-xs text-gray-400 mb-1">Recommended Approach</p>
  <p className="text-base text-white leading-relaxed">
    {generated.selectedPathwaySummary || "—"}
  </p>
</div>

      {(generated.summary.topRisks ?? []).length > 0 && (
        <div>
<p className="text-xs text-gray-400 mb-1">Top Risks</p>
<ul className="list-disc pl-5 mt-1 space-y-1 text-sm leading-snug">
  {(generated.summary.topRisks ?? []).map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
        </div>
      )}

      {(generated.summary.caregiverExpectations ?? []).length > 0 && (
        <div>
<p className="text-xs text-gray-400 mb-1">Caregiver Expectations</p>



<ul className="list-disc pl-5 mt-1 space-y-1 text-sm leading-snug">
  {(generated.summary.caregiverExpectations ?? []).map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
        </div>
      )}
    </div>
    {generated?.pathways && generated.pathways.length > 0 && (
 <div className="mt-6">
    <p className="text-xs text-gray-400 mb-2">Treatment Approaches</p>

    <div className="space-y-4">
      {generated.pathways.map((pathway, index) => (
        <div
          key={`${pathway.type}-${index}`}
          className="rounded-lg border border-gray-800 p-4 bg-gray-950"
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
  </div>
)}
  </div>
)}

<div className="mt-6 rounded-xl border border-purple-800 bg-gray-950 p-6">
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <h3 className="text-lg font-semibold">
        Family / Caregiver Script
      </h3>
      <p className="text-sm text-gray-400 mt-1">
        Generate plain-language instructions a clinician can share with the patient, caregiver, family, or friend.
      </p>
    </div>

    <button
      type="button"
      onClick={handleGenerateCaregiverScript}
      disabled={isGeneratingCaregiverScript}
      className="shrink-0 rounded-lg bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
    >
      {isGeneratingCaregiverScript ? "Generating..." : "Generate Script"}
    </button>
  </div>

  {caregiverScriptError && (
    <p className="text-sm text-red-400 mb-4">
      {caregiverScriptError}
    </p>
  )}

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

<div className="mt-6 grid gap-6">
  <div className="rounded-xl border border-blue-800 bg-gray-950 p-6">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold">Transfer & Mobility Details</h3>
        <p className="text-sm text-gray-400 mt-1">
          Generate practical setup, cueing, surface variation, and stop-rule details.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGenerateTransferDetails}
        disabled={isGeneratingTransferDetails}
        className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isGeneratingTransferDetails ? "Generating..." : "Generate"}
      </button>
    </div>

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

  <div className="rounded-xl border border-emerald-800 bg-gray-950 p-6">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold">ADL Privacy & Dignity Support</h3>
        <p className="text-sm text-gray-400 mt-1">
          Generate plain-language guidance for private ADLs like bathing, toileting, and dressing.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGenerateAdlPrivacy}
        disabled={isGeneratingAdlPrivacy}
        className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
      >
        {isGeneratingAdlPrivacy ? "Generating..." : "Generate"}
      </button>
    </div>

    {adlPrivacy ? (
      <div className="space-y-4 text-sm text-gray-300">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Privacy Setup</p>
          <ul className="list-disc pl-5 space-y-1">
            {(adlPrivacy.privacySetup ?? []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Respectful Cueing</p>
          <ul className="list-disc pl-5 space-y-1">
            {(adlPrivacy.respectfulCueing ?? []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">When to Step In</p>
          <ul className="list-disc pl-5 space-y-1">
            {(adlPrivacy.whenToStepIn ?? []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">When to Step Back</p>
          <ul className="list-disc pl-5 space-y-1">
            {(adlPrivacy.whenToStepBack ?? []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">Dignity Warnings</p>
          <ul className="list-disc pl-5 space-y-1">
            {(adlPrivacy.dignityWarnings ?? []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    ) : (
      <p className="text-sm text-gray-500">No ADL privacy support generated yet.</p>
    )}
  </div>
</div>

{generated?.equipmentPlan && generated.equipmentPlan.length > 0 && (
  <div className="rounded-xl border-gray-800 bg-gray-950 p-6 mb-6">
 <h3 className="text-lg font-medium text-gray-300 mb-2">
  Ideal Equipment Setup (Reference)
</h3>

    <p className="text-xs text-gray-500 mb-4">
  Best-case setup. Use feasibility plan below for what to actually implement.
</p>

<div className="overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-300">
    <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
      <tr>
        <th className="py-2 pr-4">Item</th>
        <th className="py-2 pr-4">Priority</th>
        <th className="py-2 pr-4">Cost</th>
        <th className="py-2 pr-4">Access</th>
        <th className="py-2">Coverage</th>
      </tr>
    </thead>

    <tbody>
      {generated.equipmentPlan.map((item, index) => (
        <tr key={index} className="border-b border-gray-800 align-top">
          <td className="py-3 pr-4 font-medium text-white">
            {item.item}
          </td>

          <td className="py-3 pr-4">
            <span className={`px-2 py-1 rounded text-xs ${getPriorityBadgeClass(item.priority)}`}>
              {item.priority || "—"}
            </span>
          </td>

          <td className="py-3 pr-4 text-gray-400">
            {item.costRange || "—"}
          </td>

          <td className="py-3 pr-4 text-gray-400">
            {item.access || "—"}
          </td>

          <td className="py-3 text-gray-400">
            {item.coverageNotes || "—"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  </div>
)}

<div className="mt-6 rounded-xl border border-orange-500 bg-gray-900 p-6">
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <h3 className="text-lg font-semibold">Equipment & Feasibility Plan</h3>
      <p className="text-sm text-gray-400 mt-1">
        Generate realistic equipment recommendations based on cost, home setup, and caregiver constraints.
      </p>
    </div>

<button
  type="button"
  onClick={handleGenerateEquipmentFeasibility}
  disabled={isGeneratingEquipmentFeasibility}
  className="shrink-0 rounded-lg bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isGeneratingEquipmentFeasibility ? "Generating..." : "Generate Feasibility Plan"}
</button>
  </div>

  {equipmentFeasibility ? (
    <div className="space-y-4 text-sm text-gray-300">

      {equipmentFeasibility.feasibilitySnapshot && (
        <div className="mb-4 space-y-1 text-sm text-gray-400">
<p>💰 {mapFinancial(equipmentFeasibility.feasibilitySnapshot.financialFeasibility)}</p>
<p>🏠 {mapEnvironment(equipmentFeasibility.feasibilitySnapshot.environmentalFeasibility)}</p>
<p>👤 {mapCaregiver(equipmentFeasibility.feasibilitySnapshot.caregiverFlexibility)}</p>

<p className="text-xs text-gray-500 mt-2">
  <strong>Main Constraint:</strong> {equipmentFeasibility.feasibilitySnapshot.mainConstraint}
</p>
        </div>
      )}

      <div className="space-y-4">
        {equipmentFeasibility.equipmentPlan?.map((item, i) => (
          <div key={i} className="border border-gray-800 rounded-lg p-4 bg-gray-900">

            <h4 className="font-semibold text-white mb-1">{item.item}</h4>

            <p className="text-gray-300 text-sm mb-2">{item.reason}</p>

            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>Priority:</strong> {item.priority}</p>
              <p><strong>Urgency:</strong> {item.urgency}</p>
              <p><strong>Cost:</strong> {item.costRange}</p>
              <p><strong>Access:</strong> {item.access}</p>
              <p><strong>Coverage:</strong> {item.coverageNotes}</p>
            </div>

{item.immediateWorkaround && (
  <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950 p-3">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      What can be done today
    </p>
    <p className="text-sm text-gray-300">
      {item.immediateWorkaround}
    </p>
  </div>
)}

{item.relativeCost && (
  <p className="text-xs text-gray-400 mt-3">
    <span className={`px-2 py-1 rounded text-xs ${getCostBadgeClass(item.relativeCost)}`}>
  Cost: {item.relativeCost || "—"}
</span>
  </p>
)}

{item.costComparisonNote && (
  <p className="text-sm text-gray-300 mt-1">
    {item.costComparisonNote}
  </p>
)}

          </div>
        ))}
      </div>
    </div>
) : (
  <div>
    <p className="text-sm text-gray-400">
      Generate a real-world plan based on this patient’s constraints.
    </p>

    <p className="text-xs text-gray-500 mt-1">
      This will adapt the ideal setup above into something safe and actionable.
    </p>
  </div>
)}
</div>



   

{equipmentFeasibility?.equipmentPlan && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">
      Ideal Setup Comparison
    </h3>

    <p className="text-xs text-gray-500 mb-4">
      Best-case setup vs what is realistic today based on constraints.
    </p>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
          <tr>
            <th className="py-2 pr-4">Item</th>
            <th className="py-2 pr-4">Ideal Setup</th>
            <th className="py-2 pr-4">Feasible Plan</th>
            <th className="py-2 pr-4">Cost Gap (Ideal vs Feasible)</th>
            <th className="py-2">Decision</th>
          </tr>
        </thead>
        <tbody>
          {equipmentFeasibility.equipmentPlan.map((item, i) => (
            <tr key={i} className="border-b border-gray-800 align-top">
              <td className="py-3 pr-4 font-medium text-white">
                {item.item}
              </td>

              <td className="py-3 pr-4">
                <p className="text-gray-300">{item.idealSetup || "—"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.idealEstimatedCost || ""}
                </p>
              </td>

              <td className="py-3 pr-4">
                <p className="text-gray-300">{item.reason}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.feasibleEstimatedCost || item.costRange || ""}
                </p>
              </td>

              <td className="py-3 pr-4">
                <span className={`px-2 py-1 rounded text-xs ${getCostBadgeClass(item.relativeCost)}`}>
                  {item.relativeCost || "—"}
                </span>
              </td>

              <td className="py-3">
                <p className="text-gray-300">
                  {item.clinicalDecision || item.costComparisonNote || "—"}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

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
                    className="rounded-lg border border-gray-800 p-4 bg-gray-950"
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
   <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl shadow-lg">

  <button
    type="button"
    onClick={() => setIsEditing((prev) => !prev)}
    className={`px-4 py-2 rounded-lg text-sm text-white ${
      isEditing
        ? "bg-orange-700 hover:bg-orange-600"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {isEditing ? "Exit Edit" : "Edit Case"}
  </button>

  {isEditing && (
    <button
      type="button"
      onClick={handleSaveCaseEdits}
      className="bg-orange-700 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm text-white"
    >
      Save Changes
    </button>
  )}

  <button
    type="button"
    onClick={handleRegenerateCurrentPlan}
    disabled={isRegeneratingPlan}
    className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm text-white"
  >
    {isRegeneratingPlan ? "Regenerating..." : "Regenerate Plan"}
  </button>

  <button
    type="button"
    onClick={handleSaveCurrentVersion}
    disabled={isSavingCurrentVersion}
    className="bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm text-white"
  >
    {isSavingCurrentVersion ? "Saving..." : "Save Version"}
  </button>

  <button
    type="button"
    onClick={handleCopySummary}
    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm text-white"
  >
    Copy
  </button>

  <button
    type="button"
    onClick={handleDownloadSummary}
    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm text-white"
  >
    Download
  </button>

</div>
    </main>
  );
}