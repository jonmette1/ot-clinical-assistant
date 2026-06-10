import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspacePath = new URL(
  "../src/app/cases/[id]/CaseWorkspaceClient.tsx",
  import.meta.url
);
const reassessmentPath = new URL(
  "../src/app/cases/[id]/components/ReassessmentSummarySection.tsx",
  import.meta.url
);
const constraintPath = new URL(
  "../src/app/cases/[id]/components/ConstraintProgressionNarrativeSection.tsx",
  import.meta.url
);
const evidencePath = new URL(
  "../src/app/cases/[id]/components/ProgressEvidenceSection.tsx",
  import.meta.url
);

async function briefingSource() {
  const [workspace, reassessment, constraint, evidence] = await Promise.all([
    readFile(workspacePath, "utf8"),
    readFile(reassessmentPath, "utf8"),
    readFile(constraintPath, "utf8"),
    readFile(evidencePath, "utf8"),
  ]);

  return `${workspace}\n${reassessment}\n${constraint}\n${evidence}`;
}

test("Visit Briefing renders the validated 1-8 hierarchy", async () => {
  const source = await briefingSource();
  const workspace = await readFile(workspacePath, "utf8");
  const labels = [
    "1. Reassessment Summary",
    "2. Current Focus",
    "3. Attention Required",
    "4. Next Action",
    "5. Progression Constraint",
    "6. Progress Evidence",
    "7. Why This Changed",
    "8. Supporting Evidence",
  ];

  for (const label of labels) assert.match(source, new RegExp(label.replace(".", "\\.")));

  const renderedOrder = [
    workspace.indexOf("<ReassessmentSummarySection"),
    workspace.indexOf("2. Current Focus"),
    workspace.indexOf("3. Attention Required"),
    workspace.indexOf("4. Next Action"),
    workspace.indexOf("<ConstraintProgressionNarrativeSection"),
    workspace.indexOf("<ProgressEvidenceSection"),
    workspace.indexOf("7. Why This Changed"),
    workspace.indexOf("8. Supporting Evidence"),
  ];

  assert.ok(renderedOrder.every((position) => position >= 0));
  assert.deepEqual(renderedOrder, [...renderedOrder].sort((a, b) => a - b));
});

test("Review Flag and Reassessment Flag are not rendered as Visit Briefing metadata", async () => {
  const source = await readFile(workspacePath, "utf8");

  assert.doesNotMatch(source, /label:\s*["']Review flag["']/i);
  assert.doesNotMatch(source, /label:\s*["']Reassessment flag["']/i);
});

test("deep inspection follows progression sections and remains collapsed", async () => {
  const source = await readFile(workspacePath, "utf8");
  const constraint = source.indexOf("<ConstraintProgressionNarrativeSection");
  const progress = source.indexOf("<ProgressEvidenceSection");
  const whyChanged = source.indexOf("7. Why This Changed");
  const supportingEvidence = source.indexOf("8. Supporting Evidence");

  assert.ok(constraint < progress);
  assert.ok(progress < whyChanged);
  assert.ok(whyChanged < supportingEvidence);
  assert.match(source, /<ConclusionChangeExplanationSection/);
  assert.match(source, /<ConclusionEvidenceSection/);
});

test("compact Current Focus headline retains the complete maintained conclusion below", async () => {
  const source = await readFile(workspacePath, "utf8");

  assert.match(source, /\{commandCenterCurrentFocusHeadline\}/);
  assert.match(
    source,
    /commandCenterCurrentFocusHeadline !== commandCenterCurrentOperationalEmphasis/
  );
  assert.match(source, /\{commandCenterCurrentOperationalEmphasis\}/);
});
