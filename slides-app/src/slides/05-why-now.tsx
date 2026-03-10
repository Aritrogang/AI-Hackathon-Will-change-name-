import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

function AnimatedNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v))
    const timeout = setTimeout(() => {
      animate(count, target, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
    }, delay * 1000)
    return () => { unsubscribe(); clearTimeout(timeout) }
  }, [count, rounded, target, delay])

  return <>{display}</>
}

export function SlideWhyNow(_props: { subStep?: number }) {
  return (
    <SlideLayout>
      <Eyebrow>Why Now</Eyebrow>
      <motion.h2
        className="text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        The GENIUS Act 2025
        <br />
        just <span className="gradient-text">created this market.</span>
      </motion.h2>

      <div className="flex gap-6 items-stretch flex-1 mt-1">
        {/* Left: Vertical timeline */}
        <motion.div className="flex-[1.3] relative pl-6 flex flex-col" {...fadeUp(0.1)}>
          {/* Vertical connecting line — grows downward */}
          <motion.div
            className="absolute left-[7px] top-[6px] w-0.5 bg-accent/15 rounded-full origin-top"
            initial={{ height: 0 }}
            animate={{ height: "calc(100% - 10px)" }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />

          <div className="flex flex-col flex-1">
            {[
              { dot: "border", date: "Before 2025", text: "PDF attestations. 30-day lag. No programmatic access." },
              { dot: "active", date: "Jul 2025", text: "GENIUS Act signed into law. XBRL + OCC API feeds mandated for all PPSIs." },
              { dot: "done", date: "Today", text: "We have the pipeline. Realtime reserve stress monitoring is now possible." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex gap-4 items-start py-5 relative flex-1 ${i < 2 ? "border-b border-black/5" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.35, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className={`absolute -left-6 top-4 w-3 h-3 rounded-full shrink-0 border-2 z-10 ${
                    item.dot === "active" ? "border-accent bg-accent shadow-[0_0_8px_rgba(108,92,231,0.4)]" :
                    item.dot === "done" ? "border-success bg-success" :
                    "border-accent/40 bg-bg"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.35, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                />
                <div className="text-[0.75rem] text-text-tertiary w-[90px] shrink-0 font-medium pt-0.5">{item.date}</div>
                <div className="text-[0.95rem] text-text-secondary leading-snug">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Signing image with overlay */}
        <motion.div
          className="flex-1 relative rounded-xl overflow-hidden min-h-[200px]"
          {...fadeUp(0.2)}
        >
          <img
            src="https://images.foxtv.com/static.livenowfox.com/www.livenowfox.com/content/uploads/2025/07/932/524/gettyimages-2224969528-copy-scaled.jpg?ve=1&tl=1"
            alt="President Trump signs the GENIUS Act into law, July 2025"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-10 flex flex-col justify-end h-full p-5 gap-3">
            <div>
              <div className="text-[0.72rem] font-medium uppercase tracking-[0.1em] text-white/70 mb-1">Why hasn&apos;t someone done this before?</div>
              <div className="text-[1rem] text-white font-semibold leading-snug">
                The data didn&apos;t exist. <span className="text-accent-light">Now it does.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.div
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <span className="text-[1.6rem] font-bold text-white leading-none">
                  <AnimatedNumber target={6} delay={0.8} />
                </span>
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.06em] text-white/70">Stablecoins tracked</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <span className="text-[1.6rem] font-bold text-white leading-none">
                  &lt;<AnimatedNumber target={2} delay={1.0} />s
                </span>
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.06em] text-white/70">Re-score time</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Market growth chart */}
      <motion.div className="border-t border-black/7 pt-3" {...fadeUp(0.4)}>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-text-tertiary mb-2">
          Stablecoin Total Supply
        </div>
        <div className="flex items-end gap-3 h-[140px]">
          {[
            { pct: 30, opacity: 0.3, delay: 0.2 },
            { pct: 25, opacity: 0.5, delay: 0.4 },
            { pct: 62, opacity: 0.72, delay: 0.6 },
            { pct: 100, opacity: 1, delay: 0.8 },
          ].map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm origin-bottom"
              style={{
                height: `${bar.pct}%`,
                background: bar.opacity === 1 ? "var(--color-accent)" : `rgba(108,92,231,${bar.opacity})`,
                transform: "scaleY(0)",
                animation: `bar-grow-y 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards ${bar.delay}s`,
              }}
            />
          ))}
          <div className="shrink-0 w-px bg-black/7 h-[140px] mx-1" />
          <div
            className="flex-[1.3] h-[140px] rounded-t-sm flex items-center justify-center origin-bottom"
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
            { val: "$150B", year: "2021" },
            { val: "$125B", year: "2023" },
            { val: "$310B", year: "2025" },
            { val: "$500B", year: "2027", accent: true },
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
