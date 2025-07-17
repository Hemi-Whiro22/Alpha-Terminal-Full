import { useState } from "react";
import { useTi } from "./TiwhanawhanaProvider";

export default function PromptPanel() {
  const [input, setInput] = useState("");
  const { sendPrompt, tiResponse, loading } = useTi();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPrompt(input);
    setInput("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 bg-zinc-900 rounded-xl shadow-xl text-zinc-100">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 bg-zinc-800 rounded-xl text-white"
          placeholder="Ask Tiwhanawhana..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="px-4 py-2 bg-emerald-600 rounded-xl" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Ask"}
        </button>
      </form>
      <div className="bg-zinc-800 p-4 rounded-xl">
        <strong className="block text-emerald-400 mb-2">Tiwhanawhana:</strong>
        <div>{tiResponse}</div>
      </div>
    </div>
  );
}
