import assert from "node:assert/strict";
import test from "node:test";

import { buildAttentionRequiredHeadline } from "./buildAttentionRequiredHeadline.ts";

test("milestone language is replaced by transfer verification guidance", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement:
      "Progression milestone achieved: Completes shower transfer with supervision and caregiver standby assistance.",
    milestoneAchieved:
      "Completes shower transfer with supervision and caregiver standby assistance",
  });

  assert.equal(
    headline,
    "Transfer consistency should be verified before progression decisions."
  );
  assert.doesNotMatch(headline, /milestone|achieved/i);
});

test("improvement language is replaced by routine-condition confirmation guidance", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement: "Patient demonstrates improved bathing participation.",
    functionalChanges: ["Improved bathing participation"],
  });

  assert.equal(
    headline,
    "Recent improvement should be confirmed under routine conditions before reducing support."
  );
  assert.doesNotMatch(headline, /patient demonstrates|improved bathing participation/i);
});

test("safety review overrides milestone language", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement: "Progression milestone achieved: shower transfer completed.",
    attentionDrivers: ["Near fall during shower transfer"],
    milestoneAchieved: "Shower transfer completed",
  });

  assert.equal(
    headline,
    "Recent safety concern should be reviewed before advancing the plan."
  );
});

test("progression verification is used when improvement requires confirmation", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement: "Improved transfer performance observed.",
    progressionStatus: "Progressing Faster Than Expected",
  });

  assert.equal(
    headline,
    "Transfer consistency should be verified before progression decisions."
  );
});

test("caregiver-dependent advancement produces caregiver review guidance", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement: "Milestone achieved: reduced caregiver cueing.",
    milestoneAchieved: "Reduced caregiver cueing",
    caregiverChange: "Caregiver now provides fewer cues",
  });

  assert.equal(
    headline,
    "Caregiver support needs should be reassessed before advancing independence expectations."
  );
});

test("environment-dependent advancement produces setup review guidance", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement: "Improved bathing participation.",
    environmentalChange: "Bathroom grab bar is not installed",
    functionalChanges: ["Improved bathing participation"],
  });

  assert.equal(
    headline,
    "Bathroom setup should be reviewed before increasing bathing independence expectations."
  );
});

test("existing review-oriented headlines remain unchanged", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement:
      "Caregiver support requirements should be reassessed before changing supervision or task demands.",
    category: "Caregiver",
  });

  assert.equal(
    headline,
    "Caregiver support requirements should be reassessed before changing supervision or task demands."
  );
  assert.match(headline, /should be reassessed/i);
});

test("neutral no-review headline and styling signal remain stable", () => {
  const headline = buildAttentionRequiredHeadline({
    attentionStatement:
      "No active review need was identified from the latest progression check.",
    milestoneAchieved: "Completes shower transfer with supervision",
  });

  assert.equal(
    headline,
    "No active review need was identified from the latest progression check."
  );
});

test("headline is deterministic and always expresses a review action", () => {
  const input = {
    attentionStatement: "Patient demonstrates improved meal preparation participation.",
    functionalChanges: ["Improved meal preparation participation"],
  };

  const first = buildAttentionRequiredHeadline(input);
  const second = buildAttentionRequiredHeadline(input);

  assert.equal(first, second);
  assert.match(first, /\b(verified|reviewed|reassessed|confirmed)\b/i);
});
