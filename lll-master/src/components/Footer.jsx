import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/footer.css";
import logo from "../assets/img/logo.jpg";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand Column */}
        <div className="footer__brand">
          <div className="footer__logo-wrapper">
            <img
              src={logo}
              alt="Lagan Lakshmi Infra"
              className="footer__logo"
            />
          </div>
          <p className="footer__tagline">
            We help you buy, sell, and rent properties with confidence. Our
            platform offers verified listings, expert guidance, and a smooth
            property experience from start to finish.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social-btn" aria-label="Facebook">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="footer__social-btn" aria-label="Twitter">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="footer__social-btn" aria-label="YouTube">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon
                  fill="#0d3d36"
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                />
              </svg>
            </a>
            <a href="#" className="footer__social-btn" aria-label="Instagram">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a href="#" className="footer__social-btn" aria-label="Pinterest">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Support Column */}
        <div className="footer__col">
          <h3 className="footer__col-title">SUPPORT</h3>
          <ul className="footer__links">
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms-and-conditions">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="/contact">Contact Support</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer__col">
          <h3 className="footer__col-title">QUICK LINKS</h3>
          <ul className="footer__links">
            <li>
              <a href="/properties">Browse Properties</a>
            </li>
            <li>
              <a href="/submit-property">List Your Property</a>
            </li>
            <li>
              <Link
                to={isAuthenticated ? "/profile#my-properties" : "/login"}
                state={
                  isAuthenticated
                    ? undefined
                    : { from: { pathname: "/profile", hash: "#my-properties" } }
                }
              >
                My Properties
              </Link>
            </li>
            <li>
              <a href="/register">Register</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer__col footer__col--newsletter">
          <h3 className="footer__col-title">NEWSLETTER</h3>
          <p className="footer__newsletter-desc">
            Subscribe to receive the latest property listings, market updates,
            and exclusive offers directly in your inbox.
          </p>
          <div className="footer__newsletter-input-wrapper">
            <input
              type="email"
              className="footer__newsletter-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            />
            <span className="footer__newsletter-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="20"
                height="20"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
            </span>
          </div>
          <button className="footer__subscribe-btn" onClick={handleSubscribe}>
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="footer__divider" />

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <p>© 2026 Altrix Softech LLP. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
