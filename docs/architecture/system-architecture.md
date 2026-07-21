# System Architecture

## Purpose

This document defines ownership layers and permanent contracts that implementation must preserve. It is an architecture authority, not an implementation inventory, sprint plan, schema, route map, or component map.

## Architecture layers

```text
Continuity Platform
├── Shared Continuity Foundation — approved conceptual responsibility layer
├── Clinical Continuity — implemented application layer
│   └── OT configuration — current domain configuration
└── Care Continuity — future application layer
```

## Shared Continuity Foundation — approved conceptual layer

**Status:** approved conceptual platform responsibility layer. Cross-application conceptual evidence supports a smallest shared foundation, but cross-application implementation reuse is not proven.

Approved responsibilities:

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

Permanent boundary: this layer owns neutral continuity responsibilities only. It does not own clinical reasoning, OT vocabulary, caregiver-specific meaning, delivery mechanics, schemas, APIs, persistence, UI, AI provider implementation, runtime extraction, or a universal shared engine. Existing Clinical Continuity implementation remains application-owned evidence unless a future approved boundary validates and authorizes technical extraction.

## Clinical Continuity — implemented application layer

**Status:** implemented application layer in this repository.

Responsibilities include:

- clinical significance interpretation;
- progression interpretation;
- reassessment support;
- safety interpretation;
- treatment implications;
- clinician verification;
- operational prioritization;
- clinical attention orientation;
- clinical current-versus-historical truth handling.

Permanent boundary: Clinical Continuity owns clinical meaning. AI-assisted synthesis may communicate supported conclusions, but deterministic clinical systems and clinician verification remain authoritative.

## OT configuration — current validated domain configuration

**Status:** current implemented Clinical Continuity configuration.

Responsibilities include:

- occupational performance framing;
- ADL and transfer vocabulary;
- assistance-level interpretation;
- home environment factors;
- caregiver feasibility;
- OT-specific evidence and reasoning vocabulary;
- OT-specific operational decision logic.

Permanent boundary: OT-specific fields, thresholds, terms, and reasoning labels must not be assumed portable to PT, SLP, Care Continuity, or other domains without validation.

## Care Continuity — future application layer

**Status:** future application concept; not implemented in this repository.

Expected architectural category may include:

- care state;
- observations and events;
- responsibilities;
- instructions;
- communication;
- caregiver attention.

Permanent boundary: Care Continuity pressure-tested the approved conceptual Shared Continuity Foundation, but this document does not define detailed Care Continuity implementation contracts or authorize Care Continuity implementation.

## Current technical references

Subordinate references preserve detailed architecture rationale and remain governed by this document:

- [Continuity Reconciliation Architecture](references/continuity_reconciliation_architecture.md)
- [Activity Constraint Reconciliation Architecture](references/activity_constraint_reconciliation_architecture.md)
