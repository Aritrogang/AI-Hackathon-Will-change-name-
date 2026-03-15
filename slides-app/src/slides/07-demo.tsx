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
      {/* Video area — full remaining space */}
      <motion.div
        className="flex-1 rounded-2xl bg-bg-dark flex items-center justify-center relative overflow-hidden w-full"
        {...fadeUp(0.1)}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[90%] h-[90%] object-contain rounded-xl z-10"
          src="/helicity.mov"
        />
      </motion.div>
    </SlideLayout>
  )
}
