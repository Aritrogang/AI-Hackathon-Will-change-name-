import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const phases = [
  {
    num: "01",
    label: "Now",
    labelColor: "text-text-tertiary",
    title: "Stress Test Playground",
    desc: "Prove the engine: duration mismatch as the primary signal, weather as the tail risk multiplier, LLM jury for consensus. Output: LCR + redemption latency under any scenario.",
    badge: <Badge variant="accent">Output &rarr; latency + coverage under scenario</Badge>,
    featured: false,
  },
  {
    num: "02",
    label: "Next",
    labelColor: "text-accent",
    title: "Oracle Grade Risk Feed",
    desc: "Multi model consensus signals pushed to Chainlink oracles inside TEEs. DeFi protocols auto rebalance stablecoin positions when stress thresholds are crossed.",
    badge: <Badge variant="consensus" dot>Multi SIG for AI &middot; Chainlink ready</Badge>,
    featured: true,
  },
  {
    num: "03",
    label: "Endgame",
    labelColor: "text-text-tertiary",
    title: "The Katabatic Stablecoin",
    desc: "Use our own risk intelligence to design a stablecoin with optimal reserve structure: diversified counterparties, continuously stress tested, managed by the engine that rates them all.",
    badge: null,
    featured: false,
  },
]

export function SlideVision(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="alt">
      <Eyebrow>Future Vision</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        From stress simulator to <span className="gradient-text">financial infrastructure.</span>
      </motion.h2>

      {/* Phases — horizontal pipeline style with connecting line */}
      <motion.div className="relative mt-2" {...fadeUp(0.1)}>
        {/* Connecting line behind the numbers */}
        <div className="absolute top-[18px] left-[36px] right-[36px] h-px bg-accent/15" />

        <div className="grid grid-cols-3 gap-5">
          {phases.map((p, i) => (
            <motion.div
              key={p.title}
              className={`relative ${p.featured ? "bg-accent/[0.04] -mx-2 px-2 py-3 rounded-lg" : "py-3"}`}
              {...fadeUp(0.12 + i * 0.08)}
            >
              {/* Phase number on the line */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 mb-3 ${
                p.featured
                  ? "bg-accent text-white shadow-[0_0_12px_rgba(108,92,231,0.3)]"
                  : "bg-bg-alt border border-black/10 text-text-secondary"
              }`}>
                {p.num}
              </div>

              <div className={`text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-1.5 ${p.labelColor}`}>
                Phase {p.num} &middot; {p.label}
              </div>
              <div className="text-[1.02rem] font-semibold text-text-primary mb-1.5">{p.title}</div>
              <div className="text-[0.92rem] text-text-secondary leading-relaxed">{p.desc}</div>
              {p.badge && <div className="mt-2">{p.badge}</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bloomberg quote — large pull quote, no card */}
      <motion.div className="relative text-center py-3" {...fadeUp(0.35)}>
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[4rem] leading-none text-accent/10 font-serif pointer-events-none select-none">
          &ldquo;
        </span>
        <div className="text-[1.02rem] text-text-tertiary leading-relaxed max-w-[600px] mx-auto italic">
          Bloomberg started with data terminals and became financial infrastructure.
          <br />
          We start with stress simulations and become the most transparent stablecoin in crypto.
        </div>
      </motion.div>

      {/* WAM comparison bars — bare, no card */}
      <motion.div className="border-t border-black/7 pt-3" {...fadeUp(0.4)}>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2.5">
          WAM duration &middot; the root cause signal &middot; healthy reserve vs SVB failure
        </div>
        <div className="flex flex-col gap-2">
          {[
            { name: "USDC", width: "6.2%", color: "bg-success", days: "45d", dayColor: "text-success", note: "safe \u00B7 daily redemptions matched", delay: 0.3 },
            { name: "SVB 2023", width: "100%", color: "bg-accent", days: "730d", dayColor: "text-accent", note: "critical \u00B7 2-yr bonds vs daily redemptions", delay: 0.55 },
          ].map(bar => (
            <div key={bar.name} className="flex items-center gap-3">
              <div className="text-[0.82rem] text-text-secondary min-w-[68px] text-right font-medium">{bar.name}</div>
              <div className="flex-1 h-6 bg-bg-alt rounded overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded origin-left`}
                  style={{
                    width: bar.width,
                    transform: "scaleX(0)",
                    animation: `bar-grow 0.6s ease-out forwards ${bar.delay}s`,
                  }}
                />
              </div>
              <div className={`text-[0.82rem] font-bold min-w-[36px] ${bar.dayColor}`}>{bar.days}</div>
              <div className={`text-[0.72rem] ${bar.dayColor === "text-accent" ? "text-accent font-semibold" : "text-text-tertiary italic"}`}>{bar.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[0.75rem] text-text-tertiary">
          Katabatic computes WAM continuously. Flagged SVB critical 48h before the $0.87 depeg.
        </div>
      </motion.div>
    </SlideLayout>
  )
}
