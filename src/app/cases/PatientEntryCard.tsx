import Link from "next/link";

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

type PatientEntryCardProps = {
  caseRow: PatientEntryCase;
  isSelected: boolean;
  onSelectionChange: (checked: boolean) => void;
};

function formatClinicalLabel(value?: string | null) {
  if (!value) return "Not documented";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

export function PatientEntryCard({
  caseRow,
  isSelected,
  onSelectionChange,
}: PatientEntryCardProps) {
  const patientName = caseRow.client_info?.client_name || "Unnamed patient";
  const caseTitle = caseRow.title || "Untitled case";
  const primaryDiagnosis =
    caseRow.patient_profile?.primary_diagnosis || "Diagnosis not documented";
  const treatmentFrame =
    caseRow.goals_preferences?.other_target_activity ||
    caseRow.functional_status?.other_key_barriers ||
    formatClinicalLabel(caseRow.case_classification?.case_type);
  const supportingContext = caseRow.environment?.other_safety_hazards
    ? `Safety context: ${caseRow.environment.other_safety_hazards}`
    : caseRow.environment?.other_equipment_present
      ? `Equipment context: ${caseRow.environment.other_equipment_present}`
      : "Open the Command Center for current clinical status and next action.";

  return (
    <article className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 transition hover:border-gray-600 hover:bg-gray-900">
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <input
            type="checkbox"
            aria-label={`Select ${patientName}`}
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
                {patientName}
              </h2>
              <p className="mt-1 truncate text-sm text-gray-400">{caseTitle}</p>
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
                Treatment frame
              </p>
              <p className="mt-2 text-base font-medium leading-6 text-gray-100">
                {treatmentFrame}
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

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-gray-400">{supportingContext}</p>

            <Link
              href={`/cases/${caseRow.id}`}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Open Command Center
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
