import assert from "node:assert/strict";
import test from "node:test";
import { buildSessionFocus } from "../src/lib/buildSessionFocus.ts";

const maintainedConclusions = {
  currentFocus: "Improve shower transfer participation while reducing assistance.",
  attentionRequired: "Monitor current shower transfer support needs.",
  nextAction: "Continue the current transfer emphasis at the next visit.",
};

const baseInput = {
  ...maintainedConclusions,
  progressionConstraint: {
    headline: "Transfer support remains relevant",
    summary: "Assistance remains necessary during the target activity.",
    whatImproved: [],
    whatStillBlocksProgression: [],
    whyRecommendationRemainsAppropriate: "The maintained emphasis remains appropriate.",
  },
  progressEvidence: {
    timeframe: "Recent visits",
    improved: [],
    milestones: [],
    stillLimiting: [],
    safetyConsiderations: [],
  },
};

function displayText(result) {
  return [result.headline, result.rationale, ...result.focusTargets].join(" ");
}

test("A: builder returns deterministic runtime-only output", () => {
  const first = buildSessionFocus(baseInput);
  const second = buildSessionFocus(structuredClone(baseInput));

  assert.deepEqual(first, second);
  assert.ok(first.headline);
  assert.ok(first.rationale);
  assert.ok(first.focusTargets.length > 0 && first.focusTargets.length <= 3);
});

test("B: safety concerns generate validate-oriented Session Focus", () => {
  const result = buildSessionFocus({
    ...baseInput,
    clinicalDecisionModel: { safetyRiskLevel: "high" },
    progressEvidence: {
      ...baseInput.progressEvidence,
      safetyConsiderations: [
        { label: "Recent near-fall", explanation: "A near-fall occurred during shower transfer." },
      ],
    },
  });

  assert.equal(result.sessionIntent, "validate");
  assert.match(result.headline, /validate safety consistency/i);
  assert.match(result.headline, /shower transfer/i);
});

test("C: deferred advancement with progress generates consistency and readiness verification", () => {
  const result = buildSessionFocus({
    ...baseInput,
    progressionConstraint: {
      ...baseInput.progressionConstraint,
      summary: "Advancement is deferred until performance is consistent across routine visits.",
    },
    progressEvidence: {
      ...baseInput.progressEvidence,
      improved: [
        { label: "Shower transfer assistance", explanation: "Assistance reduced during the last visit." },
      ],
    },
  });

  assert.equal(result.sessionIntent, "observe");
  assert.match(result.headline, /confirm.*consistent.*progression-ready/i);
  assert.match(result.rationale, /before advancement/i);
});

test("D: caregiver constraints generate caregiver training and reassessment focus", () => {
  const result = buildSessionFocus({
    ...baseInput,
    progressionConstraint: {
      ...baseInput.progressionConstraint,
      whatStillBlocksProgression: [
        { label: "Caregiver carryover", explanation: "Caregiver cueing remains inconsistent." },
      ],
    },
  });

  assert.equal(result.sessionIntent, "train");
  assert.match(result.headline, /train caregiver support/i);
  assert.match(result.headline, /reassess.*cueing or assistance/i);
});

test("E: environmental constraints generate environment review focus", () => {
  const result = buildSessionFocus({
    ...baseInput,
    progressionConstraint: {
      ...baseInput.progressionConstraint,
      whatStillBlocksProgression: [
        { label: "Bathroom setup", explanation: "Bathroom setup and shower chair placement remain limiting." },
      ],
    },
  });

  assert.equal(result.sessionIntent, "modify_environment");
  assert.match(result.headline, /review the routine setup/i);
  assert.match(result.rationale, /environment or equipment/i);
});

test("F: no active concern continues the plan without false urgency", () => {
  const result = buildSessionFocus(baseInput);

  assert.equal(result.sessionIntent, "continue_plan");
  assert.match(result.headline, /^Continue reinforcing/i);
  assert.match(result.rationale, /without added urgency/i);
  assert.doesNotMatch(displayText(result), /urgent|immediate|critical/i);
});

test("G: Session Focus does not duplicate maintained conclusions verbatim", () => {
  const result = buildSessionFocus({
    ...baseInput,
    longitudinalState: { caregiverChange: "Caregiver cueing remains relevant." },
  });
  const output = displayText(result);

  for (const conclusion of Object.values(maintainedConclusions)) {
    assert.ok(!output.includes(conclusion));
  }
});

test("H: maintained Current Focus, Attention Required, and Next Action inputs remain unchanged", () => {
  const input = structuredClone(baseInput);
  const before = structuredClone(input);

  buildSessionFocus(input);

  assert.deepEqual(input, before);
});
