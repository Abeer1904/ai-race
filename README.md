# civic.games

**Playable simulations of hard governance problems.**

civic.games is a project of [The Civic Games Lab](https://civicgameslab.org). Each game is a single-file, browser-playable simulation designed for use in workshops, classrooms, and public engagement — no installation, no login, no data collection.

---

## Games

| # | Game | Status | Topic |
|---|------|--------|-------|
| 1 | **AI Race** | ✅ Live | AI governance & strategic autonomy |
| 2 | The Poll | 🔜 Planned | Electoral systems & misinformation |
| 3 | Fix It | 🔜 Planned | Public service delivery |
| 4 | Gram Vikas | 🔜 Planned | Rural development & trade-offs |
| 5 | Engines of Growth | 🔜 Planned | Industrial policy |
| 6 | Splinternet | 🔜 Planned | Internet governance & fragmentation |

---

## AI Race

> *You are the National AI Advisor to the Prime Minister. The global AI race is accelerating. You have 18 months.*

**AI Race** is an AI governance simulation for middle-power developing nations. Players navigate 15 decisions across five arenas — compute infrastructure, indigenous model development, data governance, talent, and geopolitical strategy — building toward a global AI summit.

Every decision costs time. If the timer runs out, the decision is made for you.

### How to play

Open `ai-race.html` in any modern browser. No server required.

For deployment to GitHub Pages or similar static hosting, drop the file into the root of a public repository and enable Pages.

```
civic.games/ai-race.html
```

### Game structure

```
Intro → [15 shuffled decisions] → Summit outcome → Political profile → Share
```

Each decision has:
- A situation briefing drawn from real policy contexts
- Three options: commons-first (A) · pragmatic middle (B) · market-led (C)
- A consequence screen with score impact
- Occasional what-if event cards triggered by compounding choices

### Score dimensions

| Dimension | What it tracks |
|-----------|---------------|
| **Sovereignty** | Control over compute, model, and data infrastructure |
| **Legitimacy** | Public and international trust in what you are building |
| **Capacity** | Long-term ability to sustain and improve AI capability |
| **Sustainability** | Environmental and social cost to land and communities |

### Five decision arenas

1. **Compute & Infrastructure** — who builds it, who owns it, what it costs the land
2. **The Indigenous Model** — build, borrow, or become a market
3. **Data Governance** — who controls the data the models run on
4. **Talent & Workforce** — where the people come from and who they work for
5. **Geopolitical Strategy** — rare earths, summit positioning, and the deals you make

### Endings

Six distinct summit outcomes based on your choices across sovereignty assets, time used, and the ratio of A / B / C decisions. Players are shown a political profile — Commons-First, Pragmatic Middle, or Market-Led — and a LinkedIn share card.

---

## Design principles

- **Single file** — each game is one self-contained `.html` file; CSS and JS are inline; the only external dependency is Google Fonts
- **No tracking** — no analytics, no cookies, no server calls
- **Real precedents** — every option is backed by a documented real-world policy, organisation, or incident with a verifiable source
- **No right answers** — the game surfaces tensions, not verdicts
- **Workshop-ready** — designed to run in 8–10 minutes as a structured trigger for discussion

---

## Workshop use

AI Race was first developed with support from **GIZ** as part of a full AI governance workshop programme. The workshop format includes a pre-game briefing, a facilitated debrief using participants' summit outcomes, and a structured discussion guide mapping game decisions to real policy choices.

To enquire about running the workshop in person, contact The Civic Games Lab.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Runtime | Vanilla HTML / CSS / JS — no frameworks |
| Fonts | EB Garamond (serif) + Inter (sans-serif) via Google Fonts |
| Branding | Civic Games Lab design system — amber `#E8AA3D`, teal `#4D696D` |
| Hosting | GitHub Pages (planned: civic.games) |
| Build | None — edit the `.html` file directly |

---

## File structure

```
civic-games/
├── README.md
├── ai-race.html          ← complete game, single file
├── assets/               ← shared brand assets (future use)
├── docs/
│   └── AI_Race_GDD_v1.docx
└── games/
    └── ai-race.html      ← mirror / staging copy
```

---

## Game Design Documents

Full GDDs are maintained separately. The v2 GDD for AI Race contains all 15 sub-chapter decision texts, option descriptions, consequence writing, score architecture, and source citations with verified links.

---

## Credits

Designed and built by **The Civic Games Lab**.

Built with [Claude](https://claude.ai) (Anthropic).

First developed with support from **GIZ**.

© 2025 The Civic Games Lab · [civic.games](https://civic.games)
