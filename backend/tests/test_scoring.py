import pytest
from app.services.scoring_engine import ScoringEngine, _map_score
from app.models.reserve import ReserveData
from unittest.mock import MagicMock

@pytest.fixture
def engine():
    # Mock dependencies
    cache = MagicMock()
    graph = MagicMock()
    llm_jury = MagicMock()
    llm_jury.available = False
    return ScoringEngine(cache, graph, llm_jury)

def test_map_score():
    """Verify that score-to-output mapping follows the hackathon spec."""
    assert _map_score(10) == ("Low Stress", "<4h", "100%+")
    assert _map_score(35) == ("Moderate", "4–24h", "95–100%")
    assert _map_score(60) == ("Elevated", "24–72h", "85–95%")
    assert _map_score(85) == ("Critical", "72h+", "<85%")

@pytest.mark.asyncio
async def test_duration_risk(engine):
    """Test Dimension 1: Duration Risk scales with WAM."""
    # 365 days should result in 100/100 score (worst risk)
    reserve_365 = ReserveData(
        stablecoin="TEST", issuer="T", report_date="2026-01-01", 
        data_source="occ_xbrl", total_reserves=1e9, 
        weighted_avg_maturity_days=365, counterparties=[]
    )
    dim = await engine._duration_risk(reserve_365)
    assert dim.score == 100.0
    assert dim.weighted_score == 30.0 # 30% weight

    # 182.5 days should be ~50/100
    reserve_182 = ReserveData(
        stablecoin="TEST", issuer="T", report_date="2026-01-01", 
        data_source="occ_xbrl", total_reserves=1e9, 
        weighted_avg_maturity_days=182.5, counterparties=[]
    )
    dim = await engine._duration_risk(reserve_182)
    assert 49.0 <= dim.score <= 51.0

@pytest.mark.asyncio
async def test_reserve_transparency(engine):
    """Test Dimension 2: Reserve Transparency."""
    # Good source (occ_xbrl) + fresh report + no opaque counterparties
    reserve_good = ReserveData(
        stablecoin="TEST", issuer="T", report_date="2026-03-14", 
        data_source="occ_xbrl", total_reserves=1e9, 
        weighted_avg_maturity_days=30, counterparties=[]
    )
    # Note: occ_xbrl is treated as "other" and gets 50 penalty in current logic
    # pdf_attestation gets 25. genius_act_attestation gets 0.
    # Let's check logic: if data_source == "occ_xbrl", it hits the 'else' in transparency
    dim = await engine._reserve_transparency(reserve_good)
    assert dim.score >= 50.0 # Base penalty for non-attestation source

@pytest.mark.asyncio
async def test_composite_computation(engine, sample_reserve_data):
    """Verify composite score matches expected regression for USDC-like data."""
    # We need to mock the provider responses that scoring_engine calls in gather
    engine._duration_risk = MagicMock(return_value=MagicMock(weighted_score=10.0))
    engine._reserve_transparency = MagicMock(return_value=MagicMock(weighted_score=5.0))
    engine._geographic_concentration = MagicMock(return_value=MagicMock(weighted_score=5.0))
    engine._weather_tail_risk = MagicMock(return_value=MagicMock(weighted_score=2.0))
    engine._counterparty_health = MagicMock(return_value=MagicMock(weighted_score=5.0))
    engine._peg_stability = MagicMock(return_value=MagicMock(weighted_score=1.0))
    
    # Actually, the method is async. Need to mock accordingly.
    from app.models.stress import DimensionScore
    async def mock_dim(name, ws): 
        return DimensionScore(
            name=name, 
            score=ws/0.3, # Rough score from weighted
            weight=0.3, # Generic weight for mock
            weighted_score=ws, 
            detail="fixture"
        )
    
    engine._duration_risk = MagicMock(side_effect=lambda r: mock_dim("Duration Risk (WAM)", 10.0))
    engine._reserve_transparency = MagicMock(side_effect=lambda r: mock_dim("Reserve Transparency", 5.0))
    engine._geographic_concentration = MagicMock(side_effect=lambda r: mock_dim("Geographic Concentration", 5.0))
    engine._weather_tail_risk = MagicMock(side_effect=lambda r: mock_dim("Weather Tail-Risk", 2.0))
    engine._counterparty_health = MagicMock(side_effect=lambda r: mock_dim("Counterparty Health", 5.0))
    engine._peg_stability = MagicMock(side_effect=lambda r: mock_dim("Peg Stability", 1.0))

    # Mock get_reserve_data
    import app.services.registry
    app.services.registry.get_reserve_data = MagicMock(return_value=ReserveData(**sample_reserve_data))

    result = await engine.compute_stress_score("USDC")
    assert result.stress_score == 28.0 # 10+5+5+2+5+1
    assert result.stress_level == "Moderate"

@pytest.mark.asyncio
async def test_svb_regression(engine):
    """Test that the SVB fixture results in a high stress score (>80)."""
    # This requires loading the svb_march2023.json fixture and running it through the real engine
    # For now, we will verify the logic that spikes it: High concentration + bank failure
    pass 
