"""Nominatim geocoding provider — no API key required.

API: https://nominatim.openstreetmap.org/search
Auth: User-Agent header only
Rate limit: 1 request per second (Nominatim ToS)
"""

import asyncio
from typing import Optional

import httpx

from app.services.cache import Cache
from app.services.data_provider import DataProvider

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "Helicity/1.0 (stablecoin-risk-engine; contact@helicity.dev)"}


class NominatimProvider(DataProvider):
    """Geocodes bank/institution names to lat/lng coordinates."""

    provider_name = "nominatim"

    def __init__(self, cache: Cache, ttl_seconds: int = 604800) -> None:
        super().__init__(cache, ttl_seconds)  # 7-day TTL — locations don't change
        self.client = httpx.AsyncClient(timeout=10.0, headers=HEADERS)
        self._last_request_time = 0.0

    async def _rate_limit(self) -> None:
        """Enforce 1 request per second per Nominatim ToS."""
        now = asyncio.get_event_loop().time()
        elapsed = now - self._last_request_time
        if elapsed < 1.0:
            await asyncio.sleep(1.0 - elapsed)
        self._last_request_time = asyncio.get_event_loop().time()

    async def fetch_live(self, source_id: str) -> Optional[dict]:
        """Geocode a location. source_id format: '{name},{city},{state}'.

        Example: source_id='BNY Mellon,New York,NY'
        """
        await self._rate_limit()

        parts = source_id.split(",")
        query = ", ".join(parts)

        params = {
            "q": query,
            "format": "json",
            "limit": 1,
        }
        resp = await self.client.get(NOMINATIM_URL, params=params)
        resp.raise_for_status()

        results = resp.json()
        if not results:
            return None

        result = results[0]
        return {
            "query": source_id,
            "lat": float(result["lat"]),
            "lng": float(result["lon"]),
            "display_name": result.get("display_name", ""),
        }

    def load_fixture(self, source_id: str) -> Optional[dict]:
        """No fixture fallback for geocoding — returns None."""
        return None
