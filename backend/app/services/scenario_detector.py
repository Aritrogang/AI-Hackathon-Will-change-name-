"""Scenario detection — aggregates live data sources into ranked risk scenarios."""

from typing import Optional
from app.services.weather_provider import WeatherProvider
from app.services.cache import Cache
from app.services.knowledge_graph import KnowledgeGraphService


# State code → approximate lat/lng for storm projection
STATE_COORDS = {
    "FL": (27.8, -82.6), "TX": (29.8, -95.4), "LA": (30.0, -90.1),
    "NC": (35.2, -80.8), "SC": (33.8, -81.2), "GA": (33.7, -84.4),
    "AL": (32.4, -86.3), "MS": (32.3, -90.2), "VA": (38.9, -77.4),
    "NY": (40.7, -74.0), "NJ": (40.2, -74.8), "MA": (42.4, -71.1),
    "CT": (41.6, -72.7), "PA": (40.0, -75.5),
}

# NOAA severity → hurricane category mapping
SEVERITY_TO_CATEGORY = {
    "Extreme": 4,
    "Severe": 3,
    "Moderate": 2,
    "Minor": 1,
}


class ScenarioDetector:
    def __init__(self, weather_provider: WeatherProvider, graph_service: KnowledgeGraphService, cache: Cache):
        self.weather = weather_provider
        self.graph = graph_service
        self.cache = cache

    async def detect_scenarios(self) -> list[dict]:
        scenarios = []

        # 1. Weather scenarios from live NOAA alerts
        weather_scenarios = await self._detect_weather_scenarios()
        scenarios.extend(weather_scenarios)

        # 2. Rate hike scenarios from macro signals
        rate_scenarios = self._detect_rate_scenarios()
        scenarios.extend(rate_scenarios)

        # 3. Bank stress scenarios from reserve data
        bank_scenarios = self._detect_bank_stress_scenarios()
        scenarios.extend(bank_scenarios)

        # Sort by severity (highest first)
        scenarios.sort(key=lambda s: s["severity"], reverse=True)

        # Project impact for each scenario
        from main import scoring_engine
        if scoring_engine:
            for scenario in scenarios:
                await self._project_impact(scenario, scoring_engine)

        return scenarios

    async def _detect_weather_scenarios(self) -> list[dict]:
        scenarios = []
        # Get states where counterparties exist from the knowledge graph
        states = set()
        for node_id, data in self.graph.graph.nodes(data=True):
            if data.get("type") == "state":
                states.add(node_id.replace("state:", ""))

        if not states:
            states = {"FL", "NY", "VA", "CA", "MA"}  # fallback

        seen_events = set()
        for state in states:
            try:
                result = await self.weather.fetch(f"alerts:{state}")
                if not result or not result.data:
                    continue
                alerts = result.data.get("alerts", [])
                for alert in alerts:
                    severity = alert.get("severity", "Minor")
                    event = alert.get("event", "")
                    headline = alert.get("headline", "")

                    # Only include significant weather events
                    if severity not in ("Extreme", "Severe"):
                        continue

                    # Deduplicate by event type + state
                    key = f"{event}:{state}"
                    if key in seen_events:
                        continue
                    seen_events.add(key)

                    coords = STATE_COORDS.get(state, (30.0, -85.0))
                    category = SEVERITY_TO_CATEGORY.get(severity, 2)

                    scenarios.append({
                        "id": f"weather-{state}-{event.lower().replace(' ', '-')[:20]}",
                        "type": "weather",
                        "title": f"{event} — {state}",
                        "description": headline or f"{severity} {event} alert affecting {state}. Could impact custodian banks and data center corridors in the region.",
                        "source": "NOAA",
                        "severity": min(5, category + 1),
                        "projection": None,
                        "affected_stablecoins": [],
                        "_params": {
                            "hurricane_lat": coords[0],
                            "hurricane_lng": coords[1],
                            "hurricane_category": category,
                        },
                    })
            except Exception:
                continue

        return scenarios

    def _detect_rate_scenarios(self) -> list[dict]:
        """Generate rate scenarios from macro signals.
        For hackathon: hardcode plausible scenarios based on current macro environment.
        In production: pull from Fed futures, CME FedWatch, Treasury yields."""
        return [
            {
                "id": "rate-hike-50bps",
                "type": "rate",
                "title": "Fed Rate Hike — +50bps",
                "description": "Market signals suggest a 50 basis point rate increase at the next FOMC meeting. Long-duration reserve portfolios face mark-to-market pressure.",
                "source": "macro",
                "severity": 3,
                "projection": None,
                "affected_stablecoins": [],
                "_params": {"rate_hike_bps": 50},
            },
            {
                "id": "rate-hike-100bps",
                "type": "rate",
                "title": "Emergency Rate Hike — +100bps",
                "description": "Inflation surprise triggers emergency inter-meeting rate action. SVB-style duration mismatch risk elevated for all stablecoin reserves with WAM > 90 days.",
                "source": "macro",
                "severity": 4,
                "projection": None,
                "affected_stablecoins": [],
                "_params": {"rate_hike_bps": 100},
            },
        ]

    def _detect_bank_stress_scenarios(self) -> list[dict]:
        """Detect bank stress from reserve data — high LTV ratios signal fragility."""
        scenarios = []
        from app.services.registry import get_all_symbols, get_reserve_data

        seen_banks = set()
        for symbol in get_all_symbols():
            try:
                reserve = get_reserve_data(symbol)
            except (ValueError, FileNotFoundError):
                continue

            for cp in reserve.counterparties:
                bank = cp.bank_name
                ltv = cp.fdic_ltv_ratio
                pct = cp.percentage

                if not bank or bank in seen_banks or ltv is None:
                    continue

                # Flag banks with high LTV and significant reserve exposure
                if ltv > 0.65 and pct > 5:
                    seen_banks.add(bank)
                    scenarios.append({
                        "id": f"bank-{bank.lower().replace(' ', '-')[:20]}",
                        "type": "bank",
                        "title": f"Counterparty Stress — {bank}",
                        "description": f"{bank} shows elevated leverage (LTV ratio: {ltv:.2f}) with {pct:.1f}% of reserves exposed. FDIC Call Report signals warrant monitoring.",
                        "source": "FDIC",
                        "severity": 4 if ltv > 0.70 else 3,
                        "projection": None,
                        "affected_stablecoins": [],
                        "_params": {"bank_failure": bank},
                    })

        return scenarios

    async def _project_impact(self, scenario: dict, scoring_engine) -> None:
        """Run projection for each tracked stablecoin and attach results."""
        from app.services.registry import get_all_symbols

        params = scenario.get("_params", {})
        best_projection = None
        max_delta = -1
        affected = []

        for symbol in get_all_symbols():
            try:
                result = await scoring_engine.project_scenario(
                    symbol=symbol,
                    rate_hike_bps=params.get("rate_hike_bps"),
                    hurricane_lat=params.get("hurricane_lat"),
                    hurricane_lng=params.get("hurricane_lng"),
                    hurricane_category=params.get("hurricane_category"),
                    bank_failure=params.get("bank_failure"),
                )
                if result and result.get("delta", 0) > 0:
                    affected.append(symbol)
                    if result["delta"] > max_delta:
                        max_delta = result["delta"]
                        best_projection = result
            except Exception:
                continue

        scenario["projection"] = best_projection
        scenario["affected_stablecoins"] = affected
        # Remove internal params
        scenario.pop("_params", None)
