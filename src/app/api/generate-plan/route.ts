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
- one concise label
- describes what should dominate treatment attention now
- should not sound like a pathway title
- should not describe a broad philosophy
- should be specific enough to guide treatment

Good examples:
- Stabilize shower transfer safety and caregiver-supported bathing setup
- Establish safe bathroom access before increasing ADL demand
- Standardize caregiver-supported task setup for bathing participation
- Reduce transfer risk through environmental setup and assisted sequencing

Bad examples:
- Safety Pathway
- Functional Participation Approach
- Caregiver Support Plan
- Alternative Treatment Option

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

Generate structured_plan_details anchored to the currentOperationalEmphasis.

Do NOT anchor structured details to a pathway.

Include:
- immediateActions
- safetyConsiderations
- caregiverConsiderations
- environmentalConsiderations
- treatmentExecutionNotes

Rules:
- actions should be short and operational
- avoid long narrative explanations
- avoid generic OT filler
- avoid unsupported claims
- avoid predictive recovery language

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