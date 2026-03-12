// ─────────────────────────────────────────────────────────────────────────────
// DEPENDENCY ENGINE  —  Fix It
//
// Evaluates every tile as an infrastructural node. No tile is morally good
// or bad. Every tile is conditionally valuable depending on what surrounds it.
//
// effective_value = base_value
//                 + synergy_bonus
//                 - externality_penalty
//                 + upgrade_bonus
//                 - missing_dependency_penalty
//
// Evaluation is always done against the full city state, never in isolation.
// Air mode and Heat mode produce different outcomes for the same tile.
// ─────────────────────────────────────────────────────────────────────────────

const TILE_SYSTEM = [
  {
    name: "GPO",
    provides: ["city_core", "reference_point"],
    requires: [],
    externalities: { air: [], heat: [] },
    upgrades_with: [],
    penalties_if_missing: []
  },
  {
    name: "Forest",
    provides: ["shade", "cooling_relief", "air_buffer", "dust_control"],
    requires: ["basic_water_security"],
    externalities: { air: [], heat: [] },
    upgrades_with: ["Public Park", "Agricultural Land"],
    penalties_if_missing: ["dust_exposure", "urban_heat_island"]
  },
  {
    name: "Public Park",
    provides: ["public_relief_space", "shade", "cooling_relief"],
    requires: ["basic_water_security"],
    externalities: { air: ["leaf_burning_if_unmanaged"], heat: [] },
    upgrades_with: ["Forest", "Emergency Water Points", "Cooling Centres and Shelters", "Shade at Public Places"],
    penalties_if_missing: ["heat_exposure_in_public_realm"]
  },
  {
    name: "Airport",
    provides: ["regional_connectivity", "high_value_growth", "logistics"],
    requires: ["road_access", "reliable_power", "traffic_management"],
    externalities: { air: ["aviation_emissions", "surface_traffic_emissions"], heat: ["high_energy_demand", "hard_surface_heat"] },
    upgrades_with: ["Metro", "Bus Stop", "Solar Power Plant"],
    penalties_if_missing: ["traffic_surge", "heat_island_expansion"]
  },
  {
    name: "Railway",
    provides: ["mass_transit_access", "regional_access", "public_transport_access"],
    requires: ["Bus Stop", "shade", "last_mile_connectivity"],
    externalities: { air: ["last_mile_congestion_if_unintegrated"], heat: ["waiting_area_exposure"] },
    upgrades_with: ["Bus Stop", "Metro", "Shade at Public Places", "Emergency Water Points"],
    penalties_if_missing: ["underused_mass_transit", "public_heat_exposure"]
  },
  {
    name: "Bus Stop",
    provides: ["public_transport_access", "last_mile_connectivity", "low_cost_mobility"],
    requires: ["Roadways", "shade"],
    externalities: { air: [], heat: ["waiting_area_exposure"] },
    upgrades_with: ["Metro", "Railway", "Shade at Public Places", "Emergency Water Points"],
    penalties_if_missing: ["underused_public_transport", "waiting_area_exposure"]
  },
  {
    name: "Metro",
    provides: ["mass_transit_access", "traffic_reduction", "high_capacity_mobility"],
    requires: ["public_transport_access", "reliable_power", "dense_housing"],
    externalities: { air: [], heat: [] },
    upgrades_with: ["Bus Stop", "High-rise Housing", "Affordable Housing"],
    penalties_if_missing: ["underused_infrastructure"]
  },
  {
    name: "Highway",
    provides: ["freight_capacity", "regional_connectivity"],
    requires: ["traffic_management", "dust_control"],
    externalities: { air: ["vehicular_emissions", "road_dust", "truck_pollution"], heat: ["surface_heat", "worker_exposure"] },
    upgrades_with: ["Bus Stop", "Metro"],
    penalties_if_missing: ["traffic_lock_in", "air_pollution_spike"]
  },
  {
    name: "Roadways",
    provides: ["local_connectivity", "market_access"],
    requires: ["dust_control", "shade"],
    externalities: { air: ["road_dust", "traffic_emissions"], heat: ["paved_surface_heat", "public_exposure"] },
    upgrades_with: ["Bus Stop", "Metro", "Shade at Public Places"],
    penalties_if_missing: ["dust_spikes", "unsafe_heat_exposure"]
  },
  {
    name: "School",
    provides: ["human_capital", "social_infrastructure", "long_term_resilience"],
    requires: ["shade", "basic_water_security", "safe_access"],
    externalities: { air: ["child_exposure_if_near_traffic"], heat: ["schoolyard_heat", "indoor_heat_if_uncooled"] },
    upgrades_with: ["Cool Roof Programme", "Emergency Water Points", "Shade at Public Places", "Forest", "Public Park"],
    penalties_if_missing: ["child_heat_exposure", "unsafe_learning_environment"]
  },
  {
    name: "College",
    provides: ["human_capital", "skills_development"],
    requires: ["public_transport_access", "shade", "reliable_power"],
    externalities: { air: ["commute_emissions_if_car_dependent"], heat: ["campus_heat_exposure"] },
    upgrades_with: ["Bus Stop", "Metro", "Cool Roof Programme", "Public Park"],
    penalties_if_missing: ["car_dependence", "heat_exposure"]
  },
  {
    name: "Hospital",
    provides: ["health_capacity", "emergency_response"],
    requires: ["reliable_power", "basic_water_security", "health_access"],
    externalities: { air: ["backup_diesel_use_if_power_fails"], heat: ["cooling_load", "heat_overload_if_unprepared"] },
    upgrades_with: ["Power Backup for Health and Cooling", "Heat Health Preparedness", "Cool Roof Programme", "Emergency Water Points", "Solar Power Plant"],
    penalties_if_missing: ["heatstroke_ward_overflow", "service_failure"]
  },
  {
    name: "Govt Office",
    provides: ["administrative_response", "coordination", "public_service_delivery"],
    requires: ["reliable_power"],
    externalities: { air: [], heat: ["staff_heat_exposure"] },
    upgrades_with: ["Heat Alert Broadcast", "Cooling Centres and Shelters", "Ward-Level Heat Volunteers", "Solar Power Plant"],
    penalties_if_missing: ["weak_response_coordination"]
  },
  {
    name: "Pvt Office",
    provides: ["white_collar_jobs", "commercial_growth"],
    requires: ["reliable_power", "public_transport_access"],
    externalities: { air: ["commuter_traffic", "generator_use_if_grid_fails"], heat: ["glass_heat", "cooling_demand"] },
    upgrades_with: ["Metro", "Bus Stop", "Solar Power Plant"],
    penalties_if_missing: ["traffic_growth", "energy_stress"]
  },
  {
    name: "Thermal Power Plant",
    provides: ["reliable_power", "base_load_electricity", "industrial_support"],
    requires: ["basic_water_security", "grid_regulation"],
    externalities: { air: ["stack_emissions", "coal_pollution"], heat: ["waste_heat", "water_stress_intensification"] },
    upgrades_with: ["Solar Power Plant", "Methane Power Plant", "Cover 500MW demand with solar generation", "Phase out older coal plants and convert some to gas", "Introduce revised emission standards for thermal plants"],
    penalties_if_missing: ["electricity_shortage", "generator_dependence"]
  },
  {
    name: "Methane Power Plant",
    provides: ["transition_power", "reduced_landfill_pressure", "reliable_power"],
    requires: ["waste_capacity"],
    externalities: { air: ["emissions_if_poorly_managed"], heat: [] },
    upgrades_with: ["City Landfill", "Sewage Treatment Plant"],
    penalties_if_missing: ["waste_overflow"]
  },
  {
    name: "Solar Power Plant",
    provides: ["clean_power", "reliable_power", "clean_mobility_support"],
    requires: [],
    externalities: { air: [], heat: [] },
    upgrades_with: ["Hospital", "Pvt Office", "Hotel", "EV Charging Station"],
    penalties_if_missing: ["continued_dirty_power_dependence"]
  },
  {
    name: "EV Charging Station",
    provides: ["clean_mobility_support"],
    requires: ["reliable_power", "vehicle_transition_support"],
    externalities: { air: [], heat: ["extra_power_load_if_grid_weak"] },
    upgrades_with: ["Solar Power Plant", "Bus Stop", "Control pricing of alternative fuels"],
    penalties_if_missing: ["underused_infrastructure", "minimal_air_benefit"]
  },
  {
    name: "CNG Station",
    provides: ["transition_fuel_support"],
    requires: ["vehicle_transition_support"],
    externalities: { air: ["fossil_fuel_dependence"], heat: [] },
    upgrades_with: ["Bus Stop"],
    penalties_if_missing: ["weak_transition_effect"]
  },
  {
    name: "Petrol Pump",
    provides: ["vehicle_fuel_access"],
    requires: ["road_access"],
    externalities: { air: ["vehicular_emissions_lock_in"], heat: ["surface_heat"] },
    upgrades_with: ["EV Charging Station", "CNG Station", "Control pricing of alternative fuels"],
    penalties_if_missing: ["fuel_shortage"]
  },
  {
    name: "DG Set",
    provides: ["backup_power"],
    requires: [],
    externalities: { air: ["diesel_emissions"], heat: ["local_heat"] },
    upgrades_with: ["Solar Power Plant", "Power Backup for Health and Cooling"],
    penalties_if_missing: ["critical_service_failure"]
  },
  {
    name: "High-rise Housing",
    provides: ["dense_housing", "urban_compaction", "formal_housing_supply"],
    requires: ["reliable_power", "basic_water_security", "public_transport_access"],
    externalities: { air: ["generator_use_if_grid_fails"], heat: ["hot_night_trap", "indoor_heat"] },
    upgrades_with: ["Metro", "Bus Stop", "Cool Roof Programme", "Solar Power Plant"],
    penalties_if_missing: ["heat_stress", "power_failure"]
  },
  {
    name: "Slums",
    provides: ["informal_housing_supply", "labour_proximity"],
    requires: ["basic_water_security", "clean_cooking", "cooling_relief"],
    externalities: { air: ["dirty_fuel_use_if_unserved", "waste_burning_if_unserved"], heat: ["extreme_heat_pocket", "high_vulnerability"] },
    upgrades_with: ["Accelerate LPG penetration for cooking in households", "Emergency Water Points", "Cool Roof Programme", "Ward-Level Heat Volunteers"],
    penalties_if_missing: ["high_health_risk", "dirty_fuel_dependence"]
  },
  {
    name: "Affordable Housing",
    provides: ["social_housing", "migration_absorption"],
    requires: ["basic_water_security", "reliable_power", "cooling_relief"],
    externalities: { air: ["generator_use_if_poorly_served"], heat: ["heat_exposure_if_poorly_designed"] },
    upgrades_with: ["Bus Stop", "Metro", "Cool Roof Programme", "Emergency Water Points"],
    penalties_if_missing: ["heat_vulnerability", "service_stress"]
  },
  {
    name: "Residential Landfill",
    provides: ["local_waste_capacity", "waste_capacity"],
    requires: ["waste_regulation"],
    externalities: { air: ["waste_burning", "smoke"], heat: ["localized_heat", "toxic_exposure"] },
    upgrades_with: ["Sewage Treatment Plant", "Strict implementation of waste-management rules"],
    penalties_if_missing: ["informal_dumping", "street_waste_overflow"]
  },
  {
    name: "City Landfill",
    provides: ["waste_capacity", "sanitation_support"],
    requires: ["waste_regulation", "sanitation_support"],
    externalities: { air: ["landfill_fire", "waste_burning", "methane_leak"], heat: ["surface_heat", "toxic_hotspots", "worker_exposure"] },
    upgrades_with: ["Sewage Treatment Plant", "Methane Power Plant", "Strict implementation of waste-management rules", "Move toward decentralised waste infrastructure"],
    penalties_if_missing: ["waste_overflow", "open_burning"]
  },
  {
    name: "Sewage Treatment Plant",
    provides: ["sanitation_support", "water_security", "basic_water_security"],
    requires: ["reliable_power"],
    externalities: { air: [], heat: [] },
    upgrades_with: ["City Landfill", "Rainwater Harvesting and Water Storage"],
    penalties_if_missing: ["water_contamination"]
  },
  {
    name: "Mall",
    provides: ["commercial_growth", "formal_jobs"],
    requires: ["reliable_power", "basic_water_security", "road_access"],
    externalities: { air: ["traffic_growth", "high_energy_load"], heat: ["cooling_energy_demand", "hard_surface_heat"] },
    upgrades_with: ["Metro", "Bus Stop", "Solar Power Plant"],
    penalties_if_missing: ["car_dependence", "energy_stress"]
  },
  {
    name: "Weekly Market",
    provides: ["informal_commerce", "local_livelihoods", "food_access"],
    requires: ["shade", "basic_water_security", "waste_capacity"],
    externalities: { air: ["waste_burning_if_unmanaged"], heat: ["public_heat_exposure"] },
    upgrades_with: ["Emergency Water Points", "Shade at Public Places", "Strict implementation of waste-management rules"],
    penalties_if_missing: ["vendor_exposure", "waste_spillover"]
  },
  {
    name: "Mixed Market",
    provides: ["distributed_commerce", "local_jobs"],
    requires: ["waste_capacity", "shade"],
    externalities: { air: ["local_traffic"], heat: ["crowded_heat_exposure"] },
    upgrades_with: ["Bus Stop", "Shade at Public Places"],
    penalties_if_missing: ["heat_exposure"]
  },
  {
    name: "Hotel",
    provides: ["tourism_revenue", "service_jobs", "commercial_growth"],
    requires: ["reliable_power", "basic_water_security", "road_access", "waste_capacity"],
    externalities: { air: ["dirty_fuel_use_if_unserved", "traffic_load"], heat: ["cooling_demand", "built_heat"] },
    upgrades_with: ["Solar Power Plant", "Stop using coal and firewood in hotels and open eateries", "Metro"],
    penalties_if_missing: ["resource_stress", "high_heat_load"]
  },
  {
    name: "SSI",
    provides: ["local_manufacturing", "jobs", "economic_activity"],
    requires: ["reliable_power", "worker_protection", "waste_regulation"],
    externalities: { air: ["stack_emissions", "localised_pollution"], heat: ["worker_heat_exposure"] },
    upgrades_with: ["Solar Power Plant"],
    penalties_if_missing: ["pollution_cluster", "unsafe_labour_conditions"]
  },
  {
    name: "Large-scale Industry",
    provides: ["major_jobs", "industrial_output", "economic_activity"],
    requires: ["reliable_power", "basic_water_security", "freight_capacity", "worker_protection"],
    externalities: { air: ["industrial_emissions", "freight_pollution"], heat: ["industrial_heat", "worker_heat_exposure", "water_stress_intensification"] },
    upgrades_with: ["Solar Power Plant", "Shift Work Hours"],
    penalties_if_missing: ["unsafe_emissions", "severe_heat_stress"]
  },
  {
    name: "Construction",
    provides: ["housing_supply", "infrastructure_growth", "jobs"],
    requires: ["dust_control", "worker_protection", "basic_water_security"],
    externalities: { air: ["construction_dust", "construction_emissions"], heat: ["peak_worker_exposure", "bare_surface_heat"] },
    upgrades_with: ["Shift Work Hours", "Emergency Water Points"],
    penalties_if_missing: ["dust_spikes", "worker_heat_injury"]
  },
  {
    name: "Barren Land",
    provides: ["reserve_land"],
    requires: [],
    externalities: { air: ["dust_if_exposed"], heat: ["heat_reflection_if_unshaded"] },
    upgrades_with: ["Forest", "Public Park", "Solar Power Plant"],
    penalties_if_missing: ["speculative_stagnation"]
  },
  {
    name: "Agricultural Land",
    provides: ["food_system_support", "peri_urban_buffer", "cooling_relief"],
    requires: ["basic_water_security"],
    externalities: { air: ["crop_residue_burning_if_unmanaged"], heat: ["water_stress_during_heat"] },
    upgrades_with: ["Forest", "Rainwater Harvesting and Water Storage"],
    penalties_if_missing: ["burning_risk", "food_buffer_loss"]
  },
  {
    name: "Urban Village",
    provides: ["mixed_use_settlement", "migration_absorption", "labour_access"],
    requires: ["basic_water_security", "waste_capacity", "clean_cooking"],
    externalities: { air: ["dirty_fuel_risk", "waste_burning_risk"], heat: ["dense_heat_exposure", "high_vulnerability"] },
    upgrades_with: ["Accelerate LPG penetration for cooking in households", "Emergency Water Points", "Cool Roof Programme", "Ward-Level Heat Volunteers"],
    penalties_if_missing: ["heat_stress", "pollution_exposure"]
  },
  {
    name: "Rural Village",
    provides: ["peri_urban_settlement", "labour_linkages"],
    requires: ["basic_water_security", "clean_cooking"],
    externalities: { air: ["dirty_fuel_use", "burning_risk"], heat: ["water_scarcity", "heat_exposure"] },
    upgrades_with: ["Accelerate LPG penetration for cooking in households", "Emergency Water Points", "Bus Stop", "Heat Alert Broadcast"],
    penalties_if_missing: ["dirty_energy_dependence", "acute_heat_vulnerability"]
  }
];

// ─── Capacity derivation ──────────────────────────────────────────────────────
// Builds a cityState from tile names, active policies, and active solutions.
// Capacities are inferred from tile combinations, not just individual tiles.

function deriveCityCapacities(cityTiles, activePolicies, activeSolutions) {
  const tileNames = cityTiles.map(t => t.name);
  const allPolicies = [...(activePolicies || []), ...(activeSolutions || [])];
  const caps = new Set();

  // ── Single-tile direct provisions ────────────────────────────────────────
  const directMap = {
    "Forest":                 ["shade", "cooling_relief", "air_buffer", "dust_control"],
    "Public Park":            ["shade", "cooling_relief", "public_relief_space"],
    "Agricultural Land":      ["cooling_relief", "food_system_support"],
    "Hospital":               ["health_capacity", "emergency_response"],
    "Sewage Treatment Plant": ["sanitation_support", "basic_water_security"],
    "Solar Power Plant":      ["clean_power", "reliable_power", "clean_mobility_support"],
    "Methane Power Plant":    ["transition_power", "reliable_power"],
    "Thermal Power Plant":    ["reliable_power", "base_load_electricity"],
    "DG Set":                 ["backup_power"],
    "Govt Office":            ["administrative_response"],
    "Bus Stop":               ["public_transport_access", "last_mile_connectivity"],
    "Railway":                ["mass_transit_access", "public_transport_access"],
    "Metro":                  ["mass_transit_access", "high_capacity_mobility"],
    "EV Charging Station":    ["clean_mobility_support"],
    "CNG Station":            ["transition_fuel_support"],
    "City Landfill":          ["waste_capacity", "sanitation_support"],
    "Residential Landfill":   ["waste_capacity", "local_waste_capacity"],
    "Construction":           ["housing_supply"],
    "Barren Land":            ["reserve_land"]
  };

  tileNames.forEach(name => {
    (directMap[name] || []).forEach(cap => caps.add(cap));
  });

  // ── Combination-derived capacities ───────────────────────────────────────

  // public_transport_access: any road + any stop
  if (tileNames.includes("Bus Stop") && tileNames.includes("Roadways"))
    caps.add("public_transport_access");

  // mass_transit_access: metro with feeder
  if (tileNames.includes("Metro") && tileNames.includes("Bus Stop"))
    caps.add("mass_transit_access");

  // dense_housing: at least one dense housing type
  if (["High-rise Housing", "Affordable Housing"].some(n => tileNames.includes(n)))
    caps.add("dense_housing");

  // basic_water_security: sewage plant, or forest+park, or agricultural land
  if (
    tileNames.includes("Sewage Treatment Plant") ||
    (tileNames.includes("Forest") && tileNames.includes("Public Park")) ||
    tileNames.includes("Agricultural Land")
  ) caps.add("basic_water_security");

  // water_security: higher level — sewage + agricultural or rainwater policy
  if (
    tileNames.includes("Sewage Treatment Plant") &&
    (tileNames.includes("Agricultural Land") || allPolicies.includes("Rainwater Harvesting and Water Storage"))
  ) caps.add("water_security");

  // sanitation_support: waste system + management policy
  if (
    (tileNames.includes("City Landfill") || tileNames.includes("Residential Landfill")) &&
    (allPolicies.includes("Strict implementation of waste-management rules") ||
     allPolicies.includes("Move toward decentralised waste infrastructure") ||
     tileNames.includes("Sewage Treatment Plant") ||
     tileNames.includes("Methane Power Plant"))
  ) caps.add("sanitation_support");

  // clean_cooking: LPG penetration solution active
  if (allPolicies.includes("Accelerate LPG penetration for cooking in households"))
    caps.add("clean_cooking");

  // worker_protection: shift work hours solution active
  if (allPolicies.includes("Shift Work Hours"))
    caps.add("worker_protection");

  // dust_control: forest + roadways or active road improvement
  if (
    tileNames.includes("Forest") ||
    allPolicies.includes("Undertake road widening and improvement")
  ) caps.add("dust_control");

  // cooling_relief: park or forest or cool roof policy
  if (
    tileNames.includes("Public Park") ||
    tileNames.includes("Forest") ||
    allPolicies.includes("Cool Roof Programme") ||
    allPolicies.includes("Cooling Centres and Shelters")
  ) caps.add("cooling_relief");

  // shade: forest or park or shade policy
  if (
    tileNames.includes("Forest") ||
    tileNames.includes("Public Park") ||
    allPolicies.includes("Shade at Public Places") ||
    allPolicies.includes("Urban Greening and Shade Corridors")
  ) caps.add("shade");

  // health_access: hospital exists
  if (tileNames.includes("Hospital"))
    caps.add("health_access");

  // reliable_power: solar, methane, thermal, or power backup
  if (
    tileNames.includes("Solar Power Plant") ||
    tileNames.includes("Methane Power Plant") ||
    tileNames.includes("Thermal Power Plant") ||
    allPolicies.includes("Power Backup for Health and Cooling")
  ) caps.add("reliable_power");

  // vehicle_transition_support: EV or CNG or active transition policy
  if (
    tileNames.includes("EV Charging Station") ||
    tileNames.includes("CNG Station") ||
    allPolicies.includes("Control pricing of alternative fuels")
  ) caps.add("vehicle_transition_support");

  // waste_regulation: active waste management policy
  if (
    allPolicies.includes("Strict implementation of waste-management rules") ||
    allPolicies.includes("Move toward decentralised waste infrastructure") ||
    allPolicies.includes("Enforce extended producer responsibility")
  ) caps.add("waste_regulation");

  // traffic_management: highway with weigh-in-motion or metro/bus presence
  if (
    (tileNames.includes("Highway") && allPolicies.includes("Install weigh-in-motion bridges at city borders")) ||
    (tileNames.includes("Metro") || tileNames.includes("Bus Stop"))
  ) caps.add("traffic_management");

  // road_access: any road tile
  if (["Highway", "Roadways"].some(n => tileNames.includes(n)))
    caps.add("road_access");

  // freight_capacity: highway exists
  if (tileNames.includes("Highway"))
    caps.add("freight_capacity");

  // administrative_response: govt office + heat alert or ward volunteers
  if (
    tileNames.includes("Govt Office") &&
    (allPolicies.includes("Heat Alert Broadcast") || allPolicies.includes("Ward-Level Heat Volunteers"))
  ) caps.add("administrative_response");

  // grid_regulation: emission standards or phase-out policy
  if (
    allPolicies.includes("Introduce revised emission standards for thermal plants") ||
    allPolicies.includes("Phase out older coal plants and convert some to gas")
  ) caps.add("grid_regulation");

  return Array.from(caps);
}

// ─── Core evaluation functions ────────────────────────────────────────────────

function getTileSynergyBonus(tileDef, cityState, mode) {
  // Returns a numeric bonus for each active upgrade support found in city
  const activeUpgrades = tileDef.upgrades_with.filter(
    up => cityState.tiles.includes(up) || cityState.policies.includes(up)
  );
  // Each active upgrade contributes +1 in both modes; extra +1 for clean power in heat mode
  let bonus = activeUpgrades.length;
  if (mode === "heat" && activeUpgrades.some(u => ["Solar Power Plant", "Cool Roof Programme", "Emergency Water Points", "Cooling Centres and Shelters"].includes(u))) {
    bonus += 1;
  }
  return { bonus, activeUpgrades };
}

function getTileExternalityPenalty(tileDef, cityState, mode) {
  // Returns penalty count and list of active externalities for the given mode
  const relevant = tileDef.externalities[mode] || [];
  const active = [];

  relevant.forEach(ext => {
    // Air-specific: fire if tile has dirty externality and no mitigating capacity
    if (mode === "air") {
      if (["stack_emissions", "coal_pollution", "industrial_emissions"].includes(ext) &&
          !cityState.capacities.includes("grid_regulation")) active.push(ext);
      else if (["road_dust", "construction_dust", "vehicular_emissions", "truck_pollution"].includes(ext) &&
               !cityState.capacities.includes("dust_control") &&
               !cityState.capacities.includes("traffic_management")) active.push(ext);
      else if (["waste_burning", "landfill_fire", "methane_leak", "waste_burning_if_unmanaged"].includes(ext) &&
               !cityState.capacities.includes("waste_regulation")) active.push(ext);
      else if (["dirty_fuel_use_if_unserved", "dirty_fuel_risk", "dirty_fuel_use"].includes(ext) &&
               !cityState.capacities.includes("clean_cooking")) active.push(ext);
      else if (["generator_use_if_grid_fails", "backup_diesel_use_if_power_fails", "diesel_emissions"].includes(ext) &&
               !cityState.capacities.includes("reliable_power")) active.push(ext);
      else if (["vehicular_emissions_lock_in", "commuter_traffic", "traffic_load", "aviation_emissions"].includes(ext) &&
               !cityState.capacities.includes("public_transport_access")) active.push(ext);
      else if (!active.includes(ext)) {
        // Remaining air externalities fire by default
        if (["local_traffic", "last_mile_congestion_if_unintegrated", "surface_traffic_emissions",
             "fossil_fuel_dependence", "leaf_burning_if_unmanaged", "localised_pollution",
             "crop_residue_burning_if_unmanaged", "burning_risk", "waste_burning_risk",
             "commute_emissions_if_car_dependent", "emissions_if_poorly_managed"].includes(ext)) {
          active.push(ext);
        }
      }
    }

    // Heat-specific: fire if tile has heat externality and no mitigating capacity
    if (mode === "heat") {
      if (["hot_night_trap", "indoor_heat", "extreme_heat_pocket", "high_vulnerability"].includes(ext) &&
          !cityState.capacities.includes("cooling_relief")) active.push(ext);
      else if (["waiting_area_exposure", "public_heat_exposure", "public_exposure"].includes(ext) &&
               !cityState.capacities.includes("shade")) active.push(ext);
      else if (["worker_heat_exposure", "peak_worker_exposure"].includes(ext) &&
               !cityState.capacities.includes("worker_protection")) active.push(ext);
      else if (["heat_overload_if_unprepared", "heatstroke_ward_overflow", "cooling_load"].includes(ext) &&
               !cityState.capacities.includes("health_capacity")) active.push(ext);
      else if (["water_stress_intensification", "water_stress_during_heat"].includes(ext) &&
               !cityState.capacities.includes("basic_water_security")) active.push(ext);
      else if (["high_energy_demand", "cooling_demand", "cooling_energy_demand", "extra_power_load_if_grid_weak"].includes(ext) &&
               !cityState.capacities.includes("reliable_power")) active.push(ext);
      else if (!active.includes(ext)) {
        // Remaining heat externalities fire by default
        if (["surface_heat", "hard_surface_heat", "paved_surface_heat", "local_heat",
             "glass_heat", "industrial_heat", "built_heat", "bare_surface_heat",
             "campus_heat_exposure", "staff_heat_exposure", "dense_heat_exposure",
             "heat_reflection_if_unshaded", "water_scarcity"].includes(ext)) {
          active.push(ext);
        }
      }
    }
  });

  return { penalty: active.length, activeExternalities: active };
}

function getMissingDependencyPenalty(tileDef, cityState, mode) {
  // Checks tile.requires against city capacities; checks penalties_if_missing
  const missingRequires = tileDef.requires.filter(req => !cityState.capacities.includes(req));
  const missingPenalties = tileDef.penalties_if_missing.filter(
    p => !cityState.capacities.includes(p) && !cityState.tiles.includes(p)
  );

  // Mode-specific weight: heat mode penalises water and shade absences harder
  let penalty = missingRequires.length;
  if (mode === "heat") {
    if (missingRequires.includes("shade")) penalty += 1;
    if (missingRequires.includes("basic_water_security")) penalty += 1;
    if (missingRequires.includes("cooling_relief")) penalty += 1;
  }
  if (mode === "air") {
    if (missingRequires.includes("dust_control")) penalty += 1;
    if (missingRequires.includes("traffic_management")) penalty += 1;
  }

  return { penalty, missingRequires, missingPenalties };
}

function getTileUpgradeBonus(tileDef, cityState, mode) {
  // Upgrade bonus is already computed in synergy; this returns structured form
  const { bonus, activeUpgrades } = getTileSynergyBonus(tileDef, cityState, mode);
  return { bonus, activeUpgrades };
}

function evaluateTileNode(tile, cityState, mode) {
  // Find the schema definition for this tile
  const tileDef = TILE_SYSTEM.find(t => t.name === tile.name);
  if (!tileDef) {
    return {
      provides_score: 0,
      synergy_bonus: 0,
      externality_penalty: 0,
      upgrade_bonus: 0,
      missing_dependency_penalty: 0,
      final_score: 0,
      active_dependencies: [],
      missing_dependencies: [],
      active_upgrades: [],
      active_externalities: [],
      notes: []
    };
  }

  // Base provides score: number of capacities this tile contributes
  const provides_score = tileDef.provides.filter(
    p => !cityState.capacities.includes(p)   // only count capacities this tile uniquely adds
  ).length + 1;  // +1 ensures a floor

  const { bonus: synergy_bonus, activeUpgrades: active_upgrades } =
    getTileSynergyBonus(tileDef, cityState, mode);

  const { penalty: externality_penalty, activeExternalities: active_externalities } =
    getTileExternalityPenalty(tileDef, cityState, mode);

  const { bonus: upgrade_bonus } =
    getTileUpgradeBonus(tileDef, cityState, mode);

  const { penalty: missing_dependency_penalty, missingRequires: missing_dependencies } =
    getMissingDependencyPenalty(tileDef, cityState, mode);

  const final_score =
    provides_score
    + synergy_bonus
    - externality_penalty
    + upgrade_bonus
    - missing_dependency_penalty;

  // Active dependencies: which requires are satisfied
  const active_dependencies = tileDef.requires.filter(req =>
    cityState.capacities.includes(req)
  );

  // Human-readable dependency notes
  const notes = buildDependencyNotes(tileDef, active_upgrades, missing_dependencies, active_externalities, mode);

  return {
    provides_score,
    synergy_bonus,
    externality_penalty,
    upgrade_bonus,
    missing_dependency_penalty,
    final_score,
    active_dependencies,
    missing_dependencies,
    active_upgrades,
    active_externalities,
    notes
  };
}

// ─── Human-readable notes ─────────────────────────────────────────────────────

function buildDependencyNotes(tileDef, activeUpgrades, missingDeps, activeExts, mode) {
  const lines = [];

  // Upgrade / support lines
  if (activeUpgrades.length > 0) {
    const label = activeUpgrades.length === 1
      ? activeUpgrades[0]
      : `${activeUpgrades.slice(0, -1).join(", ")} and ${activeUpgrades[activeUpgrades.length - 1]}`;
    lines.push(`Supported by ${label}.`);
  }

  // Missing dependency lines — friendly labels
  const depLabels = {
    shade:                       "missing shade",
    basic_water_security:        "missing water security",
    cooling_relief:              "missing cooling support",
    reliable_power:              "missing reliable power",
    public_transport_access:     "missing feeder transport",
    dust_control:                "missing dust control",
    worker_protection:           "missing worker protection",
    waste_capacity:              "missing waste capacity",
    clean_cooking:               "missing clean cooking support",
    vehicle_transition_support:  "missing vehicle transition support",
    health_access:               "missing health access",
    administrative_response:     "missing administrative coordination",
    traffic_management:          "missing traffic management",
    sanitation_support:          "missing sanitation support",
    dense_housing:               "no dense housing nearby",
    last_mile_connectivity:      "missing last-mile connectivity",
    waste_regulation:            "no waste management policy active",
    grid_regulation:             "no emissions regulation active"
  };

  missingDeps.forEach(dep => {
    const label = depLabels[dep] || dep.replace(/_/g, " ");
    lines.push(`Penalty: ${label}.`);
  });

  // Active externality lines — friendly labels
  const extLabels = {
    // Air
    stack_emissions:                  "emitting stack pollution",
    coal_pollution:                   "burning coal without controls",
    industrial_emissions:             "uncontrolled industrial emissions",
    road_dust:                        "generating road dust",
    construction_dust:                "generating construction dust",
    vehicular_emissions:              "adding vehicular emissions",
    truck_pollution:                  "adding freight pollution",
    waste_burning:                    "burning waste",
    landfill_fire:                    "risk of landfill fire",
    methane_leak:                     "methane leak risk",
    dirty_fuel_use_if_unserved:       "dirty fuel use unaddressed",
    generator_use_if_grid_fails:      "diesel generator dependence",
    vehicular_emissions_lock_in:      "vehicle emissions lock-in",
    fossil_fuel_dependence:           "fossil fuel dependence",
    leaf_burning_if_unmanaged:        "leaf burning unmanaged",
    // Heat
    hot_night_trap:                   "hot night trap risk",
    indoor_heat:                      "indoor heat build-up",
    extreme_heat_pocket:              "extreme heat pocket",
    waiting_area_exposure:            "exposed public waiting area",
    public_heat_exposure:             "public heat exposure",
    worker_heat_exposure:             "worker heat exposure unprotected",
    peak_worker_exposure:             "peak outdoor worker exposure",
    heat_overload_if_unprepared:      "hospital heat overload risk",
    water_stress_intensification:     "intensifying water stress",
    high_energy_demand:               "high energy demand in heat",
    surface_heat:                     "surface heat contribution",
    industrial_heat:                  "industrial heat output"
  };

  if (activeExts.length > 0) {
    activeExts.forEach(ext => {
      const label = extLabels[ext] || ext.replace(/_/g, " ");
      lines.push(`Risk: ${label}.`);
    });
  }

  return lines;
}

// ─── City-wide recomputation ───────────────────────────────────────────────────
// Called after any board change. Stores results on each tile object and
// returns a summary for use in render functions.

let _lastCityState = null;

function buildCityState(cityTiles, activePolicies, activeSolutions, mode) {
  const tileNames = [...new Set(cityTiles.map(t => t.name))];
  const capacities = deriveCityCapacities(cityTiles, activePolicies, activeSolutions);
  return {
    tiles: tileNames,
    capacities,
    policies: [...(activePolicies || []), ...(activeSolutions || [])],
    mode
  };
}

function recomputeCityDependencies(cityTiles, activePolicies, activeSolutions, mode) {
  const cityState = buildCityState(cityTiles, activePolicies, activeSolutions, mode);
  _lastCityState = cityState;

  // Evaluate each non-GPO tile and store result on the tile object
  cityTiles.forEach(tile => {
    if (tile.name === "GPO") {
      tile.depEval = null;
      return;
    }
    tile.depEval = evaluateTileNode(tile, cityState, mode);
  });

  return cityState;
}

// ─── Offer evaluation ─────────────────────────────────────────────────────────
// Called when rendering offer cards to show how a candidate tile would
// fit into the current city if placed.

function evaluateOfferTile(candidateTile, cityTiles, activePolicies, activeSolutions, mode) {
  // Simulate city with the candidate placed
  const hypothetical = [...cityTiles, candidateTile];
  const cityState = buildCityState(hypothetical, activePolicies, activeSolutions, mode);
  return evaluateTileNode(candidateTile, cityState, mode);
}

// ─── Waste overflow check ─────────────────────────────────────────────────────

function checkWasteOverflow(cityTiles) {
  const citySize = cityTiles.filter(t => t.name !== "GPO").length;
  const hasWaste = cityTiles.some(t => ["City Landfill", "Residential Landfill", "Sewage Treatment Plant"].includes(t.name));
  return !hasWaste && citySize >= 8;
}

// ─── Expose to global scope ───────────────────────────────────────────────────
// All functions are defined at module level; no wrapping needed for browser.
