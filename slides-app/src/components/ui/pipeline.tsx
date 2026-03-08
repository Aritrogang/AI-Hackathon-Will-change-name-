import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PipelineStep {
  num: string
  title: string
  description: string
}

interface PipelineProps {
  steps: PipelineStep[]
  className?: string
  dark?: boolean
}

export function Pipeline({ steps, className, dark = false }: PipelineProps) {
  return (
    <div className={cn("grid gap-0 relative", className)} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
      {/* Connection line */}
      <div className="absolute top-[28px] left-[10%] right-[10%] h-px bg-gradient-to-r from-accent/[0.05] via-accent/20 to-accent/[0.05]" />

      {steps.map((step, i) => (
        <motion.div
          key={step.num}
          className="flex flex-col items-center text-center px-2 relative"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className={cn(
            "w-[56px] h-[56px] rounded-full bg-accent text-white text-sm font-semibold flex items-center justify-center mb-3 relative z-10",
            dark ? "shadow-[0_0_0_4px_var(--color-bg-dark)]" : "shadow-[0_0_0_4px_var(--color-bg)]"
          )}>
            {step.num}
          </div>
          <div className={cn(
            "text-base font-semibold mb-1 leading-tight",
            dark ? "text-white/[0.92]" : "text-text-primary"
          )}>
            {step.title}
          </div>
          <div className={cn(
            "text-base leading-relaxed",
            dark ? "text-white/55" : "text-text-secondary"
          )}>
            {step.description}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
