// components/ScanPanel.jsx

import { useState } from 'react'
import { callApi } from '../api'

export function ScanPanel({ threadId }) {
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleImage = async (file) => {
    const form = new FormData()
    form.append("file", file) // ✅ backend expects 'file'
    setStatus("Scanning image...")
    setPreview(URL.createObjectURL(file))

    try {
      const res = await callApi("/scan-card", {
        method: "POST",
        body: form,
        isForm: true
      })

      if (!res.metadata?.name) {
        setStatus("Could not extract text. Try again.")
        return
      }

      setStatus("OCR complete. Passing to assistant...")

      await callApi(`/assistant/thread/${threadId}/message`, {
        method: "POST",
        body: { message: `Scan result: ${res.metadata.name}` }
      })

      setStatus("Assistant processing scan + fetching price...")
    } catch (err) {
      console.error(err)
      setStatus("Failed to scan. Try again.")
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImage(file)
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) handleImage(file)
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-64 border-2 border-dashed border-zinc-600 rounded flex items-center justify-center text-zinc-400"
      >
        Drop card image here or use file picker
      </div>

      <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />

      {preview && (
        <img src={preview} alt="Preview" className="w-48 rounded shadow" />
      )}

      {status && (
        <div className="text-sm text-yellow-300 text-center">⚡ {status}</div>
      )}
    </div>
  )
}
