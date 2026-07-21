# Continuity Platform Foundation

## Purpose

The Continuity Platform exists to reduce repeated reconstruction burden. People who support complex human situations should not have to reassemble prior context, current changes, unresolved constraints, and next implications from memory every time they act.

The platform preserves meaningful state across time, identifies what changed, interprets why the change matters, orients attention to what requires action, and keeps evidence lineage available for verification.

## Enduring product identity

The current implemented product/application identity is **Clinical Continuity Platform**. It is the first application within the broader **Continuity Platform** direction.

The approved future hierarchy is:

```text
Continuity Platform
├── Shared Continuity Foundation
├── Clinical Continuity
│   └── OT configuration
└── Care Continuity
```

The current repository contains substantial Clinical Continuity capability and an OT configuration. It does not yet prove a universal shared continuity architecture.

## Core continuity principles

### State preservation

The platform should preserve current meaning, not merely store historical records. Preserved state must remain connected to the evidence that produced it and to the context in which it is currently relevant.

### Meaningful change

Change is useful only when interpreted. The platform should distinguish raw change from meaningful change and should help users understand what changed, why it changed, and what should be done differently.

### Significance interpretation

Continuity systems must translate state movement into significance for the active application. In Clinical Continuity, significance is clinical and operational. In Care Continuity, significance is expected to involve care state, responsibilities, observations, instructions, communication, and caregiver attention; this remains future work.

### Attention orientation

The platform should orient people toward what requires attention now. Attention is not the same as a dashboard count, historical archive, or generated summary. It is the maintained interpretation of present relevance.

### Maintained understanding

The platform should preserve a maintained understanding across time so users can verify, correct, reuse, and communicate it without repeatedly reconstructing it.

### Evidence lineage

Every maintained conclusion should remain traceable to supporting evidence, source context, and change history. Evidence lineage supports trust, correction, and safe reuse.

### Current truth versus historical truth

Current truth is the present operational projection. Historical truth is what was true, generated, or understood at an earlier point. Historical truth must not be rewritten to make current truth appear cleaner.

### Reconciliation

Reconciliation determines whether prior supported conclusions remain current, require monitoring, are resolved, or are replaced by newer supported conclusions. Reconciliation does not become a new autonomous reasoning authority.

## Applications and personas

Applications are product domains with distinct authority, language, workflows, and obligations. Personas are user groups within or across applications.

**Clinical Continuity** is the implemented application in this repository. Its current configuration is OT-focused.

**Care Continuity** is a future application concept being used to pressure-test what, if anything, belongs in a candidate Shared Continuity Foundation. It is not implemented in this repository.

## Authority model

Deterministic systems own authoritative reasoning, state transitions, and current-versus-historical truth handling. Humans retain verification, correction, judgment, and final use authority.

AI may assist with synthesis, organization, explanation, and communication of supported conclusions. AI must not become the authority for clinical reasoning, care authority, state truth, or unsupported recommendations.

## Shared Continuity Foundation

The approved Shared Continuity Foundation owns the smallest application-neutral continuity responsibilities validated conceptually across Clinical Continuity and Care Continuity: state identity and current-state projection, temporal comparison, event/current-state separation, maintained conclusions, evidence lineage, meaningful-change representation, present relevance, attention-state abstraction, reconciliation lifecycle, current-versus-historical authority, and freshness/correction consequences.

This approval is conceptual only. It does not prove a universal implementation layer, authorize shared runtime extraction, or move Clinical Continuity code, schemas, APIs, persistence, UI, prompts, or workflows into a shared engine. The canonical definition is [`shared-continuity-foundation.md`](shared-continuity-foundation.md), and candidate dispositions are recorded in [`shared-continuity-foundation-disposition-record.md`](shared-continuity-foundation-disposition-record.md).

## Platform non-goals

The Continuity Platform is not:

- an EMR replacement;
- a generic analytics dashboard;
- an autonomous clinician or autonomous care authority;
- a documentation generator first;
- a scheduling or route-planning system;
- a claim that simulated validation equals real-world evidence;
- a declaration that the current Clinical Continuity engine is universally reusable without validation.
