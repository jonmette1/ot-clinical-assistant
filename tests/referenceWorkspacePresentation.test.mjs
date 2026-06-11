import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspacePath = new URL(
  "../src/app/cases/[id]/CaseWorkspaceClient.tsx",
  import.meta.url
);
const stickyHeaderPath = new URL(
  "../src/app/cases/[id]/components/StickyOperationalHeader.tsx",
  import.meta.url
);

async function readSource(path) {
  return readFile(path, "utf8");
}

function referenceWorkspace(source) {
  const start = source.indexOf('{workspaceMode === "reference" && (');
  const end = source.indexOf("{/* CASE ACTION BUTTONS */}", start);

  assert.ok(start >= 0, "reference workspace boundary was not found");
  assert.ok(end > start, "reference workspace end boundary was not found");

  return source.slice(start, end);
}

function useCaseSection(source, key) {
  const marker = `data-reference-use-case="${key}"`;
  const start = source.indexOf(marker);
  const next = source.indexOf('data-reference-use-case="', start + marker.length);

  assert.ok(start >= 0, `${key} section was not found`);
  return source.slice(start, next === -1 ? source.length : next);
}

test("Case Details is framed as a clinical translation workspace", async () => {
  const workspace = referenceWorkspace(await readSource(workspacePath));

  assert.match(workspace, /Clinical Translation Workspace/);
  assert.match(
    workspace,
    /Use maintained clinical understanding to explain recommendations, guide support, coordinate care, and support documentation\./
  );
  assert.doesNotMatch(workspace, /Collapsed supporting information/);
  assert.doesNotMatch(workspace, /generated report content/);
  assert.doesNotMatch(workspace, />\s*Detail Modules\s*</);
  assert.doesNotMatch(workspace, /Patient History/);
});

test("translation use cases render in the approved order", async () => {
  const workspace = referenceWorkspace(await readSource(workspacePath));
  const headings = [
    "Caregiver Guidance",
    "Home &amp; Equipment Guidance",
    "Patient Guidance",
    "Family / Supporter Guidance",
    "Clinical Communication",
    "Documentation / QA Support",
  ];

  let previousIndex = -1;
  for (const heading of headings) {
    const index = workspace.indexOf(heading);
    assert.ok(index > previousIndex, `${heading} should follow the prior use case`);
    previousIndex = index;
  }
});

test("existing modules are placed under their matching translation use cases", async () => {
  const workspace = referenceWorkspace(await readSource(workspacePath));

  assert.match(useCaseSection(workspace, "caregiver-guidance"), /Family \/ Caregiver Script/);
  assert.match(
    useCaseSection(workspace, "home-equipment-guidance"),
    /Equipment & Feasibility Plan/
  );
  assert.match(
    useCaseSection(workspace, "patient-guidance"),
    /ADL Privacy & Dignity Support/
  );
  assert.match(
    useCaseSection(workspace, "clinical-communication"),
    /StructuredPlanDetails/
  );
  assert.match(
    useCaseSection(workspace, "clinical-communication"),
    /Transfer & Mobility Details/
  );
  assert.match(
    useCaseSection(workspace, "documentation-qa-support"),
    /SupportingProgressionSummaries/
  );
});

test("durable patient context remains lower-priority clinical reference", async () => {
  const workspace = referenceWorkspace(await readSource(workspacePath));
  const documentationIndex = workspace.indexOf("Documentation / QA Support");
  const referenceIndex = workspace.indexOf("Clinical Reference");
  const patientContextIndex = workspace.indexOf("Patient Context", referenceIndex);

  assert.ok(referenceIndex > documentationIndex);
  assert.ok(patientContextIndex > referenceIndex);
  assert.match(useCaseSection(workspace, "clinical-reference"), /HistoricalSnapshotsSection/);
});

test("required generation actions remain available but use subordinate framing", async () => {
  const workspace = referenceWorkspace(await readSource(workspacePath));

  assert.match(workspace, /handleGenerateCaregiverScript/);
  assert.match(workspace, /handleGenerateEquipmentFeasibility/);
  assert.match(workspace, /handleGenerateAdlPrivacy/);
  assert.match(workspace, /handleGenerateTransferDetails/);
  assert.doesNotMatch(workspace, /"Generate"/);
  assert.match(workspace, /"Prepare"/);
});

test("the visible navigation label remains Case Details", async () => {
  const stickyHeader = await readSource(stickyHeaderPath);

  assert.match(stickyHeader, />\s*Case Details\s*</);
  assert.doesNotMatch(stickyHeader, />\s*Clinical Translation Workspace\s*</);
});
