# Program State

## Purpose

This document records what is true in the repository today and what newly approved direction has been accepted for documentation consolidation. It is a state-transfer document, not a product vision, roadmap, or implementation plan.

## Current platform identity

The repository is the **Clinical Continuity Platform** implementation inside the broader **Continuity Platform** direction. The broader platform direction is approved, but the current codebase should not be described as a proven universal continuity platform.

## Current implemented product state

The repository contains substantial **Clinical Continuity** implementation with an **OT configuration**, including:

- deterministic clinical reasoning and operational prioritization;
- longitudinal state and progression logic;
- continuity interpretation;
- reconciliation of current relevance;
- maintained clinician-facing conclusions;
- Supporting Evidence;
- Why This Changed;
- Progression Constraint;
- Progress Evidence;
- Reassessment Summary;
- Session Focus;
- patient caseload prioritization;
- Visit Briefing;
- Clinical Translation Workspace concepts in current documentation and UI direction;
- current-versus-historical state handling.

## Newly approved product direction

The consolidated approved direction now includes:

- [`../foundation/platform-foundation.md`](../foundation/platform-foundation.md) as the enduring platform foundation;
- [`../foundation/product-vision.md`](../foundation/product-vision.md) as product vision direction;
- [`../architecture/continuity-model-working-draft-v0.1.md`](../architecture/continuity-model-working-draft-v0.1.md) as the working continuity model;
- [`../applications/clinical/clinical-continuity-v0.1.md`](../applications/clinical/clinical-continuity-v0.1.md) as Clinical Continuity application direction;
- [`../applications/patient-management.md`](../applications/patient-management.md) as Patient Management product direction.

These documents are approved direction. They do not, by themselves, change runtime behavior or declare unimplemented scope complete.

## Applications currently defined

| Application or product area | Current status |
| --- | --- |
| Continuity Platform | Approved broader direction; not yet proven as a universal shared implementation layer. |
| Shared Continuity Foundation | Candidate shared architecture; requires validation across applications before technical extraction. |
| Clinical Continuity | Implemented application layer in this repository. |
| OT configuration | Current implemented Clinical Continuity configuration. |
| Patient Management | Approved product direction; currently represented only through existing Clinical Continuity patient-oriented surfaces, not a new implemented application. |
| Care Continuity | Future application concept; not implemented in this repository. |
| PT, SLP, and other discipline expansion | Not implemented and not active without explicit approval. |

## Candidate shared continuity primitives

The following may plausibly contribute to a candidate Shared Continuity Foundation, but cross-application reuse is not proven:

- state identity and current-state projection;
- temporal comparison;
- meaningful-change handling;
- evidence-linked maintained conclusions;
- relevance reconciliation;
- current-versus-historical truth separation;
- attention orientation;
- correction and provenance implications.

These should be classified during the active work boundary before technical extraction.

## Clinical Continuity-specific concerns

The following remain Clinical Continuity concepts unless explicitly validated elsewhere:

- clinical significance;
- progression;
- reassessment;
- treatment implications;
- clinical safety;
- clinician verification and correction;
- operational prioritization;
- clinical attention;
- clinical evidence interpretation.

## OT-specific concerns

The following remain OT configuration concerns:

- ADLs;
- transfers;
- assistance levels;
- home-health vocabulary;
- occupational performance;
- home environment and equipment interpretation;
- caregiver feasibility in OT workflows;
- OT-specific decision logic and evidence vocabulary.

## Delivery infrastructure

The repository also contains delivery infrastructure, including:

- Next.js application structure;
- Supabase integration;
- OpenAI-assisted synthesis;
- application routes;
- persistence mechanisms;
- UI components;
- deterministic and application tests.

Delivery infrastructure is not itself the Continuity Platform architecture.

## Validation status

| Evidence category | Current status |
| --- | --- |
| Implemented | Substantial Clinical Continuity and OT configuration capabilities exist. |
| Internally tested | Deterministic logic and application behavior have repository tests and internal review. |
| Simulated or persona-validated | Several workflow claims are supported by persona, synthetic, comparative, or internal simulations. |
| Real-clinician validated | Not established. |
| Pilot-ready | Not established. |
| Production-ready | Not established. |

Evidence boundary:

- real-clinician usability is not established;
- measured reconstruction reduction is not established;
- clinical accuracy across representative cases is not established;
- adoption and willingness to pay are not established;
- pilot and production readiness are not established;
- simulated validation must not be described as clinician proof.

## Known gaps

Known documentation or implementation gaps include:

- the candidate shared foundation has not been classified component by component;
- Patient Management direction is approved but not converted into implementation scope;
- Care Continuity is not implemented;
- real-clinician validation remains required;
- correction and provenance hardening remain important;
- mobile and field-context readiness require further validation;
- OT-specific logic may not transfer to other domains;
- universal architecture reuse remains an unproven assumption.

## Current active implementation boundary

The active boundary remains Continuity Platform Foundation Definition. No product functionality, schemas, APIs, persistence, deterministic reasoning, continuity logic, progression logic, clinical authority, AI generation behavior, or runtime behavior changes are authorized by this handoff PR.

## Next implementation boundary

The next implementation boundary awaits Founder or Chief of Staff confirmation through the active governance process. This program-state handoff does not convert approved product direction into implementation scope and does not advance the roadmap by itself.
