import { useNavigate } from 'react-router-dom'
import { HeartPulse, ScanEye, Mic, FileText, ChevronRight, Watch, Clock } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Card, PrivacyBadge, SectionTitle, TabTitle } from '../../components/ui'

export default function ScanHub() {
  const { t, lang } = useApp()
  const nav = useNavigate()
  const items = [
    { to: '/scan/pulse', Icon: HeartPulse, bg: 'from-rose-500 to-red-600', title: lang === 'hi' ? 'नब्ज़, HRV और SpO₂' : 'Pulse, HRV & SpO₂', sub: lang === 'hi' ? 'उँगली से कैमरा ढकें · 30 सेकंड' : 'Fingertip on camera · 30 s', badge: null },
    { to: '/scan/anaemia', Icon: ScanEye, bg: 'from-brand to-teal-500', title: lang === 'hi' ? 'एनीमिया फ़ोटो जाँच' : 'Anaemia photo check', sub: lang === 'hi' ? 'पलक या नाखून की फ़ोटो' : 'Photo of inner eyelid or nails', badge: t('prototype') },
    { to: '/scan/cough', Icon: Mic, bg: 'from-amber-500 to-orange-500', title: lang === 'hi' ? 'खाँसी जाँच' : 'Cough screen', sub: lang === 'hi' ? 'माइक से 15 सेकंड' : '15 s with microphone', badge: t('prototype') },
    { to: '/lab', Icon: FileText, bg: 'from-indigo-500 to-violet-500', title: lang === 'hi' ? 'लैब रिपोर्ट पढ़ें' : 'Read a lab report', sub: lang === 'hi' ? 'ब्लड रिपोर्ट की फ़ोटो लें' : 'Photograph a blood report', badge: null },
  ]
  return (
    <div>
      <TabTitle title={t('scan')} />
      <div className="px-4 pb-6">
        <p className="mb-4 px-1 text-muted">{lang === 'hi' ? 'आपके फ़ोन के कैमरा और माइक से जाँच। सब कुछ फ़ोन पर ही प्रोसेस होता है।' : 'Checks that use your phone’s camera and microphone. Everything is processed on the phone.'}</p>
        <div className="space-y-3">
          {items.map(({ to, Icon, bg, title, sub, badge }) => (
            <Card key={to} onClick={() => nav(to)} className="!p-4">
              <div className="flex items-center gap-4">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} text-white shadow-md`}><Icon size={26} aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-bold">{title}</p>{badge && <Badge tone="accent">{badge}</Badge>}</div>
                  <p className="text-sm text-muted">{sub}</p>
                </div>
                <ChevronRight size={20} className="text-muted" aria-hidden />
              </div>
            </Card>
          ))}
        </div>
        <SectionTitle>{lang === 'hi' ? 'हाल की जाँचें' : 'Recent scans'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line">
          {[
            { I: HeartPulse, c: '#E11D48', t: lang === 'hi' ? 'नब्ज़ · 68 bpm' : 'Pulse · 68 bpm', w: lang === 'hi' ? 'आज, सुबह 8:10' : 'Today, 8:10 am' },
            { I: ScanEye, c: '#0F766E', t: lang === 'hi' ? 'हीमोग्लोबिन · 10.8–11.6' : 'Haemoglobin · 10.8–11.6 g/dL', w: lang === 'hi' ? 'आज, सुबह 8:14' : 'Today, 8:14 am' },
            { I: Mic, c: '#EA580C', t: lang === 'hi' ? 'खाँसी · कम जोखिम' : 'Cough · Low risk', w: '22 Nov' },
          ].map(({ I, c, t: tt, w }) => (
            <div key={tt} className="flex items-center gap-3 px-4 py-3">
              <I size={20} style={{ color: c }} aria-hidden />
              <span className="flex-1 font-medium">{tt}</span>
              <span className="flex items-center gap-1 text-xs text-muted"><Clock size={12} aria-hidden />{w}</span>
            </div>
          ))}
        </Card>
        <Card onClick={() => nav('/sync')} className="mt-3">
          <div className="flex items-center gap-3">
            <Watch size={22} className="text-brand dark:text-brand-light" aria-hidden />
            <div className="flex-1"><p className="font-semibold">{lang === 'hi' ? 'वियरेबल डेटा' : 'Wearable data'}</p><p className="text-sm text-muted">Health Connect · Noise · boAt</p></div>
            <ChevronRight size={20} className="text-muted" aria-hidden />
          </div>
        </Card>
        <div className="mt-6 flex justify-center"><PrivacyBadge /></div>
      </div>
    </div>
  )
}
