// ═══════════════════════════════════════════════════
// ROLES
// ═══════════════════════════════════════════════════
const ROLES = [
  { id:'govt', name:'Government Regulator', power:'Enforcer ++++', token_rule:'Extract 1 token from up to 2 opponents before bidding each round. You do not earn tokens passively.', desc:'You set the rules. You extract the resources. You are the most powerful player — and the most resented.', color:'#C84B31', powers:['Ban Hammer','Compliance Mandate','Fine Strike','Vetting Shield'] },
  { id:'opposition', name:'Opposition', power:'Enforcer ++++', token_rule:'Earn +1 token per round like other players, plus you may steal 1 token from any player on your turn.', desc:'You hold power accountable. You expose, block, and obstruct. You lose tokens to the Regulator but can take them back.', color:'#4D696D', powers:['Expose Scandal','Policy Roadblock','Mobilize Base','Appeals Court'] },
  { id:'tech', name:'Global Corporate Tech', power:'Market Shaper +++', token_rule:'Earn +1 token per round. You may steal 1 token from the Government on your turn.', desc:'You move faster than any regulator. You lock in users, bypass opponents, and scale regardless of the vote outcome.', color:'#2B4F6E', powers:['Platform Lock-In','User Analytics','Rapid Scale','Circumvention'] },
  { id:'smb', name:'Small Business', power:'Resilient ++', token_rule:'Earn +1 token per round. You are vulnerable to both Government extraction and Tech dominance.', desc:'You play the longest game. You survive by accumulating tokens, protecting your vote, and catching opponents off-guard.', color:'#6B5B2A', powers:['Bootstrap Surge','Fair Access Plea','Workaround Hack','Community Shield'] },
  { id:'civilian', name:'Civilian Representative', power:'Resilient +', token_rule:'Earn +1 token per round. Your vote is the swing vote every coalition wants.', desc:'You represent the people who bear the cost of every governance decision. Your voice is the one everyone underestimates.', color:'#3A6B4A', powers:['Grassroots Voice','Everyday Adaptation','Public Outcry','Collective Pushback'] },
  { id:'creator', name:'Content Creator', power:'Narrative Driver +', token_rule:'Earn +1 token per round. Your power is in the minority — you can flip outcomes when no one expects it.', desc:'You create the discourse everyone else reacts to. Your strongest moves come when you are losing.', color:'#7A3A6B', powers:['Viral Wave','Echo Chamber','Hashtag Shield','Cancel Callout'] },
];

// ═══════════════════════════════════════════════════
// POWER CARDS
// ═══════════════════════════════════════════════════
const ALL_POWERS = {
  'Ban Hammer':       { cost:5, timing:'Before Voting', effect:'The AI coalition loses 1 vote this round — their weakest voter abstains.', splinter_mod:0 },
  'Compliance Mandate':{ cost:3, timing:'Before Voting', effect:'Force the outcome: if the statement is Pro-splinter, the Anti vote is suppressed by 1. If Anti-splinter, the Pro vote is suppressed.', splinter_mod:+2 },
  'Fine Strike':      { cost:4, timing:'After Voting',  effect:'If you voted with the majority, gain +2 extra tokens this round.', splinter_mod:0 },
  'Vetting Shield':   { cost:2, timing:'Before Voting', effect:'Your vote counts double this round.', splinter_mod:0 },
  'Expose Scandal':   { cost:4, timing:'Before Voting', effect:'Reveal the AI coalition\'s intended vote before you cast yours — then you may change your vote.', splinter_mod:0 },
  'Policy Roadblock': { cost:5, timing:'After Voting',  effect:'If your side loses, the Splinter Index only advances by half the normal amount.', splinter_mod:0 },
  'Mobilize Base':    { cost:4, timing:'After Voting',  effect:'If you voted with the minority, gain +3 tokens instead of +1.', splinter_mod:0 },
  'Appeals Court':    { cost:3, timing:'Before Voting', effect:'Cancel the effect of the statement\'s lean modifier — the Splinter Index treats this statement as neutral regardless of outcome.', splinter_mod:0 },
  'Platform Lock-In': { cost:3, timing:'Before Voting', effect:'The AI coalition is split — their vote adds only +0.5 weight (rounded down).', splinter_mod:0 },
  'User Analytics':   { cost:2, timing:'Before Voting', effect:'You see the statement\'s exact Splinter impact before voting.', splinter_mod:0 },
  'Rapid Scale':      { cost:5, timing:'After Voting',  effect:'If you are in the minority, add +1 phantom vote to your side — may flip the outcome.', splinter_mod:0 },
  'Circumvention':    { cost:4, timing:'Before Voting', effect:'Reduce the Splinter Index impact of this round by 3 points, regardless of outcome.', splinter_mod:-3 },
  'Bootstrap Surge':  { cost:5, timing:'After Voting',  effect:'If you voted with the minority, gain +4 tokens this round.', splinter_mod:0 },
  'Fair Access Plea': { cost:2, timing:'Before Voting', effect:'The AI coalition must vote honestly this round — no strategic flip.', splinter_mod:0 },
  'Workaround Hack':  { cost:4, timing:'Before Voting', effect:'Protect your token count — no extraction or drain can reduce your tokens this round.', splinter_mod:0 },
  'Community Shield': { cost:3, timing:'Before Voting', effect:'Reduce this round\'s Splinter Index change by 2 points.', splinter_mod:-2 },
  'Grassroots Voice': { cost:3, timing:'Before Voting', effect:'Add +1 vote to your side. If you are already in majority, gain +1 token instead.', splinter_mod:0 },
  'Everyday Adaptation':{ cost:5, timing:'After Voting', effect:'Gain +1 token regardless of whether your side won or lost.', splinter_mod:0 },
  'Public Outcry':    { cost:2, timing:'Before Voting', effect:'The AI coalition\'s most extreme position is moderated — their Splinter-direction vote weakens by 1.', splinter_mod:0 },
  'Collective Pushback':{ cost:3, timing:'Before Voting',effect:'Reduce this round\'s Splinter change by 2.', splinter_mod:-2 },
  'Viral Wave':       { cost:5, timing:'After Voting',  effect:'If you voted with the minority, add +2 phantom votes — this can flip a 3-vote deficit.', splinter_mod:0 },
  'Echo Chamber':     { cost:2, timing:'Before Voting', effect:'If the statement is Anti-splinter and you vote Pro, gain +2 tokens — the counterintuitive play pays.', splinter_mod:0 },
  'Hashtag Shield':   { cost:3, timing:'Any',           effect:'Gain +2 tokens immediately, regardless of round outcome.', splinter_mod:0 },
  'Cancel Callout':   { cost:4, timing:'Before Voting', effect:'If your opponent used a Power this round, cancel its Splinter modifier effect.', splinter_mod:0 },
  'Evidence Drop':    { cost:3, timing:'Before Voting', effect:'This round, the counterintuitive position is surfaced — the statement\'s lean is inverted for scoring purposes.', splinter_mod:0 },
  'White Paper':      { cost:5, timing:'After Voting',  effect:'Regardless of outcome, the Splinter Index does not change this round — the statement is neutralised.', splinter_mod:-99 },
  'Testimony':        { cost:4, timing:'After Voting',  effect:'If your side lost, add +1 phantom vote retroactively — may change the outcome record (but not the Splinter effect).', splinter_mod:0 },
  'Expert Testimony': { cost:1, timing:'Before Voting', effect:'Gain +1 token and see the statement\'s full scoring breakdown before voting.', splinter_mod:0 },
};

// ═══════════════════════════════════════════════════
// STATEMENTS
// ═══════════════════════════════════════════════════
const STATEMENTS = [
  {
    category:'Cloud Computing', layer:'Physical Layer',
    text:'Cross-border hosting should follow documented standards so that predictability ensures stability in service delivery.',
    lean:'Anti-splinter', contest:'Local standards maintain governance; but standardisation promotes international interoperability.',
    news:'Three hyperscalers have jointly issued a position paper arguing that national cloud procurement rules are creating technical incompatibilities that raise costs by 30% for cross-border operations.',
    pro_arg:'Documented standards create predictable rules — which actually strengthen local governance by making compliance explicit and enforceable.',
    anti_arg:'Once you accept external standards, you cede the right to adapt them. Your cloud procurement rules become subject to external review — a form of regulatory capture through interoperability.',
    scores:{welfare:+4,sovereignty:-3,openness:+8,trust:+4}, splinter:-5,
    ci:'This is an anti-splinter statement — but voting Pro on it reduces fragmentation. The trap is assuming that "documenting standards" means surrendering sovereignty. It does not. It means making your requirements legible to global partners — which is the condition for any trusted data corridor.',
    rw:['EU Cloud Rules of Behaviour (2023) set cross-border hosting standards without requiring data to leave EU jurisdiction','India\'s MeitY cloud empanelment system is a documented standard framework already in use','AWS, Azure, and GCP all operate under national certification regimes in India — the standard exists, it just is not coordinated']
  },
  {
    category:'Social Media', layer:'Semantic Layer',
    text:'Large social networks must maintain moderation records subject to oversight, so that transparency supports accountability.',
    lean:'Pro-splinter', contest:'Enables transparency across jurisdictions for global trust — but creates separate national moderation regimes.',
    news:'A parliamentary committee has found that a major platform removed 40,000 political posts in your country in 90 days — with no explanation, no appeals process, and no public record.',
    pro_arg:'Without a moderation record, there is no accountability. Governments, courts, and citizens cannot challenge decisions they cannot see. Oversight is the precondition of legitimacy.',
    anti_arg:'Once you require a domestic moderation record, you have created a national moderation regime. The platform must now maintain separate records for each jurisdiction — and each government will demand access to the others\' records.',
    scores:{welfare:+3,sovereignty:+7,openness:-2,trust:+6}, splinter:+5,
    ci:'This appears to be a straightforward accountability measure — who could argue against transparency? But every country that mandates its own moderation record creates a separate compliance environment. The platform becomes a different product in each market. That is the mechanism of commercial fragmentation.',
    rw:['India\'s IT Rules 2021 require monthly compliance reports — platforms now maintain India-specific moderation records, separate from global reports','The EU\'s DSA created a unified moderation reporting framework — the difference is it applies across 27 countries simultaneously, not 27 separate regimes','Germany\'s NetzDG (2017) was the first national moderation law — it is now cited as the model other authoritarian governments use to justify their own versions']
  },
  {
    category:'Communication', layer:'Protocol Layer',
    text:'All messaging services must implement traceability mechanisms under regulated oversight to maintain accountability.',
    lean:'Pro-splinter', contest:'Traceability could integrate with international compliance frameworks, but breaks end-to-end encryption architecture.',
    news:'Your national security agency has linked a series of coordinated attacks to encrypted messaging chains. They are requesting legislative authority to mandate message traceability for all services operating in your country.',
    pro_arg:'Traceability is not surveillance — it is the minimum requirement for law enforcement to function in digital spaces. Without it, end-to-end encryption becomes a shield for organised crime and terrorism.',
    anti_arg:'There is no technical mechanism to make messages traceable that does not also make them accessible to every government the platform operates under. Traceability breaks encryption by design. You would be mandating a security flaw for 300 million users.',
    scores:{welfare:-6,sovereignty:+5,openness:-8,trust:-5}, splinter:+12,
    ci:'The security argument is compelling — and technically broken. WhatsApp\'s 2021 India traceability battle ended with the company explaining, correctly, that traceability requires breaking end-to-end encryption. Once broken in India, it is broken everywhere — the encryption is mathematical, not jurisdictional. This is one of the clearest cases where the "strong" option produces the worst security outcome.',
    rw:['India\'s WhatsApp traceability demand (2021) led to WhatsApp filing a constitutional challenge — the case is ongoing','Brazil mandated WhatsApp traceability in 2023 — security researchers immediately demonstrated the attack surface this created','The Five Eyes intelligence alliance explicitly opposes mandated traceability because it weakens their own secure communications infrastructure']
  },
  {
    category:'Health', layer:'Physical Layer',
    text:'Health tracking apps must store wellness data under certified oversight that mandates local data storage to protect personal rights.',
    lean:'Pro-splinter', contest:'Certification can enable international trust frameworks — but local storage mandates fragment the health data ecosystem.',
    news:'A data broker has been caught selling anonymised-but-re-identifiable health app data to insurance companies. The data originated from an app based in another jurisdiction — your data protection law had no reach.',
    pro_arg:'When your citizens\' health data leaves your jurisdiction, you lose the ability to protect it. Local storage is not nationalism — it is the precondition for any enforceable privacy right.',
    anti_arg:'Mandated local storage kills the global health research ecosystem. Clinical trial data, epidemiological modelling, and pandemic response all depend on cross-border health data flows. Your mandate will make your country a data island — at real cost to public health.',
    scores:{welfare:+3,sovereignty:+8,openness:-5,trust:+4}, splinter:+5,
    ci:'This is the narrow localisation case. The key word is "health tracking apps" — fitness and wellness data — not clinical records. A targeted mandate for this category is defensible. The mistake is extrapolating to all health data — that produces the ecosystem damage. Narrow scope, precisely targeted, is the most calibrated governance posture.',
    rw:['India\'s DPDPA (2023) treats health data as "sensitive personal data" with stricter storage requirements — consistent with this statement','South Korea\'s Personal Information Protection Act mandates local storage for health records with narrow cross-border exceptions','The EU\'s GDPR allows cross-border health data flows only under adequacy decisions — creating the framework this statement is gesturing toward']
  },
  {
    category:'International Trade', layer:'Protocol Layer',
    text:'Trade agreements must prioritise interoperability of digital services, promoting cooperative models that support cross-border investment and growth.',
    lean:'Anti-splinter', contest:'Cross-border harmonisation reduces fragmentation — but interoperability standards may conflict with domestic regulatory priorities.',
    news:'A bilateral trade deal is being finalised. Your trading partner is insisting on a digital services chapter that would require mutual recognition of platform standards — effectively harmonising your content moderation rules with theirs.',
    pro_arg:'Interoperability is what makes the digital economy possible. Every standard you refuse to harmonise is a transaction cost you impose on your exporters, your consumers, and your startups. Integration is not surrender — it is market access.',
    anti_arg:'Mutual recognition of standards means your regulations are effectively set in negotiations with a foreign government. When your trading partner changes its platform rules, you change yours. That is not sovereignty — that is regulatory capture with a trade treaty wrapper.',
    scores:{welfare:+6,sovereignty:-5,openness:+10,trust:+5}, splinter:-7,
    ci:'The strongest anti-splinter option is also the most politically fraught — it requires accepting that your regulatory autonomy is constrained by the terms of the trade deal. The countries that have made this trade — Japan-EU digital adequacy, APEC CBPR — have generally benefited economically. The countries that have refused — Russia, China — have built parallel ecosystems at high domestic cost.',
    rw:['The CPTPP\'s digital trade chapter (2018) includes interoperability requirements — Singapore and Japan have used it to build trusted data corridors','India declined to join RCEP partly over digital services provisions — a sovereignty decision with significant trade access costs','The EU-South Korea digital trade agreement (2023) is the most recent example of mutual recognition producing real interoperability']
  },
  {
    category:'Cybersecurity', layer:'Physical Layer',
    text:'Critical infrastructure operators like healthcare, security, finance, etc. must submit to certified cybersecurity audits annually to government authorities for ensuring resilience in essential services.',
    lean:'Pro-splinter', contest:'National audit ensures sovereignty — but certification standards could be recognised globally.',
    news:'A ransomware attack has taken three hospital networks offline for six days. The attacker used a vulnerability in a foreign-made medical device management system — one that had not been audited under any national framework.',
    pro_arg:'Critical infrastructure is sovereign territory in digital form. A hospital that cannot be audited by the national government is a hospital whose security is governed by whoever made the software — which may be a geopolitical adversary.',
    anti_arg:'National cybersecurity audits that are not internationally recognised create parallel certification ecosystems. Every vendor operating in multiple markets must certify separately in each jurisdiction — which raises costs and creates gaps where vendors choose not to operate.',
    scores:{welfare:+5,sovereignty:+7,openness:-3,trust:+6}, splinter:+4,
    ci:'This is a case where pro-splinter and pro-welfare point in the same direction — and the governance question is not whether to audit but whether the audit standard is national or internationally recognised. The best governance outcome is mandatory audit under an internationally recognised standard (ISO 27001, NIST). The worst is a proprietary national standard that creates certification overhead for every vendor.',
    rw:['India\'s CERT-In mandatory reporting rules (2022) created a new audit requirement with a 6-hour breach notification window — vendors complained but ultimately complied','The EU\'s NIS2 Directive (2022) creates critical infrastructure cybersecurity requirements — but under a single EU-wide standard','Singapore\'s Cybersecurity Act mandates audits for "critical information infrastructure" — but accepts internationally recognised certifications']
  },
  {
    category:'News', layer:'Semantic Layer',
    text:'Content platforms should apply uniform provenance labelling across articles so that traceability strengthens media integrity.',
    lean:'Pro-splinter', contest:'Enables cross-border verification consistency — but uniform standards may not reflect local media contexts.',
    news:'A study has found that 62% of the misinformation circulating on major platforms in your country originates from three foreign news aggregators that consistently label fabricated content as "verified reporting."',
    pro_arg:'Provenance labelling is the minimum infrastructure for media literacy. Without it, citizens cannot distinguish state-sponsored content from independent journalism, or AI-generated text from original reporting.',
    anti_arg:'"Uniform" provenance labelling means someone decides what "verified" means — and that someone will be the platform, the government, or an international body. Each of these is a different political choice masquerading as a technical standard.',
    scores:{welfare:+4,sovereignty:+4,openness:-2,trust:+5}, splinter:+3,
    ci:'The trap here is assuming "provenance labelling" is neutral. It is not — it is a speech governance intervention that determines which sources are "verified." The question is not whether to label, but who controls the labelling schema. Government-controlled labelling produces a state media advantage. Platform-controlled labelling produces an algorithmic bias. International standards are the least bad option — but they do not exist yet.',
    rw:['The EU\'s Code of Practice on Disinformation requires provenance labelling from major platforms — but the standard is co-designed, not government-mandated','India\'s Fact Check Unit (2023) was struck down by the Bombay High Court as unconstitutional — the state cannot be the arbiter of true and false','Twitter\'s Community Notes system is an example of crowdsourced provenance labelling — with well-documented political capture problems']
  },
  {
    category:'E-commerce', layer:'Physical Layer',
    text:'Market operators should enable standardised onboarding to lower entry barriers and allow sellers access to broader consumer bases.',
    lean:'Anti-splinter', contest:'Standards may improve local compliance — but also expand access internationally, potentially favouring cross-border operations.',
    news:'A parliamentary inquiry has found that small domestic retailers face 14 separate onboarding processes across major e-commerce platforms — each with different documentation requirements, payment integrations, and dispute resolution systems.',
    pro_arg:'Standardised onboarding is infrastructure for small business. Without it, the friction cost of participating in digital commerce falls entirely on sellers — and falls hardest on the smallest ones. This is what market access actually looks like.',
    anti_arg:'Standardised onboarding means cross-border platforms can enter your market with zero local adaptation cost. You remove the friction that currently advantages domestic platforms. The standard that benefits your SMEs today is the entry ramp for foreign platforms tomorrow.',
    scores:{welfare:+7,sovereignty:-4,openness:+6,trust:+4}, splinter:-4,
    ci:'This is the clearest welfare-versus-sovereignty trade-off in the game. Standardisation benefits domestic small businesses in the short term — they gain market access — and benefits foreign platforms in the medium term, as the friction protecting domestic incumbents falls away. The governance question is who controls the standard, not whether to have one.',
    rw:['India\'s Open Network for Digital Commerce (ONDC) is an attempt to create standardised onboarding that is domestically controlled — a sovereign interoperability layer','The EU\'s Digital Markets Act (2022) mandates interoperability for "gatekeepers" — the standard is EU-controlled, not platform-controlled','Amazon\'s seller onboarding process is effectively the global standard in many markets — a private standard that no government designed but every government operates within']
  },
];

// ═══════════════════════════════════════════════════
// AGENDAS (per role)
// ═══════════════════════════════════════════════════
const AGENDAS = {
  govt: [
    { id:'a1', text:'Cast a Pro vote on at least 3 sovereignty-advancing statements', check: s => s.proVoteCount >= 3 && s.sovereigntyVotes >= 3 },
    { id:'a2', text:'Keep the Splinter Index below 40% after round 4', check: s => s.round >= 4 && s.splinter < 40 },
    { id:'a3', text:'End with Sovereignty score above 70', check: s => s.scores.sovereignty > 70 },
    { id:'a4', text:'Use a power card in at least 4 rounds', check: s => s.powerUseCount >= 4 },
    { id:'a5', text:'Vote Anti on at least 2 Anti-splinter statements', check: s => s.antiOnAntiSplinter >= 2 },
    { id:'a6', text:'Finish with more than 6 tokens', check: s => s.tokens > 6 },
  ],
  opposition: [
    { id:'b1', text:'Vote Anti on at least 3 Pro-splinter statements', check: s => s.antiOnProSplinter >= 3 },
    { id:'b2', text:'Keep Trust score above 60 throughout', check: s => s.scores.trust > 60 },
    { id:'b3', text:'End with Welfare score above 65', check: s => s.scores.welfare > 65 },
    { id:'b4', text:'Use a power card in at least 3 rounds', check: s => s.powerUseCount >= 3 },
    { id:'b5', text:'Vote with the majority in at least 5 rounds', check: s => s.majorityVoteCount >= 5 },
    { id:'b6', text:'Keep the Splinter Index below 35%', check: s => s.splinter < 35 },
  ],
  tech: [
    { id:'c1', text:'Vote Pro on at least 3 Anti-splinter statements', check: s => s.proOnAntiSplinter >= 3 },
    { id:'c2', text:'End with Openness score above 65', check: s => s.scores.openness > 65 },
    { id:'c3', text:'Use a power card in at least 3 rounds', check: s => s.powerUseCount >= 3 },
    { id:'c4', text:'Finish with more than 8 tokens', check: s => s.tokens > 8 },
    { id:'c5', text:'Keep Sovereignty score below 60', check: s => s.scores.sovereignty < 60 },
    { id:'c6', text:'Vote with the majority in at least 6 rounds', check: s => s.majorityVoteCount >= 6 },
  ],
  smb: [
    { id:'d1', text:'End with Welfare score above 65', check: s => s.scores.welfare > 65 },
    { id:'d2', text:'Vote with the majority in at least 5 rounds', check: s => s.majorityVoteCount >= 5 },
    { id:'d3', text:'Keep your token count above 4 after round 6', check: s => s.round >= 6 && s.tokens > 4 },
    { id:'d4', text:'Use a power card in at least 3 rounds', check: s => s.powerUseCount >= 3 },
    { id:'d5', text:'End with Trust score above 65', check: s => s.scores.trust > 65 },
    { id:'d6', text:'Keep Splinter Index below 40%', check: s => s.splinter < 40 },
  ],
  civilian: [
    { id:'e1', text:'End with Welfare score above 70', check: s => s.scores.welfare > 70 },
    { id:'e2', text:'Keep Splinter Index below 30%', check: s => s.splinter < 30 },
    { id:'e3', text:'Vote Anti on at least 3 Pro-splinter statements', check: s => s.antiOnProSplinter >= 3 },
    { id:'e4', text:'End with Trust score above 65', check: s => s.scores.trust > 65 },
    { id:'e5', text:'Vote with the majority in at least 5 rounds', check: s => s.majorityVoteCount >= 5 },
    { id:'e6', text:'Use a power card in at least 2 rounds', check: s => s.powerUseCount >= 2 },
  ],
  creator: [
    { id:'f1', text:'End with Openness score above 65', check: s => s.scores.openness > 65 },
    { id:'f2', text:'Vote Pro on at least 4 Anti-splinter statements', check: s => s.proOnAntiSplinter >= 4 },
    { id:'f3', text:'Use a power card in at least 3 rounds', check: s => s.powerUseCount >= 3 },
    { id:'f4', text:'Keep Trust score above 60', check: s => s.scores.trust > 60 },
    { id:'f5', text:'End with Welfare score above 60', check: s => s.scores.welfare > 60 },
    { id:'f6', text:'Keep Splinter Index below 35%', check: s => s.splinter < 35 },
  ],
};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
let G = {};
function resetState() {
  G = {
    role: null,
    tokens: 2,
    scores: { welfare:50, sovereignty:50, openness:50, trust:50 },
    splinter: 0,
    round: 0, // 0-indexed, 0..7
    totalRounds: 8,
    currentPhase: 0,
    selectedPower: undefined, // undefined = not chosen yet, null = pass
    chosenPower: null, // confirmed power for this round
    playerVote: null, // 'pro' or 'anti'
    agendas: [],
    // tracking stats for agendas
    proVoteCount: 0,
    antiVoteCount: 0,
    sovereigntyVotes: 0,
    proOnAntiSplinter: 0,
    antiOnProSplinter: 0,
    antiOnAntiSplinter: 0,
    majorityVoteCount: 0,
    powerUseCount: 0,
    tipped: false,
    agendaFulfilled: 0,
  };
}

// ═══════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════
function buildRoleGrid() {
  const grid = document.getElementById('roleGrid');
  grid.innerHTML = '';
  ROLES.forEach(r => {
    const el = document.createElement('div');
    el.className = 'role-card';
    el.id = 'role-' + r.id;
    el.innerHTML = `<div class="role-name">${r.name}</div><div class="role-power">${r.power}</div><div class="role-desc">${r.desc}</div><div style="font-size:11px;color:var(--muted);margin-top:6px;font-style:italic">${r.token_rule}</div>`;
    el.onclick = () => selectRole(r.id);
    grid.appendChild(el);
  });
}

function selectRole(id) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('role-' + id).classList.add('selected');
  G.role = id;
  document.getElementById('startBtn').disabled = false;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  if (!G.role) return;
  const role = ROLES.find(r => r.id === G.role);
  G.agendas = (AGENDAS[G.role] || AGENDAS.civilian).map(a => ({ ...a, done: false }));
  // Shuffle statement order every game — no two games start the same
  G.stmtOrder = shuffleArray(STATEMENTS.map((_, i) => i));
  document.getElementById('hud').style.display = 'flex';
  document.getElementById('hudRole').textContent = role.name;
  updateHUD();
  loadRound();
  showScreen('round');
}

// ═══════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════
function updateHUD() {
  document.getElementById('hudTokens').textContent = G.tokens;
  document.getElementById('hudRound').textContent = G.round + 1;
  const sp = Math.round(G.splinter);
  document.getElementById('hudSplinter').textContent = sp + '%';
  document.getElementById('splinterFill').style.width = Math.min(100, sp) + '%';
  document.getElementById('hudSplinter').style.color = sp >= 40 ? 'var(--red)' : sp >= 25 ? 'var(--amber)' : 'var(--cream)';
  if (typeof refreshSidebarSplinter === 'function') refreshSidebarSplinter();
  const fulfilled = G.agendas.filter(a => a.done).length;
  G.agendaFulfilled = fulfilled;
  document.getElementById('hudAgendas').textContent = fulfilled + '/6';
}

// ═══════════════════════════════════════════════════
// ROUND LOGIC
// ═══════════════════════════════════════════════════
function loadRound() {
  G.selectedPower = undefined;
  G.chosenPower = null;
  G.playerVote = null;
  const stmtIdx = G.stmtOrder ? G.stmtOrder[G.round] : G.round;
  const stmt = STATEMENTS[stmtIdx];
  const role = ROLES.find(r => r.id === G.role);

  // Header
  document.getElementById('roundBadge').textContent = `Round ${G.round + 1} of ${G.totalRounds}`;
  document.getElementById('roundCat').textContent = stmt.category;
  document.getElementById('roundLayer').textContent = stmt.layer;

  // Phase dots
  for (let i = 0; i < 5; i++) {
    document.getElementById('pd' + i).className = 'phase-dot';
  }

  // Statement
  document.getElementById('roundNewsTxt').textContent = stmt.news;
  document.getElementById('stmtText').textContent = stmt.text;
  document.getElementById('stmtLean').textContent = stmt.lean;
  document.getElementById('stmtLean').className = 'statement-lean ' + (stmt.lean === 'Anti-splinter' ? 'lean-anti' : 'lean-pro');
  document.getElementById('stmtContest').textContent = 'Contestability: ' + stmt.contest;

  // Arguments
  document.getElementById('argGrid').innerHTML = `
    <div class="arg-card pro">
      <div class="arg-label">Pro argument</div>
      <p>${stmt.pro_arg}</p>
    </div>
    <div class="arg-card anti">
      <div class="arg-label">Anti argument</div>
      <p>${stmt.anti_arg}</p>
    </div>`;

  // Token income (regulator extracts; others earn)
  if (G.round > 0) {
    if (role.id === 'govt') {
      G.tokens += 2; // extracts from 2 opponents
    } else {
      G.tokens += 1;
    }
  }

  // Build power market (show role's 4 powers, 3 at random available)
  buildPowerMarket(role);

  updateHUD();
  document.getElementById('tokenDisplay').textContent = G.tokens;
  goPhase(0);
}

function buildPowerMarket(role) {
  const market = document.getElementById('powerMarket');
  market.innerHTML = '';
  // Show 3 of the role's powers
  const available = role.powers.slice(0, 3);
  available.forEach(pname => {
    const p = ALL_POWERS[pname];
    const locked = G.tokens < p.cost;
    const el = document.createElement('div');
    el.className = 'power-card' + (locked ? ' locked' : '');
    el.id = 'pc-' + pname.replace(/\s/g,'_');
    el.innerHTML = `<div class="power-cost">${p.cost}🪙</div><div class="power-timing">${p.timing}</div><div class="power-name">${pname}</div><div class="power-effect">${p.effect}</div>`;
    if (!locked) el.onclick = () => selectPower(pname);
    market.appendChild(el);
  });
}

function selectPower(name) {
  G.selectedPower = name;
  document.querySelectorAll('.power-card').forEach(c => c.classList.remove('chosen'));
  document.getElementById('powerNoneBtn').classList.remove('chosen');
  if (name === null) {
    document.getElementById('powerNoneBtn').classList.add('chosen');
  } else if (name) {
    const el = document.getElementById('pc-' + name.replace(/\s/g,'_'));
    if (el) el.classList.add('chosen');
  }
  document.getElementById('powerConfirmBtn').disabled = false;
}

function confirmPower() {
  if (G.selectedPower === undefined) return;
  G.chosenPower = G.selectedPower;
  if (G.chosenPower && G.chosenPower !== null) {
    const p = ALL_POWERS[G.chosenPower];
    G.tokens -= p.cost;
    G.powerUseCount++;
    updateHUD();
    document.getElementById('tokenDisplay').textContent = G.tokens;
  }
  goPhase(1);
}

function castVote(v) {
  G.playerVote = v;
  document.getElementById('votePro').classList.toggle('selected', v === 'pro');
  document.getElementById('voteAnti').classList.toggle('selected', v === 'anti');
  document.getElementById('voteConfirmBtn').disabled = false;
}

function getCurrentStatement() {
  const stmtIdx = G.stmtOrder ? G.stmtOrder[G.round] : G.round;
  return STATEMENTS[stmtIdx];
}

function getAIVoteForStatement(stmt) {
  return stmt.lean === 'Anti-splinter' ? 'pro' : 'anti';
}

function buildActivePowerHtml() {
  if (!G.chosenPower) return '';
  const p = ALL_POWERS[G.chosenPower];
  if (!p) return '';
  const stmt = getCurrentStatement();
  const notes = [];
  if (G.chosenPower === 'Expose Scandal') {
    notes.push(`AI intended vote: <strong>${getAIVoteForStatement(stmt).toUpperCase()}</strong>`);
  }
  if (G.chosenPower === 'User Analytics' || G.chosenPower === 'Expert Testimony') {
    notes.push(`Statement Splinter impact: <strong>${stmt.splinter > 0 ? '+' : ''}${stmt.splinter}%</strong>`);
  }
  return `<div class="active-power-banner-inner"><div class="active-power-kicker">Active Power</div><div class="active-power-title">${G.chosenPower}</div><div class="active-power-meta">${p.timing}</div><div class="active-power-desc">${p.effect}</div>${notes.map(n => `<div class="active-power-note">${n}</div>`).join('')}</div>`;
}

function applyBeforeVoting(ctx) {
  if (!ctx.powerName) return ctx;

  if (ctx.power.timing === 'Before Voting' || ctx.power.timing === 'Any') {
    if (ctx.power.splinter_mod) {
      const prev = ctx.splinterMod;
      ctx.splinterMod += ctx.power.splinter_mod;
      if (ctx.power.splinter_mod !== 0) {
        ctx.powerLog.push(`Splinter modifier: ${prev > 0 ? '+' : ''}${prev} → ${ctx.splinterMod > 0 ? '+' : ''}${ctx.splinterMod}`);
      }
    }

    switch (ctx.powerName) {
      case 'Ban Hammer': {
        const prev = ctx.aiVotes;
        ctx.aiVotes = Math.max(0, ctx.aiVotes - 1);
        ctx.powerLog.push(`AI votes: ${prev}→${ctx.aiVotes}`);
        break;
      }
      case 'Compliance Mandate': {
        const prev = ctx.aiVotes;
        ctx.aiVotes = Math.max(0, ctx.aiVotes - 1);
        ctx.powerLog.push(`Compliance Mandate suppressed opposition vote: AI votes ${prev}→${ctx.aiVotes}`);
        break;
      }
      case 'Vetting Shield': {
        const prev = ctx.playerVotes;
        ctx.playerVotes += 1;
        ctx.powerLog.push(`Your vote doubled: player votes ${prev}→${ctx.playerVotes}`);
        break;
      }
      case 'Grassroots Voice': {
        const prev = ctx.playerVotes;
        ctx.playerVotes += 1;
        ctx.powerLog.push(`Grassroots support added: player votes ${prev}→${ctx.playerVotes}`);
        break;
      }
      case 'Platform Lock-In':
      case 'Public Outcry': {
        const prev = ctx.aiVotes;
        ctx.aiVotes = Math.max(0, ctx.aiVotes - 1);
        ctx.powerLog.push(`AI coalition weakened: AI votes ${prev}→${ctx.aiVotes}`);
        break;
      }
      case 'Community Shield':
      case 'Collective Pushback':
      case 'Circumvention': {
        ctx.powerLog.push(`Round splinter pressure reduced by ${Math.abs(ctx.power.splinter_mod)}.`);
        break;
      }
      case 'Expose Scandal': {
        ctx.flags.revealedAIVote = true;
        ctx.powerLog.push(`AI intended vote revealed: ${ctx.aiVote.toUpperCase()}.`);
        break;
      }
      case 'Appeals Court': {
        ctx.flags.neutralizedStatement = true;
        ctx.powerLog.push('Statement lean neutralized for Splinter Index this round.');
        break;
      }
      case 'Fair Access Plea': {
        ctx.flags.forcedHonestAI = true;
        ctx.powerLog.push(`AI locked to honest vote: ${ctx.aiVote.toUpperCase()}.`);
        break;
      }
      case 'Workaround Hack': {
        ctx.flags.tokenProtected = true;
        ctx.powerLog.push('Token-protection active for this round.');
        break;
      }
      case 'Cancel Callout': {
        const prev = ctx.splinterMod;
        ctx.splinterMod = 0;
        ctx.powerLog.push(`Splinter modifier effects cancelled: ${prev > 0 ? '+' : ''}${prev}→0`);
        break;
      }
      case 'Evidence Drop': {
        ctx.flags.invertLeanForScoring = true;
        ctx.powerLog.push('Statement lean inverted for score logic this round.');
        break;
      }
      case 'Echo Chamber': {
        ctx.flags.echoChamberEligible = true;
        ctx.powerLog.push('Echo Chamber condition armed for post-vote token check.');
        break;
      }
      case 'User Analytics': {
        ctx.flags.revealedSplinter = true;
        ctx.powerLog.push(`Statement Splinter impact revealed: ${ctx.stmt.splinter > 0 ? '+' : ''}${ctx.stmt.splinter}%`);
        break;
      }
      case 'Expert Testimony': {
        ctx.flags.revealedSplinter = true;
        ctx.tokenBonus += 1;
        ctx.powerLog.push(`Expert Testimony: +1 token and full round breakdown preview.`);
        break;
      }
      default:
        break;
    }
  }

  return ctx;
}

function applyAfterVoting(ctx) {
  if (!ctx.powerName) return ctx;

  if (ctx.power.timing === 'After Voting' || ctx.power.timing === 'Any') {
    switch (ctx.powerName) {
      case 'Bootstrap Surge':
        if (!ctx.playerInMajority) {
          ctx.tokenBonus += 4;
          ctx.powerLog.push('Bootstrap Surge: +4 tokens for minority vote.');
        }
        break;
      case 'Mobilize Base':
        if (!ctx.playerInMajority) {
          ctx.tokenBonus += 3;
          ctx.powerLog.push('Mobilize Base: +3 tokens for minority vote.');
        }
        break;
      case 'Everyday Adaptation':
        ctx.tokenBonus += 1;
        ctx.powerLog.push('Everyday Adaptation: +1 token regardless of outcome.');
        break;
      case 'Viral Wave':
        if (!ctx.playerInMajority) {
          const prev = ctx.playerVotes;
          ctx.playerVotes += 2;
          ctx.flags.recomputeMajority = true;
          ctx.powerLog.push(`Viral Wave phantom votes: player votes ${prev}→${ctx.playerVotes}`);
        }
        break;
      case 'Rapid Scale':
        if (!ctx.playerInMajority) {
          const prev = ctx.playerVotes;
          ctx.playerVotes += 1;
          ctx.flags.recomputeMajority = true;
          ctx.powerLog.push(`Rapid Scale phantom vote: player votes ${prev}→${ctx.playerVotes}`);
        }
        break;
      case 'Testimony':
        if (!ctx.playerInMajority) {
          const prev = ctx.playerVotes;
          ctx.playerVotes += 1;
          ctx.flags.recomputeMajority = true;
          ctx.flags.testimonyNoSplinterFlip = true;
          ctx.powerLog.push(`Testimony retroactive vote: player votes ${prev}→${ctx.playerVotes} (record only).`);
        }
        break;
      case 'Fine Strike':
        if (ctx.playerInMajority) {
          ctx.tokenBonus += 2;
          ctx.powerLog.push('Fine Strike: +2 tokens for majority vote.');
        }
        break;
      case 'Hashtag Shield':
        ctx.tokenBonus += 2;
        ctx.powerLog.push('Hashtag Shield: +2 tokens.');
        break;
      case 'Policy Roadblock':
        if (!ctx.playerInMajority && ctx.rawSplinter > 0) {
          const prev = ctx.rawSplinter;
          ctx.rawSplinter = Math.ceil(ctx.rawSplinter * 0.5);
          ctx.powerLog.push(`Policy Roadblock halved splinter advance: +${prev}%→+${ctx.rawSplinter}%`);
        }
        break;
      case 'White Paper':
        if (ctx.rawSplinter !== 0) {
          ctx.rawSplinter = 0;
        }
        ctx.powerLog.push('White Paper neutralized Splinter Index change this round.');
        break;
      default:
        break;
    }
  }

  if (ctx.flags.echoChamberEligible && ctx.stmt.lean === 'Anti-splinter' && ctx.vote === 'pro') {
    ctx.tokenBonus += 2;
    ctx.powerLog.push('Echo Chamber trigger met: +2 tokens for counterintuitive vote.');
  }

  return ctx;
}

// ═══════════════════════════════════════════════════
// OUTCOME RESOLUTION
// ═══════════════════════════════════════════════════
function resolveRound() {
  const stmt = getCurrentStatement();
  const vote = G.playerVote;

  // AI coalition votes — strategic but beatable
  // Lean toward the statement's own direction, with some variance
  const aiVote = getAIVoteForStatement(stmt);

  // Determine majority (simplified: player + AI coalition = 3 votes, player has 1, AI has 2)
  let ctx = {
    stmt,
    vote,
    aiVote,
    playerVotes: 1,
    aiVotes: 2,
    splinterMod: 0,
    tokenBonus: 0,
    powerName: G.chosenPower,
    power: G.chosenPower ? ALL_POWERS[G.chosenPower] : null,
    powerLog: [],
    flags: {},
    rawSplinter: stmt.splinter,
    majorityVote: null,
    playerInMajority: false,
  };

  ctx = applyBeforeVoting(ctx);

  const sameSide = vote === aiVote;
  ctx.majorityVote = sameSide ? vote : (ctx.playerVotes > ctx.aiVotes ? vote : aiVote);
  ctx.playerInMajority = vote === ctx.majorityVote;

  const majorityVote = ctx.majorityVote;
  const playerInMajority = ctx.playerInMajority;
  if (playerInMajority) G.majorityVoteCount++;

  // Track agenda stats
  if (vote === 'pro') {
    G.proVoteCount++;
    if (stmt.lean === 'Anti-splinter') G.proOnAntiSplinter++;
    if (stmt.lean === 'Pro-splinter') G.sovereigntyVotes++;
  } else {
    G.antiVoteCount++;
    if (stmt.lean === 'Pro-splinter') G.antiOnProSplinter++;
    if (stmt.lean === 'Anti-splinter') G.antiOnAntiSplinter++;
  }

  // Apply score changes
  let scores = { ...stmt.scores };
  // If player voted against the statement's lean, invert score direction
  const effectiveLean = ctx.flags.invertLeanForScoring
    ? (stmt.lean === 'Anti-splinter' ? 'Pro-splinter' : 'Anti-splinter')
    : stmt.lean;
  const proLean = effectiveLean === 'Anti-splinter';
  if ((proLean && vote === 'anti') || (!proLean && vote === 'pro')) {
    // Against lean — reverse welfare & openness
    scores.openness = -scores.openness;
    scores.welfare = Math.round(scores.welfare * 0.5);
  }
  Object.entries(scores).forEach(([k,v]) => {
    G.scores[k] = Math.max(0, Math.min(100, G.scores[k] + v));
  });

  // Splinter change
  let rawSplinter = ctx.flags.neutralizedStatement ? 0 : stmt.splinter;
  rawSplinter += ctx.splinterMod;
  // If player voted against the fragmentation direction, reduce splinter slightly
  if (!ctx.flags.neutralizedStatement && ((stmt.splinter > 0 && vote === 'anti') || (stmt.splinter < 0 && vote === 'pro'))) {
    rawSplinter = Math.round(rawSplinter * 0.6);
  }
  ctx.rawSplinter = rawSplinter;

  ctx = applyAfterVoting(ctx);
  if (ctx.flags.recomputeMajority) {
    const previousMajority = ctx.majorityVote;
    ctx.majorityVote = sameSide ? vote : (ctx.playerVotes > ctx.aiVotes ? vote : aiVote);
    ctx.playerInMajority = vote === ctx.majorityVote;
    if (previousMajority !== ctx.majorityVote) {
      ctx.powerLog.push(`Outcome record flipped: majority ${previousMajority.toUpperCase()}→${ctx.majorityVote.toUpperCase()}`);
    }
  }

  const finalMajorityVote = ctx.majorityVote;
  const finalPlayerInMajority = ctx.playerInMajority;
  if (finalPlayerInMajority !== playerInMajority) {
    if (playerInMajority) G.majorityVoteCount = Math.max(0, G.majorityVoteCount - 1);
    if (finalPlayerInMajority) G.majorityVoteCount++;
  }

  rawSplinter = ctx.rawSplinter;

  G.splinter = Math.max(0, Math.min(100, G.splinter + rawSplinter));

  let tokenBonus = ctx.tokenBonus;
  const powerResultMsg = ctx.powerLog.length ? ctx.powerLog[ctx.powerLog.length - 1] : '';

  // Base token distribution
  tokenBonus += 1; // +1 per round for non-Regulator
  G.tokens = Math.max(0, G.tokens + tokenBonus);

  // Check agendas
  G.agendas.forEach(a => {
    if (!a.done) {
      a.done = a.check({ ...G, round: G.round + 1 });
    }
  });

  updateHUD();
  buildOutcomePanel(stmt, vote, finalMajorityVote, rawSplinter, scores, powerResultMsg, finalPlayerInMajority, ctx.powerLog);
  goPhase(4);

  if (G.splinter >= 50 && !G.tipped) {
    G.tipped = true;
  }
}

function buildOutcomePanel(stmt, vote, majorityVote, splinterChange, scores, powerMsg, inMajority, powerLog) {
  // Outcome box
  const won = vote === majorityVote;
  const box = document.getElementById('outcomeBox');
  const voteDirection = vote === 'pro' ? 'Pro' : 'Anti';
  const majorityDirection = majorityVote === 'pro' ? 'Pro' : 'Anti';

  let boxCls, verdictTxt, titleTxt, bodyTxt;
  if (won) {
    boxCls = 'won';
    verdictTxt = 'Vote carried';
    titleTxt = `The ${voteDirection} coalition won.`;
    bodyTxt = `Your vote aligned with the majority. The statement ${vote === 'pro' ? 'passes' : 'fails'} — ` + (stmt.lean === 'Anti-splinter' ? 'an integrating outcome.' : 'a fragmenting outcome.');
  } else {
    boxCls = 'lost';
    verdictTxt = 'Vote lost';
    titleTxt = `The ${majorityDirection} coalition won.`;
    bodyTxt = `You voted ${voteDirection} but the majority voted ${majorityDirection}. The statement ${majorityVote === 'pro' ? 'passes' : 'fails'}.`;
  }
  box.className = 'outcome-box ' + boxCls;
  document.getElementById('outcomeVerdict').textContent = verdictTxt;
  document.getElementById('outcomeTitle').textContent = titleTxt;
  document.getElementById('outcomeBody').textContent = bodyTxt;

  // Score deltas
  const dr = document.getElementById('deltaRow');
  dr.innerHTML = '';
  [{k:'welfare',l:'Welfare'},{k:'sovereignty',l:'Sovereignty'},{k:'openness',l:'Openness'},{k:'trust',l:'Trust'}].forEach(d => {
    const v = scores[d.k];
    const chip = document.createElement('div');
    chip.className = 'delta-chip';
    chip.innerHTML = `<div class="delta-chip-label">${d.l}</div><div class="delta-chip-val ${v>0?'dpos':v<0?'dneg':'dneu'}">${v>0?'+':''}${v}</div>`;
    dr.appendChild(chip);
  });
  // Token chip
  const tc = document.createElement('div');
  tc.className = 'delta-chip';
  tc.innerHTML = `<div class="delta-chip-label">Tokens</div><div class="delta-chip-val" style="color:var(--amber)">${G.tokens}</div>`;
  dr.appendChild(tc);

  // Splinter delta
  const sdv = document.getElementById('sdVal');
  sdv.className = 'sd-val ' + (splinterChange > 0 ? 'sd-pos' : splinterChange < 0 ? 'sd-neg' : 'sd-neu');
  sdv.textContent = (splinterChange > 0 ? '+' : '') + splinterChange + '%';
  document.getElementById('sdTotal').textContent = Math.round(G.splinter) + '%';
  document.getElementById('sdWarn').style.display = G.splinter >= 35 ? 'block' : 'none';

  // Power result
  const pvr = document.getElementById('postVotePowerResult');
  if (powerMsg) {
    pvr.style.display = 'block';
    const details = (powerLog || []).map(item => `<div style="margin-top:4px">• ${item}</div>`).join('');
    pvr.innerHTML = `<div style="background:#1C3020;border-left:3px solid var(--green);padding:12px 16px;border-radius:3px;font-size:13px;color:#A0C8A8"><strong>⚡ Power activated:</strong> ${powerMsg}${details ? `<div style="margin-top:6px">${details}</div>` : ''}</div>`;
  } else {
    pvr.style.display = 'none';
  }

  // Counterintuitive
  document.getElementById('ciTxt').textContent = stmt.ci;

  // Real world
  document.getElementById('rwItems').innerHTML = stmt.rw.map(r => `<div class="rw-item">${r}</div>`).join('');

  // Agendas
  const fulfilled = G.agendas.filter(a => a.done).length;
  const agendaHtml = G.agendas.map(a =>
    `<div class="agenda-item"><div class="agenda-check ${a.done ? 'ac-done' : 'ac-todo'}">${a.done ? '✓' : ''}</div><span style="color:${a.done ? 'var(--green)' : 'var(--dark)'}">${a.text}</span></div>`
  ).join('');
  document.getElementById('agendaCount').textContent = fulfilled + '/6';
  document.getElementById('agendaList').innerHTML = agendaHtml;
  const sharedAgendaCount = document.getElementById('sharedAgendaCount');
  const sharedAgendaList = document.getElementById('sharedAgendaList');
  if (sharedAgendaCount && sharedAgendaList) {
    sharedAgendaCount.textContent = fulfilled + '/6';
    sharedAgendaList.innerHTML = agendaHtml;
  }

  // Actions
  const actions = document.getElementById('outcomeActions');
  const isLast = G.round === G.totalRounds - 1;
  if (G.tipped) {
    actions.innerHTML = `<button class="btn btn-danger" onclick="showScreen('tipping')">→ The Internet Has Broken</button>`;
  } else if (isLast || fulfilled >= 6) {
    actions.innerHTML = `<button class="btn btn-primary" onclick="showEndScreen()">See your profile →</button>`;
  } else {
    actions.innerHTML = `<button class="btn btn-primary" onclick="nextRound()">Next round →</button>`;
  }
}

function nextRound() {
  G.round++;
  loadRound();
  showScreen('round');
}

// ═══════════════════════════════════════════════════
// PHASE MANAGEMENT
// ═══════════════════════════════════════════════════
function goPhase(p) {
  G.currentPhase = p;
  document.querySelectorAll('.phase-panel').forEach(el => el.classList.remove('active'));
  document.getElementById('phase-' + p).classList.add('active');
  for (let i = 0; i < 5; i++) {
    const dot = document.getElementById('pd' + i);
    dot.className = 'phase-dot' + (i < p ? ' done' : i === p ? ' active' : '');
  }
  const labels = ['Power Purchase', 'Statement', 'Debate', 'Vote', 'Outcome'];
  document.getElementById('hudPhase').textContent = labels[p] || '';

  const banner1 = document.getElementById('activePowerBanner1');
  const banner2 = document.getElementById('activePowerBanner2');
  const preVotePower = document.getElementById('preVotePower');
  const hasPower = !!G.chosenPower;
  const activeHtml = hasPower ? buildActivePowerHtml() : '';

  if (banner1) {
    banner1.style.display = hasPower && p === 1 ? 'block' : 'none';
    if (hasPower && p === 1) banner1.innerHTML = activeHtml;
  }
  if (banner2) {
    banner2.style.display = hasPower && p === 2 ? 'block' : 'none';
    if (hasPower && p === 2) banner2.innerHTML = activeHtml;
  }
  if (preVotePower) {
    preVotePower.style.display = hasPower && p === 3 ? 'block' : 'none';
    if (hasPower && p === 3) preVotePower.innerHTML = activeHtml;
  }

  const sharedAgendaBox = document.getElementById('sharedAgendaBox');
  if (sharedAgendaBox) {
    sharedAgendaBox.style.display = (p === 1 || p === 2) ? 'block' : 'none';
  }
  window.scrollTo(0, 0);
}

// ═══════════════════════════════════════════════════
// END SCREEN
// ═══════════════════════════════════════════════════
function showEndScreen() {
  const s = G.scores;
  const sp = Math.round(G.splinter);
  const fulfilled = G.agendas.filter(a => a.done).length;
  const avg = Math.round((s.welfare + s.sovereignty + s.openness + s.trust) / 4);
  const role = ROLES.find(r => r.id === G.role);

  document.getElementById('endTitle').textContent = G.tipped ? 'The Network Fractured.' : fulfilled >= 6 ? 'All Agendas Fulfilled.' : 'Your term is over.';
  document.getElementById('endSub').textContent = G.tipped
    ? `Splinter Index crossed 50%. The open internet is no longer the default.`
    : `${fulfilled}/6 agendas fulfilled · Splinter Index: ${sp}% · Avg: ${avg}/100`;

  // ── PERSONA REVEAL ──
  const prof = getProfile(s, sp, role, fulfilled);
  const dom = computeDom(s);
  document.getElementById('personaReveal').innerHTML = `
    <div class="persona-tag">Your governance archetype</div>
    <div class="persona-name">${prof.name}</div>
    <div class="persona-tagline">${prof.tagline}</div>
    <div style="font-size:14px;line-height:1.65;color:rgba(234,229,208,.8)">${prof.desc}</div>
    <div class="persona-meta">
      <div class="pm-item"><div class="pm-label">Dominant lens</div><div class="pm-val">${dom.label}</div></div>
      <div class="pm-item"><div class="pm-label">Splinter Index</div><div class="pm-val" style="color:${sp>=50?'var(--red)':sp>=30?'var(--amber)':'#6BBF7A'}">${sp}%</div></div>
      <div class="pm-item"><div class="pm-label">Agendas</div><div class="pm-val">${fulfilled}/6</div></div>
    </div>`;

  // ── SPLINTER VERDICT ──
  const sv = getSplinterV(sp);
  const svEl = document.getElementById('splinterVerdict');
  svEl.style.cssText = `background:${sv.bg};border-left:4px solid ${sv.bdr};padding:20px 24px;border-radius:4px;margin-bottom:24px`;
  svEl.innerHTML = `<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${sv.bdr};margin-bottom:6px">${sv.lbl}</div><div style="font-family:'EB Garamond',serif;font-size:20px;color:var(--dark);margin-bottom:6px">${sv.title}</div><div style="font-size:13px;line-height:1.55;color:var(--muted)">${sv.desc}</div>`;

  // ── THREE-LENS INSIGHTS ──
  const insights = buildInsights(s, sp, fulfilled, role);
  document.getElementById('insightCards').innerHTML = insights.map(ins => `
    <div class="insight-card">
      <div class="insight-card-lens">${ins.lens}</div>
      <div class="insight-card-finding">${ins.finding}</div>
      <div class="insight-card-body">${ins.body}</div>
    </div>`).join('');

  // ── TENSION CARDS ──
  const tensions = [
    { label:'State vs. Platform', title: s.sovereignty > s.trust ? 'You chose control' : 'You built frameworks',
      desc: s.sovereignty > s.trust
        ? 'Your decisions consistently prioritised state authority over citizen legitimacy. Control without trust produces compliance — not governance.'
        : 'You chose accountability frameworks over direct control. Slower to build, harder to dismantle — if your successors respect them.' },
    { label:'Welfare vs. Sovereignty', title: s.welfare > s.sovereignty ? 'Citizens first' : 'State first',
      desc: s.welfare > s.sovereignty
        ? 'Citizen access consistently outranked state control in your decisions. The Splinter Index reflects this — openness has a welfare dividend.'
        : 'You prioritised sovereignty over citizen welfare. Every localisation mandate, every compliance threshold — someone bore that cost.' },
    { label:'Openness vs. Fragmentation', title: sp < 25 ? 'You held the line' : sp < 45 ? 'Cracks showing' : 'The line broke',
      desc: sp < 25
        ? 'The open internet survived your term. Not by default — because you chose integration-friendly governance consistently under pressure.'
        : sp < 45
        ? `Splinter Index: ${sp}%. Individually defensible decisions, collectively compounding. The next czar starts from a harder position.`
        : 'The 50% threshold was reached. Each decision that pushed it there was argued, not arbitrary. That is the lesson.' },
    { label:'Agendas vs. Coalition', title: fulfilled >= 5 ? 'Strategic coherence' : fulfilled >= 3 ? 'Partial execution' : 'Agenda slippage',
      desc: fulfilled >= 5
        ? `${fulfilled}/6 agendas fulfilled. Your votes were coherent — each one advancing a legible vision of what the internet should become.`
        : `${fulfilled}/6 agendas. The gap between your stated vision and your actual votes shows where coalition pressure overrode your priorities.` },
  ];
  document.getElementById('tensionGrid').innerHTML = tensions.map(t =>
    `<div class="tension-card"><div class="tension-label">${t.label}</div><div class="tension-title">${t.title}</div><div class="tension-desc">${t.desc}</div></div>`
  ).join('');

  showScreen('end');
  setTimeout(drawRadar, 100);
}

function computeDom(s) {
  const dims = [{k:'welfare',label:'Welfare'},{k:'sovereignty',label:'Sovereignty'},{k:'openness',label:'Openness'},{k:'trust',label:'Trust'}];
  dims.sort((a,b) => s[b.k] - s[a.k]);
  return dims[0];
}

function buildInsights(s, sp, fulfilled, role) {
  const ins = [];
  const avg = Math.round((s.welfare + s.sovereignty + s.openness + s.trust) / 4);

  // ── Policy lens ──
  let policyFinding, policyBody;
  if (s.sovereignty > 65 && sp > 30) {
    policyFinding = `You governed like a sovereign — and paid the fragmentation price.`;
    policyBody = `High-sovereignty choices produce short-term control and long-term fragmentation. Your decisions mirror the playbook of states that built national stacks — <strong>India's data localisation push, Russia's Runet, China's Great Firewall</strong> — each of which began with individually defensible security and sovereignty arguments.`;
  } else if (s.openness > 60 && sp < 25) {
    policyFinding = `You made the integrationist bet — and it held.`;
    policyBody = `Openness-first governance is the path of least fragmentation, highest welfare, and greatest geopolitical exposure. You governed like the <strong>Singapore model</strong> — rules-based, interoperability-seeking, and domestically contested. The question your successors face: who maintains this when the next crisis hits?`;
  } else if (s.trust > 65) {
    policyFinding = `You built institutions. That is rarer than it sounds.`;
    policyBody = `High-trust governance — transparent frameworks, proportionate mandates, accountable enforcement — is the hardest thing to achieve and the easiest to dismantle. Your profile resembles the <strong>EU's GDPR architecture</strong>: slow, contested, globally influential. The risk: institutional frameworks require political continuity you cannot guarantee.`;
  } else if (sp >= 50) {
    policyFinding = `You governed into a tipping point without crossing a single clear threshold.`;
    policyBody = `No single decision broke the internet. The accumulation did. This is the defining governance challenge of internet fragmentation: <strong>each action is locally rational, globally corrosive</strong>. Your policy profile matches the empirical pattern of countries that have crossed digital sovereignty thresholds — India (2021 IT Rules cascade), Brazil (traceability mandates), Nigeria (Twitter ban) — not through intention, but through precedent.`;
  } else {
    policyFinding = `You governed pragmatically — and left the hard questions for the next czar.`;
    policyBody = `Balanced governance is not weak governance — but it does defer rather than resolve structural tensions. Your profile suggests a <strong>preference for policy ambiguity</strong> over clear commitment. That preserves optionality. It also means every successor inherits the same contested tradeoffs without the benefit of settled precedent.`;
  }
  ins.push({ lens:'Policy lens', finding:policyFinding, body:policyBody });

  // ── Learning & Development lens ──
  let ldFinding, ldBody;
  if (s.welfare > 60 && s.trust > 60) {
    ldFinding = `You are a systems thinker — you traced consequences, not just intentions.`;
    ldBody = `Your decisions consistently weighted second-order effects: who bears the cost, who builds the trust, what framework survives the next election. This is the hardest cognitive shift in governance learning — moving from <strong>"what does this policy say?"</strong> to <strong>"what does this policy do?"</strong> In L&D terms: you demonstrated transfer learning. You applied governance principles across categories rather than treating each statement as isolated.`;
  } else if (G.powerUseCount >= 5) {
    ldFinding = `You used power strategically — not just because you had it.`;
    ldBody = `Consistent power card use across ${G.powerUseCount} rounds suggests you understood the token economy as a resource allocation problem, not just a game mechanic. In governance learning terms, this maps to <strong>strategic agency</strong> — the capacity to act within structural constraints rather than waiting for permission or certainty. The learning edge: were your power plays reactive (responding to threats) or proactive (shaping conditions)?`;
  } else if (G.majorityVoteCount >= 6) {
    ldFinding = `You optimised for coalition — at the cost of vision.`;
    ldBody = `You voted with the majority ${G.majorityVoteCount}/8 rounds. Coalition alignment is politically rational — and intellectually comfortable. The L&D insight: <strong>majority-seeking can mask values clarification</strong>. When you voted Anti on a Pro-splinter statement, was it because you believed in integration — or because the coalition was there? The gap between those answers is where governance learning actually happens.`;
  } else {
    ldFinding = `You took positions the coalition did not share — and lived with the outcomes.`;
    ldBody = `You voted against the majority in ${8 - G.majorityVoteCount} rounds. That is not failure — it is the only way to surface genuine values conflicts rather than performing consensus. In L&D terms, this represents <strong>tolerance for productive discomfort</strong> — the willingness to hold a position when the room disagrees, take the loss, and observe what follows. High-risk, high-insight.`;
  }
  ins.push({ lens:'Learning lens', finding:ldFinding, body:ldBody });

  // ── Research lens ──
  let resFinding, resBody;
  const dom = computeDom(s);
  if (dom.k === 'sovereignty') {
    resFinding = `Your dominant value is sovereignty — the most contested variable in internet governance research.`;
    resBody = `Sovereignty-dominant governance profiles are the most common and the most studied. The research consensus (DeNardis, Deibert, Mueller) is consistent: <strong>sovereignty gains in internet governance are rarely reversible</strong>, and they compound through precedent. What your country enacts, other governments cite. Your decisions this game are the decisions that, aggregated across 50 governments, produce the Splinter Index everyone is trying to explain.`;
  } else if (dom.k === 'openness') {
    resFinding = `Your dominant value is openness — the rarest outcome in the current empirical landscape.`;
    resBody = `Most internet governance research documents fragmentation, not integration. Your openness-dominant profile places you in the minority of governance actors globally — closer to the <strong>Singapore-EU adequacy corridor</strong> than to the Beijing-Washington axis. The research question your profile raises: is openness-dominant governance sustainable in a domestic political environment that rewards visible control?`;
  } else if (dom.k === 'trust') {
    resFinding = `Your dominant value is institutional trust — the hardest variable to build and the first to erode.`;
    resBody = `Trust-dominant governance aligns with the emerging "digital constitutionalism" literature (Gill, Redeker, Llanso). The research finding: <strong>trust built through process is more durable than trust built through outcomes</strong>. Transparent rulemaking, proportionate enforcement, and accessible appeals survive political transitions better than opaque national security frameworks — but they require sustained institutional investment your successors may not provide.`;
  } else {
    resFinding = `Your dominant value is welfare — the most undercounted variable in digital governance research.`;
    resBody = `Most internet governance frameworks are built around sovereignty and security. Welfare — who gets access, at what cost, with what recourse — is systematically underweighted. Your profile aligns with the <strong>human rights and development economics strand</strong> of internet governance research (Dutton, Livingstone, Freedom House). The empirical gap you are inhabiting: welfare-dominant governance is common in civil society advocacy and rare in state decision-making.`;
  }
  ins.push({ lens:'Research lens', finding:resFinding, body:resBody });

  return ins;
}


function getProfile(s, sp, role, fulfilled) {
  if (sp >= 50) return {
    name:'The Fragmentation Czar',
    tagline:'You did not break the internet. The accumulation did.',
    desc:'No single decision crossed the line. Eight rounds of individually defensible choices — moderation mandates, localisation clauses, traceability requirements — compounded into structural fragmentation. This is the governance pattern most common in the real world. You are in good, troubled company.'
  };
  if (s.welfare > 65 && s.openness > 60) return {
    name:'The Open Constitutionalist',
    tagline:'You governed for citizens, not just the state.',
    desc:'Welfare and openness as twin priorities — accessible services, interoperable infrastructure, proportionate regulation. Your framework is globally legible and domestically contested. Every government that governs this way gets called naive by realists and captured by internationalists. Neither is fully wrong.'
  };
  if (s.sovereignty > 65 && s.welfare < 45) return {
    name:'The National Stack Builder',
    tagline:'You chose control. Your citizens paid for it.',
    desc:'Sovereignty above all — data localisation, platform certification, national audit requirements. Your country has more regulatory control than when you started. Your citizens have less access, higher costs, and fewer appeals mechanisms. You built walls. They are real. So are the people on the other side of them.'
  };
  if (s.trust > 65) return {
    name:'The Governance Architect',
    tagline:'You built frameworks instead of fences.',
    desc:'Audit trails, adequacy decisions, transparency mandates, proportionate enforcement. Slower than controls. Harder to explain in a crisis. More durable, if your successors maintain them — which is the condition every institutional builder eventually discovers they cannot guarantee.'
  };
  if (s.sovereignty > 60 && s.openness > 50) return {
    name:'The Pragmatic Nationalist',
    tagline:'You held both values. Neither side believes you.',
    desc:'Sovereignty where you could assert it, openness where you had to preserve it. The internet governance community thinks you conceded too much to the state. The national security establishment thinks you left too many gaps. You probably got the balance approximately right, and will never be credited for it.'
  };
  if ((s.welfare + s.sovereignty + s.openness + s.trust) / 4 < 48) return {
    name:'The Crisis Manager',
    tagline:'You governed reactively. The precedents you set are permanent.',
    desc:'Each decision was a response to the immediate emergency — the breach, the shutdown, the disinformation cascade. Reactive governance is not weak governance, but it produces a fragmented policy legacy. The frameworks you left behind will be invoked by your successors in contexts you did not anticipate.'
  };
  return {
    name:'The Cautious Reformer',
    tagline:'You avoided the worst. The best remains ahead.',
    desc:'No catastrophic outcomes. No transformative choices either. You governed within the acceptable range — defensible to most stakeholders, wholly satisfying to none. This is the most common governance profile in internet policy. The question it leaves open: when the next crisis forces a choice, what do you actually believe?'
  };
}

function getSplinterV(sp) {
  if (sp >= 50) return { bg:'var(--red-light)', bdr:'var(--red)', lbl:'⚡ Tipping Point Reached', title:'The Splinternet is Structural', desc:'50% fragmentation crossed. Separate technospheres are consolidating.' };
  if (sp >= 35) return { bg:'#FEF9EE', bdr:'var(--amber)', lbl:'⚠ Significant Fragmentation', title:'Deep Cracks in the Open Internet', desc:`Splinter Index: ${sp}%. Not a rupture — a pattern. Each future czar inherits a harder starting position.` };
  if (sp >= 20) return { bg:'#FEF9EE', bdr:'var(--amber)', lbl:'Moderate Fragmentation', title:'Managed, Not Resolved', desc:`Splinter Index: ${sp}%. Defensible decisions under pressure. The structural tensions remain.` };
  return { bg:'var(--green-light)', bdr:'var(--green)', lbl:'Low Fragmentation', title:'The Open Internet Survives', desc:`Splinter Index: ${sp}%. Consistent, proportionate, trust-based governance. Unusual. Test your successor.` };
}

function drawRadar() {
  const ctx = document.getElementById('radarChart').getContext('2d');
  if (window._rc) window._rc.destroy();
  window._rc = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Welfare','Sovereignty','Openness','Trust'],
      datasets: [{ label: 'Your Profile', data: [G.scores.welfare, G.scores.sovereignty, G.scores.openness, G.scores.trust], backgroundColor:'rgba(232,170,61,0.15)', borderColor:'#E8AA3D', borderWidth:2.5, pointBackgroundColor:'#E8AA3D', pointRadius:5 }]
    },
    options: {
      responsive: true,
      scales: { r: { beginAtZero:true, max:100, min:0, ticks:{ stepSize:25, color:'#888', font:{ size:10 }, backdropColor:'transparent' }, grid:{ color:'rgba(0,0,0,0.07)' }, angleLines:{ color:'rgba(0,0,0,0.07)' }, pointLabels:{ font:{ size:12, weight:'600' }, color:'#333' } } },
      plugins: { legend:{ display:false } }
    }
  });
}

// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function restartGame() {
  resetState();
  document.getElementById('hud').style.display = 'none';
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('startBtn').disabled = true;
  showScreen('intro');
}


// ═══════════════════════════════════════════════════
// SECTOR GRID
// ═══════════════════════════════════════════════════
const SECTORS = [
  'E-COMMERCE','HEALTH','FINANCE','ENTERTAINMENT',
  'SOCIAL MEDIA','CYBER SECURITY','CLOUD COMPUTING','TRANSPORT',
  'GOVT. SERVICES','RESEARCH','GAMING','COMMUNICATION',
  'NEWS','SMALL BUSINESS','EDUCATION','INTL TRADE'
];

const CAT_TO_SECTOR = {
  'E-commerce':         'E-COMMERCE',
  'Health':             'HEALTH',
  'Finance':            'FINANCE',
  'Entertainment':      'ENTERTAINMENT',
  'Social Media':       'SOCIAL MEDIA',
  'Cybersecurity':      'CYBER SECURITY',
  'Cloud Computing':    'CLOUD COMPUTING',
  'Transportation':     'TRANSPORT',
  'Government Services':'GOVT. SERVICES',
  'Research':           'RESEARCH',
  'Gaming':             'GAMING',
  'Communication':      'COMMUNICATION',
  'News':               'NEWS',
  'Small Business':     'SMALL BUSINESS',
  'Education':          'EDUCATION',
  'International Trade':'INTL TRADE',
};

const SECTOR_SHORT = {
  'E-COMMERCE':      'E-COM', 'HEALTH':'HEALTH', 'FINANCE':'FINANCE',
  'ENTERTAINMENT':   'ENTMT', 'SOCIAL MEDIA':'SOCIAL', 'CYBER SECURITY':'CYBER',
  'CLOUD COMPUTING': 'CLOUD', 'TRANSPORT':'TRANS', 'GOVT. SERVICES':'GOVT',
  'RESEARCH':        'RSCH',  'GAMING':'GAMING', 'COMMUNICATION':'COMM',
  'NEWS':            'NEWS',  'SMALL BUSINESS':'SMB', 'EDUCATION':'EDUC',
  'INTL TRADE':      'TRADE',
};

let sectorScores = {};
SECTORS.forEach(s => { sectorScores[s] = 0; });

function sectorElId(s) { return 'sc-' + s.replace(/[^A-Z0-9]/g, '_'); }

function buildSectorGrid() {
  const grid = document.getElementById('sectorGrid');
  if (!grid) return;
  grid.innerHTML = '';
  SECTORS.forEach(s => {
    const cell = document.createElement('div');
    cell.className = 'sector-cell open';
    cell.id = sectorElId(s);
    cell.title = s;
    cell.innerHTML = '<div class="sector-cell-name">' + (SECTOR_SHORT[s] || s) + '</div><span class="sector-dot"></span>';
    grid.appendChild(cell);
  });
  refreshSidebarSplinter();
}

function updateSectorCell(sectorName, delta) {
  if (!sectorName) return;
  sectorScores[sectorName] = Math.max(0, Math.min(100, (sectorScores[sectorName] || 0) + delta));
  const score = sectorScores[sectorName];
  const cell = document.getElementById(sectorElId(sectorName));
  if (!cell) return;
  const wasActive = cell.classList.contains('active');
  const state = score >= 50 ? 'fractured' : score >= 20 ? 'partial' : 'open';
  cell.className = 'sector-cell ' + state + (wasActive ? ' active' : '');
  refreshSidebarSplinter();
}

function refreshSidebarSplinter() {
  const fractured = SECTORS.filter(s => (sectorScores[s]||0) >= 50).length;
  const sp = Math.round(G ? (G.splinter || 0) : 0);
  const fill = document.getElementById('sidebarSplinterFill');
  if (fill) fill.style.width = Math.min(100, sp) + '%';
  const pct = document.getElementById('sidebarSplinterPct');
  if (pct) pct.textContent = sp + '%';
  const ct = document.getElementById('sidebarFracturedCount');
  if (ct) ct.textContent = fractured;
}

function highlightCurrentSector(category) {
  SECTORS.forEach(s => {
    const el = document.getElementById(sectorElId(s));
    if (el) el.classList.remove('active');
  });
  const sector = CAT_TO_SECTOR[category];
  if (sector) {
    const el = document.getElementById(sectorElId(sector));
    if (el) el.classList.add('active');
  }
}

function showSectorSidebar() {
  const sb = document.getElementById('sectorSidebar');
  if (sb) sb.classList.remove('sidebar-hidden');
}
function hideSectorSidebar() {
  const sb = document.getElementById('sectorSidebar');
  if (sb) sb.classList.add('sidebar-hidden');
}

// ── INIT ──
resetState();
buildRoleGrid();
buildSectorGrid();
// Patch loadRound to highlight current sector and show sidebar
const _origLoadRound = loadRound;
loadRound = function() {
  _origLoadRound();
  const stmt = STATEMENTS[G.round];
  highlightCurrentSector(stmt.category);
  showSectorSidebar();
};

// Track prev splinter in state — patch resetState
const _origReset2 = resetState;
resetState = function() {
  _origReset2();
  G._prevSplinter = 0;
  sectorScores = {};
  SECTORS.forEach(s => { sectorScores[s] = 0; });
  hideSectorSidebar();
  refreshSidebarSplinter();
  if (document.getElementById('sectorGrid')) buildSectorGrid();
};
// Call updateSectorCell from buildOutcomePanel after we know the splinter delta
// We hook into buildOutcomePanel by patching it
const _origBuildOutcome = buildOutcomePanel;
buildOutcomePanel = function(stmt, vote, majorityVote, splinterChange, scores, powerMsg, inMajority) {
  _origBuildOutcome(stmt, vote, majorityVote, splinterChange, scores, powerMsg, inMajority);
  // splinterChange is the raw delta for this round (already applied to G.splinter)
  const sector = CAT_TO_SECTOR[stmt.category];
  if (sector) {
    // Map splinter delta to sector: positive = more fragmented, negative = less
    updateSectorCell(sector, splinterChange);
  }
  G._prevSplinter = G.splinter;
  // Remove highlight from current sector after outcome
  const safeId = sector ? 'sc-' + sector.replace(/[^A-Z0-9]/g, '_') : null;
  if (safeId) {
    const el = document.getElementById(safeId);
    if (el) el.classList.remove('sc-current');
  }
};
