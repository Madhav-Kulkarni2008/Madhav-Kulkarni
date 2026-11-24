import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, MessageCircle, Link2, AlertTriangle, Check, X, Send } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Button, Header } from '../../components/ui'
import { Sparkline } from '../../components/viz'
import { baselineFor, daysFor, hbFor, labReport } from '../../lib/data'

export default function DoctorReport() {
  const { lang, profile, toast } = useApp()
  const [sheet, setSheet] = useState<null | 'share' | 'abha'>(null)
  const [sent, setSent] = useState<string | null>(null)
  const [abhaLinked, setAbhaLinked] = useState(false)
  const days = daysFor(profile)
  const today = days[days.length - 1]
  const base = baselineFor(profile)
  const hb = hbFor(profile)
  const latestHb = hb[hb.length - 1]
  const rows = [
    ['Resting heart rate', `${today.restingHr} bpm`, `baseline ${base.restingHr}`],
    ['HRV (RMSSD)', `${today.hrv} ms`, `baseline ${base.hrv}`],
    ['SpO₂', `${today.spo2}%`, '95–100'],
    ['Sleep (7-day avg)', `${(days.slice(-7).reduce((s, d) => s + d.sleep, 0) / 7).toFixed(1)} h`, '7–9 h'],
    ['Haemoglobin (photo est.)', `${latestHb.low}–${latestHb.high} g/dL`, '13–17'],
    ['Haemoglobin (lab, 20 Nov)', `${labReport.values[0].value} g/dL`, '13–17'],
    ['Fasting glucose (lab)', `${labReport.values[4].value} mg/dL`, '70–99'],
  ]
  const flags = [
    'Haemoglobin below range on photo estimate and lab test; downward trend over 4 weeks.',
    'Resting HR +9 bpm and HRV −35% vs baseline on 19 Nov; partially recovered.',
    'Fasting glucose 104 mg/dL (prediabetes range).',
  ]
  return (
    <div>
      <Header title={lang === 'hi' ? 'डॉक्टर रिपोर्ट' : 'Doctor report'} subtitle={lang === 'hi' ? 'एक पेज का सार' : 'One-page summary'} />
      <div className="px-4 pb-8">
        <article className="rounded-[14px] border border-line bg-white p-5 text-[13px] text-neutral-800 shadow-lg" aria-label="Report preview">
          <div className="flex items-start justify-between border-b-2 border-brand pb-3">
            <div>
              <p className="text-base font-bold text-brand">PocketVaidya Health Summary</p>
              <p className="text-[11px] text-neutral-500">Generated 24 Nov 2026 · screening data, not a diagnosis</p>
            </div>
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
            <p><span className="text-neutral-500">Patient:</span> <b>{profile.fullName}</b></p>
            <p><span className="text-neutral-500">Age/Sex:</span> {profile.age} / {profile.sex[0]}</p>
            <p><span className="text-neutral-500">District:</span> {profile.district}</p>
            <p><span className="text-neutral-500">ABHA:</span> {profile.abha}</p>
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-neutral-500">Latest readings</p>
          <table className="mt-1 w-full">
            <tbody>
              {rows.map(([k, v, r]) => (
                <tr key={k} className="border-b border-neutral-100">
                  <td className="py-1.5">{k}</td><td className="py-1.5 text-right font-semibold tabular">{v}</td><td className="py-1.5 pl-2 text-right text-[11px] text-neutral-500">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-neutral-500">30-day trends</p>
          <div className="mt-1 grid grid-cols-3 gap-3">
            {[{ l: 'Resting HR', d: days.map((x) => x.restingHr), c: '#E11D48' }, { l: 'HRV', d: days.map((x) => x.hrv), c: '#0F766E' }, { l: 'Hb est.', d: hb.map((x) => (x.low + x.high) / 2), c: '#B91C1C' }].map((s) => (
              <div key={s.l}><p className="text-[11px] text-neutral-500">{s.l}</p><Sparkline data={s.d} color={s.c} height={26} /></div>
            ))}
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-neutral-500">Flags for review</p>
          <ul className="mt-1 space-y-1">
            {flags.map((f) => <li key={f} className="flex gap-1.5"><AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />{f}</li>)}
          </ul>
          <p className="mt-4 border-t border-neutral-200 pt-2 text-[10px] text-neutral-500">Screening, not diagnosis. Values from phone camera, microphone and wearable sensors are estimates. Prototype — mock data.</p>
        </article>

        <div className="mt-5 space-y-3">
          <a href="/sample-report.pdf" download="PocketVaidya-report.pdf" onClick={() => toast(lang === 'hi' ? 'PDF डाउनलोड हो रहा है' : 'Downloading PDF', 'success')}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98]">
            <Download size={19} aria-hidden />{lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
          </a>
          <Button full variant="secondary" className="!border-emerald-500/40" icon={<MessageCircle size={19} className="text-emerald-600" aria-hidden />} onClick={() => setSheet('share')}>{lang === 'hi' ? 'WhatsApp से भेजें' : 'Share via WhatsApp'}</Button>
          <Button full variant="secondary" icon={abhaLinked ? <Check size={19} className="text-emerald-600" aria-hidden /> : <Link2 size={19} aria-hidden />} onClick={() => setSheet('abha')}>{abhaLinked ? (lang === 'hi' ? 'ABHA से जुड़ा' : 'Linked to ABHA') : (lang === 'hi' ? 'ABHA से जोड़ें' : 'Link to ABHA')}</Button>
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <motion.div className="absolute inset-0 z-40 flex items-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)}>
            <motion.div role="dialog" aria-modal="true" className="w-full rounded-t-[28px] bg-card p-5 pb-8" initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', stiffness: 380, damping: 36 }} onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">{sheet === 'share' ? (lang === 'hi' ? 'WhatsApp पर भेजें' : 'Send on WhatsApp') : (lang === 'hi' ? 'ABHA से जोड़ें' : 'Link to ABHA')}</h2>
                <button type="button" aria-label="Close" onClick={() => setSheet(null)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-soft"><X size={20} aria-hidden /></button>
              </div>
              {sheet === 'share' ? (
                <div className="divide-y divide-line">
                  {[{ n: 'Dr. Ananya Rao', s: 'General physician · Koramangala' }, { n: 'Mummy', s: '+91 98450 •••••' }, { n: 'Papa', s: '+91 99860 •••••' }].map((c) => (
                    <div key={c.n} className="flex items-center gap-3 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">{c.n.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
                      <div className="flex-1"><p className="font-semibold">{c.n}</p><p className="text-sm text-muted">{c.s}</p></div>
                      <button type="button" onClick={() => { setSent(c.n); toast(lang === 'hi' ? `${c.n} को भेजा गया (डेमो)` : `Sent to ${c.n} (demo)`, 'success') }}
                        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold ${sent === c.n ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-600 text-white'}`}>
                        {sent === c.n ? <><Check size={15} aria-hidden />{lang === 'hi' ? 'भेजा' : 'Sent'}</> : <><Send size={15} aria-hidden />{lang === 'hi' ? 'भेजें' : 'Send'}</>}
                      </button>
                    </div>
                  ))}
                  <p className="pt-3 text-xs text-muted">{lang === 'hi' ? 'डेमो — असली संदेश नहीं भेजा जाता।' : 'Demo — no real message is sent.'}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted">{lang === 'hi' ? 'आयुष्मान भारत हेल्थ अकाउंट से जोड़कर रिपोर्ट को अपने स्वास्थ्य रिकॉर्ड में रखें।' : 'Store this report in your Ayushman Bharat Health Account so any doctor you consent to can see it.'}</p>
                  <div className="mt-3 rounded-2xl border border-line bg-soft p-4"><p className="text-xs text-muted">ABHA number</p><p className="text-lg font-bold tabular">{profile.abha}</p></div>
                  <Button full className="mt-4" onClick={() => { setAbhaLinked(true); setSheet(null); toast(lang === 'hi' ? 'ABHA से जुड़ गया (डेमो)' : 'Linked to ABHA (demo)', 'success') }}>{lang === 'hi' ? 'सहमति दें और जोड़ें' : 'Consent & link'}</Button>
                  <p className="mt-2 text-center text-xs text-muted">{lang === 'hi' ? 'मॉक — कोई डेटा नहीं भेजा जाता' : 'Mock — no data is sent'}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
