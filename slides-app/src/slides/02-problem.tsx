import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { HelicityLogo } from "@/components/helicity-logo"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const stats = [
  { value: 300, prefix: "$", suffix: "B+", label: "Unstressed Reserve Assets" },
  { value: 30, prefix: "", suffix: " Days", label: "Between Attestations" },
]

export function SlideProblem(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="alt">
      <Eyebrow>The Problem</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        The attestation said fine.
        <br />
        <span className="gradient-text">Then SVB failed.</span>
      </motion.h2>

      {/* Two-column: dark SVB card + stacked stats */}
      <div className="flex gap-5 items-stretch flex-1 min-h-0">
        {/* Left: SVB photo */}
        <motion.div
          className="flex-[1.2] rounded-2xl overflow-hidden relative"
          {...fadeUp(0.1)}
        >
          <img
            src={`${import.meta.env.BASE_URL}svb-hq.jpg`}
            alt="Silicon Valley Bank headquarters"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="relative z-10 flex flex-col justify-end h-full p-6">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/60">
              SVB Headquarters &middot; Santa Clara, CA
            </div>
            <div className="text-[2.2rem] font-bold text-white tracking-tight leading-none mt-1">
              $<AnimatedNumber value={3.3} delay={0.2} decimals={1} />B
            </div>
            <div className="text-[0.85rem] text-white/60 mt-0.5">USDC reserves held here</div>
          </div>
        </motion.div>

        {/* Right: 3 stats stacked vertically */}
        <motion.div className="flex-1 flex flex-col" {...fadeUp(0.2)}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`border-l-2 border-accent pl-4 py-3 flex-1 flex flex-col justify-center ${
                i < stats.length - 1 ? "border-b border-b-black/7" : ""
              }`}
            >
              <div className="text-[2.2rem] font-bold leading-none tracking-tight text-accent tabular-nums">
                {s.prefix}<AnimatedNumber value={s.value} delay={0.3 + i * 0.15} />{s.suffix}
              </div>
              <div className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-tertiary mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Depeg sparkline in card */}
      <motion.div className="flex items-center gap-5 px-1" {...fadeUp(0.4)}>
        <div className="shrink-0">
          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-1">
            USDC peg &middot; SVB collapse &middot; Mar 2023
          </div>
          <div className="text-2xl font-bold text-accent tracking-tight leading-tight">$1.00 to $0.87</div>
          <div className="text-[0.78rem] text-text-tertiary mt-0.5">&minus;13&cent; in 48 hours</div>
        </div>
        <div className="flex-1 relative h-[64px]">
          <svg width="100%" height="64" viewBox="0 0 400 64" preserveAspectRatio="none" className="overflow-visible">
            <defs>
              <linearGradient id="dg1" x1="0" y1="0" x2="50" y2="1">
                <stop offset="0%" stopColor="rgba(108,92,231,0.13)" />
                <stop offset="100%" stopColor="rgba(108,92,231,0)" />
              </linearGradient>
            </defs>
            <line x1="0" y1="4" x2="400" y2="4" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <polygon
              points="0,4 230,4 270,15 310,50 350,37 400,14 400,54 0,54"
              fill="url(#dg1)"
              className="svg-fade-in"
              style={{ animationDelay: "1.8s" }}
            />
            <polyline
              className="depeg-line"
              points="0,4 230,4 270,15 310,50 350,37 400,14"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-warn border-2 border-white -translate-x-1/2 -translate-y-1/2 svg-fade-in"
              style={{ left: "67.5%", top: "27.8%", animationDelay: "1.5s" }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-accent border-2 border-white -translate-x-1/2 -translate-y-1/2 svg-fade-in"
              style={{ left: "77.5%", top: "78%", animationDelay: "2s" }}
            />
            <div className="absolute text-[0.68rem] text-warn font-semibold whitespace-nowrap svg-fade-in" style={{ top: "2px", left: "69%", animationDelay: "1.5s" }}>
              SVB fails
            </div>
            <div className="absolute text-[0.68rem] text-accent font-semibold whitespace-nowrap svg-fade-in" style={{ top: "22px", left: "79%", animationDelay: "2s" }}>
              $0.87 low
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right border-l border-black/7 pl-4">
          <div className="font-semibold text-accent"><HelicityLogo size="sm" /></div>
          <div className="text-[0.78rem] text-text-tertiary">flags critical</div>
          <div className="text-[0.78rem] text-text-primary font-semibold">48h prior</div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
