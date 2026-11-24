import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ShieldCheck, Stethoscope } from 'lucide-react'
import { useApp } from '../app/AppProvider'

export function Card({ children, className = '', onClick, as = 'div' }: { children: ReactNode; className?: string; onClick?: () => void; as?: 'div' | 'button' }) {
  const cls = `rounded-[20px] border border-line bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${onClick ? 'text-left transition-transform duration-200 active:scale-[0.98] w-full' : ''} ${className}`
  if (onClick || as === 'button') return <button type="button" onClick={onClick} className={cls}>{children}</button>
  return <div className={cls}>{children}</div>
}

type BadgeTone = 'brand' | 'accent' | 'alert' | 'muted' | 'ok'
const toneCls: Record<BadgeTone, string> = {
  brand: 'bg-soft text-brand dark:text-brand-light',
  accent: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  alert: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  muted: 'bg-black/5 text-muted dark:bg-white/10',
  ok: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}
export function Badge({ children, tone = 'brand', icon }: { children: ReactNode; tone?: BadgeTone; icon?: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneCls[tone]}`}>{icon}{children}</span>
}

export function PrototypeBadge() {
  const { t } = useApp()
  return <Badge tone="accent">{t('prototype')}</Badge>
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: ReactNode; full?: boolean }
export function Button({ variant = 'primary', icon, full, className = '', children, ...rest }: BtnProps) {
  const v = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
    secondary: 'bg-card text-ink border border-line hover:bg-soft',
    ghost: 'text-brand dark:text-brand-light hover:bg-soft',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant]
  return (
    <button type="button" {...rest} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${v} ${full ? 'w-full' : ''} ${className}`}>
      {icon}{children}
    </button>
  )
}

export function Header({ title, subtitle, right, back = true, onBack, tone = 'default' }: { title: string; subtitle?: string; right?: ReactNode; back?: boolean; onBack?: () => void; tone?: 'default' | 'dark' }) {
  const nav = useNavigate()
  const { t } = useApp()
  return (
    <header className={`sticky top-0 z-20 flex items-center gap-2 px-4 pb-3 pt-4 backdrop-blur md:pt-10 ${tone === 'dark' ? 'bg-black/80 text-white' : 'bg-bg/90'}`}>
      {back && (
        <button type="button" aria-label={t('back')} onClick={onBack ?? (() => nav(-1))} className={`-ml-2 flex h-11 w-11 items-center justify-center rounded-full ${tone === 'dark' ? 'hover:bg-white/10' : 'hover:bg-soft'}`}>
          <ChevronLeft size={26} aria-hidden />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className={`truncate text-sm ${tone === 'dark' ? 'text-white/70' : 'text-muted'}`}>{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}

export function TabTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-6 md:pt-12">
      <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
      {right}
    </header>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between px-1">
      <h2 className="text-lg font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  )
}

export function Disclaimer() {
  const { t } = useApp()
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200" role="note">
      <Stethoscope size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p className="font-medium">{t('disclaimer')}</p>
    </div>
  )
}

export function PrivacyBadge() {
  const { t } = useApp()
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-xs font-semibold text-brand dark:text-brand-light">
      <ShieldCheck size={14} aria-hidden /> {t('onDevice')}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-brand' : 'bg-black/15 dark:bg-white/20'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  )
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex rounded-2xl bg-black/5 p-1 dark:bg-white/10">
      {options.map((o) => (
        <button key={o.value} role="tab" type="button" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={`relative flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${value === o.value ? 'text-ink' : 'text-muted'}`}>
          {value === o.value && <motion.span layoutId={'seg-' + label} className="absolute inset-0 rounded-xl bg-card shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export function ListRow({ icon, title, subtitle, right, onClick }: { icon?: ReactNode; title: string; subtitle?: string; right?: ReactNode; onClick?: () => void }) {
  const inner = (
    <>
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-brand dark:text-brand-light">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        {subtitle && <span className="block truncate text-sm text-muted">{subtitle}</span>}
      </span>
      {right}
    </>
  )
  const cls = 'flex w-full items-center gap-3 px-4 py-3 text-left'
  return onClick ? <button type="button" onClick={onClick} className={cls + ' transition-colors hover:bg-soft'}>{inner}</button> : <div className={cls}>{inner}</div>
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 pb-8 ${className}`}>{children}</div>
}
