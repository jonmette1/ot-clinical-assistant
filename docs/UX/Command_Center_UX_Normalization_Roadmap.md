# Command Center UX Normalization Roadmap

## Purpose

This roadmap defines a phased visual normalization path for the current Command Center implementation.

It does not redesign workflow, architecture, navigation, clinical reasoning, or product systems. The Command Center is treated as functionally mature. The objective is to move the existing presentation toward the approved **Clinical Mission Control** visual direction with the lowest implementation risk and highest clinician-facing impact.

The desired end state is calm, focused, trustworthy, clear, professional, and decisive. The interface should feel like a clinical operations surface, not a dashboard, AI report, or collection of independent widgets.

## Source Basis

This audit reviewed:

- `docs/UX/Visual_Design_Principles.md`
- `docs/PROJECT_STATUS_AND_DIRECTION.md`
- `src/app/cases/[id]/CaseWorkspaceClient.tsx`
- Directly imported Command Center presentation components in `src/app/cases/[id]/components/`

Existing Command Center hierarchy and ownership are considered approved. This roadmap focuses on visual hierarchy, card reduction, typography normalization, color discipline, density, and progressive disclosure.

## Current Implementation Read

### What Is Working

- The Command Center already prioritizes clinician orientation over historical reconstruction.
- The primary workflow content exists in the intended current-orientation surface.
- Current Focus, Case Status, Since Last Visit, Attention Required, and Next Action are present and mostly aligned to approved Command Center purpose.
- Secondary detail surfaces are often available through progressive disclosure rather than always-visible expansion.
- Navigation ownership is not the main source of friction.

### Primary Visual Friction

The remaining friction is presentation normalization rather than workflow redesign:

- Too many surfaces compete for authority.
- Multiple sections use strong borders, tinted backgrounds, shadows, and nested cards at the same time.
- Color is sometimes used as a module identity rather than a clinical signal.
- Section labels, eyebrow labels, card labels, pills, and helper text create repeated micro-hierarchy.
- The page can read as a grid of cards rather than a guided clinical sequence.
- Secondary content sometimes appears visually similar to primary workflow content.

## Visual Competition Audit

### What Currently Competes for Attention

1. **Command Center shell treatment**
   - The outer Command Center uses a strong rounded container, blue border, blue-tinted gradient, and large shadow.
   - This gives the shell visual authority that can compete with the Current Focus inside it.

2. **Current Focus treatment**
   - Current Focus appropriately has high authority, but its emerald border, emerald background, shadow, large type, secondary eyebrow, and nested barrier panel collectively create a highly decorated hero treatment.
   - It owns attention, but the emphasis is partly color- and container-driven rather than primarily typography- and position-driven.

3. **Case Status, Attention Required, and Next Action color treatments**
   - Case Status includes blue clinical status treatment.
   - Attention Required uses red border and red tint.
   - Next Action uses blue border and blue tint.
   - These treatments make several sections appear equally urgent, even when only some represent earned attention or immediate action.

4. **Operational pressure cards**
   - Caregiver, Environment, and Transfer / Mobility pressure cards use purple, orange, and blue borders/backgrounds.
   - These colors are largely category-coded, which creates visual noise and competes with clinically meaningful warning/action colors.

5. **Nested row cards**
   - Since Last Visit, Last Visit, Case Status, Next Action, pressure cards, and progression summaries use nested cards or pill-like row containers.
   - These repeated surfaces make individual content fragments feel independently important even when they are supporting evidence.

6. **Sticky header status pill**
   - The sticky header is useful for orientation, but the Live Case / Historical Snapshot pill adds another persistent border/background element.
   - It is useful structure, but it should remain low-authority unless the user is viewing a historical snapshot.

### What Should Stop Competing

- The Command Center shell should stop competing with the Current Focus.
- Secondary labels and helper copy should stop competing with clinical statements.
- Category colors on operational pressure cards should stop competing with clinical signal colors.
- Nested cards inside already-carded sections should stop competing with parent sections.
- Default “available reference” details should stop competing with immediate workflow sections.
- Decorative blue/emerald/purple/orange treatments should be reduced unless they communicate positive, warning, negative, or action meaning.

## Card Fragmentation Audit

### Fragmentation to Reduce

1. **Outer shell plus inner hero plus nested barrier panel**
   - The Command Center begins with a heavily styled outer surface, then an even more styled Current Focus hero, then a nested barrier card.
   - This creates three levels of container hierarchy before the clinician completes the first read.

2. **Case Status nested cards**
   - Overall Trajectory and Clinical Status are useful pieces of structure, but they are currently represented as two separate boxed elements inside another boxed article.
   - This makes status feel like a pair of widgets instead of a concise status read.

3. **Since Last Visit nested cards**
   - What Changed and Why It Matters are clinically valuable, but boxed subcards add boundary weight to what could read as a single change narrative.

4. **Last Visit nested cards**
   - Recent visit history is orientation content, but the current three-card grid risks making each row feel like equal workflow priority.

5. **Next Action nested primary action card**
   - The Primary Action content is clinically important, but the nested blue card inside a blue-tinted parent creates redundant emphasis.

6. **Operational pressure item chips/cards**
   - Caregiver, environment, and transfer pressure cards use colored item containers for each sentence.
   - The repeated mini-surfaces create fragmentation and overstate every listed item.

7. **Supporting progression summaries**
   - This area correctly uses disclosure, but inside the disclosure it relies on a dense grid of bordered cards.
   - This is acceptable for reference-level content but should not influence the primary Command Center visual grammar.

### Useful Structure to Preserve

- A single primary Command Center region is useful for grouping current-orientation content.
- Current Focus deserves a distinct first-read treatment.
- Attention Required deserves meaningful visual distinction when it contains actual concern.
- Next Action deserves action-oriented prominence, but without excessive decorative color.
- Progressive disclosure for supporting attention details and reference summaries should remain.
- Operational pressures should remain grouped because they support current treatment prioritization.
- Historical snapshot and validation details should remain visually subordinate.

## Typography Opportunities

### Where Hierarchy Should Move Away From Containers

1. **Current Focus**
   - Reduce reliance on emerald background, border, and shadow.
   - Preserve dominance through page position, larger clinical statement type, stronger line-height, and more intentional spacing.

2. **Case Status**
   - Move Overall Trajectory and Clinical Status into a status read that uses label/value typography, not separate cards of equal visual weight.
   - Make the trajectory value the status anchor; keep explanation text subordinate.

3. **Since Last Visit**
   - Treat What Changed and Why It Matters as two typographic subsections in one flow.
   - Use heading scale, spacing, and text weight rather than boxed subcards.

4. **Last Visit**
   - Present as recent orientation context with lower typographic authority than Since Last Visit.
   - Avoid matching the visual weight of the primary change section.

5. **Attention Required**
   - Let the attention statement carry the hierarchy.
   - Use color only to reinforce genuine warning/concern state.

6. **Next Action**
   - Make the action itself the visual anchor.
   - Reduce extra label and nested card emphasis around “Primary Action.”

7. **Operational Pressures**
   - Normalize pressure cards with consistent headings, body text, and list structure.
   - Reduce category-coded borders and tinted item blocks.

### Typography System Opportunity

Normalize the page around a small set of recurring text roles:

- Page label / section label: quiet uppercase, neutral, low contrast.
- Primary clinical statement: largest, strongest, shortest.
- Section heading: medium-high authority.
- Evidence / rationale: readable body text, lower contrast than statements.
- Metadata: smallest, quietest, non-competing.
- Action statement: strong, concise, action-colored only when the item is truly actionable.

## Color Opportunities

### Colors That Communicate Meaningful Clinical Information

- Red / negative / warning treatment for genuine attention, decline, or elevated concern.
- Amber treatment where caution or monitoring is clinically meaningful.
- Green / positive treatment only when clearly communicating improvement or successful progression.
- Blue/action treatment when directly tied to next step, navigation, or interaction.
- Neutral gray treatment for ordinary structure, explanations, metadata, and reference information.

### Colors That Appear Primarily Decorative

- Blue gradient on the outer Command Center shell.
- Emerald Current Focus treatment when the focus is not inherently positive/improving.
- Purple caregiver category treatment.
- Orange environment category treatment.
- Blue transfer/mobility category treatment when unrelated to action state.
- Repeated blue tints for Clinical Status and Next Action when used as general section identity.
- Colored bullets that repeat category colors rather than communicate clinical severity.

### Color Systems That Should Remain

- Status/attention color semantics: neutral, positive, warning, negative, action.
- Focus and form interaction color where needed for accessibility and affordance.
- Historical Snapshot distinction when the user is not viewing the live case.
- Attention Required color escalation when clinically warranted.
- Next Action action color, used sparingly.

### Color Systems to Reduce

- Module/category colors.
- Decorative section tints.
- Colored borders on every section.
- Colored mini-cards inside lists.
- Gradient/shadow treatments that imply importance without clinical meaning.

## Layout Opportunities

The existing section order should remain stable. The normalization opportunity is to make the same content feel more like a guided clinical sequence:

Current Reality  
↓  
Status  
↓  
Change  
↓  
Attention  
↓  
Action

The page can move toward that feeling by reducing the perceived independence of each section:

- Use one calmer Command Center canvas rather than multiple equally styled cards.
- Let Current Focus occupy the first-read position with less decorative enclosure.
- Treat Case Status as a concise status band rather than two internal widgets.
- Treat Since Last Visit as a narrative change module rather than two cards.
- Keep Last Visit visibly subordinate to Since Last Visit.
- Use Attention Required only as strong visual interruption when attention is genuinely earned.
- Let Next Action close the sequence with a clear action statement, not another decorated card.
- Group operational pressures as supporting context below the primary sequence with quieter surfaces.

## UX Normalization Roadmap

### Phase 1 — High-ROI Visual De-Escalation

#### Objective

Reduce visual competition and card fragmentation without changing content, section order, ownership, navigation, or clinical logic.

#### Rationale

The fastest path toward Clinical Mission Control is to remove unnecessary emphasis from secondary surfaces so the existing hierarchy can breathe. The current workflow is largely correct; the visual system is doing too much work through color, borders, and nested cards.

#### Recommended Normalization Areas

1. **Calm the Command Center shell**
   - Reduce the outer gradient, blue border strength, and shadow authority.
   - Preserve a coherent Command Center region, but make it feel like a calm workspace rather than a highlighted dashboard panel.

2. **Preserve Current Focus dominance while reducing decoration**
   - Keep Current Focus as the highest-authority element.
   - Reduce emerald tint/shadow reliance.
   - Emphasize through typography, position, and spacing.

3. **Flatten the most obvious nested cards**
   - Target nested subcards in Case Status, Since Last Visit, and Next Action first.
   - Preserve the information groupings, but lower the visual weight of internal containers.

4. **Reduce decorative category colors in operational pressure cards**
   - Move caregiver, environment, and transfer/mobility cards toward a neutral presentation.
   - Reserve color for true clinical warning/action semantics.

5. **Normalize label contrast**
   - Make section labels quiet and consistent.
   - Reduce high-chroma labels where the color is not clinically meaningful.

#### Expected Clinician Benefit

- Faster first read of the current clinical reality.
- Less visual scanning effort.
- Clearer distinction between primary workflow answers and supporting context.
- More serious, calmer clinical tone.

#### Implementation Complexity

Low.

Most changes are visual normalization of existing surfaces and typography. No data, workflow, navigation, or component ownership changes are implied.

#### Implementation Risk

Low.

The main risk is reducing too much emphasis from clinically important items. This can be managed by preserving Current Focus, true Attention Required, and Next Action hierarchy while reducing only decorative or redundant emphasis.

## Phase 2 — Workflow Flow and Density Normalization

### Objective

Make the primary sequence feel less like separate cards and more like a guided clinical read from current reality to next action.

### Rationale

After Phase 1 reduces excessive visual competition, Phase 2 can improve pacing, density, and scan path. This phase should strengthen the workflow without changing section order or content ownership.

### Recommended Normalization Areas

1. **Create a more continuous primary read**
   - Visually connect Current Focus, Case Status, Since Last Visit, Attention Required, and Next Action through consistent spacing and calmer dividers.
   - Avoid making every section appear as an independent dashboard tile.

2. **Rebalance Status and Change hierarchy**
   - Case Status should quickly answer improving/stable/declining and current clinical status.
   - Since Last Visit should more clearly distinguish what changed from why it matters using typographic subsections.

3. **Subordinate Last Visit to Since Last Visit**
   - Keep recent visit history available as orientation context.
   - Reduce its visual parity with the primary change summary.

4. **Normalize operational pressure density**
   - Present caregiver, environment, and transfer/mobility pressures as supporting clinical constraints, not category dashboards.
   - Use consistent list density and neutral card treatment.

5. **Standardize disclosure surfaces**
   - Supporting details should remain discoverable but visually quiet.
   - Disclosures should not introduce a separate, louder visual grammar.

### Expected Clinician Benefit

- The Command Center will read more like a clinical briefing.
- Clinicians can move from status to change to attention to action with less interpretation effort.
- Supporting content remains available without pulling attention away from the current plan.

### Implementation Complexity

Medium.

This phase may require more coordinated presentation changes across `CaseWorkspaceClient.tsx` and directly imported presentation components, but still does not require architecture or API changes.

### Implementation Risk

Medium-low.

The main risk is accidentally making secondary content too hidden or flattening meaningful grouping. The safeguard is to preserve explicit headings and section order while reducing only redundant card boundaries.

## Phase 3 — Advanced Refinement After Validation

### Objective

Refine the visual system into a durable Command Center presentation language after earlier normalization is validated in use.

### Rationale

Advanced refinements should wait until the lower-risk hierarchy and density improvements prove successful. This prevents over-design and avoids replacing a mature workflow with aesthetic experimentation.

### Recommended Normalization Areas

1. **Define reusable Command Center visual primitives**
   - Establish a consistent internal language for primary statements, secondary evidence, metadata, actions, warnings, and disclosures.
   - This should describe visual roles, not create new workflow systems.

2. **Fine-tune clinical color semantics**
   - Apply color only when it communicates neutral, positive, warning, negative, or action state.
   - Validate that clinicians can infer meaning without a legend.

3. **Refine responsive density**
   - Ensure mobile and narrower layouts preserve the same current-reality-first read.
   - Avoid density increases that recreate card fragmentation on smaller screens.

4. **Audit accessibility and contrast after de-escalation**
   - Ensure calmer visuals still preserve readable contrast, focus states, and action discoverability.

5. **Harmonize reference-level components**
   - Normalize Supporting Progression Summaries, Adjacent Operational Priorities, Structured Plan Details, Decision Transparency, and Historical Snapshots so reference details remain clearly subordinate.

### Expected Clinician Benefit

- More durable visual consistency across the full patient workspace.
- Less cognitive cost when moving between primary Command Center content and supporting reference surfaces.
- Stronger clinical trust through restraint and predictability.

### Implementation Complexity

Medium to high.

This phase touches broader design-system consistency and should be sequenced after the primary Command Center normalization is proven stable.

### Implementation Risk

Medium.

The risk is scope creep into design-system refactoring or workflow reinterpretation. This phase should remain presentation-only and should not introduce new abstractions unless needed to preserve consistency.

## Highest ROI First Implementation

The highest ROI first normalization target is:

**Reduce decorative visual competition in the primary Command Center sequence while preserving Current Focus dominance.**

Specifically, Phase 1 should prioritize:

1. Calming the outer Command Center shell.
2. Reducing non-semantic color in Current Focus while keeping it first and typographically dominant.
3. Flattening nested cards in Case Status, Since Last Visit, and Next Action.
4. Neutralizing category-colored operational pressure cards.

This provides immediate scanability gains without changing clinical logic, information architecture, or navigation.

## Biggest Implementation Risk

The biggest risk is mistaking visual de-escalation for hierarchy removal.

The roadmap should not make the Command Center visually flat. It should make visual authority more selective. Current Focus, true Attention Required, and Next Action must remain obvious. The goal is not less hierarchy; the goal is hierarchy carried by position, typography, spacing, and clinically meaningful color instead of repeated borders, backgrounds, shadows, and category tints.

## Areas That Should Remain Unchanged

The following areas should remain unchanged during normalization unless a separate approved decision supersedes them:

- Command Center purpose.
- Patient-centric navigation model.
- Command Center versus Reference Workspace ownership separation.
- Existing clinical reasoning architecture.
- Continuity architecture.
- Progression architecture.
- Reassessment architecture.
- Operational prioritization architecture.
- Mutation governance and persistence structures.
- API contracts and generated output structures.
- Primary Command Center content categories.
- Progressive disclosure for secondary detail and reference content.
- Historical snapshots as subordinate continuity/reference tools.
- Clinical Focus as configuration rather than primary workflow.

## Success Criteria

A successful normalization pass should make the Command Center feel:

- More like a calm clinical briefing.
- Less like a grid of independent cards.
- More decisive about what matters now.
- Less dependent on decorative color.
- Easier to scan in approximately five seconds.
- More consistent with Clinical Mission Control.

It should not increase complexity, architecture surface area, workflow friction, or implementation risk.
