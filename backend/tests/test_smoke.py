import pytest
from fastapi.testclient import TestClient

def test_health_endpoint(client: TestClient):
    """Verify that the /health endpoint returns a successful response."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["status"] == "ok"
    assert "timestamp" in data

def test_sample_reserve_fixture(sample_reserve_data: dict):
    """Verify that the sample_reserve_data fixture loads the correct data."""
    assert "stablecoin" in sample_reserve_data
    assert "issuer" in sample_reserve_data
    assert sample_reserve_data["stablecoin"] == "USDC"

def test_get_scores_endpoint(client: TestClient):
    """Verify that the scores endpoint is reachable and returns the expected envelope."""
    response = client.get("/api/stress-scores")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "error" in data
    assert "timestamp" in data
