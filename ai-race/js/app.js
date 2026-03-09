// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const TIMER_SECONDS = 120;
const TOTAL_MONTHS  = 18;
const SCORE_MAX     = { S: 88, L: 107, C: 65, Su: 55 };
const SCORE_LABELS  = { S: 'Sovereignty', L: 'Legitimacy', C: 'Capacity', Su: 'Sustain.' };

const OPTION_SCORES = {
  d1_1: { A:{S:8,L:0,C:4,Su:5},   B:{S:6,L:4,C:7,Su:0},  C:{S:2,L:2,C:10,Su:0} },
  d1_2: { A:{S:4,L:9,C:0,Su:6},   B:{S:0,L:5,C:3,Su:4},  C:{S:3,L:1,C:0,Su:1}  },
  d1_3: { A:{S:3,L:5,C:0,Su:9},   B:{S:0,L:3,C:5,Su:5},  C:{S:0,L:-1,C:9,Su:1} },
  d2_1: { A:{S:9,L:6,C:5,Su:0},   B:{S:5,L:5,C:7,Su:0},  C:{S:2,L:3,C:8,Su:0}  },
  d2_2: { A:{S:5,L:9,C:6,Su:0},   B:{S:4,L:6,C:5,Su:0},  C:{S:3,L:2,C:4,Su:0}  },
  d2_3: { A:{S:7,L:6,C:8,Su:0},   B:{S:5,L:5,C:6,Su:0},  C:{S:1,L:3,C:4,Su:0}  },
  d3_1: { A:{S:8,L:8,C:0,Su:6},   B:{S:7,L:5,C:5,Su:0},  C:{S:3,L:3,C:6,Su:0}  },
  d3_2: { A:{S:5,L:9,C:6,Su:0},   B:{S:0,L:5,C:5,Su:4},  C:{S:0,L:2,C:7,Su:2}  },
  d3_3: { A:{S:5,L:7,C:9,Su:0},   B:{S:5,L:6,C:6,Su:0},  C:{S:5,L:2,C:4,Su:0}  },
  d4_1: { A:{S:0,L:8,C:7,Su:7},   B:{S:0,L:6,C:8,Su:5},  C:{S:0,L:3,C:6,Su:3}  },
  d4_2: { A:{S:0,L:9,C:4,Su:8},   B:{S:0,L:5,C:3,Su:5},  C:{S:0,L:1,C:4,Su:2}  },
  d4_3: { A:{S:8,L:7,C:7,Su:0},   B:{S:5,L:5,C:6,Su:0},  C:{S:4,L:4,C:5,Su:0}  },
  d5_1: { A:{S:9,L:7,C:0,Su:8},   B:{S:6,L:0,C:6,Su:5},  C:{S:3,L:0,C:8,Su:1}  },
  d5_2: { A:{S:8,L:9,C:0,Su:6},   B:{S:4,L:5,C:6,Su:0},  C:{S:2,L:3,C:5,Su:0}  },
  d5_3: { A:{S:9,L:8,C:9,Su:0},   B:{S:6,L:6,C:7,Su:0},  C:{S:2,L:4,C:4,Su:0}  },
};

// ─── What-if event cards (triggered by specific choice combinations) ──────────

const whatIfEvents = [
  {
    id: 'water_protests',
    condition: c => c.d1_2 === 'C' && c.d1_3 === 'C',
    fromNews: 'From the news',
    headline: 'Water Protests Erupt in Three Districts',
    body: 'A coordinated protest movement forms across three data centre construction sites. A video of cooling tower water extraction from a rural aquifer reaches 12 million views in 48 hours. Two foreign investors suspend discussions pending "governance review." Your summit invitations start receiving regrets.',
    subtext: 'What happens when the first decision compounds.',
    scoreImpact: { L: -3, Su: -2 },
    impactLabel: 'Legitimacy −3 · Sustainability −2',
  },
  {
    id: 'censorship_report',
    condition: c => c.d2_1 === 'C' && c.d2_2 === 'C',
    fromNews: 'From the news',
    headline: 'AI Lab Enables State Censorship, Report Finds',
    body: 'A global AI accountability group publishes a 40-page report: Nexara AI has been complying with your government\'s content restriction list. The headline: "US tech company enables authoritarian censorship for market access." Nexara AI issues a carefully worded statement. Three summit partners request a bilateral briefing before the event.',
    subtext: 'Model adoption without governance reform carries a compound cost.',
    scoreImpact: { L: -4, S: -2 },
    impactLabel: 'Legitimacy −4 · Sovereignty −2',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DECISIONS (all 15 sub-chapters)
// ═══════════════════════════════════════════════════════════════════════════════

const decisions = [

  // ─── DECISION 1: COMPUTE & INFRASTRUCTURE ─────────────────────────────────

  { id:'d1_1', asset:'compute_sovereignty',
    chapterTitle:'Decision 1  ·  Compute & Infrastructure',
    subChapterTitle:'1.1  Who builds, and who owns?',
    intro:'Three foreign hyperscalers — Vimana Cloud, Baobab Systems, and Kilima Digital — have submitted competing proposals to build data centres across your country. Each promises compute capacity, foreign exchange, and jobs. Your cabinet is split.',
    situation:'If you accept unconditional terms, you get compute fast — but you will spend the next decade paying for infrastructure you don\'t own, governed by companies whose primary obligation is to their shareholders. If you insist on conditions, two of the three hyperscalers will walk. The one that stays takes longer to come online.',
    timeCosts:{A:3,B:2,C:1},
    options:{
      A:{ title:'Regional public consortium', desc:'Partner with 3 neighbouring nations for a jointly-owned compute consortium. Your country holds 33% equity. No single foreign hyperscaler controls it. Timeline: 5 years.', consequence:'The regional consortium takes three years to form its legal framework. Your neighbours are cautious but committed. You have no compute yet — but what\'s coming will be yours.', monthNote:'+3 months to negotiate and ratify the consortium' },
      B:{ title:'Conditional hyperscaler entry', desc:'Allow hyperscalers in with binding conditions: 10% compute reservation for the national AI project, 15% government equity, mandatory renewable energy commitment. Two of three walk.', consequence:'Two hyperscalers walked. One stayed. It takes 18 months to ratify the conditions agreement. The compute arrives. The equity clause holds.', monthNote:'+2 months to negotiate conditions' },
      C:{ title:'Unconditional hyperscaler welcome', desc:'Accept the best offer with no conditions. Fastest deployment by 18 months. No equity, no compute reservation. Your national AI roadmap runs on infrastructure you don\'t own.', consequence:'Vimana Cloud breaks ground within 90 days — fastest in your region. The contract has a 15-year lock-in clause. The compute is real, and it is not yours.', monthNote:'+1 month to sign and begin' },
    },
  },

  { id:'d1_2', asset:'community_legitimacy',
    chapterTitle:'Decision 1  ·  Compute & Infrastructure',
    subChapterTitle:'1.2  Social licence to operate',
    intro:'Data centres require land acquisition across 3 rural districts. Local communities don\'t know what a data centre is. A company promises 4,000 jobs. The reality: 3,800 are security and cleaning roles at 60% of minimum wage.',
    situation:'The skilled infrastructure work is flown in. The community confusion is real — their land is being taken for a building that hums but produces nothing they can eat, sell, or understand. Without genuine consent, you build a legitimacy deficit that compounds through every subsequent decision.',
    timeCosts:{A:2,B:1,C:0},
    options:{
      A:{ title:'Community Land Trust + revenue sharing', desc:'Affected communities receive equity shares in the facility. A 3-year local technical training programme begins before construction. A community board holds veto on construction phase approvals.', consequence:'Construction is delayed six months by the land trust negotiation. The community board approves the final design. The training programme begins before the first cement pour. Trust is earned.', monthNote:'+2 months for land trust negotiation' },
      B:{ title:'Managed consultation + employment guarantee', desc:'Government-led consultation process. Public employment guarantees with an independent monitoring committee. Community liaison board with advisory (not veto) power.', consequence:'The consultation runs three months. Two communities accept. One district remains resistant. The liaison board meets quarterly. Trust is partial but present.', monthNote:'+1 month for the consultation process' },
      C:{ title:'Eminent domain + jobs promise', desc:'Government acquires land under national interest provision. Jobs promised publicly with no enforceable guarantee. Community protests characterised as uninformed.', consequence:'The acquisition goes through in three weeks. A protest movement forms across three districts. A video of the evictions goes global. Two foreign investors suspend discussions pending "governance review."', monthNote:'+0 months — straight to acquisition' },
    },
  },

  { id:'d1_3', asset:'climate_credibility',
    chapterTitle:'Decision 1  ·  Compute & Infrastructure',
    subChapterTitle:'1.3  Energy, water, and the sustainability question',
    intro:'Data centres consume enormous water for cooling. Your country has water stress. The hyperscalers prefer coal-powered electricity — available, cheap, and reliable. The cooling towers will draw from the same aquifer your rural agriculture depends on.',
    situation:'If you go fast on infrastructure, the climate cost is immediate and local. If you go slow, your AI roadmap slips. The communities most affected by water depletion are the same communities whose land was acquired for the data centres.',
    timeCosts:{A:2,B:1,C:0},
    options:{
      A:{ title:'Renewable mandate + closed-loop cooling', desc:'Renewable energy only. Closed-loop cooling with water recycling — no net extraction from local aquifers. Community environmental monitoring board with authority to pause operations if thresholds are breached.', consequence:'The renewable procurement process adds 14 months to the timeline. When the data centre opens, it runs on solar. The aquifer levels are unchanged. The community monitoring board meets monthly.', monthNote:'+2 months for renewable procurement' },
      B:{ title:'Coal now, binding renewable transition by Year 6', desc:'Coal-powered for 5 years with binding legislative commitment to renewable transition. Water use capped at 40% of annual local aquifer replenishment. Annual public environmental disclosure.', consequence:'The data centre is online in four months. The legislative commitment to renewable transition by Year 6 is real and legally binding. The 5-year emissions cost is also real.', monthNote:'+1 month for transition legislation' },
      C:{ title:'Coal + open water access', desc:'Coal power. Unrestricted water access for cooling. No environmental caps. Fastest build possible.', consequence:'Operations begin immediately. By month eight, a civil society report documents a 14% reduction in crop yields in adjacent areas. The report is published and widely shared. Construction continues.', monthNote:'+0 months — no constraints imposed' },
    },
  },

  // ─── DECISION 2: THE INDIGENOUS MODEL ────────────────────────────────────

  { id:'d2_1', asset:'indigenous_model',
    chapterTitle:'Decision 2  ·  The Indigenous Model',
    subChapterTitle:'2.1  Build, borrow, or become a market?',
    intro:'Nexara AI\'s regional VP arrives at the ministry. They\'re not offering a licence — they\'re offering adoption. "Take the model. We\'ll localise it to your languages. We\'ll censor what you need censored. We just need your users."',
    situation:'Your ₹2,000 crore public AI fund has been sitting undeployed for 18 months. Your 430 AI startups are watching to see which way you go. If you accept, the ecosystem pivots to wrappers. If you decline, you are alone in the build for 3 years.',
    timeCosts:{A:3,B:2,C:1},
    options:{
      A:{ title:'Fund the indigenous model — open source', desc:'Decline Nexara AI. Deploy the ₹2,000 crore fund to a National AI Research Consortium: universities, diaspora returnees, public labs. Open-source mandate — all publicly-funded research is publicly licensed. 3-year build.', consequence:'The Research Consortium is constituted within six months. Diaspora returnees begin arriving. The build will take three years. Nexara AI expands into three neighbouring markets in the meantime.', monthNote:'+3 months to constitute the consortium' },
      B:{ title:'Parallel play — adopt and build simultaneously', desc:'Accept Nexara AI for commercial use. Deploy the public fund to indigenous development in parallel. Firewall: all government AI systems must use the indigenous model within 5 years.', consequence:'Nexara AI is permitted for commercial use. The public fund is deployed. The risk is visible: Nexara AI captures the ecosystem faster than your indigenous model is being built.', monthNote:'+2 months to structure the parallel arrangement' },
      C:{ title:'Accept Nexara AI — become the market', desc:'Accept Nexara AI\'s offer in full. Fastest AI deployment. Your startup ecosystem pivots to wrapper companies. In 3 years, Nexara AI raises API prices 300%.', consequence:'Nexara AI begins localisation in month two. Your best engineers receive offers at 3× their government salary. The offer letters land before you\'ve left the meeting.', monthNote:'+1 month to sign the adoption agreement' },
    },
  },

  { id:'d2_2', asset:'censorship_reformed',
    chapterTitle:'Decision 2  ·  The Indigenous Model',
    subChapterTitle:'2.2  The censorship dilemma',
    intro:'Your internet governance framework is surveillance-heavy, punitive, and carceral. A list of restricted topics is enforced by law. If your LLM trains on this framework, it will carry the state\'s information preferences into every conversation.',
    situation:'At your summit, a journalist will ask your model three questions. That moment exists regardless of which model you chose. What changes is the answer you have ready. A model that evades questions about the political opposition is not a model you can demonstrate to the world.',
    timeCosts:{A:2,B:1,C:0},
    options:{
      A:{ title:'Governance reform — repeal and rebuild', desc:'Repeal the carceral internet governance framework. Replace the surveillance architecture with civil society oversight. Your LLM trains on genuinely open data. The political cost is enormous.', consequence:'The repeal passes by six votes. Three cabinet members resign. The new civil society oversight body takes eight months to constitute. Your model now trains on genuinely open data.', monthNote:'+2 months for legislative reform' },
      B:{ title:'Segmented reform — research open, government controlled', desc:'Separate governance frameworks: research and public-facing LLM open, government systems controlled. The model is cleaner — but the underlying censorship architecture isn\'t gone.', consequence:'The dual framework passes in three months. Internationally, you\'re seen as "moving in the right direction." Domestically, the surveillance infrastructure remains intact.', monthNote:'+1 month for dual framework legislation' },
      C:{ title:'Carceral nationalism — control stays', desc:'Your data governance framework stays as-is. Your LLM trains on filtered, controlled data. It reflects the state\'s image of the country.', consequence:'The framework stays. At the summit, a journalist demos your model to the room. It declines to answer two questions about historical events. The room goes quiet for twelve seconds.', monthNote:'+0 months — no legislative action required' },
    },
  },

  { id:'d2_3', asset:null,
    chapterTitle:'Decision 2  ·  The Indigenous Model',
    subChapterTitle:'2.3  Entrepreneurship vs. market capture',
    intro:'Your ₹2,000 crore public AI fund can build an open ecosystem or let the private sector lead. 430 startups are watching. Your universities are waiting. And Nexara AI\'s local hiring team is already operational.',
    situation:'The fund can go to open-source development and public labs, or it can be split with private sector co-investment, or it can stay undeployed while the market decides. The ecosystem you get will reflect this choice.',
    timeCosts:{A:1,B:1,C:0},
    options:{
      A:{ title:'Public AI commons — open mandate', desc:'Deploy all ₹2,000 crore to open-source ecosystem: university grants, diaspora return fellowships, public lab infrastructure. All publicly-funded research released under open license.', consequence:'All publicly-funded research is released under open license. Seven regional universities activate AI research labs. The ecosystem is slower to produce commercial results — but genuinely open.', monthNote:'+1 month to structure the grants programme' },
      B:{ title:'Mixed ecosystem — public and private', desc:'Split the fund: 50% grants to startups and universities, 50% co-investment with private sector. Regular market concentration reviews. Nexara AI permitted as one player among many.', consequence:'The fund is split. Startups, universities, and Nexara AI share the market. The ecosystem is diverse but contested. Some talent still goes to Nexara AI\'s local entity.', monthNote:'+1 month to structure the mixed fund' },
      C:{ title:'Market decides — get out of the way', desc:'No public fund deployment. Nexara AI fills the gap. Best engineers hired at 3× government salaries. Startups pivot to wrapper businesses.', consequence:'No public fund is deployed. Nexara AI fills the gap. Three of your 430 startups accept acquisition offers from global companies before the year is out.', monthNote:'+0 months — no action taken' },
    },
  },

  // ─── DECISION 3: DATA GOVERNANCE ─────────────────────────────────────────

  { id:'d3_1', asset:null,
    chapterTitle:'Decision 3  ·  Data Governance',
    subChapterTitle:'3.1  Who owns your data?',
    intro:'Your country\'s data is extraordinary — and largely ungoverned. Agricultural records, cadastral maps, 22 languages with 180 dialects, health records from the world\'s largest rural health programme. Ethically governed, this data could produce the LLM for the post-colonial world.',
    situation:'But it doesn\'t live in clean repositories. It lives in government servers, in surveillance databases, in formats that reflect who the state thinks its citizens are. The governance question isn\'t just technical — it\'s political.',
    timeCosts:{A:1,B:1,C:0},
    options:{
      A:{ title:'Citizen data cooperatives', desc:'Data held in citizen-owned cooperatives governed by elected community boards. Government and companies must request access through a public process. Every data access is logged and publicly reported.', consequence:'The cooperative model takes eleven months to pass through parliament. Three districts pilot it in year one. The transparency logs are published monthly. Trust in the data system rises measurably.', monthNote:'+1 month for legislative drafting' },
      B:{ title:'National data sovereignty — state as steward', desc:'State holds data sovereignty. Strict cross-border data localisation. Research access granted by an independent ethics board. Companies can access data under licence with citizen notification rights.', consequence:'The data localisation framework passes in three months. The ethics board is constituted. Research access applications begin arriving within a week of the system going live.', monthNote:'+1 month for data sovereignty legislation' },
      C:{ title:'Light-touch regulation — data as commodity', desc:'Minimal data regulation. Companies can buy and sell anonymised datasets. International data flows permitted. Revenue in the short term.', consequence:'Minimal regulation is confirmed. Data sales begin. In year two, an international privacy audit finds that "anonymised" health datasets are re-identifiable. A foreign company has been training models on your citizens\' data without their knowledge.', monthNote:'+0 months — no regulatory action required' },
    },
  },

  { id:'d3_2', asset:'dataset_equity',
    chapterTitle:'Decision 3  ·  Data Governance',
    subChapterTitle:'3.2  Rights, representation, and post-colonial ethics',
    intro:'Your datasets carry colonial-era categories, biases, and erasures. Rural women, indigenous communities, linguistic minorities — underrepresented, miscategorised, or entirely absent. If your LLM trains on this data unexamined, it amplifies these gaps.',
    situation:'The question is whether you treat this as a structural problem or a cosmetic one. A mandate costs time and money. Voluntary standards improve things incrementally. Ignoring it produces a model that makes discriminatory recommendations and calls it a pattern in the data.',
    timeCosts:{A:3,B:2,C:1},
    options:{
      A:{ title:'Post-colonial ethics mandate', desc:'Mandatory representative dataset audits. All publicly-funded AI training data must pass a bias review addressing post-colonial representational gaps. Linguistic equity required — all 22 languages at functional quality.', consequence:'The bias audit takes two years and surfaces gaps not previously discussed publicly. All 22 languages reach functional quality in the training corpus. Your model, when it comes, reflects the country — not the state\'s image of it.', monthNote:'+3 months for audit framework and review' },
      B:{ title:'Voluntary bias review + public reporting', desc:'Voluntary bias review with annual public reporting. Linguistic equity targets without mandate. Progress is visible. Accountability is limited.', consequence:'Voluntary standards are published. Twelve organisations adopt them in year one. The underrepresentation problems improve incrementally. They don\'t disappear.', monthNote:'+2 months to develop standards' },
      C:{ title:'Speed to market — address bias reactively', desc:'No constraints beyond existing law. Build first, fix bias when it appears commercially. Let the model learn from available data.', consequence:'The model trains on available data. In month eighteen, it recommends agricultural credit denial at 4× the rate for women farmers in three districts. A parliamentary question follows. Your engineers say the training data was reflecting historical patterns.', monthNote:'+1 month — move fast, address problems later' },
    },
  },

  { id:'d3_3', asset:null,
    chapterTitle:'Decision 3  ·  Data Governance',
    subChapterTitle:'3.3  Making your data work for your model',
    intro:'Your model needs data. Government datasets, civil society contributions, community-generated content. The question is who controls the corpus — and who benefits from what it trains.',
    situation:'An open data programme maximises richness and global credibility. Curated access maximises quality and control. A state-controlled corpus maximises security — and limits what the model can actually see about the country it is supposed to serve.',
    timeCosts:{A:1,B:1,C:0},
    options:{
      A:{ title:'Open data programme', desc:'Full open data programme. Government datasets made publicly available under clear licence. Civil society can collect and contribute. International researchers can access under ethics agreements.', consequence:'The open data programme goes live. International researchers begin applying for ethics access. The corpus becomes one of the most representative for South Asian and post-colonial contexts in the world.', monthNote:'+1 month to design and launch the programme' },
      B:{ title:'Curated access — quality over volume', desc:'Controlled research access with ethics oversight. High-quality, well-curated data available to trusted partners under agreement. Slower. Less politically risky.', consequence:'Controlled research access under ethics oversight produces a high-quality corpus. The dataset is good, not great. International trust in the process is solid.', monthNote:'+1 month to build the ethics access system' },
      C:{ title:'State-controlled corpus', desc:'Data stays under government control. The LLM trains on what the state decides is appropriate. For government queries it works. For anything that requires seeing the country clearly, it is limited.', consequence:'The LLM trains on what the state decides is appropriate. For most government queries it is functional. For rural agriculture, health equity, and justice contexts, it consistently underperforms.', monthNote:'+0 months — existing control maintained' },
    },
  },

  // ─── DECISION 4: TALENT ──────────────────────────────────────────────────

  { id:'d4_1', asset:null,
    chapterTitle:'Decision 4  ·  Talent',
    subChapterTitle:'4.1  Who are you training?',
    intro:'A leaked internal survey shows that 71% of your government AI specialists plan to leave within 18 months. Your lead researcher accepted an offer from a global lab yesterday — at 4× their current salary.',
    situation:'Meanwhile, 400,000 students are entering tech programmes this year. The question isn\'t whether you can keep the elite. It\'s what kind of AI workforce you\'re actually building — and whether the country\'s rural economy will have anyone who can question what the AI is doing to it.',
    timeCosts:{A:2,B:2,C:1},
    options:{
      A:{ title:'Mass AI enablement — 100,000 sector workers', desc:'Train 100,000 AI-enabled practitioners across agriculture, health, logistics, and local governance. Not researchers — people who can use, adapt, audit, and question AI tools in sectors where your country actually needs it.', consequence:'Training programmes roll out across agriculture, health, and logistics. The workforce that emerges can use, audit, and question AI tools. It builds roots that the global market cannot easily extract.', monthNote:'+2 months to design and launch programmes' },
      B:{ title:'Both pipelines — elite research + sector workforce', desc:'Split funding 60/40: elite research programme and sector workforce programme simultaneously. Expensive. Administratively complex. The right shape for a country that needs both.', consequence:'Both programmes launch. The elite researchers are fewer than planned; the sector training is broader than expected. The shape is right even if the scale is imperfect.', monthNote:'+2 months to coordinate the dual programme' },
      C:{ title:'Elite focus — compete globally on researcher quality', desc:'500 world-class researchers. Diaspora return programme. International rankings improvement. Your AI sector looks impressive at the summit.', consequence:'Five hundred researchers are recruited. Your AI sector looks credible at the summit. Eighty percent of the country cannot access what they build. The rural economy is automated without the workforce to manage or audit it.', monthNote:'+1 month for elite recruitment programme' },
    },
  },

  { id:'d4_2', asset:null,
    chapterTitle:'Decision 4  ·  Talent',
    subChapterTitle:'4.2  Jobs, displacement, and the future of work',
    intro:'AI-led automation will displace an estimated 2.3 million jobs in your country within 5 years. Most are in data entry, customer service, and basic logistics. Communities most affected are least able to retrain without support.',
    situation:'This is not a speculative risk. It is a documented projection from your own Ministry of Labour. The question is not whether the displacement will happen. The question is whether your government has a responsibility to those it happens to.',
    timeCosts:{A:2,B:1,C:0},
    options:{
      A:{ title:'Just transition mandate', desc:'Any sector deploying AI above a defined threshold must co-fund a worker retraining programme. An AI Transition Guarantee covers workers who cannot be placed within 18 months.', consequence:'The just transition legislation passes with amendments. Sector-by-sector transition plans are published. Worker retraining is co-funded. The political cost is real. So is the protection.', monthNote:'+2 months for legislation and sectoral plans' },
      B:{ title:'National AI Transition Fund', desc:'Voluntary industry contributions matched by government. Sector analysis published annually. Retraining available to those who seek it. The fund is real. Its reach is incomplete.', consequence:'The fund is constituted. Industry contributions arrive slowly. Some workers retrain successfully. Some fall through the gaps. The annual report is published and largely ignored.', monthNote:'+1 month to establish and launch the fund' },
      C:{ title:'Market adjustment — disruption is natural', desc:'No mandated transition support. The market will create new jobs. Government\'s role is to build a business-friendly environment, not slow the technology.', consequence:'No mandate is introduced. In year three, a Central Statistical Office report documents a 14% increase in urban informal labour among 30–45 year old displaced service workers. The data is published. The market adjusts. Not for them.', monthNote:'+0 months — no legislative action required' },
    },
  },

  { id:'d4_3', asset:'talent_pipeline',
    chapterTitle:'Decision 4  ·  Talent',
    subChapterTitle:'4.3  Keeping talent home',
    intro:'Your lead researcher accepted a 4× salary offer from a global lab yesterday. The talent drain is documented and accelerating. Seventy-one percent of government AI specialists plan to leave within 18 months.',
    situation:'You cannot compete on salary alone — global labs will always outbid you at scale. The question is whether you can build an institution worth staying for: one with a mission, autonomy, and the resources to do work that matters.',
    timeCosts:{A:2,B:1,C:0},
    options:{
      A:{ title:'Public AI Institutes — mission as retention', desc:'Semi-autonomous National AI Institutes outside civil service pay scales. Mandates: language preservation, agricultural AI, rural health diagnostics, anti-corruption systems. A diaspora return fellowship.', consequence:'The National AI Institutes are constituted outside civil service pay scales. The diaspora fellowship brings fourteen senior researchers home in year one. Mission — not just salary — becomes the retention mechanism.', monthNote:'+2 months to constitute the institutes' },
      B:{ title:'Civil service reform + 70% pay parity', desc:'70% pay parity adjustment for government AI roles. Inter-institutional research teams spanning ministries and universities. The gap closes but doesn\'t disappear.', consequence:'Pay reaches 70% of market parity. Some talent stays. Those who needed both the mission and the salary find the gap still present. Emigration slows but does not stop.', monthNote:'+1 month for civil service pay review' },
      C:{ title:'Compete directly on salary', desc:'Attempt to match global salaries for top AI roles. Works for 12% of the target cohort. Unaffordable at scale. Nexara AI quietly raises their offers by 10% in response.', consequence:'Salary matching works for 12% of the target cohort. Nexara AI\'s local entity raises their offers by 10% within the month. The internal resentment from other public employees is immediate and vocal.', monthNote:'+0 months — salary adjustment implemented administratively' },
    },
  },

  // ─── DECISION 5: THE SUMMIT & INVESTMENT ─────────────────────────────────

  { id:'d5_1', asset:'rare_earth_leverage',
    chapterTitle:'Decision 5  ·  The Summit & Investment',
    subChapterTitle:'5.1  The rare earth leverage play',
    intro:'Three global powers have signalled interest in your rare earth reserves. The Finance Ministry wants the foreign exchange. The environment ministry is alarmed. Your rural communities near the reserves are already organising.',
    situation:'Your rare earths are the most tangible leverage you have at the summit. The question is whether you spend it now, hold it, or use it to demand something that compounds: technology transfer, sovereignty, a seat at the table that isn\'t conditional on your cooperation.',
    timeCosts:{A:2,B:1,C:1},
    options:{
      A:{ title:'Leverage without extraction', desc:'Use rare earth reserves as a negotiating chip without opening mines. Demand: technology transfer, IP licensing in your favour, in-country LLM training commitments, GPU allocation pledges.', consequence:'Your negotiating team arrives at the summit with the rare earth cards unplayed. Technology transfer agreements are offered in exchange for extraction rights. You decline. Your leverage holds for the next round.', monthNote:'+2 months to structure the negotiation position' },
      B:{ title:'Conditional access — value capture in-country', desc:'Mining rights offered with binding conditions: in-country processing, 60% local employment requirements, technology transfer agreements. Revenue flows. So does environmental impact.', consequence:'Mining rights are offered on conditional terms. Revenue begins flowing. In-country processing facilities take three years to build. The environmental impact begins immediately.', monthNote:'+1 month to draft conditional mining agreements' },
      C:{ title:'Full deregulation — maximum short-term capital', desc:'Open the mines. Fast capital. Foreign exchange headlines. The environmental cost is borne by rural communities who did not vote for this and will not see the revenue.', consequence:'The mines open. Within 18 months, your rare earths are in the GPU supply chains of three powers in active geopolitical rivalry. You are now relevant. You are also entangled.', monthNote:'+1 month — deregulation order signed and announced' },
    },
  },

  { id:'d5_2', asset:null,
    chapterTitle:'Decision 5  ·  The Summit & Investment',
    subChapterTitle:'5.2  What do you commit to at the summit?',
    intro:'The AI Summit is in 90 days. You are hosting it. Three hundred and forty delegations have confirmed attendance. What you commit to in the room will define whether you leave as an architect of the global AI order or a beneficiary of someone else\'s.',
    situation:'You can lead a multilateral movement that risks rejection. You can negotiate specific bilateral deals that are practical and achievable. Or you can position your country as an attractive AI investment destination and watch others set the terms.',
    timeCosts:{A:1,B:1,C:0},
    options:{
      A:{ title:'Global South AI Charter — binding multilateral', desc:'Arrive as the convenor of a movement. Lead the drafting of a Global South AI Charter: binding ethics commitments, open-source mandates, data governance standards, compute-sharing agreements for non-aligned nations.', consequence:'The Global South AI Charter is tabled on day two of the summit. Seven nations co-sign. Two major powers refuse. The vote is called. The outcome is historic — or it is a failure. The room decides.', monthNote:'+1 month to draft and circulate the charter' },
      B:{ title:'Specific bilateral deals — practical and achievable', desc:'Non-binding but specific bilateral agreements: GPU allocation commitments, talent exchange programmes, co-development agreements for priority sectors. Practical. Achievable. Politically safe.', consequence:'Bilateral agreements are signed with four nations: GPU allocations, talent exchanges, co-development on agricultural AI. The summit is productive. It is not transformative.', monthNote:'+1 month to negotiate bilateral agreements' },
      C:{ title:'Investment showcase — welcome to our market', desc:'Market-friendly communiqué. Your country is an attractive AI investment destination. Foreign companies welcomed. Commitments are aspirational. Nothing is binding.', consequence:'The market-friendly communiqué is applauded. Twelve investment pledges are announced. The summit is described as "a success" in your government\'s press release.', monthNote:'+0 months — communiqué drafted in advance' },
    },
  },

  { id:'d5_3', asset:null,
    chapterTitle:'Decision 5  ·  The Summit & Investment',
    subChapterTitle:'5.3  What gets built after the summit?',
    intro:'The summit is over. The delegations are leaving. The communiqués are signed. In five years, when people look back at this moment, what will they say was built?',
    situation:'The answer depends on what you committed to — and what you had to offer when you committed. An alliance requires sovereignty. A hub requires legitimacy. A market destination requires nothing — except a government willing to arrange the chairs for others.',
    timeCosts:{A:1,B:1,C:0},
    options:{
      A:{ title:'Global South AI Alliance', desc:'Your indigenous model, your data ethics framework, your community-governed compute become the reference implementation for 40+ nations. You are not competing with frontier labs on their terms — you\'re building a different frontier.', consequence:'Your model, your data ethics framework, your community-governed compute become the reference implementation for 40 nations. You are building a frontier where the training data represents the majority of humanity and the value stays in the countries that created it.', monthNote:'+1 month to formalise the alliance structure' },
      B:{ title:'Regional AI hub', desc:'Your country becomes the reference model for AI governance across South and Southeast Asia. Other countries adopt your frameworks. Your data standards become regional defaults. Genuine regional influence.', consequence:'Your country becomes the go-to model for AI governance across South and Southeast Asia. Other nations adopt your frameworks. Regional influence is genuine, sustainable, and achievable.', monthNote:'+1 month to establish the hub framework' },
      C:{ title:'Attractive investment destination', desc:'You become a market. Foreign AI companies set up local entities with local branding. In 5 years your "AI ecosystem" is 80% foreign-owned. The value flows out. The jobs stay — the low-skill ones.', consequence:'Foreign AI companies set up local entities. In five years your "AI ecosystem" is 80% foreign-owned. The jobs stay — the low-skill ones. The value flows out. This is what the summit will be remembered as.', monthNote:'+0 months — the market decides the legacy' },
    },
  },

]; // end decisions


// ═══════════════════════════════════════════════════════════════════════════════
// OUTCOMES
// ═══════════════════════════════════════════════════════════════════════════════

const summitOutcomes = {
  embarrassment: { title:'The Summit Opens Without You', paragraphs:['You\'ve been in negotiations for months. The summit began three days ago. You arrive to find the agenda was set without you. The photo opportunities are taken. The working groups are formed.','You will be consulted. You will not be heard. The communiqué was drafted before you landed. Your country appears on page fourteen, paragraph three, as a "partner economy with significant AI potential."','There is a photograph of you shaking hands with someone who doesn\'t remember your name.'] },
  showcase:      { title:'A Beautiful Photo Opportunity', paragraphs:['You arrived first. Nexara AI got the best seat at the table. The summit was photographed extensively. The communiqué mentioned your country four times — always as a market, never as an architect.','You moved fast. You arrived thin. The infrastructure is running. The value is leaving.','The press release calls it "a historic moment for AI development in the region." Your Finance Minister is smiling in every photograph.'] },
  wishywashy:    { title:'Fourteen Commitments, None Binding', paragraphs:['The joint communiqué listed fourteen commitments. The working group will present its findings in eighteen months.','In the meantime: three of your largest AI startups accepted acquisition offers from global companies — the founders took the money and the engineers went with them. The national LLM project is still in the design phase. Nexara AI\'s adoption numbers in your country are growing 40% quarter-on-quarter. The rare earth negotiation produced an MOU.','You are not on the menu. You are not at the table either. You are in the room where both things are being decided — and you are taking notes.','This is the status quo. It has a momentum of its own.'] },
  terms:         { title:'You Were at the Table. They Set It.', paragraphs:['You arrived. The seat was yours. The terms were theirs. You signed three bilateral agreements that you needed more than they did.','The rare earth negotiation went better than expected. The indigenous model question went worse. You have some compute you didn\'t before. You have a model you\'re still building. The data governance framework is better than it was.','The summit was a partial success. That\'s not what you came here to be. The next summit will be different — because this one showed you what it costs to show up half-ready.'] },
  table:         { title:'Bargaining Power, Partial', paragraphs:['You arrived with something real. Not everything. The rare earth question gave you leverage in one room. The indigenous model gave you credibility in another. The data ethics work gave you something nobody else at the table had built yet.','You signed agreements you can live with. You held the line on three things that mattered. You gave ground on two you shouldn\'t have.','Four nations asked for your data governance framework. One offered a co-development agreement for agricultural AI. This is what having something to offer looks like.'] },
  agenda:        { title:'You Built Something Real', paragraphs:['You arrived with compute you own, a model you built, data you govern, and communities that trust the process. The summit recognised this.','Three nations asked to adopt your data ethics framework. Seven co-signed the Global South AI Charter. The major powers objected. You held the vote anyway.','You got on the table. You helped design it. The question the global AI industry didn\'t think to ask — who is this actually for? — now has an answer that begins with your country\'s name.'] },
};

const politicalProfiles = {
  socialist:  { name:'Commons-First', subtitle:'You govern for the many, not the market.', desc:'Across 15 decisions, you consistently chose community ownership, public mandates, post-colonial ethics, and institutional investment over speed. Your choices reflect a belief that infrastructure, data, and AI capability are public goods — not commodities to be optimised for returns. This is not a popular position in the current policy consensus. It is, historically, the one that compounds.' },
  pragmatic:  { name:'Pragmatic Middle', subtitle:'You managed. You balanced. You stayed in the room.', desc:'Your choices reflect a preference for conditional partnerships over full public ownership, managed markets over deregulation, and phased reform over structural change. Each decision was defensible. The accumulation may reveal something: that pragmatism, done consistently, is itself a position — and not always the one that protects the people most at risk from the thing being pragmatically managed.' },
  neoliberal: { name:'Market-Led', subtitle:'You chose speed. The market chose for you.', desc:'Across 15 decisions, you consistently chose private sector primacy, speed over equity, and deferred social cost. Your country has infrastructure and compute faster than your regional peers. The infrastructure is not yours. The model is not yours. The ecosystem is being acquired. This is a coherent political-economic position. It is also a description of dependency.' },
};


// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════

const state = {
  screen:             'intro',
  currentDecision:    0,
  shuffledDecisions:  [],
  choices:            {},
  totalMonthsUsed:    0,
  scores:             { S:0, L:0, C:0, Su:0 },
  lastScoreDelta:     null,
  pendingEvent:       null,
  triggeredEvents:    new Set(),
  timerInterval:      null,
  timerSeconds:       TIMER_SECONDS,
  randomChoiceMade:   false,
};


// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function stopTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currentDecision() { return state.shuffledDecisions[state.currentDecision]; }

function countChoices() {
  const c = { A:0, B:0, C:0 };
  Object.values(state.choices).forEach(ch => { if (c[ch] !== undefined) c[ch]++; });
  return c;
}

function countAssets() {
  return decisions.filter(d => d.asset && state.choices[d.id] === 'A').length;
}

function checkWhatIfs() {
  if (state.pendingEvent) return;
  for (const ev of whatIfEvents) {
    if (state.triggeredEvents.has(ev.id)) continue;
    if (ev.condition(state.choices)) {
      state.triggeredEvents.add(ev.id);
      state.pendingEvent = ev;
      if (ev.scoreImpact) {
        Object.entries(ev.scoreImpact).forEach(([k, v]) => { state.scores[k] = (state.scores[k] || 0) + v; });
      }
      break;
    }
  }
}

function getSummitOutcome() {
  const months = state.totalMonthsUsed, assets = countAssets(), { B } = countChoices();
  if (months >= 24)          return summitOutcomes.embarrassment;
  if (months <= 8 && assets <= 2) return summitOutcomes.showcase;
  if (B >= 9)                return summitOutcomes.wishywashy;
  if (assets >= 5)           return summitOutcomes.agenda;
  if (assets >= 3)           return summitOutcomes.table;
  return summitOutcomes.terms;
}

function getPoliticalProfile() {
  const { A, B, C } = countChoices();
  if (A >= B && A >= C) return politicalProfiles.socialist;
  if (C >= A && C >= B) return politicalProfiles.neoliberal;
  return politicalProfiles.pragmatic;
}

function getLinkedInText() {
  const outcome = getSummitOutcome(), profile = getPoliticalProfile();
  const { A, B, C } = countChoices();
  return `I just played AI Race on civic.games — a 15-decision simulation of building a national AI strategy for a middle-power developing nation.

Summit outcome: "${outcome.title}"
Political compass: ${profile.name}
Months used: ${state.totalMonthsUsed} of 18

${A} commons-first · ${B} pragmatic · ${C} market-led choices

Are you getting on the table, or are you the menu?

Free to play → civic.games

#AIPolicy #AIGovernance #GlobalSouth #CivicTech #FutureOfWork`;
}

// Inline SVG logo (The Civic Games Lab wordmark, cropped viewBox)
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="265 205 285 185" style="width:180px;height:auto;display:block;"><defs><style>.cls-1{fill:#E8AA3D;}</style></defs><path class="cls-1" d="M348.68,284c-.83,1-1.07,1.47-1,2,.12.88,1.06,1.44,1.88,1.9a62,62,0,0,0,5.91,2.87q0,8.82,0,17.79.09,14.06.41,27.75l-72.34,0a42.14,42.14,0,0,1,5-19.68,36.22,36.22,0,0,1,6.39-8.78,58,58,0,0,1,16.3-10.32c3.59-1.21,8.77-3.08,14.9-5.76,8-3.49,8.71-4.46,8.72-5.27.05-2.94-8.91-3.33-22-11-7.43-4.35-12.09-8.58-13.67-14.43a18.64,18.64,0,0,1-.55-3l56.95.11.07,19.67a25.27,25.27,0,0,1-2.92,2.7A23.52,23.52,0,0,0,348.68,284Z"/><path class="cls-1" d="M371.32,217.21v-3.37h23.52v3.37H385v28h-3.8v-28Z"/><path class="cls-1" d="M404,245.2V213.84h3.79v14h16.72v-14h3.8V245.2h-3.8v-14H407.75v14Z"/><path class="cls-1" d="M439.1,245.2V213.84H458v3.37H442.9V227.8h14.15v3.37H442.9v10.66h15.37v3.37Z"/><path class="cls-1" d="M397.46,270.23h-7.65a7,7,0,0,0-.63-2.13,5.17,5.17,0,0,0-1.26-1.62,5.44,5.44,0,0,0-1.84-1,7.29,7.29,0,0,0-2.35-.36,6.8,6.8,0,0,0-3.93,1.12,7,7,0,0,0-2.53,3.23,15.46,15.46,0,0,0,0,10.34,6.51,6.51,0,0,0,6.39,4.24,7.82,7.82,0,0,0,2.29-.32,5.53,5.53,0,0,0,1.82-.95,5,5,0,0,0,1.3-1.51,6.19,6.19,0,0,0,.72-2l7.65.05a11.64,11.64,0,0,1-1.2,4.1,13,13,0,0,1-2.75,3.68,12.76,12.76,0,0,1-4.25,2.64,16.78,16.78,0,0,1-13.35-.89,13.43,13.43,0,0,1-5.31-5.48,18.29,18.29,0,0,1-1.94-8.76,18,18,0,0,1,2-8.77,13.38,13.38,0,0,1,5.34-5.46,15.26,15.26,0,0,1,7.55-1.87,16.83,16.83,0,0,1,5.27.79,12.9,12.9,0,0,1,4.25,2.29,11.89,11.89,0,0,1,3,3.7A13.55,13.55,0,0,1,397.46,270.23Z"/><path class="cls-1" d="M412.59,258.87v31.35H405V258.87Z"/><path class="cls-1" d="M427.69,258.87l7,23H435l7-23h8.48l-10.58,31.35H429.79l-10.58-31.35Z"/><path class="cls-1" d="M464.66,258.87v31.35h-7.58V258.87Z"/><path class="cls-1" d="M501.1,270.23h-7.65a6.46,6.46,0,0,0-.63-2.13,5.14,5.14,0,0,0-1.25-1.62,5.58,5.58,0,0,0-1.85-1,7.29,7.29,0,0,0-2.35-.36,6.8,6.8,0,0,0-3.93,1.12,7,7,0,0,0-2.52,3.23,15.38,15.38,0,0,0,0,10.34,6.83,6.83,0,0,0,2.53,3.17,6.9,6.9,0,0,0,3.86,1.07,7.77,7.77,0,0,0,2.29-.32,5.69,5.69,0,0,0,1.83-.95,5.13,5.13,0,0,0,1.3-1.51,6.18,6.18,0,0,0,.71-2l7.65.05a11.64,11.64,0,0,1-1.2,4.10,13,13,0,0,1-2.75,3.68,12.76,12.76,0,0,1-4.25,2.64,16.78,16.78,0,0,1-13.35-.89,13.34,13.34,0,0,1-5.3-5.48,18.17,18.17,0,0,1-1.95-8.76,18,18,0,0,1,2-8.77,13.51,13.51,0,0,1,5.34-5.46,15.29,15.29,0,0,1,7.55-1.87,16.78,16.78,0,0,1,5.27.79,13,13,0,0,1,4.26,2.29,11.86,11.86,0,0,1,3,3.7A13.36,13.36,0,0,1,501.1,270.23Z"/><path class="cls-1" d="M389.58,314.81a5.68,5.68,0,0,0-.77-1.71,5,5,0,0,0-1.24-1.26,5.42,5.42,0,0,0-1.68-.79,7.66,7.66,0,0,0-2.09-.27,7,7,0,0,0-3.94,1.1,7.08,7.08,0,0,0-2.56,3.21,12.8,12.8,0,0,0-.91,5.11,13.37,13.37,0,0,0,.88,5.14,6.59,6.59,0,0,0,6.53,4.37,8.14,8.14,0,0,0,3.53-.69,4.84,4.84,0,0,0,2.2-1.93,5.69,5.69,0,0,0,.75-3l1.41.17h-7.63v-5.53h13.53v4.15a13.85,13.85,0,0,1-1.79,7.21,11.9,11.9,0,0,1-4.9,4.61,15.29,15.29,0,0,1-7.16,1.61,15.63,15.63,0,0,1-7.88-1.94,13.51,13.51,0,0,1-5.3-5.55,18.13,18.13,0,0,1-1.9-8.57,18.92,18.92,0,0,1,1.15-6.85,14.31,14.31,0,0,1,3.21-5.08,13.6,13.6,0,0,1,4.77-3.15,15.77,15.77,0,0,1,5.86-1.08,16.34,16.34,0,0,1,5.08.78,13.92,13.92,0,0,1,4.16,2.21,11.89,11.89,0,0,1,2.95,3.38,11.35,11.35,0,0,1,1.41,4.31Z"/><path class="cls-1" d="M411.09,335.92H403l10.58-31.36h10.09l10.58,31.36h-8.15l-7.36-23.46h-.25ZM410,323.58h17v5.76H410Z"/><path class="cls-1" d="M440.82,304.56h9.38l8,19.42h.37l8-19.42h9.39v31.36H468.5V316.66h-.26l-7.53,19.06H456l-7.53-19.17h-.26v19.37h-7.38Z"/><path class="cls-1" d="M483.86,335.92V304.56h21.87v6.16H491.44v6.43h13.17v6.17H491.44v6.45h14.29v6.15Z"/><path class="cls-1" d="M530.66,314a3.56,3.56,0,0,0-1.36-2.63,5.42,5.42,0,0,0-3.42-.94,6.71,6.71,0,0,0-2.45.38,3.17,3.17,0,0,0-1.47,1.05,2.61,2.61,0,0,0-.5,1.52,2.13,2.13,0,0,0,.28,1.24,2.83,2.83,0,0,0,.92.94,6.41,6.41,0,0,0,1.46.72,15.64,15.64,0,0,0,1.93.53l2.69.61a19.34,19.34,0,0,1,4.12,1.35,11.24,11.24,0,0,1,3,2,7.79,7.79,0,0,1,1.84,2.68,9.15,9.15,0,0,1,.65,3.4,8.85,8.85,0,0,1-1.51,5.1,9.29,9.29,0,0,1-4.26,3.26,17.85,17.85,0,0,1-6.7,1.13,18.21,18.21,0,0,1-6.86-1.18,9.72,9.72,0,0,1-4.55-3.58,10.81,10.81,0,0,1-1.66-6.08h7.25a4.7,4.7,0,0,0,.82,2.53,4.44,4.44,0,0,0,2,1.53,7.78,7.78,0,0,0,2.93.52,7.21,7.21,0,0,0,2.61-.42,3.73,3.73,0,0,0,1.66-1.14,2.72,2.72,0,0,0,.6-1.69,2.38,2.38,0,0,0-.55-1.52,4.24,4.24,0,0,0-1.65-1.1,17.24,17.24,0,0,0-2.83-.87l-3.27-.76a14.4,14.4,0,0,1-6.42-3,7.16,7.16,0,0,1-2.32-5.66,8.43,8.43,0,0,1,1.56-5.1,10.36,10.36,0,0,1,4.36-3.41,15.62,15.62,0,0,1,6.36-1.23,14.93,14.93,0,0,1,6.33,1.24,9.77,9.77,0,0,1,4.17,3.45,9.21,9.21,0,0,1,1.52,5.15Z"/><path class="cls-1" d="M371.62,381.19V349.83h3.8v28H390v3.37Z"/><path class="cls-1" d="M402.36,381.19h-4l11.51-31.36h3.92l11.51,31.36h-4L412,354.79h-.24Zm1.47-12.25h16v3.37h-16Z"/><path class="cls-1" d="M433.46,381.19V349.83h11a11.51,11.51,0,0,1,5.41,1.13,7.51,7.51,0,0,1,3.17,3,8.62,8.62,0,0,1,1,4.19,7,7,0,0,1-.71,3.34,5.72,5.72,0,0,1-1.87,2.08,8.84,8.84,0,0,1-2.5,1.14v.3a6.18,6.18,0,0,1,2.89,1,7.32,7.32,0,0,1,2.43,2.64,8.25,8.25,0,0,1,1,4.19,8.35,8.35,0,0,1-1.07,4.24,7.39,7.39,0,0,1-3.38,3,14.14,14.14,0,0,1-6,1.1Zm3.8-17.58h7a7,7,0,0,0,3.1-.67,5.46,5.46,0,0,0,2.21-1.9,5.12,5.12,0,0,0,.81-2.88,4.74,4.74,0,0,0-1.44-3.51q-1.43-1.45-4.56-1.45h-7.16Zm0,14.21h7.53q3.72,0,5.29-1.44a4.61,4.61,0,0,0,1.57-3.52,5.67,5.67,0,0,0-.81-2.95,6,6,0,0,0-2.31-2.17,7.31,7.31,0,0,0-3.56-.82h-7.71Z"/></svg>`;


// ═══════════════════════════════════════════════════════════════════════════════
// RENDER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function render() {
  const app = document.getElementById('app');
  stopTimer();
  switch (state.screen) {
    case 'intro':       app.innerHTML = renderIntro();       setTimeout(attachIntroEvents, 0);       break;
    case 'decision':    app.innerHTML = renderDecision();    setTimeout(attachDecisionEvents, 0);    break;
    case 'consequence': app.innerHTML = renderConsequence(); setTimeout(attachConsequenceEvents, 0); break;
    case 'event':       app.innerHTML = renderEvent();       setTimeout(attachEventEvents, 0);       break;
    case 'summit':      app.innerHTML = renderSummit();      setTimeout(attachSummitEvents, 0);      break;
    case 'political':   app.innerHTML = renderPolitical();   setTimeout(attachPoliticalEvents, 0);   break;
    case 'share':       app.innerHTML = renderShare();       setTimeout(attachShareEvents, 0);       break;
  }
}

// ── INTRO ─────────────────────────────────────────────────────────────────────

function renderIntro() {
  return `<div class="screen"><div class="inner">
    <div class="logo-wrap">${LOGO_SVG}</div>
    <div class="game-title">AI Race</div>
    <div class="game-sub">An AI Governance Simulation</div>
    <p class="intro-body">You are the National AI Advisor to the Prime Minister.</p>
    <p class="intro-body" style="margin-top:18px;">Your country is a democracy of 80 million people. Predominantly rural. Post-colonial. Rich in rare earth reserves. Home to 22 official languages, uneven infrastructure, and an emerging AI start-up ecosystem of 430 companies—most of them wrapper businesses built on foreign models.</p>
    <p class="intro-body" style="margin-top:18px;">The global AI race is accelerating.</p>
    <p class="intro-body" style="margin-top:18px;">Countries that control compute, chips, models, data centres, standards, and talent will define the terms of the future. Those that do not will be forced to live within rules written by others.</p>
    <p class="intro-body" style="margin-top:18px;">International companies are already circling your country—for its minerals, its talent, its data, its users, and its market. Foreign APIs are powering local entrepreneurs. External platforms are beginning to shape the architecture of dependence.</p>
    <div class="divider"></div>
    <p class="intro-italic">The question is simple: Do you get a seat at the table, or end up on the menu?</p>
    <p class="intro-body" style="margin-top:18px;">The next 18 months will be critical for your country's AI ecosystem. In that time, you must make foundational decisions on compute, data governance, talent, start-ups, infrastructure, and strategic autonomy. What you build now—or fail to build—will determine whether your country becomes a serious AI player, a dependent market, or a site of extraction in someone else's technological future.</p>
    <p class="intro-body" style="color:var(--ink-muted);font-size:17px;margin-bottom:48px;">The game pushes you through five decision arenas. What will you do next?</p>
    <button class="btn btn-primary btn-full" id="start-btn">Begin</button>
    <div class="intro-note">~10 minutes &nbsp;·&nbsp; 15 decisions &nbsp;·&nbsp; 60 seconds per choice &nbsp;·&nbsp; no right answers</div>
  </div></div>`;
}

function attachIntroEvents() {
  const btn = document.getElementById('start-btn');
  if (btn) btn.onclick = () => {
    state.shuffledDecisions = shuffleArray(decisions);
    state.currentDecision = 0;
    state.screen = 'decision';
    render();
  };
}

// ── DECISION ──────────────────────────────────────────────────────────────────

function renderDecision() {
  const d = currentDecision();
  const idx = state.currentDecision, total = state.shuffledDecisions.length;
  const monthsRemaining = TOTAL_MONTHS - state.totalMonthsUsed;
  const isDanger = monthsRemaining < 4;
  const timerPct = (state.timerSeconds / TIMER_SECONDS) * 100;
  const monthPct = Math.max(0, (monthsRemaining / TOTAL_MONTHS) * 100);

  // Progress dots
  let dots = '';
  state.shuffledDecisions.forEach((dec, i) => {
    const ch = state.choices[dec.id];
    let cls = 'dot';
    if (i === idx) cls += ' current';
    else if (ch) cls += ` done-${ch}`;
    dots += `<div class="${cls}"></div>`;
  });

  // Dimension bars
  const dimBars = Object.entries(SCORE_LABELS).map(([k, label]) => {
    const pct = Math.min(100, Math.max(0, Math.round(((state.scores[k]||0) / SCORE_MAX[k]) * 100)));
    return `<div class="dim-row">
      <div class="dim-label">${label}</div>
      <div class="dim-bar-wrap"><div class="dim-bar-fill" style="width:${pct}%;"></div></div>
    </div>`;
  }).join('');

  return `<div class="screen"><div class="inner">
    <div class="dec-counter">${idx + 1} of ${total}</div>
    <div style="font-size:9px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--teal);margin-bottom:28px;line-height:1.6;">${d.chapterTitle}<br><span style="color:var(--ink-faint);font-weight:500;">${d.subChapterTitle}</span></div>

    <div class="month-tracker">
      <div class="month-label">Summit in</div>
      <div class="bar-wrap"><div class="bar-fill${isDanger?' danger':''}" style="width:${monthPct}%;"></div></div>
      <div class="month-count${isDanger?' danger':''}">${Math.max(0,monthsRemaining)} months</div>
    </div>

    <div class="dim-bars">${dimBars}</div>

    <p class="situation-intro">${d.intro}</p>
    <p class="situation">${d.situation}</p>

    <div class="timer-row">
      <div class="timer-label">Decide — or a choice is made for you</div>
      <div class="timer-secs${state.timerSeconds<=10?' urgent':''}" id="timer-secs">${state.timerSeconds}s</div>
    </div>
    <div class="timer-bar-wrap">
      <div class="timer-bar${state.timerSeconds<=10?' urgent':''}" id="timer-bar" style="width:${timerPct}%;"></div>
    </div>

    <div class="options">
      ${['A','B','C'].map(l => `
      <div class="option-card" id="opt-${l}">
        <div class="opt-letter">Option ${l}</div>
        <div class="opt-title">${d.options[l].title}</div>
        <div class="opt-desc">${d.options[l].desc}</div>
      </div>`).join('')}
    </div>
    <div class="progress-dots">${dots}</div>
  </div></div>`;
}

function attachDecisionEvents() {
  state.timerSeconds = TIMER_SECONDS;
  state.randomChoiceMade = false;

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    const secEl = document.getElementById('timer-secs');
    const barEl = document.getElementById('timer-bar');
    if (secEl) { secEl.textContent = state.timerSeconds + 's'; if (state.timerSeconds <= 15) secEl.classList.add('urgent'); }
    if (barEl)  { barEl.style.width = ((state.timerSeconds/TIMER_SECONDS)*100)+'%'; if (state.timerSeconds <= 15) barEl.classList.add('urgent'); }
    if (state.timerSeconds <= 0) {
      stopTimer();
      state.randomChoiceMade = true;
      makeChoice(['A','B','C'][Math.floor(Math.random()*3)]);
    }
  }, 1000);

  ['A','B','C'].forEach(l => {
    const el = document.getElementById('opt-'+l);
    if (el) el.onclick = () => { stopTimer(); makeChoice(l); };
  });
}

function makeChoice(letter) {
  const d = currentDecision();
  state.choices[d.id] = letter;
  state.totalMonthsUsed += d.timeCosts[letter];
  const delta = OPTION_SCORES[d.id] ? OPTION_SCORES[d.id][letter] : null;
  if (delta) {
    Object.keys(delta).forEach(k => { state.scores[k] = (state.scores[k]||0) + delta[k]; });
    state.lastScoreDelta = delta;
  } else {
    state.lastScoreDelta = null;
  }
  checkWhatIfs();
  state.screen = 'consequence';
  render();
}

// ── CONSEQUENCE ───────────────────────────────────────────────────────────────

function renderConsequence() {
  const d = currentDecision(), letter = state.choices[d.id], opt = d.options[letter];
  const cost = d.timeCosts[letter], monthsRemaining = TOTAL_MONTHS - state.totalMonthsUsed;
  const isLast = state.currentDecision === state.shuffledDecisions.length - 1;
  const isOver = state.totalMonthsUsed > TOTAL_MONTHS;

  const monthNote = cost === 0
    ? 'No months added to your timeline.'
    : `+${cost} month${cost!==1?'s':''} added to your timeline.`;
  const statusNote = isOver
    ? ` <span class="danger">${state.totalMonthsUsed - TOTAL_MONTHS} month${state.totalMonthsUsed-TOTAL_MONTHS!==1?'s':''} behind schedule.</span>`
    : ` ${Math.max(0,monthsRemaining)} month${monthsRemaining!==1?'s':''} remaining to summit.`;

  let scoreDeltaHtml = '';
  if (state.lastScoreDelta) {
    const parts = Object.entries(state.lastScoreDelta).filter(([,v])=>v!==0).map(([k,v]) => {
      const sign = v > 0 ? '+' : '';
      return `<span style="color:${v<0?'var(--rust)':'var(--ink-mid)'};">${SCORE_LABELS[k]} <strong>${sign}${v}</strong></span>`;
    }).join('&ensp;·&ensp;');
    if (parts) scoreDeltaHtml = `<div class="score-delta">${parts}</div>`;
  }

  const randomBadge = state.randomChoiceMade
    ? `<div class="random-notice">⚡ Time expired — this choice was made at random</div>` : '';

  const continueLabel = state.pendingEvent
    ? 'See what happened next →'
    : isLast ? 'See your summit outcome →' : 'Continue →';

  return `<div class="screen"><div class="inner">
    ${randomBadge}
    <div class="choice-badge">Option ${letter} chosen</div>
    <div class="choice-title">${opt.title}</div>
    <div class="divider" style="margin:0 0 28px 0;"></div>
    <p class="consequence-text">${opt.consequence}</p>
    ${scoreDeltaHtml}
    <p class="months-note">${monthNote}${statusNote}</p>
    <button class="btn btn-primary btn-full" id="continue-btn">${continueLabel}</button>
  </div></div>`;
}

function attachConsequenceEvents() {
  const btn = document.getElementById('continue-btn');
  if (btn) btn.onclick = () => {
    state.randomChoiceMade = false;
    if (state.pendingEvent) { state.screen = 'event'; }
    else if (state.currentDecision === state.shuffledDecisions.length - 1) { state.screen = 'summit'; }
    else { state.currentDecision++; state.screen = 'decision'; }
    render();
  };
}

// ── EVENT (WHAT-IF) ───────────────────────────────────────────────────────────

function renderEvent() {
  const ev = state.pendingEvent;
  return `<div class="screen"><div class="inner">
    <div class="event-wrap">
      <div class="event-from">${ev.fromNews}</div>
      <div class="event-headline">${ev.headline}</div>
      <div class="divider" style="margin:0 0 24px 0;"></div>
      <p class="event-body">${ev.body}</p>
      <p class="event-subtext">${ev.subtext}</p>
      <div class="event-impact">Score impact: ${ev.impactLabel}</div>
      <button class="btn btn-primary btn-full" id="event-continue-btn">Continue →</button>
    </div>
  </div></div>`;
}

function attachEventEvents() {
  const btn = document.getElementById('event-continue-btn');
  if (btn) btn.onclick = () => {
    state.pendingEvent = null;
    if (state.currentDecision === state.shuffledDecisions.length - 1) { state.screen = 'summit'; }
    else { state.currentDecision++; state.screen = 'decision'; }
    render();
  };
}

// ── SUMMIT ────────────────────────────────────────────────────────────────────

function renderSummit() {
  const outcome = getSummitOutcome(), months = state.totalMonthsUsed, assets = countAssets();
  const isOver = months > TOTAL_MONTHS;
  const stat = isOver
    ? `${months} months used — ${months-TOTAL_MONTHS} over schedule. ${assets} of 8 strategic assets built.`
    : `${months} of 18 months used. ${assets} of 8 strategic assets built.`;

  const paras = outcome.paragraphs.map(p => `<p class="summit-body">${p}</p>`).join('');

  const scoreBars = Object.entries(SCORE_LABELS).map(([k, label]) => {
    const pct = Math.min(100, Math.max(0, Math.round(((state.scores[k]||0) / SCORE_MAX[k]) * 100)));
    return `<div class="score-bar-row">
      <div class="score-bar-header">
        <span class="score-bar-label">${label}</span>
        <span class="score-bar-pct">${pct}%</span>
      </div>
      <div class="bar-wrap"><div class="bar-fill amber" style="width:${pct}%;"></div></div>
    </div>`;
  }).join('');

  return `<div class="screen"><div class="inner">
    <div class="summit-eyebrow">AI Summit · 90 days later</div>
    <div class="summit-stat">${stat}</div>
    <div class="summit-title">${outcome.title}</div>
    <div class="divider"></div>
    ${paras}
    <div class="score-bar-section">${scoreBars}</div>
    <button class="btn btn-full" id="political-btn" style="margin-top:32px;">See your political compass →</button>
  </div></div>`;
}

function attachSummitEvents() {
  const btn = document.getElementById('political-btn');
  if (btn) btn.onclick = () => { state.screen = 'political'; render(); };
}

// ── POLITICAL ─────────────────────────────────────────────────────────────────

function renderPolitical() {
  const profile = getPoliticalProfile(), { A, B, C } = countChoices();
  return `<div class="screen"><div class="inner">
    <div class="summit-eyebrow" style="margin-bottom:36px;">Your political compass</div>
    <div class="political-name">${profile.name}</div>
    <div class="political-sub">${profile.subtitle}</div>
    <div class="divider"></div>
    <p class="political-body">${profile.desc}</p>
    <div class="choice-counts">
      <div class="count-A"><span>${A}</span> Option A</div>
      <div class="count-B"><span>${B}</span> Option B</div>
      <div class="count-C"><span>${C}</span> Option C</div>
    </div>
    <button class="btn btn-primary btn-full" id="share-btn">Share your result</button>
  </div></div>`;
}

function attachPoliticalEvents() {
  const btn = document.getElementById('share-btn');
  if (btn) btn.onclick = () => { state.screen = 'share'; render(); };
}

// ── SHARE ──────────────────────────────────────────────────────────────────────

function renderShare() {
  const text = getLinkedInText();
  return `<div class="screen"><div class="inner">
    <div class="summit-eyebrow" style="margin-bottom:32px;">Share your result</div>
    <pre class="share-text-box" id="share-text">${text}</pre>
    <div class="share-actions">
      <button class="btn btn-primary" id="copy-btn">Copy text</button>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://civic.games/ai-race" target="_blank" rel="noopener" class="btn">LinkedIn</a>
      <button class="btn" id="replay-btn">Play again</button>
    </div>

    <div class="footer-credits">
      <p class="giz-note">AI Race was first built with support from GIZ. It is part of a full AI governance workshop that can be rolled out in person — facilitated or self-guided, across governments, universities, and civil society organisations. <a href="mailto:hello@civic.games" style="color:var(--teal);">Get in touch to bring it to your team.</a></p>
      <div class="copyright-line">
        ${LOGO_SVG.replace('style="width:180px;height:auto;display:block;"','style="width:80px;height:auto;display:inline-block;vertical-align:middle;margin-right:12px;"')}
        <span style="vertical-align:middle;">© 2025 The Civic Games Lab &nbsp;·&nbsp; Built with <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a> (Anthropic) &nbsp;·&nbsp; <a href="https://civic.games" target="_blank" rel="noopener">civic.games</a></span>
      </div>
    </div>
  </div></div>`;
}

function attachShareEvents() {
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) copyBtn.onclick = () => {
    const text = document.getElementById('share-text').textContent;
    const doFallback = () => {
      const ta = document.createElement('textarea'); ta.value = text;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    };
    (navigator.clipboard ? navigator.clipboard.writeText(text).catch(doFallback) : Promise.resolve(doFallback())).then ? null : null;
    doFallback();
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => { const b = document.getElementById('copy-btn'); if (b) b.textContent = 'Copy text'; }, 2000);
  };

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) replayBtn.onclick = () => {
    stopTimer();
    Object.assign(state, {
      screen: 'intro', currentDecision: 0, shuffledDecisions: [],
      choices: {}, totalMonthsUsed: 0, scores: { S:0, L:0, C:0, Su:0 },
      lastScoreDelta: null, pendingEvent: null, triggeredEvents: new Set(),
      timerSeconds: TIMER_SECONDS, randomChoiceMade: false,
    });
    render();
  };
}

// ─── INIT ──────────────────────────────────────────────────────────────────────
render();
