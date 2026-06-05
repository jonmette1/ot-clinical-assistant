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
  if (!promptVersion) return "Saved Clinical Snapshot";

  if (promptVersion.includes("manual-snapshot")) {
    return "Clinical Snapshot";
  }

  if (promptVersion.includes("continuity-save")) {
    return "Saved After Case Edit";
  }

  if (promptVersion.includes("regenerated")) {
    return "Refreshed Clinical Guidance";
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

  return "Saved Clinical Snapshot";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readUnknown = (source: unknown, keys: string[]): unknown => {
  if (!isRecord(source)) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
};

const readText = (source: unknown, keys: string[]): string | null => {
  const value = readUnknown(source, keys);

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

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

const formatVisitSnapshotDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const getNestedRecord = (source: unknown, keys: string[]): Record<string, unknown> | null => {
  const value = readUnknown(source, keys);
  return isRecord(value) ? value : null;
};

const getVisitSnapshotContext = (generation: HistoricalSnapshotGeneration) => {
  const output = generation.output_payload;
  const input = generation.input_payload;
  const operationalPrioritization = getNestedRecord(output, ["operational_prioritization", "operationalPrioritization"]);
  const progressionState = getNestedRecord(output, ["progression_state", "progressionState"]);
  const structuredPlanDetails = getNestedRecord(output, ["structured_plan_details", "structuredPlanDetails"]);
  const clinicalDecisionModel = getNestedRecord(output, ["clinicalDecisionModelUsed", "clinical_decision_model_used"]);
  const currentLongitudinalState =
    getNestedRecord(input, ["current_longitudinal_state", "currentLongitudinalState"]) ||
    getNestedRecord(output, ["current_longitudinal_state", "currentLongitudinalState"]);
  const clinicalAttentionState =
    getNestedRecord(input, ["clinical_attention_state", "clinicalAttentionState"]) ||
    getNestedRecord(output, ["clinical_attention_state", "clinicalAttentionState"]);
  const eventPayload = getNestedRecord(input, ["event_payload", "eventPayload"]);

  const visitStatus =
    readText(currentLongitudinalState, ["progressionStatus", "progression_status"]) ||
    readText(clinicalAttentionState, ["progressionStatus", "progression_status"]) ||
    readText(eventPayload, ["progressionStatus", "progression_status"]) ||
    readText(progressionState, ["progressionStatus", "progression_status"]) ||
    readText(output, ["progressionStatus", "progression_status"]) ||
    readText(input, ["progressionStatus", "progression_status"]) ||
    readText(progressionState, ["advancementReadiness", "advancement_readiness"]) ||
    readText(progressionState, ["currentPhase", "current_phase"]) ||
    readText(output, ["focusApplied", "focus_applied"]) ||
    getSnapshotTypeLabel(generation.prompt_version);

  const clinicalReality =
    readText(operationalPrioritization, ["currentOperationalEmphasis", "current_operational_emphasis"]) ||
    readText(output, ["patientSnapshot", "patient_snapshot"]) ||
    readText(clinicalDecisionModel, ["dominantBarrier", "dominant_barrier"]) ||
    readTextList(output, ["clinicalPriorities", "clinical_priorities"])[0] ||
    getSnapshotReasonLabel(generation.prompt_version);

  const recommendedNextAction =
    readTextList(structuredPlanDetails, ["immediateActions", "immediate_actions"])[0] ||
    readTextList(output, ["firstSessionPriorities", "first_session_priorities"])[0] ||
    readTextList(output, ["sessionPlan", "session_plan"])[0] ||
    readTextList(output, ["taskBreakdown", "task_breakdown"])[0] ||
    "Open snapshot preview for full clinical context.";

  return {
    visitStatus,
    clinicalReality,
    recommendedNextAction,
  };
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

  const getVisitNumber = (generationId: string) =>
    orderedGenerations.length - orderedGenerations.findIndex((g) => g.id === generationId);

  return (
    <details className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Visit History</h2>
          <p className="mt-1 text-sm text-gray-400">Prior clinical snapshots, preview, restore, and delete controls.</p>
        </div>
        <span className="text-xs tracking-wide text-gray-300">Show</span>
      </summary>

      <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Saved Visit Snapshots</h3>
          <p className="mt-1 text-xs text-gray-500">
            Showing the 5 most recent saved clinical snapshots.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleShowAllVersions}
          className="text-xs text-blue-400 hover:underline"
        >
          {showAllVersions ? "Show fewer visits" : "Show all visits"}
        </button>
      </div>

     {generations.length === 0 ? (
      <p className="text-sm text-gray-400">No saved clinical snapshots yet.</p>
    ) : (
      <ul className="space-y-3 text-sm text-gray-300">
      {visibleGenerations.map((generation) => {
        const snapshotContext = getVisitSnapshotContext(generation);
        const isActivePlan = currentGenerationId === generation.id;
        const isCurrentlyViewingSnapshot = selectedGeneration?.id === generation.id && !isActivePlan;

        return (
          <li
            key={generation.id}
    className={`rounded-lg px-4 py-3 transition ${
    isActivePlan
      ? "border-2 border-green-500 bg-green-900/30 shadow-[0_0_0_1px_rgba(34,197,94,0.35)]"
        : isCurrentlyViewingSnapshot
      ? "border-2 border-blue-400 bg-blue-950/40"
        : "border border-gray-800 hover:border-blue-500"
    }`}
          >
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => onSelectGeneration(generation)}
                disabled={isCurrentlyViewingSnapshot}
                aria-current={isCurrentlyViewingSnapshot ? "true" : undefined}
                className="text-left flex-1 disabled:cursor-default"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-base text-white">Visit {getVisitNumber(generation.id)}</strong>

                  {isActivePlan && (
      <span className="rounded-full border border-green-400 bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Active Plan
      </span>
    )}

                  {isCurrentlyViewingSnapshot && (
                    <span className="rounded-full border border-blue-700 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">
                      Currently Viewing
                    </span>
                  )}

                  <span className="text-xs text-gray-500">
                    {formatVisitSnapshotDate(generation.created_at)}
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-xs leading-relaxed text-gray-400">
                  <div>
                    <p className="font-semibold uppercase tracking-[0.16em] text-gray-500">Visit Status</p>
                    <p className="mt-1 text-sm text-gray-200">{snapshotContext.visitStatus}</p>
                  </div>

                  <div>
                    <p className="font-semibold uppercase tracking-[0.16em] text-gray-500">Clinical Reality</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-200">{snapshotContext.clinicalReality}</p>
                  </div>

                  <div>
                    <p className="font-semibold uppercase tracking-[0.16em] text-gray-500">Recommended Next Action</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-200">{snapshotContext.recommendedNextAction}</p>
                  </div>
                </div>
              </button>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => onSelectGeneration(generation)}
                  disabled={isActivePlan || isCurrentlyViewingSnapshot}
                  className="rounded-lg border border-blue-500/50 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:border-blue-300 hover:text-white disabled:cursor-default disabled:border-gray-700 disabled:text-gray-400 disabled:hover:border-gray-700 disabled:hover:text-gray-400"
                >
                  {isActivePlan ? "Current Plan" : isCurrentlyViewingSnapshot ? "Currently Viewing" : "View Snapshot"}
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

            </div>
          </li>
        );
      })}
      </ul>
    )}
    </div>

    {selectedGeneration &&
      currentGenerationId !== selectedGeneration.id &&
      Boolean(selectedGeneration.output_payload) && (
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-blue-800 bg-gray-900 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
    <h2 className="text-2xl font-semibold">
      Visit Snapshot Preview
    </h2>

    <p className="text-sm text-gray-400 mt-1">
      Saved {new Date(selectedGeneration.created_at).toLocaleString()}. This is a read-only historical reference and may not reflect current progression updates.
    </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRestoreSelectedVersion}
                disabled={isRestoringVersion}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isRestoringVersion ? "Restoring..." : "Restore as Live Case"}
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
            Restoring this snapshot will replace the live case with this saved version.
          </p>
        </div>
      </div>
    )}
    </details>
  );
}
