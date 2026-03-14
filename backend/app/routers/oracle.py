"""Chainlink Oracle mock endpoint — returns stress scores in External Adapter format."""

from fastapi import APIRouter, HTTPException

from app.services.ipfs import get_published_scores
from app.services.oracle import format_for_oracle

router = APIRouter(prefix="/api/oracle", tags=["oracle"])


@router.get("/{stablecoin}")
async def get_oracle_payload(stablecoin: str):
    """Return a Chainlink External Adapter-compatible payload for a stablecoin.

    The response is NOT wrapped in the standard Katabatic envelope because
    Chainlink EA nodes expect the EA response schema directly.
    """
    from main import scoring_engine

    if scoring_engine is None:
        raise HTTPException(
            status_code=503, detail="Scoring engine not initialized"
        )

    try:
        result = await scoring_engine.compute_stress_score(stablecoin.upper())
    except (ValueError, FileNotFoundError) as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Look up the latest IPFS CID for this stablecoin, if one has been published
    cid: str | None = None
    published = get_published_scores()
    for record in published:
        snapshot = record.get("snapshot", {})
        if snapshot.get("stablecoin", "").upper() == stablecoin.upper():
            cid = record.get("cid")
            break

    return format_for_oracle(result, cid)
