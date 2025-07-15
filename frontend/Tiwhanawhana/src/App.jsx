// Tiwhanawhana UI – Kaitiaki Frontend 🐺

import { useEffect, useState, useRef } from 'react'
import { ScanPanel } from './components/ScanPanel'
import { ChatPanel } from './components/ChatPanel'
import { ListingPanel } from './components/ListingPanel'
import { callApi } from './api'

export default function App() {
  const [panel, setPanel] = useState("scan")
  const [threadId, setThreadId] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
  const existing = localStorage.getItem("tiwhanawhana_thread")
  if (existing && existing !== "undefined") {
    setThreadId(existing)
    fetchHistory(existing)
  } else {
    callApi("/assistant/thread/start", { method: "POST" })
      .then(res => {
        if (res.thread_id) {
          localStorage.setItem("tiwhanawhana_thread", res.thread_id)
          setThreadId(res.thread_id)
          fetchHistory(res.thread_id)
        } else {
          console.error("Thread start failed", res)
        }
      })
      .catch(console.error)
  }
}, [])

  const fetchHistory = (id) => {
    setLoading(true)
    callApi(`/assistant/thread/${id}/history`)
      .then(res => setHistory(res.history || []))
      .then(() => {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      })
      .finally(() => setLoading(false))
      .catch(console.error)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="p-4 text-center font-bold text-xl tracking-wider bg-zinc-900 shadow">
        TIWHANAWHANA 🐺 – KAITIAKI UI <span className="text-zinc-400 text-sm">– TOHU MANA ETERNAL</span>
      </header>

      <nav className="flex justify-center gap-4 p-4 border-b border-zinc-800">
        <button onClick={() => setPanel("scan")}>Scan</button>
        <button onClick={() => setPanel("list")}>Listings</button>
        <button onClick={() => setPanel("chat")}>Chat</button>
      </nav>

      <main className="p-6 flex-1 overflow-y-auto">
        {panel === "scan" && <ScanPanel threadId={threadId} />}
        {panel === "list" && <ListingPanel threadId={threadId} />}
        {panel === "chat" && <ChatPanel
          threadId={threadId}
          history={history}
          loading={loading}
          onReply={() => fetchHistory(threadId)}
          scrollRef={bottomRef}
        />}
        <div ref={bottomRef} className="h-1" />
      </main>
    </div>
  )
}

// ✅ ChatPanel now includes auto-scroll + Tohu Mana Eternal recognition 🧠🐺
// ✅ Loading state added + ready for tool-based visual enhancements
