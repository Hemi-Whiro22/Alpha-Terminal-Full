import { useEffect, useState } from "react"

export default function LogsPanel() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`)
        const data = await res.json()
        setLogs(data)
      } catch (err) {
        console.error("Failed to fetch logs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  return (
    <div className="p-6 text-zinc-200">
      <h2 className="text-2xl font-bold mb-4">🧠 OCR Memory Logs</h2>

      {loading ? (
        <p>⏳ Loading...</p>
      ) : logs.length === 0 ? (
        <p>No scans yet. Drop a card image to get started!</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="border border-zinc-700 p-4 rounded-xl bg-zinc-800">
              <p className="text-sm text-zinc-400 mb-1">🕓 {new Date(log.created_at).toLocaleString()}</p>
              <p className="text-green-300 whitespace-pre-wrap break-words mb-2">🧠 {log.text}</p>
              <pre className="text-sm text-cyan-300 whitespace-pre-wrap break-words">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
