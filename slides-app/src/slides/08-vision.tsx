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
      <motion.div className="relative" {...fadeUp(0.1)}>
        {/* Connecting line behind the numbers */}
        <div className="absolute top-[28px] left-[36px] right-[36px] h-px bg-accent/15" />

        <div className="grid grid-cols-3 gap-5">
          {phases.map((p, i) => (
            <motion.div
              key={p.title}
              className={`relative ${p.featured ? "bg-accent/[0.04] -mx-2 px-5 py-5 rounded-xl border border-accent/10" : "py-5"}`}
              {...fadeUp(0.12 + i * 0.08)}
            >
              {/* Phase number on the line */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold relative z-10 mb-4 ${
                p.featured
                  ? "bg-accent text-white shadow-[0_0_16px_rgba(108,92,231,0.3)]"
                  : "bg-bg-alt border border-black/10 text-text-secondary"
              }`}>
                {p.num}
              </div>

              <div className={`text-[0.78rem] font-semibold uppercase tracking-[0.1em] mb-2 ${p.labelColor}`}>
                Phase {p.num} &middot; {p.label}
              </div>
              <div className="text-[1.15rem] font-semibold text-text-primary mb-2">{p.title}</div>
              <div className="text-[0.95rem] text-text-secondary leading-relaxed">{p.desc}</div>
              {p.badge && <div className="mt-3">{p.badge}</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom section — quote + WAM bars side by side */}
      <motion.div className="bg-bg-dark rounded-2xl p-6 flex gap-10 items-center" {...fadeUp(0.35)}>
        {/* Bloomberg quote */}
        <div className="flex-1 relative pl-6">
          <span className="absolute top-[-8px] left-0 text-[3.5rem] leading-none text-accent-light/15 font-serif pointer-events-none select-none">
            &ldquo;
          </span>
          <div className="text-[1.05rem] text-white/50 leading-relaxed italic">
            Bloomberg started with terminals.<br />We start with stress simulations.
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-white/[0.08]" />

        {/* WAM comparison bars */}
        <div className="flex-1">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white/30 mb-3">
            WAM Duration &middot; Healthy vs SVB
          </div>
          <div className="flex flex-col gap-3">
            {[
              { name: "USDC", width: "6%", color: "bg-success", days: "45d", dayColor: "text-success", delay: 0.3 },
              { name: "SVB 2023", width: "100%", color: "bg-accent-light", days: "730d", dayColor: "text-accent-light", delay: 0.55 },
            ].map(bar => (
              <div key={bar.name} className="flex items-center gap-3">
                <div className="text-[0.85rem] text-white/50 w-[72px] text-right font-medium shrink-0">{bar.name}</div>
                <div className="flex-1 h-7 bg-white/[0.06] rounded overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded origin-left`}
                    style={{
                      width: bar.width,
                      transform: "scaleX(0)",
                      animation: `bar-grow 0.6s ease-out forwards ${bar.delay}s`,
                    }}
                  />
                </div>
                <div className={`text-[0.85rem] font-bold shrink-0 w-[48px] text-right ${bar.dayColor}`}>{bar.days}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </SlideLayout>
  )
}
