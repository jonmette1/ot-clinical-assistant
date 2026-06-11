"use client";

import Link from "next/link";

type StickyOperationalHeaderProps = {
  title?: string | null;
  workspaceMode: "command" | "reference";
  isViewingHistoricalVersion: boolean;
  snapshotSavedAtLabel?: string | null;
  visitBriefingHref: string;
  caseDetailsHref: string;
  onUpdatePatientStatus: () => void;
  onReturnToLiveCase?: () => void;
};

export function StickyOperationalHeader({
  title,
  workspaceMode,
  isViewingHistoricalVersion,
  snapshotSavedAtLabel,
  visitBriefingHref,
  caseDetailsHref,
  onUpdatePatientStatus,
  onReturnToLiveCase,
}: StickyOperationalHeaderProps) {
  const navLinkClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 transition ${
      active
        ? "bg-gray-100 text-gray-950"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="fixed left-0 right-0 top-[72px] z-[999] border-b border-gray-800 bg-gray-950/95 px-4 py-2 backdrop-blur sm:top-[56px] sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:gap-3">
        <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {title || "Unnamed Patient Record"}
            </p>

            <p className="truncate text-xs text-gray-400">
              Patient workspace
            </p>
          </div>

          <nav
            aria-label="Patient workspace navigation"
            className="flex w-full overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/80 p-1 text-xs font-semibold text-gray-300 sm:w-auto"
          >
            <Link href={visitBriefingHref} className={navLinkClass(workspaceMode === "command")}>
              Visit Briefing
            </Link>
            <button
              type="button"
              onClick={onUpdatePatientStatus}
              className="rounded-lg px-3 py-1.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              Update Patient Status
            </button>
            <Link href={caseDetailsHref} className={navLinkClass(workspaceMode === "reference")}>
              Case Details
            </Link>
          </nav>
        </div>

        {isViewingHistoricalVersion && (
          <div className="flex flex-col gap-3 rounded-xl border border-amber-500/60 bg-amber-950/50 px-3 py-2 text-xs text-amber-50 shadow-sm shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-amber-200/90">
                Viewing Historical Snapshot
              </p>
              <p className="mt-1 text-amber-100/85">
                This read-only snapshot may not reflect current patient status
                {snapshotSavedAtLabel ? ` · Saved ${snapshotSavedAtLabel}` : ""}.
              </p>
            </div>
            {onReturnToLiveCase ? (
              <button
                type="button"
                onClick={onReturnToLiveCase}
                className="shrink-0 rounded-lg border border-amber-300/60 px-3 py-2 text-xs font-semibold text-amber-50 transition hover:bg-amber-900/50"
              >
                Return to Current Patient
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
