# Program State

## Purpose

This document records what is actually true in the repository today. It separates implemented capability, candidate shared primitives, Clinical Continuity-specific capability, OT-specific configuration, delivery infrastructure, validation status, and current limitations.

## Implemented

The repository contains substantial Clinical Continuity implementation, including:

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
- Patients caseload prioritization;
- Visit Briefing;
- Clinical Translation Workspace concepts in current documentation and UI direction;
- current versus historical state handling.

## Candidate shared continuity primitives

The following may plausibly contribute to a candidate Shared Continuity Foundation, but cross-application reuse is not proven:

- state identity and current-state projection;
- temporal comparison;
- meaningful-change handling;
- evidence-linked maintained conclusions;
- relevance reconciliation;
- current versus historical truth separation;
- attention orientation;
- correction and provenance implications.

These should be classified during the active work boundary before technical extraction.

## Clinical Continuity-specific

The following are Clinical Continuity concepts unless explicitly validated elsewhere:

- clinical significance;
- progression;
- reassessment;
- treatment implications;
- clinical safety;
- clinician verification and correction;
- operational prioritization;
- clinical attention;
- clinical evidence interpretation.

## OT-specific

The following are OT configuration concerns:

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

## Current limitations and debt

Known limitations include:

- candidate shared foundation ownership is not yet classified component by component;
- Care Continuity is not implemented;
- real-clinician validation remains required;
- correction and provenance hardening remain important;
- mobile and field-context readiness require further validation;
- OT-specific logic may not transfer to other domains;
- universal architecture reuse remains an unproven assumption.
