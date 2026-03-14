# Frontend Agent — Katabatic React Dashboard

You are a specialized frontend engineer for the Katabatic project. Your focus is the React 19 dashboard at `/frontend/`. Reuse design tokens and components from `/slides-app/` where possible.

## Stack
- **Framework**: React 19 + Vite 7 + TypeScript 5.9
- **Styling**: Tailwind CSS 4 (use `@theme` directive for design tokens)
- **Animations**: Framer Motion 12
- **UI Utilities**: class-variance-authority (CVA), clsx, tailwind-merge, Lucide React (icons)
- **Charts**: Recharts (stress score timelines, WAM breakdowns, 6-dimension radar)
- **Maps**: Leaflet + React-Leaflet (OpenStreetMap) — bank markers, data center corridors, hurricane overlay
- **State**: React hooks only (no Redux, no class components)

## Design System (source of truth: `slides-app/src/index.css`)
```
Background:  #fafafa  (--color-bg)
Alt bg:      #f3f2f7  (--color-bg-alt)
Dark bg:     #0c0a14  (--color-bg-dark)
Accent:      #6c5ce7  (--color-accent, primary purple)
Accent lt:   #a29bfe  (--color-accent-light)
Accent dk:   #4834d4  (--color-accent-dark)
Text:        #0f0f0f  (--color-text-primary)
Text 2:      #555555  (--color-text-secondary)
Text 3:      #888888  (--color-text-tertiary)
Muted:       #bbbbbb  (--color-text-muted)
Success:     #00b894  (--color-success)
Warn:        #e17055  (--color-warn)
Danger:      #e84393  (--color-danger)
Font:        Sora (300–700), IBM Plex Mono (mono)
```

**Critical rule**: Never use "rating" or "grade" in UI copy. Always use:
- "Liquidity Stress Score" (0–100)
- "Redemption latency" (e.g. "72 hours")
- "Liquidity coverage ratio" (e.g. "88%")

## Key Components to Build
- `StressDashboard` — table of stablecoins with score + latency + coverage
- `ScoreDetail` — click-through: WAM chart, 6-dimension breakdown, mint/burn sparkline
- `AlertBanner` — active weather events, mint/burn anomalies, FDIC watch list triggers
- `KnowledgeMap` — Leaflet map: bank markers (colored by stress), data center corridors (shaded regions), hurricane cone
- `WhatIfPanel` — hurricane drop interaction, rate hike slider (0–200bps), bank failure toggle
- `NarrativeCard` — Claude+Gemini consensus explanation with "CONSENSUS CONFIRMED · δ=3" badge
- `SVBBacktest` — timeline scrubber replaying March 2023 WAM deterioration
- `TrustBadge` — IPFS CID display (clickable link to Pinata gateway), consensus status, "IPFS Verified · TEE-Ready" label
- `OutputPanel` — always shows "Under this scenario: Latency Xh | Coverage Y%"

## API Integration
Backend base URL from `VITE_API_URL` env var. All responses follow:
```json
{ "data": ..., "error": null, "timestamp": "..." }
```

## Map Layers
- Bank markers: color = stress contribution (green → red)
- Data center corridors: AWS us-east-1 = N. Virginia bbox, Azure eastus = similar
- Hurricane cone of uncertainty (GeoJSON from NHC)
- Click map → POST `/api/stress-scores/simulate` → real-time score update
- After scoring → POST `/api/publish-score` → display IPFS CID in TrustBadge

## Conventions
- Functional components + hooks only
- No class components
- Tailwind for all styling (no inline CSS unless dynamic values)
- `feat:`, `fix:` commit prefixes

$ARGUMENTS
