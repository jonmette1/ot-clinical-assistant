# Clinical Continuity Platform Architecture Guide

## Audience and status

This guide teaches the Founder the architectural engine without requiring source-code reconstruction. It summarizes active authority and implementation evidence; [System Architecture](system-architecture.md) remains the permanent ownership authority, and [Program State](../governance/program-state.md) remains current implementation truth.

## System purpose

Clinical Continuity reduces the repeated work of reconstructing a patient's current clinical situation. It preserves evidence-linked understanding, identifies meaningful change, orients attention to what matters now, and keeps current truth separate from what was known or generated earlier. The implemented application is Clinical Continuity with an OT configuration—not Care Continuity and not a universal continuity engine.

## High-level architecture

The product is best understood as five cooperating systems:

1. **Structured capture** records the current OT case and focused longitudinal changes.
2. **Deterministic interpretation** normalizes inputs and owns clinical reasoning, progression, reconciliation, attention, and supported state transitions.
3. **Continuity projection** connects current state, historical evidence, meaningful change, freshness, and present relevance.
4. **Constrained synthesis** uses AI to communicate deterministic conclusions in structured clinical language without becoming the decision authority.
5. **Workflow delivery** presents a patient caseload and Visit Briefing while Supabase persists mutable current state and immutable history.

## Architectural layers

| Layer | Owns | Does not own |
| --- | --- | --- |
| Shared Continuity Foundation (conceptual) | Neutral obligations such as current projection, history separation, evidence lineage, meaningful change, attention abstraction, reconciliation, and freshness consequences. | Runtime code, schemas, clinical meaning, OT vocabulary, UI, AI provider behavior. |
| Clinical Continuity application | Clinical significance, progression, reassessment, safety, operational prioritization, clinical attention, and clinician-facing meaning. | Universal cross-application semantics. |
| OT configuration | Occupational performance, ADLs, transfers, assistance levels, home environment, caregiver feasibility, and OT-specific rules/vocabulary. | PT, SLP, nursing, or Care Continuity portability claims. |
| Delivery infrastructure | Next.js routes/components, Supabase mechanics, OpenAI integration, styling, and tests. | Clinical or continuity authority. |

## Domain model

The central domain relationship is:

```text
structured case evidence
  → clinical decision input
  → deterministic decision model
  → progression state
  → reconciliation and continuity interpretation
  → clinical attention + operational prioritization
  → current focus, next action, evidence, and briefing
```

Important domain objects are:

- **Case:** mutable live operational record and current source of truth.
- **Clinical decision input/model:** normalized OT classification plus deterministic strategy scoring.
- **Progression state:** present phase, barriers, milestones, regression risks, reassessment triggers, caregiver/environment constraints, and readiness.
- **Original baseline:** first authoritative functional point; initialized once.
- **Longitudinal event:** immutable record of a progression check and its interpretation.
- **Current longitudinal state:** mutable projection of the latest relevant event state.
- **Clinical attention state:** present issue requiring awareness/review/action.
- **Operational prioritization:** treatment-direction projection, distinct from progression classification.
- **Generation:** immutable snapshot of generated input/output at a point in time.
- **Maintained conclusion:** a supported conclusion that remains current until evidence reconciles, resolves, supersedes, or invalidates it.

## Execution flow

### Evaluation and initial generation

1. The clinician enters structured patient, function, environment, goals, caregiver, and classification data.
2. Normalization creates a `ClinicalDecisionInput`.
3. The deterministic engine scores intervention mechanisms and produces the decision model.
4. Progression logic derives the initial current progression state.
5. The plan API receives those authoritative inputs and asks AI for one structured operational-prioritization synthesis.
6. The application stores the live case and an immutable generation snapshot.

### Visit orientation

1. The workspace loads the live case, generations, and longitudinal events.
2. It recomputes deterministic decision/progression/current-focus projections from live truth.
3. Reconciliation determines which barriers, activity constraints, and triggers remain relevant.
4. Projection builders produce attention, next action, evidence, change explanation, progress, reassessment, and session-focus views.
5. Visit Briefing renders current orientation while historical snapshots remain review-only.

### Progression check

1. `POST /api/progression-check` validates a focused change payload.
2. It initializes the original baseline only if absent.
3. It builds an immutable longitudinal event.
4. It advances the current longitudinal projection and clinical attention deterministically.
5. It refreshes operational prioritization only when the clinician reports treatment direction changed.
6. It appends the event with before/after/attention/emphasis snapshots, then updates the live case projection without touching generations.

## Data flow and state model

```text
                         historical truth (append/review)
                        ┌─ generations
structured intake ──────┼─ longitudinal_events + snapshots
        │               └─────────────────────────────────
        v
cases row (live current truth)
  ├─ structured source fields
  ├─ generated_output / operational prioritization
  ├─ original_baseline (write once)
  ├─ current_longitudinal_state
  └─ clinical_attention_state
        │
        v
pure deterministic projections → browser briefing / API synthesis input
```

Three state categories must remain distinct:

- **Source current state:** mutable structured fields on the live case.
- **Derived current state:** deterministic projections that can be recomputed from supported current evidence.
- **Historical state:** event and generation snapshots that describe what was recorded or generated then and must not be rewritten to match now.

## Communication model

- **Browser ↔ Supabase:** case/caseload/workspace components directly read and mutate persisted state.
- **Browser → Next.js APIs:** plan/detail generation and progression-check commands cross server routes.
- **Server → OpenAI:** generation APIs provide deterministic context and demand structured JSON; AI communicates supported conclusions.
- **Pure module calls:** deterministic builders communicate through TypeScript objects without network or persistence dependencies.
- **Human verification:** the clinician remains the final user authority; generated or deterministic orientation supports rather than replaces judgment.

## Major subsystems and abstractions

The [Knowledge Map](architecture-knowledge-map.md) catalogs each subsystem. Four abstractions carry most architectural weight:

1. **Canonicalization:** convert inconsistent delivery-shaped records to one decision input.
2. **Deterministic derivation:** calculate supported clinical/progression/attention meaning without model-provider authority.
3. **Projection:** maintain a current operational view distinct from event/snapshot history.
4. **Reconciliation:** test whether an earlier conclusion still applies in the current evidence context before downstream prioritization.

## Supported design patterns

- **Functional core with delivery shell:** most reasoning is in synchronous builders; React/routes provide effects and orchestration.
- **Event plus current projection:** longitudinal events preserve history while a current-state object supports present work.
- **Snapshot history:** generations capture time-bound input/output rather than acting as editable current truth.
- **Pipeline composition:** normalization, decision, progression, reconciliation, attention, prioritization, and presentation have an intended dependency order.
- **Constrained AI adapter:** provider calls synthesize an authoritative deterministic model into a structured contract.
- **Compatibility seam:** pathway-era fields may remain but must not regain semantic authority.

## Architectural assumptions

- Current structured evidence is sufficiently complete to support deterministic derivation.
- OT taxonomies and thresholds are locally valid but not portable by default.
- Focused progression checks can update current orientation without recreating evaluation.
- Historical evidence must remain available even when current conclusions change.
- Structured JSON generation is usable only after deterministic authority has already constrained meaning.
- Users require cognitive compression more than exhaustive narrative display.

## Critical dependencies

- **Next.js/React:** application and workflow delivery; replaceable with significant UI rewrite but no intended clinical ownership.
- **Supabase:** current persistence and query mechanism; critical because schema artifacts are not repository-local.
- **OpenAI:** replaceable synthesis provider in principle; not required for deterministic authority, but current generation routes depend on it.
- **TypeScript pure builders:** the actual implemented clinical/continuity engine; changes can alter clinical meaning.

## Architectural invariants

1. Deterministic systems—not AI—own supported clinical reasoning and state transitions.
2. Humans retain verification, correction, judgment, and final use.
3. Live operational state owns current truth; history remains immutable.
4. Progression state and operational emphasis remain distinct.
5. Reconciliation may alter relevance, not independently recommend treatment.
6. Meaningful mutations must propagate freshness/recalculation consequences.
7. Evidence lineage must remain available for maintained conclusions.
8. OT semantics must not be generalized without evidence and approval.
9. The Shared Continuity Foundation remains conceptual until technical extraction is separately authorized.
10. Care Continuity is not implemented here.

## Replaceable components

- OpenAI and prompt implementation are replaceable behind equivalent structured synthesis behavior and authority constraints.
- Supabase is mechanically replaceable if current/history, write-once baseline, snapshots, and atomicity contracts are preserved.
- Presentation components and display-language compression are replaceable after Product Design approval.
- Individual evidence/summary projection builders are narrow replaceable calculations if their input/output meaning and tests remain intact.

The clinical decision, progression, reconciliation, mutation, and current/history authority rules are **not** ordinary replaceable delivery components.

## High-risk components

- **`CaseWorkspaceClient`:** a large composition root containing reads, writes, mutation workflows, projection assembly, and presentation state; local edits can bypass continuity consequences.
- **Canonical normalization:** permissive `any`-shaped mappings can silently change downstream clinical classification.
- **Persistence boundary:** absent migrations/generated schema types make table contracts and security assumptions difficult to verify in Git.
- **AI JSON contracts:** prompt/output drift can break generated artifacts even though AI is not authority.
- **Duplicated assembly paths:** intake, workspace, API, editing, and seeding do not all use one canonical continuity assembler, matching documented transitional debt.
- **Compatibility vocabulary:** command-center/pathway-era names can confuse contributors about current semantic authority.

## Recommended one-day learning order

1. Read [Platform Foundation](../foundation/platform-foundation.md), [System Architecture](system-architecture.md), and [Program State](../governance/program-state.md).
2. Read [Clinical Continuity Application Definition](../applications/clinical/clinical-continuity-application-definition.md) and [Shared Continuity Foundation](../foundation/shared-continuity-foundation.md).
3. Study `clinicalDecisionEngine.ts`, `buildClinicalDecisionInput.ts`, `buildProgressionState.ts`, and `buildContinuityInterpretation.ts` in that order.
4. Trace `POST /api/progression-check` and the longitudinal helpers to understand current/history authority.
5. Trace workspace composition from its data loads to current-focus, next-action, evidence, and summary builders.
6. Review plan generation last, because AI is a synthesis layer rather than the reasoning engine.
7. Use the [Architecture Reference](architecture-reference.md) and [Alignment Report](architecture-alignment.md) to identify transitional seams before proposing changes.
