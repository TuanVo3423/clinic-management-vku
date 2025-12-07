/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
const API_BASE = "http://localhost:3000";

function OtpInput({ length = 6, value = "", onChange }) {
  const refs = useRef([]);

  useEffect(() => {
    const firstEmpty = value.split("").findIndex((c) => !c);
    const idx =
      firstEmpty === -1 ? Math.min(value.length, length - 1) : firstEmpty;
    refs.current[idx] && refs.current[idx].focus();
  }, [value, length]);

  const handleChange = (idx, e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 1);
    const chars = value.split("");
    chars[idx] = v || "";
    onChange(chars.join(""));
    if (v && idx < length - 1) refs.current[idx + 1].focus();
  };

  const handleKey = (idx, e) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0)
      refs.current[idx - 1].focus();
    if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1].focus();
    if (e.key === "ArrowRight" && idx < length - 1)
      refs.current[idx + 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(paste);
  };

  return (
    <div className="flex gap-2 my-4 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="w-12 h-12 text-center border-2 rounded-xl text-xl font-semibold focus:ring-2 focus:ring-blue-500"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function AuthPatientModal({ visible, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState("form");
  const [loginData, setLoginData] = useState({ phone: "", email: "" });

  const [loginPhone, setLoginPhone] = useState("");

  const [reg, setReg] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
  });

  const [otp, setOtp] = useState("");
  const [tempPayload, setTempPayload] = useState(null);
  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setActiveTab("login");
      setStep("form");
      setLoginPhone("");
      setReg({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
      });
      setOtp("");
      setTempPayload(null);
      setTimer(0);
      setError("");
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    let sid;
    if (timer > 0) {
      sid = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => sid && clearInterval(sid);
  }, [timer]);

  useEffect(() => {
    if (step === "otp" && containerRef.current) {
      const el = containerRef.current.querySelector(".otp-input");
      el && el.focus();
    }
  }, [step]);

  const startTimer = (sec = 60) => setTimer(sec);

  const postJson = async (path, body) => {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  };

  const handleLoginStart = async () => {
    setError("");
    if (!loginPhone || !/^\d{9,11}$/.test(loginPhone)) {
      setError("Số điện thoại không hợp lệ (9-11 chữ số).");
      return;
    }
    setLoading(true);
    try {
      const res = await postJson("/patients/login", { phone: loginPhone });

      setLoginData({
        phone: loginPhone,
        email: res?.data?.email || res?.data?.data?.email || "",
      });

      setTempPayload({
        phone: loginPhone,
        email: res?.data?.email || res?.data?.data?.email || "",
      });
      setStep("otp");
      startTimer(60);
      message.success("Đã gửi mã OTP!");
    } catch (err) {
      console.error("login start err", err);
      setError(err?.message || "Gửi OTP thất bại.");
      message.error(err?.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginComplete = async () => {
    setError("");
    if (otp.length < 6) {
      setError("Nhập mã OTP 6 chữ số");
      return;
    }
    setLoading(true);
    try {
      const data = await postJson("/patients/complete-login", {
        phone: tempPayload.phone,
        email: loginData.email,
        code: otp,
      });
      const patient = data.patient || data;
      localStorage.setItem("patientInfo", JSON.stringify(patient));
      message.success("Đăng nhập thành công!");
      onSuccess && onSuccess(patient);
      onClose && onClose();
      window.location.reload();
    } catch (err) {
      console.error("complete login err", err);
      message.success("Xác thự OTP thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER flow
  const handleRegisterStart = async () => {
    setError("");
    // basic validation
    if (!reg.fullName) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!reg.phone || !/^\d{9,11}$/.test(reg.phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    if (reg.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(reg.email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!reg.dateOfBirth) {
      setError("Vui lòng chọn ngày sinh");
      return;
    }

    setLoading(true);
    try {
      await postJson("/patients/register", { ...reg });
      setTempPayload({ ...reg });
      setStep("otp");
      startTimer(60);
      message.success("Đã gửi OTP để đăng ký!");
    } catch (err) {
      console.error("register start err", err);
      setError(err?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterComplete = async () => {
    setError("");
    if (otp.length < 6) {
      setError("Nhập mã OTP 6 chữ số");
      return;
    }
    setLoading(true);
    try {
      const body = { ...tempPayload, code: otp };
      const data = await postJson("/patients/complete-register", body);
      const patient = data.patient || data;
      localStorage.setItem("patientInfo", JSON.stringify(patient));
      onSuccess && onSuccess(patient);
      onClose && onClose();
      window.location.reload();
      message.success("Đăng ký thành công!");
    } catch (err) {
      console.error("complete register err", err);
      setError(err?.message || "Xác thực OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    setLoading(true);
    try {
      if (activeTab === "login") {
        await postJson("/patients/login", { phone: tempPayload.phone });
      } else {
        await postJson("/patients/register", { ...tempPayload });
      }
      startTimer(60);
      message.success("Đã gửi lại OTP!");
    } catch (err) {
      console.error("resend err", err);
      setError("Gửi lại OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="auth-overlay">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[2000]"
        aria-hidden={false}
      >
        <div
          ref={containerRef}
          className="relative w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Health<span className="text-blue-600">Care</span>
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-red-500">
              ✕
            </button>
          </div>

          <div className="relative flex mx-auto w-[260px] bg-gray-200 rounded-full mt-4 p-1">
            <button
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                activeTab === "login"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("login");
                setStep("form");
                setError("");
                setOtp("");
              }}
            >
              Đăng nhập
            </button>
            <button
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                activeTab === "register"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("register");
                setStep("form");
                setError("");
                setOtp("");
              }}
            >
              Đăng ký
            </button>
            <div className={`pill-slider ${activeTab}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              {step === "form" && activeTab === "login" && (
                <div>
                  <h3 className="text-xl font-bold mb-1">Đăng nhập</h3>
                  <p className="text-gray-600 mb-3">
                    Nhập số điện thoại để nhận mã OTP
                  </p>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                  />
                  {error && <div className="text-red-500 mt-2">{error}</div>}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 rounded-xl border"
                      onClick={onClose}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleLoginStart}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Gửi OTP"}
                    </button>
                  </div>
                </div>
              )}

              {step === "otp" && activeTab === "login" && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Xác thực OTP</h3>
                  <p className="text-gray-600">
                    Nhập mã 6 chữ số được gửi tới {tempPayload?.phone}
                  </p>

                  <OtpInput length={6} value={otp} onChange={setOtp} />

                  {error && <div className="text-red-500 mt-2">{error}</div>}

                  <div className="flex justify-between mt-4">
                    <button
                      className="text-gray-600"
                      onClick={() => {
                        setStep("form");
                        setOtp("");
                        setError("");
                      }}
                    >
                      ← Trở lại
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleLoginComplete}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50"
                        disabled={loading || otp.length < 6}
                      >
                        {loading ? "Xử lý..." : "Xác thực"}
                      </button>

                      <button
                        onClick={handleResend}
                        className="text-blue-600"
                        disabled={timer > 0}
                      >
                        {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại mã"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === "form" && activeTab === "register" && (
                <div>
                  <h3 className="text-xl font-bold mb-1">Tạo tài khoản mới</h3>
                  <p className="text-gray-600 mb-3">
                    Nhanh chóng — An toàn — Tiện lợi
                  </p>

                  <div className="grid gap-3 mt-3">
                    <input
                      placeholder="Họ và tên"
                      className="p-3 border rounded-xl shadow-sm"
                      value={reg.fullName}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, fullName: e.target.value }))
                      }
                    />
                    <input
                      placeholder="Email (tuỳ chọn)"
                      className="p-3 border rounded-xl shadow-sm"
                      value={reg.email}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, email: e.target.value }))
                      }
                    />
                    <input
                      placeholder="Số điện thoại"
                      className="p-3 border rounded-xl shadow-sm"
                      value={reg.phone}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, phone: e.target.value }))
                      }
                    />
                    <input
                      type="date"
                      placeholder="Ngày sinh"
                      className="p-3 border rounded-xl shadow-sm"
                      value={reg.dateOfBirth}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, dateOfBirth: e.target.value }))
                      }
                    />
                    <div className="relative">
                      <select
                        className="w-full p-3 pr-10 border rounded-xl shadow-sm appearance-none"
                        value={reg.gender}
                        onChange={(e) =>
                          setReg((s) => ({ ...s, gender: e.target.value }))
                        }
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>

                      {/* Custom Arrow */}
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  {error && <div className="text-red-500 mt-2">{error}</div>}

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 rounded-xl border"
                      onClick={() => {
                        setActiveTab("login");
                        setError("");
                      }}
                    >
                      Đã có tài khoản
                    </button>

                    <button
                      onClick={handleRegisterStart}
                      className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Đăng ký & gửi OTP"}
                    </button>
                  </div>
                </div>
              )}

              {step === "otp" && activeTab === "register" && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Xác thực đăng ký</h3>
                  <p className="text-gray-600">
                    Nhập mã đã gửi tới{" "}
                    {tempPayload?.email || tempPayload?.phone}
                  </p>

                  <OtpInput length={6} value={otp} onChange={setOtp} />

                  {error && <div className="text-red-500 mt-2">{error}</div>}

                  <div className="flex justify-between mt-4">
                    <button
                      className="text-gray-600"
                      onClick={() => {
                        setStep("form");
                        setOtp("");
                        setError("");
                      }}
                    >
                      ← Trở lại
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleRegisterComplete}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50"
                        disabled={loading || otp.length < 6}
                      >
                        {loading ? "Xử lý..." : "Xác thực & Hoàn tất"}
                      </button>

                      <button
                        onClick={handleResend}
                        className="text-blue-600"
                        disabled={timer > 0}
                      >
                        {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại mã"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col justify-center text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-inner">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">
                Chăm sóc sức khoẻ chuyên nghiệp
              </h3>

              <p className="text-gray-600 mb-6">
                Quy trình đặt lịch nhanh — bảo mật — thông tin cá nhân an toàn.
              </p>

              <div className="w-full h-48 bg-blue-200 rounded-2xl animate-pulse mb-6" />

              <p className="mt-2 font-medium text-gray-700">
                {activeTab === "login"
                  ? "Chưa có tài khoản? Đăng ký ngay!"
                  : "Đã có tài khoản? Đăng nhập ngay!"}
              </p>

              <div className="mt-6">
                <a
                  href="/about"
                  className="inline-block px-5 py-2 bg-white/80 rounded-xl shadow hover:bg-white"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthPatientModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};
