# Next-Agent Handoff

Last updated: 2026-06-11

## Project Summary In Plain English

The product is the **Clinical Continuity Platform**.

> **Preserves clinical meaning across time so clinicians don't have to repeatedly reconstruct it.**

It maintains what matters now, what changed, what remains limiting, what should be validated today, why progression has or has not occurred, why the current recommendation remains appropriate, what evidence supports progress, and how that maintained understanding can be translated for different audiences.

The workflow shift is:

```text
Repeated reconstruction
→ maintained understanding
→ verification
→ reuse / translation
```

The product has completed a major maturation cycle through Sprint 10C. It is a functional MVP ready for focused real-clinician formative validation, but it is not pilot-ready or production-ready.

## Current Product Model

### Patients Page — Find and prioritize patients

The Patients page is a caseload prioritization surface with System Views, clinical-priority sorting, status, current focus, and recent change.

Current System Views:

- All Patients
- Needs Attention
- Recent Change
- Monitor Closely
- Reassessment Due
- Safety Concern

It should answer who deserves attention, who changed, who may need reassessment, and who should be opened next. It should not become a scheduler, route planner, Today's Patients workflow, folder system, or collection of mini Visit Briefings.

### Visit Briefing — Understand and execute

Visit Briefing is the primary patient-level workflow surface. Current maintained artifacts include:

- Quick Orientation Summary;
- Current Focus;
- Session Focus;
- Attention Required;
- Next Action;
- Supporting Evidence;
- Why This Changed;
- Progression Constraint;
- Progress Evidence; and
- Reassessment Summary or quick-orientation support where applicable.

Keep the distinction explicit:

- **Session Focus:** What am I trying to accomplish during today's visit?
- **Attention Required:** What could derail progress or require review?

### Case Details — Clinical Translation Workspace

The visible label remains **Case Details**. Its strategic purpose is the **Clinical Translation Workspace**: explain, teach, coordinate, justify, document, and communicate maintained understanding.

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

## Current Implementation State

Merged in the current branch:

- Sprint 1 — Supporting Evidence
- Sprint 2 — Why This Changed
- Sprint 3 — Progression Constraint
- Sprint 5 — Progress Evidence
- Reassessment Summary
- Sprint 6 — Visit Briefing hierarchy refinement
- Sprint 7 — Attention Required redesign
- Sprint 8 — Session Focus
- Sprint 10A — Clinical Continuity Platform identity and patient-centered navigation
- Sprint 10B — Patients page caseload prioritization
- Sprint 10C — Clinical Translation Workspace reorganization

Sprint 4 comparative workflow reuse validation was simulated rather than a production feature.

Sprint 9 Orientation Brief was implemented on a branch/PR but is not merged in the current repository history. Do not present it as a core capability. Its main lesson was that another orientation summary duplicates Quick Orientation Summary; future work should explore access and consumption mechanisms instead.

## Current Validation Truths

- The strongest product need is understanding constraints, progression, what remains limiting, what to validate today, and how to translate the same understanding for different audiences.
- The strongest simulated trust pattern is: **Improvement → unresolved constraint → recommendation remains appropriate.**
- Maintained Understanding plus Progress Evidence appears reusable for reassessment, physician update, and care conference with less reconstruction.
- QA remains verification-dependent.
- Session Focus was preferred for visit execution: **Attention Required tells me what to worry about. Session Focus tells me what to do.**
- An 80-patient simulation showed that caseload organization and retrieval must precede orientation.
- The Reference Workspace's highest value is helping the clinician explain the patient to everyone else.

These are simulated or persona-based findings, not real-clinician proof. Do not claim measured time savings, adoption, clinical accuracy, or pilot readiness.

## Recommended Next Work

### 1. Visual QA and refinement of Sprints 10A–10C

Confirm the merged identity, Patients page, and Clinical Translation Workspace changes are visually coherent across desktop and mobile. Make targeted refinements only; do not redesign stable architecture.

### 2. Patients Page 10B.1 cleanup

- Remove or replace the legacy clinical context filter.
- Evaluate whether status is immediately understandable.
- Evaluate whether recent change is consistently clinically meaningful.
- Confirm System Views and priority sorting across representative cases.

Do not add scheduling, Today's Patients, required intake fields, folders, or mini Visit Briefings.

### 3. Reference Workspace 2.0

- Compress translation content.
- Create reusable audience-specific outputs.
- Clarify Prepare controls.
- Reduce raw density.
- Preserve the existing Case Details label and translation purpose.

Candidate outputs:

- caregiver explanation;
- patient explanation;
- family/supporter explanation;
- physician update;
- care conference summary; and
- QA/documentation support with explicit source verification.

### 4. Real clinician validation

Test:

- Patients page triage;
- Visit Briefing orientation;
- Session Focus usefulness;
- progression and constraint comprehension;
- translation workspace usefulness; and
- verification, disagreement, and correction behavior.

Use representative cases and realistic caseload scale. Distinguish task success and comprehension from preference.

### 5. Correction workflow and provenance hardening

Specify how clinicians inspect sources, correct evidence, reject a maintained conclusion, and understand the resulting state change while preserving immutable history.

Do not create a new reasoning authority or modify data/API contracts without explicit approval.

### 6. Mobile and field-context testing

Test real devices, interruptions, scrolling burden, limited attention, and home-health conditions. Responsive rendering alone is not sufficient.

### 7. Later opportunities

Only after the work above, consider:

- Personal Groups / labels;
- audio or personal-agent access; and
- broader workflow outputs.

## Decisions Not To Re-Litigate

- Product name is **Clinical Continuity Platform**.
- The approved tagline is **Preserves clinical meaning across time so clinicians don't have to repeatedly reconstruct it.**
- Visit Briefing remains **Visit Briefing**, not Command Center.
- The **Case Details** navigation label remains unchanged for now.
- The Reference Workspace's strategic purpose is translation and communication.
- The Patients page should not become a scheduler.
- Do not build Today's Patients without a reliable scheduling source.
- Do not add required intake fields solely to support organization.
- Do not make patient cards mini Visit Briefings.
- Do not treat AI as the clinical reasoning authority.
- Do not pursue PT/SLP before OT MVP validation.
- Do not turn simulated persona findings into claims of real-clinician proof.

## Current Boundaries And Known Gaps

- Real-clinician validation is still low.
- Pilot and production readiness are not established.
- Correction and provenance governance need end-to-end workflow design.
- Mobile use is not fully field-tested.
- Translation content is reorganized but still needs cognitive compression and reusable outputs.
- Patients page status, recent change, and the legacy clinical context filter need focused cleanup.
- Scheduling, EMR integration, discipline expansion, broad analytics, and predictive recovery remain deferred.

## Suggested First Three Tasks

1. Audit and refine Patients Page 10B.1, including the legacy filter, status clarity, and recent-change quality.
2. Produce a bounded Reference Workspace 2.0 specification or implementation for one or two audience-specific outputs with stronger compression.
3. Create and run a real-clinician formative validation protocol covering caseload triage, Visit Briefing orientation, Session Focus, translation, and correction behavior.
