import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Volume2, VolumeX, Smartphone, Square, RotateCcw, Wind, AlertTriangle, CheckCircle2, Hospital } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Disclaimer, Header, PrototypeBadge } from '../../components/ui'
import { StatBox } from '../../components/MetricTile'
import { Analysing, AudioViz, CountUp } from '../../components/viz'
import { scans } from '../../lib/data'

type Step = 'intro' | 'record' | 'analyse' | 'result'
const DURATION = 15
const BURSTS = [2.4, 4.1, 6.8, 9.3, 11.9]

export default function CoughCheck() {
  const [step, setStep] = useState<Step>('intro')
  const [variant, setVariant] = useState<'normal' | 'flagged'>('normal')
  const { lang } = useApp()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
        {step === 'intro' && <Intro onStart={() => setStep('record')} />}
        {step === 'record' && <Record onCancel={() => setStep('intro')} onDone={() => setStep('analyse')} />}
        {step === 'analyse' && <Analysing title={lang === 'hi' ? 'खाँसी का विश्लेषण…' : 'Analysing your cough…'} onDone={() => setStep('result')}
          steps={lang === 'hi' ? ['आवाज़ से शोर हटा रहे हैं', 'खाँसी की गिनती', 'आवाज़ का पैटर्न पहचान रहे हैं', 'जोखिम का आकलन'] : ['Removing background noise', 'Counting coughs', 'Classifying sound pattern', 'Estimating risk']} />}
        {step === 'result' && <Result variant={variant} setVariant={setVariant} onAgain={() => setStep('intro')} />}
      </motion.div>
    </AnimatePresence>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
  const { lang } = useApp()
  return (
    <div>
      <Header title={lang === 'hi' ? 'खाँसी जाँच' : 'Cough screen'} right={<PrototypeBadge />} />
      <div className="px-4 pb-8">
        <Card className="bg-gradient-to-b from-amber-50 to-card text-center dark:from-amber-950/30">
          <div className="relative mx-auto my-4 flex h-28 w-28 items-center justify-center">
            {[0, 1].map((k) => <motion.span key={k} className="absolute inset-0 rounded-full border-2 border-accent" animate={{ scale: [0.7, 1.3], opacity: [0.9, 0] }} transition={{ duration: 2, repeat: Infinity, delay: k }} />)}
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg"><Mic size={36} aria-hidden /></span>
          </div>
          <h2 className="text-xl font-bold">{lang === 'hi' ? 'फ़ोन के पास 3–5 बार खाँसें' : 'Cough 3–5 times near your phone'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'hi' ? 'आपकी खाँसी की आवाज़ से सूखी/गीली खाँसी और टीबी या अस्थमा के जोखिम का अनुमान लगाया जाता है।' : 'The sound of your cough is used to estimate dry vs wet cough and flag possible TB or asthma risk.'}</p>
        </Card>
        <ul className="mt-4 space-y-2">
          {[
            { I: Smartphone, t: lang === 'hi' ? 'फ़ोन मुँह से लगभग 30 सेमी दूर रखें' : 'Hold the phone about 30 cm from your mouth' },
            { I: VolumeX, t: lang === 'hi' ? 'शांत कमरे में, पंखा बंद करके' : 'Quiet room, fan off if possible' },
            { I: Volume2, t: lang === 'hi' ? 'प्राकृतिक रूप से खाँसें, ज़बरदस्ती नहीं' : 'Cough naturally — don’t force it' },
          ].map(({ I, t }) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft text-brand dark:text-brand-light"><I size={18} aria-hidden /></span>
              <span className="text-[15px] font-medium">{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 px-1 text-xs text-muted">{lang === 'hi' ? 'रिकॉर्डिंग फ़ोन पर ही प्रोसेस होती है और विश्लेषण के बाद हटा दी जाती है।' : 'The recording is processed on your phone and deleted after analysis.'}</p>
        <Button full className="mt-6 !bg-orange-600 hover:!bg-orange-700" icon={<Mic size={20} aria-hidden />} onClick={onStart}>{lang === 'hi' ? 'रिकॉर्डिंग शुरू करें' : 'Start recording'}</Button>
      </div>
    </div>
  )
}

function Record({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  const { lang } = useApp()
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const e = (performance.now() - start) / 1000
      setElapsed(e)
      if (e >= DURATION) { clearInterval(id); onDone() }
    }, 80)
    return () => clearInterval(id)
  }, [onDone])
  const count = BURSTS.filter((b) => b < elapsed).length
  const remaining = Math.max(0, Math.ceil(DURATION - elapsed))
  const justCoughed = BURSTS.some((b) => elapsed - b > 0 && elapsed - b < 0.6)
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B1211] text-white md:min-h-[824px]">
      <Header title={lang === 'hi' ? 'रिकॉर्ड हो रहा है' : 'Recording'} onBack={onCancel} tone="dark" right={
        <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />REC</span>} />
      <div className="flex flex-col items-center px-4 pt-4">
        <div className="text-6xl font-bold tabular">0:{String(remaining).padStart(2, '0')}</div>
        <p className="mt-1 text-white/70">{lang === 'hi' ? 'अब 3–5 बार खाँसें' : 'Cough 3–5 times now'}</p>
        <motion.div className="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600" animate={{ scale: justCoughed ? 1.18 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
          <Mic size={44} aria-hidden />
        </motion.div>
        <div className="mt-6 flex items-center gap-2" aria-live="polite">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span key={i} className={`h-3 w-3 rounded-full ${i < count ? 'bg-accent' : 'bg-white/20'}`} animate={{ scale: i === count - 1 && justCoughed ? 1.6 : 1 }} />
          ))}
          <span className="ml-2 text-sm font-semibold">{count} {lang === 'hi' ? 'खाँसी पहचानी गई' : count === 1 ? 'cough detected' : 'coughs detected'}</span>
        </div>
      </div>
      <div className="mx-4 mt-8 rounded-[20px] bg-white/5 p-3">
        <div className="mb-2 flex justify-between text-xs font-semibold text-white/60"><span>{lang === 'hi' ? 'स्पेक्ट्रोग्राम' : 'Spectrogram'}</span><span>0–4 kHz</span></div>
        <AudioViz running bursts={BURSTS} elapsed={elapsed} />
      </div>
      <div className="mt-auto flex justify-center px-4 py-6">
        <button type="button" onClick={onDone} className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-semibold"><Square size={16} fill="currentColor" aria-hidden />{lang === 'hi' ? 'रोकें और विश्लेषण करें' : 'Stop & analyse'}</button>
      </div>
    </div>
  )
}

function Result({ variant, setVariant, onAgain }: { variant: 'normal' | 'flagged'; setVariant: (v: 'normal' | 'flagged') => void; onAgain: () => void }) {
  const { lang, toast } = useApp()
  const nav = useNavigate()
  const r = scans.cough[variant]
  const elevated = r.risk === 'Elevated'
  const bars = useMemo(() => Array.from({ length: 48 }, (_, i) => {
    const near = BURSTS.some((b) => Math.abs(i / 48 * 15 - b) < 0.35)
    return near ? 0.55 + Math.random() * 0.45 : 0.06 + Math.random() * 0.08
  }), [])
  return (
    <div>
      <Header title={lang === 'hi' ? 'खाँसी परिणाम' : 'Cough result'} right={<PrototypeBadge />} onBack={() => nav('/')} />
      <div className="px-4 pb-8">
        <Card className={`!p-5 ${elevated ? '!border-red-200 dark:!border-red-900' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">{lang === 'hi' ? 'टीबी / अस्थमा जोखिम' : 'TB / asthma risk flag'}</span>
            <Badge tone={elevated ? 'alert' : 'ok'} icon={elevated ? <AlertTriangle size={13} aria-hidden /> : <CheckCircle2 size={13} aria-hidden />}>{elevated ? (lang === 'hi' ? 'बढ़ा हुआ' : 'Elevated') : (lang === 'hi' ? 'कम' : 'Low')}</Badge>
          </div>
          <div className="mt-4 flex h-16 items-end gap-[3px]" aria-hidden>
            {bars.map((h, i) => <motion.span key={i} className={`flex-1 rounded-sm ${h > 0.4 ? (elevated ? 'bg-red-500' : 'bg-accent') : 'bg-black/10 dark:bg-white/15'}`} initial={{ height: 0 }} animate={{ height: `${h * 100}%` }} transition={{ delay: i * 0.01 }} />)}
          </div>
          <p className="mt-2 text-xs text-muted">{lang === 'hi' ? '15 सेकंड की रिकॉर्डिंग' : '15-second recording'}</p>
        </Card>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <StatBox label={lang === 'hi' ? 'खाँसी गिनती' : 'Cough count'} value={<CountUp to={r.count} />} note={lang === 'hi' ? '15 सेकंड में' : 'in 15 seconds'} />
          <StatBox label={lang === 'hi' ? 'पैटर्न' : 'Pattern'} value={lang === 'hi' ? (r.pattern === 'Dry' ? 'सूखी' : 'गीली') : r.pattern} note={lang === 'hi' ? 'आवाज़ से अनुमानित' : 'estimated from sound'} badge={<Wind size={18} className="text-muted" aria-hidden />} tone={r.pattern === 'Wet' ? 'warn' : 'default'} />
        </div>
        <Card className="mt-3">
          <h3 className="font-bold">{lang === 'hi' ? 'सलाह' : 'Recommendation'}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{lang === 'hi' ? r.recommendationHi : r.recommendation}</p>
        </Card>
        {elevated && <Button full className="mt-4" icon={<Hospital size={20} aria-hidden />} onClick={() => toast(lang === 'hi' ? 'नज़दीकी केंद्र: UPHC एजीपुरा, 2.0 किमी' : 'Nearest centre: UPHC Ejipura, 2.0 km (mock)', 'success')}>{lang === 'hi' ? 'मुफ़्त टीबी जाँच केंद्र खोजें' : 'Find a free TB test centre'}</Button>}
        <Disclaimer />
        <Button variant="ghost" full className="mt-3" icon={<RotateCcw size={18} aria-hidden />} onClick={onAgain}>{lang === 'hi' ? 'फिर से रिकॉर्ड करें' : 'Record again'}</Button>
        <button type="button" onClick={() => setVariant(elevated ? 'normal' : 'flagged')} className="mt-2 w-full text-center text-xs font-medium text-muted underline underline-offset-4">
          {elevated ? 'Demo: show a low-risk result' : 'Demo: show an elevated-risk result'}
        </button>
      </div>
    </div>
  )
}
