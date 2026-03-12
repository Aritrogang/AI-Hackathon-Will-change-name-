"""Weather data provider — NOAA NWS + Open-Meteo. No API keys required.

NOAA NWS: https://api.weather.gov/alerts/active — User-Agent header only
Open-Meteo: https://archive-api.open-meteo.com/v1/archive — fully public, 10k req/day
"""

from typing import Optional

import httpx

from app.services.cache import Cache
from app.services.data_provider import DataProvider

NOAA_ALERTS_URL = "https://api.weather.gov/alerts/active"
OPENMETEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

HEADERS = {"User-Agent": "Katabatic/1.0 (stablecoin-risk-engine; contact@katabatic.dev)"}


class WeatherProvider(DataProvider):
    """Fetches active weather alerts from NOAA NWS and historical data from Open-Meteo."""

    provider_name = "weather"

    def __init__(self, cache: Cache, ttl_seconds: int = 900) -> None:
        super().__init__(cache, ttl_seconds)  # 15-min TTL for weather
        self.client = httpx.AsyncClient(timeout=15.0, headers=HEADERS)

    async def fetch_live(self, source_id: str) -> Optional[dict]:
        """Fetch weather data. source_id format: 'alerts:{state}' or 'history:{lat},{lng},{start},{end}'.

        Examples:
            source_id='alerts:FL' → active NOAA alerts for Florida
            source_id='history:27.8,-82.6,2022-09-24,2022-09-30' → Open-Meteo historical
        """
        kind, _, params = source_id.partition(":")

        if kind == "alerts":
            return await self._fetch_alerts(params if params else None)
        elif kind == "history":
            parts = params.split(",")
            if len(parts) == 4:
                return await self._fetch_historical(
                    lat=float(parts[0]),
                    lng=float(parts[1]),
                    start=parts[2],
                    end=parts[3],
                )
        return None

    async def _fetch_alerts(self, state: Optional[str] = None) -> Optional[dict]:
        """Fetch active NOAA weather alerts, optionally filtered by state."""
        params = {}
        if state:
            params["area"] = state
        resp = await self.client.get(NOAA_ALERTS_URL, params=params)
        resp.raise_for_status()

        data = resp.json()
        features = data.get("features", [])

        alerts = []
        for f in features[:50]:  # cap at 50 alerts
            props = f.get("properties", {})
            alerts.append({
                "event": props.get("event"),
                "severity": props.get("severity"),
                "headline": props.get("headline"),
                "area": props.get("areaDesc"),
                "onset": props.get("onset"),
                "expires": props.get("expires"),
            })

        return {"state": state, "alert_count": len(alerts), "alerts": alerts}

    async def _fetch_historical(
        self, lat: float, lng: float, start: str, end: str
    ) -> Optional[dict]:
        """Fetch historical weather from Open-Meteo archive API."""
        params = {
            "latitude": lat,
            "longitude": lng,
            "start_date": start,
            "end_date": end,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
            "timezone": "auto",
        }
        resp = await self.client.get(OPENMETEO_ARCHIVE_URL, params=params)
        resp.raise_for_status()

        data = resp.json()
        daily = data.get("daily", {})
        return {
            "latitude": lat,
            "longitude": lng,
            "start_date": start,
            "end_date": end,
            "daily": daily,
        }

    def load_fixture(self, source_id: str) -> Optional[dict]:
        """No fixture fallback for weather — returns None to signal no data."""
        return None
