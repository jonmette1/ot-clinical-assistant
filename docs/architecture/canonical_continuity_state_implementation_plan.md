# Canonical Continuity State Implementation Plan

This document defines the implementation strategy for migrating the platform from fragmented continuity assembly toward a centralized deterministic continuity authority pipeline.

## Core Objective

Create:

`src/lib/buildCanonicalContinuityState.ts`

This new builder becomes the authoritative continuity assembly layer.

## Current Continuity Assembly Architecture

Current continuity assembly responsibilities are fragmented across multiple layers.

### Existing Continuity Assembly Points

1. buildCanonicalCasePayload.ts
- canonical payload normalization
- clinical decision input preparation
- clinical decision model preparation

2. buildProgressionState.ts
- progression derivation
- reassessment trigger preparation
- progression-sensitive operational interpretation

3. buildContinuityInterpretation.ts
- continuity interpretation
- reassessment pressure interpretation
- instability interpretation
- continuity alert generation
- operational drift interpretation

4. page.tsx regeneration handlers
- manual payload assembly
- progression attachment
- regeneration sequencing
- stale-state transitions
- persistence sequencing

5. API generation layer
- AI operational synthesis
- continuity interpretation attachment
- generated plan assembly

6. Detail module generation
- downstream continuity-dependent synthesis
- caregiver guidance
- transfer support
- ADL privacy support
- equipment feasibility interpretation

## Target Architecture

Current Live Case State
→ buildCanonicalContinuityState()
→ AI Operational Synthesis
→ Generated Output Persistence
→ Historical Snapshot Persistence
→ Detail Module Generation
→ UI Rendering

## Initial Safe Scope

This implementation phase intentionally avoids:
- database schema changes
- major UI rewrites
- rendering refactors
- pathway-era field removal
- persistence redesign
- detail module redesign
- historical snapshot redesign

## Migration Strategy

### Phase 1 — Builder Creation

Create:
- buildCanonicalContinuityState.ts

using:
- existing deterministic helper functions

without changing:
- UI rendering
- database schema
- generation persistence
- detail module workflows

### Phase 2 — Regeneration Integration

Update regeneration workflows to consume:
- canonical continuity state

instead of:
- fragmented manual payload construction

### Phase 3 — API Consolidation

Reduce split continuity assembly ownership between:
- page.tsx
- /api/generate-plan

### Phase 4 — Stale-State Consolidation

Centralize stale-state interpretation preparation.

### Phase 5 — Detail Module Alignment

Update detail modules to consume:
- canonical continuity context

instead of:
- fragmented continuity dependencies

## Codex Usage Guidance

This implementation phase becomes Codex-worthy once work requires:
- coordinated multi-file refactoring
- regeneration sequencing migration
- continuity dependency tracing
- stale-state propagation refactoring
- continuity assembly migration across multiple layers

## Long-Term Goal

Long-term architecture should converge toward:

single deterministic continuity authority pipeline
