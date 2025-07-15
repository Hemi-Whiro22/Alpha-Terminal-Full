// components/LogsPanel.jsx

import { useEffect, useState } from 'react'
import { callApi } from '../api'

export function LogsPanel() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    callApi("/logs")
      .then(res => setLogs(res.logs || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Recent OCR Logs</h2>
      {loading ? (
        <div className="text-zinc-400">Loading logs...</div>
      ) : (
        logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="border border-zinc-700 rounded p-3 bg-zinc-900">
                <div className="text-sm text-zinc-400">📁 {log.filename}</div>
                <div className="text-sm text-yellow-300">📝 {log.text?.slice(0, 100)}...</div>
                <pre className="text-xs text-zinc-500 mt-2">{JSON.stringify(log.metadata, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-400">No logs found.</div>
        )
      )}
    </div>
  )
}
