import { useState, useRef } from "react";
import JellyVoiceUI from "./JellyVoiceUI";import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Ask me anything about Aryan's portfolio 👋" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const animFrameRef = useRef(null);

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

  const stopRecording = () => {
    cancelAnimationFrame(animFrameRef.current);
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // silence detection
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

        // ── TODO: send blob to your Whisper endpoint ──
        // const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // const formData = new FormData();
        // formData.append("audio", blob, "recording.webm");
        // const res = await fetch("/api/whisper", { method: "POST", body: formData });
        // const { transcript } = await res.json();
        // handleSend(transcript);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "🎤 Voice received! Whisper endpoint not connected yet." },
        ]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Microphone access denied. Please allow mic access." },
      ]);
    }
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
                <span className="cw-typing"><span /><span /><span /></span>
              </div>
            )}
            {isRecording && (
              <div className="cw-bubble cw-bubble--assistant cw-recording-hint">
                <JellyVoiceUI />🎙️ Listening… pause to send
              </div>
            )}
          </div>

          <div className="cw-input-bar">
            <input
              className="cw-input"
              placeholder={isRecording ? "Listening..." : "Ask me anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isRecording}
            />
            <button
              className={`cw-mic ${isRecording ? "cw-mic--active" : ""}`}
              onClick={startRecording}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              🎤
            </button>
            <button
              className="cw-send"
              onClick={() => handleSend(input)}
              disabled={isRecording}
            >
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