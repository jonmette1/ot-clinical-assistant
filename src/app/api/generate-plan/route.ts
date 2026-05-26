import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OPENAI_API_KEY is missing on the server.",
        }),
        { status: 500 }
      );
    }

    const body = await req.json();

    console.log("API received clinicalDecisionModel:", body?.clinicalDecisionModel);
    console.log(
      "Selected Strategies:",
      body?.clinicalDecisionModel?.selectedStrategies
    );

    const clinicalDecisionModel = body?.clinicalDecisionModel || null;

    const selectedStrategies: string[] = Array.isArray(
      clinicalDecisionModel?.selectedStrategies
    )
      ? clinicalDecisionModel.selectedStrategies
      : [];

    const executionFocus =
      body?.executionFocus ||
      body?.clinicalFocus ||
      body?.clinical_focus ||
      body?.case_classification?.clinical_focus ||
      "adl_home_safety";

    const hasSelectedStrategies = selectedStrategies.length > 0;

    const primaryControlLabel = hasSelectedStrategies
      ? selectedStrategies.join(", ")
      : executionFocus;

    const client = new OpenAI({ apiKey });

   const prompt = `
You are an experienced occupational therapist generating a structured clinical reasoning plan.

This system uses a deterministic clinical decision engine.

The AI is NOT the decision engine.
The AI is the synthesis and workflow communication layer.

==================================================
PRIMARY CONTROL LAYER — OPERATIONAL PRIORITIZATION
==================================================

The system no longer generates competing treatment pathways.

Do NOT generate:
- pathways
- selected pathways
- alternative treatment approaches
- competing plans
- pathway recommendations
- option A / option B / option C treatment models

Instead, generate ONE current operational prioritization model.

The core question is:

What should dominate treatment attention right now?

==================================================
DETERMINISTIC REASONING SOURCE
==================================================

The following clinicalDecisionModel is the authoritative deterministic reasoning source:

${JSON.stringify(clinicalDecisionModel || {}, null, 2)}

Rules:
- selectedStrategies define the intervention mechanisms.
- primaryStrategy identifies the strongest strategy signal.
- dominantBarrier and secondaryBarrier explain what is limiting function.
- safetyRiskLevel controls urgency and risk language.
- supportLevel shapes caregiver feasibility.
- clinicalLens and environmentContext shape implementation.
- AI must not override this model.

==================================================
SELECTED STRATEGIES
==================================================

Selected strategies:

${hasSelectedStrategies ? selectedStrategies.join(", ") : "No selectedStrategies provided."}

Rules:
- selectedStrategies are not pathways.
- selectedStrategies are intervention mechanisms.
- The output should synthesize these into one currentOperationalEmphasis.
- Do not create one plan per strategy.
- Do not frame strategies as competing choices.

==================================================
EXECUTION FOCUS
==================================================

executionFocus:
${executionFocus}

Rules:
- executionFocus describes where the operational emphasis is being applied.
- executionFocus may affect wording, examples, and detail emphasis.
- executionFocus does not override the deterministic reasoning model.

==================================================
CASE CLASSIFICATION CONTEXT
==================================================

${JSON.stringify(body?.case_classification || {}, null, 2)}

This is secondary context only.

==================================================
CORE CLINICAL REASONING MODEL
==================================================

Function = Person × Task × Environment × Behavior

Use:
- patient goal
- dominant barrier
- secondary barrier
- clinical lens
- environment context
- caregiver context
- assistance level
- transfer status
- safety risk
- selected strategies
- progression state if available

The output should be concise, operational, and clinically useful.

==================================================
OPERATIONAL PRIORITIZATION REQUIREMENTS
==================================================

Generate one operational_prioritization object.

It must include:

- currentOperationalEmphasis
- emphasisRationale
- dominantBarriers
- adjacentOperationalPriorities
- reassessmentTriggers
- continuitySummary

currentOperationalEmphasis:
- MUST describe the CURRENT unstable operational condition
- MUST describe what is currently breaking down functionally
- MUST describe why operational stability is fragile right now
- MUST remain observational rather than prescriptive
- MUST NOT read like a treatment plan
- MUST NOT read like an intervention title
- MUST NOT read like a pathway label
- MUST NOT read like a recommendation header

The emphasis should answer:

"What operational condition is currently most unstable?"

The emphasis should focus on:
- transfer instability
- environmental breakdown
- caregiver feasibility strain
- participation instability
- endurance collapse
- supervision dependence
- safety instability
- setup fragility
- task sequencing failure
- mobility inconsistency

GOOD examples:
- Bathroom transfer participation remains unsafe due to tub-entry instability and limited caregiver support capacity
- Bathing participation is inconsistent because environmental constraints and transfer dependence remain unresolved
- Caregiver-supported bathroom mobility remains fragile due to endurance limitations and unsafe transfer setup
- Shower transfer stability remains limited by environmental hazards and reduced physical support availability

BAD examples:
- Stabilize bathroom transfer safety
- Environmental compensation for bathing
- Caregiver-assisted transfer support
- Safety stabilization approach
- Functional participation strategy
- Bathroom safety pathway

The operational emphasis should feel like:
- current operational reality
NOT:
- a treatment recommendation

emphasisRationale:
- 2 to 4 concise reasons
- explain why this emphasis dominates now
- must reference actual barriers, risk, caregiver feasibility, or environment

dominantBarriers:
- 3 to 6 concise items
- list the barriers most responsible for the current emphasis

adjacentOperationalPriorities:
- 2 to 4 items
- these are secondary or emerging priorities
- they are NOT alternative plans
- they are NOT selectable options
- they should describe what to monitor, prepare, or address after the current emphasis is stabilized

Each adjacent priority must include:
- label
- rationale
- monitorFor

reassessmentTriggers:
- 2 to 5 concise triggers
- describe what should prompt review or change in treatment emphasis

continuitySummary:
- 1 to 2 sentences maximum
- operational language only
- no recovery prediction
- no motivational language
- no week-by-week planning

==================================================
STRUCTURED PLAN DETAILS
==================================================

Generate structured_plan_details anchored to the current operational instability state.

The purpose of structured_plan_details is NOT documentation support.

The purpose is:
- explaining WHY instability persists
- identifying what operationally constrains participation
- clarifying why execution remains fragile
- identifying continuity-sensitive pressure points

Structured details should feel like:
- operational evidence layers
NOT:
- generic OT documentation categories

Include:

- instabilityDrivers
- feasibilityConstraints
- environmentalPressures
- executionPressurePoints
- continuityRisks

Definitions:

instabilityDrivers:
- direct causes of operational instability
- explain why participation is currently breaking down
- should connect directly to the operational emphasis

feasibilityConstraints:
- caregiver limitations
- environmental limitations
- endurance limitations
- supervision dependence
- equipment limitations
- implementation fragility

environmentalPressures:
- environmental conditions sustaining instability
- access problems
- transfer geometry issues
- hazard persistence
- setup complexity

executionPressurePoints:
- moments where participation commonly destabilizes
- transfer transitions
- setup failures
- sequencing breakdown
- endurance collapse
- caregiver inconsistency
- environmental negotiation

continuityRisks:
- factors likely to worsen instability over time
- risks to carryover
- escalation risks
- participation regression risks

Rules:
- ALL structured detail content MUST remain observational
- describe operational instability
- describe operational fragility
- describe participation breakdown
- describe environmental pressure
- describe caregiver feasibility limitations
- describe execution inconsistency
- describe continuity-sensitive instability

DO NOT:
- give recommendations
- give instructions
- tell the clinician what to do
- tell the caregiver what to do
- prescribe interventions
- use directive language
- use command language
- use educational language
- use motivational language
- use generic OT recommendation language
- use checklist language
- use "ensure"
- use "encourage"
- use "provide"
- use "plan"
- use "monitor"
- use "assess"
- use "use"
- use "maintain"
- use "avoid"

The system is:
- interpreting operational instability
NOT:
- generating recommendations

All content should feel like:
- operational interpretation
- instability analysis
- continuity-aware reasoning

NOT:
- treatment instructions
- care planning directives
- documentation recommendations

GOOD examples:
- Tub-entry transfer stability declines as fatigue increases during bathing progression
- Caregiver support reliability is limited by reduced physical assist capacity
- Narrow transfer geometry restricts safe positioning during bathroom mobility
- Participation consistency decreases when sequencing demands increase during setup transitions

BAD examples:
- Provide caregiver training
- Use direct supervision
- Monitor fatigue
- Plan installation of grab bars
- Encourage communication
- Maintain adequate lighting

==================================================
PATIENT SNAPSHOT
==================================================

Generate a short patientSnapshot.

Describe:
- what is happening functionally
- why performance is breaking down
- how the operational emphasis applies
- how caregiver/environment factors affect feasibility

Limit to 2 to 4 sentences.

==================================================
PLAN SUMMARY
==================================================

Generate summary with:
- planSummary
- topRisks
- caregiverExpectations
- safetyLevel

Rules:
- planSummary should summarize the current operational emphasis, not a pathway.
- topRisks should be concise.
- caregiverExpectations should be practical and realistic.
- safetyLevel must be low, medium, or high.

==================================================
OUTPUT FORMAT — JSON ONLY
==================================================

Return valid JSON only.
No markdown.
No code fences.
No explanation outside JSON.

{
  "focusApplied": "${primaryControlLabel}",
  "executionFocus": "${executionFocus}",
  "selectedStrategiesApplied": [],
  "clinicalDecisionModelUsed": {
    "primaryStrategy": "string",
    "selectedStrategies": [],
    "dominantBarrier": "string",
    "secondaryBarrier": "string",
    "clinicalLens": [],
    "environmentContext": [],
    "safetyRiskLevel": "string",
    "supportLevel": "string"
  },
  "patientSnapshot": "string",
  "operational_prioritization": {
    "currentOperationalEmphasis": "string",
    "emphasisRationale": ["string"],
    "dominantBarriers": ["string"],
    "adjacentOperationalPriorities": [
      {
        "label": "string",
        "rationale": "string",
        "monitorFor": "string"
      }
    ],
    "reassessmentTriggers": ["string"],
    "continuitySummary": "string"
  },
  "structured_plan_details": {
    "immediateActions": ["string"],
    "safetyConsiderations": ["string"],
    "caregiverConsiderations": ["string"],
    "environmentalConsiderations": ["string"],
    "treatmentExecutionNotes": ["string"]
  },
  "caregiverGuidance": ["string"],
  "summary": {
    "topRisks": ["string"],
    "planSummary": "string",
    "caregiverExpectations": ["string"],
    "safetyLevel": "low | medium | high"
  }
}

==================================================
CASE INPUT
==================================================

${JSON.stringify(body, null, 2)}
`;

    const openAiStart = performance.now();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    console.log(
      "OpenAI API time:",
      Math.round(performance.now() - openAiStart),
      "ms"
    );

    const outputText = response.output_text || "";
    console.log("RAW AI RESPONSE:", outputText);

    const cleaned = outputText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI returned invalid JSON.",
          raw: outputText,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: parsed,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}