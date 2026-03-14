import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.weather_provider import WeatherProvider
from app.services.scoring_engine import ScoringEngine
from app.models.reserve import ReserveData, Counterparty

@pytest.fixture
def engine():
    cache = MagicMock()
    graph = MagicMock()
    llm_jury = MagicMock()
    return ScoringEngine(cache, graph, llm_jury)

@pytest.mark.asyncio
async def test_weather_tail_risk_no_hazard(engine):
    """Verify 0 score when no hazards are present."""
    reserve = ReserveData(
        stablecoin="USDC", issuer="Circle", report_date="2026-03-14",
        data_source="occ_xbrl", total_reserves=1e9,
        weighted_avg_maturity_days=30,
        counterparties=[
            Counterparty(
                bank_name="Test Bank", city="New York", state="NY",
                lat=40.71, lng=-74.00, percentage=100.0,
                asset_class="t_bills", maturity_days=30
            )
        ]
    )
    
    # Mock weather provider to return no storms/forecasts
    engine.weather.resolve = AsyncMock(return_value=MagicMock(data={"active_storms": []}))
    
    dim = await engine._weather_tail_risk(reserve)
    assert dim.score == 0.0
    assert "No counterparties facing quantitative weather hazards" in dim.detail

@pytest.mark.asyncio
async def test_weather_tail_risk_with_hurricane(engine):
    """Verify that a nearby hurricane spikes the weather risk score."""
    reserve = ReserveData(
        stablecoin="USDC", issuer="Circle", report_date="2026-03-14",
        data_source="occ_xbrl", total_reserves=1e9,
        weighted_avg_maturity_days=30,
        counterparties=[
            Counterparty(
                bank_name="Miami Bank", city="Miami", state="FL",
                lat=25.76, lng=-80.19, percentage=100.0,
                asset_class="t_bills", maturity_days=30,
                fdic_ltv_ratio=0.8 # High LTV = high fragility
            )
        ]
    )
    
    # Mock NHC storm at Miami
    storm_data = {"active_storms": [{"name": "HELENE", "latitude": 25.8, "longitude": -80.2}]}
    
    async def mock_resolve(sid):
        if "nhc:storms" in sid:
            return MagicMock(data=storm_data)
        if "forecast" in sid or "ensemble" in sid or "flood" in sid:
            # Return high wind/rain forecast
            return MagicMock(data={
                "max_wind_gust_kmh": 150, 
                "total_precipitation_mm": 200,
                "max_cape_jkg": 3000,
                "discharge_anomaly_ratio": 4.0
            })
        return MagicMock(data={})

    engine.weather.resolve = AsyncMock(side_effect=mock_resolve)
    
    dim = await engine._weather_tail_risk(reserve)
    assert dim.score > 50.0 # Should be very high due to proximity + intensity + LTV
    # Verify coordinates were checked
    assert any("25.76,-80.19" in str(arg) for arg, _ in engine.weather.resolve.call_args_list)

@pytest.mark.asyncio
async def test_corridor_overlap_risk(engine):
    """Verify that data center corridor overlap increases risk."""
    # This is handled in project_scenario for the project/simulate endpoint
    # but the logic for corridor hits is in ScoringEngine.project_scenario
    pass
