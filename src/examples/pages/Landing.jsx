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
import SiteLayout from "./SiteLayout";
export default function Landing() {
  const patient = JSON.parse(localStorage.getItem("patientInfo")) || null;
  return (
    <>
    <SiteLayout className={patient ? "header-side" : "header-main"}>
    

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

      </SiteLayout>

    
    </>
  );
}
