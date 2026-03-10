import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { HurricaneRings } from "@/components/ui/hurricane-rings"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { KatabaticLogo } from "@/components/katabatic-logo"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
})

export function SlideClose(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="dark" className="!justify-center !items-center">
      <HurricaneRings opacity={1} />

      <motion.div
        className="relative z-10 w-full max-w-[760px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <motion.h2
          className="text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-tight tracking-[-0.028em] text-white/[0.92] text-center mb-6"
          {...fadeUp(0.05)}
        >
          Weather proves <span className="text-accent-light">the engine.</span>
        </motion.h2>

        {/* Hero numbers — glass container, centered */}
        <motion.div
          className="glass-dark rounded-2xl px-16 py-8 flex items-center justify-center gap-20 mb-6"
          style={{ backdropFilter: "blur(36px)", WebkitBackdropFilter: "blur(36px)" }}
          {...fadeUp(0.18)}
        >
          <div className="text-center">
            <div className="text-[5rem] font-bold leading-none tracking-[-0.04em] text-accent-light tabular-nums">
              <AnimatedNumber value={72} delay={0.3} /><span className="text-[2.8rem] text-accent-light/60">h</span>
            </div>
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/40 mt-2">
              Redemption Latency
            </div>
          </div>
          <div className="h-20 w-px bg-white/[0.08]" />
          <div className="text-center">
            <div className="text-[5rem] font-bold leading-none tracking-[-0.04em] text-accent-light tabular-nums">
              <AnimatedNumber value={88} delay={0.45} /><span className="text-[2.8rem] text-accent-light/60">%</span>
            </div>
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/40 mt-2">
              Liquidity Coverage
            </div>
          </div>
        </motion.div>

        {/* Context line */}
        <motion.p
          className="text-[1rem] text-white/50 text-center leading-relaxed max-w-[560px]"
          {...fadeUp(0.26)}
        >
          Under a Cat 4 hitting the Gulf + 50bps rate hike on your USDC position.
          <br />
          <span className="text-white/80 font-medium inline-flex items-center gap-1 justify-center flex-wrap">That&apos;s what DAO treasuries and AI agents need. That&apos;s <KatabaticLogo size="sm" dark />.</span>
        </motion.p>
      </motion.div>
    </SlideLayout>
  )
}
