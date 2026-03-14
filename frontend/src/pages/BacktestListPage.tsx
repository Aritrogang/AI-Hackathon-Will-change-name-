import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { usePolling } from '../hooks/usePolling'
import { fetchBacktests } from '../lib/api'
import type { BacktestSummary } from '../lib/types'

export function BacktestListPage() {
  const fetcher = useCallback(() => fetchBacktests(), [])
  const { data: backtests, loading, error } = usePolling<BacktestSummary[]>(fetcher, 120000)

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Historical Backtests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-pulse h-40 bg-white/[0.04] rounded-xl" />
          <div className="animate-pulse h-40 bg-white/[0.04] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !backtests) {
    return (
      <div className="text-center">
        <p className="text-[#e84393] font-medium mb-2">Failed to load backtests</p>
        <p className="text-sm text-[#888]">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Historical Backtests</h2>
        <p className="text-sm text-[#888] mt-1">
          Replay historical stress events to see how the scoring engine would have performed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {backtests.map(bt => (
          <Link
            key={bt.id}
            to={`/backtests/${bt.id}`}
            className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 hover:border-[#6c5ce7]/30 hover:shadow-md transition-all group"
          >
            <h3 className="text-base font-semibold text-white group-hover:text-[#6c5ce7] transition-colors">
              {bt.name}
            </h3>
            <p className="text-sm text-[#aaa] mt-2 leading-relaxed">{bt.description}</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-[#888]">
              <span>{bt.data_points} data points</span>
              <span className="text-[#bbb]">&middot;</span>
              <span>{bt.date_range}</span>
            </div>
            <div className="mt-3 text-xs font-medium text-[#6c5ce7] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
              View timeline
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
