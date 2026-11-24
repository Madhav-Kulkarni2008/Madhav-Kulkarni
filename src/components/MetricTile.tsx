import type { ReactNode } from 'react'
import { Sparkline } from './viz'

export function MetricTile({ icon, label, value, unit, sub, color, trend, onClick, action, flag }: {
  icon: ReactNode; label: string; value: string; unit?: string; sub?: string; color: string; trend?: number[]; onClick?: () => void; action?: ReactNode; flag?: string
}) {
  return (
    <div className="relative flex flex-col rounded-[20px] border border-line bg-card p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <button type="button" onClick={onClick} className="absolute inset-0 rounded-[20px] transition-colors hover:bg-black/[0.02] active:bg-black/[0.04]" aria-label={`${label}: ${value} ${unit ?? ''}`} />
      <div className="pointer-events-none flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: color + '1F', color }}>{icon}</span>
        <span className="text-sm font-semibold text-muted">{label}</span>
      </div>
      <div className="pointer-events-none mt-3 flex items-baseline gap-1">
        <span className="text-[26px] font-bold leading-none tracking-tight tabular">{value}</span>
        {unit && <span className="text-sm font-medium text-muted">{unit}</span>}
      </div>
      {sub && <p className={`pointer-events-none mt-1 text-xs font-medium ${flag ? 'text-amber-700 dark:text-amber-400' : 'text-muted'}`}>{sub}</p>}
      {trend && <div className="pointer-events-none mt-2 opacity-80"><Sparkline data={trend} color={color} height={24} /></div>}
      {action && <div className="relative mt-2">{action}</div>}
    </div>
  )
}

export function StatBox({ label, value, unit, note, tone = 'default', badge }: { label: string; value: ReactNode; unit?: string; note?: string; tone?: 'default' | 'warn'; badge?: ReactNode }) {
  return (
    <div className={`rounded-[20px] border p-4 ${tone === 'warn' ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : 'border-line bg-card'}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm font-semibold text-muted">{label}</span>
        {badge}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight tabular">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      {note && <p className="mt-1 text-xs font-medium text-muted">{note}</p>}
    </div>
  )
}
