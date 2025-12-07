/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/newline-after-import */
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./AuthPatientModal.css";
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
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      refs.current[idx - 1].focus();
    }
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
    <div className="otp-row" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="otp-input"
          inputMode="numeric"
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
    } catch (err) {
      console.error("login start err", err);
      setError(err?.message || "Gửi OTP thất bại.");
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
      onSuccess && onSuccess(patient);
      onClose && onClose();
      window.location.reload();
    } catch (err) {
      console.error("complete login err", err);
      setError(err?.message || "Xác thực OTP thất bại");
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
        className="auth-card glass"
        role="dialog"
        aria-modal="true"
        ref={containerRef}
      >
        <div className="auth-header">
          <div className="brand">
            Health <span>Care</span>
          </div>
          <button
            className="close-btn"
            onClick={() => {
              onClose && onClose();
            }}
            aria-label="Close auth"
          >
            ✕
          </button>
        </div>

        <div className="pill-toggle">
          <button
            className={`pill ${activeTab === "login" ? "active" : ""}`}
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
            className={`pill ${activeTab === "register" ? "active" : ""}`}
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

        <div className={`auth-body ${activeTab} ${step}`}>
          {/* Left: Forms (visible on mobile too) */}
          <div className="panel left-panel">
            {step === "form" && activeTab === "login" && (
              <div className="form">
                <h3 className="title">Đăng nhập</h3>
                <p className="subtitle">Nhập số điện thoại để nhận mã OTP.</p>
                <label className="field">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                  />
                </label>
                {error && <div className="error">{error}</div>}
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      onClose && onClose();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn primary"
                    onClick={handleLoginStart}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi mã OTP"}
                  </button>
                </div>
              </div>
            )}

            {step === "otp" && activeTab === "login" && (
              <div className="form">
                <h3 className="title">Xác thực OTP</h3>
                <p className="subtitle">
                  Nhập mã 6 chữ số được gửi tới {tempPayload?.phone}
                </p>
                <OtpInput length={6} value={otp} onChange={setOtp} />
                {error && <div className="error">{error}</div>}
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setStep("form");
                      setOtp("");
                      setError("");
                    }}
                  >
                    Quay lại
                  </button>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      className="btn primary"
                      onClick={handleLoginComplete}
                      disabled={loading || otp.length < 6}
                    >
                      {loading ? "Xử lý..." : "Xác thực"}
                    </button>
                    <button
                      className="resend"
                      onClick={handleResend}
                      disabled={timer > 0}
                    >
                      {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "form" && activeTab === "register" && (
              <div className="form">
                <h3 className="title">Tạo tài khoản mới</h3>
                <p className="subtitle">Nhanh chóng — An toàn — Tiện lợi</p>
                <label className="field">
                  <input
                    placeholder="Họ và tên"
                    value={reg.fullName}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, fullName: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <input
                    placeholder="Email (tuỳ chọn)"
                    value={reg.email}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <input
                    placeholder="Số điện thoại"
                    value={reg.phone}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, phone: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={reg.dateOfBirth}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, dateOfBirth: e.target.value }))
                    }
                  />
                </label>
                <label className="field select">
                  <select
                    value={reg.gender}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, gender: e.target.value }))
                    }
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                {error && <div className="error">{error}</div>}
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setActiveTab("login");
                      setError("");
                    }}
                  >
                    Đã có tài khoản
                  </button>
                  <button
                    className="btn primary"
                    onClick={handleRegisterStart}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Đăng ký & gửi OTP"}
                  </button>
                </div>
              </div>
            )}

            {step === "otp" && activeTab === "register" && (
              <div className="form">
                <h3 className="title">Xác thực đăng ký</h3>
                <p className="subtitle">
                  Nhập mã đã gửi tới {tempPayload?.email || tempPayload?.phone}
                </p>
                <OtpInput length={6} value={otp} onChange={setOtp} />
                {error && <div className="error">{error}</div>}
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setStep("form");
                      setOtp("");
                      setError("");
                    }}
                  >
                    Quay lại
                  </button>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      className="btn primary"
                      onClick={handleRegisterComplete}
                      disabled={loading || otp.length < 6}
                    >
                      {loading ? "Xử lý..." : "Xác thực & Hoàn tất"}
                    </button>
                    <button
                      className="resend"
                      onClick={handleResend}
                      disabled={timer > 0}
                    >
                      {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right showcase on desktop */}
          <div className="panel right-panel">
            <div className="showcase">
              <div className="show-title">Chăm sóc sức khỏe chuyên nghiệp</div>
              <div className="show-desc">
                Quy trình đặt lịch nhanh — bảo mật OTP — thông tin cá nhân an
                toàn.
              </div>
              <div className="illustration" aria-hidden />
              <div className="cta">
                {activeTab === "login"
                  ? "Chưa có tài khoản? Đăng ký ngay"
                  : "Đã có tài khoản? Đăng nhập"}
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

