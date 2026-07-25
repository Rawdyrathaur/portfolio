import { useCallback, useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import "./ChatWidget.css";

const BACKEND = "https://msrathaur-manish-portfolio-api.hf.space";

export default function ChatWidget({ currentPath = window.location.pathname }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const getInitialWelcome = () => {
    if (currentPath.startsWith("/blog/")) {
      return "Hi! I’m your article assistant. Ask me to summarize, simplify, explain code, or extract key ideas from this article.";
    }

    if (currentPath === "/blog") {
      return "Hi! I’m your blog assistant. I can help you explore articles, topics, and technical notes from this blog.";
    }

    return "Hi! I'm Manish's digital brain. Ask me anything about his work, skills, or projects 👋";
  };

  const [messages, setMessages] = useState([
    { role: "assistant", text: getInitialWelcome(), time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasShownWakeup, setHasShownWakeup] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [articleContext, setArticleContext] = useState(null);

  const isBlogRoute = currentPath.startsWith("/blog");
  const assistantMode = articleContext
    ? "article"
    : isBlogRoute
      ? "blog"
      : "portfolio";

  const assistantTitle =
    assistantMode === "article"
      ? "Article Assistant"
      : assistantMode === "blog"
        ? "Blog Assistant"
        : "Portfolio Assistant";

  const assistantStatus =
    assistantMode === "article"
      ? "· Article mode"
      : assistantMode === "blog"
        ? "· Blog mode"
        : "· Ready to help";

  // Suggested questions shown before the user has typed anything
  const suggestedQuestions =
    assistantMode === "article"
      ? [
          "Summarize this article",
          "What are the key takeaways?",
          "Explain the technical parts simply",
        ]
      : assistantMode === "blog"
        ? [
            "What topics does Manish write about?",
            "What's the latest article?",
            "Recommend something to read",
          ]
        : [
            "What projects has Manish built?",
            "What is Manish's strongest skill?",
            "Is Manish open to full-time roles?",
            "How can I contact Manish?",
          ];

  const getWelcomeMessage = useCallback(() => {
    if (assistantMode === "article") {
      return `Hi! I’m your article assistant for "${articleContext?.title}". Ask me to summarize, simplify, explain code, or extract key ideas from this article.`;
    }

    if (assistantMode === "blog") {
      return "Hi! I’m your blog assistant. I can help you explore articles, topics, and technical notes from this blog.";
    }

    return "Hi! I'm Manish's digital brain. Ask me anything about his work, skills, or projects 👋";
  }, [assistantMode, articleContext]);
  const hasShownNotify = useRef(false);
  const notifyTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const externalSendRef = useRef(null);

  /* ── Auto-scroll to bottom on new messages ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ── Focus input when widget opens ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);
  useEffect(() => {
    fetch(`${BACKEND}/health`).catch(() => {});
  }, []);

  useEffect(() => {
    const handleArticleContext = (event) => {
      setArticleContext(event.detail || null);
    };

    window.addEventListener("portfolio:article-context", handleArticleContext);

    return () => {
      window.removeEventListener("portfolio:article-context", handleArticleContext);
    };
  }, []);
  const handleScrollNotify = useCallback(() => {
    // Removed: patronising popup on scroll was annoying and added no value
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollNotify, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollNotify);
    };
  }, [handleScrollNotify]);

  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) {
        clearTimeout(notifyTimeoutRef.current);
      }
    };
  }, []);



  /* ── Format timestamp ── */
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const buildArticleAwareMessage = (question) => {
    if (articleContext) {
      return `You are Manish's article assistant. The user is reading a blog article and is asking about it.

Article title:
${articleContext.title}

Article summary:
${articleContext.summary}

Article content:
${articleContext.body}

User question:
${question}

Answer using the article context first. Be clear, practical, and technical when needed. If the question is outside the article, briefly say that and answer as Manish's blog assistant.`;
    }

    if (isBlogRoute) {
      return `You are Manish's blog assistant. Help the user explore blog topics, article ideas, technical writing, AI notes, code explanations, and learning paths.

User question:
${question}`;
    }

    return question;
  };

  /* ── Send message to backend ── */
  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed, time: new Date() }]);
    setInput("");
    setIsLoading(true);
    setHasInteracted(true);
    setShowSuggestions(false);  // hide suggestions once user sends
    setHasShownWakeup(true);

    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: buildArticleAwareMessage(trimmed),
          history: messages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply, sources: data.sources || [], time: new Date() }]);

      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Could not reach the server. Please try again in a moment.", time: new Date() },
      ]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    externalSendRef.current = handleSend;
  });

  useEffect(() => {
    const handleExternalAsk = (event) => {
      const prompt = event.detail?.prompt?.trim();

      if (!prompt) return;

      setIsOpen(true);
      externalSendRef.current?.(prompt);
    };

    window.addEventListener("portfolio:chat-ask", handleExternalAsk);

    return () => {
      window.removeEventListener("portfolio:chat-ask", handleExternalAsk);
    };
  }, []);

  const handleSuggestedQuestion = (q) => {
    setShowSuggestions(false);
    handleSend(q);
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

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        setIsLoading(true);
        try {
          const res = await fetch(`${BACKEND}/whisper`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("Whisper error");
          const data = await res.json();
          // treat transcript like a typed message
          await handleSend(data.transcript);
        } catch {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: "🎤 Voice transcription failed. Please check your microphone and try again.", time: new Date() },
          ]);
          setIsLoading(false);
        }
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
    setMessages([
      {
        role: "assistant",
        text: getWelcomeMessage(),
        time: new Date(),
      },
    ]);
    setShowSuggestions(true);
    setHasInteracted(false);
  };

  return (
    <div className="cw-root">
      {isOpen && (
        <div className="cw-card" role="dialog" aria-label="Portfolio chat assistant">

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-title">
              <div className="cw-title">Manish AI</div>
              <div className="cw-status-text">
                <span className="cw-dot" /> {assistantStatus.replace('· ', '')}
              </div>
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

          {articleContext && (
            <div className="cw-article-mode">
              <div className="cw-article-mode__label">Article mode</div>
              <div className="cw-article-mode__title">{articleContext.title}</div>
              <div className="cw-article-mode__actions">
                <button type="button" onClick={() => handleSuggestedQuestion("Summarize this article in simple words.")}>
                  Summarize
                </button>
                <button type="button" onClick={() => handleSuggestedQuestion("Give me the key takeaways from this article.")}>
                  Key points
                </button>
                <button type="button" onClick={() => handleSuggestedQuestion("Explain the technical parts of this article like I am a beginner.")}>
                  Explain simply
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="cw-messages" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`cw-msg-row cw-msg-row--${m.role}`}>
                <div className="cw-msg-col">
                  <div className={`cw-bubble cw-bubble--${m.role}`}>
                    <ChatMessage role={m.role} text={m.text} sources={m.sources} />
                  </div>
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

            {/* Suggested questions — shown only before user interacts */}
            {showSuggestions && !isLoading && !isRecording && (
              <div className="cw-suggestions">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    className="cw-suggestion-chip"
                    onClick={() => handleSuggestedQuestion(q)}
                    type="button"
                  >
                    {q}
                  </button>
                ))}
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