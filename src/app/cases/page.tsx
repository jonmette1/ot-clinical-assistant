"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PatientEntryCard,
  type PatientEntryCase,
  type PatientEntryPreviewState,
} from "./PatientEntryCard";
import {
  derivePatientEntryPreviewSignals,
  type PatientEntryPreviewCaseData,
  type PatientEntryPreviewEventData,
} from "./patientEntryPreview";

type CaseRow = PatientEntryCase;

type PreviewStateMap = Record<string, PatientEntryPreviewState>;

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openPreviewCaseId, setOpenPreviewCaseId] = useState<string | null>(
    null
  );
  const [previewStateByCaseId, setPreviewStateByCaseId] =
    useState<PreviewStateMap>({});

  useEffect(() => {
    async function loadCases() {
      const { data, error } = await supabase
        .from("cases")
        .select(
          "id, title, created_at, patient_profile, client_info, case_classification, functional_status, goals_preferences, environment"
        )
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message || "Failed to load patients.");
      } else {
        setCases((data as CaseRow[]) || []);
      }

      setLoading(false);
    }

    loadCases();
  }, []);

  async function loadPreview(caseId: string) {
    setPreviewStateByCaseId((prev) => ({
      ...prev,
      [caseId]: { status: "loading" },
    }));

    const [casePreviewResult, longitudinalEventsResult] = await Promise.all([
      supabase
        .from("cases")
        .select(
          "id, target_activities, generated_output, current_longitudinal_state, clinical_attention_state, reasoning_stale, plan_stale, modules_stale"
        )
        .eq("id", caseId)
        .single(),
      supabase
        .from("longitudinal_events")
        .select(
          "id, created_at, event_payload, current_state_snapshot, clinical_attention_snapshot"
        )
        .eq("case_id", caseId)
        .order("created_at", { ascending: false })
        .limit(2),
    ]);

    if (casePreviewResult.error || longitudinalEventsResult.error) {
      setPreviewStateByCaseId((prev) => ({
        ...prev,
        [caseId]: {
          status: "error",
          message:
            casePreviewResult.error?.message ||
            longitudinalEventsResult.error?.message ||
            "Preview could not be loaded.",
        },
      }));
      return;
    }

    const previewSignals = derivePatientEntryPreviewSignals({
      caseData:
        (casePreviewResult.data as PatientEntryPreviewCaseData | null) || null,
      recentEvents:
        (longitudinalEventsResult.data as PatientEntryPreviewEventData[]) || [],
    });

    setPreviewStateByCaseId((prev) => ({
      ...prev,
      [caseId]: {
        status: "loaded",
        signals: previewSignals,
      },
    }));
  }

  function toggleQuickPreview(caseId: string) {
    const isCurrentlyOpen = openPreviewCaseId === caseId;

    if (isCurrentlyOpen) {
      setOpenPreviewCaseId(null);
      return;
    }

    setOpenPreviewCaseId(caseId);

    if (!previewStateByCaseId[caseId]) {
      void loadPreview(caseId);
    }
  }

  async function deleteSelectedCases() {
    if (selectedCaseIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedCaseIds.length} selected patient record(s)? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("cases")
      .delete()
      .in("id", selectedCaseIds);

    if (error) {
      setErrorMessage(error.message || "Failed to delete selected patient records.");
      setIsDeleting(false);
      return;
    }

    setCases((prev) => prev.filter((c) => !selectedCaseIds.includes(c.id)));
    setSelectedCaseIds([]);
    setIsDeleting(false);
  }

  const filteredCases = [...cases]
    .filter((c) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        c.client_info?.client_name?.toLowerCase().includes(search) ||
        c.patient_profile?.primary_diagnosis?.toLowerCase().includes(search) ||
        c.case_classification?.case_type?.toLowerCase().includes(search) ||
        c.functional_status?.other_key_barriers
          ?.toLowerCase()
          .includes(search) ||
        c.goals_preferences?.other_target_activity
          ?.toLowerCase()
          .includes(search) ||
        c.environment?.other_safety_hazards?.toLowerCase().includes(search) ||
        c.environment?.other_equipment_present?.toLowerCase().includes(search);

      const matchesCaseType =
        selectedCaseType === "all" ||
        c.case_classification?.case_type === selectedCaseType;

      return matchesSearch && matchesCaseType;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const filteredCaseIds = filteredCases.map((c) => c.id);
  const allFilteredSelected =
    filteredCaseIds.length > 0 &&
    filteredCaseIds.every((id) => selectedCaseIds.includes(id));

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Patient Entry
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Patients</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Orient around patient identity, treatment frame, clinical context,
            and recency before opening the Visit Briefing.
          </p>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search patient, diagnosis, or context"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm"
          />

          <select
            value={selectedCaseType}
            onChange={(e) => setSelectedCaseType(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm"
          >
            <option value="all">All patient contexts</option>
            <option value="geriatric">Geriatric</option>
            <option value="neurological">Neurological</option>
            <option value="physical_rehabilitation">Physical Rehab</option>
            <option value="pediatric">Pediatric</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm"
          >
            <option value="newest">Most recent first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {loading && <p className="text-gray-400">Loading patients...</p>}

        {!loading && errorMessage && (
          <p className="text-red-400">Error loading patients: {errorMessage}</p>
        )}

        {!loading && !errorMessage && filteredCases.length === 0 && (
          <p className="text-gray-400">No patients yet.</p>
        )}

        {!loading && !errorMessage && filteredCases.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Patient list controls
              </p>
              <p className="mt-1 text-sm text-gray-300">
                {selectedCaseIds.length} selected
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (allFilteredSelected) {
                    setSelectedCaseIds([]);
                  } else {
                    setSelectedCaseIds(filteredCaseIds);
                  }
                }}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                {allFilteredSelected ? "Clear All" : "Select All"}
              </button>

              <button
                type="button"
                onClick={deleteSelectedCases}
                disabled={selectedCaseIds.length === 0 || isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-900"
              >
                {isDeleting ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredCases.map((c) => (
            <PatientEntryCard
              key={c.id}
              caseRow={c}
              isSelected={selectedCaseIds.includes(c.id)}
              previewState={previewStateByCaseId[c.id] || { status: "idle" }}
              isPreviewOpen={openPreviewCaseId === c.id}
              onQuickPreviewToggle={() => toggleQuickPreview(c.id)}
              onSelectionChange={(checked) => {
                if (checked) {
                  setSelectedCaseIds((prev) => [...prev, c.id]);
                } else {
                  setSelectedCaseIds((prev) =>
                    prev.filter((id) => id !== c.id)
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
