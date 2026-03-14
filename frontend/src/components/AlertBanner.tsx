import { useCallback } from 'react'
import { usePolling } from '../hooks/usePolling'
import { fetchActiveWeather } from '../lib/api'
import type { WeatherData } from '../lib/types'

export function AlertBanner() {
  const fetcher = useCallback(() => fetchActiveWeather(), [])
  const { data } = usePolling<WeatherData>(fetcher, 300000) // 5 min

  if (!data) return null

  const severeAlerts: Array<{ state: string; event: string; severity: string; headline: string }> = []

  for (const [state, info] of Object.entries(data.weather_alerts)) {
    for (const alert of info.alerts) {
      if (alert.severity === 'Extreme' || alert.severity === 'Severe') {
        severeAlerts.push({ state, ...alert })
      }
    }
  }

  if (severeAlerts.length === 0 && data.ops_impact.length === 0) return null

  return (
    <div className="bg-[#e17055]/8 border border-[#e17055]/20 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-[#e17055] mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#e17055] mb-1">
            Active Weather Alerts ({severeAlerts.length})
          </p>
          <div className="space-y-1">
            {severeAlerts.slice(0, 3).map((alert, i) => (
              <p key={i} className="text-xs text-[#aaa]">
                <span className="font-medium text-[#ccc]">{alert.event}</span> in {alert.state}: {alert.headline}
              </p>
            ))}
            {data.ops_impact.length > 0 && (
              <p className="text-xs text-[#e17055] font-medium mt-2">
                Ops Impact: {data.ops_impact.map(o => `${o.corridor_name} (${o.bank})`).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
