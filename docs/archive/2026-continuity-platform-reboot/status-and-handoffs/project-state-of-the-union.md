# Project State of the Union

Last updated: 2026-06-11

## Executive Summary

The product is now the **Clinical Continuity Platform**.

> **Preserves clinical meaning across time so clinicians don't have to repeatedly reconstruct it.**

The platform has completed a major maturation cycle through Sprint 10C. It now combines a clinically prioritized Patients page, a mature Visit Briefing, deterministic evidence and change explanations, progression and reassessment support, and a Clinical Translation Workspace organized around communication use cases.

The primary product value is no longer generation. It is maintaining clinically meaningful understanding across time: what matters now, what changed, what remains limiting, what should be validated today, why progression has or has not occurred, why the current recommendation remains appropriate, what evidence supports progress, and how that understanding can be translated for different audiences.

The platform remains an MVP under formative validation. Most workflow evidence is simulated or persona-based. It does not yet establish real-clinician usability, clinical accuracy, measured time savings, production readiness, or pilot readiness.

## Current Product Identity

### Product name

**Clinical Continuity Platform**

### Tagline

**Preserves clinical meaning across time so clinicians don't have to repeatedly reconstruct it.**

### What the platform is

- A clinician-governed continuity platform for maintained clinical understanding.
- A deterministic clinical reasoning and operational-prioritization system.
- A caseload prioritization, visit preparation, verification, and translation workflow.
- A way to reuse maintained understanding across reassessment, communication, coordination, and review.

### What the platform is not

- An AI recommendation generator.
- A documentation generator first.
- An EMR replacement or system of record.
- An autonomous clinical reasoning authority.
- A scheduler, route planner, or predictive recovery platform.

Deterministic systems remain authoritative. AI may help organize or communicate supported conclusions, but clinicians retain verification, correction, and judgment authority.

## Current Product Thesis

A clinical reconstruction event occurs whenever a clinician must reassemble previously understood meaning from evaluation fields, prior visits, caregiver reports, environmental facts, and recent changes before acting.

The platform should maintain the clinically meaningful conclusion, reconcile it when evidence changes, make it easy to verify, and translate it for the next workflow or audience.

The core workflow shift is:

```text
Repeated reconstruction
→ maintained understanding
→ verification
→ reuse / translation
```

Maintained understanding includes:

- what matters now;
- what changed;
- what remains limiting;
- what should be validated today;
- why progression has or has not occurred;
- why the current recommendation remains appropriate;
- what evidence supports progress; and
- how the same understanding should be explained to different audiences.

## Current Product Model

### Patients Page — Find and prioritize patients

The Patients page is a clinically prioritized caseload surface, not a simple record browser.

It supports:

- System Views;
- clinical-priority sorting;
- status;
- current focus;
- recent change; and
- rapid patient identification and orientation.

Current System Views are:

- All Patients;
- Needs Attention;
- Recent Change;
- Monitor Closely;
- Reassessment Due; and
- Safety Concern.

The page should answer:

- Who deserves my attention?
- Which patient changed?
- Which patient may need reassessment?
- Which patient should I open, and why?

The Patients page should not become a scheduler, route planner, Today's Patients workflow, folder system, or collection of mini Visit Briefings.

### Visit Briefing — Understand and execute

Visit Briefing is the primary patient-level clinical workflow surface. It should help a clinician understand what is happening, what matters now, what changed, what to focus on, what to validate today, what could derail the plan, what should happen next, and why progression advanced or was deferred.

Current maintained artifacts include:

- Quick Orientation Summary, collapsed or optional;
- Current Focus;
- Session Focus;
- Attention Required;
- Next Action;
- Supporting Evidence;
- Why This Changed;
- Progression Constraint;
- Progress Evidence; and
- Reassessment Summary or a quick-orientation surface where applicable.

The distinction between two key outputs is deliberate:

- **Session Focus:** What am I trying to accomplish during today's visit?
- **Attention Required:** What could derail progress or require review?

Visit Briefing remains **Visit Briefing**. It should not be renamed Command Center.

### Case Details — Clinical Translation Workspace

The visible navigation label remains **Case Details**. Its strategic purpose is now the **Clinical Translation Workspace**.

It is not a second Visit Briefing and is not primarily Patient History. It helps clinicians explain, teach, coordinate, justify, document, and communicate maintained clinical understanding.

Current hierarchy:

1. Caregiver Guidance
2. Home & Equipment Guidance
3. Patient Guidance
4. Family / Supporter Guidance
5. Clinical Communication
6. Documentation / QA Support
7. Clinical Reference / Patient Context

The governing distinction is:

- **Visit Briefing:** What should I do?
- **Clinical Translation Workspace:** How do I explain it?

## Implemented Capabilities Through Sprint 10C

| Sprint | Capability | Current status and product value |
| --- | --- | --- |
| 1 | Supporting Evidence | **Implemented.** Deterministic, clinician-facing evidence explains what a maintained conclusion is based on, where it came from, and why it matters clinically. |
| 2 | Why This Changed | **Implemented.** Deterministic explanations describe what changed and why a conclusion evolved or did not evolve further. |
| 3 | Progression Constraint | **Implemented.** Concise narrative connects improvement, unresolved constraint, and why the current recommendation still fits. This became a strong simulated trust driver. |
| 4 | Workflow Reuse Validation | **Simulated validation completed.** Maintained understanding supported reassessment, physician update, care conference, and partial QA reuse. Care conference, physician update, and reassessment performed best; QA still required verification. |
| 5 | Progress Evidence | **Implemented.** Deterministic evidence identifies objective improvement, milestones, remaining limits, safety effects, and timeframe. |
| 6 | Visit Briefing Hierarchy Refinement | **Implemented.** Quick Orientation Summary remains collapsed or optional; evidence and change explanations stay local to conclusions; Review Flag and Reassessment Flag were removed; Current Focus was compressed. |
| 7 | Attention Required Redesign | **Implemented.** Attention Required now communicates what could derail progress or should be reviewed or monitored rather than functioning as milestone reporting. |
| 8 | Session Focus | **Implemented.** Deterministic Session Focus identifies what to validate, observe, train, reassess, or address during today's visit. |
| 9 | Orientation Brief | **Not merged.** A branch/PR implementation was largely duplicative of Quick Orientation Summary. The remaining opportunity is a better access or consumption mechanism, potentially read-aloud or personal-agent support, rather than more orientation content. |
| 10A | Identity & Navigation | **Implemented.** Clinical Continuity Platform identity, approved tagline, Patients/Add Patient terminology, metadata, and patient-centered navigation are aligned. |
| 10B | Patients Page Caseload Prioritization | **Implemented.** System Views, clinical-priority sorting, redesigned patient cards, status, current focus, recent change, and removal of mini Visit Briefing previews establish a caseload prioritization surface. |
| 10C | Reference Workspace Reorganization | **Implemented.** Existing content is organized by translation and communication use case, with durable context moved lower as supporting reference. |

## Current Validation Findings

The strongest current product insight is that clinicians do not primarily struggle to understand evidence. They struggle to understand constraints, progression, what remains limiting, what should be validated today, and how to translate the same maintained understanding for different people.

Trust increased most when the system explained:

```text
Improvement
→ unresolved constraint
→ recommendation remains appropriate
```

Maintained Understanding plus Progress Evidence appears sufficient, in simulation, to support reassessment, physician update, and care conference with substantially less reconstruction. QA remains only partially reusable because source verification is part of the workflow.

Session Focus was preferred over Attention Required for visit preparation and treatment execution:

> **Attention Required tells me what to worry about. Session Focus tells me what to do.**

An 80-patient simulation showed that organization and retrieval must precede orientation. The Patients page therefore needs to combine caseload management with rapid orientation rather than present a single long record list.

The Reference Workspace's highest-value purpose is not additional orientation. It is **helping the clinician explain the patient to everyone else**.

These are directional findings from simulation and persona-based review. They are not real-clinician proof.

## Current Maturity and Risks

### Mature or substantially implemented

- deterministic clinical reasoning and operational prioritization;
- longitudinal continuity and progression logic;
- Visit Briefing hierarchy and maintained artifacts;
- clinician-facing evidence, change explanation, constraint narrative, and progress evidence;
- reassessment summary support;
- clinically prioritized Patients page; and
- translation-oriented Case Details organization.

### Partially mature

- reusable audience-specific communication outputs;
- correction workflows and provenance hardening;
- mobile and field-context usability;
- status and recent-change quality across varied cases; and
- cognitive compression within the Clinical Translation Workspace.

### Not yet established

- real-clinician validation;
- clinical accuracy across representative cases;
- measured reduction in reconstruction time;
- production operations, privacy, security, support, and instrumentation readiness;
- pilot readiness; and
- cross-discipline validity.

## Recommended Next Work

1. Complete visual QA and refinement of Sprints 10A–10C where needed.
2. Complete Patients Page 10B.1 cleanup: remove or replace the legacy clinical context filter and evaluate status and recent-change clarity.
3. Develop Reference Workspace 2.0 around cognitive compression, clearer Prepare controls, and reusable audience-specific outputs.
4. Run real-clinician formative validation of Patients page triage, Visit Briefing orientation, Session Focus, and the translation workspace.
5. Define correction workflow and harden conclusion provenance without creating a new reasoning authority.
6. Conduct mobile and field-context testing.
7. Consider Personal Groups, audio/personal-agent access, and broader outputs only after those foundations are tested.

## Explicit Deferrals

Do not prioritize the following before OT MVP validation and the next validation cycle:

- Today's Patients;
- scheduling or route planning;
- EMR integration;
- PT/SLP expansion;
- broad dashboard analytics; or
- predictive recovery.

## Decisions Not To Re-Litigate

- The product name is **Clinical Continuity Platform**.
- Visit Briefing remains **Visit Briefing**, not Command Center.
- The visible **Case Details** navigation label remains unchanged for now.
- The Reference Workspace's strategic purpose is translation and communication.
- The Patients page should not become a scheduler or a set of mini Visit Briefings.
- Do not build Today's Patients without a reliable scheduling source.
- Do not add required intake fields solely to support organization.
- AI is not the clinical reasoning authority.
- PT/SLP expansion should not precede OT MVP validation.
