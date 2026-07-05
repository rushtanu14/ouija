import type { ExperimentTemplate } from "./types.js";

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
  physicsClassroomPendulum: {
    id: "source-pendulum-physics-classroom",
    title: "Pendulum motion",
    url: "https://www.physicsclassroom.com/tutorial/vibrations-and-waves/vibrations/pendulum-motion",
    publisher: "The Physics Classroom",
    confidence: "built-in" as const,
    note: "Middle/high school reference for pendulum period, length, mass, and arc-angle comparisons."
  },
  khanOhmsLaw: {
    id: "source-ohms-law-khan",
    title: "Ohm's law",
    url: "https://www.khanacademy.org/science/physics/circuits-topic/circuits-resistance/a/ee-ohms-law",
    publisher: "Khan Academy",
    confidence: "built-in" as const,
    note: "Explains the relationship among voltage, current, and resistance in simple circuits."
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
  asuChlorophyll: {
    id: "source-plant-light-asu",
    title: "Chlorophyll and Chloroplasts",
    url: "https://askabiologist.asu.edu/chlorophyll-and-chloroplasts",
    publisher: "Ask A Biologist",
    confidence: "built-in" as const,
    note: "Explains why chlorophyll captures red and blue wavelengths and reflects green wavelengths."
  },
  kidsGardeningLight: {
    id: "source-plant-light-kidsgardening",
    title: "Light Experiments",
    url: "https://kidsgardening.org/resources/lesson-plan-light-experiments/",
    publisher: "KidsGardening",
    confidence: "built-in" as const,
    note: "Classroom-friendly reference for comparing plant growth under different light conditions."
  },
  usgsTurbidity: {
    id: "source-turbidity-usgs",
    title: "Turbidity and water",
    url: "https://www.usgs.gov/special-topics/water-science-school/science/turbidity-and-water",
    publisher: "USGS Water Science School",
    confidence: "built-in" as const,
    note: "Explains turbidity as a water-quality measurement."
  },
  khanDensity: {
    id: "source-density-khan",
    title: "Density and pressure",
    url: "https://www.khanacademy.org/science/physics/fluids/density-and-pressure/a/what-is-density",
    publisher: "Khan Academy",
    confidence: "built-in" as const,
    note: "Explains density as mass per volume and why denser fluids settle below less dense fluids."
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
    id: "pendulum-period-length",
    subject: "Physics",
    title: "Pendulum Period vs Length",
    shortName: "Pendulum",
    matcherKeywords: ["pendulum", "period", "swing", "string", "length", "bob", "oscillation", "cycles"],
    concepts: ["period", "pendulum length", "gravity", "square root relationship"],
    variables: ["length", "period", "release angle", "bob mass"],
    columns: [
      { key: "lengthM", label: "Length", unit: "m", numeric: true },
      { key: "periodS", label: "Period", unit: "s", numeric: true },
      { key: "trial", label: "Trial", numeric: false }
    ],
    sampleRows: [
      { id: "q1", lengthM: 0.2, periodS: 0.9, trial: "short string" },
      { id: "q2", lengthM: 0.4, periodS: 1.27, trial: "medium string" },
      { id: "q3", lengthM: 0.6, periodS: 1.56, trial: "longer string" },
      { id: "q4", lengthM: 0.8, periodS: 1.79, trial: "long string" }
    ],
    expectedResult: {
      summary: "A longer pendulum usually has a longer period. The increase is not linear; period grows roughly with the square root of length for small swings.",
      pattern: "Square-root relationship: longer string = longer period, while bob mass should have little effect if length and release angle stay controlled.",
      graphTitle: "Pendulum length vs period",
      xKey: "lengthM",
      yKey: "periodS",
      graphKind: "line",
      mixedEvidence: false
    },
    explanation:
      "For small swings, a simple pendulum's period depends mainly on its length and local gravity. Increasing the string length makes each swing take longer, but doubling length does not double the period.",
    commonMistakes: [
      "Timing one swing instead of averaging several cycles.",
      "Measuring string length without including the bob's center of mass.",
      "Changing release angle while testing length."
    ],
    fallbackSources: [TRUSTED_SOURCES.physicsClassroomPendulum]
  },
  {
    id: "ohms-law-circuits",
    subject: "Physics",
    title: "Ohm's Law Circuits",
    shortName: "Ohm's Law",
    matcherKeywords: ["ohm", "ohm's law", "circuit", "voltage", "current", "resistance", "resistor", "amp", "electric"],
    concepts: ["voltage", "current", "resistance", "linear relationship"],
    variables: ["current", "voltage", "resistance"],
    columns: [
      { key: "currentA", label: "Current", unit: "A", numeric: true },
      { key: "voltageV", label: "Voltage", unit: "V", numeric: true },
      { key: "resistanceOhm", label: "Resistance", unit: "ohm", numeric: true },
      { key: "trial", label: "Trial", numeric: false }
    ],
    sampleRows: [
      { id: "o1", currentA: 0.1, voltageV: 1.0, resistanceOhm: 10, trial: "low current" },
      { id: "o2", currentA: 0.2, voltageV: 2.0, resistanceOhm: 10, trial: "medium current" },
      { id: "o3", currentA: 0.3, voltageV: 3.0, resistanceOhm: 10, trial: "higher current" },
      { id: "o4", currentA: 0.4, voltageV: 4.0, resistanceOhm: 10, trial: "highest current" }
    ],
    expectedResult: {
      summary: "For a fixed resistor at constant temperature, voltage should increase in direct proportion to current, and calculated resistance should stay nearly constant.",
      pattern: "Linear relationship: as current increases, voltage increases at a steady rate; resistance stays about the same.",
      graphTitle: "Current vs voltage",
      xKey: "currentA",
      yKey: "voltageV",
      graphKind: "line",
      mixedEvidence: false
    },
    explanation:
      "Ohm's law connects voltage, current, and resistance. In a simple resistor circuit, the voltage across the resistor equals current multiplied by resistance, so a voltage-current graph should be close to a straight line.",
    commonMistakes: [
      "Recording current in milliamps but labeling it as amps.",
      "Changing the resistor while testing current and voltage.",
      "Letting the resistor heat up enough to change resistance."
    ],
    fallbackSources: [TRUSTED_SOURCES.khanOhmsLaw]
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
    id: "plant-growth-light-color",
    subject: "Biology",
    title: "Plant Growth vs Light Color",
    shortName: "Plant Light",
    matcherKeywords: [
      "plant",
      "seedling",
      "bean",
      "sprout",
      "germination",
      "light color",
      "red light",
      "blue light",
      "green light",
      "white light",
      "photosynthesis",
      "chlorophyll",
      "growth"
    ],
    concepts: ["photosynthesis", "chlorophyll", "wavelength", "controlled variables"],
    variables: ["light color", "plant height", "light duration", "water amount"],
    columns: [
      { key: "lightColor", label: "Light color", numeric: false },
      { key: "heightCm", label: "Plant height", unit: "cm", numeric: true },
      { key: "days", label: "Growth time", unit: "days", numeric: true },
      { key: "trial", label: "Trial", numeric: false }
    ],
    sampleRows: [
      { id: "l1", lightColor: "White light", heightCm: 13.1, days: 14, trial: "control" },
      { id: "l2", lightColor: "Red light", heightCm: 12.4, days: 14, trial: "red filter" },
      { id: "l3", lightColor: "Blue light", heightCm: 11.8, days: 14, trial: "blue filter" },
      { id: "l4", lightColor: "Green light", heightCm: 6.2, days: 14, trial: "green filter" },
      { id: "l5", lightColor: "Dark", heightCm: 1.4, days: 14, trial: "no light" }
    ],
    expectedResult: {
      summary:
        "Plants usually grow better with usable light than in darkness, and chlorophyll uses red and blue wavelengths strongly. Exact height depends on plant species, brightness, duration, and setup.",
      pattern:
        "Grouped relationship: white, red, and blue light should generally support more growth than green light or darkness when light duration, distance, water, soil, and plant type stay controlled.",
      graphTitle: "Light color vs plant height",
      xKey: "lightColor",
      yKey: "heightCm",
      graphKind: "stage",
      mixedEvidence: true
    },
    explanation:
      "Plant growth depends on photosynthesis, where pigments such as chlorophyll capture light energy. Because chlorophyll absorbs red and blue wavelengths strongly and reflects much green light, color can affect growth, but classroom results also depend heavily on intensity, distance, duration, plant type, and water.",
    commonMistakes: [
      "Changing light distance or brightness while testing color.",
      "Using only one plant per color and treating it as enough evidence.",
      "Measuring at different times or starting plants at different sizes."
    ],
    fallbackSources: [TRUSTED_SOURCES.asuChlorophyll, TRUSTED_SOURCES.kidsGardeningLight]
  },
  {
    id: "density-layering",
    subject: "Chemistry",
    title: "Density Layering",
    shortName: "Density Layers",
    matcherKeywords: ["density", "layer", "layering", "corn syrup", "oil", "liquid column", "float", "sink", "graduated cylinder"],
    concepts: ["density", "mass per volume", "liquid layers", "float and sink"],
    variables: ["liquid type", "density", "layer order"],
    columns: [
      { key: "layerOrder", label: "Layer order", unit: "bottom=1", numeric: true },
      { key: "liquid", label: "Liquid", numeric: false },
      { key: "densityGml", label: "Density", unit: "g/mL", numeric: true },
      { key: "observation", label: "Observation", numeric: false }
    ],
    sampleRows: [
      { id: "d1", layerOrder: 1, liquid: "Corn syrup", densityGml: 1.33, observation: "bottom layer" },
      { id: "d2", layerOrder: 2, liquid: "Salt water", densityGml: 1.05, observation: "below water" },
      { id: "d3", layerOrder: 3, liquid: "Water", densityGml: 1.0, observation: "middle layer" },
      { id: "d4", layerOrder: 4, liquid: "Vegetable oil", densityGml: 0.92, observation: "top layer" }
    ],
    expectedResult: {
      summary: "In a stable density column, denser liquids settle below less dense liquids, so density should generally decrease from the bottom layer to the top layer.",
      pattern: "Layer relationship: bottom layers should have higher density; top layers should have lower density.",
      graphTitle: "Liquid layer vs density",
      xKey: "liquid",
      yKey: "densityGml",
      graphKind: "stage",
      mixedEvidence: true
    },
    explanation:
      "Density compares mass to volume. When liquids do not mix, denser liquids sink below less dense liquids, creating visible layers in a classroom density column.",
    commonMistakes: [
      "Listing top-to-bottom order while labeling the column as bottom-to-top.",
      "Assuming color determines density.",
      "Using liquids that mix together and then expecting stable layers."
    ],
    fallbackSources: [TRUSTED_SOURCES.khanDensity]
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
