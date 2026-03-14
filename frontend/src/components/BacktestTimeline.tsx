import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import type { BacktestEvent } from '../lib/types'

function scoreColor(score: number): string {
  if (score <= 25) return '#00b894'
  if (score <= 75) return '#e17055'
  return '#e84393'
}

interface Props {
  timeline: BacktestEvent[]
  criticalDate: string | null
  selectedIndex: number
  onSelectIndex: (index: number) => void
}

export function BacktestTimeline({ timeline, criticalDate, selectedIndex, onSelectIndex }: Props) {
  const chartData = timeline.map((e, i) => ({
    date: e.date,
    score: e.stress_score,
    index: i,
    hasEvent: !!e.event,
    label: e.date.slice(5), // "03-08"
  }))

  const handleClick = (data: unknown) => {
    if (data && typeof data === 'object' && 'activeTooltipIndex' in data) {
      const idx = (data as { activeTooltipIndex: number }).activeTooltipIndex
      if (idx >= 0 && idx < timeline.length) onSelectIndex(idx)
    }
  }

  // Events with annotations
  const annotatedEvents = timeline
    .map((e, i) => ({ ...e, index: i }))
    .filter(e => e.event)

  return (
    <div>
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Stress Score Timeline
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
          onClick={handleClick}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e84393" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#e17055" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00b894" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#888' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#888' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            width={35}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              const idx = d.index
              const event = timeline[idx]
              return (
                <div className="bg-[#1a1825] rounded-lg border border-white/[0.1] p-3 shadow-lg text-xs max-w-[240px]">
                  <div className="font-semibold text-white">{event.date}</div>
                  <div className="mt-1">
                    Stress Score:{' '}
                    <span className="font-bold" style={{ color: scoreColor(event.stress_score) }}>
                      {event.stress_score}
                    </span>
                  </div>
                  <div className="text-[#888]">{event.level}</div>
                  {event.event && (
                    <div className="mt-1 text-[#aaa] border-t border-white/[0.06] pt-1">{event.event}</div>
                  )}
                </div>
              )
            }}
          />

          {/* Critical threshold line at 75 */}
          <ReferenceLine y={75} stroke="#e84393" strokeDasharray="6 3" strokeOpacity={0.5} />

          {/* Critical date vertical line */}
          {criticalDate && (
            <ReferenceLine
              x={criticalDate.slice(5)}
              stroke="#e84393"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'Critical',
                position: 'top',
                fill: '#e84393',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
          )}

          {/* Selected date vertical line */}
          {chartData[selectedIndex] && (
            <ReferenceLine
              x={chartData[selectedIndex].label}
              stroke="#6c5ce7"
              strokeWidth={2}
              strokeOpacity={0.7}
            />
          )}

          <Area
            type="monotone"
            dataKey="score"
            stroke="#6c5ce7"
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={({ cx, cy, index }: { cx: number; cy: number; index: number }) => {
              const isSelected = index === selectedIndex
              const event = timeline[index]
              return (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : event?.event ? 4 : 2.5}
                  fill={isSelected ? '#6c5ce7' : event?.event ? scoreColor(event.stress_score) : '#a29bfe'}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                />
              )
            }}
            activeDot={{ r: 6, fill: '#6c5ce7', stroke: '#fff', strokeWidth: 2 }}
          />

          {/* Annotated event markers */}
          {annotatedEvents.map(e => (
            <ReferenceDot
              key={e.index}
              x={e.date.slice(5)}
              y={e.stress_score}
              r={0}
              label={{
                value: '\u25CF',
                position: 'top',
                fill: scoreColor(e.stress_score),
                fontSize: 8,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-[#888]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-[#e84393] opacity-50" style={{ borderTop: '1px dashed #e84393' }} />
          Critical threshold (75)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#6c5ce7]" />
          Selected date
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e17055]" />
          Annotated event
        </span>
      </div>
    </div>
  )
}
