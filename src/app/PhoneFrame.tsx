import type { ReactNode } from 'react'

/** Full-screen on phones; a centred 390×844 device frame on wide screens. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center md:p-6">
      <div className="hidden lg:flex flex-col gap-3 mr-12 max-w-xs text-ink">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight">PocketVaidya</span>
        </div>
        <p className="text-muted leading-relaxed">A private doctor in your phone. Screens for early warning signs with your camera, microphone and wearable — nothing leaves the device.</p>
        <p className="text-xs text-muted">Clickable prototype · all data is mock · wHACKiest 2026 · Team Ctrl+Alt+Defeat</p>
      </div>
      <div className="relative h-full w-full overflow-hidden bg-bg md:h-[844px] md:max-h-[calc(100vh-48px)] md:w-[390px] md:rounded-[48px] md:border-[10px] md:border-[#111] md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute left-1/2 top-2 z-40 hidden h-7 w-28 -translate-x-1/2 rounded-full bg-[#111] md:block" aria-hidden />
        {children}
      </div>
    </div>
  )
}
