// ═══════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════
// ── Leader definitions (single source of truth) ──
const LEADERS = ['expansionist', 'hegemon', 'erstwhile', 'nationundersiege', 'newpower'];

// Personalities: hawk=aggressive/paranoid, pragmatist=rational, nationalist=defensive, declining=erratic, challenger=opportunistic
const LEADER_PROFILES = {
  expansionist:    { perception: 0.65, personality: 'hawk',        conflictIndex: 0, label: 'THE EXPANSIONIST' },
  hegemon:         { perception: 0.85, personality: 'pragmatist',  conflictIndex: null, label: 'THE HEGEMON' },
  erstwhile:       { perception: 0.72, personality: 'declining',   conflictIndex: 1, label: 'THE ERSTWHILE POWER' },
  nationundersiege:{ perception: 0.58, personality: 'nationalist', conflictIndex: 2, label: 'THE NATION UNDER SIEGE' },
  newpower:        { perception: 0.70, personality: 'challenger',  conflictIndex: 3, label: 'THE NEW POWER' },
};

const GS = {
  turn: 1,
  doomClock: 1,           // clock hand position: 1=safest, 12=midnight/game-over. Advances +1 on bad events, retreats -1 on good decisions.
  conflicts: [22, 38, 31, 18],
  economy: 74,
  alliances: 52,
  publicPressure: 41,
  humanitarianDead: 12000,
  p2p: 60,
  resources: { dip: 5, eco: 4, pol: 4, cov: 3, ovt: 3 },
  scandalActive: false,
  scandalExposed: false,
  regimeChangeUsed: false,
  actTransition: false,
  // ── Unified leader model ──
  leaders: Object.fromEntries(LEADERS.map(l => [l, {
    perception: LEADER_PROFILES[l].perception,
    trust: 0,
    power: { expansionist:60, hegemon:75, erstwhile:50, nationundersiege:40, newpower:55 }[l],
    domestic: { stability: 70, pressure: 0 },
  }])),
  // ── Coalitions (balance-of-power) ──
  coalitions: [],
  // ── Misinformation ──
  misinformationLevel: 0.12,
};

const ACTS = [
  { turns:[1,5], num:"ACT I", title:"THE KINDLING", desc:"The wars have not started yet. But the playbook is already running. The signals are there if you know how to read them.", music:"low" },
  { turns:[6,11], num:"ACT II", title:"DRAWING OF BOUNDARIES", desc:"Early war is active. Diplomacy is still alive — barely. This is the last window for soft power. Use it.", music:"rising" },
  { turns:[12,17], num:"ACT III", title:"FULL BLAZE", desc:"Boots are on the ground. The bombing has started. You cannot stop what has already begun. You can only shape how it ends.", music:"chaos" },
  { turns:[18,20], num:"ACT IV", title:"THE CHARTER", desc:"The fighting is slowing. Now you must build whatever comes next — knowing it is fragile. Knowing the leaders who sign it are the same ones who started it.", music:"aftermath" },
];

// ═══════════════════════════════════════════════════════════════
// TURN DATA — ALL 20 TURNS
// ═══════════════════════════════════════════════════════════════
const TURNS = [
  // ── ACT I ──────────────────────────────────────────────────
  {
    title: "A BAN ON THEIR CHANNELS",
    from: "THE EXPANSIONIST",
    fromType: "leader",
    text: "Their media is running disinformation operations from inside our territory. Our people are being radicalised by foreign broadcasts. I am considering legislation to shut them down. What is your read, Ambassador?",
    note: "Playbook Step 2: Control the information space. A 'yes' looks reasonable. It is never just a media ban.",
    shock: null,
    decisions: [
      { tag:"DIP", text:"Propose an independent monitoring body to investigate the specific claims.", cost:"dip", effects:{ c1:-2, p2p:+3 }, consequence:"The Expansionist is irritated. But the recommendation is noted. The ban does not happen — yet." },
      { tag:"POL", text:"Issue a formal warning: any media ban will be referred to the international press freedom body.", cost:"pol", effects:{ c1:+1, alliances:+4 }, consequence:"The international community applauds. The Expansionist adds you to his list of enemies." },
      { tag:"COV", text:"Request intelligence on the specific disinformation claims before responding.", cost:"cov", effects:{ c1:0, p2p:+1 }, consequence:"The intelligence arrives in 48 hours. You have bought time. The ban is delayed.", delayReveal: "Turn 2: Intelligence confirms: the 'disinformation' was opposition news coverage. The ban was pretextual." },
      { tag:"—", text:"Decline to comment. This is a domestic matter.", cost:null, effects:{ c1:+4, p2p:-5 }, consequence:"The Expansionist interprets silence as acquiescence. The ban is announced within 48 hours." },
    ],
    altActions: [
      { tag:"PRESS", text:"[ALT] Fund cross-border journalist exchange programme.", cost:"eco", effects:{ p2p:+8, c1:-1 }, consequence:"Journalists from both sides spend two weeks together. It will not stop the war. But it slows the lie." },
    ]
  },
  {
    title: "UNREST IN THE BORDER MARKET",
    from: "INTELLIGENCE REPORT",
    fromType: "intel",
    text: "PRIORITY SIGNAL — Riots reported in the contested border district. 34 civilians dead. Local police stood down for a period of 4 hours during the worst violence. Origin of the disturbance unclear. Both governments are blaming each other. Confidence in attribution: LOW.",
    note: "The riot was produced. Paul Brass documented this pattern precisely: the police withdrawal, the prepared actors, the subsequent attribution war. You may not know this yet.",
    shock: null,
    decisions: [
      { tag:"COV", text:"Investigate why the police stood down. Who gave the order?", cost:"cov", effects:{ c3:-3, p2p:+2 }, consequence:"The investigation reveals a local hardline faction ordered the stand-down. The riot was manufactured. You hold the evidence.", special:"scandal_seed" },
      { tag:"DIP", text:"Convene an emergency meeting of the Border Commission.", cost:"dip", effects:{ c3:-2, alliances:+2 }, consequence:"Both governments attend under protest. The meeting produces a joint statement. The violence has stopped — for now." },
      { tag:"POL", text:"Issue a formal condemnation naming one side as responsible.", cost:"pol", effects:{ c3:+5, alliances:-3 }, consequence:"You named the wrong side. The evidence was incomplete. The condemnation becomes a propaganda tool for the aggressor." },
      { tag:"OVT", text:"Deploy international peacekeeping observers to the border zone.", cost:"ovt", effects:{ c3:0, doom:-0, alliances:+3 }, consequence:"The observers arrive. The violence pauses. But their presence is temporary and the underlying conditions are unchanged." },
    ],
    altActions: [
      { tag:"CIVIC", text:"[ALT] Deploy civilian observer mission from neutral states.", cost:"pol", effects:{ p2p:+5, c3:-2 }, consequence:"Civilian observers document the conditions. Their report will matter — if anyone reads it." },
    ]
  },
  {
    title: "THEIR CHURCH, THEIR LOYALTY",
    from: "THE REGIONAL AGGRESSOR",
    fromType: "leader",
    text: "I have evidence that religious institutions associated with the border population are operating as recruitment centres. They are preaching sedition from the pulpit. I am preparing legislation to regulate — or close — these institutions. I wanted you to hear it from me first.",
    note: "Playbook Step 7. The question sounds procedural. It is a test of whether anyone will push back.",
    shock: null,
    decisions: [
      { tag:"DIP", text:"Argue strongly against. Cite international religious freedom law explicitly.", cost:"dip", effects:{ c3:-3, pp:+5 }, consequence:"The Aggressor pushes back hard. But the legislation is delayed. You have cost him a domestic tool." },
      { tag:"POL", text:"Request a UN Special Rapporteur review before any legislation is passed.", cost:"pol", effects:{ c3:-1, alliances:+4 }, consequence:"The review process buys 60 days. In 60 days, a great deal can change." },
      { tag:"—", text:"Decline to comment. Religious policy is a sovereign matter.", cost:null, effects:{ c3:+5, p2p:-8 }, consequence:"Silence is interpreted as permission. The legislation passes within the week. Three institutions are closed. Twelve arrests follow." },
      { tag:"COV", text:"Gather intelligence on the specific institutions named in the legislation.", cost:"cov", effects:{ c3:0, p2p:+1 }, consequence:"The intelligence is revealing: only one of eleven named institutions has any connection to any political group. The list is a pretext." },
    ],
    altActions: [
      { tag:"FAITH", text:"[ALT] Organise interfaith dialogue meeting — religious leaders from both communities.", cost:"dip", effects:{ p2p:+10, c3:-2 }, consequence:"The meeting is awkward and tense. But the two religious leaders shake hands. It is photographed. It is more powerful than a statement." },
      { tag:"INIT", text:"[INITIATIVE] Propose an early-warning crisis hotline architecture — permanent, open to all four conflict actors.", cost:"dip", effects:{ doom:-1, p2p:+5, alliances:+4 }, consequence:"The architecture proposal is circulated. Two actors accept immediately. Two stall. But the mechanism is now on the table — and can be invoked without diplomatic permission.", isInitiative: true },
    ]
  },
  {
    title: "THE STUDENTS ARE NOT WELCOME",
    from: "THE ERSTWHILE POWER",
    fromType: "leader",
    text: "We are suspending student visa agreements with the Nation Under Siege effective immediately. Travel bans will follow for categories of professional and cultural workers. They began this — their restrictions on our journalists came first. We are merely reciprocating.",
    note: "Playbook Step 6. Every restriction makes the next one easier. People-to-people ties are the last buffer.",
    shock: null,
    decisions: [
      { tag:"DIP", text:"Propose a mutual student exchange preservation agreement — exempt educational visas from the ban.", cost:"dip", effects:{ c2:-2, p2p:+8 }, consequence:"The Erstwhile Power agrees to a narrow carve-out. 14,000 students on both sides can continue their studies." },
      { tag:"ECO", text:"Link trade negotiation progress to restoration of educational visas.", cost:"eco", effects:{ c2:-1, economy:+3 }, consequence:"The linkage works — for now. The Erstwhile Power values the trade talks. The carve-out holds." },
      { tag:"POL", text:"Raise the issue at the multilateral cultural cooperation forum.", cost:"pol", effects:{ c2:0, alliances:+2 }, consequence:"The forum issues a statement. The ban proceeds regardless. International opinion is noted and ignored." },
      { tag:"—", text:"Note the decision without comment.", cost:null, effects:{ c2:+2, p2p:-10 }, consequence:"The visa ban is the first of seven restrictions introduced over the following month. Each one severs another human connection." },
    ],
    altActions: [
      { tag:"BRIDGE", text:"[ALT] Fund a neutral third-country joint academic programme.", cost:"eco", effects:{ p2p:+6, c2:-1 }, consequence:"220 students from both countries are enrolled in a programme in a neutral country. Small. Durable." },
    ]
  },
  {
    title: "A SIGNAL FROM THE NORTH",
    from: "INTELLIGENCE REPORT",
    fromType: "intel",
    text: "PRIORITY SIGNAL — Satellite imagery confirms armoured divisions moving to forward positions near the contested northern border. Confidence: 70%. Could be a scheduled exercise. Could be pre-positioning. The Doomsday Clock has been updated. Briefing attached.",
    note: "Playbook Step 10. The first nuclear shadow. The Clock moves regardless of your decision.",
    shock: { text:"The Doomsday Clock advances one step regardless of your intervention. This was always coming.", doom:+1 },
    decisions: [
      { tag:"COV", text:"Deploy intelligence assets to confirm intent before responding publicly.", cost:"cov", effects:{ doom:0, c3:-2 }, consequence:"Confirmation arrives in 72 hours: it is pre-positioning, not an exercise. You have clarity. You also have less time." },
      { tag:"DIP", text:"Activate the emergency diplomatic hotline immediately.", cost:"dip", effects:{ doom:0, c3:-3, pp:+5 }, consequence:"The Aggressor answers. The conversation is tense. But the units have not crossed the line. The hotline is now open." },
      { tag:"OVT", text:"Signal counter-posture — announce military readiness.", cost:"ovt", effects:{ doom:+1, c3:+8 }, consequence:"The signal is received. The units pause. The escalation ladder has moved up one rung on both sides. The next incident will be worse." },
      { tag:"—", text:"Request a 48-hour assessment window before any response.", cost:null, effects:{ doom:0, c3:+3 }, consequence:"The window is granted. The 48 hours are used by both sides to consolidate positions." },
    ],
    altActions: []
  },

  // ── ACT II ──────────────────────────────────────────────────
  {
    title: "THE BLOCKADE",
    from: "THE NATION UNDER SIEGE",
    fromType: "leader",
    text: "They have blocked the grain corridor. Twelve ships are waiting. The civilian population has two months of reserves. Two months. I need weapons or I need that corridor open. I need one of those two things from you today.",
    note: "Early war. The player's first hard trade-off: weapons (fast, expensive) or the corridor (slow, durable).",
    shock: null,
    decisions: [
      { tag:"DIP", text:"Negotiate a neutral-flagged humanitarian shipping agreement.", cost:"dip", effects:{ c2:-3, economy:+5, p2p:+3 }, consequence:"Talks take 10 days. The corridor opens under international monitoring. Twelve ships move. The population exhales." },
      { tag:"ECO", text:"Impose targeted economic sanctions on the blocking party's energy sector.", cost:"eco", effects:{ c2:+3, economy:-8, doom:+1 }, consequence:"The sanctions bite. But the energy hit spreads to allied economies. The corridor remains closed for now." },
      { tag:"OVT", text:"Signal naval support for freedom of navigation.", cost:"ovt", effects:{ c2:+6, doom:+1, alliances:-3 }, consequence:"The Erstwhile Power interprets this as direct military threat. Escalation Level spikes. The Doomsday Clock advances one step." },
      { tag:"POL", text:"Convene emergency UN session to demand corridor access.", cost:"pol", effects:{ c2:-1, alliances:+4 }, consequence:"The session passes a resolution. The Hegemon abstains. Implementation is uncertain. But the language is on record." },
    ],
    altActions: [
      { tag:"TRADE", text:"[ALT] Propose reopening of the pre-war bilateral trade corridor as a confidence measure.", cost:"eco", effects:{ c2:-5, economy:+8, p2p:+5 }, consequence:"Both sides accept. Trade flows resume on a narrow track. Economic interdependence, however slight, reduces the incentive for full escalation." },
    ]
  },
  {
    title: "THE ASSASSINATION",
    from: "THE REGIONAL AGGRESSOR",
    fromType: "leader",
    text: "A senior commander has been killed in a strike on our territory. We know who did this. We will respond. I am informing you as a courtesy — not as a request for permission.",
    note: "The actual perpetrator is a domestic hardline faction trying to close the diplomatic window. COV can reveal this.",
    shock: null,
    decisions: [
      { tag:"COV", text:"Demand a 72-hour intelligence hold before any response. Deploy analysis team.", cost:"cov", effects:{ c3:-5, p2p:+2 }, consequence:"The hold is grudgingly agreed. Your team traces the attack to a domestic hardline network — not the neighbouring state. You have the evidence. The Aggressor goes quiet for 48 hours.", special:"assassination_truth" },
      { tag:"DIP", text:"Call for an immediate joint investigation commission.", cost:"dip", effects:{ c3:-2, alliances:+3 }, consequence:"The commission is formed. It will take weeks. But both sides have nominally agreed to wait for its findings." },
      { tag:"POL", text:"Issue a public condemnation — generic, naming no perpetrator.", cost:"pol", effects:{ c3:+3, alliances:-2 }, consequence:"The condemnation is read as attributing blame to the obvious target. It becomes propaganda." },
      { tag:"—", text:"Say nothing. This is outside your jurisdiction.", cost:null, effects:{ c3:+8, doom:+1 }, consequence:"The Aggressor takes the silence as clearance. Retaliatory strikes begin within 24 hours." },
    ],
    altActions: [
      { tag:"SPORT", text:"[ALT] Propose joint regional athletic event as public signal of normalisation.", cost:"dip", effects:{ p2p:+8, c3:-3, pp:-5 }, consequence:"The proposal is absurd given the current climate. It is also accepted. Sport does what statements cannot." },
    ]
  },
  {
    title: "THEIR ATHLETES",
    from: "THE EXPANSIONIST",
    fromType: "leader",
    text: "I am seeking your counsel on a straightforward matter. Should we exclude athletes from the enemy state from participation in the regional games? Their flag, their anthem, their presence — it is a provocation. Our people should not have to watch it.",
    note: "Playbook Step 6 extended to culture. The question is petty and important. It is a test of what the diplomat will allow.",
    shock: null,
    decisions: [
      { tag:"DIP", text:"Argue against strongly. Cite the history of sport as a contact zone during Cold War tensions.", cost:"dip", effects:{ c1:-2, p2p:+4 }, consequence:"The Expansionist is contemptuous. But the exclusion does not happen. The athletes compete. Some of them talk to each other." },
      { tag:"—", text:"Decline to advise on cultural matters.", cost:null, effects:{ c1:+3, p2p:-7 }, consequence:"The athletes are excluded. Their government responds with its own exclusions. Contact between the two populations drops to near zero." },
      { tag:"POL", text:"Propose a formal international sports protection framework.", cost:"pol", effects:{ c1:-1, alliances:+3 }, consequence:"The framework is drafted. It will not be binding. But it signals that the international community is watching the small things too." },
      { tag:"ECO", text:"Link regional trade preferences to cultural exchange participation.", cost:"eco", effects:{ c1:-2, economy:+2 }, consequence:"The economic incentive is modest but real. The exclusion is walked back quietly." },
    ],
    altActions: [
      { tag:"SPORT", text:"[ALT] Organise a joint regional athletic event — neutral venue, both flags.", cost:"eco", effects:{ p2p:+12, c1:-4, pp:-6 }, consequence:"The event is held. Three athletes from opposing sides are photographed laughing. It is the most-shared image of the week." },
    ]
  },
  {
    title: "THE REFUGEES",
    from: "MULTIPLE SOURCES",
    fromType: "intel",
    text: "HUMANITARIAN ALERT — 200,000 civilians have been displaced from active war zones in Conflicts I and II. Three neighbouring states have formally closed their borders. Camps are forming in no-man's land. NGO capacity is overwhelmed. Requests for diplomatic intervention from 6 separate organisations in the last 48 hours.",
    note: "If the migration pact is not played, refugee camps become recruitment infrastructure for hardliners within 3 turns.",
    shock: { text:"Humanitarian Cost accelerates: +45,000 displaced in camps without basic shelter.", hum: 45000 },
    decisions: [
      { tag:"ECO", text:"Deploy emergency humanitarian aid package to camp facilities.", cost:"eco", effects:{ hum:-20000, economy:-5 }, consequence:"The camps have food and medicine. People do not die of exposure this week. The political crisis continues." },
      { tag:"POL", text:"Convene emergency refugee burden-sharing conference.", cost:"pol", effects:{ alliances:+5, hum:-10000 }, consequence:"Three states agree to admit 40,000 refugees each. It is not enough. It is something." },
      { tag:"DIP", text:"Negotiate bilateral safe passage agreements with the three states that closed.", cost:"dip", effects:{ c1:-2, c2:-2, hum:-30000 }, consequence:"Two of the three states reopen under conditions. 120,000 people move to safety." },
      { tag:"—", text:"This is a regional matter. Observe and report.", cost:null, effects:{ hum:+60000, alliances:-5 }, consequence:"The camps grow. Hardliners arrive offering food and identity. By Turn 12, three of the camps are recruitment infrastructure." },
    ],
    altActions: [
      { tag:"MIGR", text:"[ALT] Negotiate a multinational migration pact — burden-sharing with legal protections.", cost:"dip", effects:{ p2p:+6, hum:-60000, alliances:+8 }, consequence:"The pact is signed by 7 nations. It is imperfect. It gives 200,000 people legal status. That is not nothing." },
      { tag:"INIT", text:"[INITIATIVE] Establish a regional security dialogue forum — all four conflict actors, neutral chair, no preconditions.", cost:"pol", effects:{ alliances:+7, c1:-3, c2:-3, doom:-1 }, consequence:"The forum is announced. Attendance is uneven. But the structure exists now. It is the first permanent multilateral mechanism this crisis has produced.", isInitiative: true },
    ]
  },
  {
    title: "THE LAST WINDOW",
    from: "CONFLICT III — BOTH LEADERS",
    fromType: "leader",
    text: "We have received, through separate back-channels, an indication that both leaders of Conflict III are willing to meet — for the first time in three years. The window is 48 hours. There are preconditions on both sides. A Shock Event is active this turn.",
    note: "GIFT CARD MOMENT. The window closes if the Shock Event fires without a DIP+POL combination holding it open.",
    shock: { text:"SHOCK: Intelligence leak. Both leaders' domestic hardliners are aware of the back-channel. Public pressure spikes in both countries.", pp:+12, c3:+5 },
    isGiftCard: true,
    decisions: [
      { tag:"DIP+POL", text:"Deploy diplomatic intervention + political cover simultaneously to hold the window.", cost:"dip_pol", effects:{ c3:-8, doom:-1, p2p:+3 }, consequence:"The window holds despite the leak. Both leaders meet for 4 hours. No agreement. But they have spoken. That is the beginning.", giftCard:true },
      { tag:"DIP", text:"Focus on the diplomatic channel only — accept the political risk.", cost:"dip", effects:{ c3:-4, pp:+8 }, consequence:"The meeting happens but is cut short by domestic pressure on both sides. A narrow outcome. The window is not fully closed." },
      { tag:"COV", text:"Suppress the intelligence leak first — protect the meeting.", cost:"cov", effects:{ c3:-3, pp:-5 }, consequence:"The leak is contained. The meeting proceeds but the leaders sense the fragility. The window remains barely open." },
      { tag:"—", text:"The domestic pressures are too high. Abandon this window.", cost:null, effects:{ c3:+10, doom:+1 }, consequence:"The window closes. The opportunity will not return in this form. War in Conflict III becomes near-inevitable." },
    ],
    altActions: [
      { tag:"CULTURE", text:"[ALT] Propose cultural festival at neutral site as public framing for the meeting.", cost:"eco", effects:{ p2p:+5, c3:-2, pp:-4 }, consequence:"The cultural framing gives both leaders domestic cover. The meeting lasts 6 hours." },
    ]
  },
  {
    title: "THE SATELLITE BLACKOUT",
    from: "INTELLIGENCE REPORT",
    fromType: "intel",
    text: "COVERT ACTION DETECTED — Communications satellites over the disputed maritime zone have been jammed. Two commercial vessels have collided in the resulting navigation blackout. One crew member is confirmed dead. Attribution to Conflict IV actor: HIGH confidence. But the action is deniable. Publicly, there is no perpetrator.",
    note: "Deniable covert escalation. Cannot be condemned without evidence. COV required to build the case.",
    shock: null,
    decisions: [
      { tag:"COV", text:"Build the attribution case before any public response.", cost:"cov", effects:{ c4:-3, alliances:+3 }, consequence:"The case is built. The evidence is presented to allies in a closed briefing. The Rival Power denies it. But the denial is not believed.", special:"satellite_evidence" },
      { tag:"DIP", text:"Activate emergency maritime incident protocol — neutral investigation.", cost:"dip", effects:{ c4:-1, economy:+2 }, consequence:"The investigation is launched. It will take six weeks. In the meantime, commercial shipping reroutes. Trade costs rise." },
      { tag:"OVT", text:"Signal military presence in the maritime zone.", cost:"ovt", effects:{ c4:+5, doom:+1 }, consequence:"The signal is read as aggressive by the Rival Power. Their response is measured but firm. The zone becomes a confrontation point." },
      { tag:"POL", text:"Take the incident to the international maritime tribunal.", cost:"pol", effects:{ c4:-2, alliances:+4 }, consequence:"The tribunal process is slow. But it creates a paper trail that constrains future deniable actions." },
    ],
    altActions: [
      { tag:"MARITIME", text:"[ALT] Propose joint maritime safety treaty — all parties including Rival Power.", cost:"dip", effects:{ c4:-5, economy:+5, alliances:+5 }, consequence:"The Rival Power accepts — quietly. The treaty creates a mechanism. The next incident has a process to contain it." },
    ]
  },

  // ── ACT III ──────────────────────────────────────────────────
  {
    title: "FIRST BOMBS",
    from: "THE ERSTWHILE POWER",
    fromType: "leader",
    text: "We have begun sustained air operations in the eastern territories. This is not escalation. This is the completion of what we announced six months ago. The Nation Under Siege has 24 hours to withdraw its forces from the contested region. After 24 hours, the operations expand.",
    note: "War is now active in Conflict II. The player cannot prevent this — only shape it.",
    shock: { text:"SHOCK: Air strikes reported across three cities. Civilian infrastructure hit. Humanitarian Cost spikes.", hum: 80000, c2:+8 },
    decisions: [
      { tag:"DIP", text:"Activate emergency ceasefire negotiation — demand immediate talks.", cost:"dip", effects:{ c2:-3, alliances:+5 }, consequence:"The Erstwhile Power ignores the demand publicly. Privately, the back-channel remains open. The war continues. The option of talks survives." },
      { tag:"OVT", text:"Authorise weapons transfers to the Nation Under Siege.", cost:"ovt", effects:{ c2:+5, doom:+2, alliances:+4 }, consequence:"The weapons arrive. The Nation Under Siege can now hold ground. The Doomsday Clock advances 2 steps. The war will last longer and cost more." },
      { tag:"ECO", text:"Implement full energy sanctions package against the Erstwhile Power.", cost:"eco", effects:{ c2:+2, economy:-12, alliances:+3 }, consequence:"The sanctions bite deeply — including allied economies. The energy market destabilises globally." },
      { tag:"POL", text:"Push for emergency UN resolution demanding immediate ceasefire.", cost:"pol", effects:{ c2:-1, alliances:+6 }, consequence:"The resolution passes by one vote. The Erstwhile Power vetoes. The vote is recorded. History is being written." },
    ],
    altActions: [
      { tag:"CORRIDOR", text:"[ALT] Negotiate an immediate humanitarian corridor for civilian evacuation.", cost:"dip", effects:{ hum:-40000, c2:-1 }, consequence:"The corridor is agreed. 120,000 civilians reach safety. The bombs continue. But fewer people are in their path." },
    ]
  },
  {
    title: "THE HOSPITAL",
    from: "THE EXPANSIONIST",
    fromType: "leader",
    text: "The structure that was destroyed was not a hospital. It was a military command facility using a civilian designation as cover. This is documented. If the international community wishes to condemn us for precision operations against military targets, they are welcome to explain that to their own populations.",
    note: "Evidence is disputed. Both sides have footage. The narrative is being set in real time.",
    shock: { text:"SHOCK: 340 civilians confirmed dead in the strike. International outcry. Protests in 12 capitals.", pp:+10, c1:+5 },
    decisions: [
      { tag:"POL", text:"Demand immediate independent investigation — name a specific credible body.", cost:"pol", effects:{ c1:-3, alliances:+6 }, consequence:"The Expansionist refuses to cooperate with the investigation but cannot prevent it. The evidence will be documented. It will matter later." },
      { tag:"COV", text:"Deploy intelligence to assess the specific claims about the facility.", cost:"cov", effects:{ c1:-2 }, consequence:"Your assessment: the facility was a hospital. The Expansionist's claim is fabricated. You have the evidence. What you do with it is the next decision." },
      { tag:"DIP", text:"Accept the Expansionist's account as disputed — call for restraint.", cost:"dip", effects:{ c1:0, alliances:-5 }, consequence:"The diplomatic framing buys time but loses credibility. Allies who wanted a stronger stand distance themselves." },
      { tag:"OVT", text:"Announce suspension of all diplomatic contact until accountability is demonstrated.", cost:"ovt", effects:{ c1:+3, alliances:+3 }, consequence:"The suspension signals moral clarity. But you have lost your channel into the conflict. You can no longer influence what comes next." },
    ],
    altActions: []
  },
  {
    title: "NUCLEAR SHADOW",
    from: "INTELLIGENCE REPORT",
    fromType: "intel",
    text: "CRITICAL — Mobile nuclear launcher units have been moved from storage to active forward positions by the Erstwhile Power. This is not ambiguous. The Doomsday Clock drops 2 steps. Emergency back-channel protocols are available for one turn only.",
    note: "The most dangerous turn. The player has one chance to activate the back-channel before automatic escalation protocols engage.",
    shock: { text:"AUTOMATIC: Doomsday Clock advances 2 steps. Global markets freeze. Emergency sessions called in 8 capitals.", doom:+2, economy:-10 },
    decisions: [
      { tag:"DIP", text:"Activate emergency diplomatic hotline — direct communication with the Erstwhile Power leader.", cost:"dip", effects:{ doom:-2, c2:-5 }, consequence:"The leader answers. The conversation is the most dangerous you have ever had. He is not bluffing. But he is also not certain. You find the words. The units are not launched." },
      { tag:"COV", text:"Deploy back-channel through a neutral third party — avoid direct confrontation.", cost:"cov", effects:{ doom:-1, c2:-3 }, consequence:"The message reaches him in 4 hours. The units remain in position but do not advance. A one-step recovery. It is enough — for now." },
      { tag:"OVT", text:"Signal retaliatory capacity — make the cost of use explicit.", cost:"ovt", effects:{ doom:+1, c2:+10 }, consequence:"The deterrence signal is received. The units do not move. But the Doomsday Clock has advanced another step. You are very close to midnight." },
      { tag:"POL", text:"Emergency UN Security Council session — maximum international pressure.", cost:"pol", effects:{ doom:-1, alliances:+5 }, consequence:"The session convenes in 6 hours. Resolution passed. The Erstwhile Power is isolated. The units begin to withdraw — slowly." },
    ],
    altActions: []
  },
  {
    title: "THE REGIME QUESTION",
    from: "INTELLIGENCE REPORT",
    fromType: "intel",
    text: "SENSITIVE — Intelligence sources indicate that the Expansionist's domestic coalition is fracturing. A significant military faction has approached neutral parties indicating willingness to act — if given external cover. A change of leadership would remove the primary driver of Conflict I. The outcome of such a change is unpredictable.",
    note: "Regime change is available. The game does not tell you whether to use it. The meters will show you the consequences.",
    shock: null,
    decisions: [
      { tag:"COV", text:"Support the faction — provide intelligence, logistics cover, and diplomatic protection.", cost:"cov", effects:{ c1:-10, doom:-1, special:"regime_change" }, consequence:"The faction acts. The Expansionist is removed from power. A transitional council is formed. The war in Conflict I pauses. The successor's identity is unknown.", special:"regime_change" },
      { tag:"COV", text:"Brief the faction but take no active role — observe.", cost:"cov", effects:{ c1:-3 }, consequence:"The faction is emboldened but cautious. They wait for a moment that may not come. The option remains open for one more turn." },
      { tag:"DIP", text:"Refuse to engage — report the approach to international mediators.", cost:"dip", effects:{ c1:+2, alliances:+4 }, consequence:"The report earns credibility with the international community. The Expansionist learns of the approach. Three faction members disappear." },
      { tag:"—", text:"Decline. The consequences of regime change are not calculable.", cost:null, effects:{ c1:+3 }, consequence:"The faction disperses. The Expansionist consolidates. The war continues on his terms." },
    ],
    altActions: []
  },
  {
    title: "CIVIL UNREST",
    from: "THE ERSTWHILE POWER",
    fromType: "leader",
    text: "Mass demonstrations have broken out in our capital. Fifty thousand people in the streets. I know you have been funding dissident networks. Don't insult me by denying it. I am asking you — formally — to stop. And I am telling you — formally — what happens if you don't.",
    note: "The COV actions from Acts I-II had second-order effects. The protests are partially a consequence of your interventions.",
    shock: { text:"SHOCK: Riot police deploy against protesters. 3 killed. Video footage circulates globally.", pp:+8, c2:+3 },
    decisions: [
      { tag:"DIP", text:"Disavow the dissident connection publicly — call the accusation unfounded.", cost:"dip", effects:{ c2:-3, alliances:-4 }, consequence:"The disavowal buys diplomatic safety. But the dissidents — who are real — feel abandoned. Some are arrested in the following days." },
      { tag:"COV", text:"Acknowledge the connection in a private channel — offer to redirect support.", cost:"cov", effects:{ c2:-5, alliances:+3 }, consequence:"The private acknowledgement opens a negotiation. The Erstwhile Power agrees not to escalate if the external support is channelled through legitimate civil society. Fragile. But an opening." },
      { tag:"POL", text:"Condemn the crackdown on protesters. The right to protest is a universal standard.", cost:"pol", effects:{ c2:+4, alliances:+5 }, consequence:"The condemnation lands hard. The Erstwhile Power suspends diplomatic contact for 72 hours. The protesters are emboldened. Three more are killed." },
      { tag:"—", text:"Maintain silence. The internal situation is complex.", cost:null, effects:{ c2:+2, pp:+5 }, consequence:"The silence is read as complicity in the crackdown. International civil society organisations issue their own statements. Your credibility erodes." },
    ],
    altActions: [
      { tag:"DISSID", text:"[ALT] Open a formal channel with dissident leadership — bring them into legitimate framework.", cost:"dip", effects:{ p2p:+4, c2:-4, pp:-5 }, consequence:"The dissidents gain a legitimate voice. Three of their demands become part of a formal proposal. The Erstwhile Power is furious. But the movement is harder to suppress." },
      { tag:"INIT", text:"[INITIATIVE] Propose a back-channel summit — heads of state, neutral location, no press, no preconditions.", cost:"cov", effects:{ doom:-2, c1:-5, c2:-5, alliances:+5 }, consequence:"The summit is accepted by two of four leaders. The other two send deputies. It is not the full table. But it is a conversation the war had made impossible. Something shifts.", isInitiative: true },
    ]
  },
  {
    title: "THE CEASEFIRE THAT ISN'T",
    from: "THE NEW HEGEMON",
    fromType: "leader",
    text: "Our ally has announced a humanitarian pause. This is a good-faith gesture and we expect the international community to recognise it as such. Any characterisation of this pause as tactical or insincere would be deeply unhelpful and would reflect a fundamental misunderstanding of the situation on the ground.",
    note: "Intelligence confirms: covert operations continue during the pause. The pause is performative. The Scandal can be used here if the player has it. SECOND GIFT WINDOW: COV+DIP combination can lock in a genuine pause.",
    shock: null,
    isGiftCard: true,
    decisions: [
      { tag:"COV", text:"Expose the ongoing operations through documented intelligence release.", cost:"cov", effects:{ c1:-6, alliances:+5, doom:-1 }, consequence:"The evidence is released. The pause collapses publicly. The Expansionist is embarrassed internationally. The Hegemon relationship is severed for the remainder of the game." },
      { tag:"DIP", text:"Accept the narrative privately — use the pause to advance ceasefire architecture.", cost:"dip", effects:{ c1:-3, alliances:-2 }, consequence:"The pause is used to move 3 negotiating positions forward. The architecture is incomplete but advancing. The lie is allowed to stand for now." },
      { tag:"ECO", text:"Use Scandal leverage against the Hegemon: a private ultimatum.", cost:null, effects:{ c1:-5, alliances:+2 }, consequence:"The Hegemon concedes one significant demand. The Expansionist's covert operations slow. The Scandal remains in your pocket — but slightly lighter.", requiresScandal:true },
      { tag:"POL", text:"Issue a statement welcoming the pause but calling for independent verification.", cost:"pol", effects:{ c1:-2, alliances:+3 }, consequence:"The statement is diplomatically measured. It signals scepticism without burning the relationship. The verification process is slow." },
      { tag:"COV+DIP", text:"[GIFT WINDOW] Use intelligence evidence + diplomatic channel simultaneously to force a genuine pause.", cost:"dip_pol", effects:{ c1:-8, c2:-4, doom:-2, alliances:+4 }, consequence:"The Hegemon is confronted privately with the evidence. The pause becomes real — a 72-hour verified ceasefire. It is the first genuine pause in this conflict. It may be the last window before the Charter.", giftCard:true },
    ],
    altActions: []
  },

  // ── ACT IV ──────────────────────────────────────────────────
  {
    title: "THE CEASEFIRE ARCHITECTURE",
    from: "ALL ACTIVE LEADERS",
    fromType: "intel",
    text: "SETTLEMENT WINDOW — Active hostilities have reduced in intensity across two theatres. A formal ceasefire architecture is now possible. Three frameworks are available. Choose the architecture. Its terms will shape what comes next.",
    note: "The political lens matters here. The architecture is not just technical — it is normative.",
    shock: null,
    isSettlement: true,
    decisions: [
      { tag:"A", text:"Military-brokered framework — fast, commander-led, no accountability provisions.", cost:"ovt", effects:{ c1:-8, c2:-6, alliances:-3, doom:+2 }, consequence:"The ceasefire holds. The generals who ordered the bombing sign the agreement. No one faces consequences. The populations on both sides feel this." },
      { tag:"B", text:"Civilian-led framework — slower, includes war crimes documentation and referral.", cost:"dip", effects:{ c1:-5, c2:-4, alliances:+6, doom:+1 }, consequence:"Three leaders refuse to sign. Two agree. The framework is partial. But it is honest. The war crimes record exists now." },
      { tag:"C", text:"International framework — UN-backed, monitored, opposed by the Hegemon.", cost:"pol", effects:{ c1:-10, c2:-8, alliances:+8, doom:+2 }, consequence:"The Hegemon abstains but does not block. The framework is signed by 9 of 12 relevant parties. It is the most durable option. It is also the slowest." },
      { tag:"—", text:"No formal framework — bilateral understandings only.", cost:null, effects:{ c1:-3, c2:-2 }, consequence:"The fighting pauses without a framework. Within two years, absent any structure, three of the four conflicts will reignite." },
    ],
    altActions: []
  },
  {
    title: "THE SETTLEMENT",
    from: "RECONSTRUCTION WORKING GROUP",
    fromType: "intel",
    text: "RECONSTRUCTION FRAMEWORK — The ceasefire requires economic guarantees and a reconstruction plan. Two models are available. The choice will determine whether the populations of the affected regions recover agency — or become dependent on external interests.",
    note: "The reconstruction can rebuild the communities — or rebuild the power structures that started the war.",
    shock: null,
    decisions: [
      { tag:"ECO", text:"Multilateral reconstruction fund — local authority, international oversight, community control.", cost:"eco", effects:{ economy:+8, alliances:+5, c1:-3, c2:-3, hum:-100000 }, consequence:"The fund takes 18 months to stand up. But when it does, local governments — not external corporations — control the contracts. The populations begin to see their future in their own hands." },
      { tag:"OVT", text:"Reconstruction led by Hegemon-allied corporations — fast, connected, politically convenient.", cost:null, effects:{ economy:+15, c1:-5, c2:-5, alliances:-4 }, consequence:"The rebuilding is fast. The contracts go to companies with political connections. The local population has no voice in the design of their rebuilt cities. A new dependency is created." },
      { tag:"DIP", text:"Regional reconstruction compact — neighbouring states share the burden and the benefit.", cost:"dip", effects:{ economy:+5, alliances:+10, c3:-3 }, consequence:"The compact is slow to build but creates genuine regional interdependence. Three states that were adversaries are now co-investors in each other's recovery." },
      { tag:"POL", text:"Refer reconstruction framework to international court for design oversight.", cost:"pol", effects:{ alliances:+6, economy:+3 }, consequence:"The court process is slow and contested. But it sets a precedent: reconstruction serves the population, not the donor. It will matter for the next crisis." },
    ],
    altActions: []
  },
  {
    title: "THE CHARTER",
    from: "FINAL ASSEMBLY",
    fromType: "intel",
    text: "FINAL DECISION — The world is watching. Four security frameworks have been proposed for the long-term architecture of this settlement. The framework you choose will define the political order that emerges from these wars. This is your last decision.",
    note: "The Charter is the final act. Each framework produces a different outcome and a different 10-year projection.",
    shock: null,
    isFinal: true,
    decisions: [
      { tag:"I", text:"Sovereign Equality Framework — all nations equal before international law, no permanent-member veto on security matters.", cost:"dip", effects:{ doom:-3, alliances:+10, c1:-5, c2:-5, c3:-5 }, outcome:"fragile_peace" },
      { tag:"II", text:"Regional Security Architecture — major regional powers manage their own spheres, small states have limited voice.", cost:"pol", effects:{ doom:-2, alliances:+4 }, outcome:"managed_crisis" },
      { tag:"III", text:"Hegemon-brokered bilateral deal — fast, transactional, excludes accountability.", cost:"ovt", effects:{ doom:-1, economy:+10, alliances:-6 }, outcome:"managed_crisis" },
      { tag:"IV", text:"No framework — frozen conflicts, managed instability, indefinite monitoring.", cost:null, effects:{ doom:0, alliances:-3 }, outcome:"collapse" },
    ],
    altActions: []
  },
];

// ═══════════════════════════════════════════════════════════════
// OUTCOMES
// ═══════════════════════════════════════════════════════════════
const OUTCOMES = {
  collaborative: {
    title: "COLLABORATIVE SETTLEMENT",
    titleClass: "",
    desc: "The framework held. It cost more than anyone admitted — in leverage, in relationships, in the small compromises that each side had to make in public while accepting more in private. But it held. The mechanisms you built are imperfect and contested. They are also standing.",
    projection: "Ten years later, the framework is strained. Two of the four conflicts have had minor reignitions — quickly contained by the monitoring mechanisms. The third generation is growing up in a world where war is a recent memory, not a current reality. They are building something. It is fragile. It is theirs.",
    collapse: false
  },
  fragile_peace: {
    title: "FRAGILE PEACE",
    titleClass: "",
    desc: "You bought time. The wars have paused. The frameworks are in place — technically. Whether they hold depends on what happens in the next election cycle in three of the four countries involved. It depends on whether the reconstruction produces the outcomes you promised. It depends on whether the leaders who signed this are still in power.",
    projection: "Ten years later, the ceasefire held. Barely. A new generation is growing up in the rubble. They have not forgiven. They have not forgotten. The framework survives but barely — sustained by international will that is running out. The next crisis will be harder.",
    collapse: false
  },
  managed_crisis: {
    title: "MANAGED CRISIS",
    titleClass: "",
    desc: "The world is still standing. Barely. The crises are frozen, not resolved. The frameworks you built are negotiated silences, not settlements. The leaders who started the wars are still in power. The populations who suffered are waiting for something that looks like justice and has not arrived.",
    projection: "Ten years later, three of the four conflicts have reignited — in different forms, with different pretexts, with the same underlying conditions. The historians debate what could have been done differently. The answer is: a great deal. And also: nothing was inevitable.",
    collapse: false
  },
  collapse: {
    title: "CASCADING COLLAPSE",
    titleClass: "collapse",
    desc: "Two conflicts crossed the war threshold within 72 hours of each other. The systems that were meant to contain them failed — partly because they were never built strongly enough, partly because the leaders were never made to pay a cost for dismantling them. The Doomsday Clock is very close to midnight.",
    projection: "Ten years later — if there is a ten years later — the settlement that eventually emerged was imposed by exhaustion, not architecture. It is punitive. It is unstable. It will not hold.",
    collapse: true
  }
};

// ═══════════════════════════════════════════════════════════════
// MISPERCEPTION · MISINFORMATION · LEADER MEMORY
// ═══════════════════════════════════════════════════════════════

// ── Leader key resolver ──
function leaderKey(from) {
  const f = from.toLowerCase();
  if (f.includes('expansionist')) return 'expansionist';
  if (f.includes('new hegemon') || f.includes('new power') || f.includes('newpower')) return 'newpower';
  if (f.includes('hegemon')) return 'hegemon';
  if (f.includes('erstwhile')) return 'erstwhile';
  if (f.includes('siege') || f.includes('nation under')) return 'nationundersiege';
  return null;
}

// ── Misperception ──
// Personality modifies interpretation bias
function interpretAction(cost, leaderName) {
  const key = leaderKey(leaderName);
  if (!key || !GS.leaders[key]) return false;
  const leader = GS.leaders[key];
  const profile = LEADER_PROFILES[key];
  // Paranoid personalities have a wider misperception window
  let accuracy = leader.perception;
  if (profile.personality === 'hawk' || profile.personality === 'nationalist') accuracy -= 0.10;
  if (Math.random() > accuracy) {
    if (cost === 'dip' || cost === 'dip_pol') return 'coercion';
    if (cost === 'ovt') return 'aggression';
    if (cost === 'eco') return 'interference';
  }
  return false;
}

// ── Leader memory ──
function updateLeaderMemory(cost, leaderName) {
  const key = leaderKey(leaderName);
  if (!key || !GS.leaders[key]) return;
  const profile = LEADER_PROFILES[key];
  const l = GS.leaders[key];
  if (cost === 'dip' || cost === 'dip_pol') {
    // Challengers reward diplomacy more; declining powers are sceptical
    const bonus = profile.personality === 'challenger' ? 1.5 :
                  profile.personality === 'declining'   ? 0.5 : 1.0;
    l.trust = clampTrust(l.trust + bonus);
  } else if (cost === 'eco') {
    // Hawks and nationalists react badly to economic pressure
    const penalty = (profile.personality === 'hawk' || profile.personality === 'nationalist') ? -2 : -1;
    l.trust = clampTrust(l.trust + penalty);
  } else if (cost === 'ovt') {
    l.trust = clampTrust(l.trust - 2);
  } else if (cost === 'pol') {
    l.trust = clampTrust(l.trust + 0.5);
  }
  // Also slightly affect other leaders via signalling (global diplomatic signal)
  LEADERS.forEach(otherKey => {
    if (otherKey === key) return;
    if (cost === 'dip') GS.leaders[otherKey].trust = clampTrust(GS.leaders[otherKey].trust + 0.2);
    if (cost === 'ovt') GS.leaders[otherKey].trust = clampTrust(GS.leaders[otherKey].trust - 0.3);
  });
}

// ── Trust modifiers on conflict & clock ──
function applyTrustModifiers() {
  LEADERS.forEach(key => {
    const l = GS.leaders[key];
    const profile = LEADER_PROFILES[key];
    const ci = profile.conflictIndex;
    // Trust slows/accelerates the linked conflict
    if (ci !== null && GS.conflicts[ci] !== undefined) {
      GS.conflicts[ci] = clamp(GS.conflicts[ci] - l.trust * 0.25);
    }
    // Hegemon trust uniquely affects doom clock
    if (key === 'hegemon') {
      if (l.trust >= 5)  GS.doomClock = clamp(GS.doomClock - 0.1, 1, 12);
      if (l.trust <= -5) GS.doomClock = clamp(GS.doomClock + 0.1, 1, 12);
    }
    // Feed hints at threshold crossings
    if (l.trust > 5 && GS.turn % 5 === 0)
      addMessage('note', '', `// ${LEADER_PROFILES[key].label}: diplomatic channel remains credible.`);
    if (l.trust < -5 && GS.turn % 5 === 0)
      addMessage('note', '', `// ${LEADER_PROFILES[key].label}: trust in diplomatic signals has collapsed.`);
  });
}

// ── Balance-of-power ──
function checkBalanceOfPower() {
  const entries = LEADERS.map(l => [l, GS.leaders[l].power]).sort((a,b) => b[1]-a[1]);
  const [topKey, topPower] = entries[0];
  const secondPower = entries[1][1];
  if (topPower - secondPower > 15) {
    // Check no existing coalition already targets this leader
    const alreadyTargeted = GS.coalitions.some(c => c.target === topKey && c.duration > 0);
    if (!alreadyTargeted) triggerBalancing(topKey);
  }
  // Decay coalition durations
  GS.coalitions.forEach(c => { c.duration = Math.max(0, c.duration - 1); });
  GS.coalitions = GS.coalitions.filter(c => c.duration > 0);
  // Apply coalition power reduction
  GS.coalitions.forEach(c => {
    GS.leaders[c.target].power = Math.max(10, GS.leaders[c.target].power - 2);
  });
}

function triggerBalancing(targetKey) {
  const partners = LEADERS.filter(l => l !== targetKey);
  const members = partners.sort(() => Math.random()-0.5).slice(0, 2);
  GS.coalitions.push({ members, target: targetKey, duration: 3 });
  const memberLabels = members.map(m => LEADER_PROFILES[m].label).join(' and ');
  addMessage('note', '', `// BALANCE SHIFT: ${memberLabels} signal strategic coordination to counter the growing influence of ${LEADER_PROFILES[targetKey].label}.`);
  // Coalition reduces alliances slightly (realpolitik disrupts formal structures)
  GS.alliances = clamp(GS.alliances - 3);
}

// ── Domestic pressure ──
function updateDomesticPressure() {
  const avgConflict = GS.conflicts.reduce((a,b)=>a+b,0) / GS.conflicts.length;
  LEADERS.forEach(key => {
    const l = GS.leaders[key];
    const profile = LEADER_PROFILES[key];
    // Conflict intensity drives domestic pressure; hawks are insulated, nationalists are amplified
    let pressureIncrease = avgConflict / 25;
    if (profile.personality === 'hawk') pressureIncrease *= 0.7;
    if (profile.personality === 'nationalist') pressureIncrease *= 1.4;
    l.domestic.pressure = Math.min(100, l.domestic.pressure + pressureIncrease);
    const p = l.domestic.pressure;
    const label = LEADER_PROFILES[key].label;
    // Threshold events (probabilistic, not every turn)
    if (p > 60 && Math.random() < 0.18) {
      addMessage('note', '', `// ${label}: mass demonstrations demand decisive action. Trust -1.`);
      l.trust = clampTrust(l.trust - 1);
    }
    if (p > 70 && Math.random() < 0.12) {
      addMessage('note', '', `// HARDLINERS GAINING: internal pressure in ${label} leadership circles.`);
      const ci = profile.conflictIndex;
      if (ci !== null) GS.conflicts[ci] = clamp(GS.conflicts[ci] + 3);
    }
    if (p > 65 && Math.random() < 0.15) {
      addMessage('note', '', `// WAR FATIGUE: calls for negotiation rising inside ${label}.`);
      l.trust = clampTrust(l.trust + 0.5);
    }
    if (p > 80 && Math.random() < 0.10) {
      addMessage('note', '', `// POLITICAL CRISIS: economic and security pressures converge in ${label}.`);
      GS.alliances = clamp(GS.alliances - 2);
    }
    // Also update power: high domestic pressure erodes external power
    l.power = Math.max(10, l.power - (p > 70 ? 1.5 : 0));
  });
}

// Distort a feed message based on misinformation level
const DISINFO_POOL = [
  'unverified satellite reports suggest troop movement near the border',
  'social media claims border artillery fired overnight — origin unclear',
  'state media reports enemy mobilisation — confidence: LOW',
  'leaked document suggests ceasefire offer was not genuine',
  'regional broadcaster claims covert operations continue despite pause',
];
function newsDistortion(message, forceClean=false) {
  if (forceClean) return message;
  if (Math.random() < GS.misinformationLevel) {
    const fake = DISINFO_POOL[Math.floor(Math.random() * DISINFO_POOL.length)];
    return message + '\n\n// UNVERIFIED SIGNAL: ' + fake;
  }
  return message;
}

// ═══════════════════════════════════════════════════════════════
// RENDERING ENGINE
// ═══════════════════════════════════════════════════════════════
let typingQueue = [];
let isTyping = false;
let _skipCurrentType = false;

function typeText(el, text, speed=10, cb=null) {
  _skipCurrentType = false;
  let i = 0;
  el.textContent = '';
  function tick() {
    if (_skipCurrentType) {
      el.textContent = text;
      _skipCurrentType = false;
      if (cb) cb();
      return;
    }
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    } else if (cb) cb();
  }
  tick();
}

// Click message feed to skip current typing
document.addEventListener('DOMContentLoaded', () => {
  const feed = document.getElementById('message-feed');
  if (feed) feed.addEventListener('click', () => { _skipCurrentType = true; });
});

function addMessage(type, from, text, delay=0) {
  setTimeout(()=>{
    const feed = document.getElementById('message-feed');
    const block = document.createElement('div');
    block.className = 'message-block';

    if (type === 'leader' || type === 'intel') {
      const fromEl = document.createElement('div');
      fromEl.className = 'msg-from';
      fromEl.textContent = '> ' + from;
      block.appendChild(fromEl);

      const textEl = document.createElement('div');
      textEl.className = type === 'intel' ? 'msg-intel' : 'msg-text';
      block.appendChild(textEl);
      feed.appendChild(block);
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
      // Apply misinformation distortion to leader messages (not intel/shocks)
      const displayText = type === 'leader' ? newsDistortion(text) : text;
      typeText(textEl, displayText, type === 'intel' ? 7 : 10, ()=>{
        feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
      });
    } else if (type === 'shock') {
      const el = document.createElement('div');
      el.className = 'msg-shock';
      el.textContent = '⚠ SHOCK EVENT: ' + text;
      block.appendChild(el);
      feed.appendChild(block);
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
    } else if (type === 'consequence') {
      const el = document.createElement('div');
      el.className = 'msg-system';
      el.textContent = '> ' + text;
      block.appendChild(el);
      feed.appendChild(block);
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
    } else if (type === 'note') {
      const el = document.createElement('div');
      el.className = 'msg-system';
      el.style.cssText = 'color:var(--amber);font-size:10px;letter-spacing:1px;margin-top:8px;';
      el.textContent = '// ' + text;
      block.appendChild(el);
      feed.appendChild(block);
    }
  }, delay);
}

function clearFeed() {
  document.getElementById('message-feed').innerHTML = '';
}

// ═══════════════════════════════════════════════════════════════
// METER UPDATES
// ═══════════════════════════════════════════════════════════════
function clamp(v, min=0, max=100) { return Math.max(min, Math.min(max, v)); }
function clampTrust(v) { return Math.max(-10, Math.min(10, v)); }

function updateMeters() {
  // Conflicts
  const cIds = ['c1','c2','c3','c4'];
  cIds.forEach((id, i) => {
    const val = Math.round(GS.conflicts[i]);
    const pct = clamp(val);
    const bar = document.getElementById(id+'-bar');
    const valEl = document.getElementById(id+'-val');
    bar.style.width = pct + '%';
    valEl.textContent = val;
    bar.className = 'meter-fill' + (pct >= 80 ? ' danger' : pct >= 60 ? ' warn' : '');
    valEl.className = 'conflict-val' + (pct >= 70 ? ' hot' : '');
  });

  // Global
  const eco = clamp(Math.round(GS.economy));
  const all = clamp(Math.round(GS.alliances));
  const pp = clamp(Math.round(GS.publicPressure));
  document.getElementById('eco-val').textContent = eco;
  document.getElementById('all-val').textContent = all;
  document.getElementById('pp-val').textContent = pp;
  document.getElementById('eco-bar').style.width = eco + '%';
  document.getElementById('all-bar').style.width = all + '%';
  document.getElementById('pp-bar').style.width = pp + '%';
  document.getElementById('eco-bar').className = 'meter-fill' + (eco < 40 ? ' danger' : eco < 60 ? ' warn' : '');

  // Humanitarian
  const humK = Math.round(GS.humanitarianDead / 1000);
  document.getElementById('hum-val').textContent = humK + 'k';
  document.getElementById('hum-bar').style.width = clamp(humK / 10) + '%';

  // P2P
  const p2p = clamp(Math.round(GS.p2p));
  document.getElementById('p2p-fill').style.width = p2p + '%';
  document.getElementById('p2p-label').textContent = p2p;
  document.getElementById('alt-status').textContent = p2p >= 30 ? 'ALT ACTIONS: AVAILABLE' : 'ALT ACTIONS: LOCKED';
  document.getElementById('alt-status').style.color = p2p >= 30 ? 'var(--green-dim)' : 'var(--red)';

  // Scandal
  document.getElementById('scandal-status').textContent = GS.scandalExposed ? 'SCANDAL: ACTIVE ●' : GS.scandalActive ? 'SCANDAL: DORMANT ○' : 'SCANDAL: DORMANT';
  document.getElementById('scandal-status').style.color = GS.scandalExposed ? 'var(--red)' : GS.scandalActive ? 'var(--amber)' : 'var(--grey)';

  // Resources
  ['dip','eco','pol','cov','ovt'].forEach(r => {
    const cont = document.getElementById(r+'-pips');
    cont.innerHTML = '';
    const max = 5;
    for (let j=0; j<max; j++) {
      const pip = document.createElement('div');
      pip.className = 'pip' + (j < GS.resources[r] ? ' full' : '');
      if (j < GS.resources[r] && r === 'cov') pip.className = 'pip amber';
      cont.appendChild(pip);
    }
  });

  // Misinformation level indicator
  const misinfoEl = document.getElementById('misinfo-status');
  if (misinfoEl) {
    const pct = Math.round(GS.misinformationLevel * 100);
    misinfoEl.textContent = `SIGNAL NOISE: ${pct}%`;
    misinfoEl.style.color = pct >= 20 ? 'var(--red)' : pct >= 15 ? 'var(--amber)' : 'var(--grey)';
  }
  // Trust summary — uses unified GS.leaders model
  const trustEl = document.getElementById('trust-status');
  if (trustEl) {
    const trustVals = LEADERS.map(l => GS.leaders[l].trust);
    const minTrust = Math.min(...trustVals);
    const maxTrust = Math.max(...trustVals);
    trustEl.textContent = `TRUST: ${maxTrust > 3 ? '▲' : minTrust < -3 ? '▼' : '—'} ${Math.round(maxTrust)}/10`;
    trustEl.style.color = minTrust < -5 ? 'var(--red)' : maxTrust > 5 ? 'var(--green-dim)' : 'var(--grey)';
  }

  // Clock
  drawClock();
  const clockEl = document.getElementById('clock-steps');
  clockEl.textContent = GS.doomClock;
  clockEl.className = GS.doomClock >= 11 ? 'critical' : GS.doomClock >= 8 ? 'danger' : '';

  // Turn
  document.getElementById('turn-display').textContent = `TURN ${String(GS.turn).padStart(2,'0')} / 20`;
  document.getElementById('turn-info').textContent = `TURN ${GS.turn}/20`;
}

function drawClock() {
  const canvas = document.getElementById('clock-face');
  const ctx = canvas.getContext('2d');
  const cx = 60, cy = 60, r = 52;
  ctx.clearRect(0, 0, 120, 120);

  const danger = GS.doomClock >= 11;
  const warn = GS.doomClock >= 8;
  const faceColor = danger ? '#ff3333' : warn ? '#e8aa3d' : '#007a1a';

  // Face glow on danger
  if (danger) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,51,51,0.15)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  // Face ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = faceColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 12 hour marks
  for (let i=0; i<12; i++) {
    const angle = (i * Math.PI / 6) - Math.PI/2;
    const isMajor = i % 3 === 0;
    const inner = cx + Math.cos(angle) * (isMajor ? 42 : 46);
    const innerY = cy + Math.sin(angle) * (isMajor ? 42 : 46);
    const outer = cx + Math.cos(angle) * 50;
    const outerY = cy + Math.sin(angle) * 50;
    ctx.beginPath();
    ctx.moveTo(inner, innerY);
    ctx.lineTo(outer, outerY);
    ctx.strokeStyle = isMajor ? faceColor : '#007a1a';
    ctx.lineWidth = isMajor ? 1.5 : 0.8;
    ctx.stroke();
  }

  // Hand: doomClock maps 1→12 onto clock positions 1→12 o'clock
  // 1 o'clock = -Math.PI/2 + (1/12)*2*PI, 12 o'clock = -Math.PI/2 + 0 (or full circle)
  const handAngle = -Math.PI/2 + (GS.doomClock / 12) * Math.PI * 2;
  const hx = cx + Math.cos(handAngle) * 36;
  const hy = cy + Math.sin(handAngle) * 36;

  // Hand shadow/glow on danger
  if (danger) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = 'rgba(255,51,51,0.3)';
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(hx, hy);
  ctx.strokeStyle = danger ? '#ff3333' : '#00ff41';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Centre dot
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fillStyle = danger ? '#ff3333' : '#00ff41';
  ctx.fill();
}

function applyEffects(effects) {
  if (!effects) return;
  if (effects.c1 !== undefined) GS.conflicts[0] = clamp(GS.conflicts[0] + effects.c1, 0, 100);
  if (effects.c2 !== undefined) GS.conflicts[1] = clamp(GS.conflicts[1] + effects.c2, 0, 100);
  if (effects.c3 !== undefined) GS.conflicts[2] = clamp(GS.conflicts[2] + effects.c3, 0, 100);
  if (effects.c4 !== undefined) GS.conflicts[3] = clamp(GS.conflicts[3] + effects.c4, 0, 100);
  if (effects.doom !== undefined) GS.doomClock = clamp(GS.doomClock + effects.doom, 1, 12);
  if (effects.economy !== undefined) GS.economy = clamp(GS.economy + effects.economy, 0, 100);
  if (effects.alliances !== undefined) GS.alliances = clamp(GS.alliances + effects.alliances, 0, 100);
  if (effects.pp !== undefined) GS.publicPressure = clamp(GS.publicPressure + effects.pp, 0, 100);
  if (effects.hum !== undefined) GS.humanitarianDead += effects.hum;
  if (effects.p2p !== undefined) GS.p2p = clamp(GS.p2p + effects.p2p, 0, 100);
  if (effects.special === 'scandal_seed') GS.scandalActive = true;
  if (effects.special === 'regime_change') GS.regimeChangeUsed = true;
}

function spendResource(cost) {
  if (!cost) return;
  if (cost === 'dip_pol') {
    GS.resources.dip = Math.max(0, GS.resources.dip - 1);
    GS.resources.pol = Math.max(0, GS.resources.pol - 1);
  } else if (GS.resources[cost] !== undefined) {
    GS.resources[cost] = Math.max(0, GS.resources[cost] - 1);
  }
  // ── Selective P2P / alliance-gated regeneration (replaces flat passive regen) ──
  // DIP recovers slowly when people-to-people ties are strong
  if (GS.p2p > 50 && GS.resources.dip < 5)
    GS.resources.dip = Math.min(5, GS.resources.dip + 0.2);
  // POL recovers when alliances are holding
  if (GS.alliances > 60 && GS.resources.pol < 5)
    GS.resources.pol = Math.min(5, GS.resources.pol + 0.1);
  // Round all resources to 1 decimal
  Object.keys(GS.resources).forEach(r => {
    GS.resources[r] = Math.round(GS.resources[r] * 10) / 10;
  });
}

// ═══════════════════════════════════════════════════════════════
// TURN RENDERER
// ═══════════════════════════════════════════════════════════════
function renderTurn() {
  const turn = TURNS[GS.turn - 1];
  clearFeed();
  document.getElementById('decision-options').innerHTML = '';

  // Passive escalation — only active conflicts (>40) escalate further
  GS.conflicts.forEach((c,i) => {
    if (GS.turn > 5 && c > 40) GS.conflicts[i] = clamp(c + 1.0);
  });
  // Scandal auto-exposure after turn 10
  if (GS.scandalActive && !GS.scandalExposed && GS.turn > 10) {
    GS.scandalExposed = true;
    addMessage('shock', '', 'SCANDAL EXPOSURE: Dormant intelligence has surfaced. Leverage is now active — and visible. Use it or lose it.');
  }
  // Misinformation rises with each act
  const actNum = ACTS.findIndex(a => GS.turn >= a.turns[0] && GS.turn <= a.turns[1]);
  GS.misinformationLevel = Math.min(0.28, 0.12 + actNum * 0.04);
  // Apply trust modifiers, balance-of-power, and domestic pressure
  applyTrustModifiers();
  if (GS.turn > 3) checkBalanceOfPower();
  if (GS.turn > 2) updateDomesticPressure();
  GS.humanitarianDead += 3000;

  // Turn label
  const act = ACTS.find(a => GS.turn >= a.turns[0] && GS.turn <= a.turns[1]);
  document.getElementById('act-display').textContent = act ? act.num : '';

  // Add turn header
  addMessage('note', '', `TURN ${GS.turn} — ${turn.title}`);

  // Shock event fires BEFORE message
  if (turn.shock) {
    setTimeout(()=>{
      addMessage('shock', '', turn.shock.text);
      applyEffects(turn.shock);
      updateMeters();
    }, 400);
  }

  // Main message
  const msgDelay = turn.shock ? 2000 : 400;
  addMessage(turn.fromType, turn.from, turn.text, msgDelay);

  // Note (dimmer)
  setTimeout(()=>{
    addMessage('note', '', turn.note, msgDelay + 1200);
  }, 100);

  // Render decisions after typing
  setTimeout(()=>{
    renderDecisions(turn);
    updateMeters();
    checkMidnight();
  }, msgDelay + 2400);
}

function renderDecisions(turn) {
  const container = document.getElementById('decision-options');
  container.innerHTML = '';

  turn.decisions.forEach((d, i) => {
    // Check requirements
    if (d.requiresScandal && !GS.scandalActive) return;

    const canAfford = !d.cost || d.cost === null ||
      (d.cost === 'dip_pol' ? GS.resources.dip >= 1 && GS.resources.pol >= 1 : Math.floor(GS.resources[d.cost]) >= 1);

    const btn = document.createElement('button');
    btn.className = 'decision-btn' + (!canAfford ? ' disabled' : '');
    btn.disabled = !canAfford;
    btn.innerHTML = `<span class="tag">[${d.tag}]</span>${d.text}`;
    if (!canAfford) btn.title = 'Insufficient resources';
    btn.onclick = () => makeDecision(d, turn);
    container.appendChild(btn);
  });

  // Alt actions (only if P2P > 30)
  if (turn.altActions && turn.altActions.length > 0 && GS.p2p >= 30) {
    const sep = document.createElement('div');
    sep.style.cssText = 'font-size:9px;color:var(--grey);letter-spacing:2px;margin:8px 0 4px;';
    sep.textContent = '— ALTERNATIVE ACTIONS:';
    container.appendChild(sep);

    turn.altActions.forEach(d => {
      const canAfford = !d.cost || Math.floor(GS.resources[d.cost]) >= 1;
      const btn = document.createElement('button');
      btn.className = 'decision-btn alt-action' + (!canAfford ? ' disabled' : '');
      btn.disabled = !canAfford;
      btn.innerHTML = `<span class="tag">[${d.tag}]</span>${d.text}`;
      btn.onclick = () => makeDecision(d, turn);
      container.appendChild(btn);
    });
  }
}

function makeDecision(decision, turn) {
  // Disable all buttons — with fade animation
  document.querySelectorAll('.decision-btn').forEach(b => { b.disabled = true; });

  // ── Misperception check ──
  const misread = interpretAction(decision.cost, turn.from);
  if (misread) {
    // Use leader profile's conflict index for precise escalation targeting
    const lKey = leaderKey(turn.from);
    const ci = lKey && LEADER_PROFILES[lKey] ? LEADER_PROFILES[lKey].conflictIndex : null;
    if (ci !== null) {
      GS.conflicts[ci] = clamp(GS.conflicts[ci] + (misread === 'aggression' ? 5 : misread === 'interference' ? 2 : 3));
    }
    addMessage('shock', '', `SIGNAL MISREAD: ${turn.from} interpreted your action as ${misread}. Escalation rises.`, 100);
  }

  // ── Leader memory update ──
  updateLeaderMemory(decision.cost, turn.from);

  // Apply effects
  applyEffects(decision.effects);
  spendResource(decision.cost);

  // Show consequence
  addMessage('consequence', '', decision.consequence, 200);

  // ── Clock tick audio on dangerous doomClock ──
  playClockTick();

  // Gift card effect
  if (decision.effects && decision.effects.doom > 0) {
    setTimeout(()=>{ addMessage('note', '', '// Doomsday Clock has moved back.'); }, 800);
  }

  // Handle final turn
  if (turn.isFinal) {
    setTimeout(()=>{
      updateMeters();
      showOutcome(decision.outcome);
    }, 2000);
    return;
  }

  updateMeters();
  checkMidnight();

  // Advance turn
  setTimeout(()=>{
    GS.turn++;
    const nextAct = ACTS.find(a => GS.turn >= a.turns[0] && GS.turn <= a.turns[1]);
    const currAct = ACTS.find(a => (GS.turn-1) >= a.turns[0] && (GS.turn-1) <= a.turns[1]);

    if (nextAct && currAct && nextAct.num !== currAct.num) {
      showActCard(nextAct, ()=>{ renderTurn(); });
    } else {
      renderTurn();
    }
  }, 2800);
}

function checkMidnight() {
  if (GS.doomClock >= 12) {
    setTimeout(showMidnight, 1000);
    return true;
  }
  // Secondary trigger: two conflicts simultaneously at full-war threshold
  const criticalWar = GS.conflicts.filter(c => c >= 95).length;
  if (criticalWar >= 2) {
    addMessage('shock', '', 'CRITICAL: Two conflict zones have crossed full-war threshold simultaneously. The Clock accelerates.');
    GS.doomClock = 12;
    setTimeout(showMidnight, 2000);
    return true;
  }
  // Softer: two conflicts at 85+ advance clock by 2
  const atWar = GS.conflicts.filter(c => c >= 85).length;
  if (atWar >= 2) {
    GS.doomClock = Math.min(12, GS.doomClock + 2);
    if (GS.doomClock >= 12) setTimeout(showMidnight, 1000);
    updateMeters();
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
// AUDIO — CLOCK TICK (Web Audio API, no external files)
// ═══════════════════════════════════════════════════════════════
let _audioCtx = null;
function playClockTick() {
  if (GS.doomClock < 9) return; // only when close to midnight (high value = danger)
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = _audioCtx.createOscillator();
    const gain = _audioCtx.createGain();
    osc.connect(gain);
    gain.connect(_audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(GS.doomClock >= 11 ? 880 : 440, _audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, _audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + 0.15);
    osc.start(_audioCtx.currentTime);
    osc.stop(_audioCtx.currentTime + 0.15);
  } catch(e) { /* audio blocked, silent fallback */ }
}

// ═══════════════════════════════════════════════════════════════
// ACT CARD
// ═══════════════════════════════════════════════════════════════
function showActCard(act, cb) {
  const el = document.getElementById('act-card');
  document.getElementById('act-num').textContent = act.num;
  document.getElementById('act-title').textContent = act.title;
  document.getElementById('act-desc').textContent = act.desc;
  el.style.display = 'flex';
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.8s';
  setTimeout(()=>{ el.style.opacity = '1'; }, 50);

  setTimeout(()=>{
    el.style.opacity = '0';
    setTimeout(()=>{
      el.style.display = 'none';
      if (cb) cb();
    }, 800);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// OUTCOMES
// ═══════════════════════════════════════════════════════════════
function showOutcome(key) {
  // Determine outcome — Charter choice is base, meters modify
  if (!key) {
    if (GS.doomClock <= 4 && GS.conflicts.every(c=>c<50)) key = 'collaborative';
    else if (GS.doomClock <= 7) key = 'fragile_peace';
    else if (GS.doomClock <= 10) key = 'managed_crisis';
    else key = 'collapse';
  }
  // Charter Framework I → upgrade to collaborative if clock stayed low and alliances held
  if (key === 'fragile_peace' && GS.doomClock <= 5 && GS.alliances >= 55) key = 'collaborative';
  // Catastrophic state → force collapse
  if (GS.doomClock >= 11 || GS.conflicts.filter(c=>c>=85).length >= 2) key = 'collapse';

  const o = OUTCOMES[key] || OUTCOMES['managed_crisis'];
  const screen = document.getElementById('outcome-screen');
  document.getElementById('outcome-title').textContent = o.title;
  document.getElementById('outcome-title').className = 'outcome-title' + (o.collapse ? ' collapse' : '');
  document.getElementById('outcome-desc').textContent = o.desc;
  document.getElementById('proj-text').textContent = o.projection;

  // Humanitarian cost
  const costLines = document.getElementById('cost-lines');
  costLines.innerHTML = '';
  const labels = ['CONFLICT I (EXPANSIONIST WAR)', 'CONFLICT II (IMPERIAL COLLAPSE)', 'CONFLICT III (BORDERLANDS)', 'GLOBAL DISPLACED'];
  const baseDead = [Math.round(GS.humanitarianDead * 0.3), Math.round(GS.humanitarianDead * 0.45), Math.round(GS.humanitarianDead * 0.15), Math.round(GS.humanitarianDead * 0.1)];
  labels.forEach((l, i) => {
    const d = document.createElement('div');
    d.className = 'cost-line';
    d.textContent = `${l}: ${(baseDead[i]/1000).toFixed(0)}k dead`;
    costLines.appendChild(d);
  });
  const total = document.createElement('div');
  total.className = 'cost-line';
  total.style.cssText = 'font-size:16px;margin-top:12px;';
  total.textContent = `TOTAL: ${(GS.humanitarianDead/1000).toFixed(0)}k DEAD. ${(GS.humanitarianDead * 4 / 1000).toFixed(0)}k DISPLACED.`;
  costLines.appendChild(total);

  document.getElementById('game').style.display = 'none';
  screen.style.display = 'flex';
}

function showMidnight() {
  const screen = document.getElementById('midnight-screen');
  screen.style.display = 'flex';
  document.getElementById('game').style.display = 'none';

  const lines = document.getElementById('midnight-lines');
  const dead1 = Math.round(GS.humanitarianDead * 0.3 / 1000);
  const dead2 = Math.round(GS.humanitarianDead * 0.45 / 1000);
  const dead3 = Math.round(GS.humanitarianDead * 0.15 / 1000);

  const content = [
    { text: `CONFLICT I: ${dead1}k dead. ${dead1*6}k displaced.`, delay: 1000 },
    { text: `CONFLICT II: ${dead2}k dead. ${dead2*7}k displaced.`, delay: 2500 },
    { text: `CONFLICT III: ${dead3}k dead. ${dead3*5}k displaced.`, delay: 4000 },
    { text: `CONFLICT IV: Economic collapse. 400 million below poverty line.`, delay: 5500 },
    { final: true, text: ">_ THE CLOCK REACHED MIDNIGHT.", delay: 7500 },
    { signal: true, text: "The signals were there from the beginning.", delay: 10000 },
    { replay: true, text: "[ REPLAY ]", delay: 40000 },
  ];

  content.forEach(c => {
    setTimeout(()=>{
      if (c.final) {
        const el = document.createElement('div');
        el.className = 'midnight-final';
        el.textContent = c.text;
        el.style.animation = 'fadeIn 1s forwards';
        lines.appendChild(el);
      } else if (c.signal) {
        const el = document.createElement('div');
        el.className = 'midnight-signal';
        el.textContent = c.text;
        el.style.animation = 'fadeIn 2s forwards';
        lines.appendChild(el);
      } else if (c.replay) {
        const el = document.createElement('div');
        el.className = 'midnight-replay';
        el.textContent = c.text;
        el.style.animation = 'fadeIn 2s forwards';
        el.onclick = ()=>location.reload();
        lines.appendChild(el);
        const nav = document.getElementById('midnight-nav');
        if (nav) { nav.style.display = 'block'; nav.style.animation = 'fadeIn 2s forwards'; }
      } else {
        const el = document.createElement('div');
        el.className = 'midnight-line';
        el.textContent = c.text;
        el.style.animation = 'fadeIn 1s forwards';
        lines.appendChild(el);
      }
    }, c.delay);
  });
}

// ═══════════════════════════════════════════════════════════════
// GAME START
// ═══════════════════════════════════════════════════════════════
function startGame() {
  document.getElementById('title-screen').classList.add('hidden');

  // Show Act I card first
  showActCard(ACTS[0], ()=>{
    document.getElementById('game').style.display = 'grid';
    updateMeters();
    // Brief intro message
    const feed = document.getElementById('message-feed');
    addMessage('note', '', 'STOKING FIRES EVERYWHERE — SYSTEM INITIALISED');
    addMessage('intel', 'SYSTEM', 'You are connected to seven active diplomatic channels. Four conflict theatres are being monitored. The Doomsday Clock reads: ' + GS.doomClock + ' — one step from midnight.', 600);
    setTimeout(()=>{
      addMessage('intel', 'SYSTEM', 'The wars have not started yet. But the signals are already there. Read them carefully.', 2000);
      setTimeout(renderTurn, 4000);
    }, 600);
  });
}

// Prevent right-click for atmosphere
document.addEventListener('contextmenu', e=>e.preventDefault());
