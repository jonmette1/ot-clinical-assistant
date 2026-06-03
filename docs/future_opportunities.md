# Future Opportunities

## Purpose

This document captures validated observations, opportunities, and future product directions that have emerged during development, audits, clinician simulations, and UX reviews.

Items in this document are intentionally deferred.

They are not approved roadmap work.

They should not be interpreted as active implementation priorities.

An item may only move from this document into `active_roadmap.md` through explicit approval.

---

## Recently Completed

The following items were previously tracked as opportunities but are now completed implementation reality or completed documentation/specification work. They should not be treated as deferred opportunities or future roadmap candidates unless explicitly reopened.

* Patient Entry Experience.
* Patient Entry Phase 1.1 fallback and hierarchy corrections.
* Patient Entry Card context deduplication.
* Patient Entry Phase 2A Quick Preview primitives.
* Patient Orientation Layer through the implemented Patient Entry and Quick Preview surface.
* Reference Workspace Cleanup.
* Intake Fidelity Audit.
* Intake Fidelity Normalization Specification.
* Intake Fidelity Phase 1A.

---

# Expanded Visit Preparation Experience Beyond Quick Preview

## Status

Deferred

## Source

* Post-cleanup Reference Workspace Review
* UX Normalization Phase 1
* Longitudinal Workflow Reviews

## Observation

Patient Entry and Quick Preview primitives now provide a lightweight orientation layer before opening the Command Center. Future opportunity remains only for expansion beyond that completed preview surface.

Potential expansion content could include selected items that remain too detailed for the current Quick Preview but too orientation-oriented for deep reference review.

Examples include:

* Current Focus rationale
* Latest Progression Event details
* Attention context
* Operational Focus explanation
* Recent meaningful change

## Future Question

Should the implemented Quick Preview remain intentionally lightweight, or should a separate expanded visit-preparation experience be introduced later?

## Potential Preview Content

* Current Focus
* Attention Required
* Latest Progression Event
* Operational Focus rationale
* Recent meaningful change
* Current trajectory

## Potential Benefits

* Faster pre-visit orientation
* Better patient prioritization
* Reduced need to enter multiple screens before treatment

## Not Approved

No expanded implementation approved beyond the completed Quick Preview primitives.

Requires future workflow validation.

---

# Broader Intake Fidelity Optimization

## Status

Deferred beyond active Phase 1B contradiction guardrails

## Source

* Intake Form Reviews
* Clinical Reasoning Reviews
* UX Discussions

## Observation

Not all intake fields contribute equally to output quality.

Some fields have significant influence on reasoning quality while others have relatively minor impact.

The current intake workflow also permits potentially conflicting clinical states.

## Future Questions

* Which fields most influence output quality?
* Which fields rarely affect reasoning outcomes?
* Which combinations create contradictory states?
* Which fields should become conditional?
* Which fields should be visually prioritized?

## Potential Goals

* Reduce conflicting inputs
* Improve reasoning fidelity
* Improve clinician confidence
* Reduce unnecessary intake burden

## Not Approved

No broader implementation is approved beyond active Phase 1B contradiction guardrails.

Intake Fidelity Audit and Phase 1A are complete. Broader optimization beyond active Phase 1B requires explicit approval.

---

# Workflow Actions Consolidation

## Status

Deferred

## Source

* UX Normalization Reviews
* Workflow Discussions

## Observation

The platform currently contains multiple action systems and workflow controls.

Examples include:

* Edit Case
* Regenerate
* Save Snapshot
* Copy
* Download
* Save Progression Check

As functionality expands, action density may become a source of workflow friction.

## Future Questions

* Which actions are operational?
* Which actions are administrative?
* Which actions are historical?
* Which actions are rarely used?
* Which actions should be grouped together?

## Potential Goal

Create a clearer action hierarchy without reducing capability.

## Not Approved

No implementation approved.

Requires Workflow Actions Audit.

---

# Current Focus Adaptive Typography

## Status

Deferred

## Source

* UX Normalization Phase 1 Review

## Observation

Current Focus performs well for concise operational emphasis statements.

Long operational emphasis statements can become visually overwhelming at the current headline size.

## Future Question

Should Current Focus typography scale dynamically based on content length?

## Potential Benefits

* Improved readability
* Reduced visual fatigue
* Better information density management

## Not Approved

No implementation approved.

Requires future UX validation.

---

# Future Reference Workspace Enhancements

## Status

Deferred

## Source

* Post-cleanup Reference Workspace Review

## Observation

Reference Workspace Cleanup is complete. Future enhancement work should only address remaining organization opportunities that do not compete with Command Center orientation.

Operational Focus, progression context, and longitudinal summaries may represent a future orientation layer rather than purely reference content.

## Future Questions

* What is true deep-reference information?
* What is pre-visit orientation information?
* What belongs in Command Center?
* What belongs in a future preview experience?

Investigate whether Operational Focus, Latest Progression Event, and other orientation-oriented Reference Workspace content should be surfaced through a future Patient Preview / Visit Preparation experience or compressed Command Center orientation layer.

## Potential Outcome

Further distinction between:

### Orientation Content

Information needed before or immediately upon opening a patient.

### Reference Content

Information used for deeper review and investigation.

## Not Approved

No implementation approved.

Requires future workflow validation.

---

# Historical Snapshot Experience Enhancements

## Status

Deferred

## Source

* Reference Workspace Reviews
* Longitudinal Workflow Discussions

## Observation

Historical Snapshots are one of the strongest longitudinal workflow features in the platform.

The current implementation is functional but may not represent the final user experience.

## Future Questions

* How should snapshot comparison evolve?
* What information should be previewed before restoration?
* How should longitudinal progression be reviewed over time?

## Potential Goal

Improve historical review without increasing cognitive burden.

## Not Approved

No implementation approved.

Requires future review.

---

# Promotion Rules

An item may only move from this document into `active_roadmap.md` when:

1. The opportunity has been validated.
2. The problem is clearly defined.
3. The expected value is understood.
4. Explicit approval has been given.

Ideas should remain here until they become priorities.
