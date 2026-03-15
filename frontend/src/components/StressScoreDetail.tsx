import { useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePolling } from '../hooks/usePolling'
import { fetchStressScore } from '../lib/api'
import { DataSourceBadge } from './DataSourceBadge'
import { NarrativeCard } from './NarrativeCard'
import { TrustBadge } from './TrustBadge'
import type { StressScore } from '../lib/types'

function scoreColor(score: number): string {
  if (score <= 25) return '#00b894'
  if (score <= 50) return '#e17055'
  if (score <= 75) return '#e17055'
  return '#e84393'
}

export function StressScoreDetail() {
  const { symbol } = useParams<{ symbol: string }>()
  const fetcher = useCallback(() => fetchStressScore(symbol || ''), [symbol])
  const { data: score, loading, error } = usePolling<StressScore>(fetcher, 60000)

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="animate-pulse h-4 w-16 bg-white/[0.04] rounded" />
        <div className="animate-pulse h-32 bg-white/[0.03] rounded" />
        <div className="animate-pulse h-64 bg-white/[0.03] rounded" />
      </div>
    )
  }

  if (error || !score) {
    return (
      <div className="py-12">
        <p className="text-[#e84393] font-medium mb-1">Failed to load {symbol}</p>
        <p className="text-sm text-[#666] mb-4">{error}</p>
        <Link to="/" className="text-xs text-[#555] hover:text-[#888] transition-colors">
          ← Dashboard
        </Link>
      </div>
    )
  }

  const dimChartData = score.dimensions.map(d => ({
    name: d.name.replace(/\s*\(.*\)/, ''),
    score: d.score,
    weighted: d.weighted_score,
    weight: `${(d.weight * 100).toFixed(0)}%`,
  }))

  return (
    <div className="space-y-10">
      {/* Back link */}
      <Link to="/" className="text-xs text-[#555] hover:text-[#888] transition-colors">
        ← Dashboard
      </Link>

      {/* Hero: symbol + metrics, no wrapper box */}
      <div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">{score.stablecoin}</h2>
            <p className="text-[10px] text-[#444] mt-1 uppercase tracking-wider">Liquidity Stress Score</p>
          </div>
          <DataSourceBadge source={score.resolution_source} />
        </div>
        <div className="flex items-end gap-10">
          <div>
            <div className="text-[4.5rem] font-bold leading-none tabular-nums" style={{ color: scoreColor(score.stress_score) }}>
              {score.stress_score}
            </div>
            <p className="text-xs text-[#555] mt-2 uppercase tracking-wider">{score.stress_level}</p>
          </div>
          <div className="pb-2 border-l border-white/[0.06] pl-10 flex gap-10">
            <div>
              <div className="text-2xl font-semibold text-[#ccc]">{score.redemption_latency_hours}</div>
              <p className="text-[10px] text-[#444] mt-1.5 uppercase tracking-wider">Latency</p>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#ccc]">{score.liquidity_coverage_ratio}</div>
              <p className="text-[10px] text-[#444] mt-1.5 uppercase tracking-wider">Coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Dimension Breakdown */}
      <div className="pt-6 border-t border-white/[0.05]">
        <p className="text-[10px] font-semibold text-[#444] uppercase tracking-wider mb-5">
          6-Dimension Breakdown
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dimChartData} layout="vertical" margin={{ left: 140 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#555' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#666' }} width={130} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}`,
                name === 'weighted' ? 'Weighted Score' : 'Raw Score'
              ]}
              contentStyle={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#13111f', color: '#ddd', fontSize: 12 }}
              wrapperStyle={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
              labelStyle={{ color: '#ddd' }}
              itemStyle={{ color: '#888' }}
            />
            <Bar dataKey="score" radius={[0, 3, 3, 0]} barSize={14}>
              {dimChartData.map((entry, i) => (
                <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-5 space-y-2.5">
          {score.dimensions.map((d, i) => (
            <div key={i} className="flex items-baseline justify-between text-xs text-[#555]">
              <span>{d.name} <span className="text-[#3a3a3a]">· {(d.weight * 100).toFixed(0)}%</span></span>
              <span className="text-[#666] text-right max-w-xs">{d.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div className="pt-6 border-t border-white/[0.05]">
        <NarrativeCard narrative={score.narrative} />
      </div>

      {/* Verification metadata — single compact line */}
      <TrustBadge ipfsCid={score.ipfs_cid} jury={score.jury} stablecoin={score.stablecoin} />
    </div>
  )
}
