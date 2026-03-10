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
    desc: "Mint/burn flows, wallet balances, transaction history.",
    tags: ["Dune", "Nansen", "Chainalysis"],
    tagClass: "bg-bg text-text-secondary",
    featured: false,
  },
  {
    num: "Layer 2 — Katabatic",
    numColor: "text-accent",
    borderColor: "border-accent",
    title: "Reserve Risk Infrastructure",
    desc: "WAM duration, FDIC health, weather tail risk, LLM consensus.",
    tags: ["stress_score", "latency_hours", "coverage_ratio"],
    tagClass: "bg-accent/[0.07] text-accent",
    featured: true,
  },
  {
    num: "Layer 3",
    numColor: "text-text-tertiary",
    borderColor: "border-black/15",
    title: "Downstream Consumers",
    desc: "DAOs, DeFi protocols, risk desks, oracle feeds.",
    tags: ["MakerDAO", "Aave", "Risk Desks"],
    tagClass: "bg-bg text-text-secondary",
    featured: false,
  },
]

const FlowArrow = ({ delay }: { delay: number }) => (
  <motion.div
    className="flex items-center justify-center self-center"
    initial={{ opacity: 0, x: -6 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <path d="M4 10 L20 10" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
      <path d="M17 5 L23 10 L17 15" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
    </svg>
  </motion.div>
)

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

      {/* 3 layers with arrow flow connectors */}
      <div className="flex gap-2 mt-2">
        {layers.map((layer, i) => (
          <div key={layer.title} className="contents">
            <motion.div
              className={`flex-1 border-l-4 ${layer.borderColor} pl-5 py-4 ${
                layer.featured ? "bg-accent/[0.04] px-6 rounded-r-lg shadow-[0_0_0_1px_rgba(108,92,231,0.08)]" : ""
              }`}
              {...fadeUp(0.1 + i * 0.08)}
            >
              <div className={`text-[0.72rem] font-semibold uppercase tracking-[0.1em] mb-2 ${layer.numColor}`}>{layer.num}</div>
              <div className="text-[1.1rem] font-semibold text-text-primary mb-1.5">{layer.title}</div>
              <div className="text-[0.92rem] text-text-secondary leading-relaxed mb-3">{layer.desc}</div>
              <div className="flex flex-wrap gap-1.5">
                {layer.tags.map(t => (
                  <span key={t} className={`text-xs font-medium rounded-md px-2.5 py-1 ${layer.tagClass}`}>{t}</span>
                ))}
              </div>
            </motion.div>
            {i < layers.length - 1 && <FlowArrow delay={0.15 + i * 0.1} />}
          </div>
        ))}
      </div>

      {/* Dark section — moat + analogy */}
      <motion.div
        className="bg-bg-dark rounded-2xl p-6"
        {...fadeUp(0.3)}
      >
        <div className="flex gap-10">
          {/* What onchain can't see */}
          <div className="flex-1 border-l-2 border-accent-light/40 pl-4">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-light mb-2">What Onchain Can&apos;t See</div>
            <div className="flex flex-col gap-1.5">
              {["WAM duration mismatch", "FDIC bank health signals", "Data center ops exposure", "Weather tail-risk multipliers"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <Dot />
                  <span className="text-[0.92rem] text-white/55">{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Moat */}
          <div className="flex-1 border-l-2 border-accent-light/40 pl-4">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-light mb-2">Defensible Moat</div>
            <div className="flex flex-col gap-1.5">
              {["WAM duration scoring engine", "Geo knowledge graph + DC ops risk", "Multi-model LLM consensus oracle", "IPFS-pinned score provenance"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <Dot />
                  <span className="text-[0.92rem] text-white/55">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analogy line */}
        <div className="border-t border-white/[0.06] mt-5 pt-4 text-[0.95rem] text-white/40 leading-relaxed">
          Onchain data platforms became the single source of truth for on-chain behavior.
          {" "}<span className="text-white/80 font-semibold">Katabatic is the equivalent for off-chain reserve risk.</span>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
