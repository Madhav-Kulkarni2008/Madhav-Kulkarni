import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, HeartPulse, Waves, Wind, Brain, Share2, BookmarkCheck, Bookmark, RotateCcw, X, Camera, Hand, Flashlight, Timer, Sun } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Disclaimer, Header, Toggle } from '../../components/ui'
import { StatBox } from '../../components/MetricTile'
import { CountUp, PPGWaveform, ProgressRing } from '../../components/viz'
import { scans } from '../../lib/data'
import { useCamera } from '../../lib/useMedia'

type Step = 'intro' | 'scan' | 'result'
const DURATION = 30

export default function PulseScan() {
  const [step, setStep] = useState<Step>('intro')
  const [useCam, setUseCam] = useState(true)
  const [variant, setVariant] = useState<'normal' | 'flagged'>('normal')
  return (
    <AnimatePresence mode="wait">
      {step === 'intro' && <motion.div key="i" exit={{ opacity: 0 }}><Intro useCam={useCam} setUseCam={setUseCam} onStart={() => setStep('scan')} /></motion.div>}
      {step === 'scan' && <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Scanning useCam={useCam} bpm={scans.pulse[variant].bpm} onCancel={() => setStep('intro')} onDone={() => setStep('result')} /></motion.div>}
      {step === 'result' && <motion.div key="r" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Result variant={variant} setVariant={setVariant} onAgain={() => setStep('scan')} /></motion.div>}
    </AnimatePresence>
  )
}

function FingerIllustration() {
  return (
    <svg viewBox="0 0 240 200" className="mx-auto h-48 w-auto" role="img" aria-label="Fingertip covering the rear camera and flash">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#F87171" stopOpacity="0.9" /><stop offset="100%" stopColor="#F87171" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="60" y="14" width="120" height="180" rx="22" fill="#1F2937" />
      <rect x="74" y="28" width="56" height="62" rx="14" fill="#374151" />
      <circle cx="92" cy="46" r="10" fill="#111827" stroke="#4B5563" strokeWidth="3" />
      <circle cx="92" cy="72" r="10" fill="#111827" stroke="#4B5563" strokeWidth="3" />
      <circle cx="116" cy="46" r="5" fill="#FDE68A" />
      <motion.circle cx="100" cy="56" r="44" fill="url(#glow)" animate={{ opacity: [0.35, 0.85, 0.35] }} transition={{ duration: 0.9, repeat: Infinity }} />
      <path d="M150 196 C150 150 140 110 122 74 C114 58 96 42 86 48 C76 54 82 70 90 84 L104 116 L104 196 Z" fill="#E8B796" stroke="#C98E6B" strokeWidth="2" />
      <ellipse cx="92" cy="56" rx="12" ry="9" fill="#F2C7A8" opacity="0.9" />
    </svg>
  )
}

function Intro({ useCam, setUseCam, onStart }: { useCam: boolean; setUseCam: (v: boolean) => void; onStart: () => void }) {
  const { lang } = useApp()
  const tips = lang === 'hi'
    ? [{ I: Hand, t: 'उँगली के सिरे से पीछे का कैमरा और फ़्लैश ढकें' }, { I: Sun, t: 'हल्का दबाएँ — ज़्यादा ज़ोर से नहीं' }, { I: Timer, t: '30 सेकंड तक बिल्कुल स्थिर रहें' }]
    : [{ I: Hand, t: 'Cover the rear camera and flash with your fingertip' }, { I: Sun, t: 'Press lightly — not too hard' }, { I: Timer, t: 'Stay still and quiet for 30 seconds' }]
  return (
    <div>
      <Header title={lang === 'hi' ? 'नब्ज़ · HRV · SpO₂' : 'Pulse · HRV · SpO₂'} subtitle={lang === 'hi' ? '30 सेकंड की जाँच' : '30-second camera scan'} />
      <div className="px-4 pb-8">
        <Card className="bg-gradient-to-b from-rose-50 to-card dark:from-rose-950/30">
          <FingerIllustration />
          <h2 className="mt-2 text-center text-xl font-bold">{lang === 'hi' ? 'उँगली से कैमरा ढकें' : 'Cover the rear camera and flash with your fingertip'}</h2>
          <p className="mt-1 text-center text-sm text-muted">{lang === 'hi' ? 'फ़्लैश की रोशनी आपकी उँगली से गुज़रती है। हर धड़कन के साथ रंग थोड़ा बदलता है — इसी से नब्ज़ मापी जाती है।' : 'The flash shines through your finger. Each heartbeat changes the colour slightly — that is how your pulse is read (PPG).'}</p>
        </Card>
        <ul className="mt-4 space-y-2">
          {tips.map(({ I, t }) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft text-brand dark:text-brand-light"><I size={18} aria-hidden /></span>
              <span className="text-[15px] font-medium">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <Camera size={20} className="text-muted" aria-hidden />
            <div>
              <p className="font-semibold">{lang === 'hi' ? 'लाइव कैमरा प्रीव्यू' : 'Live camera preview'}</p>
              <p className="text-xs text-muted">{lang === 'hi' ? 'वीडियो फ़ोन से बाहर नहीं जाता' : 'Video never leaves your phone'}</p>
            </div>
          </div>
          <Toggle checked={useCam} onChange={setUseCam} label="Live camera preview" />
        </div>
        <Button full className="mt-6 !bg-rose-600 hover:!bg-rose-700" icon={<HeartPulse size={20} aria-hidden />} onClick={onStart}>{lang === 'hi' ? 'जाँच शुरू करें' : 'Start scan'}</Button>
      </div>
    </div>
  )
}

function Scanning({ useCam, bpm, onCancel, onDone }: { useCam: boolean; bpm: number; onCancel: () => void; onDone: () => void }) {
  const { lang } = useApp()
  const { videoRef, live } = useCamera(useCam, 'environment', true)
  const [elapsed, setElapsed] = useState(0)
  const [liveBpm, setLiveBpm] = useState<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const e = (performance.now() - start) / 1000
      setElapsed(e)
      if (e >= DURATION) { clearInterval(id); onDone() }
    }, 100)
    return () => clearInterval(id)
  }, [onDone])

  useEffect(() => {
    if (elapsed < 4) return
    const spread = Math.max(1, 9 - elapsed * 0.3)
    setLiveBpm(Math.round(bpm + (Math.random() * 2 - 1) * spread))
    // update ~once a second
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(elapsed)])

  const tipsEn = ['Finding your pulse…', 'Keep still', 'Press lightly', 'Breathe normally', 'Almost there…']
  const tipsHi = ['आपकी नब्ज़ ढूँढ रहे हैं…', 'स्थिर रहें', 'हल्का दबाएँ', 'सामान्य साँस लें', 'बस थोड़ा और…']
  const tips = lang === 'hi' ? tipsHi : tipsEn
  const tip = tips[Math.min(tips.length - 1, Math.floor(elapsed / 6.5))]
  const remaining = Math.max(0, Math.ceil(DURATION - elapsed))
  const beat = 60 / bpm

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B0B0F] text-white md:min-h-[824px]">
      <div className="flex items-center justify-between px-4 pb-2 pt-4 md:pt-10">
        <button type="button" aria-label="Cancel scan" onClick={onCancel} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"><X size={22} aria-hidden /></button>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
          <span className={`h-2 w-2 rounded-full ${elapsed > 3 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          {elapsed > 3 ? (lang === 'hi' ? 'अच्छा सिग्नल' : 'Good signal') : (lang === 'hi' ? 'सिग्नल खोज रहे हैं' : 'Detecting signal')}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="Flash on"><Flashlight size={20} className="text-amber-300" aria-hidden /></div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-[280px] w-[280px]">
          <ProgressRing progress={elapsed / DURATION} />
          <div className="absolute inset-[18px] overflow-hidden rounded-full">
            <video ref={videoRef} muted playsInline className={`h-full w-full object-cover ${live ? 'opacity-100' : 'opacity-0'}`} style={{ filter: 'grayscale(1) contrast(1.2) brightness(0.9)' }} />
            <motion.div className="absolute inset-0" style={{ background: live ? 'rgba(220,20,30,0.72)' : 'radial-gradient(circle at 45% 40%, #FF6B6B 0%, #C1121F 45%, #5A0A10 100%)', mixBlendMode: live ? 'multiply' : 'normal' }}
              animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: beat, repeat: Infinity, ease: 'easeInOut' }} />
            {live && <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, rgba(255,80,80,0.35), rgba(80,0,0,0.6))' }} />}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.22, 1, 1.08, 1] }} transition={{ duration: beat, repeat: Infinity, times: [0, 0.15, 0.3, 0.42, 1] }}>
              <Heart size={44} fill="white" className="drop-shadow-lg" aria-hidden />
            </motion.div>
            <div className="mt-2 text-5xl font-bold tabular drop-shadow" aria-live="polite">{liveBpm ?? '--'}</div>
            <div className="text-sm font-semibold text-white/80">BPM</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-4xl font-bold tabular">0:{String(remaining).padStart(2, '0')}</div>
          <AnimatePresence mode="wait">
            <motion.p key={tip} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-1 text-lg font-medium text-white/85">{tip}</motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-4 mt-6 rounded-[20px] bg-white/5 p-3">
        <div className="mb-1 flex justify-between text-xs font-semibold text-white/60"><span>PPG</span><span>{lang === 'hi' ? 'लाइव' : 'Live'}</span></div>
        <PPGWaveform bpm={bpm} running />
      </div>
      <div className="mt-auto px-4 pb-6 pt-6 text-center">
        <button type="button" onClick={onDone} className="text-sm font-medium text-white/50 underline-offset-4 hover:underline">{lang === 'hi' ? 'छोड़ें (डेमो)' : 'Skip to result (demo)'}</button>
      </div>
    </div>
  )
}

function Result({ variant, setVariant, onAgain }: { variant: 'normal' | 'flagged'; setVariant: (v: 'normal' | 'flagged') => void; onAgain: () => void }) {
  const { lang, toast } = useApp()
  const nav = useNavigate()
  const r = scans.pulse[variant]
  const [saved, setSaved] = useState(false)
  const save = useCallback(() => { setSaved(true); toast(lang === 'hi' ? 'आपके स्वास्थ्य रिकॉर्ड में सेव हुआ' : 'Saved to your health record', 'success') }, [lang, toast])
  const diff = r.bpm - r.baseline.bpm
  const rows = [
    { k: lang === 'hi' ? 'धड़कन' : 'Heart rate', now: r.bpm, base: r.baseline.bpm, unit: 'bpm', max: 110 },
    { k: 'HRV', now: r.hrv, base: r.baseline.hrv, unit: 'ms', max: 80 },
    { k: 'SpO₂', now: r.spo2, base: r.baseline.spo2, unit: '%', max: 100 },
  ]
  return (
    <div>
      <Header title={lang === 'hi' ? 'आपका परिणाम' : 'Your result'} subtitle={new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} onBack={() => nav('/')} />
      <div className="px-4 pb-8">
        <Card className="!p-5 text-center">
          <motion.div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 60 / r.bpm, repeat: Infinity }}>
            <Heart size={30} fill="currentColor" aria-hidden />
          </motion.div>
          <div className="mt-3 flex items-baseline justify-center gap-1">
            <span className="text-6xl font-bold tracking-tight tabular"><CountUp to={r.bpm} /></span>
            <span className="text-lg font-semibold text-muted">bpm</span>
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <Badge tone={Math.abs(diff) > 10 ? 'accent' : 'ok'}>{diff >= 0 ? '+' : ''}{diff} {lang === 'hi' ? 'आपके औसत से' : 'vs your baseline'}</Badge>
            <Badge tone="muted">{r.quality}</Badge>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatBox label="HRV (RMSSD)" value={<CountUp to={r.hrv} />} unit="ms" note={`${lang === 'hi' ? 'औसत' : 'Baseline'} ${r.baseline.hrv} ms`} tone={r.hrv < r.baseline.hrv * 0.75 ? 'warn' : 'default'} />
          <StatBox label="SpO₂" value={<CountUp to={r.spo2} />} unit="%" note={lang === 'hi' ? 'सामान्य: 95–100%' : 'Normal: 95–100%'} badge={<Badge tone="accent">{lang === 'hi' ? 'प्रायोगिक' : 'Experimental'}</Badge>} />
          <div className="col-span-2">
            <StatBox label={lang === 'hi' ? 'तनाव स्तर' : 'Stress level'} value={r.stress} note={`${r.stressScore}/100 · ${lang === 'hi' ? 'HRV से अनुमानित' : 'estimated from HRV'}`} tone={r.stress === 'High' ? 'warn' : 'default'} badge={<Brain size={18} className="text-violet-600" aria-hidden />} />
          </div>
        </div>

        <Card className="mt-3">
          <h3 className="font-bold">{lang === 'hi' ? 'आपके औसत से तुलना' : 'Compared with your baseline'}</h3>
          <div className="mt-3 space-y-3">
            {rows.map((row) => (
              <div key={row.k}>
                <div className="flex justify-between text-sm"><span className="font-semibold">{row.k}</span><span className="tabular text-muted">{row.now} {row.unit} · {lang === 'hi' ? 'औसत' : 'usual'} {row.base}</span></div>
                <div className="relative mt-1.5 h-2.5 rounded-full bg-black/5 dark:bg-white/10">
                  <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${(row.now / row.max) * 100}%` }} transition={{ duration: 0.9 }} />
                  <div className="absolute -top-1 h-[18px] w-0.5 rounded bg-ink" style={{ left: `${(row.base / row.max) * 100}%` }} title="Your baseline" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{lang === 'hi' ? 'काली रेखा = आपका 2 हफ़्ते का औसत' : 'Black line = your 2-week baseline'}</p>
        </Card>

        <Card className="mt-3">
          <h3 className="flex items-center gap-2 font-bold"><Waves size={18} className="text-brand" aria-hidden />{lang === 'hi' ? 'इसका क्या मतलब है' : 'What this means'}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{lang === 'hi' ? r.explanationHi : r.explanation}</p>
        </Card>

        <Disclaimer />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant={saved ? 'secondary' : 'primary'} icon={saved ? <BookmarkCheck size={19} aria-hidden /> : <Bookmark size={19} aria-hidden />} onClick={save} disabled={saved}>{saved ? (lang === 'hi' ? 'सेव हुआ' : 'Saved') : (lang === 'hi' ? 'सेव करें' : 'Save')}</Button>
          <Button variant="secondary" icon={<Share2 size={19} aria-hidden />} onClick={() => nav('/report')}>{lang === 'hi' ? 'डॉक्टर को भेजें' : 'Share with doctor'}</Button>
        </div>
        <Button variant="ghost" full className="mt-2" icon={<RotateCcw size={18} aria-hidden />} onClick={onAgain}>{lang === 'hi' ? 'फिर से जाँचें' : 'Scan again'}</Button>
        <button type="button" onClick={() => { setVariant(variant === 'normal' ? 'flagged' : 'normal'); setSaved(false) }} className="mt-3 w-full text-center text-xs font-medium text-muted underline underline-offset-4">
          {variant === 'normal' ? (lang === 'hi' ? 'डेमो: फ़्लैग्ड परिणाम देखें' : 'Demo: show a flagged result') : (lang === 'hi' ? 'डेमो: सामान्य परिणाम देखें' : 'Demo: show a normal result')}
        </button>
      </div>
    </div>
  )
}
