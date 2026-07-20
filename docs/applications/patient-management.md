# Patient Management

> Repository status note: Patient Management is an approved product-direction document. It is not implemented as a new standalone application in this repository. Existing patient-oriented surfaces are part of the current Clinical Continuity / OT implementation. Documentation approval does not authorize runtime, schema, API, persistence, deterministic reasoning, continuity, progression, ranking, AI-generation, UI, or other application-code changes. Current implementation truth remains governed by `docs/governance/program-state.md` and repository implementation.

## Purpose

Patient Management is the population-facing continuity application for answering the operational question:

> Who needs my attention right now?

It exists because clinicians and operators do not begin work from a perfectly organized single-patient chart. They begin from schedules, rosters, referrals, caseload lists, visit assignments, pending reassessments, new events, informal messages, and operational pressures. Patient Management turns those entry contexts into population awareness and rapid prioritization without requiring the user to manually reconstruct which patient matters, why they matter, and where to go next.

Patient Management is not an EMR replacement, a generic dashboard, or a scheduling system. It is the operational launchpad into continuity work.

## Governing question

Patient Management answers:

**Who needs my attention right now?**

The answer must be:

- population-aware;
- clinically prioritized;
- operationally aligned;
- evidence-linked;
- fast to act on;
- connected to the patient-level Clinical Continuity workspace.

## Product role

Patient Management provides population awareness across a caseload or operational context. It helps the user understand which patients require attention, why they are being surfaced, what kind of attention is needed, and where the next continuity action should occur.

The application should support rapid transition from schedules, rosters, referrals, assignment lists, or other operational contexts into patient-specific continuity review. It should not depend on external integrations in order to preserve the product role: the concept is operational alignment with the user's work context, not technical dependence on a specific scheduling, referral, or roster system.

## Relationship to Clinical Continuity

Patient Management and Clinical Continuity are separate but connected application roles.

- **Patient Management** is population-facing. It orients attention across patients and helps answer who needs review or action now.
- **Clinical Continuity** is patient-facing. It preserves and exposes maintained clinical understanding for an individual patient over time.
- Patient Management is the operational launchpad into Clinical Continuity.
- Clinical Continuity provides the detailed patient-level context that supports or explains why a patient is surfaced.
- Patient Management may display summarized continuity signals, but it must not replace the patient-level reasoning, evidence, verification, or correction workflow.

## Core capabilities

### Population awareness

Patient Management maintains an understandable view of the active patient population. It should help the user see the state of the caseload without reconstructing it from memory, notes, or disconnected tools.

Population awareness includes:

- active patients;
- newly referred or newly appearing patients;
- patients with changed status;
- patients with unresolved constraints;
- patients nearing reassessment or review needs;
- patients with operationally relevant clinical changes;
- patients whose current state differs materially from prior understanding.

### Clinical prioritization

Patient Management should distinguish the patients who need attention now from patients who are stable, monitoring-only, administratively pending, or not clinically urgent.

Prioritization should be based on supported continuity signals rather than raw recency, generic unread status, or dashboard counts. The product should help the user understand why a patient is surfaced and whether the reason is clinical, operational, administrative, or monitoring-related.

### Operational alignment

Patient Management aligns clinical attention with the realities of daily work. It should help the user move from operational contexts such as schedules, rosters, referrals, and caseload assignments into the correct continuity action without depending on external integrations as a product prerequisite.

Operational alignment includes:

- preparing for today's visits or reviews;
- identifying who requires reassessment or closer review;
- surfacing unresolved constraints before they become workflow failures;
- supporting handoff or assignment review;
- making the next patient-level action obvious enough to launch quickly.

### Caseload understanding

Patient Management should preserve caseload understanding across time. The user should be able to understand not only individual patient status but also the shape of the caseload: which patients are changing, which remain constrained, which are ready for action, and which require monitoring.

Caseload understanding includes:

- current attention distribution;
- meaningful changes across the population;
- unresolved issues that affect work planning;
- patient-level signals that need follow-up;
- the distinction between immediate attention and future monitoring.

### Operational launchpad

Patient Management is the operational launchpad into Clinical Continuity. It should allow a rapid transition from a population signal to the relevant patient-level workspace, carrying enough context that the user understands why they are entering that patient chart or continuity view.

The launchpad role should support:

- selecting a surfaced patient;
- seeing the reason for attention before opening the patient workspace;
- entering Clinical Continuity at the most relevant patient-level context;
- returning to the population view with updated orientation.

## Workflows

Patient Management should support the following workflows:

1. **Start from an operational context**: the user begins with a schedule, roster, referral list, caseload, or assignment context.
2. **Orient to the population**: the product surfaces which patients need attention now.
3. **Understand why**: the user sees the reason a patient is surfaced, including whether the issue is clinical prioritization, operational readiness, unresolved constraint, reassessment need, or monitoring state.
4. **Distinguish signal from noise**: the user can separate clinically meaningful attention from generic administrative activity.
5. **Launch into Clinical Continuity**: the user opens the patient-level Clinical Continuity workspace with the attention context preserved.
6. **Verify and act**: the user verifies evidence, reviews maintained understanding, corrects where needed, and determines the human action.
7. **Return to caseload awareness**: the user returns to the population view with updated understanding of what remains.

## Design principles

- Start from “Who needs my attention right now?”
- Preserve population awareness rather than reducing the experience to individual chart lookup.
- Prioritize clinically meaningful attention over generic activity indicators.
- Align with operational contexts without making external integrations a dependency for the product concept.
- Make rapid transition from schedule, roster, referral, or caseload context into patient-level continuity possible.
- Preserve caseload understanding across time.
- Make Patient Management the launchpad into Clinical Continuity, not a replacement for Clinical Continuity.
- Keep attention signals evidence-linked and available for human verification.
- Separate current attention from historical record.
- Avoid implying that AI independently determines care authority.

## Success measures

Patient Management is successful when users can:

- identify who needs attention now without reconstructing the caseload from memory;
- understand why a patient is prioritized;
- distinguish clinical priority from administrative noise;
- move quickly from population context into the relevant patient-level continuity workspace;
- preserve understanding of the caseload across repeated work sessions;
- verify evidence before acting;
- avoid treating generated summaries or AI language as autonomous authority.

## Product boundaries

Patient Management does not authorize or require:

- implementation of a new standalone Patient Management application in this PR;
- external scheduling, referral, roster, or EMR integrations as a prerequisite for the product concept;
- Care Continuity implementation;
- route, schema, API, persistence, or database changes;
- changes to deterministic clinical reasoning;
- changes to continuity, progression, ranking, or prioritization logic;
- changes to AI generation behavior;
- autonomous clinical recommendations;
- conversion of future product direction into active roadmap work without explicit approval.
