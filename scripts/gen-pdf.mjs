// Writes a minimal one-page sample PDF (public/sample-report.pdf). Mock data only.
import { writeFileSync } from 'node:fs'
const lines = [
  ['F2', 18, 'PocketVaidya Health Summary'],
  ['F1', 10, 'Generated 24 Nov 2026 - screening data, not a diagnosis. PROTOTYPE - MOCK DATA.'],
  ['F1', 11, ''],
  ['F2', 12, 'Patient: Madhav Sharma   Age/Sex: 21 / M   District: Bengaluru Urban'],
  ['F1', 11, 'ABHA: 91-4527-8830-1146'],
  ['F1', 11, ''],
  ['F2', 12, 'Latest readings'],
  ['F1', 11, 'Resting heart rate ........ 66 bpm   (baseline 66)'],
  ['F1', 11, 'HRV (RMSSD) ............... 46 ms    (baseline 52)'],
  ['F1', 11, 'SpO2 ...................... 98 %     (95-100)'],
  ['F1', 11, 'Sleep (7-day avg) ......... 6.7 h    (7-9 h)'],
  ['F1', 11, 'Haemoglobin (photo est.) .. 10.8-11.6 g/dL (13-17)'],
  ['F1', 11, 'Haemoglobin (lab 20 Nov) .. 11.4 g/dL (13-17)'],
  ['F1', 11, 'Fasting glucose (lab) ..... 104 mg/dL (70-99)'],
  ['F1', 11, ''],
  ['F2', 12, 'Flags for review'],
  ['F1', 11, '- Haemoglobin below range; downward trend over 4 weeks.'],
  ['F1', 11, '- Resting HR +9 bpm and HRV -35% vs baseline on 19 Nov; partially recovered.'],
  ['F1', 11, '- Fasting glucose 104 mg/dL (prediabetes range).'],
  ['F1', 11, ''],
  ['F1', 9, 'Screening, not diagnosis. See a doctor if concerned. Values from phone sensors are estimates.'],
]
let y = 790
let content = 'BT\n'
for (const [f, s, t] of lines) {
  content += `/${f} ${s} Tf 1 0 0 1 56 ${y} Tm (${t.replace(/[()\\]/g, '\\$&')}) Tj\n`
  y -= s + 9
}
content += 'ET\n0.06 0.46 0.43 RG 2 w 56 770 m 539 770 l S\n'
const objs = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`,
]
let pdf = '%PDF-1.4\n'
const offs = []
objs.forEach((o, i) => { offs.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
const xref = Buffer.byteLength(pdf)
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('')
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
writeFileSync('public/sample-report.pdf', pdf)
