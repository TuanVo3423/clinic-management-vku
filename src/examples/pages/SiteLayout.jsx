/* eslint-disable */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-render-return-value */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-set-state */
import React, { useEffect, useState } from "react";
import "./styles.css";
import ChatWidget from "../components/ChatWidget";
import AuthPatientModal from "../../components/AuthPatientmModal";
import HeroSlider from "../components/HeroSlider";

export default function SiteLayout({ children, headerClassName }) {
  const [patient, setPatient] = useState(
    JSON.parse(localStorage.getItem("patientInfo")) || null
  );
  const [authModalVisible, setAuthModalVisible] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientInfo"));
    if (stored) setPatient(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patientInfo");
    setPatient(null);
    window.location.reload();
  };

  return (
    <div
      className="site-layout"
      style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-emerald-100/70 backdrop-blur-xl shadow-md border-b border-emerald-200/60">
        <nav className="w-full px-4 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-emerald-800">
              Health<span className="text-emerald-600">Care</span>
            </a>
          </div>

          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex items-center gap-2 text-emerald-800 font-medium">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Giới thiệu", href: "/about" },
                { label: "Dịch vụ", href: "/scheduler" },
                { label: "Tin tức", href: "/blog" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="px-4 py-2 rounded-lg hover:bg-emerald-200 transition whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            {patient ? (
              <>
                <span className="hidden md:inline text-emerald-900 text-sm whitespace-nowrap mr-1">
                  Xin chào, <b>{patient.fullName}</b>
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="hidden md:flex w-9 h-9 rounded-full bg-rose-500 items-center justify-center 
              text-white hover:bg-rose-600 transition"
                >
                  <i className="ri-logout-box-r-line text-lg" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalVisible(true)}
                className="hidden md:block px-4 py-2 rounded-lg bg-emerald-600 text-white 
            hover:bg-emerald-700 transition"
              >
                Đăng nhập
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden text-3xl text-emerald-900"
              onClick={() =>
                document.querySelector(".mobile-menu")?.classList.toggle("open")
              }
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className="mobile-menu hidden flex-col gap-3 px-6 pb-4 md:hidden
      bg-emerald-100/90 backdrop-blur-xl border-t border-emerald-200/60 transition-all"
        >
          <a href="/" className="py-2 text-emerald-900">
            Trang chủ
          </a>
          <a href="/about" className="py-2 text-emerald-900">
            Giới thiệu
          </a>
          <a href="/scheduler" className="py-2 text-emerald-900">
            Dịch vụ
          </a>
          <a href="/blog" className="py-2 text-emerald-900">
            Tin tức
          </a>

          <div className="h-px bg-emerald-300/40 my-1" />

          {/* Chỉ hiển thị ở mobile */}
          {patient ? (
            <>
              <div className="text-emerald-900">
                {patient.fullName}
              </div>

              <button
                className="px-4 py-2 rounded-lg bg-rose-500 text-white"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
              onClick={() => setAuthModalVisible(true)}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      <HeroSlider />

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="bg-emerald-100/60 border-t border-emerald-200/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-emerald-900">
          {/* Logo + intro */}
          <div>
            <h3 className="text-3xl font-bold text-emerald-800">
              Health <span className="text-emerald-600">Care</span>
            </h3>
            <p className="mt-4 leading-relaxed text-emerald-700">
              Chúng tôi vinh dự được đồng hành cùng bạn trên hành trình chăm sóc
              sức khỏe, cam kết mang đến sự tận tâm và chất lượng dịch vụ hàng
              đầu.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-emerald-800">
              Về chúng tôi
            </h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="hover:text-emerald-900 cursor-pointer">
                Trang chủ
              </li>
              <li className="hover:text-emerald-900 cursor-pointer">
                Giới thiệu
              </li>
              <li className="hover:text-emerald-900 cursor-pointer">
                Tuyển dụng
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-emerald-800">
              Dịch vụ & Hỗ trợ
            </h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="hover:text-emerald-900 cursor-pointer">
                Điều khoản tìm kiếm
              </li>
              <li className="hover:text-emerald-900 cursor-pointer">
                Tìm kiếm nâng cao
              </li>
              <li className="hover:text-emerald-900 cursor-pointer">
                Chính sách bảo mật
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-emerald-800">
              Liên hệ
            </h4>

            <p className="flex items-start gap-3 text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <i className="ri-map-pin-2-fill text-xl" />
              Đà Nẵng, Việt Nam
            </p>

            <p className="flex items-start gap-3 text-emerald-700 hover:text-emerald-900 cursor-pointer mt-2">
              <i className="ri-mail-fill text-xl" />
              support@care.com
            </p>

            <p className="flex items-start gap-3 text-emerald-700 hover:text-emerald-900 cursor-pointer mt-2">
              <i className="ri-phone-fill text-xl" />
              (+84) 934 568 789
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-200/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-emerald-800">
            <p className="text-sm">© 2024 HealthCare. Bảo lưu mọi quyền.</p>

            <div className="flex gap-4 mt-3 md:mt-0">
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-200 text-emerald-800 hover:bg-emerald-300 cursor-pointer transition">
                <i className="ri-instagram-line text-lg" />
              </span>
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-200 text-emerald-800 hover:bg-emerald-300 cursor-pointer transition">
                <i className="ri-facebook-fill text-lg" />
              </span>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
      <AuthPatientModal
        visible={authModalVisible}
        onSuccess={(p) => {
          setPatient(p);
          setAuthModalVisible(false);
        }}
        onClose={() => setAuthModalVisible(false)}
      />
    </div>
  );
}
