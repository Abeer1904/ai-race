// road-engine.js
// Every placed tile occupies one grid cell on a 7×7 board.
// Each of its four sides has a road edge: open | busy | jammed.
// Traffic pressure is derived from tile trip-generation demand and neighbour demand.
// Jammed edges raise AQI (air mode) or heat burden (heat mode).

// ── Trip generation demand per tile name (0 = low, 1 = medium, 2 = high, 3 = very high) ──
const TRAFFIC_DEMAND = {
  "GPO":                      0,
  "Forest":                   0,
  "Public Park":              0,
  "Barren Land":              0,
  "Agricultural Land":        0,
  "Rural Village":            1,
  "Urban Village":            1,
  "Slums":                    1,
  "Affordable Housing":       2,
  "High-rise Housing":        3,
  "Sewage Treatment Plant":   0,
  "Residential Landfill":     1,
  "City Landfill":            2,
  "Thermal Power Plant":      2,
  "Methane Power Plant":      1,
  "Solar Power Plant":        0,
  "DG Set":                   0,
  "EV Charging Station":      1,
  "CNG Station":              1,
  "Petrol Pump":              2,
  "Bus Stop":                 2,
  "Metro":                    3,
  "Railway":                  3,
  "Airport":                  3,
  "School":                   2,
  "College":                  2,
  "Hospital":                 2,
  "Govt Office":              2,
  "Pvt Office":               3,
  "Mall":                     3,
  "Weekly Market":            2,
  "Mixed Market":             2,
  "Hotel":                    3,
  "SSI":                      2,
  "Large-scale Industry":     3,
  "Construction":             2
};

// ── Board geometry helpers ──

// BOARD is 7 × 7 (indices 0–48). Row = Math.floor(idx / 7), Col = idx % 7.
function cellRowCol(idx) {
  return { row: Math.floor(idx / 7), col: idx % 7 };
}

function cellIndex(row, col) {
  if (row < 0 || row > 6 || col < 0 || col > 6) return null;
  return row * 7 + col;
}

// Returns { top, right, bottom, left } cell indices (null if off-board).
function orthogonalIndices(idx) {
  const { row, col } = cellRowCol(idx);
  return {
    top:    cellIndex(row - 1, col),
    right:  cellIndex(row, col + 1),
    bottom: cellIndex(row + 1, col),
    left:   cellIndex(row, col - 1)
  };
}

// ── Edge state derivation ──
// combined demand of tile + neighbour tile across a shared edge
// 0–1 → open, 2–3 → busy, 4+ → jammed

function edgeTrafficState(demandA, demandB) {
  const combined = demandA + demandB;
  if (combined <= 1) return "open";
  if (combined <= 3) return "busy";
  return "jammed";
}

// ── Build grid lookup: cellIndex → tile name ──
// cityTiles: state.city array; BOARD_SLOTS: array of cell indices per placement order

function buildGridLookup(cityTiles, boardSlots) {
  const grid = {}; // cellIndex → tile name
  cityTiles.forEach((tile, i) => {
    const idx = boardSlots[i] ?? boardSlots[boardSlots.length - 1];
    grid[idx] = tile.name;
  });
  return grid;
}

// ── Compute edges for a single cell given the full grid ──

function computeEdgesForCell(cellIdx, grid) {
  const tileName = grid[cellIdx];
  if (!tileName) return null;
  const demand = TRAFFIC_DEMAND[tileName] ?? 1;
  const neighbors = orthogonalIndices(cellIdx);
  const edges = {};
  for (const [side, neighborIdx] of Object.entries(neighbors)) {
    const neighborName = neighborIdx !== null ? grid[neighborIdx] : null;
    const neighborDemand = neighborName ? (TRAFFIC_DEMAND[neighborName] ?? 1) : 0;
    edges[side] = {
      road: true,
      traffic: edgeTrafficState(demand, neighborDemand)
    };
  }
  return edges;
}

// ── Recompute all city tile edges, storing result on each tile object ──
// cityTiles: state.city array
// boardSlots: BOARD_SLOTS constant from fix-it.js

function recomputeAllEdges(cityTiles, boardSlots) {
  const grid = buildGridLookup(cityTiles, boardSlots);
  cityTiles.forEach((tile, i) => {
    const cellIdx = boardSlots[i] ?? boardSlots[boardSlots.length - 1];
    tile.edges = computeEdgesForCell(cellIdx, grid) || {
      top:    { road: true, traffic: "open" },
      right:  { road: true, traffic: "open" },
      bottom: { road: true, traffic: "open" },
      left:   { road: true, traffic: "open" }
    };
  });
}

// ── Traffic pressure summary for the whole city ──
// Returns { jamCount, busyCount, openCount, aqiContribution, heatContribution }
// open = 0, busy = +0.5, jammed = +1 (accumulated, rounded at call site)

function calculateTrafficPressure(cityTiles, boardSlots, mode) {
  // Recompute fresh edge set (non-mutating version)
  const grid = buildGridLookup(cityTiles, boardSlots);
  let jamCount = 0, busyCount = 0, openCount = 0;

  // Count each shared edge once: only process right and bottom to avoid double-counting
  cityTiles.forEach((tile, i) => {
    const cellIdx = boardSlots[i] ?? boardSlots[boardSlots.length - 1];
    const demand = TRAFFIC_DEMAND[tile.name] ?? 1;
    const { right, bottom } = orthogonalIndices(cellIdx);

    for (const neighborIdx of [right, bottom]) {
      if (neighborIdx === null) continue;
      const neighborName = grid[neighborIdx];
      if (!neighborName) continue;
      const neighborDemand = TRAFFIC_DEMAND[neighborName] ?? 1;
      const edgeState = edgeTrafficState(demand, neighborDemand);
      if (edgeState === "jammed") jamCount++;
      else if (edgeState === "busy") busyCount++;
      else openCount++;
    }
  });

  const raw = busyCount * 0.5 + jamCount * 1.0;
  return {
    jamCount,
    busyCount,
    openCount,
    raw,
    rounded: Math.round(raw),
    aqiContribution:  mode === "air"  ? raw : 0,
    heatContribution: mode === "heat" ? raw : 0
  };
}

// ── Edge label helpers for UI ──

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

// ── Per-tile traffic note for UI ──
// Returns a short string like "Road: busy on 2 sides." or "" if all open.

function tileTrafficNote(tile) {
  if (!tile.edges) return "";
  const counts = { open: 0, busy: 0, jammed: 0 };
  Object.values(tile.edges).forEach(e => counts[e.traffic]++);
  if (counts.jammed > 0 && counts.busy > 0) return `Road: jammed on ${counts.jammed}, busy on ${counts.busy} sides.`;
  if (counts.jammed > 0) return `Road: jammed on ${counts.jammed} side${counts.jammed > 1 ? "s" : ""}.`;
  if (counts.busy > 0)   return `Road: busy on ${counts.busy} side${counts.busy > 1 ? "s" : ""}.`;
  return "";
}
