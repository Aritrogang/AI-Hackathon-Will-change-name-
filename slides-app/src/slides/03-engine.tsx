import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { Pipeline } from "@/components/ui/pipeline"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

const outputStats = [
  { value: "68 / 100", label: "Stress Score" },
  { value: "72 hours", label: "Redemption Latency" },
  { value: "88%", label: "Liquidity Coverage" },
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

      {/* Context — pull quote in card */}
      <motion.div className="bg-card rounded-xl border border-black/7 px-6 py-4 relative" {...fadeUp(0.1)}>
        <div className="relative border-l-4 border-accent pl-5 py-1">
          <span className="absolute -top-4 -left-1 text-[4rem] leading-none text-accent/10 font-serif pointer-events-none select-none">
            &ldquo;
          </span>
          <div className="text-[1.02rem] text-text-secondary leading-relaxed">
            Attestations say <em className="text-text-tertiary">&ldquo;US-regulated bank with $100B+ in assets.&rdquo;</em> That&apos;s an envelope, not data.
            We treat them as <strong className="text-accent">inference puzzles</strong>, cross referencing vague disclosures against FDIC Call Reports and onchain Mint/Burn flows to infer the actual counterparty.
          </div>
        </div>
      </motion.div>

      {/* Pipeline in dark container */}
      <motion.div className="bg-bg-dark rounded-2xl px-6 py-5" {...fadeUp(0.2)}>
        <Pipeline
          steps={[
            { num: "01", title: "Resolve Entities", description: "LLM infers counterparties from PDFs + FDIC Call Reports" },
            { num: "02", title: "Build Graph", description: "Banks \u2192 geography, LTV ratios, WAM, data center corridors" },
            { num: "03", title: "Compute WAM", description: "Weighted Average Maturity  - the primary risk signal" },
            { num: "04", title: "Apply Stress", description: "Weather, rate shocks, LTV deterioration as force multipliers" },
            { num: "05", title: "Output LCR", description: "Liquidity coverage ratio + redemption latency. Not a grade." },
          ]}
          dark
        />
      </motion.div>

      {/* Output metrics — accent-tinted strip */}
      <motion.div
        className="bg-accent/[0.05] rounded-xl px-6 py-4 border border-accent/10 flex items-center gap-6"
        {...fadeUp(0.35)}
      >
        {outputStats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-6">
            <div className="flex flex-col gap-0.5">
              <div className="text-[1.8rem] font-bold leading-none tracking-tight text-accent">
                {s.value}
              </div>
              <div className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-tertiary mt-1">
                {s.label}
              </div>
            </div>
            {i < outputStats.length - 1 && (
              <div className="w-px self-stretch bg-accent/15 min-h-[40px]" />
            )}
          </div>
        ))}
        <div className="w-px self-stretch bg-accent/15 min-h-[40px]" />
        <div className="flex items-center ml-auto">
          <Badge variant="consensus" dot>
            CONSENSUS &middot; Claude 68 &middot; GPT 71 &middot; &delta;=3
          </Badge>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
