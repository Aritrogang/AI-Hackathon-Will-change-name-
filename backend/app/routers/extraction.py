"""Extraction API endpoints — XBRL, PDF, and Unsiloed AI vision reserve data parsing."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.services.extraction import ExtractionService

router = APIRouter(prefix="/api", tags=["extraction"])


def _get_extraction_service() -> ExtractionService:
    """Get the global ExtractionService instance from main, falling back to a local one."""
    try:
        from main import extraction_service
        if extraction_service:
            return extraction_service
    except (ImportError, AttributeError):
        pass
    return ExtractionService()


class ExtractRequest(BaseModel):
    content: str
    source_type: str  # "xbrl", "pdf", or "pdf_vision"


@router.post("/extract")
async def extract_reserve_data(body: ExtractRequest):
    """Parse XBRL, PDF, or PDF-vision attestation content into structured ReserveData.

    - source_type "xbrl": OCC XBRL filing (primary path, GENIUS Act compliant issuers)
    - source_type "pdf": Unstructured PDF text (fallback for non-compliant issuers)
    - source_type "pdf_vision": Base64-encoded PDF → Unsiloed AI vision → Claude interpretation

    Returns the extracted ReserveData in the standard API envelope.
    Extracted data is also persisted to SQLite for subsequent GET /api/reserves calls.
    """
    from main import envelope

    if body.source_type not in ("xbrl", "pdf", "pdf_vision"):
        raise HTTPException(
            status_code=400,
            detail="source_type must be 'xbrl', 'pdf', or 'pdf_vision'",
        )

    svc = _get_extraction_service()
    try:
        result = await svc.extract_reserve_data(body.content, body.source_type)
        await svc.store_reserve_data(result, body.source_type)
        return envelope(data=result.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@router.post("/extract/upload")
async def upload_pdf_for_extraction(file: UploadFile = File(...)):
    """Upload a PDF attestation for Unsiloed AI vision extraction → Claude interpretation.

    Accepts a multipart file upload (binary PDF). Routes through the two-stage pipeline:
      Stage 1: Unsiloed AI extracts tables and structured text from the PDF
      Stage 2: Claude interprets the structured output as reserve risk signals

    Falls back to Claude-only text extraction if Unsiloed AI is unavailable.
    Extracted data is persisted to SQLite — next scoring run will use it automatically.
    """
    from main import envelope

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Upload must be a PDF file (.pdf extension)",
        )

    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    svc = _get_extraction_service()
    try:
        result = await svc.extract_from_pdf_with_vision(pdf_bytes)
        await svc.store_reserve_data(result, "pdf_vision")
        return envelope(data=result.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision extraction failed: {str(e)}")


@router.get("/reserves")
async def get_all_reserves():
    """Return all stored reserve data.

    Returns the latest extracted record per stablecoin.
    Falls back to seed fixtures when no extracted data is available.
    """
    from main import envelope

    svc = _get_extraction_service()
    try:
        results = await svc.get_all_reserves()
        return envelope(data=[r.model_dump() for r in results])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reserves/{stablecoin}")
async def get_reserve_by_stablecoin(stablecoin: str):
    """Return reserve data for a single stablecoin.

    Returns the latest extracted record, or the seed fixture if no extraction
    has been run for this symbol yet.
    """
    from main import envelope

    svc = _get_extraction_service()
    result = await svc.get_reserve_by_stablecoin(stablecoin.upper())
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"No reserve data found for {stablecoin.upper()}",
        )
    return envelope(data=result.model_dump())
