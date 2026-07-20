# Continuity Model Working Draft v0.1

> Repository status note: This is an approved working model for classification and alignment. It is conceptual / architecture-oriented and is not a schema, API, persistence, runtime, or implementation plan. Documentation approval does not authorize runtime changes. Current implementation truth remains governed by `docs/governance/program-state.md` and repository implementation.

## Purpose

This working draft defines the continuity model used to reason about shared foundation candidates and application-specific responsibilities.

The model explains how maintained understanding should persist across time while preserving evidence lineage, current-versus-historical truth, meaningful change, present relevance, and human verification.

## Governing question

How should the platform preserve understanding over time without rewriting history, inventing authority, or forcing users to reconstruct context from scratch?

## Core model

Continuity is the maintained relationship among:

1. prior supported state;
2. new evidence or events;
3. meaningful change;
4. current significance;
5. present attention;
6. evidence lineage;
7. human verification and correction.

The model is not merely temporal storage. It is the interpretation of how prior supported understanding relates to new information and what that relationship means now.

## State concepts

### Current truth

Current truth is the present operational projection used for current work. It should reflect the most current supported understanding without erasing or rewriting historical truth.

### Historical truth

Historical truth is what was true, generated, observed, decided, or understood at an earlier point. Historical truth must remain available for lineage, audit, correction, and explanation.

### Maintained conclusion

A maintained conclusion is a supported conclusion preserved across time until it is reconciled, corrected, resolved, replaced, or invalidated by newer evidence.

### Evidence lineage

Evidence lineage is the source trail connecting maintained conclusions to the evidence, observations, prior state, and change history that support them.

### Meaningful change

Meaningful change is change that matters in the active application context. It is not identical to raw data difference. The platform should identify what changed and why the change matters.

### Attention state

Attention state identifies what requires awareness, review, action, monitoring, or correction now.

## Reconciliation

Reconciliation determines whether prior supported conclusions remain current, need monitoring, are resolved, or should be replaced by newer supported conclusions.

Reconciliation must:

- preserve historical truth;
- keep evidence lineage available;
- distinguish current state from prior state;
- avoid inventing unsupported conclusions;
- avoid becoming an autonomous reasoning authority;
- support human verification and correction.

## Candidate shared foundation concerns

The following concerns may belong in a Shared Continuity Foundation after validation across applications:

- state identity;
- temporal comparison;
- maintained conclusions;
- meaningful-change representation;
- evidence lineage;
- present relevance;
- reconciliation;
- current-versus-historical authority;
- attention state;
- correction consequences.

These concerns remain candidate shared architecture until validated across Clinical Continuity and another application context such as Care Continuity or Patient Management.

## Application-specific responsibilities

### Clinical Continuity

Clinical significance, progression, reassessment, treatment implications, clinical safety, clinician verification, and clinical evidence interpretation are Clinical Continuity concerns unless explicitly validated elsewhere.

### Patient Management

Population awareness, clinical prioritization across a caseload, operational alignment, rapid launch from schedules/rosters/referrals/operational contexts, and caseload understanding are Patient Management concerns unless explicitly implemented and validated elsewhere.

### Care Continuity

Care state, responsibilities, observations, instructions, communication, and caregiver attention remain future Care Continuity concerns and are not implemented in this repository.

## Design principles

- Preserve current truth and historical truth separately.
- Maintain conclusions only when evidence support remains current.
- Make meaningful change understandable, not merely detectable.
- Keep attention oriented to present relevance.
- Keep evidence lineage available for verification and correction.
- Keep deterministic systems authoritative for state transitions and supported reasoning.
- Keep humans authoritative for judgment and final use.
- Treat AI as a communication and synthesis aid, not the authority for truth or reasoning.

## Success measures

The model is useful if it helps the repository:

- classify shared versus application-specific responsibilities;
- identify implementation gaps without treating them as contradictions;
- preserve current and historical truth distinctly;
- avoid premature technical extraction;
- support future validation of shared continuity concepts across applications.

## Implementation boundary

This model may guide classification and audit work. It does not authorize technical extraction, schema changes, API changes, persistence changes, ranking changes, AI behavior changes, UI changes, or application-code changes.
