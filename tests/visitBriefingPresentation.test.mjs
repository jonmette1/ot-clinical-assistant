import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspacePath = new URL(
  "../src/app/cases/[id]/CaseWorkspaceClient.tsx",
  import.meta.url
);
const orientationPath = new URL(
  "../src/app/cases/[id]/components/ReassessmentSummarySection.tsx",
  import.meta.url
);
const changeExplanationPath = new URL(
  "../src/app/cases/[id]/components/ConclusionChangeExplanationSection.tsx",
  import.meta.url
);
const supportingEvidencePath = new URL(
  "../src/app/cases/[id]/components/ConclusionEvidenceSection.tsx",
  import.meta.url
);

async function readSource(path) {
  return readFile(path, "utf8");
}

function conclusionArticle(workspace, label, nextLabel) {
  const start = workspace.indexOf(label);
  const end = nextLabel ? workspace.indexOf(nextLabel, start + label.length) : workspace.indexOf("</article>", start);
  assert.ok(start >= 0, `${label} was not found`);
  assert.ok(end > start, `${label} article boundary was not found`);
  return workspace.slice(start, end);
}

test("Quick Orientation Summary is collapsed with the validated description and CTA", async () => {
  const source = await readSource(orientationPath);

  assert.match(source, /<details className=/);
  assert.doesNotMatch(source, /<details[^>]*\sopen(?:=|\s|>)/);
  assert.match(source, /Quick Orientation Summary/);
  assert.match(
    source,
    /30-second overview of current status, progress, remaining limitations, and recommendation\./
  );
  assert.match(source, /Show Summary/);
});

test("expanded orientation renders every existing reassessment summary section unchanged", async () => {
  const source = await readSource(orientationPath);
  const sectionKeys = [
    "currentStatus",
    "progressObserved",
    "remainingLimitations",
    "rationaleForContinuedFocus",
    "recommendation",
  ];

  for (const key of sectionKeys) {
    assert.match(source, new RegExp(`reassessment\\.sections\\[key\\]`));
    assert.match(source, new RegExp(`\\["${key}"`));
  }
});

test("each maintained conclusion owns local collapsed trust disclosures", async () => {
  const workspace = await readSource(workspacePath);
  const currentFocus = conclusionArticle(workspace, "Current Focus", "Attention Required");
  const attentionRequired = conclusionArticle(workspace, "Attention Required", "Next Action");
  const nextAction = conclusionArticle(workspace, "Next Action", null);

  const expected = [
    [currentFocus, "Current Focus", "current_focus", "currentFocusEvidence"],
    [attentionRequired, "Attention Required", "attention_required", "attentionRequiredEvidence"],
    [nextAction, "Next Action", "next_action", "nextActionEvidence"],
  ];

  for (const [article, label, explanationKey, evidenceName] of expected) {
    assert.match(article, /<ConclusionChangeExplanationSection/);
    assert.match(article, new RegExp(`conclusionLabel="${label}"`));
    assert.match(article, new RegExp(`conclusionChangeExplanations\\.${explanationKey}`));
    assert.match(article, /<ConclusionEvidenceSection/);
    assert.match(article, new RegExp(`evidence=\\{${evidenceName}\\}`));
  }
});

test("trust components remain collapsed and use clinician-facing labels", async () => {
  const [changeSource, evidenceSource] = await Promise.all([
    readSource(changeExplanationPath),
    readSource(supportingEvidencePath),
  ]);

  assert.match(changeSource, /<details className=/);
  assert.doesNotMatch(changeSource, /<details[^>]*\sopen(?:=|\s|>)/);
  assert.match(changeSource, /Why This Changed/);
  assert.match(evidenceSource, /<details className=/);
  assert.doesNotMatch(evidenceSource, /<details[^>]*\sopen(?:=|\s|>)/);
  assert.match(evidenceSource, /Supporting Evidence/);
});

test("standalone global verification sections are removed", async () => {
  const workspace = await readSource(workspacePath);

  assert.doesNotMatch(workspace, />\s*7\. Why This Changed\s*</);
  assert.doesNotMatch(workspace, />\s*8\. Supporting Evidence\s*</);
  assert.equal((workspace.match(/<ConclusionChangeExplanationSection/g) || []).length, 3);
  assert.equal((workspace.match(/<ConclusionEvidenceSection/g) || []).length, 3);
});

test("Review Flag and Reassessment Flag remain absent from briefing metadata", async () => {
  const workspace = await readSource(workspacePath);

  assert.doesNotMatch(workspace, /label:\s*["']Review flag["']/i);
  assert.doesNotMatch(workspace, /label:\s*["']Reassessment flag["']/i);
});

test("compact Current Focus headline retains the complete maintained conclusion below", async () => {
  const workspace = await readSource(workspacePath);

  assert.match(workspace, /\{commandCenterCurrentFocusHeadline\}/);
  assert.match(
    workspace,
    /commandCenterCurrentFocusHeadline !== commandCenterCurrentOperationalEmphasis/
  );
  assert.match(workspace, /\{commandCenterCurrentOperationalEmphasis\}/);
});

test("Session Focus renders between Current Focus and Attention Required with intended content", async () => {
  const workspace = await readSource(workspacePath);
  const currentFocusIndex = workspace.indexOf("Current Focus");
  const sessionFocusIndex = workspace.indexOf("Session Focus", currentFocusIndex);
  const attentionRequiredIndex = workspace.indexOf("Attention Required", sessionFocusIndex);

  assert.ok(currentFocusIndex >= 0);
  assert.ok(sessionFocusIndex > currentFocusIndex);
  assert.ok(attentionRequiredIndex > sessionFocusIndex);

  const sessionFocusArticle = workspace.slice(sessionFocusIndex, attentionRequiredIndex);
  assert.match(
    sessionFocusArticle,
    /What today’s visit should actively validate, observe, train, or address\./
  );
  assert.match(sessionFocusArticle, /\{sessionFocus\.headline\}/);
  assert.match(sessionFocusArticle, /\{sessionFocus\.rationale\}/);
  assert.match(sessionFocusArticle, /sessionFocus\.focusTargets\.slice\(0, 3\)/);
});
