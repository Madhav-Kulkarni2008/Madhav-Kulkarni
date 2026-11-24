import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info } from 'lucide-react'
import { translate, type Lang, type StringKey } from '../lib/i18n'
import { getProfile, type Profile } from '../lib/data'

type Toast = { id: number; text: string; kind: 'info' | 'success' }

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: StringKey) => string
  dark: boolean
  setDark: (d: boolean) => void
  onboarded: boolean
  setOnboarded: (v: boolean) => void
  userName: string
  setUserName: (n: string) => void
  profile: Profile
  setProfileId: (id: string) => void
  toast: (text: string, kind?: Toast['kind']) => void
  comingSoon: () => void
}

const AppCtx = createContext<Ctx | null>(null)

function useStored<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem('pv.' + key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem('pv.' + key, JSON.stringify(v)) } catch { /* private mode */ }
  }, [key, v])
  return [v, setV] as const
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useStored<Lang>('lang', 'en')
  const [dark, setDark] = useStored('dark', false)
  const [onboarded, setOnboarded] = useStored('onboarded', false)
  const [userName, setUserName] = useStored('name', 'Madhav')
  const [profileId, setProfileId] = useStored('profile', 'self')
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.lang = lang
  }, [dark, lang])

  const toast = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    const id = nextId.current++
    setToasts((ts) => [...ts.slice(-1), { id, text, kind }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2400)
  }, [])

  const value = useMemo<Ctx>(() => {
    const base = getProfile(profileId)
    const profile = base.id === 'self' ? { ...base, name: userName || base.name } : base
    return {
      lang, setLang, t: (k) => translate(lang, k),
      dark, setDark, onboarded, setOnboarded, userName, setUserName,
      profile, setProfileId, toast,
      comingSoon: () => toast(translate(lang, 'comingSoon')),
    }
  }, [lang, dark, onboarded, userName, profileId, toast, setLang, setDark, setOnboarded, setUserName, setProfileId])

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {toasts.map((x) => (
            <motion.div key={x.id} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}
              className="flex max-w-[340px] items-center gap-2 rounded-2xl bg-[#12201E] px-4 py-3 text-sm font-medium text-white shadow-xl">
              {x.kind === 'success' ? <CheckCircle2 size={18} className="text-brand-light" aria-hidden /> : <Info size={18} className="text-accent" aria-hidden />}
              {x.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppCtx.Provider>
  )
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside AppProvider')
  return c
}
