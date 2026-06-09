import assert from "node:assert/strict";
import test from "node:test";

import { reconcileBarriers } from "../src/lib/continuity/reconcileBarriers.ts";

const transferBarrier = "transfer safety limitation";

test("A: regression keeps transfer safety active", () => {
  const result = reconcileBarriers({
    activeBarriers: [transferBarrier],
    dominantBarriers: [transferBarrier],
    progressionStatus: "Regression Detected",
    functionalChanges: ["Transfer performance is less consistent"],
    progressionReadiness: "not_ready",
  });

  assert.deepEqual(result.activeBarriers, [transferBarrier]);
  assert.equal(result.dominantBarrier, transferBarrier);
});

test("B: a current fall keeps transfer safety active", () => {
  const result = reconcileBarriers({
    activeBarriers: [transferBarrier],
    dominantBarriers: [transferBarrier],
    progressionStatus: "Progressing As Expected",
    functionalChanges: ["Patient had a near-fall during transfer"],
    progressionReadiness: "not_ready",
    currentSafetyOrRegressionSignals: ["Current near-fall during transfer"],
  });

  assert.deepEqual(result.activeBarriers, [transferBarrier]);
});

test("C: transfer milestone and evaluation readiness move safety barrier to monitoring", () => {
  const result = reconcileBarriers({
    activeBarriers: [transferBarrier],
    dominantBarriers: [transferBarrier],
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: "Completed toilet transfers safely and consistently",
    functionalChanges: ["Transfer performance improved"],
    progressionReadiness: "ready_for_evaluation",
  });

  assert.deepEqual(result.monitoringBarriers, [transferBarrier]);
  assert.equal(result.dominantBarrier, null);
});

test("D: positive progression with emerging readiness monitors a safety barrier", () => {
  const result = reconcileBarriers({
    activeBarriers: [transferBarrier],
    dominantBarriers: [transferBarrier],
    progressionStatus: "Progressing As Expected",
    progressionReadiness: "emerging",
  });

  assert.deepEqual(result.monitoringBarriers, [transferBarrier]);
  assert.deepEqual(result.resolvedBarriers, []);
});

test("E: reduced caregiver support resolves a non-safety caregiver barrier for current action", () => {
  const caregiverBarrier = "caregiver support requirement";
  const result = reconcileBarriers({
    activeBarriers: [caregiverBarrier],
    dominantBarriers: [caregiverBarrier],
    progressionStatus: "Progressing As Expected",
    milestoneAchieved: "Caregiver support reduced during morning routine",
    functionalChanges: ["Reduced caregiver support requirement"],
    progressionReadiness: "ready_for_evaluation",
  });

  assert.deepEqual(result.resolvedBarriers, [caregiverBarrier]);
  assert.equal(result.dominantBarrier, null);
});

test("F: unresolved environmental hazard remains active", () => {
  const environmentalBarrier = "bathroom environmental hazard";
  const result = reconcileBarriers({
    activeBarriers: [environmentalBarrier],
    dominantBarriers: [environmentalBarrier],
    progressionStatus: "Progressing As Expected",
    functionalChanges: ["Bathroom environmental hazard remains unresolved"],
    progressionReadiness: "emerging",
  });

  assert.deepEqual(result.activeBarriers, [environmentalBarrier]);
});

test("G: clinician-entered current limiting factor remains active when direction changes", () => {
  const caregiverBarrier = "caregiver availability limitation";
  const result = reconcileBarriers({
    activeBarriers: [caregiverBarrier, transferBarrier],
    dominantBarriers: [transferBarrier, caregiverBarrier],
    currentLimitingFactor: "caregiver availability",
    progressionStatus: "Progressing As Expected",
    progressionReadiness: "emerging",
    treatmentDirectionChanged: true,
  });

  assert.ok(result.activeBarriers.includes(caregiverBarrier));
  assert.equal(result.dominantBarrier, caregiverBarrier);
});

test("H: negative reassessment attention preserves active barriers", () => {
  const result = reconcileBarriers({
    activeBarriers: [transferBarrier],
    dominantBarriers: [transferBarrier],
    progressionStatus: "Plateau Emerging",
    progressionReadiness: "not_ready",
    clinicalAttentionState: {
      reassessmentRecommended: true,
      attentionStatement: "Transfer performance requires reassessment.",
    },
  });

  assert.deepEqual(result.activeBarriers, [transferBarrier]);
  assert.equal(result.dominantBarrier, transferBarrier);
});
