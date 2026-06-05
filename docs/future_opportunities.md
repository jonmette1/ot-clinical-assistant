# OT Clinical Assistant — Future Opportunities

Last updated: 2026-06-04

---

## Purpose of This Document

This document captures ideas that are directionally relevant but not currently active roadmap commitments.

Items should not move from this document into implementation unless explicitly approved and added to `docs/foundation/active_roadmap.md`.

---

## Recently Completed / No Longer Future Opportunities

The following are now completed implementation or documentation reality and should not be treated as deferred ideas unless explicitly reopened:

* Snapshot Awareness Phase 1
* Clinical Impact Summary
* Command Center delta visibility
* refreshed Next Action derivation
* Intake Prioritization Phase 1
* Intake Prioritization Phase 2
* High Impact intake hierarchy
* Workflow Simplification / Navigation Normalization
* Patient History terminology update
* Visit History access from Command Center
* Clinical Briefing UX Normalization
* Visit History reorientation from software versions to visit-based clinical summaries
* Patient Entry Experience
* Patient Entry Phase 2A Quick Preview primitives
* Patient History cleanup and boundary clarification
* Intake Fidelity Audit and initial normalization work

---

## Active Roadmap Adjacent but Not Yet Approved

### Longitudinal Visibility / Continuity Compression

Status: Future opportunity

Directionally aligned with platform strategy.

Potential value:

* compress longitudinal change into clinical meaning
* show what changed and why it matters
* clarify what should be done differently
* identify approaching progression transitions
* support continuity without exposing continuity architecture

Important distinction:

* This is aligned: **Longitudinal Visibility / Continuity Compression**.
* This is not current direction: **Longitudinal Intelligence / Analytics**.

Not approved:

* analytics dashboards
* reporting views
* population analytics
* autonomous prediction systems
* clinician performance tracking

---

## MVP-Critical Cleanup Candidates Tracked Elsewhere

The following are likely near-term adoption-readiness candidates and are summarized in the active roadmap. They are listed here only for continuity:

* Progression Check discoverability / sticky navigation jump
* action bar cleanup / overflow menu
* responsive UX / mobile-desktop polish

---

## Workflow Actions Consolidation

Status: Deferred unless moved to active roadmap

Observation:

The platform currently exposes multiple actions, including Refresh Clinical Guidance, Save Clinical Snapshot, Copy Snapshot, Download Snapshot, and progression-check save behavior.

Potential opportunity:

* Separate primary clinical actions from secondary administrative/export actions.
* Move Copy / Download into secondary or overflow actions.
* Reduce bottom action bar crowding.

Guardrails:

* Preserve existing capabilities unless explicitly approved for removal.
* Do not change API contracts or generated output structures as part of visual cleanup.

---

## Standardized Snapshot Summary Payload

Status: Future opportunity

Observation:

Visit History quality depends on available snapshot payload fields. Older snapshots may have weaker clinical context because they were generated before visit-oriented summary expectations were normalized.

Potential opportunity:

Create a standardized snapshot summary payload so Visit History cards can consistently display:

* visit status
* clinical reality
* recommended next action
* meaningful change
* snapshot source/context

Guardrails:

* This may affect persistence or generated output structure.
* Do not implement without explicit schema/API/output approval.

---

## Expanded Visit Preparation Experience Beyond Quick Preview

Status: Deferred

Observation:

Patient Entry and Quick Preview primitives already provide lightweight orientation before opening the Command Center. Future expansion should only be considered if clinician validation shows a gap between Quick Preview and Command Center.

Potential content:

* Current Focus rationale
* latest progression event details
* attention context
* operational focus explanation
* recent meaningful change

Not approved:

No expanded visit-preparation implementation is approved.

---

## Broader Intake Optimization

Status: Deferred beyond completed Intake Prioritization work

Observation:

The intake workflow has been prioritized around high-impact clinical fields, but future optimization could still investigate conditional fields, contradiction guardrails, and field-level output influence.

Potential goals:

* reduce conflicting inputs
* improve reasoning fidelity
* reduce unnecessary intake burden
* improve clinician trust

Not approved:

No broad intake redesign is approved.

---

## Current Focus Adaptive Typography

Status: Deferred

Observation:

Current Focus performs well as a concise operational emphasis, but longer statements can become visually heavy.

Potential opportunity:

Dynamically scale typography based on content length.

Not approved:

Requires future UX validation.

---

## Patient History Enhancements

Status: Deferred

Observation:

Patient History is the supporting-context surface. It should not compete with Command Center clinical briefing authority.

Potential future questions:

* What context is genuinely deep reference?
* What should be promoted to Command Center or Quick Preview?
* What should remain collapsed?
* How can Patient History support review without fragmenting attention?

Not approved:

No broad Patient History reorganization is approved.

---

## PT Platform Configuration Validation

Status: Post-MVP expansion research

Observation:

The broader rehabilitation Clinical Assistant Platform direction may support PT if discipline-specific configuration can preserve reasoning quality and workflow relevance.

Future validation questions:

* Which OT reasoning primitives transfer directly?
* Which PT-specific intake fields are required?
* How should PT progression signals differ?
* Can platform-level architecture remain stable while discipline configuration changes?

Not approved:

No PT implementation is approved.

---

## SLP Feasibility Review

Status: Post-MVP expansion research

Observation:

SLP may require substantially different clinical taxonomies, environmental/contextual signals, and output structures.

Future validation questions:

* Is the Clinical Attention System model applicable to SLP workflows?
* What discipline-specific reasoning authority would be required?
* Which longitudinal signals matter most?
* Would SLP require a separate configuration model?

Not approved:

No SLP implementation is approved.

---

## Product Boundaries

Future opportunities should preserve the platform as a Clinical Attention System.

Do not expand toward:

* EMR replacement
* documentation replacement
* analytics dashboard
* reporting platform
* autonomous clinician
