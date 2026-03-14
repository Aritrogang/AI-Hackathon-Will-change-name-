import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { AnimatedNumber } from "@/components/ui/animated-number"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

// Inline SVG icons in Helicity accent style
const IconPdf = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="var(--color-accent)" strokeWidth="1.2" />
    <path d="M5 5h4M5 7.5h4M5 10h2" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    <path d="M8 1v3h3" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconBank = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5L1.5 5h11L7 1.5z" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M3 5.5v5M5.5 5.5v5M8.5 5.5v5M11 5.5v5" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
    <rect x="1.5" y="10.5" width="11" height="2" rx="0.5" stroke="var(--color-accent)" strokeWidth="1.2" />
  </svg>
)

const IconChain = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="4" width="4.5" height="6" rx="1.5" stroke="var(--color-accent)" strokeWidth="1.2" />
    <rect x="8.5" y="4" width="4.5" height="6" rx="1.5" stroke="var(--color-accent)" strokeWidth="1.2" />
    <path d="M5.5 7h3" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
)

const IconWeather = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="var(--color-accent)" strokeWidth="1.2" strokeOpacity="0.3" />
    <circle cx="7" cy="7" r="3" stroke="var(--color-accent)" strokeWidth="1.2" strokeOpacity="0.6" />
    <circle cx="7" cy="7" r="1" fill="var(--color-accent)" />
  </svg>
)

const inputSources = [
  { icon: <IconPdf />, label: "PDF Attestations" },
  { icon: <IconBank />, label: "FDIC Call Reports" },
  { icon: <IconChain />, label: "Onchain Flows" },
  { icon: <IconWeather />, label: "NOAA Weather" },
]

const pipelineSteps = [
  { num: "01", title: "Resolve Entities" },
  { num: "02", title: "Build Graph" },
  { num: "03", title: "Compute WAM" },
  { num: "04", title: "Apply Stress" },
  { num: "05", title: "Output LCR" },
  { num: "06", title: "Pin to IPFS" },
]

const outputStats = [
  { value: 68, unit: "/ 100", label: "Stress Score" },
  { value: 72, unit: "h", label: "Redemption Latency" },
  { value: 88, unit: "%", label: "Liquidity Coverage" },
]

export function SlideEngine(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Stress Engine</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        From opaque PDF to <span className="gradient-text">realtime liquidity stress score.</span>
      </motion.h2>

      {/* Input Sources — pills showing what feeds the engine */}
      <motion.div className="flex items-center gap-3 mt-2" {...fadeUp(0.1)}>
        {inputSources.map((src, i) => (
          <motion.div
            key={src.label}
            className="flex items-center gap-2 bg-black/[0.03] rounded-full px-4 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
          >
            <span className="shrink-0 flex items-center">{src.icon}</span>
            <span className="text-[0.82rem] font-semibold text-text-secondary tracking-[-0.01em]">
              {src.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline — numbered steps sliding in from left */}
      <motion.div className="relative my-14" {...fadeUp(0.2)}>
        {/* Connecting line */}
        <div className="absolute top-[36px] left-[8.33%] right-[8.33%] h-[2px] bg-gradient-to-r from-accent/5 via-accent/20 to-accent/5" />

        <div className="grid grid-cols-6">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {i > 0 && (
                <svg className="absolute top-[26px] left-0 -translate-x-1/2 text-accent/25" width="14" height="20" viewBox="0 0 14 20" fill="none">
                  <path d="M2 1 L12 10 L2 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="w-[72px] h-[72px] rounded-full bg-accent text-white text-[1.15rem] font-bold flex items-center justify-center mb-4 relative z-10 shadow-[0_0_0_5px_var(--color-bg)]">
                {step.num}
              </div>
              <div className="text-[1.15rem] font-semibold text-text-primary leading-tight">
                {step.title}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Output — large metrics */}
      <motion.div className="border-t border-black/7 pt-5 px-1" {...fadeUp(0.35)}>
        <div className="flex items-center gap-10">
          {outputStats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-10">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[3.2rem] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums">
                    <AnimatedNumber value={s.value} delay={0.5 + i * 0.15} />
                  </span>
                  <span className="text-[1.4rem] font-medium text-accent/50">
                    {s.unit}
                  </span>
                </div>
                <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mt-1.5">
                  {s.label}
                </div>
              </div>
              {i < outputStats.length - 1 && (
                <div className="w-px h-14 bg-black/7" />
              )}
            </div>
          ))}

          {/* Consensus badge — pushed right */}
          <div className="ml-auto">
            <Badge variant="consensus" dot>
              CONSENSUS &middot; Claude 68 &middot; Gemini 71 &middot; &delta;=3
            </Badge>
          </div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
