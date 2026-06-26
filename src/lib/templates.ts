import type { ExperimentTemplate } from "./types";

export const TRUSTED_SOURCES = {
  khanProjectile: {
    id: "source-projectile-khan",
    title: "Projectile motion basics",
    url: "https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot",
    publisher: "Khan Academy",
    confidence: "built-in" as const,
    note: "Useful for decomposing motion into horizontal and vertical components."
  },
  physicsClassroomProjectile: {
    id: "source-projectile-physics-classroom",
    title: "Projectile motion",
    url: "https://www.physicsclassroom.com/class/vectors/Lesson-2/What-is-a-Projectile",
    publisher: "The Physics Classroom",
    confidence: "built-in" as const,
    note: "Middle/high school explanation of projectile paths and range."
  },
  chemLibreRate: {
    id: "source-rate-libre",
    title: "Factors that affect reaction rates",
    url: "https://chem.libretexts.org/Bookshelves/Introductory_Chemistry/Introductory_Chemistry/17%3A_Kinetics/17.02%3A_Factors_That_Affect_Reaction_Rates",
    publisher: "Chemistry LibreTexts",
    confidence: "built-in" as const,
    note: "Grounds the expected relationship between temperature and reaction speed."
  },
  bioLibreEnzymes: {
    id: "source-enzyme-libre",
    title: "Enzymes and reaction rates",
    url: "https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/Introductory_Biology_(CK-12)/02%3A_Cell_Biology/2.05%3A_Enzymes",
    publisher: "Biology LibreTexts",
    confidence: "built-in" as const,
    note: "Explains enzyme activity, optimum conditions, and denaturation."
  },
  usgsTurbidity: {
    id: "source-turbidity-usgs",
    title: "Turbidity and water",
    url: "https://www.usgs.gov/special-topics/water-science-school/science/turbidity-and-water",
    publisher: "USGS Water Science School",
    confidence: "built-in" as const,
    note: "Explains turbidity as a water-quality measurement."
  }
};

export const EXPERIMENT_TEMPLATES: ExperimentTemplate[] = [
  {
    id: "projectile-motion",
    subject: "Physics",
    title: "Projectile Motion",
    shortName: "Projectile Motion",
    matcherKeywords: ["projectile", "launch", "angle", "range", "trajectory", "ball", "horizontal", "vertical"],
    concepts: ["horizontal velocity", "vertical acceleration", "range", "time of flight"],
    variables: ["launch angle", "launch speed", "range", "time"],
    columns: [
      { key: "angleDeg", label: "Angle", unit: "deg", numeric: true },
      { key: "launchSpeedMs", label: "Launch speed", unit: "m/s", numeric: true },
      { key: "rangeM", label: "Measured range", unit: "m", numeric: true },
      { key: "timeS", label: "Time", unit: "s", numeric: true }
    ],
    sampleRows: [
      { id: "p1", angleDeg: 20, launchSpeedMs: 12, rangeM: 9.2, timeS: 1.0 },
      { id: "p2", angleDeg: 35, launchSpeedMs: 12, rangeM: 13.1, timeS: 1.4 },
      { id: "p3", angleDeg: 45, launchSpeedMs: 12, rangeM: 14.6, timeS: 1.7 },
      { id: "p4", angleDeg: 60, launchSpeedMs: 12, rangeM: 12.7, timeS: 2.1 }
    ],
    expectedResult: {
      summary: "For a fixed launch speed and level landing height, range generally grows as the launch angle approaches about 45 degrees, then shrinks at steeper angles.",
      pattern: "Curved relationship: low angle = shorter range, near 45 degrees = longest range, steep angle = shorter range.",
      graphTitle: "Launch angle vs measured range",
      xKey: "angleDeg",
      yKey: "rangeM",
      graphKind: "scatter",
      mixedEvidence: false
    },
    explanation:
      "Projectile motion separates into horizontal motion at nearly constant velocity and vertical motion under gravity. The range depends on both how fast the object moves horizontally and how long it stays in the air.",
    commonMistakes: [
      "Mixing degrees and radians.",
      "Changing launch speed while testing angle.",
      "Ignoring launch height when the landing point is not level."
    ],
    fallbackSources: [TRUSTED_SOURCES.khanProjectile, TRUSTED_SOURCES.physicsClassroomProjectile]
  },
  {
    id: "reaction-rate-temperature",
    subject: "Chemistry",
    title: "Reaction Rate vs Temperature",
    shortName: "Reaction Rate",
    matcherKeywords: ["reaction rate", "temperature", "concentration", "rate", "chemical", "effervescence", "tablet"],
    concepts: ["collision theory", "reaction rate", "temperature", "controlled variables"],
    variables: ["temperature", "reaction time", "rate"],
    columns: [
      { key: "tempC", label: "Temperature", unit: "C", numeric: true },
      { key: "reactionTimeS", label: "Reaction time", unit: "s", numeric: true },
      { key: "ratePerS", label: "Rate", unit: "1/s", numeric: true }
    ],
    sampleRows: [
      { id: "c1", tempC: 10, reactionTimeS: 118, ratePerS: 0.008 },
      { id: "c2", tempC: 22, reactionTimeS: 74, ratePerS: 0.014 },
      { id: "c3", tempC: 35, reactionTimeS: 44, ratePerS: 0.023 },
      { id: "c4", tempC: 50, reactionTimeS: 25, ratePerS: 0.04 }
    ],
    expectedResult: {
      summary: "For many classroom reactions, warmer conditions make particles collide more often and with more energy, so reaction time decreases and rate increases.",
      pattern: "Increasing temperature should usually increase reaction rate, as long as the experiment keeps concentration and amounts controlled.",
      graphTitle: "Temperature vs reaction rate",
      xKey: "tempC",
      yKey: "ratePerS",
      graphKind: "line",
      mixedEvidence: false
    },
    explanation:
      "Temperature affects particle motion. Higher temperature usually increases the fraction of collisions with enough energy to react, so the observed reaction tends to finish faster.",
    commonMistakes: [
      "Comparing reaction time as if larger time means faster reaction.",
      "Changing concentration or tablet size between trials.",
      "Not using the same endpoint for each timing measurement."
    ],
    fallbackSources: [TRUSTED_SOURCES.chemLibreRate]
  },
  {
    id: "enzyme-activity-temperature",
    subject: "Biology",
    title: "Enzyme Activity vs Temperature",
    shortName: "Enzyme Activity",
    matcherKeywords: ["enzyme", "catalase", "amylase", "temperature", "ph", "activity", "denature"],
    concepts: ["enzyme activity", "optimum temperature", "denaturation", "reaction rate"],
    variables: ["temperature", "enzyme activity", "optimum"],
    columns: [
      { key: "tempC", label: "Temperature", unit: "C", numeric: true },
      { key: "activity", label: "Relative activity", unit: "%", numeric: true },
      { key: "trial", label: "Trial", numeric: false }
    ],
    sampleRows: [
      { id: "b1", tempC: 5, activity: 18, trial: "cold" },
      { id: "b2", tempC: 22, activity: 64, trial: "room temp" },
      { id: "b3", tempC: 37, activity: 100, trial: "warm" },
      { id: "b4", tempC: 70, activity: 12, trial: "hot" }
    ],
    expectedResult: {
      summary: "Enzyme activity usually rises toward an optimum temperature, then drops when heat disrupts the enzyme's shape.",
      pattern: "Peak-shaped relationship: low activity when cold, highest near the enzyme's optimum, lower after overheating.",
      graphTitle: "Temperature vs enzyme activity",
      xKey: "tempC",
      yKey: "activity",
      graphKind: "line",
      mixedEvidence: false
    },
    explanation:
      "Enzymes are proteins with shapes that help reactions happen. Temperature can speed reactions up to an optimum, but high heat can denature the enzyme and reduce activity.",
    commonMistakes: [
      "Assuming hotter always means faster for enzymes.",
      "Mixing pH and temperature as independent variables in the same test.",
      "Comparing different enzyme amounts between trials."
    ],
    fallbackSources: [TRUSTED_SOURCES.bioLibreEnzymes]
  },
  {
    id: "water-filtration-turbidity",
    subject: "Earth Science",
    title: "Water Filtration and Turbidity",
    shortName: "Water Filtration",
    matcherKeywords: ["water filtration", "filter", "turbidity", "soil", "sediment", "water quality", "clarity"],
    concepts: ["turbidity", "sediment", "filtration", "water quality"],
    variables: ["filter stage", "turbidity", "clarity"],
    columns: [
      { key: "stage", label: "Filter stage", numeric: false },
      { key: "turbidityNTU", label: "Turbidity", unit: "NTU", numeric: true },
      { key: "notes", label: "Observation", numeric: false }
    ],
    sampleRows: [
      { id: "e1", stage: "Before filter", turbidityNTU: 94, notes: "cloudy" },
      { id: "e2", stage: "Gravel", turbidityNTU: 61, notes: "large sediment removed" },
      { id: "e3", stage: "Sand", turbidityNTU: 31, notes: "clearer" },
      { id: "e4", stage: "Charcoal", turbidityNTU: 18, notes: "least cloudy" }
    ],
    expectedResult: {
      summary: "A working filter should usually lower turbidity after each major filtration stage, although exact values depend on the material and starting water.",
      pattern: "Stage relationship: turbidity should generally decrease from before-filter to final-filter samples.",
      graphTitle: "Filter stage vs turbidity",
      xKey: "stage",
      yKey: "turbidityNTU",
      graphKind: "stage",
      mixedEvidence: true
    },
    explanation:
      "Turbidity measures how cloudy water is from suspended particles. Filtration removes some particles, so a successful classroom filter should make the water less turbid.",
    commonMistakes: [
      "Calling clearer water safe to drink without testing safety.",
      "Using different starting water for different filter stages.",
      "Judging only by appearance instead of a consistent turbidity measure."
    ],
    fallbackSources: [TRUSTED_SOURCES.usgsTurbidity]
  }
];
