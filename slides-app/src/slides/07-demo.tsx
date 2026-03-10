import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

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

      {/* Placeholder video area */}
      <motion.div
        className="flex-1 rounded-2xl bg-bg-dark flex items-center justify-center relative overflow-hidden"
        {...fadeUp(0.1)}
      >
        {/* Play button */}
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M12 8L26 16L12 24V8Z" fill="var(--color-accent-light)" />
            </svg>
          </div>
          <div className="text-white/40 text-[0.85rem] font-medium uppercase tracking-[0.1em]">
            Live demo video
          </div>
        </div>

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>
    </SlideLayout>
  )
}
