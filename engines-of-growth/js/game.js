/* ═══════════════════════════════════════════════════════════
   Engines of Growth — Game Logic
   civic.games · Civic Games Lab
   ═══════════════════════════════════════════════════════════ */

/* ── Constants ──────────────────────────────────────────── */

const TOTAL_ROUNDS   = 5;
const POLICIES_PER_ROUND = 2;
const MAX_BAR        = 15;

const SECTORS = ['Manufacturing', 'Agro-processing', 'Mixed', 'Mixed', 'Services'];

const STARTING_BARS = {
  finance:    8,
  workforce:  4,
  infra:      3,
  innovation: 3,
  entrep:     4,
};

const PILLAR_LABELS = {
  finance:    'Finance',
  workforce:  'Workforce',
  infra:      'Infra',
  innovation: 'Innov.',
  entrep:     'Entrep.',
};

const PILLAR_COLOURS = {
  finance:    '#C87A20',
  workforce:  '#4A8C72',
  infra:      '#4D696D',
  innovation: '#7B6FB0',
  entrep:     '#B85C3A',
};

/* Maintenance cost per enterprise stage per round */
const MAINTENANCE = { micro: 2, small: 3, medium: 4 };

/* ── Suite definitions ────────────────────────────────────── */

const SUITES = {
  credit: {
    name: 'Credit Ladder',
    pillar: 'finance',
    bonus: { finance: 3 },
    stages: ['credit_s1', 'credit_s2', 'credit_s3'],
  },
  skills: {
    name: 'Skills Pipeline',
    pillar: 'workforce',
    bonus: { workforce: 3 },
    stages: ['skills_s1', 'skills_s2', 'skills_s3'],
  },
  digital: {
    name: 'Digital Stack',
    pillar: 'innovation',
    bonus: { innovation: 3 },
    stages: ['digital_s1', 'digital_s2', 'digital_s3'],
  },
  entrep_floor: {
    name: "Entrepreneur's Floor",
    pillar: 'entrep',
    bonus: { entrep: 3 },
    stages: ['entrep_s1', 'entrep_s2', 'entrep_s3'],
  },
  infra_chain: {
    name: 'Infrastructure Chain',
    pillar: 'infra',
    bonus: { infra: 3 },
    stages: ['infra_s1', 'infra_s2', 'infra_s3'],
  },
  green: {
    name: 'Green Economy',
    pillar: 'innovation',
    bonus: { innovation: 2, infra: 1 },
    stages: ['green_s1', 'green_s2', 'green_s3'],
  },
};

/* ── Full policy card corpus ──────────────────────────────── */

const ALL_POLICIES = [
  /* ── Suite cards ── */
  { id:'credit_s1', name:'Micro-loans to Lead the Way', pillar:'finance', stage:1, suite:'credit',
    immediate:{finance:2, entrep:1}, passive:{finance:1},
    desc:'Establish micro-loan programmes through local cooperative banks. Collateral-free credit for first-time MSME founders.' },
  { id:'credit_s2', name:'Targeted Lending', pillar:'finance', stage:2, suite:'credit',
    immediate:{finance:3, entrep:1}, passive:{finance:1},
    desc:'Direct credit lines to priority sectors — agro-processing, handloom, light manufacturing — at subsidised rates.' },
  { id:'credit_s3', name:'Attracting VC Funds', pillar:'finance', stage:3, suite:'credit',
    immediate:{finance:4, innovation:1}, passive:{finance:2},
    desc:'Create a city-level fund-of-funds to co-invest with private venture capital in high-growth MSMEs.' },

  { id:'skills_s1', name:'Apprenticeship Programs', pillar:'workforce', stage:1, suite:'skills',
    immediate:{workforce:2, entrep:1}, passive:{workforce:1},
    desc:'Pair local ITIs with MSMEs. Employers pay a stipend; the city covers training costs.' },
  { id:'skills_s2', name:'Industry-Academia Partnerships', pillar:'workforce', stage:2, suite:'skills',
    immediate:{workforce:3, innovation:1}, passive:{workforce:1},
    desc:'Colleges co-design curricula with Navapur manufacturers. Workers earn nationally-recognised certifications.' },
  { id:'skills_s3', name:'Centre of Excellence for Skills', pillar:'workforce', stage:3, suite:'skills',
    immediate:{workforce:4, innovation:2}, passive:{workforce:2},
    desc:"Build Navapur's permanent skills institution — a city-level polytechnic anchored to the NSDC framework." },

  { id:'digital_s1', name:'High Speed Internet & Incubation', pillar:'innovation', stage:1, suite:'digital',
    immediate:{innovation:2, infra:1}, passive:{innovation:1},
    desc:'Deploy fibre to industrial zones and launch a co-working incubation hub with subsidised rent.' },
  { id:'digital_s2', name:'Advanced Manufacturing Tech', pillar:'innovation', stage:2, suite:'digital',
    immediate:{innovation:3, workforce:1}, passive:{innovation:1},
    desc:'Subsidise CNC, laser-cutting, and 3D-printing access for Micro and Small enterprises.' },
  { id:'digital_s3', name:'Information Utility Portal', pillar:'innovation', stage:3, suite:'digital',
    immediate:{innovation:4, entrep:1}, passive:{innovation:2},
    desc:"A single city data platform: market prices, buyer leads, compliance calendars. Navapur's ONDC node." },

  { id:'entrep_s1', name:'Simplify, Simplify, Simplify', pillar:'entrep', stage:1, suite:'entrep_floor',
    immediate:{entrep:3}, passive:{entrep:1},
    desc:'Implement a streamlined regulatory framework that reduces burdens and helps the establishment of businesses.' },
  { id:'entrep_s2', name:'Business Incubator Support', pillar:'entrep', stage:2, suite:'entrep_floor',
    immediate:{entrep:3, innovation:1}, passive:{entrep:1},
    desc:'Fund 5 sector-specific incubators. Mentorship, shared equipment, buyer introductions.' },
  { id:'entrep_s3', name:'Market Access & Expansion', pillar:'entrep', stage:3, suite:'entrep_floor',
    immediate:{entrep:4, finance:1}, passive:{entrep:2},
    desc:'Broker direct supply contracts between Navapur MSMEs and state government procurement.' },

  { id:'infra_s1', name:'Set up Industrial Parks', pillar:'infra', stage:1, suite:'infra_chain',
    immediate:{infra:2, finance:1}, passive:{infra:1},
    desc:'Develop two plug-and-play industrial parks with shared utilities, roads, and warehousing.' },
  { id:'infra_s2', name:'Infrastructure Grants', pillar:'infra', stage:2, suite:'infra_chain',
    immediate:{infra:3, finance:1}, passive:{infra:1},
    desc:'Match-fund infrastructure upgrades with state grants. Focus on last-mile logistics.' },
  { id:'infra_s3', name:'Cutting the Red Tape', pillar:'infra', stage:3, suite:'infra_chain',
    immediate:{infra:4, entrep:2}, passive:{infra:2},
    desc:'Digitise all building permits, utility connections, and NOCs. 72-hour approvals guaranteed.' },

  { id:'green_s1', name:'Clear Guidelines for Sustainability', pillar:'innovation', stage:1, suite:'green',
    immediate:{innovation:2, infra:1}, passive:{innovation:1},
    desc:'Publish a clear sustainability framework for MSMEs: emission thresholds, water norms, incentives.' },
  { id:'green_s2', name:'R&D for Green Innovation', pillar:'innovation', stage:2, suite:'green',
    immediate:{innovation:3, infra:1}, passive:{innovation:1},
    desc:'Co-fund R&D partnerships between MSMEs and research institutions on green manufacturing.' },
  { id:'green_s3', name:'Green Marketing & Labeling', pillar:'innovation', stage:3, suite:'green',
    immediate:{innovation:3, infra:2}, passive:{innovation:2},
    desc:"Launch Navapur's green certification mark. Premium positioning in export markets." },

  /* ── Stage 1 standalones (sample — 15 cards) ── */
  { id:'s1_01', name:'Everyone an Entrepreneur', pillar:'entrep', stage:1,
    immediate:{entrep:2, workforce:1}, passive:{entrep:1},
    desc:'City-wide entrepreneurship awareness campaign embedded in schools and community centres.' },
  { id:'s1_02', name:'Digital Skills Initiatives', pillar:'workforce', stage:1,
    immediate:{workforce:2, innovation:1}, passive:{workforce:1},
    desc:'Free digital literacy courses at library branches and community centres.' },
  { id:'s1_03', name:'No Collateral for Growth Stimulation', pillar:'finance', stage:1,
    immediate:{finance:2, entrep:1}, passive:{finance:1},
    desc:'Guarantee scheme that allows MSMEs to access credit without collateral through city-backed risk coverage.' },
  { id:'s1_04', name:'Single Window Clearance System', pillar:'finance', stage:1,
    immediate:{finance:2, infra:1}, passive:{finance:1},
    desc:'A single online portal for all business registrations, permits, and renewals.' },
  { id:'s1_05', name:'Subsidized Training Programs', pillar:'workforce', stage:1,
    immediate:{workforce:2, finance:1}, passive:{workforce:1},
    desc:'City subsidises 60% of training costs at empanelled vocational institutes.' },
  { id:'s1_06', name:'A Standard for Safety and Quality', pillar:'infra', stage:1,
    immediate:{infra:2, entrep:1}, passive:{infra:1},
    desc:'Mandatory but simplified quality standards for MSME products entering city procurement.' },
  { id:'s1_07', name:'Digital Startup Scheme', pillar:'innovation', stage:1,
    immediate:{innovation:2, entrep:1}, passive:{innovation:1},
    desc:'Seed grants of ₹2 lakh for tech-enabled micro-enterprises, disbursed within 30 days.' },
  { id:'s1_08', name:'Online Loans', pillar:'finance', stage:1,
    immediate:{finance:2, entrep:1}, passive:{finance:1},
    desc:'Partner with fintech lenders for instant digital credit scored on GST filing history.' },
  { id:'s1_09', name:'Access to Capital and Financing', pillar:'finance', stage:1,
    immediate:{finance:3}, passive:{finance:1},
    desc:'Establish a Navapur MSME credit guarantee fund with matching state government contribution.' },
  { id:'s1_10', name:'Industrial Parks', pillar:'infra', stage:1,
    immediate:{infra:2, entrep:1}, passive:{infra:1},
    desc:'Allot space in city industrial estates at concessional rates to registered MSMEs.' },
  { id:'s1_11', name:'Flexible Workforce Regulations', pillar:'workforce', stage:1,
    immediate:{workforce:2, entrep:1}, passive:{workforce:1},
    desc:'Simplify labour compliance for MSMEs with under 20 employees. Digital returns, annual inspections only.' },
  { id:'s1_12', name:'Employment Generation Initiative', pillar:'entrep', stage:1,
    immediate:{entrep:2, workforce:1}, passive:{entrep:1},
    desc:'Wage subsidies for first-time MSME hires, covering 30% of salary for 12 months.' },
  { id:'s1_13', name:'Formalising Sector', pillar:'finance', stage:1,
    immediate:{finance:2, infra:1}, passive:{finance:1},
    desc:'Incentivise informal enterprises to register: free GST filing support, banking access, insurance.' },
  { id:'s1_14', name:'Definitions Expanded', pillar:'infra', stage:1,
    immediate:{infra:2, finance:1}, passive:{infra:1},
    desc:'Expand MSME definition thresholds to include more businesses in the formal support ecosystem.' },
  { id:'s1_15', name:'Startup Innovation Fund', pillar:'innovation', stage:1,
    immediate:{innovation:3, entrep:1}, passive:{innovation:1},
    desc:'City-managed innovation fund disbursing up to ₹10 lakh for prototype development.' },

  /* ── Stage 2 standalones (sample — 15 cards) ── */
  { id:'s2_01', name:'Intellectual Property Protection', pillar:'entrep', stage:2,
    immediate:{entrep:2, innovation:1}, passive:{entrep:1},
    desc:'Subsidised IP registration support and a city-level IP clinic with legal aid.' },
  { id:'s2_02', name:'Transparent Tax Regimes', pillar:'finance', stage:2,
    immediate:{finance:2, entrep:1}, passive:{finance:1},
    desc:'Publish all MSME tax rates, exemptions, and compliance calendars in a single public portal.' },
  { id:'s2_03', name:'Smart Infrastructure Adoption', pillar:'infra', stage:2,
    immediate:{infra:2, innovation:1}, passive:{infra:1},
    desc:'IoT sensors on industrial park utilities. Real-time monitoring of power, water, logistics.' },
  { id:'s2_04', name:'Technology Upgradation Fund Scheme', pillar:'finance', stage:2,
    immediate:{finance:3, innovation:1}, passive:{finance:1},
    desc:'Interest-rate subsidy on loans for technology modernisation — weaving, food processing, metalwork.' },
  { id:'s2_05', name:'Network Building for Solutions', pillar:'innovation', stage:2,
    immediate:{innovation:2, entrep:1}, passive:{innovation:1},
    desc:'Sector clusters connecting MSMEs to buyers, technology providers, and research institutions.' },
  { id:'s2_06', name:'Skilled Worker Bonus', pillar:'workforce', stage:2,
    immediate:{workforce:2, finance:1}, passive:{workforce:1},
    desc:'Retention bonuses for certified workers who stay with an MSME for 2+ years.' },
  { id:'s2_07', name:'Craft Fairs and Trade Shows', pillar:'infra', stage:2,
    immediate:{infra:2, entrep:1}, passive:{infra:1},
    desc:'City-sponsored national and international buyer-seller meets for Navapur products.' },
  { id:'s2_08', name:'Digital Marketing for Customer Base', pillar:'innovation', stage:2,
    immediate:{innovation:2, entrep:1}, passive:{innovation:1},
    desc:'Subsidised digital marketing coaching and marketplace onboarding for MSMEs.' },
  { id:'s2_09', name:'Recognition of Prior Learning', pillar:'workforce', stage:2,
    immediate:{workforce:3, entrep:1}, passive:{workforce:1},
    desc:'RPL certification for informal workers — validating skills earned outside formal education.' },
  { id:'s2_10', name:'Access to Affordable Utilities', pillar:'infra', stage:2,
    immediate:{infra:2, finance:1}, passive:{infra:1},
    desc:'Negotiate bulk electricity and water tariffs for MSMEs in city industrial zones.' },
  { id:'s2_11', name:'Enhanced Private Sector Contribution', pillar:'finance', stage:2,
    immediate:{finance:2, innovation:1}, passive:{finance:1},
    desc:'CSR matching scheme: ₹1 city fund unlocks ₹2 in private sector investment in MSME infrastructure.' },
  { id:'s2_12', name:'Skill Booster Card', pillar:'workforce', stage:2,
    immediate:{workforce:2, innovation:1}, passive:{workforce:1},
    desc:'Portable training credit card workers use at any empanelled training provider.' },
  { id:'s2_13', name:'Testing and Certification Centers', pillar:'innovation', stage:2,
    immediate:{innovation:2, infra:1}, passive:{innovation:1},
    desc:'City quality labs where MSMEs can test products and earn certifications for export markets.' },
  { id:'s2_14', name:'Promote EV Component Manufacturing', pillar:'infra', stage:2,
    immediate:{infra:3, innovation:1}, passive:{infra:1},
    desc:'Targeted support for MSMEs entering the EV supply chain — tooling, certification, buyer links.' },
  { id:'s2_15', name:'Community Kitchens and Food Incubators', pillar:'infra', stage:2,
    immediate:{infra:2, entrep:1}, passive:{infra:1},
    desc:'Shared food-processing infrastructure for agro-MSME clusters — FSSAI-compliant, HACCP-ready.' },

  /* ── Stage 3 standalones (sample — 8 cards) ── */
  { id:'s3_01', name:'Market Access Initiative', pillar:'finance', stage:3,
    immediate:{finance:3, entrep:2}, passive:{finance:2},
    desc:'National and international market access programme for Navapur MSMEs — buyer matchmaking, trade delegations.' },
  { id:'s3_02', name:'Export Promotion Capital Goods Scheme', pillar:'finance', stage:3,
    immediate:{finance:4, innovation:1}, passive:{finance:2},
    desc:'Zero-duty import of capital goods for MSMEs committed to export production.' },
  { id:'s3_03', name:'Risk Mitigation and Insurance Programs', pillar:'finance', stage:3,
    immediate:{finance:3, infra:1}, passive:{finance:2},
    desc:'City-backed insurance pool for MSME business risk: market downturns, supply disruption, disasters.' },
  { id:'s3_04', name:'Artisan Clusters and Craft Villages', pillar:'infra', stage:3,
    immediate:{infra:3, entrep:2}, passive:{infra:2},
    desc:'Dedicated clusters for artisan industries with shared infrastructure, tourism integration, and export access.' },
  { id:'s3_05', name:'Pharmaceutical Export Zones Promotion', pillar:'innovation', stage:3,
    immediate:{innovation:3, finance:2}, passive:{innovation:2},
    desc:'Attract pharmaceutical MSMEs with dedicated zone, fast regulatory clearances, and export incentives.' },
  { id:'s3_06', name:'Mentorship Programs', pillar:'workforce', stage:3,
    immediate:{workforce:3, entrep:2}, passive:{workforce:2},
    desc:'Structured peer mentorship between established Medium enterprises and growing Micro/Small MSMEs.' },
  { id:'s3_07', name:'Setting up a Special Purpose Vehicle', pillar:'finance', stage:3,
    immediate:{finance:4, infra:1}, passive:{finance:2},
    desc:'City-industry SPV for large infrastructure projects that individual MSMEs cannot fund alone.' },
  { id:'s3_08', name:'Microfinance for Rural Entrepreneurship', pillar:'finance', stage:3,
    immediate:{finance:3, workforce:1}, passive:{finance:1},
    desc:'Extend the MSME credit ecosystem to peri-urban and rural areas surrounding Navapur.' },
];

/* ── Enterprise card corpus ───────────────────────────────── */

const ENTERPRISES = [
  // Micro
  { id:'e01', name:'Spice Grinding Unit',         stage:'micro', sector:'Agro-processing',   workers:'Up to 8',  turnover:'₹12L',
    cost:{finance:6, workforce:4, infra:3, innovation:2, entrep:3}, maintenance:2 },
  { id:'e02', name:'Handloom Weaving Cooperative', stage:'micro', sector:'Manufacturing',     workers:'Up to 6',  turnover:'₹8L',
    cost:{finance:5, workforce:5, infra:2, innovation:1, entrep:4}, maintenance:2 },
  { id:'e03', name:'Street Food Cart Cluster',     stage:'micro', sector:'Services',          workers:'Up to 5',  turnover:'₹6L',
    cost:{finance:4, workforce:3, infra:2, innovation:1, entrep:3}, maintenance:2 },
  { id:'e04', name:'Mobile Phone Repair Hub',      stage:'micro', sector:'Services',          workers:'Up to 4',  turnover:'₹5L',
    cost:{finance:4, workforce:4, infra:1, innovation:3, entrep:2}, maintenance:2 },
  { id:'e05', name:'Papad Manufacturing Unit',     stage:'micro', sector:'Agro-processing',   workers:'Up to 10', turnover:'₹18L',
    cost:{finance:5, workforce:5, infra:3, innovation:1, entrep:3}, maintenance:2 },
  { id:'e06', name:'Bamboo Furniture Workshop',    stage:'micro', sector:'Manufacturing',     workers:'Up to 6',  turnover:'₹9L',
    cost:{finance:5, workforce:4, infra:3, innovation:2, entrep:3}, maintenance:2 },
  // Small
  { id:'e07', name:'Cold Chain Logistics Unit',    stage:'small', sector:'Agro-processing',   workers:'Up to 18', turnover:'₹45L',
    cost:{finance:8, workforce:7, infra:8, innovation:6, entrep:4}, maintenance:3 },
  { id:'e08', name:'Auto Parts Fabrication',       stage:'small', sector:'Manufacturing',     workers:'Up to 20', turnover:'₹60L',
    cost:{finance:9, workforce:8, infra:7, innovation:5, entrep:5}, maintenance:3 },
  { id:'e09', name:'Organic Food Processing',      stage:'small', sector:'Agro-processing',   workers:'Up to 15', turnover:'₹40L',
    cost:{finance:8, workforce:6, infra:6, innovation:5, entrep:5}, maintenance:3 },
  { id:'e10', name:'Garment Export Unit',          stage:'small', sector:'Manufacturing',     workers:'Up to 25', turnover:'₹75L',
    cost:{finance:9, workforce:9, infra:7, innovation:4, entrep:6}, maintenance:3 },
  // Medium
  { id:'e11', name:'Pharmaceutical Packaging',     stage:'medium', sector:'Manufacturing',    workers:'Up to 50', turnover:'₹2Cr',
    cost:{finance:12, workforce:11, infra:10, innovation:9, entrep:8}, maintenance:4 },
  { id:'e12', name:'Solar Panel Assembly Plant',   stage:'medium', sector:'Manufacturing',    workers:'Up to 60', turnover:'₹3Cr',
    cost:{finance:12, workforce:10, infra:11, innovation:11, entrep:7}, maintenance:4 },
];

/* ── State ────────────────────────────────────────────────── */

const state = {
  screen: 'intro',            // intro | round | consequence | outcome
  round: 1,
  bars: { ...STARTING_BARS },
  enterprises: [              // starting 3 micro enterprises
    { ...ENTERPRISES[0], id: 'start_1' },
    { ...ENTERPRISES[1], id: 'start_2' },
    { ...ENTERPRISES[2], id: 'start_3' },
  ],
  pushedPolicies: [],         // array of policy ids pushed so far
  suitesCompleted: [],        // suite keys completed
  roundPushes: [],            // policy ids pushed this round (max 2)
  roundAttraction: null,      // enterprise id attracted this round (max 1)
  marketPool: [],             // 10 cards drawn for this round
  selectedPolicy: null,       // currently tapped card in market
  log: [],                    // round-by-round log entries
};

/* ── Helpers ─────────────────────────────────────────────── */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function totalMaintenance() {
  return state.enterprises.reduce((sum, e) => sum + MAINTENANCE[e.stage], 0);
}

function passiveIncome() {
  const totals = { finance:0, workforce:0, infra:0, innovation:0, entrep:0 };
  state.pushedPolicies.forEach(id => {
    const policy = ALL_POLICIES.find(p => p.id === id);
    if (!policy) return;
    Object.entries(policy.passive).forEach(([pillar, val]) => {
      totals[pillar] = (totals[pillar] || 0) + val;
    });
  });
  return totals;
}

function totalPassiveSum() {
  return Object.values(passiveIncome()).reduce((a, b) => a + b, 0);
}

function getStageUnlocked() {
  const pushed = state.pushedPolicies.length;
  // Stage 2 unlocked after 2 Stage-1 pushes; Stage 3 after 3×S1 + 2×S2
  const s1Count = state.pushedPolicies.filter(id => {
    const p = ALL_POLICIES.find(x => x.id === id);
    return p && p.stage === 1;
  }).length;
  const s2Count = state.pushedPolicies.filter(id => {
    const p = ALL_POLICIES.find(x => x.id === id);
    return p && p.stage === 2;
  }).length;
  if (s1Count >= 3 && s2Count >= 2) return 3;
  if (s1Count >= 2) return 2;
  return 1;
}

function canAffordEnterprise(enterprise) {
  return Object.entries(enterprise.cost).every(
    ([pillar, cost]) => (state.bars[pillar] || 0) >= cost
  );
}

function checkSuiteCompletion() {
  const newlyCompleted = [];
  Object.entries(SUITES).forEach(([key, suite]) => {
    if (state.suitesCompleted.includes(key)) return;
    if (suite.stages.every(id => state.pushedPolicies.includes(id))) {
      state.suitesCompleted.push(key);
      newlyCompleted.push(suite);
    }
  });
  return newlyCompleted;
}

function drawMarketPool() {
  const maxStage = getStageUnlocked();
  const alreadyPushed = new Set(state.pushedPolicies);

  // Suite cards first (eligible stage, not yet pushed)
  const suiteEligible = ALL_POLICIES.filter(p =>
    p.suite && p.stage <= maxStage && !alreadyPushed.has(p.id)
  );

  // Standalones
  const standaloneEligible = ALL_POLICIES.filter(p =>
    !p.suite && p.stage <= maxStage && !alreadyPushed.has(p.id)
  );

  const suiteDrawn    = shuffle(suiteEligible).slice(0, Math.min(6, suiteEligible.length));
  const remaining     = 10 - suiteDrawn.length;
  const standDrawn    = shuffle(standaloneEligible).slice(0, remaining);

  state.marketPool = shuffle([...suiteDrawn, ...standDrawn]);
}

function applyMaintenance() {
  const cost = totalMaintenance();
  state.bars.finance = Math.max(0, state.bars.finance - cost);
  return cost;
}

function applyPassiveIncome() {
  const income = passiveIncome();
  Object.entries(income).forEach(([pillar, val]) => {
    state.bars[pillar] = clamp((state.bars[pillar] || 0) + val, 0, MAX_BAR);
  });
  return income;
}

function pushPolicy(policyId) {
  if (state.roundPushes.length >= POLICIES_PER_ROUND) return false;
  if (state.pushedPolicies.includes(policyId)) return false;

  const policy = ALL_POLICIES.find(p => p.id === policyId);
  if (!policy) return false;

  // Apply immediate bar gains
  Object.entries(policy.immediate).forEach(([pillar, val]) => {
    state.bars[pillar] = clamp((state.bars[pillar] || 0) + val, 0, MAX_BAR);
  });

  state.pushedPolicies.push(policyId);
  state.roundPushes.push(policyId);
  state.selectedPolicy = null;

  return true;
}

function attractEnterprise(enterpriseId) {
  if (state.roundAttraction) return false;
  const enterprise = ENTERPRISES.find(e => e.id === enterpriseId);
  if (!enterprise) return false;
  if (!canAffordEnterprise(enterprise)) return false;

  // Spend bars down
  Object.entries(enterprise.cost).forEach(([pillar, cost]) => {
    state.bars[pillar] = Math.max(0, (state.bars[pillar] || 0) - cost);
  });

  state.enterprises.push({ ...enterprise, instanceId: `${enterpriseId}_r${state.round}` });
  state.roundAttraction = enterpriseId;
  return true;
}

function endRound() {
  // 1. Apply passive income from ecosystem
  const income = applyPassiveIncome();
  // 2. Apply maintenance drain
  const maintenance = applyMaintenance();
  // 3. Check suite completions
  const newSuites = checkSuiteCompletion();
  newSuites.forEach(suite => {
    Object.entries(suite.bonus).forEach(([pillar, val]) => {
      state.bars[pillar] = clamp((state.bars[pillar] || 0) + val, 0, MAX_BAR);
    });
  });
  // 4. Log
  state.log.push({
    round: state.round,
    sector: SECTORS[state.round - 1],
    pushes: [...state.roundPushes],
    attraction: state.roundAttraction,
    maintenance,
    income,
    newSuites: newSuites.map(s => s.name),
    barsAfter: { ...state.bars },
  });
  // 5. Advance round
  state.round++;
  state.roundPushes = [];
  state.roundAttraction = null;

  if (state.round > TOTAL_ROUNDS) {
    state.screen = 'outcome';
  } else {
    drawMarketPool();
    state.screen = 'round';
  }
}

function computeScore() {
  // Ecosystem Health Score out of 100
  const barTotal = Object.values(state.bars).reduce((a, b) => a + b, 0);
  const maxBars  = Object.keys(state.bars).length * MAX_BAR;
  const barScore = Math.round((barTotal / maxBars) * 40);

  const enterpriseScore = Math.round(
    (state.enterprises.length / 8) * 30 +
    state.enterprises.filter(e => e.stage === 'small').length  * 3 +
    state.enterprises.filter(e => e.stage === 'medium').length * 6
  );

  const suiteScore = state.suitesCompleted.length * 5;

  const policyDepth = Math.round((state.pushedPolicies.length / 10) * 10);

  return Math.min(100, barScore + enterpriseScore + suiteScore + policyDepth);
}

function getVerdict(score) {
  if (score >= 80) return { title: 'The Stone House Stands', body: 'Navapur is now a model for MSME governance. Your ecosystem generates its own momentum — policies compound, enterprises grow, workers stay. Other cities are taking notes.' };
  if (score >= 60) return { title: 'The Bricks Hold', body: 'A solid foundation — but some pillars remain underdeveloped. Businesses are growing, though not all at the pace you promised. A second term might be enough to finish the job.' };
  if (score >= 40) return { title: 'The Sticks Bent', body: "Navapur's MSMEs are alive but fragile. You made choices — but not always the right ones at the right time. The ecosystem you built is easily disrupted." };
  return { title: 'The Straw Has Blown Away', body: "The maintenance drained you, the attraction spending left you bare, and the policy stack never compounded. Navapur's MSMEs are where they started — or worse." };
}

/* ── Render helpers ─────────────────────────────────────────
   Each render function returns an HTML string. The main
   render() function picks the right screen and injects into #app.
   ─────────────────────────────────────────────────────────── */

function formatBarDeltas() {
  // Show passive income - maintenance for Finance, passive for others
  const income = passiveIncome();
  const maintenance = totalMaintenance();
  return {
    finance:    income.finance   - maintenance,
    workforce:  income.workforce  || 0,
    infra:      income.infra      || 0,
    innovation: income.innovation || 0,
    entrep:     income.entrep     || 0,
  };
}

function renderLogo() {
  return `<svg viewBox="265 205 285 185" width="120" height="auto" xmlns="http://www.w3.org/2000/svg">
    <defs><style>.cls-1{fill:#e8aa3d;}</style></defs>
    <path class="cls-1" d="M348.68,284c-.83,1-1.07,1.47-1,2,.12.88,1.06,1.44,1.88,1.9a62,62,0,0,0,5.91,2.87q0,8.82,0,17.79.09,14.06.41,27.75l-72.34,0a42.14,42.14,0,0,1,5-19.68,36.22,36.22,0,0,1,6.39-8.78,58,58,0,0,1,16.3-10.32c3.59-1.21,8.77-3.08,14.9-5.76,8-3.49,8.71-4.46,8.72-5.27.05-2.94-8.91-3.33-22-11-7.43-4.35-12.09-8.58-13.67-14.43a18.64,18.64,0,0,1-.55-3l56.95.11.07,19.67a25.27,25.27,0,0,1-2.92,2.7A23.52,23.52,0,0,0,348.68,284Z"/>
    <path class="cls-1" d="M371.32,217.21v-3.37h23.52v3.37H385v28h-3.8v-28Z"/>
    <path class="cls-1" d="M404,245.2V213.84h3.79v14h16.72v-14h3.8V245.2h-3.8v-14H407.75v14Z"/>
    <path class="cls-1" d="M439.1,245.2V213.84H458v3.37H442.9V227.8h14.15v3.37H442.9v10.66h15.37v3.37Z"/>
    <path class="cls-1" d="M397.46,270.23h-7.65a7,7,0,0,0-.63-2.13,5.17,5.17,0,0,0-1.26-1.62,5.44,5.44,0,0,0-1.84-1,7.29,7.29,0,0,0-2.35-.36,6.8,6.8,0,0,0-3.93,1.12,7,7,0,0,0-2.53,3.23,15.46,15.46,0,0,0,0,10.34,6.51,6.51,0,0,0,6.39,4.24,7.82,7.82,0,0,0,2.29-.32,5.53,5.53,0,0,0,1.82-.95,5,5,0,0,0,1.3-1.51,6.19,6.19,0,0,0,.72-2l7.65.05a11.64,11.64,0,0,1-1.2,4.1,13,13,0,0,1-2.75,3.68,12.76,12.76,0,0,1-4.25,2.64,16.78,16.78,0,0,1-13.35-.89,13.43,13.43,0,0,1-5.31-5.48,18.29,18.29,0,0,1-1.94-8.76,18,18,0,0,1,2-8.77,13.38,13.38,0,0,1,5.34-5.46,15.26,15.26,0,0,1,7.55-1.87,16.83,16.83,0,0,1,5.27.79,12.9,12.9,0,0,1,4.25,2.29,11.89,11.89,0,0,1,3,3.7A13.55,13.55,0,0,1,397.46,270.23Z"/>
    <path class="cls-1" d="M412.59,258.87v31.35H405V258.87Z"/>
    <path class="cls-1" d="M427.69,258.87l7,23H435l7-23h8.48l-10.58,31.35H429.79l-10.58-31.35Z"/>
    <path class="cls-1" d="M464.66,258.87v31.35h-7.58V258.87Z"/>
    <path class="cls-1" d="M501.1,270.23h-7.65a6.46,6.46,0,0,0-.63-2.13,5.14,5.14,0,0,0-1.25-1.62,5.58,5.58,0,0,0-1.85-1,7.29,7.29,0,0,0-2.35-.36,6.8,6.8,0,0,0-3.93,1.12,7,7,0,0,0-2.52,3.23,15.38,15.38,0,0,0,0,10.34,6.83,6.83,0,0,0,2.53,3.17,6.9,6.9,0,0,0,3.86,1.07,7.77,7.77,0,0,0,2.29-.32,5.69,5.69,0,0,0,1.83-.95,5.13,5.13,0,0,0,1.3-1.51,6.18,6.18,0,0,0,.71-2l7.65.05a11.64,11.64,0,0,1-1.2,4.1,13,13,0,0,1-2.75,3.68,12.76,12.76,0,0,1-4.25,2.64,16.78,16.78,0,0,1-13.35-.89,13.34,13.34,0,0,1-5.3-5.48,18.17,18.17,0,0,1-1.95-8.76,18,18,0,0,1,2-8.77,13.51,13.51,0,0,1,5.34-5.46,15.29,15.29,0,0,1,7.55-1.87,16.78,16.78,0,0,1,5.27.79,13,13,0,0,1,4.26,2.29,11.86,11.86,0,0,1,3,3.7A13.36,13.36,0,0,1,501.1,270.23Z"/>
    <path class="cls-1" d="M389.58,314.81a5.68,5.68,0,0,0-.77-1.71,5,5,0,0,0-1.24-1.26,5.42,5.42,0,0,0-1.68-.79,7.66,7.66,0,0,0-2.09-.27,7,7,0,0,0-3.94,1.1,7.08,7.08,0,0,0-2.56,3.21,12.8,12.8,0,0,0-.91,5.11,13.37,13.37,0,0,0,.88,5.14,6.59,6.59,0,0,0,6.53,4.37,8.14,8.14,0,0,0,3.53-.69,4.84,4.84,0,0,0,2.2-1.93,5.69,5.69,0,0,0,.75-3l1.41.17h-7.63v-5.53h13.53v4.15a13.85,13.85,0,0,1-1.79,7.21,11.9,11.9,0,0,1-4.9,4.61,15.29,15.29,0,0,1-7.16,1.61,15.63,15.63,0,0,1-7.88-1.94,13.51,13.51,0,0,1-5.3-5.55,18.13,18.13,0,0,1-1.9-8.57,18.92,18.92,0,0,1,1.15-6.85,14.31,14.31,0,0,1,3.21-5.08,13.6,13.6,0,0,1,4.77-3.15,15.77,15.77,0,0,1,5.86-1.08,16.34,16.34,0,0,1,5.08.78,13.92,13.92,0,0,1,4.16,2.21,11.89,11.89,0,0,1,2.95,3.38,11.35,11.35,0,0,1,1.41,4.31Z"/>
    <path class="cls-1" d="M411.09,335.92H403l10.58-31.36h10.09l10.58,31.36h-8.15l-7.36-23.46h-.25ZM410,323.58h17v5.76H410Z"/>
    <path class="cls-1" d="M440.82,304.56h9.38l8,19.42h.37l8-19.42h9.39v31.36H468.5V316.66h-.26l-7.53,19.06H456l-7.53-19.17h-.26v19.37h-7.38Z"/>
    <path class="cls-1" d="M483.86,335.92V304.56h21.87v6.16H491.44v6.43h13.17v6.17H491.44v6.45h14.29v6.15Z"/>
    <path class="cls-1" d="M530.66,314a3.56,3.56,0,0,0-1.36-2.63,5.42,5.42,0,0,0-3.42-.94,6.71,6.71,0,0,0-2.45.38,3.17,3.17,0,0,0-1.47,1.05,2.61,2.61,0,0,0-.5,1.52,2.13,2.13,0,0,0,.28,1.24,2.83,2.83,0,0,0,.92.94,6.41,6.41,0,0,0,1.46.72,15.64,15.64,0,0,0,1.93.53l2.69.61a19.34,19.34,0,0,1,4.12,1.35,11.24,11.24,0,0,1,3,2,7.79,7.79,0,0,1,1.84,2.68,9.15,9.15,0,0,1,.65,3.4,8.85,8.85,0,0,1-1.51,5.1,9.29,9.29,0,0,1-4.26,3.26,17.85,17.85,0,0,1-6.7,1.13,18.21,18.21,0,0,1-6.86-1.18,9.72,9.72,0,0,1-4.55-3.58,10.81,10.81,0,0,1-1.66-6.08h7.25a4.7,4.7,0,0,0,.82,2.53,4.44,4.44,0,0,0,2,1.53,7.78,7.78,0,0,0,2.93.52,7.21,7.21,0,0,0,2.61-.42,3.73,3.73,0,0,0,1.66-1.14,2.72,2.72,0,0,0,.6-1.69,2.38,2.38,0,0,0-.55-1.52,4.24,4.24,0,0,0-1.65-1.1,17.24,17.24,0,0,0-2.83-.87l-3.27-.76a14.4,14.4,0,0,1-6.42-3,7.16,7.16,0,0,1-2.32-5.66,8.43,8.43,0,0,1,1.56-5.1,10.36,10.36,0,0,1,4.36-3.41,15.62,15.62,0,0,1,6.36-1.23,14.93,14.93,0,0,1,6.33,1.24,9.77,9.77,0,0,1,4.17,3.45,9.21,9.21,0,0,1,1.52,5.15Z"/>
    <path class="cls-1" d="M371.62,381.19V349.83h3.8v28H390v3.37Z"/>
    <path class="cls-1" d="M402.36,381.19h-4l11.51-31.36h3.92l11.51,31.36h-4L412,354.79h-.24Zm1.47-12.25h16v3.37h-16Z"/>
    <path class="cls-1" d="M433.46,381.19V349.83h11a11.51,11.51,0,0,1,5.41,1.13,7.51,7.51,0,0,1,3.17,3,8.62,8.62,0,0,1,1,4.19,7,7,0,0,1-.71,3.34,5.72,5.72,0,0,1-1.87,2.08,8.84,8.84,0,0,1-2.5,1.14v.3a6.18,6.18,0,0,1,2.89,1,7.32,7.32,0,0,1,2.43,2.64,8.25,8.25,0,0,1,1,4.19,8.35,8.35,0,0,1-1.07,4.24,7.39,7.39,0,0,1-3.38,3,14.14,14.14,0,0,1-6,1.1Zm3.8-17.58h7a7,7,0,0,0,3.1-.67,5.46,5.46,0,0,0,2.21-1.9,5.12,5.12,0,0,0,.81-2.88,4.74,4.74,0,0,0-1.44-3.51q-1.43-1.45-4.56-1.45h-7.16Zm0,14.21h7.53q3.72,0,5.29-1.44a4.61,4.61,0,0,0,1.57-3.52,5.67,5.67,0,0,0-.81-2.95,6,6,0,0,0-2.31-2.17,7.31,7.31,0,0,0-3.56-.82h-7.71Z"/>
  </svg>`;
}

function renderBrandBar(subtitle) {
  return `<div class="brand-bar">
    ${renderLogo()}
    <div class="game-counter">${subtitle || 'Game 2 of 6'}</div>
  </div>`;
}

function renderPillarStrip(showDeltas) {
  const deltas = showDeltas ? formatBarDeltas() : null;
  return `<div class="pillar-strip">
    ${Object.entries(state.bars).map(([key, val]) => {
      const pct = Math.round((val / MAX_BAR) * 100);
      const delta = deltas ? deltas[key] : null;
      const low = val <= 3;
      return `<div class="p-unit">
        <div class="p-label">${PILLAR_LABELS[key]}</div>
        <div class="p-track"><div class="p-fill" style="width:${pct}%;background:${PILLAR_COLOURS[key]}"></div></div>
        <div class="p-row">
          <div class="p-val${low ? ' low' : ''}">${val}</div>
          ${delta !== null ? `<div class="p-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '+' : ''}${delta !== 0 ? delta : '—'}</div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ── Screen renderers ───────────────────────────────────────── */

function renderIntro() {
  return `
  <div class="screen">
    <div class="inner">
      ${renderBrandBar('Game 2 of 6')}

      <div style="border-bottom:2px solid var(--amber);padding:36px 0 28px">
        <div class="label-amber" style="margin-bottom:14px">A governance simulation</div>
        <div class="game-title">Engines of <em style="font-style:italic">Growth</em></div>
        <div class="game-sub">MSME ECOSYSTEM · NAVAPUR</div>
        <p class="intro-italic">Can you build a city where small businesses thrive?</p>
      </div>

      <div style="padding:28px 0 0">
        <div class="section-label-line">Your briefing</div>
        <p class="intro-body">
          You've just been elected <strong>Mayor of Navapur</strong>. Unemployment is rising. Your entire campaign ran on one promise — grow local business.<br><br>
          You inherit a city with <strong>3 struggling micro-enterprises</strong> and <strong>5 rounds</strong> to turn things around.
        </p>
      </div>

      <div class="divider"></div>

      <table style="width:100%;border-collapse:collapse;border:1px solid var(--border);margin-bottom:0">
        <thead><tr><td colspan="2" style="background:var(--ink);padding:7px 14px;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:rgba(234,229,208,.4)">Navapur · Starting conditions</td></tr></thead>
        <tbody>
          ${[['Population','2.4 lakh',''],['Active enterprises','3 Micro','amber'],['Unemployment','↑ Rising','danger'],['Rounds in office','5',''],['Policy pushes / round','2','']].map(([l,v,cls],i) =>
            `<tr style="background:${i%2?'#FAFAF6':'#fff'}"><td style="padding:9px 14px;font-size:12px;color:var(--ink-muted);border-bottom:1px solid var(--border)">${l}</td><td style="padding:9px 14px;text-align:right;border-bottom:1px solid var(--border);font-family:'EB Garamond',serif;font-size:16px;font-weight:500;color:${cls==='amber'?'var(--amber)':cls==='danger'?'var(--rust)':'var(--ink)'}">${v}</td></tr>`
          ).join('')}
          ${Object.entries(STARTING_BARS).map(([key, val],i) =>
            `<tr style="background:${(i+5)%2?'#FAFAF6':'#fff'}"><td style="padding:8px 14px;font-size:11px;color:var(--ink-muted);border-bottom:1px solid var(--border)">${PILLAR_LABELS[key]}</td><td style="padding:8px 14px;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:10px;justify-content:flex-end"><div style="width:80px;height:3px;background:var(--bar-bg)"><div style="width:${Math.round((val/MAX_BAR)*100)}%;height:100%;background:${PILLAR_COLOURS[key]}"></div></div><span style="font-size:10px;font-weight:800;color:${val<=4?'var(--rust)':'var(--ink-muted)'}">${val}/15</span></div></td></tr>`
          ).join('')}
        </tbody>
      </table>

      <div class="divider"></div>

      <div class="section-label-line">Your three objectives</div>
      ${[
        ['1','Maintain existing enterprises','Finance drains automatically every round. Keep the lights on or enterprises fail.'],
        ['2','Attract new enterprises','Build your bars high enough, then spend them down to bring new businesses to Navapur.'],
        ['3','Advance Micro → Small → Medium','Grow existing enterprises by meeting advancement thresholds. Bigger businesses, more jobs.'],
      ].map(([n,title,desc]) => `
        <div class="obj-card" style="margin-bottom:8px">
          <div class="obj-n">${n}</div>
          <div><div class="obj-title">${title}</div><div class="obj-desc">${desc}</div></div>
        </div>
      `).join('')}

      <div style="padding-top:32px">
        <button class="btn btn-primary btn-full" onclick="startGame()">Take office →</button>
        <button class="btn btn-full" style="margin-top:10px" onclick="showScreen('howtoplay')">How to play</button>
        <div class="giz-line">First built with support from <strong>GIZ</strong></div>
      </div>
    </div>
  </div>`;
}

function renderHowToPlay() {
  const items = [
    ['Bars are your currency','Five pillar bars — Finance, Workforce, Infrastructure, Innovation, Entrepreneurship — are what you earn and spend. Push policies to build them. Attract and advance enterprises by spending them down.'],
    ['2 policy pushes per round','Each round you choose 2 policies from a market of 10. Policies add to bars immediately — and generate passive income every round after. Build an ecosystem, not just a budget.'],
    ['Attract 1 enterprise per round','If your bars meet an enterprise\'s resource profile, you can attract it. Attracting spends your bars down. Every new enterprise also raises your maintenance bill.'],
    ['Programme Suites compound your gains','Three linked policies form a Suite. Push all three to unlock a bonus burst to one pillar. Suites reward strategic focus over scattered investment.'],
    ['5 rounds. That\'s your term.','At the end, Navapur is scored on enterprise count, advancements, bar levels, and ecosystem depth. There is no perfect run. Every choice costs something.'],
  ];
  return `
  <div class="screen">
    <div class="inner">
      ${renderBrandBar('How to play')}
      <div style="padding:14px 0 0">
        ${items.map(([h,p], i) => `
          <div style="display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--border)">
            <div style="font-family:'EB Garamond',serif;font-size:34px;line-height:1;color:var(--amber);opacity:.3;flex-shrink:0;width:26px;margin-top:-3px">${i+1}</div>
            <div>
              <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:4px">${h}</div>
              <div class="intro-italic" style="font-size:14px;margin-bottom:0">${p}</div>
            </div>
          </div>`).join('')}
      </div>
      <div style="padding-top:28px">
        <button class="btn btn-primary btn-full" onclick="startGame()">Take office →</button>
        <button class="btn btn-full" style="margin-top:10px" onclick="showScreen('intro')">← Back</button>
      </div>
    </div>
  </div>`;
}

function renderRound() {
  const sector   = SECTORS[state.round - 1];
  const maint    = totalMaintenance();
  const passive  = totalPassiveSum();
  const pushesLeft = POLICIES_PER_ROUND - state.roundPushes.length;
  const policy   = state.selectedPolicy ? ALL_POLICIES.find(p => p.id === state.selectedPolicy) : null;

  const poolFiltered = state.marketPool;

  return `
  <div class="screen" style="padding:0;align-items:stretch">
    <div class="inner" style="max-width:100%;padding:0">
      ${renderBrandBar(`Round ${state.round} of ${TOTAL_ROUNDS}`)}
      <div class="round-strip">
        <div class="round-strip-left">Round ${state.round} · ${sector}</div>
        <div class="round-strip-right">${state.enterprises.length} enterprise${state.enterprises.length!==1?'s':''}</div>
      </div>
      ${renderPillarStrip(true)}
      <div class="economy-strip">
        <div class="econ-cell"><div class="econ-label">Maintenance</div><div class="econ-val danger">−${maint} <em>Fin</em></div></div>
        <div class="econ-cell"><div class="econ-label">Passive / round</div><div class="econ-val green">+${passive} <em>total</em></div></div>
        <div class="econ-cell"><div class="econ-label">Policies left</div><div class="econ-val amber">${pushesLeft} <em>/ ${POLICIES_PER_ROUND}</em></div></div>
        <div class="econ-cell"><div class="econ-label">Can attract</div><div class="econ-val">${state.roundAttraction ? '0' : '1'} <em>this round</em></div></div>
      </div>

      <div class="market-header">
        <div>
          <div class="market-title">Policy Market</div>
          <div class="market-sub">${poolFiltered.length} available · round ${state.round}</div>
        </div>
        <div style="text-align:right">
          <div class="pushes-counter">
            <div class="pushes-num">${state.roundPushes.length}</div>
            <div class="pushes-denom"> / ${POLICIES_PER_ROUND}</div>
          </div>
          <div class="pushes-label">pushed</div>
        </div>
      </div>

      <div class="filter-tabs">
        <div class="ftab active">All</div>
        <div class="ftab">Finance</div>
        <div class="ftab">Workforce</div>
        <div class="ftab">Infra</div>
        <div class="ftab">Innov.</div>
        <div class="ftab">Entrep.</div>
        <div class="ftab" style="color:var(--teal)">◆ Suites</div>
      </div>

      <div class="market-grid">
        ${poolFiltered.map(p => {
          const pushed = state.pushedPolicies.includes(p.id);
          const thisRound = state.roundPushes.includes(p.id);
          const selected = state.selectedPolicy === p.id;
          const isSuite = !!p.suite;
          const benefitStr = Object.entries(p.immediate).map(([k,v]) => `+${v} ${PILLAR_LABELS[k]}`).join(' · ');
          const passiveStr = Object.entries(p.passive).map(([k,v]) => `+${v}/rd`)[0] || '';
          return `<div class="pcard${isSuite?' suite':''}${selected?' selected':''}${pushed?' opacity-50':''}"
            onclick="${pushed ? '' : `selectPolicy('${p.id}')`}"
            style="${pushed ? 'opacity:.4;cursor:default' : ''}">
            <div class="pcard-band" style="background:${PILLAR_COLOURS[p.pillar]}"></div>
            <div class="pcard-body">
              <div class="pcard-top">
                <span class="pcard-pillar" style="color:${PILLAR_COLOURS[p.pillar]}">${PILLAR_LABELS[p.pillar]}</span>
                ${isSuite ? `<span class="pcard-suite-pip">◆ ${SUITES[p.suite]?.name.split(' ')[0]}</span>` : `<span class="pcard-stage">S${p.stage}</span>`}
              </div>
              <div class="pcard-name">${p.name}</div>
            </div>
            <div class="pcard-benefit">
              <div><div class="pb-label">Benefit</div><div class="pb-val">${benefitStr}</div></div>
              <div class="pb-passive">${passiveStr}</div>
            </div>
          </div>`;
        }).join('')}
      </div>

      ${policy ? `
      <div class="detail-tray">
        <div class="tray-meta">
          <span class="tray-pillar-label" style="color:${PILLAR_COLOURS[policy.pillar]}">● ${PILLAR_LABELS[policy.pillar]}</span>
          ${policy.suite ? `<span class="tray-suite-tag">◆ ${SUITES[policy.suite]?.name} · S${policy.stage}</span>` : `<span style="font-size:8px;font-weight:800;color:var(--ink-faint);letter-spacing:.1em;text-transform:uppercase">Stage ${policy.stage}</span>`}
        </div>
        <div class="tray-name">${policy.name}</div>
        <div class="tray-desc">${policy.desc}</div>
        <div class="tray-benefit-block">
          <div class="tbb">
            <div class="tbb-label">On push</div>
            <div class="tbb-val">${Object.entries(policy.immediate).map(([k,v])=>`+${v} ${PILLAR_LABELS[k]}`).join(' · ')}</div>
            <div class="tbb-sub">Applied immediately</div>
          </div>
          <div class="tbb">
            <div class="tbb-label">Every round after</div>
            <div class="tbb-val">${Object.entries(policy.passive).map(([k,v])=>`+${v} ${PILLAR_LABELS[k]}`).join(' · ')}</div>
            <div class="tbb-sub">Passive ecosystem income</div>
          </div>
        </div>
        ${policy.suite ? `<div class="tray-suite-hint"><div class="tsh-icon">◆</div><div class="tsh-text">${SUITES[policy.suite]?.name} — push all 3 to unlock ${Object.entries(SUITES[policy.suite]?.bonus||{}).map(([k,v])=>`+${v} ${PILLAR_LABELS[k]}`).join(' · ')} bonus</div></div>` : ''}
        <button class="btn btn-primary btn-full" onclick="doPushPolicy('${policy.id}')" ${pushesLeft===0?'disabled':''}>Push this policy →</button>
        <button class="btn btn-full" style="margin-top:8px" onclick="selectPolicy(null)">Cancel</button>
      </div>` : `
      <div style="padding:16px 0;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border);margin-top:2px">
        <button class="btn btn-primary" style="flex:1" onclick="showScreen('enterprises')">Enterprise Market →</button>
        <button class="btn" style="flex:1" onclick="showScreen('ecosystem')">My Policies</button>
      </div>
      <div style="padding:0 0 16px">
        <button class="btn btn-primary btn-full" onclick="doEndRound()" ${state.roundPushes.length < POLICIES_PER_ROUND ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>End Round ${state.round} →</button>
        ${state.roundPushes.length < POLICIES_PER_ROUND ? `<div style="text-align:center;font-size:10px;color:var(--ink-faint);margin-top:8px">Push ${pushesLeft} more polic${pushesLeft===1?'y':'ies'} to end round</div>` : ''}
      </div>`}
    </div>
  </div>`;
}

function renderEnterprises() {
  const available = ENTERPRISES.filter(e =>
    !state.enterprises.some(se => se.id === e.id)
  );
  return `
  <div class="screen" style="padding:0;align-items:stretch">
    <div class="inner" style="max-width:100%;padding:0">
      ${renderBrandBar(`Round ${state.round} of ${TOTAL_ROUNDS}`)}
      ${renderPillarStrip(false)}
      <div style="background:var(--white);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="market-title">Enterprise Market</div>
          <div class="market-sub">Costs deducted from your bars · attract 1 this round</div>
        </div>
        <div style="font-size:9px;color:var(--ink-faint);text-align:right">
          ${available.filter(e=>canAffordEnterprise(e)).length} affordable
        </div>
      </div>
      <div class="enterprise-grid">
        ${available.map(e => {
          const affordable = canAffordEnterprise(e);
          return `<div class="ecard${affordable?' affordable':''}">
            <div class="ecard-head">
              <div class="ecard-stage-badge ${e.stage}">${e.stage.charAt(0).toUpperCase()+e.stage.slice(1)}</div>
              <div class="ecard-info">
                <div class="ecard-sector">${e.sector}</div>
                <div class="ecard-name">${e.name}</div>
                <div class="ecard-employees">${e.workers} workers · ${e.turnover} turnover</div>
              </div>
            </div>
            <div class="ecard-costs">
              ${Object.entries(e.cost).map(([pillar,cost]) => {
                const have = state.bars[pillar] || 0;
                const met = have >= cost;
                const pct = Math.min(100, Math.round((Math.min(have,cost)/MAX_BAR)*100));
                return `<div class="ecost ${met?'met':'unmet'}">
                  <div class="ecost-track"><div class="ecost-fill" style="width:${pct}%;background:${met?'#4A9B72':PILLAR_COLOURS[pillar]}"></div></div>
                  <div class="ecost-val">${cost}</div>
                  <div class="ecost-name">${PILLAR_LABELS[pillar]}</div>
                </div>`;
              }).join('')}
            </div>
            <div class="ecard-foot">
              ${affordable
                ? `<div class="ecard-status-ok">✓ You can afford this</div><button class="btn-attract" onclick="doAttract('${e.id}')">Attract →</button>`
                : `<div class="ecard-status-need">Need: ${Object.entries(e.cost).filter(([p,c])=>state.bars[p]<c).map(([p,c])=>`+${c-(state.bars[p]||0)} ${PILLAR_LABELS[p]}`).join(' · ')}</div><button class="btn-attract" disabled>Attract</button>`
              }
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="padding:16px">
        <button class="btn btn-full" onclick="showScreen('round')">← Back to Policy Market</button>
      </div>
    </div>
  </div>`;
}

function renderEcosystem() {
  const income = passiveIncome();
  const pushed = state.pushedPolicies.map(id => ALL_POLICIES.find(p => p.id === id)).filter(Boolean);
  return `
  <div class="screen" style="padding:0;align-items:stretch">
    <div class="inner" style="max-width:100%;padding:0">
      ${renderBrandBar('My Policy Ecosystem')}
      <div style="background:var(--white);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
        <div class="market-title">Policy Ecosystem</div>
        <button onclick="showScreen('round')" style="background:none;border:none;font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);cursor:pointer">← Back</button>
      </div>
      <div class="eco-passive-summary">
        ${Object.entries(income).map(([key,val]) => `
          <div class="eps-cell">
            <div class="eps-val ${val>0?'has-income':'zero'}" style="${val>0?`color:${PILLAR_COLOURS[key]}`:''}">
              ${val > 0 ? `+${val}` : '—'}
            </div>
            <div class="eps-label">${PILLAR_LABELS[key]}/rd</div>
          </div>`).join('')}
      </div>
      <div class="eco-section-head">Policies pushed · ${pushed.length} of 10 possible</div>
      ${pushed.length === 0 ? `<div style="padding:24px;text-align:center;font-family:'EB Garamond',serif;font-style:italic;color:var(--ink-faint)">No policies pushed yet.</div>` : ''}
      ${pushed.map((p,i) => `
        <div class="pushed-policy">
          <div class="pp-band" style="background:${PILLAR_COLOURS[p.pillar]}"></div>
          <div class="pp-body">
            <div class="pp-round">R${state.log.findIndex(l=>l.pushes.includes(p.id))+1||'?'}</div>
            <div>
              <div class="pp-pillar" style="color:${PILLAR_COLOURS[p.pillar]}">${PILLAR_LABELS[p.pillar]}</div>
              <div class="pp-name">${p.name}</div>
              ${p.suite ? `<span class="pp-suite-tag">◆ ${SUITES[p.suite]?.name} · S${p.stage}</span>` : ''}
            </div>
          </div>
          <div class="pp-passive">
            <div class="pp-passive-label">Passive income</div>
            <div class="pp-passive-val">${Object.entries(p.passive).map(([k,v])=>`+${v} ${PILLAR_LABELS[k]}`).join(' · ')} / round</div>
          </div>
        </div>`).join('')}
      <div class="eco-section-head" style="margin-top:4px">Programme Suites</div>
      ${Object.entries(SUITES).map(([key, suite]) => {
        const completed = state.suitesCompleted.includes(key);
        return `<div class="suite-progress-card">
          <div class="spc-top">
            <div class="spc-name">${suite.name}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <div class="spc-dots">
                ${suite.stages.map(sid => {
                  const done = state.pushedPolicies.includes(sid);
                  const curr = !done && suite.stages.slice(0,suite.stages.indexOf(sid)).every(s=>state.pushedPolicies.includes(s));
                  return `<div class="sp-dot${done?' done':curr?' current':''}"></div>`;
                }).join('')}
              </div>
              <div class="spc-bonus">${Object.entries(suite.bonus).map(([k,v])=>`+${v} ${PILLAR_LABELS[k]}`).join(' · ')}</div>
            </div>
          </div>
          <div class="spc-rows">
            ${suite.stages.map((sid,i) => {
              const p = ALL_POLICIES.find(x=>x.id===sid);
              const done = state.pushedPolicies.includes(sid);
              const next = !done && suite.stages.slice(0,i).every(s=>state.pushedPolicies.includes(s));
              return `<div class="spc-row">
                <div class="spc-status ${done?'done':next?'next':'locked'}"></div>
                <div class="spc-card-name">${p?.name||sid}</div>
                <div class="spc-stage">S${i+1}${done?' ✓':next?' · in market':' · locked'}</div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderOutcome() {
  const score = computeScore();
  const verdict = getVerdict(score);
  const pushedNames = state.pushedPolicies.map(id => {
    const p = ALL_POLICIES.find(x=>x.id===id);
    return p ? p.name : id;
  });
  return `
  <div class="screen">
    <div class="inner">
      ${renderBrandBar('Final verdict')}
      <div style="padding:36px 0 24px;border-bottom:2px solid var(--amber)">
        <div class="summit-eyebrow">Navapur · After ${TOTAL_ROUNDS} rounds</div>
        <div class="summit-title">${verdict.title}</div>
        <div class="summit-body">${verdict.body}</div>
        <div style="font-family:'EB Garamond',serif;font-size:48px;line-height:1;color:var(--amber);margin-bottom:4px">${score}</div>
        <div class="label-muted">Ecosystem Health Score / 100</div>
      </div>
      <div class="score-bar-section">
        ${Object.entries(state.bars).map(([key,val]) => {
          const pct = Math.round((val/MAX_BAR)*100);
          return `<div class="score-bar-row">
            <div class="score-bar-header">
              <div class="score-bar-label">${PILLAR_LABELS[key]}</div>
              <div class="score-bar-pct">${val} / ${MAX_BAR}</div>
            </div>
            <div class="dim-bar-wrap"><div class="dim-bar-fill" style="width:${pct}%;background:${PILLAR_COLOURS[key]}"></div></div>
          </div>`;
        }).join('')}
      </div>
      <div class="divider"></div>
      <div class="label-muted" style="margin-bottom:12px">Policies pushed · ${state.pushedPolicies.length}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px">
        ${pushedNames.map(n=>`<span style="font-size:10px;font-weight:600;border:1px solid var(--border);padding:4px 8px;color:var(--ink-mid)">${n}</span>`).join('')}
      </div>
      <div class="label-muted" style="margin-bottom:8px">Suites completed · ${state.suitesCompleted.length} of 6</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:32px">
        ${Object.entries(SUITES).map(([k,s])=>`<span style="font-size:10px;font-weight:600;border:1px solid ${state.suitesCompleted.includes(k)?'var(--amber)':'var(--border)'};padding:4px 8px;color:${state.suitesCompleted.includes(k)?'var(--amber)':'var(--ink-faint)'}">${state.suitesCompleted.includes(k)?'◆':' ○'} ${s.name}</span>`).join('')}
      </div>
      <button class="btn btn-primary btn-full" onclick="location.reload()">Play again →</button>
      <div style="padding-top:32px;border-top:1px solid var(--border);margin-top:32px">
        <div class="giz-note">First built with support from <em>GIZ</em></div>
        <div class="copyright-line">civic.games · Civic Games Lab<br>
          <a href="https://civic.games">civic.games</a>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Main render ────────────────────────────────────────────── */

function render() {
  const app = document.getElementById('app');
  switch (state.screen) {
    case 'intro':       app.innerHTML = renderIntro();       break;
    case 'howtoplay':   app.innerHTML = renderHowToPlay();   break;
    case 'round':       app.innerHTML = renderRound();       break;
    case 'enterprises': app.innerHTML = renderEnterprises(); break;
    case 'ecosystem':   app.innerHTML = renderEcosystem();   break;
    case 'outcome':     app.innerHTML = renderOutcome();     break;
    default:            app.innerHTML = renderIntro();
  }
  window.scrollTo(0, 0);
}

/* ── Actions (called from HTML onclick) ──────────────────────── */

function showScreen(name) {
  state.screen = name;
  render();
}

function startGame() {
  Object.assign(state, {
    screen: 'round', round: 1,
    bars: { ...STARTING_BARS },
    enterprises: [
      { ...ENTERPRISES[0] },
      { ...ENTERPRISES[1] },
      { ...ENTERPRISES[2] },
    ],
    pushedPolicies: [], suitesCompleted: [],
    roundPushes: [], roundAttraction: null,
    selectedPolicy: null, log: [],
  });
  drawMarketPool();
  render();
}

function selectPolicy(id) {
  state.selectedPolicy = id;
  render();
}

function doPushPolicy(id) {
  if (state.roundPushes.length >= POLICIES_PER_ROUND) return;
  pushPolicy(id);
  render();
}

function doAttract(enterpriseId) {
  const success = attractEnterprise(enterpriseId);
  if (success) {
    state.screen = 'round';
    render();
  }
}

function doEndRound() {
  if (state.roundPushes.length < POLICIES_PER_ROUND) return;
  endRound();
  render();
}

/* ── Boot ───────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  render();
});
