import { useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedNumber({ value, delay = 0, decimals = 0 }: { value: number; delay?: number; decimals?: number }) {
  const mv = useMotionValue(0)
  const formatted = useTransform(mv, (v) => decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString())
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : "0")

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
      return () => controls.stop()
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [mv, value, delay])

  useEffect(() => {
    const unsub = formatted.on("change", (v) => setDisplay(v))
    return unsub
  }, [formatted])

  return <>{display}</>
}
