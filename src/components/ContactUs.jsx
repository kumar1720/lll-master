import React, { useState } from "react";
import "../assets/css/ContactUs.css";
import {
  FaHome,
  FaChevronRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import contactImg from "../assets/img/chooseus/chooseus-bg.jpg"; // replace with your image

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* ── Hero Banner ── */}
      <div className="contact-hero">
        <div className="contact-breadcrumb">
          <h2>CONTACT US</h2>
          <div className="breadcrumb-trail">
            <FaHome className="bc-home-icon" />
            <span className="bc-link">Home</span>
            <FaChevronRight className="bc-arrow" />
            <span className="bc-current">Contact</span>
          </div>
        </div>
      </div>

      {/* ── Contact Section ── */}
      <section className="contact-section">
        <div className="contact-container">
          {/* ── LEFT: Form ── */}
          <div className="contact-form-wrap">
            <span className="section-tag">GET IN TOUCH</span>
            <h2 className="contact-title">
              Send Us a <span className="highlight">Message</span>
            </h2>
            <p className="contact-subtitle">
              Have a question or need assistance? Fill out the form below and
              our team will get back to you within 24 hours.
            </p>

            {/* Success toast */}
            {submitted && (
              <div className="success-toast">
                <FaPaperPlane /> Message sent successfully! We'll be in touch
                soon.
              </div>
            )}

            <form className="cform" onSubmit={handleSubmit} noValidate>
              <div className="cform-row">
                <div className="cform-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cform-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="cform-row">
                <div className="cform-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="cform-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Property Inquiry"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="cform-group full-width">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="cform-submit">
                <FaPaperPlane className="btn-icon" />
                Send Message
              </button>
            </form>
          </div>

          {/* ── RIGHT: Image + Info Cards ── */}
          <div className="contact-image-wrap">
            <div
              className="contact-img"
              style={{ backgroundImage: `url(${contactImg})` }}
            >
              <div className="contact-img-overlay" />
              {/* Floating info card */}
              <div className="contact-info-card">
                <div className="info-item">
                  <div className="info-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-text">
                    <h4>Our Office</h4>
                    <p>
                      H-141, H Block, Sector 63,
                      <br />
                      Noida, UP – 201301
                    </p>
                  </div>
                </div>

                <div className="info-divider" />

                <div className="info-item">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-text">
                    <h4>Call Us</h4>
                    <p>+91 8595543869</p>
                  </div>
                </div>

                <div className="info-divider" />

                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-text">
                    <h4>Email Us</h4>
                    <p>info@laganlakshmiinfra.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
