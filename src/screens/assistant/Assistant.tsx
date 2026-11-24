import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles, ShieldCheck, Mic, FileText } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import { Badge } from '../../components/ui'
import { chat } from '../../lib/data'
import type { Lang } from '../../lib/i18n'

type Msg = { id: number; role: 'user' | 'bot'; qa?: string; kind?: 'greeting' | 'fallback'; text?: string }

function botText(m: Msg, lang: Lang) {
  if (m.kind) return chat[m.kind][lang]
  return chat.qa.find((q) => q.id === m.qa)?.a[lang] ?? ''
}
function userText(m: Msg, lang: Lang) {
  if (m.qa) return chat.qa.find((q) => q.id === m.qa)?.q[lang] ?? m.text ?? ''
  return m.text ?? ''
}

function ChatBubble({ role, children, typing }: { role: 'user' | 'bot'; children?: React.ReactNode; typing?: boolean }) {
  const isUser = role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isUser && <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white"><Sparkles size={15} aria-hidden /></span>}
      <div className={`max-w-[82%] whitespace-pre-line rounded-[20px] px-4 py-3 text-[15px] leading-relaxed ${isUser ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md border border-line bg-card'}`}>
        {typing ? (
          <span className="flex gap-1 py-1.5" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => <motion.span key={i} className="h-2 w-2 rounded-full bg-muted" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />)}
          </span>
        ) : children}
      </div>
    </motion.div>
  )
}

export default function Assistant() {
  const { lang, setLang, t, comingSoon } = useApp()
  const nav = useNavigate()
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: 'bot', kind: 'greeting' }])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const nextId = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, typing])

  const ask = (qaId: string | null, text?: string) => {
    if (typing) return
    const userMsg: Msg = { id: nextId.current++, role: 'user', qa: qaId ?? undefined, text }
    setMsgs((m) => [...m, userMsg])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, qaId ? { id: nextId.current++, role: 'bot', qa: qaId } : { id: nextId.current++, role: 'bot', kind: 'fallback' }])
    }, 1100)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    const lower = q.toLowerCase()
    const match = chat.qa.find((x) => x.keywords.some((k) => lower.includes(k)))
    setInput('')
    ask(match ? match.id : null, q)
  }

  const asked = new Set(msgs.filter((m) => m.role === 'user' && m.qa).map((m) => m.qa))
  const suggestions = chat.qa.filter((q) => !asked.has(q.id))
  const lastBot = [...msgs].reverse().find((m) => m.role === 'bot')

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-line bg-bg/95 px-4 pb-3 pt-5 backdrop-blur md:pt-11">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-teal-500 text-white"><Sparkles size={20} aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight">{lang === 'hi' ? 'स्वास्थ्य सहायक' : 'Health assistant'}</h1>
            <p className="flex items-center gap-1 text-xs font-semibold text-brand dark:text-brand-light"><ShieldCheck size={12} aria-hidden />{t('runsOnPhone')}</p>
          </div>
          <div role="group" aria-label={t('language')} className="flex rounded-full border border-line bg-card p-0.5 text-sm font-bold">
            {(['en', 'hi'] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1.5 transition-colors ${lang === l ? 'bg-brand text-white' : 'text-muted'}`}>{l === 'en' ? 'EN' : 'हिं'}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex justify-center"><Badge tone="muted">{lang === 'hi' ? 'स्क्रिप्टेड डेमो जवाब' : 'Scripted demo replies'}</Badge></div>
        {msgs.map((m) => m.role === 'user'
          ? <ChatBubble key={m.id} role="user">{userText(m, lang)}</ChatBubble>
          : <ChatBubble key={m.id} role="bot">{botText(m, lang)}</ChatBubble>)}
        {typing && <ChatBubble role="bot" typing />}
        {!typing && lastBot?.qa && (lastBot.qa === 'hb' || lastBot.qa === 'doctor') && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} type="button" onClick={() => nav('/report')} className="ml-10 flex items-center gap-2 rounded-full border border-brand/30 bg-soft px-4 py-2 text-sm font-semibold text-brand dark:text-brand-light">
            <FileText size={16} aria-hidden />{lang === 'hi' ? 'डॉक्टर रिपोर्ट देखें' : 'Open doctor report'}
          </motion.button>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line bg-bg px-3 pb-24 pt-2">
        <AnimatePresence>
          {suggestions.length > 0 && (
            <div className="no-scrollbar -mx-3 mb-2 flex gap-2 overflow-x-auto px-3">
              {suggestions.map((s) => (
                <motion.button layout key={s.id} type="button" onClick={() => ask(s.id)} disabled={typing}
                  className="shrink-0 rounded-full border border-brand/30 bg-card px-3.5 py-2 text-sm font-semibold text-brand disabled:opacity-50 dark:text-brand-light">
                  {s.q[lang]}
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
        <form onSubmit={submit} className="flex items-center gap-2">
          <button type="button" aria-label="Voice input" onClick={comingSoon} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-card text-muted"><Mic size={20} aria-hidden /></button>
          <label className="sr-only" htmlFor="chat-input">{t('askAnything')}</label>
          <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askAnything')}
            className="h-12 min-w-0 flex-1 rounded-full border border-line bg-card px-4 text-[16px] outline-none placeholder:text-muted focus:border-brand" />
          <button type="submit" aria-label="Send" disabled={!input.trim() || typing} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"><Send size={19} aria-hidden /></button>
        </form>
      </div>
    </div>
  )
}
