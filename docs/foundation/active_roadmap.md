# OT Clinical Reasoning Assistant — Active Roadmap

Last updated: 2026-06-04

---

## Roadmap Status Summary

The project has moved from architecture stabilization into workflow validation, adoption readiness, and targeted UX cleanup.

The platform should now be understood as a **Clinical Attention System** for OT clinical briefing and longitudinal continuity compression. It should help clinicians quickly identify what changed, why it matters, what requires attention, and what should happen next.

The current limiting question is no longer whether the platform has enough reasoning architecture. The current limiting question is whether the workflow is discoverable, scannable, and calm enough for clinicians to use during real visit preparation.

---

## Completed Foundations

Completed foundations include:

* deterministic clinical reasoning authority
* continuity architecture
* progression architecture
* operational prioritization architecture
* reassessment architecture
* mutation governance
* patient-centric navigation
* Command Center / Patient History separation
* Patient Entry and Quick Preview primitives
* Clinical Language Compression Phase 1
* Patient History cleanup and boundary clarification
* Clinical Impact Summary
* Clinical Status Explainability
* Clinical Impact CTA / delta visibility
* Treatment Focus refinement
* refreshed Next Action derivation
* structured intake
* high-impact intake hierarchy
* Intake Prioritization Phase 1
* Intake Prioritization Phase 2
* Snapshot Awareness Phase 1
* Workflow Simplification / Navigation Normalization
* Visit History access from Command Center
* Clinical Briefing UX Normalization
* Visit History reorientation from software versions to visit-based clinical summaries

---

## Recently Completed Milestones

### Snapshot Awareness Phase 1

Status: Completed

Outcome:

* Live operational state and historical snapshot state are more clearly distinguished.
* Historical snapshot review is protected as read-only reference.
* Clinicians can return to Live Case from historical review.
* Snapshot awareness is expressed through clinician-facing state labels rather than continuity-system terminology.

### Intake Prioritization Phase 1 and Phase 2

Status: Completed

Outcome:

* New Case intake better emphasizes high-impact clinical inputs.
* Intake hierarchy better reflects fields that affect downstream reasoning and clinician attention.
* Clinical Decision Inputs are no longer the visible intake experience.

### Workflow Simplification / Navigation Normalization

Status: Completed

Outcome:

* Patient-centric workflow language is now primary.
* Patient History replaces Reference Workspace in current clinician-facing terminology.
* Command Center remains the clinical briefing surface.

### Clinical Briefing UX Normalization

Status: Completed

Outcome:

* Command Center presentation has moved toward clinical briefing rather than dashboard/report framing.
* Visit History is accessible from Command Center.
* Visit History uses visit-oriented snapshot cards rather than software-version framing.

---

## Active / MVP-Critical Adoption Readiness

These items are current likely next opportunities because they affect clinician orientation, discoverability, or workflow friction. They are not architecture redesigns.

### 1. Progression Check Discoverability / Sticky Navigation Jump

Classification: MVP-critical / adoption readiness

Rationale:

Progression Check is central to longitudinal state updates, but may not be discoverable enough in the current Command Center flow. A navigation jump or stronger affordance may reduce friction without changing progression architecture.

Guardrails:

* Do not redesign progression logic.
* Do not expose internal continuity terminology.
* Prefer navigation/hierarchy improvements over new systems.

### 2. Action Bar Cleanup / Overflow Menu

Classification: MVP-critical / adoption readiness

Rationale:

The bottom action area currently includes multiple actions: Refresh Clinical Guidance, Save Clinical Snapshot, Copy Snapshot, and Download Snapshot. Copy and Download likely belong in secondary or overflow actions so the primary clinical workflow remains clear.

Guardrails:

* Preserve existing actions unless explicitly removed.
* Do not change API contracts or generated output structures.
* Prefer grouping and progressive disclosure.

### 3. Responsive UX / Mobile-Desktop Polish

Classification: MVP-critical / adoption readiness

Rationale:

The Command Center and Patient History should remain usable across mobile and desktop contexts, especially for home health workflows.

Guardrails:

* Do not introduce decorative dashboard patterns.
* Preserve Clinical Briefing hierarchy.
* Validate sticky header and bottom action behavior across breakpoints.

---

## Future Opportunity

### Longitudinal Visibility / Continuity Compression

Classification: Future opportunity

Rationale:

This is aligned with the Clinical Attention System direction. It should help clinicians understand:

* what changed
* why it changed
* what should be done differently
* what progression transition is approaching
* what treatment implication follows

Guardrails:

* This is not Longitudinal Intelligence / Analytics.
* Do not create analytics dashboards, reporting surfaces, or autonomous clinical prediction systems.
* Preserve clinician-facing decision support and cognitive compression.

### Standardized Snapshot Summary Payload

Classification: Future opportunity

Rationale:

Visit History quality currently depends on available snapshot payload fields. Older snapshots may have weaker clinical context. A standardized snapshot summary payload may improve consistency later.

Guardrails:

* This would likely touch persistence/output contracts and therefore requires explicit approval.
* Do not implement as incidental cleanup.

---

## Post-MVP Expansion Research

### PT Platform Configuration Validation

Classification: Post-MVP expansion

Rationale:

The platform may translate to PT if discipline-specific intake, reasoning emphasis, progression meaning, and guidance outputs can be configured without diluting OT MVP quality.

### SLP Feasibility Review

Classification: Post-MVP expansion

Rationale:

SLP may require different clinical taxonomies, longitudinal signals, and intervention logic. Treat as feasibility review, not assumed implementation.

---

## What Is Not Active Roadmap Work

The following are not current active implementation priorities unless explicitly approved:

* EMR replacement
* documentation automation as the primary product
* analytics dashboards
* reporting platform work
* autonomous clinician behavior
* broad architecture redesign
* schema or API changes for snapshot summaries
* broad historical document rewrites

---

## Terminology Rule for Roadmap Work

Use current terminology:

* Patient History, not Reference Workspace.
* Visit History, not Historical Snapshots / Version History where clinician-facing.
* Refresh Clinical Guidance, not Regenerate.
* Save Clinical Snapshot, not Save Snapshot.
* Clinical Briefing for Command Center presentation model.

Technical or older docs may still use historical terms for lineage. New work should not reintroduce older clinician-facing labels.
