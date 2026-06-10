# Next-Agent Handoff

Last updated: 2026-06-10

## Project Summary In Plain English

The OT Clinical Assistant helps an occupational therapist quickly recover the patient story before and across visits. It takes structured case information and visit updates, applies deterministic clinical reasoning, and presents a compact Visit Briefing: what is true now, what changed, what needs attention, and what to do next.

The important product evolution is that it no longer centers on generating a plan once. It now maintains clinical understanding over time. When the patient improves, regresses, reaches a milestone, or changes caregiver/environmental context, the system updates progression and reconciles whether old triggers and barriers should still influence the current recommendation.

The product is a functional MVP. Architecture is relatively mature; real-clinician validation, provenance, correction, mobile field testing, and workflow-value evidence are not.

Start with [Project State of the Union](project-state-of-the-union.md), [Product Maturity Assessment](product-maturity-assessment.md), [Validation Findings Summary](validation-findings-summary.md), and [Opportunity Map](opportunity-map.md).

## Current Strategic Position

Best current category language:

> A clinical cognition and continuity layer that helps rehabilitation clinicians understand what changed, what matters now, and what to do next without reconstructing the patient story.

The established `Clinical Attention System` framing remains useful, especially for explaining the clinician-facing product. The cognition/continuity language explains the deeper platform value: maintained, reconciled, reusable clinical meaning.

The next strategic goal is not broader feature coverage. It is to prove that clinicians can orient, verify, correct, trust, and reuse the current conclusions. OT should remain the validation discipline before PT/SLP expansion.

## Current Product Truths

- The product's core problem is repeated clinical reconstruction, not lack of generated text.
- The primary use case is rapid patient orientation, often immediately before a visit and potentially on mobile.
- Command Center is the primary workflow surface; Patient History is supporting context.
- Current Reality, Attention Required, and Next Action are the primary retained orientation concepts.
- Current Focus is a concise progression- and treatment-aware expression of current reality.
- Since Last Visit and Clinical Impact should explain meaningful change, not replay the record.
- Patient Status / Progression Check is the update event that refreshes longitudinal meaning.
- Visit History should preserve immutable prior context and increasingly tell a visit-based clinical story.
- Trust depends on coherent state transitions, visible evidence, and correction—not fluent AI prose.
- Maintained clinical conclusions may create value across multiple workflows, but reuse must remain clinician-governed.
- The product is not an EMR, billing system, documentation platform first, autonomous decision maker, or predictive recovery model.

## Architecture Truths

- Deterministic reasoning is authoritative.
- AI may synthesize and compress supported reasoning but may not override it.
- Live current state is authoritative; historical snapshots are immutable references.
- Progression readiness is `not_ready`, `emerging`, or `ready_for_evaluation`; readiness never advances treatment autonomously.
- Continuity reconciliation refreshes current relevance at runtime and does not rewrite historical truth.
- Reassessment Trigger Reconciliation classifies prior triggers based on current urgent, positive, and readiness evidence.
- Barrier Reconciliation classifies barriers as active, monitoring, or resolved.
- Activity Constraint Reconciliation separately asks whether a barrier constrains the named target activity and whether it retains blocking weight.
- Safety and regression evidence can override positive progression.
- Clinical Attention decides attention significance; Operational Prioritization ranks treatment emphasis.
- Do not create a separate Attention Relevance authority. If output is wrong, first classify the defect as evidence, validity, ranking, or projection.
- Stable architecture should be consumed by UX and workflow surfaces rather than redesigned.
- Do not change schema, persistence, generation storage, continuity storage, progression storage, or API contracts without explicit approval.

## UX Truths

- The product should feel like a calm clinical command center, not an AI report or dashboard.
- A clinician should understand the current state, meaningful change, required attention, and next action within seconds.
- Hierarchy should come primarily from typography, ordering, whitespace, and progressive disclosure—not decorative cards or color.
- Current clinical reality has the highest visual authority. Historical, explanatory, and configuration content must remain subordinate.
- Case Preview is a meaningful orientation surface and should tell the same story as Visit Briefing.
- Visit Briefing requires compression; supporting detail should not compete with Current Reality / Attention Required / Next Action.
- Mobile is a primary use context, but real-device usability is still unvalidated.
- Use clinician-facing terms: Patient History, Visit History, Refresh Clinical Guidance, Save Clinical Snapshot, and Clinical Briefing.
- Clinical Focus configuration belongs under Advanced Configuration; Current Focus is workflow output. Do not conflate them.

## Validation Truths

- Implementation and tests validate deterministic transition behavior, not clinical effectiveness.
- Internal workflow review and persona-style simulation support the hierarchy, mobile, Case Preview, and trust direction.
- The persona-simulation directory currently contains empty placeholders, so there is no durable experiment corpus to audit.
- No repository evidence establishes real clinician adoption, willingness to pay, actual time savings, or clinical accuracy.
- No evidence establishes reliable behavior across many diagnoses, activities, caregiver arrangements, or environments.
- Future validation should measure reconstruction reduction, orientation speed and correctness, sources consulted, mental effort, retained clinical reality, verification behavior, trust threshold, and workflow reuse.
- Faster output is not success if it produces false confidence or discourages verification.

## Current Implementation Highlights

- `src/lib/buildClinicalDecisionInput.ts` normalizes case data into governed goal, barrier, safety, support, environment, and clinical-lens inputs.
- `src/lib/clinicalDecisionEngine.ts` scores and selects deterministic strategies and produces a reasoning summary.
- `src/lib/buildProgressionState.ts` derives progression state, barriers, milestones, environmental and caregiver conditions, and reassessment-relevant outputs.
- `src/lib/progression/buildProgressionReadiness.ts` prevents readiness under regression, deterioration, medical change, or reassessment concern and otherwise identifies emerging or evaluation-ready progression.
- `src/lib/continuity/reconcileReassessmentTriggers.ts` reconciles operational and progression triggers into active, monitoring, and cleared sets.
- `src/lib/continuity/reconcileBarriers.ts` reconciles prior barriers into active, monitoring, and resolved sets while preserving current safety and clinician-selected limiting factors.
- `src/lib/continuity/reconcileActivityConstraint.ts` distinguishes barrier presence from activity-specific constraint and blocking eligibility.
- `src/lib/currentFocusProgressionAwareness.ts` turns current focus into a concise trajectory statement using progression, readiness, barrier, and activity-constraint evidence.
- `src/lib/commandCenterNextAction.ts` evolves the primary and supporting actions using current safety, reassessment, progression, and reconciliation state.
- `src/lib/buildContinuityInterpretation.ts` supplies deterministic continuity condition, change, reassessment pressure, and instability context for downstream synthesis.
- `src/app/cases/patientEntryPreview.ts` derives compact Current Focus, Attention Required, Since Last Visit, and Next Action signals and reuses the same progression-aware builders.
- `src/app/cases/[id]/CaseWorkspaceClient.tsx` implements the Visit Briefing, Patient Status update flow, Clinical Impact access, Visit History access, live/historical safeguards, and supporting Patient History content.
- Deterministic tests cover activity constraint transitions, barrier reconciliation, safety overrides, recommendation promotion, and preview/briefing consistency.

## Current Known Limitations

- No real-clinician validation corpus.
- Persona simulation files are placeholders rather than completed experiment records.
- Reconciliation uses free-text normalization and phrase matching in areas where structured evidence would be safer.
- Target-activity evidence may be incomplete or ambiguous.
- Provenance is stronger internally than in the clinician-facing interface.
- Clinician correction and conclusion-edit workflows are not mature.
- Visit History preserves snapshots but does not yet consistently communicate the longitudinal clinical story.
- Older snapshots may contain less complete context than current ones.
- Mobile behavior has not been established through real-device field testing.
- Recommendation logic has deterministic tests but not representative clinical case validation.
- Reuse outputs are mostly opportunities, not validated workflows.
- Documentation-adjacent use may create drift if generated language is reused without evidence and correction controls.
- The number of architecture documents creates drift risk when status labels are not maintained.

## Open Questions

1. Can practicing OTs orient faster and correctly using Case Preview and Visit Briefing than with their current sources?
2. Which evidence must be visible before clinicians trust Current Focus and Next Action for different risk levels?
3. What correction interaction preserves deterministic authority without forcing clinicians into technical reconciliation concepts?
4. Which activity-performance fields provide the highest reliability gain with the least intake/update burden?
5. Does Visit History need a standardized snapshot summary payload to tell a coherent story across old and new visits?
6. Which first reuse output creates the most value: reassessment summary, physician update, care conference summary, documentation support, or QA review?
7. Who is the buyer, and which measured outcome supports willingness to pay?
8. How often do current text heuristics misclassify barrier or activity relevance in real clinical language?
9. What privacy, security, support, and instrumentation work is required before a controlled pilot?
10. Which parts of the platform are truly discipline-agnostic, and which must remain OT-specific?

## Recommended First 3 Tasks For The Next Agent

### 1. Create and execute a real-clinician formative validation protocol

Use representative retrospective cases and measure:

- Time to Clinical Orientation;
- correctness of Current Reality, Attention Required, and Next Action;
- Clinical Sources Consulted;
- verification behavior;
- mental effort;
- retained clinical reality; and
- moments of confusion, correction, or false confidence.

Test Case Preview, Visit Briefing, Patient Status update, and Visit History on both desktop and real mobile devices. Store the protocol and anonymized findings in the repository.

### 2. Specify conclusion provenance and clinician correction

Define the minimum clinician-facing evidence under Current Focus and Next Action, including source, date, current observation, and reconciliation basis. Then define how a clinician corrects evidence or rejects a maintained conclusion while preserving immutable history and current-state authority.

This should be a targeted UX and workflow specification, not a new reasoning layer or schema change unless separately approved.

### 3. Design the longitudinal clinical story and one bounded reuse output

Specify how Visit History shows what changed, why it mattered, and how the recommendation evolved. Use that same evidence model to prototype one clinician-reviewed reuse surface—preferably a reassessment summary—before generalizing an output framework.

## Recommended Questions The Next Agent Should NOT Re-Litigate

Do not reopen these decisions without new contradictory evidence:

- Should AI own clinical reasoning? **No; deterministic systems remain authoritative.**
- Should progression readiness automatically advance the patient? **No; it prompts clinician evaluation.**
- Should historical snapshots update when live state changes? **No; they remain immutable.**
- Should continuity reconciliation rewrite historical records? **No; it updates the live current-state projection.**
- Is a barrier that exists always blocking the current activity? **No; activity constraint is a separate relation.**
- Is a separate Attention Relevance architecture needed now? **No; use existing Clinical Attention and Operational Prioritization authorities.**
- Should Command Center and Patient History compete equally? **No; Command Center owns orientation.**
- Should the product become a dashboard-heavy analytics system? **No.**
- Should the product become documentation-first or an EMR replacement? **No.**
- Should PT/SLP expansion precede OT validation? **No.**
- Should UX friction trigger a broad architecture redesign? **No; first improve hierarchy, compression, ordering, labeling, and disclosure.**
- Is simulated persona evidence equivalent to clinician validation? **No.**

## Glossary

| Term | Definition |
| --- | --- |
| Clinical cognition layer | A workflow layer that turns fragmented facts into current, usable clinical understanding while preserving clinician judgment and verification. |
| Clinical continuity infrastructure | The deterministic state, event, reconciliation, and history mechanisms that maintain clinical meaning across visits. |
| Clinical reconstruction event | An occasion when a clinician must reassemble a previously known conclusion from multiple underlying sources before acting. |
| Maintained clinical conclusion | A current, evidence-linked interpretation that persists, is reconciled when evidence changes, and can be corrected or reused under clinician governance. |
| Current Reality | The highest-authority clinician-facing expression of what is clinically and operationally true now, including trajectory and current treatment focus. |
| Attention Required | The current issue that warrants review, monitoring, reassessment, or response because of safety, regression, instability, or meaningful change. |
| Next Action | The highest-priority clinician-facing action derived from current deterministic state, with supporting actions kept subordinate. |
| Progression readiness | A deterministic indication that progression is not ready, emerging, or ready for clinician evaluation; it never authorizes autonomous advancement. |
| Continuity reconciliation | The runtime process that determines whether prior conclusions remain eligible to influence current reasoning, without rewriting historical truth. |
| Reassessment trigger reconciliation | Classification of prior reassessment triggers as active, monitoring, or cleared based on current evidence. |
| Barrier reconciliation | Classification of prior barriers as active, monitoring, or resolved while preserving current safety and clinician-confirmed limits. |
| Activity constraint reconciliation | Determination of whether a barrier still constrains a named target activity and remains eligible for blocking weight, separate from whether the barrier still exists. |
| Visit Briefing | The Command Center's compressed orientation surface for current reality, change, attention, action, and relevant supporting context. |
| Patient Status | The clinician-facing longitudinal update workflow, currently implemented through Progression Check, that records current visit evidence and refreshes maintained meaning. |
| Visit History | Immutable, visit-oriented historical clinical snapshots used for context, continuity review, and controlled restoration—not current truth. |
| Orientation trust | Confidence that the briefing accurately represents current state and changed coherently from prior state, with enough evidence to verify it. |
| Targeted verification | Checking a maintained conclusion against a small, relevant evidence set rather than reconstructing the entire conclusion from the record. |
