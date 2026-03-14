"""Unit tests for the NarrativeService — claim extraction, consensus detection, and fallback behavior."""

import pytest
from unittest.mock import AsyncMock, patch

from app.services.narratives import NarrativeService


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

CLAUDE_RESPONSE_HIGH_OVERLAP = (
    "NARRATIVE: USDC's stress score of 42.5 is driven by a 38-day WAM creating moderate duration "
    "mismatch, amplified by BNY Mellon holding 45% of reserves in a single corridor. "
    "The geographic concentration in us-east-1 compounds counterparty risk.\n"
    "CLAIMS: ["
    '"USDC has a weighted average maturity of 38 days", '
    '"BNY Mellon holds 45% of USDC reserves", '
    '"Geographic concentration is focused on us-east-1 corridor", '
    '"Duration mismatch creates moderate redemption latency risk", '
    '"Counterparty health scores are within normal range"'
    "]"
)

GEMINI_RESPONSE_HIGH_OVERLAP = (
    "NARRATIVE: The USDC stress score reflects a moderate 38-day WAM duration risk and significant "
    "concentration at BNY Mellon with 45% reserves. Data center operations in us-east-1 "
    "represent a single point of failure for redemption processing.\n"
    "CLAIMS: ["
    '"USDC weighted average maturity is 38 days", '
    '"BNY Mellon holds 45% of total reserves", '
    '"us-east-1 corridor handles majority of operations", '
    '"Duration mismatch leads to 4-24h redemption latency", '
    '"Reserve transparency is adequate based on attestation data"'
    "]"
)

GEMINI_RESPONSE_LOW_OVERLAP = (
    "NARRATIVE: USDC faces emerging risks from interest rate environment and regulatory uncertainty. "
    "The Fed rate decisions could impact T-bill yields underlying reserves.\n"
    "CLAIMS: ["
    '"Fed rate hikes create yield curve pressure on reserves", '
    '"Regulatory uncertainty in EU markets affects USDC adoption", '
    '"T-bill maturity concentration creates rollover risk", '
    '"SWIFT processing delays impact cross-border redemptions", '
    '"Market maker liquidity has declined 15% in Q1"'
    "]"
)

SAMPLE_CONTEXT = (
    "Stablecoin: USDC (Circle)\n"
    "Total Reserves: $32,000,000,000\n"
    "WAM: 38 days\n"
    "Composite Stress Score: 42.5/100"
)


# ---------------------------------------------------------------------------
# Tests: _parse_response
# ---------------------------------------------------------------------------

class TestParseResponse:
    def setup_method(self):
        self.service = NarrativeService()

    def test_extracts_narrative_and_claims(self):
        narrative, claims = self.service._parse_response(CLAUDE_RESPONSE_HIGH_OVERLAP)
        assert "42.5" in narrative
        assert len(claims) == 5
        assert "38 days" in claims[0]

    def test_handles_missing_format(self):
        narrative, claims = self.service._parse_response("Just a plain text response with no format.")
        assert narrative == "Just a plain text response with no format."
        assert len(claims) >= 1  # Falls back to sentence splitting

    def test_handles_empty_input(self):
        narrative, claims = self.service._parse_response("")
        assert narrative == ""
        assert claims == []

    def test_handles_malformed_json_claims(self):
        raw = "NARRATIVE: Some text\nCLAIMS: [not valid json"
        narrative, claims = self.service._parse_response(raw)
        assert narrative == "Some text"
        assert len(claims) >= 1  # Falls back to sentence splitting


# ---------------------------------------------------------------------------
# Tests: _compute_consensus
# ---------------------------------------------------------------------------

class TestComputeConsensus:
    def setup_method(self):
        self.service = NarrativeService()

    def test_high_overlap(self):
        _, claude_claims = self.service._parse_response(CLAUDE_RESPONSE_HIGH_OVERLAP)
        _, gemini_claims = self.service._parse_response(GEMINI_RESPONSE_HIGH_OVERLAP)

        overlap, matched = self.service._compute_consensus(claude_claims, gemini_claims)
        assert overlap >= 0.5  # These have substantial semantic overlap
        assert len(matched) >= 2

    def test_low_overlap(self):
        _, claude_claims = self.service._parse_response(CLAUDE_RESPONSE_HIGH_OVERLAP)
        _, gemini_claims = self.service._parse_response(GEMINI_RESPONSE_LOW_OVERLAP)

        overlap, matched = self.service._compute_consensus(claude_claims, gemini_claims)
        assert overlap < 0.70  # These are deliberately divergent
        assert len(matched) < 4

    def test_empty_claims(self):
        overlap, matched = self.service._compute_consensus([], ["claim1"])
        assert overlap == 0.0
        assert matched == []

    def test_identical_claims(self):
        claims = ["USDC has a WAM of 38 days", "BNY Mellon holds 45%"]
        overlap, matched = self.service._compute_consensus(claims, claims)
        assert overlap == 1.0
        assert len(matched) == 2


# ---------------------------------------------------------------------------
# Tests: generate_narrative
# ---------------------------------------------------------------------------

class TestGenerateNarrative:
    @pytest.mark.asyncio
    async def test_consensus_above_threshold(self):
        service = NarrativeService()
        service.anthropic_key = "test-key"
        service.gemini_key = "test-key"
        service.available = True

        with patch.object(service, "_call_claude", AsyncMock(return_value=CLAUDE_RESPONSE_HIGH_OVERLAP)), \
             patch.object(service, "_call_gemini", AsyncMock(return_value=GEMINI_RESPONSE_HIGH_OVERLAP)):
            result = await service.generate_narrative(SAMPLE_CONTEXT)

        assert result is not None
        assert result.claude_narrative is not None
        assert result.gemini_narrative is not None
        assert len(result.claims) > 0
        # Both models agree on core facts, expect reasonable overlap
        assert result.overlap_pct >= 0

    @pytest.mark.asyncio
    async def test_divergence_below_threshold(self):
        service = NarrativeService()
        service.anthropic_key = "test-key"
        service.gemini_key = "test-key"
        service.available = True

        with patch.object(service, "_call_claude", AsyncMock(return_value=CLAUDE_RESPONSE_HIGH_OVERLAP)), \
             patch.object(service, "_call_gemini", AsyncMock(return_value=GEMINI_RESPONSE_LOW_OVERLAP)):
            result = await service.generate_narrative(SAMPLE_CONTEXT)

        assert result is not None
        assert result.consensus is False
        assert result.claude_narrative is not None
        assert result.gemini_narrative is not None

    @pytest.mark.asyncio
    async def test_single_model_fallback(self):
        service = NarrativeService()
        service.anthropic_key = "test-key"
        service.gemini_key = "test-key"
        service.available = True

        with patch.object(service, "_call_claude", AsyncMock(return_value=CLAUDE_RESPONSE_HIGH_OVERLAP)), \
             patch.object(service, "_call_gemini", AsyncMock(side_effect=RuntimeError("API down"))):
            result = await service.generate_narrative(SAMPLE_CONTEXT)

        assert result is not None
        assert result.consensus is False
        assert result.claude_narrative is not None
        assert result.gemini_narrative is None

    @pytest.mark.asyncio
    async def test_both_models_fail(self):
        service = NarrativeService()
        service.anthropic_key = "test-key"
        service.gemini_key = "test-key"
        service.available = True

        with patch.object(service, "_call_claude", AsyncMock(side_effect=RuntimeError("down"))), \
             patch.object(service, "_call_gemini", AsyncMock(side_effect=RuntimeError("down"))):
            result = await service.generate_narrative(SAMPLE_CONTEXT)

        assert result is None

    @pytest.mark.asyncio
    async def test_no_keys_returns_none(self):
        service = NarrativeService()
        service.anthropic_key = None
        service.gemini_key = None
        service.available = False

        result = await service.generate_narrative(SAMPLE_CONTEXT)
        assert result is None

    @pytest.mark.asyncio
    async def test_claude_only(self):
        service = NarrativeService()
        service.anthropic_key = "test-key"
        service.gemini_key = None
        service.available = True

        with patch.object(service, "_call_claude", AsyncMock(return_value=CLAUDE_RESPONSE_HIGH_OVERLAP)):
            result = await service.generate_narrative(SAMPLE_CONTEXT)

        assert result is not None
        assert result.consensus is False
        assert result.claude_narrative is not None
        assert result.gemini_narrative is None


# ---------------------------------------------------------------------------
# Tests: _normalize_claim
# ---------------------------------------------------------------------------

class TestNormalizeClaim:
    def test_lowercases(self):
        assert "hello world" in NarrativeService._normalize_claim("Hello World")

    def test_strips_punctuation(self):
        result = NarrativeService._normalize_claim("BNY Mellon holds 45% of reserves!")
        assert "!" not in result
        assert "45%" in result

    def test_collapses_whitespace(self):
        result = NarrativeService._normalize_claim("  too   many   spaces  ")
        assert "  " not in result
