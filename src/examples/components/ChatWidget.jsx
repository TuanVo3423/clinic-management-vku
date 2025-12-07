/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: Date.now(),
              from: "bot",
              text: "Chào bạn! Tôi có thể giúp gì hôm nay?",
              status: "sent",
            },
          ];
    } catch {
      return [
        {
          id: Date.now(),
          from: "bot",
          text: "Chào bạn! Tôi có thể giúp gì hôm nay?",
          status: "sent",
        },
      ];
    }
  });

  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimers = useRef({});

  useEffect(() => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const scrollToBottom = () => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const typeText = (id, fullText, speed = 24) =>
    new Promise((resolve) => {
      if (typingTimers.current[id]) clearInterval(typingTimers.current[id]);
      if (inputRef.current) inputRef.current.blur();
      let i = 0;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, text: "", status: "typing" } : m
        )
      );

      typingTimers.current[id] = setInterval(() => {
        i += 1;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, text: fullText.slice(0, i) } : m
          )
        );

        scrollToBottom();

        if (i >= fullText.length) {
          clearInterval(typingTimers.current[id]);
          typingTimers.current[id] = null;

          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "sent" } : m))
          );

          resolve();
        }
      }, speed);
    });

  const send = async () => {
    const raw = text.trim();
    if (!raw) return;

    const userId = Date.now();

    setMessages((m) => [
      ...m,
      { id: userId, from: "user", text: raw, status: "sent" },
    ]);
    setText("");

    const botId = Date.now() + 1;
    setMessages((m) => [
      ...m,
      {
        id: botId,
        from: "bot",
        text: "Đang nghĩ...",
        status: "thinking",
        suggestions: [],
      },
    ]);
    scrollToBottom();

    try {
      const res = await fetch("http://localhost:3000/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw }),
      });

      if (!res.ok) {
        const msg =
          res.status === 404
            ? "Chatbot service không tìm thấy (404)"
            : `Lỗi server: ${res.status}`;
        setMessages((p) =>
          p.map((m) => (m.id === botId ? { ...m, text: msg } : m))
        );
        return;
      }

      const data = await res.json();
      const botMessage =
        data.data?.response?.message || "Xin lỗi, tôi không hiểu yêu cầu.";
      const services =
        data.data?.response?.services || data.service || data.services || [];

      await typeText(botId, botMessage, 24);

      if (Array.isArray(services) && services.length > 0) {
        setMessages((p) =>
          p.map((m) => (m.id === botId ? { ...m, suggestions: services } : m))
        );
      }
    } catch {
      setMessages((p) =>
        p.map((m) =>
          m.id === botId ? { ...m, text: "Lỗi mạng. Vui lòng thử lại." } : m
        )
      );
    }
  };

  const handleKey = (e) => e.key === "Enter" && send();

  const handleSuggestionClick = (svc) => {
    localStorage.setItem("selectedServiceFromChat", JSON.stringify(svc));
    window.location.href = "/scheduler";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6 w-16 h-16 rounded-full
          bg-gradient-to-br from-blue-600 to-indigo-500
          text-white shadow-xl flex items-center justify-center
          text-4xl hover:scale-110 transition-transform z-50
        "
      >
        🤖
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="
            fixed bottom-6 right-6 w-[410px] h-[600px]
            bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl
            overflow-hidden flex flex-col border border-blue-200
            animate-[fadeInUp_.25s_ease] z-50
          "
        >
          {/* Header */}
          <div
            className="
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white px-5 py-4 flex justify-between items-center shadow-md
          "
          >
            <div className="font-semibold text-xl flex gap-3 items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png"
                className="w-9 h-9 rounded-full shadow-md"
                alt="bot"
              />
              Trợ lý ảo
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-2xl hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="
              flex-1 overflow-y-auto p-5 space-y-4
              bg-gradient-to-b from-blue-50/50 to-white
            "
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex gap-3 max-w-[85%]">
                  {m.from === "bot" && (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png"
                      className="w-8 h-8 rounded-full shadow"
                      alt="bot"
                    />
                  )}

                  <div
                    className={`
                      rounded-2xl px-4 py-3 shadow
                      ${
                        m.from === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }
                    `}
                  >
                    {m.status === "thinking" ? (
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                      </div>
                    ) : (
                      <span className="leading-relaxed">{m.text}</span>
                    )}

                    {/* Suggestions */}
                    {m.suggestions?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {m.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            className="
                              block w-full text-left bg-blue-100 hover:bg-blue-200
                              px-3 py-2 rounded-lg text-sm font-medium transition
                            "
                          >
                            {s.serviceName || s.name || "Dịch vụ"}
                          </button>
                        ))}

                        <button
                          onClick={() => handleSuggestionClick({})}
                          className="
                            block w-full bg-blue-600 text-white px-4 py-2
                            rounded-lg text-sm font-semibold hover:bg-blue-700
                          "
                        >
                          Đặt lịch ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t flex items-center gap-3">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              className="
                flex-1 px-4 py-3 bg-gray-100 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-sm
              "
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={send}
              className="
                px-5 py-3 bg-blue-600 text-white rounded-xl
                font-semibold hover:bg-blue-700 shadow-sm
              "
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
