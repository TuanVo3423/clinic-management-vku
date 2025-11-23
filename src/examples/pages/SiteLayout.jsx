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
      <header className={headerClassName ?? (patient ? "header-side" : "header-main")}>
        <nav
          className="section__container nav__container"
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <div className="nav__logo">
            Health <span>Care</span>
          </div>
          <ul className="nav__links">
            <li className="link">
              <a href="/">Home</a>
            </li>
            <li className="link">
              <a href="/about">About Us</a>
            </li>
            <li className="link">
              <a href="/scheduler">Services</a>
            </li>
            <li className="link">
              <a href="/pages">Pages</a>
            </li>
            <li className="link">
              <a href="/blog">Blog</a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {patient ? (
              <>
                <div
                  style={{
                    color: "var(--primary-color-dark)",
                    fontWeight: 600,
                  }}
                >
                  {patient.fullName}
                </div>
                <button type="button" className="btn" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn"
                onClick={() => setAuthModalVisible(true)}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </nav>
        <div className="section__container header__container">
          <div className="header__content">
            <h1>Providing an Exceptional Patient Experience</h1>
            <p>
              Welcome, where exceptional patient experiences are our priority.
              With compassionate care, state-of-the-art facilities, and a
              patient-centered approach, we&apos;re dedicated to your well-being.
              Trust us with your health and experience the difference.
            </p>
            <button type="button" className="btn">See Services</button>
          </div>

          <div className="header__form">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
             <button
                type="button"
                className="btn book-btn"
                onClick={() => (window.location.href = "/scheduler")}
               aria-label="Đặt lịch hẹn"
             >
                Đặt lịch hẹn
              </button>
           </div>
          </div>
        </div>
      </header>

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
