# CLAUDE.md — PocketVaidya v1 Mockup (wHACKiest 2026, Team Ctrl+Alt+Defeat)

This file tells Claude Code (and the agents it dispatches) how to build **v1: a clickable mockup**.
Read it fully before writing code. If a request conflicts with this file, ask before proceeding.

**What v1 is:** a polished, frontend-only prototype that shows judges how PocketVaidya looks and feels.
**What v1 is not:** a working medical product. **There is no backend.** No real measurements, no ML, no APIs.
All numbers come from mock data files. Scans are animated simulations that end on preset results.

**Deadline:** tonight, 23:59 IST. Target build time: 3–4 hours. Polish beats breadth.

---

## 1. The product in one line

A private "doctor in your phone": screens for early warning signs using the phone's camera, microphone
and wearable data, explains results in plain language, and connects to AI assistants through MCP.
Nothing leaves the phone.

Every result screen shows: **"Screening, not diagnosis. See a doctor if concerned."**

## 2. Key decisions (decided)

| Decision | Choice |
|---|---|
| Platform | Mobile-first web app, designed for a 390×844 phone screen; deployed to Vercel/Netlify so judges open a link |
| Stack | Vite + React + TypeScript + Tailwind + React Router + Framer Motion (animations) + Recharts (charts) + lucide-react (icons) |
| Data | Static mock JSON in `src/mock/`. No backend, no database, no network calls |
| State | React context + `localStorage` only for small things (onboarding done, language, dark mode) |
| Scans | Simulated: real camera/mic *preview* is allowed for realism, but results are always from mock data |
| Desktop viewing | On wide screens, render the app inside a centred phone frame |

## 3. Design direction (borrow from popular apps)

Copy proven patterns, not assets or branding. No logos, icons or images from these apps.

| Borrow from | What to copy |
|---|---|
| **Apple Health** | Summary home with pinned metric cards; clean card typography; "Highlights" insight cards |
| **Samsung Health** | Tile-based home dashboard; colourful metric tiles; "Measure" button on the heart-rate tile |
| **Welltory / Instant Heart Rate** | Fingertip-on-camera scan: full-screen camera circle, pulsing heart, live waveform, progress ring, 30-s countdown |
| **Oura / Whoop** | Big daily score ring (our "Vitality Score"), readiness-style breakdown, trend sparkline |
| **Google Fit** | Simple weekly bar charts and goal rings |
| **Ada Health** | Conversational, friendly symptom-check style: one question per screen, calm colours |
| **Practo / Apollo 24/7** | "Consult a doctor" CTA and report-sharing flow familiar to Indian users |
| **HealthifyMe** | Indian context: Hindi toggle, rupee pricing, Indian names in mock data |

**Visual style:** light theme by default (dark mode toggle), soft off-white background, rounded 20px cards,
one dominant brand colour (deep teal `#0F766E`), warm accent (saffron `#F59E0B`), red only for alerts.
Font: Inter (or system UI). Generous spacing, big tap targets, smooth 200–300 ms transitions.

## 4. Screens and features (all of them, all mocked)

### A. Onboarding (3 swipeable slides + permissions)
1. "Your phone already knows a lot about your health." 2. "We turn it into insight." 3. "100% private: nothing leaves your phone."
Then a mock permissions screen (Camera, Microphone, Health Connect) with toggles, and a short profile form
(name, age range, sex, district). Skip button on every slide.

### B. Home dashboard
- Greeting ("Good evening, Madhav") + date.
- **Vitality Score ring** (e.g. 78/100) with a one-line insight ("Your resting heart rate is up this week").
- Metric tiles: Heart rate, HRV, SpO₂, Sleep, Steps, Haemoglobin estimate, Cough check, Stress.
- **Quick scan** row: Pulse · Anaemia · Cough (big round buttons).
- **Insights** cards (Apple Health "Highlights" style), e.g. "You slept 1.2 h less than usual on weeknights".
- Privacy badge: "On-device · Offline ready".

### C. Pulse + HRV + SpO₂ scan (the hero flow — make it the most polished)
1. Instructions screen with illustration: "Cover the rear camera and flash with your fingertip."
2. Scan screen: live camera preview inside a circle (optional real `getUserMedia`, red-tinted), pulsing heart,
   animated PPG waveform, progress ring, 30-s countdown, tips ("Keep still", "Press lightly").
3. Result: BPM, HRV (RMSSD ms), SpO₂ (badge: *experimental*), stress level, comparison vs "your baseline",
   template explanation, "Save" and "Share with doctor".

### D. Anaemia photo check
1. Choose site: inner eyelid or fingernails (illustrated guide).
2. Camera screen with an overlay frame showing where to align; capture button. (Can use a sample image.)
3. "Analysing…" animation.
4. Result: estimated haemoglobin range (e.g. 10.8–11.6 g/dL), "Possibly low" flag, explanation,
   "Get a blood test" CTA, nearby lab suggestion (mock), *prototype* badge.

### E. Cough screen
1. Instructions: "Cough 3–5 times near your phone."
2. Recording screen: animated waveform + live spectrogram-style visual, 15-s timer.
3. Result: cough count, pattern ("dry / wet"), risk flag (low / elevated) for TB/asthma, recommendation, *prototype* badge.

### F. Wearable sync (Health Connect / Apple Health / Noise / boAt)
- List of sources with "Connected" / "Connect" states (all mock). Last-sync time. Data types toggles.

### G. Trends
- Tabs: Day / Week / Month. Charts for heart rate, HRV, sleep, steps, SpO₂, haemoglobin estimates.
- **Anomaly markers** on the chart with explanation cards ("Resting HR +9 bpm vs your 2-week baseline").

### H. Lab report reader
- Upload/photograph a blood report → "Reading report…" → extracted values table (Hb, RBC, WBC, platelets,
  glucose, cholesterol) with normal ranges, colour-coded flags, and plain-language explanations. All mock.

### I. AI health assistant (chat)
- Chat UI with suggested prompts ("Why is my HRV low?", "Is my haemoglobin okay?").
- Replies are **pre-scripted** from mock data (no API). Badge: "Runs on your phone · MedGemma".
- Hindi/English toggle switches the scripted replies.

### J. Doctor report
- Preview of a one-page report (patient info, latest readings, trends, flags).
- Buttons: Download PDF (can download a static sample PDF), Share via WhatsApp (mock), Link to ABHA (mock).

### K. Connect AI (MCP) — important for judging
- Screen explaining "Let your AI assistant read your health data, with your permission."
- List of MCP tools with toggles: `get_latest_vitals`, `get_trends`, `find_anomalies`, `doctor_summary`, `district_context`.
- Connected clients (mock): Claude Desktop, Doctor's clinic system. Access log ("Claude read your trends · 2 min ago").
- "Revoke access" button. Optional: a code block showing the MCP config snippet.

### L. District health context
- Enter/auto-select district → cards with NFHS-5 style indicators (anaemia %, diabetes %, hypertension %).
- **Use clearly labelled placeholder values** unless real NFHS-5 figures are added from the official source.

### M. Family profiles
- Switch between profiles (Self, Mother, Father) with avatars — each with its own mock data.

### N. Settings
- Language (English / हिंदी), dark mode, units, privacy ("Delete all data" — mock), data export, about,
  medical disclaimer.

### O. Pricing / Pro (shows the business model)
- Free vs Pro (₹99/month) comparison: family profiles, long-term trends, doctor reports. "Start free trial" (mock).

### Navigation
Bottom tab bar: **Home · Scan · Trends · Assistant · Profile**. Everything else reachable from these.

## 5. Mock data (`src/mock/`)

- `user.json` — profile (Madhav, 18–24, male, Bengaluru Urban) + family profiles.
- `vitals.json` — 30 days of daily HR, HRV, SpO₂, sleep, steps, stress, with 2–3 deliberate anomalies.
- `scans.json` — preset results for pulse, anaemia, cough (one "normal", one "flagged" variant each).
- `lab_report.json` — one sample blood report.
- `chat.json` — scripted Q&A in English and Hindi.
- `mcp.json` — tools, clients, access log.
- `district.json` — placeholder district indicators (marked as placeholder).

Use Indian names, ₹ prices, Indian cities. Keep all health numbers medically plausible.

## 6. Folder structure

```
pocketvaidya/
  CLAUDE.md
  docs/STATUS.md
  src/
    app/          # router, layout, phone frame, bottom nav
    screens/      # one folder per screen (onboarding, home, pulse, anemia, cough, sync, trends,
                  #   lab, assistant, report, mcp, district, family, settings, pricing)
    components/   # Card, MetricTile, ScoreRing, ScanCircle, Waveform, Badge, ChartCard, ChatBubble…
    mock/         # JSON files from §5
    lib/          # i18n strings, formatters, mock "scan" simulators
    styles/
```

## 7. Agent roles

Claude Code = **chief architect and senior dev**: sets up the project, design tokens, shared components,
routing and mock data shapes, builds the hero flows, reviews and merges everything.

| Agent | Builds |
|---|---|
| **Claude** | Scaffold, design system + shared components, router + bottom nav + phone frame, mock data schemas, **Home**, **Pulse scan** (hero), final polish + deploy |
| **Codex J1** | Anaemia check, Cough screen |
| **Codex J2** | Trends (charts + anomaly markers), Wearable sync, District context |
| **Codex J3** | AI assistant chat, Lab report reader, Doctor report |
| **Gemini** | Simple static screens: Onboarding, Settings, Pricing, Family profiles, Connect AI (MCP) layout; mock JSON content; Hindi strings |

Rules:
- Juniors build only with the shared components and design tokens; no new colours or fonts.
- Each agent works on its own branch/worktree and only in its screen folders.
- Claude reviews every screen against §3 before merging.

Dispatch (verify command names on first run): Codex via `claude mcp add codex -- codex mcp-server`;
Gemini via `gemini -p "<brief>"`; parallel work via `git worktree add ../pv-<name> -b <branch>`.

## 8. Timeline

| Time | Work |
|---|---|
| 0:00–0:45 | Claude: scaffold, tokens, components, nav, mock data. Gemini: mock JSON + onboarding copy |
| 0:45–2:30 | Claude: Home + Pulse scan. J1/J2/J3 + Gemini build their screens in parallel |
| 2:30–3:15 | Claude merges, fixes inconsistencies, adds transitions |
| 3:15–3:45 | Deploy, test on a real Android phone, record a backup demo video |

If behind: simplify District, Family, Pricing to single static screens. **Never cut:** Home, Pulse scan, Connect AI (MCP).

## 9. Demo script (definition of done)

1. Open link on phone → onboarding → permissions → Home with Vitality Score.
2. Pulse scan with full animation → result → save.
3. Anaemia check → flagged result → "Get a blood test".
4. Cough screen → result.
5. Trends → tap an anomaly → explanation.
6. Assistant: ask "Why is my HRV low?" in English, then switch to Hindi.
7. Lab report → flagged values explained.
8. Doctor report → share.
9. Connect AI (MCP) → show tools, clients and access log.
10. Every screen loads with no console errors, works at 360–430 px width, and has no dead buttons
    (unbuilt actions show a "Coming soon" toast).

## 10. Rules

- No backend, no external API calls, no analytics. Everything works offline after first load.
- No real medical claims: results say *estimated*, prototype features carry a *prototype* badge.
- No copyrighted assets: no logos, icons or screenshots from other apps. Use lucide icons and simple SVG illustrations.
- Accessible: colour contrast AA, labels on icon buttons, readable at 16 px body text.
- Update `docs/STATUS.md` after each screen; commit after each screen.

## 11. After v1 (not tonight)

Real camera PPG processing, trained anaemia/cough models, Health Connect sync, real MCP server reading
on-device data, on-device LLM explanations, real NFHS-5 data.
