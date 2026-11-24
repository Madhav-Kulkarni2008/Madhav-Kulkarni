import { useNavigate } from 'react-router-dom'
import { Users, Watch, FileText, Bot, MapPinned, Settings as Cog, Crown, ChevronRight, FlaskConical, ShieldCheck, Languages, Moon } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Card, ListRow, PrivacyBadge, SectionTitle, TabTitle, Toggle } from '../../components/ui'
import { profiles } from '../../lib/data'

export default function ProfileHub() {
  const { t, lang, setLang, dark, setDark, profile, setProfileId } = useApp()
  const nav = useNavigate()
  const chev = <ChevronRight size={20} className="text-muted" aria-hidden />
  return (
    <div>
      <TabTitle title={t('profile')} />
      <div className="px-4 pb-6">
        <Card className="!p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: profile.color }}>{profile.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold">{profile.fullName}</p>
              <p className="text-sm text-muted">{profile.ageRange} · {profile.sex} · {profile.district}</p>
              <p className="mt-1 text-xs font-medium text-muted">ABHA {profile.abha}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2" role="group" aria-label="Family profiles">
            {profiles.map((p) => (
              <button key={p.id} type="button" onClick={() => setProfileId(p.id)} aria-pressed={profile.id === p.id}
                className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-2 transition-colors ${profile.id === p.id ? 'border-brand bg-soft' : 'border-line'}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: p.color }}>{p.initials}</span>
                <span className="text-xs font-semibold">{lang === 'hi' ? p.relationHi : p.relation}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card onClick={() => nav('/pricing')} className="mt-3 !border-amber-300 bg-gradient-to-r from-amber-50 to-card dark:!border-amber-800 dark:from-amber-950/30">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white"><Crown size={20} aria-hidden /></span>
            <div className="flex-1"><p className="font-bold">PocketVaidya Pro</p><p className="text-sm text-muted">{lang === 'hi' ? 'परिवार, लंबे ट्रेंड, डॉक्टर रिपोर्ट · ₹99/माह' : 'Family, long-term trends, doctor reports · ₹99/mo'}</p></div>
            {chev}
          </div>
        </Card>

        <SectionTitle>{lang === 'hi' ? 'साझा करना और कनेक्शन' : 'Sharing & connections'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Bot size={20} aria-hidden />} title={lang === 'hi' ? 'AI कनेक्ट करें (MCP)' : 'Connect AI (MCP)'} subtitle={lang === 'hi' ? '2 क्लाइंट जुड़े हैं' : '2 clients connected'} right={<><Badge tone="ok">Live</Badge>{chev}</>} onClick={() => nav('/mcp')} />
          <ListRow icon={<FileText size={20} aria-hidden />} title={lang === 'hi' ? 'डॉक्टर रिपोर्ट' : 'Doctor report'} subtitle={lang === 'hi' ? 'PDF · WhatsApp · ABHA' : 'PDF · WhatsApp · ABHA'} right={chev} onClick={() => nav('/report')} />
          <ListRow icon={<Watch size={20} aria-hidden />} title={lang === 'hi' ? 'वियरेबल सिंक' : 'Wearable sync'} subtitle="Health Connect · Noise" right={chev} onClick={() => nav('/sync')} />
          <ListRow icon={<FlaskConical size={20} aria-hidden />} title={lang === 'hi' ? 'लैब रिपोर्ट रीडर' : 'Lab report reader'} subtitle={lang === 'hi' ? 'ब्लड रिपोर्ट समझें' : 'Understand a blood report'} right={chev} onClick={() => nav('/lab')} />
        </Card>

        <SectionTitle>{lang === 'hi' ? 'आप और आपका परिवार' : 'You & family'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Users size={20} aria-hidden />} title={lang === 'hi' ? 'परिवार प्रोफ़ाइल' : 'Family profiles'} subtitle={lang === 'hi' ? 'स्वयं, माँ, पिता' : 'Self, Mother, Father'} right={chev} onClick={() => nav('/family')} />
          <ListRow icon={<MapPinned size={20} aria-hidden />} title={lang === 'hi' ? 'ज़िला स्वास्थ्य' : 'District health context'} subtitle={profile.district} right={chev} onClick={() => nav('/district')} />
        </Card>

        <SectionTitle>{t('settings')}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Languages size={20} aria-hidden />} title={t('language')} subtitle={lang === 'hi' ? 'हिंदी' : 'English'} right={<Toggle checked={lang === 'hi'} onChange={(v) => setLang(v ? 'hi' : 'en')} label="Hindi" />} />
          <ListRow icon={<Moon size={20} aria-hidden />} title={t('darkMode')} right={<Toggle checked={dark} onChange={setDark} label={t('darkMode')} />} />
          <ListRow icon={<Cog size={20} aria-hidden />} title={lang === 'hi' ? 'सभी सेटिंग्स' : 'All settings'} subtitle={lang === 'hi' ? 'गोपनीयता, यूनिट, डेटा' : 'Privacy, units, data'} right={chev} onClick={() => nav('/settings')} />
        </Card>
        <div className="mt-6 flex flex-col items-center gap-2">
          <PrivacyBadge />
          <p className="flex items-center gap-1 text-xs text-muted"><ShieldCheck size={12} aria-hidden />PocketVaidya v1 · prototype</p>
        </div>
      </div>
    </div>
  )
}
