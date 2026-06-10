import assert from "node:assert/strict";
import test from "node:test";

import {
  buildConclusionChangeExplanation,
  buildConclusionChangeExplanationSet,
} from "../src/lib/buildConclusionChangeExplanation.ts";

const conclusions = {
  current_focus: "Prioritize safe shower transfer performance.",
  attention_required: "Monitor transfer safety and caregiver carryover.",
  next_action: "Reassess shower transfer safety before advancing the plan.",
};

const improvingInputs = {
  progressionState: {
    advancementReadiness: "partial",
    activeMilestones: ["Completed shower setup with fewer cues"],
    activeBarriers: ["shower transfer limitation"],
    reassessmentTriggers: [],
  },
  longitudinalState: {
    progressionStatus: "progressing as expected",
    treatmentDirectionChanged: false,
  },
  visitHistory: [
    {
      event_payload: {
        functionalChanges: ["Shower transfer improved from maximal to moderate assistance"],
        progressionStatus: "progressing as expected",
        treatmentDirectionChanged: false,
      },
      previous_state_snapshot: {
        currentDominantBarrier: "shower transfer limitation",
      },
      current_state_snapshot: {
        currentDominantBarrier: "shower transfer limitation",
      },
    },
  ],
};

function buildSet(overrides = {}) {
  return buildConclusionChangeExplanationSet({
    ...improvingInputs,
    ...overrides,
    conclusions,
  });
}

test("A: returns no more than three change factors per maintained conclusion", () => {
  const result = buildSet({
    progressionState: {
      ...improvingInputs.progressionState,
      reassessmentTriggers: ["fall history requires safety review"],
    },
    visitHistory: [
      {
        event_payload: {
          functionalChanges: [
            "Shower transfer improved from maximal to moderate assistance",
            "New near fall during shower transfer",
          ],
          treatmentDirectionChanged: true,
        },
      },
    ],
  });

  for (const explanation of Object.values(result)) {
    assert.ok(explanation.factors.length <= 3);
  }
});

test("B: improvement signals generate progression-oriented explanations", () => {
  const result = buildConclusionChangeExplanation({
    ...improvingInputs,
    conclusionType: "current_focus",
    conclusion: conclusions.current_focus,
  });

  assert.equal(result.explanationType, "progressing");
  assert.ok(result.factors.some((factor) => factor.changeType === "improved"));
  assert.match(result.summary, /improvement|advance/i);
});

test("C: safety events suppress progression and produce deferred explanations", () => {
  const result = buildConclusionChangeExplanation({
    ...improvingInputs,
    progressionState: {
      ...improvingInputs.progressionState,
      reassessmentTriggers: ["new fall requires safety review"],
    },
    visitHistory: [
      {
        event_payload: {
          functionalChanges: [
            "Transfer performance improved with fewer cues",
            "A new fall occurred during shower transfer",
          ],
          treatmentDirectionChanged: false,
        },
      },
    ],
    conclusionType: "next_action",
    conclusion: conclusions.next_action,
  });

  assert.equal(result.explanationType, "deferred");
  assert.ok(result.factors.some((factor) => factor.factorLabel === "New safety event"));
  assert.match(result.summary, /prevents.*advancing|deferred/i);
});

test("D: stable conclusions produce stable explanations", () => {
  const result = buildConclusionChangeExplanation({
    conclusionType: "attention_required",
    conclusion: conclusions.attention_required,
    progressionState: {},
    longitudinalState: {
      progressionStatus: "no meaningful change",
      treatmentDirectionChanged: false,
    },
    visitHistory: [],
  });

  assert.equal(result.explanationType, "stable");
  assert.ok(result.factors.some((factor) => factor.changeType === "unchanged"));
  assert.match(result.summary, /remains appropriate|no meaningful new evidence/i);
});

test("E: explanations interpret change instead of repeating supporting evidence verbatim", () => {
  const supportingEvidence = "Shower transfer improved from maximal to moderate assistance";
  const result = buildConclusionChangeExplanation({
    ...improvingInputs,
    visitHistory: [{ event_payload: { functionalChanges: [supportingEvidence] } }],
    conclusionType: "current_focus",
    conclusion: conclusions.current_focus,
  });
  const renderedExplanation = [
    result.summary,
    ...result.factors.flatMap((factor) => [factor.explanation, factor.clinicalImpact]),
  ].join(" ");

  assert.doesNotMatch(renderedExplanation, new RegExp(supportingEvidence, "i"));
  assert.match(renderedExplanation, /compared with the prior status/i);
});

test("F: explanation building does not modify maintained conclusions", () => {
  const before = structuredClone(conclusions);
  buildSet();
  assert.deepEqual(conclusions, before);
});

test("G: explanation output remains deterministic", () => {
  const first = buildSet();
  const second = buildSet();
  assert.deepEqual(first, second);
});
