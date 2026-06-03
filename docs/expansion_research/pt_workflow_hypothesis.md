# PT Workflow Hypothesis

Last Updated: 2026-06-03

---

# Purpose

This document translates PT research and intake validation findings into a proposed PT workflow model.

The goal is not to design PT software.

The goal is to understand how PT clinicians appear to reconstruct clinical reality and how the existing platform architecture may support that process.

This document represents a working hypothesis.

---

# Executive Summary

PT clinicians appear to organize patient understanding around two fundamental questions:

## Current State

What is true right now?

## Direction of Change

What is happening over time?

The intake validation findings suggest that PT clinicians can reconstruct Current State with relatively little information.

The largest remaining need is understanding Direction of Change.

This combination appears to drive most PT visit preparation.

---

# Working Hypothesis

PT clinical orientation can be represented as:

Current State

*

Direction of Change

=

Clinical Reality

---

# Current State Layer

Current State represents the patient's present mobility reality.

Inputs include:

* Diagnosis
* Mobility Status
* Transfer Status
* Falls History
* Endurance
* Device Use
* Caregiver Support
* Environmental Constraints

Questions answered:

* How is the patient moving?
* What are the primary risks?
* What support exists?
* What environmental constraints matter?

---

# Direction of Change Layer

Direction of Change represents trajectory.

Examples:

* Improving
* Stable
* Declining

Questions answered:

* Is treatment working?
* Is risk increasing?
* Is progression occurring?
* Is reassessment needed?

Without trajectory, PT clinicians reported reduced confidence in progression interpretation.

---

# Clinical Interpretation Layer

PT clinicians appear to naturally translate Current State and Direction of Change into several recurring themes.

## Safety

Questions:

* Is the patient safe?
* Is fall risk increasing?
* Are transfers safe?

---

## Progression

Questions:

* Is mobility improving?
* Is independence improving?
* Is endurance improving?

---

## Dependency

Questions:

* Is caregiver involvement increasing?
* Is caregiver burden increasing?
* Is support becoming less necessary?

---

## Environmental Feasibility

Questions:

* Does the home support mobility?
* Are barriers limiting progression?

---

## Limiting Factors

Questions:

* What is preventing improvement?
* What is driving treatment priorities?

---

# PT Decision Flow

Based on current findings, PT reasoning appears to follow:

Step 1

Understand Current State

↓

Step 2

Understand Direction of Change

↓

Step 3

Identify Primary Risk

↓

Step 4

Identify Primary Limiter

↓

Step 5

Determine Today's Treatment Priority

↓

Step 6

Determine Whether Current Plan Still Makes Sense

---

# Relationship To Existing Platform

The current platform architecture appears highly compatible with this workflow.

Potential Mapping:

| PT Workflow Need      | Existing Architecture     |
| --------------------- | ------------------------- |
| Current State         | Case Status / Orientation |
| Direction of Change   | Since Last Visit          |
| Primary Risk          | Attention Required        |
| Primary Limiter       | Current Focus             |
| Treatment Priority    | Next Action               |
| Progression Awareness | Clinical Impact Summary   |
| Longitudinal Context  | Historical Snapshots      |

This mapping remains hypothetical and requires future validation.

---

# Key Insight

The intake validation exercise suggests that PT clinicians do not primarily seek more information.

They seek:

Better interpretation of limited information.

This finding aligns closely with prior OT findings.

---

# Emerging Platform Hypothesis

The platform may not be fundamentally solving:

Documentation

or

Information Retrieval

Instead it may be solving:

Clinical Reality Reconstruction

by helping clinicians answer:

* What is true now?
* What changed?
* What matters?
* What should happen next?

with minimal cognitive effort.

---

# Risks

The greatest risk is assuming PT requires more information than it actually does.

The intake validation findings suggest that excessive information may increase friction without meaningfully improving orientation.

The platform should continue to prioritize:

* signal over completeness
* orientation over documentation
* interpretation over storage

---

# Current Conclusion

PT workflow appears compatible with the existing continuity-oriented architecture.

Current evidence suggests that PT clinicians derive substantial value from:

Current State

*

Direction of Change

rather than from comprehensive clinical documentation.

Future PT prototype work should focus on improving interpretation and progression awareness rather than expanding intake complexity.
