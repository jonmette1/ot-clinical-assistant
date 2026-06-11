# Opportunity Map

Last updated: 2026-06-11

## Decision Rules

Prioritize opportunities that improve clinician orientation, treatment execution, continuity trust, verification, or translation without creating a new reasoning authority or expanding the product into scheduling, EMR replacement, or speculative analytics.

Use these evidence labels:

- **Completed:** implemented in the current branch.
- **Partial:** implementation exists, but the workflow or validation is incomplete.
- **Next:** high-value work appropriate for the next maturation cycle.
- **Deferred:** intentionally outside the current OT MVP validation sequence.

## Completed Or Partially Completed Foundations

These items should no longer be described as unimplemented future opportunities.

| Capability | Status | Remaining boundary |
| --- | --- | --- |
| Supporting Evidence / provenance display | **Completed** | Correction, rejection, and provenance hardening remain. |
| Why This Changed | **Completed** | Real-clinician comprehension remains unvalidated. |
| Progression Constraint | **Completed** | Trust effect is simulated, not proven in practice. |
| Progress Evidence | **Completed** | Real reassessment reuse remains unvalidated. |
| Reassessment Summary | **Completed** | Output quality needs clinician review across representative cases. |
| Patients page prioritization | **Completed** | 10B.1 cleanup and real caseload testing remain. |
| Clinical Translation Workspace reorganization | **Completed** | Cognitive compression and reusable outputs remain. |
| Product identity alignment | **Completed** | Market resonance remains unvalidated. |
| Workflow reuse validation | **Partial** | Comparative simulation is complete; real workflow validation is not. |

## Current High-Value Opportunities

### 1. Reference Workspace 2.0

**Goal:** reduce cognitive load and turn maintained understanding into concise, reusable communication.

Focus on:

- compressing translation content;
- clarifying Prepare controls;
- reducing raw density;
- preserving audience context; and
- avoiding a second Visit Briefing.

### 2. Patients Page 10B.1 cleanup

**Goal:** strengthen caseload triage without adding scheduling scope.

Focus on:

- removing or replacing the legacy clinical context filter;
- evaluating status clarity;
- evaluating recent-change quality; and
- confirming System View behavior across varied cases.

### 3. Real clinician validation

**Goal:** replace simulation-only confidence with observed workflow evidence.

Test:

- Patients page triage;
- Visit Briefing orientation;
- Session Focus usefulness;
- progression and constraint comprehension;
- translation workspace usefulness; and
- verification and correction behavior.

### 4. Correction workflow and provenance hardening

**Goal:** let clinicians identify, correct, or reject maintained conclusions while preserving deterministic authority and immutable history.

This should begin as a targeted workflow and UX specification. Do not introduce schema or API changes without explicit approval.

### 5. Clinical translation outputs

Create clinician-reviewed, audience-specific outputs for:

- caregiver explanation;
- patient explanation;
- family/supporter explanation;
- physician update;
- care conference summary; and
- QA/documentation support.

QA outputs must preserve source-verification requirements.

### 6. Mobile field testing

Test real devices, interruptions, limited attention, home-health context, scrolling burden, and action clarity. Responsive implementation alone is not field validation.

### 7. Personal Groups / labels

Explore clinician-created organization only after System Views and core triage are validated. Do not require new intake fields and do not turn groups into a folder architecture.

### 8. Audio / personal-agent access exploration

Explore read-aloud or personal-agent access as a consumption mechanism for maintained understanding. Do not add another duplicative orientation artifact.

### 9. Documentation consolidation

Refresh broader source-of-truth documents after the current sprint sequence is consolidated so stale naming and phase language do not continue to compete with the current product model.

## Recommended Sequence

1. Visual QA and Patients Page 10B.1 cleanup.
2. Reference Workspace 2.0 cognitive compression.
3. Real-clinician formative validation.
4. Correction workflow and provenance hardening.
5. Mobile field testing.
6. Audience-specific translation outputs, informed by validation.
7. Personal Groups and audio/personal-agent exploration only if evidence supports them.

## Deferred Opportunities

| Opportunity | Why deferred |
| --- | --- |
| Today's Patients | Requires a reliable scheduling source and would create unsupported workflow expectations. |
| Scheduling | Outside the current continuity value proposition. |
| Route planning | Outside the current product boundary and data foundation. |
| EMR integration | Premature before OT MVP workflow validation and governance hardening. |
| PT/SLP expansion | OT MVP must be validated before discipline expansion. |
| Broad dashboard analytics | Risks visual fragmentation and does not address the immediate continuity problem. |
| Predictive recovery | Exceeds current evidence and authority boundaries. |
