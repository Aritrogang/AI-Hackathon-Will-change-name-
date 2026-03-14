"""Pydantic models for reserve data and stablecoin counterparties."""

from pydantic import BaseModel, Field
from typing import Optional


class Counterparty(BaseModel):
    bank_name: str
    city: str
    state: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    percentage: float = Field(ge=0, le=100, description="% of reserves held")
    asset_class: str = Field(description="t_bills, repo, mmf, deposits, commercial_paper")
    maturity_days: int = Field(ge=0, description="Maturity in days for this tranche")
    fdic_cert: Optional[int] = None
    fdic_ltv_ratio: Optional[float] = None
    liquidity_coverage: Optional[float] = None
    data_center_corridor: Optional[str] = None


class OnchainCrossCheck(BaseModel):
    burn_7d_usd: Optional[float] = None
    custodian_cash_delta: Optional[float] = None
    divergence_pct: Optional[float] = None


class ReserveData(BaseModel):
    stablecoin: str
    issuer: str
    report_date: str
    data_source: str = Field(description="occ_xbrl or pdf_attestation")
    total_reserves: float
    weighted_avg_maturity_days: float
    counterparties: list[Counterparty]
    onchain_cross_check: Optional[OnchainCrossCheck] = None
    resolution_source: str = Field(default="fixture", description="live | cache | fixture — how this data was resolved")
    source_timestamp: Optional[str] = Field(default=None, description="ISO timestamp of when data was fetched/cached")
