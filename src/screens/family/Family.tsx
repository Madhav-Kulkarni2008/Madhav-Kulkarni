import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Plus, Crown } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Header } from '../../components/ui'
import { ScoreRing } from '../../components/viz'
import { daysFor, profiles } from '../../lib/data'

export default function Family() {
  const { lang, profile, setProfileId, toast } = useApp()
  const nav = useNavigate()
  return (
    <div>
      <Header title={lang === 'hi' ? 'परिवार प्रोफ़ाइल' : 'Family profiles'} subtitle={lang === 'hi' ? 'हर सदस्य का अपना डेटा' : 'Each member has their own data'} />
      <div className="space-y-3 px-4 pb-8">
        {profiles.map((p) => {
          const today = daysFor(p).at(-1)!
          const active = p.id === profile.id
          return (
            <motion.div key={p.id} layout>
              <Card onClick={() => { setProfileId(p.id); toast(lang === 'hi' ? `${p.relationHi} की प्रोफ़ाइल पर स्विच किया` : `Switched to ${p.name}`, 'success'); nav('/') }} className={active ? '!border-2 !border-brand' : ''}>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: p.color }}>{p.initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><p className="text-lg font-bold">{p.id === 'self' ? profile.id === 'self' ? profile.name : p.name : p.name}</p><Badge tone="muted">{lang === 'hi' ? p.relationHi : p.relation}</Badge></div>
                    <p className="text-sm text-muted">{p.age} · {p.sex} · HR {today.restingHr} · Sleep {today.sleep} h</p>
                    <p className="mt-1 text-sm font-medium">{lang === 'hi' ? p.insightHi : p.insight}</p>
                  </div>
                  <ScoreRing value={p.vitalityScore} size={56} stroke={6}><span className="text-sm font-bold">{p.vitalityScore}</span></ScoreRing>
                </div>
                {active && <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand dark:text-brand-light"><Check size={15} aria-hidden />{lang === 'hi' ? 'अभी देख रहे हैं' : 'Currently viewing'}</p>}
              </Card>
            </motion.div>
          )
        })}
        <Button full variant="secondary" icon={<Plus size={19} aria-hidden />} onClick={() => nav('/pricing')}>{lang === 'hi' ? 'सदस्य जोड़ें' : 'Add family member'} <Crown size={15} className="text-accent" aria-label="Pro" /></Button>
      </div>
    </div>
  )
}
