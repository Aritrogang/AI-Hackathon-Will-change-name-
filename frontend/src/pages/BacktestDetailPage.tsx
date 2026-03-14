import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePolling } from '../hooks/usePolling'
import { fetchBacktest } from '../lib/api'
import { BacktestTimeline } from '../components/BacktestTimeline'
import { TimelineScrubber } from '../components/TimelineScrubber'
import type { BacktestResult } from '../lib/types'

export function BacktestDetailPage() {
  const { name } = useParams<{ name: string }>()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const fetcher = useCallback(() => fetchBacktest(name || ''), [name])
  const { data: backtest, loading, error } = usePolling<BacktestResult>(fetcher, 120000)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-10 w-48 bg-white/[0.04] rounded-lg" />
        <div className="animate-pulse h-80 bg-white/[0.04] rounded-xl" />
        <div className="animate-pulse h-96 bg-white/[0.04] rounded-xl" />
      </div>
    )
  }

  if (error || !backtest) {
    return (
      <div className="text-center">
        <p className="text-[#e84393] font-medium mb-2">Failed to load backtest</p>
        <p className="text-sm text-[#888]">{error}</p>
        <Link to="/backtests" className="text-sm text-[#6c5ce7] hover:underline mt-4 inline-block">
          Back to Backtests
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/backtests" className="text-sm text-[#6c5ce7] hover:underline inline-flex items-center gap-1">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Back to Backtests
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">{backtest.name}</h2>
        <p className="text-sm text-[#aaa] mt-1">{backtest.description}</p>
      </div>

      {/* Key insight banner */}
      {backtest.key_insight && (
        <div className="bg-[#6c5ce7]/5 border border-[#6c5ce7]/15 rounded-xl px-5 py-3">
          <p className="text-xs font-semibold text-[#6c5ce7] uppercase tracking-wider mb-1">
            Key Insight
          </p>
          <p className="text-sm text-[#aaa] leading-relaxed">{backtest.key_insight}</p>
        </div>
      )}

      {/* Critical date callout */}
      {backtest.critical_date && (
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e84393]" />
          Critical threshold crossed on{' '}
          <span className="font-semibold text-[#e84393]">{backtest.critical_date}</span>
        </div>
      )}

      {/* Timeline chart */}
      <BacktestTimeline
        timeline={backtest.timeline}
        criticalDate={backtest.critical_date}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
      />

      {/* Scrubber + detail */}
      <TimelineScrubber
        timeline={backtest.timeline}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
      />
    </div>
  )
}
