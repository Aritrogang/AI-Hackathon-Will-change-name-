import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "@/components/ui/animated-number"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const dimensions = [
  { pct: 30, tag: "Primary", title: "Duration Risk (WAM)", featured: true },
  { pct: 20, tag: null, title: "Reserve Transparency", featured: false },
  { pct: 15, tag: null, title: "Geographic + Ops Concentration", featured: false },
  { pct: 15, tag: "Demo Focus", title: "Weather Tail Risk", featured: true },
  { pct: 15, tag: null, title: "Counterparty Health", featured: false },
  { pct: 5, tag: null, title: "Peg Stability", featured: false },
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
      <div className="flex-1 flex flex-col justify-start gap-[10px] mt-2">
        {dimensions.map((d, i) => {
          const delay = 0.14 + i * 0.055
          const fieldWidth = `${Math.max((d.pct / 30) * 85, 12)}%`

          return (
            <motion.div
              key={d.title}
              className={cn(
                "relative rounded-lg overflow-hidden",
                d.featured ? "py-[1.2rem]" : "py-[0.9rem]",
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
                  "text-[3.3rem] font-bold leading-none tracking-[-0.03em] tabular-nums shrink-0 w-[5rem] text-right",
                  d.featured ? "gradient-text" : "text-black/[0.1]",
                )}>
                  <AnimatedNumber value={d.pct} delay={delay} />
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
                      d.featured ? "text-[1.25rem] text-text-primary" : "text-[1.1rem] text-text-primary/70",
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
                      <AnimatedNumber value={d.pct} delay={delay + 0.1} />%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SlideLayout>
  )
}
