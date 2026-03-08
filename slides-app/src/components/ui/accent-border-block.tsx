import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface AccentBorderBlockProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
}

export function AccentBorderBlock({ className, color = "border-accent", children, ...props }: AccentBorderBlockProps) {
  return (
    <div
      className={cn("border-l-4 pl-5", color, className)}
      {...props}
    >
      {children}
    </div>
  )
}
