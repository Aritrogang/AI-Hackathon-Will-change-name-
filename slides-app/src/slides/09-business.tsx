import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const base = import.meta.env.BASE_URL

const logos = [
  { name: "makerdao", src: `${base}logos/mkr.svg`, font: "'DM Sans', sans-serif", weight: 300 },
  { name: "aave", src: `${base}logos/aave.svg`, font: "'Plus Jakarta Sans', sans-serif", weight: 300 },
  { name: "compound", src: `${base}logos/comp.svg`, font: "'Inter', sans-serif", weight: 300 },
  { name: "chainlink", src: `${base}logos/link.svg`, font: "'Space Grotesk', sans-serif", weight: 300 },
  { name: "usdc", src: `${base}logos/usdc.svg`, font: "'Inter', sans-serif", weight: 300 },
  { name: "tether", src: `${base}logos/usdt.svg`, font: "'Nunito Sans', sans-serif", weight: 300 },
  { name: "uniswap", src: `${base}logos/uni.svg`, font: "'DM Sans', sans-serif", weight: 300 },
  { name: "ethereum", src: `${base}logos/eth.svg`, font: "'Inter', sans-serif", weight: 300 },
]

function LogoConveyor({ items, speed = 30 }: { items: typeof logos; speed?: number }) {
  const setRef = useRef<HTMLDivElement>(null)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    if (setRef.current) {
      setSetWidth(setRef.current.scrollWidth)
    }
  }, [])

  return (
    <div className="overflow-hidden relative w-full">
      {/* Fade overlays */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white/90 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/90 to-transparent z-10" />
      <style>{`
        @keyframes conveyor {
          from { transform: translateX(0); }
          to { transform: translateX(-${setWidth}px); }
        }
      `}</style>
      <div
        className="flex items-center w-max"
        style={{
          animation: setWidth ? `conveyor ${speed}s linear infinite` : "none",
          willChange: "transform",
        }}
      >
        {/* First set — measured */}
        <div ref={setRef} className="flex items-center gap-20 shrink-0 pr-20">
              {items.map((logo, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
                  <img src={logo.src} alt={logo.name} className="w-[4rem] h-[4rem]" />
                  <span
                    className="text-[3rem] text-text-tertiary whitespace-nowrap tracking-[0.04em]"
                    style={{ fontFamily: logo.font, fontWeight: logo.weight }}
                  >
                    {logo.name}
                  </span>
            </div>
          ))}
        </div>
        {/* Second set — duplicate for seamless loop */}
        <div className="flex items-center gap-20 shrink-0 pr-20">
          {items.map((logo, i) => (
            <div key={`d-${i}`} className="flex items-center gap-3 shrink-0">
                  <img src={logo.src} alt={logo.name} className="w-[4rem] h-[4rem]" />
              <span
                className="text-[3rem] text-text-tertiary whitespace-nowrap tracking-[0.04em]"
                style={{ fontFamily: logo.font, fontWeight: logo.weight }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SlideBusiness(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Business Model</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        Infrastructure pricing.
        <br />
        Not a <span className="gradient-text">consulting fee.</span>
      </motion.h2>

      {/* All pricing tiers */}
      <div className="flex flex-col gap-4 mt-6">
        {[
          { tier: "Starter API", tierColor: "text-text-tertiary", price: "$500", period: "/mo", desc: "REST API access \u00B7 6 stablecoins \u00B7 <2s rescore \u00B7 1M calls/mo", featured: false },
          { tier: "Enterprise", tierColor: "text-accent", price: "$5K", period: "/mo", desc: "Real-time streaming \u00B7 custom stablecoin onboarding \u00B7 SLA \u00B7 warehouse delivery", featured: true },
          { tier: "Institutional", tierColor: "text-text-tertiary", price: "Custom", period: "", desc: "FDIC Call Report mining \u00B7 oracle feed integration \u00B7 dedicated scoring pipeline", featured: false },
        ].map((t, i) => (
          <motion.div
            key={t.tier}
            className="flex items-center gap-6 py-6 -mx-6 px-6 rounded-2xl bg-accent/[0.04]"
            {...fadeUp(0.1 + i * 0.08)}
          >
            <span className={`text-[1rem] font-semibold uppercase tracking-[0.12em] min-w-[140px] ${t.tierColor}`}>
              {t.tier}
            </span>
            <div className="flex-1 text-[1.15rem] text-text-secondary leading-relaxed">{t.desc}</div>
            <span className="text-2xl font-bold text-accent tracking-tight shrink-0">
              {t.price}
              {t.period && <span className="text-[1rem] font-normal text-text-tertiary">{t.period}</span>}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Logo conveyor */}
      <motion.div className="pt-5 mt-6" {...fadeUp(0.3)}>
        <LogoConveyor items={logos} speed={50} />
      </motion.div>
    </SlideLayout>
  )
}
