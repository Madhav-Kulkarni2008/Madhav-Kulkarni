import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Upload, FileText, ArrowDown, ArrowUp, Check, ChevronDown, MessageCircleHeart } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Disclaimer, Header, SectionTitle } from '../../components/ui'
import { Analysing } from '../../components/viz'
import { fmtDate, labReport } from '../../lib/data'

type Step = 'upload' | 'reading' | 'result'

export default function LabReport() {
  const [step, setStep] = useState<Step>('upload')
  const { lang } = useApp()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
        {step === 'upload' && <UploadStep onPick={() => setStep('reading')} />}
        {step === 'reading' && <><Header title={lang === 'hi' ? 'लैब रिपोर्ट' : 'Lab report'} onBack={() => setStep('upload')} />
          <Analysing title={lang === 'hi' ? 'रिपोर्ट पढ़ रहे हैं…' : 'Reading report…'} onDone={() => setStep('result')}
            steps={lang === 'hi' ? ['टेक्स्ट पहचान (OCR)', 'टेस्ट के नाम मिलान', 'सामान्य सीमा से तुलना', 'आसान भाषा में समझा रहे हैं'] : ['Recognising text (OCR)', 'Matching test names', 'Comparing with normal ranges', 'Writing plain-language notes']} /></>}
        {step === 'result' && <Result onAgain={() => setStep('upload')} />}
      </motion.div>
    </AnimatePresence>
  )
}

function UploadStep({ onPick }: { onPick: () => void }) {
  const { lang } = useApp()
  return (
    <div>
      <Header title={lang === 'hi' ? 'लैब रिपोर्ट रीडर' : 'Lab report reader'} />
      <div className="px-4 pb-8">
        <Card className="flex flex-col items-center !py-8 text-center">
          <div className="relative">
            <div className="flex h-36 w-28 flex-col gap-2 rounded-xl border border-line bg-white p-3 shadow-md dark:bg-neutral-200">
              <div className="h-2 w-12 rounded bg-indigo-400" />
              {[80, 60, 70, 50, 75, 55, 65].map((w, i) => <div key={i} className="flex justify-between"><div className="h-1.5 rounded bg-neutral-300" style={{ width: `${w * 0.6}%` }} /><div className={`h-1.5 w-4 rounded ${i === 1 || i === 4 ? 'bg-red-400' : 'bg-neutral-300'}`} /></div>)}
            </div>
            <motion.div className="absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_12px_#0F766E]" animate={{ top: ['8%', '92%', '8%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
          <h2 className="mt-5 text-xl font-bold">{lang === 'hi' ? 'अपनी ब्लड रिपोर्ट समझें' : 'Understand your blood report'}</h2>
          <p className="mt-1 max-w-xs text-sm text-muted">{lang === 'hi' ? 'रिपोर्ट की फ़ोटो लें। हम हर मान को आसान भाषा में समझाएँगे — फ़ोन पर ही।' : 'Take a photo of the report. Every value is explained in plain language — on your phone.'}</p>
        </Card>
        <div className="mt-4 space-y-3">
          <Button full icon={<Camera size={20} aria-hidden />} onClick={onPick}>{lang === 'hi' ? 'रिपोर्ट की फ़ोटो लें' : 'Photograph report'}</Button>
          <Button full variant="secondary" icon={<Upload size={20} aria-hidden />} onClick={onPick}>{lang === 'hi' ? 'PDF / फ़ोटो अपलोड करें' : 'Upload PDF or image'}</Button>
          <button type="button" onClick={onPick} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-brand dark:text-brand-light"><FileText size={16} aria-hidden />{lang === 'hi' ? 'सैंपल रिपोर्ट आज़माएँ' : 'Try a sample report'}</button>
        </div>
      </div>
    </div>
  )
}

function RangeBar({ value, low, high }: { value: number; low: number; high: number }) {
  const span = high - low || high
  const min = Math.max(0, low - span * 0.5), max = high + span * 0.5
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))
  return (
    <div className="relative mt-2 h-2 rounded-full bg-black/5 dark:bg-white/10">
      <div className="absolute h-full rounded-full bg-emerald-400/50" style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }} />
      <motion.div className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-ink shadow" initial={{ left: '50%' }} animate={{ left: `${pct(value)}%` }} transition={{ duration: 0.8 }} />
    </div>
  )
}

function Result({ onAgain }: { onAgain: () => void }) {
  const { lang } = useApp()
  const nav = useNavigate()
  const [open, setOpen] = useState<string | null>('hb')
  const flagged = labReport.values.filter((v) => v.flag !== 'normal')
  const fmt = (n: number) => n.toLocaleString('en-IN')
  return (
    <div>
      <Header title={lang === 'hi' ? 'रिपोर्ट का सार' : 'Report summary'} subtitle={`${labReport.lab} · ${fmtDate(labReport.date, { day: 'numeric', month: 'short', year: 'numeric' })}`} onBack={onAgain} />
      <div className="px-4 pb-8">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted">{lang === 'hi' ? '6 मान पढ़े गए' : '6 values extracted'}</p>
              <p className="text-2xl font-bold">{flagged.length} {lang === 'hi' ? 'पर ध्यान दें' : 'need attention'}</p>
            </div>
            <div className="flex gap-1.5">
              <Badge tone="alert">{flagged.length} {lang === 'hi' ? 'फ़्लैग' : 'flagged'}</Badge>
              <Badge tone="ok">{labReport.values.length - flagged.length} {lang === 'hi' ? 'सामान्य' : 'normal'}</Badge>
            </div>
          </div>
        </Card>
        <SectionTitle>{lang === 'hi' ? 'मान' : 'Values'}</SectionTitle>
        <div className="space-y-2">
          {labReport.values.map((v) => {
            const isOpen = open === v.id
            const tone = v.flag === 'low' ? 'text-sky-700 dark:text-sky-300' : v.flag === 'high' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'
            return (
              <Card key={v.id} className={`!p-0 overflow-hidden ${v.flag !== 'normal' ? '!border-l-4 ' + (v.flag === 'low' ? '!border-l-sky-500' : '!border-l-red-500') : ''}`}>
                <button type="button" onClick={() => setOpen(isOpen ? null : v.id)} aria-expanded={isOpen} className="w-full px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-semibold">{v.name}</span>
                    <span className="font-bold tabular">{fmt(v.value)}</span>
                    <span className="text-xs text-muted">{v.unit}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-bold uppercase ${tone}`}>
                      {v.flag === 'low' ? <ArrowDown size={13} aria-hidden /> : v.flag === 'high' ? <ArrowUp size={13} aria-hidden /> : <Check size={13} aria-hidden />}
                      {lang === 'hi' ? (v.flag === 'low' ? 'कम' : v.flag === 'high' ? 'ज़्यादा' : 'ठीक') : v.flag}
                    </span>
                    <ChevronDown size={16} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                  </div>
                  <RangeBar value={v.value} low={v.low} high={v.high} />
                  <p className="mt-1.5 text-xs text-muted">{lang === 'hi' ? 'सामान्य' : 'Normal'}: {v.low === 0 ? `< ${fmt(v.high)}` : `${fmt(v.low)}–${fmt(v.high)}`} {v.unit}</p>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                      <p className="border-t border-line bg-soft/60 px-4 py-3 text-[15px] leading-relaxed">{lang === 'hi' ? v.explainHi : v.explain}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>
        <Disclaimer />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="secondary" icon={<MessageCircleHeart size={18} aria-hidden />} onClick={() => nav('/assistant')}>{lang === 'hi' ? 'सहायक से पूछें' : 'Ask assistant'}</Button>
          <Button icon={<FileText size={18} aria-hidden />} onClick={() => nav('/report')}>{lang === 'hi' ? 'रिपोर्ट में जोड़ें' : 'Add to report'}</Button>
        </div>
      </div>
    </div>
  )
}
