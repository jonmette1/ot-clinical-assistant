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

    const clinicalFocus =
      body?.clinical_focus ||
      body?.case_classification?.clinical_focus ||
      "adl_home_safety";

      const pathwayFocusRules =
  clinicalFocus === "transfers_mobility"
    ? `
PATHWAY FOCUS MODE: TRANSFERS & MOBILITY

All 3 pathways must focus primarily on transfer and mobility performance.

Pathway 1: Immediate transfer safety
- Focus on safest current transfer method
- Address sit-to-stand, surface height, hand placement, device use, and fall risk

Pathway 2: Transfer mechanics training
- Focus on sequencing, weight shift, controlled standing/sitting, caregiver cueing if relevant

Pathway 3: Mobility carryover between zones
- Focus on moving between bed, chair, bathroom, and entry areas with realistic pacing and setup

Do not center pathways on bathing or dressing setup unless framed as a transfer barrier.

Pathway title requirements:
- Must include a transfer term: transfer, sit-to-stand, surface, mobility
- If missing, rewrite the title
`
    : clinicalFocus === "caregiver_training"
    ? `
PATHWAY FOCUS MODE: CAREGIVER TRAINING

All 3 pathways must focus primarily on caregiver execution, safety boundaries, and carryover.

Pathway 1: Immediate caregiver setup and safety boundaries
- Focus on what caregiver should set up, watch, avoid, and stop

Pathway 2: Caregiver cueing and supervision
- Focus on simple cueing, timing, positioning, confidence, and reducing unsafe physical help

Pathway 3: Sustainable carryover routine
- Focus on reducing burden, consistency, patient participation, and when to escalate to OT

Do not center pathways on therapist-only treatment activities.

Pathway title requirements:
- Must include one of: caregiver, supervision, cueing
- If missing, rewrite the title
`
    : `
PATHWAY FOCUS MODE: ADL / HOME SAFETY

All 3 pathways must focus primarily on ADL completion and home safety.

Pathway 1: Immediate ADL safety and setup
- Focus on bathing, dressing, toileting, bathroom setup, equipment placement, and fall prevention

Pathway 2: ADL routine training
- Focus on task sequencing, energy conservation, safe positioning, and realistic daily routine

Pathway 3: Home safety optimization
- Focus on environmental modification, equipment refinement, and reducing ADL risk over time

Do not center pathways on transfer mechanics unless directly supporting ADL completion.

Pathway title requirements:
- Must include an ADL noun: bathing, dressing, toileting, grooming
- If missing, rewrite the title
`;

    const client = new OpenAI({ apiKey });

const prompt = `
You are an experienced occupational therapist specializing in adult home health, ADL performance, transfers, fall prevention, home modification, caregiver training, and functional safety.

Generate a concise, structured OT clinical reasoning plan.

Core principles:
- Be practical, specific, and clinically useful.
- Avoid generic advice.
- Tie recommendations directly to the case data.
- Keep the plan high-level enough to guide care.
- Do NOT generate detailed caregiver scripts, transfer cueing checklists, privacy scripts, or step-by-step setup guides. Those are handled by separate detail modules.
- Do NOT use any names from the case data. Use role-based language only: "the patient", "the caregiver", "family member", or "clinician".

PRIMARY CLINICAL FOCUS:
${clinicalFocus}

Clinical focus rules:
- Use the selected focus to decide what gets the most depth.
- Do not expand every OT domain equally.
- The three pathways must materially change based on the selected focus.
- If pathways would be nearly identical across focus modes, the output is wrong.

Focus behavior:

If clinical_focus = "adl_home_safety":
- Prioritize ADL completion, bathroom/home safety, bathing, dressing, toileting, grooming, task setup, equipment placement, and environmental modification.
- Transfers may appear only when they directly support ADL completion.

If clinical_focus = "transfers_mobility":
- Prioritize transfer mechanics, sit-to-stand, bed/toilet/shower/chair transfers, surface setup, mobility between zones, device use, balance, and fall prevention.
- ADLs may appear only as downstream consequences of transfer or mobility limits.

If clinical_focus = "caregiver_training":
- Prioritize caregiver setup, cueing, supervision boundaries, burden reduction, safe assistance, stop conditions, and realistic carryover.
- Pathways must clearly explain what the caregiver does, watches for, avoids, or stops.

Clinical severity rules:
Use ADL assist levels as severity signals:
1 = Total Assist
2 = Maximal Assist
3 = Moderate Assist
4 = Minimal Assist
5 = Supervision
6 = Modified Independence
7 = Total Independence

Rules:
- Lower numbers mean greater impairment.
- Prioritize the most impaired relevant transfer or ADL domain.
- Intervention intensity must match severity.
- Levels 1–2: emphasize safety, setup, caregiver dependence, environmental modification, and stop-points.
- Levels 3–4: emphasize guided participation, cueing, partial assist, and realistic progression.
- Levels 5–7: emphasize efficiency, endurance, risk reduction, and carryover.
- Do not mix dependent-level strategies with independence-level strategies in the same pathway.

Zone priority rules:
Use clinical_priority_summary.ranked_zones when present.
- Highest-ranked zone should dominate patientSnapshot, functionalProblemAreas, firstSessionPriorities, and at least one pathway.
- Do not let bathroom or bathing dominate if another zone is ranked higher.
- Recommendations should follow: deficit → environment → intervention.

Functional zones:
- outside_entrance: entry access, steps, railings, driveway, door width, exterior hazards
- bathroom_assessment: toileting, bathing, shower transfer, bathroom safety, equipment
- bedroom_bed_setup: bed mobility, bed height, nighttime safety, path to bathroom
- transfer_surfaces: sit-to-stand, chair/couch/recliner/toilet surfaces, armrests, firmness, surface height
- general_mobility: device use, indoor mobility, endurance, recent falls, movement between rooms

Caregiver rules:
- Caregiver data modifies feasibility, safety, burden, and carryover.
- Caregiver capacity changes HOW the plan is executed, not WHETHER the priority problem is addressed.
- Do not assume lifting or hands-on help if caregiver capacity is limited or unknown.
- If caregiver data exists, include caregiver feasibility in patientSnapshot, clinicalConsiderations, firstSessionPriorities, and caregiverGuidance.
- caregiverGuidance should be high-level only. Do not write detailed scripts or detailed cueing sequences.

Pathway rules:
- Always generate exactly 3 pathways.
- Each pathway must represent a distinct clinical approach.
- Each pathway must include no more than 4 interventions.
- Each intervention must be one short, direct sentence.
- Avoid repetition across pathways.
- Pathway 1 = immediate safety / compensation.
- Pathway 2 = structured training / progression.
- Pathway 3 = carryover / longer-term optimization.
- Each pathway must include realistic upside and tradeoff.

Selected pathway summary:
- Identify the most appropriate pathway based on deficits, environment, severity, safety risk, caregiver feasibility, and selected focus.
- Summarize it in 2–3 plain-language sentences.
- Do not list all pathways.
- Do not repeat intervention bullets.

Summary rules:
- Summary must be scannable in under 10 seconds.
- Base summary on the selected pathway summary, major risks, and case data.
- Keep planSummary to 2–3 sentences.
- topRisks: 2–4 highest safety concerns.
- keyLimitations: main functional barriers.
- caregiverExpectations: high-level expectations only.
- safetyLevel: "low", "medium", or "high".

Equipment & Home Setup Plan Rules:

- Include 3–6 items maximum
- Focus on the most impactful equipment or environmental setup changes
- Items may include:
  - durable medical equipment (walker, shower chair, grab bars, commode)
  - small assistive items (raised toilet seat, reacher, non-slip mats)
  - environmental modifications (remove rugs, adjust furniture, improve lighting)

Each item must include:

- item: clear name of equipment or setup change
- reason: one sentence explaining why it is needed for THIS patient
- priority:
  - high = safety critical
  - medium = improves function or reduces risk
  - low = optimization or convenience

- urgency:
  - immediate = needed before next task/use
  - short_term = within 1–2 weeks
  - optional = helpful but not required

- costRange:
  - provide a broad estimate (e.g., "$20–50", "$50–150", "$150–300+")

- access:
  - where to obtain (Amazon, pharmacy, medical supply store, insurance/DME provider)

- coverageNotes:
  - high-level guidance only (e.g., "may be covered with MD order", "typically out-of-pocket")

Rules:
- Do NOT use any names (use "the patient", "the caregiver")
- Do NOT over-specify brands or exact pricing
- Do NOT include more than 6 items
- Prioritize safety and feasibility over completeness
- Avoid repeating the same reasoning across items

For high-priority or immediate items:
- Make the reason stronger and more action-oriented.
- Clearly explain what risk the item reduces or what task it makes possible.
- Avoid weak phrases like "may help" or "could improve."
- Use stronger wording such as "needed to reduce fall risk during..." or "important before the patient attempts..."
- Include key features inside the reason when relevant, such as height-adjustable, non-slip, armrests, back support, foldable, stable base, correct size, or easy-to-clean surface.
- For access, give the most realistic first step, such as "start with pharmacy or Amazon for low-cost items" or "ask the physician, insurance, or DME provider for covered equipment."

Feasibility Snapshot Rules:

- Always include feasibilitySnapshot.
- Infer feasibility from the available case data.
- If the case does not include clear financial information, use "unknown" for financialFeasibility.
- Do not assume the patient can afford ideal equipment.
- Do not assume the home can support ideal setup changes.
- Do not assume the caregiver can consistently follow through unless caregiver data supports it.

financialFeasibility:
- low = cost is likely a major barrier or multiple recommended items may create burden
- moderate = some cost burden likely, but basic low-cost options may be realistic
- high = equipment or modifications appear financially realistic
- unknown = not enough information

environmentalFeasibility:
- low = space constraints, stairs, clutter, narrow bathroom, missing supports, or home layout strongly limits ideal setup
- moderate = some barriers exist but workarounds are realistic
- high = home setup appears able to support recommended changes
- unknown = not enough information

caregiverFlexibility:
- low = caregiver availability, confidence, training, or physical capacity limits follow-through
- moderate = caregiver can help with some setup/cueing but may need structure
- high = caregiver support appears reliable and realistic
- unknown = not enough information

mainConstraint:
- Identify the single biggest practical barrier to implementing the plan.
- Examples: cost, bathroom layout, stairs, lack of caregiver support, limited caregiver capacity, equipment access, patient resistance, or unclear funding.

Equipment feasibility rules:

For each equipmentPlan item:
- Include an ideal recommendation when clinically appropriate.
- Include a lowerCostAlternative that is realistic and safer than doing nothing.
- Include a contingencyPlan for what to do if the ideal item cannot be obtained quickly.
- Adjust recommendations based on feasibility rather than assuming a perfect home or unlimited budget.
- For high-priority/immediate items, the contingencyPlan should clearly explain what to avoid or delay until safer setup is available.
- Avoid recommending expensive equipment without acknowledging lower-cost or temporary alternatives.
- Do not present lower-cost alternatives as equally safe when they are not.

Output rules:
Return valid JSON only.
Do not use markdown.
Do not wrap JSON in code fences.

Return JSON in this exact format:

{
  "focusApplied": "${clinicalFocus}",
  "patientSnapshot": "string",
  "taskBreakdown": ["string"],
  "functionalProblemAreas": ["string"],
  "pathways": [
    {
      "type": "string",
      "title": "string",
      "interventions": ["string"],
      "timeline": "string",
      "upside": "string",
      "tradeoff": "string"
    }
  ],
  "selectedPathwaySummary": "string",
  "summary": {
    "topRisks": ["string"],
    "keyLimitations": ["string"],
    "planSummary": "string",
    "caregiverExpectations": ["string"],
    "safetyLevel": "low | medium | high"
  },
  "clinicalConsiderations": ["string"],
  "firstSessionPriorities": ["string"],
  "caregiverGuidance": ["string"],
  "feasibilitySnapshot": {
    "financialFeasibility": "low | moderate | high | unknown",
    "environmentalFeasibility": "low | moderate | high | unknown",
    "caregiverFlexibility": "low | moderate | high | unknown",
    "mainConstraint": "string"
  },
  "equipmentPlan": [
  {
    "item": "string",
    "reason": "string",
    "priority": "high | medium | low",
    "urgency": "immediate | short_term | optional",
    "costRange": "string",
    "access": "string",
    "coverageNotes": "string",
    "lowerCostAlternative": "string",
    "contingencyPlan": "string"
  }
]
}

Case data:
${JSON.stringify(body, null, 2)}
`;

const openAiStart = performance.now();

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: prompt,
});

console.log("OpenAI API time:", Math.round(performance.now() - openAiStart), "ms");

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