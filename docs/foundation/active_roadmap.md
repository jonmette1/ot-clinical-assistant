# OT Clinical Reasoning Assistant — Active Roadmap

---

## Current Highest-Priority Initiative

### Intake Fidelity Normalization

Objective:

Strengthen intake quality so downstream clinical reasoning receives clearer, higher-signal inputs with less clinician friction and fewer clinically meaningful contradictions.

Purpose:

Support workflow optimization by improving the fidelity of information entering the clinical reasoning pipeline without changing architecture, routes, APIs, persistence, or generated-output contracts.

Status:

Phase 1A Complete

Current Focus:

Phase 1B Contradiction Guardrails

Completed:

* Intake Fidelity Audit
* Intake Fidelity Normalization Specification
* Intake Fidelity Phase 1A
* High-signal intake hierarchy
* Minimum viable intake validation
* Clinical Decision Inputs removal from the visible intake experience

Planned:

* contradiction classification
* blocking validation
* warning validation
* caregiver consistency validation
* environmental consistency validation
* transfer consistency validation

Implementation Guardrails:

* Keep validation clinician-facing and workflow-supportive.
* Avoid over-validating legitimate clinical complexity.
* Preserve existing data model and API contracts unless explicitly approved.
* Do not redesign the reasoning architecture.

Patient Entry Phase 1, Phase 1.1, and Phase 2A Quick Preview are complete and should not be treated as the primary roadmap initiative.

---

# ACTIVE ROADMAP — Workflow Optimization

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

These documents should be treated as stable foundation for current workflow optimization work.

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

The primary limitation is workflow optimization, especially intake fidelity and contradiction prevention.

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

# Workflow Optimization — Intake Fidelity Phase 1B

## Status

ACTIVE

---

## Objective

Improve intake fidelity and contradiction prevention within the existing longitudinal clinical guidance workspace.

The workspace should help clinicians answer:

- What changed?
- What requires attention?
- What should happen next?

without requiring review of the full evaluation, intake, or historical documentation.

---

## Primary Workflow Focus

Strengthen intake fidelity around:

1. Clinically meaningful contradiction classification
2. Blocking validation for unsafe or impossible combinations
3. Warning validation for lower-risk inconsistencies
4. Caregiver consistency validation
5. Environmental consistency validation
6. Transfer consistency validation

The workflow should prioritize:

- high-signal intake data
- clinician-facing validation language
- minimal additional friction
- continuity-aware downstream reasoning quality

over:

- new architecture
- new routes
- API contract changes
- persistence changes

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

# Workflow Priority

Near-term work should prioritize:

- contradiction classification
- blocking validation
- warning validation
- caregiver consistency validation
- environmental consistency validation
- transfer consistency validation

rather than:

- dashboard-heavy UX
- timeline-heavy UX
- analytics-driven interfaces
- plan-viewer expansion
- additional pathway abstractions
- new reasoning systems

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
