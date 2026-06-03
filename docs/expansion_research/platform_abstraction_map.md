# Platform Abstraction Map

Last Updated: 2026-06-03

---

# Purpose

This document identifies which portions of the OT Clinical Assistant are:

* Platform-level architecture
* OT-specific implementation
* Potentially portable to other rehabilitation disciplines
* Likely to require discipline-specific adaptation

The goal is not to design PT, SLP, or future disciplines.

The goal is to understand which systems represent the reusable foundation of the product and which systems represent OT-specific clinical semantics.

This document is exploratory and should not be interpreted as roadmap commitment, implementation guidance, or approval for future expansion.

---

# Core Product Thesis

The current OT Clinical Assistant is increasingly oriented around the following questions:

* What changed?
* What matters right now?
* What requires attention?
* What should happen next?

The platform is no longer primarily organized around treatment plan generation.

It is organized around continuity, orientation, operational prioritization, and longitudinal workflow support.

---

# Architectural Layers

## Layer 1 — Clinical Continuity Platform

Purpose:

Provide longitudinal clinical orientation regardless of discipline.

Characteristics:

* Current state awareness
* Historical state awareness
* Change detection
* Attention prioritization
* Next-action guidance
* Continuity support
* Reassessment support

Portability:

Very High

Expected PT Reuse:

High

Expected SLP Reuse:

High

---

## Layer 2 — Clinical Workflow Engine

Purpose:

Translate structured patient information into actionable workflow guidance.

Characteristics:

* Deterministic reasoning
* Operational prioritization
* Progression interpretation
* Clinical impact interpretation
* Attention state generation
* Next-action derivation

Portability:

High

Expected PT Reuse:

Moderate to High

Expected SLP Reuse:

Moderate to High

Requires discipline-specific clinical semantics.

---

## Layer 3 — Clinical Domain Model

Purpose:

Represent discipline-specific clinical concepts.

Examples:

OT:

* ADLs
* caregiver feasibility
* environmental modification
* transfer safety
* home participation

PT:

* gait
* balance
* endurance
* stairs
* assistive devices
* mobility safety

SLP:

* communication
* cognition
* swallowing
* caregiver carryover

Portability:

Low

Expected PT Reuse:

Low

Expected SLP Reuse:

Low

---

# System Inventory

## Patient Entry

Purpose:

Provide clinician orientation before opening a case.

Current OT Dependency:

Low

Reusable Elements:

* patient list
* quick preview
* case selection
* workflow entry point

Portability:

Very High

PT Adaptation:

Terminology and preview content only.

SLP Adaptation:

Terminology and preview content only.

---

## Quick Preview

Purpose:

Rapid pre-visit orientation.

Current OT Dependency:

Low

Reusable Elements:

* current focus
* attention required
* next action
* recent change summary

Portability:

Very High

PT Adaptation:

Mobility-focused content.

SLP Adaptation:

Communication/cognition/swallowing-focused content.

---

## Command Center

Purpose:

Primary clinician workflow surface.

Answers:

* What matters?
* What changed?
* What requires attention?
* What should happen next?

Current OT Dependency:

Low

Reusable Elements:

* Current Focus
* Case Status
* Since Last Visit
* Last Visit
* Attention Required
* Next Action
* Operational Pressures
* Progression Check

Portability:

Very High

PT Adaptation:

Clinical content only.

SLP Adaptation:

Clinical content only.

---

## Clinical Impact Summary

Purpose:

Explain why recent changes matter.

Current OT Dependency:

Low

Reusable Elements:

* change explanation
* clinical significance
* treatment implications

Portability:

Very High

PT Adaptation:

Mobility progression language.

SLP Adaptation:

Communication/cognition progression language.

---

## Case Status

Purpose:

Describe overall trajectory.

Examples:

* Improving
* Stable
* Declining

Current OT Dependency:

Very Low

Portability:

Very High

PT Adaptation:

Status drivers change.

SLP Adaptation:

Status drivers change.

---

## Attention Required

Purpose:

Identify immediate clinical concern.

Current OT Dependency:

Low

Portability:

High

PT Adaptation:

Falls, mobility safety, device issues, stair access.

SLP Adaptation:

Swallowing safety, communication breakdown, cognition risk.

---

## Next Action

Purpose:

Identify highest-priority clinician action.

Current OT Dependency:

Moderate

Reusable Elements:

* action prioritization framework
* progression-aware recommendations

Portability:

High

Requires discipline-specific action libraries.

---

## Operational Prioritization

Purpose:

Determine what should drive treatment focus.

Current OT Dependency:

Moderate

Reusable Elements:

* prioritization framework
* competing-pressure evaluation
* treatment focus selection

Portability:

High

Requires discipline-specific prioritization categories.

---

## Progression Check

Purpose:

Capture meaningful longitudinal change.

Current OT Dependency:

Moderate

Reusable Elements:

* milestone tracking
* limiting factors
* focus-change assessment

Portability:

High

Requires discipline-specific progression indicators.

---

## Progression Model

Purpose:

Interpret change over time.

Current OT Dependency:

Moderate

Reusable Elements:

* progression state
* readiness concepts
* regression risk
* milestone achievement

Portability:

Moderate to High

Requires discipline-specific progression definitions.

---

## Continuity Model

Purpose:

Maintain longitudinal clinical memory.

Current OT Dependency:

Very Low

Reusable Elements:

* current state
* historical state
* continuity interpretation
* event awareness

Portability:

Very High

Expected PT Reuse:

Near complete.

Expected SLP Reuse:

Near complete.

---

## Historical Snapshots

Purpose:

Preserve immutable historical context.

Current OT Dependency:

None

Reusable Elements:

Entire system.

Portability:

Very High

Expected PT Reuse:

Near complete.

Expected SLP Reuse:

Near complete.

---

## Reference Workspace

Purpose:

Provide deeper supporting context.

Current OT Dependency:

Low

Reusable Elements:

* supporting summaries
* structured details
* historical review
* generated content
* contextual information

Portability:

Very High

Requires discipline-specific content.

---

## Caregiver Context

Purpose:

Represent caregiver impact on clinical feasibility.

Current OT Dependency:

Moderate

Portability:

High

PT Adaptation:

Mobility assistance and guarding.

SLP Adaptation:

Communication carryover and safety support.

---

## Environmental Context

Purpose:

Represent real-world constraints.

Current OT Dependency:

Moderate

Portability:

High

PT Adaptation:

Stairs, routes, surfaces, access barriers.

SLP Adaptation:

Communication environment and caregiver context.

---

## Intake Structure

Purpose:

Capture clinical inputs.

Current OT Dependency:

High

Portability:

Low

Expected PT Reuse:

Limited.

Expected SLP Reuse:

Limited.

Likely discipline-specific.

---

## Clinical Reasoning Inputs

Purpose:

Provide structured reasoning inputs.

Current OT Dependency:

High

Portability:

Moderate

Reasoning framework may survive.

Clinical variables likely change.

---

# Portability Summary

| System                     | Portability   |
| -------------------------- | ------------- |
| Patient Entry              | Very High     |
| Quick Preview              | Very High     |
| Command Center             | Very High     |
| Case Status                | Very High     |
| Clinical Impact Summary    | Very High     |
| Historical Snapshots       | Very High     |
| Continuity Model           | Very High     |
| Reference Workspace        | High          |
| Operational Prioritization | High          |
| Attention Required         | High          |
| Next Action                | High          |
| Progression Check          | High          |
| Progression Model          | Moderate-High |
| Caregiver Context          | High          |
| Environmental Context      | High          |
| Clinical Reasoning Inputs  | Moderate      |
| Intake Structure           | Low           |

---

# Estimated Platform Reuse

For PT Advisor Prototype:

75–85%

For Production PT Module:

60–75%

For SLP Advisor Prototype:

65–80%

For Production SLP Module:

50–70%

---

# Primary Architectural Risk

The greatest expansion risk is not Command Center, continuity, progression, or workflow structure.

The greatest risk is embedding OT-specific clinical semantics too deeply into:

* intake models
* reasoning inputs
* progression definitions
* operational prioritization categories
* next-action libraries

The workflow architecture appears substantially more portable than the clinical domain model.

---

# Current Conclusion

The OT Clinical Assistant should currently be viewed as:

A clinical continuity and operational orientation platform implemented through an OT clinical model.

Current evidence suggests:

* workflow architecture is highly portable
* continuity architecture is highly portable
* orientation architecture is highly portable
* OT-specific dependencies are concentrated in intake, clinical reasoning variables, progression semantics, and treatment vocabulary

Further evaluation should determine whether PT can be supported primarily through domain-model substitution rather than architectural redesign.
