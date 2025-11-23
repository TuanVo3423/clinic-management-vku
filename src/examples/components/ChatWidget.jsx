import React, { useState, useRef, useEffect } from "react";
import "../css/style.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { id: Date.now(), from: "bot", text: "Chào bạn! Tôi có thể giúp gì hôm nay?" },
  ]);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = () => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: "Cảm ơn bạn, chúng tôi đã nhận được tin nhắn." },
      ]);
    }, 700);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        <div className="chat-icon" aria-hidden>💬</div>
        <div className="chat-label">Chat</div>
      </button>

      <div id="chat-panel" className="chat-panel" role="dialog" aria-hidden={!open}>
        <div className="chat-header">
          <div className="chat-title">Hỗ trợ trực tuyến</div>
          <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Đóng chat">✕</button>
        </div>

        <div className="chat-messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.from}`}>
              <div className="msg-content">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Gõ tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Nội dung tin nhắn"
          />
          <button type="button" className="send-btn" onClick={send}>Gửi</button>
        </div>
      </div>
    </div>
  );
}
