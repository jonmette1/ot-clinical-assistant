# Case Workspace Component Map v1

---

# Purpose

This document defines the frontend component ownership map for the Case Workspace experience.

This document translates:
- `clinical_workflow_workspace_architecture_v1.md`
- `case_workspace_blueprint_v1.md`
- `case_workspace_layout_map_v1.md`

into:
- component boundaries
- rendering responsibilities
- layout ownership
- collapse behavior ownership
- continuity rendering ownership
- progression rendering ownership
- detail module placement
- implementation sequencing

This document is not a visual design system.

It is an implementation-facing component architecture map.

---

# Core Implementation Principle

The Case Workspace should not remain one large, monolithic render file.

The current `src/app/cases/[id]/page.tsx` contains:
- data loading
- mutation handlers
- derived display model
- copy/export helpers
- detail module generation
- restore logic
- regeneration logic
- continuity interpretation
- progression display
- large render sections

That structure is workable during early development, but it now creates risk for:
- visual hierarchy drift
- duplicated rendering logic
- difficult UX iteration
- accidental architecture leakage
- overgrown JSX
- unsafe refactors
- poor component ownership

The next phase should move toward:
```txt
small workspace components with clear rendering responsibility
```

NOT:
```txt
a complete rewrite
```

---

# Component Strategy

The component strategy should be:
- incremental
- reversible
- section-based
- behavior-preserving
- visually focused first
- data-shape-preserving

Do not begin by changing:
- database schema
- persistence behavior
- regeneration behavior
- restore behavior
- detail module generation logic
- AI prompt behavior
- generated output shape

The first implementation goal is:
```txt
reorganize rendering hierarchy without changing clinical behavior
```

---

# Recommended Component Folder

Recommended location:

```txt
src/app/cases/[id]/components/
```

Alternative if reused later:

```txt
src/components/case-workspace/
```

Initial recommendation:
use the local route folder first.

Reason:
- safer
- less abstraction
- easier iteration
- avoids premature generalization

Move to shared components only after patterns stabilize.

---

# Target Component Map

## 1. CaseWorkspaceShell

Suggested file:

```txt
src/app/cases/[id]/components/CaseWorkspaceShell.tsx
```

### Responsibility

Owns high-level page layout.

Includes:
- sticky operational header
- main workspace column
- optional support rail
- lower refinement/history zones

### Should Own

- desktop/mobile layout structure
- primary page spacing
- top-level section order
- support rail placement
- scroll architecture

### Should NOT Own

- clinical interpretation logic
- Supabase mutations
- regeneration handlers
- restore handlers
- detail module generation
- derived clinical calculations

---

## 2. StickyOperationalHeader

Suggested file:

```txt
src/app/cases/[id]/components/StickyOperationalHeader.tsx
```

### Responsibility

Persistent orientation layer.

Displays:
- case title / patient identity
- primary diagnosis
- target activity if available
- live vs historical status
- progression phase
- continuity condition
- reassessment pressure

### UX Role

The clinician should never lose orientation while scrolling.

### Should Feel

- compact
- stable
- calm
- operationally useful

### Should Avoid

- too many badges
- excessive color urgency
- backend terminology
- dense metadata

---

## 3. CurrentOperationalStatePanel

Suggested file:

```txt
src/app/cases/[id]/components/CurrentOperationalStatePanel.tsx
```

### Responsibility

Primary above-the-fold operational anchor.

Displays:
- current operational emphasis
- dominant instability drivers
- primary operational risk
- environmental pressure
- caregiver feasibility summary
- immediate concern summary

### UX Role

This is the most important component on the page.

It answers:
```txt
What matters operationally right now?
```

### Should Replace

Report-style generated summary dominance.

### Should Avoid

- long AI prose
- recommendation-heavy language
- pathway framing
- raw backend labels

---

## 4. ProgressionContinuityRow

Suggested file:

```txt
src/app/cases/[id]/components/ProgressionContinuityRow.tsx
```

### Responsibility

Make longitudinal state visible.

Displays:
- progression phase
- advancement readiness
- regression risks
- continuity condition
- reassessment pressure
- operational drift indicators
- continuity alerts

### UX Role

This component turns hidden progression/continuity data into visible clinical orientation.

### Should Feel

- concise
- state-oriented
- clinically meaningful
- not dashboard-heavy

---

## 5. ImmediateOperationalGuidance

Suggested file:

```txt
src/app/cases/[id]/components/ImmediateOperationalGuidance.tsx
```

### Responsibility

Render immediate execution support.

Displays:
- immediate actions
- session priorities
- caregiver expectations
- environmental cautions
- transfer or mobility cautions
- reassessment triggers if urgent

### UX Role

This component answers:
```txt
What should the clinician pay attention to first?
```

### Should Avoid

- broad treatment philosophy
- verbose recommendation lists
- duplicated plan summary language

---

## 6. OperationalSupportRail

Suggested file:

```txt
src/app/cases/[id]/components/OperationalSupportRail.tsx
```

### Responsibility

Optional desktop-side support rail.

Displays compact:
- operational snapshot
- continuity indicators
- quick actions
- current freshness/stale-state indicators
- continuity checkpoint access

### UX Role

Reinforces orientation without disrupting the main workflow.

### Desktop

Visible as right-side rail if screen width supports it.

### Mobile

Collapses below sticky header or becomes an expandable panel.

### Should Avoid

- duplicating full page content
- too many action buttons
- visual competition with CurrentOperationalStatePanel

---

## 7. EnvironmentalPressureCard

Suggested file:

```txt
src/app/cases/[id]/components/EnvironmentalPressureCard.tsx
```

### Responsibility

Render environmental interpretation.

Displays:
- major environmental barriers
- unsafe transitions
- setup bottlenecks
- environmental feasibility concerns

### UX Role

Translate environment data into operational consequences.

### Should Avoid

- raw environment field dump
- exhaustive home assessment rendering
- duplicated equipment details

---

## 8. CaregiverFeasibilityCard

Suggested file:

```txt
src/app/cases/[id]/components/CaregiverFeasibilityCard.tsx
```

### Responsibility

Render caregiver feasibility interpretation.

Displays:
- caregiver availability
- physical support feasibility
- confidence/training implications
- caregiver dependency state
- caregiver mismatch risks

### UX Role

Make caregiver realism visible without overloading the clinician.

### Should Avoid

- idealized caregiver assumptions
- lengthy caregiver narratives
- raw caregiver form echo

---

## 9. TransferMobilityPressureCard

Suggested file:

```txt
src/app/cases/[id]/components/TransferMobilityPressureCard.tsx
```

### Responsibility

Render transfer/mobility interpretation.

Displays:
- worst transfer limitation
- sit-to-stand difficulty
- movement bottlenecks
- mobility device implications
- transfer risk indicators

### UX Role

Translate functional mobility inputs into operational meaning.

### Should Avoid

- raw ADL score tables as the primary presentation
- excessive numeric emphasis
- hidden clinical interpretation

---

## 10. RefinementModulesSection

Suggested file:

```txt
src/app/cases/[id]/components/RefinementModulesSection.tsx
```

### Responsibility

Own optional detail module rendering.

Contains:
- caregiver script
- transfer details
- ADL privacy support
- equipment feasibility

### UX Role

Provide deeper operational refinement only when useful.

### Default State

Collapsed.

### Should Avoid

- dominating the workspace
- appearing as parallel generated plans
- forcing clinicians to read everything

---

## 11. ContinuityCheckpointHistory

Suggested file:

```txt
src/app/cases/[id]/components/ContinuityCheckpointHistory.tsx
```

### Responsibility

Render historical generations as continuity checkpoints.

Displays:
- checkpoint timestamp
- active/live status
- snapshot reason
- operational state summary
- restore action
- delete action when allowed

### UX Role

Reframe versions/generations as clinical continuity history.

### Should Avoid

- technical version language
- prompt-version-first display
- software-history framing

---

## 12. SystemTransparencyPanel

Suggested file:

```txt
src/app/cases/[id]/components/SystemTransparencyPanel.tsx
```

### Responsibility

Render decision transparency and reasoning internals.

Displays:
- dominant barrier
- secondary barrier
- safety risk
- support level
- selected strategies
- reasoning summary
- normalization insight if useful

### UX Role

Provide trust support for users who want to inspect reasoning.

### Default State

Collapsed.

### Visual Priority

Lowest.

### Should Avoid

- appearing above operational state
- competing with clinician-facing guidance
- exposing excessive backend terminology

---

# Derived Display Model Strategy

Before heavy component extraction, preserve the existing derived display model inside `page.tsx`.

Current derived values include:
- `displayCase`
- `generated`
- `progressionState`
- `operationalPrioritization`
- `continuityInterpretation`
- `currentOperationalEmphasis`
- `dominantBarriers`
- `structuredPlanDetails`
- `caregiverGuidance`
- `executiveBriefing`
- `worstTransfer`

Initial component extraction should pass these values as props.

Do NOT move derived state logic immediately unless:
- the component boundary is stable
- output parity is preserved
- TypeScript remains manageable

---

# Recommended Implementation Sequence

## Phase 1 — Extract Visual Components Only

Goal:
Reduce JSX density without changing behavior.

Extract:
1. StickyOperationalHeader
2. CurrentOperationalStatePanel
3. ProgressionContinuityRow

Do not change:
- data loading
- mutation handlers
- generation handlers
- restore logic
- Supabase calls

---

## Phase 2 — Reorder Workspace Hierarchy

Goal:
Move the page away from generated-report hierarchy.

Implement:
- operational state first
- progression/continuity row second
- immediate guidance third
- refinement modules lower
- transparency lower

Preserve:
- existing data fields
- generated output shape
- detail module behavior

---

## Phase 3 — Add Support Rail

Goal:
Improve desktop scanability.

Implement:
- OperationalSupportRail
- compact continuity indicators
- quick actions

Mobile:
- collapse rail into expandable section

---

## Phase 4 — Reframe History

Goal:
Move from version history to continuity checkpoints.

Implement:
- ContinuityCheckpointHistory
- checkpoint language
- operational state preview per generation if available

Do not change restore semantics.

---

## Phase 5 — Refine Detail Modules

Goal:
Make detail modules optional refinements.

Implement:
- RefinementModulesSection
- collapsed defaults
- module freshness indicators
- generate buttons with clearer purpose

Do not change generation API yet.

---

# Component Props Strategy

Use simple prop passing initially.

Avoid:
- global state changes
- new context providers
- complex state libraries
- premature abstraction

Example pattern:

```tsx
<CurrentOperationalStatePanel
  currentOperationalEmphasis={currentOperationalEmphasis}
  dominantBarriers={dominantBarriers}
  structuredPlanDetails={structuredPlanDetails}
  caregiverGuidance={caregiverGuidance}
/>
```

This is preferred over large architectural changes.

---

# Collapse State Strategy

Initial collapse state can remain local in `page.tsx`.

Avoid building a global collapse controller immediately.

Potential state names:
- `showRefinementModules`
- `showContinuityHistory`
- `showSystemTransparency`
- `showEnvironmentalInterpretation`
- `showCaregiverFeasibility`

Default:
- operational state open
- progression/continuity visible
- immediate guidance visible
- refinement collapsed
- transparency collapsed
- history collapsed or lower-page visible

---

# Data Ownership Rules

## Components May Own

- visual rendering
- section labels
- collapse UI
- empty-state display
- basic formatting
- badge labels

## Components Must Not Own

- Supabase mutations
- plan regeneration
- restore behavior
- canonical continuity building
- persistence logic
- stale-state mutation
- detail module API calls initially

Handlers should remain in `page.tsx` until component boundaries stabilize.

---

# Language Rules

Use clinician-facing language.

Prefer:
- Current operational state
- What is unstable now
- What to monitor
- Caregiver support
- Home setup barriers
- Reassessment pressure
- Continuity condition
- Operational risks

Avoid:
- generated output
- decision engine
- pathways
- prompt version
- operational prioritization object
- deterministic reasoning layer
- payload
- model internals

Exception:
SystemTransparencyPanel may use more technical language, but should remain collapsed.

---

# Visual Priority Rules

Highest:
- CurrentOperationalStatePanel
- ProgressionContinuityRow
- ImmediateOperationalGuidance

Medium:
- EnvironmentalPressureCard
- CaregiverFeasibilityCard
- TransferMobilityPressureCard

Lower:
- RefinementModulesSection
- ContinuityCheckpointHistory

Lowest:
- SystemTransparencyPanel

---

# Non-Goals

Do not use this phase to:
- redesign the database
- change generated output shape
- rewrite API routes
- remove legacy fields
- rebuild detail module generation
- implement full reassessment workflow
- introduce predictive dashboards
- build timeline analytics
- create complex global state management

---

# Codex Usage Guidance

This phase is Codex-worthy once implementation begins because it likely touches:
- `src/app/cases/[id]/page.tsx`
- new local component files
- imports
- props
- section ordering
- render hierarchy

Use Codex with tight scope.

Start with one extraction phase:
```txt
Extract StickyOperationalHeader, CurrentOperationalStatePanel, and ProgressionContinuityRow only.
```

Do not ask Codex to redesign the whole page in one pass.

---

# Success Criteria

The first implementation pass succeeds if:
- TypeScript passes
- no behavior changes
- no persistence changes
- no generated output shape changes
- no restore behavior changes
- page becomes easier to scan
- operational state becomes visually dominant
- progression/continuity state becomes visible
- transparency is demoted
- report-style hierarchy is reduced

The long-term goal is:

```txt
a continuity-aware operational workspace
```

NOT:

```txt
a refactored AI-generated report page
```
