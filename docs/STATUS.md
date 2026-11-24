# PocketVaidya v1 — Status

All screens from CLAUDE.md §4 are built (frontend only, mock data). `npm run build` passes; no console errors on any route.

| Screen | Route | Status |
|---|---|---|
| Onboarding (3 slides + permissions + profile) | `/onboarding` | Done |
| Home dashboard | `/` | Done |
| Pulse + HRV + SpO₂ scan (hero) | `/scan/pulse` | Done (optional real camera preview) |
| Anaemia photo check | `/scan/anaemia` | Done |
| Cough screen | `/scan/cough` | Done |
| Scan hub | `/scan` | Done |
| Wearable sync | `/sync` | Done |
| Trends + anomaly markers | `/trends` | Done |
| Lab report reader | `/lab` | Done |
| AI assistant (EN/HI scripted) | `/assistant` | Done |
| Doctor report (PDF, WhatsApp, ABHA mock) | `/report` | Done |
| Connect AI (MCP) | `/mcp` | Done |
| District context (placeholder data) | `/district` | Done |
| Family profiles | `/family` | Done |
| Settings | `/settings` | Done |
| Pricing / Pro | `/pricing` | Done |

Not done yet: deploy to Vercel/Netlify, test on a real Android phone, demo video.
Every result screen has a "Demo: show flagged/normal result" link for judges.
