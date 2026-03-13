// ─────────────────────────────────────────────────────────────────────────────
// DATA LAYER  —  Fix It
//
// Systems scaffold: finance, needs, tile economics, and card diagnosis.
// Names match the canonical tile/card names used throughout fix-it.js and
// dependency-engine.js (e.g. "Govt Office", "Pvt Office", "DG Set").
//
// This file must be loaded BEFORE road-engine.js, placement-rules.js,
// dependency-engine.js, and fix-it.js.
// ─────────────────────────────────────────────────────────────────────────────

const CITY_FINANCE = {
  annual_budget:     100000000,
  rounds:            8,
  round_budget:      12500000,
  emergency_reserve: 15000000,
  current_budget:    12500000,
  reserve_used:      0
};

const CITY_NEEDS = {
  waste:    { demand: 0, supply: 0 },
  housing:  { demand: 0, supply: 0 },
  power:    { demand: 0, supply: 0 },
  health:   { demand: 0, supply: 0 },
  mobility: { demand: 0, supply: 0 }
};

// ─────────────────────────────────────────────────────────────────────────────
// LAND TILE SYSTEM
// Augments the visual TILE_LIBRARY with economics, needs, failure, and
// diagnosis text.  Tile names are normalised to the canonical game spellings.
// ─────────────────────────────────────────────────────────────────────────────

const LAND_TILE_SYSTEM = [
  {
    name: "Forest",
    tags: ["problem_solving"],
    build_cost: 3000000,
    maintenance_cost: 300000,
    repair_cost: 800000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["shade", "cooling", "air_buffer"],
    requires: ["protection_from_encroachment"],
    upgrades_with: ["Public Park", "Urban Greening and Shade Corridors"],
    penalties_if_missing: ["heat_island", "dust_exposure"],
    diagnosis: [
      "Forest cover reduced heat build-up and softened dust exposure.",
      "Tree cover is acting as a buffer against both heat and pollution."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Public Park",
    tags: ["problem_solving"],
    build_cost: 2500000,
    maintenance_cost: 350000,
    repair_cost: 900000,
    revenue: 100000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["public_relief_space", "shade", "cooling"],
    requires: ["maintenance", "water"],
    upgrades_with: ["Forest", "Cooling Centres and Shelters", "Emergency Water Points"],
    penalties_if_missing: ["public_heat_exposure", "leaf_burning"],
    diagnosis: [
      "Public park offered cooling relief but needs upkeep to stay effective.",
      "Open public space reduced heat burden where shade and water were available."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Airport",
    tags: ["growth"],
    build_cost: 18000000,
    maintenance_cost: 1800000,
    repair_cost: 5000000,
    revenue: 3000000,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 2 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 2 }
    },
    provides: ["regional_connectivity", "logistics", "high_value_growth"],
    requires: ["road_access", "power_supply", "traffic_management"],
    upgrades_with: ["Hotel", "Pvt Office", "Metro", "Solar Power Plant"],
    penalties_if_missing: ["traffic_spillover", "heat_hardscape", "high_energy_load"],
    diagnosis: [
      "Airport boosted development but increased mobility and power pressure.",
      "Airport intensified heat and traffic load because clean access was weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -3, air: 2, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "Railway",
    tags: ["conditional"],
    build_cost: 9000000,
    maintenance_cost: 900000,
    repair_cost: 2500000,
    revenue: 1200000,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 2 }
    },
    provides: ["mass_mobility", "regional_access"],
    requires: ["Bus Stop", "last_mile_connectivity", "shade", "water"],
    upgrades_with: ["Bus Stop", "Metro", "Shade at Public Places", "Emergency Water Points"],
    penalties_if_missing: ["underused_mass_transit", "public_heat_exposure"],
    diagnosis: [
      "Railway access lowered mobility stress where last-mile links existed.",
      "Railway station remained underused because feeder systems were weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Bus Stop",
    tags: ["problem_solving", "conditional"],
    build_cost: 1200000,
    maintenance_cost: 150000,
    repair_cost: 400000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 }
    },
    provides: ["public_transport_access", "first_last_mile_support"],
    requires: ["road_network", "shade", "water"],
    upgrades_with: ["Metro", "Railway", "Shade at Public Places", "Emergency Water Points"],
    penalties_if_missing: ["unsafe_waiting_conditions", "continued_private_vehicle_dependence"],
    diagnosis: [
      "Bus stop improved mobility access, but shade and water determine its resilience.",
      "Public transport access remained weak because feeder conditions were poor."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Metro",
    tags: ["conditional"],
    build_cost: 15000000,
    maintenance_cost: 1400000,
    repair_cost: 4000000,
    revenue: 1800000,
    needs: {
      demand: { waste: 0, housing: 0, power: 2, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 3 }
    },
    provides: ["high_capacity_mobility", "traffic_reduction_potential"],
    requires: ["Bus Stop", "dense_housing", "reliable_power"],
    upgrades_with: ["High-rise Housing", "Affordable Housing", "Bus Stop"],
    penalties_if_missing: ["underused_infrastructure", "weak_aqi_benefit"],
    diagnosis: [
      "Metro performed well because feeder systems and density supported it.",
      "Metro remained underused because housing or bus integration was missing."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -3, air: 1, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "Highway",
    tags: ["growth"],
    build_cost: 10000000,
    maintenance_cost: 1000000,
    repair_cost: 2500000,
    revenue: 1200000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 2 }
    },
    provides: ["freight_flow", "regional_mobility"],
    requires: ["traffic_management", "freight_regulation", "dust_control"],
    upgrades_with: ["Weigh-in-motion", "Green buffers", "Road Improvement"],
    penalties_if_missing: ["traffic_jams", "dust_spikes", "worker_heat_exposure"],
    diagnosis: [
      "Highway improved movement but worsened air where jams intensified.",
      "Highway added heat and dust because road management lagged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 2, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "School",
    tags: ["problem_solving"],
    build_cost: 4500000,
    maintenance_cost: 400000,
    repair_cost: 1200000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 1, mobility: 0 }
    },
    provides: ["human_capital", "social_resilience"],
    requires: ["shade", "water", "safe_access"],
    upgrades_with: ["Cool Roof Programme", "Emergency Water Points", "Public Park", "Forest"],
    penalties_if_missing: ["schoolyard_heat", "child_exposure_to_traffic"],
    diagnosis: [
      "School added long-run development but became vulnerable where shade and water were absent.",
      "School resilience improved because public realm protections surrounded it."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "College",
    tags: ["problem_solving", "conditional"],
    build_cost: 5500000,
    maintenance_cost: 500000,
    repair_cost: 1400000,
    revenue: 200000,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 1, mobility: 0 }
    },
    provides: ["skills", "human_capital"],
    requires: ["mobility_access", "shade", "water"],
    upgrades_with: ["Metro", "Bus Stop", "Cool Roof Programme"],
    penalties_if_missing: ["car_dependence", "campus_heat_exposure"],
    diagnosis: [
      "College strengthened long-run development where transport access was strong.",
      "College underperformed because access and heat adaptation were weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Hospital",
    tags: ["problem_solving"],
    build_cost: 9000000,
    maintenance_cost: 1000000,
    repair_cost: 2500000,
    revenue: 0,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 3, mobility: 0 }
    },
    provides: ["health_capacity", "emergency_response"],
    requires: ["reliable_power", "water", "access", "preparedness"],
    upgrades_with: ["Heat Health Preparedness", "Power Backup for Health and Cooling", "Cool Roof Programme"],
    penalties_if_missing: ["hospital_overload", "heatstroke_failure", "pollution_treatment_failure"],
    diagnosis: [
      "Hospital improved resilience but strained power and water systems.",
      "Hospital overload worsened because backup power and preparedness were missing."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -3, air: 1, heat: 2, water: 0, electricity: 1 }
    }
  },
  {
    name: "Govt Office",
    tags: ["conditional"],
    build_cost: 3500000,
    maintenance_cost: 300000,
    repair_cost: 900000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 1, mobility: 0 }
    },
    provides: ["administrative_response", "coordination"],
    requires: ["power", "communication"],
    upgrades_with: ["Heat Alert Broadcast", "Ward-Level Heat Volunteers", "Cooling Centres and Shelters"],
    penalties_if_missing: ["weak_response_coordination", "slow_alerts"],
    diagnosis: [
      "Administrative capacity improved response speed where office systems were functional.",
      "Slow coordination worsened hazard impacts because response infrastructure was weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 0, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Pvt Office",
    tags: ["growth"],
    build_cost: 5000000,
    maintenance_cost: 500000,
    repair_cost: 1300000,
    revenue: 1400000,
    needs: {
      demand: { waste: 0, housing: 0, power: 2, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["formal_jobs", "commercial_growth"],
    requires: ["power", "transport_access"],
    upgrades_with: ["Metro", "Bus Stop", "Solar Power Plant"],
    penalties_if_missing: ["traffic_growth", "generator_dependence", "cooling_load"],
    diagnosis: [
      "Private office added jobs but raised mobility and power demand.",
      "Formal office growth became dirty because transit and clean power lagged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "Thermal Power Plant",
    tags: ["growth", "conditional"],
    build_cost: 12000000,
    maintenance_cost: 1500000,
    repair_cost: 3500000,
    revenue: 1800000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 4, health: 0, mobility: 0 }
    },
    provides: ["base_load_power"],
    requires: ["fuel_supply", "water", "regulation"],
    upgrades_with: ["Emission Standards", "Solar Power Plant", "Methane Power Plant", "Phase-out policy"],
    penalties_if_missing: ["coal_lock_in", "air_pollution_spike", "water_stress"],
    diagnosis: [
      "Thermal plant stabilized power but worsened air and heat burden.",
      "Coal dependence deepened because cleaner transition support was missing."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -3, air: 3, heat: 2, water: 1, electricity: 2 }
    }
  },
  {
    name: "Methane Power Plant",
    tags: ["conditional", "problem_solving"],
    build_cost: 6500000,
    maintenance_cost: 700000,
    repair_cost: 1800000,
    revenue: 700000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 1, housing: 0, power: 2, health: 0, mobility: 0 }
    },
    provides: ["transition_power", "waste_to_energy"],
    requires: ["organic_waste_stream", "waste_system"],
    upgrades_with: ["City Landfill", "Residential Landfill", "Waste reform"],
    penalties_if_missing: ["underused_plant", "weak_transition_benefit"],
    diagnosis: [
      "Methane plant worked best where waste systems fed it properly.",
      "Transition power stayed weak because the waste chain was incomplete."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "Solar Power Plant",
    tags: ["problem_solving", "conditional"],
    build_cost: 8000000,
    maintenance_cost: 500000,
    repair_cost: 1600000,
    revenue: 800000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 2, health: 0, mobility: 0 }
    },
    provides: ["cleaner_power", "lower_emission_electricity"],
    requires: ["grid_integration"],
    upgrades_with: ["Hospital", "Hotel", "Pvt Office", "EV Charging Station"],
    penalties_if_missing: ["underused_clean_capacity"],
    diagnosis: [
      "Solar reduced air burden and supported heat resilience through cleaner power.",
      "Solar capacity underperformed because the city could not use it effectively."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 0, heat: 0, water: 0, electricity: 1 }
    }
  },
  {
    name: "EV Charging Station",
    tags: ["conditional"],
    build_cost: 1800000,
    maintenance_cost: 180000,
    repair_cost: 450000,
    revenue: 250000,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 }
    },
    provides: ["clean_mobility_support"],
    requires: ["vehicle_transition", "reliable_power"],
    upgrades_with: ["Petrol Pump Transition", "Solar Power Plant", "Electric Buses"],
    penalties_if_missing: ["underused_infrastructure"],
    diagnosis: [
      "EV charging became valuable only where vehicle transition support existed.",
      "Charging station remained underused because clean mobility uptake was weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 0, heat: 0, water: 0, electricity: 1 }
    }
  },
  {
    name: "CNG Station",
    tags: ["conditional"],
    build_cost: 2200000,
    maintenance_cost: 220000,
    repair_cost: 550000,
    revenue: 300000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 }
    },
    provides: ["transition_fuel_support"],
    requires: ["vehicle_conversion"],
    upgrades_with: ["Bus fleet transition", "Freight regulation"],
    penalties_if_missing: ["limited_uptake"],
    diagnosis: [
      "CNG station acted as a bridge where transport fleets could actually shift.",
      "Transition fuel support stayed weak because vehicles were not converted."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 0, water: 0, electricity: 0 }
    }
  },
  {
    name: "Petrol Pump",
    tags: ["growth", "conditional"],
    build_cost: 2500000,
    maintenance_cost: 250000,
    repair_cost: 600000,
    revenue: 500000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 }
    },
    provides: ["transport_fuel_access"],
    requires: ["vehicle_dependence", "road_network"],
    upgrades_with: ["EV Charging Station", "CNG Station"],
    penalties_if_missing: ["fuel_shortage_if_car_dependent_city"],
    diagnosis: [
      "Petrol pump supported current mobility but reinforced dirty transport lock-in.",
      "Fuel access remained useful, but slowed the clean mobility transition."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 0, water: 0, electricity: 0 }
    }
  },
  {
    name: "DG Set",
    tags: ["conditional"],
    build_cost: 1500000,
    maintenance_cost: 200000,
    repair_cost: 400000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 1, health: 0, mobility: 0 }
    },
    provides: ["backup_power"],
    requires: ["diesel_supply"],
    upgrades_with: ["Reliable grid", "Solar Power Plant"],
    penalties_if_missing: ["critical_service_failure_during_outage"],
    diagnosis: [
      "DG sets prevented outage collapse but worsened air sharply.",
      "Dirty backup systems kept services alive while driving AQI upward."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 2, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "High-rise Housing",
    tags: ["growth", "conditional"],
    build_cost: 7000000,
    maintenance_cost: 700000,
    repair_cost: 1800000,
    revenue: 900000,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 4, power: 0, health: 0, mobility: 0 }
    },
    provides: ["housing_supply", "urban_density"],
    requires: ["power", "water", "mobility", "cooling_relief"],
    upgrades_with: ["Metro", "Bus Stop", "Cool Roof Programme", "Reliable Power"],
    penalties_if_missing: ["hot_night_trap", "generator_dependence", "mobility_pressure"],
    diagnosis: [
      "High-rise housing absorbed demand but sharply increased power and heat pressure.",
      "Dense housing became resilient only where mobility and cooling support existed."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 2, water: 1, electricity: 1 }
    }
  },
  {
    name: "Slums",
    tags: ["conditional", "problem_solving"],
    build_cost: 2000000,
    maintenance_cost: 250000,
    repair_cost: 600000,
    revenue: 0,
    needs: {
      demand: { waste: 1, housing: 0, power: 1, health: 1, mobility: 1 },
      supply: { waste: 0, housing: 2, power: 0, health: 0, mobility: 0 }
    },
    provides: ["affordable_city_access", "labour_proximity"],
    requires: ["water", "clean_cooking", "waste_services", "heat_relief"],
    upgrades_with: ["LPG penetration", "Emergency Water Points", "Cool Roof Programme", "Ward-Level Heat Volunteers"],
    penalties_if_missing: ["dirty_fuel_use", "waste_burning", "heat_pocket", "high_vulnerability"],
    diagnosis: [
      "Settlement vulnerability worsened because services did not keep pace.",
      "Low-income housing became safer where water, clean cooking, and heat support arrived."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 2, heat: 2, water: 1, electricity: 0 }
    }
  },
  {
    name: "Affordable Housing",
    tags: ["problem_solving", "conditional"],
    build_cost: 5000000,
    maintenance_cost: 450000,
    repair_cost: 1200000,
    revenue: 200000,
    needs: {
      demand: { waste: 1, housing: 0, power: 1, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 3, power: 0, health: 0, mobility: 0 }
    },
    provides: ["social_housing", "migration_absorption"],
    requires: ["water", "power", "transport_access", "cooling_support"],
    upgrades_with: ["Bus Stop", "Metro", "Cool Roof Programme", "Emergency Water Points"],
    penalties_if_missing: ["service_stress", "heat_vulnerability"],
    diagnosis: [
      "Affordable housing reduced housing stress but raised service demand.",
      "Affordable housing worked best where mobility and basic services arrived together."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 1, electricity: 1 }
    }
  },
  {
    name: "Residential Landfill",
    tags: ["conditional"],
    build_cost: 2200000,
    maintenance_cost: 300000,
    repair_cost: 700000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 1, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["local_waste_capacity"],
    requires: ["collection_system", "segregation"],
    upgrades_with: ["Waste reform", "Methane Power Plant"],
    penalties_if_missing: ["informal_dumping", "burning_risk"],
    diagnosis: [
      "Local landfill absorbed waste but increased smoke risk where unmanaged.",
      "Waste burden stayed contained only where collection and reform existed."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 2, heat: 1, water: 1, electricity: 0 }
    }
  },
  {
    name: "City Landfill",
    tags: ["conditional"],
    build_cost: 4000000,
    maintenance_cost: 500000,
    repair_cost: 1300000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 3, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["citywide_waste_capacity"],
    requires: ["segregation", "regulation", "buffering"],
    upgrades_with: ["Sewage Treatment Plant", "Methane Power Plant", "Waste Management Reform"],
    penalties_if_missing: ["waste_overflow", "landfill_fire", "open_burning", "heat_hotspot"],
    diagnosis: [
      "Landfill prevented waste overflow but became a major hazard without upgrades.",
      "Waste capacity stabilized only because treatment or reform supported the landfill."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 3, heat: 2, water: 1, electricity: 0 }
    }
  },
  {
    name: "Sewage Treatment Plant",
    tags: ["problem_solving", "conditional"],
    build_cost: 6000000,
    maintenance_cost: 550000,
    repair_cost: 1400000,
    revenue: 150000,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 0, mobility: 0 },
      supply: { waste: 2, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["wastewater_treatment", "sanitation_support", "water_resilience"],
    requires: ["power", "network_connections", "maintenance"],
    upgrades_with: ["City Landfill", "Rainwater Harvesting and Water Storage", "Water storage"],
    penalties_if_missing: ["water_contamination", "heat_vulnerability_through_water_insecurity"],
    diagnosis: [
      "Treatment infrastructure reduced sanitation and water stress.",
      "Water and waste risks worsened because treatment systems were weak."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 2, electricity: 0 }
    }
  },
  {
    name: "Mall",
    tags: ["growth"],
    build_cost: 6500000,
    maintenance_cost: 700000,
    repair_cost: 1800000,
    revenue: 1800000,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 2 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["formal_commerce", "revenue", "jobs"],
    requires: ["power", "water", "transport_access"],
    upgrades_with: ["Metro", "Bus Stop", "Solar Power Plant"],
    penalties_if_missing: ["traffic_growth", "energy_stress", "heat_load"],
    diagnosis: [
      "Mall raised revenue but intensified mobility, power, and heat pressure.",
      "Commercial growth became costly because clean access and energy lagged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 1, electricity: 1 }
    }
  },
  {
    name: "Weekly Market",
    tags: ["growth", "problem_solving"],
    build_cost: 1800000,
    maintenance_cost: 180000,
    repair_cost: 450000,
    revenue: 700000,
    needs: {
      demand: { waste: 1, housing: 0, power: 0, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["local_livelihoods", "food_access"],
    requires: ["shade", "water", "waste_collection", "road_access"],
    upgrades_with: ["Emergency Water Points", "Shade at Public Places", "Waste reform"],
    penalties_if_missing: ["vendor_heat_exposure", "street_waste", "traffic_spillover"],
    diagnosis: [
      "Weekly market supported livelihoods but needed public-service support to stay resilient.",
      "Market exposure worsened because shade, water, and waste systems lagged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Mixed Market",
    tags: ["growth", "conditional"],
    build_cost: 2800000,
    maintenance_cost: 220000,
    repair_cost: 600000,
    revenue: 900000,
    needs: {
      demand: { waste: 1, housing: 0, power: 0, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["distributed_commerce", "jobs", "local_access"],
    requires: ["waste_collection", "shade", "water"],
    upgrades_with: ["Bus Stop", "Shade at Public Places", "Waste reform"],
    penalties_if_missing: ["congestion", "waste_spillover", "heat_exposure"],
    diagnosis: [
      "Mixed market diversified local economy but increased public-space strain.",
      "Distributed commerce remained viable because support systems were present."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Hotel",
    tags: ["growth", "conditional"],
    build_cost: 7000000,
    maintenance_cost: 750000,
    repair_cost: 1800000,
    revenue: 2200000,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["tourism_revenue", "service_jobs"],
    requires: ["power", "water", "transport_access", "waste_services"],
    upgrades_with: ["Solar Power Plant", "Metro", "Efficient systems", "Clean cooking transition"],
    penalties_if_missing: ["resource_stress", "dirty_fuel_load", "cooling_load"],
    diagnosis: [
      "Hotel added money and jobs but sharply raised water and electricity load.",
      "Hospitality stayed cleaner only when paired with efficient energy support."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 1, heat: 1, water: 1, electricity: 1 }
    }
  },
  {
    name: "SSI",
    tags: ["growth", "conditional"],
    build_cost: 5000000,
    maintenance_cost: 600000,
    repair_cost: 1500000,
    revenue: 1500000,
    needs: {
      demand: { waste: 1, housing: 0, power: 2, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["jobs", "local_manufacturing"],
    requires: ["power", "regulation", "waste_handling", "worker_protection"],
    upgrades_with: ["Cleaner fuel", "Shift Work Hours", "Emission control"],
    penalties_if_missing: ["pollution_cluster", "unsafe_labour_conditions", "heat_injury_risk"],
    diagnosis: [
      "Small industry created jobs but became dirty and unsafe without controls.",
      "Industrial employment remained productive where worker and emissions safeguards existed."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 2, heat: 1, water: 0, electricity: 1 }
    }
  },
  {
    name: "Large-scale Industry",
    tags: ["growth", "conditional"],
    build_cost: 11000000,
    maintenance_cost: 1400000,
    repair_cost: 3000000,
    revenue: 2800000,
    needs: {
      demand: { waste: 1, housing: 0, power: 3, health: 0, mobility: 2 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["major_jobs", "industrial_output", "tax_base"],
    requires: ["power", "water", "freight", "regulation"],
    upgrades_with: ["Emission Standards", "Shift Work Hours", "Solar Support", "Cleaner fuels"],
    penalties_if_missing: ["industrial_pollution", "worker_heat_exposure", "water_stress"],
    diagnosis: [
      "Large industry drove growth but sharply raised air, heat, and infrastructure burden.",
      "Industrial growth stayed viable only where regulation and energy support existed."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -4, air: 3, heat: 2, water: 1, electricity: 2 }
    }
  },
  {
    name: "Construction",
    tags: ["growth", "conditional"],
    build_cost: 3500000,
    maintenance_cost: 300000,
    repair_cost: 900000,
    revenue: 400000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 1 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["future_capacity", "jobs", "growth_pipeline"],
    requires: ["dust_control", "worker_protection", "water"],
    upgrades_with: ["Shift Work Hours", "Emergency Water Points", "Dust control"],
    penalties_if_missing: ["dust_spikes", "worker_heat_exposure"],
    diagnosis: [
      "Construction created future growth but immediately worsened dust and worker heat risk.",
      "Growth pipeline stayed manageable only because safeguards were active."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -2, air: 2, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Barren Land",
    tags: ["conditional"],
    build_cost: 500000,
    maintenance_cost: 50000,
    repair_cost: 150000,
    revenue: 0,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["future_development_space"],
    requires: ["land_use_planning"],
    upgrades_with: ["Forest", "Affordable Housing", "Solar Power Plant"],
    penalties_if_missing: ["dust", "speculative_stagnation"],
    diagnosis: [
      "Barren land stayed neutral until planned use gave it value.",
      "Exposed open land increased dust because it remained unmanaged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: 0, air: 1, heat: 1, water: 0, electricity: 0 }
    }
  },
  {
    name: "Agricultural Land",
    tags: ["conditional", "problem_solving"],
    build_cost: 1500000,
    maintenance_cost: 120000,
    repair_cost: 350000,
    revenue: 300000,
    needs: {
      demand: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 },
      supply: { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 }
    },
    provides: ["food_buffer", "peri_urban_open_space", "cooling"],
    requires: ["water", "anti-burning_rules", "land_protection"],
    upgrades_with: ["Rainwater Harvesting and Water Storage", "Forest", "Anti-burning enforcement"],
    penalties_if_missing: ["crop_burning", "buffer_loss", "water_stress"],
    diagnosis: [
      "Agricultural land reduced heat and provided buffer value where protected.",
      "Peri-urban land turned risky because burning and water stress were unmanaged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 2, heat: 1, water: 1, electricity: 0 }
    }
  },
  {
    name: "Urban Village",
    tags: ["conditional"],
    build_cost: 2200000,
    maintenance_cost: 220000,
    repair_cost: 600000,
    revenue: 100000,
    needs: {
      demand: { waste: 1, housing: 0, power: 1, health: 1, mobility: 1 },
      supply: { waste: 0, housing: 2, power: 0, health: 0, mobility: 0 }
    },
    provides: ["mixed_use_settlement", "migration_absorption", "labour_access"],
    requires: ["water", "clean_cooking", "waste_services", "heat_relief"],
    upgrades_with: ["LPG penetration", "Emergency Water Points", "Bus Stop", "Cool Roof Programme"],
    penalties_if_missing: ["service_failure", "heat_stress", "dirty_fuel_risk"],
    diagnosis: [
      "Urban village absorbed growth pressure but required basic services to stay stable.",
      "Settlement stress worsened because service upgrades did not keep pace."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 2, heat: 2, water: 1, electricity: 0 }
    }
  },
  {
    name: "Rural Village",
    tags: ["conditional"],
    build_cost: 1800000,
    maintenance_cost: 180000,
    repair_cost: 500000,
    revenue: 50000,
    needs: {
      demand: { waste: 0, housing: 0, power: 1, health: 1, mobility: 1 },
      supply: { waste: 0, housing: 1, power: 0, health: 0, mobility: 0 }
    },
    provides: ["peri_urban_settlement", "food_labor_linkages"],
    requires: ["water", "clean_cooking", "transport_link", "heat_alerts"],
    upgrades_with: ["LPG penetration", "Emergency Water Points", "Bus Stop", "Heat Alert Broadcast"],
    penalties_if_missing: ["dirty_energy_dependence", "acute_heat_vulnerability", "isolation"],
    diagnosis: [
      "Rural village remained viable only where basic services and alerts reached it.",
      "Peripheral settlement vulnerability rose because access and clean energy lagged."
    ],
    failure_if_unmaintained: {
      after_rounds: 2,
      effects: { development: -1, air: 1, heat: 2, water: 1, electricity: 0 }
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// AIR POLLUTION PROBLEM CARDS
// ─────────────────────────────────────────────────────────────────────────────

const AIR_POLLUTION_CARDS = [
  {
    name: "Commercial trucks from neighbouring cities keep delivering pollution",
    severity: "mild",
    targets: ["Highway"],
    tags: ["growth", "conditional"],
    impacts: { air: 2, heat: 0, development: 0, water: 0, electricity: 0 },
    amplifiers: ["traffic_jams", "freight_dependence"],
    reduced_by: ["Weigh-in-motion", "Metro", "Bus Stop"],
    diagnosis: [
      "Air worsened because freight kept moving through congested road edges.",
      "Traffic-heavy growth locked the city into truck pollution."
    ]
  },
  {
    name: "Air pollution from thermal power plants impact the health of both near and far",
    severity: "mild",
    targets: ["Thermal Power Plant"],
    tags: ["conditional"],
    impacts: { air: 2, heat: 1, development: 0, water: 1, electricity: 0 },
    amplifiers: ["coal_lock_in", "poor_emission_control"],
    reduced_by: ["Solar Power Plant", "Emission Standards", "Methane Power Plant"],
    diagnosis: [
      "Air worsened because coal power remained dominant.",
      "Thermal generation raised both pollution and water stress."
    ]
  },
  {
    name: "More than 40% households use dirty fuel for cooking, which is one of the biggest hidden polluters",
    severity: "mild",
    targets: ["Slums", "Urban Village", "Rural Village"],
    tags: ["problem_solving", "conditional"],
    impacts: { air: 1, heat: 0, development: 0, water: 0, electricity: 0 },
    amplifiers: ["clean_cooking_gap"],
    reduced_by: ["Accelerate LPG penetration for cooking in households"],
    diagnosis: [
      "Air worsened because clean cooking access never reached vulnerable households."
    ]
  },
  {
    name: "Plastic waste burning becomes a bigger enemy of air quality than stubble burning",
    severity: "mixed",
    targets: ["City Landfill", "Residential Landfill"],
    tags: ["conditional"],
    impacts: { air: 2, heat: 1, development: 0, water: 1, electricity: 0 },
    amplifiers: ["waste_overflow", "weak_regulation"],
    reduced_by: ["Strict implementation of waste-management rules", "Move toward decentralised waste infrastructure"],
    diagnosis: [
      "Air worsened because waste systems failed and burning became the default outlet."
    ]
  },
  {
    name: "The poor quality of roads leads to heavy traffic and leaves citizens choking",
    severity: "mild",
    targets: ["Petrol Pump", "Large-scale Industry", "SSI"],
    tags: ["growth"],
    impacts: { air: 2, heat: 1, development: -1, water: 0, electricity: 0 },
    amplifiers: ["jammed_edges", "mobility_shortfall"],
    reduced_by: ["Undertake road widening and improvement", "Enhance public transport and shift travel behaviour"],
    diagnosis: [
      "Air worsened because traffic edges jammed near dense housing.",
      "Mobility shortfall converted road infrastructure into a pollution source."
    ]
  },
  {
    name: "A large fire breaks out in the landfill and haze envelops the city",
    severity: "severe",
    targets: ["City Landfill"],
    tags: ["conditional"],
    impacts: { air: 3, heat: 1, development: -1, water: 1, electricity: 0 },
    amplifiers: ["weak_waste_management", "dry_conditions"],
    reduced_by: ["Move toward decentralised waste infrastructure", "Train municipalities and SPCBs on advanced integrated waste management"],
    diagnosis: [
      "Air collapsed because landfill fire risk was left unmanaged."
    ]
  },
  {
    name: "E-waste and plastic burning put nearby neighbourhoods at risk",
    severity: "mixed",
    targets: ["City Landfill", "Residential Landfill"],
    tags: ["conditional"],
    impacts: { air: 1, heat: 1, development: 0, water: 1, electricity: 0 },
    amplifiers: ["waste_segregation_failure"],
    reduced_by: ["Enforce extended producer responsibility", "Strict implementation of waste-management rules"],
    diagnosis: [
      "Toxic air burden rose because hazardous waste was not separated or managed."
    ]
  },
  {
    name: "Open burning of leaves continues in parks and near housing complexes",
    severity: "mild",
    targets: ["High-rise Housing", "Public Park", "Barren Land"],
    tags: ["problem_solving", "conditional"],
    impacts: { air: 1, heat: 0, development: 0, water: 0, electricity: 0 },
    amplifiers: ["weak_maintenance", "no_waste_pickup"],
    reduced_by: ["Construct a methane power plant", "Train municipalities and SPCBs on advanced integrated waste management"],
    diagnosis: [
      "Air worsened because public spaces and housing edges were managed through burning."
    ]
  },
  {
    name: "Illegal burning continues in the landfill to clear space for more garbage",
    severity: "mixed",
    targets: ["City Landfill"],
    tags: ["conditional"],
    impacts: { air: 2, heat: 1, development: 0, water: 0, electricity: 0 },
    amplifiers: ["waste_capacity_shortfall"],
    reduced_by: ["Move toward decentralised waste infrastructure", "Strict implementation of waste-management rules"],
    diagnosis: [
      "Landfill pressure intensified because capacity was expanded through burning rather than reform."
    ]
  },
  {
    name: "Smokey chimneys leave people from nearby villages choking",
    severity: "mixed",
    targets: ["Thermal Power Plant", "SSI", "Large-scale Industry"],
    tags: ["growth", "conditional"],
    impacts: { air: 3, heat: 1, development: 0, water: 0, electricity: 0 },
    amplifiers: ["poor_emission_control"],
    reduced_by: ["Introduce revised emission standards for thermal plants", "Cleaner fuel transition"],
    diagnosis: [
      "Air worsened because industrial and power emissions remained uncontrolled."
    ]
  },
  {
    name: "Coal dependence remains high and the transition to clean fuels stalls",
    severity: "mixed",
    targets: ["Thermal Power Plant"],
    tags: ["conditional"],
    impacts: { air: 2, heat: 1, development: 0, water: 1, electricity: 0 },
    amplifiers: ["power_shortfall", "no_clean_transition"],
    reduced_by: ["Cover 500MW demand with solar generation", "Phase out older coal plants and convert some to gas"],
    diagnosis: [
      "Air remained dirty because the city delayed power transition."
    ]
  },
  {
    name: "During a heatwave, the administration fires up an old coal plant to meet electricity demand",
    severity: "severe",
    targets: ["Thermal Power Plant", "Hospital", "High-rise Housing"],
    tags: ["conditional"],
    impacts: { air: 2, heat: 2, development: 0, water: 1, electricity: 0 },
    amplifiers: ["electricity_shortfall", "heat_stress"],
    reduced_by: ["Solar Power Plant", "Power Backup for Health and Cooling"],
    diagnosis: [
      "A dangerous loop formed: heat drove power demand, which drove dirty backup generation."
    ]
  },
  {
    name: "Hotels protect indoor air for a few while pollution spreads outside",
    severity: "mild",
    targets: ["Hotel"],
    tags: ["growth"],
    impacts: { air: 1, heat: 1, development: 0, water: 0, electricity: 1 },
    amplifiers: ["dirty_fuel_use", "generator_dependence"],
    reduced_by: ["Stop using coal and firewood in hotels and open eateries", "Solar Power Plant"],
    diagnosis: [
      "Private comfort masked wider urban pollution because energy systems stayed dirty."
    ]
  },
  {
    name: "Vehicles account for more than half of total air pollution in the city",
    severity: "severe",
    targets: ["Petrol Pump", "DG Set"],
    tags: ["growth"],
    impacts: { air: 3, heat: 1, development: -1, water: 0, electricity: 0 },
    amplifiers: ["mobility_shortfall", "no_clean_mobility_support"],
    reduced_by: ["Enhance public transport and shift travel behaviour", "Control pricing of alternative fuels"],
    diagnosis: [
      "Air worsened because the city remained locked into private and dirty transport."
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// AIR SOLUTION CARDS
// ─────────────────────────────────────────────────────────────────────────────

const AIR_SOLUTION_CARDS = [
  {
    name: "Install weigh-in-motion systems at freight entry points",
    solution_cost: 1200000,
    tags: ["problem_solving"],
    targets: ["Highway"],
    addresses: ["freight_pollution", "overloading"],
    impacts: { air: -2, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Freight emissions fell because overloaded trucks were checked at the edge."]
  },
  {
    name: "Cover 500MW demand with solar generation",
    solution_cost: 6000000,
    tags: ["problem_solving", "conditional"],
    targets: ["Thermal Power Plant", "Solar Power Plant"],
    addresses: ["coal_dependence", "dirty_power"],
    impacts: { air: -2, heat: -1, development: 1, water: 0, electricity: 1 },
    diagnosis: ["Cleaner power reduced both AQI pressure and heat-linked electricity stress."]
  },
  {
    name: "Accelerate LPG penetration for cooking in households",
    solution_cost: 1800000,
    tags: ["problem_solving"],
    targets: ["Slums", "Urban Village", "Rural Village"],
    addresses: ["dirty_cooking_fuels"],
    impacts: { air: -1, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Household smoke fell because clean cooking support reached vulnerable settlements."]
  },
  {
    name: "Strict implementation of waste-management rules",
    solution_cost: 2200000,
    tags: ["problem_solving"],
    targets: ["City Landfill", "Residential Landfill"],
    addresses: ["waste_burning", "landfill_mismanagement"],
    impacts: { air: -1, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Waste systems improved because burning was no longer the default outlet."]
  },
  {
    name: "Invest in last-mile connectivity to reduce private vehicle use",
    solution_cost: 2800000,
    tags: ["conditional"],
    targets: ["Petrol Pump", "Bus Stop", "Metro"],
    addresses: ["congestion", "private_vehicle_dependence"],
    impacts: { air: -2, heat: 0, development: 1, water: 0, electricity: 0 },
    diagnosis: ["Traffic eased, but the city still needs cleaner mobility to lock in gains."]
  },
  {
    name: "Move toward decentralised waste infrastructure",
    solution_cost: 3000000,
    tags: ["problem_solving", "conditional"],
    targets: ["City Landfill", "Residential Landfill", "Sewage Treatment Plant"],
    addresses: ["landfill_overdependence"],
    impacts: { air: -2, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Waste risk dropped because the city stopped relying on one overloaded landfill."]
  },
  {
    name: "Enforce extended producer responsibility",
    solution_cost: 1400000,
    tags: ["problem_solving"],
    targets: ["City Landfill", "Residential Landfill"],
    addresses: ["e_waste", "plastic_burning"],
    impacts: { air: -1, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Toxic waste pressure eased because responsibility shifted upstream."]
  },
  {
    name: "Construct a methane power plant",
    solution_cost: 6500000,
    tags: ["conditional"],
    targets: ["City Landfill", "Residential Landfill", "Methane Power Plant"],
    addresses: ["leaf_burning", "organic_waste", "dirty_transition_power"],
    impacts: { air: -1, heat: 0, development: 1, water: 0, electricity: 1 },
    diagnosis: ["Waste streams started generating cleaner transition power instead of smoke."]
  },
  {
    name: "Train municipalities and SPCBs on advanced integrated waste management",
    solution_cost: 1000000,
    tags: ["problem_solving"],
    targets: ["City Landfill", "Residential Landfill", "Govt Office"],
    addresses: ["weak_enforcement", "illegal_burning"],
    impacts: { air: -2, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Air improved because waste governance capacity finally caught up."]
  },
  {
    name: "Introduce revised emission standards for thermal plants",
    solution_cost: 2500000,
    tags: ["problem_solving"],
    targets: ["Thermal Power Plant"],
    addresses: ["stack_emissions"],
    impacts: { air: -1, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Thermal emissions fell because standards and compliance tightened."]
  },
  {
    name: "Control pricing of alternative fuels",
    solution_cost: 1500000,
    tags: ["conditional"],
    targets: ["Petrol Pump", "EV Charging Station", "CNG Station"],
    addresses: ["dirty_transport_lock_in"],
    impacts: { air: -1, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Transport transition accelerated because cleaner fuels became viable."]
  },
  {
    name: "Phase out older coal plants and convert some to gas",
    solution_cost: 5000000,
    tags: ["problem_solving", "conditional"],
    targets: ["Thermal Power Plant", "Methane Power Plant"],
    addresses: ["coal_lock_in"],
    impacts: { air: -1, heat: -1, development: 0, water: 0, electricity: 1 },
    diagnosis: ["Dirty power dependence softened because the city finally began transition."]
  },
  {
    name: "Stop using coal and firewood in hotels and open eateries",
    solution_cost: 900000,
    tags: ["problem_solving"],
    targets: ["Hotel", "Weekly Market", "Mixed Market"],
    addresses: ["dirty_cooking_fuels"],
    impacts: { air: -1, heat: 0, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Commercial cooking emissions fell because cleaner fuels replaced dirty ones."]
  },
  {
    name: "Enhance public transport and shift travel behaviour",
    solution_cost: 2800000,
    tags: ["problem_solving", "conditional"],
    targets: ["Bus Stop", "Metro", "Petrol Pump", "DG Set", "Large-scale Industry"],
    addresses: ["vehicle_emissions", "traffic_jams"],
    impacts: { air: -2, heat: 0, development: 1, water: 0, electricity: 0 },
    diagnosis: ["AQI improved because public transport started outperforming road congestion."]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HEAT PROBLEM CARDS
// ─────────────────────────────────────────────────────────────────────────────

const HEAT_PROBLEM_CARDS = [
  {
    name: "Hot Night Trap",
    severity: "mild",
    targets: ["Slums", "High-rise Housing", "Affordable Housing"],
    tags: ["conditional"],
    impacts: { air: 0, heat: 2, development: 0, water: 0, electricity: 0 },
    amplifiers: ["dense_housing", "lack_of_cool_roofs"],
    reduced_by: ["Cool Roof Programme", "Cooling Centres and Shelters"],
    diagnosis: ["Heat worsened because dense housing retained night-time heat."]
  },
  {
    name: "Water Tankers Run Dry",
    severity: "mixed",
    targets: ["Slums", "Urban Village", "Bus Stop", "Weekly Market"],
    tags: ["problem_solving"],
    impacts: { air: 0, heat: 1, development: 0, water: 2, electricity: 0 },
    amplifiers: ["water_shortfall"],
    reduced_by: ["Emergency Water Points", "Rainwater Harvesting and Water Storage"],
    diagnosis: ["Heat worsened because water stress remained high around public places."]
  },
  {
    name: "Grid Overload",
    severity: "mixed",
    targets: ["Hospital", "High-rise Housing", "DG Set", "Thermal Power Plant"],
    tags: ["conditional"],
    impacts: { air: 1, heat: 2, development: 0, water: 0, electricity: 2 },
    amplifiers: ["cooling_demand", "weak_grid"],
    reduced_by: ["Power Backup for Health and Cooling", "Solar Power Plant"],
    diagnosis: ["A dangerous loop formed because electricity stress pushed the city into emergency cooling failure."]
  },
  {
    name: "Outdoor Labour Exposure",
    severity: "mild",
    targets: ["Construction", "Highway", "Weekly Market"],
    tags: ["growth"],
    impacts: { air: 0, heat: 1, development: -2, water: 0, electricity: 0 },
    amplifiers: ["peak_heat_hours"],
    reduced_by: ["Shift Work Hours", "Emergency Water Points"],
    diagnosis: ["Development fell because outdoor labour remained exposed during peak heat."]
  },
  {
    name: "Heatstroke Ward Overflow",
    severity: "severe",
    targets: ["Hospital"],
    tags: ["problem_solving"],
    impacts: { air: 0, heat: 2, development: -1, water: 0, electricity: 1 },
    amplifiers: ["weak_health_capacity", "power_failure"],
    reduced_by: ["Heat Health Preparedness", "Power Backup for Health and Cooling"],
    diagnosis: ["Hospital resilience dropped because power backup and preparedness were missing."]
  },
  {
    name: "Slum Heat Pocket",
    severity: "mixed",
    targets: ["Slums", "Affordable Housing", "Urban Village"],
    tags: ["conditional"],
    impacts: { air: 0, heat: 2, development: 0, water: 0, electricity: 0 },
    amplifiers: ["lack_of_shade", "lack_of_water"],
    reduced_by: ["Cool Roof Programme", "Ward-Level Heat Volunteers", "Emergency Water Points"],
    diagnosis: ["Heat worsened because vulnerable settlements lacked shade, water, and cooling relief."]
  },
  {
    name: "Transit Shelter Failure",
    severity: "mild",
    targets: ["Bus Stop", "Railway", "Metro"],
    tags: ["conditional"],
    impacts: { air: 0, heat: 1, development: 0, water: 0, electricity: 0 },
    amplifiers: ["no_shade", "no_water"],
    reduced_by: ["Shade at Public Places", "Emergency Water Points"],
    diagnosis: ["Heat worsened because waiting in public space became unsafe."]
  },
  {
    name: "Urban Heat Island Surge",
    severity: "severe",
    targets: ["High-rise Housing", "Mall", "Pvt Office", "Large-scale Industry"],
    tags: ["growth"],
    impacts: { air: 0, heat: 2, development: 0, water: 0, electricity: 1 },
    amplifiers: ["low_green_cover", "hardscape_density"],
    reduced_by: ["Urban Greening and Shade Corridors", "Cool Roof Programme"],
    diagnosis: ["Heat surged because hard surfaces and weak green cover intensified the urban heat island."]
  },
  {
    name: "Heat Alert Misses the Vulnerable",
    severity: "mild",
    targets: ["Slums", "Urban Village", "Rural Village", "Weekly Market"],
    tags: ["problem_solving"],
    impacts: { air: 0, heat: 1, development: 0, water: 0, electricity: 0 },
    amplifiers: ["weak_admin_capacity"],
    reduced_by: ["Heat Alert Broadcast", "Ward-Level Heat Volunteers"],
    diagnosis: ["Heat response faltered because alerts did not reach those most at risk."]
  },
  {
    name: "Schoolyard Heat Exposure",
    severity: "mild",
    targets: ["School", "College"],
    tags: ["problem_solving"],
    impacts: { air: 0, heat: 1, development: -1, water: 0, electricity: 0 },
    amplifiers: ["lack_of_shade", "lack_of_water"],
    reduced_by: ["Cool Roof Programme", "Emergency Water Points", "Shade at Public Places"],
    diagnosis: ["Children and students remained exposed because schools lacked heat adaptation."]
  },
  {
    name: "Cooling Centre Shortfall",
    severity: "mixed",
    targets: ["Govt Office", "School", "Public Park", "Hospital"],
    tags: ["problem_solving"],
    impacts: { air: 0, heat: 2, development: 0, water: 0, electricity: 1 },
    amplifiers: ["no_public_relief_spaces"],
    reduced_by: ["Cooling Centres and Shelters"],
    diagnosis: ["Heat worsened because the city had too few accessible cooling spaces."]
  },
  {
    name: "Early Summer Heatwave",
    severity: "mixed",
    targets: ["Construction", "Bus Stop", "Agricultural Land", "Slums"],
    tags: ["conditional"],
    impacts: { air: 0, heat: 1, development: 0, water: 1, electricity: 1 },
    amplifiers: ["early_heat", "weak_preparedness"],
    reduced_by: ["Heat Alert Broadcast", "Emergency Water Points", "Shift Work Hours"],
    diagnosis: ["The city was caught off guard because preparedness lagged behind the early heatwave."]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HEAT SOLUTION CARDS
// ─────────────────────────────────────────────────────────────────────────────

const HEAT_SOLUTION_CARDS = [
  {
    name: "Cool Roof Programme",
    solution_cost: 2400000,
    tags: ["problem_solving"],
    targets: ["High-rise Housing", "Slums", "Affordable Housing", "School", "Hospital"],
    addresses: ["hot_night_trap", "indoor_heat"],
    impacts: { air: 0, heat: -2, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Heat burden fell because roofs stopped trapping daytime heat into the night."]
  },
  {
    name: "Cooling Centres and Shelters",
    solution_cost: 1800000,
    tags: ["problem_solving"],
    targets: ["Public Park", "Govt Office", "School", "Hospital"],
    addresses: ["public_heat_exposure", "cooling_shortfall"],
    impacts: { air: 0, heat: -2, development: 0, water: 0, electricity: 1 },
    diagnosis: ["Public heat relief improved because the city opened accessible cooling spaces."]
  },
  {
    name: "Emergency Water Points",
    solution_cost: 1200000,
    tags: ["problem_solving"],
    targets: ["Bus Stop", "Weekly Market", "Slums", "Urban Village", "Railway"],
    addresses: ["water_shortfall", "public_heat_exposure"],
    impacts: { air: 0, heat: -1, development: 0, water: -2, electricity: 0 },
    diagnosis: ["Heat exposure dropped because drinking water reached high-risk public places."]
  },
  {
    name: "Shift Work Hours",
    solution_cost: 600000,
    tags: ["problem_solving"],
    targets: ["Construction", "Highway", "Weekly Market", "Large-scale Industry", "SSI"],
    addresses: ["worker_heat_exposure"],
    impacts: { air: 0, heat: -1, development: 1, water: 0, electricity: 0 },
    diagnosis: ["Labour losses fell because outdoor work moved away from peak heat."]
  },
  {
    name: "Heat Health Preparedness",
    solution_cost: 1500000,
    tags: ["problem_solving"],
    targets: ["Hospital"],
    addresses: ["heatstroke_overflow"],
    impacts: { air: 0, heat: -2, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Hospital resilience improved because heat treatment capacity was pre-positioned."]
  },
  {
    name: "Ward-Level Heat Volunteers",
    solution_cost: 700000,
    tags: ["problem_solving"],
    targets: ["Slums", "Urban Village", "Rural Village", "Govt Office"],
    addresses: ["alert_failure", "vulnerability_mapping_gap"],
    impacts: { air: 0, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Local response improved because volunteers could identify and support vulnerable residents."]
  },
  {
    name: "Heat Alert Broadcast",
    solution_cost: 500000,
    tags: ["problem_solving"],
    targets: ["School", "Govt Office", "Bus Stop", "Weekly Market"],
    addresses: ["alert_failure"],
    impacts: { air: 0, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Heat warnings became effective because communication finally reached people in time."]
  },
  {
    name: "Shade at Public Places",
    solution_cost: 1000000,
    tags: ["problem_solving"],
    targets: ["Bus Stop", "Weekly Market", "Railway", "Public Park"],
    addresses: ["public_heat_exposure"],
    impacts: { air: 0, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Public spaces became survivable because shade was added where people actually wait."]
  },
  {
    name: "Urban Greening and Shade Corridors",
    solution_cost: 2800000,
    tags: ["problem_solving", "conditional"],
    targets: ["Forest", "Public Park", "Agricultural Land", "School"],
    addresses: ["urban_heat_island", "dust_exposure"],
    impacts: { air: -1, heat: -2, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Heat and dust fell because shade corridors and green buffers started functioning."]
  },
  {
    name: "Rainwater Harvesting and Water Storage",
    solution_cost: 2200000,
    tags: ["problem_solving", "conditional"],
    targets: ["Sewage Treatment Plant", "Agricultural Land", "Govt Office", "School"],
    addresses: ["water_insecurity"],
    impacts: { air: 0, heat: -1, development: 0, water: -2, electricity: 0 },
    diagnosis: ["Heat resilience improved because water storage reduced emergency scarcity."]
  },
  {
    name: "Power Backup for Health and Cooling",
    solution_cost: 2500000,
    tags: ["problem_solving", "conditional"],
    targets: ["Hospital", "Govt Office", "School"],
    addresses: ["grid_overload", "cooling_failure"],
    impacts: { air: 0, heat: -1, development: 0, water: 0, electricity: -2 },
    diagnosis: ["Critical services stayed functional because backup power protected cooling and treatment."]
  },
  {
    name: "Vulnerability Mapping and Hotspot Planning",
    solution_cost: 900000,
    tags: ["problem_solving"],
    targets: ["Slums", "High-rise Housing", "Bus Stop", "Weekly Market", "Hospital"],
    addresses: ["blind_response", "heat_hotspots"],
    impacts: { air: 0, heat: -1, development: 0, water: 0, electricity: 0 },
    diagnosis: ["Heat response improved because the city began targeting real hotspots instead of guessing."]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ROUND DIAGNOSIS FALLBACK POOL
// Used when a specific card or tile does not produce enough explanation text.
// ─────────────────────────────────────────────────────────────────────────────

const ROUND_DIAGNOSIS_FALLBACK = [
  "Air worsened because traffic edges jammed near dense housing.",
  "Heat worsened because water stress remained high around public places.",
  "Hospital resilience dropped because power backup was missing.",
  "Waste pressure rose because landfill capacity was unmanaged.",
  "Mobility stress worsened because public transport remained under-integrated.",
  "Dense housing intensified night heat because cooling support was missing.",
  "Dirty backup power kept services alive while driving hazard exposure upward.",
  "The city absorbed growth, but service systems did not keep pace."
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER LOOKUP FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getTileByName(name) {
  return LAND_TILE_SYSTEM.find(t => t.name === name) || null;
}

function getAirProblemCardByName(name) {
  return AIR_POLLUTION_CARDS.find(c => c.name === name) || null;
}

function getAirSolutionCardByName(name) {
  return AIR_SOLUTION_CARDS.find(c => c.name === name) || null;
}

function getHeatProblemCardByName(name) {
  return HEAT_PROBLEM_CARDS.find(c => c.name === name) || null;
}

function getHeatSolutionCardByName(name) {
  return HEAT_SOLUTION_CARDS.find(c => c.name === name) || null;
}

/**
 * Returns the diagnosis text for a played problem card.
 * Falls back to a random ROUND_DIAGNOSIS_FALLBACK entry.
 * @param {string} headline - The card headline from POLLUTION_CARDS or HEAT_CARDS
 * @param {"air"|"heat"} mode
 * @returns {string}
 */
function getCardDiagnosis(headline, mode) {
  const pool = mode === "heat" ? HEAT_PROBLEM_CARDS : AIR_POLLUTION_CARDS;
  const card = pool.find(c => c.name === headline);
  if (card && card.diagnosis && card.diagnosis.length > 0) {
    return card.diagnosis[0];
  }
  return ROUND_DIAGNOSIS_FALLBACK[Math.floor(Math.random() * ROUND_DIAGNOSIS_FALLBACK.length)];
}

/**
 * Returns the diagnosis text for a played solution card.
 * Falls back to a random ROUND_DIAGNOSIS_FALLBACK entry.
 * @param {string} headline - The card headline from SOLUTION_CARDS or HEAT_SOLUTIONS
 * @param {"air"|"heat"} mode
 * @returns {string}
 */
function getSolutionDiagnosis(headline, mode) {
  const pool = mode === "heat" ? HEAT_SOLUTION_CARDS : AIR_SOLUTION_CARDS;
  const card = pool.find(c => c.name === headline);
  if (card && card.diagnosis && card.diagnosis.length > 0) {
    return card.diagnosis[0];
  }
  return ROUND_DIAGNOSIS_FALLBACK[Math.floor(Math.random() * ROUND_DIAGNOSIS_FALLBACK.length)];
}

/**
 * Computes the total round budget consumed by the current city.
 * Returns { totalMaintenance, totalRevenue, netBudgetImpact }
 * @param {Array} cityTiles - state.city tiles
 * @returns {{ totalMaintenance: number, totalRevenue: number, netBudgetImpact: number }}
 */
function computeCityEconomics(cityTiles) {
  let totalMaintenance = 0;
  let totalRevenue = 0;
  cityTiles.forEach(tile => {
    const def = getTileByName(tile.name);
    if (!def) return;
    totalMaintenance += def.maintenance_cost;
    totalRevenue += def.revenue;
  });
  return {
    totalMaintenance,
    totalRevenue,
    netBudgetImpact: totalRevenue - totalMaintenance
  };
}

/**
 * Computes aggregate CITY_NEEDS demand and supply from all placed tiles.
 * Returns a snapshot of { waste, housing, power, health, mobility } as
 * { demand: {...}, supply: {...} } objects.
 * @param {Array} cityTiles - state.city tiles
 * @returns {{ demand: object, supply: object }}
 */
function computeCityNeeds(cityTiles) {
  const demand = { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 };
  const supply = { waste: 0, housing: 0, power: 0, health: 0, mobility: 0 };
  cityTiles.forEach(tile => {
    const def = getTileByName(tile.name);
    if (!def || !def.needs) return;
    Object.keys(demand).forEach(k => {
      demand[k] += (def.needs.demand[k] || 0);
      supply[k] += (def.needs.supply[k] || 0);
    });
  });
  return { demand, supply };
}
