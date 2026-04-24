"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CaseRow = {
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
    subcategory?: string;
  } | null;
    functional_status: {
    other_key_barriers?: string;
  } | null;
  goals_preferences: {
    other_target_activity?: string;
  } | null;
  environment: {
    other_safety_hazards?: string;
    other_equipment_present?: string;
  } | null;
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

const [searchTerm, setSearchTerm] = useState("");
const [selectedCaseType, setSelectedCaseType] = useState("all");
const [selectedSubcategory, setSelectedSubcategory] = useState("all");
const [sortOrder, setSortOrder] = useState("newest");
const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
const [isDeleting, setIsDeleting] = useState(false);  

  useEffect(() => {
    async function loadCases() {
      const { data, error } = await supabase
        .from("cases")
        .select("id, title, created_at, patient_profile, client_info, case_classification, functional_status, goals_preferences, environment")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message || "Failed to load cases.");
      } else {
        setCases((data as CaseRow[]) || []);
      }

      setLoading(false);
    }

    loadCases();
  }, []);

  async function deleteSelectedCases() {
    if (selectedCaseIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedCaseIds.length} selected case(s)? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("cases")
      .delete()
      .in("id", selectedCaseIds);

    if (error) {
      setErrorMessage(error.message || "Failed to delete selected cases.");
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
      c.case_classification?.subcategory?.toLowerCase().includes(search) ||
      c.functional_status?.other_key_barriers?.toLowerCase().includes(search) ||
      c.goals_preferences?.other_target_activity?.toLowerCase().includes(search) ||
      c.environment?.other_safety_hazards?.toLowerCase().includes(search) ||
      c.environment?.other_equipment_present?.toLowerCase().includes(search);

    const matchesCaseType =
      selectedCaseType === "all" ||
      c.case_classification?.case_type === selectedCaseType;

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      c.case_classification?.subcategory === selectedSubcategory;

    return matchesSearch && matchesCaseType && matchesSubcategory;
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
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Saved Cases</h1>

        <div className="grid gap-3 md:grid-cols-4 mb-6">
  <input
    type="text"
    placeholder="Search client or diagnosis"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-sm"
  />

  <select
    value={selectedCaseType}
    onChange={(e) => setSelectedCaseType(e.target.value)}
    className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-sm"
  >
    <option value="all">All Case Types</option>
    <option value="geriatric">Geriatric</option>
    <option value="neurological">Neurological</option>
    <option value="physical_rehabilitation">Physical Rehab</option>
    <option value="pediatric">Pediatric</option>
  </select>

  <select
    value={selectedSubcategory}
    onChange={(e) => setSelectedSubcategory(e.target.value)}
    className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-sm"
  >
    <option value="all">All Subcategories</option>
    <option value="fall_prevention">Fall Prevention</option>
    <option value="home_modification">Home Modification</option>
    <option value="memory_support">Memory Support</option>
    <option value="bathing_safety">Bathing Safety</option>
    <option value="dressing_independence">Dressing Independence</option>
  </select>

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-sm"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>
</div>

        {loading && <p className="text-gray-400">Loading cases...</p>}

        {!loading && errorMessage && (
          <p className="text-red-400">Error loading cases: {errorMessage}</p>
        )}

        {!loading && !errorMessage && filteredCases.length === 0 && (
          <p className="text-gray-400">No cases yet.</p>
        )}

        {!loading && !errorMessage && filteredCases.length > 0 && (
<div className="mb-4 flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
  <p className="text-sm text-gray-300">
    {selectedCaseIds.length} selected
  </p>

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
            <div
              key={c.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-blue-500 transition"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedCaseIds.includes(c.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCaseIds((prev) => [...prev, c.id]);
                    } else {
                      setSelectedCaseIds((prev) =>
                        prev.filter((id) => id !== c.id)
                      );
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-950 text-blue-600"
                />

                <Link
                  href={`/cases/${c.id}`}
                  className="block flex-1"
                >
                  <h2 className="text-lg font-semibold">
                    {c.title || "Untitled Case"}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {new Date(c.created_at).toLocaleString()}
                  </p>

                  <div className="text-sm mt-2 space-y-1">
                    <p>{c.patient_profile?.primary_diagnosis || "No diagnosis"}</p>
                    <p className="text-gray-400">
                      Client: {c.client_info?.client_name || "Unnamed client"}
                    </p>
                    <p className="text-gray-400">
                      Type: {c.case_classification?.case_type || "—"} | Subcategory:{" "}
                      {c.case_classification?.subcategory || "—"}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}