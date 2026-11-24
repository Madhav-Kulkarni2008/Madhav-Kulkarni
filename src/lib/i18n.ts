export type Lang = 'en' | 'hi'

const strings = {
  home: { en: 'Home', hi: 'होम' },
  scan: { en: 'Scan', hi: 'स्कैन' },
  trends: { en: 'Trends', hi: 'ट्रेंड' },
  assistant: { en: 'Assistant', hi: 'सहायक' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  goodMorning: { en: 'Good morning', hi: 'सुप्रभात' },
  goodAfternoon: { en: 'Good afternoon', hi: 'नमस्ते' },
  goodEvening: { en: 'Good evening', hi: 'शुभ संध्या' },
  vitality: { en: 'Vitality Score', hi: 'वाइटैलिटी स्कोर' },
  quickScan: { en: 'Quick scan', hi: 'तुरंत जाँच' },
  pulse: { en: 'Pulse', hi: 'नब्ज़' },
  anaemia: { en: 'Anaemia', hi: 'एनीमिया' },
  cough: { en: 'Cough', hi: 'खाँसी' },
  today: { en: 'Today', hi: 'आज' },
  highlights: { en: 'Highlights', hi: 'मुख्य बातें' },
  onDevice: { en: 'On-device · Offline ready', hi: 'फ़ोन पर ही · ऑफ़लाइन तैयार' },
  disclaimer: { en: 'Screening, not diagnosis. See a doctor if concerned.', hi: 'यह जाँच है, निदान नहीं। चिंता हो तो डॉक्टर को दिखाएँ।' },
  heartRate: { en: 'Heart rate', hi: 'धड़कन' },
  hrv: { en: 'HRV', hi: 'HRV' },
  spo2: { en: 'SpO₂', hi: 'SpO₂' },
  sleep: { en: 'Sleep', hi: 'नींद' },
  steps: { en: 'Steps', hi: 'कदम' },
  haemoglobin: { en: 'Haemoglobin', hi: 'हीमोग्लोबिन' },
  coughCheck: { en: 'Cough check', hi: 'खाँसी जाँच' },
  stress: { en: 'Stress', hi: 'तनाव' },
  measure: { en: 'Measure', hi: 'मापें' },
  seeAll: { en: 'See all', hi: 'सभी देखें' },
  save: { en: 'Save', hi: 'सेव करें' },
  saved: { en: 'Saved', hi: 'सेव हो गया' },
  shareDoctor: { en: 'Share with doctor', hi: 'डॉक्टर से साझा करें' },
  done: { en: 'Done', hi: 'हो गया' },
  start: { en: 'Start', hi: 'शुरू करें' },
  next: { en: 'Next', hi: 'आगे' },
  skip: { en: 'Skip', hi: 'छोड़ें' },
  back: { en: 'Back', hi: 'वापस' },
  comingSoon: { en: 'Coming soon in the full app', hi: 'पूरे ऐप में जल्द आ रहा है' },
  language: { en: 'Language', hi: 'भाषा' },
  darkMode: { en: 'Dark mode', hi: 'डार्क मोड' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  askAnything: { en: 'Ask about your health…', hi: 'अपनी सेहत के बारे में पूछें…' },
  runsOnPhone: { en: 'Runs on your phone · MedGemma', hi: 'आपके फ़ोन पर चलता है · MedGemma' },
  prototype: { en: 'Prototype', hi: 'प्रोटोटाइप' },
  estimated: { en: 'Estimated', hi: 'अनुमानित' },
  experimental: { en: 'Experimental', hi: 'प्रायोगिक' },
} as const

export type StringKey = keyof typeof strings

export function translate(lang: Lang, key: StringKey): string {
  return strings[key][lang]
}
