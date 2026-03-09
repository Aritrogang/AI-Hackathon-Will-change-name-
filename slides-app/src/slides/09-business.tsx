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
  { name: "MakerDAO", src: `${base}logos/mkr-wordmark.svg` },
  { name: "Aave", src: `${base}logos/aave-wordmark.svg` },
  { name: "Compound", src: `${base}logos/comp-wordmark.svg` },
  { name: "Chainlink", src: `${base}logos/link-wordmark.svg` },
  { name: "USDC", src: `${base}logos/usdc-wordmark.svg` },
  { name: "Tether", src: `${base}logos/usdt-wordmark.svg` },
  { name: "Uniswap", src: `${base}logos/uni-wordmark.svg` },
  { name: "Ethereum", src: `${base}logos/eth-wordmark.svg` },
]

function LogoConveyor({ items, speed = 50 }: { items: typeof logos; speed?: number }) {
  const setRef = useRef<HTMLDivElement>(null)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    const el = setRef.current
    if (!el) return
    const measure = () => setSetWidth(el.scrollWidth)
    const images = el.querySelectorAll("img")
    let loaded = 0
    images.forEach((img) => {
      if (img.complete) {
        loaded++
      } else {
        img.addEventListener("load", () => {
          loaded++
          if (loaded === images.length) measure()
        })
      }
    })
    if (loaded === images.length) measure()
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
        <div ref={setRef} className="flex items-center gap-16 shrink-0 pr-16">
          {items.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.name}
              className="h-[64px] w-auto shrink-0"
              style={{ opacity: 0.7 }}
            />
          ))}
        </div>
        {/* Second set — duplicate for seamless loop */}
        <div className="flex items-center gap-16 shrink-0 pr-16">
          {items.map((logo, i) => (
            <img
              key={`d-${i}`}
              src={logo.src}
              alt={logo.name}
              className="h-[64px] w-auto shrink-0"
              style={{ opacity: 0.7 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SlideBusiness(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Go to Market</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        API first infrastructure.
        <br />
        Not a <span className="gradient-text">consulting fee.</span>
      </motion.h2>

      {/* Tiers — what you get, no prices */}
      <div className="flex flex-col gap-4 mt-6">
        {[
          { tier: "Starter API", tierColor: "text-text-tertiary", desc: "REST API access \u00B7 6 stablecoins \u00B7 <2s rescore \u00B7 1M calls/mo", featured: false },
          { tier: "Enterprise", tierColor: "text-accent", desc: "Real-time streaming \u00B7 custom stablecoin onboarding \u00B7 SLA \u00B7 warehouse delivery", featured: true },
          { tier: "Institutional", tierColor: "text-text-tertiary", desc: "FDIC Call Report mining \u00B7 oracle feed integration \u00B7 dedicated scoring pipeline", featured: false },
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
