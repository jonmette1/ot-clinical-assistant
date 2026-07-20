# Product Vision

> Repository status note: This is an approved product-direction document. It describes enduring direction and does not serve as current implementation inventory. Documentation approval does not authorize runtime, schema, API, persistence, deterministic reasoning, continuity, progression, ranking, AI-generation, UI, or other application-code changes. Current implementation truth remains governed by `docs/governance/program-state.md` and repository implementation.

## Purpose

The Continuity Platform exists to reduce repeated reconstruction burden for people supporting complex human situations over time.

Users should not have to rebuild context from memory, scattered records, prior summaries, and disconnected operational signals every time they act. The platform should preserve maintained understanding, make meaningful change visible, orient attention to what matters now, and keep evidence lineage available for verification and correction.

## Vision

The product vision is a continuity platform that preserves the relationship between prior supported understanding, new evidence, meaningful change, present relevance, and next implications.

The platform should help people answer:

- What is currently true?
- What changed?
- Why does the change matter?
- What still needs attention?
- What evidence supports this understanding?
- Where should I go next to act or verify?

## Core product belief

Continuity is not the same as storage, summarization, analytics, or automation. Continuity is maintained understanding across time.

A continuity product should not merely accumulate historical artifacts. It should preserve the current operational meaning of supported evidence while keeping historical truth available and intact.

## Product direction

The approved direction includes:

- **Continuity Platform** — the broader product direction organized around maintained understanding, meaningful change, evidence lineage, and attention orientation.
- **Shared Continuity Foundation** — a candidate foundation for reusable continuity concepts that may generalize across applications after validation.
- **Clinical Continuity** — the implemented clinical application in this repository.
- **OT configuration** — the current implemented Clinical Continuity configuration.
- **Patient Management** — the population-facing application direction that answers “Who needs my attention right now?” and launches users into Clinical Continuity.
- **Care Continuity** — a future application concept that may pressure-test whether continuity concepts generalize beyond clinical workflows.

## Goals

The product should help users:

1. preserve current understanding across time;
2. distinguish current truth from historical truth;
3. see meaningful change without manually comparing old and new records;
4. understand why a change matters in the active application context;
5. orient attention to what requires action, review, monitoring, or correction now;
6. maintain evidence lineage for supported conclusions;
7. move from population or operational context into patient-level continuity work where appropriate;
8. communicate supported conclusions without turning AI into the reasoning authority;
9. verify, correct, reject, or update maintained understanding through human judgment.

## Application relationships

### Clinical Continuity

Clinical Continuity preserves patient-level clinical understanding across time. It supports clinical significance interpretation, progression interpretation, reassessment support, operational prioritization, clinician verification, and current-versus-historical state handling.

### Patient Management

Patient Management is population-facing. It answers “Who needs my attention right now?” by supporting population awareness, clinical prioritization, operational alignment, caseload understanding, and rapid launch into Clinical Continuity.

### Care Continuity

Care Continuity remains a future application concept. It may later test whether continuity concepts apply to care state, responsibilities, observations, instructions, communication, and caregiver attention. It is not implemented in this repository.

## Design principles

- Preserve current meaning, not only historical records.
- Separate current truth from historical truth.
- Interpret meaningful change rather than listing raw deltas.
- Orient attention to present relevance and next implications.
- Preserve maintained conclusions only while support remains current.
- Keep conclusions traceable to evidence, source context, and change history.
- Allow humans to verify, correct, reject, and judge conclusions.
- Keep deterministic systems authoritative for supported state, reasoning, transitions, and current-versus-historical truth.
- Use AI only for synthesis, organization, explanation, and communication of supported conclusions.
- Prioritize cognitive compression and workflow clarity over narrative richness.
- Avoid treating simulated or persona-based validation as real-world proof.
- Avoid declaring a universal shared engine before cross-application validation.

## Success measures

The product direction should be judged by whether users can:

- reduce repeated reconstruction of context;
- identify meaningful change quickly;
- understand current relevance and next implications;
- verify the evidence behind maintained conclusions;
- preserve current and historical truth distinctly;
- move from population attention to patient-level continuity without losing context;
- trust that AI communication is bounded by deterministic and human authority.

## Product boundaries

This vision does not declare that:

- Patient Management is currently implemented as a standalone application;
- Care Continuity is implemented;
- the current Clinical Continuity implementation is a proven universal platform engine;
- simulated validation is real-clinician proof;
- approved product direction automatically changes the active roadmap;
- documentation approval authorizes schema, API, persistence, clinical logic, continuity logic, progression logic, ranking, AI behavior, UI, or runtime changes.
