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

export default function AuthPatientModal({ visible, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginPhone, setLoginPhone] = useState("");

  const [reg, setReg] = useState({
    fullName: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setActiveTab("login");
      setLoginPhone("");
      setReg({
        fullName: "",
        phone: ""
      });
      setError("");
      setLoading(false);
    }
  }, [visible]);

  const startTimer = (sec = 60) => setTimer(sec);

  const postJson = async (path, body) => {
    const res = await fetch(process.env.REACT_APP_BASE_BE_URL + path, {
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
      const data = await postJson("/patients/login", { phone: loginPhone });
      const patient = data.data?.patient || data.patient || data;
      localStorage.setItem("patientInfo", JSON.stringify(patient));
      message.success("Đăng nhập thành công!");
      onSuccess && onSuccess(patient);
      onClose && onClose();
      window.location.reload();
    } catch (err) {
      console.error("login err", err);
      setError(err?.message || "Đăng nhập thất bại.");
      message.error(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER flow - Simplified without OTP
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

    setLoading(true);
    try {
      const data = await postJson("/patients/register", { ...reg });
      const patient = data.data?.patient || data.patient || data;
      localStorage.setItem("patientInfo", JSON.stringify(patient));
      message.success("Đăng ký thành công!");
      onSuccess && onSuccess(patient);
      onClose && onClose();
      window.location.reload();
    } catch (err) {
      console.error("register err", err);
      setError(err?.message || "Đăng ký thất bại");
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
              Health<span className="text-emerald-500">Care</span>
            </h2>
            <button onClick={onClose} className="text-2xl hover:text-red-500">
              ✕
            </button>
          </div>

          <div className="relative flex mx-auto w-[260px] bg-gray-200 rounded-full mt-4 p-1">
            <button
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                activeTab === "login"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("login");
                setError("");
                setLoginPhone("");
              }}
            >
              Đăng nhập
            </button>
            <button
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                activeTab === "register"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
            >
              Đăng ký
            </button>
            <div className={`pill-slider ${activeTab}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              {activeTab === "login" && (
                <div>
                  <h3 className="text-xl font-bold mb-1">Đăng nhập</h3>
                  <p className="text-gray-600 mb-3">
                    Nhập số điện thoại để đăng nhập
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
                      className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow-xl disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "register" && (
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
                      placeholder="Số điện thoại"
                      className="p-3 border rounded-xl shadow-sm"
                      value={reg.phone}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, phone: e.target.value }))
                      }
                    />
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
                      className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow-xl disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col justify-center text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-inner">
              <h3 className="text-2xl font-bold mb-4 text-emerald-500">
                Chăm sóc sức khoẻ chuyên nghiệp
              </h3>

              <p className="text-gray-600 mb-6">
                Quy trình đặt lịch nhanh — bảo mật — thông tin cá nhân an toàn.
              </p>

              <div className="w-full h-48 bg-emerald-200 rounded-2xl animate-pulse mb-6" />

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
