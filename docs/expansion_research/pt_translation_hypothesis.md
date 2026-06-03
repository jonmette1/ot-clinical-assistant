# PT Translation Hypothesis

Last Updated: 2026-06-03

---

# Purpose

This document consolidates findings from:

* platform_abstraction_map.md
* pt_workflow_research_for_platform_translation.md
* pt_translation_feasibility_assessment.md

The purpose is to determine whether the existing OT Clinical Assistant architecture can support a PT-facing advisor prototype without substantial architectural redesign.

This document is not:

* a PT product specification
* an implementation plan
* a roadmap commitment
* a PT architecture design

It is a working hypothesis intended to guide future evaluation.

---

# Executive Conclusion

Current evidence suggests that the OT Clinical Assistant is not fundamentally an OT-specific software architecture.

The platform appears to be:

> A clinical continuity and operational orientation platform currently implemented through an OT clinical model.

PT appears substantially compatible with:

* the workflow architecture
* the continuity architecture
* the Command Center model
* the Reference Workspace model
* the progression workflow pattern
* the operational prioritization framework

The primary translation effort appears concentrated in:

* clinical semantics
* intake structure
* progression definitions
* outcome measures
* treatment vocabulary

rather than core architecture.

---

# Working Hypothesis

## Hypothesis

A PT advisor-facing prototype can be created using 75–85% of the existing OT platform while replacing only the PT-specific clinical layer.

If true:

The platform should be considered:

> A rehabilitation continuity platform with discipline-specific implementations.

If false:

The platform should continue to be viewed as an OT-specific application.

---

# What Survives Unchanged

The following systems appear highly portable.

---

## Patient Entry

Purpose:

Patient orientation before visit.

PT Need:

Identical.

Expected Changes:

None beyond content.

Portability:

Very High

---

## Quick Preview

Purpose:

Rapid case orientation.

PT Need:

Identical.

Expected Changes:

PT-specific terminology only.

Portability:

Very High

---

## Command Center

Purpose:

Answer:

* What matters?
* What changed?
* What requires attention?
* What should happen next?

PT Need:

Identical.

Expected Changes:

Clinical language only.

Portability:

Very High

---

## Case Status

Purpose:

Trajectory awareness.

Examples:

* Improving
* Stable
* Declining

PT Need:

Identical.

Expected Changes:

Status drivers only.

Portability:

Very High

---

## Since Last Visit

Purpose:

Change detection.

PT Need:

Identical.

Expected Changes:

Mobility-oriented change descriptions.

Portability:

Very High

---

## Clinical Impact Summary

Purpose:

Explain why change matters.

PT Need:

Identical.

Expected Changes:

Mobility-focused interpretation.

Portability:

Very High

---

## Historical Snapshots

Purpose:

Longitudinal reference.

PT Need:

Identical.

Expected Changes:

None.

Portability:

Very High

---

## Reference Workspace

Purpose:

Supporting context and history.

PT Need:

Identical.

Expected Changes:

PT-specific content.

Portability:

Very High

---

## Continuity Architecture

Purpose:

Maintain current operational truth and historical awareness.

PT Need:

Identical.

Expected Changes:

None.

Portability:

Very High

---

# What Requires Translation

These systems appear reusable but require PT-specific semantics.

---

## Operational Prioritization

Current OT Examples

* ADL barriers
* caregiver feasibility
* environmental barriers
* transfer safety

Potential PT Examples

* gait safety
* balance limitations
* endurance restrictions
* device concerns
* stair access

Expected Effort:

Moderate

---

## Attention Required

Current OT Examples

* caregiver barriers
* unsafe transfers
* environmental hazards

Potential PT Examples

* fall risk
* unsafe gait
* unsafe stairs
* device mismatch

Expected Effort:

Moderate

---

## Current Focus

Current OT Examples

* bathing
* dressing
* transfers
* caregiver support

Potential PT Examples

* gait progression
* transfer safety
* balance training
* stair access

Expected Effort:

Moderate

---

## Next Action

Current OT Examples

* reassess ADL function
* caregiver training
* transfer progression

Potential PT Examples

* reassess gait
* progress walking program
* reassess fall risk
* progress stair training

Expected Effort:

Moderate

---

## Progression Check

Current OT Examples

* functional participation
* caregiver feasibility
* transfer status

Potential PT Examples

* distance walked
* assist level
* device progression
* stair performance

Expected Effort:

Moderate

---

## Progression Model

Current OT Examples

* participation
* dependency reduction
* environmental feasibility

Potential PT Examples

* mobility progression
* gait progression
* endurance progression
* fall-risk reduction

Expected Effort:

Moderate

---

## Caregiver Context

Current OT Interpretation

ADL support and feasibility.

Potential PT Interpretation

Guarding, transfer support, exercise carryover.

Expected Effort:

Low to Moderate

---

## Environmental Context

Current OT Interpretation

Task environment.

Potential PT Interpretation

Mobility environment.

Expected Effort:

Low to Moderate

---

# What Requires Replacement

The following systems appear strongly OT-specific.

---

## Intake Structure

Current OT Focus

* ADLs
* caregiver support
* environmental modification
* task participation

PT Needs

* gait
* balance
* endurance
* stairs
* device use
* fall history
* mobility capacity

Expected Effort:

High

---

## Clinical Domain Model

Current OT Focus

* ADL participation
* environmental adaptation
* caregiver feasibility

PT Needs

* mobility performance
* balance
* gait
* endurance
* device progression

Expected Effort:

High

---

## Outcome Measure Layer

Current OT Focus

Minimal outcome-measure dependency.

PT Needs

* gait speed
* TUG
* 5xSTS
* stair performance
* distance walked
* balance measures

Expected Effort:

Moderate to High

---

# Estimated Reuse

## Advisor Prototype

Estimated Reuse:

75–85%

Rationale:

Most workflow architecture survives.

Most continuity architecture survives.

Most UI architecture survives.

Clinical semantics change.

---

## Production PT Product

Estimated Reuse:

60–75%

Rationale:

Additional PT-specific reasoning, measures, validation, and governance required.

---

# Smallest Credible PT Prototype

The smallest PT prototype capable of generating meaningful advisor feedback should include:

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
* home access

### PT Cases

* Total Knee Arthroplasty
* Recurrent Falls
* Stroke with Hemiparesis
* COPD Endurance Limitation
* Parkinson's Disease

### PT Command Center

PT terminology only.

### PT Change Detection

* falls
* assist changes
* distance changes
* device changes
* stair changes

### PT Next Actions

* reassess gait
* progress mobility
* reassess fall risk
* progress stairs
* reassess device

---

# What Does Not Need To Be Built

The following should remain out of scope:

* PT documentation workflow
* PT billing workflow
* PT compliance automation
* PT-specific EMR integration
* production outcome-measure engine
* production multi-discipline architecture
* SLP implementation
* payer-specific workflows

These systems do not materially improve advisor feedback quality.

---

# Key Risk

The primary risk is not workflow architecture.

The primary risk is assuming that PT clinical reasoning can be represented through OT categories.

The translation effort must replace PT clinical semantics rather than forcing PT concepts into OT terminology.

---

# Decision

Current evidence supports the following conclusion:

The OT Clinical Assistant architecture appears sufficiently portable to justify exploration of a PT advisor-review prototype.

Current evidence does not justify:

* building a PT product
* expanding roadmap scope
* redesigning architecture

The next meaningful question is:

> Can a PT-facing prototype be created using existing architecture and PT-specific semantics such that PT advisors evaluate the workflow rather than dismissing it as OT software?

If that question can be answered affirmatively, the platform should increasingly be viewed as a rehabilitation continuity platform rather than an OT-only application.
