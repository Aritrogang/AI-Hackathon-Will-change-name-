import os
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure we can import app from main.py
import sys
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from main import app

@pytest.fixture
def client():
    """FastAPI test client fixture with startup/shutdown events."""
    with TestClient(app) as client:
        yield client

@pytest.fixture
def sample_reserve_data():
    """Fixture that loads sample reserve data from the data directory."""
    repo_root = BASE_DIR.parent
    usdc_path = repo_root / "data" / "reserves" / "usdc.json"
    
    if not usdc_path.exists():
        # Fallback to fixtures directory if reserves/usdc.json doesn't exist
        usdc_path = repo_root / "data" / "fixtures" / "usdc_baseline.json"
        
    with open(usdc_path, "r") as f:
        return json.load(f)
