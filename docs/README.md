# Documentation Index

## Purpose

This index gives a new Chief of Staff or implementation agent the shortest reliable path through the repository documentation. It separates current implementation truth, approved product direction, roadmap sequencing, finalized decisions, and archive material.

## Authority hierarchy

1. [`foundation/platform-foundation.md`](foundation/platform-foundation.md) — enduring Continuity Platform identity, principles, application boundaries, and non-goals.
2. [`architecture/system-architecture.md`](architecture/system-architecture.md) — permanent ownership layers and architecture contracts.
3. [`governance/program-state.md`](governance/program-state.md) — current repository truth, implemented versus conceptual scope, gaps, and handoff state.
4. [`governance/current-focus.md`](governance/current-focus.md) — the single active work boundary.
5. [`governance/active-roadmap.md`](governance/active-roadmap.md) — dependency-driven sequencing after the active boundary.
6. [`governance/decision-continuity-log.md`](governance/decision-continuity-log.md) — finalized decisions and reopening conditions.
7. [`governance/operating-model.md`](governance/operating-model.md) — role boundaries and coordination workflow.
8. Subordinate references under `docs/architecture/`, `docs/clinical_model/`, `docs/UX/`, `docs/implementation/`, and `docs/applications/` — scoped technical, clinical-model, UX, and application detail.

When these documents conflict, follow the same order unless a higher-authority document explicitly delegates a scoped decision to a lower-level reference.

## Major documents by question

| Question | Primary document |
| --- | --- |
| What is the platform and what is not the platform? | [`foundation/platform-foundation.md`](foundation/platform-foundation.md) |
| What product direction has been approved beyond the current implementation? | [`foundation/product-vision.md`](foundation/product-vision.md) |
| What continuity model is being used as the shared working model? | [`architecture/continuity-model-working-draft-v0.1.md`](architecture/continuity-model-working-draft-v0.1.md) |
| What architecture boundaries must implementation preserve? | [`architecture/system-architecture.md`](architecture/system-architecture.md) |
| What is implemented today? | [`governance/program-state.md`](governance/program-state.md) |
| What work is active now? | [`governance/current-focus.md`](governance/current-focus.md) |
| What comes next, and in what order? | [`governance/active-roadmap.md`](governance/active-roadmap.md) |
| What decisions are finalized? | [`governance/decision-continuity-log.md`](governance/decision-continuity-log.md) |
| How should Founder, CoS, Design, Architecture, and Codex coordinate? | [`governance/operating-model.md`](governance/operating-model.md) |
| What is the implemented Clinical Continuity application? | [`applications/clinical/README.md`](applications/clinical/README.md) and [`applications/clinical/clinical-continuity-v0.1.md`](applications/clinical/clinical-continuity-v0.1.md) |
| What is the approved Patient Management direction? | [`applications/patient-management.md`](applications/patient-management.md) |
| What is Care Continuity status? | [`applications/care/README.md`](applications/care/README.md) |

## Current implementation versus approved direction

- Current implementation truth belongs in [`governance/program-state.md`](governance/program-state.md) and implementation-specific subordinate references.
- Approved product direction belongs in [`foundation/platform-foundation.md`](foundation/platform-foundation.md), [`foundation/product-vision.md`](foundation/product-vision.md), and scoped application documents under [`applications/`](applications/).
- Roadmap decisions belong in [`governance/active-roadmap.md`](governance/active-roadmap.md).
- Finalized decisions belong in [`governance/decision-continuity-log.md`](governance/decision-continuity-log.md).
- Historical handoffs, superseded strategy, and prior framing belong in [`archive/`](archive/) unless active authorities cite them for evidence.

## Recommended reading order

1. [`foundation/platform-foundation.md`](foundation/platform-foundation.md)
2. [`foundation/product-vision.md`](foundation/product-vision.md)
3. [`architecture/system-architecture.md`](architecture/system-architecture.md)
4. [`governance/program-state.md`](governance/program-state.md)
5. [`governance/current-focus.md`](governance/current-focus.md)
6. [`governance/active-roadmap.md`](governance/active-roadmap.md)
7. [`governance/decision-continuity-log.md`](governance/decision-continuity-log.md)
8. [`governance/operating-model.md`](governance/operating-model.md)
9. Relevant application, architecture, UX, clinical-model, or implementation references for the assigned boundary.
