# Canonical Continuity Pipeline

---

# Purpose

This document defines the target canonical continuity assembly pipeline for the OT Clinical Reasoning Assistant.

The purpose of this pipeline is to:
- consolidate fragmented continuity assembly
- centralize deterministic continuity authority
- reduce UI-owned continuity construction
- stabilize regeneration workflows
- standardize reassessment-sensitive continuity handling
- prevent continuity authority drift
- improve longitudinal operational consistency
- support continuity-safe reassessment workflows

This document operates downstream from:
- `continuity_authority_matrix.md`
- `continuity_mutation_lifecycle.md`
- `system_architecture.md`

---

# Architectural Goal

The platform is transitioning from:
- fragmented continuity assembly
- partially distributed continuity ownership
- UI-assisted continuity construction

toward:

- centralized deterministic continuity assembly
- governed continuity authority
- canonical continuity state generation
- continuity-safe regeneration workflows

---

# Core Principle

There must be one authoritative continuity assembly pipeline.

Continuity state should not be:
- manually assembled across multiple layers
- partially owned by UI workflows
- independently derived by multiple systems
- reconstructed inconsistently during regeneration

The continuity pipeline exists to ensure:
- deterministic consistency
- longitudinal continuity integrity
- continuity-safe persistence
- operational readability
- reassessment-safe mutation handling

---

# Canonical Continuity Pipeline

Target authoritative pipeline:

Structured Case State
→ Canonical Payload Builder
→ Deterministic Clinical Decision Engine
→ Deterministic Progression Derivation
→ Deterministic Continuity Interpretation
→ Continuity State Assembly
→ AI Operational Synthesis
→ Generated Output Persistence
→ Detail Module Generation
→ UI Rendering

---

# Current Transitional Architecture

The current implementation contains fragmented continuity assembly.

Current responsibilities include:

| Layer | Current Responsibility |
|---|---|
| UI / page.tsx | payload assembly |
| UI / page.tsx | progression_state attachment |
| API route | continuity_interpretation attachment |
| AI generation | operational_prioritization generation |
| stale-state handlers | freshness recalibration |
| detail modules | downstream continuity-dependent synthesis |

This architecture is currently functional but transitional.

The purpose of this phase is controlled consolidation, not architectural rewrite.

---

# Target Canonical Builder

Future architecture should converge toward:

buildCanonicalContinuityState()

Suggested location:

src/lib/buildCanonicalContinuityState.ts

---

# Canonical Builder Responsibilities

The canonical continuity builder should own:

- canonical payload normalization
- deterministic clinical decision input generation
- deterministic clinical decision model generation
- progression state derivation
- continuity interpretation derivation
- stale-state interpretation preparation
- reassessment-sensitive continuity preparation
- continuity authority assembly

The canonical builder should NOT own:
- UI rendering
- persistence
- AI wording generation
- detail module generation
- export formatting
- presentation-layer concerns

---

# Canonical Builder Inputs

Expected inputs may include:

- caseData
- follow_up_status
- staleFlags
- reassessmentSignals

Inputs should originate from:
- current live case state
- structured operational state
- persisted continuity state
- reassessment-sensitive operational state

---

# Canonical Builder Outputs

Expected outputs may include:

- canonicalPayload
- clinicalDecisionInput
- clinicalDecisionModel
- progressionState
- continuityInterpretation
- continuityAssemblyState

These outputs become:
- the authoritative continuity context
- the authoritative regeneration context
- the authoritative reassessment context

---

# Deterministic Authority Rule

The canonical continuity builder is authoritative for:
- progression derivation
- continuity interpretation
- reassessment-sensitive continuity assembly
- stale-state interpretation preparation
- continuity mutation interpretation

AI is not authoritative for:
- continuity classification
- progression interpretation
- reassessment pressure
- continuity validity
- stale-state validity

---

# AI Operational Synthesis Relationship

AI operational synthesis must consume:
- deterministic continuity state
- deterministic progression state
- deterministic continuity interpretation

AI operational synthesis must not:
- independently derive continuity authority
- override deterministic continuity interpretation
- generate progression authority
- generate reassessment authority

AI remains:
- a communication compression layer
- an operational readability layer
- a synthesis layer

not:
- a continuity authority system

---

# Stale-State Relationship

The canonical continuity pipeline must integrate with:
- reasoning_stale
- plan_stale
- modules_stale

The pipeline should determine:
- whether continuity recalculation is required
- whether regeneration is required
- whether detail modules remain valid

The canonical continuity pipeline should eventually become:
- the authoritative stale-state interpretation entry point

---

# Regeneration Relationship

Regeneration should eventually transition toward:

Current Live Case State
→ buildCanonicalContinuityState()
→ AI Operational Synthesis
→ Generated Output Persistence
→ Historical Snapshot Creation

This replaces:
- fragmented regeneration assembly
- UI-owned continuity construction
- partial continuity attachment sequencing

---

# Detail Module Relationship

Detail modules remain downstream continuity-dependent artifacts.

Detail modules should consume:
- progression state
- continuity interpretation
- operational prioritization
- operational instability context

Detail modules should not:
- define continuity authority
- mutate continuity state
- independently derive reassessment interpretation

---

# Reassessment Relationship

Future reassessment workflows should consume:
- canonical continuity state
- deterministic continuity interpretation
- reassessment-sensitive operational continuity

Reassessment workflows should not:
- independently reconstruct continuity state
- generate continuity authority through UI logic
- bypass canonical continuity assembly

---

# Migration Strategy

This phase is a controlled consolidation phase.

The goal is:
- continuity authority stabilization

NOT:
- large-scale rewrite
- database reconstruction
- UI redesign
- architectural replacement

Migration should occur incrementally.

---

# Recommended Consolidation Order

## Phase 1

Centralize:
- canonical payload assembly
- clinical decision input generation
- clinical decision model generation

---

## Phase 2

Centralize:
- progression state derivation
- continuity interpretation derivation

---

## Phase 3

Centralize:
- stale-state interpretation preparation
- reassessment-sensitive continuity preparation

---

## Phase 4

Refactor regeneration flows to consume:
- canonical continuity state

instead of:
- fragmented UI-owned continuity assembly

---

# Transitional Compatibility Rule

Legacy continuity attachment paths may temporarily coexist during migration.

However:
- the canonical continuity builder becomes the target authority layer
- fragmented continuity assembly should gradually be deprecated

---

# Constraints

Avoid:
- architectural overengineering
- dashboard-oriented continuity systems
- predictive continuity systems
- autonomous continuity mutation
- UI-heavy continuity complexity

Maintain:
- deterministic authority
- operational readability
- workflow simplicity
- continuity-safe persistence
- longitudinal continuity integrity

---

# Long-Term Architectural Direction

Long-term architecture should converge toward:

single deterministic continuity authority pipeline

with:
- governed continuity mutation
- governed reassessment evolution
- continuity-safe regeneration
- deterministic continuity interpretation
- AI-assisted operational synthesis

without:
- predictive analytics
- speculative longitudinal forecasting
- fragmented continuity ownership
