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
    desc: "Duration mismatch + weather multiplier + LLM consensus. Output: LCR + latency.",
    badge: <Badge variant="accent">Output: latency + coverage under scenario</Badge>,
    featured: false,
  },
  {
    num: "02",
    label: "Next",
    labelColor: "text-accent",
    title: "Oracle Grade Risk Feed",
    desc: "IPFS-pinned consensus scores pushed to Chainlink oracles. DeFi protocols auto-rebalance.",
    badge: <Badge variant="consensus" dot>IPFS verified &middot; Multi SIG for AI &middot; Chainlink ready</Badge>,
    featured: true,
  },
  {
    num: "03",
    label: "Endgame",
    labelColor: "text-text-tertiary",
    title: "The Katabatic Stablecoin",
    desc: "Our own stablecoin: diversified, continuously stress-tested, managed by the engine.",
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
          Bloomberg started with terminals. We start with stress simulations.
        </div>
      </motion.div>

      {/* WAM comparison bars */}
      <motion.div className="border-t border-black/7 pt-3" {...fadeUp(0.4)}>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2.5">
          WAM Duration &middot; Healthy Reserve vs SVB Failure
        </div>
        <div className="flex flex-col gap-2">
          {[
            { name: "USDC", width: "9%", color: "bg-success", days: "45d", dayColor: "text-success", delay: 0.3 },
            { name: "SVB 2023", width: "100%", color: "bg-accent", days: "730d", dayColor: "text-accent", delay: 0.55 },
          ].map(bar => (
            <div key={bar.name} className="flex items-center gap-3">
              <div className="text-[0.82rem] text-text-secondary w-[68px] text-right font-medium shrink-0">{bar.name}</div>
              <div className="w-[55%] h-6 bg-bg-alt rounded overflow-hidden shrink-0">
                <div
                  className={`h-full ${bar.color} rounded origin-left`}
                  style={{
                    width: bar.width,
                    transform: "scaleX(0)",
                    animation: `bar-grow 0.6s ease-out forwards ${bar.delay}s`,
                  }}
                />
              </div>
              <div className={`text-[0.82rem] font-bold shrink-0 ${bar.dayColor}`}>{bar.days}</div>
            </div>
          ))}
        </div>
      </motion.div>

    </SlideLayout>
  )
}
