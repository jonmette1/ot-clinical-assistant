# Project Status and Direction

Last updated: 2026-06-03

---

## Purpose

This document summarizes the current state, direction, validated decisions, and near-term priorities for the OT Clinical Assistant. It is intended to orient contributors without requiring them to read historical audit threads.

For the fastest executive briefing, read `docs/PROJECT_SNAPSHOT.md` first.

---

## Current Project State

The OT Clinical Assistant is a patient-centric, continuity-aware clinical command center for adult rehabilitation and home health occupational therapy.

The project has completed major architecture stabilization. Current work is no longer primarily about inventing reasoning systems. It is about making the existing reasoning understandable, trustworthy, updateable, and useful in real clinical workflow.

Completed implementation reality includes:

* deterministic clinical reasoning authority
* continuity architecture
* progression architecture
* reassessment architecture
* operational prioritization architecture
* patient entry and Quick Preview
* Command Center and Reference Workspace routes
* Reference Workspace cleanup
* Intake Fidelity Phase 1A
* Clinical Language Compression Phase 1
* Clinical Impact Summary
* Clinical Status Explainability
* Clinical Impact CTA
* Treatment Focus refinement
* Next Action Refresh

Current active focus:

* Snapshot Awareness
* Intake Fidelity validation
* EMR / workflow integration research
* clinician testing
* Intake Fidelity Phase 1B contradiction guardrails as the next implementation candidate after validation

---

## Current Product Identity

The product is no longer primarily trying to answer:

> Which treatment pathway should the clinician choose?

It is no longer primarily trying to answer:

> What AI-generated plan should be shown?

It is now trying to answer:

> What changed, what matters, what requires attention, and what should happen next?

The product should feel like a clinical operations command center, not a dashboard, analytics tool, or AI report.

---

## Current Product Evolution

Previous state:

Case → Generated Plan → Review Information

Current state:

Patient → Orient → Understand Change → Determine Attention Needs → Act

Current authority model:

Structured Intake / Case Data
→ Deterministic Clinical Decision Inputs
→ Clinical Decision Engine
→ Progression and Continuity Interpretation
→ Operational Prioritization
→ Generated Plan Synthesis
→ Command Center / Reference Workspace
→ Progression Check Updates
→ Longitudinal Event + Current State Refresh

---

## What Has Been Validated

### Deterministic Clinical Reasoning

Validated:

* deterministic reasoning should remain the clinical authority layer
* generated text should synthesize, explain, and organize deterministic outputs
* AI should not independently decide clinical truth

### Continuity Architecture

Validated:

* current operational case state is live truth
* historical generations are immutable snapshots
* continuity changes must be governed to avoid corrupting prior reasoning
* clinicians should not see internal continuity terminology as primary UI

### Progression Architecture

Validated:

* progression should support clinical orientation and reassessment-sensitive prioritization
* progression should explain meaningful change, not forecast recovery
* progression check updates should refresh current state and attention signals

### Operational Prioritization

Validated:

* Current Operational State / Treatment Focus is the primary workspace output
* operational prioritization should dominate pathway-style alternatives
* caregiver feasibility, environmental constraint, and transfer safety are core treatment-priority inputs

### Command Center Hierarchy

Validated hierarchy:

1. Current Clinical Reality / Current Focus
2. Case Status
3. Since Last Visit
4. Attention Required
5. Next Action
6. Recent Visit History / supporting orientation content

### Command Center / Reference Workspace Split

Validated:

* Command Center is the primary workflow surface for rapid orientation
* Reference Workspace is for review, context, historical snapshots, generated outputs, and deeper investigation
* Reference content should not compete with current orientation

### Clinical Language Compression

Validated:

* clinician trust improved when report-style language was compressed into more direct clinical language
* communication density was a larger usability issue than reasoning quality
* future language changes should be scoped and validated, not automatically expanded

### Longitudinal Clinical Delta Experience

Validated directionally through implementation:

* Clinical Impact Summary should explain what changed and what was confirmed after progression updates
* Clinical Status should be explainable without exposing internal continuity classifications
* Clinical Impact CTA should bring clinicians back to the delta summary
* Treatment Focus should remain concise and operational
* Next Action should reflect newer longitudinal meaning and avoid stale generated-plan actions when current updates supersede them

---

## Current UX Objective

The current UX objective remains Command Center normalization and clinician orientation.

The interface should prioritize:

* hierarchy
* scanability
* cognitive load reduction
* typography-driven organization
* whitespace-driven organization
* clinically meaningful color
* workflow continuity

Avoid:

* decorative color systems
* category-based color systems
* excessive card nesting
* dashboard-style fragmentation
* exposing system internals as workflow content

---

## Approved Navigation Direction

The approved navigation model is patient-centric:

Patient
├── Command Center
└── Reference Workspace

### Command Center Purpose

The Command Center should allow a clinician to answer quickly:

* Is the patient improving, stable, or declining?
* What changed since the last visit?
* Why does that change matter?
* What requires attention today?
* What should I do next?

### Command Center Content

Command Center content should prioritize:

* Case Status
* Since Last Visit
* Attention Required
* Current Focus / Treatment Focus
* Next Action
* Recent Visit History
* Clinical Impact Summary when a progression update has occurred

### Reference Workspace Purpose

Reference Workspace content includes:

* evaluation
* goals
* caregiver context
* environmental context
* operational pressures
* historical snapshots
* version history
* generated outputs
* full longitudinal review

Reference content supports orientation but should not compete with it.

---

## Completed Navigation and Workspace Reality

Completed navigation reality includes:

* patient entry list
* PatientEntryCard presentation layer
* Command Center route
* Reference Workspace route
* Quick Preview primitives
* shared workspace renderer
* Reference Workspace cleanup and boundary clarification

Patient Entry, Quick Preview, Reference Workspace cleanup, and Intake Fidelity Phase 1A are completed reality. Do not restart them as discovery work unless explicitly reopened.

---

## Current MVP Assessment

The MVP is directionally strong because it has:

* a defensible clinical reasoning position
* deterministic authority
* continuity-aware progression handling
* patient-centric navigation
* operational prioritization
* a Command Center workflow surface
* a Reference Workspace for deeper context
* clinical delta explanation after progression updates

The MVP is still exposed to adoption risk because it needs stronger validation around:

* snapshot/live-state clarity
* structured intake tolerance
* contradiction guardrail usefulness
* EMR and documentation workflow fit
* clinician trust under real patient complexity

---

## Current Best Next Action

Snapshot Awareness is the current best next implementation item.

Rationale:

The recent longitudinal delta sprint increased the importance of state clarity. Clinicians must understand whether they are viewing the live Command Center state, a historical generated snapshot, or reference context. This is a clinical safety and trust issue, and it can be improved through hierarchy, labeling, and microcopy without changing architecture.

Implementation should focus on:

* clear live-state versus snapshot-state labeling
* snapshot recency/context language
* keeping snapshots subordinate to current operational state
* avoiding dashboard-style timelines
* preserving current data model and API contracts

---

## Roadmap Status

Current ranked priorities:

1. Snapshot Awareness
2. Intake Fidelity Validation
3. EMR / Workflow Integration Research
4. Clinician Testing
5. Intake Fidelity Phase 1B Contradiction Guardrails

Intake Fidelity Phase 1B remains important, but it should be implemented with validated thresholds and clinician-facing language so it improves reasoning fidelity without creating excessive intake friction.

---

## Common Agent Failure Modes

Future agents should avoid:

* proposing new reasoning architecture when UX hierarchy would solve the problem
* reintroducing pathway selection
* treating historical snapshots as competing current states
* exposing continuity internals as workflow language
* creating dashboards or timeline-heavy analytics
* expanding intake validation without considering clinician friction
* changing schema, API contracts, or generated-output structures without explicit approval
* confusing Reference Workspace context with Command Center orientation

---

## How To Think About The Product

The clinician should not have to reconstruct prior visits from memory.

The software should carry the continuity burden.

The Command Center should show current clinical reality, meaningful change, required attention, and immediate action with minimal visual noise.

Reference content, historical snapshots, and generated outputs should support that workflow rather than dominate it.
