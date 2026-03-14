import { useState } from 'react'
import type { NarrativeResult } from '../lib/types'

interface NarrativeCardProps {
    narrative: NarrativeResult | string | null
}

export function NarrativeCard({ narrative }: NarrativeCardProps) {
    const [showClaims, setShowClaims] = useState(false)
    const [showBoth, setShowBoth] = useState(false)

    if (!narrative) return null

    // Backward compatibility: plain string from old format
    if (typeof narrative === 'string') {
        return (
            <div id="narrative-card">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                    Causal Narrative
                </h3>
                <p className="text-sm text-[#aaa] leading-relaxed">{narrative}</p>
            </div>
        )
    }

    const n = narrative as NarrativeResult

    return (
        <div id="narrative-card">
            {/* Header with consensus badge */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Causal Narrative
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[#888]">
                        {n.overlap_pct}% overlap
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${n.consensus
                            ? 'bg-[#00b894]/10 text-[#00b894]'
                            : 'bg-[#e17055]/10 text-[#e17055]'
                        }`}>
                        {n.consensus ? 'CONSENSUS' : 'DIVERGENCE'}
                    </span>
                </div>
            </div>

            {/* Main narrative text */}
            <p className="text-sm text-[#aaa] leading-relaxed mb-4">{n.narrative}</p>

            {/* Show both models toggle (only when divergence) */}
            {!n.consensus && n.claude_narrative && n.gemini_narrative && (
                <div className="mb-4">
                    <button
                        onClick={() => setShowBoth(!showBoth)}
                        className="text-xs text-[#6c5ce7] hover:underline font-medium"
                        id="toggle-both-narratives"
                    >
                        {showBoth ? 'Hide individual narratives' : 'Show both model narratives'}
                    </button>
                    {showBoth && (
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-4">
                                <p className="text-xs font-semibold text-[#6c5ce7] mb-2 uppercase tracking-wider">Claude</p>
                                <p className="text-xs text-[#aaa] leading-relaxed">{n.claude_narrative}</p>
                            </div>
                            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-4">
                                <p className="text-xs font-semibold text-[#0ea5e9] mb-2 uppercase tracking-wider">Gemini</p>
                                <p className="text-xs text-[#aaa] leading-relaxed">{n.gemini_narrative}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Claims section */}
            {n.claims.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowClaims(!showClaims)}
                        className="text-xs text-[#6c5ce7] hover:underline font-medium"
                        id="toggle-claims"
                    >
                        {showClaims ? 'Hide claims' : `Show ${n.claims.length} extracted claims`}
                    </button>
                    {showClaims && (
                        <div className="mt-3 space-y-2">
                            {n.claims.map((claim, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <div className="flex gap-1 mt-0.5 shrink-0">
                                        {claim.supported_by.map((model) => (
                                            <span
                                                key={model}
                                                className={`w-2 h-2 rounded-full ${model === 'claude' ? 'bg-[#6c5ce7]' : 'bg-[#0ea5e9]'
                                                    }`}
                                                title={model}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[#aaa]">{claim.text}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/[0.06] text-xs text-[#888]">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#6c5ce7]" /> Claude
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" /> Gemini
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
