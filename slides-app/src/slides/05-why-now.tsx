import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

export function SlideWhyNow(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Why Now</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        The GENIUS Act 2026
        <br />
        just <span className="gradient-text">created this market.</span>
      </motion.h2>

      <div className="flex gap-6 items-start mt-3">
        {/* Left: Bare vertical timeline — no card */}
        <motion.div className="flex-[1.3] relative pl-6" {...fadeUp(0.1)}>
          <div className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-tertiary mb-3 -ml-6">Regulatory Timeline</div>

          {/* Vertical connecting line */}
          <div className="absolute left-[7px] top-[32px] bottom-[4px] w-0.5 bg-accent/15 rounded-full" />

          <div className="flex flex-col">
            {[
              { dot: "border", date: "Before 2026", text: <><strong className="text-text-primary">PDF attestations.</strong> 30-day lag. No programmatic access.</> },
              { dot: "active", date: "Jan 2026", text: <><strong className="text-text-primary">GENIUS Act signed.</strong> XBRL + OCC API feeds mandated for all PPSIs.</> },
              { dot: "done", date: "Today", text: <><strong className="text-text-primary">We have the pipeline.</strong> Realtime reserve stress monitoring is now possible.</> },
            ].map((item, i) => (
              <div key={i} className={`flex gap-4 items-start py-3 relative ${i < 2 ? "border-b border-black/5" : ""}`}>
                {/* Timeline dot */}
                <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full shrink-0 border-2 z-10 ${
                  item.dot === "active" ? "border-accent bg-accent shadow-[0_0_8px_rgba(108,92,231,0.4)]" :
                  item.dot === "done" ? "border-success bg-success" :
                  "border-accent/40 bg-bg"
                }`} />
                <div className="text-[0.75rem] text-text-tertiary w-[90px] shrink-0 font-medium pt-0.5">{item.date}</div>
                <div className="text-[0.95rem] text-text-secondary leading-relaxed">{item.text}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: "Why hasn't someone" — accent border block + inline pills */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            className="border-l-4 border-accent pl-4 bg-accent/[0.03] -mx-2 px-6 py-4 rounded-r-lg"
            {...fadeUp(0.2)}
          >
            <div className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-accent mb-2">Why hasn&apos;t someone done this before?</div>
            <div className="text-[1.02rem] text-text-primary leading-relaxed mb-3">
              The data didn&apos;t exist.
              <br />
              <span className="text-accent font-semibold">Now it does.</span>
              <br />
              We&apos;re first in a regulation mandated market.
            </div>
          </motion.div>

          {/* Stats as inline pills */}
          <motion.div className="flex gap-3 -mt-2" {...fadeUp(0.3)}>
            <div className="flex items-center gap-2 bg-accent/[0.06] rounded-full px-4 py-2">
              <span className="text-[1.6rem] font-bold text-accent leading-none">6</span>
              <span className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-text-tertiary">Stablecoins tracked</span>
            </div>
            <div className="flex items-center gap-2 bg-accent/[0.06] rounded-full px-4 py-2">
              <span className="text-[1.6rem] font-bold text-accent leading-none">&lt;2s</span>
              <span className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-text-tertiary">Re-score time</span>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Market growth chart — bare, no card */}
      <motion.div className="border-t border-black/7 pt-2 mt-0" {...fadeUp(0.4)}>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2.5">
          Stablecoin Total Supply
        </div>
        <div className="flex items-end gap-2 h-[72px]">
          {[
            { h: 16, opacity: 0.3, delay: 0.2 },
            { h: 35, opacity: 0.5, delay: 0.4 },
            { h: 53, opacity: 0.72, delay: 0.6 },
            { h: 72, opacity: 1, delay: 0.8 },
          ].map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm origin-bottom"
              style={{
                height: bar.h,
                background: bar.opacity === 1 ? "var(--color-accent)" : `rgba(108,92,231,${bar.opacity})`,
                transform: "scaleY(0)",
                animation: `bar-grow-y 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards ${bar.delay}s`,
              }}
            />
          ))}
          <div className="shrink-0 w-px bg-black/7 h-[72px] mx-1" />
          <div
            className="flex-[1.3] h-[72px] rounded-t-sm flex items-center justify-center origin-bottom"
            style={{
              background: "repeating-linear-gradient(45deg,rgba(108,92,231,0.07) 0px,rgba(108,92,231,0.07) 4px,transparent 4px,transparent 10px)",
              border: "1.5px dashed rgba(108,92,231,0.3)",
              transform: "scaleY(0)",
              animation: "bar-grow-y 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards 1s",
            }}
          >
            <span className="text-[0.72rem] font-bold text-accent tracking-wider">projected</span>
          </div>
        </div>
        <div className="flex gap-2 mt-1.5">
          {[
            { val: "$30B", year: "2021" },
            { val: "$80B", year: "2023" },
            { val: "$180B", year: "2025" },
            { val: "$350B", year: "2027", accent: true },
          ].map(d => (
            <div key={d.year} className="flex-1 text-center text-[0.75rem]">
              <strong className={d.accent ? "text-accent" : "text-text-secondary"}>{d.val}</strong>
              <br />
              <span className="text-text-tertiary">{d.year}</span>
            </div>
          ))}
          <div className="shrink-0 w-2.5" />
          <div className="flex-[1.3] text-center text-[0.75rem]">
            <strong className="text-accent">$700B+</strong>
            <br />
            <span className="text-accent text-[0.62rem]">2030</span>
          </div>
        </div>
      </motion.div>
    </SlideLayout>
  )
}
