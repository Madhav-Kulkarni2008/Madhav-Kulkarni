import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Hand, Camera, Image as ImageIcon, FlaskConical, MapPin, Home as HomeIcon, Droplet, CheckCircle2, AlertTriangle, RotateCcw, Zap } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Disclaimer, Header, PrototypeBadge, SectionTitle } from '../../components/ui'
import { Analysing } from '../../components/viz'
import { scans } from '../../lib/data'
import { useCamera } from '../../lib/useMedia'

type Site = 'eyelid' | 'nails'
type Step = 'choose' | 'capture' | 'analyse' | 'result'

export default function AnaemiaCheck() {
  const [step, setStep] = useState<Step>('choose')
  const [site, setSite] = useState<Site>('eyelid')
  const [variant, setVariant] = useState<'flagged' | 'normal'>('flagged')
  const { lang } = useApp()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
        {step === 'choose' && <Choose site={site} setSite={setSite} onNext={() => setStep('capture')} />}
        {step === 'capture' && <Capture site={site} onBack={() => setStep('choose')} onCapture={() => setStep('analyse')} />}
        {step === 'analyse' && <Analysing title={lang === 'hi' ? 'विश्लेषण हो रहा है…' : 'Analysing…'} onDone={() => setStep('result')}
          steps={lang === 'hi' ? ['फ़ोटो की गुणवत्ता जाँच', 'रंग संतुलन ठीक कर रहे हैं', 'पलक का हिस्सा पहचान रहे हैं', 'हीमोग्लोबिन का अनुमान'] : ['Checking photo quality', 'Correcting colour balance', 'Finding the conjunctiva region', 'Estimating haemoglobin']} />}
        {step === 'result' && <Result variant={variant} setVariant={setVariant} onAgain={() => setStep('choose')} />}
      </motion.div>
    </AnimatePresence>
  )
}

function EyelidArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-auto" aria-hidden>
      <ellipse cx="60" cy="34" rx="44" ry="22" fill="#fff" stroke="#C98E6B" strokeWidth="2" />
      <circle cx="60" cy="32" r="14" fill="#6B4226" /><circle cx="60" cy="32" r="6" fill="#111" /><circle cx="64" cy="28" r="2.5" fill="#fff" />
      <path d="M18 40 Q60 74 102 40 Q60 58 18 40Z" fill="#E57373" />
      <path d="M24 44 Q60 66 96 44" fill="none" stroke="#C62828" strokeWidth="1.5" opacity=".6" />
      <path d="M40 66 L46 58 M60 70 L60 61 M80 66 L74 58" stroke="#E8B796" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
function NailsArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-auto" aria-hidden>
      {[18, 40, 62, 84].map((x, i) => (
        <g key={x}><rect x={x} y={10 + (i === 0 || i === 3 ? 8 : 0)} width="18" height="62" rx="9" fill="#E8B796" /><rect x={x + 3} y={14 + (i === 0 || i === 3 ? 8 : 0)} width="12" height="14" rx="6" fill="#F4C2C2" stroke="#D99" /></g>
      ))}
    </svg>
  )
}

function Choose({ site, setSite, onNext }: { site: Site; setSite: (s: Site) => void; onNext: () => void }) {
  const { lang } = useApp()
  const opts: { id: Site; title: string; sub: string; Icon: typeof Eye; Art: () => React.JSX.Element }[] = [
    { id: 'eyelid', title: lang === 'hi' ? 'निचली पलक का अंदरूनी हिस्सा' : 'Inner eyelid', sub: lang === 'hi' ? 'पलक को हल्के से नीचे खींचें · सबसे सटीक' : 'Gently pull down your lower eyelid · most accurate', Icon: Eye, Art: EyelidArt },
    { id: 'nails', title: lang === 'hi' ? 'नाखून' : 'Fingernails', sub: lang === 'hi' ? 'नेल पॉलिश हटाएँ, हाथ समतल रखें' : 'No nail polish, hand flat on a table', Icon: Hand, Art: NailsArt },
  ]
  return (
    <div>
      <Header title={lang === 'hi' ? 'एनीमिया जाँच' : 'Anaemia check'} right={<PrototypeBadge />} />
      <div className="px-4 pb-8">
        <p className="px-1 text-muted">{lang === 'hi' ? 'खून की कमी से पलक और नाखून फीके दिखते हैं। एक फ़ोटो से हीमोग्लोबिन का अनुमान लगाएँ।' : 'Low haemoglobin makes the inner eyelid and nail beds look paler. A photo gives an estimate.'}</p>
        <SectionTitle>{lang === 'hi' ? 'जगह चुनें' : 'Choose a site'}</SectionTitle>
        <div className="space-y-3">
          {opts.map(({ id, title, sub, Art }) => (
            <button key={id} type="button" onClick={() => setSite(id)} aria-pressed={site === id}
              className={`flex w-full items-center gap-4 rounded-[20px] border-2 bg-card p-4 text-left transition-all ${site === id ? 'border-brand shadow-md' : 'border-line'}`}>
              <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-2xl bg-soft"><Art /></div>
              <div className="flex-1"><p className="font-bold">{title}</p><p className="mt-0.5 text-sm text-muted">{sub}</p></div>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${site === id ? 'border-brand bg-brand' : 'border-line'}`}>{site === id && <span className="h-2 w-2 rounded-full bg-white" />}</span>
            </button>
          ))}
        </div>
        <Card className="mt-4 !bg-soft !border-transparent">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand dark:text-brand-light"><Zap size={16} aria-hidden />{lang === 'hi' ? 'अच्छी फ़ोटो के लिए' : 'For a good photo'}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>{lang === 'hi' ? 'दिन की रोशनी में, खिड़की के पास' : 'Natural daylight, near a window'}</li>
            <li>{lang === 'hi' ? 'फ़्लैश बंद, फ़ोन 15 सेमी दूर' : 'Flash off, phone about 15 cm away'}</li>
          </ul>
        </Card>
        <Button full className="mt-6" icon={<Camera size={20} aria-hidden />} onClick={onNext}>{lang === 'hi' ? 'कैमरा खोलें' : 'Open camera'}</Button>
      </div>
    </div>
  )
}

function Capture({ site, onBack, onCapture }: { site: Site; onBack: () => void; onCapture: () => void }) {
  const { lang } = useApp()
  const { videoRef, live } = useCamera(true, 'user')
  const [flash, setFlash] = useState(false)
  const shoot = () => { setFlash(true); setTimeout(onCapture, 280) }
  return (
    <div className="flex min-h-[100dvh] flex-col bg-black text-white md:min-h-[824px]">
      <Header title={site === 'eyelid' ? (lang === 'hi' ? 'पलक को फ़्रेम में रखें' : 'Align your inner eyelid') : (lang === 'hi' ? 'नाखून फ़्रेम में रखें' : 'Align your fingernails')} onBack={onBack} tone="dark" />
      <div className="relative mx-4 flex-1 overflow-hidden rounded-[28px] bg-neutral-900" style={{ minHeight: 420 }}>
        <video ref={videoRef} muted playsInline className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${live ? '' : 'hidden'}`} />
        {!live && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-950">
            <div className="scale-[2.4] opacity-90">{site === 'eyelid' ? <EyelidArt /> : <NailsArt />}</div>
            <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">{lang === 'hi' ? 'सैंपल इमेज' : 'Sample image'}</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative ${site === 'eyelid' ? 'h-36 w-64 rounded-[50%]' : 'h-44 w-64 rounded-3xl'}`} style={{ boxShadow: '0 0 0 2000px rgba(0,0,0,0.5)' }}>
            <motion.div className={`absolute inset-0 border-[3px] border-brand-light ${site === 'eyelid' ? 'rounded-[50%]' : 'rounded-3xl'}`} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </div>
        </div>
        <p className="absolute inset-x-0 bottom-4 text-center text-sm font-medium">{site === 'eyelid' ? (lang === 'hi' ? 'पलक का लाल हिस्सा अंडाकार में रखें' : 'Fit the red part of the eyelid inside the oval') : (lang === 'hi' ? 'चारों नाखून फ़्रेम में रखें' : 'Fit four fingernails inside the frame')}</p>
        <AnimatePresence>{flash && <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} />}</AnimatePresence>
      </div>
      <div className="flex items-center justify-around px-8 py-6">
        <button type="button" onClick={shoot} aria-label={lang === 'hi' ? 'सैंपल इमेज इस्तेमाल करें' : 'Use sample image'} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><ImageIcon size={22} aria-hidden /></button>
        <button type="button" onClick={shoot} aria-label={lang === 'hi' ? 'फ़ोटो लें' : 'Capture photo'} className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white transition-transform active:scale-90">
          <span className="h-16 w-16 rounded-full bg-white" />
        </button>
        <span className="h-12 w-12" />
      </div>
    </div>
  )
}

function Result({ variant, setVariant, onAgain }: { variant: 'flagged' | 'normal'; setVariant: (v: 'flagged' | 'normal') => void; onAgain: () => void }) {
  const { lang, toast } = useApp()
  const nav = useNavigate()
  const r = scans.anaemia[variant]
  const low = variant === 'flagged'
  // gauge 8 → 18 g/dL
  const pos = (v: number) => ((v - 8) / 10) * 100
  return (
    <div>
      <Header title={lang === 'hi' ? 'हीमोग्लोबिन अनुमान' : 'Haemoglobin estimate'} right={<PrototypeBadge />} onBack={() => nav('/')} />
      <div className="px-4 pb-8">
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">{lang === 'hi' ? 'अनुमानित हीमोग्लोबिन' : 'Estimated haemoglobin'}</span>
            <Badge tone={low ? 'alert' : 'ok'} icon={low ? <AlertTriangle size={13} aria-hidden /> : <CheckCircle2 size={13} aria-hidden />}>{low ? (lang === 'hi' ? 'संभवतः कम' : r.flag) : (lang === 'hi' ? 'सामान्य सीमा में' : r.flag)}</Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-5xl font-bold tracking-tight tabular">{r.low}–{r.high}</span>
            <span className="text-lg font-semibold text-muted">g/dL</span>
          </div>
          <div className="relative mt-6 h-3 rounded-full" style={{ background: 'linear-gradient(90deg,#DC2626 0%,#F59E0B 40%,#10B981 55%,#10B981 90%,#F59E0B 100%)' }}>
            <motion.div className="absolute -top-1.5 h-6 rounded-md border-2 border-ink bg-white/60" initial={{ left: '0%', width: 0 }} animate={{ left: `${pos(r.low)}%`, width: `${pos(r.high) - pos(r.low)}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted tabular"><span>8</span><span>13</span><span>18 g/dL</span></div>
          <p className="mt-3 text-sm text-muted">{lang === 'hi' ? 'सामान्य' : 'Normal'}: {r.normalRange} · {lang === 'hi' ? 'भरोसा' : 'Confidence'}: {r.confidence}</p>
        </Card>
        <Card className="mt-3">
          <h3 className="flex items-center gap-2 font-bold"><Droplet size={18} className="text-red-600" aria-hidden />{lang === 'hi' ? 'इसका क्या मतलब है' : 'What this means'}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{lang === 'hi' ? r.explanationHi : r.explanation}</p>
        </Card>
        {low && (<>
          <Button full className="mt-4" icon={<FlaskConical size={20} aria-hidden />} onClick={() => toast(lang === 'hi' ? 'Thyrocare पर CBC टेस्ट बुक हुआ (डेमो)' : 'CBC test booked at Thyrocare (demo)', 'success')}>{lang === 'hi' ? 'ब्लड टेस्ट कराएँ' : 'Get a blood test'}</Button>
          <SectionTitle>{lang === 'hi' ? 'पास की लैब' : 'Nearby labs'}</SectionTitle>
          <Card className="!p-0 divide-y divide-line">
            {scans.anaemia.labs.map((l) => (
              <button key={l.name} type="button" onClick={() => toast(lang === 'hi' ? `${l.name} पर बुकिंग (डेमो)` : `Booking at ${l.name} (demo)`, 'success')} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-soft">
                <MapPin size={20} className="shrink-0 text-brand" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-muted">{l.area} · {l.distance}{l.homeVisit ? (lang === 'hi' ? ' · घर से सैंपल' : ' · home collection') : ''}</p>
                </div>
                <span className="font-bold tabular">{l.price === 0 ? (lang === 'hi' ? 'मुफ़्त' : 'Free') : `₹${l.price}`}</span>
              </button>
            ))}
          </Card>
          <p className="mt-2 flex items-center gap-1 px-1 text-xs text-muted"><HomeIcon size={12} aria-hidden />{lang === 'hi' ? 'CBC (कम्प्लीट ब्लड काउंट) टेस्ट · मॉक लिस्टिंग' : 'CBC (complete blood count) test · mock listings'}</p>
        </>)}
        <Disclaimer />
        <Button variant="ghost" full className="mt-3" icon={<RotateCcw size={18} aria-hidden />} onClick={onAgain}>{lang === 'hi' ? 'फिर से जाँचें' : 'Check again'}</Button>
        <button type="button" onClick={() => setVariant(low ? 'normal' : 'flagged')} className="mt-2 w-full text-center text-xs font-medium text-muted underline underline-offset-4">
          {low ? 'Demo: show a normal result' : 'Demo: show a flagged result'}
        </button>
      </div>
    </div>
  )
}
