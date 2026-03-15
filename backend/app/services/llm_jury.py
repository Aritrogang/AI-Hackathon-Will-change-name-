"""LLM jury service — multi-model consensus scoring with Claude + Gemini."""

import asyncio
import json
import logging
import os
from typing import Optional

from app.models.stress import JuryResult

logger = logging.getLogger(__name__)


class LLMJuryService:
    """Calls Claude and Gemini to score counterparty health and generate consensus narratives."""

    def __init__(self) -> None:
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.available = bool(self.anthropic_key and self.gemini_key)

    def _is_available(self) -> bool:
        """Required for standardized API availability checks."""
        return self.available

    async def evaluate_counterparty_health(self, context: str) -> Optional[JuryResult]:
        """Score counterparty health using Claude + Gemini consensus.

        Returns None if API keys are not configured or both calls fail.
        When one model fails, uses the successful model's score for both and adds a warning.
        """
        if not self.available:
            return None

        prompt = (
            "Given the following stablecoin reserve and bank financial data, "
            "score the counterparty health risk from 0 (completely healthy) to 100 "
            "(imminent failure). Consider leverage ratios, liquidity coverage, "
            "asset quality, and concentration risk.\n\n"
            f"{context}\n\n"
            "Respond with ONLY a JSON object: {\"score\": <int 0-100>, \"reasoning\": \"<1-2 sentences>\"}"
        )

        try:
            claude_task = self._call_claude(prompt)
            gemini_task = self._call_gemini(prompt)
            claude_result, gemini_result = await asyncio.gather(
                claude_task, gemini_task, return_exceptions=True
            )

            claude_ok = not isinstance(claude_result, Exception)
            gemini_ok = not isinstance(gemini_result, Exception)

            if not claude_ok:
                logger.warning("Claude jury call failed: %s", claude_result)
            if not gemini_ok:
                logger.warning("Gemini jury call failed: %s", gemini_result)

            # Both failed — return None so frontend hides the section
            if not claude_ok and not gemini_ok:
                return None

            claude_score: Optional[float] = None
            gemini_score: Optional[float] = None

            if claude_ok:
                claude_score = self._parse_score(claude_result)
            if gemini_ok:
                gemini_score = self._parse_score(gemini_result)

            warning = None

            if claude_score is not None and gemini_score is not None:
                # Both succeeded — real consensus
                delta = abs(claude_score - gemini_score)
                averaged = (claude_score + gemini_score) / 2.0
                if delta > 15:
                    warning = "Models disagree — review manually"
            elif claude_score is not None:
                # Only Claude succeeded
                gemini_score = claude_score
                delta = 0.0
                averaged = claude_score
                warning = "Gemini unavailable — single-model score"
            else:
                # Only Gemini succeeded
                claude_score = gemini_score  # type: ignore[assignment]
                delta = 0.0
                averaged = gemini_score  # type: ignore[assignment]
                warning = "Claude unavailable — single-model score"

            return JuryResult(
                claude_score=claude_score,  # type: ignore[arg-type]
                gemini_score=gemini_score,  # type: ignore[arg-type]
                delta=delta,
                consensus=delta <= 15,
                averaged_score=averaged,
                warning=warning,
            )
        except Exception as e:
            logger.warning("Jury evaluation failed: %s", e)
            return None

    async def generate_narrative(self, context: str) -> Optional[str]:
        """Generate a causal narrative for a stress score using Claude."""
        if not self.anthropic_key:
            return None

        prompt = (
            "Generate a 2-3 sentence causal explanation of this stablecoin's stress score. "
            "Focus on the chain of causation: duration mismatch → weather/macro multiplier → operational risk. "
            "Be specific about bank names, percentages, and data center corridors. "
            "Do NOT use the word 'rating' — use 'stress score' instead.\n\n"
            f"{context}"
        )

        try:
            result = await self._call_claude(prompt)
            if isinstance(result, str):
                return result
            return None
        except Exception:
            return None

    async def _call_claude(self, prompt: str) -> str:
        """Call Claude API and return text response."""
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=self.anthropic_key)
        response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    async def _call_gemini(self, prompt: str) -> str:
        """Call Gemini API and return text response."""
        from google import genai

        client = genai.Client(api_key=self.gemini_key)
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return response.text

    def _parse_score(self, text: str) -> Optional[float]:
        """Extract numeric score from LLM response. Returns None if parsing fails."""
        if not isinstance(text, str):
            return None
        try:
            # Try JSON parse first
            data = json.loads(text.strip().strip("```json").strip("```"))
            score = data.get("score")
            if score is not None:
                return float(score)
            return None
        except (json.JSONDecodeError, ValueError):
            pass
        # Fallback: look for a number
        import re
        numbers = re.findall(r'\b(\d{1,3})\b', text)
        for n in numbers:
            val = int(n)
            if 0 <= val <= 100:
                return float(val)
        return None
