"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type GeneratedPlan = {
  patientSnapshot?: string;
  pathways?: {
    type?: string;
    title?: string;
    interventions?: string[];
    timeline?: string;
    upside?: string;
    tradeoff?: string;
  }[];
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
  patientSnapshot?: string;
  taskBreakdown?: string[];
  functionalProblemAreas?: string[];
  clinicalPriorities?: string[];
  caregiverFocus?: string[];
  pathways?: Pathway[];
  clinicalConsiderations?: string[];
  firstSessionPriorities?: string[];
  selectedPathwayIndex?: number;
  caregiverGuidance?: string[];
  summary?: {
  topRisks?: string[];
  keyLimitations?: string[];
  planSummary?: string;
  caregiverExpectations?: string[];
  safetyLevel?: "low" | "medium" | "high";
};
};

type GenerationRow = {
  id: string;
  created_at: string;
  prompt_version: string | null;
  output_payload: {
    patientSnapshot?: string;
    taskBreakdown?: string[];
    functionalProblemAreas?: string[];
    clinicalPriorities?: string[];
    caregiverFocus?: string[];
    pathways?: {
      type: string;
      title: string;
      interventions: string[];
      timeline: string;
      upside: string;
      tradeoff: string;
    }[];
    clinicalConsiderations?: string[];
    firstSessionPriorities?: string[];
  } | null;
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
  case_classification: {
    case_type?: string;
    subcategory?: string;
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
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [isRestoringVersion, setIsRestoringVersion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
const [isDeleting, setIsDeleting] = useState(false);
const [generations, setGenerations] = useState<GenerationRow[]>([]);
const [latestGeneratedPlan, setLatestGeneratedPlan] = useState<GeneratedPlan | null>(null);
const [selectedGeneration, setSelectedGeneration] = useState<GenerationRow | null>(null);
const [copyMessage, setCopyMessage] = useState("");
const [selectedPathwayIndex, setSelectedPathwayIndex] = useState<number | null>(null);

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
  setCurrentGenerationId(typedCase.current_generation_id);
  console.log("Loaded current_generation_id:", typedCase.current_generation_id);
  
  const savedSelectedPathwayIndex =
  typedCase.generated_output?.selectedPathwayIndex;

if (typeof savedSelectedPathwayIndex === "number") {
  setSelectedPathwayIndex(savedSelectedPathwayIndex);
}
}

      const { data: generationData, error: generationError } = await supabase
  .from("generations")
.select("id, created_at, prompt_version, output_payload")
  .eq("case_id", resolvedParams.id)
  .order("created_at", { ascending: false });

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

async function handleCopySummary() {
  if (!caseData) return;

  const generated = caseData.generated_output as GeneratedOutput | null;

  const selectedPathway =
    typeof selectedPathwayIndex === "number"
      ? generated?.pathways?.[selectedPathwayIndex]
      : null;

  const caregiver =
    generated?.caregiverGuidance?.length
      ? generated.caregiverGuidance
      : selectedPathway?.interventions ?? [];

const summary = `
==============================
CASE: ${caseData.title || "Untitled Case"}
==============================

PLAN
-----
${generated?.summary?.planSummary || "—"}

SAFETY LEVEL
-----
${generated?.summary?.safetyLevel || "—"}

TOP RISKS
-----
${(generated?.summary?.topRisks ?? []).map((i) => `• ${i}`).join("\n")}

CAREGIVER EXPECTATIONS
-----
${(generated?.summary?.caregiverExpectations ?? [])
  .map((i) => `• ${i}`)
  .join("\n")}

SELECTED PATHWAY
-----
Type: ${selectedPathway?.type || "—"}
Title: ${selectedPathway?.title || "—"}
Timeline: ${selectedPathway?.timeline || "—"}
Upside: ${selectedPathway?.upside || "—"}
Tradeoff: ${selectedPathway?.tradeoff || "—"}

INTERVENTIONS
-----
${(selectedPathway?.interventions ?? []).map((i) => `• ${i}`).join("\n")}

CAREGIVER ROLE (Support Only — OT leads plan implementation)
-----
${caregiver.map((i) => `• ${i}`).join("\n")}
`.trim();

  await navigator.clipboard.writeText(summary);
  setCopyMessage("Summary copied to clipboard.");

  setTimeout(() => setCopyMessage(""), 2000);
}
function handleDownloadSummary() {
  if (!caseData) return;

  const generated = caseData.generated_output as GeneratedOutput | null;

  const selectedPathway =
    typeof selectedPathwayIndex === "number"
      ? generated?.pathways?.[selectedPathwayIndex]
      : null;

  const caregiver =
    generated?.caregiverGuidance?.length
      ? generated.caregiverGuidance
      : selectedPathway?.interventions ?? [];

const summary = `
==============================
CASE: ${caseData.title || "Untitled Case"}
==============================

PLAN
-----
${generated?.summary?.planSummary || "—"}

SAFETY LEVEL
-----
${generated?.summary?.safetyLevel || "—"}

TOP RISKS
-----
${(generated?.summary?.topRisks ?? []).map((i) => `• ${i}`).join("\n")}

CAREGIVER EXPECTATIONS
-----
${(generated?.summary?.caregiverExpectations ?? [])
  .map((i) => `• ${i}`)
  .join("\n")}

SELECTED PATHWAY
-----
Type: ${selectedPathway?.type || "—"}
Title: ${selectedPathway?.title || "—"}
Timeline: ${selectedPathway?.timeline || "—"}
Upside: ${selectedPathway?.upside || "—"}
Tradeoff: ${selectedPathway?.tradeoff || "—"}

INTERVENTIONS
-----
${(selectedPathway?.interventions ?? []).map((i) => `• ${i}`).join("\n")}

CAREGIVER GUIDANCE
-----
${caregiver.map((i) => `• ${i}`).join("\n")}
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

 console.log("Generated summary:", generated?.summary);

const selectedPathway =
  typeof selectedPathwayIndex === "number"
    ? generated?.pathways?.[selectedPathwayIndex]
    : null;

const caregiverGuidance =
  generated?.caregiverGuidance?.length
    ? generated.caregiverGuidance
    : selectedPathway?.interventions ?? [];
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

    setSelectedPathwayIndex(index);

    setCaseData((prev: any) => ({
      ...prev,
      generated_output: updatedGeneratedOutput,
    }));

    console.log("Selected pathway saved:", index);
  } catch (err) {
    console.error("Unexpected save error:", err);
  }
};

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
  <div>
    <h1 className="text-3xl font-bold mb-2">
      {caseData.title || "Untitled Case"}
    </h1>
    <p className="text-sm text-gray-400">
      Created: {new Date(caseData.created_at).toLocaleString()}
    </p>
  </div>

 <div className="flex items-center gap-3">
  <Link
    href={`/cases/${caseData.id}/edit`}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
  >
    Edit Case
  </Link>
  <button
    type="button"
    onClick={handleDeleteCase}
    disabled={isDeleting}
    className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 px-4 py-2 rounded-lg text-sm"
  >
    {isDeleting ? "Deleting..." : "Delete Case"}
  </button>
  <button
  type="button"
  onClick={handleCopySummary}
  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
>
  Copy Summary </button>
  <button
  type="button"
  onClick={handleDownloadSummary}
  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
>
  Download Summary
</button>

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

{latestGeneratedPlan?.patientSnapshot && (
  <div className="rounded-xl border border-green-800 bg-gray-900 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold">Current Live Plan</h2>
      <span className="text-xs uppercase tracking-wide text-green-400">
        Latest Version
      </span>
    </div>

    <h3 className="text-lg font-semibold mb-2">Patient Snapshot</h3>
    <p className="text-gray-300">{latestGeneratedPlan.patientSnapshot}</p>
  </div>
)}

{generated?.summary && (
  <div className="rounded-xl border border-yellow-700 bg-gray-900 p-6">
   <h3 className="text-xl font-semibold mb-4">Plan Overview</h3>

<p className="text-xs text-gray-500 mb-2">Overview of selected plan. See pathway below for full details.</p>
    <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-300">
      <div>
  <p className="text-xs text-gray-400 mb-1">Safety Level</p>
  <span className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs font-semibold uppercase text-white">
    {generated.summary.safetyLevel || "—"}
  </span>
</div>

<div className="md:col-span-2">
  <p className="text-xs text-gray-400 mb-1">Plan</p>
  <p className="text-base text-white leading-relaxed">
    {generated.summary.planSummary || "—"}
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
  </div>
)}

{generated?.functionalProblemAreas &&
  generated.functionalProblemAreas.length > 0 && (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="text-xl font-semibold mb-3">
        Functional Problem Areas
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
        {generated.functionalProblemAreas.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}

{latestGeneratedPlan?.taskBreakdown && latestGeneratedPlan.taskBreakdown.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">Task Breakdown</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
{latestGeneratedPlan.taskBreakdown.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{latestGeneratedPlan?.clinicalConsiderations && latestGeneratedPlan.clinicalConsiderations.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">Clinical Considerations</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {latestGeneratedPlan.clinicalConsiderations.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{latestGeneratedPlan?.firstSessionPriorities && latestGeneratedPlan.firstSessionPriorities.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">First Session Priorities</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {latestGeneratedPlan.firstSessionPriorities.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{latestGeneratedPlan?.sessionPlan && latestGeneratedPlan.sessionPlan.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">Session Plan (Visit 1–3)</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {latestGeneratedPlan.sessionPlan.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{generated?.clinicalPriorities &&
  generated.clinicalPriorities.length > 0 && (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="text-xl font-semibold mb-3">Clinical Priorities</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
        {generated.clinicalPriorities.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}

{caregiverGuidance.length > 0 && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">Caregiver Role (Support Tasks)</h3>
    <p className="text-xs text-gray-500 mb-2">Caregiver supports the plan — not all interventions are their responsibility.</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {caregiverGuidance.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}
  
        {generated?.pathways && generated.pathways.length > 0 && (
<div className="grid gap-6 lg:grid-cols-3">
{generated.pathways.map((pathway, index) => (
             <div
  key={`${pathway.type}-${index}`}
onClick={async () => {
  setSelectedPathwayIndex(index);

  try {
  await handleSaveSelectedPathway(index); 
  } catch (e) {
    console.error("Auto-save failed:", e);
  }
}}
>
<div className="flex items-center justify-between mb-2 gap-3">
  <p className="text-xs uppercase tracking-wide text-blue-400 break-all leading-tight">
    {String(pathway.type).replaceAll("_", " ")}
  </p>
  <span className="shrink-0 text-[10px] text-gray-500 italic">
    click to select
  </span>
</div>
<h3 className="text-lg font-semibold mb-3 break-words leading-snug">{pathway.title}</h3>
 

{selectedPathwayIndex === index && (
  <div className="mb-4 flex items-center gap-3">
    <span className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
      Selected Plan
    </span>

  </div>
)}

                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300 mb-4">
                  {pathway.interventions.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>

                <p className="text-sm mb-2">
                  <strong>Timeline:</strong> {pathway.timeline}
                </p>
                <p className="text-sm mb-2">
                  <strong>Upside:</strong> {pathway.upside}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Tradeoff:</strong> {pathway.tradeoff}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedPathway && (
  <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
    <h3 className="text-xl font-semibold mb-3">
      Caregiver Guidance (Selected Plan)
    </h3>

    <p className="text-sm text-gray-400 mb-4">
      Based on: {selectedPathway.title}
    </p>

    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
      {selectedPathway.interventions?.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
)}

       
       <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
  <h3 className="text-xl font-semibold mb-3">Version History</h3>

 {generations.length === 0 ? (
  <p className="text-sm text-gray-400">No prior generations found.</p>
) : (
  <ul className="space-y-3 text-sm text-gray-300">
    {generations.map((generation, index) => (
      <li
        key={generation.id}
        className="border border-gray-800 rounded-lg px-4 py-3 hover:border-blue-500 transition"
      >
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedGeneration(generation)}
            className="text-left flex-1"
          >
            <p className="flex items-center gap-2">
              <strong>Version {generations.length - index}:</strong>

              {currentGenerationId === generation.id && (
                <span className="rounded-full border border-green-700 bg-green-900/30 px-2 py-0.5 text-xs text-green-300">
                  Current
                </span>
              )}

              <span>
                {generation.prompt_version || "Unknown prompt version"}
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
  <div className="rounded-xl border border-blue-800 bg-gray-900 p-6">
 <div className="flex items-center justify-between mb-4">
  <h3 className="text-xl font-semibold">Selected Older Plan</h3>

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={handleRestoreSelectedVersion}
      disabled={isRestoringVersion}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
    >
      {isRestoringVersion ? "Restoring..." : "Restore this version as current"}
    </button>

    <button
      type="button"
      onClick={() => setSelectedGeneration(null)}
      className="text-sm text-blue-400 underline"
    >
      Clear selected version
    </button>
  </div>
</div>

    {selectedGeneration.output_payload.patientSnapshot && (
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Patient Snapshot</h4>
        <p className="text-gray-300">
          {selectedGeneration.output_payload.patientSnapshot}
        </p>
      </div>
    )}

    {selectedGeneration.output_payload.pathways &&
      selectedGeneration.output_payload.pathways.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {selectedGeneration.output_payload.pathways.map((pathway, index) => (

<div
  key={`${pathway.type}-${index}`}
  onClick={() => setSelectedPathwayIndex(index)}
className={`rounded-xl border p-5 cursor-pointer transition transform hover:scale-[1.01] ${
    selectedPathwayIndex === index
      ? "border-blue-500 bg-blue-950/30"
      : "border-gray-800 bg-gray-900 hover:border-blue-500"
  }`}
>

<p className="text-xs uppercase tracking-wide text-blue-400 mb-2 break-words leading-snug">
  {String(pathway.type).replaceAll("_", " ")}
</p>
              <h4 className="text-lg font-semibold mb-3">{pathway.title}</h4>

              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300 mb-4">
                {pathway.interventions.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>

              <p className="text-sm mb-2">
                <strong>Timeline:</strong> {pathway.timeline}
              </p>
              <p className="text-sm mb-2">
                <strong>Upside:</strong> {pathway.upside}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Tradeoff:</strong> {pathway.tradeoff}
              </p>
            </div>
          ))}
        </div>
      )}

    {selectedGeneration.output_payload.clinicalConsiderations &&
      selectedGeneration.output_payload.clinicalConsiderations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">
            Clinical Considerations
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.clinicalConsiderations.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
      )}

    {selectedGeneration.output_payload.firstSessionPriorities &&
      selectedGeneration.output_payload.firstSessionPriorities.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-2">
            First Session Priorities
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            {selectedGeneration.output_payload.firstSessionPriorities.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
      )}
  </div>
)}  
      </div>
    </main>
  );
}