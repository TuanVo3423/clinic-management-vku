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
      <header className="backdrop-blur-xl bg-white/30 border-b border-white/40 sticky top-0 z-50 w-full">
        <nav
          className="max-w-7xl mx-auto px-6 py-3 
                  grid grid-cols-3 items-center"
        >
          <div className="text-2xl font-bold text-gray-800">
            Health<span className="text-emerald-600">Care</span>
          </div>

          <ul
            className="hidden md:flex items-center gap-1 
                   text-gray-700 font-medium justify-center"
          >
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

          <div className="hidden md:flex justify-end items-center gap-3 min-w-max">
            {patient ? (
              <>
                <span className="text-gray-700 text-sm whitespace-nowrap">
                  Xin chào, <b>{patient.data.patient.fullName}</b>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
                  title="Đăng xuất"
                >
                  <i className="ri-logout-box-r-line text-lg"></i>
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
          </div>
        </nav>
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
