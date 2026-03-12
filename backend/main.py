import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Katabatic API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def envelope(data=None, error=None):
    return {
        "data": data,
        "error": error,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health")
async def health():
    return envelope({"status": "ok"})


# --- Validate API keys on startup ---
@app.on_event("startup")
async def startup_check():
    keys = {
        "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
        "ETHERSCAN_API_KEY": os.getenv("ETHERSCAN_API_KEY"),
        "PINATA_API_KEY": os.getenv("PINATA_API_KEY"),
        "PINATA_SECRET_API_KEY": os.getenv("PINATA_SECRET_API_KEY"),
    }
    # Note: NOAA NWS, Open-Meteo, FDIC BankFind, and Nominatim require no API keys
    for name, val in keys.items():
        if not val:
            print(f"  WARNING: {name} not set — related features will be disabled")
        else:
            print(f"  OK: {name} is set")
