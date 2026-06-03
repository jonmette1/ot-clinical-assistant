"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type CaseDetail = {
  id: string;
  title: string | null;
  patient_profile: {
    age_range?: string;
    primary_diagnosis?: string;
  } | null;
  functional_status: {
    current_assistance_level?: string;
    adl_assist_levels?: {
      bed_transfer?: string;
      toilet_transfer?: string;
      shower_transfer?: string;
    };
    key_barriers?: string[];
  } | null;
  goals_preferences: {
    primary_goal?: string;
  } | null;
  client_info: {
    client_name?: string;
    phone?: string;
    email?: string;
    address?: string;
  } | null;
caregiver_info: {
  caregiver_name?: string;
  relationship?: string;
  phone?: string;
  availability?: string;
  physical_capacity?: string;
  training_level?: string;
  confidence?: string;
  priorities?: string;
  is_primary_support?: boolean;
} | null;
case_classification: {
  case_type?: string;
  clinical_focus?: string;
} | null;

clinical_decision_input?: {
  goalCategory?: string;
  dominantBarrier?: string;
  dominantBarrierSeverity?: number;
  secondaryBarrier?: string;
  secondaryBarrierSeverity?: number;
  supportLevel?: string;
  safetyRiskLevel?: string;
  clinicalLens?: string[];
  environmentContext?: string[];
} | null;

generated_output?: GeneratedPlan | null;
environment: {
  bathroom_type?: string;
  stairs_present?: string;
  space_constraints?: string;
  safety_hazards?: string[];
  equipment_present?: string[];
  other_safety_hazards?: string;
  other_equipment_present?: string;
  bathroom_assessment?: {
    bathroom_type?: string;
    space_constraints?: string;
    toilet_setup?: string;
    transfer_surface?: string;
    grab_bars_status?: string;
    handheld_shower_status?: string;
    bath_seating?: string;
    safety_hazards?: string[];
    equipment_present?: string[];
    other_safety_hazards?: string;
    other_equipment_present?: string;
  };
  outside_entrance?: {
    driveway_surface?: string;
    parking_type?: string;
    entry_access?: string;
    steps_present?: string;
    number_of_steps?: string;
    step_height?: string;
    step_depth?: string;
    railings_present?: string;
    door_type?: string;
    door_width?: string;
    mailbox_location?: string;
    exterior_hazards?: string[];
    other_exterior_hazards?: string;
  };
  transfer_surfaces?: {
    bed_height?: string;
    chair_type?: string;
    toilet_height?: string;
    shower_access_type?: string;
    surfaces_notes?: string;

    primary_seating?: string;
    seat_height?: string;
    armrests_present?: string;
    surface_firmness?: string;
    sit_to_stand_difficulty?: string;
    assistive_device_used?: string;
  };
  general_mobility?: {
    device_used?: string;
    mobility_status?: string;
    endurance_limitations?: string;
    balance_status?: string;
    mobility_notes?: string;

    primary_mobility_device?: string;
    indoor_mobility_level?: string;
    endurance?: string;
    recent_falls?: string;
  };
  
  } | null;
};

type Pathway = {
  type?: string;
  title?: string;
  interventions?: string[];
  timeline?: string;
  upside?: string;
  tradeoff?: string;
};

type GeneratedPlan = {
  patientSnapshot: string;
  pathways?: Pathway[];
  summary?: {
    topRisks?: string[];
    keyLimitations?: string[];
    planSummary?: string;
    caregiverExpectations?: string[];
    safetyLevel?: "low" | "medium" | "high";
  };
  clinicalConsiderations: string[];
  firstSessionPriorities: string[];
  taskBreakdown?: string[];
  functionalProblemAreas?: string[];
  sessionPlan?: string[];
};

export default function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
  const [goalCategory, setGoalCategory] = useState("Safety");
const [dominantBarrier, setDominantBarrier] = useState("Physical");
const [dominantBarrierSeverity, setDominantBarrierSeverity] = useState(2);
const [secondaryBarrier, setSecondaryBarrier] = useState("");
const [secondaryBarrierSeverity, setSecondaryBarrierSeverity] = useState(0);
const [supportLevel, setSupportLevel] = useState("Intermittent Support");
const [safetyRiskLevel, setSafetyRiskLevel] = useState("medium");
  const [ageRange, setAgeRange] = useState("70-79");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [assistanceLevel, setAssistanceLevel] = useState("3");
  const [adlAssistLevels, setAdlAssistLevels] = useState({
  bed_transfer: "3",
  toilet_transfer: "3",
  shower_transfer: "3",
});
const [primaryGoal, setPrimaryGoal] = useState("");
const [keyBarriers, setKeyBarriers] = useState<string[]>([]);
const [bathroomType, setBathroomType] = useState("tub_shower_combo");
const [stairsPresent, setStairsPresent] = useState("no");
const [spaceConstraints, setSpaceConstraints] = useState("moderate");
const [safetyHazards, setSafetyHazards] = useState<string[]>([]);
const [equipmentPresent, setEquipmentPresent] = useState<string[]>([]);
const [toiletSetup, setToiletSetup] = useState("standard");
const [transferSurface, setTransferSurface] = useState("tub_edge");
const [grabBarsStatus, setGrabBarsStatus] = useState("none");
const [handheldShowerStatus, setHandheldShowerStatus] = useState("no");
const [bathSeating, setBathSeating] = useState("none");
// TRANSFER SURFACES (MULTI-ZONE)
const [transferSurfaces, setTransferSurfaces] = useState({
  bed_height: "",
  chair_type: "",
  toilet_height: "",
  shower_access_type: "",
  surface_firmness: "firm",
  assistive_device_used: "",
  surfaces_notes: "",
});
const [otherSafetyHazards, setOtherSafetyHazards] = useState("");
const [otherEquipmentPresent, setOtherEquipmentPresent] = useState("");
// OUTSIDE / ENTRANCE ZONE STATE
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
// GENERAL MOBILITY
const [generalMobility, setGeneralMobility] = useState({
  device_used: "",
  mobility_status: "",
  endurance_limitations: "",
  balance_status: "",
  mobility_notes: "",
});



const [isSaving, setIsSaving] = useState(false);
const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
const [originalPlan, setOriginalPlan] = useState<GeneratedPlan | null>(null);
const [saveMessage, setSaveMessage] = useState("");
const router = useRouter();

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

function getAssistLevelLabel(value: string) {
  return (
    assistLevelOptions.find((option) => option.value === value)?.label || value
  );
}
function getAssistSeverityScore(value: string) {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) return 0;

  return Math.max(0, 8 - numeric);
}
function rankZones(
  zones: { zone: string; score: number; drivers: string[] }[]
) {
  return zones
    .filter((zone) => zone.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ zone, score, drivers }) => ({
      zone,
      score,
      drivers,
    }));
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

  const transferDrivers: string[] = [];
  let transferScore = 0;

  if (transferSurfaces.bed_height === "low") {
    transferScore += 2;
    transferDrivers.push("low seat height");
  }
  if (generalMobility.endurance_limitations === "low") {
    transferScore += 1;
    transferDrivers.push("low endurance impacting transfers");
  }
  if (generalMobility.mobility_notes === "yes") {
    transferScore += 2;
    transferDrivers.push("recent fall history");
  }
  if (transferSurfaces.chair_type.trim() !== "") {
    transferScore += 1;
    transferDrivers.push("primary seating impacts transfers");
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
        zone: "transfer_surfaces",
        score: transferScore,
        drivers: transferDrivers,
      },
    ]),
  };
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

  function toggleBarrier(barrier: string) {
    setKeyBarriers((prev) =>
      prev.includes(barrier)
        ? prev.filter((item) => item !== barrier)
        : [...prev, barrier]
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

 async function regenerateAndUpdateCase() {
setIsSaving(true);
setSaveMessage("Generating updated treatment plan...");
const clinicalPrioritySummary = buildClinicalPrioritySummary();

const casePayload = {
  clinical_focus: clinicalFocus,

  clinicalDecisionModel: {
  goalCategory,
  dominantBarrier,
  dominantBarrierSeverity,
  secondaryBarrier,
  secondaryBarrierSeverity,
  supportLevel,
  safetyRiskLevel,
},
case_classification: {
  case_type: caseType,
  clinical_focus: clinicalFocus,
},
clinical_decision_input: {
  goalCategory,
  dominantBarrier,
  dominantBarrierSeverity,
  secondaryBarrier,
  secondaryBarrierSeverity,
  supportLevel,
  safetyRiskLevel,
  clinicalLens:
    secondaryBarrier && secondaryBarrier !== "None"
      ? [secondaryBarrier]
      : [],
  environmentContext: clinicalFocus ? [clinicalFocus] : [],
},
  clientName,
  clientPhone,
  clientEmail,
  clientAddress,
  caregiverName,
  caregiverRelationship,
  caregiverPhone,
  caseType,
  ageRange,
  primaryDiagnosis,
  targetActivity: "Bathing",
  assistanceLevel,
  adlAssistLevels,
  keyBarriers,
  primaryGoal,
  bathroomType,
  stairsPresent,
  clinical_priority_summary: clinicalPrioritySummary,

  general_mobility_summary: {
    primary_mobility_device: generalMobility.device_used,
    indoor_mobility_level: generalMobility.mobility_status,
    endurance: generalMobility.endurance_limitations,
    recent_falls: generalMobility.mobility_notes,
  },

transfer_surface_summary: {
  primary_seating: transferSurfaces.chair_type,
  seat_height: transferSurfaces.bed_height,
  armrests_present: "",
  surface_firmness: transferSurfaces.surface_firmness,
  sit_to_stand_difficulty: "",
  assistive_device_used: transferSurfaces.assistive_device_used,
},
  spaceConstraints,
  safetyHazards,
  equipmentPresent,
  environment: {
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

transfer_surfaces: {
  primary_seating: transferSurfaces.chair_type,
  seat_height: transferSurfaces.bed_height,
  armrests_present: "",
  surface_firmness: transferSurfaces.surface_firmness,
  sit_to_stand_difficulty: "",
  assistive_device_used: transferSurfaces.assistive_device_used,
  surfaces_notes: transferSurfaces.surfaces_notes,
},

  general_mobility: {
    primary_mobility_device: generalMobility.device_used,
    indoor_mobility_level: generalMobility.mobility_status,
    endurance: generalMobility.endurance_limitations,
    recent_falls: generalMobility.mobility_notes,
  },
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
  },
};

  const aiResponse = await fetch("/api/generate-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(casePayload),
  });

  const aiData = await aiResponse.json();

  if (!aiData.success || !aiData.plan) {
    setSaveMessage(
      `AI regeneration failed: ${aiData.error || "Unknown error"}`
    );
    setIsSaving(false);
    return;
  }

const updatedPlan = aiData.plan;
setSaveMessage("Saving updated treatment plan...");



  const { data: updatedCase, error } = await supabase
    .from("cases")
    .update({
      title: `${caseType} case - ${primaryDiagnosis || "Untitled"}`,
      patient_profile: {
        age_range: ageRange,
        primary_diagnosis: primaryDiagnosis,
      },
functional_status: {
  current_assistance_level: assistanceLevel,
  adl_assist_levels: adlAssistLevels,
  key_barriers: keyBarriers,

  clinical_priority_summary: clinicalPrioritySummary,
  general_mobility_summary: {
    primary_mobility_device: generalMobility.device_used,
    indoor_mobility_level: generalMobility.mobility_status,
    endurance: generalMobility.endurance_limitations,
    recent_falls: generalMobility.mobility_notes,
  },

transfer_surface_summary: {
  primary_seating: transferSurfaces.chair_type,
  seat_height: transferSurfaces.bed_height,
  armrests_present: "",
  surface_firmness: transferSurfaces.surface_firmness,
  sit_to_stand_difficulty: "",
  assistive_device_used: transferSurfaces.assistive_device_used,
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

  transfer_surfaces: {
    primary_seating: transferSurfaces.chair_type,
    seat_height: transferSurfaces.bed_height,
    toilet_height: transferSurfaces.toilet_height,
    shower_access_type: transferSurfaces.shower_access_type,
    surface_firmness: transferSurfaces.surface_firmness,
    assistive_device_used: transferSurfaces.assistive_device_used,
    surfaces_notes: transferSurfaces.surfaces_notes,
  },
},
goals_preferences: {
  primary_goal: primaryGoal,
},
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

case_classification: {
  case_type: caseType,
  clinical_focus: clinicalFocus,
},

clinical_decision_input: {
  goalCategory,
  dominantBarrier,
  dominantBarrierSeverity,
  secondaryBarrier,
  secondaryBarrierSeverity,
  supportLevel,
  safetyRiskLevel,
clinicalLens: secondaryBarrier && secondaryBarrier !== "None" ? [secondaryBarrier] : [],
environmentContext: clinicalFocus ? [clinicalFocus] : [],
},

generated_output: updatedPlan,
    })
  .eq("id", caseId)
.select("clinical_decision_input");
console.log(
  "UPDATED clinical_decision_input:",
  updatedCase
);
if (error) {
  setSaveMessage(`Update failed: ${error.message || "Unknown error"}`);
} else {
await supabase.from("generations").insert([
  {
    case_id: caseId,
    prompt_version: `v2-functional-${clinicalFocus}`,
    input_payload: casePayload,
    output_payload: updatedPlan,
  },
]);



setSaveMessage("Case updated with AI-regenerated plan successfully.");

router.push(`/cases/${caseId}`);
}

  setIsSaving(false);
}

async function updateCaseOnly() {
  setIsSaving(true);
  setSaveMessage("");

  const clinicalPrioritySummary = buildClinicalPrioritySummary();

  const { data: updatedCase, error } = await supabase
    .from("cases")
    .update({
      title: `${caseType} case - ${primaryDiagnosis || "Untitled"}`,
      patient_profile: {
        age_range: ageRange,
        primary_diagnosis: primaryDiagnosis,
      },
      functional_status: {
        current_assistance_level: assistanceLevel,
        adl_assist_levels: adlAssistLevels,
        key_barriers: keyBarriers,

        clinical_priority_summary: clinicalPrioritySummary,
        general_mobility_summary: {
          primary_mobility_device: generalMobility.device_used,
          indoor_mobility_level: generalMobility.mobility_status,
          endurance: generalMobility.endurance_limitations,
          recent_falls: generalMobility.mobility_notes,
        },

        transfer_surface_summary: {
  primary_seating: transferSurfaces.chair_type,
  seat_height: transferSurfaces.bed_height,
  armrests_present: "",
  surface_firmness: transferSurfaces.surface_firmness,
  sit_to_stand_difficulty: "",
  assistive_device_used: transferSurfaces.assistive_device_used,
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
        transfer_surfaces: {
          primary_seating: transferSurfaces.chair_type,
          seat_height: transferSurfaces.bed_height,
          toilet_height: transferSurfaces.toilet_height,
          shower_access_type: transferSurfaces.shower_access_type,
          surface_firmness: transferSurfaces.surface_firmness,
          assistive_device_used: transferSurfaces.assistive_device_used,
          surfaces_notes: transferSurfaces.surfaces_notes,
},
      },
      goals_preferences: {
        primary_goal: primaryGoal,
      },
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
case_classification: {
  case_type: caseType,
  clinical_focus: clinicalFocus,
},

clinical_decision_input: {
  goalCategory,
  dominantBarrier,
  dominantBarrierSeverity,
  secondaryBarrier,
  secondaryBarrierSeverity,
  supportLevel,
  safetyRiskLevel,
  clinicalLens:
    secondaryBarrier && secondaryBarrier !== "None"
      ? [secondaryBarrier]
      : [],
  environmentContext: clinicalFocus ? [clinicalFocus] : [],
},

generated_output: generatedPlan,
    })
   .eq("id", caseId)
.select("clinical_decision_input");
console.log(
  "UPDATED clinical_decision_input:",
  updatedCase
);
if (error) {
  setSaveMessage(`Update failed: ${error.message || "Unknown error"}`);
} else {
  await supabase.from("generations").insert([
    {
      case_id: caseId,
      prompt_version: "manual-edit",
      input_payload: {
        source: "update-case-only",
      },
      output_payload: generatedPlan,
    },
  ]);

  setSaveMessage("Case updated (no regeneration).");
}

  setIsSaving(false);
}

  useEffect(() => {
    async function loadCase() {
      const resolvedParams = await params;

const { data, error } = await supabase
  .from("cases")
.select(
  "id, title, patient_profile, functional_status, goals_preferences, client_info, caregiver_info, case_classification, clinical_decision_input, environment, generated_output"
)
  .eq("id", resolvedParams.id)
  .single();

      if (error) {
        setErrorMessage(error.message || "Failed to load case.");
      } else {
        const caseData = data as CaseDetail;
        alert(
  JSON.stringify(caseData.clinical_decision_input, null, 2)
);
console.log("EDIT LOAD clinical_decision_input:", caseData.clinical_decision_input);
const loadedPlan = caseData.generated_output || null;

if (loadedPlan) {
  setGeneratedPlan(loadedPlan);
  setOriginalPlan(loadedPlan);
}

        setCaseId(caseData.id);
        setClientName(caseData.client_info?.client_name || "");
        setClientPhone(caseData.client_info?.phone || "");
        setClientEmail(caseData.client_info?.email || "");
        setClientAddress(caseData.client_info?.address || "");
        setCaregiverName(caseData.caregiver_info?.caregiver_name || "");
        setCaregiverRelationship(caseData.caregiver_info?.relationship || "");
        setCaregiverPhone(caseData.caregiver_info?.phone || "");
        setCaregiverAvailability(caseData.caregiver_info?.availability || "");
        setCaregiverPhysicalCapacity(caseData.caregiver_info?.physical_capacity || "");
        setCaregiverTrainingLevel(caseData.caregiver_info?.training_level || "");
        setCaregiverConfidence(caseData.caregiver_info?.confidence || "");
        setCaregiverPriorities(caseData.caregiver_info?.priorities || "");
        setCaregiverIsPrimarySupport(caseData.caregiver_info?.is_primary_support || false);
        setCaseType(caseData.case_classification?.case_type || "geriatric");
        setClinicalFocus(
  caseData.case_classification?.clinical_focus || "adl_home_safety"
);
        setAgeRange(caseData.patient_profile?.age_range || "70-79");
        setPrimaryDiagnosis(caseData.patient_profile?.primary_diagnosis || "");
setAssistanceLevel(
  caseData.functional_status?.current_assistance_level || "3"
);
setAdlAssistLevels({
  bed_transfer:
    caseData.functional_status?.adl_assist_levels?.bed_transfer || "3",
  toilet_transfer:
    caseData.functional_status?.adl_assist_levels?.toilet_transfer || "3",
  shower_transfer:
    caseData.functional_status?.adl_assist_levels?.shower_transfer || "3",
});
setPrimaryGoal(caseData.goals_preferences?.primary_goal || "");
setGoalCategory(
  caseData.clinical_decision_input?.goalCategory || "Safety"
);

setDominantBarrier(
  caseData.clinical_decision_input?.dominantBarrier || "Physical"
);

setDominantBarrierSeverity(
  caseData.clinical_decision_input?.dominantBarrierSeverity ?? 2
);

setSecondaryBarrier(
  caseData.clinical_decision_input?.secondaryBarrier || ""
);

setSecondaryBarrierSeverity(
  caseData.clinical_decision_input?.secondaryBarrierSeverity ?? 0
);

setSupportLevel(
  caseData.clinical_decision_input?.supportLevel || "Intermittent Support"
);

setSafetyRiskLevel(
  caseData.clinical_decision_input?.safetyRiskLevel || "medium"
);
setKeyBarriers(caseData.functional_status?.key_barriers || []);
setBathroomType(
  caseData.environment?.bathroom_assessment?.bathroom_type ||
    "tub_shower_combo"
);
setStairsPresent(
  caseData.environment?.outside_entrance?.steps_present ||
    caseData.environment?.stairs_present ||
    "no"
);
setSpaceConstraints(
  caseData.environment?.bathroom_assessment?.space_constraints ||
    caseData.environment?.space_constraints ||
    "moderate"
);
setSafetyHazards(
  caseData.environment?.bathroom_assessment?.safety_hazards ||
    caseData.environment?.safety_hazards ||
    []
);
setEquipmentPresent(
  caseData.environment?.bathroom_assessment?.equipment_present ||
    caseData.environment?.equipment_present ||
    []
);
setToiletSetup(
  caseData.environment?.bathroom_assessment?.toilet_setup || "standard"
);
setTransferSurface(
  caseData.environment?.bathroom_assessment?.transfer_surface || "tub_edge"
);

setTransferSurfaces({
  bed_height:
    caseData.environment?.transfer_surfaces?.bed_height ||
    caseData.environment?.transfer_surfaces?.seat_height ||
    "",
  chair_type:
    caseData.environment?.transfer_surfaces?.chair_type ||
    caseData.environment?.transfer_surfaces?.primary_seating ||
    "",
  toilet_height:
    caseData.environment?.transfer_surfaces?.toilet_height || "",
  shower_access_type:
    caseData.environment?.transfer_surfaces?.shower_access_type || "",
  surface_firmness:
    caseData.environment?.transfer_surfaces?.surface_firmness || "firm",
  assistive_device_used:
    caseData.environment?.transfer_surfaces?.assistive_device_used || "",
  surfaces_notes:
    caseData.environment?.transfer_surfaces?.surfaces_notes || "",
});

setGrabBarsStatus(
  caseData.environment?.bathroom_assessment?.grab_bars_status || "none"
);
setHandheldShowerStatus(
  caseData.environment?.bathroom_assessment?.handheld_shower_status || "no"
);
setBathSeating(
  caseData.environment?.bathroom_assessment?.bath_seating || "none"
);
setOtherSafetyHazards(
  caseData.environment?.bathroom_assessment?.other_safety_hazards ||
    caseData.environment?.other_safety_hazards ||
    ""
);
setOtherEquipmentPresent(
  caseData.environment?.bathroom_assessment?.other_equipment_present ||
    caseData.environment?.other_equipment_present ||
    ""
);
setDrivewaySurface(
  caseData.environment?.outside_entrance?.driveway_surface || "smooth"
);
setParkingType(
  caseData.environment?.outside_entrance?.parking_type || "driveway"
);
setEntryAccess(
  caseData.environment?.outside_entrance?.entry_access || "front"
);

setStepsPresent(
  caseData.environment?.outside_entrance?.steps_present || "no"
);
setNumberOfSteps(
  caseData.environment?.outside_entrance?.number_of_steps || ""
);
setStepHeight(
  caseData.environment?.outside_entrance?.step_height || ""
);
setStepDepth(
  caseData.environment?.outside_entrance?.step_depth || ""
);

setRailingsPresent(
  caseData.environment?.outside_entrance?.railings_present || "no"
);

setDoorType(
  caseData.environment?.outside_entrance?.door_type || "standard"
);
setDoorWidth(
  caseData.environment?.outside_entrance?.door_width || ""
);

setMailboxLocation(
  caseData.environment?.outside_entrance?.mailbox_location || "porch"
);

setExteriorHazards(
  caseData.environment?.outside_entrance?.exterior_hazards || []
);
setOtherExteriorHazards(
  caseData.environment?.outside_entrance?.other_exterior_hazards || ""
);
setGeneralMobility({
  device_used:
    caseData.environment?.general_mobility?.primary_mobility_device || "",
  mobility_status:
    caseData.environment?.general_mobility?.indoor_mobility_level || "",
  endurance_limitations:
    caseData.environment?.general_mobility?.endurance || "",
  balance_status: "",
  mobility_notes:
    caseData.environment?.general_mobility?.recent_falls || "",
});

      }

      setLoading(false);
    }

    loadCase();
  }, [params]);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Case</h1>

          <Link href="/cases" className="text-blue-400 underline">
            Back to Cases
          </Link>
        </div>

        {loading && <p className="text-gray-400">Loading case...</p>}

        {!loading && errorMessage && (
          <p className="text-red-400">Error loading case: {errorMessage}</p>
        )}

        {!loading && !errorMessage && (
          <form className="space-y-6">
            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h2 className="text-xl font-semibold mb-4">Client / Case Basics</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <div className="md:col-span-2 pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-semibold">Caregiver Information</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Improves caregiver guidance, feasibility planning, and carryover recommendations.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Caregiver Name"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Relationship"
                  value={caregiverRelationship}
                  onChange={(e) => setCaregiverRelationship(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Caregiver Phone"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                />

             <select
  value={caregiverAvailability}
  onChange={(e) => setCaregiverAvailability(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
>
  <option value="">Caregiver Availability</option>
  <option value="full_time_available">Full-time available</option>
  <option value="part_time_available">Part-time available</option>
  <option value="intermittent_availability">Intermittent / limited availability</option>
  <option value="rarely_available">Rarely available</option>
  <option value="unknown">Unknown</option>
</select>   

<select
  value={caregiverPhysicalCapacity}
  onChange={(e) => setCaregiverPhysicalCapacity(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
>
  <option value="">Caregiver Physical Capacity</option>
  <option value="cannot_provide_physical_assist">Cannot provide physical assist</option>
  <option value="light_assist_only">Light assist only</option>
  <option value="moderate_assist_possible">Moderate assist possible</option>
  <option value="substantial_assist_possible">Substantial assist possible</option>
  <option value="unknown">Unknown</option>
</select>

<select
  value={caregiverTrainingLevel}
  onChange={(e) => setCaregiverTrainingLevel(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
>
  <option value="">Caregiver Training Level</option>
  <option value="no_training">No training</option>
  <option value="minimal_familiarity">Minimal familiarity</option>
  <option value="some_experience">Some experience</option>
  <option value="well_trained">Well trained</option>
  <option value="unknown">Unknown</option>
</select>

<select
  value={caregiverConfidence}
  onChange={(e) => setCaregiverConfidence(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
>
  <option value="">Caregiver Confidence</option>
  <option value="low_confidence">Low confidence</option>
  <option value="moderate_confidence">Moderate confidence</option>
  <option value="high_confidence">High confidence</option>
  <option value="unknown">Unknown</option>
</select>

<textarea
  placeholder="Caregiver Priorities"
  value={caregiverPriorities}
  onChange={(e) => setCaregiverPriorities(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 min-h-[80px]"
/>

<label className="md:col-span-2 flex items-center gap-2 text-sm">
  <input
    type="checkbox"
    checked={caregiverIsPrimarySupport}
    onChange={(e) => setCaregiverIsPrimarySupport(e.target.checked)}
  />
  Primary caregiver
</label>

          <div className="grid gap-4 md:grid-cols-2">

 <div>
  <label className="block text-sm font-medium mb-2">Case Type</label>
  <select
    value={caseType}
    onChange={(e) => setCaseType(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="geriatric">Geriatric</option>
    <option value="neurological">Neurological</option>
    <option value="physical_rehabilitation">Physical Rehab</option>
    <option value="pediatric">Pediatric</option>
  </select>
</div>

<div className="md:col-span-2 pt-4 border-t border-gray-800">
  <h3 className="text-lg font-semibold">Case Classification</h3>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Clinical Focus</label>
  <select
    value={clinicalFocus}
    onChange={(e) => setClinicalFocus(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="adl_home_safety">ADL / Home Safety</option>
    <option value="transfers_mobility">Transfers & Mobility</option>
    <option value="caregiver_training">Caregiver Training</option>
  </select>
</div>

<div className="md:col-span-2 pt-4 border-t border-gray-800">
  <h3 className="text-lg font-semibold">Decision Engine Inputs</h3>
  <p className="text-sm text-gray-400">
    These fields control the strategy selection used to generate pathways.
  </p>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Goal Category</label>
  <select
    value={goalCategory}
    onChange={(e) => setGoalCategory(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="Safety">Safety</option>
    <option value="Independence">Independence</option>
    <option value="Participation">Participation</option>
    <option value="Caregiver Relief">Caregiver Relief</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Dominant Barrier</label>
  <select
    value={dominantBarrier}
    onChange={(e) => setDominantBarrier(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="Physical">Physical</option>
    <option value="Cognitive">Cognitive</option>
    <option value="Behavioral">Behavioral</option>
    <option value="Sensory">Sensory</option>
    <option value="Environmental">Environmental</option>
    <option value="Caregiver">Caregiver</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Dominant Barrier Severity</label>
  <select
    value={dominantBarrierSeverity}
    onChange={(e) => setDominantBarrierSeverity(Number(e.target.value))}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value={1}>Low</option>
    <option value={2}>Moderate</option>
    <option value={3}>High</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Secondary Barrier</label>
  <select
    value={secondaryBarrier}
    onChange={(e) => setSecondaryBarrier(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="">None</option>
    <option value="Physical">Physical</option>
    <option value="Cognitive">Cognitive</option>
    <option value="Behavioral">Behavioral</option>
    <option value="Sensory">Sensory</option>
    <option value="Environmental">Environmental</option>
    <option value="Caregiver">Caregiver</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Secondary Barrier Severity</label>
  <select
    value={secondaryBarrierSeverity}
    onChange={(e) => setSecondaryBarrierSeverity(Number(e.target.value))}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value={0}>None</option>
    <option value={1}>Low</option>
    <option value={2}>Moderate</option>
    <option value={3}>High</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Support Level</label>
  <select
    value={supportLevel}
    onChange={(e) => setSupportLevel(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="No Support">No Support</option>
    <option value="Intermittent Support">Intermittent Support</option>
    <option value="Daily Support">Daily Support</option>
    <option value="Full-Time Support">Full-Time Support</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Safety Risk Level</label>
  <select
    value={safetyRiskLevel}
    onChange={(e) => setSafetyRiskLevel(e.target.value)}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Age Range</label>
<select
  value={ageRange}
  onChange={(e) => setAgeRange(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
>
  <option value="Under 18">Under 18</option>
  <option value="18-39">18–39</option>
  <option value="40-49">40–49</option>
  <option value="50-59">50–59</option>
  <option value="60-69">60–69</option>
  <option value="70-79">70–79</option>
  <option value="80-89">80–89</option>
  <option value="90+">90+</option>
</select>
</div>

</div>     
                <input
                  type="text"
                  placeholder="Primary Diagnosis"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h2 className="text-xl font-semibold mb-4">OT Focus</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Primary Goal</label>
                <textarea
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 min-h-[120px]"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h2 className="mb-1 text-xl font-semibold">Functional Status</h2>
              <p className="mb-4 text-sm text-gray-400">
                Drives safety risk, progression tracking, and treatment recommendations.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Assistance Level
                  </label>
                  <select
                    value={assistanceLevel}
                    onChange={(e) => setAssistanceLevel(e.target.value)}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
                  >
                    {assistLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                  <h3 className="text-sm font-semibold mb-3">ADL Assist Levels</h3>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bed Transfer</label>
                      <select
                        value={adlAssistLevels.bed_transfer}
                        onChange={(e) => updateAdlAssistLevel("bed_transfer", e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
                      >
                        {assistLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Toilet Transfer</label>
                      <select
                        value={adlAssistLevels.toilet_transfer}
                        onChange={(e) => updateAdlAssistLevel("toilet_transfer", e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
                      >
                        {assistLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Shower Transfer</label>
                      <select
                        value={adlAssistLevels.shower_transfer}
                        onChange={(e) => updateAdlAssistLevel("shower_transfer", e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
                      >
                        {assistLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Key Barriers</label>
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
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
              <h2 className="mb-1 text-xl font-semibold">Home Assessment</h2>
              <p className="mb-4 text-sm text-gray-400">
                Improves safety recommendations and environmental modification guidance.
              </p>

              <div className="space-y-8">
                <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                  <h3 className="text-lg font-semibold mb-4">Outside / Entrance</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Driveway Surface</label>
                      <select
                        value={drivewaySurface}
                        onChange={(e) => setDrivewaySurface(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="smooth">Smooth</option>
                        <option value="rough">Rough</option>
                        <option value="inclined">Inclined</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Parking</label>
                      <select
                        value={parkingType}
                        onChange={(e) => setParkingType(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="driveway">Driveway</option>
                        <option value="garage">Garage</option>
                        <option value="parking_lot">Parking lot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Entry Access</label>
                      <select
                        value={entryAccess}
                        onChange={(e) => setEntryAccess(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="front">Front</option>
                        <option value="side">Side</option>
                        <option value="garage">Garage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Steps Present</label>
                      <select
                        value={stepsPresent}
                        onChange={(e) => setStepsPresent(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Steps</label>
                      <input
                        type="text"
                        value={numberOfSteps}
                        onChange={(e) => setNumberOfSteps(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                        placeholder="e.g. 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Step Height</label>
                      <input
                        type="text"
                        value={stepHeight}
                        onChange={(e) => setStepHeight(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                        placeholder="e.g. 6 inches"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Step Depth</label>
                      <input
                        type="text"
                        value={stepDepth}
                        onChange={(e) => setStepDepth(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                        placeholder="e.g. 11 inches"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Railings</label>
                      <select
                        value={railingsPresent}
                        onChange={(e) => setRailingsPresent(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                        <option value="na">N/A</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Door Type</label>
                      <select
                        value={doorType}
                        onChange={(e) => setDoorType(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="standard">Standard</option>
                        <option value="sliding">Sliding</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Door Width</label>
                      <input
                        type="text"
                        value={doorWidth}
                        onChange={(e) => setDoorWidth(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                        placeholder="e.g. 32 inches"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mailbox Location</label>
                      <select
                        value={mailboxLocation}
                        onChange={(e) => setMailboxLocation(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="porch">Porch</option>
                        <option value="garage">Garage</option>
                        <option value="driveway">Driveway</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Exterior Hazards</label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                        className="w-full mt-3 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>
                                <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                 <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
  <h3 className="text-lg font-semibold mb-4">Transfer Surfaces</h3>

 <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium mb-2">Primary Seating</label>
      <select
        value={transferSurfaces.chair_type}
        onChange={(e) =>
          setTransferSurfaces({
            ...transferSurfaces,
            chair_type: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="chair">Chair</option>
        <option value="recliner">Recliner</option>
        <option value="couch">Couch</option>
        <option value="wheelchair">Wheelchair</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Seat Height</label>
      <select
        value={transferSurfaces.bed_height}
        onChange={(e) =>
          setTransferSurfaces({
            ...transferSurfaces,
            bed_height: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="low">Low</option>
        <option value="standard">Standard</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Armrests Present</label>
      <select
        value={transferSurfaces.toilet_height}
        onChange={(e) =>
          setTransferSurfaces({
            ...transferSurfaces,
            toilet_height: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>

   <div>
  <label className="block text-sm font-medium mb-2">Surface Firmness</label>
  <select
    value={transferSurfaces.surface_firmness}
    onChange={(e) =>
      setTransferSurfaces({
        ...transferSurfaces,
        surface_firmness: e.target.value,
      })
    }
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  >
    <option value="firm">Firm</option>
    <option value="soft">Soft</option>
    <option value="very_soft">Very Soft</option>
  </select>
</div>

    <div>
      <label className="block text-sm font-medium mb-2">Sit-to-Stand Difficulty</label>
      <select
        value={transferSurfaces.shower_access_type}
        onChange={(e) =>
          setTransferSurfaces({
            ...transferSurfaces,
            shower_access_type: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="none">None</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </div>

   <div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">Assistive Device Used</label>
  <input
    type="text"
    value={transferSurfaces.assistive_device_used}
    onChange={(e) =>
      setTransferSurfaces({
        ...transferSurfaces,
        assistive_device_used: e.target.value,
      })
    }
    placeholder="e.g. walker, cane, none"
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
  />
</div>
  </div>
</div> 
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
  <h3 className="text-lg font-semibold mb-4">General Mobility</h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium mb-2">Primary Mobility Device</label>
      <select
        value={generalMobility.device_used}
        onChange={(e) =>
          setGeneralMobility({
            ...generalMobility,
            device_used: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="none">None</option>
        <option value="cane">Cane</option>
        <option value="walker">Walker</option>
        <option value="wheelchair">Wheelchair</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Indoor Mobility Level</label>
      <select
        value={generalMobility.mobility_status}
        onChange={(e) =>
          setGeneralMobility({
            ...generalMobility,
            mobility_status: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="independent">Independent</option>
        <option value="supervision">Supervision</option>
        <option value="assist">Assist</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Endurance</label>
      <select
        value={generalMobility.endurance_limitations}
        onChange={(e) =>
          setGeneralMobility({
            ...generalMobility,
            endurance_limitations: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="good">Good</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Recent Falls</label>
      <select
        value={generalMobility.mobility_notes}
        onChange={(e) =>
          setGeneralMobility({
            ...generalMobility,
            mobility_notes: e.target.value,
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
    </div>
  </div>
</div>                

                <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                  <h3 className="text-lg font-semibold mb-4">Bathroom</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bathroom Type</label>
                      <select
                        value={bathroomType}
                        onChange={(e) => setBathroomType(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="tub_shower_combo">Tub/Shower Combo</option>
                        <option value="walk_in_shower">Walk-In Shower</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Space Constraints</label>
                      <select
                        value={spaceConstraints}
                        onChange={(e) => setSpaceConstraints(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="moderate">Moderate</option>
                        <option value="significant">Significant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Toilet Setup</label>
                      <select
                        value={toiletSetup}
                        onChange={(e) => setToiletSetup(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="standard">Standard toilet</option>
                        <option value="comfort_height">Comfort-height toilet</option>
                        <option value="raised_toilet_seat">Raised toilet seat</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bath Transfer Surface</label>
                      <select
                        value={transferSurface}
                        onChange={(e) => setTransferSurface(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="tub_edge">Tub edge</option>
                        <option value="walk_in_shower_threshold">Walk-in shower threshold</option>
                        <option value="roll_in_shower">Roll-in shower</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Grab Bars</label>
                      <select
                        value={grabBarsStatus}
                        onChange={(e) => setGrabBarsStatus(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="none">None</option>
                        <option value="toilet_only">Toilet only</option>
                        <option value="shower_only">Shower only</option>
                        <option value="toilet_and_shower">Toilet and shower</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Handheld Shower</label>
                      <select
                        value={handheldShowerStatus}
                        onChange={(e) => setHandheldShowerStatus(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Bath Seating</label>
                      <select
                        value={bathSeating}
                        onChange={(e) => setBathSeating(e.target.value)}
                        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      >
                        <option value="none">None</option>
                        <option value="shower_chair">Shower chair</option>
                        <option value="tub_bench">Tub bench</option>
                        <option value="built_in_bench">Built-in bench</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Safety Hazards</label>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
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
                        placeholder="Other safety hazards (comma-separated, optional)"
                        value={otherSafetyHazards}
                        onChange={(e) => setOtherSafetyHazards(e.target.value)}
                        className="w-full mt-3 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
           </section>

{generatedPlan && (
  <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
   <div>
  <h2 className="text-2xl font-semibold">Treatment Plan</h2>
 <p className="text-sm text-gray-400 mt-1">
  Edit the structured treatment plan below or regenerate after updating case inputs.
</p>
</div>

    <div>
      <label className="block text-sm font-medium mb-2">Patient Snapshot</label>
      <textarea
        value={generatedPlan.patientSnapshot}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            patientSnapshot: e.target.value,
          })
        }
        rows={6}
        className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>

{generatedPlan.summary && (
  <div className="rounded-xl border border-yellow-700 bg-gray-950 p-5 space-y-5">
    <h3 className="text-xl font-semibold">Plan Overview</h3>

    <div>
      <label className="block text-sm font-medium mb-2">Risk Level</label>
      <select
        value={generatedPlan.summary.safetyLevel || "medium"}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            summary: {
              ...generatedPlan.summary,
              safetyLevel: e.target.value as "low" | "medium" | "high",
            },
          })
        }
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Plan Summary</label>
      <textarea
        value={generatedPlan.summary.planSummary || ""}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            summary: {
              ...generatedPlan.summary,
              planSummary: e.target.value,
            },
          })
        }
        rows={5}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Top Risks</label>
      <textarea
        value={(generatedPlan.summary.topRisks || []).join("\n")}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            summary: {
              ...generatedPlan.summary,
              topRisks: e.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          })
        }
        rows={4}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Caregiver Expectations
      </label>
      <textarea
        value={(generatedPlan.summary.caregiverExpectations || []).join("\n")}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            summary: {
              ...generatedPlan.summary,
              caregiverExpectations: e.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          })
        }
        rows={4}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>
  </div>
)}

    {generatedPlan.functionalProblemAreas &&
  generatedPlan.functionalProblemAreas.length > 0 && (
    <div>
      <label className="block text-sm font-medium mb-2">
        Functional Problem Areas
      </label>
      <textarea
        value={generatedPlan.functionalProblemAreas.join("\n")}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            functionalProblemAreas: e.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          })
        }
        rows={6}
        className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>
  )}

{generatedPlan.taskBreakdown && generatedPlan.taskBreakdown.length > 0 && (
  <div>
    <label className="block text-sm font-medium mb-2">Task Breakdown</label>
    <textarea
      value={generatedPlan.taskBreakdown.join("\n")}
      onChange={(e) =>
        setGeneratedPlan({
          ...generatedPlan,
          taskBreakdown: e.target.value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      }
      rows={8}
      className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
    />
  </div>
)}

{generatedPlan.clinicalConsiderations &&
  generatedPlan.clinicalConsiderations.length > 0 && (
    <div>
      <label className="block text-sm font-medium mb-2">
        Clinical Considerations
      </label>
      <textarea
        value={generatedPlan.clinicalConsiderations.join("\n")}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            clinicalConsiderations: e.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          })
        }
        rows={6}
        className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>
  )}

{generatedPlan.firstSessionPriorities &&
  generatedPlan.firstSessionPriorities.length > 0 && (
    <div>
      <label className="block text-sm font-medium mb-2">
        First Session Priorities
      </label>
      <textarea
        value={generatedPlan.firstSessionPriorities.join("\n")}
        onChange={(e) =>
          setGeneratedPlan({
            ...generatedPlan,
            firstSessionPriorities: e.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          })
        }
        rows={6}
        className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
      />
    </div>
  )}  

  {generatedPlan.sessionPlan && generatedPlan.sessionPlan.length > 0 && (
  <div>
    <label className="block text-sm font-medium mb-2">
      Session Plan (Visit 1–3)
    </label>
    <textarea
      value={generatedPlan.sessionPlan.join("\n")}
      onChange={(e) =>
        setGeneratedPlan({
          ...generatedPlan,
          sessionPlan: e.target.value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        })
      }
      rows={6}
      className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm text-gray-200"
    />
  </div>
)}

{generatedPlan.pathways && generatedPlan.pathways.length > 0 && (
  <div className="space-y-4">
    <label className="block text-sm font-medium">Treatment Approaches</label>

    <div className="space-y-4">
{generatedPlan.pathways.map((pathway, index) => (
  <div
    key={index}
    className="rounded-xl border border-gray-800 bg-gray-950 p-4 space-y-3"
  >
<div>
<div>
  <label className="block text-xs text-gray-400 mb-1">Type</label>
  <input
    type="text"
    value={pathway.type || ""}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        type: e.target.value,
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-blue-300"
  />
</div>

  <label className="block text-xs text-gray-400 mb-1">Title</label>
  <input
    type="text"
    value={pathway.title || ""}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        title: e.target.value,
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-1">Interventions</label>
  <textarea
    value={(pathway.interventions || []).join("\n")}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        interventions: e.target.value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    rows={6}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-1">Timeline</label>
  <input
    type="text"
    value={pathway.timeline || ""}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        timeline: e.target.value,
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-1">Upside</label>
  <input
    type="text"
    value={pathway.upside || ""}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        upside: e.target.value,
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100"
  />
</div>

<div>
  <label className="block text-xs text-gray-400 mb-1">Tradeoff</label>
  <input
    type="text"
    value={pathway.tradeoff || ""}
    onChange={(e) => {
      const updatedPathways = [...(generatedPlan.pathways || [])];
      updatedPathways[index] = {
        ...updatedPathways[index],
        tradeoff: e.target.value,
      };

      setGeneratedPlan({
        ...generatedPlan,
        pathways: updatedPathways,
      });
    }}
    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100"
  />
</div>

        </div>
      ))}
    </div>
  </div>
)}  

  </div>
)}

<button
  type="button"
  onClick={updateCaseOnly}
  disabled={isSaving}
  className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 px-6 py-3 rounded-lg text-lg mr-4"
>
  {isSaving ? "Saving..." : "Update Case Only"}
</button>

<button
  type="button"
  onClick={regenerateAndUpdateCase}
  disabled={isSaving}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-6 py-3 rounded-lg text-lg"
>
  {isSaving ? "Saving..." : "Regenerate + Update Case"}
</button>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
              <p><strong>Loaded Case ID:</strong> {caseId || "—"}</p>
              <p><strong>Client:</strong> {clientName || "—"}</p>
              <p><strong>Diagnosis:</strong> {primaryDiagnosis || "—"}</p>
              <p><strong>Goal:</strong> {primaryGoal || "—"}</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}