import { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about Aryan's portfolio 👋", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Auto-scroll to bottom on new messages ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ── Focus input when widget opens (DOM side-effect only, no setState) ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /* ── Format timestamp ── */
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /* ── Send message ── */
  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: "user", text: trimmed, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const reply = { role: "assistant", text: "This is a placeholder reply. Backend coming soon!", time: new Date() };
    setMessages((prev) => [...prev, reply]);
    setIsLoading(false);

    if (!isOpen) setHasNewMessage(true);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  /* ── Voice recording ── */
  const stopRecording = () => {
    cancelAnimationFrame(animFrameRef.current);
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (isRecording) { stopRecording(); return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const checkSilence = () => {
        analyser.getByteTimeDomainData(data);
        const volume = Math.max(...data) - 128;
        if (volume < 6) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(stopRecording, 2000);
          }
        } else {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        animFrameRef.current = requestAnimationFrame(checkSilence);
      };
      animFrameRef.current = requestAnimationFrame(checkSilence);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        // TODO: send blob to Whisper endpoint
        // const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "🎤 Voice received! Whisper endpoint not connected yet.", time: new Date() },
        ]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Microphone access denied. Please allow mic access.", time: new Date() },
      ]);
    }
  };

  /* ── Clear chat ── */
  const clearChat = () => {
    setMessages([{ role: "assistant", text: "Hi! Ask me anything about Aryan's portfolio 👋", time: new Date() }]);
  };

  return (
    <div className="cw-root">
      {isOpen && (
        <div className="cw-card" role="dialog" aria-label="Portfolio chat assistant">

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-left">
              <span className="cw-dot" />
              <span className="cw-title">Portfolio Assistant</span>
              <span className="cw-status-text">· Online</span>
            </div>
            <div className="cw-header-actions">
              <button className="cw-icon-btn" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
              <button className="cw-icon-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cw-messages" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`cw-msg-row cw-msg-row--${m.role}`}>
                <div className="cw-msg-col">
                  <div className={`cw-bubble cw-bubble--${m.role}`}>{m.text}</div>
                  <span className="cw-time">{formatTime(m.time)}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="cw-msg-row cw-msg-row--assistant">
                <div className="cw-msg-col">
                  <div className="cw-bubble cw-bubble--assistant">
                    <span className="cw-typing"><span /><span /><span /></span>
                  </div>
                </div>
              </div>
            )}

            {isRecording && (
              <div className="cw-recording-hint">
                <span className="cw-rec-dot" /> Listening… pause to send
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="cw-input-bar">
            <button
              className={`cw-mic ${isRecording ? "cw-mic--active" : ""}`}
              onClick={startRecording}
              title={isRecording ? "Stop recording" : "Voice input"}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              )}
            </button>

            <input
              ref={inputRef}
              className="cw-input"
              placeholder={isRecording ? "Listening…" : "Ask me anything…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isRecording}
              aria-label="Chat message input"
            />

            <button
              className={`cw-send ${input.trim() && !isLoading ? "cw-send--active" : ""}`}
              onClick={() => handleSend(input)}
              disabled={isRecording || !input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

        </div>
      )}

      {/* Bubble toggle */}
      <button
        className={`cw-bubble-btn ${isOpen ? "cw-bubble-btn--open" : ""}`}
        onClick={() => { setIsOpen((o) => !o); setHasNewMessage(false); }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {hasNewMessage && !isOpen && <span className="cw-badge" />}
        <span className="cw-bubble-icon cw-bubble-icon--chat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span className="cw-bubble-icon cw-bubble-icon--close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
      </button>
    </div>
  );
}