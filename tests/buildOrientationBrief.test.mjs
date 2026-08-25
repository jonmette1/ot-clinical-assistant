import assert from "node:assert/strict";
import test from "node:test";

import { buildOrientationBrief } from "../src/lib/buildOrientationBrief.ts";

const maintainedAssets = {
  quickOrientationSummary:
    "At this reassessment, bathing participation is improving while transfer safety remains limited.",
  currentFocus:
    "Prioritize safe shower transfer performance and caregiver carryover.",
  sessionFocus: {
    headline:
      "Validate safety consistency during shower transfers and determine whether current support remains appropriate.",
    sessionIntent: "validate",
    rationale:
      "Safety should be confirmed under routine conditions before support or progression expectations change.",
    focusTargets: ["Shower transfer safety", "Caregiver support level"],
  },
  attentionRequired:
    "Recent fall concerns should be reviewed before progression decisions are made.",
  progressionConstraint: {
    headline:
      "Bathing participation continues to improve, but transfer safety remains the primary limitation.",
    summary:
      "Improvement is present, but safety and support demands still limit progression.",
    unresolvedLimitation: {
      label: "Transfer safety",
      explanation: "A recent fall-related signal remains unresolved.",
      clinicalImpact: "Review safety before advancement.",
    },
    whatImproved: [],
    whatStillBlocksProgression: [
      {
        label: "Shower transfer assistance",
        explanation: "Moderate assistance remains necessary.",
      },
    ],
    whyRecommendationRemainsAppropriate:
      "The maintained recommendation remains appropriate.",
  },
};

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

test("A: Orientation Brief is deterministic", () => {
  assert.deepEqual(
    buildOrientationBrief(maintainedAssets),
    buildOrientationBrief(maintainedAssets)
  );
});

test("B and C: brief remains within spoken length and duration targets", () => {
  const result = buildOrientationBrief(maintainedAssets);
  const words = wordCount(result.briefText);

  assert.ok(words >= 50, `expected at least 50 words, received ${words}`);
  assert.ok(words <= 90, `expected no more than 90 words, received ${words}`);
  assert.ok(result.estimatedDurationSeconds >= 20);
  assert.ok(result.estimatedDurationSeconds <= 30);
});

test("D and E: maintained session focus and current clinical context appear", () => {
  const result = buildOrientationBrief(maintainedAssets);

  assert.match(result.sections.context, /Bathing participation continues to improve/i);
  assert.match(result.sections.context, /safe shower transfer performance/i);
  assert.match(result.sections.sessionFocus, /Validate safety consistency/i);
  assert.match(result.briefText, /For today’s visit/i);
});

test("F: Attention Required is included only when meaningful", () => {
  const active = buildOrientationBrief(maintainedAssets);
  const inactive = buildOrientationBrief({
    ...maintainedAssets,
    attentionRequired:
      "No active review need was identified from the latest progression check.",
  });

  assert.match(active.sections.attentionRequired, /Recent fall concerns/i);
  assert.match(active.briefText, /Recent fall concerns/i);
  assert.equal(inactive.sections.attentionRequired, undefined);
  assert.doesNotMatch(inactive.briefText, /No active review need/i);
});

test("G and H: raw evidence, milestones, history, and snapshots cannot enter the brief", () => {
  const result = buildOrientationBrief({
    ...maintainedAssets,
    progressEvidence: {
      milestones: [{ label: "RAW MILESTONE", explanation: "DO NOT SHOW" }],
    },
    visitHistory: [{ note: "RAW VISIT HISTORY" }],
    historicalSnapshots: [{ summary: "RAW SNAPSHOT" }],
    rawPatientUpdates: ["RAW PATIENT UPDATE"],
  });

  assert.doesNotMatch(result.briefText, /RAW|MILESTONE|DO NOT SHOW/i);
});

test("I: brief does not duplicate the full reassessment summary", () => {
  const fullReassessmentSummary = [
    maintainedAssets.quickOrientationSummary,
    "Progress observed includes reduced assistance and improved caregiver cueing.",
    "Remaining limitations include safety variability and environmental barriers.",
    "The current recommendation remains appropriate because the constraint is unresolved.",
    "Continue the current plan and reassess before advancement.",
  ].join("\n\n");
  const result = buildOrientationBrief({
    ...maintainedAssets,
    quickOrientationSummary: fullReassessmentSummary,
  });

  assert.notEqual(result.briefText, fullReassessmentSummary);
  assert.doesNotMatch(result.briefText, /Progress observed includes/i);
  assert.doesNotMatch(result.briefText, /environmental barriers/i);
});

test("J: maintained inputs remain unchanged", () => {
  const before = structuredClone(maintainedAssets);

  buildOrientationBrief(maintainedAssets);

  assert.deepEqual(maintainedAssets, before);
});

test("sparse maintained assets still produce a 20–30 second orientation", () => {
  const result = buildOrientationBrief({
    currentFocus: "Safe transfers.",
    sessionFocus: "Practice transfers.",
    attentionRequired: "No active review need.",
  });

  assert.ok(wordCount(result.briefText) >= 50);
  assert.ok(wordCount(result.briefText) <= 90);
  assert.ok(result.estimatedDurationSeconds >= 20);
  assert.ok(result.estimatedDurationSeconds <= 30);
});
