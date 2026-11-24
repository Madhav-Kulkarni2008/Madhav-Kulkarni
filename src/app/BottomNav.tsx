import { NavLink } from 'react-router-dom'
import { Home, ScanLine, LineChart, MessageCircleHeart, UserRound } from 'lucide-react'
import { useApp } from './AppProvider'

const tabs = [
  { to: '/', key: 'home', Icon: Home },
  { to: '/scan', key: 'scan', Icon: ScanLine },
  { to: '/trends', key: 'trends', Icon: LineChart },
  { to: '/assistant', key: 'assistant', Icon: MessageCircleHeart },
  { to: '/profile', key: 'profile', Icon: UserRound },
] as const

export function BottomNav() {
  const { t } = useApp()
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Main">
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, key, Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={({ isActive }) =>
              `flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors ${isActive ? 'text-brand dark:text-brand-light' : 'text-muted'}`}>
              {({ isActive }) => (<>
                <span className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${isActive ? 'bg-soft' : ''}`}>
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 2} aria-hidden />
                </span>
                {t(key)}
              </>)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
