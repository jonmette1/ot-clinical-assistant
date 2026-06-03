"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { buildClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import type { ClinicalDecisionInput, ClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import { buildClinicalDecisionInputFromCase } from "@/lib/buildClinicalDecisionInput";
import { buildProgressionState } from "@/lib/buildProgressionState";


const requiredFieldBaseClass =
  "rounded-xl border border-sky-500/35 bg-sky-950/5 p-3 transition-colors scroll-mt-28";
const requiredFieldCompleteClass =
  "rounded-xl border border-gray-800/80 p-3 transition-colors scroll-mt-28";
const requiredControlBaseClass =
  "w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3";

function getRequiredFieldClass(isComplete: boolean) {
  return isComplete ? requiredFieldCompleteClass : requiredFieldBaseClass;
}

function getRequiredControlClass(isComplete: boolean) {
  return `${requiredControlBaseClass} ${
    isComplete ? "" : "border-sky-500/45 shadow-[0_0_0_1px_rgba(14,165,233,0.08)]"
  }`;
}

function scrollToPlanReadinessField(targetId: string) {
  const target = document.getElementById(targetId);

  if (!target) return;

  const stickyHeaderOffset = 96;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(targetTop - stickyHeaderOffset, 0),
    behavior: "smooth",
  });
}

export default function NewCasePage() {

  // ==============================
  // STATE: CASE BASICS
  // ==============================

  const [ageRange, setAgeRange] = useState("70-79");
  
    // ==============================
  // ROUTER
  // ==============================
  
  const router = useRouter();
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
 const [targetActivity, setTargetActivity] = useState("Bathing");
const [assistanceLevel, setAssistanceLevel] = useState("3");
const [adlAssistLevels, setAdlAssistLevels] = useState({
  bed_transfer: "3",
  toilet_transfer: "3",
  shower_transfer: "3",
});
const [primaryGoal, setPrimaryGoal] = useState("");
  const [keyBarriers, setKeyBarriers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ==============================
  // STATE: DECSION ENGINE
  // ==============================

  // ==============================
  // STATE: CLIENT + CAREGIVER
  // ==============================

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverRelationship, setCaregiverRelationship] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [caregiverAvailability, setCaregiverAvailability] = useState("");
const [caregiverPhysicalCapacity, setCaregiverPhysicalCapacity] = useState("");
const [caregiverTrainingLevel, setCaregiverTrainingLevel] = useState("");
const [caregiverConfidence, setCaregiverConfidence] = useState("");
const [caregiverPriorities, setCaregiverPriorities] = useState("");
const [caregiverIsPrimarySupport, setCaregiverIsPrimarySupport] = useState(false);
  const [caseType, setCaseType] = useState("geriatric");
  const [clinicalFocus, setClinicalFocus] = useState("adl_home_safety");

  // ==============================
  // STATE: HOME ASSESSMENT - BATHROOM
  // ==============================

const [bathroomType, setBathroomType] = useState("tub_shower_combo");
const [spaceConstraints, setSpaceConstraints] = useState("moderate");
const [safetyHazards, setSafetyHazards] = useState<string[]>([]);
const [equipmentPresent, setEquipmentPresent] = useState<string[]>([]);
const [toiletSetup, setToiletSetup] = useState("standard");
const [transferSurface, setTransferSurface] = useState("tub_edge");
const [grabBarsStatus, setGrabBarsStatus] = useState("none");
const [handheldShowerStatus, setHandheldShowerStatus] = useState("no");
const [bathSeating, setBathSeating] = useState("none");
  const [otherTargetActivity, setOtherTargetActivity] = useState("");
  const [otherKeyBarriers, setOtherKeyBarriers] = useState("");
  const [otherSafetyHazards, setOtherSafetyHazards] = useState("");
  const [otherEquipmentPresent, setOtherEquipmentPresent] = useState("");

  // ==============================
  // STATE: HOME ASSESSMENT - BEDROOM / TRANSFERS / MOBILITY
  // ==============================

  const [bedType, setBedType] = useState("standard");
const [bedHeight, setBedHeight] = useState("");
const [bedRails, setBedRails] = useState("none");
const [bedClearance, setBedClearance] = useState("adequate");
const [bedHazards, setBedHazards] = useState<string[]>([]);
const [primarySeating, setPrimarySeating] = useState("chair");
const [seatHeight, setSeatHeight] = useState("standard");
const [armrestsPresent, setArmrestsPresent] = useState("yes");
const [surfaceFirmness, setSurfaceFirmness] = useState("firm");
const [sitToStandDifficulty, setSitToStandDifficulty] = useState("none");
const [mobilityDevice, setMobilityDevice] = useState("none");
const [indoorMobilityLevel, setIndoorMobilityLevel] = useState("independent");
const [mobilityEndurance, setMobilityEndurance] = useState("moderate");
const [recentFalls, setRecentFalls] = useState("no");

// ==============================
// STATE: REAL-WORLD CONSTRAINTS
// ==============================

const [financialConstraint, setFinancialConstraint] = useState("unknown");
const [environmentalConstraint, setEnvironmentalConstraint] = useState("unknown");
const [equipmentAccess, setEquipmentAccess] = useState("unknown");

  // ==============================
  // STATE: HOME ASSESSMENT - OUTSIDE / ENTRANCE
  // ==============================

const [drivewaySurface, setDrivewaySurface] = useState("smooth");
const [parkingType, setParkingType] = useState("driveway");
const [entryAccess, setEntryAccess] = useState("front");

const [stepsPresent, setStepsPresent] = useState("no");
const [numberOfSteps, setNumberOfSteps] = useState("");
const [stepHeight, setStepHeight] = useState("");
const [stepDepth, setStepDepth] = useState("");

const [railingsPresent, setRailingsPresent] = useState("no");

const [doorType, setDoorType] = useState("standard");
const [doorWidth, setDoorWidth] = useState("");

const [mailboxLocation, setMailboxLocation] = useState("porch");

const [exteriorHazards, setExteriorHazards] = useState<string[]>([]);
const [otherExteriorHazards, setOtherExteriorHazards] = useState("");

  // ==============================
  // OPTIONS
  // ==============================

  const barriers = [
    "Balance",
    "Strength",
    "ROM",
    "Pain",
    "Endurance",
    "Cognition",
    "Sequencing",
    "Fear/Anxiety",
    "Environment",
  ];
const hazardOptions = [
  "Slippery surfaces",
  "Poor lighting",
  "Loose rugs",
  "Clutter",
  "No grab bars",
  "High tub wall",
];

const equipmentOptions = [
  "Grab bars",
  "Shower chair",
  "Tub bench",
  "Handheld shower",
  "Raised toilet seat",
  "Reacher",
];

const assistLevelOptions = [
  { value: "1", label: "1 - Total Assist" },
  { value: "2", label: "2 - Maximal Assist" },
  { value: "3", label: "3 - Moderate Assist" },
  { value: "4", label: "4 - Minimal Assist" },
  { value: "5", label: "5 - Supervision" },
  { value: "6", label: "6 - Modified Independence" },
  { value: "7", label: "7 - Total Independence" },
];

  // ==============================
  // CLINICAL PRIORITY SCORING HELPERS
  // ==============================

function getAssistSeverityScore(value: string) {
  switch (value) {
    case "1":
      return 5;
    case "2":
      return 4;
    case "3":
      return 3;
    case "4":
      return 2;
    case "5":
      return 1;
    case "6":
    case "7":
    default:
      return 0;
  }
}

function getPriorityLabel(score: number) {
  if (score >= 8) return "high";
  if (score >= 5) return "moderate";
  return "low";
}

function rankZones<T extends { zone: string; score: number; drivers: string[] }>(
  zones: T[]
) {
  return zones
    .map((zone) => ({
      ...zone,
      priority: getPriorityLabel(zone.score),
    }))
    .sort((a, b) => b.score - a.score);
}

function getAssistLevelLabel(value: string) {
  return (
    assistLevelOptions.find((option) => option.value === value)?.label || value
  );
}

function buildClinicalPrioritySummary() {
  const bathroomDrivers: string[] = [];
  let bathroomScore = 0;

  bathroomScore += Math.max(
    getAssistSeverityScore(adlAssistLevels.toilet_transfer),
    getAssistSeverityScore(adlAssistLevels.shower_transfer)
  );

  if (adlAssistLevels.shower_transfer <= "3") {
    bathroomDrivers.push("shower transfer limitation");
  }
  if (adlAssistLevels.toilet_transfer <= "3") {
    bathroomDrivers.push("toilet transfer limitation");
  }
  if (grabBarsStatus === "none") {
    bathroomScore += 2;
    bathroomDrivers.push("no grab bars");
  }
  if (spaceConstraints === "significant") {
    bathroomScore += 1;
    bathroomDrivers.push("significant space constraints");
  }
  if (bathroomType === "tub_shower_combo") {
    bathroomScore += 1;
    bathroomDrivers.push("tub/shower combo");
  }
  if (safetyHazards.length >= 2) {
    bathroomScore += 2;
    bathroomDrivers.push("multiple bathroom safety hazards");
  } else if (safetyHazards.length === 1) {
    bathroomScore += 1;
    bathroomDrivers.push("bathroom safety hazard present");
  }

  const entranceDrivers: string[] = [];
  let entranceScore = 0;

  if (stepsPresent === "yes") {
    entranceScore += 2;
    entranceDrivers.push("steps present at entry");
  }
  if (numberOfSteps.trim() !== "") {
    entranceScore += 1;
    entranceDrivers.push("entry stair negotiation required");
  }
  if (railingsPresent === "no" && stepsPresent === "yes") {
    entranceScore += 2;
    entranceDrivers.push("no railings at entry");
  }
  if (drivewaySurface === "rough" || drivewaySurface === "inclined") {
    entranceScore += 1;
    entranceDrivers.push("challenging driveway surface");
  }
  if (exteriorHazards.length >= 2) {
    entranceScore += 2;
    entranceDrivers.push("multiple exterior hazards");
  } else if (exteriorHazards.length === 1) {
    entranceScore += 1;
    entranceDrivers.push("exterior hazard present");
  }
  if (doorWidth.trim() !== "") {
    entranceDrivers.push("doorway access consideration");
  }

  const bedroomDrivers: string[] = [];
  let bedroomScore = 0;

  bedroomScore += getAssistSeverityScore(adlAssistLevels.bed_transfer);

  if (adlAssistLevels.bed_transfer <= "3") {
    bedroomDrivers.push("bed transfer limitation");
  }
  if (bedRails === "none") {
    bedroomScore += 1;
    bedroomDrivers.push("no bed rails");
  }
  if (bedClearance === "limited") {
    bedroomScore += 1;
    bedroomDrivers.push("limited bed clearance");
  }
  if (bedClearance === "very_limited") {
    bedroomScore += 2;
    bedroomDrivers.push("very limited bed clearance");
  }
  if (bedHeight.trim() !== "") {
    bedroomScore += 1;
    bedroomDrivers.push("bed height concern");
  }
if (bedHazards.length > 0) {
  bedroomScore += 1;
  bedroomDrivers.push("nighttime or bedside hazards");
}

  const transferDrivers: string[] = [];
  let transferScore = 0;

  if (sitToStandDifficulty === "mild") {
    transferScore += 1;
    transferDrivers.push("mild sit-to-stand difficulty");
  }
  if (sitToStandDifficulty === "moderate") {
    transferScore += 3;
    transferDrivers.push("moderate sit-to-stand difficulty");
  }
  if (sitToStandDifficulty === "severe") {
    transferScore += 4;
    transferDrivers.push("severe sit-to-stand difficulty");
  }
  if (seatHeight === "low") {
    transferScore += 2;
    transferDrivers.push("low seat height");
  }
  if (armrestsPresent === "no") {
    transferScore += 2;
    transferDrivers.push("no armrests");
  }
  if (surfaceFirmness === "soft") {
    transferScore += 1;
    transferDrivers.push("soft seating surface");
  }
  if (surfaceFirmness === "very_soft") {
    transferScore += 2;
    transferDrivers.push("very soft seating surface");
  }
  if (mobilityEndurance === "low") {
  transferScore += 1;
  transferDrivers.push("low endurance impacting transfers");
}

if (recentFalls === "yes") {
  transferScore += 2;
  transferDrivers.push("recent fall history");
}

  return {
    ranked_zones: rankZones([
      {
        zone: "bathroom",
        score: bathroomScore,
        drivers: bathroomDrivers,
      },
      {
        zone: "outside_entrance",
        score: entranceScore,
        drivers: entranceDrivers,
      },
      {
        zone: "bedroom_bed_setup",
        score: bedroomScore,
        drivers: bedroomDrivers,
      },
      {
        zone: "transfer_surfaces",
        score: transferScore,
        drivers: transferDrivers,
      },
    ]),
  };
}

  // ==============================
  // FORM UPDATE HELPERS
  // ==============================

  function toggleBarrier(barrier: string) {
    setKeyBarriers((prev) =>
      prev.includes(barrier)
        ? prev.filter((item) => item !== barrier)
        : [...prev, barrier]
    );
  }
function toggleSafetyHazard(hazard: string) {
  setSafetyHazards((prev) =>
    prev.includes(hazard)
      ? prev.filter((item) => item !== hazard)
      : [...prev, hazard]
  );
}

function toggleEquipment(item: string) {
  setEquipmentPresent((prev) =>
    prev.includes(item)
      ? prev.filter((existing) => existing !== item)
      : [...prev, item]
  );
}

function updateAdlAssistLevel(
  field: "bed_transfer" | "toilet_transfer" | "shower_transfer",
  value: string
) {
  setAdlAssistLevels((prev) => ({
    ...prev,
    [field]: value,
  }));
}

  const planReadinessItems = useMemo(
    () => [
      {
        id: "client-name",
        label: "Client Name",
        isComplete: clientName.trim().length > 0,
      },
      {
        id: "primary-diagnosis",
        label: "Diagnosis",
        isComplete: primaryDiagnosis.trim().length > 0,
      },
      {
        id: "primary-goal",
        label: "Primary Goal",
        isComplete: primaryGoal.trim().length > 0,
      },
      {
        id: "key-barrier",
        label: "Key Barrier",
        isComplete: keyBarriers.length > 0 || otherKeyBarriers.trim().length > 0,
      },
      {
        id: "caregiver-availability",
        label: "Caregiver Availability",
        isComplete: caregiverAvailability.trim().length > 0,
      },
      {
        id: "caregiver-assist-ability",
        label: "Assist Ability",
        isComplete: caregiverPhysicalCapacity.trim().length > 0,
      },
      {
        id: "caregiver-confidence",
        label: "Caregiver Confidence",
        isComplete: caregiverConfidence.trim().length > 0,
      },
    ],
    [
      caregiverAvailability,
      caregiverConfidence,
      caregiverPhysicalCapacity,
      clientName,
      keyBarriers,
      otherKeyBarriers,
      primaryDiagnosis,
      primaryGoal,
    ]
  );
  const completedReadinessItems = planReadinessItems.filter(
    (item) => item.isComplete
  ).length;
  const isPlanReady = completedReadinessItems === planReadinessItems.length;

  // ==============================
  // GENERATE PLAN + SAVE CASE
  // ==============================

function validateMinimumIntake() {
  const errors: string[] = [];

  if (!clientName.trim()) errors.push("Enter the client name.");
  if (!ageRange.trim()) errors.push("Select an age range.");
  if (!primaryDiagnosis.trim()) errors.push("Select a primary diagnosis.");
  if (!targetActivity.trim()) errors.push("Select a target activity.");
  if (!primaryGoal.trim()) errors.push("Enter the primary goal for this plan.");
  if (!assistanceLevel.trim()) errors.push("Select a current assistance level.");
  if (!adlAssistLevels.bed_transfer.trim()) errors.push("Select bed transfer assistance.");
  if (!adlAssistLevels.toilet_transfer.trim()) errors.push("Select toilet transfer assistance.");
  if (!adlAssistLevels.shower_transfer.trim()) errors.push("Select shower transfer assistance.");
  if (keyBarriers.length === 0 && !otherKeyBarriers.trim()) {
    errors.push("Select at least one key barrier or describe another key barrier.");
  }
  if (!recentFalls.trim()) errors.push("Confirm whether there have been recent falls.");
  if (!mobilityDevice.trim()) errors.push("Select the mobility device currently used.");
  if (!mobilityEndurance.trim()) errors.push("Select the current endurance level.");
  if (!sitToStandDifficulty.trim()) errors.push("Select sit-to-stand difficulty.");
  if (!caregiverAvailability.trim()) errors.push("Select caregiver availability.");
  if (!caregiverPhysicalCapacity.trim()) {
    errors.push("Select caregiver ability to physically assist.");
  }
  if (!caregiverConfidence.trim()) errors.push("Select caregiver confidence.");
  if (!bathroomType.trim()) errors.push("Select the bathroom setup.");
  if (!spaceConstraints.trim()) errors.push("Select the space constraints.");
  if (!environmentalConstraint.trim()) errors.push("Select the home setup complexity.");

  return errors;
}

async function generateLocalPlan() {
  setSaveMessage("");
  const intakeErrors = validateMinimumIntake();

  if (intakeErrors.length > 0) {
    setValidationErrors(intakeErrors);
    return;
  }

  setValidationErrors([]);
  setIsSaving(true);

  const clinicalPrioritySummary = buildClinicalPrioritySummary();
const casePayload = {
  case_classification: {
    case_type: caseType,
    clinical_focus: clinicalFocus,
  },

  patient_profile: {
    age_range: ageRange,
    primary_diagnosis: primaryDiagnosis,
  },

  functional_status: {
    current_assistance_level: assistanceLevel,
    adl_assist_levels: adlAssistLevels,
    key_barriers: keyBarriers,
    other_key_barriers: otherKeyBarriers,

    clinical_priority_summary: clinicalPrioritySummary,

    general_mobility_summary: {
      primary_mobility_device: mobilityDevice,
      indoor_mobility_level: indoorMobilityLevel,
      endurance: mobilityEndurance,
      recent_falls: recentFalls,
    },

    transfer_surface_summary: {
      primary_seating: primarySeating,
      seat_height: seatHeight,
      armrests_present: armrestsPresent,
      surface_firmness: surfaceFirmness,
      sit_to_stand_difficulty: sitToStandDifficulty,
    },
  },

  environment: {
    bathroom_assessment: {
      bathroom_type: bathroomType,
      space_constraints: spaceConstraints,
      toilet_setup: toiletSetup,
      transfer_surface: transferSurface,
      grab_bars_status: grabBarsStatus,
      handheld_shower_status: handheldShowerStatus,
      bath_seating: bathSeating,
      safety_hazards: safetyHazards,
      equipment_present: equipmentPresent,
      other_safety_hazards: otherSafetyHazards,
      other_equipment_present: otherEquipmentPresent,
    },

    transfer_surfaces: {
      primary_seating: primarySeating,
      seat_height: seatHeight,
      armrests_present: armrestsPresent,
      surface_firmness: surfaceFirmness,
      sit_to_stand_difficulty: sitToStandDifficulty,
    },

    general_mobility: {
      primary_mobility_device: mobilityDevice,
      indoor_mobility_level: indoorMobilityLevel,
      endurance: mobilityEndurance,
      recent_falls: recentFalls,
    },

    bedroom_bed_setup: {
      bed_type: bedType,
      bed_height: bedHeight,
      bed_rails: bedRails,
      bed_clearance: bedClearance,
      bedside_hazards: bedHazards,
    },

    outside_entrance: {
      driveway_surface: drivewaySurface,
      parking_type: parkingType,
      entry_access: entryAccess,
      steps_present: stepsPresent,
      number_of_steps: numberOfSteps,
      step_height: stepHeight,
      step_depth: stepDepth,
      railings_present: railingsPresent,
      door_type: doorType,
      door_width: doorWidth,
      mailbox_location: mailboxLocation,
      exterior_hazards: exteriorHazards,
      other_exterior_hazards: otherExteriorHazards,
    },
  },

  caregiverSupport: {
    caregiver_name: caregiverName,
    relationship: caregiverRelationship,
    phone: caregiverPhone,
    availability: caregiverAvailability,
    physical_capacity: caregiverPhysicalCapacity,
    training_level: caregiverTrainingLevel,
    confidence: caregiverConfidence,
    priorities: caregiverPriorities,
    is_primary_support: caregiverIsPrimarySupport,
  },

feasibility_context: {
  financial_constraint: financialConstraint,
  environmental_constraint: environmentalConstraint,
  equipment_access: equipmentAccess,
},

  goals_preferences: {
    primary_goal: primaryGoal,
    other_target_activity: otherTargetActivity,
  },

clinical_decision_inputs: null as ClinicalDecisionInput | null,

clinicalDecisionModel: null as ClinicalDecisionModel | null,
};

const clinicalDecisionInput = buildClinicalDecisionInputFromCase(casePayload);

casePayload.clinical_decision_inputs = clinicalDecisionInput;

console.log("Decision input before engine:", clinicalDecisionInput);

const modelInput: ClinicalDecisionInput = {
  goalCategory: clinicalDecisionInput.goalCategory || "Safety",
  dominantBarrier: clinicalDecisionInput.dominantBarrier || "Physical",
  dominantBarrierSeverity: clinicalDecisionInput.dominantBarrierSeverity || 2,
  secondaryBarrier: clinicalDecisionInput.secondaryBarrier,
  secondaryBarrierSeverity: clinicalDecisionInput.secondaryBarrierSeverity,
  safetyRiskLevel: clinicalDecisionInput.safetyRiskLevel || "medium",
  supportLevel: clinicalDecisionInput.supportLevel || "Intermittent Support",
  clinicalLens:
    clinicalDecisionInput.clinicalLens?.length > 0
      ? clinicalDecisionInput.clinicalLens
      : ["Cognitive"],
  environmentContext:
    clinicalDecisionInput.environmentContext?.length > 0
      ? clinicalDecisionInput.environmentContext
      : ["Home – General Mobility"],
};

const clinicalDecisionModel = buildClinicalDecisionModel(modelInput);

casePayload.clinicalDecisionModel = clinicalDecisionModel;

const canonicalPayloadForProgression = {
  ...casePayload,
  clinicalDecisionInput,
  clinicalDecisionModel,
  clinical_focus:
    casePayload.case_classification?.clinical_focus || "adl_home_safety",
  executionFocus:
    casePayload.case_classification?.clinical_focus || "adl_home_safety",
};

const progressionState = buildProgressionState({
  canonicalCasePayload: canonicalPayloadForProgression,
});

console.log("clinicalDecisionModel", clinicalDecisionModel);
console.log("progressionState", progressionState);

// ==============================
// HELPERS: AI PLAN INPUT
// ==============================

console.log(
  "BEFORE planInput → clinicalDecisionModel:",
  casePayload.clinicalDecisionModel
);

const planInput = {
  case_classification: casePayload.case_classification,
  clinicalDecisionModel: (() => {
  console.log("INJECTING INTO planInput:", casePayload.clinicalDecisionModel);
  return casePayload.clinicalDecisionModel;
})(),
  patient_profile: casePayload.patient_profile,
  target_activities: [targetActivity],

  goals_preferences: casePayload.goals_preferences,

  functional_status: {
    current_assistance_level:
      casePayload.functional_status.current_assistance_level,
    adl_assist_levels:
      casePayload.functional_status.adl_assist_levels,
    key_barriers:
      casePayload.functional_status.key_barriers,
    other_key_barriers:
      casePayload.functional_status.other_key_barriers,
    clinical_priority_summary:
      casePayload.functional_status.clinical_priority_summary,
    general_mobility_summary:
      casePayload.functional_status.general_mobility_summary,
    transfer_surface_summary:
      casePayload.functional_status.transfer_surface_summary,
  },

  environment: {
    bathroom_assessment: casePayload.environment.bathroom_assessment,
    transfer_surfaces: casePayload.environment.transfer_surfaces,
    general_mobility: casePayload.environment.general_mobility,
    bedroom_bed_setup: casePayload.environment.bedroom_bed_setup,
    outside_entrance: casePayload.environment.outside_entrance,
  },

  caregiverSupport: casePayload.caregiverSupport,
  feasibility_context: casePayload.feasibility_context,
  progression_state: progressionState,
};

console.log(
  "INSIDE planInput → clinicalDecisionModel:",
  planInput.clinicalDecisionModel
);

const aiResponse = await fetch("/api/generate-plan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
body: JSON.stringify(planInput),
});

  const aiData = await aiResponse.json();

  if (!aiData.success || !aiData.plan) {
    setSaveMessage(
      `AI generation failed: ${aiData.error || "Unknown error"}`
    );
    setIsSaving(false);
    return;
  }

const plan = {
  ...aiData.plan,
  progression_state: progressionState,
};

console.log("FULL AI PLAN:", plan);

const { data: insertedCases, error } = await supabase
  .from("cases")
  .insert([
    {
      title: `${targetActivity} case - ${primaryDiagnosis || "Untitled"}`,
      setting: "home_health_ot",
      target_activities: [targetActivity],
      patient_profile: {
        age_range: ageRange,
        primary_diagnosis: primaryDiagnosis,
      },
    functional_status: {
  current_assistance_level: assistanceLevel,
  adl_assist_levels: adlAssistLevels,
  key_barriers: keyBarriers,
  other_key_barriers: otherKeyBarriers,

  clinical_priority_summary: clinicalPrioritySummary,
general_mobility_summary: {
  primary_mobility_device: mobilityDevice,
  indoor_mobility_level: indoorMobilityLevel,
  endurance: mobilityEndurance,
  recent_falls: recentFalls,
},
transfer_surface_summary: {
  primary_seating: primarySeating,
  seat_height: seatHeight,
  armrests_present: armrestsPresent,
  surface_firmness: surfaceFirmness,
  sit_to_stand_difficulty: sitToStandDifficulty,
},
},
environment: {
  bathroom_assessment: {
    bathroom_type: bathroomType,
    space_constraints: spaceConstraints,
    toilet_setup: toiletSetup,
    transfer_surface: transferSurface,
    grab_bars_status: grabBarsStatus,
    handheld_shower_status: handheldShowerStatus,
    bath_seating: bathSeating,
    safety_hazards: safetyHazards,
    equipment_present: equipmentPresent,
    other_safety_hazards: otherSafetyHazards,
    other_equipment_present: otherEquipmentPresent,
  },
  transfer_surfaces: {
  primary_seating: primarySeating,
  seat_height: seatHeight,
  armrests_present: armrestsPresent,
  surface_firmness: surfaceFirmness,
  sit_to_stand_difficulty: sitToStandDifficulty,
},
general_mobility: {
  primary_mobility_device: mobilityDevice,
  indoor_mobility_level: indoorMobilityLevel,
  endurance: mobilityEndurance,
  recent_falls: recentFalls,
},
    bedroom_bed_setup: {
    bed_type: bedType,
    bed_height: bedHeight,
    bed_rails: bedRails,
    bed_clearance: bedClearance,
    bedside_hazards: bedHazards,
  },

  outside_entrance: {
    driveway_surface: drivewaySurface,
    parking_type: parkingType,
    entry_access: entryAccess,

    steps_present: stepsPresent,
    number_of_steps: numberOfSteps,
    step_height: stepHeight,
    step_depth: stepDepth,

    railings_present: railingsPresent,

    door_type: doorType,
    door_width: doorWidth,

    mailbox_location: mailboxLocation,

    exterior_hazards: exteriorHazards,
    other_exterior_hazards: otherExteriorHazards,
  },
},

goals_preferences: {
  primary_goal: primaryGoal,
  other_target_activity: otherTargetActivity,
},

feasibility_context: {
  financial_constraint: financialConstraint || "unknown",
  environmental_constraint: environmentalConstraint || "unknown",
  equipment_access: equipmentAccess || "unknown",
},

clinical_constraints: {},
clinical_decision_input: clinicalDecisionInput,


      client_info: {
        client_name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress,
      },

caregiver_info: {
  caregiver_name: caregiverName,
  relationship: caregiverRelationship,
  phone: caregiverPhone,
  availability: caregiverAvailability,
  physical_capacity: caregiverPhysicalCapacity,
  training_level: caregiverTrainingLevel,
  confidence: caregiverConfidence,
  priorities: caregiverPriorities,
  is_primary_support: caregiverIsPrimarySupport,
},

      generated_output: plan,
    },
    ])
   .select("id")
  .single();

  console.log("INSERT RESULT:", insertedCases);
console.log("INSERT ERROR:", error);



 if (error) {
  setSaveMessage(
    `Case generated, but save failed: ${error.message || "Unknown error"}`
  );
} else {
  const insertedCaseId = insertedCases?.id;

if (insertedCaseId) {
  await supabase.from("generations").insert([
    {
      case_id: insertedCaseId,
      prompt_version: "v1-ai",
      input_payload: casePayload,
      output_payload: plan,
    },
  ]);

  router.push(`/cases/${insertedCaseId}`);
  return;
}

setSaveMessage("Case generated with AI and saved successfully.");
}

  setIsSaving(false);
}
   
  // ==============================
  // PAGE UI
  // ==============================

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10 pb-28">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">New OT Case</h1>
        <p className="mb-8 text-gray-400">
          Enter the highest-signal clinical details first so the generated plan reflects the current patient picture.
        </p>

        {validationErrors.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-sm text-red-100">
            <h2 className="mb-2 text-base font-semibold text-red-50">
              Update these items before generating the plan.
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="space-y-8">
          <section
            aria-labelledby="plan-readiness-heading"
            className="rounded-2xl border border-sky-500/30 bg-sky-950/10 p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2 border-b border-sky-500/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Plan Readiness
                </p>
                <h2 id="plan-readiness-heading" className="text-xl font-semibold">
                  {isPlanReady ? "Ready to generate" : "Required clinical inputs"}
                </h2>
              </div>
              <p className="text-sm font-medium text-sky-100">
                {completedReadinessItems} of {planReadinessItems.length} complete
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {planReadinessItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToPlanReadinessField(item.id)}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left text-sm text-gray-200 transition hover:border-sky-500/25 hover:bg-sky-950/20 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  aria-label={`Jump to ${item.label}`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      item.isComplete
                        ? "border-sky-300/60 bg-sky-400/10 text-sky-100"
                        : "border-gray-600 text-gray-500"
                    }`}
                    aria-hidden="true"
                  >
                    {item.isComplete ? "✓" : ""}
                  </span>
                  <span className={item.isComplete ? "text-gray-100" : "text-gray-400"}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* PATIENT SNAPSHOT */}
          <section className="rounded-2xl border border-blue-500/30 bg-blue-950/10 p-6 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Patient Snapshot
            </p>
            <h2 className="mb-1 text-xl font-semibold">Who is this patient?</h2>
            <p className="mb-5 text-sm text-gray-400">
              Capture identity and core clinical context before lower-signal contact details.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div
                id="client-name"
                className={getRequiredFieldClass(clientName.trim().length > 0)}
              >
                <label className="mb-2 block text-sm font-medium">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className={getRequiredControlClass(clientName.trim().length > 0)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Age Range</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option>Under 18</option>
                  <option>18-39</option>
                  <option>40-49</option>
                  <option>50-59</option>
                  <option>60-69</option>
                  <option>70-79</option>
                  <option>80-89</option>
                  <option>90+</option>
                </select>
              </div>

              <div
                id="primary-diagnosis"
                className={`${getRequiredFieldClass(primaryDiagnosis.trim().length > 0)} md:col-span-2`}
              >
                <label className="mb-2 block text-sm font-medium">Primary Diagnosis</label>
                <input
                  type="text"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  placeholder="Primary Diagnosis"
                  className={getRequiredControlClass(primaryDiagnosis.trim().length > 0)}
                />
              </div>
            </div>
          </section>

          {/* PRIMARY TREATMENT NEED */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Treatment Need
            </p>
            <h2 className="mb-1 text-xl font-semibold">What should treatment focus on?</h2>
            <p className="mb-5 text-sm text-gray-400">
              Anchor the plan around the activity and goal that matter most right now.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Target Activity</label>
                <select
                  value={targetActivity}
                  onChange={(e) => setTargetActivity(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option>Bathing</option>
                  <option>Dressing</option>
                  <option>Bathing and Dressing</option>
                  <option>Toileting</option>
                  <option>Transfers</option>
                  <option>Grooming</option>
                  <option>Feeding</option>
                  <option>Functional Mobility</option>
                  <option>Kitchen Tasks</option>
                  <option>Medication Management</option>
                  <option>Home Safety</option>
                  <option>Caregiver Training</option>
                </select>
                <input
                  type="text"
                  placeholder="Other target activity (optional)"
                  value={otherTargetActivity}
                  onChange={(e) => setOtherTargetActivity(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                />
              </div>

              <div
                id="primary-goal"
                className={getRequiredFieldClass(primaryGoal.trim().length > 0)}
              >
                <label className="mb-2 block text-sm font-medium">Primary Goal</label>
                <textarea
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Independent shower transfer with improved safety"
                  className={`${getRequiredControlClass(primaryGoal.trim().length > 0)} min-h-[120px]`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Treatment Lens</label>
                <select
                  value={clinicalFocus}
                  onChange={(e) => setClinicalFocus(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="adl_home_safety">ADL / Home Safety</option>
                  <option value="transfers_mobility">Transfers & Mobility</option>
                  <option value="caregiver_training">Caregiver Training</option>
                </select>
              </div>
            </div>
          </section>

          {/* FUNCTIONAL SEVERITY */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Functional Severity
            </p>
            <h2 className="mb-1 text-xl font-semibold">How much help is needed?</h2>
            <p className="mb-5 text-sm text-gray-400">
              Prioritize current assistance and transfer demands before detailed home context.
            </p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Assistance Needed for Primary Activity
                </label>
                <select
                  value={assistanceLevel}
                  onChange={(e) => setAssistanceLevel(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  {assistLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Bed Transfer Assistance</label>
                  <select
                    value={adlAssistLevels.bed_transfer}
                    onChange={(e) => updateAdlAssistLevel("bed_transfer", e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                  >
                    {assistLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Toilet Transfer Assistance</label>
                  <select
                    value={adlAssistLevels.toilet_transfer}
                    onChange={(e) => updateAdlAssistLevel("toilet_transfer", e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                  >
                    {assistLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Shower Transfer Assistance</label>
                  <select
                    value={adlAssistLevels.shower_transfer}
                    onChange={(e) => updateAdlAssistLevel("shower_transfer", e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                  >
                    {assistLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                id="key-barrier"
                className={getRequiredFieldClass(
                  keyBarriers.length > 0 || otherKeyBarriers.trim().length > 0
                )}
              >
                <label className="mb-2 block text-sm font-medium">Key Barriers</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {barriers.map((barrier) => (
                    <label
                      key={barrier}
                      className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={keyBarriers.includes(barrier)}
                        onChange={() => toggleBarrier(barrier)}
                      />
                      <span>{barrier}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Other key barriers (comma-separated, optional)"
                  value={otherKeyBarriers}
                  onChange={(e) => setOtherKeyBarriers(e.target.value)}
                  className={`${getRequiredControlClass(
                    keyBarriers.length > 0 || otherKeyBarriers.trim().length > 0
                  )} mt-3`}
                />
              </div>
            </div>
          </section>

          {/* SAFETY + MOBILITY RISK */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Safety + Mobility Risk
            </p>
            <h2 className="mb-1 text-xl font-semibold">What changes the risk picture?</h2>
            <p className="mb-5 text-sm text-gray-400">
              These fields shape safety, pacing, transfer setup, and carryover expectations.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Recent Falls</label>
                <select
                  value={recentFalls}
                  onChange={(e) => setRecentFalls(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Mobility Device</label>
                <select
                  value={mobilityDevice}
                  onChange={(e) => setMobilityDevice(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="none">None</option>
                  <option value="cane">Cane</option>
                  <option value="walker">Walker</option>
                  <option value="wheelchair">Wheelchair</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Endurance</label>
                <select
                  value={mobilityEndurance}
                  onChange={(e) => setMobilityEndurance(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="good">Good</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Sit-to-Stand Difficulty</label>
                <select
                  value={sitToStandDifficulty}
                  onChange={(e) => setSitToStandDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Indoor Mobility Support</label>
                <select
                  value={indoorMobilityLevel}
                  onChange={(e) => setIndoorMobilityLevel(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="independent">Independent</option>
                  <option value="supervision">Supervision</option>
                  <option value="assist">Assist</option>
                </select>
              </div>
            </div>
          </section>

          {/* CAREGIVER REALITY */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Caregiver Reality
            </p>
            <h2 className="mb-1 text-xl font-semibold">What support is realistically available?</h2>
            <p className="mb-5 text-sm text-gray-400">
              Elevate support availability and capacity before administrative caregiver details.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div
                id="caregiver-availability"
                className={getRequiredFieldClass(caregiverAvailability.trim().length > 0)}
              >
                <label className="mb-2 block text-sm font-medium">Caregiver Availability</label>
                <select
                  value={caregiverAvailability}
                  onChange={(e) => setCaregiverAvailability(e.target.value)}
                  className={getRequiredControlClass(caregiverAvailability.trim().length > 0)}
                >
                  <option value="">Select caregiver availability</option>
                  <option value="full_time_available">Full-time available</option>
                  <option value="part_time_available">Part-time available</option>
                  <option value="intermittent_availability">Intermittent / limited availability</option>
                  <option value="rarely_available">Rarely available</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div
                id="caregiver-assist-ability"
                className={getRequiredFieldClass(caregiverPhysicalCapacity.trim().length > 0)}
              >
                <label className="mb-2 block text-sm font-medium">
                  Caregiver Ability to Physically Assist
                </label>
                <select
                  value={caregiverPhysicalCapacity}
                  onChange={(e) => setCaregiverPhysicalCapacity(e.target.value)}
                  className={getRequiredControlClass(caregiverPhysicalCapacity.trim().length > 0)}
                >
                  <option value="">Select caregiver ability</option>
                  <option value="cannot_provide_physical_assist">Cannot provide physical assist</option>
                  <option value="light_assist_only">Light assist only</option>
                  <option value="moderate_assist_possible">Moderate assist possible</option>
                  <option value="substantial_assist_possible">Substantial assist possible</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div
                id="caregiver-confidence"
                className={getRequiredFieldClass(caregiverConfidence.trim().length > 0)}
              >
                <label className="mb-2 block text-sm font-medium">Caregiver Confidence</label>
                <select
                  value={caregiverConfidence}
                  onChange={(e) => setCaregiverConfidence(e.target.value)}
                  className={getRequiredControlClass(caregiverConfidence.trim().length > 0)}
                >
                  <option value="">Select caregiver confidence</option>
                  <option value="low_confidence">Low confidence</option>
                  <option value="moderate_confidence">Moderate confidence</option>
                  <option value="high_confidence">High confidence</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Caregiver Training Level</label>
                <select
                  value={caregiverTrainingLevel}
                  onChange={(e) => setCaregiverTrainingLevel(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="">Select caregiver training</option>
                  <option value="no_training">No training</option>
                  <option value="minimal_familiarity">Minimal familiarity</option>
                  <option value="some_experience">Some experience</option>
                  <option value="well_trained">Well trained</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <textarea
                  placeholder="Caregiver priorities (optional)"
                  value={caregiverPriorities}
                  onChange={(e) => setCaregiverPriorities(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                />
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={caregiverIsPrimarySupport}
                    onChange={(e) => setCaregiverIsPrimarySupport(e.target.checked)}
                  />
                  Primary caregiver
                </label>
              </div>
            </div>
          </section>

          {/* HOME FEASIBILITY SNAPSHOT */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Home Feasibility
            </p>
            <h2 className="mb-1 text-xl font-semibold">Will the home setup support the plan?</h2>
            <p className="mb-5 text-sm text-gray-400">
              Surface the environmental constraints that shape feasibility before detailed measurements.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Bathroom Setup</label>
                <select
                  value={bathroomType}
                  onChange={(e) => setBathroomType(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="tub_shower_combo">Tub/Shower Combo</option>
                  <option value="walk_in_shower">Walk-In Shower</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Space Constraints</label>
                <select
                  value={spaceConstraints}
                  onChange={(e) => setSpaceConstraints(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="significant">Significant</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Home Setup Complexity</label>
                <select
                  value={environmentalConstraint}
                  onChange={(e) => setEnvironmentalConstraint(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="unknown">Unknown</option>
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Equipment Access / DME Feasibility</label>
                <select
                  value={equipmentAccess}
                  onChange={(e) => setEquipmentAccess(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                >
                  <option value="unknown">Unknown</option>
                  <option value="out_of_pocket">Out of pocket</option>
                  <option value="insurance_dme">Insurance / DME</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Key Environmental Limitations</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {hazardOptions.map((hazard) => (
                    <label
                      key={hazard}
                      className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={safetyHazards.includes(hazard)}
                        onChange={() => toggleSafetyHazard(hazard)}
                      />
                      <span>{hazard}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Other environmental limitations (optional)"
                  value={otherSafetyHazards}
                  onChange={(e) => setOtherSafetyHazards(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3"
                />
              </div>
            </div>
          </section>

          {/* DETAILED HOME ASSESSMENT */}
          <section className="space-y-6 rounded-2xl border border-gray-800 bg-gray-950/40 p-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Detailed Home Assessment
              </p>
              <h2 className="text-xl font-semibold">Supporting home details</h2>
            </div>

            <div className="rounded-xl border border-gray-800 p-5">
              <h3 className="mb-4 text-lg font-semibold">Bathroom Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Toilet Setup</label>
                  <select
                    value={toiletSetup}
                    onChange={(e) => setToiletSetup(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="standard">Standard toilet</option>
                    <option value="comfort_height">Comfort-height toilet</option>
                    <option value="raised_toilet_seat">Raised toilet seat</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Bath Transfer Surface</label>
                  <select
                    value={transferSurface}
                    onChange={(e) => setTransferSurface(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="tub_edge">Tub edge</option>
                    <option value="walk_in_shower_threshold">Walk-in shower threshold</option>
                    <option value="roll_in_shower">Roll-in shower</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Grab Bars</label>
                  <select
                    value={grabBarsStatus}
                    onChange={(e) => setGrabBarsStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="none">None</option>
                    <option value="toilet_only">Toilet only</option>
                    <option value="shower_only">Shower only</option>
                    <option value="toilet_and_shower">Toilet and shower</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Handheld Shower</label>
                  <select
                    value={handheldShowerStatus}
                    onChange={(e) => setHandheldShowerStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Bath Seating</label>
                  <select
                    value={bathSeating}
                    onChange={(e) => setBathSeating(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="none">None</option>
                    <option value="shower_chair">Shower chair</option>
                    <option value="tub_bench">Tub bench</option>
                    <option value="built_in_bench">Built-in bench</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Equipment Present</label>
                  <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                    {equipmentOptions.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={equipmentPresent.includes(item)}
                          onChange={() => toggleEquipment(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other equipment present (optional)"
                    value={otherEquipmentPresent}
                    onChange={(e) => setOtherEquipmentPresent(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 p-5">
              <h3 className="mb-4 text-lg font-semibold">Outside / Entrance</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Driveway Surface</label>
                  <select
                    value={drivewaySurface}
                    onChange={(e) => setDrivewaySurface(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="smooth">Smooth</option>
                    <option value="rough">Rough</option>
                    <option value="inclined">Inclined</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Parking</label>
                  <select
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="driveway">Driveway</option>
                    <option value="garage">Garage</option>
                    <option value="parking_lot">Parking lot</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Entry Access</label>
                  <select
                    value={entryAccess}
                    onChange={(e) => setEntryAccess(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="front">Front</option>
                    <option value="side">Side</option>
                    <option value="garage">Garage</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Steps Present</label>
                  <select
                    value={stepsPresent}
                    onChange={(e) => setStepsPresent(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Number of Steps</label>
                  <input
                    type="text"
                    value={numberOfSteps}
                    onChange={(e) => setNumberOfSteps(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                    placeholder="e.g. 3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Railings</label>
                  <select
                    value={railingsPresent}
                    onChange={(e) => setRailingsPresent(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="na">N/A</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Step Height</label>
                  <select
                    value={stepHeight}
                    onChange={(e) => setStepHeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Step Depth</label>
                  <select
                    value={stepDepth}
                    onChange={(e) => setStepDepth(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="">Select</option>
                    <option value="deep">Deep</option>
                    <option value="shallow">Shallow</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Door Type</label>
                  <select
                    value={doorType}
                    onChange={(e) => setDoorType(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="standard">Standard</option>
                    <option value="sliding">Sliding</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Door Width</label>
                  <select
                    value={doorWidth}
                    onChange={(e) => setDoorWidth(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="">Select</option>
                    <option value="narrow">Narrow</option>
                    <option value="standard">Standard</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Mailbox Location</label>
                  <select
                    value={mailboxLocation}
                    onChange={(e) => setMailboxLocation(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="porch">Porch</option>
                    <option value="garage">Garage</option>
                    <option value="driveway">Driveway</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Exterior Hazards</label>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {[
                      { value: "cracks_in_pathways", label: "Cracks in pathways" },
                      { value: "must_cross_grass", label: "Must cross grass" },
                      { value: "must_cross_gravel", label: "Must cross gravel" },
                    ].map((hazard) => (
                      <label key={hazard.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exteriorHazards.includes(hazard.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExteriorHazards([...exteriorHazards, hazard.value]);
                            } else {
                              setExteriorHazards(
                                exteriorHazards.filter((item) => item !== hazard.value)
                              );
                            }
                          }}
                        />
                        {hazard.label}
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other exterior hazards (optional)"
                    value={otherExteriorHazards}
                    onChange={(e) => setOtherExteriorHazards(e.target.value)}
                    className="mt-3 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 p-5">
              <h3 className="mb-4 text-lg font-semibold">Bedroom / Bed Setup</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Bed Type</label>
                  <select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="standard">Standard Bed</option>
                    <option value="adjustable">Adjustable Bed</option>
                    <option value="hospital">Hospital Bed</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Bed Height</label>
                  <select
                    value={bedHeight}
                    onChange={(e) => setBedHeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Bed Rails Present</label>
                  <select
                    value={bedRails}
                    onChange={(e) => setBedRails(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="none">None</option>
                    <option value="one_side">One side</option>
                    <option value="both_sides">Both sides</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Clearance Around Bed</label>
                  <select
                    value={bedClearance}
                    onChange={(e) => setBedClearance(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="adequate">Adequate</option>
                    <option value="limited">Limited</option>
                    <option value="very_limited">Very Limited</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Nighttime / Bedside Hazards</label>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {[
                      { value: "clutter", label: "Clutter" },
                      { value: "obstacles", label: "Obstacles" },
                      { value: "poor_lighting", label: "Poor lighting" },
                      { value: "narrow_path", label: "Narrow path" },
                      { value: "long_path", label: "Long path" },
                      { value: "stairs", label: "Stairs" },
                    ].map((hazard) => (
                      <label key={hazard.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={bedHazards.includes(hazard.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBedHazards([...bedHazards, hazard.value]);
                            } else {
                              setBedHazards(
                                bedHazards.filter((item) => item !== hazard.value)
                              );
                            }
                          }}
                        />
                        {hazard.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 p-5">
              <h3 className="mb-4 text-lg font-semibold">Transfer Surfaces</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Primary Seating</label>
                  <select
                    value={primarySeating}
                    onChange={(e) => setPrimarySeating(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="chair">Chair</option>
                    <option value="recliner">Recliner</option>
                    <option value="sofa">Sofa</option>
                    <option value="wheelchair">Wheelchair</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Seat Height</label>
                  <select
                    value={seatHeight}
                    onChange={(e) => setSeatHeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Armrests Present</label>
                  <select
                    value={armrestsPresent}
                    onChange={(e) => setArmrestsPresent(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Surface Firmness</label>
                  <select
                    value={surfaceFirmness}
                    onChange={(e) => setSurfaceFirmness(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                  >
                    <option value="firm">Firm</option>
                    <option value="soft">Soft</option>
                    <option value="very_soft">Very Soft</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* ADMINISTRATIVE DETAILS */}
          <section className="rounded-2xl border border-gray-800 bg-gray-950/40 p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Administrative Details
            </p>
            <h2 className="mb-5 text-xl font-semibold">Contact and case details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Phone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
              />
              <input
                type="text"
                placeholder="Email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 md:col-span-2"
              />
              <input
                type="text"
                placeholder="Caregiver Name"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={caregiverRelationship}
                onChange={(e) => setCaregiverRelationship(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
              />
              <input
                type="text"
                placeholder="Caregiver Phone"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
              />

              <div>
                <label className="mb-2 block text-sm font-medium">Case Type</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                >
                  <option value="geriatric">Geriatric</option>
                  <option value="neurological">Neurological</option>
                  <option value="physical_rehabilitation">Physical Rehab</option>
                  <option value="pediatric">Pediatric</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Cost / Coverage Constraint</label>
                <select
                  value={financialConstraint}
                  onChange={(e) => setFinancialConstraint(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2"
                >
                  <option value="unknown">Unknown</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={generateLocalPlan}
            disabled={isSaving}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-700"
          >
            {isSaving ? "Saving..." : "Generate Plan"}
          </button>
        </form>

        {saveMessage && <p className="mt-4 text-sm text-gray-300">{saveMessage}</p>}

        <section className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Live Case Preview</h2>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Age Range:</strong> {ageRange}
            </p>
            <p>
              <strong>Primary Diagnosis:</strong> {primaryDiagnosis || "—"}
            </p>
            <p>
              <strong>Target Activity:</strong> {targetActivity}
            </p>
            <p>
              <strong>Assistance Needed for Primary Activity:</strong>{" "}
              {getAssistLevelLabel(assistanceLevel)}
            </p>
            <p>
              <strong>Bed Transfer Assist:</strong>{" "}
              {getAssistLevelLabel(adlAssistLevels.bed_transfer)}
            </p>
            <p>
              <strong>Toilet Transfer Assist:</strong>{" "}
              {getAssistLevelLabel(adlAssistLevels.toilet_transfer)}
            </p>
            <p>
              <strong>Shower Transfer Assist:</strong>{" "}
              {getAssistLevelLabel(adlAssistLevels.shower_transfer)}
            </p>
            <p>
              <strong>Bathroom Type:</strong> {bathroomType}
            </p>
            <p>
              <strong>Toilet Setup:</strong> {toiletSetup}
            </p>
            <p>
              <strong>Bath Transfer Surface:</strong> {transferSurface}
            </p>
            <p>
              <strong>Grab Bars:</strong> {grabBarsStatus}
            </p>
            <p>
              <strong>Handheld Shower:</strong> {handheldShowerStatus}
            </p>
            <p>
              <strong>Bath Seating:</strong> {bathSeating}
            </p>
            <p>
              <strong>Key Barriers:</strong>{" "}
              {keyBarriers.length ? keyBarriers.join(", ") : "—"}
            </p>
            <p>
              <strong>Primary Goal:</strong> {primaryGoal || "—"}
            </p>
            <p>
              <strong>Caregiver Availability:</strong> {caregiverAvailability || "—"}
            </p>
            <p>
              <strong>Caregiver Physical Capacity:</strong>{" "}
              {caregiverPhysicalCapacity || "—"}
            </p>
            <p>
              <strong>Caregiver Confidence:</strong> {caregiverConfidence || "—"}
            </p>
            <p>
              <strong>Primary Seating:</strong> {primarySeating || "—"}
            </p>
            <p>
              <strong>Surface Firmness:</strong> {surfaceFirmness || "—"}
            </p>
            <p>
              <strong>Mobility Device:</strong> {mobilityDevice || "—"}
            </p>
            <p>
              <strong>Indoor Mobility:</strong> {indoorMobilityLevel || "—"}
            </p>
            <p>
              <strong>Endurance:</strong> {mobilityEndurance || "—"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
