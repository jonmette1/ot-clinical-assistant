import assert from "node:assert/strict";
import test from "node:test";

import { buildReassessmentSummary } from "../src/lib/buildReassessmentSummary.ts";

const maintainedAssets = {
  currentFocus: "Prioritize safe shower transfer performance and caregiver carryover.",
  attentionRequired: "Monitor transfer safety following a recent fall and verify caregiver cueing consistency.",
  nextAction: "Reassess shower transfer safety and assistance level before advancing the home program.",
  changeExplanation: {
    conclusionType: "current_focus",
    explanationType: "deferred",
    summary:
      "Improvement is present, but a safety concern prevents the current focus from advancing further.",
    factors: [],
  },
  progressionConstraint: {
    headline: "Shower transfer performance improved, but safety margin still limits advancement.",
    summary:
      "Meaningful improvement is present, but unresolved safety and support demands still prevent automatic advancement.",
    unresolvedLimitation: {
      label: "Safety margin",
      explanation:
        "A recent fall-related signal keeps shower transfer performance below the threshold for safe independent progression.",
      clinicalImpact: "Safety should be reviewed before advancement.",
    },
    whatImproved: [],
    whatStillBlocksProgression: [
      {
        label: "Shower transfer assistance",
        explanation: "Moderate assistance remains necessary for reliable task completion.",
      },
    ],
    whyRecommendationRemainsAppropriate:
      "The current recommendation remains appropriate because documented improvement does not yet outweigh the unresolved safety constraint.",
  },
  progressEvidence: {
    timeframe: "June 2, 2026 through June 9, 2026",
    improved: [
      {
        label: "Shower transfer assistance",
        explanation: "Performance improved from maximal to moderate assistance.",
      },
      {
        label: "Caregiver support burden",
        explanation: "Caregiver cueing was reduced during bathing setup.",
      },
    ],
    milestones: [
      {
        label: "Shower transfer milestone",
        explanation: "The patient completed the transfer with fewer verbal cues.",
      },
    ],
    stillLimiting: [],
    safetyConsiderations: [],
  },
};

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

test("A: summary consumes maintained assets only and ignores raw history-like extras", () => {
  const baseline = buildReassessmentSummary(maintainedAssets);
  const withDisallowedExtras = buildReassessmentSummary({
    ...maintainedAssets,
    visitHistory: [{ note: "Contradictory historical note" }],
    snapshots: [{ summary: "Contradictory snapshot" }],
    chartReview: "Contradictory chart review",
  });

  assert.deepEqual(withDisallowedExtras, baseline);
  assert.doesNotMatch(baseline.summary, /contradictory/i);
});

test("B: progress observed is grounded in Progress Evidence", () => {
  const result = buildReassessmentSummary(maintainedAssets);

  assert.match(result.sections.progressObserved, /Shower transfer assistance/i);
  assert.match(result.sections.progressObserved, /maximal to moderate assistance/i);
  assert.match(result.sections.progressObserved, /Caregiver support burden/i);
});

test("C: remaining limitations are grounded in Progression Constraint", () => {
  const result = buildReassessmentSummary(maintainedAssets);

  assert.match(result.sections.remainingLimitations, /Safety margin/i);
  assert.match(result.sections.remainingLimitations, /recent fall-related signal/i);
});

test("D: recommendation preserves Next Action", () => {
  const result = buildReassessmentSummary(maintainedAssets);

  assert.equal(result.sections.recommendation, maintainedAssets.nextAction);
});

test("E: output is deterministic", () => {
  assert.deepEqual(
    buildReassessmentSummary(maintainedAssets),
    buildReassessmentSummary(maintainedAssets)
  );
});

test("F: complete summary remains within the concise reassessment target", () => {
  const result = buildReassessmentSummary(maintainedAssets);
  const words = wordCount(result.summary);

  assert.ok(words >= 150, `expected at least 150 words, received ${words}`);
  assert.ok(words <= 250, `expected at most 250 words, received ${words}`);
});

test("G: summary preserves maintained clinical logic without history reconstruction", () => {
  const result = buildReassessmentSummary(maintainedAssets);

  assert.match(result.sections.currentStatus, /safe shower transfer performance/i);
  assert.match(result.sections.progressObserved, /safety concern prevents/i);
  assert.match(result.sections.rationaleForContinuedFocus, /remains appropriate/i);
  assert.match(result.sections.rationaleForContinuedFocus, /unresolved safety constraint/i);
  assert.match(result.sections.recommendation, /before advancing/i);
});
