import assert from "node:assert/strict";
import test from "node:test";

import { buildProgressEvidence } from "../src/lib/buildProgressEvidence.ts";

const maintainedConclusions = {
  currentFocus: "Prioritize safe shower transfer performance.",
  attentionRequired: "Monitor transfer safety and caregiver carryover.",
  nextAction: "Reassess shower transfer safety before advancing the plan.",
  progressionConstraint: "Shower transfer assistance remains the progression constraint.",
  whyThisChanged: "A newly reported fall occurred during shower transfer.",
};

const evidenceInputs = {
  progressionState: {
    activeMilestones: ["Completed shower transfer with reduced verbal cueing"],
    activeBarriers: ["shower transfer assistance remains the progression constraint"],
    regressionRisks: ["recent fall during shower transfer"],
    reassessmentTriggers: ["fall history requires safety review"],
    caregiverDependencyState: "caregiver training remains necessary",
    environmentalLimitationState: "bathroom setup partially limits performance",
  },
  longitudinalState: {
    lastUpdatedAt: "2026-06-09T12:00:00.000Z",
    currentDominantBarrier: "shower transfer assistance remains the progression constraint",
    functionalChanges: [
      "Shower transfer improved from maximal to moderate assistance",
      "Caregiver cueing burden reduced during bathing setup",
      maintainedConclusions.whyThisChanged,
    ],
    milestoneAchieved: "Completed shower transfer with reduced verbal cueing",
  },
  visitHistory: [
    {
      created_at: "2026-06-09T12:00:00.000Z",
      event_payload: {
        functionalChanges: ["Shower transfer improved from maximal to moderate assistance"],
        milestoneAchieved: "Completed shower transfer with reduced verbal cueing",
      },
    },
    {
      created_at: "2026-06-02T12:00:00.000Z",
      event_payload: { functionalChanges: ["Bathing performance remained stable"] },
    },
  ],
  clinicalDecisionModel: { safetyRiskLevel: "high" },
  continuityInterpretation: { continuityAlerts: ["Recent fall affects safe progression"] },
};

test("A: builder returns compact output within defined limits", () => {
  const result = buildProgressEvidence(evidenceInputs);

  assert.ok(result.timeframe);
  assert.ok(result.improved.length <= 2);
  assert.ok(result.milestones.length <= 2);
  assert.ok(result.stillLimiting.length <= 2);
  assert.ok(result.safetyConsiderations.length <= 2);
  assert.match(result.timeframe, /June 2, 2026 through June 9, 2026/);
});

test("B: objective improvement appears when longitudinal data supports it", () => {
  const result = buildProgressEvidence(evidenceInputs);

  assert.ok(result.improved.length > 0);
  assert.equal(result.improved[0].label, "Shower transfer assistance");
  assert.match(result.improved[0].explanation, /lower assistance level/i);
  assert.ok(result.improved[0].rawSource);
});

test("caregiver and environmental improvements are translated into clinician-facing evidence", () => {
  const result = buildProgressEvidence({
    longitudinalState: {
      caregiverChange: "Caregiver cueing burden reduced across morning care",
      environmentalChange: "Bathroom setup barrier reduced after equipment installation",
    },
  });

  assert.ok(result.improved.some((item) => item.label === "Caregiver support burden"));
  assert.ok(result.improved.some((item) => item.label === "Environmental access"));
});

test("C: milestones appear only when milestone signals exist", () => {
  const withMilestone = buildProgressEvidence(evidenceInputs);
  const withoutMilestone = buildProgressEvidence({
    ...evidenceInputs,
    progressionState: {
      ...evidenceInputs.progressionState,
      activeMilestones: ["Safer shower transfer participation"],
    },
    longitudinalState: { ...evidenceInputs.longitudinalState, milestoneAchieved: null },
    visitHistory: evidenceInputs.visitHistory.map((visit) => ({
      ...visit,
      event_payload: { functionalChanges: visit.event_payload.functionalChanges },
    })),
  });

  assert.ok(withMilestone.milestones.length > 0);
  assert.deepEqual(withoutMilestone.milestones, []);
});

test("D: functional, caregiver, and environmental constraints can remain visible", () => {
  const result = buildProgressEvidence(evidenceInputs);

  assert.ok(result.stillLimiting.length > 0);
  assert.ok(result.stillLimiting.some((item) => /support need|caregiver|environment/i.test(item.label)));
  assert.ok(result.stillLimiting.every((item) => /remain|continues/i.test(item.explanation)));
});

test("E: falls, near-falls, and regression produce safety considerations", () => {
  const fallResult = buildProgressEvidence(evidenceInputs);
  const nearFallResult = buildProgressEvidence({
    longitudinalState: { functionalChanges: ["New near-fall during toilet transfer"] },
  });
  const regressionResult = buildProgressEvidence({
    progressionState: { regressionRisks: ["Regression with increased assistance"] },
  });

  assert.match(fallResult.safetyConsiderations[0].label, /fall/i);
  assert.equal(nearFallResult.safetyConsiderations[0].label, "Near-fall risk");
  assert.equal(regressionResult.safetyConsiderations[0].label, "Recent setback");
});

test("F: display language does not duplicate Progression Constraint or Why This Changed verbatim", () => {
  const result = buildProgressEvidence(evidenceInputs);
  const displayText = [
    result.timeframe,
    ...result.improved.flatMap(({ label, explanation }) => [label, explanation]),
    ...result.milestones.flatMap(({ label, explanation }) => [label, explanation]),
    ...result.stillLimiting.flatMap(({ label, explanation }) => [label, explanation]),
    ...result.safetyConsiderations.flatMap(({ label, explanation }) => [label, explanation]),
  ].join(" ");

  assert.doesNotMatch(displayText, new RegExp(maintainedConclusions.progressionConstraint, "i"));
  assert.doesNotMatch(displayText, new RegExp(maintainedConclusions.whyThisChanged, "i"));
});

test("G: output is deterministic for the same inputs", () => {
  assert.deepEqual(buildProgressEvidence(evidenceInputs), buildProgressEvidence(evidenceInputs));
});

test("H: maintained conclusions remain unchanged", () => {
  const before = structuredClone(maintainedConclusions);
  buildProgressEvidence({ ...evidenceInputs, clinicalDecisionModel: maintainedConclusions });
  assert.deepEqual(maintainedConclusions, before);
});

test("returns fewer sections when reliable evidence is absent", () => {
  const result = buildProgressEvidence({});

  assert.deepEqual(result.improved, []);
  assert.deepEqual(result.milestones, []);
  assert.deepEqual(result.stillLimiting, []);
  assert.deepEqual(result.safetyConsiderations, []);
});
