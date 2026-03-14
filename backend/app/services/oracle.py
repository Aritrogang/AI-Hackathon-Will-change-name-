"""Oracle formatting service — converts stress scores to Chainlink External Adapter payloads."""

from datetime import datetime, timezone

from app.models.stress import StressScoreResult


def format_for_oracle(score_result: StressScoreResult, cid: str | None) -> dict:
    """Format a StressScoreResult into a Chainlink External Adapter-compatible payload.

    The Chainlink EA format wraps the primary result (integer stress score) with
    structured metadata that on-chain consumers and oracle nodes can verify.

    Args:
        score_result: The computed stress score result for a stablecoin.
        cid: IPFS CID of the pinned score snapshot, or None if not yet published.

    Returns:
        A dict matching the Chainlink External Adapter response schema.
    """
    timestamp = datetime.now(timezone.utc).isoformat()
    stress_score_int = int(round(score_result.stress_score))

    ipfs_url = f"https://gateway.pinata.cloud/ipfs/{cid}" if cid else None

    data: dict = {
        "stablecoin": score_result.stablecoin,
        "stress_score": stress_score_int,
        "stress_level": score_result.stress_level,
        "redemption_latency_hours": score_result.redemption_latency_hours,
        "liquidity_coverage_ratio": score_result.liquidity_coverage_ratio,
        "ipfs_cid": cid,
        "ipfs_url": ipfs_url,
        "timestamp": timestamp,
        "consensus": None,
        "signature": (
            "TEE signature placeholder — production would use SGX/TDX attestation"
        ),
    }

    # Attach jury consensus info if available
    if score_result.jury:
        data["consensus"] = {
            "claude_score": score_result.jury.claude_score,
            "gemini_score": score_result.jury.gemini_score,
            "delta": score_result.jury.delta,
            "confirmed": score_result.jury.consensus,
            "averaged_score": score_result.jury.averaged_score,
        }

    return {
        "jobRunID": "1",
        "statusCode": 200,
        "result": stress_score_int,
        "data": data,
    }
