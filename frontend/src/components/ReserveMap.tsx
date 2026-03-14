import { useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from 'react-leaflet'
import { usePolling } from '../hooks/usePolling'
import { fetchGraph } from '../lib/api'
import type { GraphData } from '../lib/types'
import 'leaflet/dist/leaflet.css'

const CORRIDOR_COLORS: Record<string, string> = {
  'us-east-1': '#6c5ce7',
  'us-east-2': '#a29bfe',
  'us-west-2': '#00b894',
  'us-central': '#e17055',
  'eu-west-1': '#4834d4',
}

const CORRIDOR_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  'us-east-1': [[38.6, -78.1], [39.4, -77.0]],
  'us-east-2': [[39.9, -84.8], [42.3, -80.5]],
  'us-west-2': [[43.9, -124.6], [46.3, -116.5]],
  'us-central': [[40.0, -96.0], [43.0, -87.5]],
  'eu-west-1': [[51.3, -6.0], [55.4, 0.0]],
}

function scoreColor(ltv: number | null): string {
  if (ltv === null) return '#888'
  if (ltv < 0.6) return '#00b894'
  if (ltv < 0.7) return '#e17055'
  return '#e84393'
}

export function ReserveMap() {
  const fetcher = useCallback(() => fetchGraph(), [])
  const { data, loading } = usePolling<GraphData>(fetcher, 120000)

  if (loading || !data) {
    return (
      <div className="bg-white rounded-xl border border-black/6 h-[500px] flex items-center justify-center">
        <p className="text-sm text-[#888]">Loading map...</p>
      </div>
    )
  }

  const bankNodes = data.nodes.filter(n => n.type === 'bank' && n.lat && n.lng)
  const dcNodes = data.nodes.filter(n => n.type === 'datacenter')

  // Collect reserve edge info for bank nodes
  const bankEdges: Record<string, { percentage: number; stablecoins: string[] }> = {}
  for (const edge of data.edges) {
    if (edge.type === 'holds_reserves_at') {
      const bankId = edge.target
      if (!bankEdges[bankId]) bankEdges[bankId] = { percentage: 0, stablecoins: [] }
      bankEdges[bankId].percentage += (edge.percentage as number) || 0
      const coinNode = data.nodes.find(n => n.id === edge.source)
      if (coinNode?.symbol) {
        bankEdges[bankId].stablecoins.push(coinNode.symbol as string)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-black/6 overflow-hidden">
      <div className="px-6 py-4 border-b border-black/4">
        <h2 className="text-sm font-semibold text-[#0f0f0f] uppercase tracking-wider">
          Reserve Network Map
        </h2>
      </div>
      <MapContainer
        center={[38.0, -40.0]}
        zoom={3}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Data center corridor overlays */}
        {dcNodes.map(dc => {
          const corridorId = dc.corridor_id as string
          const bounds = CORRIDOR_BOUNDS[corridorId]
          if (!bounds) return null
          return (
            <Rectangle
              key={dc.id}
              bounds={bounds}
              pathOptions={{
                color: CORRIDOR_COLORS[corridorId] || '#6c5ce7',
                fillColor: CORRIDOR_COLORS[corridorId] || '#6c5ce7',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '4 4',
              }}
            >
              <Popup>
                <strong>{dc.name as string}</strong><br />
                Corridor: {corridorId}
              </Popup>
            </Rectangle>
          )
        })}

        {/* Bank markers */}
        {bankNodes.map(bank => {
          const lat = bank.lat as number
          const lng = bank.lng as number
          const ltv = bank.fdic_ltv_ratio as number | null
          const edgeInfo = bankEdges[bank.id]
          const radius = edgeInfo ? Math.max(6, edgeInfo.percentage / 4) : 6

          return (
            <CircleMarker
              key={bank.id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                color: scoreColor(ltv),
                fillColor: scoreColor(ltv),
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{bank.name as string}</strong><br />
                {bank.city as string}, {bank.state as string}<br />
                LTV: {ltv !== null ? (ltv * 100).toFixed(0) + '%' : 'N/A'}<br />
                Maturity: {bank.maturity_days as number}d<br />
                {edgeInfo && <>Reserves: {edgeInfo.percentage.toFixed(0)}% ({edgeInfo.stablecoins.join(', ')})</>}
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
