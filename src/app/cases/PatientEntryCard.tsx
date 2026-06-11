import Link from "next/link";
import type { CaseloadStatus, PatientCaseloadSummary } from "./patientCaseload";

export type PatientEntryCase = PatientCaseloadSummary["caseRow"];

type PatientEntryCardProps = {
  patient: PatientCaseloadSummary;
  isSelected: boolean;
  onSelectionChange: (checked: boolean) => void;
};

const STATUS_STYLES: Record<CaseloadStatus, string> = {
  "Safety Concern": "border-red-800/70 bg-red-950/45 text-red-200",
  "Needs Attention": "border-amber-700/70 bg-amber-950/35 text-amber-200",
  "Reassessment Due": "border-orange-700/70 bg-orange-950/30 text-orange-200",
  "Monitor Closely": "border-yellow-700/60 bg-yellow-950/25 text-yellow-100",
  Progressing: "border-emerald-800/70 bg-emerald-950/30 text-emerald-200",
  Stable: "border-gray-700 bg-gray-800/70 text-gray-300",
};

export function PatientEntryCard({
  patient,
  isSelected,
  onSelectionChange,
}: PatientEntryCardProps) {
  return (
    <article className="group rounded-2xl border border-gray-800 bg-gray-900/75 p-5 transition hover:border-gray-700 hover:bg-gray-900">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          aria-label={`Select ${patient.patientName}`}
          checked={isSelected}
          onChange={(event) => onSelectionChange(event.target.checked)}
          className="mt-1.5 h-4 w-4 shrink-0 accent-gray-400 opacity-60 transition group-hover:opacity-100 focus:opacity-100"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                {patient.patientName}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                {patient.clinicalContext}
              </p>
            </div>

            <span
              className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[patient.status]}`}
            >
              {patient.status}
            </span>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-gray-800 pt-4 md:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Current Focus
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-gray-200">
                {patient.currentFocus}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Recent Change
              </dt>
              <dd
                className={`mt-1.5 text-sm leading-6 ${
                  patient.hasMeaningfulRecentChange ? "text-gray-200" : "text-gray-500"
                }`}
              >
                {patient.recentChange}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex justify-end">
            <Link
              href={`/cases/${patient.caseRow.id}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Open Patient
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
