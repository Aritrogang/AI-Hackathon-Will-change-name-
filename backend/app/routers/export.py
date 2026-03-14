"""Bulk score export endpoints for warehouse delivery."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

from app.services.export import export_scores_csv, export_scores_json

router = APIRouter(prefix="/api/export", tags=["export"])

_MAX_DATE_RANGE_DAYS = 90


def _validate_dates(start: str, end: str) -> None:
    """Raise HTTPException if dates are invalid or span more than 90 days."""
    try:
        start_dt = datetime.strptime(start, "%Y-%m-%d")
        end_dt = datetime.strptime(end, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="start and end must be ISO date strings: YYYY-MM-DD",
        )
    if end_dt < start_dt:
        raise HTTPException(status_code=400, detail="end must be >= start")
    if (end_dt - start_dt).days > _MAX_DATE_RANGE_DAYS:
        raise HTTPException(
            status_code=400,
            detail=f"Date range exceeds {_MAX_DATE_RANGE_DAYS}-day maximum per request",
        )


@router.get("/scores")
async def export_scores(
    format: str = Query(default="json", pattern="^(json|csv)$"),
    start: str = Query(..., description="Start date YYYY-MM-DD (inclusive)"),
    end: str = Query(..., description="End date YYYY-MM-DD (inclusive)"),
    stablecoins: Optional[str] = Query(
        default=None,
        description="Comma-separated stablecoin symbols, e.g. USDC,USDT",
    ),
    limit: int = Query(default=1000, ge=1, le=10000),
    offset: int = Query(default=0, ge=0),
):
    """Bulk export historical Liquidity Stress Scores for warehouse ingestion.

    Supports JSON and CSV formats.  CSV responses include a Content-Disposition
    header so the browser/client treats it as a file download.

    Params:
        format:      "json" (default) or "csv"
        start:       start date inclusive (YYYY-MM-DD)
        end:         end date inclusive (YYYY-MM-DD), max 90 days from start
        stablecoins: optional comma-separated filter (e.g. USDC,USDT)
        limit:       rows per page, 1–10000 (default 1000)
        offset:      rows to skip for pagination (default 0)

    Returns:
        JSON: standard API envelope with array of score records.
        CSV:  file download with 13 columns (date through ipfs_cid).
    """
    from main import envelope

    _validate_dates(start, end)
    coin_list = [c.strip().upper() for c in stablecoins.split(",")] if stablecoins else None

    if format == "csv":
        try:
            csv_text = await export_scores_csv(coin_list, start, end, limit, offset)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        filename = f"helicity_scores_{start}_{end}.csv"
        return Response(
            content=csv_text,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    # JSON format
    try:
        rows = await export_scores_json(coin_list, start, end, limit, offset)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return envelope(
        data={
            "scores": rows,
            "count": len(rows),
            "pagination": {"limit": limit, "offset": offset},
            "filters": {
                "start": start,
                "end": end,
                "stablecoins": coin_list,
            },
        }
    )
