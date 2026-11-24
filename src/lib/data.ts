import userData from '../mock/user.json'
import vitalsData from '../mock/vitals.json'
import scansData from '../mock/scans.json'
import labData from '../mock/lab_report.json'
import chatData from '../mock/chat.json'
import mcpData from '../mock/mcp.json'
import districtData from '../mock/district.json'

export type Profile = (typeof userData.profiles)[number]
export type Day = (typeof vitalsData.days)[number]
export type Anomaly = (typeof vitalsData.anomalies)[number]
export type MetricKey = 'heartRate' | 'hrv' | 'spo2' | 'sleep' | 'steps' | 'haemoglobin'

export const profiles = userData.profiles
export const vitals = vitalsData
export const scans = scansData
export const labReport = labData
export const chat = chatData
export const mcp = mcpData
export const districts = districtData

export function getProfile(id: string): Profile {
  return profiles.find((p) => p.id === id) ?? profiles[0]
}

/** Vitals adjusted per family profile so each profile has its own numbers. */
export function daysFor(profile: Profile): Day[] {
  const o = profile.offsets
  return vitals.days.map((d) => ({
    ...d,
    restingHr: d.restingHr + o.hr,
    avgHr: d.avgHr + o.hr,
    hrv: Math.max(12, d.hrv + o.hrv),
    spo2: Math.min(99, d.spo2 + o.spo2),
    sleep: +(d.sleep + o.sleep).toFixed(1),
    steps: Math.max(800, d.steps + o.steps),
    stress: Math.min(95, d.stress + o.stress),
  }))
}

export function hbFor(profile: Profile) {
  return vitals.haemoglobin.map((h) => ({ ...h, low: +(h.low + profile.offsets.hb).toFixed(1), high: +(h.high + profile.offsets.hb).toFixed(1) }))
}

export function baselineFor(profile: Profile) {
  const b = vitals.baseline, o = profile.offsets
  return { restingHr: b.restingHr + o.hr, hrv: b.hrv + o.hrv, spo2: b.spo2 + o.spo2, sleep: +(b.sleep + o.sleep).toFixed(1), steps: b.steps + o.steps, stress: b.stress + o.stress }
}

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', opts)

export const fmtNum = (n: number) => n.toLocaleString('en-IN')
