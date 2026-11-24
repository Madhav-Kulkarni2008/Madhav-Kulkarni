import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { BottomNav } from './BottomNav'
import { useApp } from './AppProvider'
import Onboarding from '../screens/onboarding/Onboarding'
import Home from '../screens/home/Home'
import ScanHub from '../screens/scan/ScanHub'
import PulseScan from '../screens/pulse/PulseScan'
import AnaemiaCheck from '../screens/anemia/AnaemiaCheck'
import CoughCheck from '../screens/cough/CoughCheck'
import Trends from '../screens/trends/Trends'
import Assistant from '../screens/assistant/Assistant'
import ProfileHub from '../screens/profile/ProfileHub'
import Sync from '../screens/sync/Sync'
import LabReport from '../screens/lab/LabReport'
import DoctorReport from '../screens/report/DoctorReport'
import ConnectAI from '../screens/mcp/ConnectAI'
import District from '../screens/district/District'
import Family from '../screens/family/Family'
import Settings from '../screens/settings/Settings'
import Pricing from '../screens/pricing/Pricing'

const TAB_PATHS = ['/', '/scan', '/trends', '/assistant', '/profile']

function Page({ children }: { children: ReactNode }) {
  const full = useLocation().pathname === '/assistant'
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} className={full ? 'h-full' : 'min-h-full'}>
      {children}
    </motion.div>
  )
}

export function AppRoutes() {
  const location = useLocation()
  const { onboarded } = useApp()
  const scroller = useRef<HTMLDivElement>(null)
  const showNav = TAB_PATHS.includes(location.pathname) && onboarded
  const isAssistant = location.pathname === '/assistant'

  useEffect(() => { scroller.current?.scrollTo({ top: 0 }) }, [location.pathname])

  const guard = (el: ReactNode) => (onboarded ? <Page>{el}</Page> : <Navigate to="/onboarding" replace />)

  return (
    <PhoneFrame>
      <div ref={scroller} className={`no-scrollbar h-full ${isAssistant ? 'overflow-hidden' : 'overflow-y-auto'} ${showNav && !isAssistant ? 'pb-24' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={guard(<Home />)} />
            <Route path="/scan" element={guard(<ScanHub />)} />
            <Route path="/scan/pulse" element={guard(<PulseScan />)} />
            <Route path="/scan/anaemia" element={guard(<AnaemiaCheck />)} />
            <Route path="/scan/cough" element={guard(<CoughCheck />)} />
            <Route path="/lab" element={guard(<LabReport />)} />
            <Route path="/trends" element={guard(<Trends />)} />
            <Route path="/assistant" element={guard(<Assistant />)} />
            <Route path="/profile" element={guard(<ProfileHub />)} />
            <Route path="/sync" element={guard(<Sync />)} />
            <Route path="/report" element={guard(<DoctorReport />)} />
            <Route path="/mcp" element={guard(<ConnectAI />)} />
            <Route path="/district" element={guard(<District />)} />
            <Route path="/family" element={guard(<Family />)} />
            <Route path="/settings" element={guard(<Settings />)} />
            <Route path="/pricing" element={guard(<Pricing />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {showNav && <BottomNav />}
    </PhoneFrame>
  )
}
