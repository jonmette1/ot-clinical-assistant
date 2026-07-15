# OT Clinical Assistant — Project Status and Direction

Last updated: 2026-06-04

---

## Status Summary

The project has completed major architecture stabilization and is now in adoption-readiness / workflow-polish maturation.

The OT MVP is functional as a continuity-aware clinical attention workflow. The main implementation question is no longer whether the reasoning architecture exists. The main question is whether clinicians can orient, trust, update, and act from the workflow quickly during real visit preparation.

The product should be described as a **Clinical Attention System**: a platform that compresses clinical complexity into current focus, meaningful change, required attention, immediate action, and supporting context.

---

## Current Product State

The MVP currently includes:

* structured intake
* high-impact intake hierarchy
* deterministic reasoning
* Command Center
* Patient History
* Visit History
* Clinical Impact Summary
* progression checks
* historical snapshot awareness
* clinical briefing-style layout
* visit-oriented snapshot cards
* refreshed clinical guidance
* refreshed next-action derivation
* longitudinal continuity support

Recently completed work includes:

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

---

## Strategic Direction

The platform is currently an OT Clinical Assistant moving toward a broader rehabilitation-focused Clinical Assistant Platform.

Core value:

* cognitive compression
* orientation
* continuity awareness
* change detection
* prioritization
* clinician attention management

The platform should not become:

* an EMR
* a documentation replacement
* an analytics dashboard
* a reporting platform
* an autonomous clinician

Aligned future opportunity:

* Longitudinal Visibility / Continuity Compression

Not current direction:

* Longitudinal Intelligence / Analytics

This distinction matters. The platform should make longitudinal meaning easier to see and use; it should not drift into analytics-heavy reporting or autonomous clinical judgment.

---

## Current Workflow State

Current case workflow:

1. Create case through New Case intake.
2. Generate clinical guidance.
3. Use Command Center for clinical briefing.
4. Use Progression Check to update longitudinal state.
5. Use Clinical Impact Summary after updates.
6. Use Visit History to review previous snapshots.
7. Use Patient History for deeper supporting context.
8. Use historical snapshot mode with read-only protections when reviewing prior visits.

The Command Center should answer within seconds:

* Is the patient improving, stable, or declining?
* What changed since the last visit?
* Why does that change matter?
* What requires attention today?
* What should I do next?

---

## Current Terminology Standard

Use current clinician-facing terminology consistently:

| Use | Avoid where clinician-facing |
| --- | --- |
| Patient History | Reference Workspace |
| Visit History | Historical Snapshots / Version History |
| Refresh Clinical Guidance | Regenerate |
| Save Clinical Snapshot | Save Snapshot |
| Clinical Briefing | generic dashboard/report framing |

Historical / technical docs may still contain older names for implementation lineage. New handoff and clinician-facing docs should use current terminology.

---

## Architecture Status

Stable systems:

* deterministic clinical reasoning architecture
* continuity architecture
* progression architecture
* operational prioritization architecture
* reassessment architecture
* mutation governance architecture
* patient-centric Command Center / Patient History navigation

Do not redesign these systems unless explicitly requested. UX issues should first be addressed through hierarchy, scanability, labeling, progressive disclosure, and workflow clarity.

---

## Roadmap Status

### Completed

* Snapshot Awareness Phase 1
* Intake Prioritization Phase 1
* Intake Prioritization Phase 2
* Workflow Simplification / Navigation Normalization
* Clinical Briefing UX Normalization

### MVP-Critical / Adoption Readiness

* Progression Check discoverability / sticky navigation jump
* action bar cleanup / overflow menu
* responsive UX / mobile-desktop polish

### Future Opportunity

* Longitudinal Visibility / Continuity Compression
* standardized snapshot summary payload if Visit History quality requires more consistent fields

### Post-MVP Expansion

* PT platform configuration validation
* SLP feasibility review

---

## Current Implementation Notes

Implementation inspection confirms:

* The patient workspace contains a sticky navigation layer with Live Case, Command Center, and Patient History.
* Historical snapshot mode has read-only warnings and a return-to-live-case pathway.
* Command Center includes a Review Visit History link.
* Progression Check remains in the Command Center flow.
* Patient History is the deeper context section.
* Bottom actions currently include Refresh Clinical Guidance, Save Clinical Snapshot, Copy Snapshot, and Download Snapshot.
* The edit workflow still contains older regeneration language, including `Regenerate + Update Case`.

The documentation should acknowledge these realities without changing product behavior.

---

## Known Issues / Cleanup Candidates

Documented current cleanup candidates:

* duplicate or unclear Live Case status/navigation behavior if still present
* possible Progression Check discoverability issue
* bottom action bar crowding
* Copy / Download likely belong in secondary/overflow actions
* responsive/mobile visual review still needed
* Visit History quality depends on available snapshot payload fields
* older snapshots may have weaker clinical context
* possible future need for standardized snapshot summary payload

These are not new roadmap commitments. They are handoff notes for future prioritization.

---

## Near-Term Execution Guidance

For implementation agents:

* Do not implement product changes as part of documentation refresh.
* Do not change schema or API contracts without explicit approval.
* Prefer small, targeted UX polish over broad refactors.
* Preserve deterministic reasoning authority.
* Preserve live-state versus historical-snapshot safety.
* Preserve Command Center authority over Patient History context.
* Use current terminology in new documentation and clinician-facing work.
