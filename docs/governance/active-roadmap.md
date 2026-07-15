# Active Roadmap

## Purpose

This roadmap defines dependency-driven sequencing. It is not a sprint backlog and does not restate historical implementation detail.

Completed implementation is inherited as foundation for future continuity-platform validation.

| # | Boundary | Purpose | Dependency | Expected outcome | Stopping condition | Status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Documentation and Governance Reboot | Replace fragmented handoff-driven documentation with a small active authority stack, archive, operating model, and migration report. | Approved reboot instruction. | Git becomes the durable source of truth for governance and agent coordination. | Stop after documentation-only PR is ready for review. | complete |
| 2 | Continuity Platform Foundation Definition | Integrate repository classification, Clinician and Caregiver experience definition, and Shared Continuity Foundation validation into one active foundation boundary. | Boundary 1. | Every major capability has a justified ownership layer; clinician and caregiver experience models exist; the candidate Shared Continuity Foundation has been pressure-tested; ownership conflicts and shared versus application-specific concepts are documented. | Stop before implementation, refactoring, or technical extraction. | active |
| 3 | Clinical Continuity Real-Clinician Validation | Replace simulation-only confidence with observed clinician workflow evidence after foundation ownership and experience assumptions are clarified. | Boundary 2. | Findings about usability, comprehension, correction, workflow fit, and reconstruction burden. | Stop before pilot or production claims. | next |
| 4 | Correction and Provenance Hardening | Strengthen verification, correction, rejection, and evidence lineage workflows. | Foundation classification and real validation findings. | Safer correction/provenance model grounded in validated authority boundaries. | Stop before schema/API changes unless explicitly approved. | deferred |
| 5 | Thin Care Continuity Demonstrator | Build only the minimum demonstrator needed to test Care Continuity assumptions after foundation definition and validation boundaries are approved. | Boundary 2 and any required validation findings. | Pressure test of candidate shared foundation in a non-clinical care context. | Stop before broad Care Continuity implementation. | deferred |
| 6 | Technical Extraction of Proven Shared Components | Extract shared components only after evidence proves reuse across relevant applications. | Validated Clinical and Care ownership boundaries. | Shared technical foundation where justified. | Stop before generic platform/plugin expansion. | deferred |
| 7 | Persona and Discipline Expansion Only After Evidence | Consider additional personas or disciplines only after validation supports expansion. | Proven foundation and evidence. | Evidence-based expansion decisions. | Stop before unsupported PT, SLP, family, guardian, or child documentation. | deferred |
