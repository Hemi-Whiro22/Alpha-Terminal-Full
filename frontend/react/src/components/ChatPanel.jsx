// components/ChatPanel.jsx
import { useDropzone } from 'react-dropzone'
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

const onDrop = async (acceptedFiles) => {
  const file = acceptedFiles[0]
  if (!file) return
  const form = new FormData()
  form.append("image", file)

  const res = await callApi("/ocr/image", {
    method: "POST",
    body: form
  })

  const { text, metadata } = res
  const summary = `[TOOL] OCR Detected: ${metadata.name || 'Unknown'} (${metadata.set || 'Set'} - ${metadata.rarity || 'Rarity'})`

  setHistory((prev) => [...prev, { role: "assistant", content: summary }])
}

const { getRootProps, getInputProps } = useDropzone({ onDrop })


await callApi(`/assistant/thread/${threadId}/message`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: input })
}) }
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
<div {...getRootProps()} className="p-4 border border-dashed border-zinc-600 rounded text-center text-zinc-400 cursor-pointer hover:border-teal-400">
  <input {...getInputProps()} />
  📷 Drop card image here to scan (or click)
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
