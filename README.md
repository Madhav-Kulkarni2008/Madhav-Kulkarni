# Pocket Vaidya

**A private doctor in your phone that screens using your camera, mic, and wearable.**

* **Event:** wHACKiest 2026 (Online Ideathon · 26–27 Nov 2026)
* **Track:** Healthcare
* **Team:** Ctrl+Alt+Defeat (Team ID: `0f2d4189`)
* **College:** PES University

---

## Links
* **Pitch Video:** [Watch on YouTube](https://youtu.be/p7QB67KD8tc?si=Wsw88UgwOjJ2YP_a)
* **Presentation Slides:** [View PPT](https://docs.google.com/presentation/d/1814zNomkJ2u_h6gB6fJZOImjcrocJwhN/edit?usp=sharing&ouid=103136086896643504001&rtpof=true&sd=true)

---

## Problem Statement
Wearables record a lot of health data but give almost no actionable insight, while early screening for conditions like anaemia (affecting 57% of Indian women aged 15–49) and TB (27% of global cases in India) still requires hospital visits, travel, queues, and cost.

## Proposed Solution
**Pocket Vaidya** runs completely offline and on-device—no login, no cloud uploads:
1. **Pulse, HRV & SpO₂:** Fingertip on camera + flash → heart rate, HRV, and oxygen levels in 30 seconds.
2. **Anaemia Check:** Photo of fingernails or inner eyelid → estimated haemoglobin.
3. **Cough Screen:** 15-second cough recording → TB / asthma risk flag.
4. **Your Health Story:** Merges smartwatch data into a personal baseline and explains changes in plain English or Hindi.
5. **Local MCP Server:** Exposes health tools (`scan_vitals`, `anemia_screen`, `cough_screen`, `trends`) to any MCP client or doctor tool—only with user consent.

## Tech Stack
* **Mobile App:** Flutter (Android-first)
* **Wearable Data:** Health Connect / HealthKit
* **Vitals:** Custom PPG signal pipeline (filter + peak detection)
* **Screening Models:** TensorFlow Lite / ONNX Runtime Mobile (MedSigLIP for images, HeAR for cough audio)
* **Explainer AI:** MedGemma 4B, quantized (`llama.cpp`)
* **Storage:** SQLite + SQLCipher (encrypted local history)
* **MCP Layer:** Local MCP server (FastMCP / Dart `mcp_server`)
* **Datasets:** UBFC-rPPG, MMPD, Eyes-defy-anemia, Coswara, NFHS-5, HMIS

---

## Team Ctrl+Alt+Defeat
| Role | Name | USN |
| :--- | :--- | :--- |
| Member 1 (Lead) | Madhav Kulkarni | PES1UG26CS278 |
| Member 2 | Karan Ballari | PES1UG26AM244 |
| Member 3 | Krishna Maanas Parepalli | PES1UG26EC171 |
| Member 4 | Kanisk Gautam | PES1UG26AM243 |
