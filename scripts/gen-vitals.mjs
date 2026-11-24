// Generates src/mock/vitals.json — 30 days of plausible daily vitals with deliberate anomalies.
import { writeFileSync } from 'node:fs'
let seed = 42
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const jitter = (a) => (rnd() * 2 - 1) * a
const end = new Date('2026-11-24T00:00:00Z')
const days = []
for (let i = 29; i >= 0; i--) {
  const d = new Date(end); d.setUTCDate(end.getUTCDate() - i)
  const dow = d.getUTCDay() // 0 Sun
  const weeknight = dow >= 1 && dow <= 4
  let restingHr = Math.round(66 + jitter(2.5))
  let hrv = Math.round(52 + jitter(5))
  let spo2 = Math.round(97.6 + jitter(0.8))
  let sleep = +(weeknight ? 6.3 + jitter(0.4) : 7.6 + jitter(0.4)).toFixed(1)
  let steps = Math.round((dow === 0 ? 5200 : 7800) + jitter(1800))
  let stress = Math.round(34 + jitter(8))
  const anomaly = []
  const iso = d.toISOString().slice(0, 10)
  if (iso === '2026-11-12') { sleep = 4.6; stress = 58; anomaly.push('sleep') }
  if (iso >= '2026-11-18' && iso <= '2026-11-21') { restingHr = 72 + Math.round(rnd() * 2); hrv = 37 + Math.round(rnd() * 4); stress = 55 + Math.round(rnd() * 8) }
  if (iso === '2026-11-19') { restingHr = 75; hrv = 34; anomaly.push('heartRate', 'hrv') }
  if (iso === '2026-11-07') { spo2 = 94; anomaly.push('spo2') }
  days.push({ date: iso, restingHr, avgHr: restingHr + 12 + Math.round(jitter(3)), hrv, spo2: Math.min(99, spo2), sleep, steps, stress, anomaly })
}
const anomalies = [
  { id: 'a1', metric: 'heartRate', date: '2026-11-19', title: 'Resting HR +9 bpm', detail: 'Resting HR +9 bpm vs your 2-week baseline (66 bpm). Seen with poor sleep, stress, dehydration or the start of an infection.', severity: 'watch' },
  { id: 'a2', metric: 'hrv', date: '2026-11-19', title: 'HRV dropped 35%', detail: 'HRV 34 ms vs your usual 52 ms. Low HRV often follows short sleep, illness or heavy training. It recovered partly by 22 Nov.', severity: 'watch' },
  { id: 'a3', metric: 'sleep', date: '2026-11-12', title: 'Only 4.6 h of sleep', detail: '2.5 h less than your weekly average. One short night is normal; a pattern is worth fixing.', severity: 'info' },
  { id: 'a4', metric: 'spo2', date: '2026-11-07', title: 'SpO₂ reading of 94%', detail: 'A single low reading, likely from a loose watch strap. Your other readings are 97–98%. Recheck if you feel breathless.', severity: 'info' },
]
const hourly = Array.from({ length: 24 }, (_, h) => {
  const base = h < 6 ? 58 : h < 9 ? 70 : h < 18 ? 78 : h < 22 ? 74 : 64
  return { hour: `${String(h).padStart(2, '0')}:00`, hr: Math.round(base + jitter(5) + (h === 18 ? 38 : 0)) }
})
const haemoglobin = [
  { date: '2026-10-27', low: 12.1, high: 12.9 },
  { date: '2026-11-03', low: 11.9, high: 12.6 },
  { date: '2026-11-10', low: 11.5, high: 12.2 },
  { date: '2026-11-17', low: 11.1, high: 11.9 },
  { date: '2026-11-24', low: 10.8, high: 11.6 },
]
writeFileSync('src/mock/vitals.json', JSON.stringify({ unitsNote: 'All values are mock data for a prototype.', baseline: { restingHr: 66, hrv: 52, spo2: 98, sleep: 7.1, steps: 7500, stress: 35 }, days, anomalies, hourly, haemoglobin }, null, 2))
console.log(days.slice(-8))
