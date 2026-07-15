# OT Clinical Assistant — Consultant / Agent Handoff

Last updated: 2026-06-04

---

## Handoff Purpose

This document gives a new consultant or AI implementation agent enough current-state context to work without prior chat history. It is intentionally focused on the present product, current terminology, roadmap status, and known cleanup candidates.

This is not a request to redesign architecture.

---

## Product Identity

The OT Clinical Assistant is a clinical workflow assistant for adult rehabilitation and home health OT. It is evolving toward a broader rehabilitation-focused Clinical Assistant Platform.

The best current framing is **Clinical Attention System**.

It exists to help clinicians:

* compress fragmented information
* orient quickly before or during a visit
* detect meaningful change
* understand continuity implications
* prioritize what treatment should focus on now
* allocate attention to the most clinically relevant issue

It is not intended to become:

* an EMR
* a documentation replacement
* an analytics dashboard
* a reporting platform
* an autonomous clinician

---

## Current MVP Reality

The OT MVP now includes:

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

## Current Clinician Workflow

1. Create case through New Case intake.
2. Generate clinical guidance.
3. Use Command Center for clinical briefing.
4. Use Progression Check to update longitudinal state.
5. Use Clinical Impact Summary after updates.
6. Use Visit History to review previous snapshots.
7. Use Patient History for deeper supporting context.
8. Use historical snapshot mode with read-only protections when reviewing prior visits.

The software should carry the continuity burden. The clinician should not need to reconstruct the case from prior visits, inspect internal continuity structures, or understand system internals to know what changed and what should happen next.

---

## Terminology Standard

Use:

* Patient History
* Visit History
* Refresh Clinical Guidance
* Save Clinical Snapshot
* Clinical Briefing

Avoid in new clinician-facing docs or UI language:

* Reference Workspace
* Historical Snapshots / Version History as primary clinician-facing labels
* Regenerate
* Save Snapshot
* dashboard/report framing when describing the Command Center

Older implementation names may still appear in code or historical docs. Do not rename code as part of documentation-only work.

---

## Source Files to Inspect First

Start with docs:

1. `AGENTS.md`
2. `docs/PROJECT_SNAPSHOT.md`
3. `docs/PROJECT_STATUS_AND_DIRECTION.md`
4. `docs/CONSULTANT_HANDOFF.md`
5. `docs/foundation/active_roadmap.md`
6. `docs/foundation/north_star.md`
7. `docs/foundation/platform_north_star.md`
8. `docs/future_opportunities.md`

Then inspect implementation:

* `src/app/cases/[id]/CaseWorkspaceClient.tsx`
* `src/app/cases/[id]/components/StickyOperationalHeader.tsx`
* `src/app/cases/[id]/components/HistoricalSnapshotsSection.tsx`
* `src/app/new-case/page.tsx`
* `src/app/cases/[id]/edit/page.tsx`
* relevant API routes under `src/app/api/`

---

## Implementation Reality Observed

Current implementation inspection shows:

* The patient workspace has sticky navigation for Live Case, Command Center, and Patient History.
* The sticky header labels current state as Live Case or Historical Snapshot.
* Historical snapshot review is read-only and includes return-to-live-case controls.
* Command Center includes a Review Visit History link.
* Visit History displays saved visit snapshots and preview/restore/delete controls.
* Patient History is present as the deeper context area.
* Progression Check is present in the Command Center flow.
* Bottom actions include Refresh Clinical Guidance, Save Clinical Snapshot, Copy Snapshot, and Download Snapshot.
* The edit workflow still contains older `Regenerate + Update Case` wording.

These are documentation observations only. Do not implement behavior changes unless separately requested.

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
* standardized snapshot summary payload if Visit History quality requires it

### Post-MVP Expansion

* PT platform configuration validation
* SLP feasibility review

---

## Known Cleanup Candidates

Current known cleanup candidates:

* duplicate or unclear Live Case status/navigation behavior if still present
* possible Progression Check discoverability issue
* bottom action bar crowding
* Copy / Download likely belong in secondary/overflow actions
* responsive/mobile visual review still needed
* Visit History quality depends on available snapshot payload fields
* older snapshots may have weaker clinical context
* possible future need for standardized snapshot summary payload

Do not treat these as active commitments unless moved into the active roadmap through explicit approval.

---

## Architecture Guardrails

Stable systems should be consumed by workflow surfaces rather than redesigned:

* deterministic clinical reasoning
* continuity architecture
* progression architecture
* operational prioritization
* reassessment architecture
* mutation governance
* patient-centric navigation

When a UX problem appears, first consider:

* hierarchy
* labeling
* information density
* section ordering
* visual authority
* progressive disclosure
* workflow clarity

Do not start by changing architecture, schema, persistence, or API contracts.

---

## Platform Direction Guardrail

Aligned future opportunity:

* **Longitudinal Visibility / Continuity Compression** — help clinicians understand what changed, why it changed, what should be done differently, what progression transition is approaching, and what treatment implication follows.

Not current direction:

* **Longitudinal Intelligence / Analytics** — dashboards, reporting, autonomous insights, or population analytics.

The platform should remain a clinician attention and orientation system.
