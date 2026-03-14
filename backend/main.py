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

# --- Global service instances (initialized on startup) ---
from app.services.cache import Cache
from app.services.knowledge_graph import KnowledgeGraphService
from app.services.llm_jury import LLMJuryService
from app.services.narratives import NarrativeService
from app.services.weather_provider import WeatherProvider
from app.services.etherscan_provider import EtherscanProvider

cache = Cache()
graph_service = KnowledgeGraphService()
llm_jury = LLMJuryService()
narrative_service = NarrativeService()
weather_provider = WeatherProvider(cache)
etherscan_provider = EtherscanProvider(cache)
scoring_engine = None  # Initialized on startup

# --- Global Availability Flags ---
CLAUDE_AVAILABLE = False
GEMINI_AVAILABLE = False
ETHERSCAN_AVAILABLE = False
UNSILOED_AVAILABLE = False
IPFS_AVAILABLE = False


def envelope(data=None, error=None):
    return {
        "data": data,
        "error": error,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# --- Register routers ---
from app.routers import scores, weather, graph, extraction, onchain, narratives, webhooks, backtest, streaming, ipfs, oracle, compliance, export

app.include_router(scores.router)
app.include_router(weather.router)
app.include_router(graph.router)
app.include_router(extraction.router)
app.include_router(onchain.router)
app.include_router(narratives.router)
app.include_router(webhooks.router)
app.include_router(backtest.router)
app.include_router(streaming.router)
app.include_router(ipfs.router)
app.include_router(oracle.router)
app.include_router(compliance.router)
app.include_router(export.router)


@app.get("/health")
async def health():
    return envelope({"status": "ok"})


@app.on_event("startup")
async def startup():
    # Validate API keys and set availability flags
    global CLAUDE_AVAILABLE, GEMINI_AVAILABLE, ETHERSCAN_AVAILABLE, UNSILOED_AVAILABLE, IPFS_AVAILABLE
    
    keys = {
        "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
        "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
        "ETHERSCAN_API_KEY": os.getenv("ETHERSCAN_API_KEY"),
        "PINATA_API_KEY": os.getenv("PINATA_API_KEY"),
        "UNSILOED_API_KEY": os.getenv("UNSILOED_API_KEY"),
    }
    
    CLAUDE_AVAILABLE = bool(keys["ANTHROPIC_API_KEY"])
    GEMINI_AVAILABLE = bool(keys["GEMINI_API_KEY"])
    ETHERSCAN_AVAILABLE = bool(keys["ETHERSCAN_API_KEY"])
    UNSILOED_AVAILABLE = bool(keys["UNSILOED_API_KEY"])
    IPFS_AVAILABLE = bool(keys["PINATA_API_KEY"])

    print("\n--- Katabatic Service Availability ---")
    print(f"  [CORE] Jury & Narratives:  {'OK' if CLAUDE_AVAILABLE and GEMINI_AVAILABLE else 'PARTIAL' if CLAUDE_AVAILABLE or GEMINI_AVAILABLE else 'DISABLED (Fix: Set ANTHROPIC/GEMINI keys)'}")
    print(f"  [ON-CHAIN] Peg Stability: {'OK' if ETHERSCAN_AVAILABLE else 'FIXTURE FALLBACK (Fix: Set ETHERSCAN_API_KEY)'}")
    print(f"  [VISION] PDF Extraction:  {'OK' if UNSILOED_AVAILABLE else 'TEXT-ONLY FALLBACK (Fix: Set UNSILOED_API_KEY)'}")
    print(f"  [IPFS] Decentralized:     {'OK' if IPFS_AVAILABLE else 'LOCAL-ONLY (Fix: Set PINATA_API_KEY)'}")
    print("---------------------------------------\n")

    # Initialize cache
    await cache.initialize()
    print("  Cache initialized")

    # Initialize webhook database
    from app.services.webhooks import initialize_db as init_webhooks_db
    await init_webhooks_db()
    print("  Webhook database initialized")

    # Build knowledge graph from registry fixtures
    from app.services.registry import get_all_symbols, get_reserve_data

    reserves = {}
    for symbol in get_all_symbols():
        try:
            reserves[symbol] = get_reserve_data(symbol)
        except (ValueError, FileNotFoundError) as e:
            print(f"  WARNING: Could not load {symbol}: {e}")

    graph_service.build_from_reserves(reserves)
    print(f"  Knowledge graph built: {graph_service.graph.number_of_nodes()} nodes, {graph_service.graph.number_of_edges()} edges")

    # Initialize scoring engine
    global scoring_engine
    from app.services.scoring_engine import ScoringEngine

    scoring_engine = ScoringEngine(cache, graph_service, llm_jury, narrative_service)
    print("  Scoring engine ready")
    print("Katabatic API started successfully.")


@app.on_event("shutdown")
async def shutdown():
    await cache.close()
    print("Katabatic API shut down.")
