import type { JuryResult } from '../lib/types'

interface Props {
  ipfsCid: string | null
  jury: JuryResult | null
  stablecoin?: string
}

export function TrustBadge({ ipfsCid, jury, stablecoin }: Props) {
  if (!ipfsCid && !jury) return null

  const isMock = ipfsCid?.startsWith('QmMock') ?? false
  const gatewayUrl = ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : null
  const truncatedCid = ipfsCid
    ? `${ipfsCid.slice(0, 8)}...${ipfsCid.slice(-4)}`
    : null

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Verification &amp; Trust
      </h3>

      <div className="space-y-3">
        {/* IPFS verification row */}
        {ipfsCid && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isMock ? 'bg-[#e17055]' : 'bg-[#00b894]'}`} />
              <span className="text-sm text-[#aaa]">
                {isMock ? 'IPFS Verification (Demo)' : 'Verified on IPFS'}
              </span>
            </div>
            {gatewayUrl && (
              <a
                href={gatewayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#6c5ce7] hover:underline"
              >
                {truncatedCid}
              </a>
            )}
          </div>
        )}

        {/* Model consensus row */}
        {jury && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-[#aaa]">
              <span>Claude: <strong className="text-white">{jury.claude_score.toFixed(0)}</strong></span>
              <span>Gemini: <strong className="text-white">{jury.gemini_score.toFixed(0)}</strong></span>
              <span>Delta: <strong className="text-white">{jury.delta.toFixed(0)}</strong></span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              jury.consensus
                ? 'bg-[#00b894]/10 text-[#00b894]'
                : 'bg-[#e17055]/10 text-[#e17055]'
            }`}>
              {jury.consensus ? 'SIGNAL CONFIRMED' : 'MODELS DIVERGE'}
            </span>
          </div>
        )}

        {/* Oracle-ready label */}
        <div className="flex flex-col gap-1 pt-1 border-t border-black/4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#bbb] uppercase tracking-wider">
              TEE-ready for Chainlink
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              ipfsCid && !isMock
                ? 'bg-[#00b894]/10 text-[#00b894]'
                : 'bg-black/4 text-[#888]'
            }`}>
              Chainlink Ready
            </span>
            {isMock && (
              <span className="text-[10px] text-[#e17055] font-medium">
                Demo Mode — IPFS verification simulated
              </span>
            )}
          </div>
          {stablecoin && (
            <span className="font-mono text-[10px] bg-black/4 px-1.5 py-0.5 rounded text-[#aaa] w-fit">
              /api/oracle/{stablecoin.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
