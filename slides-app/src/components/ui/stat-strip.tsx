import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StatItem {
  value: string
  label: string
  desc?: string
  valueClass?: string
}

interface StatStripProps {
  items: StatItem[]
  className?: string
  trailing?: ReactNode
  delay?: number
}

export function StatStrip({ items, className, trailing, delay = 0 }: StatStripProps) {
  return (
    <motion.div
      className={cn("flex items-start gap-6", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {items.map((item, i) => (
        <div key={item.label} className="flex items-start gap-6">
          <div className="flex flex-col gap-0.5">
            <div className={cn("text-[2.8rem] font-bold leading-none tracking-tight text-accent", item.valueClass)}>
              {item.value}
            </div>
            <div className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-tertiary mt-1">
              {item.label}
            </div>
            {item.desc && (
              <div className="text-[0.92rem] text-text-secondary leading-relaxed mt-1.5 max-w-[220px]">
                {item.desc}
              </div>
            )}
          </div>
          {i < items.length - 1 && (
            <div className="w-px self-stretch bg-black/10 min-h-[40px]" />
          )}
        </div>
      ))}
      {trailing && (
        <>
          <div className="w-px self-stretch bg-black/10 min-h-[40px]" />
          <div className="flex items-center">{trailing}</div>
        </>
      )}
    </motion.div>
  )
}
