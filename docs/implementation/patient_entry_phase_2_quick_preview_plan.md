# Patient Entry Phase 2 — Quick Preview Implementation Plan

## Purpose

This document defines the technical implementation plan for Patient Entry Phase 2 Quick Preview.

It is an implementation blueprint only. It does not approve or introduce code changes, workflow redesign, database schema changes, route changes, new reasoning engines, or Command Center / Reference Workspace redesign.

## Authoritative Inputs Reviewed

- `AGENTS.md`
- `docs/PROJECT_STATUS_AND_DIRECTION.md`
- `docs/foundation/active_roadmap.md`
- `docs/future_opportunities.md`
- `docs/UX/Patient_Entry_Experience_Specification.md`
- `docs/UX/Patient_Card_Information_Hierarchy.md`
- `docs/UX/Patient_Entry_Interaction_Model.md`
- `docs/implementation/patient_entry_implementation_blueprint.md`
- Current Patient Entry implementation in `src/app/cases/page.tsx`
- Current `PatientEntryCard` implementation in `src/app/cases/PatientEntryCard.tsx`
- Current Command Center loading and derivation patterns in `src/app/cases/[id]/CaseWorkspaceClient.tsx`

## Current Implementation Summary

Patient Entry Phase 1 is implemented as a client-rendered `/cases` page using `PatientEntryCard`.

Current behavior:

```text
Patient Card
↓
Open Command Center
```

The current `/cases` query loads only list-safe identity and context fields:

- `id`
- `title`
- `created_at`
- `patient_profile`
- `client_info`
- `case_classification`
- `functional_status`
- `goals_preferences`
- `environment`

The current card displays patient identity, entry timing, treatment-frame fallback content, clinical context, supporting context, and an explicit `Open Command Center` primary action.

No Quick Preview exists today.

## Existing Data Assessment

### Approved Preview Content

The approved Quick Preview content candidates are:

1. Current Focus
2. Attention Required
3. Since Last Visit
4. Next Action
5. Operational Focus Preview
6. Latest Progression Event
7. Last Visit Summary

### Data Available From Current `/cases` Query

The current `/cases` query supports only limited orientation content:

| Preview candidate | Currently available from `/cases` query? | Current support level | Notes |
| --- | --- | --- | --- |
| Current Focus | No | Not supported | Requires generated operational prioritization, not loaded by the patient list query. |
| Attention Required | No | Not supported | Requires `clinical_attention_state`, not loaded by the patient list query. |
| Since Last Visit | No | Not supported | Requires `current_longitudinal_state` and/or latest longitudinal event data. |
| Next Action | No | Not supported | Requires generated plan details, reassessment triggers, progression triggers, and attention flags. |
| Operational Focus Preview | No | Not supported | Requires `generated_output.operational_prioritization`, not loaded by the patient list query. |
| Latest Progression Event | No | Not supported | Requires latest row from `longitudinal_events`. |
| Last Visit Summary | No | Not supported | Requires latest row from `longitudinal_events`. |

The current query does support:

- Patient identity.
- Case title.
- Created timing.
- Primary diagnosis.
- Case type.
- Target activity.
- Functional barriers.
- Environmental safety/equipment hints.

These are useful for the default card but insufficient for clinically meaningful Quick Preview.

### Data Available in Existing Case Detail Loading

The Command Center already loads the case detail with `.select("*")`, which includes the fields needed for most preview signals:

- `generated_output`
- `current_longitudinal_state`
- `clinical_attention_state`
- `reasoning_stale`
- `plan_stale`
- `modules_stale`

The Command Center also separately loads recent longitudinal events from `longitudinal_events`, ordered newest first and limited to two rows. This supports Latest Progression Event and Last Visit Summary derivation.

### Existing Derived Signals That Can Be Reused Conceptually

The Command Center already derives the necessary preview concepts:

| Preview signal | Existing Command Center source pattern |
| --- | --- |
| Current Focus | `generated_output.operational_prioritization.currentOperationalEmphasis` |
| Operational Focus Preview | `generated_output.operational_prioritization` fields, especially emphasis, rationale, barriers, and triggers |
| Attention Required | `clinical_attention_state.attentionStatement`, drivers, operational-review flag, reassessment flag |
| Since Last Visit | `current_longitudinal_state` plus latest event payload fallback |
| Next Action | `structured_plan_details.immediateActions`, operational reassessment triggers, progression triggers, and attention flags |
| Latest Progression Event | latest `longitudinal_events` row |
| Last Visit Summary | latest `longitudinal_events.event_payload`, state snapshot, and attention snapshot |
| Clinical Status / trajectory | stale flags, reassessment pressure, progression state, longitudinal status, and attention status |

These should be extracted into pure derivation helpers if implementation begins. Patient Entry should not import or render Command Center components.

## Recommended Data Strategy

### Option A — Load Preview Data With the Existing Patient List Query

This option would expand the `/cases` list query to include preview-capable fields such as:

- `generated_output`
- `current_longitudinal_state`
- `clinical_attention_state`
- `reasoning_stale`
- `plan_stale`
- `modules_stale`

It may also require a separate batched latest-event query for visible cases.

#### Benefits

- Preview opens immediately with no second loading step for case-level fields.
- Patient cards can show lightweight status signals without user-triggered fetches.
- Simpler preview-toggle interaction once data is loaded.

#### Costs and Risks

- Heavier initial `/cases` payload, especially if `generated_output` is large.
- Increased load time for the patient list even when the clinician never opens a preview.
- Higher risk that patient entry becomes too status-heavy or dashboard-like.
- Requires careful protection against rendering too much generated-output detail on every card.
- Still does not fully solve Latest Progression Event / Last Visit Summary unless latest longitudinal events are also loaded.

#### Best Use

Use only if Phase 2A proves preview fetch latency is clinically disruptive and the case list remains small enough that added payload weight is acceptable.

### Option B — Lazy-Load Preview Data When the User Requests Preview

This option keeps the current `/cases` query lightweight and fetches preview data only when a clinician activates `Quick Preview`.

Recommended preview fetch payload:

From `cases`:

- `id`
- `generated_output`
- `current_longitudinal_state`
- `clinical_attention_state`
- `reasoning_stale`
- `plan_stale`
- `modules_stale`

From `longitudinal_events`:

- latest one or two events for the selected case, ordered by `created_at` descending.

Recommended client behavior:

- Maintain a preview state map keyed by `caseId`.
- Cache loaded preview payloads for the current `/cases` session.
- Show a small inline loading state inside the expanded region.
- If preview data fails, keep `Open Command Center` fully available.
- Do not block the patient list or primary Command Center action.

#### Benefits

- Preserves lightweight patient-list performance.
- Avoids loading generated-output blobs for every patient.
- Aligns with Quick Preview as an optional secondary action.
- Reduces risk of patient entry competing with Command Center.
- Allows progressive rollout of preview derivation without changing base list behavior.

#### Costs and Risks

- First preview expansion may show a short loading state.
- More interaction state must be managed in `CasesPage` or a small preview hook.
- Requires explicit empty/error states.
- If clinicians rapidly preview many patients, multiple point queries could occur.

#### Best Use

Recommended for Phase 2A and Phase 2B because it is the safest path and preserves the approved hierarchy: `Open Command Center` remains primary, `Quick Preview` remains optional.

### Option C — Dedicated Preview Endpoint or RPC-Like Query Layer

This option would introduce a dedicated preview-loading route or data-access function that returns only normalized preview fields.

Potential response shape:

- `caseId`
- `currentFocus`
- `attentionRequired`
- `sinceLastVisit`
- `nextAction`
- `operationalFocusPreview`
- `latestProgressionEvent`
- `lastVisitSummary`
- `clinicalStatus`
- `dataAvailability`

#### Benefits

- Keeps Patient Entry independent from raw case/generation structures.
- Centralizes preview derivation and compression.
- Reduces frontend duplication once preview behavior stabilizes.
- Can enforce concise preview boundaries at the data boundary.

#### Costs and Risks

- Introduces an API/data-access abstraction earlier than necessary.
- Could be interpreted as a new contract unless scoped carefully.
- More implementation surface than needed for the safest first preview foundation.

#### Best Use

Defer until after Phase 2A/2B unless frontend duplication becomes unmanageable or security/performance review requires server-side normalization.

### Recommended Strategy

Use Option B for Phase 2A and Phase 2B.

Keep the list query unchanged initially. Lazy-load preview-only data on expansion, cache by case id for the current session, and derive concise display fields through pure helper functions. Reconsider Option A or Option C only if measured performance, maintainability, or data-governance needs warrant it.

## Recommended Interaction Pattern

### Evaluated Patterns

#### Inline Expansion

The preview expands inside the patient card below the existing card summary and above or near the action row.

Benefits:

- Keeps patient context anchored to the selected card.
- Preserves scanability across the list when collapsed.
- Uses progressive disclosure without introducing a competing surface.
- Works well with lazy-loading and inline empty states.
- Keeps `Open Command Center` visible as the primary action.

Risks:

- Card height can grow if content is not tightly bounded.
- Requires careful separation of checkbox, preview toggle, and navigation action.

#### Accordion Expansion

A structured accordion inside each card, usually with one expandable preview section.

Benefits:

- Similar to inline expansion.
- Provides built-in disclosure semantics.

Risks:

- Can feel component-heavy if the card already has strong hierarchy.
- Multiple accordions can make the list feel like a dashboard or settings page.

#### Drawer or Popover

Preview appears in a side drawer, modal-like panel, or floating popover.

Benefits:

- Can show more content without expanding the list.
- May be useful for deeper review.

Risks:

- Too close to a secondary workspace.
- Increases interaction weight for a 30–60 second pre-visit orientation scenario.
- Can compete with Command Center and Reference Workspace.
- Adds focus-management and mobile layout complexity.

#### Other Lightweight Approaches

Examples include tooltip-like summaries, hover previews, or row-level status chips.

Risks:

- Hover is inaccessible and unreliable on touch devices.
- Chips can create category-color or dashboard-like fragmentation.
- Tooltips are too constrained for clinical orientation content.

### Recommended Pattern

Use inline expansion with a secondary `Quick Preview` button.

Recommended interaction model:

```text
Patient Card
├── Primary visible card content
├── Secondary action: Quick Preview
│   └── Inline expanded preview, when requested
└── Primary action: Open Command Center
```

Implementation expectations:

- `Open Command Center` remains the visually primary action.
- `Quick Preview` is visually secondary and does not navigate.
- Expansion is keyboard accessible.
- Expanded content uses concise typography-led sections, not nested dashboard cards.
- Only one preview may be open at a time if list density becomes problematic; multiple open previews may be acceptable if implementation remains simple.
- The expanded region should have a maximum content budget rather than an unbounded content dump.

## Operational Focus Preview Strategy

### Fields to Use

Use existing `generated_output.operational_prioritization` fields only. Do not create a new operational prioritization system.

Primary field:

- `currentOperationalEmphasis`

Supporting fields, used sparingly:

- `emphasisRationale`
- `dominantBarriers`
- `reassessmentTriggers`
- `continuitySummary`
- `adjacentOperationalPriorities`, only if needed and heavily compressed

Do not expose raw internal continuity or operational-drift language.

### Compression Level

Operational Focus Preview should be more compressed than Command Center and much more compressed than Reference Workspace.

Recommended maximum:

- One headline sentence for current focus.
- One `Why it matters` line, preferably derived from the first one or two rationale items or continuity summary.
- Up to two `Watch for` / reassessment trigger bullets.

Recommended content shape:

```text
Operational Focus
[One sentence current operational emphasis]

Why it matters
[One compressed rationale sentence]

Watch for
- [Trigger or pressure 1]
- [Trigger or pressure 2]
```

### Existing Output Support

Existing operational prioritization outputs can support preview generation because the generated output already contains current emphasis, rationale, dominant barriers, adjacent priorities, reassessment triggers, and continuity summary.

Implementation should reuse existing display compression utilities where appropriate:

- `compressCommandCenterSentence`
- `compressCurrentFocusSentence`
- `compressCommandCenterList`
- `compressNextActionList`

If these utilities are not sufficiently generic, extract small pure helpers rather than duplicating display logic inside `PatientEntryCard`.

### Content Boundaries

Patient Entry Quick Preview may show:

- Current operational emphasis.
- A concise why-it-matters statement.
- At most two watch items or triggers.

Patient Entry Quick Preview should not show:

- Full Operational Focus rationale.
- Full dominant barrier analysis.
- Raw continuity interpretation.
- Operational drift labels.
- Full adjacent priority set.
- Full treatment plan details.
- Historical snapshot detail.

## Risk Assessment

### Highest-Risk Implementation Area

The highest-risk implementation area is preview data derivation and boundary control.

Reasons:

- Most approved preview content is not available in the current `/cases` list query.
- Latest Progression Event and Last Visit Summary require a `longitudinal_events` query.
- Command Center already derives similar concepts, so duplication/divergence is a real risk.
- Preview can easily become a mini Command Center if content limits are not enforced.

### Performance Risks

- Loading `generated_output` for all patients could slow initial Patient Entry rendering.
- Lazy-loading many previews rapidly could produce multiple case/event queries.
- Large generated outputs may be expensive if selected broadly.

Mitigations:

- Start with lazy-loading on expansion.
- Cache by `caseId` for the current session.
- Fetch only preview-required fields, not `select("*")`.
- Limit longitudinal event query to one or two recent rows.
- Keep the current list query unchanged in Phase 2A.

### Duplication Risks With Command Center

Risks:

- Reimplementing Current Focus, Attention Required, Since Last Visit, Next Action, and status derivation in multiple places.
- Preview language drifting from Command Center language.
- Future Command Center updates not reflected in Patient Entry.

Mitigations:

- Extract pure derivation helpers from Command Center logic during Phase 2B.
- Keep helpers display-oriented and data-shape tolerant.
- Avoid importing Command Center components into Patient Entry.
- Use shared compression helpers where possible.

### Risks of Exposing Incomplete Clinical Context

Risks:

- A new case may have no generated output, no longitudinal state, and no events.
- Attention flags may appear urgent without supporting context.
- A concise preview may overstate certainty.
- Clinicians may rely on preview instead of opening Command Center when workflow decisions are needed.

Mitigations:

- Use data-availability-aware empty states.
- Label missing data in clinician-facing terms such as `No visit update recorded yet`, not system terms.
- Keep `Open Command Center` primary and always visible.
- Avoid high-authority visual treatment unless attention is meaningful and explicit.
- Do not show raw status classifications or internal metadata.

### Interaction Risks

Risks:

- Checkbox selection conflicts with preview toggling.
- Preview toggle competes visually with `Open Command Center`.
- Nested interactive elements create accessibility problems.
- Expanded cards reduce list scanability.

Mitigations:

- Use explicit buttons for selection, preview, and navigation.
- Keep the entire card from becoming a single link.
- Maintain a visually subordinate preview toggle.
- Keep preview content bounded and collapsible.
- Ensure focus states and ARIA expanded state are present in implementation.

## Recommended Phase Sequence

### Phase 2A — Safest Quick Preview Foundation

Goal:

Introduce the optional Quick Preview interaction and data-loading foundation without attempting full operational preview richness.

Scope:

1. Add a secondary `Quick Preview` action to `PatientEntryCard`.
2. Add inline expansion beneath the card summary.
3. Lazy-load preview data on first expansion.
4. Cache preview payloads by case id for the current Patient Entry session.
5. Fetch preview-required case fields only:
   - `id`
   - `generated_output`
   - `current_longitudinal_state`
   - `clinical_attention_state`
   - `reasoning_stale`
   - `plan_stale`
   - `modules_stale`
6. Fetch latest one or two `longitudinal_events` rows for the expanded case.
7. Add loading, empty, and error states that do not block `Open Command Center`.
8. Render only the safest concise signals:
   - Current Focus, if available.
   - Attention Required, if meaningful.
   - Since Last Visit, if a visit update exists.
   - Next Action, if concise immediate actions exist.

Do not include full Operational Focus preview yet unless its compression boundary is already trivial.

Acceptance criteria:

- Patient Entry default card remains lightweight.
- `Open Command Center` remains primary.
- `Quick Preview` is optional and secondary.
- Preview expansion does not navigate.
- Missing preview data produces simple clinician-facing empty states.
- Preview data failure does not block Command Center navigation.

### Phase 2B — Operational Focus Preview

Goal:

Add a bounded Operational Focus Preview after the preview shell and data-loading behavior are stable.

Scope:

1. Extract or create pure preview derivation helpers for:
   - Current Focus.
   - Attention Required.
   - Since Last Visit.
   - Next Action.
   - Operational Focus Preview.
2. Use `generated_output.operational_prioritization.currentOperationalEmphasis` as the primary Operational Focus headline.
3. Use first one or two `emphasisRationale` items or `continuitySummary` for a compressed `Why it matters` line.
4. Use up to two `reassessmentTriggers` as `Watch for` items.
5. Keep preview more concise than Command Center and Reference Workspace.
6. Ensure internal continuity terminology is not exposed.

Acceptance criteria:

- Operational Focus Preview is one compact orientation section.
- Full operational rationale remains exclusive to deeper surfaces.
- Patient Entry does not render Command Center or Reference Workspace components.
- Preview helpers avoid meaningful duplication with Command Center derivation logic.

### Phase 2C — Patient-Entry Refinement

Goal:

Refine the Patient Entry experience after Quick Preview data loading and Operational Focus compression are proven stable.

Scope:

1. Adjust visual hierarchy only if needed to preserve scanability with expanded previews.
2. Subordinate administrative controls if preview adds visual weight.
3. Add stable data-availability states:
   - No generated output.
   - Generated output but no longitudinal events.
   - Longitudinal event available.
   - Meaningful attention signal available.
4. Consider whether only one preview should be open at a time based on actual list density.
5. Optionally introduce a small shared preview hook or data-access helper if state management becomes too complex.
6. Consider a dedicated preview endpoint only if frontend data derivation or network behavior becomes difficult to maintain.

Acceptance criteria:

- `/cases` remains a patient-entry surface, not a second Command Center.
- Preview improves pre-visit orientation without increasing workflow friction.
- Administrative actions do not compete with clinical orientation.
- No database schema changes, route changes, or new workflow systems are introduced.

## Final Recommendation

Proceed with Option B: lazy-load Quick Preview data on request, using inline expansion within `PatientEntryCard` and session-level caching by case id.

Implement in this order:

1. Phase 2A: add the Quick Preview foundation, lazy-loading, cache, empty/error states, and safest concise signals.
2. Phase 2B: add bounded Operational Focus Preview using existing operational prioritization outputs and compressed display helpers.
3. Phase 2C: refine Patient Entry hierarchy and interaction states based on Phase 2A/2B behavior.

This sequence preserves the approved model:

```text
Patient Card
↓
Quick Preview (optional)

OR

Patient Card
↓
Open Command Center
```

It also preserves Command Center as the primary workflow surface and Reference Workspace as the deep-review surface while allowing clinicians to orient around a patient before entering the full workflow.
