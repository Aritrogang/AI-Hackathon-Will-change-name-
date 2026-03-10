# Katabatic — Presenter Script

> 10 slides, ~3 minutes talking + ~1 minute live demo. Total: ~4 minutes. Each slide has talking points, one key phrase to nail, and an advance cue. Keep it tight — let the visuals do the work.

---

## Slide 01 — Hero (10s)

**On screen:** Hurricane rings, Katabatic logo (animated letter reveal), subtitle "Liquidity stress testing for stablecoin reserves", hackathon badge, team names (Adi, Aritro, Connor, Krish, Suchit, Vikram).

- "Hey everyone — we're Katabatic. We built a liquidity stress testing engine for stablecoin reserves."

**Key phrase:** "Liquidity stress testing for stablecoin reserves."

**Advance:** Immediately after.

---

## Slide 02 — The Problem (20s)

**Transition:** "Here's the problem."

**On screen:** SVB headquarters photo with $3.3B overlay. Two stat blocks: $150B+ unstressed, 30 days between attestations. Depeg sparkline $1.00→$0.87. "Katabatic flags critical 48h prior."

- Point to SVB photo: "SVB held $3.3 billion in USDC reserves. The attestation two weeks before said fine."
- Point to sparkline: "Thirteen cents in 48 hours. USDC hit 87 cents."
- "150 billion in reserves, nobody stress tests them. This wasn't credit risk — it was duration mismatch."

**Key phrase:** "The attestation said fine. SVB failed. That's duration risk — nobody is testing for it."

**Advance:** After "nobody is testing for it."

---

## Slide 03 — The Engine (20s)

**Transition:** "So we built an engine."

**On screen:** Input pills (PDF, FDIC, Onchain, NOAA). Six-step pipeline circles. Output: 68/100 stress, 72h latency, 88% coverage. Consensus badge.

- Point to pills: "Four data sources — attestation PDFs, FDIC reports, onchain flows, and NOAA weather."
- Gesture across pipeline: "Six-step pipeline: resolve entities, build the graph, compute WAM, apply stress, output LCR, pin to IPFS."
- Point to output: "Result: stress score 68, 72-hour latency, 88% coverage. Two LLMs agree — consensus confirmed."

**Key phrase:** "From opaque PDF to realtime stress score. Two models, one consensus."

**Advance:** After consensus.

---

## Slide 04 — Six Dimensions (20s)

**Transition:** "Six dimensions drive the score."

**On screen:** Formula bar. Six rows with proportional color-field bars: Duration Risk (WAM) 30% [Primary], Reserve Transparency 20%, Geographic + Ops Concentration 15%, Weather Tail Risk 15% [Demo Focus], Counterparty Health 15%, Peg Stability 5%.

- Point to formula: "Stress score equals duration risk times weather multiplier times concentration."
- Point to Duration Risk: "Duration is 30% — the primary signal. SVB had a 730-day WAM against daily redemptions."
- Point to Weather: "Weather is the force multiplier. It doesn't hit the bank — it hits the LTV ratio and the data center corridor."
- Let the audience scan the rest.

**Key phrase:** "Duration risk is the cause. Weather is the catalyst."

**Advance:** After the key phrase.

---

## Slide 05 — Why Now (20s)

**Transition:** "Why hasn't anyone built this before?"

**On screen:** Timeline (Before 2025 → Jul 2025 → Today). Photo of Trump signing GENIUS Act. "The data didn't exist. Now it does." Stat pills: 6 stablecoins tracked, <2s re-score. Market chart $150B→$230B→$500B→$700B+ projected.

- "Before 2025 — PDFs with a 30-day lag. July 2025 — GENIUS Act signed into law. XBRL and OCC API feeds mandated."
- "For the first time, continuous reserve monitoring is possible. The data didn't exist. Now it does."
- Gesture at chart: "$230 billion today, $700 billion by 2030. Nobody is stress-testing it."

**Key phrase:** "The GENIUS Act created this market. The data didn't exist. Now it does."

**Advance:** After "now it does."

---

## Slide 06 — Positioning (20s)

**Transition:** "Where do we sit?"

**On screen:** Three layers with chevron arrows: Onchain (Dune, Nansen, Chainalysis) → Katabatic (animated logo reveal) → Downstream (MakerDAO, Aave, Risk Desks). Dark panel: "What Onchain Can't See" — Duration mismatch, Bank health signals, Data center ops risk, Weather tail-risk.

- "Layer 1 — onchain platforms see the flows. Layer 2 — us. The structural fragility that onchain can't see. Layer 3 — DAOs, DeFi protocols, risk desks, and AI agents consume our scores."
- "Onchain data platforms became the source of truth for onchain behavior. We're building the equivalent for offchain reserve risk."

**Key phrase:** "Onchain shows the flows. Katabatic shows what's about to break."

**Advance:** After the key phrase.

---

## Slide 07 — Live Demo (10s)

**Transition:** "Let me show you."

**On screen:** Full-screen video placeholder with play button. No title — the video speaks for itself.

- "Let's run through three scenarios — hurricane ops freeze, SVB backtest, rate hike sensitivity."
- Switch to live demo or play video.

**Advance:** Switch to demo.

---

### >>> LIVE DEMO (~60s) <<<

Run through the three scenarios on the dashboard. Keep it punchy:
1. **Hurricane** — drop it on the map, show stress spike + 72h latency
2. **SVB backtest** — show WAM chart, stress crossing critical 48h before depeg
3. **Rate hike** — 100bps slider, show which stablecoins are most exposed

---

## Slide 08 — Vision (20s)

**Transition:** "Where does this go?"

**On screen:** Dark background with atmospheric gradients. Three phase cards with connecting line: 01 Now (Stress Test Playground) → 02 Next (Oracle Grade Risk Feed, highlighted with glow) → 03 Endgame (Katabatic logo + "Stablecoin"). Bottom panel: Bloomberg quote left, WAM duration bars right (USDC 45d green vs SVB 730d purple).

- "Phase 1 — prove the engine. Phase 2 — oracle-grade risk feed, scores pinned to IPFS, pushed to Chainlink. Phase 3 — the Katabatic stablecoin, managed by the engine."
- Point to WAM bars: "45 days versus 730 days. That's the difference between safe and catastrophic."

**Key phrase:** "Bloomberg started with terminals. We start with stress simulations."

**Advance:** After the key phrase.

---

## Slide 09 — Go to Market (15s)

**Transition:** "Business model is simple."

**On screen:** Heading: "API first infrastructure. Not a consulting fee." Three tiers: Starter API (REST, 6 stablecoins, <2s, 1M calls/mo), Enterprise (highlighted — streaming, custom onboarding, SLA, warehouse), Institutional (FDIC mining, oracle feed, dedicated pipeline). Logo conveyor: MakerDAO, Aave, Compound, Chainlink, USDC, Tether, Uniswap, Ethereum.

- "API-first infrastructure. Starter tier for REST access. Enterprise for streaming, MCP for AI agents, and SLA. Institutional for FDIC mining and oracle integration."
- Gesture at logos: "Anyone holding stablecoin positions needs this data."

**Key phrase:** "API subscriptions, not consulting fees."

**Advance:** After the logos.

---

## Slide 10 — The Close (20s)

**On screen:** Dark background, hurricane rings. Heading: "Weather proves the engine." Glass card: 72h Redemption Latency | 88% Liquidity Coverage. "That's what DAO treasuries need. That's [Katabatic logo]."

- Pause. Let the numbers count up.
- "Under a Cat 4 plus 50 basis points — 72-hour latency, 88% coverage."
- "That's not a letter grade. That's an operational output a DAO treasury — or an AI agent — can act on."
- "That's Katabatic." *(logo animates on screen)*

**Key phrase:** "72-hour latency. 88% coverage. That's what DAOs need. That's Katabatic."

**Advance:** Stay on this slide for Q&A.

---

## Timing Summary

| Slide | Topic | Time |
|-------|-------|------|
| 01 | Hero | 10s |
| 02 | The Problem | 20s |
| 03 | The Engine | 20s |
| 04 | Six Dimensions | 20s |
| 05 | Why Now | 20s |
| 06 | Positioning | 20s |
| 07 | Live Demo Intro | 10s |
| — | **Live Demo** | **60s** |
| 08 | Vision | 20s |
| 09 | Go to Market | 15s |
| 10 | The Close | 20s |
| **Total** | | **~3m 55s** |
