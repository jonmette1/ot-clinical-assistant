# OT Clinical Assistant — Project Snapshot

Last updated: 2026-06-04

---

## One-Screen Current Summary

The OT Clinical Assistant is an adult rehabilitation / home health clinical workflow assistant. It compresses fragmented intake, visit updates, caregiver context, environmental barriers, and longitudinal changes into clinician-facing attention guidance.

The product should be understood as a **Clinical Attention System**. Its core value is:

* cognitive compression
* rapid orientation
* continuity awareness
* change detection
* treatment prioritization
* clinician attention management

The product is not intended to become an EMR, documentation replacement, analytics dashboard, reporting platform, or autonomous clinician.

---

## Current Product State

The OT MVP now includes:

* structured New Case intake
* high-impact intake hierarchy
* deterministic clinical reasoning inputs and decision model
* Command Center clinical briefing surface
* Patient History for deeper supporting context
* Visit History for saved visit-oriented clinical snapshots
* Clinical Impact Summary after meaningful progression updates
* progression checks and longitudinal state updates
* historical snapshot awareness with read-only protections
* clinical briefing-style Command Center layout
* visit-oriented snapshot cards
* refreshed clinical guidance and next-action derivation
* longitudinal continuity support

Recent completed work includes Snapshot Awareness Phase 1, Clinical Impact Summary, Command Center delta visibility, refreshed Next Action derivation, Intake Prioritization Phase 1, Intake Prioritization Phase 2, High Impact intake hierarchy, Workflow Simplification / Navigation Normalization, Patient History terminology update, Visit History access from Command Center, Clinical Briefing UX Normalization, and Visit History reorientation from software versions to visit-based clinical summaries.

---

## Current Workflow

The current case workflow is:

1. Create a case through New Case intake.
2. Generate clinical guidance.
3. Use the Command Center as the clinical briefing surface.
4. Use Progression Check to update longitudinal state.
5. Use Clinical Impact Summary after updates to understand what changed, what was confirmed, and what should be done differently.
6. Use Visit History to review previous saved clinical snapshots.
7. Use Patient History for deeper supporting context.
8. Use historical snapshot mode with read-only protections when reviewing prior visits.

The Command Center should help a clinician answer quickly:

* What is happening now?
* What changed since the last visit?
* Why does that matter?
* What needs attention today?
* What should I do next?

---

## Current Navigation and Terminology

Current clinician-facing terminology:

* **Patient History**, not Reference Workspace.
* **Visit History**, not Historical Snapshots or Version History where clinician-facing.
* **Refresh Clinical Guidance**, not Regenerate.
* **Save Clinical Snapshot**, not Save Snapshot.
* **Clinical Briefing**, when describing the current Command Center presentation model.

Current navigation model:

Patient
├── Command Center
└── Patient History

Command Center is the primary workflow surface. Patient History is supporting context and should not compete with current clinical orientation.

---

## Implementation Reality to Preserve

Current implementation reflects the above direction:

* `CaseWorkspaceClient.tsx` renders the patient workspace, Command Center, Progression Check, Patient History section, Visit History access, Refresh Clinical Guidance, Save Clinical Snapshot, Copy Snapshot, and Download Snapshot actions.
* `StickyOperationalHeader.tsx` provides sticky patient workspace navigation for Live Case, Command Center, and Patient History, plus live-versus-historical status labeling.
* `HistoricalSnapshotsSection.tsx` presents Visit History, saved visit snapshots, read-only historical preview context, and restore controls.
* `src/app/new-case/page.tsx` remains the structured intake entry point.
* `src/app/cases/[id]/edit/page.tsx` remains the existing edit/update workflow and still contains some older regeneration-oriented language.
* API routes include plan generation, detail-module generation, progression checks, seed progression checks, test OpenAI, and development test-case seeding.

This snapshot is descriptive. It does not approve product behavior changes, schema changes, or API contract changes.

---

## Architecture That Remains Authoritative

The following remain stable authority layers:

* deterministic clinical reasoning architecture
* continuity architecture
* progression architecture
* operational prioritization architecture
* reassessment architecture
* mutation governance architecture
* patient-centric Command Center / Patient History navigation

Generated language should synthesize and explain deterministic outputs. It should not independently become the source of clinical truth.

---

## Current UX Direction

The current Command Center presentation model is a **Clinical Briefing**.

The interface should feel like:

* calm clinical mission control
* restrained and professional
* focused on what matters now
* typography- and whitespace-driven
* clinically meaningful rather than decorative

The interface should avoid:

* dashboard-heavy fragmentation
* decorative color systems
* exposing continuity internals
* equal visual authority for all information
* AI-report aesthetics

Information authority should reinforce:

1. Current clinical reality
2. Meaningful change
3. Required attention
4. Immediate action
5. Supporting context

---

## Roadmap Snapshot

Completed:

* Snapshot Awareness Phase 1
* Intake Prioritization Phase 1
* Intake Prioritization Phase 2
* Workflow Simplification / Navigation Normalization
* Clinical Briefing UX Normalization

MVP-critical cleanup candidates:

* Progression Check discoverability / sticky navigation jump
* action bar cleanup / overflow menu
* responsive UX / mobile-desktop polish

Future opportunities:

* Longitudinal Visibility / Continuity Compression
* standardized snapshot summary payload if Visit History quality requires it

Post-MVP expansion:

* PT platform configuration validation
* SLP feasibility review

---

## Platform Direction

The platform is moving from an OT-only MVP toward a broader rehabilitation-focused Clinical Assistant Platform.

The aligned future direction is **Longitudinal Visibility / Continuity Compression**: helping clinicians understand what changed, why it changed, what is approaching, and what treatment implication follows.

The current direction is not **Longitudinal Intelligence / Analytics**: analytics dashboards, performance reporting, autonomous recommendations, or population-level insights are not current product strategy.

---

## Known Issues and Future Cleanup

Current known cleanup candidates:

* Duplicate or unclear Live Case status/navigation behavior may still need review.
* Progression Check discoverability may be insufficient without a sticky navigation jump.
* Bottom action bar may be crowded.
* Copy / Download likely belong in secondary or overflow actions.
* Responsive/mobile visual review is still needed.
* Visit History quality depends on available snapshot payload fields.
* Older snapshots may have weaker clinical context.
* A standardized snapshot summary payload may be needed later.

Do not implement these as part of documentation refresh work. They are documented for handoff awareness.

---

## New-Agent Onboarding Order

Recommended onboarding order:

1. `AGENTS.md`
2. `docs/PROJECT_SNAPSHOT.md`
3. `docs/PROJECT_STATUS_AND_DIRECTION.md`
4. `docs/CONSULTANT_HANDOFF.md`
5. `docs/foundation/active_roadmap.md`
6. `docs/foundation/north_star.md`
7. `docs/foundation/platform_north_star.md`
8. `docs/future_opportunities.md`
9. `docs/UX/Visual_Design_Principles.md`
10. `docs/UX/Command_Center_UX_Normalization_Roadmap.md`
11. Implementation inspection, especially `src/app/cases/[id]/CaseWorkspaceClient.tsx`, `StickyOperationalHeader.tsx`, `HistoricalSnapshotsSection.tsx`, New Case intake, edit workflow, and relevant API routes.
