# Validation Findings Summary

Last updated: 2026-06-11

## Evidence Boundary

Current findings are based primarily on implementation review, persona-based simulation, comparative workflow simulation, synthetic cases, an 80-patient caseload simulation, and internal UX review.

They support product direction and identify high-value hypotheses. They do **not** establish:

- real-clinician usability or preference;
- clinical accuracy;
- clinical outcomes;
- measured time savings;
- adoption or willingness to pay;
- pilot readiness; or
- production safety.

## Strongest Product Insight

Clinicians do not primarily struggle to understand evidence. They struggle to understand:

- constraints;
- progression;
- what remains limiting;
- what should be validated today; and
- how to translate the same maintained understanding for different people.

Evidence matters, but its highest value is supporting a concise clinical explanation rather than increasing information volume.

## Trust Finding

The strongest simulated trust pattern was:

```text
Improvement
→ unresolved constraint
→ recommendation remains appropriate
```

Progression Constraint was especially valuable because it explained why observed improvement did not automatically invalidate the current recommendation. Supporting Evidence and Why This Changed strengthened verification, but the constraint narrative made the recommendation evolution clinically coherent.

**Status:** strongly supported in simulation; not yet validated with real clinicians.

## Workflow Reuse Finding

Maintained Understanding plus Progress Evidence appears sufficient to support, with substantially less reconstruction:

- reassessment;
- physician update; and
- care conference.

The strongest simulated reuse workflows were:

1. Care Conference
2. Physician Update
3. Reassessment

QA remains partially reusable because QA requires source verification and cannot safely rely on a compressed maintained conclusion alone.

Progress Evidence improved reassessment reuse by adding objective improvement, milestones, remaining limits, safety effects, and timeframe. Maintained understanding alone was less complete for this purpose.

**Status:** simulated comparative workflow finding; no measured real-world reduction in reconstruction has been established.

## Visit Briefing Findings

### Session Focus

Session Focus was strongly preferred in simulation for visit preparation and treatment execution because it converts context into an active visit objective.

> **Attention Required tells me what to worry about. Session Focus tells me what to do.**

Session Focus should answer what the clinician should validate, observe, train, reassess, or address during today's visit.

### Attention Required

Attention Required is most useful as review guidance:

- what could derail progress;
- what warrants monitoring;
- what may require reassessment; and
- what must be reviewed before advancing the plan.

It should not duplicate Session Focus or function as milestone reporting.

### Orientation content

Sprint 9's Orientation Brief was implemented on a branch/PR but was not merged into the current repository history. It was largely duplicative of Quick Orientation Summary.

The finding is not that more orientation content is needed. The remaining opportunity is how clinicians access and consume existing maintained understanding—for example through future read-aloud or personal-agent exploration.

### Hierarchy

The most coherent Visit Briefing hierarchy keeps:

- Quick Orientation Summary collapsed or optional;
- Current Focus compressed;
- Supporting Evidence and Why This Changed local to each conclusion;
- Session Focus distinct from Attention Required; and
- progression and progress evidence available without overwhelming the first read.

**Status:** implemented and supported by internal/simulated review; real orientation speed and comprehension remain unmeasured.

## Patients Page Finding

An 80-patient simulation exposed that patient organization and retrieval must precede patient-level orientation.

The Patients page should be:

```text
Caseload Management
+
Rapid Orientation
```

It should not be a single long patient list. System Views, clinical-priority sorting, status, current focus, and recent change help answer who deserves attention and why.

Patient cards should not become mini Visit Briefings. The page should not become a scheduler, route planner, Today's Patients workflow, or folder system.

Remaining validation needs include:

- whether status labels are immediately understandable;
- whether recent-change summaries are consistently meaningful;
- whether System Views match clinician triage behavior;
- whether the legacy clinical context filter should be removed or replaced; and
- whether Personal Groups add value after core triage is validated.

**Status:** implemented and exercised in synthetic caseload simulation; not validated with real caseload management.

## Clinical Translation Workspace Finding

The Reference Workspace's highest value is not additional orientation. Its highest value is:

> **helping the clinician explain the patient to everyone else.**

The current Case Details hierarchy appropriately prioritizes:

1. Caregiver Guidance
2. Home & Equipment Guidance
3. Patient Guidance
4. Family / Supporter Guidance
5. Clinical Communication
6. Documentation / QA Support
7. Clinical Reference / Patient Context

The strategic distinction is:

- **Visit Briefing:** What should I do?
- **Clinical Translation Workspace:** How do I explain it?

The next validation question is whether clinicians can quickly produce concise, audience-appropriate communication without navigating raw or duplicative content.

**Status:** current organization is implemented; cognitive compression and reusable outputs remain future work.

## Explainability and Provenance Findings

Supporting Evidence and Why This Changed improve the platform's ability to answer:

- What is this based on?
- Where did it come from?
- Why does it matter?
- What changed?
- Why did the conclusion evolve or remain stable?

The preferred pattern is local explanation under the relevant maintained conclusion, not a separate transparency destination that clinicians must reconstruct.

The remaining gap is correction and governance: clinicians need a clear way to inspect sources, correct evidence, reject a maintained conclusion, and understand what changed afterward without rewriting immutable history.

**Status:** explanation capability is implemented; end-to-end provenance correction is incomplete.

## Findings Confidence

| Finding | Confidence | Basis |
| --- | --- | --- |
| Constraint explanation is a major trust driver | Medium | Repeated simulated/persona response and coherent implementation behavior |
| Session Focus is more actionable than Attention Required for visit execution | Medium | Strong comparative simulation preference |
| Maintained Understanding + Progress Evidence supports reassessment, physician update, and care conference reuse | Medium | Comparative workflow simulation; no field measurement |
| QA requires explicit source verification | Medium-high | Workflow requirement and simulation behavior |
| Caseload retrieval must precede orientation at scale | Medium | 80-patient simulation |
| Translation is the highest-value purpose of Case Details | Medium | Content/use-case review and product-model fit |
| Real clinicians will trust, adopt, or save time with the platform | Low / unknown | Real-clinician evidence has not yet been collected |

## Next Validation Priorities

1. Test Patients page triage with representative clinicians and realistic caseloads.
2. Measure Visit Briefing orientation, comprehension, disagreement, and retained clinical reality.
3. Test whether Session Focus changes visit preparation and treatment execution.
4. Test audience-specific translation tasks for caregivers, patients, families, physicians, care conferences, and QA/documentation.
5. Observe source verification, correction, and rejection behavior.
6. Test mobile use under field conditions, interruptions, and limited attention.
