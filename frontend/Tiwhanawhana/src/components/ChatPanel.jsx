// components/ChatPanel.jsx

import { useState } from 'react'
import { callApi } from '../api'

export function ChatPanel({ threadId, history, onReply, loading, scrollRef }) {
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    setSending(true)
    const form = new FormData()
form.append("message", input)

await callApi(`/assistant/thread/${threadId}/message`, {
  method: "POST",
  body: form
})

    setInput("")
    await onReply()
    setSending(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto p-2 border border-zinc-800 rounded">
        {history.map((msg, i) => (
          <div key={i} className={f`p-3 rounded-lg ${msg.role === 'user' ? 'bg-zinc-800 text-right' : msg.role === 'assistant' ? 'bg-zinc-700 text-left' : 'bg-zinc-600 text-left'}`}>
            {msg.role === 'assistant' && msg.content.startsWith('[TOOL]') ? (
              <span className="text-sm text-yellow-400">🛠️ {msg.content.replace('[TOOL]', '').trim()}</span>
            ) : (
              <span>{msg.content}</span>
            )}
          </div>
        ))}
        {loading && <div className="text-center text-zinc-400 text-sm">⏳ Updating memory...</div>}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 rounded bg-zinc-800 text-zinc-100"
          placeholder="Ask Tiwhanawhana anything..."
        />
        <button onClick={sendMessage} disabled={sending} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded">
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}
