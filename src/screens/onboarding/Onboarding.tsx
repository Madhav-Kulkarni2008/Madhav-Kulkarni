import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Smartphone, LineChart, ShieldCheck, Camera, Mic, HeartPulse, ArrowRight } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Button, Toggle } from '../../components/ui'

const SLIDES = [
  { Icon: Smartphone, color: '#0F766E', en: 'Your phone already knows a lot about your health.', hi: 'आपका फ़ोन पहले से आपकी सेहत के बारे में बहुत कुछ जानता है।', subEn: 'Camera, microphone and your smartwatch can spot early warning signs.', subHi: 'कैमरा, माइक और स्मार्टवॉच शुरुआती चेतावनी संकेत पकड़ सकते हैं।' },
  { Icon: LineChart, color: '#F59E0B', en: 'We turn it into insight.', hi: 'हम इसे समझ में बदलते हैं।', subEn: 'Plain-language results in English or Hindi, compared with your own baseline.', subHi: 'आसान भाषा में परिणाम, आपके अपने औसत से तुलना करके।' },
  { Icon: ShieldCheck, color: '#4338CA', en: '100% private: nothing leaves your phone.', hi: '100% निजी: कुछ भी आपके फ़ोन से बाहर नहीं जाता।', subEn: 'All analysis runs on the device. Works offline.', subHi: 'सारा विश्लेषण फ़ोन पर ही होता है। ऑफ़लाइन भी चलता है।' },
]

export default function Onboarding() {
  const { lang, setLang, setOnboarded, setUserName, userName } = useApp()
  const nav = useNavigate()
  const [i, setI] = useState(0)
  const [perms, setPerms] = useState({ camera: true, mic: true, health: true })
  const [form, setForm] = useState({ name: userName || 'Madhav', age: '18–24', sex: 'Male', district: 'Bengaluru Urban' })
  const finish = () => { setUserName(form.name.trim() || 'Madhav'); setOnboarded(true); nav('/', { replace: true }) }
  const step = i < 3 ? 'slide' : i === 3 ? 'perms' : 'profile'

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg md:min-h-[824px]">
      <div className="flex items-center justify-between px-5 pt-5 md:pt-11">
        <div className="flex gap-1.5" aria-label={`Step ${i + 1} of 5`}>
          {[0, 1, 2, 3, 4].map((k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? 'w-6 bg-brand' : 'w-1.5 bg-line'}`} />)}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold">{lang === 'en' ? 'हिंदी' : 'English'}</button>
          {i < 4 && <button type="button" onClick={() => setI(i < 3 ? 3 : 4)} className="px-2 py-1.5 text-sm font-semibold text-muted">{lang === 'hi' ? 'छोड़ें' : 'Skip'}</button>}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} className="flex flex-1 flex-col px-6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}
          drag={step === 'slide' ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (info.offset.x < -60) setI(i + 1); else if (info.offset.x > 60 && i > 0) setI(i - 1) }}>
          {step === 'slide' && (() => {
            const s = SLIDES[i]
            return (
              <div className="flex flex-1 flex-col justify-center">
                <div className="relative mx-auto mb-10 flex h-56 w-56 items-center justify-center">
                  <motion.div className="absolute inset-0 rounded-full" style={{ background: s.color + '1A' }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                  <div className="absolute inset-8 rounded-full" style={{ background: s.color + '26' }} />
                  <span className="relative flex h-24 w-24 items-center justify-center rounded-[28px] text-white shadow-xl" style={{ background: s.color }}><s.Icon size={46} aria-hidden /></span>
                  {i === 0 && [Camera, Mic, HeartPulse].map((I, k) => (
                    <motion.span key={k} className="absolute flex h-11 w-11 items-center justify-center rounded-2xl bg-card shadow-md" style={{ top: ['8%', '60%', '70%'][k], left: ['70%', '82%', '2%'][k] }} animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.4 }}>
                      <I size={20} className="text-brand" aria-hidden />
                    </motion.span>
                  ))}
                </div>
                <h1 className="text-[28px] font-bold leading-tight tracking-tight">{lang === 'hi' ? s.hi : s.en}</h1>
                <p className="mt-3 text-lg text-muted">{lang === 'hi' ? s.subHi : s.subEn}</p>
              </div>
            )
          })()}
          {step === 'perms' && (
            <div className="flex flex-1 flex-col pt-10">
              <h1 className="text-[28px] font-bold tracking-tight">{lang === 'hi' ? 'अनुमतियाँ' : 'Permissions'}</h1>
              <p className="mt-2 text-muted">{lang === 'hi' ? 'डेटा केवल इस फ़ोन पर प्रोसेस होता है।' : 'Data is only processed on this phone. You can change these anytime.'}</p>
              <div className="mt-6 space-y-3">
                {([['camera', Camera, lang === 'hi' ? 'कैमरा' : 'Camera', lang === 'hi' ? 'नब्ज़ और एनीमिया जाँच' : 'Pulse and anaemia checks'],
                  ['mic', Mic, lang === 'hi' ? 'माइक्रोफ़ोन' : 'Microphone', lang === 'hi' ? 'खाँसी जाँच' : 'Cough screen'],
                  ['health', HeartPulse, 'Health Connect', lang === 'hi' ? 'स्मार्टवॉच से धड़कन, नींद, कदम' : 'Heart rate, sleep and steps from your watch']] as const).map(([k, I, t, sub]) => (
                  <div key={k} className="flex items-center gap-3 rounded-[20px] border border-line bg-card p-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-brand dark:text-brand-light"><I size={21} aria-hidden /></span>
                    <div className="flex-1"><p className="font-semibold">{t}</p><p className="text-sm text-muted">{sub}</p></div>
                    <Toggle checked={perms[k]} onChange={(v) => setPerms((p) => ({ ...p, [k]: v }))} label={t} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 'profile' && (
            <div className="flex flex-1 flex-col pt-10">
              <h1 className="text-[28px] font-bold tracking-tight">{lang === 'hi' ? 'आपके बारे में' : 'About you'}</h1>
              <p className="mt-2 text-muted">{lang === 'hi' ? 'आपके लिए सामान्य सीमा तय करने में मदद करता है।' : 'Helps us set the right normal ranges for you.'}</p>
              <div className="mt-6 space-y-4">
                <label className="block"><span className="mb-1.5 block text-sm font-semibold">{lang === 'hi' ? 'नाम' : 'Name'}</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 w-full rounded-2xl border border-line bg-card px-4 text-[16px] outline-none focus:border-brand" /></label>
                <div><span className="mb-1.5 block text-sm font-semibold">{lang === 'hi' ? 'उम्र' : 'Age range'}</span>
                  <div className="grid grid-cols-4 gap-2">{['18–24', '25–34', '35–49', '50+'].map((a) => (
                    <button key={a} type="button" aria-pressed={form.age === a} onClick={() => setForm({ ...form, age: a })} className={`h-11 rounded-xl border text-sm font-semibold ${form.age === a ? 'border-brand bg-soft text-brand dark:text-brand-light' : 'border-line bg-card'}`}>{a}</button>))}</div></div>
                <div><span className="mb-1.5 block text-sm font-semibold">{lang === 'hi' ? 'लिंग' : 'Sex'}</span>
                  <div className="grid grid-cols-3 gap-2">{[['Male', 'पुरुष'], ['Female', 'महिला'], ['Other', 'अन्य']].map(([en, hi]) => (
                    <button key={en} type="button" aria-pressed={form.sex === en} onClick={() => setForm({ ...form, sex: en })} className={`h-11 rounded-xl border text-sm font-semibold ${form.sex === en ? 'border-brand bg-soft text-brand dark:text-brand-light' : 'border-line bg-card'}`}>{lang === 'hi' ? hi : en}</button>))}</div></div>
                <label className="block"><span className="mb-1.5 block text-sm font-semibold">{lang === 'hi' ? 'ज़िला' : 'District'}</span>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="h-12 w-full rounded-2xl border border-line bg-card px-4 text-[16px] text-ink outline-none focus:border-brand">
                    {['Bengaluru Urban', 'Mysuru', 'Pune', 'Lucknow', 'Patna', 'Chennai'].map((d) => <option key={d}>{d}</option>)}
                  </select></label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="px-6 pb-8 pt-4">
        <Button full icon={i === 4 ? undefined : <ArrowRight size={19} aria-hidden />} onClick={() => (i === 4 ? finish() : setI(i + 1))}>
          {i === 4 ? (lang === 'hi' ? 'शुरू करें' : 'Get started') : i === 3 ? (lang === 'hi' ? 'अनुमति दें' : 'Allow & continue') : (lang === 'hi' ? 'आगे' : 'Next')}
        </Button>
      </div>
    </div>
  )
}
