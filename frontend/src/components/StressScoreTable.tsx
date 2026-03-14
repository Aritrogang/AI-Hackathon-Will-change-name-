import { useNavigate } from 'react-router-dom'
import { DataSourceBadge } from './DataSourceBadge'
import type { StressScore } from '../lib/types'

interface Props {
  scores: StressScore[]
  loading: boolean
}

function scoreColor(score: number): string {
  if (score <= 25) return '#00b894'
  if (score <= 50) return '#e17055'
  if (score <= 75) return '#e17055'
  return '#e84393'
}

function levelBg(level: string): string {
  if (level.includes('Low')) return 'bg-[#00b894]/10 text-[#00b894]'
  if (level.includes('Moderate')) return 'bg-[#e17055]/10 text-[#e17055]'
  if (level.includes('Elevated')) return 'bg-[#e17055]/15 text-[#e17055]'
  return 'bg-[#e84393]/10 text-[#e84393]'
}

export function StressScoreTable({ scores, loading }: Props) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-white/[0.04] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Liquidity Stress Scores
        </h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs text-[#888] uppercase tracking-wider border-b border-white/[0.06]">
            <th className="px-6 py-3 text-left font-medium">Stablecoin</th>
            <th className="px-6 py-3 text-left font-medium">Score</th>
            <th className="px-6 py-3 text-left font-medium">Level</th>
            <th className="px-6 py-3 text-left font-medium">Latency</th>
            <th className="px-6 py-3 text-left font-medium">Coverage</th>
            <th className="px-6 py-3 text-left font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(score => (
            <tr
              key={score.stablecoin}
              onClick={() => navigate(`/stablecoin/${score.stablecoin}`)}
              className="border-b border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              <td className="px-6 py-4">
                <span className="font-semibold text-white">{score.stablecoin}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color: scoreColor(score.stress_score) }}>
                    {score.stress_score}
                  </span>
                  <div className="w-24 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${score.stress_score}%`,
                        backgroundColor: scoreColor(score.stress_score),
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelBg(score.stress_level)}`}>
                  {score.stress_level}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-[#aaa]">{score.redemption_latency_hours}</td>
              <td className="px-6 py-4 text-sm text-[#aaa]">{score.liquidity_coverage_ratio}</td>
              <td className="px-6 py-4">
                <DataSourceBadge source={score.resolution_source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
