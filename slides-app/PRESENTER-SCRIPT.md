# Katabatic — Presenter Script

> 9 slides, ~3 minutes talking + ~1 minute live demo. Total: ~4 minutes. Each slide has talking points, one key phrase to nail, and an advance cue. Keep it tight — let the visuals do the work.

---

## Slide 01 — Hero (15s)

**On screen:** Hurricane rings, Katabatic logo (animated letter reveal), subtitle "Liquidity stress testing for stablecoin reserves", hackathon badge, team names (Adi, Aritro, Connor, Krish, Suchit, Vikram).

- "Hey everyone — we're Katabatic. We built the risk data layer for stablecoin reserves — an API that continuously scores the structural fragility of reserve portfolios so DAOs, DeFi protocols, and AI agents can act on it."

**Key phrase:** "The risk data layer for stablecoin reserves."

**Advance:** Immediately after.

---

## Slide 02 — The Problem (20s)

**Transition:** "Here's why this matters."

**On screen:** SVB headquarters photo with $3.3B overlay. Two stat blocks: $300B+ unstressed reserve assets, 30 days between attestations. Depeg sparkline $1.00→$0.87. "Katabatic flags critical 48h prior."

- Point to SVB photo: "SVB held $3.3 billion in USDC reserves. The attestation two weeks before said fine."
- Point to sparkline: "Thirteen cents in 48 hours. USDC hit 87 cents."
- "300 billion dollars in stablecoin reserves, and nobody is stress-testing them. This wasn't credit risk — it was duration mismatch. The bonds were too long, the redemptions were instant, and no one was watching."

**Key phrase:** "The attestation said fine. SVB failed. That's duration risk — nobody is testing for it."

**Advance:** After "nobody is testing for it."

---

## Slide 03 — The Engine (25s)

**Transition:** "So we built an engine that does."

**On screen:** Input pills (PDF, FDIC, Onchain, NOAA). Six-step pipeline circles. Output: 68/100 stress, 72h latency, 88% coverage. Consensus badge.

- Point to pills: "We pull from four live data sources — GENIUS Act attestation reports, FDIC Call Reports, onchain mint and burn flows, and NOAA weather forecasts."
- Gesture across pipeline: "Six-step pipeline: resolve entities, build a knowledge graph, compute weighted average maturity, apply stress multipliers, output a liquidity coverage ratio, and pin the result to IPFS for verification."
- Point to output: "The output is a Liquidity Stress Score — not a letter grade, but operational data. Stress score 68, projected 72-hour redemption latency, 88% liquidity coverage. Two LLMs — Claude and Gemini — score independently, and both agree."
- "This score is delivered three ways: a REST API for systems to integrate, an MCP server for AI trading agents to query, and a monitoring dashboard for human risk teams."

**Key phrase:** "From opaque PDF to a realtime stress score — delivered via API, MCP, and dashboard."

**Advance:** After "dashboard."

---

## Slide 04 — Six Dimensions (20s)

**Transition:** "Six dimensions drive the score."

**On screen:** Formula bar. Six rows with proportional color-field bars: Duration Risk (WAM) 30% [Primary], Reserve Transparency 20%, Geographic + Ops Concentration 15%, Weather Tail Risk 15% [Demo Focus], Counterparty Health 15%, Peg Stability 5%.

- Point to formula: "Stress score equals duration risk times weather multiplier times concentration."
- Point to Duration Risk: "Duration is 30% — the primary signal. SVB had a 2,040-day weighted average maturity — 5.6 years of bond duration against daily redemptions. That's the mismatch that kills you."
- Point to Weather: "Weather is the force multiplier. A hurricane doesn't flood the bank — it deteriorates the mortgage LTV ratios in FDIC Call Reports and threatens the data center corridor that processes redemptions."

**Key phrase:** "Duration risk is the cause. Weather is the catalyst."

**Advance:** After the key phrase.

---

## Slide 05 — Why Now (20s)

**Transition:** "Why hasn't anyone built this before?"

**On screen:** Timeline (Before 2025 → Jul 2025 → Today). Photo of Trump signing GENIUS Act. "The data didn't exist. Now it does." Stat pills: 6 stablecoins tracked, <2s re-score. Market chart $150B→$125B→$310B→$500B→$700B+ projected.

- "Before 2025 — reserve data was locked in PDFs with a 30-day lag. No programmatic access. July 2025 — the GENIUS Act was signed. For the first time, stablecoin issuers must publish reserve data via XBRL and OCC API feeds."
- "The data to do continuous reserve stress testing didn't exist until last year. Now it does."
- Gesture at chart: "$310 billion today. Projected $700 billion by 2030. And nobody is stress-testing it."

**Key phrase:** "The GENIUS Act created this market. The data didn't exist. Now it does."

**Advance:** After "now it does."

---

## Slide 06 — Positioning (20s)

**Transition:** "Where do we sit in the stack?"

**On screen:** Three layers with chevron arrows: Onchain (Dune, Nansen, Chainalysis) → Katabatic (animated logo reveal) → Downstream (MakerDAO, Aave, Risk Desks). Dark panel: "What Onchain Can't See" — Duration mismatch, Bank health signals, Data center ops risk, Weather tail-risk.

- "Onchain data platforms — Dune, Nansen, Chainalysis — they see the flows. Mint, burn, wallet balances. But they can't see what's happening off-chain: the bond maturities, the bank health, the data center that processes the redemptions."
- "Katabatic sits in the middle. We ingest the off-chain data that onchain platforms can't see, score it, and deliver it downstream — to DAO treasuries, DeFi protocols, risk desks, and AI agents."

**Key phrase:** "Onchain shows the flows. Katabatic shows what's about to break."

**Advance:** After the key phrase.

---

## Slide 07 — Live Demo (10s + ~60s demo)

**Transition:** "Let me show you what this looks like in practice."

**On screen:** Full-screen video placeholder with play button.

- "This is the monitoring dashboard — the visual layer on top of the API. Everything you see here is also available programmatically via REST and MCP. Let me walk you through it."
- Switch to live demo or play video.

**Advance:** Switch to demo.

---

### >>> LIVE DEMO (~60s) <<<

Frame each step around the **product**, not the UI:
1. **Live scores** — "These are live stress scores — pulling right now from NOAA, FDIC, and Etherscan. Each stablecoin gets a composite score across six dimensions."
2. **Detail view** — Click USDC: "Here's the breakdown — duration risk, reserve transparency, geographic concentration, weather exposure, counterparty health, peg stability. Two LLMs scored independently and both agreed — consensus confirmed."
3. **Risk modeling** — Project a scenario: "Now let's model forward — say a Cat 3 hurricane tracks toward Northern Virginia, where AWS us-east-1 processes USDC redemptions. Watch the stress score jump from 42 to 68 and the projected redemption latency go from 4 hours to 72."
4. **Reserve map** — "The map shows the physical exposure — bank markers colored by health, data center corridor overlays, and active weather alerts. This is the data that onchain can't see."

---

## Slide 08 — Go to Market (20s)

**Transition:** "How do we sell this?"

**On screen:** Heading: "API first infrastructure. Not a consulting fee." Three tiers: Starter API (REST, MCP for AI agents, 6 stablecoins, <2s, webhook alerts), Enterprise (highlighted — streaming, IPFS verified, multi-model consensus, SLA, warehouse), Institutional (FDIC mining, oracle feed, GENIUS Act compliance, dedicated pipeline). Logo conveyor: MakerDAO, Aave, Compound, Chainlink, USDC, Tether, Uniswap, Ethereum.

- "This is API-first infrastructure — not a dashboard product, not a consulting engagement. Three tiers."
- "Starter gets you REST API access and MCP for AI agents. Enterprise adds real-time streaming, IPFS-verified scores, and SLA. Institutional gets FDIC Call Report mining and Chainlink oracle integration."
- Gesture at logos: "Anyone holding stablecoin positions — MakerDAO, Aave, Compound — needs to know if those reserves are structurally sound. That's what we sell."

**Key phrase:** "API subscriptions, not consulting fees. The score is the product."

**Advance:** After the logos.

---

## Slide 09 — The Close (20s)

**On screen:** Dark background, hurricane rings. Heading: "Weather proves the engine." Glass card: 72h Redemption Latency | 88% Liquidity Coverage. "That's what DAO treasuries need. That's [Katabatic logo]."

- Pause. Let the numbers count up.
- "Cat 4 hurricane plus 50 basis points — 72-hour redemption latency, 88% liquidity coverage."
- "That's not a letter grade. That's an operational output that a DAO governance contract can gate on, a DeFi protocol can rebalance against, and an AI trading agent can query before executing a position."
- "That's Katabatic — the system of record for stablecoin reserve risk." *(logo animates on screen)*

**Key phrase:** "The system of record for stablecoin reserve risk. That's Katabatic."

**Advance:** Stay on this slide for Q&A.

---

## Timing Summary

| Slide | Topic | Time |
|-------|-------|------|
| 01 | Hero | 15s |
| 02 | The Problem | 20s |
| 03 | The Engine | 25s |
| 04 | Six Dimensions | 20s |
| 05 | Why Now | 20s |
| 06 | Positioning | 20s |
| 07 | Live Demo Intro | 10s |
| — | **Live Demo** | **60s** |
| 08 | Go to Market | 20s |
| 09 | The Close | 20s |
| **Total** | | **~3m 50s** |
