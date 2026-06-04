"use client";

import Link from "next/link";

type StickyOperationalHeaderProps = {
  title?: string | null;
  workspaceMode: "command" | "reference";
  isViewingHistoricalVersion: boolean;
  snapshotSavedAtLabel?: string | null;
  liveCaseHref: string;
  commandCenterHref: string;
  patientHistoryHref: string;
  onReturnToLiveCase?: () => void;
};

export function StickyOperationalHeader({
  title,
  workspaceMode,
  isViewingHistoricalVersion,
  snapshotSavedAtLabel,
  liveCaseHref,
  commandCenterHref,
  patientHistoryHref,
  onReturnToLiveCase,
}: StickyOperationalHeaderProps) {
  const navItems = [
    { label: "Live Case", href: liveCaseHref, active: false },
    { label: "Command Center", href: commandCenterHref, active: workspaceMode === "command" },
    { label: "Patient History", href: patientHistoryHref, active: workspaceMode === "reference" },
  ];

  return (
    <div className="fixed left-0 right-0 top-[72px] z-[999] border-b border-gray-800 bg-gray-950/95 px-4 py-3 backdrop-blur sm:top-[56px] sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {title || "Untitled Case"}
          </p>

          <p className="truncate text-xs text-gray-400">
            Clinician command center
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <nav
            aria-label="Patient workspace navigation"
            className="flex rounded-xl border border-gray-800 bg-gray-900/80 p-1 text-xs font-semibold text-gray-300"
          >
            {navItems.map((item) => {
              const isLiveReturn = item.label === "Live Case" && isViewingHistoricalVersion && onReturnToLiveCase;
              const className = `rounded-lg px-3 py-1.5 transition ${
                item.active
                  ? "bg-gray-100 text-gray-950"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`;

              return isLiveReturn ? (
                <button key={item.label} type="button" onClick={onReturnToLiveCase} className={className}>
                  {item.label}
                </button>
              ) : (
                <Link key={item.label} href={item.href} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            className={`rounded-full border px-3 py-1 text-right text-[11px] font-medium ${
              isViewingHistoricalVersion
                ? "border-amber-500/70 bg-amber-950/50 text-amber-100"
                : "border-gray-700 bg-gray-900 text-gray-300"
            }`}
          >
            <p>{isViewingHistoricalVersion ? "Historical Snapshot" : "Live Case"}</p>
            {isViewingHistoricalVersion && snapshotSavedAtLabel ? (
              <p className="mt-0.5 text-[10px] font-normal text-amber-200/80">
                Saved {snapshotSavedAtLabel}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
