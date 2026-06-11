"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PatientEntryCard } from "./PatientEntryCard";
import {
  CASELOAD_SORT_OPTIONS,
  CASELOAD_SYSTEM_VIEWS,
  derivePatientCaseloadSummary,
  filterAndSortCaseload,
  type CaseloadCaseData,
  type CaseloadEventData,
  type CaseloadSortId,
  type CaseloadViewId,
} from "./patientCaseload";

export default function CasesPage() {
  const [cases, setCases] = useState<CaseloadCaseData[]>([]);
  const [latestEventByCaseId, setLatestEventByCaseId] = useState<
    Record<string, CaseloadEventData>
  >({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("all");
  const [selectedView, setSelectedView] = useState<CaseloadViewId>("all");
  const [sortOrder, setSortOrder] = useState<CaseloadSortId>("clinical-priority");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadCases() {
      const { data, error } = await supabase
        .from("cases")
        .select(
          "id, title, created_at, patient_profile, client_info, case_classification, functional_status, goals_preferences, environment, target_activities, generated_output, current_longitudinal_state, clinical_attention_state, reasoning_stale, plan_stale, modules_stale"
        );

      if (error) {
        setErrorMessage(error.message || "Failed to load patients.");
        setLoading(false);
        return;
      }

      const loadedCases = (data as CaseloadCaseData[]) || [];
      setCases(loadedCases);

      if (loadedCases.length > 0) {
        const { data: eventData, error: eventError } = await supabase
          .from("longitudinal_events")
          .select(
            "id, case_id, created_at, event_payload, current_state_snapshot, clinical_attention_snapshot"
          )
          .in(
            "case_id",
            loadedCases.map((caseRow) => caseRow.id)
          )
          .order("created_at", { ascending: false });

        if (eventError) {
          setErrorMessage(eventError.message || "Failed to load current caseload signals.");
          setLoading(false);
          return;
        }

        const latestEvents = ((eventData as CaseloadEventData[]) || []).reduce<
          Record<string, CaseloadEventData>
        >((eventsByCaseId, event) => {
          if (!eventsByCaseId[event.case_id]) eventsByCaseId[event.case_id] = event;
          return eventsByCaseId;
        }, {});
        setLatestEventByCaseId(latestEvents);
      }

      setLoading(false);
    }

    void loadCases();
  }, []);

  const caseload = useMemo(
    () =>
      cases.map((caseRow) =>
        derivePatientCaseloadSummary({
          caseRow,
          latestEvent: latestEventByCaseId[caseRow.id],
        })
      ),
    [cases, latestEventByCaseId]
  );

  const visiblePatients = useMemo(
    () =>
      filterAndSortCaseload({
        patients: caseload,
        view: selectedView,
        searchTerm,
        caseType: selectedCaseType,
        sort: sortOrder,
      }),
    [caseload, searchTerm, selectedCaseType, selectedView, sortOrder]
  );

  const viewCounts = useMemo(
    () =>
      Object.fromEntries(
        CASELOAD_SYSTEM_VIEWS.map((view) => [
          view.id,
          filterAndSortCaseload({
            patients: caseload,
            view: view.id,
            searchTerm: "",
            caseType: "all",
            sort: "clinical-priority",
          }).length,
        ])
      ) as Record<CaseloadViewId, number>,
    [caseload]
  );

  async function deleteSelectedCases() {
    if (selectedCaseIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedCaseIds.length} selected patient record(s)? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    const { error } = await supabase.from("cases").delete().in("id", selectedCaseIds);

    if (error) {
      setErrorMessage(error.message || "Failed to delete selected patient records.");
      setIsDeleting(false);
      return;
    }

    setCases((currentCases) =>
      currentCases.filter((caseRow) => !selectedCaseIds.includes(caseRow.id))
    );
    setSelectedCaseIds([]);
    setIsDeleting(false);
  }

  const visibleCaseIds = visiblePatients.map((patient) => patient.caseRow.id);
  const allVisibleSelected =
    visibleCaseIds.length > 0 &&
    visibleCaseIds.every((caseId) => selectedCaseIds.includes(caseId));

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Prioritize the caseload by current clinical attention, meaningful change,
            and reassessment needs.
          </p>
        </header>

        <nav aria-label="Caseload views" className="mb-6 border-b border-gray-800">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {CASELOAD_SYSTEM_VIEWS.map((view) => {
              const isActive = selectedView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setSelectedView(view.id)}
                  className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-blue-400 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {view.label}
                  <span className="ml-2 text-xs text-gray-500">{viewCounts[view.id]}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section aria-label="Caseload controls" className="mb-6 grid gap-3 md:grid-cols-3">
          <label className="md:col-span-1">
            <span className="sr-only">Search patients</span>
            <input
              type="search"
              placeholder="Search patient, diagnosis, or context"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label>
            <span className="sr-only">Filter by clinical context</span>
            <select
              value={selectedCaseType}
              onChange={(event) => setSelectedCaseType(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm"
            >
              <option value="all">All clinical contexts</option>
              <option value="geriatric">Geriatric</option>
              <option value="neurological">Neurological</option>
              <option value="physical_rehabilitation">Physical Rehab</option>
              <option value="pediatric">Pediatric</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Sort patients</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as CaseloadSortId)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm"
            >
              {CASELOAD_SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {loading && <p className="text-gray-400">Loading caseload...</p>}

        {!loading && errorMessage && (
          <p className="text-red-300">Error loading patients: {errorMessage}</p>
        )}

        {!loading && !errorMessage && visiblePatients.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-8 text-center">
            <p className="text-gray-300">No patients match this caseload view.</p>
            <p className="mt-2 text-sm text-gray-500">
              Try another system view or adjust the search and context filters.
            </p>
          </div>
        )}

        {!loading && !errorMessage && visiblePatients.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              {visiblePatients.length} patient{visiblePatients.length === 1 ? "" : "s"}
            </p>

            <details className="relative">
              <summary className="cursor-pointer list-none rounded-lg border border-gray-800 px-3 py-2 text-gray-400 transition hover:border-gray-700 hover:text-gray-200">
                Manage records{selectedCaseIds.length ? ` (${selectedCaseIds.length})` : ""}
              </summary>
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 p-3 shadow-2xl">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCaseIds(allVisibleSelected ? [] : visibleCaseIds)
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                >
                  {allVisibleSelected ? "Clear selection" : "Select visible patients"}
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedCases}
                  disabled={selectedCaseIds.length === 0 || isDeleting}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:text-gray-600"
                >
                  {isDeleting ? "Deleting..." : "Delete selected records"}
                </button>
              </div>
            </details>
          </div>
        )}

        <div className="space-y-4">
          {visiblePatients.map((patient) => (
            <PatientEntryCard
              key={patient.caseRow.id}
              patient={patient}
              isSelected={selectedCaseIds.includes(patient.caseRow.id)}
              onSelectionChange={(checked) => {
                setSelectedCaseIds((currentIds) =>
                  checked
                    ? Array.from(new Set([...currentIds, patient.caseRow.id]))
                    : currentIds.filter((caseId) => caseId !== patient.caseRow.id)
                );
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
