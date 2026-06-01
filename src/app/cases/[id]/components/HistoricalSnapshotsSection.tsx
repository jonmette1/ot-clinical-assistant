"use client";

type HistoricalSnapshotInputPayload = Record<string, unknown> & {
  client_info?: {
    client_name?: string;
  } | null;
  caregiver_info?: {
    caregiver_name?: string;
  } | null;
  clinician_notes?: string | null;
};

type HistoricalSnapshotGeneration = {
  id: string;
  created_at: string;
  prompt_version: string | null;
  input_payload: HistoricalSnapshotInputPayload;
  output_payload: unknown | null;
};

type HistoricalSnapshotsSectionProps = {
  generations: HistoricalSnapshotGeneration[];
  currentGenerationId: string | null;
  selectedGeneration: HistoricalSnapshotGeneration | null;
  showAllVersions: boolean;
  isRestoringVersion: boolean;
  onToggleShowAllVersions: () => void;
  onSelectGeneration: (generation: HistoricalSnapshotGeneration) => void;
  onDeleteGeneration: (generationId: string) => void;
  onRestoreSelectedVersion: () => void;
  onClosePreview: () => void;
};

const getSnapshotTypeLabel = (promptVersion?: string | null) => {
  if (!promptVersion) return "Saved Plan Snapshot";

  if (promptVersion.includes("manual-snapshot")) {
    return "Manual Snapshot";
  }

  if (promptVersion.includes("continuity-save")) {
    return "Saved After Case Edit";
  }

  if (promptVersion.includes("regenerated")) {
    return "Regenerated Plan";
  }

  if (promptVersion.includes("transfers_mobility")) {
    return "Transfers & Mobility Focus";
  }

  if (promptVersion.includes("caregiver_training")) {
    return "Caregiver Training Focus";
  }

  if (promptVersion.includes("adl_home_safety")) {
    return "ADL / Home Safety Focus";
  }

  return "Saved Plan Snapshot";
};

const getSnapshotReasonLabel = (promptVersion?: string | null) => {
  if (!promptVersion) return "Saved clinical reasoning snapshot.";

  if (promptVersion.includes("manual-snapshot")) {
    return "Clinician saved the current plan state.";
  }

  if (promptVersion.includes("continuity-save")) {
    return "Case information was edited; snapshot preserved for continuity.";
  }

  if (promptVersion.includes("regenerated")) {
    return "Plan was regenerated from the current case information.";
  }

  if (promptVersion.includes("transfers_mobility")) {
    return "Plan was generated with transfers and mobility emphasized.";
  }

  if (promptVersion.includes("caregiver_training")) {
    return "Plan was generated with caregiver training emphasized.";
  }

  if (promptVersion.includes("adl_home_safety")) {
    return "Plan was generated with ADL and home safety emphasized.";
  }

  return "Saved clinical reasoning snapshot.";
};

export function HistoricalSnapshotsSection({
  generations,
  currentGenerationId,
  selectedGeneration,
  showAllVersions,
  isRestoringVersion,
  onToggleShowAllVersions,
  onSelectGeneration,
  onDeleteGeneration,
  onRestoreSelectedVersion,
  onClosePreview,
}: HistoricalSnapshotsSectionProps) {
  const orderedGenerations = [...generations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const visibleGenerations = showAllVersions
    ? orderedGenerations
    : orderedGenerations.slice(0, 5);

  const getVersionNumber = (generationId: string) =>
    orderedGenerations.findIndex((g) => g.id === generationId) + 1;

  return (
    <details className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Historical Snapshots</h2>
          <p className="mt-1 text-sm text-gray-400">Saved plans, preview, restore, and delete controls.</p>
        </div>
        <span className="text-xs tracking-wide text-gray-300">Show</span>
      </summary>

      <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Clinical Plan History</h3>
      <button
      type="button"
      onClick={onToggleShowAllVersions}
      className="text-xs text-blue-400 hover:underline mb-3"
    >
      {showAllVersions ? "Show fewer versions" : "Show all versions"}
    </button>
      <p className="text-xs text-gray-500 mb-4">
     Showing the 5 most recent saved clinical snapshots.
    </p>

     {generations.length === 0 ? (
      <p className="text-sm text-gray-400">No saved clinical snapshots yet.</p>
    ) : (
      <ul className="space-y-3 text-sm text-gray-300">
      {visibleGenerations.map((generation) => (
          <li
            key={generation.id}
    className={`rounded-lg px-4 py-3 transition ${
    currentGenerationId === generation.id
      ? "border-2 border-green-500 bg-green-900/30 shadow-[0_0_0_1px_rgba(34,197,94,0.35)]"
        : selectedGeneration?.id === generation.id
      ? "border-2 border-blue-400 bg-blue-950/40"
        : "border border-gray-800 hover:border-blue-500"
    }`}
          >
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectGeneration(generation)}
                className="text-left flex-1"
              >
                <p className="flex items-center gap-2">
                  <strong>Version {getVersionNumber(generation.id)}:</strong>

                  {currentGenerationId === generation.id && (
      <span className="rounded-full border border-green-400 bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Active Plan
      </span>
    )}

                  {selectedGeneration?.id === generation.id && (
                    <span className="rounded-full border border-blue-700 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">
                      Viewing
                    </span>
                  )}

                  <span>
                     {getSnapshotTypeLabel(generation.prompt_version)}
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
    <p className="mt-2 text-xs text-gray-500">
      {getSnapshotReasonLabel(generation.prompt_version)}
    </p>
                <p className="text-gray-400">
                  {new Date(generation.created_at).toLocaleString()}
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-400">
      <p>
        <strong>Client:</strong>{" "}
        {generation.input_payload?.client_info?.client_name || "—"}
      </p>

      <p>
        <strong>Caregiver:</strong>{" "}
        {generation.input_payload?.caregiver_info?.caregiver_name || "—"}
      </p>

      <p className="line-clamp-2">
        <strong>Notes:</strong>{" "}
        {generation.input_payload?.clinician_notes || "—"}
      </p>
    </div>
              </button>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteGeneration(generation.id);
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

    {selectedGeneration && Boolean(selectedGeneration.output_payload) && (
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-blue-800 bg-gray-900 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
    <h2 className="text-2xl font-semibold">
      Previewing Prior Clinical Plan
    </h2>

    <p className="text-sm text-gray-400 mt-1">
      This is a read-only saved snapshot from{" "}
      {new Date(selectedGeneration.created_at).toLocaleString()}.
    </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRestoreSelectedVersion}
                disabled={isRestoringVersion}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isRestoringVersion ? "Restoring..." : "Make Current Plan"}
              </button>

              <button
                type="button"
                onClick={onClosePreview}
                className="text-sm text-blue-400 underline"
              >
                Close preview
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Making this version the current plan will replace the live plan with this saved version.
          </p>
        </div>
      </div>
    )}
    </details>
  );
}
