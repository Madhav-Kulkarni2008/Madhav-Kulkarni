import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, Info, X, HeartPulse, Waves, Moon, Footprints, Wind, Droplet, MessageCircleHeart } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Card, SectionTitle, Segmented, TabTitle } from '../../components/ui'
import { baselineFor, daysFor, fmtDate, hbFor, vitals, type Anomaly, type MetricKey } from '../../lib/data'

type Range = 'day' | 'week' | 'month'

const METRICS: { key: MetricKey; en: string; hi: string; unit: string; color: string; Icon: typeof HeartPulse; field?: 'restingHr' | 'hrv' | 'spo2' | 'sleep' | 'steps' }[] = [
  { key: 'heartRate', en: 'Heart rate', hi: 'धड़कन', unit: 'bpm', color: '#E11D48', Icon: HeartPulse, field: 'restingHr' },
  { key: 'hrv', en: 'HRV', hi: 'HRV', unit: 'ms', color: '#0F766E', Icon: Waves, field: 'hrv' },
  { key: 'sleep', en: 'Sleep', hi: 'नींद', unit: 'h', color: '#6366F1', Icon: Moon, field: 'sleep' },
  { key: 'steps', en: 'Steps', hi: 'कदम', unit: '', color: '#F59E0B', Icon: Footprints, field: 'steps' },
  { key: 'spo2', en: 'SpO₂', hi: 'SpO₂', unit: '%', color: '#0284C7', Icon: Wind, field: 'spo2' },
  { key: 'haemoglobin', en: 'Haemoglobin', hi: 'हीमोग्लोबिन', unit: 'g/dL', color: '#B91C1C', Icon: Droplet },
]

export default function Trends() {
  const { t, lang, profile } = useApp()
  const nav = useNavigate()
  const [range, setRange] = useState<Range>('week')
  const [metric, setMetric] = useState<MetricKey>('heartRate')
  const [selected, setSelected] = useState<Anomaly | null>(null)
  const m = METRICS.find((x) => x.key === metric)!
  const days = useMemo(() => daysFor(profile), [profile])
  const base = baselineFor(profile)
  const baseVal = m.field === 'restingHr' ? base.restingHr : m.field ? base[m.field] : undefined

  const sliced = range === 'week' ? days.slice(-7) : days
  const series = sliced.map((d) => ({ date: d.date, label: fmtDate(d.date, range === 'week' ? { weekday: 'short' } : { day: 'numeric', month: 'short' }), value: m.field ? d[m.field] : 0, anomaly: d.anomaly.includes(metric) }))
  const anomalies = vitals.anomalies.filter((a) => a.metric === metric && (range === 'month' || sliced.some((d) => d.date === a.date)))
  const allVisible = vitals.anomalies.filter((a) => range === 'month' || sliced.some((d) => d.date === a.date))
  const values = series.map((s) => s.value)
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

  const renderDot = (props: { cx?: number; cy?: number; payload?: { anomaly: boolean; date: string }; index?: number }) => {
    const { cx, cy, payload, index } = props
    if (!payload?.anomaly || cx == null || cy == null) return <g key={index} />
    const a = vitals.anomalies.find((x) => x.metric === metric && x.date === payload.date)
    return (
      <g key={index} onClick={() => a && setSelected(a)} style={{ cursor: 'pointer' }} role="button" aria-label={a?.title}>
        <circle cx={cx} cy={cy} r={14} fill="#F59E0B" opacity={0.25}><animate attributeName="r" values="9;16;9" dur="1.6s" repeatCount="indefinite" /></circle>
        <circle cx={cx} cy={cy} r={7} fill="#F59E0B" stroke="#fff" strokeWidth={2.5} />
      </g>
    )
  }

  const tooltipStyle = { borderRadius: 12, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13 }

  let chart: React.ReactNode
  if (metric === 'haemoglobin') {
    const hb = hbFor(profile).map((h) => ({ label: fmtDate(h.date), range: [h.low, h.high] as [number, number], mid: +((h.low + h.high) / 2).toFixed(1) }))
    chart = (
      <AreaChart data={hb} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[9, 16]} tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <ReferenceLine y={profile.sex === 'Female' ? 12 : 13} stroke="#DC2626" strokeDasharray="4 4" label={{ value: lang === 'hi' ? 'सामान्य की न्यूनतम सीमा' : 'Normal minimum', fontSize: 10, fill: '#DC2626', position: 'insideTopRight' }} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => (Array.isArray(v) ? `${v[0]}–${v[1]} g/dL` : `${v} g/dL`)} />
        <Area dataKey="range" stroke={m.color} fill={m.color} fillOpacity={0.2} strokeWidth={2} isAnimationActive />
        <Line dataKey="mid" stroke={m.color} dot />
      </AreaChart>
    )
  } else if (range === 'day') {
    chart = metric === 'heartRate' ? (
      <AreaChart data={vitals.hourly.map((h) => ({ label: h.hour.slice(0, 2), value: h.hr + profile.offsets.hr }))} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs><linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={m.color} stopOpacity={0.35} /><stop offset="100%" stopColor={m.color} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} domain={[40, 'auto']} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} bpm`, lang === 'hi' ? 'धड़कन' : 'Heart rate']} labelFormatter={(l) => `${l}:00`} />
        <Area dataKey="value" stroke={m.color} fill="url(#hrg)" strokeWidth={2.5} type="monotone" />
      </AreaChart>
    ) : null
  } else if (metric === 'steps' || metric === 'sleep') {
    chart = (
      <BarChart data={series} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} interval={range === 'month' ? 6 : 0} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--soft)' }} formatter={(v) => [`${Number(v).toLocaleString('en-IN')} ${m.unit}`, lang === 'hi' ? m.hi : m.en]} />
        {baseVal && <ReferenceLine y={baseVal} stroke="var(--muted)" strokeDasharray="4 4" />}
        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={m.color} onClick={(d: { payload?: { anomaly: boolean; date: string } }) => {
          const a = d.payload?.anomaly && vitals.anomalies.find((x) => x.metric === metric && x.date === d.payload!.date)
          if (a) setSelected(a)
        }} shape={(p: { x?: number; y?: number; width?: number; height?: number; payload?: { anomaly: boolean } }) => (
          <rect x={p.x} y={p.y} width={p.width} height={p.height} rx={5} fill={p.payload?.anomaly ? '#F59E0B' : m.color} style={{ cursor: p.payload?.anomaly ? 'pointer' : 'default' }} />
        )} />
      </BarChart>
    )
  } else {
    chart = (
      <LineChart data={series} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} interval={range === 'month' ? 6 : 0} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} domain={['dataMin - 4', 'dataMax + 4']} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} ${m.unit}`, lang === 'hi' ? m.hi : m.en]} />
        {baseVal && <ReferenceLine y={baseVal} stroke="var(--muted)" strokeDasharray="4 4" label={{ value: lang === 'hi' ? 'आपका औसत' : 'Your baseline', fontSize: 10, fill: 'var(--muted)', position: 'insideBottomLeft' }} />}
        <Line dataKey="value" stroke={m.color} strokeWidth={2.5} type="monotone" dot={renderDot} activeDot={{ r: 5 }} />
      </LineChart>
    )
  }

  return (
    <div>
      <TabTitle title={t('trends')} />
      <div className="px-4 pb-6">
        <Segmented label="Range" value={range} onChange={(v) => { setRange(v); setSelected(null) }} options={[{ value: 'day', label: lang === 'hi' ? 'दिन' : 'Day' }, { value: 'week', label: lang === 'hi' ? 'हफ़्ता' : 'Week' }, { value: 'month', label: lang === 'hi' ? 'महीना' : 'Month' }]} />
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {METRICS.map(({ key, en, hi, color, Icon }) => (
            <button key={key} type="button" onClick={() => { setMetric(key); setSelected(null) }} aria-pressed={metric === key}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${metric === key ? 'border-transparent text-white' : 'border-line bg-card text-ink'}`}
              style={metric === key ? { background: color } : undefined}>
              <Icon size={15} aria-hidden />{lang === 'hi' ? hi : en}
            </button>
          ))}
        </div>

        <Card className="mt-3 !px-2 !pb-2">
          <div className="flex items-end justify-between px-2">
            <div>
              <p className="text-sm font-semibold text-muted">{lang === 'hi' ? 'औसत' : range === 'day' ? 'Today' : 'Average'}</p>
              <p className="text-3xl font-bold tabular">{metric === 'haemoglobin' ? '11.2' : metric === 'steps' ? Math.round(avg).toLocaleString('en-IN') : avg.toFixed(metric === 'sleep' ? 1 : 0)} <span className="text-base font-medium text-muted">{m.unit}</span></p>
            </div>
            {anomalies.length > 0 && <Badge tone="accent" icon={<AlertTriangle size={12} aria-hidden />}>{anomalies.length} {lang === 'hi' ? 'असामान्य' : anomalies.length === 1 ? 'anomaly' : 'anomalies'}</Badge>}
            {metric === 'haemoglobin' && <Badge tone="accent">{t('estimated')}</Badge>}
          </div>
          <div className="mt-3 h-56">
            {chart ? <ResponsiveContainer width="100%" height="100%">{chart as React.ReactElement}</ResponsiveContainer> : (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted">
                <m.Icon size={32} style={{ color: m.color }} aria-hidden />
                <p className="mt-2 text-3xl font-bold text-ink tabular">{m.field ? days[days.length - 1][m.field].toLocaleString('en-IN') : ''} <span className="text-base text-muted">{m.unit}</span></p>
                <p className="mt-1 text-sm">{lang === 'hi' ? 'यह रोज़ का माप है। हफ़्ता या महीना देखें।' : 'This is a daily measure. Switch to Week or Month for the trend.'}</p>
              </div>
            )}
          </div>
          {anomalies.length > 0 && <p className="px-2 pt-1 text-xs text-muted">{lang === 'hi' ? 'नारंगी बिंदु पर टैप करें' : 'Tap an orange marker for the explanation'}</p>}
        </Card>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}
              className="mt-3 rounded-[20px] border-2 border-accent bg-amber-50 p-4 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white"><AlertTriangle size={18} aria-hidden /></span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{fmtDate(selected.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="font-bold">{selected.title}</p>
                  <p className="mt-1 text-[15px] leading-snug">{selected.detail}</p>
                  <button type="button" onClick={() => nav('/assistant')} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand dark:text-brand-light"><MessageCircleHeart size={16} aria-hidden />{lang === 'hi' ? 'सहायक से पूछें' : 'Ask the assistant why'}</button>
                </div>
                <button type="button" aria-label="Close explanation" onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"><X size={18} aria-hidden /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SectionTitle>{lang === 'hi' ? 'आपके औसत से अलग' : 'Unusual vs your baseline'}</SectionTitle>
        {allVisible.length === 0 && <p className="px-1 text-sm text-muted">{lang === 'hi' ? 'इस अवधि में कुछ असामान्य नहीं।' : 'Nothing unusual in this period.'}</p>}
        <div className="space-y-2">
          {allVisible.map((a) => {
            const mm = METRICS.find((x) => x.key === a.metric)!
            return (
              <Card key={a.id} onClick={() => { setMetric(a.metric as MetricKey); setSelected(a); if (range === 'day') setRange('month') }} className="!py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: mm.color + '1F', color: mm.color }}><mm.Icon size={19} aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-sm text-muted">{fmtDate(a.date)} · {lang === 'hi' ? mm.hi : mm.en}</p>
                  </div>
                  {a.severity === 'watch' ? <AlertTriangle size={18} className="text-accent" aria-label="Watch" /> : <Info size={18} className="text-muted" aria-label="Info" />}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
