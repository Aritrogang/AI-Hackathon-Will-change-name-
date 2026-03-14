"""Stablecoin registry — single source of truth for tracked assets and their counterparty mappings."""

import json
from pathlib import Path
from typing import Optional

from app.models.reserve import ReserveData

# Fixture resolution: try repo-root layout first (local dev), then container layout (Docker)
_REPO_FIXTURES = Path(__file__).resolve().parent.parent.parent.parent / "data" / "fixtures"
_LOCAL_FIXTURES = Path(__file__).resolve().parent.parent.parent / "data" / "fixtures"
FIXTURES_DIR = _REPO_FIXTURES if _REPO_FIXTURES.exists() else _LOCAL_FIXTURES

# Data center corridor definitions with approximate lat/lng centers
DATA_CENTER_CORRIDORS = {
    "us-east-1": {"name": "Northern Virginia", "lat": 39.0438, "lng": -77.4874, "radius_km": 80},
    "us-east-2": {"name": "Ohio", "lat": 40.4173, "lng": -82.9071, "radius_km": 80},
    "us-west-2": {"name": "Oregon", "lat": 45.5152, "lng": -122.6784, "radius_km": 80},
    "us-central": {"name": "Chicago", "lat": 41.8781, "lng": -87.6298, "radius_km": 60},
    "eu-west-1": {"name": "Ireland", "lat": 53.3498, "lng": -6.2603, "radius_km": 100},
}

# Registry of tracked stablecoins
STABLECOIN_REGISTRY = {
    "USDC": {
        "symbol": "USDC",
        "issuer": "Circle",
        "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "fixture_file": "usdc_baseline.json",
        "counterparty_fdic_certs": [7534, 823, 628],  # BNY Mellon, State Street, JPMorgan
        "data_center_corridors": ["us-east-1", "us-central"],
    },
    "USDT": {
        "symbol": "USDT",
        "issuer": "Tether",
        "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "fixture_file": "usdt_baseline.json",
        "counterparty_fdic_certs": [],  # Tether counterparties lack FDIC certs
        "data_center_corridors": ["us-east-1", "eu-west-1"],
    },
    "DAI": {
        "symbol": "DAI",
        "issuer": "MakerDAO",
        "contract_address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "fixture_file": "dai_baseline.json",
        "counterparty_fdic_certs": [16150],  # Huntingdon Valley Bank
        "data_center_corridors": ["us-east-1", "eu-west-1"],
    },
    "FRAX": {
        "symbol": "FRAX",
        "issuer": "Frax Finance",
        "contract_address": "0x853d955aCEf822Db058eb8505911ED77F175b99e",
        "fixture_file": "frax_baseline.json",
        "counterparty_fdic_certs": [],
        "data_center_corridors": ["us-central"],
    },
    "PYUSD": {
        "symbol": "PYUSD",
        "issuer": "Paxos (PayPal)",
        "contract_address": "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
        "fixture_file": "pyusd_baseline.json",
        "counterparty_fdic_certs": [16571, 7534, 823, 34919],  # BMO Harris, BNY Mellon, State Street, Customers Bank
        "data_center_corridors": ["us-central", "us-east-1", "us-east-2"],
    },
    "TUSD": {
        "symbol": "TUSD",
        "issuer": "TrueUSD",
        "contract_address": "0x0000000000085d4780B73119b644AE5ecd22b376",
        "fixture_file": "tusd_baseline.json",
        "counterparty_fdic_certs": [27653, 57053],  # Silvergate, Signature Bank
        "data_center_corridors": ["us-west-2", "us-east-1"],
    },
}


def get_all_symbols() -> list[str]:
    """Return all tracked stablecoin symbols."""
    return list(STABLECOIN_REGISTRY.keys())


def get_config(symbol: str) -> Optional[dict]:
    """Return registry config for a stablecoin symbol."""
    return STABLECOIN_REGISTRY.get(symbol.upper())


def get_reserve_data(symbol: str) -> ReserveData:
    """Load reserve data from fixture file for a given stablecoin."""
    config = STABLECOIN_REGISTRY.get(symbol.upper())
    if not config:
        raise ValueError(f"Unknown stablecoin: {symbol}")

    fixture_path = FIXTURES_DIR / config["fixture_file"]
    if not fixture_path.exists():
        raise FileNotFoundError(f"Fixture not found: {fixture_path}")

    with open(fixture_path) as f:
        data = json.load(f)

    return ReserveData(**data)


def get_fdic_certs_for(symbol: str) -> list[int]:
    """Return FDIC cert numbers for a stablecoin's counterparties."""
    config = STABLECOIN_REGISTRY.get(symbol.upper())
    if not config:
        return []
    return config["counterparty_fdic_certs"]


def get_all_states() -> set[str]:
    """Return all unique US states where counterparties are located."""
    states = set()
    for symbol in get_all_symbols():
        try:
            reserve = get_reserve_data(symbol)
            for cp in reserve.counterparties:
                if cp.state and len(cp.state) == 2:
                    states.add(cp.state)
        except (ValueError, FileNotFoundError):
            continue
    return states
