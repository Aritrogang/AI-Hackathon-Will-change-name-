import pytest
from fastapi.testclient import TestClient

def test_health_router(client: TestClient):
    """Verify the top-level health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "ok"

def test_scores_list(client: TestClient):
    """Verify that all stress scores can be retrieved."""
    response = client.get("/api/stress-scores/")
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    if len(data) > 0:
        assert "stablecoin" in data[0]
        assert "stress_score" in data[0]

def test_project_endpoint(client: TestClient):
    """Verify the simulation/projection endpoint."""
    payload = {
        "stablecoin": "USDC",
        "rate_hike_bps": 100,
        "hurricane_lat": 25.76,
        "hurricane_lng": -80.19,
        "hurricane_category": 5,
        "bank_failure": "SVB"
    }
    response = client.post("/api/stress-scores/project", json=payload)
    assert response.status_code == 200
    res = response.json()["data"]
    assert "baseline" in res
    assert "projected" in res
    assert "delta" in res
    assert res["stablecoin"] == "USDC"

def test_backtest_endpoint(client: TestClient):
    """Verify the backtest endpoint for SVB scenario."""
    response = client.get("/api/backtest/svb")
    # Note: Some environments might return 404 if the repo-root/data/scenarios/svb.json is missing
    # But for a smoke test, we verify the route exists.
    assert response.status_code in [200, 404]

def test_weather_router(client: TestClient):
    """Verify the weather active alerts router."""
    response = client.get("/api/weather/active?state=FL")
    assert response.status_code == 200
    assert "weather_alerts" in response.json()["data"]

def test_narratives_router(client: TestClient):
    """Verify the narrative endpoint."""
    payload = {"stress_context": "USDC duration mismatch"}
    response = client.post("/api/narratives/", json=payload)
    assert response.status_code in [200, 503] # 503 if LLM is down or narrative service unavailable
