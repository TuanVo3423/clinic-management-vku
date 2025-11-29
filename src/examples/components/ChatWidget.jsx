import React, { useState, useRef, useEffect } from "react";
import "../css/style.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [{ id: Date.now(), from: "bot", text: "Chào bạn! Tôi có thể giúp gì hôm nay?", status: "sent" }];
    } catch (e) {
      console.warn("Could not load chat history", e);
      return [{ id: Date.now(), from: "bot", text: "Chào bạn! Tôi có thể giúp gì hôm nay?", status: "sent" }];
    }
  });

  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimers = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history", e);
    }
  }, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const scrollToBottom = () => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const typeText = (id, fullText, speed = 24) =>
    new Promise((resolve) => {
      if (typingTimers.current[id]) clearInterval(typingTimers.current[id]);
      if (inputRef.current) inputRef.current.blur();
      let i = 0;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: "", status: "typing" } : m)));
      typingTimers.current[id] = setInterval(() => {
        i += 1;
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: fullText.slice(0, i) } : m)));
        scrollToBottom();
        if (i >= fullText.length) {
          clearInterval(typingTimers.current[id]);
          typingTimers.current[id] = null;
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "sent" } : m)));
          resolve();
        }
      }, speed);
    });

  const send = async () => {
    const raw = text.trim();
    if (!raw) return;

    const userId = Date.now();
    const userMsg = { id: userId, from: "user", text: raw, status: "sent" };
    setMessages((m) => [...m, userMsg]);
    setText("");
    scrollToBottom();

    const botId = Date.now() + 1;
    const botPlaceholder = { id: botId, from: "bot", text: "Đang nghĩ...", status: "thinking", suggestions: [] };
    setMessages((m) => [...m, botPlaceholder]);
    scrollToBottom();

    try {
      const res = await fetch("http://localhost:3000/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw }),
      });

      if (!res.ok) {
        const errText = res.status === 404 ? "Chatbot service không tìm thấy (404)" : `Lỗi server: ${res.status}`;
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: errText, status: "sent" } : m)));
        return;
      }

      const data = await res.json();
      console.log("Chatbot API response:", data);
      const botMessage = data.data?.response?.message || "Xin lỗi, tôi không hiểu yêu cầu.";
      const services = data.data?.response?.services || data.service || data.services || [];

      await typeText(botId, botMessage, 24);

      if (Array.isArray(services) && services.length > 0) {
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, suggestions: services } : m)));
      }
      scrollToBottom();
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: "Lỗi mạng. Vui lòng thử lại.", status: "sent" } : m)));
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") send();
  };

  const handleSuggestionClick = (svc) => {
    try {
      localStorage.setItem("selectedServiceFromChat", JSON.stringify(svc));
    } catch (e) {
      console.warn("Could not store selected service", e);
    }
    window.location.href = "/scheduler";
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
        <div className="chat-icon" aria-hidden>
          💬
        </div>
        <div className="chat-label">Chat</div>
      </button>

      <div id="chat-panel" className="chat-panel" role="dialog" aria-hidden={!open}>
        <div className="chat-header">
          <div className="chat-title">Hỗ trợ trực tuyến</div>
          <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Đóng chat">
            ✕
          </button>
        </div>

        <div className="chat-messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.from}`}>
              <div className="msg-content">
                {m.from === "bot" && m.status === "thinking" ? (
                  <div className="bot-thinking" aria-hidden>
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <span>{m.text}</span>
                )}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="suggestions">
                    {m.suggestions.map((s) => {
                      const displayName = s.serviceName || s.name || s.title || "Dịch vụ";
                      const key = `${m.id}-svc-${s._id || s.id || displayName.replace(/\s+/g, "_")}`;
                      return (
                        <button type="button" key={key} className="suggestion-btn" onClick={() => handleSuggestionClick(s)}>
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Gõ bệnh lý của bạn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Nội dung tin nhắn"
          />
          <button type="button" className="send-btn" onClick={send}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
