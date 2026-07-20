# Product Vision

## Repository status note

Founder-approved product direction. This document should be preserved as approved product direction and should not be reduced to an implementation inventory. It does not authorize application-code, schema, API, persistence, clinical-logic, continuity-logic, progression-logic, ranking, AI-generation, UI, or runtime changes.

## Vision

The Continuity Platform exists to reduce repeated reconstruction burden for people supporting complex human situations over time.

The product should preserve maintained understanding, make meaningful change visible, orient attention to what matters now, and keep evidence lineage available for human verification.

## Governing idea

Continuity is not simply record storage, summarization, or dashboard reporting. Continuity is the maintained relationship between prior supported understanding, new evidence, meaningful change, present relevance, and next implications.

## Product direction

The approved product direction includes:

- a broader Continuity Platform direction;
- a candidate Shared Continuity Foundation for concepts that may generalize across applications;
- Clinical Continuity as the implemented clinical application in this repository;
- an OT configuration as the current implemented Clinical Continuity configuration;
- Patient Management as the population-facing application direction that answers “Who needs my attention right now?”;
- Care Continuity as a future application concept that may pressure-test whether continuity concepts generalize beyond clinical workflows.

## Goals

The platform should help users:

1. understand current state without reconstructing context from memory;
2. identify meaningful change since prior review;
3. distinguish current truth from historical truth;
4. see why a conclusion is supported;
5. orient to what requires attention now;
6. communicate supported understanding without turning AI into the reasoning authority;
7. correct or verify maintained understanding when human judgment requires it.

## Design principles

- Preserve current meaning, not only historical records.
- Separate current truth from historical truth.
- Interpret meaningful change rather than listing raw deltas.
- Orient attention to present relevance and next implications.
- Keep conclusions traceable to evidence.
- Keep deterministic systems authoritative for supported state, reasoning, transitions, and current-versus-historical truth.
- Keep humans authoritative for verification, correction, judgment, and final use.
- Use AI only for synthesis, organization, explanation, and communication of supported conclusions.
- Do not equate simulated validation with real-clinician proof.

## Relationship among applications

Clinical Continuity, Patient Management, and Care Continuity should be understood as distinct product/application directions with different users, questions, authority boundaries, and workflows.

- Clinical Continuity preserves patient-level clinical understanding.
- Patient Management orients population-level attention and launches patient-level work.
- Care Continuity remains a future concept and is not implemented in this repository.

## Scope boundaries

This vision does not declare that:

- Patient Management is currently implemented as a standalone application;
- Care Continuity is implemented;
- the current Clinical Continuity implementation is a proven universal platform engine;
- simulated validation is real-clinician proof;
- approved product direction automatically changes the active roadmap;
- documentation approval authorizes schema, API, persistence, clinical logic, continuity logic, progression logic, ranking, AI behavior, or runtime changes.
