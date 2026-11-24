import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Languages, Moon, Ruler, Lock, Download, Trash2, Info, Stethoscope, Fingerprint, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../app/AppProvider'
import { Button, Card, Header, ListRow, SectionTitle, Segmented, Toggle } from '../../components/ui'

export default function Settings() {
  const { lang, setLang, dark, setDark, toast, setOnboarded } = useApp()
  const nav = useNavigate()
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [lock, setLock] = useState(true)
  const [confirm, setConfirm] = useState(false)
  return (
    <div>
      <Header title={lang === 'hi' ? 'सेटिंग्स' : 'Settings'} />
      <div className="px-4 pb-8">
        <SectionTitle>{lang === 'hi' ? 'सामान्य' : 'General'}</SectionTitle>
        <Card className="space-y-4">
          <div><p className="mb-2 flex items-center gap-2 font-semibold"><Languages size={18} aria-hidden />{lang === 'hi' ? 'भाषा' : 'Language'}</p>
            <Segmented label="Language" value={lang} onChange={setLang} options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }]} /></div>
          <div><p className="mb-2 flex items-center gap-2 font-semibold"><Ruler size={18} aria-hidden />{lang === 'hi' ? 'यूनिट' : 'Units'}</p>
            <Segmented label="Units" value={units} onChange={setUnits} options={[{ value: 'metric', label: 'kg · cm · °C' }, { value: 'imperial', label: 'lb · in · °F' }]} /></div>
        </Card>
        <Card className="mt-3 !p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Moon size={20} aria-hidden />} title={lang === 'hi' ? 'डार्क मोड' : 'Dark mode'} right={<Toggle checked={dark} onChange={setDark} label="Dark mode" />} />
          <ListRow icon={<Fingerprint size={20} aria-hidden />} title={lang === 'hi' ? 'ऐप लॉक' : 'App lock'} subtitle={lang === 'hi' ? 'फ़िंगरप्रिंट से खोलें' : 'Unlock with fingerprint'} right={<Toggle checked={lock} onChange={setLock} label="App lock" />} />
        </Card>

        <SectionTitle>{lang === 'hi' ? 'गोपनीयता और डेटा' : 'Privacy & data'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Lock size={20} aria-hidden />} title={lang === 'hi' ? 'सारा डेटा फ़ोन पर' : 'All data stays on this phone'} subtitle={lang === 'hi' ? 'कोई क्लाउड नहीं, कोई एनालिटिक्स नहीं' : 'No cloud, no analytics, encrypted at rest'} />
          <ListRow icon={<Download size={20} aria-hidden />} title={lang === 'hi' ? 'डेटा एक्सपोर्ट करें' : 'Export my data'} subtitle="JSON · CSV · FHIR" onClick={() => toast(lang === 'hi' ? 'एक्सपोर्ट तैयार (डेमो)' : 'Export ready (demo)', 'success')} />
          <ListRow icon={<Trash2 size={20} className="text-red-600" aria-hidden />} title={lang === 'hi' ? 'सारा डेटा मिटाएँ' : 'Delete all data'} subtitle={lang === 'hi' ? 'हमेशा के लिए' : 'Permanently, from this phone'} onClick={() => setConfirm(true)} />
        </Card>

        <SectionTitle>{lang === 'hi' ? 'जानकारी' : 'About'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          <ListRow icon={<Info size={20} aria-hidden />} title="PocketVaidya v1 · prototype" subtitle="wHACKiest 2026 · Team Ctrl+Alt+Defeat" />
          <ListRow icon={<RotateCcw size={20} aria-hidden />} title={lang === 'hi' ? 'ऑनबोर्डिंग फिर से देखें' : 'Replay onboarding'} onClick={() => { setOnboarded(false); nav('/onboarding') }} />
        </Card>
        <Card className="mt-3 !bg-amber-50 !border-amber-200 dark:!bg-amber-950/30 dark:!border-amber-900/50">
          <p className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200"><Stethoscope size={18} aria-hidden />{lang === 'hi' ? 'चिकित्सा अस्वीकरण' : 'Medical disclaimer'}</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-200">{lang === 'hi'
            ? 'PocketVaidya एक स्क्रीनिंग टूल है, निदान का साधन नहीं। सभी परिणाम अनुमानित हैं और चिकित्सा सलाह का विकल्प नहीं हैं। आपातकाल में 112 पर कॉल करें। यह प्रोटोटाइप मॉक डेटा दिखाता है।'
            : 'PocketVaidya is a screening tool, not a diagnostic device. All results are estimates and do not replace advice from a qualified doctor. In an emergency, call 112. This prototype shows mock data only.'}</p>
        </Card>
      </div>

      <AnimatePresence>
        {confirm && (
          <motion.div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div role="alertdialog" aria-modal="true" aria-labelledby="del-title" className="w-full rounded-[24px] bg-card p-5" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h2 id="del-title" className="text-lg font-bold">{lang === 'hi' ? 'सारा डेटा मिटाएँ?' : 'Delete all data?'}</h2>
              <p className="mt-1 text-sm text-muted">{lang === 'hi' ? 'सभी स्कैन, ट्रेंड और रिपोर्ट इस फ़ोन से हटा दिए जाएँगे। (डेमो — कुछ नहीं मिटेगा)' : 'All scans, trends and reports will be removed from this phone. (Demo — nothing is actually deleted.)'}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => setConfirm(false)}>{lang === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
                <Button variant="danger" onClick={() => { setConfirm(false); toast(lang === 'hi' ? 'डेटा मिटाया गया (डेमो)' : 'All data deleted (demo)', 'success') }}>{lang === 'hi' ? 'मिटाएँ' : 'Delete'}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
