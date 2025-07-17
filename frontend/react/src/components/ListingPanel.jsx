// components/ListingPanel.jsx

import { useState } from 'react'
import { callApi } from '../api'

export function ListingPanel({ threadId }) {
  const [name, setName] = useState("")
  const [rarity, setRarity] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState(null)

  const submitListing = async () => {
    if (!name || !rarity || !price) {
      setStatus("All fields except image are required.")
      return
    }

    try {
      const form = new FormData()
      form.append("name", name)
      form.append("rarity", rarity)
      form.append("price", price)
      if (imageUrl) form.append("image_url", imageUrl)

      await callApi("/list-card", {
        method: "POST",
        body: form,
        isForm: true
      })

      setStatus("✅ Card listed successfully.")
      await callApi(`/assistant/thread/${threadId}/message`, {
        method: "POST",
        body: { message: `Card listed: ${name} (${rarity}) - $${price}` }
      })
    } catch (err) {
      console.error(err)
      setStatus("Failed to list card.")
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">List a Card</h2>
      <input type="text" placeholder="Card Name" value={name} onChange={e => setName(e.target.value)} className="p-2 rounded bg-zinc-800 text-zinc-100" />
      <input type="text" placeholder="Rarity" value={rarity} onChange={e => setRarity(e.target.value)} className="p-2 rounded bg-zinc-800 text-zinc-100" />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="p-2 rounded bg-zinc-800 text-zinc-100" />
      <input type="text" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="p-2 rounded bg-zinc-800 text-zinc-100" />
      <button onClick={submitListing} className="p-2 bg-teal-600 hover:bg-teal-700 rounded">List Card</button>
      {status && <div className="text-sm text-yellow-400">{status}</div>}
    </div>
  )
}
