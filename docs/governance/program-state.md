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
- [`../foundation/shared-continuity-foundation.md`](../foundation/shared-continuity-foundation.md) as the approved conceptual Shared Continuity Foundation;
- [`../foundation/shared-continuity-foundation-disposition-record.md`](../foundation/shared-continuity-foundation-disposition-record.md) as the candidate capability disposition record;
- [`../foundation/product-vision.md`](../foundation/product-vision.md) as product vision direction;
- [`../architecture/continuity-model-working-draft-v0.1.md`](../architecture/continuity-model-working-draft-v0.1.md) as the working continuity model;
- [`../applications/clinical/clinical-continuity-v0.1.md`](../applications/clinical/clinical-continuity-v0.1.md) as Clinical Continuity application direction;
- [`../applications/patient-management.md`](../applications/patient-management.md) as Patient Management product direction.

These documents are approved direction. They do not, by themselves, change runtime behavior or declare unimplemented scope complete.

## Applications currently defined

| Application or product area | Current status |
| --- | --- |
| Continuity Platform | Approved broader direction; not yet proven as a universal shared implementation layer. |
| Shared Continuity Foundation | Approved conceptual platform responsibility layer for state identity/current projection, temporal comparison, event/current separation, maintained conclusions, evidence lineage, meaningful change, present relevance, attention-state abstraction, reconciliation lifecycle, current-versus-historical authority, and freshness/correction consequences. No shared implementation, extraction, schema, API, persistence, UI, workflow, or runtime behavior is approved. |
| Clinical Continuity | Implemented application layer in this repository. |
| OT configuration | Current implemented Clinical Continuity configuration. |
| Patient Management | Approved product direction; currently represented only through existing Clinical Continuity patient-oriented surfaces, not a new implemented application. |
| Care Continuity | Future application concept; not implemented in this repository. |
| PT, SLP, and other discipline expansion | Not implemented and not active without explicit approval. |

## Approved Shared Continuity Foundation responsibilities

The following are approved as conceptual Shared Continuity Foundation responsibilities only:

- state identity and current-state projection;
- temporal comparison;
- event versus current-state separation;
- maintained conclusions;
- evidence lineage;
- meaningful-change representation;
- present relevance;
- attention-state abstraction;
- reconciliation lifecycle;
- current-versus-historical authority;
- freshness and correction consequences.

This approval does not authorize technical extraction or claim that current Clinical Continuity implementation is a reusable shared engine. Responsibility continuity, routine continuity and disruption, care-context identity, care-specific evidence identity, non-clinical care authority, and care-to-clinical escalation remain deferred or Care Continuity-owned as recorded in the disposition record.

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

- Shared Continuity Foundation responsibilities are approved conceptually, but no shared implementation or extraction exists;
- Patient Management direction is approved but not converted into implementation scope;
- Care Continuity is not implemented;
- real-clinician validation remains required;
- correction and provenance hardening remain important;
- mobile and field-context readiness require further validation;
- OT-specific logic may not transfer to other domains;
- universal architecture reuse remains an unproven assumption.

## Current active implementation boundary

The active boundary is Clinical Continuity Product Design Readiness. It prepares an authoritative Product Design readiness packet for the implemented Clinical Continuity application. It does not authorize Product Design itself, UI changes, workflow changes, runtime implementation, shared foundation extraction, Care Continuity implementation, schemas, APIs, persistence, deterministic reasoning changes, continuity logic changes, progression logic changes, clinical authority changes, or AI generation behavior changes.

## Next implementation boundary

The next boundary after Clinical Continuity Product Design Readiness is Clinical Continuity Real-Clinician Validation unless governance changes the roadmap. Product Design Readiness does not itself authorize validation, pilot, production, or implementation claims.
