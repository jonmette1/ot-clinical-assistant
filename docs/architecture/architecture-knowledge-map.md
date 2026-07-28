# Clinical Continuity Platform Architecture Knowledge Map

## Purpose and audit basis

This inventory is the first deliverable of the architecture audit. It describes the implemented **Clinical Continuity** application with its **OT configuration**; it does not describe a proven shared runtime or an implemented Care Continuity application. Architectural intent comes from the [Platform Foundation](../foundation/platform-foundation.md), [System Architecture](system-architecture.md), and active governance stack. Runtime observations come from `src/`. Where those differ, the [Alignment Report](architecture-alignment.md) records both.

**Confidence scale:** High means the responsibility and call path are directly documented and implemented; medium means the boundary is visible but distributed or transitional; low means the repository supplies only partial evidence. **Stability** describes architectural contract stability, not code quality.

## System map

```text
Browser / clinician
  ├─ intake and editing ───────────────┐
  ├─ patient caseload                  │
  └─ Visit Briefing / reference view   │
                                       v
React + Next.js delivery surfaces → canonical case normalization
                                       v
deterministic clinical decision model → progression state
                                       ├─ continuity reconciliation
                                       ├─ clinical attention
                                       └─ operational prioritization inputs
                                       v
constrained AI synthesis (plan/detail modules) + deterministic projections
                                       v
Supabase current case projection + immutable generation/event history
```

The approved Shared Continuity Foundation sits above this map as a **conceptual obligation layer**, not a package in the call graph. See the [canonical foundation definition](../foundation/shared-continuity-foundation.md).

## Subsystem catalog

| Subsystem | Purpose and responsibilities | Interfaces, consumers, and dependencies | Lifecycle and extension points | Importance / stability / confidence | Evidence |
| --- | --- | --- | --- | --- | --- |
| Authority and product boundary | Defines product identity, ownership, deterministic/AI/human authority, and current-vs-history rules. | Public contract for every contributor; governs all source and subordinate docs. | Changes only through approved governance. Extend by recording approved decisions, not by inferring strategy from code. | Critical / high / high | [Foundation](../foundation/platform-foundation.md), [System Architecture](system-architecture.md), [Program State](../governance/program-state.md) |
| Delivery shell and navigation | Hosts the Next.js application, global layout, navigation, landing page, and routes. | Next.js App Router; consumed by browser users; depends on React and route components. | Created per request/navigation. New surfaces belong here only after Product Design approval. | Supporting / medium / high | `src/app/layout.tsx`, `src/components/AppNav.tsx`, `src/app/page.tsx` |
| Intake and case mutation | Captures OT case structure, derives deterministic reasoning/progression, persists a case, and creates generations. Editing mutates current case state and can create new snapshots. | Browser-facing forms; calls normalization and decision builders; writes `cases` and `generations` through Supabase. | Evaluation creates current state and an initial snapshot; later edits update live truth. Extension requires continuity-mutation review. | Critical / transitional / high | `src/app/new-case/page.tsx`, `src/app/cases/[id]/edit/page.tsx`, [Mutation Lifecycle](continuity_mutation_lifecycle.md) |
| Canonical case normalization | Converts heterogeneous case fields into the input consumed by deterministic reasoning and attaches derived decision models. | `buildClinicalDecisionInputFromCase`, `buildCanonicalCasePayload`, `buildCanonicalContinuityState`; consumed by intake, workspace, seeding, and continuity assembly. | Recomputed from live case data. Normalization mappings are the extension seam for approved input evolution. | Critical / medium / high | `src/lib/buildClinicalDecisionInput.ts`, `src/lib/buildCanonicalCasePayload.ts`, `src/lib/buildCanonicalContinuityState.ts` |
| Deterministic clinical decision engine | Scores approved intervention mechanisms from goal, barriers, risk, support, lenses, and environment; selects primary/secondary strategies. | `buildClinicalDecisionModel(ClinicalDecisionInput)`; consumed by canonical assembly and UI workflows. No provider dependency. | Pure synchronous derivation. Extend taxonomies/rules only with approved clinical and architecture evidence. | Critical / high contract, OT-specific / high | `src/lib/clinicalDecisionEngine.ts`, [DCL-001](../governance/decision-continuity-log.md#dcl-001--deterministic-systems-remain-authoritative) |
| Progression derivation | Interprets current case/decision data into phase, barriers, milestones, risks, triggers, caregiver/environment states, and advancement readiness. | `buildProgressionState`; uses progression types/utilities and canonical case payload; consumed by intake, workspace, seeding, and continuity assembly. | Pure recomputation for current structured state. Rules are an OT configuration concern. | Critical / medium / high | `src/lib/buildProgressionState.ts`, `src/lib/progression/*`, [Clinical Progression Model](../clinical_model/Clinical_Progression_Model.md) |
| Continuity interpretation | Compresses progression, operational prioritization, stale flags, and follow-up data into deterministic continuity condition, change classifications, alerts, drift, and reassessment pressure. | `buildContinuityInterpretation`; invoked by canonical continuity assembly and the plan API. | Derived whenever assembled or generated. Current attachment paths are explicitly transitional. | Critical / transitional / high | `src/lib/buildContinuityInterpretation.ts`, `src/lib/buildCanonicalContinuityState.ts`, [DCL-022/DCL-024](../governance/decision-continuity-log.md) |
| Reconciliation | Reconciles barriers, barrier-to-activity constraint relevance, and reassessment triggers before downstream action projection. It does not choose treatment. | `reconcileBarriers`, `reconcileActivityConstraint`, `reconcileReassessmentTriggers`; consumed by next-action construction. | Pure current-state calculation; extension is relation/rule-specific and must preserve historical snapshots. | Critical / emerging but governed / high | `src/lib/continuity/*`, [Continuity Reconciliation](references/continuity_reconciliation_architecture.md), [Activity Constraint Reconciliation](references/activity_constraint_reconciliation_architecture.md) |
| Longitudinal event pipeline | Validates progression checks, initializes an immutable baseline once, creates events, updates the current longitudinal projection and attention, conditionally refreshes operational prioritization, and stores snapshots. | `POST /api/progression-check`; longitudinal builders/types; Supabase `cases` and `longitudinal_events`. | One event per accepted progression check. Baseline is write-once; history is append-only by contract; case projection mutates. | Critical / high intent, medium implementation / high | `src/app/api/progression-check/route.ts`, `src/lib/longitudinal/*`, [Progression Check Model](../clinical_model/Progression_Check_Data_Model.md) |
| Operational and attention projection | Turns current state into current focus, attention headline, next actions, readiness, session focus, evidence, explanations, constraints, progress evidence, and reassessment summaries. | Builder functions under `src/lib`; composed mainly by `CaseWorkspaceClient`; consumed by Visit Briefing components. | Recomputed in the browser from current case/event state. Builders are narrow seams; composition is centralized in a large client component. | Critical / mixed / high | `src/lib/commandCenterNextAction.ts`, `src/lib/currentFocusProgressionAwareness.ts`, `src/lib/build*`, `src/app/cases/[id]/CaseWorkspaceClient.tsx` |
| AI synthesis | Produces one structured operational prioritization plan and optional detail modules from deterministic inputs. It must not override the decision engine. | `POST /api/generate-plan`, `POST /api/generate-detail-module`; OpenAI Responses API; consumed by intake/workspace flows. | On-demand; parsed JSON becomes generated output/snapshot. Prompt schemas are internal provider contracts, not clinical authority. | Important / medium / high | `src/app/api/generate-plan/route.ts`, `src/app/api/generate-detail-module/route.ts`, [Prompt Library](../ai-workflows/prompt-library.md) |
| Persistence and history | Stores live case projection, generated output, original baseline, longitudinal current state, attention, generations, and longitudinal event snapshots. | Browser and server use a shared Supabase client; observed tables: `cases`, `generations`, `longitudinal_events`. | Current case rows mutate; generations/events preserve historical truth. Database schema is not present in the repository. | Critical / contract high, implementation visibility low / medium | `src/lib/supabase.ts`, Supabase calls in `src/app/`, [DCL-019](../governance/decision-continuity-log.md) |
| Patient caseload | Derives patient-level status, views, filtering, and ordering from cases plus latest longitudinal events. | `derivePatientCaseloadSummary`, `matchesCaseloadView`, `filterAndSortCaseload`; consumed by `/cases` and cards. | Recomputed after client-side reads; extension requires Patient Management/Product Design authority. | Supporting / medium / high | `src/app/cases/patientCaseload.ts`, `src/app/cases/page.tsx` |
| Visit Briefing and historical review | Primary patient workflow: presents current orientation, supporting evidence, change explanation, constraint/progress narratives, session focus, and immutable snapshots. | `CaseWorkspaceClient` plus scoped presentation components; reads Supabase directly and calls builders/APIs. | Loads current case, generations, and events; local mutations refresh current projections and snapshots. | Critical / medium / high | `src/app/cases/[id]/CaseWorkspaceClient.tsx`, `src/app/cases/[id]/components/*`, [DCL-021](../governance/decision-continuity-log.md) |
| Test and seed support | Exercises deterministic behavior/presentation contracts and supplies synthetic OT cases/events. | Node test runner, `.test.mjs` files, dev/seed APIs. | Run locally; seed APIs mutate configured Supabase. Synthetic evidence is not clinician validation. | Supporting / medium / high | `package.json`, `tests/`, `src/lib/testCases/`, `src/app/api/dev/` |

## Cross-cutting conclusions

### Observed

- The architectural engine is a deterministic derivation pipeline surrounded by delivery code, persistence, and constrained AI synthesis.
- Current state is distributed across a mutable `cases` row and derived browser/server projections; history is represented separately by `generations` and `longitudinal_events`.
- The strongest reusable seams today are pure builders, not a shared platform runtime.
- The workspace is the principal composition root and therefore the largest coupling concentration.

### Inferred

- The pure-function style makes deterministic rules independently testable and potentially replaceable, but public package boundaries are not formalized.
- Supabase table contracts are operationally critical yet only inferable from callers because migrations/generated database types are absent. Confidence in the complete persistence model is therefore medium.
