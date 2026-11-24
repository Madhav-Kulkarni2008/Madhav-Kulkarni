import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion } from 'framer-motion'

export function CountUp({ to, decimals = 0, duration = 1.1 }: { to: number; decimals?: number; duration?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [to, duration])
  return <>{v.toFixed(decimals)}</>
}

export function ScoreRing({ value, size = 168, stroke = 14, label, color = '#0F766E', children }: { value: number; size?: number; stroke?: number; label?: string; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={label ? `${label}: ${value} out of 100` : undefined}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-black/[0.06] dark:text-white/10" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: value / 100 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children ?? <span className="text-5xl font-bold tabular"><CountUp to={value} /></span>}</div>
    </div>
  )
}

export function ProgressRing({ progress, size = 280, stroke = 8, color = '#F59E0B' }: { progress: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, progress))} style={{ transition: 'stroke-dashoffset 120ms linear' }} />
    </svg>
  )
}

export function Sparkline({ data, color = '#0F766E', width = 120, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - 3 - ((d - min) / (max - min || 1)) * (height - 6)}`).join(' ')
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** PPG pulse shape: systolic peak + dicrotic notch. phase in [0,1). */
function ppg(phase: number) {
  const g = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s))
  return g(phase, 0.18, 0.07) + 0.38 * g(phase, 0.48, 0.09)
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void, running: boolean) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawRef.current(ctx, w, h, (now - start) / 1000)
      if (running) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])
  return ref
}

export function PPGWaveform({ bpm = 68, running = true, color = '#F87171', height = 90 }: { bpm?: number; running?: boolean; color?: string; height?: number }) {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h)
    const beatsPerSec = bpm / 60
    const secondsVisible = 4
    ctx.beginPath()
    for (let x = 0; x <= w; x += 2) {
      const tt = t - secondsVisible + (x / w) * secondsVisible
      const phase = ((tt * beatsPerSec) % 1 + 1) % 1
      const noise = Math.sin(tt * 17) * 0.02 + Math.sin(tt * 0.7) * 0.06
      const y = h - 8 - (ppg(phase) + noise) * (h - 20)
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.stroke()
    // leading dot
    const tt = t
    const phase = ((tt * beatsPerSec) % 1 + 1) % 1
    const y = h - 8 - (ppg(phase) + Math.sin(tt * 17) * 0.02 + Math.sin(tt * 0.7) * 0.06) * (h - 20)
    ctx.beginPath(); ctx.arc(w - 3, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
  }, running)
  return <canvas ref={ref} className="block w-full" style={{ height }} aria-label="Live pulse waveform" role="img" />
}

/** Audio waveform + spectrogram-style visual for the cough screen. Cough bursts at given times (s). */
export function AudioViz({ running, bursts, elapsed, height = 140 }: { running: boolean; bursts: number[]; elapsed: number; height?: number }) {
  const elapsedRef = useRef(elapsed)
  elapsedRef.current = elapsed
  const cols = useRef<number[][]>([])
  const ref = useCanvas((ctx, w, h, t) => {
    const e = elapsedRef.current
    const burst = bursts.reduce((m, b) => Math.max(m, Math.exp(-((e - b) ** 2) / 0.04) * (e >= b - 0.3 ? 1 : 0)), 0)
    const bins = 24
    const col = Array.from({ length: bins }, (_, i) => {
      const base = 0.08 + 0.06 * Math.random()
      const lowBoost = burst * (0.6 + 0.4 * Math.random()) * Math.exp(-i / (bins * 0.55))
      return Math.min(1, base + lowBoost + burst * 0.25 * Math.random())
    })
    if (running) cols.current.push(col)
    const maxCols = Math.floor(w / 5)
    if (cols.current.length > maxCols) cols.current.splice(0, cols.current.length - maxCols)
    ctx.clearRect(0, 0, w, h)
    const specH = h * 0.55
    const cellH = specH / bins
    cols.current.forEach((c, x) => {
      c.forEach((v, i) => {
        const hue = 175 - v * 140 // teal -> amber/red
        ctx.fillStyle = `hsla(${hue}, 85%, ${30 + v * 35}%, ${0.25 + v * 0.75})`
        ctx.fillRect(x * 5, specH - (i + 1) * cellH, 4, cellH - 1)
      })
    })
    // waveform
    const mid = specH + (h - specH) / 2
    ctx.beginPath()
    for (let x = 0; x < w; x += 2) {
      const ci = Math.floor(x / 5)
      const energy = cols.current[ci] ? cols.current[ci][0] : 0.1
      const amp = (energy - 0.08) * (h - specH) * 0.5
      const y = mid + Math.sin(x * 0.9 + t * 30) * amp * (0.6 + 0.4 * Math.sin(x * 0.13))
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = '#5EEAD4'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, true)
  return <canvas ref={ref} className="block w-full" style={{ height }} role="img" aria-label="Live audio spectrogram" />
}

export function Analysing({ steps, onDone, title }: { steps: string[]; onDone: () => void; title: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i >= steps.length) { const id = setTimeout(onDone, 400); return () => clearTimeout(id) }
    const id = setTimeout(() => setI(i + 1), 850)
    return () => clearTimeout(id)
  }, [i, steps.length, onDone])
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-8 h-28 w-28">
        {[0, 1, 2].map((k) => (
          <motion.span key={k} className="absolute inset-0 rounded-full border-2 border-brand/40" animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: k * 0.6 }} />
        ))}
        <motion.div className="absolute inset-6 rounded-full bg-brand" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="mt-5 space-y-2 text-left">
        {steps.map((s, k) => (
          <li key={s} className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${k <= i ? 'opacity-100' : 'opacity-30'}`}>
            <span className={`h-2 w-2 rounded-full ${k < i ? 'bg-brand' : k === i ? 'bg-accent animate-pulse' : 'bg-line'}`} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
