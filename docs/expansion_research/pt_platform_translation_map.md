# PT Platform Translation Map

Last Updated: 2026-06-03

---

# Purpose

This document maps PT reasoning categories to the existing platform architecture.

The goal is not to redesign the platform.

The goal is to determine how PT clinical reasoning can be represented using the existing continuity-oriented workflow architecture.

This document serves as the bridge between PT research and PT prototype generation.

---

# Executive Summary

PT research suggests that the existing platform architecture is largely reusable.

The primary translation challenge is not workflow structure.

The primary translation challenge is ensuring that PT reasoning categories drive platform outputs.

Current evidence suggests that PT categories can be translated into the existing platform with minimal architectural change.

---

# Translation Overview

| PT Reasoning Category         | Platform Purpose            | Primary Inputs                   | Platform Areas Influenced     |
| ----------------------------- | --------------------------- | -------------------------------- | ----------------------------- |
| Functional Mobility Reality   | Current patient state       | Mobility, Transfers, Device      | Orientation, Current State    |
| Safety Risk                   | Immediate concern detection | Falls, Transfers, Environment    | Attention Required            |
| Progression Trajectory        | Direction of change         | Mobility Change                  | Since Last Visit, Progression |
| Limiting Factors              | Barrier identification      | Endurance, Mobility, Environment | Current Focus                 |
| Environmental Feasibility     | Real-world execution        | Environment                      | Current Focus, Attention      |
| Support Capacity              | Support adequacy            | Caregiver Availability           | Current Focus, Attention      |
| Activity Tolerance            | Sustainability of mobility  | Endurance                        | Current Focus, Impact Summary |
| Diagnosis-Specific Complexity | Clinical context            | Diagnosis                        | Interpretation Layer          |

---

# PT Taxonomy → Platform Mapping

## Functional Mobility Reality

### Purpose

Represents current mobility capacity.

### Inputs

* Mobility Level
* Transfer Status
* Assistive Device
* Diagnosis

### Existing Platform Mapping

Current State

Orientation Layer

Patient Summary

### Influenced Outputs

* Current Focus
* Clinical Impact Summary
* Case Status

### Example Interpretation

Patient requires contact guard assist for household mobility and minimal assistance for transfers.

---

## Safety Risk

### Purpose

Represents immediate safety concerns.

### Inputs

* Falls History
* Transfer Status
* Mobility Level
* Environmental Barriers

### Existing Platform Mapping

Attention Layer

Risk Interpretation

### Influenced Outputs

* Attention Required
* Clinical Impact Summary
* Current Focus

### Example Interpretation

Recent falls combined with transfer instability increase immediate safety concerns.

---

## Progression Trajectory

### Purpose

Represents direction of change.

### Inputs

* Mobility Change Since Last Visit

### Existing Platform Mapping

Since Last Visit

Progression Layer

Continuity Layer

### Influenced Outputs

* Clinical Impact Summary
* Progression Check
* Case Status

### Example Interpretation

Mobility decline suggests increased intervention focus and reassessment needs.

---

## Limiting Factors

### Purpose

Represents primary barriers to improvement.

### Inputs

* Endurance
* Mobility Level
* Falls
* Environmental Barriers

### Existing Platform Mapping

Operational Prioritization

Barrier Interpretation

### Influenced Outputs

* Current Focus
* Next Action
* Clinical Impact Summary

### Example Interpretation

Reduced endurance is preventing further mobility progression.

---

## Environmental Feasibility

### Purpose

Represents ability to perform mobility within the actual home environment.

### Inputs

* Environmental Mobility Barriers

### Existing Platform Mapping

Environment Context

Feasibility Layer

### Influenced Outputs

* Current Focus
* Attention Required
* Next Action

### Example Interpretation

Entry stairs remain a major obstacle to independent mobility.

---

## Support Capacity

### Purpose

Represents adequacy of available assistance.

### Inputs

* Caregiver Availability

### Existing Platform Mapping

Caregiver Context

Support Interpretation

### Influenced Outputs

* Current Focus
* Attention Required
* Next Action

### Example Interpretation

Limited caregiver availability increases reliance on independent mobility strategies.

---

## Activity Tolerance

### Purpose

Represents ability to sustain mobility.

### Inputs

* Endurance
* Activity Tolerance

### Existing Platform Mapping

Operational Prioritization

Functional Capacity Interpretation

### Influenced Outputs

* Current Focus
* Clinical Impact Summary
* Next Action

### Example Interpretation

Fatigue continues to limit safe functional mobility.

---

## Diagnosis-Specific Complexity

### Purpose

Provides clinical context for interpretation.

### Inputs

* Diagnosis

### Existing Platform Mapping

Clinical Context Layer

Interpretation Layer

### Influenced Outputs

* Clinical Impact Summary
* Next Action
* Progression Interpretation

### Example Interpretation

Parkinson's disease introduces progressive mobility considerations that influence treatment planning.

---

# PT Output Translation Model

The PT taxonomy appears to naturally translate into the following platform outputs.

## Current Focus

Driven Primarily By:

* Limiting Factors
* Functional Mobility Reality
* Activity Tolerance
* Environmental Feasibility

Question Answered:

> What should drive treatment today?

---

## Attention Required

Driven Primarily By:

* Safety Risk
* Environmental Feasibility
* Support Capacity

Question Answered:

> What requires immediate awareness?

---

## Clinical Impact Summary

Driven Primarily By:

* Progression Trajectory
* Safety Risk
* Functional Mobility Reality
* Activity Tolerance

Question Answered:

> What changed and why does it matter?

---

## Next Action

Driven Primarily By:

* Limiting Factors
* Progression Trajectory
* Support Capacity
* Environmental Feasibility

Question Answered:

> What should happen next?

---

## Progression Check

Driven Primarily By:

* Progression Trajectory
* Functional Mobility Reality

Question Answered:

> Is the patient improving, stable, or declining?

---

# Architectural Implications

The translation exercise suggests that:

* Command Center survives unchanged.
* Reference Workspace survives unchanged.
* Continuity architecture survives unchanged.
* Historical Snapshots survive unchanged.
* Workflow hierarchy survives unchanged.

The primary changes occur within:

* intake semantics
* reasoning semantics
* prioritization semantics
* output language

rather than workflow structure.

---

# Conclusion

Current evidence suggests that PT can be represented as a discipline-specific reasoning layer operating on top of the existing platform architecture.

The platform appears capable of supporting PT-oriented outputs without requiring substantial architectural redesign.

The next phase should focus on generating and validating PT-specific outputs rather than conducting additional PT workflow research.
