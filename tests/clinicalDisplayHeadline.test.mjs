import assert from "node:assert/strict";
import test from "node:test";

import { buildCurrentFocusHeadline } from "../src/lib/clinicalDisplayHeadline.ts";

function wordCount(value) {
  return value.replace(/…$/, "").trim().split(/\s+/).filter(Boolean).length;
}

test("keeps an already compact Current Focus conclusion unchanged", () => {
  const focus = "Prioritize safe shower transfers while caregiver cueing remains inconsistent.";

  assert.equal(buildCurrentFocusHeadline(focus), focus);
});

test("uses a complete 12-20 word opening sentence when available", () => {
  const focus =
    "Prioritize safe shower transfer performance while the caregiver establishes consistent cueing across daily routines. Additional clinical detail remains available below for verification during treatment planning.";

  assert.equal(
    buildCurrentFocusHeadline(focus),
    "Prioritize safe shower transfer performance while the caregiver establishes consistent cueing across daily routines."
  );
});

test("caps long Current Focus headlines at 20 words without mutating the source conclusion", () => {
  const focus =
    "Prioritize safe and repeatable shower transfer performance across variable bathroom conditions while reducing caregiver physical assistance and maintaining consistent patient sequencing throughout the complete bathing routine.";
  const headline = buildCurrentFocusHeadline(focus);

  assert.equal(wordCount(headline), 20);
  assert.match(headline, /…$/);
  assert.match(focus, /complete bathing routine\.$/);
});
