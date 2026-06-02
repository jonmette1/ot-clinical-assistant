# Patient Entry Implementation Blueprint

## Purpose

This blueprint defines the safest implementation sequence for evolving the current `/cases` page from a case-management list into the approved patient-entry experience.

It does not introduce implementation code, architecture changes, database schema changes, or route changes. It translates the approved Patient Entry specifications into an incremental technical rollout plan.

## Source Documents Reviewed

- `AGENTS.md`
- `docs/PROJECT_STATUS_AND_DIRECTION.md`
- `docs/foundation/active_roadmap.md`
- `docs/future_opportunities.md`
- `docs/UX/Patient_Entry_Experience_Specification.md`
- `docs/UX/Patient_Card_Information_Hierarchy.md`
- `docs/UX/Patient_Entry_Interaction_Model.md`
- Current `/cases` implementation in `src/app/cases/page.tsx`
- Current Command Center and Reference Workspace routing in `src/app/cases/[id]/page.tsx` and `src/app/cases/[id]/reference/page.tsx`
- Current Command Center data derivation patterns in `src/app/cases/[id]/CaseWorkspaceClient.tsx`

## Current Implementation Findings

### Current `/cases` Behavior

The current `/cases` page is a client-rendered saved-case list. It loads rows from the `cases` table, supports search, filtering, sorting, bulk selection, and deletion, and routes the main card click to `/cases/{id}`.

The current list query loads:

- `id`
- `title`
- `created_at`
- `patient_profile`
- `client_info`
- `case_classification`
- `functional_status`
- `goals_preferences`
- `environment`

The current visible card displays:

- Case title
- Created timestamp
- Primary diagnosis
- Client name

The current search index already uses:

- Client name
- Primary diagnosis
- Case type
- Other key barriers
- Target activity
- Safety hazards
- Equipment present

### Current Routing

Command Center routing is already preserved by `/cases/{id}`.

Reference Workspace routing already exists at `/cases/{id}/reference`.

No route changes are required for Phase 1 or Phase 2. Reference Workspace access from patient entry should remain optional and subordinate if added.

### Current Command Center-Derived Signals

The Command Center already derives the signals the patient-entry experience eventually needs:

- Current Focus from `generated_output.operational_prioritization.currentOperationalEmphasis`
- Clinical Status from staleness flags and reassessment pressure
- Overall Trajectory from longitudinal/progression signals
- Since Last Visit from `current_longitudinal_state` and latest longitudinal event payloads
- Attention Required from `clinical_attention_state`
- Next Action from `structured_plan_details.immediateActions`, reassessment triggers, progression triggers, and attention flags
- Last Visit summary from recent `longitudinal_events`
- Latest Progression Event from recent `longitudinal_events`
- Operational Focus rows from `generated_output.operational_prioritization`

These derivations should be extracted or mirrored carefully only when Phase 2 begins. Phase 1 should avoid duplicating this logic.

## Recommended Phases

## Phase 1 — Low-Risk Patient-Entry Reframing

### Goal

Improve `/cases` as a patient-entry surface without changing data dependencies, routes, deletion behavior, or Command Center entry behavior.

### Scope

Phase 1 should use only data already loaded by `/cases` today.

Recommended changes:

1. Rename visible page framing from saved-case management language toward patient-entry language.
   - Example: `Saved Cases` becomes `Patients` or `Patient Entry` depending on approved label preference.
   - Preserve management controls; do not remove bulk delete, search, sort, or filter.
2. Introduce a dedicated `PatientEntryCard` component that receives the current `CaseRow` shape.
   - This is a presentation extraction, not a data-model change.
   - Preserve card click or primary link behavior to `/cases/{id}`.
3. Reorder visible card information according to the approved hierarchy using currently available fields.
   - Patient identity: title and client name.
   - Clinical context: primary diagnosis and target activity if present.
   - Supporting orientation: created/last-updated timestamp using `created_at` as the temporary available timing signal.
4. Add an explicit primary action label.
   - Recommended label: `Open Command Center`.
   - This should link to `/cases/{id}` exactly as the current card does.
5. Preserve administrative selection affordance.
   - Keep checkbox selection clearly separate from the primary card action.
   - Ensure selection does not interfere with Command Center routing.
6. Keep Quick Preview out of Phase 1.
   - This avoids new data loading and avoids duplicating Command Center logic prematurely.

### Phase 1 Data Requirement

No new data required.

### Phase 1 Safety Rationale

This phase improves orientation and interaction clarity while preserving every current workflow. It avoids the highest-risk areas: extra queries, event joins, derived longitudinal summaries, and route changes.

### Phase 1 Acceptance Checks

- Clicking `Open Command Center` routes to `/cases/{id}`.
- Search, filter, sort, select all, and delete selected still work.
- No new Supabase table is queried.
- No Quick Preview appears yet.
- Reference Workspace routing remains unchanged.

## Phase 2 — Quick Preview Support

### Goal

Add optional Quick Preview using the smallest additional data surface needed to support meaningful preview content without making preview mandatory.

### Scope

Phase 2 should add one optional secondary affordance per patient card:

- Primary action: `Open Command Center`
- Secondary action: `Quick Preview`

Quick Preview should expand in place on `/cases` and should not navigate away.

### Preview Content Priority

Use this preview order:

1. Current Focus
2. Attention Required, only when meaningful
3. Since Last Visit, only when meaningful longitudinal data exists
4. Next Action, only when concise and available
5. Latest Progression Event or Last Visit summary, only when available
6. Concise Operational Focus preview, not full rationale

### Minimal Additional Data

Phase 2 requires expanding the `/cases` data query or adding a preview-specific loader.

Recommended minimal case fields:

- `generated_output`
- `current_longitudinal_state`
- `clinical_attention_state`
- `reasoning_stale`
- `plan_stale`
- `modules_stale`

Recommended latest-event data:

- Latest `longitudinal_events` row per case, preferably loaded on demand when Quick Preview expands.
- Needed event fields:
  - `created_at`
  - `event_type`
  - `event_payload`
  - `current_state_snapshot`
  - `clinical_attention_snapshot`
  - `operational_emphasis_snapshot`

### Recommended Loading Strategy

Use lazy, per-card preview loading first.

The safest approach is:

1. Keep the base `/cases` query lightweight in Phase 1.
2. In Phase 2, when the clinician opens Quick Preview for a card, fetch the additional case fields and the latest longitudinal event for that case.
3. Cache the fetched preview payload in component state keyed by case id.
4. Avoid loading all longitudinal events for all cases at page load.

This minimizes initial-page performance risk and limits exposure to event-query complexity.

### Preview Derivation Strategy

Do not copy the full Command Center JSX or create a mini Command Center.

Instead, create small helper functions that derive concise strings from the preview payload:

- `derivePatientCurrentFocusPreview`
- `derivePatientAttentionPreview`
- `derivePatientSinceLastVisitPreview`
- `derivePatientNextActionPreview`
- `derivePatientLatestVisitPreview`

If later implementation reveals duplicated logic with `CaseWorkspaceClient`, extract shared pure helpers from Command Center logic into a neutral utility module. Do not move routing, stateful workspace behavior, or Reference Workspace rendering into patient entry.

### Empty-State Rules

- New patients should not show artificial longitudinal summaries.
- If no longitudinal event exists, omit `Since Last Visit` and `Latest Progression Event` rather than explaining system absence.
- If no attention state is meaningful, omit `Attention Required`.
- If no generated operational prioritization exists, show only identity and available clinical context.

### Phase 2 Acceptance Checks

- `Open Command Center` remains the fastest and primary action.
- `Quick Preview` expands without navigation.
- Preview does not include full Operational Focus rationale, raw progression metadata, historical snapshots, or Reference Workspace detail.
- Preview handles new cases without empty system explanations.
- Preview data loading failure does not block Command Center routing.

## Phase 3 — Patient-Entry Refinement

### Goal

Refine `/cases` into the fully approved patient-entry experience after Phase 2 proves data loading and preview behavior are stable.

### Scope

Recommended changes:

1. Replace case-management visual dominance with patient-entry hierarchy.
   - Primary visual hierarchy should be identity, current treatment frame, meaningful attention, and timing.
   - Administrative controls should remain present but visually subordinate.
2. Add stable patient-entry card variants for data availability.
   - No generated output yet.
   - Generated output available but no longitudinal events.
   - Longitudinal data available.
   - Meaningful attention/reassessment signal available.
3. Add optional subordinate Reference Workspace access if approved by implementation detail review.
   - If present, label it as deeper review.
   - It should never compete with `Open Command Center`.
4. Consider page-level grouping or sorting only if it uses existing available signals.
   - Do not create new prioritization systems.
   - Do not add category-heavy visual systems.
5. Harden accessibility and interaction behavior.
   - Clear focus states.
   - Separate checkbox, preview toggle, and primary action hit targets.
   - Keyboard-accessible preview expansion.
   - No nested interactive elements that break link/button semantics.
6. Move derived preview helpers into shared utilities if Phase 2 duplication becomes difficult to maintain.

### Phase 3 Data Requirement

No database schema change should be required.

Phase 3 may adjust loading strategy if Phase 2 proves that on-demand fetches are too slow or too fragmented. Any change should remain query-level only and should not change persistence structures.

### Phase 3 Acceptance Checks

- `/cases` reads as patient-entry, not report generation or dashboard management.
- Primary workflow entry still routes to Command Center.
- Reference Workspace remains a deeper review destination.
- Preview remains optional and concise.
- No architecture, database, or API contract changes are introduced.

## Reusable Components

### Directly Reusable

- `/cases` page state and list controls:
  - Search input
  - Case type filter
  - Sort order control
  - Selection state
  - Delete-selected handler
- Existing Supabase client usage.
- Existing Command Center route `/cases/{id}`.
- Existing Reference Workspace route `/cases/{id}/reference`.
- Existing clinical display compression utilities:
  - `compressCommandCenterList`
  - `compressCommandCenterSentence`
  - `compressCurrentFocusSentence`
  - `compressNextActionList`
- Existing Command Center derivation concepts for:
  - Current Focus
  - Since Last Visit
  - Attention Required
  - Next Action
  - Last Visit
  - Clinical Status

### Reusable With Caution

- Command Center derived logic in `CaseWorkspaceClient`.
  - Reuse as pure helper extraction only.
  - Do not import or render Command Center components inside patient entry.
- `SupportingProgressionSummaries` and related Reference Workspace components.
  - These should not be used in Quick Preview because they are reference-oriented and risk turning preview into a mini Reference Workspace.
- Existing operational pressure cards.
  - Do not reuse in patient entry; they are Command Center workflow support, not quick orientation cards.

## Required New Components

### Phase 1

- `PatientEntryCard`
  - Receives the current `CaseRow` shape.
  - Displays identity, diagnosis/context, timing, and primary action.
  - Keeps administrative selection outside primary action semantics.

### Phase 2

- `PatientQuickPreview`
  - In-place expandable preview content.
  - Displays only concise orientation signals.
- `PatientPreviewLoadingState`
  - Small inline loading state for preview fetches.
- `PatientPreviewEmptyState`
  - Minimal new-patient-safe empty state.
- Preview derivation helpers.
  - Prefer pure functions that accept case/preview payloads and return concise strings or arrays.

### Phase 3

- Optional `PatientEntryToolbar` if existing filters need clearer visual grouping.
- Optional `PatientEntryAdminActions` if bulk-management controls need to be visually subordinated.
- Optional `PatientEntryStatusSignal` if clinical status display needs a stable typography-led pattern.

## Data Requirements

### Already Available on `/cases`

- Patient/case title.
- Created timestamp.
- Primary diagnosis.
- Client name.
- Case type.
- Functional barriers used in search.
- Target activity used in search.
- Environment hazards and equipment used in search.

### Available in Existing Case Detail Data, Not Currently Loaded on `/cases`

- `generated_output`
- `current_longitudinal_state`
- `clinical_attention_state`
- `reasoning_stale`
- `plan_stale`
- `modules_stale`

These are required for meaningful Current Focus, Attention Required, Clinical Status, Since Last Visit, and Next Action preview signals.

### Requires Additional Query Beyond Case Row

- Latest longitudinal event from `longitudinal_events`.

This is required for the most reliable Latest Progression Event and Last Visit Summary preview.

### Not Required

- Database schema changes.
- New persistence structures.
- New workflow engines.
- New route hierarchy.
- Full generation or snapshot history loading.

## Quick Preview Feasibility

### Can Quick Preview Be Built Using Currently Available `/cases` Data?

Only a very limited identity/context preview can be built with current `/cases` data.

Current data supports:

- Patient identity
- Diagnosis or broad clinical context
- Target activity if present
- Created timing
- Environmental or equipment hints in search/index context

Current data does not support meaningful approved Quick Preview content such as:

- Current Focus
- Attention Required
- Since Last Visit
- Next Action
- Latest Progression Event
- Last Visit Summary
- Clinical Status / trajectory

### Minimal Additions Required

For clinically meaningful Quick Preview, add:

1. Case-level generated and longitudinal state fields.
2. Latest longitudinal event loading, preferably lazy on preview expansion.
3. Concise derivation helpers that use existing Command Center logic patterns without rendering Command Center or Reference Workspace components.

## Risk Assessment

### Highest-Risk Implementation Area

The highest-risk area is Quick Preview data derivation and loading.

Reasons:

- It requires fields not currently loaded by `/cases`.
- It may require latest-event data from `longitudinal_events`.
- It risks duplicating or diverging from Command Center logic.
- It risks turning patient entry into a mini Command Center or Reference Workspace if content boundaries are not enforced.

### Safest First Implementation

The safest first implementation is Phase 1: extract and reframe the current card using the same data and the same `/cases/{id}` route.

This provides immediate patient-entry alignment while preserving current workflows and avoiding new data dependencies.

### Areas Requiring New Data Loading

- Current Focus: requires `generated_output.operational_prioritization.currentOperationalEmphasis`.
- Attention Required: requires `clinical_attention_state`.
- Since Last Visit: requires `current_longitudinal_state` and/or latest `longitudinal_events` payload.
- Next Action: requires `generated_output.structured_plan_details`, operational reassessment triggers, progression triggers, and attention flags.
- Latest Progression Event / Last Visit Summary: requires latest `longitudinal_events` row.
- Clinical Status / trajectory: requires stale flags, reassessment pressure, progression status, and/or longitudinal state.

### Areas Requiring Route Changes

None required.

Existing routing already supports:

- Command Center: `/cases/{id}`
- Reference Workspace: `/cases/{id}/reference`

The implementation should preserve these routes.

### Interaction Risks

- Nested link/button behavior if the whole card remains a link while Quick Preview is added.
- Checkbox selection conflicting with primary card action.
- Preview toggle competing visually with `Open Command Center`.
- Reference Workspace link competing with primary workflow entry.

Mitigation:

- Use explicit actions instead of making the entire expanded card a single link in Phase 2.
- Keep `Open Command Center` visually primary.
- Keep `Quick Preview` secondary.
- Keep administrative controls visually and semantically separate.

### UX Risks

- Card becomes too dense.
- Attention indicators create false urgency.
- Preview includes raw metadata.
- Preview duplicates Command Center or Reference Workspace.

Mitigation:

- Default card remains lightweight.
- Attention appears only when meaningful.
- Preview uses concise clinician-facing labels.
- Full Operational Focus and historical detail stay in Reference Workspace.

## Final Recommendation

Implement in this order:

1. **Phase 1 — Patient-entry reframing with current data only.**
   - Extract `PatientEntryCard`.
   - Preserve `/cases/{id}` Command Center routing.
   - Preserve management controls.
   - Add explicit `Open Command Center` primary action.
   - Do not add Quick Preview yet.

2. **Phase 2 — Optional Quick Preview with lazy data loading.**
   - Add secondary `Quick Preview` affordance.
   - Fetch preview-only case fields and latest longitudinal event on expansion.
   - Cache preview payloads by case id.
   - Keep preview concise and optional.

3. **Phase 3 — Patient-entry refinement.**
   - Strengthen visual hierarchy and scanability.
   - Subordinate administrative controls.
   - Add stable preview/card states for different data availability levels.
   - Consider optional Reference Workspace access only as deeper review.

This sequence preserves current workflows, preserves Command Center and Reference Workspace routing, avoids schema changes, avoids new architecture, and supports incremental rollout with the least implementation risk.
