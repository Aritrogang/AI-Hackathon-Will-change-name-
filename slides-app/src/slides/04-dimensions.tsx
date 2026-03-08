import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const dimensions = [
  { pct: 30, tag: "Primary", title: "Duration Risk (WAM)", desc: "Weighted Average Maturity of treasury portfolio. SVB: 730-day WAM vs daily redemptions. Critical mismatch flagged 48h early.", featured: true },
  { pct: 20, tag: null, title: "Reserve Transparency", desc: "XBRL/OCC feed freshness + Mint/Burn cross-reference divergence. Entity resolver: BNY Mellon at 92% confidence.", featured: false },
  { pct: 15, tag: null, title: "Geographic + Ops Concentration", desc: "HHI of bank locations + data center corridor overlap. AWS us-east-1 (NoVA) as treasury ops risk node.", featured: false },
  { pct: 15, tag: "Demo Focus", title: "Weather Tail Risk", desc: "Storm track \u00D7 bank LTV exposure via FDIC Call Reports. The hurricane doesn\u2019t hit the bank \u2014 it hits the LTV ratio.", featured: true },
  { pct: 15, tag: null, title: "Counterparty Health", desc: "FDIC watch list, LTV ratios, liquidity coverage. Multi-model LLM jury: Claude + GPT, flag if delta >15.", featured: false },
  { pct: 5, tag: null, title: "Peg Stability", desc: "Historical depeg events, current spread, Mint/Burn velocity. Lagging signal \u2014 the other 95% is structural.", featured: false },
]

export function SlideDimensions() {
  return (
    <SlideLayout variant="alt">
      <Eyebrow>Six Dimensions of Risk</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        Duration risk is primary. Weather is the <span className="gradient-text">force multiplier.</span>
      </motion.h2>

      {/* Formula */}
      <motion.div
        className="text-sm text-text-secondary leading-relaxed"
        {...fadeUp(0.1)}
      >
        <span className="text-accent font-semibold">Stress Score</span>
        <span className="text-text-tertiary"> = </span>
        <span className="text-accent font-semibold">Duration Risk</span>
        <sup className="text-[0.6em] text-text-tertiary">WAM</sup>
        <span className="text-text-tertiary"> &times; </span>
        <span className="text-accent font-semibold">Weather Multiplier</span>
        <span className="text-text-tertiary"> &times; </span>
        <span className="text-accent font-semibold">Concentration Factor</span>
      </motion.div>

      {/* Dimension rows — color-field proportional layout */}
      <div className="flex-1 flex flex-col justify-start gap-[7px] mt-2">
        {dimensions.map((d, i) => {
          const delay = 0.14 + i * 0.055
          const fieldWidth = `${Math.max((d.pct / 30) * 85, 12)}%`

          return (
            <motion.div
              key={d.title}
              className={cn(
                "relative rounded-lg overflow-hidden",
                d.featured ? "py-[0.8rem]" : "py-[0.6rem]",
              )}
              {...fadeUp(delay)}
            >
              {/* Animated color field — width proportional to weight */}
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-lg",
                  d.featured
                    ? "bg-gradient-to-r from-accent/[0.09] via-accent/[0.05] to-transparent"
                    : "bg-gradient-to-r from-black/[0.03] to-transparent",
                )}
                initial={{ width: 0 }}
                animate={{ width: fieldWidth }}
                transition={{ delay: delay + 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Content — sits on top of color field */}
              <div className="relative z-10 flex items-start gap-6 px-5">
                {/* Weight number */}
                <span className={cn(
                  "text-[2.2rem] font-bold leading-none tracking-[-0.03em] tabular-nums shrink-0 w-[3.5rem] text-right",
                  d.featured ? "gradient-text" : "text-black/[0.1]",
                )}>
                  {d.pct}
                </span>

                {/* Vertical accent line */}
                <div className={cn(
                  "self-stretch shrink-0",
                  d.featured ? "w-[3px] rounded-full bg-accent" : "w-px bg-black/[0.08]",
                )} />

                {/* Text content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={cn(
                      "font-semibold tracking-[-0.01em]",
                      d.featured ? "text-[1.05rem] text-text-primary" : "text-[0.95rem] text-text-primary/70",
                    )}>
                      {d.title}
                    </span>
                    {d.tag && (
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-accent bg-accent/[0.1] rounded-sm px-1.5 py-[2px]">
                        {d.tag}
                      </span>
                    )}
                    <span className={cn(
                      "ml-auto text-[0.78rem] font-bold tabular-nums shrink-0",
                      d.featured ? "text-accent" : "text-text-muted",
                    )}>
                      {d.pct}%
                    </span>
                  </div>
                  <p className={cn(
                    "leading-relaxed",
                    d.featured ? "text-[0.88rem] text-text-secondary" : "text-[0.84rem] text-text-tertiary",
                  )}>
                    {d.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SlideLayout>
  )
}
