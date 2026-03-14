"""LLM jury service — multi-model consensus scoring with Claude + Gemini."""

import asyncio
import json
import os
from typing import Optional

from app.models.stress import JuryResult


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

        Returns None if API keys are not configured (caller should fall back to heuristics).
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

            claude_score = self._parse_score(claude_result) if not isinstance(claude_result, Exception) else 50.0
            gemini_score = self._parse_score(gemini_result) if not isinstance(gemini_result, Exception) else 50.0

            delta = abs(claude_score - gemini_score)
            averaged = (claude_score + gemini_score) / 2.0

            return JuryResult(
                claude_score=claude_score,
                gemini_score=gemini_score,
                delta=delta,
                consensus=delta <= 15,
                averaged_score=averaged,
                warning="Models disagree — review manually" if delta > 15 else None,
            )
        except Exception:
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

    def _parse_score(self, text: str) -> float:
        """Extract numeric score from LLM response."""
        if not isinstance(text, str):
            return 50.0
        try:
            # Try JSON parse first
            data = json.loads(text.strip().strip("```json").strip("```"))
            return float(data.get("score", 50))
        except (json.JSONDecodeError, ValueError):
            pass
        # Fallback: look for a number
        import re
        numbers = re.findall(r'\b(\d{1,3})\b', text)
        for n in numbers:
            val = int(n)
            if 0 <= val <= 100:
                return float(val)
        return 50.0
