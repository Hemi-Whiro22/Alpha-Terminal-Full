import { createContext, useContext, useState, useEffect } from "react";

const TiContext = createContext();

export const useTi = () => useContext(TiContext);

export function TiwhanawhanaProvider({ children }) {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tiResponse, setTiResponse] = useState("");

  const sendPrompt = async (prompt) => {
    setLoading(true);
    const res = await fetch("/assistant/thread/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: prompt, thread_id: threadId }),
    });
    const data = await res.json();
    setThreadId(data.thread_id); // Reuse if exists
    setMessages((prev) => [...prev, { role: "user", content: prompt }, ...data.messages]);
    setTiResponse(data.output);
    setLoading(false);
  };

  return (
    <TiContext.Provider value={{ sendPrompt, tiResponse, loading, messages }}>
      {children}
    </TiContext.Provider>
  );
}
