"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "agent";
  content: string;
}

function isSpec(content: string) {
  return content.includes("## Feature Spec");
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "Hi! Describe the feature you want to build in one sentence and I'll help you write a full product spec.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      setMessages([...updatedMessages, { role: "agent", content: data.reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "agent", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleExport = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[650px] w-full max-w-3xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-200 rounded-bl-sm"
              }`}
            >
              {msg.role === "agent" ? (
                <div
                  className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-lg prose-h3:text-base
                  prose-li:text-gray-300 prose-p:text-gray-300
                  prose-strong:text-white"
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>

            {/* Copy + Export buttons for spec messages */}
            {msg.role === "agent" && isSpec(msg.content) && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  Copy markdown
                </button>
                <button
                  onClick={() => handleExport(msg.content)}
                  className="px-3 py-1 text-xs bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors"
                >
                  Export .md
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your feature..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
