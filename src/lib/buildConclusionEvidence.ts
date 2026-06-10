export type ConclusionType =
  | "current_focus"
  | "attention_required"
  | "next_action";

export type ClinicalEvidence = {
  evidenceLabel: string;
  sourceContext: string;
  observedMeaning: string;
  clinicalRelevance: string;
  reasoningBasis?: string;
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

type EvidenceInputs = {
  caseData?: unknown;
  clinicalDecisionModel?: unknown;
  progressionState?: unknown;
  continuityInterpretation?: unknown;
  longitudinalState?: unknown;
  visitHistory?: unknown;
};

type BuildConclusionEvidenceInput = EvidenceInputs & {
  conclusionType: ConclusionType;
  conclusion: string;
};

type BuildConclusionEvidenceSetInput = EvidenceInputs & {
  conclusions: Record<ConclusionType, string>;
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

type EvidenceFrame = Omit<ClinicalEvidence, "rawSource" | "observedAt" | "confidence">;

type EvidenceCandidate = {
  sourceKey: string;
  category: EvidenceCategory;
  priority: number;
  frames: Partial<Record<ConclusionType, EvidenceFrame>>;
  observedAt?: string;
  confidence: "strong" | "moderate" | "limited";
  rawSource: NonNullable<ClinicalEvidence["rawSource"]>;
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
  current_focus: { functional: 40, target: 30, barrier: 25, change: 15, caregiver: 5 },
  attention_required: {
    safety: 45,
    reassessment: 40,
    caregiver: 30,
    environment: 25,
    change: 20,
    functional: 10,
  },
  next_action: {
    progression: 45,
    reassessment: 40,
    safety: 35,
    caregiver: 25,
    change: 20,
    functional: 15,
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
    return value.map(asText).filter((item): item is string => Boolean(item));
  }
  const text = asText(value);
  return text ? [text] : [];
}

function clinicianText(value: string): string {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value: string): string {
  return clinicianText(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value: string): string {
  const text = clinicianText(value);
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

function joinReadable(items: string[]): string {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function describeSafetyChange(value: string): string {
  const normalized = normalize(value);
  const activity = normalized.includes("shower")
    ? "shower transfer"
    : normalized.includes("toilet")
      ? "toilet transfer"
      : normalized.includes("bed transfer")
        ? "bed transfer"
        : normalized.includes("transfer")
          ? "transfer performance"
          : "functional activity";

  if (normalized.includes("near fall")) {
    return `A newly reported near-fall during ${activity} shows that current performance has less safety margin than the prior record suggested.`;
  }
  if (normalized.includes("fall")) {
    return `A newly reported fall during ${activity} indicates a material change in current safety risk.`;
  }
  if (normalized.includes("increased assist") || normalized.includes("more assist")) {
    return `The latest update indicates that ${activity} now requires more support, reducing confidence that the prior plan still matches current performance.`;
  }
  if (normalized.includes("declin") || normalized.includes("regress")) {
    return `The latest update indicates declining reliability during ${activity}, rather than routine variation in performance.`;
  }

  return "The latest visit introduced a new safety concern rather than a routine performance fluctuation.";
}

function isConclusionRestatement(evidence: ClinicalEvidence, conclusion: string): boolean {
  const normalizedConclusion = normalize(conclusion);
  if (!normalizedConclusion) return false;

  return [evidence.observedMeaning, evidence.clinicalRelevance]
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
  return sources.flatMap((source) => keys.flatMap((key) => asTextList(readFirst(source, [[key]]))));
}

function formatObservedAt(value: unknown): string | undefined {
  const text = asText(value);
  if (!text) return undefined;
  return Number.isNaN(Date.parse(text)) ? text : new Date(text).toISOString();
}

function buildCandidates(input: EvidenceInputs): EvidenceCandidate[] {
  const candidates: EvidenceCandidate[] = [];
  const add = (candidate: EvidenceCandidate | null) => {
    if (candidate) candidates.push(candidate);
  };

  const latestVisit = latestVisitRecords(input.visitHistory)[0];
  const latestObservedAt = formatObservedAt(
    latestVisit?.created_at || latestVisit?.createdAt ||
      readFirst(input.longitudinalState, [["lastUpdatedAt"], ["last_updated_at"]])
  );
  const recentChanges = [
    ...asTextList(readFirst(input.longitudinalState, [["functionalChanges"], ["functional_changes"]])),
    ...collectVisitSignal(latestVisit, ["functionalChanges", "functional_changes"]),
  ].filter((value, index, values) => values.indexOf(value) === index);
  const safetyChange = recentChanges.find((change) =>
    /\b(fall|near fall|unsafe|injur|loss of balance|declin|regress|increased assist|more assist)\b/i.test(change)
  );

  if (safetyChange) {
    add({
      sourceKey: `longitudinal-change:${normalize(safetyChange)}`,
      category: "safety",
      priority: 120,
      frames: {
        attention_required: {
          evidenceLabel: "Recent safety change",
          sourceContext: "Most recent Patient Status update",
          observedMeaning: describeSafetyChange(safetyChange),
          clinicalRelevance: "A new safety event requires closer monitoring because the patient’s prior level of stability may no longer represent current risk.",
          reasoningBasis: "Recent safety events are given greater clinical weight than older stable findings when determining what needs attention now.",
        },
        next_action: {
          evidenceLabel: "Safety change affecting the next step",
          sourceContext: "Most recent Patient Status update",
          observedMeaning: `${describeSafetyChange(safetyChange)} Safety should therefore be verified before treatment demand is increased.`,
          clinicalRelevance: "The safest next step is to confirm current performance under the changed conditions before advancing the plan.",
          reasoningBasis: "A new fall, near-fall, or regression signal is weighted above progression signals when choosing whether the plan can safely advance.",
        },
      },
      observedAt: latestObservedAt,
      confidence: "strong",
      rawSource: { sourceType: "longitudinal_update", field: "functionalChanges", value: safetyChange },
    });
  }

  const recentFalls = asText(readFirst(input.caseData, [
    ["functional_status", "general_mobility_summary", "recent_falls"],
    ["functionalStatus", "generalMobilitySummary", "recentFalls"],
    ["environment", "general_mobility", "recent_falls"],
    ["environment", "generalMobility", "recentFalls"],
  ]));
  if (recentFalls && /^(yes|true|near falls?|near_falls)$/i.test(recentFalls)) {
    add({
      sourceKey: "case:recent-falls",
      category: "safety",
      priority: 110,
      frames: {
        attention_required: {
          evidenceLabel: /near/i.test(recentFalls) ? "Near-fall risk remains active" : "Fall risk remains active",
          sourceContext: "Functional mobility assessment",
          observedMeaning: "Documented fall risk leaves less margin for error during transfers and functional mobility.",
          clinicalRelevance: "This risk needs continued caution even when other findings suggest stable or improving performance.",
          reasoningBasis: "Safety events remain clinically significant until current performance shows that the risk has been adequately addressed.",
        },
        next_action: {
          evidenceLabel: "Fall risk constrains advancement",
          sourceContext: "Functional mobility assessment",
          observedMeaning: "Improvement signals cannot be treated as sufficient evidence to increase task demand while fall risk remains unresolved.",
          clinicalRelevance: "The next step should preserve safety verification or reassessment before progression is attempted.",
          reasoningBasis: "Fall risk is weighted above progression signals when deciding whether advancing the plan is appropriate.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "case_data", field: "functional_status.general_mobility_summary.recent_falls", value: recentFalls },
    });
  }

  const transfers = [
    ["bed_transfer", "Bed transfer"],
    ["toilet_transfer", "Toilet transfer"],
    ["shower_transfer", "Shower transfer"],
  ] as const;
  const transferLevels = transfers
    .map(([field, label]) => {
      const camelField = field.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
      const value = asText(readFirst(input.caseData, [
        ["functional_status", "adl_assist_levels", field],
        ["functionalStatus", "adlAssistLevels", camelField],
      ]));
      return value ? { field, label, value, level: /^\d$/.test(value) ? Number(value) : 99 } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((left, right) => left.level - right.level);
  const primaryTransfer = transferLevels[0];
  if (primaryTransfer) {
    const assistance = ASSISTANCE_LABELS[primaryTransfer.value] || clinicianText(primaryTransfer.value);
    add({
      sourceKey: `case:transfer:${primaryTransfer.field}`,
      category: "functional",
      priority: 100,
      frames: {
        current_focus: {
          evidenceLabel: "Highest functional support need",
          sourceContext: "Current functional assessment",
          observedMeaning: `${primaryTransfer.label} remains the activity requiring the most documented support (${assistance}).`,
          clinicalRelevance: `This makes ${primaryTransfer.label.toLowerCase()} the clearest treatment anchor because it is where functional demand and safety support are most concentrated.`,
          reasoningBasis: "The activity requiring the most assistance is prioritized because it identifies where safety and caregiver support are most constrained.",
        },
        attention_required: {
          evidenceLabel: "Limited transfer safety margin",
          sourceContext: "Current functional assessment",
          observedMeaning: `${primaryTransfer.label} still depends on substantial support, leaving limited margin for setup or cueing errors.`,
          clinicalRelevance: "This level of dependence warrants monitoring because small changes in performance or available help may materially affect safety.",
          reasoningBasis: "Higher assistance needs receive more attention because they create greater consequences when support or setup is inconsistent.",
        },
        next_action: {
          evidenceLabel: "Support need shapes task selection",
          sourceContext: "Current functional assessment",
          observedMeaning: `${primaryTransfer.label} remains the most support-dependent task in the current assessment.`,
          clinicalRelevance: "The next intervention should address or safely work within this support need before shifting effort to a less constrained activity.",
          reasoningBasis: "The safest next step targets the activity with the greatest current support requirement before increasing complexity elsewhere.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "case_data", field: `functional_status.adl_assist_levels.${primaryTransfer.field}`, value: primaryTransfer.value },
    });
  }

  const caregiverConfidence = asText(readFirst(input.caseData, [
    ["caregiver_info", "confidence"], ["caregiverInfo", "confidence"], ["caregiverSupport", "confidence"],
  ]));
  if (caregiverConfidence && /low|not confident|uncertain/i.test(caregiverConfidence)) {
    add({
      sourceKey: "case:caregiver-confidence",
      category: "caregiver",
      priority: 90,
      frames: {
        current_focus: {
          evidenceLabel: "Carryover depends on caregiver support",
          sourceContext: "Caregiver support assessment",
          observedMeaning: "The current support plan depends on a caregiver who is not yet consistently confident with the required assistance.",
          clinicalRelevance: "Treatment focus should remain grounded in tasks and strategies that can be carried over reliably between visits.",
          reasoningBasis: "Caregiver confidence affects whether gains are likely to carry over safely between visits.",
        },
        attention_required: {
          evidenceLabel: "Caregiver carryover vulnerability",
          sourceContext: "Caregiver support assessment",
          observedMeaning: "Low caregiver confidence creates a risk that required support may be inconsistent outside supervised treatment.",
          clinicalRelevance: "This needs monitoring because otherwise appropriate task performance may not remain safe or repeatable between visits.",
          reasoningBasis: "Caregiver confidence is weighted as a safety and feasibility factor when the patient relies on another person for carryover.",
        },
        next_action: {
          evidenceLabel: "Caregiver confidence shapes follow-through",
          sourceContext: "Caregiver support assessment",
          observedMeaning: "The next intervention must be feasible for a caregiver who is still building confidence with the required support.",
          clinicalRelevance: "A step that includes clear training or supported practice is more likely to carry over safely than increasing patient task demand alone.",
          reasoningBasis: "Caregiver confidence affects whether gains are likely to carry over safely between visits.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "case_data", field: "caregiver_info.confidence", value: caregiverConfidence },
    });
  }

  const hazards = asTextList(readFirst(input.caseData, [
    ["environment", "safety_hazards"], ["environment", "safetyHazards"],
    ["environment", "bathroom", "safety_hazards"], ["environment", "bathroom", "safetyHazards"],
  ]));
  if (hazards.length) {
    const hazardSummary = joinReadable(hazards.slice(0, 2).map(clinicianText));
    add({
      sourceKey: `case:environment:${hazards.map(normalize).join("|")}`,
      category: "environment",
      priority: 85,
      frames: {
        attention_required: {
          evidenceLabel: "Environment increases task demand",
          sourceContext: "Home environment assessment",
          observedMeaning: `${titleCase(hazardSummary)} reduces the safety margin available during functional activity.`,
          clinicalRelevance: "These barriers need continued attention because patient performance alone may not offset the demands of the home setup.",
          reasoningBasis: "Environmental barriers are weighted when they increase the assistance, setup, or judgment required to complete the task safely.",
        },
        next_action: {
          evidenceLabel: "Home setup limits the next step",
          sourceContext: "Home environment assessment",
          observedMeaning: "The current environment adds demands that must be addressed or accommodated during task progression.",
          clinicalRelevance: "The next step should include a feasible setup or workaround rather than assuming performance will generalize to an unchanged environment.",
          reasoningBasis: "The next action must remain feasible in the patient’s actual environment, not only under ideal treatment conditions.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "case_data", field: "environment.safety_hazards", value: hazards },
    });
  }

  const targetActivity = asTextList(readFirst(input.caseData, [["target_activities"], ["targetActivities"]]))[0];
  if (targetActivity) {
    add({
      sourceKey: `case:target:${normalize(targetActivity)}`,
      category: "target",
      priority: 88,
      frames: {
        current_focus: {
          evidenceLabel: "Patient-prioritized activity",
          sourceContext: "Patient goal and treatment intake",
          observedMeaning: `${titleCase(targetActivity)} is the activity the current plan is intended to improve.`,
          clinicalRelevance: "Keeping the dominant focus tied to this activity connects treatment effort to the patient’s stated functional priority.",
          reasoningBasis: "The patient’s target activity is used as the functional anchor when it aligns with the strongest current limitation.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "case_data", field: "target_activities", value: targetActivity },
    });
  }

  const activeBarriers = asTextList(readFirst(input.progressionState, [["activeBarriers"], ["active_barriers"]]));
  const dominantBarrier = asText(readFirst(input.clinicalDecisionModel, [["dominantBarrier"], ["dominant_barrier"]]));
  const barrier = activeBarriers[0] || dominantBarrier;
  if (barrier) {
    add({
      sourceKey: `barrier:${normalize(barrier)}`,
      category: "barrier",
      priority: 82,
      frames: {
        current_focus: {
          evidenceLabel: "Dominant limiting factor",
          sourceContext: activeBarriers[0] ? "Current progression summary" : "Current clinical assessment",
          observedMeaning: `${titleCase(barrier)} continues to be the strongest documented constraint on reliable task performance.`,
          clinicalRelevance: "The dominant focus remains appropriate because this limitation has not yet been displaced by a more important functional constraint.",
          reasoningBasis: "An active barrier is prioritized when it remains the clearest constraint on safe, repeatable performance of the target activity.",
        },
      },
      confidence: activeBarriers[0] ? "strong" : "moderate",
      rawSource: { sourceType: activeBarriers[0] ? "progression_state" : "clinical_decision_model", field: activeBarriers[0] ? "activeBarriers" : "dominantBarrier", value: barrier },
    });
  }

  const reassessmentTriggers = [
    ...asTextList(readFirst(input.progressionState, [["reassessmentTriggers"], ["reassessment_triggers"]])),
    ...asTextList(readFirst(input.continuityInterpretation, [["continuityAlerts"], ["continuity_alerts"]])),
  ];
  if (reassessmentTriggers[0]) {
    add({
      sourceKey: `reassessment:${normalize(reassessmentTriggers[0])}`,
      category: "reassessment",
      priority: 105,
      frames: {
        attention_required: {
          evidenceLabel: "Current findings warrant review",
          sourceContext: "Current safety and progression review",
          observedMeaning: "The available findings meet an existing condition for reviewing whether the current plan remains appropriate.",
          clinicalRelevance: "This issue needs attention because continuing without review could rely on assumptions that no longer match current performance.",
          reasoningBasis: "A documented reassessment condition is weighted above routine stability because it signals that the plan may need clinical review.",
        },
        next_action: {
          evidenceLabel: "Review needed before progression",
          sourceContext: "Current safety and progression review",
          observedMeaning: "The current record contains a reason to verify the plan before increasing task demand or reducing support.",
          clinicalRelevance: "The appropriate next step is review or reassessment rather than automatic progression of the existing plan.",
          reasoningBasis: "When a reassessment condition is active, verification takes priority over advancing an otherwise promising plan.",
        },
      },
      confidence: "strong",
      rawSource: { sourceType: "progression_state", field: "reassessmentTriggers", value: reassessmentTriggers[0] },
    });
  }

  const milestone =
    asText(readFirst(input.longitudinalState, [["milestoneAchieved"], ["milestone_achieved"]])) ||
    collectVisitSignal(latestVisit, ["milestoneAchieved", "milestone_achieved"])[0] ||
    asTextList(readFirst(input.progressionState, [["activeMilestones"], ["active_milestones"]]))[0];
  const progressionStatus =
    asText(readFirst(input.longitudinalState, [["progressionStatus"], ["progression_status"]])) ||
    collectVisitSignal(latestVisit, ["progressionStatus", "progression_status"])[0];
  const advancementReadiness = asText(readFirst(input.progressionState, [["advancementReadiness"], ["advancement_readiness"]]));
  const progressionSignal = milestone || progressionStatus || advancementReadiness;
  if (progressionSignal) {
    const signalType = milestone ? "milestone" : progressionStatus ? "status" : "readiness";
    add({
      sourceKey: `progression:${signalType}:${normalize(progressionSignal)}`,
      category: "progression",
      priority: 98,
      frames: {
        next_action: {
          evidenceLabel: milestone ? "Milestone informs the next step" : "Progression signal informs the next step",
          sourceContext: milestone || progressionStatus ? "Most recent progression update" : "Current progression summary",
          observedMeaning: milestone
            ? "A documented milestone provides evidence that the current approach is producing meaningful functional change."
            : "The current progression signal provides evidence about whether treatment demand should be maintained or adjusted.",
          clinicalRelevance: milestone
            ? "The next step can build on this gain while preserving any active safety or support constraints."
            : "This signal helps calibrate the next step, but it does not override active safety, caregiver, or reassessment concerns.",
          reasoningBasis: "Progression evidence supports advancement only when stronger safety and feasibility concerns do not require a more cautious step.",
        },
      },
      observedAt: milestone || progressionStatus ? latestObservedAt : undefined,
      confidence: milestone || progressionStatus ? "strong" : "moderate",
      rawSource: { sourceType: milestone || progressionStatus ? "longitudinal_update" : "progression_state", field: milestone ? "milestoneAchieved" : progressionStatus ? "progressionStatus" : "advancementReadiness", value: progressionSignal },
    });
  }

  const nonSafetyChange = recentChanges.find((change) => change !== safetyChange);
  if (nonSafetyChange) {
    add({
      sourceKey: `longitudinal-change:${normalize(nonSafetyChange)}`,
      category: "change",
      priority: 86,
      frames: {
        current_focus: {
          evidenceLabel: "Recent change in task performance",
          sourceContext: "Most recent Patient Status update",
          observedMeaning: "The latest visit information changes the current picture of how the target activity is being performed.",
          clinicalRelevance: "This change helps confirm whether the dominant treatment focus still matches the patient’s most current functional need.",
          reasoningBasis: "Recent functional changes are weighted above older baseline details when identifying what treatment should emphasize now.",
        },
        attention_required: {
          evidenceLabel: "Recent performance change",
          sourceContext: "Most recent Patient Status update",
          observedMeaning: "The newest visit information indicates that performance is not simply unchanged from the prior assessment.",
          clinicalRelevance: "The change should be monitored because it may alter the reliability or safety of the current plan.",
          reasoningBasis: "New changes receive additional attention because they may make prior assumptions about performance less reliable.",
        },
        next_action: {
          evidenceLabel: "Recent change shapes follow-up",
          sourceContext: "Most recent Patient Status update",
          observedMeaning: "The next intervention should respond to the newest functional information rather than rely only on the original baseline.",
          clinicalRelevance: "This makes a targeted follow-up step more appropriate than automatically repeating the prior visit approach.",
          reasoningBasis: "The most recent meaningful change is used to adjust how the existing plan is carried forward, without creating a new recommendation pathway.",
        },
      },
      observedAt: latestObservedAt,
      confidence: "strong",
      rawSource: { sourceType: "longitudinal_update", field: "functionalChanges", value: nonSafetyChange },
    });
  }

  return candidates;
}

function toClinicalEvidence(candidate: EvidenceCandidate, conclusionType: ConclusionType): ClinicalEvidence | null {
  const frame = candidate.frames[conclusionType];
  if (!frame) return null;
  return {
    ...frame,
    observedAt: candidate.observedAt,
    confidence: candidate.confidence,
    rawSource: candidate.rawSource,
  };
}

function selectEvidence(
  conclusionType: ConclusionType,
  conclusion: string,
  candidates: EvidenceCandidate[],
  usedDisplayFingerprints?: Set<string>,
  usedSourceRelevance?: Map<string, Set<string>>
): ClinicalEvidence[] {
  const ranked = candidates
    .filter((candidate) => candidate.frames[conclusionType])
    .map((candidate, index) => ({
      candidate,
      index,
      score: candidate.priority + (CONCLUSION_WEIGHTS[conclusionType][candidate.category] || 0),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index);
  const evidence: ClinicalEvidence[] = [];
  const seenCategories = new Set<EvidenceCategory>();

  for (const { candidate } of ranked) {
    if (seenCategories.has(candidate.category)) continue;
    const item = toClinicalEvidence(candidate, conclusionType);
    if (!item || isConclusionRestatement(item, conclusion)) continue;

    const displayFingerprint = normalize(`${item.evidenceLabel}|${item.sourceContext}|${item.clinicalRelevance}`);
    if (usedDisplayFingerprints?.has(displayFingerprint)) continue;

    const relevanceFingerprint = normalize(item.clinicalRelevance);
    const priorRelevance = usedSourceRelevance?.get(candidate.sourceKey);
    if (priorRelevance?.has(relevanceFingerprint)) continue;

    seenCategories.add(candidate.category);
    usedDisplayFingerprints?.add(displayFingerprint);
    if (usedSourceRelevance) {
      const relevanceSet = priorRelevance || new Set<string>();
      relevanceSet.add(relevanceFingerprint);
      usedSourceRelevance.set(candidate.sourceKey, relevanceSet);
    }
    evidence.push(item);
    if (evidence.length === 3) break;
  }

  return evidence;
}

export function buildConclusionEvidence(input: BuildConclusionEvidenceInput): ConclusionEvidence {
  return {
    conclusionType: input.conclusionType,
    conclusion: input.conclusion,
    evidence: selectEvidence(input.conclusionType, input.conclusion, buildCandidates(input)),
  };
}

export function buildConclusionEvidenceSet(
  input: BuildConclusionEvidenceSetInput
): Record<ConclusionType, ConclusionEvidence> {
  const candidates = buildCandidates(input);
  const usedDisplayFingerprints = new Set<string>();
  const usedSourceRelevance = new Map<string, Set<string>>();
  const order: ConclusionType[] = ["current_focus", "attention_required", "next_action"];

  return Object.fromEntries(
    order.map((conclusionType) => {
      const conclusion = input.conclusions[conclusionType];
      return [
        conclusionType,
        {
          conclusionType,
          conclusion,
          evidence: selectEvidence(
            conclusionType,
            conclusion,
            candidates,
            usedDisplayFingerprints,
            usedSourceRelevance
          ),
        },
      ];
    })
  ) as Record<ConclusionType, ConclusionEvidence>;
}
