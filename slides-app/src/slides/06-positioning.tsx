import { motion } from "framer-motion"
import { SlideLayout } from "./slide-layout"
import { Eyebrow } from "@/components/ui/eyebrow"

const base = import.meta.env.BASE_URL

/* Katabatic wind mark — extracted from katabatic-logo.tsx */
const KatabaticMark = () => (
  <svg width="26" height="36" viewBox="0 0 30 44" fill="none">
    <line x1="3" y1="2" x2="9" y2="42" stroke="rgba(108,92,231,0.35)" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="13" y1="2" x2="19" y2="42" stroke="rgba(108,92,231,0.65)" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="23" y1="2" x2="29" y2="42" stroke="#6c5ce7" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
)

const LINE_DATA = [
  { x1: 3, x2: 9, color: "rgba(108,92,231,0.35)", delay: 0 },
  { x1: 13, x2: 19, color: "rgba(108,92,231,0.65)", delay: 0.1 },
  { x1: 23, x2: 29, color: "#6c5ce7", delay: 0.2 },
]

const KATABATIC_LETTERS = "katabatic".split("")
const LETTER_STAGGER = 0.055
const LETTER_START = 0.32

/* Animated "katabatic" — wind mark + letter-by-letter reveal, inline in text */
const AnimatedKatabatic = () => (
  <>
    <AnimatedWindMark />
    {KATABATIC_LETTERS.map((char, i) => (
      <motion.span
        key={i}
        style={{ display: "inline-block" }}
        initial={{ opacity: 0, x: -6, filter: "blur(8px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.5,
          delay: LETTER_START + i * LETTER_STAGGER,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {char}
      </motion.span>
    ))}
  </>
)

/* Animated wind mark — inline SVG with stroke-draw, sized to match surrounding text */
const AnimatedWindMark = () => (
  <motion.svg
    viewBox="0 0 30 44"
    fill="none"
    className="overflow-visible"
    style={{ display: "inline", width: "0.6em", height: "0.9em", verticalAlign: "baseline", position: "relative", top: "0.05em", marginRight: "0.08em" }}
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {LINE_DATA.map((l, i) => (
      <motion.line
        key={i}
        x1={l.x1} y1="2" x2={l.x2} y2="42"
        stroke={l.color} strokeWidth="3.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.7, delay: l.delay, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.15, delay: l.delay },
        }}
      />
    ))}
  </motion.svg>
)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
})

interface LogoItem {
  src: string
  name: string
}

const layers: {
  num: string
  numColor: string
  borderColor: string
  title: string
  logos: LogoItem[]
  katabatic?: boolean
  featured: boolean
}[] = [
  {
    num: "Layer 1",
    numColor: "text-text-tertiary",
    borderColor: "border-black/15",
    title: "Onchain Data Platforms",
    logos: [
      { src: `${base}logos/dune.svg`, name: "Dune" },
      { src: `${base}logos/nansen.svg`, name: "Nansen" },
      { src: `${base}logos/chainalysis.svg`, name: "Chainalysis" },
    ],
    featured: false,
  },
  {
    num: "Layer 2",
    numColor: "text-accent",
    borderColor: "border-accent",
    title: "Reserve Risk Infrastructure",
    logos: [],
    katabatic: true,
    featured: true,
  },
  {
    num: "Layer 3",
    numColor: "text-text-tertiary",
    borderColor: "border-black/15",
    title: "Downstream Consumers",
    logos: [
      { src: `${base}logos/mkr.svg`, name: "MakerDAO" },
      { src: `${base}logos/aave.svg`, name: "Aave" },
      { src: `${base}logos/risk-desks.svg`, name: "Risk Desks" },
    ],
    featured: false,
  },
]


export function SlidePositioning(_props: { subStep?: number }) {
  return (
    <SlideLayout variant="alt">
      <Eyebrow>Positioning</Eyebrow>
      <motion.h2
        className="text-[clamp(2.2rem,3.5vw,3rem)] font-bold leading-tight tracking-[-0.028em]"
        {...fadeUp(0)}
      >
        Onchain shows the flows.
        <br />
        <AnimatedKatabatic /> shows <span className="gradient-text">what&apos;s about to break.</span>
      </motion.h2>

      {/* 3 layers — original containers with connecting line + chevrons */}
      <div className="relative mt-4">

        <div className="flex gap-5 relative">
          {layers.map((layer, i) => (
            <div key={layer.title} className="contents">
              <motion.div
                className={`flex-1 border-l-4 ${layer.borderColor} pl-6 py-5 relative z-[1] ${
                  layer.featured ? "bg-accent/[0.04] px-7 rounded-r-lg shadow-[0_0_0_1px_rgba(108,92,231,0.08)]" : "bg-bg-alt"
                }`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`text-[0.85rem] font-semibold uppercase tracking-[0.1em] mb-2.5 ${layer.numColor}`}>{layer.num}</div>
                <div className="text-[1.3rem] font-semibold text-text-primary mb-4">{layer.title}</div>

                {layer.katabatic ? (
                  <div className="flex items-center gap-3">
                    <KatabaticMark />
                    <span className="text-[1.15rem] font-semibold text-accent tracking-[-0.02em]">katabatic</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {layer.logos.map(logo => (
                      <div key={logo.name} className="flex items-center gap-2" title={logo.name}>
                        <img src={logo.src} alt={logo.name} className="w-8 h-8 rounded-full" />
                        <span className="text-[0.88rem] text-text-tertiary font-medium">{logo.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Chevron arrow in the gap between cards */}
              {i < layers.length - 1 && (
                <motion.div
                  className="flex items-center justify-center self-center z-[2]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg className="text-accent/25" width="16" height="24" viewBox="0 0 14 20" fill="none">
                    <path d="M2 1 L12 10 L2 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dark section — slides in from left after layers, completing the L shape */}
      <motion.div
        className="bg-bg-dark rounded-2xl px-10 py-7 mt-6 flex items-center gap-10"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-accent-light/50 whitespace-nowrap shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          What Onchain<br />Can&apos;t See
        </motion.div>
        <div className="w-px h-10 bg-white/[0.08] shrink-0" />
        <div className="flex items-center gap-6 flex-1">
          {["Duration mismatch", "Bank health signals", "Data center ops risk", "Weather tail-risk"].map((item, i) => (
            <motion.span
              key={item}
              className="text-[1.15rem] font-semibold text-white/80 whitespace-nowrap"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </SlideLayout>
  )
}
