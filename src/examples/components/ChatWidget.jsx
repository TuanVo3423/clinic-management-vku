/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import { Modal, Checkbox, Row, Col, Spin, message } from "antd";
import SchedulerComponent from "../pages/Basic/class-based";
import dayjs from "dayjs";
import axios from "axios";

const BOOKING_STEPS = [
  {
    key: "name",
    label: "Họ và tên",
    question: "Trước tiên, bạn hãy nhập Tên của mình nhé:",
    skipIfLoggedIn: true,
  },
  {
    key: "phone",
    label: "Số điện thoại",
    question: "Tiếp theo, vui lòng nhập Số điện thoại liên hệ:",
    skipIfLoggedIn: true,
  },
  {
    key: "note",
    label: "Ghi chú",
    question:
      "Bạn có ghi chú gì thêm về tình trạng bệnh cho bác sĩ không? (Hoặc gõ 'Không')",
  },
  {
    key: "isEmergency",
    label: "Khẩn cấp",
    question: "Tình trạng này có cần cấp cứu khẩn cấp không?",
    type: "yesno",
  },
  {
    key: "time",
    label: "Thời gian khám",
    question: "Bạn muốn đặt lịch khám vào thời gian nào?",
    type: "scheduler",
  },
  {
    key: "confirm",
    label: "Xác nhận",
    question: "Dưới đây là thông tin đặt lịch của bạn. Bạn kiểm tra lại nhé:",
    type: "preview",
  },
];

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

const getPatientInfoFromStorage = () => {
  try {
    const raw = localStorage.getItem("patientInfo");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const patient =
      parsed?.data?.patient || parsed?.patient || parsed?.data || parsed;
    if (!patient || (!patient._id && !patient.id)) return null;

    return {
      id: patient._id || patient.id,
      name: patient.fullName || patient.name,
      phone: patient.phoneNumber || patient.phone,
    };
  } catch (e) {
    return null;
  }
};

export default function ChatWidget() {
  const [currentUser, setCurrentUser] = useState(getPatientInfoFromStorage());

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimers = useRef({});

  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState({});

  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const userKey = `chatMessages_${currentUser.id}`;
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(
          Array.from(new Map(parsed.map((item) => [item.id, item])).values())
        );
      } else {
        setMessages([
          {
            id: generateId(),
            from: "bot",
            text: `Chào ${currentUser.name}! Tôi có thể giúp gì cho bạn hôm nay?`,
            status: "sent",
          },
        ]);
      }
    } catch {
      setMessages([
        {
          id: generateId(),
          from: "bot",
          text: "Chào bạn! Tôi có thể giúp gì hôm nay?",
          status: "sent",
        },
      ]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && messages.length > 0) {
      const userKey = `chatMessages_${currentUser.id}`;
      try {
        localStorage.setItem(userKey, JSON.stringify(messages));
      } catch {}
    }
  }, [messages, currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
        const user = getPatientInfoFromStorage();
        if (user?.id !== currentUser?.id) {
            setCurrentUser(user);
            if (!user) setOpen(false);
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);


  useEffect(() => {
    if (isBooking) console.log("🔄 [DEBUG] BookingData:", bookingData);
  }, [bookingData, isBooking]);

  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open]);

  const scrollToBottom = () => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  if (!currentUser) {
    return null;
  }

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

  const addBotMessage = (text, type = "text", payload = null) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), from: "bot", text, status: "sent", type, payload },
    ]);
    setTimeout(() => scrollToBottom(), 100);
  };

  const fetchAllServices = async () => {
    try {
      setLoadingServices(true);
      const res = await axios.get("http://localhost:3000/services");
      const data = res.data;
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data.data) list = data.data;
      else if (data.services) list = data.services;
      setAllServices(list);
      return list;
    } catch (e) {
      console.error("Lỗi lấy services:", e);
      return [];
    } finally {
      setLoadingServices(false);
    }
  };

  const startBookingFlow = async (suggestedServices) => {
    const suggestions = Array.isArray(suggestedServices)
      ? suggestedServices
      : [suggestedServices];
    const servicesFromApi = await fetchAllServices();

    const initialIds = [];
    suggestions.forEach((s) => {
      const sName = (
        typeof s === "string" ? s : s.serviceName || s.name
      ).toLowerCase();
      const found = servicesFromApi.find((apiS) =>
        apiS.name.toLowerCase().includes(sName)
      );
      if (found) initialIds.push(found._id || found.id);
    });

    setSelectedServiceIds(initialIds);
    setShowServiceModal(true);
  };

  const handleConfirmServices = () => {
    if (selectedServiceIds.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 dịch vụ!");
      return;
    }

    const finalSelectedServices = allServices.filter((s) =>
      selectedServiceIds.includes(s._id || s.id)
    );
    setShowServiceModal(false);

    const userId = generateId();
    const serviceNames = finalSelectedServices.map((s) => s.name).join(", ");
    setMessages((prev) => [
      ...prev,
      {
        id: userId,
        from: "user",
        text: `Tôi chốt đặt: ${serviceNames}`,
        status: "sent",
      },
    ]);

    let initialData = { 
        services: finalSelectedServices,
        name: currentUser.name || "Khách hàng",
        phone: currentUser.phone || "",
        patientId: currentUser.id,
        isLoggedIn: true
    };
    
    let startStep = BOOKING_STEPS.findIndex((step) => !step.skipIfLoggedIn);

    setIsBooking(true);
    setBookingStep(startStep);
    setBookingData(initialData);

    setTimeout(() => {
      const greeting = `Chào ${initialData.name}, mời bạn cung cấp thêm thông tin.`;
      addBotMessage(greeting);
      setTimeout(
        () =>
          addBotMessage(
            BOOKING_STEPS[startStep].question,
            BOOKING_STEPS[startStep].type
          ),
        500
      );
    }, 500);
  };

  const handleBookingInput = (userInput) => {
    const currentConfig = BOOKING_STEPS[bookingStep];
    if (["back", "quay lại"].includes(String(userInput).toLowerCase())) {
      if (bookingStep > 0) {
        let prevIndex = bookingStep - 1;
        if (bookingData.isLoggedIn) {
          while (prevIndex >= 0 && BOOKING_STEPS[prevIndex].skipIfLoggedIn)
            prevIndex--;
        }
        if (prevIndex >= 0) {
          setBookingStep(prevIndex);
          addBotMessage(
            `Đã quay lại. ${BOOKING_STEPS[prevIndex].question}`,
            BOOKING_STEPS[prevIndex].type
          );
        } else {
          setIsBooking(false);
          addBotMessage("Đã hủy đặt lịch.");
        }
      } else {
        setIsBooking(false);
        addBotMessage("Đã hủy đặt lịch.");
      }
      return;
    }

    const newData = { ...bookingData, [currentConfig.key]: userInput };
    setBookingData(newData);

    let nextStep = bookingStep + 1;
    if (bookingData.isLoggedIn) {
      while (
        nextStep < BOOKING_STEPS.length &&
        BOOKING_STEPS[nextStep].skipIfLoggedIn
      )
        nextStep++;
    }

    if (nextStep < BOOKING_STEPS.length) {
      setBookingStep(nextStep);
      const nextConfig = BOOKING_STEPS[nextStep];

      if (nextConfig.type === "scheduler")
        addBotMessage(nextConfig.question, "scheduler-trigger");
      else if (nextConfig.type === "preview")
        addBotMessage(nextConfig.question, "preview", newData);
      else if (nextConfig.type === "yesno")
        addBotMessage(nextConfig.question, "yesno");
      else addBotMessage(nextConfig.question);
    }
  };

  const handleSchedulerSelect = (slotData) => {
    setShowSchedulerModal(false);
    const timeDisplay = `${dayjs(slotData.start).format(
      "HH:mm DD/MM"
    )} - ${dayjs(slotData.end).format("HH:mm DD/MM")}`;

    let pid = bookingData.patientId || currentUser?.id;

    const updatedData = {
      ...bookingData,
      time: timeDisplay,
      rawTime: slotData,
      doctorName: slotData.resourceName,
      patientId: pid,
    };

    setBookingData(updatedData);
    addBotMessage(`Đã chọn: ${timeDisplay}`);

    const confirmIndex = BOOKING_STEPS.findIndex((s) => s.key === "confirm");
    setBookingStep(confirmIndex);
    addBotMessage(BOOKING_STEPS[confirmIndex].question, "preview", updatedData);
  };

  const handleFinalSubmit = async (payloadFromMessage, messageId) => {
    addBotMessage("Đang tạo lịch hẹn...", "thinking");
    const data = payloadFromMessage || bookingData;

    try {
      const selectedServices = Array.isArray(data.services)
        ? data.services
        : [];
      const serviceIds = selectedServices.map((s) => s._id || s.id);

      let pid = data.patientId || currentUser?.id;

      if (!pid) {
        throw new Error("Vui lòng đăng nhập lại để xác nhận.");
      }
      
      const payload = {
        bedId: data.rawTime?.resourceId,
        patientId: pid,
        serviceIds: serviceIds,
        appointmentDate: dayjs(data.rawTime?.start).format("YYYY-MM-DD"),
        appointmentStartTime: dayjs(data.rawTime?.start).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        appointmentEndTime: dayjs(data.rawTime?.end).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        note: data.note || "",
        isEmergency: data.isEmergency === true || data.isEmergency === "Có",
        createdBy: "patient",
      };

      console.log("🚀 [DEBUG] FINAL PAYLOAD:", payload);

      const res = await axios.post(
        "http://localhost:3000/appointments",
        payload
      );
      console.log("✅ [DEBUG] SUCCESS:", res.data);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, isBooked: true } : msg
        )
      );

      setTimeout(() => {
        addBotMessage("✅ Đặt lịch thành công! Cảm ơn bạn.");
        setIsBooking(false);
        setBookingData({});
        setBookingStep(0);
      }, 1500);
    } catch (e) {
      console.error("❌ Lỗi submit:", e);
      let msg = e.response?.data?.message || e.message;
      if (msg.includes("Patient not found")) {
        msg = "Không tìm thấy hồ sơ. Vui lòng đăng xuất và đăng nhập lại.";
      }
      addBotMessage(`Lỗi: ${msg}`);
    }
  };

  const send = async () => {
    const raw = text.trim();
    if (!raw) return;
    const userId = generateId();
    setMessages((m) => [
      ...m,
      { id: userId, from: "user", text: raw, status: "sent" },
    ]);
    setText("");

    if (isBooking) {
      handleBookingInput(raw);
      return;
    }

    const botId = generateId();
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

    setTimeout(() => scrollToBottom(), 50);

    try {
      const res = await axios.post("http://localhost:3000/chatbot/chat", {
        message: raw,
      });
      const data = res.data;
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
          m.id === botId ? { ...m, text: "Lỗi mạng.", status: "sent" } : m
        )
      );
    }
  };

  const handleKey = (e) => e.key === "Enter" && send();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl flex items-center justify-center text-4xl hover:scale-110 transition-transform z-50"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 w-[410px] h-[600px] bg-emerald-50/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col border border-emerald-200 animate-[fadeInUp_.25s_ease] z-50">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-4 flex justify-between items-center shadow">
            <div className="font-semibold text-xl flex gap-3 items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png"
                className="w-10 h-10 rounded-full shadow"
                alt="bot"
              />{" "}
              Trợ lý ảo
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-2xl hover:opacity-80"
            >
              ✕
            </button>
          </div>

          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-emerald-50/70 to-white"
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
                    className={`rounded-2xl px-4 py-3 shadow ${
                      m.from === "user"
                        ? "bg-emerald-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-emerald-100"
                    }`}
                  >
                    {m.status === "thinking" ? (
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-150" />
                        <span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-300" />
                      </div>
                    ) : (
                      <span className="leading-relaxed">{m.text}</span>
                    )}

                    {m.suggestions?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-col gap-1 mb-2">
                          {m.suggestions.map((s, i) => (
                            <div
                              key={i}
                              className="bg-emerald-5 text-emerald-800 text-xs px-2 py-1.5 rounded border border-emerald-100 flex items-center"
                            >
                              <span className="mr-1">🔹</span>{" "}
                              {s.serviceName || s.name || "Dịch vụ"}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => startBookingFlow(m.suggestions)}
                          className="block w-full bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                        >
                          📅 Đặt lịch ngay
                        </button>
                      </div>
                    )}

                    {m.type === "scheduler-trigger" && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowSchedulerModal(true)}
                          className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                        >
                          📅 Chọn lịch ngay
                        </button>
                      </div>
                    )}

                    {m.type === "yesno" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleBookingInput("Có")}
                          className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200 border border-red-200"
                        >
                          🚨 Có
                        </button>
                        <button
                          onClick={() => handleBookingInput("Không")}
                          className="flex-1 bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 border border-emerald-200"
                        >
                          Bình thường
                        </button>
                      </div>
                    )}

                    {m.type === "preview" && m.payload && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm space-y-1">
                        <div>
                          <strong className="text-emerald-700">
                            Dịch vụ ({m.payload.services?.length}):
                          </strong>
                          <ul className="list-disc pl-4 mt-1 text-gray-700 text-xs">
                            {(m.payload.services || []).map((s, i) => (
                              <li key={i}>{s.name || s.serviceName}</li>
                            ))}
                          </ul>
                        </div>
                        <p>
                          <strong className="text-emerald-700">Khách:</strong>{" "}
                          {m.payload.name}
                        </p>
                        <p>
                          <strong className="text-emerald-700">SĐT:</strong>{" "}
                          {m.payload.phone}
                        </p>
                        <p>
                          <strong className="text-emerald-700">Ghi chú:</strong>{" "}
                          {m.payload.note || "Không"}
                        </p>
                        <p>
                          <strong className="text-emerald-700">
                            Khẩn cấp:
                          </strong>{" "}
                          {m.payload.isEmergency ? "🚨 CÓ" : "Không"}
                        </p>
                        <p>
                          <strong className="text-emerald-700">Giờ:</strong>{" "}
                          {m.payload.time}
                        </p>

                        {m.isBooked ? (
                          <div className="mt-3 p-2 bg-green-100 text-green-700 font-bold text-center rounded border border-green-200">
                            ✅ Đã đặt lịch thành công
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleFinalSubmit(m.payload, m.id)}
                              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 shadow"
                            >
                              Chốt đơn
                            </button>
                            <button
                              onClick={() => handleBookingInput("back")}
                              className="px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                            >
                              Sửa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t relative">
            {isBooking && bookingStep > 0 && (
              <button
                onClick={() => handleBookingInput("back")}
                className="absolute -top-8 left-6 bg-gray-600/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs hover:bg-gray-700 transition flex items-center gap-1 shadow-sm"
              >
                ⬅ Quay lại
              </button>
            )}
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                disabled={
                  isBooking &&
                  (BOOKING_STEPS[bookingStep]?.type === "scheduler" ||
                    BOOKING_STEPS[bookingStep]?.type === "yesno")
                }
                className="flex-1 px-4 py-3 bg-emerald-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                placeholder={
                  isBooking ? "Nhập thông tin..." : "Nhập tin nhắn..."
                }
              />
              <button
                onClick={send}
                className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-sm transition"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        title={
          <div className="text-emerald-700 font-bold text-lg">
            📅 Chọn khung giờ khám
          </div>
        }
        open={showSchedulerModal}
        onCancel={() => setShowSchedulerModal(false)}
        width={1100}
        footer={null}
        style={{ top: 20 }}
        zIndex={1000}
      >
        {showSchedulerModal && (
          <div className="h-[600px] overflow-hidden rounded-lg border border-gray-200">
            <SchedulerComponent
              isPickerMode={true}
              onSlotSelect={handleSchedulerSelect}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Chọn dịch vụ khám"
        open={showServiceModal}
        onCancel={() => setShowServiceModal(false)}
        onOk={handleConfirmServices}
        okText="Tiếp tục"
        cancelText="Hủy"
        centered
      >
        {loadingServices ? (
          <div className="text-center py-5">
            <Spin />
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Checkbox.Group
              style={{ width: "100%" }}
              value={selectedServiceIds}
              onChange={(vals) => setSelectedServiceIds(vals)}
            >
              <Row gutter={[0, 10]}>
                {allServices.map((s) => (
                  <Col span={24} key={s._id}>
                    <Checkbox value={s._id} className="text-base">
                      {s.name}{" "}
                      <span className="text-gray-500 text-xs">
                        ({s.price?.toLocaleString()}đ)
                      </span>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
        )}
      </Modal>
    </>
  );
}