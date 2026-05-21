# OT Clinical Reasoning Assistant — Decision Log

---

# Purpose

This document records finalized architectural, workflow, UX, and product decisions.

The goal is to:
- prevent repeated re-litigation
- maintain architectural consistency
- stabilize product direction
- reduce decision drift

Only finalized decisions belong here.

---

# Decision Format

Each decision should include:
- decision
- rationale
- tradeoff
- status

---

---

# DECISION 001

## Decision
The deterministic reasoning engine is the authoritative clinical reasoning layer.

AI is constrained to synthesis and workflow interpretation.

---

## Rationale
Improves:
- explainability
- clinician trust
- reasoning consistency
- operational defensibility

Reduces:
- AI hallucination risk
- unstable recommendations
- unsupported reasoning generation

---

## Tradeoff
Reduces generative flexibility and autonomous AI behavior.

---

## Status
ACTIVE

---

# DECISION 002

## Decision
The platform prioritizes cognitive compression and workflow clarity over narrative richness.

---

## Rationale
Primary user workflows occur under:
- time pressure
- documentation fatigue
- cognitive overload

Operational usability is prioritized over detailed narrative generation.

---

## Tradeoff
Some clinically interesting narrative detail may be intentionally omitted.

---

## Status
ACTIVE

---

# DECISION 003

## Decision
Environmental realism and caregiver feasibility are core reasoning priorities.

---

## Rationale
Most clinical systems fail to adequately represent:
- real residential environments
- caregiver limitations
- practical workflow feasibility

The platform differentiates itself through operational realism.

---

## Tradeoff
Requires more structured environmental and caregiver input complexity.

---

## Status
ACTIVE

---

# DECISION 004

## Decision
The current product phase prioritizes workflow stabilization before longitudinal expansion.

---

## Rationale
Core workflow usability and reasoning consistency must stabilize before introducing:
- progression systems
- continuity tracking
- longitudinal intelligence

---

## Tradeoff
Some future-facing capabilities are intentionally delayed.

---

## Status
ACTIVE

---

# DECISION 005

## Decision
AI outputs should remain operationally concise and avoid excessive narrative density.

---

## Rationale
Clinicians require:
- rapid orientation
- scanability
- workflow clarity
- actionable synthesis

Large narrative blocks increase cognitive burden.

---

## Tradeoff
Some contextual richness may be reduced.

---

## Status
ACTIVE

# Decision — Phase 2.75 Workflow Stabilization Complete

## Status
APPROVED

## Context

The platform has now completed a major workflow stabilization pass focused on operational continuity, version safety, and editable live-case architecture.

The prior workflow lacked sufficient separation between:
- live operational state
- historical continuity state
- rendered display state
- regeneration-safe state

This created instability risk for future longitudinal progression systems.

---

## Decisions

### 1. Live Operational Case Architecture
The platform will maintain a single editable live operational case state.

The live case is:
- editable
- regeneratable
- operationally authoritative
- continuity-aware

---

### 2. Historical Snapshot Architecture
Historical generations are treated as immutable continuity snapshots.

Historical snapshots are:
- reviewable
- restorable
- non-operational
- continuity references

Historical snapshots should not function as directly editable operational states.

---

### 3. Render vs Operational State Separation
The platform now separates:
- rendered display state (`displayCase`)
from:
- authoritative operational state (`caseData`)

This supports:
- historical review workflows
- continuity-safe rendering
- deterministic restoration
- future longitudinal comparison systems

---

### 4. Continuity-Safe Regeneration
Regeneration workflows now preserve:
- structured case inputs
- clinical reasoning inputs
- selected pathway continuity
- version-aware restoration capability

This establishes foundational support for:
- longitudinal progression
- treatment trajectory analysis
- continuity-aware reasoning systems

---

## Result

The workflow architecture is now considered sufficiently stable to begin:

# Phase 3 — Longitudinal Progression Foundation

## Status
ACTIVE

---

## Decision

The platform will evolve toward a deterministic longitudinal progression framework focused on:

- operational continuity
- functional progression context
- continuity-aware reasoning
- structured reassessment workflows
- progression-aware clinical orientation

The progression system will function as:

> an operational progression and continuity framework

rather than:

> a predictive rehabilitation engine

Progression states are intended to represent:
- operational bottleneck classifications
- continuity orientation contexts
- workflow prioritization states

not:
- recovery scores
- predictive recovery stages
- motivational progression indicators
- autonomous rehabilitation trajectories

---

## Architectural Direction

The progression framework prioritizes:
- deterministic reasoning governance
- explainable progression logic
- cognitively lightweight continuity states
- operational workflow realism
- contextual progression interpretation
- caregiver/environment integration
- continuity-safe progression persistence

The progression system intentionally avoids:
- speculative recovery forecasting
- AI-generated rehabilitation storytelling
- opaque progression scoring
- automated trajectory prediction
- narrative-heavy longitudinal outputs

---

## Current Phase 3A Outcomes

Validated progression semantics now include:
- stabilization
- foundational participation
- supported functional execution
- environmental optimization
- reduced dependency

Progression states are now behaving as:
- operational context classifications
rather than:
- severity labels alone

Examples include:
- preserved independence resisting unnecessary stabilization
- environmental barriers functioning as progression bottlenecks
- participation inconsistency emerging as foundational participation
- transfer instability appropriately triggering stabilization

The progression engine now supports:
- contextual barrier interpretation
- contextual milestone generation
- caregiver-aware progression logic
- environmental progression logic
- continuity summarization
- reassessment trigger generation

while preserving:
- cognitive compression
- workflow clarity
- deterministic explainability
- continuity-safe regeneration

---

## Deferred Direction

Progression comparison systems are intentionally deferred until structured follow-up reassessment workflows exist.

The platform should not infer:
- improvement
- regression
- longitudinal directionality

without explicit updated operational inputs.

Future longitudinal comparison infrastructure will depend on:
- structured visit reassessment workflows
- operational delta updating
- continuity-safe editing architecture
- immutable historical continuity persistence

---

## Tradeoff

The platform intentionally favors:
- operational clarity
- explainable continuity reasoning
- lightweight longitudinal workflows
- clinician orientation
- continuity-safe architecture

over:
- highly technical progression analytics
- predictive rehabilitation modeling
- timeline-heavy visualization systems
- large longitudinal dashboards
- automated progression interpretation systems

This preserves:
- clinician trust
- workflow usability
- cognitive compression
- operational realism

while enabling future structured longitudinal evolution.

---

## Status
ACTIVE