import { useState } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about Aryan's portfolio 👋" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "This is a placeholder reply. Backend coming soon!" },
    ]);
    setIsLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend(input);
  };

  return (
    <div className="cw-root">
      {isOpen && (
        <div className="cw-card">
          <div className="cw-header">
            <span className="cw-dot" />
            <span className="cw-title">Portfolio Assistant</span>
            <button className="cw-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="cw-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cw-bubble cw-bubble--${m.role}`}>
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div className="cw-bubble cw-bubble--assistant">
                <span className="cw-typing"><span/><span/><span/></span>
              </div>
            )}
          </div>

          <div className="cw-input-bar">
            <input
              className="cw-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="cw-send" onClick={() => handleSend(input)}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button className="cw-bubble-btn" onClick={() => setIsOpen((o) => !o)}>
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}