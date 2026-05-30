# Longitudinal Data Capture Foundation

## Status

APPROVED

---

# Purpose

This document establishes a required implementation dependency for meaningful longitudinal clinical reasoning.

The platform cannot generate high-value longitudinal decision support unless it first captures longitudinal clinical change.

This document prevents future development effort from focusing on longitudinal displays before longitudinal data capture workflows exist.

---

# Key Architectural Discovery

Workspace V2 successfully exposed:

- continuity architecture
- progression architecture
- operational prioritization architecture

However, implementation of the first longitudinal UX layer revealed a critical limitation:

The system is attempting to explain change without consistently capturing change.

As a result:

- longitudinal displays repeat current-state information
- barriers are restated multiple times
- operational emphasis is rephrased rather than evolved
- clinicians receive little new information

The limiting factor is not display.

The limiting factor is missing longitudinal inputs.

---

# Core Principle

Longitudinal insight requires longitudinal data.

Previous State → Current State → Observed Change

must exist before meaningful longitudinal decision support can exist.

---

# Development Priority

1. Intake UX optimization
2. Follow-Up / Update workflow design
3. Longitudinal data capture validation
4. Longitudinal comparison workflows
5. Longitudinal decision support UX

---

# Success Criterion

The platform should first answer:

'What longitudinal information have we captured?'

Only then can longitudinal decision support become clinically valuable.
