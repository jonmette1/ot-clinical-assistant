# OT Clinical Assistant — Intake Fidelity Normalization Phase 1 Specification

## Purpose

Create an implementation-ready specification for the first intake fidelity normalization pass.

Phase 1 improves the intake workflow by:

1. Elevating the highest-signal clinical, caregiver, safety, functional, and environmental fields.
2. Demoting low-signal administrative and deep environmental detail.
3. Adding contradiction guardrails before plan generation.
4. Removing the visible `Clinical Decision Inputs` section while preserving derived clinical decision input generation.

This specification is implementation guidance only. It does not authorize schema changes, API contract changes, reasoning-engine changes, continuity-architecture changes, or clinical model redesign.

---

## Scope

### In Scope

- New-case intake hierarchy and field ordering.
- Field visibility and progressive disclosure rules.
- Required vs optional field behavior for first-pass case generation.
- Client-side validation and contradiction warnings before `Generate Plan`.
- Removal of the visible `Clinical Decision Inputs` explanatory section.
- Preservation of derived `clinical_decision_inputs`, `clinicalDecisionModel`, and existing payload structures.

### Out of Scope

- Database schema changes.
- Supabase persistence changes.
- `/api/generate-plan` request or response contract changes.
- Clinical decision engine changes.
- Progression, continuity, reassessment, or mutation-governance changes.
- New navigation, patient workspace, or command-center architecture.
- New scoring systems.

---

## Implementation Principles

1. **Do not make clinical decision inputs user-facing.** They remain derived automatically from intake data.
2. **Do not reduce environmental realism.** Demoted fields remain available through progressive disclosure or later sections.
3. **Do not block generation for every inconsistency.** Use blocking validation only when the plan would be clinically incoherent or structurally incomplete.
4. **Favor clinician-facing language.** Avoid internal terminology such as weighting, operational driver, clinical decision input, inferred model, or prioritization driver.
5. **Prioritize fields that shape treatment focus now.** Intake should capture what matters for immediate clinical reasoning before administrative or deep environmental detail.

---

## Proposed Intake Hierarchy

### Phase 1 Section Order

Implement the visible intake sequence in this order:

1. `Patient Snapshot`
2. `Primary Treatment Need`
3. `Functional Severity`
4. `Safety + Mobility Risk`
5. `Caregiver + Support Reality`
6. `Home Feasibility Snapshot`
7. `Detailed Home Assessment`
8. `Administrative Details`
9. `Live Case Preview`

This is a presentation-order change only. Existing state names and payload locations should remain unchanged unless a later approved implementation explicitly authorizes migration.

---

## Fields to Elevate

Elevated fields should appear above detailed home assessment and before administrative contact detail. They are the highest-signal fields for intake fidelity, operational prioritization, and first-pass plan coherence.

| Proposed section | Visible label | Existing state / payload path | Required? | Rationale |
|---|---|---|---|---|
| Patient Snapshot | Client Name | `clientName`; `client_info.client_name` | Required | Needed for case identity and saved-case selection. |
| Patient Snapshot | Age Range | `ageRange`; `patient_profile.age_range` | Required | High-level patient context; currently defaults to `70-79`. |
| Patient Snapshot | Primary Diagnosis | `primaryDiagnosis`; `patient_profile.primary_diagnosis` | Required | Basic clinical context for all generated planning. |
| Primary Treatment Need | Target Activity | `targetActivity`; `target_activities[0]` | Required | Primary occupational performance anchor. |
| Primary Treatment Need | Other Target Activity | `otherTargetActivity`; `goals_preferences.other_target_activity` | Conditionally required | Required only when target activity supports or uses an `Other` choice in a future UI; optional in current option set. |
| Primary Treatment Need | Primary Goal | `primaryGoal`; `goals_preferences.primary_goal` | Required | Supplies functional intent and user-centered outcome language. |
| Primary Treatment Need | Clinical Focus | `clinicalFocus`; `case_classification.clinical_focus` | Required, demoted within section | Still clinically meaningful but should not lead the workflow or appear as system configuration. |
| Functional Severity | Assistance Needed for Primary Activity | `assistanceLevel`; `functional_status.current_assistance_level` | Required | Core severity signal; rename visible label from `Current Assistance Level`. |
| Functional Severity | Bed Transfer Assistance | `adlAssistLevels.bed_transfer`; `functional_status.adl_assist_levels.bed_transfer` | Required | High-signal transfer severity field. |
| Functional Severity | Toilet Transfer Assistance | `adlAssistLevels.toilet_transfer`; `functional_status.adl_assist_levels.toilet_transfer` | Required | High-signal bathroom and toileting safety field. |
| Functional Severity | Shower Transfer Assistance | `adlAssistLevels.shower_transfer`; `functional_status.adl_assist_levels.shower_transfer` | Required | High-signal bathing safety field. |
| Functional Severity | Key Barriers | `keyBarriers`; `functional_status.key_barriers` | Required | Dominant barrier signal for reasoning, prioritization, and plan language. |
| Functional Severity | Other Key Barriers | `otherKeyBarriers`; `functional_status.other_key_barriers` | Optional | Useful for nuance but not required for coherent generation. |
| Safety + Mobility Risk | Recent Falls | `recentFalls`; `functional_status.general_mobility_summary.recent_falls`; `environment.general_mobility.recent_falls` | Required | Major risk contradiction anchor and fall-risk signal. |
| Safety + Mobility Risk | Primary Mobility Device | `mobilityDevice`; `functional_status.general_mobility_summary.primary_mobility_device`; `environment.general_mobility.primary_mobility_device` | Required | Context for mobility feasibility and contradictions. |
| Safety + Mobility Risk | Indoor Mobility Level | `indoorMobilityLevel`; `functional_status.general_mobility_summary.indoor_mobility_level`; `environment.general_mobility.indoor_mobility_level` | Required | Directly shapes supervision and safety reasoning. |
| Safety + Mobility Risk | Endurance | `mobilityEndurance`; `functional_status.general_mobility_summary.endurance`; `environment.general_mobility.endurance` | Required | Key treatment tolerance and mobility burden signal. |
| Safety + Mobility Risk | Sit-to-Stand Difficulty | `sitToStandDifficulty`; `functional_status.transfer_surface_summary.sit_to_stand_difficulty`; `environment.transfer_surfaces.sit_to_stand_difficulty` | Required | High-signal transfer feasibility field. |
| Caregiver + Support Reality | Caregiver Availability | `caregiverAvailability`; `caregiverSupport.availability`; `caregiver_info.availability` | Required | High-signal feasibility and carryover field. |
| Caregiver + Support Reality | Caregiver Physical Capacity | `caregiverPhysicalCapacity`; `caregiverSupport.physical_capacity`; `caregiver_info.physical_capacity` | Required when caregiver is available or primary support | Prevents unrealistic caregiver-assisted recommendations. |
| Caregiver + Support Reality | Caregiver Confidence | `caregiverConfidence`; `caregiverSupport.confidence`; `caregiver_info.confidence` | Required when caregiver is available or primary support | Carryover and training feasibility signal. |
| Caregiver + Support Reality | Primary Support? | `caregiverIsPrimarySupport`; `caregiverSupport.is_primary_support`; `caregiver_info.is_primary_support` | Optional | Optional boolean, but guardrails apply when checked. |
| Caregiver + Support Reality | Caregiver Training Level | `caregiverTrainingLevel`; `caregiverSupport.training_level`; `caregiver_info.training_level` | Optional in Phase 1 | Useful but less essential than availability, capacity, confidence. |
| Caregiver + Support Reality | Caregiver Priorities | `caregiverPriorities`; `caregiverSupport.priorities`; `caregiver_info.priorities` | Optional | Qualitative context; not required for generation. |
| Home Feasibility Snapshot | Environmental Constraint | `environmentalConstraint`; `feasibility_context.environmental_constraint` | Required | High-level feasibility constraint. Rename visible label to `Home Setup Complexity`. |
| Home Feasibility Snapshot | Equipment Access | `equipmentAccess`; `feasibility_context.equipment_access` | Required | DME feasibility signal. |
| Home Feasibility Snapshot | Financial Constraint | `financialConstraint`; `feasibility_context.financial_constraint` | Optional, default `unknown` allowed | Important but should not block generation when unknown. |
| Home Feasibility Snapshot | Bathroom Type | `bathroomType`; `environment.bathroom_assessment.bathroom_type` | Required | High-signal bathing and transfer complexity field. |
| Home Feasibility Snapshot | Bathroom Space Constraints | `spaceConstraints`; `environment.bathroom_assessment.space_constraints` | Required | High-signal feasibility field. |
| Home Feasibility Snapshot | Grab Bars | `grabBarsStatus`; `environment.bathroom_assessment.grab_bars_status` | Required | Safety and equipment contradiction anchor. |
| Home Feasibility Snapshot | Bath Seating | `bathSeating`; `environment.bathroom_assessment.bath_seating` | Required | Bathing feasibility and equipment contradiction anchor. |
| Home Feasibility Snapshot | Safety Hazards | `safetyHazards`; `environment.bathroom_assessment.safety_hazards` | Optional | Strong signal when present; do not require because absence may be valid. |
| Home Feasibility Snapshot | Equipment Present | `equipmentPresent`; `environment.bathroom_assessment.equipment_present` | Optional | Strong signal when present; contradiction guardrails apply. |
| Home Feasibility Snapshot | Steps Present | `stepsPresent`; `environment.outside_entrance.steps_present` | Required | High-signal access/safety field. |
| Home Feasibility Snapshot | Number of Steps | `numberOfSteps`; `environment.outside_entrance.number_of_steps` | Conditionally required | Required when `stepsPresent = yes`. |
| Home Feasibility Snapshot | Railings | `railingsPresent`; `environment.outside_entrance.railings_present` | Conditionally required | Required when `stepsPresent = yes`. |

---

## Fields to Demote

Demoted fields should remain available but should not appear before the high-signal clinical story. Demotion means lower section placement, progressive disclosure, or movement into administrative/detail areas. It does not mean deleting fields or removing payload values.

### Demote to Administrative Details

| Existing visible field | Existing state / payload path | Required? | Demotion instruction |
|---|---|---|---|
| Phone | `clientPhone`; `client_info.phone` | Optional | Move below clinical intake; do not block generation. |
| Email | `clientEmail`; `client_info.email` | Optional | Move below clinical intake; do not block generation. |
| Address | `clientAddress`; `client_info.address` | Optional | Move below clinical intake; do not block generation. |
| Caregiver Name | `caregiverName`; `caregiverSupport.caregiver_name`; `caregiver_info.caregiver_name` | Optional | Move below caregiver support reality or into expandable caregiver details. |
| Relationship | `caregiverRelationship`; `caregiverSupport.relationship`; `caregiver_info.relationship` | Optional | Move below high-signal caregiver fields. |
| Caregiver Phone | `caregiverPhone`; `caregiverSupport.phone`; `caregiver_info.phone` | Optional | Move into administrative contact detail. |
| Case Type | `caseType`; `case_classification.case_type` | Optional default | Keep default but visually demote; not a first-read field. |

### Demote to Advanced Configuration

| Existing visible field | Existing state / payload path | Required? | Demotion instruction |
|---|---|---|---|
| Clinical Focus | `clinicalFocus`; `case_classification.clinical_focus` | Required | Keep available, but visually subordinate to target activity, goal, and functional severity. If an `Advanced Configuration` region exists, place it there. If not, keep at the bottom of `Primary Treatment Need` with explanatory label: `Treatment lens`. |

### Demote to Detailed Home Assessment

| Existing visible field | Existing state / payload path | Required? | Demotion instruction |
|---|---|---|---|
| Driveway Surface | `drivewaySurface`; `environment.outside_entrance.driveway_surface` | Optional | Keep in detailed outside/entrance section. |
| Parking | `parkingType`; `environment.outside_entrance.parking_type` | Optional | Keep in detailed outside/entrance section. |
| Entry Access | `entryAccess`; `environment.outside_entrance.entry_access` | Optional | Keep in detailed outside/entrance section. |
| Step Height | `stepHeight`; `environment.outside_entrance.step_height` | Optional unless future entrance module requires | Keep visible after steps are present; do not elevate in Phase 1. |
| Step Depth | `stepDepth`; `environment.outside_entrance.step_depth` | Optional unless future entrance module requires | Keep visible after steps are present; do not elevate in Phase 1. |
| Door Type | `doorType`; `environment.outside_entrance.door_type` | Optional | Keep in detailed outside/entrance section. |
| Door Width | `doorWidth`; `environment.outside_entrance.door_width` | Optional | Keep in detailed outside/entrance section. |
| Mailbox Location | `mailboxLocation`; `environment.outside_entrance.mailbox_location` | Optional | Keep in detailed outside/entrance section. |
| Exterior Hazards | `exteriorHazards`; `environment.outside_entrance.exterior_hazards` | Optional | Keep detailed but allow future elevation if falls/access becomes dominant. |
| Other Exterior Hazards | `otherExteriorHazards`; `environment.outside_entrance.other_exterior_hazards` | Optional | Keep detailed. |
| Toilet Setup | `toiletSetup`; `environment.bathroom_assessment.toilet_setup` | Optional | Keep in detailed bathroom section; elevate only if target is toileting. |
| Bath Transfer Surface | `transferSurface`; `environment.bathroom_assessment.transfer_surface` | Optional | Keep in detailed bathroom section; current bathroom type already supplies high-level context. |
| Handheld Shower | `handheldShowerStatus`; `environment.bathroom_assessment.handheld_shower_status` | Optional | Keep detailed. |
| Other Safety Hazards | `otherSafetyHazards`; `environment.bathroom_assessment.other_safety_hazards` | Optional | Keep detailed. |
| Other Equipment Present | `otherEquipmentPresent`; `environment.bathroom_assessment.other_equipment_present` | Optional | Keep detailed. |
| Bed Type | `bedType`; `environment.bedroom_bed_setup.bed_type` | Optional | Keep in bedroom detail section. |
| Bed Height | `bedHeight`; `environment.bedroom_bed_setup.bed_height` | Optional | Keep in bedroom detail section. |
| Bed Rails Present | `bedRails`; `environment.bedroom_bed_setup.bed_rails` | Optional | Keep in bedroom detail section. |
| Clearance Around Bed | `bedClearance`; `environment.bedroom_bed_setup.bed_clearance` | Optional | Keep in bedroom detail section. |
| Nighttime / Bedside Hazards | `bedHazards`; `environment.bedroom_bed_setup.bedside_hazards` | Optional | Keep detailed unless target activity is bed transfer or nighttime toileting. |
| Primary Seating | `primarySeating`; `functional_status.transfer_surface_summary.primary_seating`; `environment.transfer_surfaces.primary_seating` | Optional | Keep near sit-to-stand context, but visually subordinate. |
| Seat Height | `seatHeight`; `functional_status.transfer_surface_summary.seat_height`; `environment.transfer_surfaces.seat_height` | Optional | Keep near sit-to-stand context. |
| Armrests Present | `armrestsPresent`; `functional_status.transfer_surface_summary.armrests_present`; `environment.transfer_surfaces.armrests_present` | Optional | Keep near sit-to-stand context. |
| Surface Firmness | `surfaceFirmness`; `functional_status.transfer_surface_summary.surface_firmness`; `environment.transfer_surfaces.surface_firmness` | Optional | Keep near sit-to-stand context. |

---

## Visible Clinical Decision Inputs Removal

### Current Problem

The intake currently displays a visible section titled `Clinical Decision Inputs` with explanatory text. This exposes internal system behavior and interrupts clinician-facing intake flow.

### Required Change

Remove the visible `Clinical Decision Inputs` section from the intake UI.

### Must Preserve

The implementation must preserve all of the following derived behavior:

- `buildClinicalDecisionInputFromCase(casePayload)` still runs after the case payload is assembled.
- `casePayload.clinical_decision_inputs` is still populated.
- `buildClinicalDecisionModel(...)` still receives derived values from `clinicalDecisionInput`.
- `casePayload.clinicalDecisionModel` is still populated.
- Saved cases still include `clinical_decision_input` / `clinical_decision_inputs` as currently used by persistence and generation flows.
- No user-facing replacement section should be added.

### Do Not Do

- Do not add manual controls for `goalCategory`, `dominantBarrier`, `safetyRiskLevel`, `supportLevel`, `clinicalLens`, or `environmentContext`.
- Do not rename payload fields in Phase 1.
- Do not change clinical decision engine defaults in Phase 1.
- Do not expose derived model terminology in the form, preview, or validation messages.

---

## Contradiction Guardrails

Contradiction guardrails should run when the clinician selects `Generate Plan` and before the payload is sent to `/api/generate-plan`.

### Severity Levels

| Severity | Behavior | Use when |
|---|---|---|
| Blocking error | Prevent generation until corrected. | The intake contains a structural contradiction likely to create an unsafe or incoherent plan. |
| Review warning | Allow generation after clinician acknowledgement or second click. | The intake may be clinically plausible but deserves confirmation. |
| Quiet normalization | No user interruption; normalize display or preserve as-is. | The issue is cosmetic, default-driven, or non-critical. |

### Validation Message Style

Messages should be clinician-facing and concise:

- Use: `This may conflict with the current mobility picture.`
- Avoid: `Contradiction detected in operational driver inputs.`
- Use: `Please confirm or update before generating the plan.`
- Avoid: `Clinical decision model cannot resolve feasibility state.`

---

## Blocking Contradiction Rules

### B1 — Steps Present vs Number of Steps

- Trigger when `stepsPresent = yes` and `numberOfSteps` is empty, `0`, non-numeric, or less than `1`.
- Message: `Steps are marked present. Enter the number of steps before generating the plan.`
- Field focus: `numberOfSteps`.
- Severity: Blocking error.

### B2 — Steps Present vs Railings Not Answered

- Trigger when `stepsPresent = yes` and `railingsPresent` is empty or `n/a`.
- Message: `Steps are marked present. Confirm whether railings are available before generating the plan.`
- Field focus: `railingsPresent`.
- Severity: Blocking error.

### B3 — No Steps vs Positive Number of Steps

- Trigger when `stepsPresent = no` and `numberOfSteps` is numeric and greater than `0`.
- Message: `Number of steps is entered, but steps are marked as not present. Update one of these fields before generating the plan.`
- Field focus: `stepsPresent` and `numberOfSteps`.
- Severity: Blocking error.

### B4 — Primary Caregiver Without Support Availability

- Trigger when `caregiverIsPrimarySupport = true` and `caregiverAvailability` is empty or `unknown`.
- Message: `Primary caregiver is selected. Confirm caregiver availability before generating the plan.`
- Field focus: `caregiverAvailability`.
- Severity: Blocking error.

### B5 — Primary Caregiver Cannot Provide Physical Assist With High Physical Assistance Need

- Trigger when all are true:
  - `caregiverIsPrimarySupport = true`
  - `caregiverPhysicalCapacity = cannot_provide_physical_assist`
  - any of `assistanceLevel`, `adlAssistLevels.bed_transfer`, `adlAssistLevels.toilet_transfer`, or `adlAssistLevels.shower_transfer` is `1`, `2`, or `3`
- Message: `The patient needs physical assistance, but the primary caregiver is marked unable to provide physical assist. Update the caregiver support picture before generating the plan.`
- Field focus: `caregiverPhysicalCapacity` and relevant assistance field.
- Severity: Blocking error.

### B6 — Bath Equipment Contradiction: Grab Bars

- Trigger when `grabBarsStatus = none` and `equipmentPresent` includes `grab_bars`.
- Message: `Grab bars are listed as both absent and present. Update bathroom equipment before generating the plan.`
- Field focus: `grabBarsStatus` and `equipmentPresent`.
- Severity: Blocking error.

### B7 — Bath Equipment Contradiction: Shower Chair

- Trigger when `bathSeating = none` and `equipmentPresent` includes `shower_chair`.
- Message: `Bath seating is marked none, but a shower chair is listed as present. Update bathroom equipment before generating the plan.`
- Field focus: `bathSeating` and `equipmentPresent`.
- Severity: Blocking error.

### B8 — Bath Equipment Contradiction: Tub Bench

- Trigger when `bathSeating = none` and `equipmentPresent` includes `tub_bench`.
- Message: `Bath seating is marked none, but a tub bench is listed as present. Update bathroom equipment before generating the plan.`
- Field focus: `bathSeating` and `equipmentPresent`.
- Severity: Blocking error.

### B9 — Required High-Signal Clinical Context Missing

- Trigger when any required text field is blank after trimming:
  - `clientName`
  - `primaryDiagnosis`
  - `primaryGoal`
- Message: `Complete the patient name, primary diagnosis, and primary goal before generating the plan.`
- Field focus: first missing required text field.
- Severity: Blocking error.

### B10 — Required Key Barriers Missing

- Trigger when `keyBarriers.length = 0` and `otherKeyBarriers` is blank after trimming.
- Message: `Select at least one key barrier or enter another key barrier before generating the plan.`
- Field focus: `keyBarriers`.
- Severity: Blocking error.

---

## Review Warning Rules

### W1 — Recent Falls With Fully Independent Mobility

- Trigger when all are true:
  - `recentFalls = yes`
  - `mobilityDevice = none`
  - `indoorMobilityLevel = independent`
  - `assistanceLevel` is `6` or `7`
- Message: `Recent falls are marked yes, while mobility is documented as independent with no device. Confirm this is accurate before generating the plan.`
- Severity: Review warning.

### W2 — Severe Functional Assistance With No Mobility Support

- Trigger when all are true:
  - any of `assistanceLevel`, `adlAssistLevels.bed_transfer`, `adlAssistLevels.toilet_transfer`, or `adlAssistLevels.shower_transfer` is `1`, `2`, or `3`
  - `mobilityDevice = none`
  - `indoorMobilityLevel = independent`
- Message: `Assistance needs appear high, but mobility is documented as independent with no device. Confirm this is accurate before generating the plan.`
- Severity: Review warning.

### W3 — Caregiver Training Focus With No Meaningful Caregiver Context

- Trigger when `clinicalFocus = caregiver_training` and all are true:
  - `caregiverAvailability` is empty or `unknown`
  - `caregiverPhysicalCapacity` is empty or `unknown`
  - `caregiverConfidence` is empty or `unknown`
  - `caregiverTrainingLevel` is empty or `unknown`
- Message: `Caregiver training is selected, but caregiver support details are mostly unknown. Confirm or update caregiver context before generating the plan.`
- Severity: Review warning.

### W4 — Home Safety Target With No Safety or Environmental Signal

- Trigger when `targetActivity = Home Safety` and all are true:
  - `recentFalls = no`
  - `safetyHazards.length = 0`
  - `exteriorHazards.length = 0`
  - `environmentalConstraint = flexible` or `unknown`
- Message: `Home safety is selected, but no safety or environmental concern is documented. Confirm this is accurate before generating the plan.`
- Severity: Review warning.

### W5 — Severe Environmental Constraint With No Detailed Environmental Barriers

- Trigger when `environmentalConstraint = severe` and all are true:
  - `safetyHazards.length = 0`
  - `exteriorHazards.length = 0`
  - `bedHazards.length = 0`
  - `spaceConstraints = minimal`
- Message: `Home setup complexity is marked severe, but detailed barriers are minimal or absent. Confirm the home setup before generating the plan.`
- Severity: Review warning.

### W6 — Equipment Access Unknown With Equipment-Dependent Setup

- Trigger when `equipmentAccess = unknown` and any are true:
  - `bathSeating` is not `none`
  - `grabBarsStatus` is not `none` and not `unknown`
  - `equipmentPresent.length > 0`
- Message: `Equipment is documented, but equipment access is unknown. Confirm whether equipment is available, borrowed, insurance/DME, or out of pocket.`
- Severity: Review warning.

### W7 — Independent Assistance Level With Moderate or Severe Sit-to-Stand Difficulty

- Trigger when all are true:
  - `assistanceLevel` is `6` or `7`
  - `sitToStandDifficulty = moderate` or `severe`
- Message: `Overall assistance is documented as independent, but sit-to-stand difficulty is moderate or severe. Confirm the functional picture before generating the plan.`
- Severity: Review warning.

---

## Required vs Optional Field Specification

### Required for Generate Plan

The following fields must have valid values before generation:

- `clientName`
- `ageRange`
- `primaryDiagnosis`
- `targetActivity`
- `primaryGoal`
- `assistanceLevel`
- `adlAssistLevels.bed_transfer`
- `adlAssistLevels.toilet_transfer`
- `adlAssistLevels.shower_transfer`
- `keyBarriers` or `otherKeyBarriers`
- `recentFalls`
- `mobilityDevice`
- `indoorMobilityLevel`
- `mobilityEndurance`
- `sitToStandDifficulty`
- `caregiverAvailability`
- `environmentalConstraint`
- `equipmentAccess`
- `bathroomType`
- `spaceConstraints`
- `grabBarsStatus`
- `bathSeating`
- `stepsPresent`
- `numberOfSteps` only when `stepsPresent = yes`
- `railingsPresent` only when `stepsPresent = yes`

### Conditionally Required

- `caregiverPhysicalCapacity`: required when `caregiverAvailability` is not empty, not `unknown`, and not `rarely_available`, or when `caregiverIsPrimarySupport = true`.
- `caregiverConfidence`: required when `caregiverAvailability` is not empty, not `unknown`, and not `rarely_available`, or when `caregiverIsPrimarySupport = true`.
- `otherTargetActivity`: required only if a future `Other` target activity option is introduced and selected.

### Optional in Phase 1

- `clientPhone`
- `clientEmail`
- `clientAddress`
- `caregiverName`
- `caregiverRelationship`
- `caregiverPhone`
- `caregiverTrainingLevel`
- `caregiverPriorities`
- `caregiverIsPrimarySupport`
- `caseType`
- `clinicalFocus` remains populated by default but should not be treated as a clinician-facing required decision point.
- `financialConstraint`, provided `unknown` remains an allowed value.
- All detailed home assessment fields not listed as required or conditionally required.

---

## Field Label Normalization

Implement label changes without changing payload keys.

| Current label | Phase 1 label |
|---|---|
| Current Assistance Level | Assistance Needed for Primary Activity |
| Environmental Constraint | Home Setup Complexity |
| Clinical Focus | Treatment Lens |
| Caregiver Physical Capacity | Caregiver Ability to Physically Assist |
| Indoor Mobility Level | Indoor Mobility Support |
| Equipment Access | Equipment Access / DME Feasibility |
| Financial Constraint | Cost / Coverage Constraint |

---

## Validation UX Requirements

### Blocking Errors

- Display as a concise validation panel above the `Generate Plan` button or at the top of the form.
- Use neutral clinical language with an error accent only where needed.
- Include clickable field labels if implementation cost is low; otherwise list plain messages.
- Do not display internal field names.
- Do not use modal dialogs for blocking errors in Phase 1.

### Review Warnings

Use a two-step generation pattern:

1. First click on `Generate Plan` shows warning messages and changes button label to `Generate Anyway` or adds a secondary `Generate Anyway` action.
2. Second confirmation proceeds without changing data.

Warnings should reset when any involved field changes.

### Copy Requirements

Use a heading such as:

```txt
Review before generating
```

For blocking errors, use:

```txt
Update these items before generating the plan.
```

For warnings, use:

```txt
These details may be accurate, but they are worth confirming before the plan is generated.
```

---

## Lowest-Risk Rollout Sequence

### Step 1 — Remove Visible Clinical Decision Inputs Section

- Delete only the visible header and explanatory text.
- Do not remove decision input state, derived builder calls, payload fields, or persistence fields.
- Verify generated plans still receive `clinicalDecisionModel`.

Risk: Low.

### Step 2 — Add Validation Utilities Without Changing UI Order

- Add pure client-side validation functions for required fields and contradiction checks.
- Wire validation to `Generate Plan` only.
- Do not alter generated payload shape.

Risk: Low.

### Step 3 — Add Blocking Required-Field Validation

- Start with B1, B2, B3, B9, and B10.
- These are the least ambiguous and most likely to prevent incoherent generation.

Risk: Low.

### Step 4 — Add Equipment and Caregiver Blocking Contradictions

- Add B4 through B8.
- Keep messaging clinician-facing and narrow.

Risk: Low to moderate.

### Step 5 — Add Review Warnings

- Add W1 through W7 using two-step confirmation.
- Avoid blocking clinically plausible exceptions.

Risk: Moderate due to possible workflow friction.

### Step 6 — Reorder Intake Sections Around High-Signal Hierarchy

- Move elevated fields above detailed home assessment.
- Move administrative contact fields down.
- Keep payload assembly unchanged.
- Preserve all existing field state.

Risk: Moderate because layout changes can accidentally disrupt state binding.

### Step 7 — Apply Label Normalization

- Update visible labels only.
- Do not rename state variables, payload keys, Supabase columns, or API fields.

Risk: Low.

### Step 8 — Add Progressive Disclosure for Detailed Home Assessment

- Collapse or visually subordinate detailed home sections after the feasibility snapshot.
- Preserve all existing fields and default values.

Risk: Moderate due to possible discoverability concerns.

---

## Acceptance Criteria

Phase 1 is complete when:

1. The visible `Clinical Decision Inputs` section no longer appears in the intake form.
2. Derived clinical decision input generation still occurs and plans still receive the derived clinical decision model.
3. High-signal fields appear before detailed home assessment and administrative detail.
4. Required fields block generation with clinician-facing messages.
5. Blocking contradiction rules B1 through B10 prevent generation.
6. Review warning rules W1 through W7 allow generation only after confirmation.
7. No database schema, API contract, saved-case payload shape, reasoning-engine behavior, or progression architecture changes are introduced.
8. Field label changes are visible-only and do not rename payload keys.

---

## Non-Goals and Explicit Protections

- Do not implement a new intake engine.
- Do not create a new clinical decision model.
- Do not remove home assessment richness.
- Do not make hidden derivation controls visible.
- Do not introduce new patient navigation surfaces.
- Do not change saved-case storage.
- Do not change generated output structure.
- Do not reinterpret assistance-level scale values; lower values continue to represent greater assistance needs.
