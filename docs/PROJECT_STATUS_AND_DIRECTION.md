# PROJECT STATUS AND DIRECTION

## Purpose

This document exists to rapidly orient future agents to the current state of the OT Clinical Assistant project.

It is not a roadmap.

It is not an architecture document.

It is not a decision log.

It represents the current project reality and approved direction.

---

# Current Project State

The project has transitioned from:

Architecture Discovery

to:

Workflow Optimization

The major architecture-discovery workstreams are stabilized. Current work should focus on clinician workflow quality, intake fidelity, contradiction prevention, scanability, and cognitive load reduction rather than new platform architecture.

Completed implementation reality now includes:

* Patient Entry Phase 1.
* Patient Entry Phase 1.1 fallback and hierarchy corrections.
* Patient Entry Phase 2A Quick Preview primitives.
* Reference Workspace cleanup and boundary clarification.
* Intake Fidelity Audit.
* Intake Fidelity Normalization Specification.
* Intake Fidelity Phase 1A.

Current active focus:

* Intake Fidelity Phase 1B.
* Contradiction Guardrails Planning.

Near-term implementation should preserve the completed Patient Entry and Reference Workspace work while strengthening intake quality and preventing clinically meaningful contradictions before generation.

---

# Current Product Identity

The OT Clinical Assistant is no longer primarily:

* an evaluation generator
* a treatment plan generator
* a documentation tool

The product is evolving into:

A Longitudinal Clinical Navigation Platform

The purpose of the system is to reduce clinician cognitive burden across multiple visits by carrying continuity, progression, attention management, and clinical context forward over time.

---

# Current Product Evolution

Phase 1

Evaluation Engine

↓

Phase 2

Generated Plan Engine

↓

Phase 3

Longitudinal Tracking Engine

↓

Current Direction

Clinical Navigation Engine

The product is now focused on helping clinicians answer:

* What changed?
* Why does it matter?
* What requires attention?
* What should I do next?

without reconstructing prior visits from memory.

---

# What Has Been Validated

The following systems are considered implemented and largely validated:

## Deterministic Clinical Reasoning

Authoritative clinical reasoning remains deterministic.

AI is not allowed to invent reasoning.

AI may assist with:

* synthesis
* explanation
* communication
* organization

---

## Continuity Architecture

Implemented.

Validated.

Supports longitudinal continuity and historical state preservation.

---

## Progression Architecture

Implemented.

Validated.

Supports:

* improving
* stable / plateau
* declining

state classification.

---

## Reassessment Architecture

Implemented.

Validated.

Supports reassessment recommendation and attention escalation.

---

## Longitudinal Event Architecture

Implemented.

Validated.

Progression updates create longitudinal events.

Longitudinal events update:

* current longitudinal state
* clinical attention state
* operational prioritization

when appropriate.

---

## Clinical Attention Architecture

Implemented.

Validated.

Clinical attention now represents one of the primary clinician-facing outputs of the platform.

---

## Operational Prioritization

Implemented.

Validated.

Operational prioritization is continuity-aware and progression-aware.

---

## Command Center Hierarchy

Implemented.

Validated.

Current hierarchy:

1. Case Status
2. Since Last Visit
3. Attention Required
4. Current Focus
5. Next Action

This hierarchy should not be redesigned without strong justification.

---

# Current UX Objective

The Command Center should allow a clinician to answer within approximately 5 seconds:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

without reconstructing prior visits from memory.

The software should carry the continuity burden.

The clinician should not.

---

# Approved Navigation Direction

The platform is transitioning from:

Case-Centric Navigation

to:

Patient-Centric Navigation.

Approved model:

Patient

├── Command Center
└── Reference Workspace

---

# Command Center Purpose

Current Clinical Reality

The Command Center is the primary clinician workflow surface.

Examples of Command Center content:

* Case Status
* Since Last Visit
* Attention Required
* Current Focus
* Next Action
* Progression Update
* Recent Visit History

Command Center exists to support:

visit preparation
visit execution
visit updates

---

# Reference Workspace Purpose

Historical Context

Clinical Context

Deep Review

Examples:

* Evaluation
* Goals
* Caregiver Context
* Environmental Context
* Operational Pressures
* Historical Snapshots
* Version History
* Generated Outputs
* Clinical Reasoning Context

Reference Workspace should not compete with Command Center orientation.

---

# Completed Navigation and Workspace Reality

Patient-centric navigation and workspace separation are now implemented.

Completed navigation reality includes:

* Patient Entry surface on `/cases`.
* Command Center route for primary clinician workflow orientation.
* Reference Workspace route for review, context, investigation, historical snapshots, generated outputs, and deeper longitudinal review.
* Shared workspace rendering with mode-specific Command Center and Reference Workspace presentation.
* Recent orientation support through Patient Entry Quick Preview primitives.

The current project limitation is no longer navigation architecture or workspace separation. The current limitation is workflow optimization, especially intake fidelity and contradiction prevention.

---

# Current MVP Assessment

Approximate readiness:

90–92%

Major architecture work is largely complete.

Remaining work is concentrated around:

* intake fidelity
* contradiction prevention
* workflow refinement
* historical review usability
* external clinician validation

These are workflow completion problems, not architecture problems.

---

# Common Agent Failure Modes

Do NOT:

* reopen architecture discussions
* redesign progression architecture
* redesign continuity architecture
* redesign reassessment architecture
* redesign operational prioritization
* propose timeline workspaces
* propose analytics dashboards
* create additional workspaces
* stop implementation for additional planning

Assume:

* architecture is approved
* navigation direction is approved
* migration plan is approved

Focus on execution.

---

# Current Best Next Action

Intake Fidelity Phase 1B

Current implementation focus:

Contradiction Guardrails Planning

within the existing intake workflow and clinical reasoning architecture.

Near-term work should strengthen:

* contradiction classification
* blocking validation
* warning validation
* caregiver consistency validation
* environmental consistency validation
* transfer consistency validation

without route changes, API contract changes, persistence changes, or architecture redesign.

---

# How To Think About The Product

The product is no longer:

Open Case
→ Read Information

The product is becoming:

Open Patient
→ Orient
→ Understand Change
→ Determine Attention Needs
→ Act

That transition should guide all future implementation decisions.

---

# STATUS UPDATE — CLINICAL LANGUAGE COMPRESSION PHASE 1

## Status

COMPLETE

---

## Objective

Reduce Command Center narrative density while preserving:

* clinical meaning
* reasoning fidelity
* progression fidelity
* continuity fidelity
* operational prioritization fidelity

without modifying:

* reasoning architecture
* progression architecture
* continuity architecture
* API contracts
* persistence structures
* generated output structures

---

## Scope Completed

Implemented:

### Current Focus

Command Center presentation language compressed to improve scanability and clinician readability.

### Attention Required

Command Center presentation language compressed to improve directness and reduce report-style phrasing.

---

## Validation Outcome

Multi-persona evaluation indicates significant improvement.

Consensus findings:

| Area                              | Result   |
| --------------------------------- | -------- |
| Clinician-written feel            | Improved |
| AI-generated feel                 | Reduced  |
| Functional language               | Improved |
| Transfer-specific reasoning       | Improved |
| Caregiver realism                 | Improved |
| Environmental realism             | Improved |
| Clinical credibility              | Improved |
| Documentation-style communication | Improved |

---

## Key Finding

The primary issue was not reasoning quality.

The primary issue was communication density.

The project validated that clinician trust and usability can improve substantially through language compression without changing underlying reasoning systems.

---

## Current State

The platform now communicates more frequently in terms of:

* transfer safety
* physical assistance needs
* caregiver capability
* endurance limitations
* environmental hazards
* functional performance

rather than abstract workflow terminology or system-oriented summaries.

---

## Future Guidance

Clinical Language Compression Phase 1 is considered complete.

Do not continue compression work automatically.

Future compression efforts should be separately validated and scoped.

Current project focus should remain:

* workflow refinement
* clinician validation
* visual authority maturation
* product usability improvements

rather than additional reasoning-system expansion.

### Reference Workspace Cleanup (Completed)

Objective:

Reduce clinician-facing diagnostic noise and remove legacy continuity validation artifacts that no longer align with the current workflow model.

Completed:

* Removed Dev Only Progression State
* Removed Start Follow-Up Update
* Removed Longitudinal Validation
* Removed Operational Change Classification
* Removed Decision Transparency
* Removed Continuity Status

Preserved:

* Operational Focus
* Supporting Progression Summaries
* Current Longitudinal State
* Latest Progression Event
* Historical Snapshots
* Progression architecture
* Continuity architecture
* Operational prioritization architecture

Key Outcome:

The Reference Workspace is now focused on supporting clinical understanding, historical context, progression review, and treatment rationale rather than exposing internal continuity-engine diagnostics.

Current Ownership Model:

### Command Center

Answers:

* What matters?
* What changed?
* What requires attention?
* What should I do next?

### Reference Workspace

Answers:

* Why does this matter?
* What supporting context exists?
* What progression information exists?
* What historical information exists?
* What details support the current plan?

Decision Transparency and Continuity Status have been retired as clinician-facing concepts.

Future consideration of confidence indicators and patient-preview workflows remains deferred to future opportunities.

## Patient Entry Phase 1 — Completed

Status: Complete

Outcome:

- Reframed /cases from saved-case management toward patient-entry orientation.
- Introduced PatientEntryCard presentation layer.
- Elevated patient identity, treatment frame, clinical context, and recency.
- Preserved existing routing, queries, APIs, schema, and persistence.
- Added explicit Open Command Center action.
- Corrected Phase 1.1 fallback hierarchy:
  - Case title becomes primary identity when patient name is unavailable.
  - Treatment-frame fallback hierarchy improved.
- Patient Entry Phase 2A Quick Preview primitives implemented.
- Additional preview loading supports rapid orientation before opening the Command Center.

Notes:

Patient Entry now functions as an orientation surface with subordinate Quick Preview support.

Quick Preview should remain lightweight and should not become a second Command Center.

Patient Entry card context deduplication completed.
Treatment frame and clinical context now represent distinct information.