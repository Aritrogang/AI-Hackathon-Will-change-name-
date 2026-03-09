# Katabatic — Presenter Script

> 10 slides, ~4 minutes of talking + live demo. Each slide has a transition, talking points, visual cues for on-screen elements, one key phrase to nail, and an advance cue.

---

## Slide 01 — Hero (15s)

**Transition:** Opening. Take a breath. Let the hurricane rings animate.

**On screen:** Hurricane rings animation, Katabatic logo, team names, "Cornell AI Hackathon 2026 · Programmable Capital Track" badge.

- Introduce yourself and the team (first names, gesture at names on screen)
- One sentence on what Katabatic is: "We built a liquidity stress testing engine for stablecoin reserves."

**Key phrase:** "Katabatic — liquidity stress testing for stablecoin reserves."

**Advance:** After the key phrase, pause one beat, then advance.

---

## Slide 02 — The Problem (25s)

**Transition:** "Here's the problem."

**On screen:** Title: "The attestation said fine. Then SVB failed." Dark SVB case study card (left) with $3.3B figure. Two stat blocks (right): $150B+ unstressed reserve assets, 30 days between attestations. Depeg sparkline (bottom) showing $1.00→$0.87 with "SVB fails" and "$0.87 low" annotations. "Katabatic flags critical 48h prior" callout.

- Point to the SVB card: "SVB held $3.3 billion in USDC reserves. The attestation, two weeks before, said fine. Quote: 'Held at a US regulated bank with $100 billion plus in assets.' That's an envelope — not data."
- Point to the depeg sparkline: "Thirteen cents in 48 hours. USDC hit 87 cents."
- Gesture to the stat blocks: "$150 billion in reserve assets and nobody stress tests them. 30 days between attestations — everything in between is invisible."
- Point to the "Katabatic flags critical 48h prior" callout: "Our engine would have flagged this."
- Root cause: "This wasn't credit risk. It was duration mismatch."

**Key phrase:** "The attestation said fine. SVB failed. USDC hit 87 cents. That's duration risk — and nobody is testing for it."

**Advance:** After "nobody is testing for it."

---

## Slide 03 — The Engine (30s)

**Transition:** "So we built an engine."

**On screen:** Title: "From opaque PDF to realtime liquidity stress score." Input source pills (top): PDF Attestations, FDIC Call Reports, Onchain Flows, NOAA Weather. Downward flow arrow. Six pipeline steps with numbered circles and chevron connectors: Resolve Entities → Build Graph → Compute WAM → Apply Stress → Output LCR → Pin to IPFS. Downward flow arrow. Output metrics: 68/100 stress score, 72h redemption latency, 88% liquidity coverage. Consensus badge.

- Point to the input pills at top: "Four data sources feed the engine. PDF attestations — which we treat as inference puzzles, not documents. FDIC Call Reports for bank health. Onchain mint/burn flows for cross-reference. And NOAA weather data for tail risk."
- Trace the flow arrows down: "Data flows through a six-step pipeline."
- Walk left-to-right across the pipeline: "Resolve entities from PDFs, build the knowledge graph, compute weighted average maturity, apply stress scenarios, output a liquidity coverage ratio, and pin everything to IPFS for verifiable provenance."
- Point to the output metrics: "Result: stress score 68, 72-hour redemption latency, 88% coverage under this scenario."
- Point to the consensus badge: "Two LLMs — Claude and Gemini — independently agree. Delta of 3. Consensus confirmed."

**Key phrase:** "From opaque PDF to realtime liquidity stress score. Two models, one consensus."

**Advance:** After touching the consensus badge.

---

## Slide 04 — Six Dimensions (30s)

**Transition:** "Six dimensions drive the score."

**On screen:** Title: "Duration risk is primary. Weather is the force multiplier." Formula bar: Stress Score = Duration Risk^WAM × Weather Multiplier × Concentration Factor. Six dimension rows with proportional colored bars: Duration Risk 30% (Primary tag), Reserve Transparency 20%, Geographic + Ops Concentration 15%, Weather Tail Risk 15% (Demo Focus tag), Counterparty Health 15%, Peg Stability 5%.

- Point to the formula: "Stress score equals duration risk times weather multiplier times concentration factor."
- Point to Duration Risk (30%, largest bar, Primary tag): "Duration risk is 30% of the score — the primary signal. SVB had a 730-day WAM against daily redemptions. That's the mismatch that kills."
- Point to Weather Tail Risk (15%, Demo Focus tag): "Weather is 15% — a force multiplier, not the cause. The hurricane doesn't hit the bank. It hits the LTV ratio. And it hits the data center corridor where treasury ops run."
- Gesture across the remaining rows: "Reserve transparency measures data freshness and onchain divergence. Geographic concentration uses an HHI index. Counterparty health comes from FDIC mining. Peg stability tracks historical depegs."
- Do NOT read every dimension line by line. Let the audience scan.

**Key phrase:** "Duration risk is the cause. Weather is the catalyst."

**Advance:** After the key phrase.

---

## Slide 05 — Why Now (30s)

**Transition:** "Why hasn't anyone built this before?"

**On screen:** Title: "The GENIUS Act 2026 just created this market." Left: Vertical regulatory timeline with three aligned points: Before 2026 / Jan 2026 / Today. Right: "Why hasn't someone done this before?" accent callout with "The data didn't exist. Now it does." Two stat pills: 6 stablecoins tracked, <2s re-score time. Bottom: Stablecoin Total Supply bar chart ($30B 2021 → $80B 2023 → $180B 2025 → $350B 2027 → $700B+ 2030 projected).

- Point to "Before 2026" on the timeline: "Before this year, attestations were PDFs with a 30-day lag. No programmatic access. No continuous monitoring."
- Point to "Jan 2026": "January 2026 — the GENIUS Act is signed. All US stablecoin issuers must provide XBRL filings and OCC API feeds."
- Point to "Today": "For the first time, continuous reserve monitoring is technically and legally possible. We have the pipeline."
- Gesture to the callout on the right: "The data didn't exist. Now it does. We're first in a regulation-mandated market."
- Point to the stat pills: "Six stablecoins tracked. Under two seconds to re-score."
- Point to the market chart at the bottom: "$30 billion in 2021. $180 billion today. Projected $700 billion by 2030. This market is exploding and nobody is stress-testing it."

**Key phrase:** "The GENIUS Act just created this market. The data didn't exist. Now it does."

**Advance:** After "we're first."

---

## Slide 06 — Positioning (30s)

**Transition:** "So where do we sit in the stack?"

**On screen:** Title: "Onchain shows the flows. Katabatic shows what's about to break." Three-layer stack with flow arrows between them: Layer 1 (Onchain Data Platforms: Dune, Nansen, Chainalysis) → Layer 2 (Reserve Risk Infrastructure — Katabatic: stress_score, latency_hours, coverage_ratio) → Layer 3 (Downstream Consumers: MakerDAO, Aave, Risk Desks). Key analogy callout. Dark panel with two columns: What Onchain Can't See, Defensible Moat.

- Point to Layer 1 with tags: "Layer 1 — onchain data platforms. Dune, Nansen, Chainalysis. They see the flows — mint, burn, wallet movements."
- Point to the flow arrow, then Layer 2 (highlighted): "Layer 2 — us. Katabatic. The structural fragility layer that onchain can't see. WAM duration risk, FDIC health signals, weather tail risk, LLM consensus."
- Point to the flow arrow, then Layer 3: "Layer 3 — who consumes this. DAO treasuries, DeFi protocols, risk desks, oracle feeds."
- Read or paraphrase the analogy callout: "Onchain data platforms became the system of record for onchain behavior. We're building the equivalent for offchain reserve risk."
- Gesture at the dark panel: "What onchain can't see: WAM duration mismatch, FDIC bank health, data center ops exposure, weather tail risk. Our moat: the scoring engine, the knowledge graph, LLM consensus, and IPFS-pinned provenance."

**Key phrase:** "Onchain shows the flows. Katabatic shows what's about to break."

**Advance:** After the key phrase.

---

## Slide 07 — Live Demo (30s)

**Transition:** "Let me show you."

**On screen:** Title: "Three scenarios. One engine." Three scenario cards: (A) Hurricane — Data Center Ops Freeze (accent border), (B) SVB Collapse Backtest (warn border), (C) 100bps Rate Hike (success border). Live output table with columns: stablecoin, stress_score, latency_hours, coverage_ratio, wam_days. Rows: USDC (68, 72h, 0.88, 45d), USDT (31, <4h, 1.00, 12d), FRAX (74, 48h, 0.91, 67d). LIVE badge.

- Point to each scenario card:
  - A: "Hurricane hitting the Gulf. Cat 4 — Florida bank LTV stress plus a Northern Virginia data center ops freeze."
  - B: "SVB backtest. Rewind to March 2023. 94% in 2-year bonds."
  - C: "Rate hike sensitivity. 100 basis points. Which stablecoins are most exposed?"
- Point to the live output table: "This is the actual API output. Look at the numbers."
  - "USDC: stress score 68, 72-hour latency, 88% coverage, 45-day WAM."
  - "USDT: 31, under 4 hours, full coverage. Short duration — that's why."
  - "FRAX: 74 — worst of the three. 67-day WAM. Longest duration, most exposed."
- If doing a live demo, switch to the dashboard now.

**Key phrase:** "Three scenarios, one engine. FRAX is the most exposed — 67-day WAM. Let's start with the hurricane."

**Advance:** After introducing the scenarios, switch to live demo (or advance).

---

## Slide 08 — Vision (25s)

**Transition:** "Where does this go?"

**On screen:** Title: "From stress simulator to financial infrastructure." Three phases with connecting line: Phase 01 Now — Stress Test Playground, Phase 02 Next — Oracle Grade Risk Feed (highlighted, IPFS/Chainlink badge), Phase 03 Endgame — The Katabatic Stablecoin. Bloomberg pull quote. WAM comparison bars: USDC 45d (green, short) vs SVB 2023 730d (purple, full width).

- Point to Phase 01: "Phase 1 is now. Prove the engine works. Duration mismatch plus weather as a stress multiplier. Output: latency and coverage under any scenario."
- Point to Phase 02 (highlighted): "Phase 2 — oracle-grade risk feed. Scores pinned to IPFS via Pinata, pushed to Chainlink. DeFi protocols can auto-rebalance based on our scores."
- Point to Phase 03: "Phase 3, the endgame: build our own stablecoin — diversified, continuously stress-tested, managed by the engine that rates them all."
- Gesture to the Bloomberg quote: "Bloomberg started with terminals. We start with stress simulations."
- Point to the WAM comparison bars: "Look at this. USDC has a 45-day WAM — that's the green bar. SVB had 730 days — that purple bar. That's the difference between safe and catastrophic. Duration is everything."

**Key phrase:** "Bloomberg started with terminals. We start with stress simulations."

**Advance:** After the WAM bars.

---

## Slide 09 — Go to Market (20s)

**Transition:** "Business model is simple."

**On screen:** Title: "API first infrastructure. Not a consulting fee." Three tier rows: Starter API (REST, 6 stablecoins, <2s rescore, 1M calls/mo), Enterprise (real-time streaming, custom onboarding, SLA, warehouse delivery), Institutional (FDIC mining, oracle feed integration, dedicated pipeline). Logo conveyor scrolling: MakerDAO, Aave, Compound, Chainlink, USDC, Tether, Uniswap, Ethereum.

- "API-first infrastructure, not consulting."
- Point to each tier briefly:
  - "Starter: REST API access. Six stablecoins. Under 2-second rescore. A million calls a month."
  - "Enterprise: real-time streaming, custom stablecoin onboarding, SLA guarantees, warehouse delivery."
  - "Institutional: FDIC Call Report mining, oracle feed integration, dedicated scoring pipeline."
- Point to the logo conveyor: "These are the protocols and issuers who need this data. MakerDAO, Aave, Compound, Chainlink — anyone holding stablecoin positions needs to know the structural risk."

**Key phrase:** "API subscriptions, not consulting fees. The same model that built the onchain data industry."

**Advance:** After touching the logos.

---

## Slide 10 — The Close (25s)

**Transition:** Let the dark slide + hurricane rings create a pause. Let the animation breathe.

**On screen:** Dark background with hurricane rings. "Weather proves the engine." Glass container with hero numbers counting up: 72h Redemption Latency | 88% Liquidity Coverage. Context line: "Under a Cat 4 hitting the Gulf + 50bps rate hike on your USDC position. That's what DAO treasuries need. That's Katabatic."

- Pause. Let the hurricane rings settle and the numbers count up.
- "Weather proves the engine. Duration mismatch is the structural risk. Weather is the force multiplier that reveals it."
- Point to the hero numbers: "Under a Cat 4 plus a 50 basis point hike — your USDC position shows 72-hour redemption latency and 88% liquidity coverage."
- Pause. Let it land.
- "That's not a letter grade you can get sued over. That's an operational output a DAO treasury can act on."
- "That's what DAO treasuries need. That's Katabatic."

**Key phrase:** "72-hour latency. 88% coverage. Under a Cat 4 plus 50 basis points. That's what DAOs need. That's Katabatic."

**Advance:** Done. Stay on this slide for Q&A.

---

## Timing Summary

| Slide | Topic | Time |
|-------|-------|------|
| 01 | Hero | 15s |
| 02 | The Problem | 25s |
| 03 | The Engine | 30s |
| 04 | Six Dimensions | 30s |
| 05 | Why Now | 30s |
| 06 | Positioning | 30s |
| 07 | Live Demo | 30s |
| 08 | Vision | 25s |
| 09 | Go to Market | 20s |
| 10 | The Close | 25s |
| **Total** | | **~4 min** |
