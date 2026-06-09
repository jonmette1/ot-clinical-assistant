import assert from "node:assert/strict";
import test from "node:test";

import { buildCommandCenterNextActions } from "../src/lib/commandCenterNextAction.ts";
import { buildProgressionAwareCurrentFocus } from "../src/lib/currentFocusProgressionAwareness.ts";

const transferBarrier = "transfer safety limitation";
const operationalPrioritization = {
  currentOperationalEmphasis: "Transfer safety remains the primary treatment focus.",
  dominantBarriers: [transferBarrier],
  reassessmentTriggers: [],
};
const progressionState = {
  advancementReadiness: "high",
  activeBarriers: [transferBarrier],
  reassessmentTriggers: [],
};

test("positive transfer progression makes readiness evaluation primary and safety monitoring secondary", () => {
  const currentLongitudinalState = {
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: "Completed toilet transfers safely and consistently",
    functionalChanges: ["Transfer performance improved with consistent completion"],
    treatmentDirectionChanged: false,
    currentDominantBarrier: "",
    medicalChange: null,
    reassessmentRecommended: false,
  };
  const clinicalAttentionState = {
    category: "Participation",
    attentionStatement: "Progression milestone achieved.",
    attentionDrivers: ["Completed toilet transfers safely and consistently"],
    requiresOperationalReview: false,
    reassessmentRecommended: false,
    progressionStatus: "Progressing As Expected",
  };

  const currentFocus = buildProgressionAwareCurrentFocus({
    currentFocus: operationalPrioritization.currentOperationalEmphasis,
    progressionState,
    currentLongitudinalState,
    clinicalAttentionState,
    dominantBarriers: operationalPrioritization.dominantBarriers,
  });
  const nextAction = buildCommandCenterNextActions({
    structuredPlanDetails: { immediateActions: ["Continue transfer training."] },
    operationalPrioritization,
    progressionState,
    currentLongitudinalState,
    clinicalAttentionState,
  });

  assert.equal(
    currentFocus,
    "Transfer performance is improving. Evaluate readiness for progression while keeping transfer safety under monitoring.",
  );
  assert.equal(
    nextAction.primaryAction,
    "Evaluate readiness for progression while continuing transfer safety monitoring.",
  );
  assert.ok(nextAction.supportingActions.includes("Continue monitoring transfer safety."));
});

test("emerging transfer progression keeps the barrier in monitoring without resolving it", () => {
  const currentLongitudinalState = {
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: null,
    functionalChanges: [],
    treatmentDirectionChanged: false,
    currentDominantBarrier: "",
    medicalChange: null,
    reassessmentRecommended: false,
  };

  const currentFocus = buildProgressionAwareCurrentFocus({
    currentFocus: operationalPrioritization.currentOperationalEmphasis,
    progressionState: { ...progressionState, advancementReadiness: "partial" },
    currentLongitudinalState,
    clinicalAttentionState: {
      requiresOperationalReview: false,
      reassessmentRecommended: false,
      progressionStatus: "Progressing As Expected",
    },
    dominantBarriers: operationalPrioritization.dominantBarriers,
  });

  assert.equal(
    currentFocus,
    "Transfer performance is improving. Continue monitoring transfer safety while confirming consistency is sustained.",
  );
});

test("regression preserves safety reassessment as the primary action", () => {
  const currentLongitudinalState = {
    progressionStatus: "Regression Detected",
    milestoneAchieved: null,
    functionalChanges: ["Transfer performance is less consistent and requires increased assistance"],
    treatmentDirectionChanged: false,
    currentDominantBarrier: transferBarrier,
    medicalChange: null,
    reassessmentRecommended: true,
  };
  const clinicalAttentionState = {
    category: "Safety",
    attentionStatement: "Functional performance requires attention due to regression.",
    attentionDrivers: [transferBarrier],
    requiresOperationalReview: false,
    reassessmentRecommended: true,
    progressionStatus: "Regression Detected",
  };

  const nextAction = buildCommandCenterNextActions({
    structuredPlanDetails: { immediateActions: ["Continue transfer training."] },
    operationalPrioritization,
    progressionState,
    currentLongitudinalState,
    clinicalAttentionState,
  });

  assert.equal(
    nextAction.primaryAction,
    `Reassess safety and current function around ${transferBarrier} before advancing or continuing the prior plan.`,
  );
});
