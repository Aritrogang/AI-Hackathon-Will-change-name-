"""Narrative generation API endpoint."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/narratives", tags=["narratives"])


class NarrativeRequest(BaseModel):
    stress_context: str


@router.post("/")
async def generate_narrative(body: NarrativeRequest):
    """Generate a multi-model causal narrative with claim-level consensus."""
    from main import envelope, narrative_service

    if narrative_service is None or not narrative_service.available:
        return envelope(error="Narrative service not available — API keys not configured")

    result = await narrative_service.generate_narrative(body.stress_context)

    if result is None:
        return envelope(error="Both models failed to generate a narrative")

    return envelope(data=result.model_dump())
