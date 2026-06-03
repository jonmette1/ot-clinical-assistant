# PT Translation Feasibility Assessment

Last Updated: 2026-06-03

---

# Purpose

This document evaluates the effort required to translate the existing OT Clinical Assistant into a PT-facing prototype suitable for advisor review.

This document does not:

* recommend building PT
* design PT screens
* redesign the OT architecture
* propose implementation tickets
* propose code changes

The purpose is to estimate the scope required to create a PT-facing experience that feels credible enough for PT advisors to meaningfully evaluate.

---

# Executive Summary

Based on the current platform architecture and PT workflow research, PT appears substantially closer to the existing OT implementation than originally assumed.

The primary architecture appears reusable.

Most required work appears concentrated in:

* intake
* clinical terminology
* clinical reasoning semantics
* progression interpretation
* next-action generation

rather than:

* workflow architecture
* continuity architecture
* Command Center architecture
* Reference Workspace architecture

Estimated reuse:

| Layer                      | Reuse Estimate |
| -------------------------- | -------------: |
| Workflow Architecture      |            90% |
| Continuity Architecture    |            95% |
| Command Center             |         85-95% |
| Reference Workspace        |         80-90% |
| Progression Framework      |         70-80% |
| Operational Prioritization |         70-80% |
| Clinical Domain Model      |         30-50% |
| Intake Model               |         20-40% |

Estimated advisor-prototype reuse:

**75-85%**

---

# System Evaluation

---

## Patient Entry

Current OT Role

Provides case orientation before opening a patient.

PT Equivalent

Identical workflow.

Required Changes

* PT terminology
* PT quick-preview content

Effort

Low

Risk

Low

Needed For Prototype

Yes

---

## Quick Preview

Current OT Role

Provides:

* Current Focus
* Attention Required
* Since Last Visit
* Next Action

PT Equivalent

Identical workflow.

Required Changes

* mobility language
* gait language
* balance language
* device language

Effort

Low

Risk

Low

Needed For Prototype

Yes

---

## Intake Structure

Current OT Role

Captures:

* ADLs
* caregiver feasibility
* environmental barriers
* transfer function

PT Equivalent

Must capture:

* gait
* balance
* transfers
* stairs
* endurance
* assistive device
* fall history
* home access

Required Changes

Substantial.

Effort

High

Risk

Medium

Needed For Prototype

Yes

---

## Clinical Reasoning Model

Current OT Role

Determines:

* dominant barrier
* treatment focus
* operational priorities

PT Equivalent

Would prioritize:

* gait
* balance
* endurance
* device use
* mobility safety
* stairs
* fall risk

Required Changes

PT-specific prioritization semantics.

Effort

Medium

Risk

Medium

Needed For Prototype

Partially

Prototype can initially use simplified logic.

---

## Operational Prioritization

Current OT Role

Determines:

* what should drive treatment

PT Equivalent

Same concept.

Different categories.

Current OT Categories

* ADL
* caregiver
* environment
* transfer

Likely PT Categories

* gait
* balance
* endurance
* transfer
* device
* stairs

Effort

Medium

Risk

Medium

Needed For Prototype

Yes

---

## Progression Model

Current OT Role

Interprets change over time.

PT Equivalent

Interprets:

* mobility improvement
* assist-level reduction
* distance improvement
* device progression
* fall-risk reduction

Effort

Medium

Risk

Medium

Needed For Prototype

Partially

Can initially be simplified.

---

## Progression Check

Current OT Role

Captures:

* limiting factor
* milestone
* focus change

PT Equivalent

Captures:

* mobility change
* balance change
* assist change
* device change
* endurance change

Effort

Low-Medium

Risk

Low

Needed For Prototype

Yes

---

## Command Center

Current OT Role

Primary clinician workflow surface.

PT Equivalent

Identical workflow surface.

Required Changes

Content only.

Effort

Low

Risk

Very Low

Needed For Prototype

Absolutely

---

## Case Status

Current OT Role

Improving / Stable / Declining

PT Equivalent

Identical concept.

Effort

Very Low

Risk

Very Low

Needed For Prototype

Yes

---

## Since Last Visit

Current OT Role

Explains meaningful change.

PT Equivalent

Explains:

* falls
* distance changes
* assist changes
* device changes
* stair changes

Effort

Low

Risk

Very Low

Needed For Prototype

Yes

---

## Attention Required

Current OT Role

Identifies highest-priority concern.

PT Equivalent

Could include:

* fall risk
* unsafe mobility
* device mismatch
* caregiver limitations
* home access issues

Effort

Low-Medium

Risk

Low

Needed For Prototype

Yes

---

## Current Focus / Treatment Focus

Current OT Role

Determines current treatment emphasis.

PT Equivalent

Examples:

* gait safety
* transfer safety
* endurance progression
* stair access
* fall prevention

Effort

Medium

Risk

Low

Needed For Prototype

Yes

---

## Clinical Impact Summary

Current OT Role

Explains why change matters.

PT Equivalent

Identical structure.

Effort

Low

Risk

Very Low

Needed For Prototype

Yes

---

## Next Action

Current OT Role

Explains what should happen next.

PT Equivalent

Examples:

* reassess gait
* progress walking program
* advance stair training
* evaluate device appropriateness

Effort

Medium

Risk

Medium

Needed For Prototype

Yes

---

## Reference Workspace

Current OT Role

Provides deeper supporting context.

PT Equivalent

Identical workflow.

Effort

Low

Risk

Very Low

Needed For Prototype

Yes

---

## Historical Snapshots

Current OT Role

Historical continuity.

PT Equivalent

Identical.

Effort

None

Risk

None

Needed For Prototype

Yes

---

## Continuity Model

Current OT Role

Maintains longitudinal state.

PT Equivalent

Identical architecture.

Effort

None

Risk

None

Needed For Prototype

Yes

---

## Caregiver Context

Current OT Role

ADL feasibility support.

PT Equivalent

Mobility support and guarding.

Effort

Low

Risk

Low

Needed For Prototype

Yes

---

## Environmental Context

Current OT Role

Task environment.

PT Equivalent

Mobility environment.

Effort

Low

Risk

Low

Needed For Prototype

Yes

---

# Smallest Credible PT Prototype

A PT advisor prototype does not need production-grade PT functionality.

It needs enough PT semantics that a PT can evaluate the workflow.

Required:

### PT Intake

* diagnosis
* gait status
* transfer status
* balance
* endurance
* fall history
* device
* stairs
* caregiver support
* home access barriers

### PT Case Examples

At minimum:

* post-op TKA
* recurrent falls
* stroke with hemiparesis
* COPD/endurance limitation
* Parkinson's mobility decline

### PT Command Center

PT terminology only.

### PT Progression Signals

* distance improved
* assist reduced
* device changed
* balance improved
* fall occurred

### PT Next Action Examples

* reassess mobility
* progress gait
* progress stairs
* reassess device
* reassess fall risk

---

# Work Not Required For Prototype

Do NOT build:

* PT documentation system
* PT billing workflows
* PT compliance workflows
* EMR integrations
* outcome measure engine
* PT-specific database architecture
* SLP support
* multi-discipline support
* payer workflows

These add complexity without improving advisor feedback quality.

---

# Estimated Sprint Scope

## Tier 1 — PT Demo Skin

Purpose

Determine whether PTs understand the workflow.

Scope

* terminology changes
* PT example cases
* PT Command Center content

Reuse

90%+

Duration

1-2 weeks

Answers

Can PTs understand the product?

---

## Tier 2 — Advisor Review Prototype

Purpose

Determine whether PTs find value.

Scope

* PT intake
* PT progression concepts
* PT operational prioritization
* PT next-action semantics

Reuse

75-85%

Duration

2-4 weeks

Answers

Would PTs use this?

---

## Tier 3 — Production PT Module

Purpose

Commercial PT product.

Scope

* validated PT reasoning
* PT progression framework
* PT outcome measures
* PT testing
* PT governance

Reuse

60-75%

Duration

Several months

Answers

Can PT become a real product line?

---

# Decision Gate

Current recommendation:

Proceed to a PT advisor-review prototype evaluation path.

Do not proceed to PT implementation.

Do not proceed to SLP research yet.

The evidence currently suggests that:

* workflow architecture is highly reusable
* continuity architecture is highly reusable
* Command Center architecture is highly reusable

The remaining uncertainty is whether PT-specific clinical semantics can be translated into the platform without requiring substantial redesign.

The next objective should be determining whether a 75-85% reused PT advisor prototype can be created efficiently enough to justify advisor testing.
