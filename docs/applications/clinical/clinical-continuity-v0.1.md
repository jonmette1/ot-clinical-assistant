# Clinical Continuity v0.1

> Repository status note: Clinical Continuity is the implemented application in this repository, currently with an OT configuration. This document is approved application-level product direction and is not a complete implementation inventory. Documentation approval does not authorize runtime, schema, API, persistence, deterministic reasoning, continuity, progression, ranking, AI-generation, UI, or other application-code changes. Current implementation truth remains governed by `docs/governance/program-state.md` and repository implementation.

## Purpose

Clinical Continuity preserves patient-level clinical understanding across time so clinicians do not have to reconstruct current meaning, meaningful change, evidence lineage, and next implications from scattered notes or memory.

It supports clinicians in understanding what is currently true, what has changed, why that change matters clinically and operationally, and what needs attention now.

## Governing question

For an individual patient:

**What is clinically meaningful now, how did it change, what evidence supports it, and what should the clinician attend to next?**

## Application identity

Clinical Continuity is the patient-level clinical application within the broader Continuity Platform direction. It is implemented in this repository with an OT-focused configuration.

Clinical Continuity should support:

- maintained clinical understanding;
- current-versus-historical truth handling;
- meaningful clinical change;
- evidence-linked conclusions;
- reassessment support;
- progression interpretation;
- operational prioritization;
- clinical attention orientation;
- clinician verification and correction.

## Current implemented configuration

The current repository configuration is OT-focused. OT-specific vocabulary and reasoning include:

- occupational performance;
- ADLs;
- transfers;
- assistance levels;
- home-health vocabulary;
- home environment and equipment interpretation;
- caregiver feasibility in OT workflows;
- OT-specific decision logic and evidence vocabulary.

OT-specific concepts must not be assumed portable to PT, SLP, Care Continuity, Patient Management, or other domains without validation and explicit approval.

## Workflows

Clinical Continuity should support workflows such as:

1. reviewing a patient-level continuity state;
2. understanding meaningful clinical change since prior review;
3. distinguishing current clinical truth from historical snapshots;
4. reviewing evidence supporting maintained conclusions;
5. understanding progression, reassessment needs, and operational emphasis;
6. identifying clinical attention needs and unresolved constraints;
7. verifying, correcting, rejecting, or updating maintained understanding;
8. communicating supported conclusions without converting AI into clinical authority.

## Relationship to Patient Management

Patient Management is the population-facing operational launchpad. Clinical Continuity is the patient-level workspace entered after a patient requires review or action.

Patient Management should help answer who needs attention now. Clinical Continuity should help answer what is clinically meaningful for the selected patient and why.

## Authority boundaries

- Deterministic clinical systems own supported reasoning, state transitions, continuity state, progression logic, and current-versus-historical truth handling.
- Clinicians retain verification, correction, judgment, and final use authority.
- AI may synthesize, organize, explain, and communicate supported conclusions, but may not own clinical reasoning, care authority, or unsupported recommendations.

## Design principles

- Preserve maintained clinical understanding across time.
- Distinguish current truth from historical truth.
- Make clinically meaningful change visible and explainable.
- Keep conclusions evidence-linked.
- Orient clinicians to what requires attention now.
- Support correction and verification rather than hiding uncertainty.
- Prioritize cognitive compression and workflow clarity.
- Avoid autonomous AI clinical reasoning.

## Success measures

Clinical Continuity is successful if clinicians can:

- understand current patient state without reconstructing it from scratch;
- identify meaningful change and why it matters;
- verify supporting evidence;
- distinguish historical from current conclusions;
- understand progression, reassessment, and operational implications;
- correct or reject unsupported maintained understanding;
- trust that deterministic and human authority boundaries remain intact.

## Current versus future scope

Implemented Clinical Continuity capability should not be treated as proof of a universal continuity engine. Non-OT configurations, Patient Management implementation, Care Continuity, PT, SLP, and other domains require explicit approval and validation before implementation.
