import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { BacktestEvent } from '../lib/types'

function scoreColor(score: number): string {
  if (score <= 25) return '#00b894'
  if (score <= 75) return '#e17055'
  return '#e84393'
}

interface Props {
  timeline: BacktestEvent[]
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

export function TimelineScrubber({ timeline, selectedIndex, onSelectIndex }: Props) {
  const event = timeline[selectedIndex]
  if (!event) return null

  const dimChartData = event.dimensions.map(d => ({
    name: d.name.replace(/\s*\(.*\)/, ''),
    score: d.score,
    weighted: d.weighted_score,
    weight: `${(d.weight * 100).toFixed(0)}%`,
  }))

  // Detect backtest type by checking hurricane-specific fields
  const isHurricane = event.hurricane_category != null || event.hurricane_lat != null

  return (
    <div className="space-y-4">
      {/* Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#888] uppercase tracking-wider font-semibold">
            Timeline Scrubber
          </span>
          <span className="text-xs text-[#aaa] font-medium">{event.date}</span>
        </div>
        <input
          type="range"
          min={0}
          max={timeline.length - 1}
          value={selectedIndex}
          onChange={e => onSelectIndex(Number(e.target.value))}
          className="w-full h-1.5 bg-white/[0.04] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6c5ce7]
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#bbb] mt-1">
          <span>{timeline[0].date}</span>
          <span>{timeline[timeline.length - 1].date}</span>
        </div>
      </div>

      {/* Summary card */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-[#888] uppercase tracking-wider font-semibold">
              {event.date}
            </p>
            <div className="text-4xl font-bold mt-1" style={{ color: scoreColor(event.stress_score) }}>
              {event.stress_score}
            </div>
            <p className="text-xs text-[#888] mt-1">{event.level}</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <div className="text-lg font-bold text-white">{event.latency_hours}</div>
              <p className="text-[10px] text-[#888] uppercase tracking-wider">Latency</p>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{event.coverage_ratio}</div>
              <p className="text-[10px] text-[#888] uppercase tracking-wider">Coverage</p>
            </div>
          </div>
        </div>

        {/* Event annotation */}
        {event.event && (
          <div className="bg-[#6c5ce7]/5 border border-[#6c5ce7]/15 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-[#aaa]">{event.event}</p>
          </div>
        )}

        {/* Contextual metadata */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {isHurricane ? (
            <>
              {event.hurricane_category != null && (
                <MetricPill label="Hurricane Cat" value={`${event.hurricane_category}`} />
              )}
              {event.hurricane_lat != null && (
                <MetricPill
                  label="Position"
                  value={`${event.hurricane_lat?.toFixed(1)}, ${event.hurricane_lng?.toFixed(1)}`}
                />
              )}
              {event.bank_avg_ltv != null && (
                <MetricPill label="FL Bank Avg LTV" value={event.bank_avg_ltv.toFixed(2)} />
              )}
              {event.tusd_stress_score != null && (
                <MetricPill label="TUSD Stress" value={`${event.tusd_stress_score}`} />
              )}
            </>
          ) : (
            <>
              {event.wam_days != null && (
                <MetricPill label="WAM (days)" value={`${event.wam_days}`} />
              )}
              {event.fed_rate_bps != null && (
                <MetricPill label="Fed Rate (bps)" value={`${event.fed_rate_bps}`} />
              )}
              {event.unrealized_losses_B != null && (
                <MetricPill label="Unrealized Losses" value={`$${event.unrealized_losses_B}B`} />
              )}
              <MetricPill
                label="USDC Peg"
                value={`$${event.usdc_peg.toFixed(3)}`}
                alert={event.usdc_peg < 0.95}
              />
            </>
          )}
        </div>

        {/* 6 Dimension Breakdown */}
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
          Dimension Breakdown
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dimChartData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#888' }} width={110} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}`,
                name === 'weighted' ? 'Weighted Score' : 'Raw Score',
              ]}
              contentStyle={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1a1825', color: '#e2e8f0', fontSize: 12 }}
              wrapperStyle={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
              labelStyle={{ color: '#e2e8f0' }}
              itemStyle={{ color: '#aaa' }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
              {dimChartData.map((entry, i) => (
                <Cell key={i} fill={scoreColor(entry.score)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 space-y-1">
          {event.dimensions.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] text-[#888] px-1">
              <span>
                {d.name} ({(d.weight * 100).toFixed(0)}%)
              </span>
              {d.detail && <span className="text-[#aaa] truncate ml-4 max-w-[50%] text-right">{d.detail}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricPill({
  label,
  value,
  alert,
}: {
  label: string
  value: string
  alert?: boolean
}) {
  return (
    <div className="bg-white/[0.04] rounded-lg px-3 py-2">
      <p className="text-[10px] text-[#888] uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold ${alert ? 'text-[#e84393]' : 'text-white'}`}>{value}</p>
    </div>
  )
}
