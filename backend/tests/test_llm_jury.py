import pytest
from unittest.mock import AsyncMock, patch
from app.services.llm_jury import LLMJuryService
from app.models.stress import JuryResult

@pytest.fixture
def jury():
    with patch.dict("os.environ", {"ANTHROPIC_API_KEY": "fake", "GEMINI_API_KEY": "fake"}):
        return LLMJuryService()

def test_parse_score(jury):
    """Test the robust score parser for various LLM output formats."""
    # JSON format
    assert jury._parse_score('{"score": 85, "reasoning": "bad"}') == 85.0
    assert jury._parse_score('```json\n{"score": 42}\n```') == 42.0
    
    # Text fallback
    assert jury._parse_score("The score is 75 because...") == 75.0
    assert jury._parse_score("Risk level: 10/100") == 10.0
    
    # Garbage fallback
    assert jury._parse_score("I don't know") == 50.0

@pytest.mark.asyncio
async def test_consensus_logic(jury):
    """Verify that consensus is True only when models disagree by <= 15 points."""
    with patch.object(jury, "_call_claude", new_callable=AsyncMock) as mock_claude, \
         patch.object(jury, "_call_gemini", new_callable=AsyncMock) as mock_gemini:
        
        # Test Case 1: Close agreement (Delta = 10)
        mock_claude.return_value = '{"score": 70}'
        mock_gemini.return_value = '{"score": 80}'
        result = await jury.evaluate_counterparty_health("context")
        assert result.consensus is True
        assert result.delta == 10.0
        assert result.warning is None

        # Test Case 2: Divergence (Delta = 30)
        mock_claude.return_value = '{"score": 40}'
        mock_gemini.return_value = '{"score": 70}'
        result = await jury.evaluate_counterparty_health("context")
        assert result.consensus is False
        assert result.delta == 30.0
        assert "disagree" in result.warning

@pytest.mark.asyncio
async def test_graceful_degradation_missing_keys():
    """Verify return None if keys are missing."""
    with patch.dict("os.environ", {}, clear=True):
        jury = LLMJuryService()
        assert jury.available is False
        result = await jury.evaluate_counterparty_health("context")
        assert result is None

@pytest.mark.asyncio
async def test_partial_failure_handling(jury):
    """One model fails, other succeeds."""
    with patch.object(jury, "_call_claude", new_callable=AsyncMock) as mock_claude, \
         patch.object(jury, "_call_gemini", new_callable=AsyncMock) as mock_gemini:
        
        mock_claude.return_value = '{"score": 90}'
        mock_gemini.side_effect = Exception("API Down")
        
        result = await jury.evaluate_counterparty_health("context")
        assert result is not None
        assert result.claude_score == 90.0
        assert result.gemini_score == 50.0 # Default fallback for exception
        assert result.consensus is False
