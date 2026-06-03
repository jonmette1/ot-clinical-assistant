export type CommandCenterDeltaSnapshot = {
  overallTrajectory: string;
  clinicalStatus: string;
  currentFocus: string;
  attentionRequired: string;
  nextAction: string;
  dominantBarrier?: string;
  reassessmentNeed?: string;
};

export type ClinicalImpactSummaryConclusionChange = {
  key: string;
  label: string;
  previous: string;
  current: string;
  reason?: string;
};

export type ClinicalImpactSummaryConfirmedConclusion = {
  key: string;
  label: string;
  current: string;
  reason?: string;
};

export type ClinicalImpactSummary = {
  eventId?: string;
  eventCreatedAt?: string;
  reportedChanges: string[];
  changedConclusions: ClinicalImpactSummaryConclusionChange[];
  confirmedConclusions: ClinicalImpactSummaryConfirmedConclusion[];
  whyItMatters?: string;
  nextAction?: string;
};

type ClinicalImpactSummaryInput = {
  eventId?: string;
  eventCreatedAt?: string;
  reportedChanges: string[];
  previousSnapshot: CommandCenterDeltaSnapshot;
  currentSnapshot: CommandCenterDeltaSnapshot;
};

type SnapshotField = {
  key: keyof CommandCenterDeltaSnapshot;
  label: string;
  changedReason: string;
  confirmedReason: string;
};

const FIELDS_TO_COMPARE: SnapshotField[] = [
  {
    key: "overallTrajectory",
    label: "Overall Trajectory",
    changedReason: "The reported update changed the patient’s longitudinal direction.",
    confirmedReason: "The reported update supports the same overall direction.",
  },
  {
    key: "clinicalStatus",
    label: "Clinical Status",
    changedReason: "The case status changed after the new progression information was applied.",
    confirmedReason: "The plan status remains appropriate for the updated patient picture.",
  },
  {
    key: "currentFocus",
    label: "Current Focus",
    changedReason: "The current treatment focus shifted after the update.",
    confirmedReason: "Current treatment focus still fits the updated patient picture.",
  },
  {
    key: "attentionRequired",
    label: "Attention Required",
    changedReason: "The primary point needing clinician attention changed.",
    confirmedReason: "The same attention point remains clinically important.",
  },
  {
    key: "nextAction",
    label: "Next Action",
    changedReason: "The recommended next step changed after the update.",
    confirmedReason: "No new reassessment or focus shift was triggered.",
  },
  {
    key: "dominantBarrier",
    label: "Dominant Barrier",
    changedReason: "The main limiting factor changed in the updated case picture.",
    confirmedReason: "The same primary barrier continues to shape treatment planning.",
  },
  {
    key: "reassessmentNeed",
    label: "Reassessment Need",
    changedReason: "The reassessment signal changed after the progression check.",
    confirmedReason: "The reassessment signal stayed consistent after the update.",
  },
];

const normalizeComparisonValue = (value: string | undefined): string =>
  (value || "")
    .replace(/\s+/g, " ")
    .trim();

const hasMeaningfulValue = (value: string | undefined): value is string =>
  normalizeComparisonValue(value).length > 0;

const firstChangedLabel = (
  changedConclusions: ClinicalImpactSummaryConclusionChange[]
): string | null => changedConclusions[0]?.label || null;

const buildWhyItMatters = (
  changedConclusions: ClinicalImpactSummaryConclusionChange[]
): string => {
  if (changedConclusions.length === 0) {
    return "The update confirms the current plan/status remains consistent with the latest visit information.";
  }

  const firstLabel = firstChangedLabel(changedConclusions);

  if (changedConclusions.length === 1 && firstLabel) {
    return `${firstLabel} changed, so the clinician should re-orient to the updated Command Center before treatment.`;
  }

  return "Multiple Command Center conclusions changed, so the updated treatment focus and next action should guide today’s visit.";
};

export function buildClinicalImpactSummary({
  eventId,
  eventCreatedAt,
  reportedChanges,
  previousSnapshot,
  currentSnapshot,
}: ClinicalImpactSummaryInput): ClinicalImpactSummary {
  const changedConclusions = FIELDS_TO_COMPARE.flatMap((field) => {
    const previous = normalizeComparisonValue(previousSnapshot[field.key]);
    const current = normalizeComparisonValue(currentSnapshot[field.key]);

    if (!previous || !current || previous === current) return [];

    return [
      {
        key: String(field.key),
        label: field.label,
        previous,
        current,
        reason: field.changedReason,
      },
    ];
  });

  const changedKeys = new Set(changedConclusions.map((change) => change.key));
  const priorityConfirmedKeys: Array<keyof CommandCenterDeltaSnapshot> = [
    "currentFocus",
    "nextAction",
    "clinicalStatus",
    "overallTrajectory",
  ];

  const confirmedConclusions = FIELDS_TO_COMPARE.flatMap((field) => {
    const previous = normalizeComparisonValue(previousSnapshot[field.key]);
    const current = normalizeComparisonValue(currentSnapshot[field.key]);

    if (
      changedKeys.has(String(field.key)) ||
      !priorityConfirmedKeys.includes(field.key) ||
      !hasMeaningfulValue(previous) ||
      !hasMeaningfulValue(current) ||
      previous !== current
    ) {
      return [];
    }

    return [
      {
        key: String(field.key),
        label: field.label,
        current,
        reason: field.confirmedReason,
      },
    ];
  }).slice(0, changedConclusions.length === 0 ? 3 : 2);

  return {
    eventId,
    eventCreatedAt,
    reportedChanges,
    changedConclusions,
    confirmedConclusions,
    whyItMatters: buildWhyItMatters(changedConclusions),
    nextAction:
      normalizeComparisonValue(currentSnapshot.nextAction) ||
      "Continue current treatment focus and monitor for meaningful change at the next visit.",
  };
}
