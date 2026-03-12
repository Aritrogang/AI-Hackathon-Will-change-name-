"""One-shot script to pre-populate the SQLite cache from live APIs.

Run before the hackathon demo to ensure cache is warm:
    cd backend && python -m scripts.warm_cache
"""

import asyncio
import json
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.cache import Cache
from app.services.fdic_provider import FDICProvider
from app.services.weather_provider import WeatherProvider
from app.services.etherscan_provider import EtherscanProvider

# Known FDIC certs from fixtures
FDIC_CERTS = ["7534", "823", "628", "24735"]  # BNY Mellon, State Street, JPMorgan, SVB

# Stablecoins to fetch on-chain data for
STABLECOINS = ["USDC", "USDT"]

# States to fetch weather alerts for
WEATHER_STATES = ["NY", "MA", "CA", "FL", "VA"]


async def warm() -> None:
    cache = Cache()
    await cache.initialize()

    fdic = FDICProvider(cache)
    weather = WeatherProvider(cache)
    etherscan = EtherscanProvider(cache)

    print("Warming FDIC cache...")
    for cert in FDIC_CERTS:
        try:
            result = await fdic.resolve(cert)
            print(f"  FDIC cert {cert}: {result.source}")
        except Exception as e:
            print(f"  FDIC cert {cert}: FAILED ({e})")

    print("\nWarming weather cache...")
    for state in WEATHER_STATES:
        try:
            result = await weather.resolve(f"alerts:{state}")
            alert_count = result.data.get("alert_count", 0) if result.data else 0
            print(f"  Weather {state}: {result.source} ({alert_count} alerts)")
        except Exception as e:
            print(f"  Weather {state}: FAILED ({e})")

    print("\nWarming Etherscan cache...")
    for token in STABLECOINS:
        try:
            result = await etherscan.resolve(token)
            print(f"  {token}: {result.source}")
        except Exception as e:
            print(f"  {token}: FAILED ({e})")

    # Clean up expired entries
    removed = await cache.clear_expired()
    print(f"\nCleaned {removed} expired cache entries.")

    await cache.close()
    print("Cache warming complete.")


if __name__ == "__main__":
    asyncio.run(warm())
