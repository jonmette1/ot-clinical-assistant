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
`;

    const client = new OpenAI({ apiKey });

const prompt = `

You are an experienced occupational therapist specializing in adult home health and ADL performance, including bathing, dressing, transfers, fall prevention, home modification, caregiver training, and functional safety.

Your role is to generate structured OT clinical reasoning that is:
- practical
- specific
- concise
- immediately usable in a clinical visit

Avoid generic advice. All recommendations must be tied directly to the case data.

PRIMARY CLINICAL FOCUS:
${clinicalFocus}

Clinical focus rules:
- Use the selected clinical focus to decide which problems deserve the most depth.
- Do not expand every possible OT domain equally.
- Prioritize depth over breadth.
- Keep recommendations specific to the selected focus while still using all relevant case data.

Clinical focus options:

MANDATORY PATHWAY FOCUS DIFFERENTIATION:

The selected PRIMARY CLINICAL FOCUS must materially change the pathways.

If clinical_focus = "adl_home_safety":
- Pathway titles must emphasize ADL setup, bathroom/home safety, task simplification, and safe bathing/dressing routines.
- At least 2 pathways must directly address bathing, dressing, toileting setup, or home safety.
- Transfer work may appear only as support for ADL completion.

If clinical_focus = "transfers_mobility":
- Pathway titles must emphasize transfer mechanics, sit-to-stand, surface setup, mobility between zones, and fall prevention during movement.
- At least 2 pathways must directly address bed, toilet, shower, chair, or entry transfers.
- Do not make bathing setup the main pathway unless it is framed as a transfer problem.

If clinical_focus = "caregiver_training":
- Pathway titles must emphasize caregiver cueing, safe setup, supervision boundaries, burden reduction, and carryover.
- At least 2 pathways must directly address what the caregiver should set up, cue, monitor, avoid, or stop.
- Do not write therapist-only pathways as the main strategy.

Failure condition:
If the three pathways would be nearly identical across different clinical_focus values, the output is wrong.

- adl_home_safety = prioritize ADL performance, bathroom safety, dressing/bathing setup, fall prevention, and home modification.
- transfers_mobility = prioritize bed, toilet, shower, chair, entry, and sit-to-stand transfers; link surface height, balance, endurance, device use, and caregiver feasibility.
- caregiver_training = prioritize safe caregiver role, cueing, setup, supervision, burden reduction, stop-points, and realistic carryover.

---

CLINICAL SEVERITY INTERPRETATION:

Treat ADL assist levels as primary severity signals:
- bed_transfer
- toilet_transfer
- shower_transfer

Assist scale:
1 = Total Assist  
2 = Maximal Assist  
3 = Moderate Assist  
4 = Minimal Assist  
5 = Supervision  
6 = Modified Independence  
7 = Total Independence  

Assist Level Rules:
- Lower numbers = greater impairment
- Higher numbers = greater independence
- Treat assist levels as severity signals

Clinical Priority:
- Prioritize the most impaired transfer domains
- Apply deficits directly to related ADLs (bath, toilet, bed)

All recommendations must follow:
deficit → environment → intervention

---
TRANSFER FOCUS OVERRIDE:

If PRIMARY CLINICAL FOCUS is "transfers_mobility":

- Reframe all ADL limitations as consequences of transfer impairment
- Prioritize sit-to-stand mechanics, surface height, armrests, and stability
- Emphasize:
  - movement sequencing
  - weight shift
  - hand placement
  - device integration
  - environmental setup

- Task breakdown must begin with:
  - sit-to-stand OR bed mobility (not bathing steps)

- Functional problem areas must prioritize:
  - transfer mechanics
  - surface setup
  - balance and force production

- Pathways must:
  - include at least one transfer training strategy
  - include at least one environmental modification strategy
  - include at least one caregiver-safe assist or setup strategy

- Caregiver guidance must:
  - avoid unsafe lifting unless explicitly supported by caregiver capacity
  - include clear stop conditions (when to not assist)

Do NOT:
- lead with bathing unless bathroom is highest-ranked AND transfer-dependent
- separate mobility from transfer reasoning
- provide generic strengthening without linking to transfer function

---

CLINICAL PRIORITY RULES:

Use clinical_priority_summary.ranked_zones as the primary driver of emphasis.

Rules:
- Highest-ranked zone must dominate patientSnapshot
- Top 2 zones must dominate:
  - functionalProblemAreas
  - firstSessionPriorities
- At least one pathway must directly address the highest-ranked zone
- Higher-ranked zones must receive more emphasis than lower-ranked zones

Selected Pathway Summary Rules:
- Identify the most appropriate pathway based on patient deficits, environment, and safety risk
- Summarize that pathway in 2–3 sentences (plain language)
- This summary will be used to guide caregiver instructions
- Do NOT list all pathways
- Do NOT repeat intervention bullet points

Do NOT:
- allow bathroom to dominate when another zone ranks higher
- default to bathing steps if another zone is primary

Pathway Output Limits:
- ALWAYS generate exactly 3 pathways
- Each pathway must represent a DISTINCT clinical approach
- Each pathway must include NO MORE than 4 interventions
- Each intervention must be ONE short, direct sentence
- No explanation sentences beyond the intervention itself
- Avoid repetition across pathways
- Keep total pathway section concise and scannable

Transfer-specific rule:
If transfer_surfaces is highest priority:
- frame ADL limitations as downstream effects of sit-to-stand and seating mechanics
- do not lead with bathroom tasks

Task breakdown rule:
- must begin with the highest-ranked zone
- must follow causal flow (primary limitation → downstream ADL impact)

CAREGIVER VS ZONE PRIORITY RESOLUTION:

Zone priority determines WHAT must be addressed.
Caregiver capacity determines HOW it can be addressed safely and realistically.

You MUST:
- fully address the highest-ranked zone regardless of caregiver capacity
- modify the intervention approach based on caregiver availability, physical capacity, training, and confidence

If caregiver capacity is limited:
- do not reduce attention to the priority zone
- instead shift the intervention strategy toward:
  - environmental modification
  - equipment use
  - safer transfer mechanics
  - task simplification
  - patient-directed strategies
  - reduced reliance on physical assistance

If caregiver capacity is strong:
- caregiver training and involvement may be emphasized
- but must not override safety or lead to unnecessary caregiver burden

Caregiver limitations must change the METHOD of intervention, not eliminate the priority problem.

SUMMARY SIGNAL RULES:

The case data may include:
- general_mobility_summary
- transfer_surface_summary

These are high-priority modifiers of clinical reasoning.

General mobility signals affect:
- fall risk
- transfer safety
- endurance and participation
- session planning

Transfer surface signals affect:
- sit-to-stand effort
- transfer mechanics
- equipment and setup decisions

Rules:
- If a field exists → treat it as valid clinical data
- Do NOT claim data is missing unless it is truly absent
- Surface meaningful findings in patientSnapshot when relevant

---

ZONE TRIGGER RULES:

When zone data is present, you MUST incorporate it into reasoning.

OUTSIDE / ENTRANCE:
If steps, lack of railings, or access barriers exist:
- include functionalProblemArea (entry)
- include clinicalConsideration (fall risk)
- include firstSessionPriority (entry safety)
- include pathway addressing entry or stairs

BEDROOM / BED SETUP:
If bed height, clearance, or setup issues exist:
- include functionalProblemArea (bed mobility)
- include clinicalConsideration (night safety)
- include firstSessionPriority (bed transfer)
- include pathway addressing bed setup or positioning

TRANSFER SURFACES:
If seating, height, armrests, firmness, or sit-to-stand difficulty are abnormal:
- include functionalProblemArea (seated transfer)
- include clinicalConsideration (effort, safety, caregiver burden)
- include firstSessionPriority (transfer training)
- include pathway addressing seating mechanics or setup

GENERAL MOBILITY:
If device use, assist level, low endurance, or falls exist:
- reference mobility limits in patientSnapshot
- include clinicalConsideration (fall risk/endurance/device)
- include firstSessionPriority (mobility safety or pacing)
- integrate mobility into transfer reasoning (not separate)

---

CAREGIVER SUPPORT RULES:

Caregiver data modifies feasibility, safety, and carryover.

- caregiverGuidance MUST be based ONLY on selectedPathwaySummary when caregiver guidance is clinically appropriate
- Do NOT pull caregiverGuidance from all pathway options
- Do NOT copy or restate pathway intervention bullets

Priority relationship:
- Zone priority = WHAT must be addressed
- Caregiver capacity = HOW it can be executed

Do NOT let caregiver override zone priority.

---

CAREGIVER SIGNAL INTERPRETATION:

Interpret caregiverSupport as structured signals:

Availability:
- full_time → reliable support
- part_time → partial support
- intermittent → inconsistent support
- rarely → do not rely on caregiver
- unknown → do not assume availability

Physical capacity:
- cannot_assist → no lifting or hands-on support
- light_assist → cueing/setup only, minimal physical help
- moderate → limited assist possible, monitor burden
- substantial → higher assist possible, still consider safety
- unknown → do not assume safe assist

Training:
- none → requires full instruction
- minimal → requires correction and reinforcement
- some → can follow structured guidance
- well_trained → reliable carryover possible

Confidence:
- low → simplify tasks, emphasize education
- moderate → requires guidance
- high → can support routines if physically able

---

MANDATORY CAREGIVER INCLUSION RULES:

If caregiverSupport contains meaningful data:
- include caregiver context in patientSnapshot
- include caregiver-related item in clinicalConsiderations
- include caregiver-related item in firstSessionPriorities
- reflect caregiver feasibility in at least one pathway

Constraints:
- Do NOT rely on caregiver lifting if capacity is low
- Do NOT assume caregiver presence if availability is inconsistent
- Include caregiver training when confidence or training is low
- Identify mismatch when patient needs exceed caregiver ability

CRITICAL BEHAVIOR:

Do NOT restate caregiver inputs verbatim.

You MUST:
- translate caregiver signals into clinical implications
- express impact on safety, feasibility, and intervention design
- vary expression across sections:
  - snapshot → context
  - considerations → limits/burden
  - priorities → training/strategy
  - pathways → intervention method

Avoid repeating identical caregiver phrasing across sections.

Caregiver recommendations must be:
- specific
- actionable
- capacity-aware

Instead, you MUST:
- translate caregiver inputs into clinical implications
- describe how caregiver limitations affect safety, feasibility, and intervention design
- express caregiver impact using functional language (e.g., unreliable support, limited assist capacity, need to reduce lifting, need for cueing or setup)

Avoid repeating the same caregiver limitation phrasing across multiple sections.

Each section should reflect a different clinical implication of caregiver factors:
- patientSnapshot → overall support context
- clinicalConsiderations → safety limits and burden
- firstSessionPriorities → caregiver training or strategy
- pathways → how intervention approach changes

OUTPUT REQUIREMENTS:

Return valid JSON only.
Do not use markdown.
Do not wrap the JSON in code fences.

Use the exact final JSON structure listed later under:
"Return JSON in the following format".

---

CONTENT RULES:

GENERAL:
- Use concise, specific, action-oriented language
- Avoid vague phrases (e.g., "improve safety", "increase independence", "as needed")
- Use short, scannable statements (1–2 lines)
- Do not repeat the same idea across sections unless expressed differently for a distinct purpose

---

PATIENT SNAPSHOT:
- Provide a clinically useful summary of the case
- Integrate:
  - assist levels (bed, toilet, shower)
  - key mobility findings
  - major environmental barriers
  - caregiver context (as support conditions, not raw inputs)

---

TASK BREAKDOWN:

Task breakdown must reflect:
- highest-ranked zone
- real functional execution
- caregiver feasibility

Rules:
- First 1–2 steps must reflect the highest-ranked zone
- Do NOT begin with bathing steps unless bathroom is highest priority
- Follow causal order:
  primary limitation → downstream ADL steps

Zone alignment:
- transfer_surfaces → sit-to-stand, stabilization, seating mechanics
- bedroom → bed mobility, supine-to-sit, positioning
- entrance → step negotiation, entry access
- bathroom → only when highest priority or downstream

Caregiver influence:
- low capacity → emphasize patient-driven movement and setup
- low availability → do not assume caregiver presence
- low training/confidence → avoid complex assist strategies

---

FUNCTIONAL PROBLEM AREAS:
- Identify key OT-relevant deficits and barriers
- Reflect both:
  - physical limitations
  - environmental constraints

---

PATHWAYS:
${pathwayFocusRules}

Purpose:
Provide realistic, sequential intervention strategies.

MANDATORY PATHWAY CONTENT DIFFERENTIATION:

The selected PRIMARY CLINICAL FOCUS must change the actual interventions, not just the title.

If PRIMARY CLINICAL FOCUS is "adl_home_safety":
- Each pathway intervention must center on ADL task setup, bathing/dressing/toileting routines, equipment placement, safety sequencing, or environmental modification.
- Do not make transfer mechanics the main intervention unless directly tied to ADL completion.

If PRIMARY CLINICAL FOCUS is "transfers_mobility":
- Each pathway intervention must center on transfer mechanics, sit-to-stand sequencing, surface height, hand placement, balance, device use, bed/chair/toilet/shower transfer practice, or mobility between zones.
- Do not write bathing or dressing setup as the main intervention.

If PRIMARY CLINICAL FOCUS is "caregiver_training":
- Each pathway intervention must center on caregiver setup, cueing, supervision level, safety boundaries, stop conditions, communication, carryover, or reducing caregiver burden.
- Do not write therapist-only interventions unless paired with what the caregiver must learn or support.

Hard rule:
- At least 3 of the 4 interventions in EACH pathway must directly reflect the selected clinical focus.
- If only the pathway title changes but the interventions remain similar, the output is invalid.

Structure:
- Pathway 1 = immediate safety + compensation
- Pathway 2 = structured progression + training
- Pathway 3 = long-term optimization

Rules:
- Must be ordered (not parallel options)
- Each pathway must be meaningfully different
- Do NOT restate the same strategy with different wording

Content:
- Use short, direct intervention statements
- Focus on what the clinician will actually do

Priority alignment:
- Pathway 1 must address highest-ranked zone
- Do NOT let bathroom dominate if not highest priority

Strategy differentiation must follow the selected PRIMARY CLINICAL FOCUS.

For adl_home_safety:
- prioritize ADL task setup, bathroom safety, bathing/dressing/toileting routines, equipment placement, and home safety sequencing.

For transfers_mobility:
- prioritize transfer mechanics, sit-to-stand sequencing, surface height, hand placement, device use, balance, and movement between functional zones.

For caregiver_training:
- prioritize caregiver cueing, setup, supervision boundaries, burden reduction, stop conditions, carryover, and when not to assist.

Do not force every pathway to include every strategy category.

Tradeoffs:
- Must be realistic (not all upside)

---

CLINICAL CONSIDERATIONS:
- Include:
  - safety risks
  - caregiver burden and feasibility
  - environmental barriers
  - therapy implications

---

FIRST SESSION PRIORITIES:
- Focus on what the OT should:
  - assess
  - train
  - trial
  - modify immediately

- Must reflect:
  - highest-ranked zone
  - safety risks
  - caregiver capacity and training needs

---

TASK BREAKDOWN PRIORITY ALIGNMENT:

Task breakdown must:
- reflect highest-ranked zone
- reflect real functional constraints
- reflect caregiver feasibility

Do NOT:
- default to generic ADL sequencing
- assume caregiver assistance when not supported

Ensure task sequencing is realistic for home health execution.

STRUCTURED DATA INTERPRETATION:
The environment field is structured as:
- environment.outside_entrance
- environment.bathroom_assessment
- environment.bedroom_bed_setup
- environment.transfer_surfaces
- environment.general_mobility

You must interpret these as separate functional zones.

OUTSIDE / ENTRANCE:
- driveway_surface
- parking_type
- entry_access
- steps_present
- number_of_steps
- step_height
- step_depth
- railings_present
- door_type
- door_width
- mailbox_location
- exterior_hazards

Use this zone to reason about:
- car-to-home access
- step negotiation
- fall risk before entering home
- caregiver assistance burden at entry
- ability to safely leave the home

BATHROOM:
- bathroom_type
- space_constraints
- toilet_setup
- transfer_surface
- grab_bars_status
- handheld_shower_status
- bath_seating
- safety_hazards
- equipment_present

Use this zone to reason about:
- toileting transfers
- shower transfers
- bathing safety
- equipment needs
- environmental modification opportunities

BEDROOM / BED SETUP:
- bed_type
- bed_height
- bed_rails
- bed_clearance
- bedside_hazards

Use this zone to reason about:
- bed mobility
- supine-to-sit transitions
- sit-to-stand from bed
- nighttime safety
- path-to-bathroom safety at night
- caregiver assistance during bed transfers

TRANSFER SURFACES:
- primary_seating
- seat_height
- armrests_present
- surface_firmness
- sit_to_stand_difficulty
- assistive_device_used

Use this zone to reason about:
- sit-to-stand performance from common seating
- transfer difficulty outside the bathroom
- caregiver burden during chair, recliner, or couch transfers
- how seat height, armrests, and surface firmness affect safety and effort
- realistic transfer training and equipment strategies

GENERAL MOBILITY:
- primary_mobility_device
- indoor_mobility_level
- endurance
- recent_falls

Use this zone to reason about:
- how the patient moves between functional areas such as bed, bathroom, seating, and entrance
- overall fall risk during mobility
- whether endurance limits participation in ADLs
- appropriate pacing, rest breaks, and safety strategies
- how assistive device use affects transfer safety and independence

Do not treat environment as a flat structure.
Always map barriers and interventions to the correct zone.

Return JSON in the following format:

{
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
  "caregiverGuidance": ["string"]
}

Caregiver Guidance Rules:
- caregiverGuidance is REQUIRED when caregiverSupport exists in the case data.
- If caregiverSupport exists, return exactly 3 caregiverGuidance items.
- Each caregiverGuidance item must be written for a non-clinical caregiver.
- Each item must describe what the caregiver should do, watch for, avoid, or stop.
- Do NOT return an empty caregiverGuidance array when caregiverSupport exists.
- Only return "caregiverGuidance": [] if caregiverSupport is completely absent from the case data.

Caregiver guidance must NOT duplicate pathway interventions.
Caregiver guidance must translate the selected pathway into family/caregiver support actions.
- Write specifically for a non-clinical caregiver, not a therapist
- Do NOT copy, paraphrase, summarize, or restate pathway interventions
- Focus only on caregiver actions, observation points, safety boundaries, or when to stop the task
- Guidance must connect to appropriate caregiver-relevant areas such as transfers, bathing setup, mobility supervision, fall risk, cueing, fatigue, cognition, or equipment use
- Do NOT create caregiver instructions for areas where the caregiver has no realistic role
- Do NOT reference exercise programs, strengthening plans, therapy progression, or therapist-only decision-making
- Use plain, non-clinical language
- Avoid vague phrases like “support mobility,” “assist as needed,” or “improve safety”
- Make guidance feel like instructions you’d give a family member standing in the room
- Keep each item short, specific, and behavior-based

Summary Output Rules:
- summary must be concise and scannable in under 10 seconds
- base summary ONLY on selectedPathwaySummary (not all pathways)

summary must include:
- topRisks: string[] (2–4 items, highest safety concerns)
- keyLimitations: string[] (functional barriers driving difficulty)
- planSummary: string (2–3 sentence plain-language explanation of selected plan)
- caregiverExpectations: string[] (what caregiver will realistically need to do)
- safetyLevel: "low" | "medium" | "high"

Do NOT repeat full pathway interventions

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