# Active Roadmap

## Purpose

This roadmap defines dependency-driven sequencing. It is not a sprint backlog and does not restate historical implementation detail.

Completed implementation is inherited as foundation for future continuity-platform validation.

| # | Boundary | Purpose | Dependency | Expected outcome | Stopping condition | Status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Documentation and Governance Reboot | Replace fragmented handoff-driven documentation with a small active authority stack, archive, operating model, and migration report. | Approved reboot instruction. | Git becomes the durable source of truth for governance and agent coordination. | Stop after documentation-only PR is ready for review. | complete |
| 2 | Continuity Foundation Definition and Repository Classification | Classify existing capabilities into candidate shared foundation, Clinical Continuity, OT configuration, and delivery infrastructure. | Boundary 1. | Justified layer assignment for major engine components and minimum candidate shared foundation. | Stop before implementation or refactoring. | active |
| 3 | Clinical and Care Experience Models | Define distinct Clinician and Caregiver experience flows for validation. | Boundary 2 classification baseline. | End-to-end experience models with language, authority, actions, and divergence points. | Stop before code implementation. | next |
| 4 | Shared-State and Authority Validation | Test shared-state hypotheses and authority separation across Clinical and Care scenarios. | Boundaries 2 and 3. | Evidence about what can be shared, what must remain application-specific, and unresolved ownership conflicts. | Stop before technical extraction. | deferred |
| 5 | Clinical Continuity Real-Clinician Validation | Replace simulation-only confidence with observed clinician workflow evidence. | Stable Clinical Continuity scope and validation model. | Findings about usability, comprehension, correction, workflow fit, and reconstruction burden. | Stop before pilot or production claims. | deferred |
| 6 | Correction and Provenance Hardening | Strengthen verification, correction, rejection, and evidence lineage workflows. | Real validation findings and architecture boundary. | Safer correction/provenance model. | Stop before schema/API changes unless explicitly approved. | deferred |
| 7 | Thin Care Continuity Demonstrator | Build only the minimum demonstrator needed to test Care Continuity assumptions. | Shared-state and authority validation. | Pressure test of candidate shared foundation in a non-clinical care context. | Stop before broad Care Continuity implementation. | deferred |
| 8 | Technical Extraction of Proven Shared Components | Extract shared components only after evidence proves reuse. | Validation from Clinical and Care contexts. | Shared technical foundation where justified. | Stop before generic platform/plugin expansion. | deferred |
| 9 | Persona and Discipline Expansion Only After Evidence | Consider additional personas or disciplines only after validation supports expansion. | Proven foundation and evidence. | Evidence-based expansion decisions. | Stop before unsupported PT, SLP, family, guardian, or child documentation. | deferred |
