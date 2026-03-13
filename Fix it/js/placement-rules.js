// placement-rules.js
// Adjacency constraint system for Fix It.
// Three levels: forbidden (hard block), discouraged (soft warning), preferred (bonus cue).
// Only orthogonal adjacency (top, right, bottom, left) is evaluated.

const PLACEMENT_RULES = {
  "School": {
    cannot_touch:    ["Airport", "Large-scale Industry", "Thermal Power Plant", "City Landfill"],
    should_not_touch:["Construction", "Hotel", "Mall", "Petrol Pump"],
    prefers_near:    ["Affordable Housing", "Bus Stop", "Public Park", "Forest"]
  },
  "Hospital": {
    cannot_touch:    ["Airport", "Large-scale Industry", "Thermal Power Plant", "City Landfill"],
    should_not_touch:["Construction", "Petrol Pump"],
    prefers_near:    ["Bus Stop", "Metro", "Govt Office"]
  },
  "Airport": {
    cannot_touch:    ["School", "Hospital", "Forest", "Public Park", "Slums", "Affordable Housing"],
    should_not_touch:["High-rise Housing", "College"],
    prefers_near:    ["Hotel", "Pvt Office", "Railway", "Bus Stop"]
  },
  "Thermal Power Plant": {
    cannot_touch:    ["School", "Hospital", "Forest", "Public Park", "Slums"],
    should_not_touch:["Affordable Housing", "High-rise Housing", "Urban Village"],
    prefers_near:    ["Large-scale Industry", "SSI"]
  },
  "Large-scale Industry": {
    cannot_touch:    ["School", "Hospital", "Forest", "Public Park"],
    should_not_touch:["Affordable Housing", "Slums", "High-rise Housing"],
    prefers_near:    ["Thermal Power Plant", "Railway", "SSI"]
  },
  "SSI": {
    cannot_touch:    ["Hospital"],
    should_not_touch:["School", "Affordable Housing"],
    prefers_near:    ["Weekly Market", "Mixed Market", "Bus Stop"]
  },
  "City Landfill": {
    cannot_touch:    ["School", "Hospital", "Forest", "Public Park"],
    should_not_touch:["Affordable Housing", "Slums", "High-rise Housing", "Hotel"],
    prefers_near:    ["Methane Power Plant", "Sewage Treatment Plant"]
  },
  "Residential Landfill": {
    cannot_touch:    ["Hospital", "School"],
    should_not_touch:["Affordable Housing", "Slums", "Public Park"],
    prefers_near:    ["Sewage Treatment Plant", "City Landfill"]
  },
  "High-rise Housing": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill", "Large-scale Industry"],
    should_not_touch:["Airport", "Construction"],
    prefers_near:    ["Metro", "Bus Stop", "School", "Hospital"]
  },
  "Slums": {
    cannot_touch:    ["Airport", "Thermal Power Plant", "City Landfill"],
    should_not_touch:["Large-scale Industry"],
    prefers_near:    ["Bus Stop", "Weekly Market", "Mixed Market", "School"]
  },
  "Affordable Housing": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill", "Large-scale Industry"],
    should_not_touch:["Airport", "Construction"],
    prefers_near:    ["Bus Stop", "School", "Hospital", "Weekly Market", "Mixed Market"]
  },
  "Hotel": {
    cannot_touch:    ["City Landfill", "Thermal Power Plant"],
    should_not_touch:["School", "Hospital", "Slums"],
    prefers_near:    ["Airport", "Metro", "Weekly Market", "Mixed Market", "Pvt Office"]
  },
  "Mall": {
    cannot_touch:    ["Forest"],
    should_not_touch:["School", "Hospital"],
    prefers_near:    ["Metro", "Bus Stop", "Hotel", "Pvt Office"]
  },
  "Weekly Market": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill"],
    should_not_touch:["Airport"],
    prefers_near:    ["Affordable Housing", "Slums", "Bus Stop", "Urban Village"]
  },
  "Mixed Market": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill"],
    should_not_touch:["Airport"],
    prefers_near:    ["Affordable Housing", "Slums", "Bus Stop", "Urban Village"]
  },
  "Forest": {
    cannot_touch:    ["Airport", "Thermal Power Plant", "City Landfill", "Large-scale Industry"],
    should_not_touch:["Mall", "Hotel", "Construction"],
    prefers_near:    ["Public Park", "School", "Agricultural Land"]
  },
  "Public Park": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill", "Large-scale Industry"],
    should_not_touch:["Airport"],
    prefers_near:    ["School", "Affordable Housing", "Bus Stop", "Forest"]
  },
  "College": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill"],
    should_not_touch:["Airport", "Large-scale Industry"],
    prefers_near:    ["Metro", "Bus Stop", "Pvt Office"]
  },
  "Govt Office": {
    cannot_touch:    ["City Landfill"],
    should_not_touch:["Thermal Power Plant", "Large-scale Industry"],
    prefers_near:    ["Hospital", "Bus Stop", "School"]
  },
  "Pvt Office": {
    cannot_touch:    ["City Landfill"],
    should_not_touch:["School", "Hospital"],
    prefers_near:    ["Metro", "Bus Stop", "Hotel", "Mall"]
  },
  "Solar Power Plant": {
    cannot_touch:    [],
    should_not_touch:[],
    prefers_near:    ["Hospital", "Pvt Office", "Hotel", "EV Charging Station"]
  },
  "Methane Power Plant": {
    cannot_touch:    ["School", "Hospital"],
    should_not_touch:["Affordable Housing"],
    prefers_near:    ["City Landfill", "Residential Landfill", "Sewage Treatment Plant"]
  },
  "Petrol Pump": {
    cannot_touch:    ["School", "Hospital", "Public Park"],
    should_not_touch:["Affordable Housing", "Slums"],
    prefers_near:    ["Mall", "Hotel", "Pvt Office"]
  },
  "EV Charging Station": {
    cannot_touch:    [],
    should_not_touch:[],
    prefers_near:    ["Petrol Pump", "Metro", "Bus Stop", "Pvt Office", "Mall"]
  },
  "CNG Station": {
    cannot_touch:    ["School", "Hospital"],
    should_not_touch:["Public Park"],
    prefers_near:    ["Bus Stop", "Metro", "Mixed Market"]
  },
  "Construction": {
    cannot_touch:    ["Hospital"],
    should_not_touch:["School", "Affordable Housing", "Public Park"],
    prefers_near:    ["SSI", "Large-scale Industry", "Pvt Office"]
  },
  "Agricultural Land": {
    cannot_touch:    ["Airport", "Large-scale Industry", "City Landfill"],
    should_not_touch:["Mall", "Hotel"],
    prefers_near:    ["Forest", "Rural Village", "Sewage Treatment Plant"]
  },
  "Urban Village": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill"],
    should_not_touch:["Airport"],
    prefers_near:    ["Bus Stop", "Weekly Market", "Mixed Market", "School"]
  },
  "Rural Village": {
    cannot_touch:    ["Thermal Power Plant", "City Landfill", "Airport"],
    should_not_touch:["Large-scale Industry"],
    prefers_near:    ["Agricultural Land", "Bus Stop", "Forest"]
  },
  "Barren Land": {
    cannot_touch:    [],
    should_not_touch:[],
    prefers_near:    []
  },
  "Sewage Treatment Plant": {
    cannot_touch:    [],
    should_not_touch:["School", "Hospital"],
    prefers_near:    ["City Landfill", "Residential Landfill", "Methane Power Plant"]
  },
  "Railway": {
    cannot_touch:    [],
    should_not_touch:["School", "Hospital", "Slums"],
    prefers_near:    ["Hotel", "Pvt Office", "Airport", "Large-scale Industry"]
  },
  "Bus Stop": {
    cannot_touch:    [],
    should_not_touch:[],
    prefers_near:    ["School", "Hospital", "Affordable Housing", "Slums", "Metro"]
  },
  "Metro": {
    cannot_touch:    [],
    should_not_touch:[],
    prefers_near:    ["School", "Hospital", "Pvt Office", "Mall", "High-rise Housing"]
  },
  "DG Set": {
    cannot_touch:    ["Hospital", "School"],
    should_not_touch:["Public Park", "Forest"],
    prefers_near:    ["SSI", "Large-scale Industry", "Pvt Office"]
  }
};

// ── Get orthogonal neighbour tile names from current city grid ──
// cityTiles: state.city array
// targetSlotIndex: the BOARD_SLOTS position of the target cell (city.length at placement time)
// boardSlots: BOARD_SLOTS constant

function getOrthogonalNeighbors(targetSlotIndex, cityTiles, boardSlots) {
  const targetCellIdx = boardSlots[targetSlotIndex];
  if (targetCellIdx === undefined) return [];

  const row = Math.floor(targetCellIdx / 7);
  const col = targetCellIdx % 7;

  const neighborCells = [
    row > 0 ? (row - 1) * 7 + col : null,
    col < 6 ? row * 7 + (col + 1) : null,
    row < 6 ? (row + 1) * 7 + col : null,
    col > 0 ? row * 7 + (col - 1) : null
  ];

  const neighbors = [];
  cityTiles.forEach((tile, i) => {
    const cellIdx = boardSlots[i];
    if (neighborCells.includes(cellIdx)) {
      neighbors.push({ tile: tile.name, cellIdx });
    }
  });
  return neighbors;
}

// ── Core placement validator ──
// tileName: string
// targetSlotIndex: integer (state.city.length at the moment of evaluation)
// cityTiles: state.city array
// boardSlots: BOARD_SLOTS constant

function validatePlacement(tileName, targetSlotIndex, cityTiles, boardSlots) {
  // Zone check first — hard block if tile is not allowed in this zone
  const targetCellIdx = boardSlots[targetSlotIndex];
  if (targetCellIdx !== undefined) {
    const zoneCheck = validateZonePlacement(tileName, targetCellIdx);
    if (!zoneCheck.allowed) {
      return {
        allowed: false,
        hardConflicts: [],
        softConflicts: [],
        preferred: [],
        penalty: 0,
        bonus: 0,
        reason: zoneCheck.reason,
        zone: zoneCheck.zone
      };
    }
  }

  const rule = PLACEMENT_RULES[tileName];
  if (!rule) {
    return { allowed: true, hardConflicts: [], softConflicts: [], preferred: [], penalty: 0, bonus: 0, reason: "", zone: targetCellIdx !== undefined ? getZoneForSlot(targetCellIdx) : "outer_city" };
  }

  const neighbors = getOrthogonalNeighbors(targetSlotIndex, cityTiles, boardSlots);

  const hardConflicts = neighbors.filter(n => rule.cannot_touch.includes(n.tile));
  const softConflicts = neighbors.filter(n => rule.should_not_touch.includes(n.tile));
  const preferred     = neighbors.filter(n => rule.prefers_near.includes(n.tile));

  return {
    allowed:       hardConflicts.length === 0,
    hardConflicts,
    softConflicts,
    preferred,
    penalty:       softConflicts.length,
    bonus:         preferred.length,
    reason:        hardConflicts.length ? `${tileName} cannot be placed next to ${hardConflicts.map(n => n.tile).join(", ")}.` : "",
    zone:          targetCellIdx !== undefined ? getZoneForSlot(targetCellIdx) : "outer_city"
  };
}

// ── Human-readable placement note for UI ──

function placementNote(result, tileName) {
  if (!result.allowed) {
    const names = result.hardConflicts.map(n => n.tile).join(", ");
    return { level: "blocked", text: `Cannot place next to: ${names}.` };
  }
  if (result.softConflicts.length > 0 && result.preferred.length > 0) {
    const warns = result.softConflicts.map(n => n.tile).join(", ");
    const bonuses = result.preferred.map(n => n.tile).join(", ");
    return { level: "mixed", text: `Near ${bonuses} (good). Discouraged next to ${warns}.` };
  }
  if (result.softConflicts.length > 0) {
    const names = result.softConflicts.map(n => n.tile).join(", ");
    return { level: "warning", text: `Discouraged next to: ${names}.` };
  }
  if (result.preferred.length > 0) {
    const names = result.preferred.map(n => n.tile).join(", ");
    return { level: "bonus", text: `Well placed near: ${names}.` };
  }
  return { level: "neutral", text: "" };
}
