"""Abstract base for 3-tier data resolution: Live API → SQLite Cache → Fixture Fallback."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

from app.services.cache import Cache


@dataclass
class DataResult:
    """Wraps resolved data with provenance metadata."""

    data: Any
    source: str  # "live" | "cache" | "fixture"
    stale: bool = False
    timestamp: str = ""

    def __post_init__(self) -> None:
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat() + "Z"


class DataProvider(ABC):
    """Base class for all data providers.

    Subclasses implement fetch_live() and load_fixture().
    The resolve() method handles the 3-tier fallback automatically.
    """

    def __init__(self, cache: Cache, ttl_seconds: int = 3600) -> None:
        self.cache = cache
        self.ttl_seconds = ttl_seconds

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Unique name for this provider, used as cache key prefix."""
        ...

    @abstractmethod
    async def fetch_live(self, source_id: str) -> Optional[dict]:
        """Fetch data from the live API. Returns None on failure."""
        ...

    @abstractmethod
    def load_fixture(self, source_id: str) -> Optional[dict]:
        """Load fallback fixture data. Returns None if no fixture exists."""
        ...

    async def resolve(self, source_id: str) -> DataResult:
        """Resolve data using 3-tier fallback: Live → Cache → Fixture."""
        cache_key = f"{self.provider_name}:{source_id}"

        # 1. Try live API
        try:
            live_data = await self.fetch_live(source_id)
            if live_data is not None:
                await self.cache.set(cache_key, live_data, ttl=self.ttl_seconds)
                return DataResult(data=live_data, source="live")
        except Exception:
            pass  # Fall through to cache

        # 2. Try cache (even if stale)
        cached = await self.cache.get(cache_key)
        if cached is not None:
            is_stale = await self.cache.is_expired(cache_key)
            return DataResult(data=cached, source="cache", stale=is_stale)

        # 3. Fall back to fixture
        fixture_data = self.load_fixture(source_id)
        if fixture_data is not None:
            return DataResult(data=fixture_data, source="fixture")

        raise ValueError(f"No data available for {self.provider_name}:{source_id}")
