/* eslint-disable */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-render-return-value */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-set-state */
import React from "react";
import "./styles.css";
import aboutImg from "./assets/about.jpg";
import chooseImg from "./assets/choose-us.jpg";
import doc1 from "./assets/doctor-1.jpg";
import doc2 from "./assets/doctor-2.jpg";
import doc3 from "./assets/doctor-3.jpg";
import ChatWidget from "../components/ChatWidget";
export default function Landing() {
  return (
    <>
      <header>
        <nav className="section__container nav__container">
          <div className="nav__logo">
            Health 
            <span>Care</span>
          </div>
          <ul className="nav__links">
            <li className="link">
              <a href="/home">Home</a>
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
          <button type="button" className="btn">Contact Us</button>
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
            <form>
              <h4>Book Now</h4>
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
              <input type="text" placeholder="Address" />
              <input type="text" placeholder="Phone No." />
              <button type="button" className="btn form__btn">Book Appointment</button>
            </form>
          </div>
        </div>
      </header>

      <section className="section__container service__container">
        <div className="service__header">
          <div className="service__header__content">
            <h2 className="section__header">Our Special service</h2>
            <p>
              Beyond simply providing medical care, our commitment lies in
              delivering unparalleled service tailored to your unique needs.
            </p>
          </div>
          <button type="button" className="service__btn">Ask A Service</button>
        </div>

        <div className="service__grid">
          <div className="service__card">
            <span>
              <i className="ri-microscope-line" />
            </span>
            <h4>Laboratory Test</h4>
            <p>
              Accurate Diagnostics, Swift Results: Experience top-notch
              Laboratory Testing at our facility.
            </p>
            <a href="/service/lab">Learn More</a>
          </div>

          <div className="service__card">
            <span>
              <i className="ri-mental-health-line" />
            </span>
            <h4>Health Check</h4>
            <p>
              Our thorough assessments and expert evaluations help you stay
              proactive about your health.
            </p>
            <a href="/service/checkup">Learn More</a>
          </div>

          <div className="service__card">
            <span>
              <i className="ri-hospital-line" />
            </span>
            <h4>General Dentistry</h4>
            <p>
              Experience comprehensive oral care with Dentistry. Trust us to
              keep your smile healthy and bright.
            </p>
            <a href="/service/dentistry">Learn More</a>
          </div>
        </div>
      </section>

      <section className="section__container about__container">
        <div className="about__content">
          <h2 className="section__header">About Us</h2>
          <p>
            Welcome to our healthcare website, your one-stop destination for
            reliable and comprehensive health care information. We are committed
            to promoting wellness and providing valuable resources to empower
            you on your health journey.
          </p>
          <p>
            Explore our extensive collection of expertly written articles and
            guides covering a wide range of health topics. From understanding
            common medical conditions to tips for maintaining a healthy
            lifestyle, our content educates, inspires, and supports you in making
            informed choices.
          </p>
        </div>

        <div className="about__image">
          <img src={aboutImg} alt="about" />
        </div>
      </section>

      <section className="section__container why__container">
        <div className="why__image">
          <img src={chooseImg} alt="why choose us" />
        </div>

        <div className="why__content">
          <h2 className="section__header">Why Choose Us</h2>
          <p>
            With a steadfast commitment to your well-being, our team of highly
            trained healthcare professionals ensures that you receive exceptional
            patient experiences.
          </p>

          <div className="why__grid">
            <span>
              <i className="ri-hand-heart-line" />
            </span>
            <div>
              <h4>Intensive Care</h4>
              <p>
                Our Intensive Care Unit is equipped with advanced technology and
                staffed by a team of professionals.
              </p>
            </div>

            <span>
              <i className="ri-truck-line" />
            </span>
            <div>
              <h4>Free Ambulance Car</h4>
              <p>
                A compassionate initiative to prioritize your health without
                financial burden.
              </p>
            </div>

            <span>
              <i className="ri-hospital-line" />
            </span>
            <div>
              <h4>Medical & Surgical</h4>
              <p>
                We offer advanced healthcare solutions and medical treatments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section__container doctors__container">
        <div className="doctors__header">
          <div className="doctors__header__content">
            <h2 className="section__header">Our Special Doctors</h2>
            <p>
              We take pride in our exceptional team of doctors, each a
              specialist in their field.
            </p>
          </div>

          <div className="doctors__nav">
            <span>
              <i className="ri-arrow-left-line" />
            </span>
            <span>
              <i className="ri-arrow-right-line" />
            </span>
          </div>
        </div>

        <div className="doctors__grid">
          <div className="doctors__card">
            <div className="doctors__card__image">
+              <img src={doc1} alt="doctor" />
              <div className="doctors__socials">
                <span>
                  <i className="ri-instagram-line" />
                </span>
                <span>
                  <i className="ri-facebook-fill" />
                </span>
                <span>
                  <i className="ri-heart-fill" />
                </span>
                <span>
                  <i className="ri-twitter-fill" />
                </span>
              </div>
            </div>
            <h4>Dr. Soni Bharti</h4>
            <p>Cardiologist</p>
          </div>

          <div className="doctors__card">
            <div className="doctors__card__image">
+              <img src={doc2} alt="doctor" />
              <div className="doctors__socials">
                <span>
                  <i className="ri-instagram-line" />
                </span>
                <span>
                  <i className="ri-facebook-fill" />
                </span>
                <span>
                  <i className="ri-heart-fill" />
                </span>
                <span>
                  <i className="ri-twitter-fill" />
                </span>
              </div>
            </div>
            <h4>Dr. Paresh Rawal</h4>
            <p>Neurosurgeon</p>
          </div>

          <div className="doctors__card">
            <div className="doctors__card__image">
+              <img src={doc3} alt="doctor" />
              <div className="doctors__socials">
                <span>
                  <i className="ri-instagram-line" />
                </span>
                <span>
                  <i className="ri-facebook-fill" />
                </span>
                <span>
                  <i className="ri-heart-fill" />
                </span>
                <span>
                  <i className="ri-twitter-fill" />
                </span>
              </div>
            </div>
            <h4>Dr. Munna Bhai</h4>
            <p>Dermatologist</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section__container footer__container">
          <div className="footer__col">
            <h3>
              Health 
              <span>Care</span>
            </h3>
            <p>
              We are honored to be a part of your healthcare journey and
              committed to delivering compassionate and top-notch care.
            </p>
            <p>
              Trust us with your health and let&apos;s achieve the best outcomes
              together.
            </p>
          </div>

          <div className="footer__col">
            <h4>About Us</h4>
            <p>Home</p>
            <p>About Us</p>
            <p>Work With Us</p>
            <p>Our Blog</p>
            <p>Terms &amp; Conditions</p>
          </div>

          <div className="footer__col">
            <h4>Services</h4>
            <p>Search Terms</p>
            <p>Advance Search</p>
            <p>Privacy Policy</p>
            <p>Suppliers</p>
            <p>Our Stores</p>
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
              <span>
                <i className="ri-heart-fill" />
              </span>
              <span>
                <i className="ri-twitter-fill" />
              </span>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}
