"""Etherscan V2 API data provider for on-chain mint/burn cross-reference.

API: https://api.etherscan.io/v2/api?chainid=1
Auth: API key required (ETHERSCAN_API_KEY env var)
Note: Etherscan V1 is deprecated — this uses V2 exclusively.
"""

import os
from typing import Optional

import httpx

from app.services.cache import Cache
from app.services.data_provider import DataProvider

ETHERSCAN_V2_URL = "https://api.etherscan.io/v2/api"

# Stablecoin contract addresses (Ethereum mainnet)
TOKEN_CONTRACTS = {
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
}


class EtherscanProvider(DataProvider):
    """Fetches on-chain token data from Etherscan V2 API."""

    provider_name = "etherscan"

    def __init__(self, cache: Cache, ttl_seconds: int = 1800) -> None:
        super().__init__(cache, ttl_seconds)  # 30-min TTL
        self.api_key = os.getenv("ETHERSCAN_API_KEY", "")
        self.client = httpx.AsyncClient(timeout=15.0)

    @property
    def available(self) -> bool:
        """Check if Etherscan API key is configured."""
        return bool(self.api_key)

    def _is_available(self) -> bool:
        """Required for standardized API availability checks."""
        return self.available

    async def fetch_live(self, source_id: str) -> Optional[dict]:
        """Fetch token supply data. source_id = stablecoin symbol (e.g., 'USDC').

        Returns total supply and recent transfer summary for mint/burn estimation.
        """
        if not self.api_key:
            return None  # Cannot call without API key

        contract = TOKEN_CONTRACTS.get(source_id.upper())
        if not contract:
            return None

        # Get total supply
        supply_params = {
            "chainid": 1,
            "module": "stats",
            "action": "tokensupply",
            "contractaddress": contract,
            "apikey": self.api_key,
        }
        resp = await self.client.get(ETHERSCAN_V2_URL, params=supply_params)
        resp.raise_for_status()
        supply_data = resp.json()

        total_supply_raw = supply_data.get("result", "0")

        # Get decimals based on known tokens
        decimals = 6  # USDC and USDT both use 6 decimals
        total_supply = int(total_supply_raw) / (10**decimals) if total_supply_raw.isdigit() else 0

        return {
            "token": source_id.upper(),
            "contract": contract,
            "total_supply": total_supply,
            "chain_id": 1,
        }

    def load_fixture(self, source_id: str) -> Optional[dict]:
        """Load on-chain data from fixture files."""
        import json
        from pathlib import Path

        fixtures_dir = Path(__file__).resolve().parent.parent.parent.parent / "data" / "fixtures"
        fixture_map = {
            "USDC": "usdc_baseline.json",
            "USDT": "usdt_baseline.json",
        }
        filename = fixture_map.get(source_id.upper())
        if not filename:
            return None

        fixture_path = fixtures_dir / filename
        if not fixture_path.exists():
            return None

        with open(fixture_path) as f:
            data = json.load(f)

        cross_check = data.get("onchain_cross_check", {})
        return {
            "token": source_id.upper(),
            "contract": TOKEN_CONTRACTS.get(source_id.upper()),
            "burn_7d_usd": cross_check.get("burn_7d_usd"),
            "custodian_cash_delta": cross_check.get("custodian_cash_delta"),
            "divergence_pct": cross_check.get("divergence_pct"),
        }
