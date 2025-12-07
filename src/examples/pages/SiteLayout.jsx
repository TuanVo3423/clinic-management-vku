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
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-2 relative flex items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-800">
              Health<span className="text-emerald-600">Care</span>
            </a>
          </div>

          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex items-center gap-2 text-gray-700 font-medium">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/scheduler" },
                { label: "Pages", href: "/pages" },
                { label: "Blog", href: "/blog" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="px-4 py-2 rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            {patient ? (
              <>
                <span className="text-gray-700 text-sm whitespace-nowrap mr-2">
                  Xin chào, <b>{patient.data.patient.fullName}</b>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
                  title="Đăng xuất"
                >
                  <i className="ri-logout-box-r-line text-lg" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalVisible(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Đăng nhập
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden text-3xl text-gray-800 ml-2"
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
      bg-white/80 backdrop-blur-xl border-t border-white/30 transition-all"
        >
          <a href="/" className="py-2 text-gray-800">
            Home
          </a>
          <a href="/about" className="py-2 text-gray-800">
            About Us
          </a>
          <a href="/scheduler" className="py-2 text-gray-800">
            Services
          </a>
          <a href="/pages" className="py-2 text-gray-800">
            Pages
          </a>
          <a href="/blog" className="py-2 text-gray-800">
            Blog
          </a>

          <div className="h-px bg-gray-300/40 my-1" />

          {patient ? (
            <>
              <div className="text-gray-700">
                {patient.data.patient.fullName}
              </div>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
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

      <footer className="footer" style={{ marginTop: "auto" }}>
        <div className="section__container footer__container">
          <div className="footer__col">
            <h3>
              Health <span>Care</span>
            </h3>
            <p>
              We are honored to be a part of your healthcare journey and
              committed to delivering compassionate and top-notch care.
            </p>
          </div>
          <div className="footer__col">
            <h4>About Us</h4>
            <p>Home</p>
            <p>About Us</p>
            <p>Work With Us</p>
          </div>
          <div className="footer__col">
            <h4>Services</h4>
            <p>Search Terms</p>
            <p>Advance Search</p>
            <p>Privacy Policy</p>
          </div>
          <div className="footer__col">
            <h4>Contact Us</h4>
            <p>
              <i className="ri-map-pin-2-fill" /> Redfort Bridge Street, Delhi
            </p>
            <p>
              <i className="ri-mail-fill" /> support@care.com
            </p>
            <p>
              <i className="ri-phone-fill" /> (+91) 93456 87989
            </p>
          </div>
        </div>
        <div className="footer__bar">
          <div className="footer__bar__content">
            <p>Copyright © 2024 codeaashu. All rights reserved.</p>
            <div className="footer__socials">
              <span>
                <i className="ri-instagram-line" />
              </span>
              <span>
                <i className="ri-facebook-fill" />
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
