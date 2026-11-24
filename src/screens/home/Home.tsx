import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Droplet, HeartPulse, Moon, Footprints, Wind, Brain, Waves, Mic, ScanEye, ChevronRight, Sparkles, TrendingUp, Bell, Bed, Zap } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Card, PrivacyBadge, SectionTitle } from '../../components/ui'
import { MetricTile } from '../../components/MetricTile'
import { ScoreRing, Sparkline } from '../../components/viz'
import { baselineFor, daysFor, fmtNum, hbFor } from '../../lib/data'

export default function Home() {
  const { t, lang, profile, comingSoon } = useApp()
  const nav = useNavigate()
  const days = daysFor(profile)
  const today = days[days.length - 1]
  const last7 = days.slice(-7)
  const base = baselineFor(profile)
  const hb = hbFor(profile)
  const latestHb = hb[hb.length - 1]
  const hr = new Date().getHours()
  const greet = hr < 12 ? t('goodMorning') : hr < 17 ? t('goodAfternoon') : t('goodEvening')
  const dateStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  const score = profile.vitalityScore
  const scoreTrend = [74, 77, 80, 79, 73, 71, 72, 75, 76, score]
  const avgHr7 = Math.round(last7.reduce((s, d) => s + d.restingHr, 0) / 7)
  const hbLow = latestHb.high < (profile.sex === 'Female' ? 12 : 13)

  const insights = [
    { icon: <Bed size={18} />, color: '#6366F1', title: lang === 'hi' ? 'नींद' : 'Sleep', text: lang === 'hi' ? 'हफ़्ते की रातों में आप सामान्य से 1.2 घंटे कम सो रहे हैं।' : 'You slept 1.2 h less than usual on weeknights.', to: '/trends' },
    { icon: <HeartPulse size={18} />, color: '#E11D48', title: lang === 'hi' ? 'आराम की धड़कन' : 'Resting heart rate', text: lang === 'hi' ? `19 नवंबर को आराम की धड़कन ${base.restingHr + 9} bpm रही — आपके औसत से 9 ज़्यादा।` : `Resting HR hit ${base.restingHr + 9} bpm on 19 Nov — 9 above your 2-week baseline.`, to: '/trends' },
    { icon: <Droplet size={18} />, color: '#B91C1C', title: lang === 'hi' ? 'हीमोग्लोबिन' : 'Haemoglobin', text: lang === 'hi' ? 'पिछले 4 हफ़्तों से अनुमान धीरे-धीरे घट रहा है। ब्लड टेस्ट पर विचार करें।' : 'Estimates have drifted down for 4 weeks. Consider a blood test.', to: '/scan/anaemia' },
  ]

  return (
    <div className="px-4 pb-6">
      <header className="flex items-start justify-between pb-4 pt-6 md:pt-12">
        <div>
          <p className="text-sm font-medium text-muted">{dateStr}</p>
          <h1 className="mt-0.5 text-[26px] font-bold tracking-tight">{greet}, {profile.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Notifications" onClick={comingSoon} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card">
            <Bell size={20} aria-hidden />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
          <button type="button" aria-label="Switch family profile" onClick={() => nav('/family')} className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: profile.color }}>
            {profile.initials}
          </button>
        </div>
      </header>

      {profile.id !== 'self' && (
        <div className="mb-3 rounded-2xl bg-soft px-4 py-2.5 text-sm font-medium text-brand dark:text-brand-light">
          {lang === 'hi' ? `${profile.relationHi} की प्रोफ़ाइल देख रहे हैं` : `Viewing ${profile.relation.toLowerCase()}'s profile`}
        </div>
      )}

      <Card className="overflow-hidden !p-5">
        <div className="flex items-center gap-5">
          <ScoreRing value={score} size={132} stroke={12} label={t('vitality')}>
            <span className="text-4xl font-bold tabular">{score}</span>
            <span className="text-xs font-semibold text-muted">/ 100</span>
          </ScoreRing>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted">{t('vitality')}</p>
            <p className="mt-1 font-semibold leading-snug">{lang === 'hi' ? profile.insightHi : profile.insight}</p>
            <div className="mt-3"><Sparkline data={scoreTrend} height={28} /></div>
            <p className="text-xs text-muted">{lang === 'hi' ? 'पिछले 10 दिन' : 'Last 10 days'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
          {[
            { k: lang === 'hi' ? 'रिकवरी' : 'Recovery', v: Math.max(40, score - 6), c: '#0F766E', I: Zap },
            { k: lang === 'hi' ? 'नींद' : 'Sleep', v: Math.max(40, score - 12), c: '#6366F1', I: Moon },
            { k: lang === 'hi' ? 'गतिविधि' : 'Activity', v: Math.min(96, score + 9), c: '#F59E0B', I: Activity },
          ].map(({ k, v, c, I }) => (
            <div key={k}>
              <div className="flex items-center gap-1 text-xs font-semibold text-muted"><I size={13} style={{ color: c }} aria-hidden />{k}</div>
              <div className="mt-1 text-lg font-bold tabular">{v}</div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>{t('quickScan')}</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {[
          { to: '/scan/pulse', label: t('pulse'), Icon: HeartPulse, bg: 'from-rose-500 to-red-600' },
          { to: '/scan/anaemia', label: t('anaemia'), Icon: ScanEye, bg: 'from-brand to-teal-500' },
          { to: '/scan/cough', label: t('cough'), Icon: Mic, bg: 'from-amber-500 to-orange-500' },
        ].map(({ to, label, Icon, bg }) => (
          <button key={to} type="button" onClick={() => nav(to)} className="flex flex-col items-center gap-2 rounded-[20px] border border-line bg-card py-4 transition-transform active:scale-95">
            <span className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${bg} text-white shadow-lg`}>
              <Icon size={28} aria-hidden />
            </span>
            <span className="text-sm font-semibold">{label}</span>
          </button>
        ))}
      </div>

      <SectionTitle action={<button type="button" onClick={() => nav('/trends')} className="text-sm font-semibold text-brand dark:text-brand-light">{t('seeAll')}</button>}>{t('today')}</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <MetricTile icon={<HeartPulse size={17} />} label={t('heartRate')} value={String(today.restingHr)} unit="bpm" sub={lang === 'hi' ? `7-दिन औसत ${avgHr7}` : `Resting · 7-day avg ${avgHr7}`} color="#E11D48" onClick={() => nav('/trends')}
          action={<button type="button" onClick={() => nav('/scan/pulse')} className="w-full rounded-xl bg-rose-600 py-1.5 text-sm font-semibold text-white">{t('measure')}</button>} />
        <MetricTile icon={<Waves size={17} />} label={t('hrv')} value={String(today.hrv)} unit="ms" sub={`Baseline ${base.hrv} ms`} color="#0F766E" trend={days.slice(-14).map((d) => d.hrv)} onClick={() => nav('/trends')} />
        <MetricTile icon={<Wind size={17} />} label={t('spo2')} value={String(today.spo2)} unit="%" sub={lang === 'hi' ? 'सामान्य' : 'Normal range'} color="#0284C7" trend={days.slice(-14).map((d) => d.spo2)} onClick={() => nav('/trends')} />
        <MetricTile icon={<Moon size={17} />} label={t('sleep')} value={String(today.sleep)} unit="h" sub={`Avg ${base.sleep} h`} color="#6366F1" trend={days.slice(-14).map((d) => d.sleep)} onClick={() => nav('/trends')} />
        <MetricTile icon={<Footprints size={17} />} label={t('steps')} value={fmtNum(today.steps)} sub={`Goal ${fmtNum(8000)}`} color="#F59E0B" trend={days.slice(-14).map((d) => d.steps)} onClick={() => nav('/trends')} />
        <MetricTile icon={<Droplet size={17} />} label={t('haemoglobin')} value={`${latestHb.low}–${latestHb.high}`} unit="g/dL" sub={hbLow ? (lang === 'hi' ? 'संभवतः कम · अनुमानित' : 'Possibly low · estimated') : 'Estimated'} flag={hbLow ? 'low' : undefined} color="#B91C1C" onClick={() => nav('/scan/anaemia')} />
        <MetricTile icon={<Mic size={17} />} label={t('coughCheck')} value={lang === 'hi' ? 'कम' : 'Low'} sub={lang === 'hi' ? 'जोखिम · 2 दिन पहले' : 'Risk · 2 days ago'} color="#EA580C" onClick={() => nav('/scan/cough')} />
        <MetricTile icon={<Brain size={17} />} label={t('stress')} value={String(today.stress)} unit="/100" sub={today.stress > 50 ? 'Elevated' : lang === 'hi' ? 'सामान्य' : 'Balanced'} color="#7C3AED" trend={days.slice(-14).map((d) => d.stress)} onClick={() => nav('/trends')} />
      </div>

      <SectionTitle>{t('highlights')}</SectionTitle>
      <div className="space-y-3">
        {insights.map((i) => (
          <Card key={i.title} onClick={() => nav(i.to)}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: i.color }}>{i.icon}{i.title}</div>
            <div className="mt-2 flex items-center gap-3">
              <p className="flex-1 text-[15px] font-medium leading-snug">{i.text}</p>
              <ChevronRight size={20} className="shrink-0 text-muted" aria-hidden />
            </div>
          </Card>
        ))}
        <Card onClick={() => nav('/assistant')} className="!border-brand/20 bg-gradient-to-br from-soft to-card">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white"><Sparkles size={20} aria-hidden /></span>
            <div className="flex-1">
              <p className="font-semibold">{lang === 'hi' ? 'अपने सहायक से पूछें' : 'Ask your health assistant'}</p>
              <p className="text-sm text-muted">“{lang === 'hi' ? 'मेरा HRV कम क्यों है?' : 'Why is my HRV low?'}”</p>
            </div>
            <TrendingUp size={20} className="text-brand dark:text-brand-light" aria-hidden />
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-center"><PrivacyBadge /></div>
    </div>
  )
}
