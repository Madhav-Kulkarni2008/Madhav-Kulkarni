import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Smartphone, Watch, CheckCircle2, Plus, HeartPulse, Moon, Footprints, Wind, Waves, Flame } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Header, SectionTitle, Toggle } from '../../components/ui'

type Source = { id: string; name: string; desc: string; connected: boolean; Icon: typeof Watch; color: string }

export default function Sync() {
  const { lang, toast } = useApp()
  const [sources, setSources] = useState<Source[]>([
    { id: 'hc', name: 'Health Connect', desc: 'Android · all apps', connected: true, Icon: Smartphone, color: '#0F766E' },
    { id: 'noise', name: 'Noise ColorFit', desc: lang === 'hi' ? 'स्मार्टवॉच' : 'Smartwatch', connected: true, Icon: Watch, color: '#4338CA' },
    { id: 'boat', name: 'boAt Wave', desc: lang === 'hi' ? 'स्मार्टवॉच' : 'Smartwatch', connected: false, Icon: Watch, color: '#B91C1C' },
    { id: 'ah', name: 'Apple Health', desc: 'iPhone', connected: false, Icon: Smartphone, color: '#52525B' },
  ])
  const [types, setTypes] = useState<Record<string, boolean>>({ hr: true, hrv: true, sleep: true, steps: true, spo2: true, cal: false })
  const [syncing, setSyncing] = useState(false)
  const [last, setLast] = useState(lang === 'hi' ? '12 मिनट पहले' : '12 min ago')
  const syncNow = () => {
    setSyncing(true)
    setTimeout(() => { setSyncing(false); setLast(lang === 'hi' ? 'अभी' : 'Just now'); toast(lang === 'hi' ? '1,284 नई रीडिंग सिंक हुईं' : 'Synced 1,284 new readings', 'success') }, 1600)
  }
  const toggleSource = (id: string) => {
    const x = sources.find((y) => y.id === id)
    if (!x) return
    toast(x.connected ? `${x.name} disconnected` : `${x.name} connected (demo)`, x.connected ? 'info' : 'success')
    setSources((s) => s.map((y) => (y.id === id ? { ...y, connected: !y.connected } : y)))
  }
  const typeList = [
    { k: 'hr', l: lang === 'hi' ? 'धड़कन' : 'Heart rate', I: HeartPulse },
    { k: 'hrv', l: 'HRV', I: Waves },
    { k: 'sleep', l: lang === 'hi' ? 'नींद' : 'Sleep', I: Moon },
    { k: 'steps', l: lang === 'hi' ? 'कदम' : 'Steps', I: Footprints },
    { k: 'spo2', l: 'SpO₂', I: Wind },
    { k: 'cal', l: lang === 'hi' ? 'कैलोरी' : 'Calories', I: Flame },
  ]
  return (
    <div>
      <Header title={lang === 'hi' ? 'वियरेबल सिंक' : 'Wearable sync'} />
      <div className="px-4 pb-8">
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted">{lang === 'hi' ? 'आख़िरी सिंक' : 'Last sync'}</p>
              <p className="text-2xl font-bold">{last}</p>
            </div>
            <motion.span animate={syncing ? { rotate: 360 } : { rotate: 0 }} transition={syncing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}} className="flex h-12 w-12 items-center justify-center rounded-full bg-soft text-brand dark:text-brand-light"><RefreshCw size={22} aria-hidden /></motion.span>
          </div>
          <Button full className="mt-4" onClick={syncNow} disabled={syncing}>{syncing ? (lang === 'hi' ? 'सिंक हो रहा है…' : 'Syncing…') : (lang === 'hi' ? 'अभी सिंक करें' : 'Sync now')}</Button>
        </Card>
        <SectionTitle>{lang === 'hi' ? 'स्रोत' : 'Sources'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          {sources.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: s.color }}><s.Icon size={21} aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="font-semibold">{s.name}</p><p className="text-sm text-muted">{s.desc}</p></div>
              {s.connected ? (
                <button type="button" onClick={() => toggleSource(s.id)} aria-label={`Disconnect ${s.name}`}><Badge tone="ok" icon={<CheckCircle2 size={13} aria-hidden />}>{lang === 'hi' ? 'जुड़ा है' : 'Connected'}</Badge></button>
              ) : (
                <button type="button" onClick={() => toggleSource(s.id)} className="flex items-center gap-1 rounded-full border border-brand px-3 py-1.5 text-sm font-semibold text-brand dark:text-brand-light"><Plus size={14} aria-hidden />{lang === 'hi' ? 'जोड़ें' : 'Connect'}</button>
              )}
            </div>
          ))}
        </Card>
        <SectionTitle>{lang === 'hi' ? 'डेटा प्रकार' : 'Data types'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          {typeList.map(({ k, l, I }) => (
            <div key={k} className="flex items-center gap-3 px-4 py-3">
              <I size={20} className="text-muted" aria-hidden />
              <span className="flex-1 font-medium">{l}</span>
              <Toggle checked={types[k]} onChange={(v) => setTypes((t) => ({ ...t, [k]: v }))} label={l} />
            </div>
          ))}
        </Card>
        <p className="mt-3 px-1 text-xs text-muted">{lang === 'hi' ? 'डेटा केवल इस फ़ोन पर रहता है। सभी कनेक्शन डेमो हैं।' : 'Data stays on this phone. All connections are mock for the prototype.'}</p>
      </div>
    </div>
  )
}
