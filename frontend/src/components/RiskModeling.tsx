import { useState, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePolling } from '../hooks/usePolling'
import { fetchActiveScenarios } from '../lib/api'
import type { DetectedScenario } from '../lib/types'

function scoreColor(score: number): string {
  if (score <= 25) return '#00b894'
  if (score <= 75) return '#e17055'
  return '#e84393'
}

function scenarioIcon(type: string): string {
  if (type === 'weather') return '\u{1F300}'
  if (type === 'rate') return '\u{1F4C8}'
  if (type === 'bank') return '\u{1F3E6}'
  return '\u{26A0}\u{FE0F}'
}

function severityLabel(severity: number): string {
  if (severity >= 4) return 'Critical'
  if (severity >= 3) return 'Elevated'
  if (severity >= 2) return 'Moderate'
  return 'Low'
}

function severityColor(severity: number): string {
  if (severity >= 4) return '#e84393'
  if (severity >= 3) return '#e17055'
  return '#00b894'
}

export function RiskModeling() {
  const fetcher = useCallback(() => fetchActiveScenarios(), [])
  const { data: scenarios, loading } = usePolling<DetectedScenario[]>(fetcher, 120000)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-xl border border-black/6 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#0f0f0f] uppercase tracking-wider">
            System-Detected Risk Scenarios
          </h2>
          <p className="text-xs text-[#888] mt-1">
            AI-generated projections from live NOAA, FDIC, and macro data feeds
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00b894] animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="p-6">
        {loading && !scenarios && (
          <div className="text-sm text-[#888] text-center py-8">Scanning data feeds...</div>
        )}

        {scenarios && scenarios.length === 0 && (
          <div className="text-sm text-[#888] text-center py-8">
            No active risk scenarios detected. All data feeds nominal.
          </div>
        )}

        {scenarios && scenarios.length > 0 && (
          <div className="space-y-3">
            {scenarios.map(scenario => {
              const isExpanded = expandedId === scenario.id
              const proj = scenario.projection

              return (
                <div
                  key={scenario.id}
                  className={`border rounded-lg transition-colors cursor-pointer ${
                    isExpanded ? 'border-[#6c5ce7]/30 bg-[#f3f2f7]/50' : 'border-black/6 hover:border-black/12'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                >
                  {/* Scenario card header */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">{scenarioIcon(scenario.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0f0f0f] truncate">{scenario.title}</span>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ color: severityColor(scenario.severity), backgroundColor: severityColor(scenario.severity) + '15' }}
                        >
                          {severityLabel(scenario.severity)}
                        </span>
                        <span className="text-[10px] font-medium text-[#888] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/4">
                          {scenario.source}
                        </span>
                      </div>
                      <p className="text-xs text-[#888] mt-0.5 line-clamp-1">{scenario.description}</p>
                    </div>
                    {proj && (
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${proj.delta > 0 ? 'text-[#e84393]' : 'text-[#00b894]'}`}>
                          {proj.delta > 0 ? '+' : ''}{proj.delta}
                        </div>
                        <div className="text-[10px] text-[#888] uppercase tracking-wider">Impact</div>
                      </div>
                    )}
                    <svg className={`w-4 h-4 text-[#888] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && proj && (
                    <div className="px-4 pb-4 border-t border-black/4 pt-4">
                      <p className="text-xs text-[#555] mb-4">{scenario.description}</p>

                      {/* Score comparison */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-black/6">
                          <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Current</p>
                          <p className="text-2xl font-bold" style={{ color: scoreColor(proj.baseline.stress_score) }}>
                            {proj.baseline.stress_score}
                          </p>
                          <p className="text-[10px] text-[#888] mt-0.5">{proj.baseline.stress_level}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-black/6">
                          <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Projected</p>
                          <p className="text-2xl font-bold" style={{ color: scoreColor(proj.projected.stress_score) }}>
                            {proj.projected.stress_score}
                          </p>
                          <p className="text-[10px] text-[#888] mt-0.5">{proj.projected.stress_level}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-black/6">
                          <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Impact</p>
                          <p className={`text-2xl font-bold ${proj.delta > 0 ? 'text-[#e84393]' : 'text-[#00b894]'}`}>
                            {proj.delta > 0 ? '+' : ''}{proj.delta}
                          </p>
                          <p className="text-[10px] text-[#888] mt-0.5">
                            Latency: {proj.baseline.redemption_latency_hours} → {proj.projected.redemption_latency_hours}
                          </p>
                        </div>
                      </div>

                      {/* Dimension chart */}
                      {proj.dimensions && proj.dimensions.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-semibold text-[#0f0f0f] uppercase tracking-wider mb-2">
                            Per-Dimension Impact
                          </h3>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                              data={proj.dimensions.map(d => ({
                                name: d.name.replace(/\s*\(.*\)/, ''),
                                baseline: d.baseline_score,
                                projected: d.projected_score,
                                delta: d.delta,
                              }))}
                              layout="vertical"
                              margin={{ left: 120 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f3f2f7" />
                              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#888' }} />
                              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#555' }} width={110} />
                              <Tooltip
                                contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 11 }}
                                formatter={(value: number, name: string) => [
                                  value.toFixed(1),
                                  name === 'baseline' ? 'Current' : 'Projected',
                                ]}
                              />
                              <Bar dataKey="baseline" fill="#a29bfe" fillOpacity={0.4} radius={[0, 3, 3, 0]} barSize={8} />
                              <Bar dataKey="projected" radius={[0, 3, 3, 0]} barSize={8}>
                                {proj.dimensions.map((_d, i) => (
                                  <Cell key={i} fill={proj.dimensions[i].delta > 5 ? '#e84393' : proj.dimensions[i].delta > 0 ? '#e17055' : '#00b894'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Affected stablecoins */}
                      {scenario.affected_stablecoins.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] text-[#888] uppercase tracking-wider">Affected:</span>
                          {scenario.affected_stablecoins.map(s => (
                            <span key={s} className="text-xs font-medium text-[#6c5ce7] bg-[#6c5ce7]/10 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
