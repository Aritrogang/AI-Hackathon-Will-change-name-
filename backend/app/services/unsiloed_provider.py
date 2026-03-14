"""Unsiloed AI vision extraction client.

Pipeline:
  PDF bytes → Unsiloed AI (table/visual extraction) → structured JSON
                        → Claude (risk signal interpretation) → ReserveData

Unsiloed AI is a hackathon sponsor whose SOTA vision models are purpose-built
for multimodal unstructured → structured conversion.  Their API handles the
heavy visual parsing of PDF tables; Claude then focuses exclusively on semantic
risk interpretation, saving tokens and producing a cleaner extraction story.

API docs:  https://docs.unsiloed.ai/
Discord:   https://discord.gg/FrKjCfZx  (obtain API key here)
"""

import asyncio
import os
from typing import Any, Optional

import httpx

# ---------------------------------------------------------------------------
# API config — matches https://docs.unsiloed.ai/api-reference
# ---------------------------------------------------------------------------
_BASE_URL = os.getenv("UNSILOED_BASE_URL", "https://prod.visionapi.unsiloed.ai")
_PARSE_PATH = "/parse"
_TIMEOUT_SECONDS = 30               # Timeout per individual HTTP request
_POLL_MAX_SECONDS = 300              # Max total time waiting for job completion
_POLL_INITIAL_INTERVAL = 1.0        # Start polling at 1s
_POLL_MAX_INTERVAL = 10.0           # Cap backoff at 10s
_POLL_BACKOFF_FACTOR = 1.5          # Exponential backoff multiplier


class UnsIloedClient:
    """Async HTTP client for the Unsiloed AI document parsing API.

    Uses the async job pattern:
      1. POST /parse (multipart form-data) → {job_id}
      2. Poll GET /parse/{job_id} until status == "Succeeded"
      3. Parse chunks/segments from the result
    """

    def __init__(self) -> None:
        self.api_key: Optional[str] = os.getenv("UNSILOED_API_KEY")
        self.available: bool = bool(self.api_key)
        self._client: Optional[httpx.AsyncClient] = None

    # ------------------------------------------------------------------
    # Lifecycle helpers
    # ------------------------------------------------------------------

    def _get_client(self) -> httpx.AsyncClient:
        """Return a lazily-created shared AsyncClient."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=_BASE_URL,
                headers={
                    "api-key": self.api_key or "",
                    "Accept": "application/json",
                },
                timeout=_TIMEOUT_SECONDS,
            )
        return self._client

    async def close(self) -> None:
        """Close the underlying HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ------------------------------------------------------------------
    # Low-level: submit parse job
    # ------------------------------------------------------------------

    async def _submit_parse(
        self,
        *,
        file_bytes: Optional[bytes] = None,
        file_name: str = "document.pdf",
        url: Optional[str] = None,
    ) -> str:
        """Submit a document for parsing and return the job_id.

        Either file_bytes or url must be provided (not both).
        """
        if not self.available:
            raise RuntimeError(
                "UNSILOED_API_KEY is not set — cannot call Unsiloed AI API"
            )

        client = self._get_client()

        # Build multipart form data
        data: dict[str, Any] = {
            "use_high_resolution": "true",
            "merge_tables": "true",
            "ocr_mode": "auto_ocr",
            "segmentation_method": "smart_layout_detection",
        }

        files: Optional[dict[str, Any]] = None
        if file_bytes is not None:
            files = {"file": (file_name, file_bytes, "application/pdf")}
        elif url is not None:
            data["url"] = url
        else:
            raise ValueError("Must provide either file_bytes or url")

        response = await client.post(_PARSE_PATH, data=data, files=files)
        response.raise_for_status()
        result = response.json()
        job_id = result.get("job_id")
        if not job_id:
            raise RuntimeError(f"Unsiloed API did not return job_id: {result}")
        return job_id

    # ------------------------------------------------------------------
    # Low-level: poll for job completion
    # ------------------------------------------------------------------

    async def _poll_job(self, job_id: str) -> dict[str, Any]:
        """Poll GET /parse/{job_id} until the job succeeds or fails.

        Uses exponential backoff starting at 1s, capped at 10s.
        Total wait capped at _POLL_MAX_SECONDS.
        """
        client = self._get_client()
        elapsed = 0.0
        interval = _POLL_INITIAL_INTERVAL

        while elapsed < _POLL_MAX_SECONDS:
            await asyncio.sleep(interval)
            elapsed += interval

            response = await client.get(f"{_PARSE_PATH}/{job_id}")
            response.raise_for_status()
            result = response.json()

            status = result.get("status", "")
            if status == "Succeeded":
                return result
            elif status == "Failed":
                raise RuntimeError(
                    f"Unsiloed parse job {job_id} failed: {result.get('message', 'unknown error')}"
                )

            # Still processing — back off
            interval = min(interval * _POLL_BACKOFF_FACTOR, _POLL_MAX_INTERVAL)

        raise TimeoutError(
            f"Unsiloed parse job {job_id} did not complete within {_POLL_MAX_SECONDS}s"
        )

    # ------------------------------------------------------------------
    # PDF table extraction (public API)
    # ------------------------------------------------------------------

    async def extract_pdf_tables(self, pdf_bytes: bytes) -> dict[str, Any]:
        """Send a PDF to Unsiloed AI and return the parsed result.

        Submits the PDF as multipart form-data, polls for completion,
        and returns the full job result containing chunks and segments.
        """
        job_id = await self._submit_parse(file_bytes=pdf_bytes)
        return await self._poll_job(job_id)

    async def extract_pdf_tables_from_url(self, pdf_url: str) -> dict[str, Any]:
        """Send a PDF URL to Unsiloed AI for parsing.

        Args:
            pdf_url: publicly accessible URL pointing to the PDF.
        """
        job_id = await self._submit_parse(url=pdf_url)
        return await self._poll_job(job_id)

    # ------------------------------------------------------------------
    # Structured JSON converter
    # ------------------------------------------------------------------

    def to_structured_json(self, api_response: dict[str, Any]) -> str:
        """Convert the Unsiloed parse result into a structured text summary
        ready for Claude to interpret as reserve risk signals.

        Processes chunks → segments, extracting tables (as markdown) and
        text content. Segment types: Table, Text, Title, SectionHeader,
        ListItem, Caption, Footnote, Formula, Picture, etc.
        """
        parts: list[str] = []
        chunks = api_response.get("chunks") or []
        table_idx = 0

        for chunk in chunks:
            segments = chunk.get("segments") or []

            # If the chunk has an 'embed' field (full text), use it
            embed = chunk.get("embed")
            if embed and not segments:
                parts.append(embed)
                continue

            for segment in segments:
                seg_type = segment.get("type") or segment.get("segment_type") or "Text"
                # Prefer markdown content, fall back to plain content
                content = (
                    segment.get("markdown")
                    or segment.get("html")
                    or segment.get("content")
                    or segment.get("text")
                    or ""
                )
                if not content.strip():
                    continue

                if seg_type == "Table":
                    table_idx += 1
                    parts.append(f"\n=== TABLE {table_idx} ===")
                    parts.append(content.strip())
                elif seg_type in ("Title", "SectionHeader"):
                    parts.append(f"\n## {content.strip()}")
                elif seg_type == "ListItem":
                    parts.append(f"- {content.strip()}")
                elif seg_type == "Caption":
                    parts.append(f"[Caption: {content.strip()}]")
                elif seg_type == "Footnote":
                    parts.append(f"[Footnote: {content.strip()}]")
                else:
                    # Text, Formula, Picture description, etc.
                    parts.append(content.strip())

        return "\n".join(parts) if parts else ""

    # ------------------------------------------------------------------
    # Safe extraction with graceful fallback
    # ------------------------------------------------------------------

    async def safe_extract(
        self, pdf_bytes: bytes, fallback_text: Optional[str] = None
    ) -> tuple[str, str]:
        """Attempt Unsiloed extraction; fall back to plain text on any failure.

        Returns:
            (extracted_content, source) where source is "unsiloed" or "fallback".
        """
        if not self.available:
            return (fallback_text or "", "fallback")

        try:
            raw = await self.extract_pdf_tables(pdf_bytes)
            structured = self.to_structured_json(raw)
            return (structured, "unsiloed")
        except Exception as exc:
            print(f"  WARNING: Unsiloed extraction failed ({exc}), falling back to plain text")
            return (fallback_text or "", "fallback")
