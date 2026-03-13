// road-engine.js
// Traffic model v2: trip generation minus transit absorption, with transit cluster bonuses.
// Zone system: inner_city / outer_city / outskirts controls where tiles can be placed.
// Jammed city-level traffic raises AQI (air mode) or heat burden (heat mode).

// ── City zones: board slot indices ──────────────────────────────────────────
const CITY_ZONES = {
  inner_city: [24, 17, 18, 25, 32, 31, 30],
  outer_city:  [10, 11, 12, 19, 20, 26, 27, 33, 34, 39, 38, 37],
  outskirts:   [3, 4, 5, 9, 13, 16, 21, 23, 29, 35, 40, 41, 45, 46]
};

// ── Starting tile blacklist ──────────────────────────────────────────────────
const STARTING_TILE_BLACKLIST = [
  "Airport",
  "Large-scale Industry",
  "SSI",
  "City Landfill",
  "Residential Landfill",
  "Thermal Power Plant",
  "Construction"
];

// ── Zone placement rules per tile ───────────────────────────────────────────
const ZONE_RULES = {
  "Airport":              { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city", "outer_city"], cannot_be_starting_tile: true  },
  "Large-scale Industry": { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city"],               cannot_be_starting_tile: true  },
  "SSI":                  { allowed_zones: ["outer_city", "outskirts"],   banned_zones: ["inner_city"],               cannot_be_starting_tile: true  },
  "City Landfill":        { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city", "outer_city"], cannot_be_starting_tile: true  },
  "Residential Landfill": { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city"],               cannot_be_starting_tile: true  },
  "Thermal Power Plant":  { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city", "outer_city"], cannot_be_starting_tile: true  },
  "Construction":         { allowed_zones: ["outer_city", "outskirts"],   banned_zones: [],                           cannot_be_starting_tile: true  },
  "Hotel":                { allowed_zones: ["outer_city", "inner_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Metro":                { allowed_zones: ["inner_city", "outer_city"],  banned_zones: ["outskirts"],                cannot_be_starting_tile: false },
  "Bus Stop":             { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "School":               { allowed_zones: ["inner_city", "outer_city"],  banned_zones: ["outskirts"],                cannot_be_starting_tile: false },
  "College":              { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Hospital":             { allowed_zones: ["inner_city", "outer_city"],  banned_zones: ["outskirts"],                cannot_be_starting_tile: false },
  "High-rise Housing":    { allowed_zones: ["inner_city", "outer_city"],  banned_zones: ["outskirts"],                cannot_be_starting_tile: false },
  "Affordable Housing":   { allowed_zones: ["outer_city", "inner_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Forest":               { allowed_zones: ["outer_city", "outskirts"],   banned_zones: [],                           cannot_be_starting_tile: false },
  "Public Park":          { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Weekly Market":        { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Mixed Market":         { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Pvt. Office":          { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Govt. Office":         { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Solar Power Plant":    { allowed_zones: ["outer_city", "outskirts"],   banned_zones: [],                           cannot_be_starting_tile: false },
  "Methane Power Plant":  { allowed_zones: ["outskirts", "outer_city"],   banned_zones: ["inner_city"],               cannot_be_starting_tile: false },
  "Petrol Pump":          { allowed_zones: ["outer_city", "outskirts"],   banned_zones: ["inner_city"],               cannot_be_starting_tile: false },
  "CNG Station":          { allowed_zones: ["outer_city", "outskirts"],   banned_zones: [],                           cannot_be_starting_tile: false },
  "EV Charging Station":  { allowed_zones: ["inner_city", "outer_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Slums":                { allowed_zones: ["outer_city", "inner_city"],  banned_zones: [],                           cannot_be_starting_tile: false },
  "Urban Village":        { allowed_zones: ["outer_city"],                banned_zones: ["inner_city", "outskirts"],  cannot_be_starting_tile: false },
  "Rural Village":        { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city"],               cannot_be_starting_tile: false },
  "Agricultural Land":    { allowed_zones: ["outskirts"],                 banned_zones: ["inner_city"],               cannot_be_starting_tile: false },
  "Barren Land":          { allowed_zones: ["outer_city", "outskirts"],   banned_zones: [],                           cannot_be_starting_tile: false }
};

// ── Traffic profiles: trip generation and transit absorption per tile ────────
const TRAFFIC_PROFILES = {
  "Airport":                { generates: 4, absorbs: 0 },
  "Large-scale Industry":   { generates: 3, absorbs: 0 },
  "SSI":                    { generates: 2, absorbs: 0 },
  "Hotel":                  { generates: 2, absorbs: 0 },
  "Mall":                   { generates: 3, absorbs: 0 },
  "Weekly Market":          { generates: 2, absorbs: 0 },
  "Mixed Market":           { generates: 2, absorbs: 0 },
  "Pvt. Office":            { generates: 2, absorbs: 0 },
  "Pvt Office":             { generates: 2, absorbs: 0 },
  "Govt. Office":           { generates: 1, absorbs: 0 },
  "Govt Office":            { generates: 1, absorbs: 0 },
  "School":                 { generates: 2, absorbs: 0 },
  "College":                { generates: 3, absorbs: 0 },
  "Hospital":               { generates: 2, absorbs: 0 },
  "High-rise Housing":      { generates: 3, absorbs: 0 },
  "Affordable Housing":     { generates: 2, absorbs: 0 },
  "Slums":                  { generates: 1, absorbs: 0 },
  "Urban Village":          { generates: 1, absorbs: 0 },
  "Rural Village":          { generates: 1, absorbs: 0 },
  "Metro":                  { generates: 0, absorbs: 4 },
  "Bus Stop":               { generates: 0, absorbs: 2 },
  "Railway":                { generates: 0, absorbs: 3 },
  "Forest":                 { generates: 0, absorbs: 0 },
  "Public Park":            { generates: 0, absorbs: 0 },
  "Solar Power Plant":      { generates: 0, absorbs: 0 },
  "Methane Power Plant":    { generates: 1, absorbs: 0 },
  "Thermal Power Plant":    { generates: 2, absorbs: 0 },
  "City Landfill":          { generates: 1, absorbs: 0 },
  "Residential Landfill":   { generates: 1, absorbs: 0 },
  "Sewage Treatment Plant": { generates: 1, absorbs: 0 },
  "Petrol Pump":            { generates: 1, absorbs: 0 },
  "CNG Station":            { generates: 1, absorbs: 0 },
  "EV Charging Station":    { generates: 0, absorbs: 1 },
  "Construction":           { generates: 2, absorbs: 0 },
  "Agricultural Land":      { generates: 0, absorbs: 0 },
  "Barren Land":            { generates: 0, absorbs: 0 },
  "GPO":                    { generates: 0, absorbs: 0 },
  "DG Set":                 { generates: 0, absorbs: 0 }
};

// ── Zone helpers ─────────────────────────────────────────────────────────────

function getZoneForSlot(slotIndex) {
  if (CITY_ZONES.inner_city.includes(slotIndex)) return "inner_city";
  if (CITY_ZONES.outer_city.includes(slotIndex)) return "outer_city";
  if (CITY_ZONES.outskirts.includes(slotIndex))  return "outskirts";
  return "outer_city"; // default for unmapped slots
}

function isAllowedStartingTile(tileName) {
  return !STARTING_TILE_BLACKLIST.includes(tileName);
}

// ── Zone placement validation ─────────────────────────────────────────────────

function validateZonePlacement(tileName, slotIndex) {
  const zone = getZoneForSlot(slotIndex);
  const rule = ZONE_RULES[tileName];

  if (!rule) {
    return { allowed: true, zone, reason: "" };
  }

  if (rule.banned_zones.includes(zone)) {
    return {
      allowed: false,
      zone,
      reason: `${tileName} cannot be placed in the ${zone.replace(/_/g, " ")}.`
    };
  }

  if (!rule.allowed_zones.includes(zone)) {
    return {
      allowed: false,
      zone,
      reason: `${tileName} is not allowed in the ${zone.replace(/_/g, " ")}.`
    };
  }

  return { allowed: true, zone, reason: "" };
}

// ── Transit cluster bonus ─────────────────────────────────────────────────────
// Returns extra absorption points when transit tiles complement each other.

function getTransitClusterBonus(cityTiles) {
  const names = cityTiles.map(t => t.name);
  let bonus = 0;

  if (names.includes("Metro")    && names.includes("Bus Stop"))          bonus += 2;
  if (names.includes("Metro")    && names.includes("College"))           bonus += 1;
  if (names.includes("Metro")    && names.includes("High-rise Housing")) bonus += 1;
  if (names.includes("Metro")    && names.includes("Affordable Housing"))bonus += 1;
  if (names.includes("Bus Stop") && names.includes("School"))            bonus += 1;
  if (names.includes("Bus Stop") && names.includes("Weekly Market"))     bonus += 1;
  if (names.includes("Railway")  && names.includes("Bus Stop"))          bonus += 1;

  return bonus;
}

// ── City-level traffic pressure (v2) ─────────────────────────────────────────
// Returns { generated, absorbed, clusterBonus, netTraffic, state }

function calculateTrafficPressure(cityTiles) {
  const tiles = cityTiles.filter(t => t.name !== "GPO");

  const totalGenerated = tiles.reduce((sum, tile) => {
    const profile = TRAFFIC_PROFILES[tile.name] || { generates: 0, absorbs: 0 };
    return sum + profile.generates;
  }, 0);

  const totalAbsorbed = tiles.reduce((sum, tile) => {
    const profile = TRAFFIC_PROFILES[tile.name] || { generates: 0, absorbs: 0 };
    return sum + profile.absorbs;
  }, 0);

  const clusterBonus = getTransitClusterBonus(tiles);
  const netTraffic   = Math.max(0, totalGenerated - totalAbsorbed - clusterBonus);

  return {
    generated:    totalGenerated,
    absorbed:     totalAbsorbed,
    clusterBonus,
    netTraffic,
    // backwards-compat fields used by old render code
    jamCount:     netTraffic > 7 ? 1 : 0,
    busyCount:    (netTraffic > 3 && netTraffic <= 7) ? 1 : 0,
    openCount:    netTraffic <= 3 ? 1 : 0,
    raw:          netTraffic,
    rounded:      Math.round(netTraffic),
    state:        netTraffic <= 3 ? "open" : netTraffic <= 7 ? "busy" : "jammed"
  };
}

// ── Apply city traffic effects to state ──────────────────────────────────────

function applyTrafficEffects(state) {
  const traffic = calculateTrafficPressure(state.city);
  state.trafficPressure = traffic;

  if (traffic.state === "busy") {
    state.aqi = Math.min(12, state.aqi + 1);
    addLog("Traffic is busy. AQI rose because road edges are under pressure.");
  }

  if (traffic.state === "jammed") {
    state.aqi = Math.min(12, state.aqi + 2);
    state.pressures.electricity = Math.min(100, state.pressures.electricity + 1);
    addLog("Traffic is jammed. AQI rose sharply because mobility demand exceeded transit absorption.");
  }

  if (state.hazard === "heat" && traffic.state !== "open") {
    state.aqi = Math.min(12, state.aqi + 1);
    addLog("Traffic increased heat exposure along hard-surface corridors.");
  }

  return traffic;
}

// ── Transit diagnosis ─────────────────────────────────────────────────────────

function getTransitDiagnosis(cityTiles) {
  const names = cityTiles.map(t => t.name);

  if (names.includes("Metro") && names.includes("Bus Stop") && names.includes("College")) {
    return "Transit cluster active: Metro + Bus Stop + College reduced traffic pressure.";
  }
  if (names.includes("Metro") && !names.includes("Bus Stop")) {
    return "Metro underused: missing feeder bus access.";
  }
  if (names.includes("Bus Stop") && !names.includes("Metro") && names.includes("High-rise Housing")) {
    return "Bus-led mobility is carrying local trips, but high-capacity transit is still missing.";
  }
  return "";
}

// ── Board geometry helpers ────────────────────────────────────────────────────

function cellRowCol(idx) {
  return { row: Math.floor(idx / 7), col: idx % 7 };
}

function cellIndex(row, col) {
  if (row < 0 || row > 6 || col < 0 || col > 6) return null;
  return row * 7 + col;
}

function orthogonalIndices(idx) {
  const { row, col } = cellRowCol(idx);
  return {
    top:    cellIndex(row - 1, col),
    right:  cellIndex(row, col + 1),
    bottom: cellIndex(row + 1, col),
    left:   cellIndex(row, col - 1)
  };
}

// ── Per-edge traffic state (used for board-cell visual edges) ─────────────────
// Derives each edge state from the city-level traffic.state so visual edges
// stay consistent with the new aggregate model.

function buildGridLookup(cityTiles, boardSlots) {
  const grid = {};
  cityTiles.forEach((tile, i) => {
    const idx = boardSlots[i] ?? boardSlots[boardSlots.length - 1];
    grid[idx] = tile.name;
  });
  return grid;
}

function computeEdgesForCell(cellIdx, grid, cityTrafficState) {
  const tileName = grid[cellIdx];
  if (!tileName) return null;
  const neighbors = orthogonalIndices(cellIdx);
  const edges = {};
  for (const [side, neighborIdx] of Object.entries(neighbors)) {
    const hasNeighbor = neighborIdx !== null && grid[neighborIdx];
    // Edge is only drawn when there is an adjacent occupied cell.
    // State mirrors city-level traffic so visual and systemic are coherent.
    edges[side] = {
      road:    !!hasNeighbor,
      traffic: hasNeighbor ? cityTrafficState : "open"
    };
  }
  return edges;
}

function recomputeAllEdges(cityTiles, boardSlots) {
  const cityTrafficState = calculateTrafficPressure(cityTiles).state;
  const grid = buildGridLookup(cityTiles, boardSlots);
  cityTiles.forEach((tile, i) => {
    const cellIdx = boardSlots[i] ?? boardSlots[boardSlots.length - 1];
    tile.edges = computeEdgesForCell(cellIdx, grid, cityTrafficState) || {
      top:    { road: true, traffic: "open" },
      right:  { road: true, traffic: "open" },
      bottom: { road: true, traffic: "open" },
      left:   { road: true, traffic: "open" }
    };
  });
}

// ── Edge label helpers for UI ─────────────────────────────────────────────────

function trafficLabel(edgeState) {
  if (edgeState === "jammed") return "Jammed";
  if (edgeState === "busy")   return "Busy";
  return "Open";
}

function worstEdge(edges) {
  if (!edges) return "open";
  const vals = Object.values(edges).map(e => e.traffic);
  if (vals.includes("jammed")) return "jammed";
  if (vals.includes("busy"))   return "busy";
  return "open";
}

// ── Per-tile traffic note for UI ──────────────────────────────────────────────

function tileTrafficNote(tile) {
  if (!tile.edges) return "";
  const counts = { open: 0, busy: 0, jammed: 0 };
  Object.values(tile.edges).forEach(e => counts[e.traffic]++);
  if (counts.jammed > 0 && counts.busy > 0) return `Road: jammed on ${counts.jammed}, busy on ${counts.busy} sides.`;
  if (counts.jammed > 0) return `Road: jammed on ${counts.jammed} side${counts.jammed > 1 ? "s" : ""}.`;
  if (counts.busy > 0)   return `Road: busy on ${counts.busy} side${counts.busy > 1 ? "s" : ""}.`;
  return "";
}
