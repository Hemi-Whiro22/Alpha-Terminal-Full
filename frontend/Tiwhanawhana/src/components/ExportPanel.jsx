// components/ExportPanel.jsx

export function ExportPanel() {
  const handleExport = () => {
    const link = document.createElement('a')
    link.href = 'http://localhost:8000/export-csv'
    link.download = 'card_listings.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h2 className="text-xl font-bold">Export Card Listings</h2>
      <button
        onClick={handleExport}
        className="p-3 bg-emerald-600 hover:bg-emerald-700 rounded text-white shadow"
      >
        📤 Download CSV
      </button>
      <p className="text-sm text-zinc-400">Includes name, rarity, price, and image URL.</p>
    </div>
  )
}
