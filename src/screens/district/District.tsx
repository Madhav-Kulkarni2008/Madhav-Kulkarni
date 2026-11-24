import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, LocateFixed, AlertTriangle, Droplet, Activity, HeartPulse, Scale } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Card, Header, SectionTitle } from '../../components/ui'
import { districts } from '../../lib/data'

export default function District() {
  const { lang, profile, toast } = useApp()
  const initial = districts.districts.find((d) => d.name === profile.district)?.id ?? districts.districts[0].id
  const [id, setId] = useState(initial)
  const d = districts.districts.find((x) => x.id === id)!
  const nat = districts.national
  const ind = [
    { k: 'anaemiaWomen', l: lang === 'hi' ? 'महिलाओं में एनीमिया' : 'Anaemia (women 15–49)', I: Droplet, c: '#B91C1C' },
    { k: 'anaemiaMen', l: lang === 'hi' ? 'पुरुषों में एनीमिया' : 'Anaemia (men 15–49)', I: Droplet, c: '#E11D48' },
    { k: 'diabetes', l: lang === 'hi' ? 'उच्च ब्लड शुगर' : 'High blood sugar', I: Activity, c: '#F59E0B' },
    { k: 'hypertension', l: lang === 'hi' ? 'उच्च रक्तचाप' : 'High blood pressure', I: HeartPulse, c: '#7C3AED' },
    { k: 'obesity', l: lang === 'hi' ? 'अधिक वज़न' : 'Overweight / obese', I: Scale, c: '#0284C7' },
  ] as const
  return (
    <div>
      <Header title={lang === 'hi' ? 'ज़िला स्वास्थ्य' : 'District health'} subtitle={lang === 'hi' ? 'NFHS-5 शैली संकेतक' : 'NFHS-5 style indicators'} />
      <div className="px-4 pb-8">
        <div className="flex items-start gap-2 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200" role="note">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p><b>{lang === 'hi' ? 'प्लेसहोल्डर डेटा।' : 'Placeholder data.'}</b> {lang === 'hi' ? 'ये असली NFHS-5 आँकड़े नहीं हैं। असली डेटा आधिकारिक फ़ैक्ट शीट से जोड़ा जाएगा।' : 'These are not real NFHS-5 figures. Real values will be added from the official district fact sheets.'}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">District</span>
            <MapPin size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <select value={id} onChange={(e) => setId(e.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-line bg-card pl-10 pr-4 font-semibold text-ink outline-none focus:border-brand">
              {districts.districts.map((x) => <option key={x.id} value={x.id}>{x.name}, {x.state}</option>)}
            </select>
          </label>
          <button type="button" aria-label="Use my location" onClick={() => { setId(initial); toast(lang === 'hi' ? 'ज़िला अपने-आप चुना गया' : 'District auto-selected from profile') }} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-card text-brand dark:text-brand-light"><LocateFixed size={20} aria-hidden /></button>
        </div>
        <SectionTitle>{d.name}</SectionTitle>
        <div className="space-y-3">
          {ind.map(({ k, l, I, c }) => {
            const v = d.indicators[k], n = nat[k]
            const higher = v > n
            return (
              <Card key={k + id}>
                <div className="flex items-center gap-2">
                  <I size={18} style={{ color: c }} aria-hidden />
                  <span className="flex-1 font-semibold">{l}</span>
                  <Badge tone={higher ? 'accent' : 'ok'}>{higher ? (lang === 'hi' ? 'राष्ट्रीय से ज़्यादा' : 'Above national') : (lang === 'hi' ? 'राष्ट्रीय से कम' : 'Below national')}</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl font-bold tabular">{v}%</span><span className="text-sm text-muted">{lang === 'hi' ? 'भारत' : 'India'} {n}%</span></div>
                <div className="relative mt-2 h-2.5 rounded-full bg-black/5 dark:bg-white/10">
                  <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} />
                  <div className="absolute -top-1 h-[18px] w-0.5 rounded bg-ink" style={{ left: `${n}%` }} />
                </div>
              </Card>
            )
          })}
        </div>
        <Card className="mt-4 !bg-soft !border-transparent">
          <p className="text-[15px] leading-relaxed">{lang === 'hi' ? 'आपके ज़िले में एनीमिया आम है। इसीलिए PocketVaidya हर महीने हीमोग्लोबिन जाँच की याद दिलाता है।' : 'Anaemia is common in your district, so PocketVaidya reminds you to run a haemoglobin check every month.'}</p>
        </Card>
      </div>
    </div>
  )
}
