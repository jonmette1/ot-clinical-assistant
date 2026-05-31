import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildClinicalAttentionState } from "@/lib/longitudinal/buildClinicalAttentionState";
import { buildLongitudinalEvent } from "@/lib/longitudinal/buildLongitudinalEvent";
import { refreshOperationalPrioritizationFromEvent } from "@/lib/longitudinal/refreshOperationalPrioritizationFromEvent";
import { updateCurrentStateFromEvent } from "@/lib/longitudinal/updateCurrentStateFromEvent";
import type {
  CurrentLongitudinalState,
  LongitudinalEvent,
  OperationalPrioritization,
  ProgressionCheckInput,
} from "@/lib/longitudinal/longitudinalTypes";

type CaseRecord = Record<string, unknown>;

const CASE_SELECT = [
  "id",
  "title",
  "setting",
  "target_activities",
  "patient_profile",
  "functional_status",
  "environment",
  "goals_preferences",
  "feasibility_context",
  "clinical_constraints",
  "clinical_decision_input",
  "clinical_decision_model",
  "client_info",
  "caregiver_info",
  "case_classification",
  "generated_output",
  "original_baseline",
  "current_longitudinal_state",
  "clinical_attention_state",
].join(", ");

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function validateProgressionCheckInput(body: unknown): ProgressionCheckInput | null {
  if (!body || typeof body !== "object") return null;

  const payload = body as Record<string, unknown>;

  if (typeof payload.caseId !== "string" || payload.caseId.trim().length === 0) return null;
  if (
    typeof payload.currentDominantBarrier !== "string" ||
    payload.currentDominantBarrier.trim().length === 0
  ) {
    return null;
  }
  if (
    typeof payload.progressionStatus !== "string" ||
    payload.progressionStatus.trim().length === 0
  ) {
    return null;
  }
  if (typeof payload.treatmentDirectionChanged !== "boolean") return null;

  return {
    caseId: payload.caseId.trim(),
    functionalChanges:
      typeof payload.functionalChanges === "string" || Array.isArray(payload.functionalChanges)
        ? payload.functionalChanges
        : null,
    currentDominantBarrier: payload.currentDominantBarrier,
    secondaryBarrier:
      typeof payload.secondaryBarrier === "string" ? payload.secondaryBarrier : null,
    progressionStatus: payload.progressionStatus,
    treatmentDirectionChanged: payload.treatmentDirectionChanged,
    milestoneAchieved:
      typeof payload.milestoneAchieved === "string" ? payload.milestoneAchieved : null,
    caregiverChange:
      typeof payload.caregiverChange === "string" ? payload.caregiverChange : null,
    environmentalChange:
      typeof payload.environmentalChange === "string" ? payload.environmentalChange : null,
    medicalChange: typeof payload.medicalChange === "string" ? payload.medicalChange : null,
    reasonTreatmentChanged:
      typeof payload.reasonTreatmentChanged === "string" ? payload.reasonTreatmentChanged : null,
  };
}

function buildOriginalBaseline(caseData: CaseRecord) {
  const generatedOutput = caseData.generated_output as Record<string, unknown> | null | undefined;

  return {
    capturedAt: new Date().toISOString(),
    source: "progression_check_initialization",
    caseSnapshot: {
      title: caseData.title ?? null,
      setting: caseData.setting ?? null,
      target_activities: caseData.target_activities ?? null,
      patient_profile: caseData.patient_profile ?? null,
      functional_status: caseData.functional_status ?? null,
      environment: caseData.environment ?? null,
      goals_preferences: caseData.goals_preferences ?? null,
      caregiver_info: caseData.caregiver_info ?? null,
      case_classification: caseData.case_classification ?? null,
      clinical_decision_input: caseData.clinical_decision_input ?? null,
      clinical_decision_model: caseData.clinical_decision_model ?? null,
      generated_progression_state: generatedOutput?.progression_state ?? null,
      operational_prioritization: generatedOutput?.operational_prioritization ?? null,
    },
  };
}

async function insertLongitudinalEvent({
  event,
  previousStateSnapshot,
  currentStateSnapshot,
  clinicalAttentionSnapshot,
  operationalEmphasisSnapshot,
}: {
  event: LongitudinalEvent;
  previousStateSnapshot: unknown;
  currentStateSnapshot: CurrentLongitudinalState;
  clinicalAttentionSnapshot: unknown;
  operationalEmphasisSnapshot: unknown;
}) {
  const { data, error } = await supabase
    .from("longitudinal_events")
    .insert([
      {
        case_id: event.caseId,
        event_type: event.eventType,
        event_payload: event,
        previous_state_snapshot: previousStateSnapshot,
        current_state_snapshot: currentStateSnapshot,
        clinical_attention_snapshot: clinicalAttentionSnapshot,
        operational_emphasis_snapshot: operationalEmphasisSnapshot,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = validateProgressionCheckInput(body);

    if (!input) {
      return jsonError(
        "Invalid progression check payload. caseId, currentDominantBarrier, progressionStatus, and treatmentDirectionChanged are required."
      );
    }

    const { data: caseData, error: loadError } = await supabase
      .from("cases")
      .select(CASE_SELECT)
      .eq("id", input.caseId)
      .single();

    if (loadError || !caseData) {
      return jsonError(loadError?.message || "Case not found.", 404);
    }

    const loadedCase = caseData as unknown as CaseRecord;

    const baselineWasInitialized = !loadedCase.original_baseline;
    const originalBaseline = baselineWasInitialized
      ? buildOriginalBaseline(loadedCase)
      : loadedCase.original_baseline;

    if (baselineWasInitialized) {
      // Baseline preservation: initialize original_baseline once and guard against future overwrites.
      const { error: baselineError } = await supabase
        .from("cases")
        .update({ original_baseline: originalBaseline })
        .eq("id", input.caseId)
        .is("original_baseline", null);

      if (baselineError) throw baselineError;
    }

    const event = buildLongitudinalEvent(input);
    const previousStateSnapshot = loadedCase.current_longitudinal_state ?? null;

    const currentLongitudinalState = updateCurrentStateFromEvent({
      previousState: previousStateSnapshot as
        | Partial<CurrentLongitudinalState>
        | null
        | undefined,
      event,
    });

    const clinicalAttentionState = buildClinicalAttentionState({
      currentState: currentLongitudinalState,
      event,
    });

    const existingGeneratedOutput =
      (loadedCase.generated_output as Record<string, unknown> | null | undefined) || null;
    const generatedOutput = input.treatmentDirectionChanged
      ? {
          ...(existingGeneratedOutput || {}),
          operational_prioritization: refreshOperationalPrioritizationFromEvent({
            existingOperationalPrioritization:
              (existingGeneratedOutput?.operational_prioritization as
                | OperationalPrioritization
                | null
                | undefined) || null,
            event,
            clinicalAttentionState,
          }),
        }
      : existingGeneratedOutput;

    const operationalEmphasisSnapshot =
      (generatedOutput?.operational_prioritization as OperationalPrioritization | undefined) ??
      null;

    const insertedEvent = await insertLongitudinalEvent({
      event,
      previousStateSnapshot,
      currentStateSnapshot: currentLongitudinalState,
      clinicalAttentionSnapshot: clinicalAttentionState,
      operationalEmphasisSnapshot,
    });

    const updatePayload: Record<string, unknown> = {
      current_longitudinal_state: currentLongitudinalState,
      clinical_attention_state: clinicalAttentionState,
    };

    // Conditional operational prioritization refresh: false preserves generated_output.operational_prioritization unchanged.
    if (input.treatmentDirectionChanged) {
      updatePayload.generated_output = generatedOutput;
    }

    const { data: updatedCase, error: updateError } = await supabase
      .from("cases")
      .update(updatePayload)
      .eq("id", input.caseId)
      .select(
        "id, original_baseline, current_longitudinal_state, clinical_attention_state, generated_output"
      )
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      event: insertedEvent,
      current_longitudinal_state: currentLongitudinalState,
      clinical_attention_state: clinicalAttentionState,
      generated_output: updatedCase?.generated_output ?? generatedOutput,
      baselineInitialized: baselineWasInitialized,
      validation: {
        longitudinalEventCreated: true,
        originalBaselinePreserved: true,
        currentStateMutated: true,
        clinicalAttentionMutated: true,
        operationalPrioritizationRefreshed: input.treatmentDirectionChanged === true,
        generationsUntouched: true,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown progression check error.";
    return jsonError(message, 500);
  }
}
