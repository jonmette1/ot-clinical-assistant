import assert from "node:assert/strict";
import test from "node:test";

import { reconcileActivityConstraint } from "../src/lib/continuity/reconcileActivityConstraint.ts";
import { buildCommandCenterNextActions } from "../src/lib/commandCenterNextAction.ts";
import { buildProgressionAwareCurrentFocus } from "../src/lib/currentFocusProgressionAwareness.ts";
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
