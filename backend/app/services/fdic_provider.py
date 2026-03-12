"""FDIC BankFind API data provider — no authentication required.

API: https://api.fdic.gov/financials
Fields available: ASSET, DEP, EQ, SC, NIMY, ROA
WAM and LTV are NOT directly available — derived as proxies:
  - WAM proxy: (SC / ASSET) × avg_maturity_estimate
  - LTV proxy: (ASSET - EQ) / ASSET  (leverage ratio)
"""

import json
from pathlib import Path
from typing import Optional

import httpx

from app.services.cache import Cache
from app.services.data_provider import DataProvider

FDIC_BASE_URL = "https://api.fdic.gov/financials"
DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data" / "fixtures"


class FDICProvider(DataProvider):
    """Fetches bank financial data from the FDIC BankFind API."""

    provider_name = "fdic"

    def __init__(self, cache: Cache, ttl_seconds: int = 86400) -> None:
        super().__init__(cache, ttl_seconds)
        self.client = httpx.AsyncClient(timeout=15.0)

    async def fetch_live(self, source_id: str) -> Optional[dict]:
        """Fetch bank financials by FDIC cert number.

        Args:
            source_id: FDIC certificate number as string (e.g., "628")
        """
        params = {
            "filters": f"CERT:{source_id}",
            "fields": "CERT,REPDTE,ASSET,DEP,EQ,SC,NIMY,ROA",
            "sort_by": "REPDTE",
            "sort_order": "DESC",
            "limit": 1,
        }
        resp = await self.client.get(FDIC_BASE_URL, params=params)
        resp.raise_for_status()

        data = resp.json()
        if not data.get("data"):
            return None

        record = data["data"][0]["data"]
        cert = int(source_id)
        asset = float(record.get("ASSET", 0) or 0)
        equity = float(record.get("EQ", 0) or 0)
        securities = float(record.get("SC", 0) or 0)

        # Derive proxies
        ltv_proxy = (asset - equity) / asset if asset > 0 else None
        # WAM proxy: securities-heavy banks have longer duration
        wam_proxy = (securities / asset * 180) if asset > 0 else None  # rough estimate in days

        return {
            "fdic_cert": cert,
            "report_date": record.get("REPDTE"),
            "total_assets": asset,
            "total_deposits": float(record.get("DEP", 0) or 0),
            "equity": equity,
            "securities": securities,
            "net_interest_margin": float(record.get("NIMY", 0) or 0),
            "roa": float(record.get("ROA", 0) or 0),
            "ltv_proxy": round(ltv_proxy, 4) if ltv_proxy else None,
            "wam_proxy_days": round(wam_proxy, 1) if wam_proxy else None,
        }

    def load_fixture(self, source_id: str) -> Optional[dict]:
        """Load bank data from fixture files by scanning counterparties for matching fdic_cert."""
        for fixture_file in DATA_DIR.glob("*.json"):
            try:
                with open(fixture_file) as f:
                    fixture = json.load(f)
                for cp in fixture.get("counterparties", []):
                    if str(cp.get("fdic_cert")) == source_id:
                        return {
                            "fdic_cert": int(source_id),
                            "report_date": fixture.get("report_date"),
                            "total_assets": None,
                            "total_deposits": None,
                            "equity": None,
                            "securities": None,
                            "net_interest_margin": None,
                            "roa": None,
                            "ltv_proxy": cp.get("fdic_ltv_ratio"),
                            "wam_proxy_days": cp.get("maturity_days"),
                        }
            except (json.JSONDecodeError, KeyError):
                continue
        return None
