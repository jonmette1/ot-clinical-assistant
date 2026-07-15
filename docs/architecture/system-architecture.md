# System Architecture

## Purpose

This document defines ownership layers and permanent contracts that implementation must preserve. It is an architecture authority, not an implementation inventory, sprint plan, schema, route map, or component map.

## Architecture layers

```text
Continuity Platform
├── Shared Continuity Foundation — candidate shared architecture
├── Clinical Continuity — implemented application layer
│   └── OT configuration — current domain configuration
└── Care Continuity — future application layer
```

## Shared Continuity Foundation — candidate layer

**Status:** candidate shared architecture. The repository contains continuity primitives that may support a shared foundation, but cross-application reuse is not yet proven.

Potential responsibilities:

- state identity;
- temporal comparison;
- maintained conclusions;
- meaningful-change representation;
- evidence lineage;
- present relevance;
- reconciliation;
- current versus historical authority;
- attention state;
- correction consequences.

Permanent boundary: this layer may only be declared shared after validation across Clinical Continuity and Care Continuity. Existing Clinical Continuity implementation must not be renamed into a universal engine by documentation alone.

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

Permanent boundary: Care Continuity may pressure-test the candidate shared foundation, but this document does not define detailed Care Continuity implementation contracts.

## Current technical references

Subordinate references preserve detailed architecture rationale and remain governed by this document:

- [Continuity Reconciliation Architecture](references/continuity_reconciliation_architecture.md)
- [Activity Constraint Reconciliation Architecture](references/activity_constraint_reconciliation_architecture.md)
