import Link from "next/link";
import { type PatientEntryPreviewSignal } from "./patientEntryPreview";

export type PatientEntryCase = {
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
  } | null;
  goals_preferences: {
    other_target_activity?: string;
  } | null;
  environment: {
    other_safety_hazards?: string;
    other_equipment_present?: string;
  } | null;
};

export type PatientEntryPreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; signals: PatientEntryPreviewSignal[] }
  | { status: "error"; message: string };

type PatientEntryCardProps = {
  caseRow: PatientEntryCase;
  isSelected: boolean;
  previewState: PatientEntryPreviewState;
  isPreviewOpen: boolean;
  onQuickPreviewToggle: () => void;
  onSelectionChange: (checked: boolean) => void;
};

function getDocumentedText(value?: string | null) {
  const trimmedValue = value?.trim();

  return trimmedValue || null;
}

function formatClinicalLabel(value?: string | null) {
  const documentedValue = getDocumentedText(value);

  if (!documentedValue) return null;

  return documentedValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolvePatientIdentity(caseRow: PatientEntryCase) {
  const documentedPatientName = getDocumentedText(
    caseRow.client_info?.client_name
  );
  const caseTitle = getDocumentedText(caseRow.title) || "Unnamed Patient Record";

  if (documentedPatientName) {
    return {
      primaryIdentity: documentedPatientName,
      secondaryIdentity: caseTitle,
    };
  }

  return {
    primaryIdentity: caseTitle,
    secondaryIdentity: "Patient name not documented",
  };
}

function resolveTreatmentFrame(caseRow: PatientEntryCase) {
  const targetActivity = getDocumentedText(
    caseRow.goals_preferences?.other_target_activity
  );

  if (targetActivity) {
    return {
      label: "Treatment frame",
      value: targetActivity,
    };
  }

  const keyBarriers = getDocumentedText(
    caseRow.functional_status?.other_key_barriers
  );

  if (keyBarriers) {
    return {
      label: "Treatment frame",
      value: keyBarriers,
    };
  }

  const caseType = formatClinicalLabel(caseRow.case_classification?.case_type);

  if (caseType) {
    return {
      label: "Treatment frame",
      value: caseType,
    };
  }

  return {
    label: "Treatment frame",
    value: "Treatment frame not documented",
  };
}

function formatRecency(createdAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function PatientEntryQuickPreview({
  previewState,
}: {
  previewState: PatientEntryPreviewState;
}) {
  if (previewState.status === "loading" || previewState.status === "idle") {
    return (
      <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Quick Preview
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Loading current preview signals...
        </p>
      </div>
    );
  }

  if (previewState.status === "error") {
    return (
      <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Quick Preview
        </p>
        <p className="mt-2 text-sm text-amber-200">
          Preview could not be loaded. Open Visit Briefing for full current
          status.
        </p>
      </div>
    );
  }

  if (previewState.signals.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Quick Preview
        </p>
        <p className="mt-2 text-sm text-gray-400">
          No current preview data available yet. Open Visit Briefing for full
          current status.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Quick Preview
      </p>
      <dl className="mt-3 grid gap-3 md:grid-cols-2">
        {previewState.signals.map((signal) => (
          <div key={signal.label}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              {signal.label}
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-200">
              {signal.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PatientEntryCard({
  caseRow,
  isSelected,
  previewState,
  isPreviewOpen,
  onQuickPreviewToggle,
  onSelectionChange,
}: PatientEntryCardProps) {
  const { primaryIdentity, secondaryIdentity } = resolvePatientIdentity(caseRow);
  const treatmentFrame = resolveTreatmentFrame(caseRow);
  const primaryDiagnosis =
    getDocumentedText(caseRow.patient_profile?.primary_diagnosis) ||
    "Diagnosis not documented";
  const supportingContext = caseRow.environment?.other_safety_hazards
    ? `Safety context: ${caseRow.environment.other_safety_hazards}`
    : caseRow.environment?.other_equipment_present
      ? `Equipment context: ${caseRow.environment.other_equipment_present}`
      : "Open the Visit Briefing for current clinical status and next action.";

  return (
    <article className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 transition hover:border-gray-600 hover:bg-gray-900">
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <input
            type="checkbox"
            aria-label={`Select ${primaryIdentity}`}
            checked={isSelected}
            onChange={(event) => onSelectionChange(event.target.checked)}
            onClick={(event) => event.stopPropagation()}
            className="h-4 w-4 rounded border-gray-600 bg-gray-950 text-blue-600"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Patient
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">
                {primaryIdentity}
              </h2>
              <p className="mt-1 truncate text-sm text-gray-400">
                {secondaryIdentity}
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Entry timing
              </p>
              <p className="mt-1 text-sm text-gray-300">
                Created {formatRecency(caseRow.created_at)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-y border-gray-800 py-4 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {treatmentFrame.label}
              </p>
              <p className="mt-2 text-base font-medium leading-6 text-gray-100">
                {treatmentFrame.value}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Clinical context
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {primaryDiagnosis}
              </p>
            </div>
          </div>

          {isPreviewOpen && (
            <PatientEntryQuickPreview previewState={previewState} />
          )}

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-gray-400">{supportingContext}</p>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                aria-expanded={isPreviewOpen}
                onClick={onQuickPreviewToggle}
                className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isPreviewOpen ? "Hide Preview" : "Quick Preview"}
              </button>

              <Link
                href={`/cases/${caseRow.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Open Visit Briefing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
