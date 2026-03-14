"""Standalone multi-model narrative service — generates causal explanations with claim-level consensus.

Calls Claude + Gemini concurrently, extracts factual claims from each response,
computes claim overlap, and produces a consensus narrative when >70% of claims match.
"""

import asyncio
import json
import os
import re
from difflib import SequenceMatcher
from typing import Optional

from app.models.stress import NarrativeClaim, NarrativeResult


class NarrativeService:
    """Generates multi-model causal narratives for stress scores."""

    CONSENSUS_THRESHOLD = 0.70  # 70% claim overlap required for consensus

    def __init__(self) -> None:
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.available = bool(self.anthropic_key or self.gemini_key)

    def _is_available(self) -> bool:
        """Required for standardized API availability checks."""
        return self.available

    async def generate_narrative(self, stress_context: str) -> Optional[NarrativeResult]:
        """Generate a multi-model causal narrative with claim comparison.

        Returns NarrativeResult with consensus info, or None if both models fail.
        """
        if not self.available:
            return None

        prompt = self._build_prompt(stress_context)

        # Call whichever models are available
        tasks = {}
        if self.anthropic_key:
            tasks["claude"] = self._call_claude(prompt)
        if self.gemini_key:
            tasks["gemini"] = self._call_gemini(prompt)

        if not tasks:
            return None

        # Run concurrently
        results = await asyncio.gather(*tasks.values(), return_exceptions=True)
        model_results = {}
        for model_name, result in zip(tasks.keys(), results):
            if isinstance(result, Exception):
                continue
            model_results[model_name] = result

        if not model_results:
            return None

        # Single model fallback
        if len(model_results) == 1:
            model_name = list(model_results.keys())[0]
            raw = model_results[model_name]
            narrative_text, claims = self._parse_response(raw)
            return NarrativeResult(
                narrative=narrative_text,
                claude_narrative=narrative_text if model_name == "claude" else None,
                gemini_narrative=narrative_text if model_name == "gemini" else None,
                claims=[
                    NarrativeClaim(text=c, supported_by=[model_name])
                    for c in claims
                ],
                consensus=False,
                overlap_pct=0.0,
            )

        # Dual model — extract claims and compare
        claude_raw = model_results.get("claude", "")
        gemini_raw = model_results.get("gemini", "")

        claude_narrative, claude_claims = self._parse_response(claude_raw)
        gemini_narrative, gemini_claims = self._parse_response(gemini_raw)

        overlap_pct, matched_claims = self._compute_consensus(claude_claims, gemini_claims)
        is_consensus = overlap_pct >= self.CONSENSUS_THRESHOLD

        # Build unified claim list
        all_claims: list[NarrativeClaim] = []
        for claim_text in matched_claims:
            all_claims.append(NarrativeClaim(text=claim_text, supported_by=["claude", "gemini"]))

        # Add unmatched claims from each model
        for claim in claude_claims:
            if not any(c.text == claim for c in all_claims):
                all_claims.append(NarrativeClaim(text=claim, supported_by=["claude"]))
        for claim in gemini_claims:
            if not any(c.text == claim for c in all_claims):
                all_claims.append(NarrativeClaim(text=claim, supported_by=["gemini"]))

        # Choose final narrative
        if is_consensus:
            final_narrative = claude_narrative  # Use Claude's prose when in consensus
        else:
            final_narrative = claude_narrative  # Primary narrative is Claude's

        return NarrativeResult(
            narrative=final_narrative,
            claude_narrative=claude_narrative,
            gemini_narrative=gemini_narrative,
            claims=all_claims,
            consensus=is_consensus,
            overlap_pct=round(overlap_pct * 100, 1),
        )

    def _build_prompt(self, context: str) -> str:
        """Build the structured prompt for narrative generation."""
        return (
            "You are a stablecoin risk analyst. Given the following stress score context, "
            "generate:\n"
            "1. A 2-3 sentence causal explanation of WHY this stress score is what it is. "
            "Focus on the chain of causation: duration mismatch → weather/macro multiplier → "
            "operational risk. Be specific about bank names, percentages, and data center corridors. "
            "Do NOT use the word 'rating' — use 'stress score' instead.\n"
            "2. A JSON array of factual claims — short, atomic statements that support your narrative. "
            "Each claim should be a single verifiable fact.\n\n"
            f"{context}\n\n"
            "Respond in this exact format:\n"
            "NARRATIVE: <your 2-3 sentence narrative>\n"
            "CLAIMS: [\"claim 1\", \"claim 2\", \"claim 3\", ...]"
        )

    def _parse_response(self, raw: str) -> tuple[str, list[str]]:
        """Parse LLM response into narrative text and claims list."""
        narrative = ""
        claims: list[str] = []

        if not raw:
            return narrative, claims

        # Extract narrative
        narrative_match = re.search(r"NARRATIVE:\s*(.+?)(?=\nCLAIMS:|\Z)", raw, re.DOTALL)
        if narrative_match:
            narrative = narrative_match.group(1).strip()
        else:
            # Fallback: use full text as narrative if format isn't followed
            narrative = raw.strip()

        # Extract claims
        claims_match = re.search(r"CLAIMS:\s*(\[.+?\])", raw, re.DOTALL)
        if claims_match:
            try:
                parsed = json.loads(claims_match.group(1))
                if isinstance(parsed, list):
                    claims = [str(c).strip() for c in parsed if c]
            except json.JSONDecodeError:
                pass

        # If no claims extracted, generate them from the narrative
        if not claims and narrative:
            sentences = [s.strip() for s in re.split(r'[.!?]+', narrative) if s.strip()]
            claims = sentences[:5]  # Use sentences as claims fallback

        return narrative, claims

    def _compute_consensus(
        self, claude_claims: list[str], gemini_claims: list[str]
    ) -> tuple[float, list[str]]:
        """Compute claim overlap between two models.

        Returns (overlap_ratio, list_of_matched_claim_texts).
        """
        if not claude_claims or not gemini_claims:
            return 0.0, []

        matched: list[str] = []
        used_gemini: set[int] = set()

        for c_claim in claude_claims:
            c_norm = self._normalize_claim(c_claim)
            best_ratio = 0.0
            best_idx = -1

            for i, g_claim in enumerate(gemini_claims):
                if i in used_gemini:
                    continue
                g_norm = self._normalize_claim(g_claim)
                ratio = SequenceMatcher(None, c_norm, g_norm).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_idx = i

            if best_ratio >= 0.55 and best_idx >= 0:  # Fuzzy match threshold for claims
                matched.append(c_claim)
                used_gemini.add(best_idx)

        total = max(len(claude_claims), len(gemini_claims))
        overlap = len(matched) / total if total > 0 else 0.0

        return overlap, matched

    @staticmethod
    def _normalize_claim(text: str) -> str:
        """Normalize claim text for comparison — lowercase, strip punctuation/whitespace."""
        text = text.lower().strip()
        text = re.sub(r'[^\w\s%$.]', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text

    async def _call_claude(self, prompt: str) -> str:
        """Call Claude API and return text response."""
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=self.anthropic_key)
        response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
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
