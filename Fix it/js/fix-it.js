const AQI_MAP = {
  "dark green": -2,
  "light green": -1,
  yellow: 1,
  orange: 2,
  red: 3,
  "dark red": 4,
  "light red": 3,
  none: 0
};

const BOARD_SLOTS = [24, 17, 18, 25, 32, 31, 30, 10, 11, 19, 26, 33, 39, 38, 37, 12, 20, 27, 34, 40, 46, 41, 45, 23, 29, 35];

const TILES = [
  { name: "Forest", category: "Green spaces", color: "dark green", count: 3, development: 2, jobs: 0, housing: 0, water: 1, power: 0, ideology: { activist: 3, citizen: 1 }, publicInfra: false, tags: ["green", "buffer", "public"] },
  { name: "Public Park", category: "Green spaces", color: "light green", count: 3, development: 3, jobs: 0, housing: 0, water: 0, power: 0, ideology: { activist: 2, citizen: 1 }, publicInfra: true, tags: ["green", "public"] },
  { name: "Airport", category: "Public Transportation", color: "dark red", count: 1, development: 12, jobs: 4, housing: 0, water: -1, power: -1, ideology: { builder: 3, industrialist: 1 }, publicInfra: true, tags: ["transport", "freight"] },
  { name: "Railway", category: "Public Transportation", color: "orange", count: 1, development: 8, jobs: 2, housing: 0, water: 0, power: 0, ideology: { policymaker: 2, builder: 1 }, publicInfra: true, tags: ["transport", "mass"] },
  { name: "Bus Stop", category: "Public Transportation", color: "yellow", count: 2, development: 5, jobs: 1, housing: 0, water: 0, power: 0, ideology: { policymaker: 2, citizen: 1 }, publicInfra: true, tags: ["transport", "public"] },
  { name: "Metro", category: "Public Transportation", color: "yellow", count: 2, development: 10, jobs: 2, housing: 0, water: 0, power: -1, ideology: { policymaker: 3, activist: 1 }, publicInfra: true, tags: ["transport", "mass"] },
  { name: "Highway", category: "Public Transportation", color: "orange", count: 2, development: 11, jobs: 3, housing: 0, water: -1, power: -1, ideology: { builder: 2, industrialist: 2 }, publicInfra: true, tags: ["road", "traffic", "freight"] },
  { name: "Roadways", category: "Public Transportation", color: "yellow", count: 1, development: 6, jobs: 1, housing: 0, water: 0, power: 0, ideology: { builder: 1, citizen: 1 }, publicInfra: true, tags: ["road", "traffic"] },
  { name: "Roadways", category: "Public Transportation", color: "orange", count: 1, development: 7, jobs: 1, housing: 0, water: -1, power: 0, ideology: { builder: 1, industrialist: 1 }, publicInfra: true, tags: ["road", "traffic"] },
  { name: "Roadways", category: "Public Transportation", color: "red", count: 1, development: 8, jobs: 1, housing: 0, water: -1, power: 0, ideology: { builder: 2, industrialist: 1 }, publicInfra: true, tags: ["road", "traffic"] },
  { name: "School", category: "Institutions", color: "yellow", count: 2, development: 7, jobs: 1, housing: 0, water: 0, power: 0, ideology: { activist: 1, citizen: 2, policymaker: 1 }, publicInfra: true, tags: ["institution", "public"] },
  { name: "College", category: "Institutions", color: "yellow", count: 1, development: 8, jobs: 1, housing: 0, water: 0, power: 0, ideology: { citizen: 1, policymaker: 2 }, publicInfra: true, tags: ["institution"] },
  { name: "Hospital", category: "Institutions", color: "yellow", count: 1, development: 9, jobs: 2, housing: 0, water: -1, power: -1, ideology: { citizen: 3, policymaker: 1 }, publicInfra: true, tags: ["health", "public"] },
  { name: "Hospital", category: "Institutions", color: "orange", count: 1, development: 10, jobs: 2, housing: 0, water: -1, power: -1, ideology: { citizen: 3, policymaker: 1 }, publicInfra: true, tags: ["health", "public"] },
  { name: "Govt Office", category: "Institutions", color: "orange", count: 1, development: 7, jobs: 1, housing: 0, water: 0, power: 0, ideology: { policymaker: 2 }, publicInfra: true, tags: ["institution"] },
  { name: "Pvt Office", category: "Institutions", color: "orange", count: 2, development: 8, jobs: 2, housing: 0, water: 0, power: -1, ideology: { builder: 1, industrialist: 1 }, publicInfra: false, tags: ["office", "jobs"] },
  { name: "Thermal Power Plant", category: "Energy source", color: "dark red", count: 2, development: 12, jobs: 2, housing: 0, water: -2, power: 5, ideology: { industrialist: 3, builder: 1 }, publicInfra: true, tags: ["power", "coal"] },
  { name: "Methane Power Plant", category: "Energy source", color: "light green", count: 1, development: 8, jobs: 1, housing: 0, water: 0, power: 3, ideology: { policymaker: 1, activist: 1 }, publicInfra: true, tags: ["power", "transition"] },
  { name: "Solar Power Plant", category: "Energy source", color: "light green", count: 1, development: 7, jobs: 1, housing: 0, water: 0, power: 3, ideology: { policymaker: 3, activist: 1 }, publicInfra: true, tags: ["power", "clean"] },
  { name: "EV Charging Station", category: "Energy source", color: "light green", count: 1, development: 5, jobs: 0, housing: 0, water: 0, power: -1, ideology: { policymaker: 2, activist: 2 }, publicInfra: true, tags: ["mobility", "clean"] },
  { name: "CNG Station", category: "Energy source", color: "yellow", count: 1, development: 5, jobs: 0, housing: 0, water: 0, power: -1, ideology: { policymaker: 2 }, publicInfra: true, tags: ["mobility", "transition"] },
  { name: "Petrol Pump", category: "Energy source", color: "orange", count: 2, development: 6, jobs: 0, housing: 0, water: 0, power: 0, ideology: { builder: 1, industrialist: 1 }, publicInfra: false, tags: ["fuel", "vehicle"] },
  { name: "DG Set", category: "Energy source", color: "red", count: 2, development: 4, jobs: 0, housing: 0, water: 0, power: 2, ideology: { builder: 1, industrialist: 1 }, publicInfra: false, tags: ["backup", "diesel"] },
  { name: "High-rise Housing", category: "Residential", color: "orange", count: 3, development: 9, jobs: 0, housing: 4, water: -1, power: -1, ideology: { builder: 3 }, publicInfra: false, tags: ["housing", "density"] },
  { name: "Slums", category: "Residential", color: "yellow", count: 2, development: 4, jobs: 0, housing: 2, water: -1, power: -1, ideology: { citizen: 2 }, publicInfra: false, tags: ["housing", "informal"] },
  { name: "Affordable Housing", category: "Residential", color: "yellow", count: 2, development: 8, jobs: 0, housing: 4, water: -1, power: -1, ideology: { citizen: 2, builder: 1 }, publicInfra: false, tags: ["housing", "social"] },
  { name: "Residential Landfill", category: "Waste disposal", color: "red", count: 2, development: 3, jobs: 0, housing: 0, water: -1, power: 0, ideology: { builder: 1, industrialist: 1 }, publicInfra: false, tags: ["waste"] },
  { name: "City Landfill", category: "Waste disposal", color: "dark red", count: 2, development: 4, jobs: 1, housing: 0, water: -2, power: 0, ideology: { builder: 1, industrialist: 2 }, publicInfra: false, tags: ["waste"] },
  { name: "Sewage Treatment Plant", category: "Waste disposal", color: "yellow", count: 1, development: 7, jobs: 1, housing: 0, water: 3, power: -1, ideology: { policymaker: 2, citizen: 1 }, publicInfra: true, tags: ["water", "waste", "public"] },
  { name: "Mall", category: "Commercial", color: "orange", count: 1, development: 9, jobs: 2, housing: 0, water: -1, power: -1, ideology: { builder: 3 }, publicInfra: false, tags: ["commerce"] },
  { name: "Weekly Market", category: "Commercial", color: "yellow", count: 1, development: 6, jobs: 2, housing: 0, water: 0, power: 0, ideology: { citizen: 1, builder: 1 }, publicInfra: false, tags: ["commerce", "local"] },
  { name: "Mixed Market", category: "Commercial", color: "yellow", count: 2, development: 7, jobs: 2, housing: 0, water: 0, power: 0, ideology: { citizen: 1, builder: 1 }, publicInfra: false, tags: ["commerce", "local"] },
  { name: "Hotel", category: "Commercial", color: "orange", count: 1, development: 8, jobs: 1, housing: 0, water: -1, power: -1, ideology: { builder: 2, industrialist: 1 }, publicInfra: false, tags: ["commerce"] },
  { name: "SSI", category: "Industrial", color: "dark red", count: 3, development: 10, jobs: 4, housing: 0, water: -1, power: -1, ideology: { industrialist: 2, builder: 1 }, publicInfra: false, tags: ["industry", "jobs"] },
  { name: "Large-scale Industry", category: "Industrial", color: "dark red", count: 4, development: 13, jobs: 5, housing: 0, water: -2, power: -2, ideology: { industrialist: 3, builder: 1 }, publicInfra: false, tags: ["industry", "jobs"] },
  { name: "Construction", category: "Industrial", color: "light red", count: 2, development: 8, jobs: 3, housing: 0, water: -1, power: -1, ideology: { builder: 3 }, publicInfra: false, tags: ["construction"] },
  { name: "Barren Land", category: "Misc.", color: "light green", count: 2, development: 1, jobs: 0, housing: 0, water: 0, power: 0, ideology: { builder: 1 }, publicInfra: false, tags: ["open"] },
  { name: "Agricultural Land", category: "Misc.", color: "light green", count: 3, development: 3, jobs: 1, housing: 0, water: 1, power: 0, ideology: { citizen: 1, activist: 1 }, publicInfra: false, tags: ["agriculture"] },
  { name: "Urban Village", category: "Misc.", color: "light green", count: 2, development: 4, jobs: 1, housing: 1, water: -1, power: -1, ideology: { citizen: 2 }, publicInfra: false, tags: ["settlement"] },
  { name: "Rural Village", category: "Misc.", color: "light green", count: 1, development: 3, jobs: 1, housing: 1, water: 0, power: 0, ideology: { citizen: 2 }, publicInfra: false, tags: ["settlement"] }
];

const TILE_LIBRARY = [];
TILES.forEach(tile => {
  // Roadways and Highway are now road-edge properties of the grid, not placeable tiles
  if (["Roadways", "Highway"].includes(tile.name)) return;
  for (let i = 0; i < tile.count; i++) {
    TILE_LIBRARY.push({
      ...structuredClone(tile),
      id: `${tile.name}-${i + 1}`,
      aqiShift: AQI_MAP[tile.color] ?? 0,
      pollutionTokens: 0,
      solutionTokens: 0,
      flippedFor: 0,
      disabled: false
    });
  }
});

// Enrich every TILE_LIBRARY entry with economics + needs from the data layer
TILE_LIBRARY.forEach(tile => {
  const def = getTileByName(tile.name);
  if (!def) return;
  tile.build_cost           = def.build_cost;
  tile.maintenance_cost     = def.maintenance_cost;
  tile.repair_cost          = def.repair_cost;
  tile.revenue              = def.revenue;
  tile.needs                = structuredClone(def.needs);
  tile.failure_if_unmaintained = structuredClone(def.failure_if_unmaintained);
  tile.tileDiagnosis        = def.diagnosis ? def.diagnosis.slice() : [];
});

const POLLUTION_CARDS = [
  { headline: "Commercial trucks from neighbouring cities keep delivering pollution", targets: ["Large-scale Industry", "Airport", "Railway"], pollutionTokens: 2, aqi: 2, weaken: null, tileEffect: null },
  { headline: "Air pollution from thermal power plants impact the health of both near and far", targets: ["Thermal Power Plant"], pollutionTokens: 4, aqi: 2, weaken: "citizen", tileEffect: { type: "add", tile: "Thermal Power Plant" } },
  { headline: "More than 40% households use dirty fuel for cooking, which is one of the biggest hidden polluters", targets: ["Slums", "Rural Village", "Urban Village"], pollutionTokens: 2, aqi: 1, weaken: null, tileEffect: null },
  { headline: "Plastic waste burning becomes a bigger enemy of air quality than stubble burning", targets: ["City Landfill", "Residential Landfill"], pollutionTokens: 4, aqi: 2, weaken: "citizen", tileEffect: null },
  { headline: "The poor quality of roads leads to heavy traffic and leaves citizens choking", targets: ["Petrol Pump", "Large-scale Industry", "SSI"], pollutionTokens: 4, aqi: 1, weaken: "citizen", tileEffect: null },
  { headline: "A large fire breaks out in the landfill and haze envelops the city", targets: ["City Landfill"], pollutionTokens: 4, aqi: 3, weaken: "politician", tileEffect: null },
  { headline: "E-waste and plastic burning put nearby neighbourhoods at risk", targets: ["City Landfill", "Residential Landfill"], pollutionTokens: 2, aqi: 1, weaken: null, tileEffect: null },
  { headline: "Open burning of leaves continues in parks and near housing complexes", targets: ["High-rise Housing", "Public Park", "Barren Land"], pollutionTokens: 2, aqi: 1, weaken: null, tileEffect: null },
  { headline: "Illegal burning continues in the landfill to clear space for more garbage", targets: ["City Landfill"], pollutionTokens: 0, aqi: 2, weaken: "policymaker", tileEffect: null },
  { headline: "Smokey chimneys leave people from nearby villages choking", targets: ["Thermal Power Plant"], pollutionTokens: 2, aqi: 3, weaken: "citizen", tileEffect: null },
  { headline: "Coal dependence remains high and the transition to clean fuels stalls", targets: ["Thermal Power Plant"], pollutionTokens: 0, aqi: 2, weaken: null, tileEffect: { type: "flipGreenFuel" } },
  { headline: "During a heatwave, the administration fires up an old coal plant to meet electricity demand", targets: ["Thermal Power Plant"], pollutionTokens: 0, aqi: 1, weaken: "policymaker", tileEffect: { type: "add", tile: "Thermal Power Plant" } },
  { headline: "Hotels protect indoor air for a few while pollution spreads outside", targets: ["Hotel"], pollutionTokens: 2, aqi: 1, weaken: null, tileEffect: null },
  { headline: "Vehicles account for more than half of total air pollution in the city", targets: ["Petrol Pump", "DG Set"], pollutionTokens: 2, aqi: 2, weaken: null, tileEffect: null }
];

const SOLUTION_CARDS = [
  { headline: "Install weigh-in-motion systems at freight entry points", solution: "Reduce overloading impact from commercial vehicles", targets: ["Airport", "Railway", "Large-scale Industry"], aqi: -2, addSolutions: 0, removePollution: 2, tileEffect: null, logicShift: { policymaker: 1 } },
  { headline: "Cover 500MW demand with solar generation", solution: "Replace part of thermal dependence", targets: ["Thermal Power Plant"], aqi: -2, addSolutions: 2, removePollution: 0, tileEffect: { type: "flipTo", from: "Thermal Power Plant", to: "Solar Power Plant" }, logicShift: { policymaker: 2, activist: 1 } },
  { headline: "Accelerate LPG penetration for cooking in households", solution: "Reduce dirty-fuel emissions", targets: ["Slums", "Urban Village", "Rural Village"], aqi: -1, addSolutions: 2, removePollution: 1, tileEffect: null, logicShift: { citizen: 1, policymaker: 1 } },
  { headline: "Strict implementation of waste-management rules", solution: "Solid, hazardous, e-waste, biomedical, plastic and C&D", targets: ["City Landfill", "Residential Landfill"], aqi: -1, addSolutions: 2, removePollution: 0, tileEffect: { type: "add", tile: "Sewage Treatment Plant" }, logicShift: { policymaker: 2 } },
  { headline: "Invest in last-mile connectivity to reduce private vehicle use", solution: "Ease congestion by filling public transport gaps", targets: ["Petrol Pump", "Bus Stop", "Metro"], aqi: -2, addSolutions: 0, removePollution: 2, tileEffect: null, logicShift: { builder: 1, policymaker: 1 } },
  { headline: "Move toward decentralised waste infrastructure", solution: "Reduce dependence on one giant landfill", targets: ["City Landfill"], aqi: -2, addSolutions: 2, removePollution: 1, tileEffect: null, logicShift: { policymaker: 2, activist: 1 } },
  { headline: "Enforce extended producer responsibility", solution: "Track e-waste and plastic waste properly", targets: ["City Landfill", "Residential Landfill"], aqi: -1, addSolutions: 2, removePollution: 0, tileEffect: null, logicShift: { policymaker: 1 } },
  { headline: "Construct a methane power plant", solution: "Turn leaf and wet waste into transition energy", targets: ["Methane Power Plant", "Public Park", "City Landfill", "High-rise Housing"], aqi: -1, addSolutions: 2, removePollution: 0, tileEffect: { type: "add", tile: "Methane Power Plant" }, logicShift: { policymaker: 1, activist: 1 } },
  { headline: "Train municipalities and SPCBs on advanced integrated waste management", solution: "Cut illegal burning as the only resort", targets: ["City Landfill", "Residential Landfill"], aqi: -2, addSolutions: 0, removePollution: 1, tileEffect: null, logicShift: { policymaker: 2 } },
  { headline: "Introduce revised emission standards for thermal plants", solution: "Tighten controls on existing and upcoming plants", targets: ["Thermal Power Plant"], aqi: -1, addSolutions: 2, removePollution: 0, tileEffect: null, logicShift: { policymaker: 2 } },
  { headline: "Control pricing of alternative fuels", solution: "Make EV and CNG transitions viable", targets: ["Petrol Pump"], aqi: -1, addSolutions: 0, removePollution: 0, tileEffect: { type: "flipToChoice", from: "Petrol Pump", choices: ["EV Charging Station", "CNG Station"] }, logicShift: { policymaker: 2, activist: 1 } },
  { headline: "Phase out older coal plants and convert some to gas", solution: "Use methane as a transition bridge", targets: ["Thermal Power Plant"], aqi: -1, addSolutions: 0, removePollution: 0, tileEffect: { type: "flipTo", from: "Thermal Power Plant", to: "Methane Power Plant" }, logicShift: { policymaker: 2 } },
  { headline: "Stop using coal and firewood in hotels and open eateries", solution: "Clean cooking in hospitality sector", targets: ["Hotel"], aqi: -1, addSolutions: 1, removePollution: 0, tileEffect: null, logicShift: { citizen: 1, policymaker: 1 } },
  { headline: "Enhance public transport and shift travel behaviour", solution: "Add bus stop or metro service", targets: ["Petrol Pump", "DG Set", "Large-scale Industry"], aqi: -2, addSolutions: 0, removePollution: 0, tileEffect: { type: "addChoice", choices: ["Bus Stop", "Metro"] }, logicShift: { policymaker: 2, activist: 1 } }
];

const HEAT_CARDS = [
  {
    headline: "Hot Night Trap",
    targets: ["Slums", "High-rise Housing", "Affordable Housing"],
    heatTokens: 2, stress: 2, weaken: "citizen", tileEffect: null
  },
  {
    headline: "Water Tankers Run Dry",
    targets: ["Slums", "Urban Village", "Bus Stop", "Weekly Market"],
    heatTokens: 2, stress: 1, weaken: "citizen", tileEffect: null,
    pressureEffect: { water: 2 }
  },
  {
    headline: "Grid Overload",
    targets: ["Hospital", "High-rise Housing", "DG Set", "Thermal Power Plant"],
    heatTokens: 2, stress: 2, weaken: "policymaker", tileEffect: null,
    pressureEffect: { electricity: 2 }
  },
  {
    headline: "Outdoor Labour Exposure",
    targets: ["Construction", "Large-scale Industry", "SSI", "Weekly Market"],
    heatTokens: 2, stress: 1, weaken: "builder", tileEffect: null,
    developmentEffect: -2
  },
  {
    headline: "Heatstroke Ward Overflow",
    targets: ["Hospital"],
    heatTokens: 2, stress: 2, weaken: "citizen", tileEffect: null
  },
  {
    headline: "Slum Heat Pocket",
    targets: ["Slums", "Affordable Housing", "Urban Village"],
    heatTokens: 3, stress: 2, weaken: "citizen", tileEffect: null,
    pressureEffect: { migration: 1 }
  },
  {
    headline: "Transit Shelter Failure",
    targets: ["Bus Stop", "Railway", "Metro"],
    heatTokens: 2, stress: 1, weaken: "citizen", tileEffect: null
  },
  {
    headline: "Urban Heat Island Surge",
    targets: ["High-rise Housing", "Mall", "Pvt Office", "Large-scale Industry"],
    heatTokens: 3, stress: 2, weaken: "activist", tileEffect: null
  },
  {
    headline: "Heat Alert Misses the Vulnerable",
    targets: ["Slums", "Urban Village", "Rural Village", "Weekly Market"],
    heatTokens: 1, stress: 1, weaken: "citizen", tileEffect: null
  },
  {
    headline: "Schoolyard Heat Exposure",
    targets: ["School", "College"],
    heatTokens: 2, stress: 1, weaken: "citizen", tileEffect: null
  },
  {
    headline: "Cooling Centre Shortfall",
    targets: ["Govt Office", "School", "Public Park", "Hospital"],
    heatTokens: 2, stress: 2, weaken: "policymaker", tileEffect: null
  },
  {
    headline: "Early Summer Heatwave",
    targets: ["Construction", "Bus Stop", "Agricultural Land", "Slums"],
    heatTokens: 2, stress: 1, weaken: "builder", tileEffect: null,
    pressureEffect: { water: 1, electricity: 1 }
  }
];

const HEAT_SOLUTIONS = [
  {
    headline: "Cool Roof Programme",
    solution: "Deploy reflective roofs on vulnerable buildings and settlements.",
    targets: ["High-rise Housing", "Slums", "Affordable Housing", "School", "Hospital"],
    stress: -2, addSolutions: 2, removeHeat: 2, tileEffect: null,
    logicShift: { policymaker: 1, citizen: 1 }
  },
  {
    headline: "Cooling Centres and Shelters",
    solution: "Open accessible cooling spaces in public buildings and parks.",
    targets: ["Public Park", "Govt Office", "School", "Hospital"],
    stress: -2, addSolutions: 2, removeHeat: 1, tileEffect: null,
    logicShift: { citizen: 1, policymaker: 1 }
  },
  {
    headline: "Emergency Water Points",
    solution: "Set up drinking-water points, tankers, and ORS distribution.",
    targets: ["Bus Stop", "Weekly Market", "Slums", "Urban Village", "Railway"],
    stress: -1, addSolutions: 1, removeHeat: 2, tileEffect: null,
    logicShift: { citizen: 1 }
  },
  {
    headline: "Shift Work Hours",
    solution: "Move outdoor work away from peak heat windows.",
    targets: ["Construction", "Large-scale Industry", "SSI", "Weekly Market"],
    stress: -1, addSolutions: 1, removeHeat: 1, tileEffect: null,
    logicShift: { builder: 1, policymaker: 1 }
  },
  {
    headline: "Heat Health Preparedness",
    solution: "Stock ORS, cooling beds, IV fluids, and emergency care supplies.",
    targets: ["Hospital"],
    stress: -2, addSolutions: 2, removeHeat: 1, tileEffect: null,
    logicShift: { citizen: 1, policymaker: 1 }
  },
  {
    headline: "Ward-Level Heat Volunteers",
    solution: "Activate local teams to identify and assist vulnerable residents.",
    targets: ["Slums", "Urban Village", "Rural Village", "Govt Office"],
    stress: -1, addSolutions: 1, removeHeat: 1, tileEffect: null,
    logicShift: { citizen: 1 }
  },
  {
    headline: "Heat Alert Broadcast",
    solution: "Use radio, SMS, public announcements, and local networks for alerts.",
    targets: ["School", "Govt Office", "Bus Stop", "Weekly Market"],
    stress: -1, addSolutions: 1, removeHeat: 0, tileEffect: null,
    logicShift: { policymaker: 1, citizen: 1 }
  },
  {
    headline: "Shade at Public Places",
    solution: "Add shaded waiting areas at public gathering points.",
    targets: ["Bus Stop", "Weekly Market", "Railway", "Public Park"],
    stress: -1, addSolutions: 2, removeHeat: 1, tileEffect: null,
    logicShift: { activist: 1, policymaker: 1 }
  },
  {
    headline: "Urban Greening and Shade Corridors",
    solution: "Protect green spaces and expand shade corridors.",
    targets: ["Forest", "Public Park", "Agricultural Land", "School"],
    stress: -2, addSolutions: 2, removeHeat: 1, tileEffect: null,
    logicShift: { activist: 2 }
  },
  {
    headline: "Rainwater Harvesting and Water Storage",
    solution: "Strengthen local water resilience during heat periods.",
    targets: ["Sewage Treatment Plant", "Govt Office", "Agricultural Land", "School"],
    stress: -1, addSolutions: 1, removeHeat: 0, tileEffect: null,
    logicShift: { policymaker: 1 }
  },
  {
    headline: "Power Backup for Health and Cooling",
    solution: "Protect hospitals and cooling spaces during outages.",
    targets: ["Hospital", "Govt Office", "School", "DG Set"],
    stress: -1, addSolutions: 1, removeHeat: 0, tileEffect: null,
    logicShift: { policymaker: 1 }
  },
  {
    headline: "Vulnerability Mapping and Hotspot Planning",
    solution: "Identify neighbourhoods and groups most exposed to extreme heat.",
    targets: ["Slums", "High-rise Housing", "Bus Stop", "Weekly Market", "Hospital"],
    stress: -1, addSolutions: 1, removeHeat: 0, tileEffect: null,
    logicShift: { policymaker: 2 }
  }
];

const IDENTITY_DESCRIPTIONS = {
  builder: "You repeatedly privileged visible growth: roads, construction, malls, airports, and dense building expansion.",
  industrialist: "You leaned toward jobs, throughput, power, and industry — even when these choices increased structural pollution risk.",
  activist: "You repeatedly favored green cover, cleaner mobility, and mitigation-oriented urban choices.",
  policymaker: "You built through systems, regulation, public transport, energy transition, and civic infrastructure.",
  citizen: "You prioritized livability, health, affordability, and the pressures of ordinary residents rather than elite growth markers."
};

const REQUIREMENTS = [
  { id: "school", label: "At least one school", check: state => state.city.some(t => t.name === "School") },
  { id: "housing", label: "At least one housing tile", check: state => state.city.some(t => ["High-rise Housing", "Affordable Housing", "Slums", "Urban Village", "Rural Village"].includes(t.name)) },
  { id: "power", label: "At least one power source", check: state => state.city.some(t => ["Thermal Power Plant", "Solar Power Plant", "Methane Power Plant", "DG Set"].includes(t.name)) },
  { id: "health", label: "At least one health tile", check: state => state.city.some(t => t.name === "Hospital") },
  { id: "waste", label: "At least one waste-management tile", check: state => state.city.some(t => ["Residential Landfill", "City Landfill", "Sewage Treatment Plant"].includes(t.name)) }
];

const state = {
  round: 1,
  phase: "foundation",
  pollutionResolved: 0,
  hazard: "air",
  wind: ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"][Math.floor(Math.random() * 8)],
  aqi: 3,
  development: 18,
  pressures: { unemployment: 52, migration: 35, water: 42, electricity: 44 },
  ideologies: { builder: 1, industrialist: 1, activist: 1, policymaker: 1, citizen: 1 },
  city: [],
  deck: [],
  offerChoices: [],
  selectedOffers: [],
  currentPollutionCard: null,
  solutionChoices: [],
  selectedSolutions: [],
  log: [],
  ended: false,
  activeSolutions: [],
  trafficPressure: { jamCount: 0, busyCount: 0, openCount: 0, raw: 0, rounded: 0, aqiContribution: 0, heatContribution: 0 },
  history: { tiles: [], categories: {} },
  cityFinance: structuredClone(CITY_FINANCE),
  cityNeeds: structuredClone(CITY_NEEDS)
};

const els = {
  roundChip: document.getElementById("roundChip"),
  phaseChip: document.getElementById("phaseChip"),
  windChip: document.getElementById("windChip"),
  pollutionChip: document.getElementById("pollutionChip"),
  aqiBar: document.getElementById("aqiBar"),
  aqiLabel: document.getElementById("aqiLabel"),
  aqiNote: document.getElementById("aqiNote"),
  devBar: document.getElementById("devBar"),
  devValue: document.getElementById("devValue"),
  jobsBar: document.getElementById("jobsBar"),
  jobsValue: document.getElementById("jobsValue"),
  migrationBar: document.getElementById("migrationBar"),
  migrationValue: document.getElementById("migrationValue"),
  waterBar: document.getElementById("waterBar"),
  waterValue: document.getElementById("waterValue"),
  electricityBar: document.getElementById("electricityBar"),
  electricityValue: document.getElementById("electricityValue"),
  budgetChip: document.getElementById("budgetChip"),
  tileCount: document.getElementById("tileCount"),
  pollutionCount: document.getElementById("pollutionCount"),
  solutionCount: document.getElementById("solutionCount"),
  flippedCount: document.getElementById("flippedCount"),
  requirements: document.getElementById("requirements"),
  board: document.getElementById("board"),
  selectionPreview: document.getElementById("selectionPreview"),
  phaseBanner: document.getElementById("phaseBanner"),
  phaseName: document.getElementById("phaseName"),
  phaseSub: document.getElementById("phaseSub"),
  phaseRound: document.getElementById("phaseRound"),
  pollutionCountdown: document.getElementById("pollutionCountdown"),
  cdText: document.getElementById("cdText"),
  aqiNumber: document.getElementById("aqiNumber"),
  draftTitle: document.getElementById("draftTitle"),
  draftHelper: document.getElementById("draftHelper"),
  offerGrid: document.getElementById("offerGrid"),
  solutionGrid: document.getElementById("solutionGrid"),
  eventSection: document.getElementById("eventSection"),
  confirmOffersBtn: document.getElementById("confirmOffersBtn"),
  confirmSolutionsBtn: document.getElementById("confirmSolutionsBtn"),
  restartBtn: document.getElementById("restartBtn"),
  currentEventCard: document.getElementById("currentEventCard"),
  logList: document.getElementById("logList"),
  endOverlay: document.getElementById("endOverlay"),
  resultHeadline: document.getElementById("resultHeadline"),
  resultIdentity: document.getElementById("resultIdentity"),
  resultIdentityText: document.getElementById("resultIdentityText"),
  resultOutcome: document.getElementById("resultOutcome"),
  resultOutcomeText: document.getElementById("resultOutcomeText"),
  resultCategories: document.getElementById("resultCategories"),
  resultPressures: document.getElementById("resultPressures"),
  playAgainBtn: document.getElementById("playAgainBtn")
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function titleCase(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function addLog(text) {
  state.log.unshift({ round: state.round, text });
  state.log = state.log.slice(0, 20);
}

function cssColorClass(color) {
  return String(color || "none").replace(/\s+/g, "").toLowerCase();
}

function colorValue(color) {
  const map = {
    "dark green": "#3f7a41",
    "light green": "#7fb860",
    yellow: "#d6c13b",
    orange: "#d08b4a",
    red: "#c96e61",
    "dark red": "#a45d4f",
    "light red": "#d6978b",
    none: "#b5aa93"
  };
  return map[color] || "#b5aa93";
}

function formatSigned(num) {
  return num > 0 ? `+${num}` : `${num}`;
}

function getAQILabel(value) {
  if (value <= 1) return "Good";
  if (value <= 3) return "Satisfactory";
  if (value <= 5) return "Moderate";
  if (value <= 7) return "Poor";
  if (value <= 9) return "Very Poor";
  return "Severe";
}

function getAQINote(value) {
  if (value <= 3) return "You are still within or under the yellow band.";
  if (value <= 5) return "The city is drifting into a dirtier equilibrium.";
  if (value <= 7) return "The city is now clearly unhealthy.";
  if (value <= 9) return "The city is in acute air-quality distress.";
  return "The city has entered collapse territory.";
}

function resetState() {
  state.round = 1;
  state.phase = "foundation";
  state.pollutionResolved = 0;
  state.wind = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"][Math.floor(Math.random() * 8)];
  state.aqi = 3;
  state.development = 18;
  state.pressures = { unemployment: 52, migration: 35, water: 42, electricity: 44 };
  state.ideologies = { builder: 1, industrialist: 1, activist: 1, policymaker: 1, citizen: 1 };
  state.city = [];
  state.deck = shuffle(TILE_LIBRARY.map(tile => structuredClone(tile)));
  state.offerChoices = [];
  state.selectedOffers = [];
  state.currentPollutionCard = null;
  state.solutionChoices = [];
  state.selectedSolutions = [];
  state.log = [];
  state.ended = false;
  state.activeSolutions = [];
  state.trafficPressure = { jamCount: 0, busyCount: 0, openCount: 0, raw: 0, rounded: 0, aqiContribution: 0, heatContribution: 0 };
  state.history = { tiles: [], categories: {} };
  state.cityFinance = structuredClone(CITY_FINANCE);
  state.cityNeeds   = structuredClone(CITY_NEEDS);
}

// ── Hazard helpers ──
function getProblemDeck() {
  return state.hazard === "heat" ? HEAT_CARDS : POLLUTION_CARDS;
}

function getSolutionDeck() {
  return state.hazard === "heat" ? HEAT_SOLUTIONS : SOLUTION_CARDS;
}

function getHazardLabel() {
  return state.hazard === "heat" ? "Heat Stress" : "AQI";
}

function getHazardPhaseText() {
  return state.hazard === "heat"
    ? "Pressure phase — build, absorb heat shocks, then mitigate"
    : "Pressure phase — build, absorb pollution, then mitigate";
}

function getHazardDraftText() {
  return state.hazard === "heat"
    ? "Choose two development tiles before the next heat shock"
    : "Choose two development tiles before the next pollution shock";
}

function getOfferWeights() {
  const p = state.pressures;
  return {
    builder: state.ideologies.builder + (p.migration > 55 ? 2 : 0) + (p.unemployment > 60 ? 1 : 0),
    industrialist: state.ideologies.industrialist + (p.unemployment > 55 ? 2 : 0) + (p.electricity > 60 ? 1 : 0),
    activist: state.ideologies.activist + (state.aqi > 5 ? 2 : 0) + (p.water > 55 ? 1 : 0),
    policymaker: state.ideologies.policymaker + (p.water > 55 ? 2 : 0) + (p.electricity > 55 ? 2 : 0),
    citizen: state.ideologies.citizen + (p.migration > 50 ? 1 : 0) + (p.unemployment > 50 ? 1 : 0)
  };
}

function scoreTile(tile) {
  const weights = getOfferWeights();
  let score = 1;
  Object.entries(tile.ideology || {}).forEach(([k, v]) => {
    score += (weights[k] || 1) * v;
  });
  if (state.pressures.electricity > 55 && ["Thermal Power Plant", "Solar Power Plant", "Methane Power Plant", "DG Set"].includes(tile.name)) score += 4;
  if (state.pressures.water > 55 && ["Forest", "Public Park", "Sewage Treatment Plant", "Agricultural Land"].includes(tile.name)) score += 3;
  if (state.pressures.unemployment > 55 && ["SSI", "Large-scale Industry", "Mall", "Pvt Office", "Construction", "Weekly Market", "Mixed Market"].includes(tile.name)) score += 4;
  if (state.pressures.migration > 50 && ["Affordable Housing", "High-rise Housing", "Urban Village", "Rural Village", "Slums"].includes(tile.name)) score += 4;
  if (state.aqi > 5 && ["Forest", "Public Park", "Solar Power Plant", "Metro", "Bus Stop", "Sewage Treatment Plant", "EV Charging Station", "CNG Station"].includes(tile.name)) score += 4;
  return score;
}

function drawWeightedTile() {
  const available = state.deck.filter(Boolean);
  if (!available.length) return null;
  const scored = available.map(tile => ({ tile, score: scoreTile(tile) }));
  const total = scored.reduce((sum, item) => sum + item.score, 0);
  let roll = Math.random() * total;
  let chosen = scored[0].tile;
  for (const item of scored) {
    roll -= item.score;
    if (roll <= 0) {
      chosen = item.tile;
      break;
    }
  }
  const deckIndex = state.deck.findIndex(t => t.id === chosen.id);
  if (deckIndex >= 0) state.deck.splice(deckIndex, 1);
  return structuredClone(chosen);
}

function drawInitialCity() {
  const gpo = { id: "GPO", name: "GPO", category: "Reference", color: "none", aqiShift: 0, development: 0, jobs: 0, housing: 0, water: 0, power: 0, pollutionTokens: 0, solutionTokens: 0, flippedFor: 0, publicInfra: true, tags: [], disabled: false, ideology: {} };
  state.city.push(gpo);
  for (let i = 0; i < 6; i++) {
    const tile = drawWeightedTile();
    if (tile) placeTile(tile);
  }
  addLog("The city begins with the GPO at the centre and six surrounding tiles.");
}

function generateOfferChoices() {
  state.selectedOffers = [];
  const offers = [];
  const used = new Set();
  let guard = 0;
  while (offers.length < 5 && state.deck.length && guard < 100) {
    guard += 1;
    const tile = drawWeightedTile();
    if (!tile) break;
    const key = `${tile.name}-${tile.color}`;
    if (used.has(key)) {
      state.deck.push(tile);
      continue;
    }
    used.add(key);
    offers.push(tile);
  }
  state.offerChoices = offers;
  renderOfferChoices();
}

function renderOfferChoices() {
  els.offerGrid.innerHTML = "";
  state.offerChoices.forEach(tile => {
    const isSel = state.selectedOffers.includes(tile.id);
    const aqiClass = tile.aqiShift < 0 ? "aqi-pos" : tile.aqiShift > 0 ? "aqi-neg" : "aqi-zero";
    const aqiLabel = tile.aqiShift < 0 ? `AQI ${tile.aqiShift}` : tile.aqiShift > 0 ? `AQI +${tile.aqiShift}` : "AQI ±0";
    const tagChips = tile.tags.slice(0, 3).map(t => `<span class="tile-chip">${t}</span>`).join("");
    const extraChips = [
      tile.jobs ? `<span class="tile-chip">Jobs ${formatSigned(tile.jobs)}</span>` : "",
      tile.housing ? `<span class="tile-chip">Housing +${tile.housing}</span>` : ""
    ].join("");

    // Dependency evaluation for this offer
    const depEval = evaluateOfferTile(tile, state.city, [], state.activeSolutions, state.hazard);

    // Placement constraint evaluation.
    // If one offer is already selected, the next tile lands at city.length+1 (the slot after that pick).
    const futureSlot = state.city.length + (state.selectedOffers.length > 0 && !state.selectedOffers.includes(tile.id) ? 1 : 0);
    const placementResult = validatePlacement(tile.name, futureSlot, state.city, BOARD_SLOTS);
    const placeNote = placementNote(placementResult, tile.name);

    const depChips = depEval.notes.slice(0, 2).map(n => {
      const cls = n.startsWith("Risk:") ? "tile-chip dep-risk" :
                  n.startsWith("Penalty:") ? "tile-chip dep-penalty" :
                  "tile-chip dep-support";
      return `<span class="${cls}">${n}</span>`;
    }).join("");

    const placeChip = placeNote.text
      ? `<span class="tile-chip place-${placeNote.level}">${placeNote.text}</span>`
      : "";

    const allNotes = [depChips, placeChip].filter(Boolean).join("");

    const div = document.createElement("div");
    div.className = `tile-row${isSel ? " selected" : ""}${!placementResult.allowed ? " placement-blocked" : ""}`;
    div.innerHTML = `
      <div class="tile-row-swatch" style="background:${colorValue(tile.color)};"></div>
      <div class="tile-row-body">
        <span class="tile-row-name">${tile.name}</span>
        <span class="tile-row-cat">${tile.category}</span>
        <div class="tile-row-chips">
          <span class="tile-chip ${aqiClass}">${aqiLabel}</span>
          <span class="tile-chip">Dev +${tile.development}</span>
          ${extraChips}
          ${tagChips}
        </div>
        ${allNotes ? `<div class="tile-row-dep">${allNotes}</div>` : ""}
      </div>
      <button class="tile-row-select ${isSel ? "is-selected" : ""}${!placementResult.allowed ? " is-blocked" : ""}"
              style="border:1.5px solid ${isSel ? "transparent" : "rgba(23,48,58,0.2)"}"
              ${!placementResult.allowed ? "title='Placement blocked by adjacency rule'" : ""}>
        ${!placementResult.allowed ? "Blocked" : isSel ? "✓ Selected" : "Select"}
      </button>
    `;
    div.querySelector("button").addEventListener("click", () => toggleOffer(tile.id));
    els.offerGrid.appendChild(div);
  });
  renderSelectionPreview();
  els.confirmOffersBtn.disabled = state.selectedOffers.length !== 2;
}

function renderSelectionPreview() {
  els.selectionPreview.innerHTML = "";
  const selected = state.offerChoices.filter(t => state.selectedOffers.includes(t.id));
  selected.forEach(tile => {
    const chip = document.createElement("div");
    chip.className = "selection-chip";
    chip.innerHTML = `<span class="selection-dot" style="background:${colorValue(tile.color)}"></span><span>${tile.name}</span><span style="font-size:0.8rem;color:#5b6c73;">AQI ${formatSigned(tile.aqiShift)}</span>`;
    els.selectionPreview.appendChild(chip);
  });
}

function toggleOffer(id) {
  const tile = state.offerChoices.find(t => t.id === id);
  if (!tile) return;
  const check = validatePlacement(tile.name, state.city.length, state.city, BOARD_SLOTS);
  if (!check.allowed) return; // hard block: cannot select
  const idx = state.selectedOffers.indexOf(id);
  if (idx >= 0) state.selectedOffers.splice(idx, 1);
  else if (state.selectedOffers.length < 2) state.selectedOffers.push(id);
  renderOfferChoices();
}

function confirmOffers() {
  if (state.selectedOffers.length !== 2) return;
  const selected = state.offerChoices.filter(t => state.selectedOffers.includes(t.id));
  const unselected = state.offerChoices.filter(t => !state.selectedOffers.includes(t.id));
  unselected.forEach(t => state.deck.push(t));
  state.deck = shuffle(state.deck);
  // Hide the offer panel while player places tiles
  els.offerGrid.innerHTML = "";
  els.selectionPreview.innerHTML = "";
  els.confirmOffersBtn.disabled = true;
  els.confirmOffersBtn.style.display = "none";
  state.offerChoices = [];
  state.selectedOffers = [];
  // Enter interactive placement mode: player places each tile one at a time
  startPlacementMode(selected, () => {
    els.confirmOffersBtn.style.display = "";
    endBuildStep();
  });
}

function placeTile(tile) {
  tile.slot = state.city.length < BOARD_SLOTS.length ? state.city.length : BOARD_SLOTS.length - 1;
  state.city.push(tile);
  state.aqi = clamp(state.aqi + tile.aqiShift, 0, 12);
  state.development += tile.development;
  state.pressures.unemployment = clamp(state.pressures.unemployment - tile.jobs * 4, 0, 100);
  state.pressures.migration = clamp(state.pressures.migration - tile.housing * 3 + Math.max(0, tile.development - 8), 0, 100);
  state.pressures.water = clamp(state.pressures.water - tile.water * 6 + (tile.housing > 0 ? 4 : 0), 0, 100);
  state.pressures.electricity = clamp(state.pressures.electricity - tile.power * 7 + (tile.housing > 0 ? 4 : 0), 0, 100);
  Object.entries(tile.ideology || {}).forEach(([k, v]) => {
    state.ideologies[k] += v;
  });
  state.history.tiles.push(tile.name);
  state.history.categories[tile.category] = (state.history.categories[tile.category] || 0) + 1;
  if (["Thermal Power Plant", "DG Set", "Large-scale Industry", "SSI", "Construction"].includes(tile.name)) {
    state.pressures.water = clamp(state.pressures.water + 2, 0, 100);
  }
  if (["Slums", "Urban Village", "Rural Village", "Affordable Housing", "High-rise Housing"].includes(tile.name)) {
    state.pressures.migration = clamp(state.pressures.migration - 2, 0, 100);
  }
  recomputeCityDependencies(state.city, [], state.activeSolutions, state.hazard);
  recomputeAllEdges(state.city, BOARD_SLOTS);
  state.trafficPressure = calculateTrafficPressure(state.city, BOARD_SLOTS, state.hazard);
}

// ── Interactive Placement Mode ────────────────────────────────────────────────
// Lets the player choose which board cell each selected tile goes to.
// Uses BOARD_SLOTS element-swapping: when the player picks cell X,
// BOARD_SLOTS[targetPos] ↔ BOARD_SLOTS[chosenIdx] so placeTile() always
// writes to state.city.length and renderBoard() resolves it correctly.

const _placement = {
  queue: [],        // tiles still to place
  onDone: null,     // callback when all tiles are placed
  active: false
};

function startPlacementMode(tiles, onDone) {
  _placement.queue = tiles.slice();
  _placement.onDone = onDone;
  _placement.active = true;
  _showPlacementStep();
}

function _showPlacementStep() {
  if (_placement.queue.length === 0) {
    _placement.active = false;
    _clearPlacementHighlights();
    _placement.onDone && _placement.onDone();
    return;
  }
  const tile = _placement.queue[0];
  // Render first so the board-grid cells exist in the DOM
  render();
  // Show instruction banner on the board
  let hint = els.board.querySelector(".placement-click-hint");
  if (!hint) {
    hint = document.createElement("div");
    hint.className = "placement-click-hint";
    els.board.appendChild(hint);
  }
  hint.innerHTML = `
    <span class="pch-tile-swatch" style="background:${colorValue(tile.color)}"></span>
    <span>Place <strong>${tile.name}</strong> — click a highlighted cell</span>
  `;
  _highlightPlacementCells(tile);
}

function _highlightPlacementCells(tile) {
  _clearPlacementHighlights();
  // Offer the next 4 available slots as placement targets
  // (from current city.length up to min(city.length+4, BOARD_SLOTS.length-1))
  const startPos = state.city.length;
  const endPos   = Math.min(startPos + 4, BOARD_SLOTS.length - 1);
  const grid = els.board.querySelector(".board-grid");
  if (!grid) { render(); return; }
  const cells = grid.querySelectorAll(".board-cell");
  for (let pos = startPos; pos < endPos; pos++) {
    const cellIdx = BOARD_SLOTS[pos];
    const cell = cells[cellIdx];
    if (!cell) continue;
    // Skip cells already occupied
    if (cell.querySelector(".hex-tile")) continue;
    cell.classList.add("placement-available");
    // Tile-colour preview overlay
    const preview = document.createElement("div");
    preview.className = "placement-preview";
    preview.style.setProperty("--tile-color", colorValue(tile.color));
    preview.innerHTML = `<span class="placement-tile-name">${tile.name}</span>`;
    cell.appendChild(preview);
    cell.addEventListener("click", _onPlacementCellClick, { once: true });
    cell.dataset.placementPos = pos;
  }
}

function _onPlacementCellClick(e) {
  if (!_placement.active) return;
  const cell = e.currentTarget;
  const chosenPos = parseInt(cell.dataset.placementPos, 10);
  const targetPos = state.city.length;  // where placeTile() will write
  // Swap BOARD_SLOTS so the player's chosen cell becomes the next slot
  if (chosenPos !== targetPos) {
    const tmp = BOARD_SLOTS[targetPos];
    BOARD_SLOTS[targetPos] = BOARD_SLOTS[chosenPos];
    BOARD_SLOTS[chosenPos] = tmp;
  }
  _clearPlacementHighlights();
  const tile = _placement.queue.shift();
  placeTile(tile);
  addLog(`Built ${tile.name} — placed on the board. AQI ${formatSigned(tile.aqiShift)}. Development +${tile.development}.`);
  render();
  _showPlacementStep();
}

function _clearPlacementHighlights() {
  const grid = els.board && els.board.querySelector(".board-grid");
  if (grid) {
    grid.querySelectorAll(".placement-available").forEach(cell => {
      cell.classList.remove("placement-available");
      cell.querySelectorAll(".placement-preview").forEach(el => el.remove());
      cell.removeEventListener("click", _onPlacementCellClick);
      delete cell.dataset.placementPos;
    });
  }
  const hint = els.board && els.board.querySelector(".placement-click-hint");
  if (hint) hint.remove();
}
// ─────────────────────────────────────────────────────────────────────────────

function endBuildStep() {
  advanceBasePressures();
  if (state.round <= 3) {
    state.round += 1;
    state.phase = state.round <= 3 ? "foundation" : "pressure";
    addLog(`Round ${state.round - 1} ends. Service pressures continue to accumulate.`);
    if (state.round > 8) {
      evaluateEnd();
      return;
    }
    if (state.phase === "pressure") {
      addLog("The city has entered the pressure phase. Pollution cards now begin to resolve.");
    }
    generateOfferChoices();
    render();
    return;
  }
  resolvePollutionPhase();
}

function advanceBasePressures() {
  updateFlipTimers();
  const populationLoad = Math.max(0, state.city.length - 5);
  state.pressures.unemployment = clamp(state.pressures.unemployment + 4 - Math.floor(state.development / 40), 0, 100);
  state.pressures.migration = clamp(state.pressures.migration + 3 + Math.floor(populationLoad / 2), 0, 100);
  state.pressures.water = clamp(state.pressures.water + 4 + Math.floor(populationLoad / 2), 0, 100);
  state.pressures.electricity = clamp(state.pressures.electricity + 4 + Math.floor(populationLoad / 2), 0, 100);
  if (state.pressures.electricity > 70) {
    state.aqi = clamp(state.aqi + 1, 0, 12);
    addLog("Electricity stress triggered dirtier backup systems. AQI worsened by +1.");
  }
  if (state.pressures.water > 72) {
    state.aqi = clamp(state.aqi + 1, 0, 12);
    addLog("Water stress and dust pressure worsened local air quality. AQI worsened by +1.");
  }
  if (state.pressures.unemployment > 74) state.ideologies.industrialist += 1;
  if (state.pressures.migration > 74) {
    state.ideologies.builder += 1;
    state.ideologies.citizen += 1;
  }
  if (checkWasteOverflow(state.city)) {
    state.aqi = clamp(state.aqi + 1, 0, 12);
    addLog("Waste overflow: no waste system in a city of this size. AQI worsened +1.");
  }
}

function cardIsPlayable(card) {
  const present = state.city.filter(t => t.name !== "GPO");
  return present.some(tile => card.targets.includes(tile.name) && (!card.requireColor || card.requireColor.includes(tile.color)));
}

function drawProblemCard() {
  const deck = getProblemDeck();
  const playable = deck.filter(cardIsPlayable);

  if (!playable.length) {
    return state.hazard === "heat"
      ? { headline: "Diffuse heat stress spreads across the city", targets: [], heatTokens: 0, stress: 1, weaken: null, tileEffect: null }
      : { headline: "Diffuse urban pollution spreads without a single obvious trigger", targets: [], pollutionTokens: 0, aqi: 1, weaken: null, tileEffect: null };
  }

  const weighted = playable.map(card => {
    let score = 1;
    if (state.hazard === "air") {
      if (card.targets.includes("Thermal Power Plant") && state.pressures.electricity > 55) score += 3;
      if ((card.targets.includes("Petrol Pump") || card.targets.includes("Large-scale Industry")) && state.trafficPressure && state.trafficPressure.jamCount > 0) score += 2;
      if ((card.targets.includes("City Landfill") || card.targets.includes("Residential Landfill")) && state.pressures.migration > 45) score += 2;
      if (card.targets.includes("Slums") && state.pressures.migration > 55) score += 2;
    } else {
      if (card.targets.includes("Hospital") && state.pressures.electricity > 50) score += 2;
      if (card.targets.includes("Slums") && state.pressures.water > 50) score += 2;
      if (card.targets.includes("Construction") && state.pressures.unemployment > 45) score += 1;
      if (card.targets.includes("Bus Stop") && state.trafficPressure && state.trafficPressure.busyCount > 1) score += 1;
    }
    return { card, score };
  });

  const total = weighted.reduce((sum, item) => sum + item.score, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.score;
    if (roll <= 0) return item.card;
  }
  return weighted[0].card;
}

function resolvePollutionPhase() {
  const card = drawProblemCard();
  state.currentPollutionCard = card;
  state.pollutionResolved += 1;

  const stressDelta = state.hazard === "heat" ? card.stress : card.aqi;
  state.aqi = clamp(state.aqi + stressDelta, 0, 12);

  if (card.weaken && state.ideologies[card.weaken] !== undefined) {
    state.ideologies[card.weaken] = Math.max(0, state.ideologies[card.weaken] - 1);
  }

  if (card.pressureEffect) {
    Object.entries(card.pressureEffect).forEach(([k, v]) => {
      state.pressures[k] = clamp(state.pressures[k] + v, 0, 100);
    });
  }

  if (typeof card.developmentEffect === "number") {
    state.development = Math.max(0, state.development + card.developmentEffect);
  }

  if (state.hazard === "heat") {
    placePollutionTokens(card.targets, card.heatTokens || 0);
  } else {
    placePollutionTokens(card.targets, card.pollutionTokens || 0);
  }

  applyTileEffect(card.tileEffect);

  const _cardDx = getCardDiagnosis(card.headline, state.hazard);
  addLog(`${state.hazard === "heat" ? "Heat shock" : "Pollution shock"}: ${card.headline} ${getHazardLabel()} ${formatSigned(stressDelta)}.`);
  addLog(_cardDx);

  els.currentEventCard.className = "event-card active";
  els.currentEventCard.innerHTML = `
    <strong>${card.headline}</strong>
    <div style="margin-top:8px;">
      Targets: ${card.targets.length ? card.targets.join(", ") : "Diffuse urban sources"}<br/>
      ${state.hazard === "heat" ? "Heat tokens" : "Pollution tokens"}: ${state.hazard === "heat" ? (card.heatTokens || 0) : (card.pollutionTokens || 0)}<br/>
      ${getHazardLabel()} shift: ${formatSigned(stressDelta)}
    </div>
  `;

  generateSolutions();
  render();

  if (state.aqi >= 12) {
    evaluateEnd(`${getHazardLabel()} crossed the meter.`);
  }
}

function placePollutionTokens(targetNames, amount) {
  if (!amount || !targetNames.length) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  const candidates = state.city.filter(t => targetNames.includes(t.name) && t.name !== "GPO");
  if (!candidates.length) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  for (let i = 0; i < amount; i++) {
    const target = candidates[i % candidates.length];
    if (target.solutionTokens > 0) {
      target.solutionTokens = Math.max(0, target.solutionTokens - 1);
      addLog(`A solution token on ${target.name} absorbed a pollution strike.`);
    } else {
      target.pollutionTokens += 1;
    }
  }
  state.aqi = calculateStructuralAQI();
}

function calculateStructuralAQI() {
  const tileAQI = state.city.reduce((sum, tile) => sum + (tile.disabled ? 0 : tile.aqiShift), 0);
  const pollution = Math.floor(state.city.reduce((sum, tile) => sum + tile.pollutionTokens, 0) / 2);
  const solutions = state.city.reduce((sum, tile) => sum + tile.solutionTokens, 0);
  return clamp(3 + tileAQI + pollution - solutions, 0, 12);
}

function generateSolutions() {
  state.selectedSolutions = [];
  const deck = getSolutionDeck();

  const playable = deck.filter(card =>
    card.targets.some(target => state.city.some(tile => tile.name === target))
  );

  const scored = playable.map(card => {
    let score = 1;
    if (state.hazard === "air") {
      if (card.targets.includes("Thermal Power Plant") && state.city.some(t => t.name === "Thermal Power Plant")) score += 3;
      if ((card.targets.includes("Petrol Pump") || card.targets.includes("Large-scale Industry")) && state.trafficPressure && state.trafficPressure.jamCount > 0) score += 2;
      if ((card.targets.includes("City Landfill") || card.targets.includes("Residential Landfill")) && state.city.some(t => ["City Landfill", "Residential Landfill"].includes(t.name))) score += 2;
      if ((card.targets.includes("Slums") || card.targets.includes("Urban Village") || card.targets.includes("Rural Village")) && state.pressures.migration > 45) score += 2;
      if (card.targets.includes("Petrol Pump") && state.city.some(t => t.name === "Petrol Pump")) score += 2;
    } else {
      if (card.targets.includes("Hospital") && state.pressures.electricity > 50) score += 2;
      if (card.targets.includes("Slums") && state.pressures.water > 50) score += 2;
      if (card.targets.includes("Bus Stop") && state.city.some(t => t.name === "Bus Stop")) score += 2;
      if (card.targets.includes("Public Park") && state.aqi > 4) score += 1;
    }
    return { card, score };
  });

  const selected = [];
  while (selected.length < Math.min(3, scored.length) && scored.length) {
    const total = scored.reduce((sum, item) => sum + item.score, 0);
    let roll = Math.random() * total;
    let chosenIndex = 0;
    for (let i = 0; i < scored.length; i++) {
      roll -= scored[i].score;
      if (roll <= 0) { chosenIndex = i; break; }
    }
    selected.push(scored.splice(chosenIndex, 1)[0].card);
  }

  state.solutionChoices = selected;
  renderSolutions();
  els.eventSection.style.display = state.solutionChoices.length ? "block" : "none";
  els.confirmSolutionsBtn.style.display = state.solutionChoices.length ? "inline-flex" : "none";
  els.confirmSolutionsBtn.disabled = true;
}

function renderSolutions() {
  els.solutionGrid.innerHTML = "";
  state.solutionChoices.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = `game-card calm ${state.selectedSolutions.includes(index) ? "selected" : ""}`;
    const stressDelta = state.hazard === "heat" ? card.stress : card.aqi;
    const tokenLabel = state.hazard === "heat" ? "heat token" : "solution token";
    const removeLabel = state.hazard === "heat" ? "Remove heat token" : "Remove pollution token";
    div.innerHTML = `
      <div class="ribbon">Solution</div>
      <div>
        <h4>${card.headline}</h4>
        <p>${card.solution}</p>
        <div class="pill-row">
          <span class="pill">Targets: ${card.targets.join(", ")}</span>
          <span class="pill">${getHazardLabel()} ${formatSigned(stressDelta)}</span>
          ${card.addSolutions ? `<span class="pill">+${card.addSolutions} ${tokenLabel}${card.addSolutions > 1 ? "s" : ""}</span>` : ``}
          ${state.hazard === "heat"
            ? (card.removeHeat ? `<span class="pill">${removeLabel}${card.removeHeat > 1 ? "s" : ""}: ${card.removeHeat}</span>` : ``)
            : (card.removePollution ? `<span class="pill">${removeLabel}${card.removePollution > 1 ? "s" : ""}: ${card.removePollution}</span>` : ``)}
        </div>
      </div>
      <button class="card-select">${state.selectedSolutions.includes(index) ? "Selected" : "Select solution"}</button>
    `;
    div.querySelector("button").addEventListener("click", () => toggleSolution(index));
    els.solutionGrid.appendChild(div);
  });
  els.confirmSolutionsBtn.disabled = state.selectedSolutions.length !== Math.min(2, state.solutionChoices.length);
}

function toggleSolution(index) {
  const idx = state.selectedSolutions.indexOf(index);
  if (idx >= 0) state.selectedSolutions.splice(idx, 1);
  else if (state.selectedSolutions.length < Math.min(2, state.solutionChoices.length)) state.selectedSolutions.push(index);
  renderSolutions();
}

function confirmSolutions() {
  const needed = Math.min(2, state.solutionChoices.length);
  if (state.selectedSolutions.length !== needed) return;
  state.selectedSolutions.map(i => state.solutionChoices[i]).forEach(card => {
    const stressDelta = state.hazard === "heat" ? card.stress : card.aqi;
    state.aqi = clamp(state.aqi + stressDelta, 0, 12);
    addSolutionTokens(card.targets, card.addSolutions || 0);
    if (state.hazard === "heat") {
      removePollutionTokens(card.targets, card.removeHeat || 0);
    } else {
      removePollutionTokens(card.targets, card.removePollution || 0);
    }
    applyTileEffect(card.tileEffect);
    Object.entries(card.logicShift || {}).forEach(([k, v]) => {
      state.ideologies[k] = Math.max(0, state.ideologies[k] + v);
    });
    const _solDx = getSolutionDiagnosis(card.headline, state.hazard);
    addLog(`Solution adopted: ${card.headline}. ${getHazardLabel()} ${formatSigned(stressDelta)}.`);
    addLog(_solDx);
    if (!state.activeSolutions.includes(card.headline)) state.activeSolutions.push(card.headline);
  });
  state.solutionChoices = [];
  state.selectedSolutions = [];
  els.solutionGrid.innerHTML = "";
  els.eventSection.style.display = "none";
  els.confirmSolutionsBtn.style.display = "none";
  els.confirmSolutionsBtn.disabled = true;
  state.round += 1;
  if (state.round > 8 || state.pollutionResolved >= 5) {
    evaluateEnd();
    return;
  }
  generateOfferChoices();
  render();
}

function addSolutionTokens(targetNames, amount) {
  if (!amount) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  const targets = state.city.filter(t => targetNames.includes(t.name));
  if (!targets.length) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  for (let i = 0; i < amount; i++) {
    const target = targets[i % targets.length];
    if (target.pollutionTokens > 0) target.pollutionTokens -= 1;
    else target.solutionTokens += 1;
  }
  state.aqi = calculateStructuralAQI();
}

function removePollutionTokens(targetNames, amount) {
  if (!amount) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  let left = amount;
  const targets = state.city.filter(t => targetNames.includes(t.name)).sort((a, b) => b.pollutionTokens - a.pollutionTokens);
  for (const target of targets) {
    while (target.pollutionTokens > 0 && left > 0) {
      target.pollutionTokens -= 1;
      left -= 1;
    }
    if (!left) break;
  }
  state.aqi = calculateStructuralAQI();
}

function applyTileEffect(effect) {
  if (!effect) {
    state.aqi = calculateStructuralAQI();
    return;
  }
  if (effect.type === "add") {
    const tile = pullTileByName(effect.tile);
    if (tile) {
      placeTile(tile);
      addLog(`${effect.tile} was added to the city by a card effect.`);
    }
  }
  if (effect.type === "flipGreenFuel") {
    const target = state.city.find(t => ["Solar Power Plant", "Methane Power Plant", "EV Charging Station", "CNG Station"].includes(t.name) && !t.disabled);
    if (target) {
      target.disabled = true;
      target.flippedFor = 2;
      addLog(`${target.name} was flipped face down for two rounds.`);
    }
  }
  if (effect.type === "flipTo") {
    const target = state.city.find(t => t.name === effect.from && !t.disabled);
    if (target) updateTileFromTemplate(target, effect.to, `${effect.from} was transformed into ${effect.to}.`);
  }
  if (effect.type === "addChoice") {
    const chosen = effect.choices.find(name => !state.city.some(tile => tile.name === name)) || effect.choices[0];
    const tile = pullTileByName(chosen);
    if (tile) {
      placeTile(tile);
      addLog(`${chosen} was added to the city.`);
    }
  }
  if (effect.type === "flipToChoice") {
    const target = state.city.find(t => t.name === effect.from && !t.disabled);
    if (target) {
      const chosen = effect.choices.find(name => !state.city.some(tile => tile.name === name)) || effect.choices[0];
      updateTileFromTemplate(target, chosen, `${effect.from} was replaced by ${chosen}.`);
    }
  }
  recomputeCityDependencies(state.city, [], state.activeSolutions, state.hazard);
  state.aqi = calculateStructuralAQI();
}

function updateTileFromTemplate(target, name, logText) {
  const replacement = cloneTemplate(name);
  if (!replacement) return;
  target.name = replacement.name;
  target.category = replacement.category;
  target.color = replacement.color;
  target.aqiShift = replacement.aqiShift;
  target.development = replacement.development;
  target.jobs = replacement.jobs;
  target.housing = replacement.housing;
  target.water = replacement.water;
  target.power = replacement.power;
  target.tags = replacement.tags;
  target.ideology = replacement.ideology;
  target.publicInfra = replacement.publicInfra;
  addLog(logText);
}

function pullTileByName(name) {
  const index = state.deck.findIndex(tile => tile.name === name);
  if (index >= 0) return structuredClone(state.deck.splice(index, 1)[0]);
  return cloneTemplate(name);
}

function cloneTemplate(name) {
  const template = TILES.find(tile => tile.name === name);
  if (!template) return null;
  return {
    ...structuredClone(template),
    id: `${name}-generated-${Math.random().toString(36).slice(2, 8)}`,
    aqiShift: AQI_MAP[template.color] ?? 0,
    pollutionTokens: 0,
    solutionTokens: 0,
    flippedFor: 0,
    disabled: false
  };
}

function updateFlipTimers() {
  state.city.forEach(tile => {
    if (tile.flippedFor > 0) {
      tile.flippedFor -= 1;
      if (tile.flippedFor === 0) tile.disabled = false;
    }
  });
}

function renderBoard() {
  els.board.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "board-grid";
  const cells = [];
  for (let i = 0; i < 49; i++) {
    const cell = document.createElement("div");
    cell.className = `board-cell ${i === 24 ? "center" : ""}`;
    grid.appendChild(cell);
    cells.push(cell);
  }
  state.city.forEach((tile, index) => {
    const slotIndex = BOARD_SLOTS[index] ?? BOARD_SLOTS[BOARD_SLOTS.length - 1];
    const host = cells[slotIndex] || cells[24];
    const div = document.createElement("div");
    const classes = ["hex-tile"];
    if (tile.name === "GPO") classes.push("tile-gpo");
    else classes.push(`tile-${cssColorClass(tile.color)}`);
    if (tile.disabled) div.style.opacity = "0.45";
    div.className = classes.join(" ");
    const pollutionDots = Array.from({ length: tile.pollutionTokens }, () => `<span class="token pollution"></span>`).join("");
    const solutionDots = Array.from({ length: tile.solutionTokens }, () => `<span class="token solution"></span>`).join("");
    const depNote = (tile.depEval && tile.depEval.notes && tile.depEval.notes.length)
      ? `<div class="dep-note">${tile.depEval.notes[0]}</div>`
      : "";
    const trafficNote = tileTrafficNote(tile)
      ? `<div class="dep-note traffic-note">${tileTrafficNote(tile)}</div>`
      : "";
    div.innerHTML = `
      <div class="tile-name">${tile.name}</div>
      <div class="tile-meta"><span>${tile.name === "GPO" ? "Reference" : `AQI ${formatSigned(tile.disabled ? 0 : tile.aqiShift)}`}</span><span>${tile.name === "GPO" ? "Centre" : `DEV +${tile.development}`}</span></div>
      ${tile.name === "GPO" ? "" : `<div class="token-row">${pollutionDots}${solutionDots}</div>`}
      ${tile.name === "GPO" ? "" : depNote}
      ${tile.name === "GPO" ? "" : trafficNote}
    `;
    host.appendChild(div);
  });
  els.board.appendChild(grid);
}

function renderRequirements() {
  els.requirements.innerHTML = "";
  REQUIREMENTS.forEach(req => {
    const ok = req.check(state);
    const row = document.createElement("div");
    row.className = "req-row";
    row.innerHTML = `<span>${req.label}</span><span class="req-badge ${ok ? "ok" : "bad"}">${ok ? "Met" : "Missing"}</span>`;
    els.requirements.appendChild(row);
  });
}

function renderLog() {
  els.logList.innerHTML = "";
  state.log.forEach(item => {
    const div = document.createElement("div");
    div.className = "log-item";
    div.innerHTML = `<strong>R${item.round}</strong> — ${item.text}`;
    els.logList.appendChild(div);
  });
}

function render() {
  state.aqi = calculateStructuralAQI();
  recomputeCityDependencies(state.city, [], state.activeSolutions, state.hazard);
  recomputeAllEdges(state.city, BOARD_SLOTS);
  state.trafficPressure = calculateTrafficPressure(state.city, BOARD_SLOTS, state.hazard);
  els.roundChip.textContent = `${Math.min(state.round, 8)} / 8`;
  els.phaseChip.textContent = state.round <= 3 ? "Foundation" : "Pressure";
  els.windChip.textContent = `${windIcon(state.wind)} ${state.wind}`;
  els.pollutionChip.textContent = `${state.pollutionResolved} / 5`;

  const aqiPct = (state.aqi / 12) * 100;
  const devPct = clamp((state.development / 200) * 100, 0, 100);
  els.aqiBar.style.width = `${aqiPct}%`;
  els.aqiNumber.textContent = state.aqi;
  const aqiNumClass = state.aqi <= 3 ? "aqi-good" : state.aqi <= 5 ? "aqi-moderate" : state.aqi <= 8 ? "aqi-poor" : "aqi-bad";
  els.aqiNumber.className = `aqi-number ${aqiNumClass}`;
  els.devBar.style.width = `${devPct}%`;
  els.devValue.textContent = state.development;

  Object.entries(state.pressures).forEach(([k, v]) => {
    const id = k === "unemployment" ? "jobs" : k;
    els[`${id}Bar`].style.width = `${clamp(v, 0, 100)}%`;
    els[`${id}Value`].textContent = Math.round(v);
  });

  // Budget chip — round budget net of tile maintenance and revenue
  const _econ = computeCityEconomics(state.city);
  const _available = state.cityFinance.round_budget + _econ.netBudgetImpact;
  const _crore = v => `₹${(v / 10000000).toFixed(2)} Cr`;
  if (els.budgetChip) {
    els.budgetChip.textContent = (_available < 0 ? "-" : "") + _crore(Math.abs(_available));
    els.budgetChip.style.color = _available < 0 ? "#c96e61" : "";
    els.budgetChip.title = `Round budget: ${_crore(state.cityFinance.round_budget)}  ·  Revenue: ${_crore(_econ.totalRevenue)}  ·  Maintenance: ${_crore(_econ.totalMaintenance)}`;
  }

  els.tileCount.textContent = Math.max(0, state.city.length - 1);
  els.pollutionCount.textContent = state.city.reduce((sum, tile) => sum + tile.pollutionTokens, 0);
  els.solutionCount.textContent = state.city.reduce((sum, tile) => sum + tile.solutionTokens, 0);
  els.flippedCount.textContent = state.city.filter(tile => tile.disabled && tile.publicInfra).length;

  // Phase banner
  const isFoundation = state.round <= 3;
  if (els.phaseName) els.phaseName.textContent = isFoundation ? "Foundation Phase" : "Pressure Phase";
  if (els.phaseSub) els.phaseSub.textContent = isFoundation
    ? "Build the city — three rounds to lay foundations"
    : `${getHazardPhaseText()} (shock ${state.pollutionResolved} of 5)`;
  if (els.phaseRound) els.phaseRound.textContent = `Round ${state.round} of 8`;
  els.phaseBanner.classList.toggle("pressure-phase", !isFoundation);

  // Pollution countdown strip
  if (els.pollutionCountdown && els.cdText) {
    if (isFoundation) {
      const roundsLeft = 4 - state.round;
      els.pollutionCountdown.className = `pollution-countdown ${roundsLeft > 1 ? "safe" : "warning"}`;
      els.cdText.textContent = `🌫 Pollution cards begin Round 4 — ${roundsLeft} round${roundsLeft !== 1 ? "s" : ""} away`;
    } else {
      const remaining = 5 - state.pollutionResolved;
      els.pollutionCountdown.className = `pollution-countdown ${remaining > 2 ? "warning" : "danger"}`;
      els.cdText.textContent = `💨 ${state.hazard === "heat" ? "Heat" : "Pollution"} shock ${state.pollutionResolved} of 5 drawn — ${remaining} remaining`;
    }
  }

  els.draftTitle.textContent = isFoundation ? "Choose two development tiles" : getHazardDraftText();
  els.draftHelper.textContent = isFoundation ? "Five offers appear each round. Pick two." : "After you confirm these picks, the city will draw a hazard card and then a solution row.";
  els.aqiLabel.textContent = `${getHazardLabel()} — ${getAQILabel(state.aqi)}`;
  els.aqiNote.textContent = getAQINote(state.aqi);

  renderRequirements();
  renderBoard();
  renderLog();
}

function windIcon(wind) {
  const map = { North: "↑", "North-East": "↗", East: "→", "South-East": "↘", South: "↓", "South-West": "↙", West: "←", "North-West": "↖" };
  return map[wind] || "→";
}

function evaluateEnd(reason = "") {
  if (state.ended) return;
  state.ended = true;
  const requirementsMet = REQUIREMENTS.filter(req => req.check(state)).length;
  const dominant = Object.entries(state.ideologies).sort((a, b) => b[1] - a[1])[0][0];
  const sortedCategories = Object.entries(state.history.categories).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const worstPressures = Object.entries(state.pressures).sort((a, b) => b[1] - a[1]).slice(0, 3);
  let outcome = "Fragile success";
  let outcomeText = "You got through the main pollution cycle without full collapse, but the city remains structurally tense.";

  const builderIndustrialTakeover = (state.ideologies.builder + state.ideologies.industrialist) > (state.ideologies.activist + state.ideologies.policymaker + state.ideologies.citizen + 5);
  const flippedPublicInfra = state.city.filter(tile => tile.disabled && tile.publicInfra).length >= 3;
  const lossByAQI = state.aqi >= 10 || reason.includes("crossed");
  const lossByCards = state.pollutionResolved >= 5 && state.aqi > 3;
  const lossByDevelopment = state.development < 38 || requirementsMet < 3;

  if (builderIndustrialTakeover) {
    outcome = "Builder–industrialist takeover";
    outcomeText = "The city became structurally locked into growth-heavy and pollution-heavy choices. The hidden development bloc effectively took over.";
  } else if (flippedPublicInfra) {
    outcome = "Public infrastructure failure";
    outcomeText = "Too much public infrastructure was knocked out or flipped during the pressure phase.";
  } else if (lossByAQI) {
    outcome = state.hazard === "heat" ? "Heat stress collapse" : "AQI collapse";
    outcomeText = state.hazard === "heat"
      ? "Extreme heat crossed the city's coping threshold before the system could correct itself."
      : "Air quality crossed into a collapse band before the city could correct itself.";
  } else if (lossByCards) {
    outcome = "Failed after five pollution shocks";
    outcomeText = "You reached the end of the pressure cycle, but the city remained in orange or worse.";
  } else if (lossByDevelopment) {
    outcome = "Underbuilt city";
    outcomeText = "The city stayed cleaner, but it did not build enough capacity or essential systems to count as a functioning urban settlement.";
  }

  els.resultHeadline.textContent = outcome.includes("success") ? "You held the city together." : "The city exposed the logic of your choices.";
  els.resultIdentity.textContent = titleCase(dominant);
  els.resultIdentityText.textContent = IDENTITY_DESCRIPTIONS[dominant];
  els.resultOutcome.textContent = outcome;
  els.resultOutcomeText.textContent = `${outcomeText}${reason ? ` ${reason}` : ""}`;
  els.resultCategories.innerHTML = sortedCategories.map(([name, count]) => `<div><strong>${name}</strong> — ${count}</div>`).join("") || "No dominant categories registered.";
  els.resultPressures.innerHTML = worstPressures.map(([name, value]) => `<div><strong>${titleCase(name)}</strong> — ${Math.round(value)}</div>`).join("");
  els.endOverlay.classList.add("active");
}

function restartGame() {
  els.endOverlay.classList.remove("active");
  resetState();
  drawInitialCity();
  generateOfferChoices();
  els.currentEventCard.textContent = "No pollution card has been drawn yet.";
  addLog("The hidden identity logic is active from the start. You are not roleplaying an identity; the city is offering you a biased menu.");
  render();
}

const airToggle = document.getElementById("airToggle");
const heatToggle = document.getElementById("heatToggle");

function setHazardMode(mode) {
  state.hazard = mode;
  airToggle.classList.toggle("active", mode === "air");
  heatToggle.classList.toggle("active", mode === "heat");
  render();
}

airToggle.addEventListener("click", () => setHazardMode("air"));
heatToggle.addEventListener("click", () => setHazardMode("heat"));

els.confirmOffersBtn.addEventListener("click", confirmOffers);
els.confirmSolutionsBtn.addEventListener("click", confirmSolutions);
els.restartBtn.addEventListener("click", restartGame);
els.playAgainBtn.addEventListener("click", restartGame);

resetState();
drawInitialCity();
generateOfferChoices();
addLog("The hidden identity logic is active from the start. You are not roleplaying an identity; the city is offering you a biased menu.");
render();
