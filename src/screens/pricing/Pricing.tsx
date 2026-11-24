import { useState } from 'react'
import { Check, Minus, Crown, Sparkles } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Header, Segmented } from '../../components/ui'

export default function Pricing() {
  const { lang, toast } = useApp()
  const [billing, setBilling] = useState<'month' | 'year'>('month')
  const rows: [string, string, boolean | string, boolean | string][] = [
    ['Pulse, HRV & SpO₂ scans', 'नब्ज़, HRV, SpO₂ जाँच', true, true],
    ['Anaemia & cough checks', 'एनीमिया और खाँसी जाँच', '3 / month', 'Unlimited'],
    ['Trends history', 'ट्रेंड इतिहास', '30 days', 'Lifetime'],
    ['AI assistant (on-device)', 'AI सहायक (फ़ोन पर)', '10 / day', 'Unlimited'],
    ['Family profiles', 'परिवार प्रोफ़ाइल', false, 'Up to 5'],
    ['Doctor reports (PDF, ABHA)', 'डॉक्टर रिपोर्ट (PDF, ABHA)', false, true],
    ['Connect AI (MCP)', 'AI कनेक्ट (MCP)', false, true],
  ]
  const cell = (v: boolean | string) => v === true ? <Check size={18} className="mx-auto text-brand dark:text-brand-light" aria-label="Included" /> : v === false ? <Minus size={18} className="mx-auto text-muted" aria-label="Not included" /> : <span className="text-xs font-semibold">{v}</span>
  return (
    <div>
      <Header title="PocketVaidya Pro" />
      <div className="px-4 pb-8">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-accent text-white shadow-lg"><Crown size={30} aria-hidden /></span>
          <h2 className="mt-3 text-2xl font-bold">{lang === 'hi' ? 'पूरे परिवार की सेहत, एक फ़ोन में' : 'Your whole family’s health, in one phone'}</h2>
          <p className="mt-1 text-muted">{lang === 'hi' ? 'एक चाय से भी कम, हर हफ़्ते' : 'Less than a cup of chai a week'}</p>
        </div>
        <div className="mt-5"><Segmented label="Billing" value={billing} onChange={setBilling} options={[{ value: 'month', label: lang === 'hi' ? 'मासिक' : 'Monthly' }, { value: 'year', label: lang === 'hi' ? 'वार्षिक · 25% बचत' : 'Yearly · save 25%' }]} /></div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card>
            <p className="font-bold">Free</p>
            <p className="mt-1 text-3xl font-bold">₹0</p>
            <p className="text-xs text-muted">{lang === 'hi' ? 'हमेशा' : 'forever'}</p>
          </Card>
          <Card className="!border-2 !border-accent relative">
            <span className="absolute -top-3 right-3"><Badge tone="accent" icon={<Sparkles size={11} aria-hidden />}>{lang === 'hi' ? 'लोकप्रिय' : 'Popular'}</Badge></span>
            <p className="font-bold">Pro</p>
            <p className="mt-1 text-3xl font-bold">₹{billing === 'month' ? 99 : 899}</p>
            <p className="text-xs text-muted">{billing === 'month' ? (lang === 'hi' ? 'प्रति माह' : 'per month') : (lang === 'hi' ? 'प्रति वर्ष · ₹75/माह' : 'per year · ₹75/mo')}</p>
          </Card>
        </div>
        <Card className="mt-3 !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line bg-soft/60 text-left"><th className="px-4 py-2.5 font-semibold">{lang === 'hi' ? 'सुविधा' : 'Feature'}</th><th className="w-20 py-2.5 text-center font-semibold">Free</th><th className="w-20 py-2.5 text-center font-semibold">Pro</th></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map(([en, hi, f, p]) => <tr key={en}><td className="px-4 py-3">{lang === 'hi' ? hi : en}</td><td className="text-center">{cell(f)}</td><td className="text-center">{cell(p)}</td></tr>)}
            </tbody>
          </table>
        </Card>
        <Button full className="mt-5 !bg-accent !text-[#3B2604] hover:!bg-amber-400" onClick={() => toast(lang === 'hi' ? '7 दिन का मुफ़्त ट्रायल शुरू (डेमो)' : '7-day free trial started (demo)', 'success')}>{lang === 'hi' ? '7 दिन मुफ़्त आज़माएँ' : 'Start 7-day free trial'}</Button>
        <p className="mt-2 text-center text-xs text-muted">{lang === 'hi' ? 'UPI से भुगतान · कभी भी रद्द करें · डेमो' : 'Pay with UPI · cancel anytime · demo only'}</p>
        <Card className="mt-4 !bg-soft !border-transparent text-sm">{lang === 'hi' ? 'ASHA कार्यकर्ताओं और सरकारी स्वास्थ्य केंद्रों के लिए मुफ़्त।' : 'Free for ASHA workers and government health centres.'}</Card>
      </div>
    </div>
  )
}
