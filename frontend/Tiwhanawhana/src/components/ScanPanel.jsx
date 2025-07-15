// Step 3: Drag & Drop OCR Integration for ScanPanel

import { useState } from 'react'

export default function ScanPanel() {
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    const form = new FormData()
    form.append('image', file)

    setUploading(true)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ocr/image`, {
      method: 'POST',
      body: form
    })

    const data = await res.json()
    setResult(data)
    setUploading(false)
  }

  return (
    <div
      className="border border-dashed border-zinc-500 p-6 rounded-xl text-zinc-300 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p className="mb-4">Drag and drop a card image to scan 🔍</p>
      {imagePreview && <img src={imagePreview} alt="preview" className="mx-auto mb-4 max-h-60 rounded-lg" />}
      {uploading && <p className="text-yellow-400">⏳ Scanning card...</p>}
      {result && (
        <div className="mt-4 text-left">
          <p className="text-green-400">🧠 OCR Text:</p>
          <pre className="text-sm text-zinc-100 whitespace-pre-wrap break-words">{result.text}</pre>

          <p className="text-cyan-400 mt-2">💾 Metadata:</p>
          <pre className="text-sm text-zinc-100 whitespace-pre-wrap break-words">{JSON.stringify(result.metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
