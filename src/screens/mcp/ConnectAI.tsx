import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Stethoscope, ShieldCheck, Copy, Check, Plug, Activity, Ban, Wrench, Smartphone, ArrowLeftRight, Play } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge, Button, Card, Header, SectionTitle, Toggle } from '../../components/ui'
import { mcp } from '../../lib/data'

const CONFIG = `{
  "mcpServers": {
    "pocketvaidya": {
      "command": "pocketvaidya-mcp",
      "args": ["--device", "madhav-pixel7", "--read-only"]
    }
  }
}`

export default function ConnectAI() {
  const { lang, toast } = useApp()
  const [tools, setTools] = useState(mcp.tools)
  const [clients, setClients] = useState(mcp.clients)
  const [log, setLog] = useState(mcp.log)
  const [copied, setCopied] = useState(false)
  const enabledCount = tools.filter((t) => t.enabled).length
  const anyConnected = clients.some((c) => c.connected)

  const revoke = (id: string) => {
    const c = clients.find((x) => x.id === id)
    setClients((cs) => cs.map((x) => (x.id === id ? { ...x, connected: false } : x)))
    toast(lang === 'hi' ? `${c?.name} की पहुँच हटाई गई` : `Access revoked for ${c?.name}`, 'success')
  }
  const reconnect = (id: string) => setClients((cs) => cs.map((x) => (x.id === id ? { ...x, connected: true } : x)))
  const revokeAll = () => { setClients((cs) => cs.map((x) => ({ ...x, connected: false }))); toast(lang === 'hi' ? 'सभी AI की पहुँच हटाई गई' : 'All AI access revoked', 'success') }
  const simulate = () => {
    const claude = clients.find((c) => c.id === 'claude')
    if (!claude?.connected) { toast(lang === 'hi' ? 'Claude Desktop जुड़ा नहीं है' : 'Claude Desktop is not connected'); return }
    const tool = tools.find((t) => t.name === 'get_latest_vitals')
    if (!tool?.enabled) { setLog((l) => [{ client: 'Claude Desktop', action: 'was blocked from get_latest_vitals (tool off)', tool: 'get_latest_vitals', when: 'Just now' }, ...l]); return }
    setLog((l) => [{ client: 'Claude Desktop', action: 'read your latest vitals', tool: 'get_latest_vitals', when: 'Just now' }, ...l])
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONFIG) } catch { /* ignore */ }
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <Header title={lang === 'hi' ? 'AI कनेक्ट करें' : 'Connect AI'} subtitle="Model Context Protocol (MCP)" />
      <div className="px-4 pb-8">
        <Card className="overflow-hidden !border-0 bg-gradient-to-br from-brand to-teal-600 !p-5 text-white">
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Smartphone size={26} aria-hidden /></span>
            <motion.span animate={{ x: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity }}><ArrowLeftRight size={22} aria-hidden /></motion.span>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Bot size={26} aria-hidden /></span>
          </div>
          <h2 className="mt-3 text-center text-xl font-bold leading-snug">{lang === 'hi' ? 'अपने AI सहायक को आपकी अनुमति से आपका स्वास्थ्य डेटा पढ़ने दें।' : 'Let your AI assistant read your health data, with your permission.'}</h2>
          <p className="mt-2 text-center text-sm text-white/85">{lang === 'hi' ? 'PocketVaidya आपके फ़ोन पर एक MCP सर्वर चलाता है। आप तय करते हैं कि कौन-सा टूल चालू है और कौन पढ़ सकता है।' : 'PocketVaidya runs an MCP server on your phone. You choose which tools are on and who can use them. Read-only.'}</p>
        </Card>

        <Card className="mt-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">{anyConnected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}<span className={`relative inline-flex h-3 w-3 rounded-full ${anyConnected ? 'bg-emerald-500' : 'bg-neutral-400'}`} /></span>
            <div className="flex-1">
              <p className="font-mono text-sm font-semibold">{mcp.server.name}</p>
              <p className="text-xs text-muted">{mcp.server.transport} · v{mcp.server.version} · {enabledCount}/{tools.length} tools on</p>
            </div>
            <Badge tone={anyConnected ? 'ok' : 'muted'}>{anyConnected ? (lang === 'hi' ? 'चल रहा है' : 'Running') : (lang === 'hi' ? 'कोई क्लाइंट नहीं' : 'Idle')}</Badge>
          </div>
        </Card>

        <SectionTitle>{lang === 'hi' ? 'टूल' : 'Tools'}</SectionTitle>
        <Card className="!p-0 divide-y divide-line overflow-hidden">
          {tools.map((t) => (
            <div key={t.name} className="flex items-center gap-3 px-4 py-3">
              <Wrench size={18} className="shrink-0 text-muted" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[13px] font-semibold">{t.name}</p>
                <p className="text-sm text-muted">{t.description}</p>
              </div>
              <Toggle checked={t.enabled} onChange={(v) => setTools((ts) => ts.map((x) => (x.name === t.name ? { ...x, enabled: v } : x)))} label={t.name} />
            </div>
          ))}
        </Card>

        <SectionTitle>{lang === 'hi' ? 'जुड़े हुए क्लाइंट' : 'Connected clients'}</SectionTitle>
        <div className="space-y-3">
          {clients.map((c) => (
            <Card key={c.id} className={c.connected ? '' : 'opacity-70'}>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.id === 'claude' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'}`}>
                  {c.id === 'claude' ? <Bot size={21} aria-hidden /> : <Stethoscope size={21} aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted">{c.kind} · {lang === 'hi' ? 'से' : 'since'} {c.since}</p>
                </div>
                {c.connected ? <Badge tone="ok">{lang === 'hi' ? 'जुड़ा' : 'Connected'}</Badge> : <Badge tone="muted">{lang === 'hi' ? 'हटाया' : 'Revoked'}</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.scopes.map((s) => <span key={s} className="rounded-lg bg-black/5 px-2 py-1 font-mono text-[11px] dark:bg-white/10">{s}</span>)}
              </div>
              <div className="mt-3">
                {c.connected
                  ? <button type="button" onClick={() => revoke(c.id)} className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400"><Ban size={15} aria-hidden />{lang === 'hi' ? 'पहुँच हटाएँ' : 'Revoke access'}</button>
                  : <button type="button" onClick={() => reconnect(c.id)} className="flex items-center gap-1.5 text-sm font-semibold text-brand dark:text-brand-light"><Plug size={15} aria-hidden />{lang === 'hi' ? 'फिर से अनुमति दें' : 'Allow again'}</button>}
              </div>
            </Card>
          ))}
        </div>

        <SectionTitle action={<button type="button" onClick={simulate} className="flex items-center gap-1 text-sm font-semibold text-brand dark:text-brand-light"><Play size={14} aria-hidden />{lang === 'hi' ? 'डेमो अनुरोध' : 'Simulate request'}</button>}>{lang === 'hi' ? 'पहुँच लॉग' : 'Access log'}</SectionTitle>
        <Card className="!p-0 overflow-hidden">
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {log.map((e, i) => (
                <motion.li key={`${e.when}-${e.action}-${log.length - i}`} layout initial={{ opacity: 0, backgroundColor: 'rgba(245,158,11,0.25)' }} animate={{ opacity: 1, backgroundColor: 'rgba(245,158,11,0)' }} transition={{ duration: 1.2 }} className="flex items-start gap-3 px-4 py-3">
                  <Activity size={17} className="mt-0.5 shrink-0 text-brand dark:text-brand-light" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px]"><b>{e.client.replace(" clinic system", '')}</b> {e.action}</p>
                    <p className="text-xs text-muted"><span className="font-mono">{e.tool}</span> · {e.when}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Card>

        <SectionTitle action={<button type="button" onClick={copy} className="flex items-center gap-1 text-sm font-semibold text-brand dark:text-brand-light">{copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}{copied ? 'Copied' : 'Copy'}</button>}>{lang === 'hi' ? 'MCP कॉन्फ़िग' : 'MCP config'}</SectionTitle>
        <pre className="overflow-x-auto rounded-[20px] bg-[#0D1514] p-4 font-mono text-[12px] leading-relaxed text-teal-200"><code>{CONFIG}</code></pre>
        <p className="mt-2 px-1 text-xs text-muted">{lang === 'hi' ? 'Claude Desktop के claude_desktop_config.json में जोड़ें। (प्रोटोटाइप — असली सर्वर v2 में)' : 'Add to claude_desktop_config.json in Claude Desktop. (Prototype — real server ships in v2.)'}</p>

        <Button full variant="danger" className="mt-6" icon={<ShieldCheck size={19} aria-hidden />} onClick={revokeAll} disabled={!anyConnected}>{lang === 'hi' ? 'सभी की पहुँच हटाएँ' : 'Revoke all access'}</Button>
      </div>
    </div>
  )
}
