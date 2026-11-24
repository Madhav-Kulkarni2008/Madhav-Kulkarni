import { useEffect, useRef, useState } from 'react'

/** Optional real camera preview. Falls back silently when unavailable or denied. Results never depend on it. */
export function useCamera(enabled: boolean, facingMode: 'environment' | 'user' = 'environment', torch = false) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    if (!enabled || !navigator.mediaDevices?.getUserMedia) return
    let stream: MediaStream | null = null
    let cancelled = false
    navigator.mediaDevices.getUserMedia({ video: { facingMode, width: { ideal: 640 } }, audio: false })
      .then(async (s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return }
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          await videoRef.current.play().catch(() => {})
        }
        setLive(true)
        if (torch) {
          const track = s.getVideoTracks()[0]
          // Torch is supported on many Android phones; ignore failures elsewhere.
          track?.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] }).catch(() => {})
        }
      })
      .catch(() => setLive(false))
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
      setLive(false)
    }
  }, [enabled, facingMode, torch])
  return { videoRef, live }
}
