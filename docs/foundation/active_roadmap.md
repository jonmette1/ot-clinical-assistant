# OT Clinical Reasoning Assistant — Active Roadmap

---

## Current Highest-Priority Investigation

### Patient Entry Phase 2A — Quick Preview Foundation

Objective:

Define the safest implementation approach for introducing Quick Preview within the Patient Entry experience.

Purpose:

Allow clinicians to rapidly orient around a patient before opening the Command Center while preserving the Command Center as the authoritative workflow surface.

Key Questions:

* What current-state information should be available from Quick Preview?
* How should Current Focus be surfaced?
* How should Attention Required be surfaced?
* How should Since Last Visit be surfaced?
* How should Next Action be surfaced?
* How should Operational Focus be summarized?
* What data already exists and can be reused?
* What additional data loading is required?
* How can Quick Preview avoid becoming a second Command Center?
* What should remain exclusive to Command Center?
* What should remain exclusive to Reference Workspace?

Current State:

Patient Entry Phase 1 completed.

Completed:

* PatientEntryCard implementation
* Patient-oriented information hierarchy
* Command Center entry emphasis
* Patient identity hierarchy correction
* Treatment-frame fallback correction

Not Yet Implemented:

* Quick Preview
* Operational Focus preview
* Current Focus preview
* Attention Required preview
* Since Last Visit preview
* Next Action preview

Status:

Implementation Approved

---

# ACTIVE ROADMAP — Longitudinal Workspace Design Transition

---

# Longitudinal Foundation

## Status

COMPLETE

---

## Established Foundation Artifacts

The following longitudinal authority documents are now considered established:

- Clinical_Progression_Model.md
- Longitudinal_Data_Capture_Foundation.md
- Progression_Check_Data_Model.md
- Clinical_Attention_Model.md
- Longitudinal_State_Model.md
- Progression_Check_UX_Architecture.md

These documents should be treated as the governing authority for future longitudinal workspace design.

---

## Architectural Realization

The platform now possesses sufficient longitudinal architecture to answer:

- What changed?
- Why does it matter?
- What barrier became dominant?
- What milestone was achieved?
- What requires attention today?
- What should treatment focus on next?

The primary limitation is no longer longitudinal architecture.

The primary limitation is workspace design.

---

# Current Product State

The platform has successfully transitioned away from:

- pathway-oriented recommendation synthesis
- competing treatment philosophy generation
- pathway-selection workflows
- intake-driven plan viewing

The platform is now evolving toward:

- a continuity-aware operational prioritization system
- a longitudinal clinical guidance system
- a progression-driven treatment workspace
- a clinical attention support system

---

# Current Product Identity

The system is no longer attempting to answer:

> "Which treatment pathway should the clinician choose?"

The system is no longer primarily attempting to answer:

> "What plan should be generated?"

The system is now attempting to answer:

> "What changed, what requires attention, and what should happen next?"

This framing now governs:

- progression interpretation
- continuity interpretation
- clinical attention
- operational prioritization
- reassessment escalation
- workspace design

---

# Current Architectural Model

## Longitudinal Hierarchy

Barrier Evolution
↓
Functional Change
↓
Milestone Achievement
↓
Clinical Attention
↓
Operational Emphasis
↓
Treatment Focus

---

# Completed Stabilization & Transition Work

## Completed Architectural Transition

Successfully completed:

- removal of live selectedPathway authority
- removal of pathway-centric rendering hierarchy
- removal of visible competing treatment plans
- operational prioritization restructuring
- operational-state authority migration
- continuity-oriented synthesis restructuring
- executive briefing architecture replacement
- instability-driver semantic migration
- feasibility-constraint semantic migration
- environmental-pressure semantic migration
- execution-pressure-point semantic migration
- recommendation-language suppression
- directive-language suppression
- operational observational-language enforcement

---

## Completed Longitudinal Foundation Work

Successfully completed:

- deterministic progression architecture
- continuity architecture
- reassessment architecture
- operational prioritization architecture
- longitudinal data capture foundation
- progression check data model
- clinical attention model
- longitudinal state model
- progression check UX architecture

---

# Current Focus

# Phase 5 — Longitudinal Workspace Design

## Status

ACTIVE

---

## Objective

Transition the product from an intake-driven plan viewer into a longitudinal clinical guidance workspace.

The workspace should help clinicians answer:

- What changed?
- What requires attention?
- What should happen next?

without requiring review of the full evaluation, intake, or historical documentation.

---

## Primary Design Focus

Design the workspace around:

1. Current Clinical Attention
2. Current Operational Emphasis
3. Current Progression Status
4. Reassessment Status
5. Most Recent Longitudinal Event

The workspace should prioritize:

- clinical orientation
- progression check workflows
- attention-driven treatment decisions
- continuity-aware treatment execution

over:

- plan consumption
- intake review
- historical report viewing

---

## Explicit Non-Goals

Do not:

- redesign reasoning architecture
- redesign progression architecture
- redesign continuity architecture
- redesign reassessment architecture
- redesign operational prioritization

These systems should be consumed by the workspace, not redefined by it.

---

# Architectural Priority

Future work should prioritize:

- progression check command center design
- longitudinal workspace architecture
- clinical attention surfacing
- continuity-aware workflow guidance
- progression event capture workflows
- reassessment escalation workflows

rather than:

- dashboard-heavy UX
- timeline-heavy UX
- analytics-driven interfaces
- plan-viewer expansion
- additional pathway abstractions

---

# Deferred / Parking Lot

The following concepts remain intentionally deferred:

- predictive analytics
- autonomous recommendation systems
- timeline-heavy progression systems
- large longitudinal dashboards
- adaptive learning systems
- multi-user collaboration systems
- advanced reporting systems
- automated discharge prediction
- cross-patient pattern intelligence

These may be revisited later only if they support:

- workflow clarity
- clinician trust
- operational usefulness

without increasing:

- cognitive burden
- architectural instability
- workflow complexity

---

# Roadmap Governance Rule

Before adding new workspace functionality, ask:

Does this help the clinician determine:

- what changed?
- what matters?
- what requires attention?
- what should happen next?

If not:

- simplify it
- defer it
- or reject it
