import React from "react";
import "../assets/css/contact-section.css";

const ContactSection = () => {
  return (
    <section className="cmap-section">
      <div className="cmap-wrapper">
        {/* Left: Contact Info */}
        <div className="cmap-left">
          <div className="cmap-item">
            <div className="cmap-icon">
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
            <div className="cmap-info">
              <h4>Address</h4>
              <p>H-141, H Block, Sector 63, Noida, Uttar Pradesh, 201301</p>
            </div>
          </div>

          <div className="cmap-item">
            <div className="cmap-icon">
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5S11.17 17 12 17s1.5.67 1.5 1.5S12.83 20 12 20zm5-4H7V4h10v12z" />
              </svg>
            </div>
            <div className="cmap-info">
              <h4>Phone</h4>
              <p>+918595543869</p>
            </div>
          </div>

          <div className="cmap-item">
            <div className="cmap-icon">
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18c0-.55-.45-1-1-1s-1 .45-1 1v1.93C7.06 19.44 4.56 16.94 4.07 14H6c.55 0 1-.45 1-1s-.45-1-1-1H4.07C4.56 8.06 7.06 5.56 10 5.07V7c0 .55.45 1 1 1s1-.45 1-1V5.07C15.94 5.56 18.44 8.06 18.93 11H17c-.55 0-1 .45-1 1s.45 1 1 1h1.93c-.49 2.94-2.99 5.44-5.93 5.93z" />
              </svg>
            </div>
            <div className="cmap-info">
              <h4>Support</h4>
              <p>info@laganlakshmiinfra.com</p>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="cmap-right">
          <iframe
            title="Lagan Lakshmi Infra Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.3705!3d28.6270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a218c6b5e3%3A0x5e8e7f6c0a9b6e6!2sSector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
