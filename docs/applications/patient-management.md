# Patient Management

## Repository status note

Founder-approved product direction. This document should be preserved as product direction and should not be reduced to an implementation summary. Patient Management is not implemented as a new standalone application by this PR, and this PR does not authorize application-code, schema, API, persistence, clinical-logic, continuity-logic, progression-logic, ranking, AI-generation, UI, or runtime changes.

## Governing question

Patient Management answers:

> Who needs my attention right now?

That question is population-facing. It is not a single-patient chart question and not a generic dashboard question. It is the operational entry point for understanding a population, identifying attention needs, and launching into the right patient-level clinical continuity context.

## Product role

Patient Management is the population-awareness application within the Continuity Platform direction. It organizes caseload understanding, clinical prioritization, operational alignment, and action readiness across a patient population.

Its purpose is to help a clinician or operator understand:

- which patients need attention now;
- why those patients need attention;
- what changed or remained unresolved;
- what operational action is likely needed next;
- where to launch for patient-specific continuity work;
- which signals are supported by evidence and require human verification.

## Relationship to Clinical Continuity

Patient Management and Clinical Continuity are related but not interchangeable.

- Patient Management is the population-facing operational launchpad.
- Clinical Continuity is the patient-level clinical continuity workspace.
- Patient Management should orient the user to which patient needs attention and why.
- Clinical Continuity should preserve and expose the maintained clinical understanding for a selected patient.
- Patient Management may rely on Clinical Continuity signals, but it should not replace patient-level clinical reasoning or clinician verification.

Within the current repository, patient-oriented surfaces exist as part of the Clinical Continuity/OT implementation. The approved Patient Management direction clarifies the product role of population awareness and operational launch without declaring a new implemented application complete.

## Goals

Patient Management should support:

1. **Population awareness** — maintain an understandable view of the active patient population rather than forcing clinicians to reconstruct caseload status from memory.
2. **Clinical prioritization** — distinguish patients who require attention now from those who are stable, monitoring-only, administratively pending, or not clinically urgent.
3. **Operational alignment** — connect clinical attention to practical next work, including visit preparation, reassessment needs, unresolved constraints, and operational readiness.
4. **Caseload understanding** — preserve the state of the caseload across time so users can understand current pressure, risk, change, and workload implications.
5. **Operational launchpad** — provide the entry point into the appropriate patient-level Clinical Continuity context.
6. **Evidence-supported attention** — keep prioritization and attention signals traceable to supporting evidence and current-versus-historical state.

## Workflows

Patient Management should support workflows such as:

- opening a population or caseload view;
- identifying which patients need attention now;
- understanding why a patient is surfaced;
- distinguishing clinical attention from administrative noise;
- seeing what changed since prior review;
- recognizing unresolved constraints or risks;
- launching into Clinical Continuity for a selected patient;
- returning to the population view with updated understanding after patient-level review;
- supporting human verification, correction, and judgment before action.

## Design principles

- Start from the population question: “Who needs my attention right now?”
- Preserve operational clarity over exhaustive display.
- Separate current attention from historical record.
- Keep clinical prioritization evidence-linked and verifiable.
- Avoid implying that AI independently determines care authority.
- Avoid flattening patient importance into generic counts or unread-item badges.
- Distinguish clinical attention, operational readiness, administrative follow-up, and future monitoring.
- Preserve the relationship between population awareness and patient-level Clinical Continuity.

## Boundaries

Patient Management does not authorize:

- new Patient Management implementation;
- Care Continuity implementation;
- route, schema, API, persistence, or database changes;
- changes to deterministic clinical reasoning;
- changes to continuity, progression, ranking, or prioritization logic;
- changes to AI generation behavior;
- autonomous clinical recommendations;
- conversion of future product direction into active roadmap work without explicit approval.
