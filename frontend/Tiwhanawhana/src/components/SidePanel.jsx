export default function SidePanel({ setPanel }) {
  return (
    <div className="bg-zinc-900 w-60 min-h-screen p-4 flex flex-col gap-4 text-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Tiwhanawhana</h2>

      <button
        onClick={() => setPanel("chat")}
        className="p-2 bg-zinc-800 rounded hover:bg-zinc-700"
      >
        🧠 Chat
      </button>

      <button
        onClick={() => setPanel("scan")}
        className="p-2 bg-zinc-800 rounded hover:bg-zinc-700"
      >
        📷 Scan Card
      </button>

      <button
        onClick={() => setPanel("logs")}
        className="p-2 bg-zinc-800 rounded hover:bg-zinc-700"
      >
        📜 Recent Logs
      </button>

      <button
        onClick={() => setPanel("list")}
        className="p-2 bg-zinc-800 rounded hover:bg-zinc-700"
      >
        💸 List Card
      </button>

      <button
        onClick={() => setPanel("export")}
        className="p-2 bg-zinc-800 rounded hover:bg-zinc-700"
      >
        📤 Export CSV
      </button>
    </div>
  );
}
