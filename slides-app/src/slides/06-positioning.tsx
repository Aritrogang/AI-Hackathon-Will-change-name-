import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const Dot = ({ color = "accent-light" }: { color?: string }) => (
  <span className={`w-1.5 h-1.5 rounded-full bg-${color} shrink-0 inline-block`} />
)

const layers = [
  {
    num: "Layer 1",
    numColor: "text-text-tertiary",
    borderColor: "border-black/15",
    title: "Onchain Data Platforms",
    desc: "Mint/burn flows, wallet balances, transaction history. Authoritative for onchain behavior.",
    tags: ["Dune", "Nansen", "Chainalysis"],
    tagClass: "bg-bg text-text-secondary",
    featured: false,
  },
  {
    num: "\u2605 Layer 2  - Katabatic",
    numColor: "text-accent",
    borderColor: "border-accent",
    title: "Reserve Risk Infrastructure",
    desc: "WAM duration risk, FDIC health, weather tail risk, LLM consensus. The structural fragility layer onchain can\u2019t see.",
    tags: ["stress_score", "latency_hours", "coverage_ratio"],
    tagClass: "bg-accent/[0.07] text-accent",
    featured: true,
  },
  {
    num: "Layer 3",
    numColor: "text-text-tertiary",
    borderColor: "border-black/15",
    title: "Downstream Consumers",
    desc: "DAO governance contracts, DeFi protocol rebalancing, institutional risk desks, Chainlink oracle feeds.",
    tags: ["MakerDAO", "Aave", "Risk Desks"],
    tagClass: "bg-bg text-text-secondary",
    featured: false,
  },
]

export function SlidePositioning(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="alt">
      <Eyebrow>Positioning</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        Onchain shows the flows.
        <br />
        Katabatic shows <span className="gradient-text">what&apos;s about to break.</span>
      </motion.h2>

      {/* 3 layers — accent border blocks with arrow flow */}
      <div className="grid grid-cols-3 gap-5 mt-3 mb-4">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.title}
            className={`border-l-4 ${layer.borderColor} pl-4 py-2 ${
              layer.featured ? "bg-accent/[0.04] -mx-2 px-6 rounded-r-lg" : ""
            }`}
            {...fadeUp(0.1 + i * 0.08)}
          >
            <div className={`text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-1.5 ${layer.numColor}`}>{layer.num}</div>
            <div className="text-[1.02rem] font-semibold text-text-primary mb-1">{layer.title}</div>
            <div className="text-[0.92rem] text-text-secondary leading-relaxed">{layer.desc}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {layer.tags.map(t => (
                <span key={t} className={`text-xs font-medium rounded-md px-2 py-0.5 ${layer.tagClass}`}>{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dark analogy section — inner boxes removed, bare text */}
      <motion.div
        className="bg-bg-dark rounded-2xl p-6 flex gap-6 items-start"
        {...fadeUp(0.35)}
      >
        <div className="flex-[1.3] border-r border-white/[0.09] pr-5">
          <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-light mb-2">The Analogy</div>
          <div className="text-[0.95rem] text-white/[0.92] leading-relaxed mb-1.5">
            Onchain data platforms became the system of record for what&apos;s happening onchain: the data layer Visa and a16z integrate into their own systems.
          </div>
          <div className="text-[0.95rem] text-white/55 leading-relaxed">
            The GENIUS Act is creating the same unlock for offchain reserve data. We are first to build the infrastructure layer above it.
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {/* Business model — bare text with accent border */}
          <div className="border-l-2 border-accent-light/40 pl-3.5">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-light mb-1">Business Model</div>
            <div className="text-[0.92rem] text-white/55 leading-relaxed">API-first &middot; Enterprise contracts<br />Warehouse delivery &middot; Real-time streaming</div>
          </div>
          {/* Moat — bare text with accent border */}
          <div className="border-l-2 border-accent-light/40 pl-3.5">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-light mb-1.5">Defensible Moat</div>
            <div className="flex flex-col gap-0.5">
              {["WAM duration scoring engine", "Geo knowledge graph + DC ops risk", "Multi model LLM consensus oracle layer"].map(t => (
                <div key={t} className="flex items-center gap-2 py-0.5">
                  <Dot />
                  <span className="text-[0.92rem] text-white/55">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
