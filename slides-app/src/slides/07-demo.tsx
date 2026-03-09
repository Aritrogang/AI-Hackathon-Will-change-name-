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

const scenarios = [
  { cat: "Scenario A \u00B7 Primary Demo", title: "Hurricane: Data Center Ops Freeze", desc: "Cat 4 Gulf + FL bank LTV stress + NoVA data center ops freeze.", borderColor: "border-accent" },
  { cat: "Scenario B \u00B7 Backtest", title: "SVB Collapse \u00B7 Duration Mismatch", desc: "March 2023. 94% in 2-yr bonds. Flagged 48h before $0.87.", borderColor: "border-warn" },
  { cat: "Scenario C \u00B7 Sensitivity", title: "100bps Rate Hike: WAM Exposure", desc: "Duration exposure comparison. <2s rescore. FRAX worst, USDT best.", borderColor: "border-success" },
]

const tableData = [
  { coin: "USDC", score: 68, scoreColor: "text-warn", latency: "72h", latencyColor: "text-warn", coverage: 0.88, coverageColor: "text-warn", wam: 45 },
  { coin: "USDT", score: 31, scoreColor: "text-success", latency: "<4h", latencyColor: "text-success", coverage: 1.00, coverageColor: "text-success", wam: 12 },
  { coin: "FRAX", score: 74, scoreColor: "text-accent", latency: "48h", latencyColor: "text-accent", coverage: 0.91, coverageColor: "text-accent", wam: 67 },
]

export function SlideDemo(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Live Demo</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        Three scenarios. <span className="gradient-text">One engine.</span>
      </motion.h2>

      {/* Scenarios — horizontal cards */}
      <div className="grid grid-cols-3 gap-5 mt-4">
        {scenarios.map((s, i) => (
          <motion.div
            key={s.title}
            className={`border-l-4 ${s.borderColor} pl-4 py-3`}
            {...fadeUp(0.1 + i * 0.08)}
          >
            <div className="text-[0.75rem] font-semibold uppercase tracking-widest text-text-tertiary mb-1">{s.cat}</div>
            <div className="text-[1.02rem] font-semibold text-text-primary mb-1.5 leading-tight">{s.title}</div>
            <div className="text-[0.92rem] text-text-secondary leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Live output table */}
      <motion.div className="border-t border-black/7 pt-3 mt-5" {...fadeUp(0.4)}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-text-tertiary">
            Live engine output &middot; GET /api/stress scores &middot; Cat 4 + 50bps scenario
          </div>
          <Badge variant="live" dot>LIVE</Badge>
        </div>
        <div className="grid grid-cols-5 border border-black/7 rounded-xl overflow-hidden bg-card">
          {["stablecoin", "stress_score", "latency_hours", "coverage_ratio", "wam_days"].map((col, ci) => (
            <div key={col} className={`px-4 py-2.5 ${ci < 4 ? "border-r border-black/7" : ""} ${ci === 0 ? "bg-black/1.5" : ""}`}>
              <div className="text-[0.72rem] text-text-tertiary uppercase tracking-[0.08em] mb-1">{col}</div>
              {tableData.map((row, ri) => {
                const color = col === "stablecoin" ? (row.coin === "USDC" ? "text-text-primary font-semibold" : "text-text-secondary font-semibold") :
                  col === "stress_score" ? `${row.scoreColor} font-bold` :
                  col === "latency_hours" ? `${row.latencyColor} font-semibold` :
                  col === "coverage_ratio" ? `${row.coverageColor} font-semibold` :
                  "text-text-secondary font-semibold"
                const baseDelay = 0.5 + ri * 0.12
                let content: React.ReactNode
                if (col === "stablecoin") content = row.coin
                else if (col === "stress_score") content = <span className="tabular-nums"><AnimatedNumber value={row.score} delay={baseDelay} /></span>
                else if (col === "latency_hours") content = row.latency
                else if (col === "coverage_ratio") content = <span className="tabular-nums"><AnimatedNumber value={row.coverage} delay={baseDelay} decimals={2} /></span>
                else content = <span className="tabular-nums"><AnimatedNumber value={row.wam} delay={baseDelay} />d</span>
                return <div key={row.coin} className={`text-[0.95rem] leading-[1.8] ${color}`}>{content}</div>
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </SlideLayout>
  )
}
