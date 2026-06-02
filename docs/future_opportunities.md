# Future Opportunities

## Purpose

This document captures validated observations, opportunities, and future product directions that have emerged during development, audits, clinician simulations, and UX reviews.

Items in this document are intentionally deferred.

They are not approved roadmap work.

They should not be interpreted as active implementation priorities.

An item may only move from this document into `active_roadmap.md` through explicit approval.

---

# Patient Preview / Visit Preparation Experience

## Status

Deferred

## Source

* Reference Workspace Cleanup Audit
* UX Normalization Phase 1
* Longitudinal Workflow Reviews

## Observation

Several pieces of information currently buried within the Reference Workspace appear highly valuable for rapid clinician orientation before entering a patient visit.

Examples include:

* Current Focus rationale
* Latest Progression Event
* Attention context
* Operational Focus explanation
* Recent meaningful change

These items may have greater value as pre-visit orientation content than as deep reference content.

## Future Question

Should clinicians have access to a lightweight patient preview experience before opening the Command Center?

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

No implementation approved.

Requires future workflow validation.

---

# Patient Entry Experience

## Status

Deferred

## Source

* Patient-Centric Navigation Work
* UX Reviews
* Cases Page Discussions

## Observation

The current Cases page primarily functions as a case list.

The long-term navigation direction of the platform is patient-centric rather than case-centric.

The entry experience may eventually evolve into a richer patient access surface.

## Future Questions

* What information should be visible before opening a patient?
* What information helps clinicians prioritize visits?
* What information should remain hidden until deeper review?
* How should historical context be surfaced?

## Potential Areas

* Recent visit activity
* Current trajectory
* Attention indicators
* Snapshot previews
* Quick-access navigation

## Not Approved

No implementation approved.

Requires Patient Entry Experience Audit.

---

# Intake Fidelity Optimization

## Status

Deferred

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

No implementation approved.

Requires Intake Fidelity Audit.

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

# Reference Workspace Evolution

## Status

Deferred

## Source

* Reference Workspace Cleanup Audit

## Observation

Several Reference Workspace sections contain valuable information but may not be organized according to their highest-value use case.

Operational Focus, progression context, and longitudinal summaries may represent a future orientation layer rather than purely reference content.

## Future Questions

* What is true deep-reference information?
* What is pre-visit orientation information?
* What belongs in Command Center?
* What belongs in a future preview experience?

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
