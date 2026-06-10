export type ConclusionType =
  | "current_focus"
  | "attention_required"
  | "next_action";

export type ClinicalEvidence = {
  evidenceLabel: string;
  sourceContext: string;
  observedMeaning: string;
  clinicalRelevance: string;
  observedAt?: string;
  confidence?: "strong" | "moderate" | "limited";
  rawSource?: {
    sourceType: string;
    field?: string;
    value?: unknown;
  };
};

export type ConclusionEvidence = {
  conclusionType: ConclusionType;
  conclusion: string;
  evidence: ClinicalEvidence[];
};

type BuildConclusionEvidenceInput = {
  conclusionType: ConclusionType;
  conclusion: string;
  caseData?: unknown;
  clinicalDecisionModel?: unknown;
  progressionState?: unknown;
  continuityInterpretation?: unknown;
  longitudinalState?: unknown;
  visitHistory?: unknown;
};

type EvidenceCategory =
  | "functional"
  | "safety"
  | "caregiver"
  | "environment"
  | "change"
  | "progression"
  | "barrier"
  | "reassessment"
  | "target";

type EvidenceCandidate = ClinicalEvidence & {
  category: EvidenceCategory;
  priority: number;
};

const ASSISTANCE_LABELS: Record<string, string> = {
  "1": "total assistance",
  "2": "maximal assistance",
  "3": "moderate assistance",
  "4": "minimal assistance",
  "5": "supervision",
  "6": "modified independence",
  "7": "total independence",
};

const CONCLUSION_WEIGHTS: Record<ConclusionType, Partial<Record<EvidenceCategory, number>>> = {
  current_focus: {
    functional: 30,
    target: 25,
    barrier: 20,
    safety: 15,
    change: 10,
  },
  attention_required: {
    safety: 35,
    reassessment: 30,
    change: 25,
    caregiver: 20,
    environment: 15,
    functional: 10,
  },
  next_action: {
    safety: 35,
    reassessment: 30,
    progression: 25,
    change: 20,
    functional: 15,
    caregiver: 10,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPath(source: unknown, path: string[]): unknown {
  let current = source;

  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }

  return current;
}

function readFirst(source: unknown, paths: string[][]): unknown {
  for (const path of paths) {
    const value = readPath(source, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function asTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(asText)
      .filter((item): item is string => Boolean(item));
  }

  const text = asText(value);
  return text ? [text] : [];
}

function sentence(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function clinicianText(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string): string {
  return clinicianText(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isConclusionRestatement(evidence: ClinicalEvidence, conclusion: string): boolean {
  const normalizedConclusion = normalize(conclusion);
  if (!normalizedConclusion) return false;

  return [evidence.evidenceLabel, evidence.observedMeaning, evidence.clinicalRelevance]
    .map(normalize)
    .some(
      (text) =>
        text === normalizedConclusion ||
        (text.length > 28 && normalizedConclusion.includes(text)) ||
        (normalizedConclusion.length > 28 && text.includes(normalizedConclusion))
    );
}

function latestVisitRecords(visitHistory: unknown): Record<string, unknown>[] {
  const records = Array.isArray(visitHistory)
    ? visitHistory.filter(isRecord)
    : isRecord(visitHistory)
      ? [visitHistory]
      : [];

  return [...records].sort((left, right) => {
    const leftDate = Date.parse(asText(left.created_at) || asText(left.createdAt) || "") || 0;
    const rightDate = Date.parse(asText(right.created_at) || asText(right.createdAt) || "") || 0;
    return rightDate - leftDate;
  });
}

function collectVisitSignal(record: Record<string, unknown> | undefined, keys: string[]): string[] {
  if (!record) return [];

  const sources = [
    record,
    readFirst(record, [["event_payload"], ["eventPayload"]]),
    readFirst(record, [["current_state_snapshot"], ["currentStateSnapshot"]]),
    readFirst(record, [["clinical_attention_snapshot"], ["clinicalAttentionSnapshot"]]),
  ];

  return sources.flatMap((source) =>
    keys.flatMap((key) => asTextList(readFirst(source, [[key]])))
  );
}

function formatObservedAt(value: unknown): string | undefined {
  const text = asText(value);
  if (!text) return undefined;
  return Number.isNaN(Date.parse(text)) ? text : new Date(text).toISOString();
}

function buildCandidates(input: BuildConclusionEvidenceInput): EvidenceCandidate[] {
  const candidates: EvidenceCandidate[] = [];
  const add = (candidate: EvidenceCandidate | null) => {
    if (candidate) candidates.push(candidate);
  };

  const visits = latestVisitRecords(input.visitHistory);
  const latestVisit = visits[0];
  const latestObservedAt = formatObservedAt(
    latestVisit?.created_at ||
      latestVisit?.createdAt ||
      readFirst(input.longitudinalState, [["lastUpdatedAt"], ["last_updated_at"]])
  );

  const recentChanges = [
    ...asTextList(
      readFirst(input.longitudinalState, [["functionalChanges"], ["functional_changes"]])
    ),
    ...collectVisitSignal(latestVisit, ["functionalChanges", "functional_changes"]),
  ].filter((value, index, values) => values.indexOf(value) === index);

  const safetyChange = recentChanges.find((change) =>
    /\b(fall|near fall|unsafe|injur|loss of balance|declin|regress|increased assist|more assist)\b/i.test(
      change
    )
  );

  if (safetyChange) {
    add({
      category: "safety",
      priority: 120,
      evidenceLabel: "Recent safety change",
      sourceContext: "Most recent Patient Status update",
      observedMeaning: sentence(clinicianText(safetyChange)),
      clinicalRelevance:
        "A recent safety change increases the need to verify current performance before progressing the plan.",
      observedAt: latestObservedAt,
      confidence: "strong",
      rawSource: {
        sourceType: "longitudinal_update",
        field: "functionalChanges",
        value: safetyChange,
      },
    });
  }

  const recentFalls = asText(
    readFirst(input.caseData, [
      ["functional_status", "general_mobility_summary", "recent_falls"],
      ["functionalStatus", "generalMobilitySummary", "recentFalls"],
      ["environment", "general_mobility", "recent_falls"],
      ["environment", "generalMobility", "recentFalls"],
    ])
  );

  if (recentFalls && /^(yes|true|near falls?|near_falls)$/i.test(recentFalls)) {
    const nearFalls = /near/i.test(recentFalls);
    add({
      category: "safety",
      priority: 110,
      evidenceLabel: nearFalls ? "Near-fall history" : "Recent fall history",
      sourceContext: "Functional mobility assessment",
      observedMeaning: nearFalls
        ? "Near-falls have been reported during recent mobility."
        : "Recent fall history remains documented.",
      clinicalRelevance:
        "This continues to elevate safety monitoring needs during functional activity and transfers.",
      confidence: "strong",
      rawSource: {
        sourceType: "case_data",
        field: "functional_status.general_mobility_summary.recent_falls",
        value: recentFalls,
      },
    });
  }

  const transferPaths = [
    ["bed_transfer", "Bed transfer"],
    ["toilet_transfer", "Toilet transfer"],
    ["shower_transfer", "Shower transfer"],
  ] as const;
  const transferLevels = transferPaths
    .map(([field, label]) => {
      const value = asText(
        readFirst(input.caseData, [
          ["functional_status", "adl_assist_levels", field],
          ["functionalStatus", "adlAssistLevels", field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())],
        ])
      );
      const numericLevel = value && /^\d$/.test(value) ? Number(value) : null;
      return value ? { field, label, value, numericLevel } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((left, right) => (left.numericLevel ?? 99) - (right.numericLevel ?? 99));

  const primaryTransfer = transferLevels[0];
  if (primaryTransfer) {
    const levelMeaning = ASSISTANCE_LABELS[primaryTransfer.value] || clinicianText(primaryTransfer.value);
    add({
      category: "functional",
      priority: 95,
      evidenceLabel: `${primaryTransfer.label} assistance`,
      sourceContext: "Current functional assessment",
      observedMeaning: `${primaryTransfer.label} currently requires ${levelMeaning}.`,
      clinicalRelevance:
        "The highest documented transfer assistance need identifies where safety and functional effort remain most constrained.",
      confidence: "strong",
      rawSource: {
        sourceType: "case_data",
        field: `functional_status.adl_assist_levels.${primaryTransfer.field}`,
        value: primaryTransfer.value,
      },
    });
  } else {
    const assistanceLevel = asText(
      readFirst(input.caseData, [
        ["functional_status", "current_assistance_level"],
        ["functionalStatus", "currentAssistanceLevel"],
      ])
    );
    if (assistanceLevel) {
      const levelMeaning = ASSISTANCE_LABELS[assistanceLevel] || clinicianText(assistanceLevel);
      add({
        category: "functional",
        priority: 90,
        evidenceLabel: "Current assistance need",
        sourceContext: "Current functional assessment",
        observedMeaning: `The primary activity currently requires ${levelMeaning}.`,
        clinicalRelevance:
          "The documented assistance level shows the patient’s present functional support requirement.",
        confidence: "strong",
        rawSource: {
          sourceType: "case_data",
          field: "functional_status.current_assistance_level",
          value: assistanceLevel,
        },
      });
    }
  }

  const caregiverConfidence = asText(
    readFirst(input.caseData, [
      ["caregiver_info", "confidence"],
      ["caregiverInfo", "confidence"],
      ["caregiverSupport", "confidence"],
    ])
  );
  if (caregiverConfidence && /low|not confident|uncertain/i.test(caregiverConfidence)) {
    add({
      category: "caregiver",
      priority: 88,
      evidenceLabel: "Caregiver confidence",
      sourceContext: "Caregiver support assessment",
      observedMeaning: "Caregiver confidence remains low during required support.",
      clinicalRelevance:
        "Low confidence may limit safe carryover and increases the importance of clear training and supported practice.",
      confidence: "strong",
      rawSource: {
        sourceType: "case_data",
        field: "caregiver_info.confidence",
        value: caregiverConfidence,
      },
    });
  }

  const hazards = asTextList(
    readFirst(input.caseData, [
      ["environment", "safety_hazards"],
      ["environment", "safetyHazards"],
      ["environment", "bathroom", "safety_hazards"],
      ["environment", "bathroom", "safetyHazards"],
    ])
  );
  if (hazards.length) {
    const displayedHazards = hazards.slice(0, 2).map(clinicianText);
    add({
      category: "environment",
      priority: 82,
      evidenceLabel: "Environmental safety barriers",
      sourceContext: "Home environment assessment",
      observedMeaning: sentence(`Documented barriers include ${displayedHazards.join(" and ")}`),
      clinicalRelevance:
        "These barriers can increase task demand and reduce the safety of functional performance in the home.",
      confidence: "strong",
      rawSource: {
        sourceType: "case_data",
        field: "environment.safety_hazards",
        value: hazards,
      },
    });
  }

  const targetActivity = asTextList(
    readFirst(input.caseData, [["target_activities"], ["targetActivities"]])
  )[0];
  if (targetActivity) {
    add({
      category: "target",
      priority: 85,
      evidenceLabel: "Primary treatment activity",
      sourceContext: "Patient goal and treatment intake",
      observedMeaning: `${clinicianText(targetActivity)} is the current target activity.`,
      clinicalRelevance:
        "This activity anchors the functional context for the maintained conclusion.",
      confidence: "strong",
      rawSource: {
        sourceType: "case_data",
        field: "target_activities",
        value: targetActivity,
      },
    });
  }

  const activeBarriers = asTextList(
    readFirst(input.progressionState, [["activeBarriers"], ["active_barriers"]])
  );
  const dominantBarrier = asText(
    readFirst(input.clinicalDecisionModel, [["dominantBarrier"], ["dominant_barrier"]])
  );
  const barrier = activeBarriers[0] || dominantBarrier;
  if (barrier) {
    add({
      category: "barrier",
      priority: 80,
      evidenceLabel: "Active limiting factor",
      sourceContext: activeBarriers[0] ? "Current progression state" : "Clinical decision model",
      observedMeaning: sentence(`${clinicianText(barrier)} remains active`),
      clinicalRelevance:
        "This is a documented constraint on safe or reliable task performance.",
      confidence: activeBarriers[0] ? "strong" : "moderate",
      rawSource: {
        sourceType: activeBarriers[0] ? "progression_state" : "clinical_decision_model",
        field: activeBarriers[0] ? "activeBarriers" : "dominantBarrier",
        value: barrier,
      },
    });
  }

  const reassessmentTriggers = [
    ...asTextList(
      readFirst(input.progressionState, [["reassessmentTriggers"], ["reassessment_triggers"]])
    ),
    ...asTextList(
      readFirst(input.continuityInterpretation, [["continuityAlerts"], ["continuity_alerts"]])
    ),
  ];
  if (reassessmentTriggers[0]) {
    add({
      category: "reassessment",
      priority: 100,
      evidenceLabel: "Reassessment signal",
      sourceContext: "Current safety and progression review",
      observedMeaning: sentence(clinicianText(reassessmentTriggers[0])),
      clinicalRelevance:
        "This documented trigger indicates that current performance should be reviewed before the plan is advanced unchanged.",
      confidence: "strong",
      rawSource: {
        sourceType: "progression_state",
        field: "reassessmentTriggers",
        value: reassessmentTriggers[0],
      },
    });
  }

  const milestone =
    asText(readFirst(input.longitudinalState, [["milestoneAchieved"], ["milestone_achieved"]])) ||
    collectVisitSignal(latestVisit, ["milestoneAchieved", "milestone_achieved"])[0] ||
    asTextList(readFirst(input.progressionState, [["activeMilestones"], ["active_milestones"]]))[0];
  const progressionStatus =
    asText(readFirst(input.longitudinalState, [["progressionStatus"], ["progression_status"]])) ||
    collectVisitSignal(latestVisit, ["progressionStatus", "progression_status"])[0];
  const advancementReadiness = asText(
    readFirst(input.progressionState, [["advancementReadiness"], ["advancement_readiness"]])
  );
  const progressionSignal = milestone || progressionStatus || advancementReadiness;

  if (progressionSignal) {
    const isMilestone = Boolean(milestone);
    const isStatus = !isMilestone && Boolean(progressionStatus);
    add({
      category: "progression",
      priority: 92,
      evidenceLabel: isMilestone
        ? "Progression milestone"
        : isStatus
          ? "Progression status"
          : "Progression readiness",
      sourceContext: isMilestone || isStatus ? "Most recent progression update" : "Current progression state",
      observedMeaning: isMilestone
        ? sentence(`A milestone was documented: ${clinicianText(milestone || "")}`)
        : isStatus
          ? sentence(`Progression is documented as ${clinicianText(progressionStatus || "")}`)
          : sentence(`Advancement readiness is documented as ${clinicianText(advancementReadiness || "")}`),
      clinicalRelevance:
        "This signal helps determine whether the current plan should be maintained, reviewed, or prepared for progression.",
      observedAt: isMilestone || isStatus ? latestObservedAt : undefined,
      confidence: isMilestone || isStatus ? "strong" : "moderate",
      rawSource: {
        sourceType: isMilestone || isStatus ? "longitudinal_update" : "progression_state",
        field: isMilestone
          ? "milestoneAchieved"
          : isStatus
            ? "progressionStatus"
            : "advancementReadiness",
        value: progressionSignal,
      },
    });
  }

  const nonSafetyChange = recentChanges.find((change) => change !== safetyChange);
  if (nonSafetyChange) {
    add({
      category: "change",
      priority: 86,
      evidenceLabel: "Change since last visit",
      sourceContext: "Most recent Patient Status update",
      observedMeaning: sentence(clinicianText(nonSafetyChange)),
      clinicalRelevance:
        "This recent change provides current visit context for the maintained conclusion.",
      observedAt: latestObservedAt,
      confidence: "strong",
      rawSource: {
        sourceType: "longitudinal_update",
        field: "functionalChanges",
        value: nonSafetyChange,
      },
    });
  }

  return candidates;
}

export function buildConclusionEvidence(
  input: BuildConclusionEvidenceInput
): ConclusionEvidence {
  const candidates = buildCandidates(input)
    .map((candidate, sourceIndex) => ({
      candidate,
      sourceIndex,
      score:
        candidate.priority +
        (CONCLUSION_WEIGHTS[input.conclusionType][candidate.category] || 0),
    }))
    .sort((left, right) => right.score - left.score || left.sourceIndex - right.sourceIndex);

  const evidence: ClinicalEvidence[] = [];
  const seen = new Set<string>();
  const seenCategories = new Set<EvidenceCategory>();

  for (const { candidate } of candidates) {
    const clinicalEvidence: ClinicalEvidence = {
      evidenceLabel: candidate.evidenceLabel,
      sourceContext: candidate.sourceContext,
      observedMeaning: candidate.observedMeaning,
      clinicalRelevance: candidate.clinicalRelevance,
      observedAt: candidate.observedAt,
      confidence: candidate.confidence,
      rawSource: candidate.rawSource,
    };
    const uniquenessKey = [
      normalize(clinicalEvidence.evidenceLabel),
      normalize(clinicalEvidence.observedMeaning),
    ].join("|");

    if (
      seenCategories.has(candidate.category) ||
      seen.has(uniquenessKey) ||
      isConclusionRestatement(clinicalEvidence, input.conclusion)
    ) {
      continue;
    }

    seenCategories.add(candidate.category);
    seen.add(uniquenessKey);
    evidence.push(clinicalEvidence);
    if (evidence.length === 3) break;
  }

  return {
    conclusionType: input.conclusionType,
    conclusion: input.conclusion,
    evidence,
  };
}
