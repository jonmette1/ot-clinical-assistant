import assert from "node:assert/strict";
import test from "node:test";

import { reconcileActivityConstraint } from "../src/lib/continuity/reconcileActivityConstraint.ts";
import { buildCommandCenterNextActions } from "../src/lib/commandCenterNextAction.ts";
import { buildProgressionAwareCurrentFocus } from "../src/lib/currentFocusProgressionAwareness.ts";
import { compressCurrentFocusSentence } from "../src/lib/clinicalDisplayLanguage.ts";
import { derivePatientEntryPreviewSignals } from "../src/app/cases/patientEntryPreview.ts";

const painBarrier = "pain";
const toiletTransfer = "Toilet transfer";

const reconcile = (overrides = {}) =>
  reconcileActivityConstraint({
    currentDominantBarrier: painBarrier,
    primaryTargetActivity: toiletTransfer,
    progressionStatus: "Progressing As Expected",
    progressionReadiness: "ready_for_evaluation",
    functionalChanges: [],
    ...overrides,
  });

test("A: pain that still limits toilet transfer remains constraining", () => {
  const result = reconcile({
    functionalChanges: ["Pain still limits toilet transfer performance."],
  });

  assert.equal(result.relevance, "constraining");
  assert.equal(result.blockingWeightEligible, true);
});

test("B: improved but inconsistent toilet transfers move pain to monitor only", () => {
  const result = reconcile({
    progressionReadiness: "emerging",
    functionalChanges: ["Toilet transfer performance improved but remains inconsistent."],
  });

  assert.equal(result.relevance, "monitor_only");
  assert.equal(result.blockingWeightEligible, false);
});

test("C: supervision-level safe transfers with independent setup no longer treat pain as constraining", () => {
  const result = reconcile({
    milestoneAchieved: "Completed toilet transfer with supervision only and improved safety",
    functionalChanges: ["Toilet transfer completed with independent setup and improved consistency."],
  });

  assert.equal(result.relevance, "not_currently_constraining");
  assert.equal(result.blockingWeightEligible, false);
});

test("D: pain limiting standing does not dominate a safe supervision-level toilet-transfer action", () => {
  const currentLongitudinalState = {
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: "Completed toilet transfer safely with supervision only",
    functionalChanges: [
      "Pain still limits prolonged standing.",
      "Toilet transfer completed with independent setup and improved consistency.",
    ],
    currentDominantBarrier: painBarrier,
    treatmentDirectionChanged: false,
    reassessmentRecommended: false,
    medicalChange: null,
  };
  const progressionState = {
    advancementReadiness: "high",
    activeBarriers: [painBarrier],
    reassessmentTriggers: ["pain limits task participation"],
  };
  const operationalPrioritization = {
    currentOperationalEmphasis: "Pain remains the primary limit on toilet transfer performance.",
    dominantBarriers: [painBarrier],
    reassessmentTriggers: ["increase in pain limiting task participation"],
  };

  const nextAction = buildCommandCenterNextActions({
    operationalPrioritization,
    progressionState,
    currentLongitudinalState,
    primaryTargetActivity: toiletTransfer,
  });
  const currentFocus = buildProgressionAwareCurrentFocus({
    currentFocus: operationalPrioritization.currentOperationalEmphasis,
    progressionState,
    currentLongitudinalState,
    dominantBarriers: operationalPrioritization.dominantBarriers,
    primaryTargetActivity: toiletTransfer,
  });

  assert.match(nextAction.primaryAction, /^Evaluate readiness for progression/);
  assert.doesNotMatch(nextAction.primaryAction, /^Reassess.*pain/i);
  assert.equal(
    currentFocus,
    "Toilet transfer performance is improving. Pain remains present but no longer appears to be the primary constraint on toilet transfer performance.",
  );
});

test("E: current fall, near-fall, or unsafe performance overrides improvement", () => {
  for (const signal of [
    "Patient fell during toilet transfer.",
    "Near-fall during toilet transfer.",
    "Toilet transfer performance was unsafe.",
  ]) {
    assert.equal(
      reconcile({
        milestoneAchieved: "Toilet transfer improved with supervision only",
        currentSafetyOrRegressionSignals: [signal],
      }).relevance,
      "constraining",
    );
  }
});

test("F: clinician-selected pain remains constraining when treatment direction changes", () => {
  const result = reconcile({
    treatmentDirectionChanged: true,
    functionalChanges: ["Toilet transfer performance improved."],
  });

  assert.equal(result.relevance, "constraining");
});

test("G: generic improvement does not establish non-constraint", () => {
  const result = reconcile({ functionalChanges: ["Patient is doing better overall."] });

  assert.notEqual(result.relevance, "not_currently_constraining");
});

test("H: regression keeps existing safety behavior primary", () => {
  const result = buildCommandCenterNextActions({
    operationalPrioritization: {
      currentOperationalEmphasis: "Pain limits toilet transfer safety.",
      dominantBarriers: [painBarrier],
      reassessmentTriggers: [],
    },
    progressionState: {
      advancementReadiness: "high",
      activeBarriers: [painBarrier],
      reassessmentTriggers: [],
    },
    currentLongitudinalState: {
      progressionStatus: "Regression Detected",
      functionalChanges: ["Toilet transfer requires increased assistance and is less consistent."],
      currentDominantBarrier: painBarrier,
      reassessmentRecommended: true,
    },
    primaryTargetActivity: toiletTransfer,
  });

  assert.equal(
    result.primaryAction,
    "Reassess safety and current function around pain before advancing or continuing the prior plan.",
  );
});

test("patient preview uses the same activity relevance as the visit briefing builders", () => {
  const signals = derivePatientEntryPreviewSignals({
    caseData: {
      id: "case-1",
      target_activities: [toiletTransfer],
      generated_output: {
        operational_prioritization: {
          currentOperationalEmphasis: "Pain remains the primary limit on toilet transfer performance.",
          dominantBarriers: [painBarrier],
          reassessmentTriggers: ["increase in pain limiting task participation"],
        },
        structured_plan_details: { immediateActions: ["Reassess pain during transfers."] },
        progression_state: {
          advancementReadiness: "high",
          activeBarriers: [painBarrier],
          reassessmentTriggers: ["pain limits task participation"],
        },
      },
      current_longitudinal_state: {
        progressionStatus: "Progressing As Expected",
        milestoneAchieved: "Completed toilet transfer safely with supervision only",
        functionalChanges: [
          "Pain still limits prolonged standing.",
          "Toilet transfer completed with independent setup and improved consistency.",
        ],
        currentDominantBarrier: painBarrier,
        treatmentDirectionChanged: false,
        reassessmentRecommended: false,
      },
    },
    recentEvents: [],
  });

  assert.equal(
    signals.find((signal) => signal.label === "Current Focus")?.value,
    "Toilet transfer performance is improving. Pain remains present but no longer appears to be the primary constraint on toilet transfer performance.",
  );
  assert.match(
    signals.find((signal) => signal.label === "Next Action")?.value || "",
    /^Evaluate readiness for progression/,
  );
});


const oaVisitFive = {
  currentLongitudinalState: {
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: "Independent toilet transfer setup achieved",
    functionalChanges: [
      "Toilet transfers improved to supervision level with independent setup and improved safety",
    ],
    currentDominantBarrier: "Pain with extended household mobility",
    treatmentDirectionChanged: false,
    reassessmentRecommended: false,
    medicalChange: null,
  },
  progressionState: {
    advancementReadiness: "low",
    activeBarriers: ["pain-limited task performance", "caregiver support mismatch"],
    reassessmentTriggers: ["caregiver physical assist capacity diminishes further"],
  },
  operationalPrioritization: {
    currentOperationalEmphasis:
      "Pain with extended household mobility limits toileting participation",
    dominantBarriers: [
      "Pain with extended household mobility",
      "caregiver support mismatch",
    ],
    reassessmentTriggers: ["caregiver physical assist capacity diminishes further"],
  },
};

test("OA A/B: progression-aware Current Focus survives compression without clause corruption", () => {
  const rawFocus = buildProgressionAwareCurrentFocus({
    currentFocus: oaVisitFive.operationalPrioritization.currentOperationalEmphasis,
    progressionState: oaVisitFive.progressionState,
    currentLongitudinalState: oaVisitFive.currentLongitudinalState,
    dominantBarriers: oaVisitFive.operationalPrioritization.dominantBarriers,
    primaryTargetActivity: "Toileting",
  });

  assert.equal(
    rawFocus,
    "Toilet transfer performance is improving. Continue confirming consistency at supervision level while monitoring pain during higher-demand activity.",
  );
  assert.equal(compressCurrentFocusSentence(rawFocus), rawFocus);
});

test("OA C: activity-transition validation outranks a surviving caregiver threshold", () => {
  const result = buildCommandCenterNextActions({
    operationalPrioritization: oaVisitFive.operationalPrioritization,
    progressionState: oaVisitFive.progressionState,
    currentLongitudinalState: oaVisitFive.currentLongitudinalState,
    primaryTargetActivity: "Toileting",
  });

  assert.equal(
    result.primaryAction,
    "Evaluate readiness for progression by confirming consistent, safe toilet transfers at supervision level with independent setup.",
  );
  assert.ok(
    result.supportingActions.includes(
      "Continue monitoring pain tolerance during higher-demand activity.",
    ),
  );
  assert.ok(
    result.supportingActions.includes(
      "Confirm whether caregiver physical assistance remains necessary for the target activity.",
    ),
  );
  assert.doesNotMatch(result.primaryAction, /caregiver/i);
});

test("OA D: a current near-fall still overrides activity-transition promotion", () => {
  const result = buildCommandCenterNextActions({
    operationalPrioritization: oaVisitFive.operationalPrioritization,
    progressionState: oaVisitFive.progressionState,
    currentLongitudinalState: {
      ...oaVisitFive.currentLongitudinalState,
      functionalChanges: [
        ...oaVisitFive.currentLongitudinalState.functionalChanges,
        "Near-fall occurred during toilet transfer",
      ],
    },
    primaryTargetActivity: "Toileting",
  });

  assert.match(result.primaryAction, /^Reassess safety and current function/);
});

test("OA E: explicit current caregiver capacity loss promotes caregiver reassessment", () => {
  const result = buildCommandCenterNextActions({
    operationalPrioritization: {
      currentOperationalEmphasis: "Caregiver-supported transfers remain fragile.",
      dominantBarriers: ["caregiver support mismatch"],
      reassessmentTriggers: ["caregiver physical assist capacity diminishes further"],
    },
    progressionState: {
      advancementReadiness: "low",
      activeBarriers: ["caregiver support mismatch"],
      reassessmentTriggers: ["caregiver physical assist capacity diminishes further"],
    },
    currentLongitudinalState: {
      progressionStatus: "Stable",
      currentDominantBarrier: "caregiver support mismatch",
      caregiverChange: "Caregiver cannot provide physical assist",
      treatmentDirectionChanged: false,
      reassessmentRecommended: false,
    },
    primaryTargetActivity: "Toilet transfer",
  });

  assert.equal(result.primaryAction, "Reassess current caregiver physical assist capacity.");
});

test("OA F: regression behavior remains unchanged after promotion correction", () => {
  const result = buildCommandCenterNextActions({
    operationalPrioritization: oaVisitFive.operationalPrioritization,
    progressionState: oaVisitFive.progressionState,
    currentLongitudinalState: {
      ...oaVisitFive.currentLongitudinalState,
      progressionStatus: "Regression Detected",
      functionalChanges: ["Toilet transfer requires increased assistance and is less consistent"],
      reassessmentRecommended: true,
    },
    primaryTargetActivity: "Toileting",
  });

  assert.match(result.primaryAction, /^Reassess safety and current function/);
});

test("OA G: Patient Preview matches Visit Briefing after transition promotion", () => {
  const signals = derivePatientEntryPreviewSignals({
    caseData: {
      id: "oa-visit-five",
      target_activities: ["Toileting"],
      generated_output: {
        operational_prioritization: oaVisitFive.operationalPrioritization,
        progression_state: oaVisitFive.progressionState,
        structured_plan_details: { immediateActions: ["Continue prior transfer plan"] },
      },
      current_longitudinal_state: oaVisitFive.currentLongitudinalState,
    },
    recentEvents: [],
  });

  assert.equal(
    signals.find((signal) => signal.label === "Current Focus")?.value,
    "Toilet transfer performance is improving. Continue confirming consistency at supervision level while monitoring pain during higher-demand activity.",
  );
  assert.equal(
    signals.find((signal) => signal.label === "Next Action")?.value,
    "Evaluate readiness for progression by confirming consistent, safe toilet transfers at supervision level with independent setup.",
  );
});
