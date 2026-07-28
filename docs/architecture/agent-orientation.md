# Clinical Continuity Platform Agent Orientation Guide

## What this system is

This repository implements **Clinical Continuity** with an **OT configuration**. It preserves clinically meaningful current understanding across visits, separates it from history, and translates supported change into clinician attention and operational orientation. It is not an EMR, autonomous clinician, universal continuity runtime, or Care Continuity implementation.

## Primary architectural goals

- Reduce clinician reconstruction burden through concise, current orientation.
- Keep deterministic clinical reasoning and state transitions authoritative.
- Preserve evidence lineage and current-versus-historical truth.
- Track occupational-performance evolution rather than visit volume.
- Allow AI to synthesize supported conclusions without inventing authority.
- Keep application, discipline, and delivery responsibilities separate.

## Repository structure

| Area | Meaning |
| --- | --- |
| `docs/foundation/` | Enduring product identity and conceptual continuity obligations. |
| `docs/architecture/` | Permanent ownership contracts, technical rationale, this audit set. |
| `docs/governance/` | Current truth, active boundary, sequencing, decisions, coordination. |
| `docs/applications/clinical/` | Clinical Continuity product boundary. |
| `docs/clinical_model/` | Subordinate OT/progression/attention models. |
| `src/lib/` | Deterministic normalization, reasoning, progression, continuity, reconciliation, and projection engine. |
| `src/app/api/` | Server-side generation, progression, and seed delivery routes. |
| `src/app/cases/` | Caseload and patient-level Visit Briefing/workspace. |
| `src/app/new-case/` | Intake/evaluation workflow. |
| `tests/` and colocated tests | Deterministic and presentation regression evidence. |

Archives are historical evidence only unless an active authority cites them.

## Core subsystems and dependency relationships

```text
delivery forms/routes
  → buildClinicalDecisionInputFromCase
  → buildClinicalDecisionModel
  → buildProgressionState
  → reconciliation / continuity interpretation
  → attention + operational projections
  → evidence / explanation / briefing components

progression command
  → longitudinal event
  → current state
  → attention
  → conditional operational-prioritization refresh
  → event snapshot + case projection persistence
```

AI generation depends on deterministic outputs. Deterministic outputs do not depend on AI.

## Architectural boundaries

- **Conceptual shared:** neutral continuity obligations only; no shared implementation exists.
- **Clinical application:** clinical significance, progression, safety, reassessment, clinical attention, operational priority.
- **OT configuration:** ADL/transfer/assistance/environment/caregiver vocabulary and rule thresholds.
- **Delivery:** Next.js, Supabase, OpenAI provider, components, routes, and tests.
- **Human:** verification, correction, judgment, final use.

## Sources of truth

| Question | Authority |
| --- | --- |
| Why/product identity | `docs/foundation/platform-foundation.md` |
| Permanent ownership/contracts | `docs/architecture/system-architecture.md` |
| What is implemented now | `docs/governance/program-state.md`, then source reality |
| What work is allowed now | `docs/governance/current-focus.md` |
| Why a decision exists | `docs/governance/decision-continuity-log.md` |
| Current clinical reasoning result | live structured case → `buildClinicalDecisionInputFromCase` → `buildClinicalDecisionModel` |
| Current progression interpretation | `buildProgressionState` and longitudinal current projection |
| Current operational truth | mutable live case state, not a historical generation |
| Historical truth | generation and longitudinal-event snapshots |

## Stable public APIs versus internal details

There is no separately versioned library API. Treat these as **architecture-facing module contracts**, not external semver promises:

- `buildClinicalDecisionModel(ClinicalDecisionInput)`
- `buildProgressionState({ canonicalCasePayload })`
- `buildContinuityInterpretation(input)`
- reconciliation builders under `src/lib/continuity/`
- longitudinal builders/types under `src/lib/longitudinal/`
- `POST /api/progression-check`

Treat prompt text, component-local shapes, Supabase select lists, display compression, generated detail-module schemas, and helper implementation as internal. Changes can still be high risk when persisted outputs or presentation tests depend on them.

## Architectural invariants

- Never let generated text override deterministic reasoning/state.
- Never rewrite historical generations/events to reflect current truth.
- Never collapse progression classification into operational emphasis.
- Never let reconciliation independently choose treatment.
- Never treat an isolated state edit as safe if it changes continuity meaning.
- Never generalize OT fields/rules to another discipline or application without validation.
- Never describe simulated/persona evidence as real-clinician proof.
- Never implement Care Continuity or shared extraction without explicit scope.

## Existing extension points

- Input normalization mappings for approved case-field evolution.
- Pure decision/progression/reconciliation rules after approved clinical/architecture change.
- Narrow projection builders for evidence, explanations, progress, reassessment, session focus, and display language.
- New longitudinal event interpretation only if event/current/history contracts remain intact.
- Presentation components after approved Product Design specifications.
- AI provider/prompt adapters if deterministic inputs and structured output constraints remain authoritative.

An extension point is not authorization to extend it. Check Current Focus first.

## Naming conventions

- `build*` functions derive a new value without owning persistence.
- `reconcile*` functions determine current relevance of an existing conclusion/relationship.
- `refresh*FromEvent` updates a derived projection in response to an event.
- `current_*` denotes mutable present projection; `original_baseline` is write-once; event/generation snapshots are historical.
- `operational_prioritization` is current treatment-direction orientation; it is not a pathway.
- “Visit Briefing” is the current patient-workflow term. `commandCenter*` remains in implementation as historical naming, not product authority.
- snake_case is common in persisted/generated payloads; camelCase is common in TypeScript module interfaces. Normalizers bridge them.

## Integration guidelines

1. Read authority and active scope before inspecting code.
2. Identify which ownership layer the change belongs to.
3. Start from structured current evidence, not historical generated output.
4. Add deterministic meaning before adding synthesis or display.
5. Route every meaningful mutation through required recalculation, stale, history, and evidence-lineage consequences.
6. Preserve the dependency direction: evidence → interpretation → attention/prioritization → communication.
7. Keep provider/persistence/UI mechanics outside pure clinical builders.
8. Add focused deterministic tests for changed rules and presentation tests for user-visible contracts.
9. Update governance only if implementation reality or an approved material boundary changed.

## Safe modification guidance

### Usually safer

- Documentation corrections that preserve authority precedence.
- Tests around existing deterministic behavior.
- Isolated presentational refactors with unchanged data/meaning and approved UX scope.
- Pure display-language corrections that do not change clinical interpretation.

### Requires caution and explicit scope

- Normalization, decision scoring, progression thresholds, reconciliation, attention, next-action logic.
- Any case update, stale flag, generation/event snapshot, or original-baseline behavior.
- API/prompt/generated-output contracts and Supabase query shapes.
- The workspace composition root and intake/edit flows.

### Should rarely change

- Deterministic/AI/human authority boundaries.
- Current versus historical truth separation.
- Clinical/OT/shared responsibility ownership.
- Progression versus operational-prioritization separation.
- Immutable history and evidence-lineage obligations.

## Required reading order (10–15 minute orientation)

1. [Platform Foundation](../foundation/platform-foundation.md)
2. [System Architecture](system-architecture.md)
3. [Program State](../governance/program-state.md)
4. [Current Focus](../governance/current-focus.md) and [Active Roadmap](../governance/active-roadmap.md)
5. Relevant [Decision Continuity](../governance/decision-continuity-log.md) entries
6. This guide and the [Architecture Guide](architecture-guide.md)
7. [Architecture Reference](architecture-reference.md), focusing on the affected call path
8. Affected source plus neighboring tests

## Common incorrect assumptions

- “Continuity Platform” means a reusable shared engine already exists. It does not.
- Care Continuity or Patient Management is implemented as a separate application. Neither is.
- AI generates the clinical decision. It must only synthesize deterministic conclusions.
- The newest generation is current truth. Live case state is current truth; a generation is historical.
- Progression state directly dictates current treatment emphasis. They are related but distinct authorities.
- A barrier still being present means it constrains every activity. Relevance is relation-specific and reconciled.
- A client component or API owns clinical meaning because it orchestrates builders. Orchestration is delivery; deterministic modules own the reasoning.
- `selectedPathwayIndex` or command-center naming restores pathway-era semantics. Those are transitional/historical compatibility artifacts.
- Tests or persona simulation establish production/clinician validation. They do not.
- A convenient refactor is authorized because it improves architecture. Current Focus explicitly controls scope.
