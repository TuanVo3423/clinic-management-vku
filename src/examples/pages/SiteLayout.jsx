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
      <header
        className="header-glass"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(255, 255, 255, 0.35)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <nav className="header-nav">
          <div className="logo">
            Health<span>Care</span>
          </div>

          {/* Desktop menu */}
          <ul className="nav-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/scheduler">Services</a>
            </li>
            <li>
              <a href="/pages">Pages</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>

          <div className="nav-actions">
            {patient ? (
              <>
                <span className="patient-greeting">
                  Xin chào, <b>{patient.data.patient.fullName}</b>
                </span>
                <button
                  type="button"
                  className="btn nav-btn logout-btn"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn nav-btn login-btn"
                onClick={() => setAuthModalVisible(true)}
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() =>
              document.querySelector(".mobile-menu")?.classList.toggle("open")
            }
          >
            ☰
          </button>
        </nav>

        {/* Mobile menu */}
        <div className="mobile-menu">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/scheduler">Services</a>
          <a href="/pages">Pages</a>
          <a href="/blog">Blog</a>
          <div className="mobile-line" />

          {patient ? (
            <>
              <div className="patient-name mobile">{patient.fullName}</div>
              <button
                type="button"
                className="btn nav-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn nav-btn"
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
