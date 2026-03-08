import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const Dot = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 inline-block" />
)

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

      <div className="flex gap-6 items-start mt-3">
        {/* Left: Pricing as table rows */}
        <div className="flex-[1.4] flex flex-col">
          {[
            { tier: "Starter API", tierColor: "text-text-tertiary", price: "$500", period: "/mo", desc: "REST API access \u00B7 6 stablecoins \u00B7 <2s rescore \u00B7 1M calls/mo", featured: false },
            { tier: "Enterprise", tierColor: "text-accent", price: "$5K", period: "/mo", desc: "Real-time streaming \u00B7 custom stablecoin onboarding \u00B7 SLA \u00B7 warehouse delivery", featured: true },
            { tier: "Institutional", tierColor: "text-text-tertiary", price: "Custom", period: "", desc: "FDIC Call Report mining \u00B7 oracle feed integration \u00B7 dedicated scoring pipeline", featured: false },
          ].map((t, i) => (
            <motion.div
              key={t.tier}
              className={`flex items-center gap-4 py-3.5 ${
                t.featured ? "bg-accent/[0.04] -mx-4 px-4 rounded-lg" : ""
              } ${i < 2 && !t.featured ? "border-b border-black/5" : ""}`}
              {...fadeUp(0.1 + i * 0.08)}
            >
              <span className={`text-[0.75rem] font-semibold uppercase tracking-[0.1em] min-w-[100px] ${t.tierColor}`}>
                {t.tier}
              </span>
              <div className="flex-1 text-[0.95rem] text-text-secondary leading-relaxed">{t.desc}</div>
              <span className="text-xl font-bold text-accent tracking-tight shrink-0">
                {t.price}
                {t.period && <span className="text-[0.75rem] font-normal text-text-tertiary">{t.period}</span>}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right: Customers + Moat as bare two-section column */}
        <motion.div className="flex-1 flex flex-col gap-5" {...fadeUp(0.3)}>
          <div>
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2">Target Customers</div>
            <div className="flex flex-col gap-1.5">
              {[
                "DAO Treasuries \u2014 MakerDAO, Aave, Compound",
                "DeFi Protocols holding stablecoin positions",
                "Institutional Risk Desks",
                "Stablecoin Issuers \u2014 GENIUS Act compliance",
              ].map(c => (
                <div key={c} className="flex items-center gap-2 text-[0.95rem] text-text-secondary"><Dot />{c}</div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/7 pt-4">
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2">Moat</div>
            <div className="flex flex-col gap-1.5">
              {[
                "First mover on GENIUS Act data pipeline",
                "Proprietary WAM duration engine",
                "Multi model LLM consensus layer",
                "Oracle grade signal (Chainlink ready)",
              ].map(m => (
                <div key={m} className="flex items-center gap-2 text-[0.95rem] text-text-secondary"><Dot />{m}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </SlideLayout>
  )
}
