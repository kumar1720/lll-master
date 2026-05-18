import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaApple,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import "../assets/css/Register.css";
import houseImg from "../assets/img/feature-property/fp-1.jpg";
import { useAuth } from "../context/AuthContext";
import { getOAuthUrl } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [emailValid, setEmailValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setGeneralError("");

    if (name === "email") {
      setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!emailValid) nextErrors.email = "Enter a valid email";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) nextErrors.password = "Min 6 characters";
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.agreed) {
      nextErrors.agreed = "You must agree to the Terms of Service";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);
      setGeneralError("");
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        password_confirmation: form.confirmPassword,
      });
      navigate("/profile", { replace: true });
    } catch (requestError) {
      setGeneralError(
        requestError.message || "Unable to create your account right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    const url = getOAuthUrl(provider);
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div className="reg-left">
          <h1 className="reg-title">Sign up</h1>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <div className={`reg-field ${errors.name ? "has-error" : ""}`}>
              <FaUser className="reg-field-icon" />
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="reg-error">{errors.name}</p>}

            <div className={`reg-field ${errors.email ? "has-error" : ""}`}>
              <FaEnvelope className="reg-field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {emailValid && <FaCheckCircle className="reg-field-check" />}
            </div>
            {errors.email && <p className="reg-error">{errors.email}</p>}

            <div className={`reg-field ${errors.phone ? "has-error" : ""}`}>
              <FaPhone className="reg-field-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Your phone number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <p className="reg-error">{errors.phone}</p>}

            <div className={`reg-field ${errors.password ? "has-error" : ""}`}>
              <FaLock className="reg-field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.password && <p className="reg-error">{errors.password}</p>}

            <div
              className={`reg-field ${errors.confirmPassword ? "has-error" : ""}`}
            >
              <FaLock className="reg-field-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="reg-error">{errors.confirmPassword}</p>
            )}

            <div className="reg-checkbox-row">
              <input
                type="checkbox"
                id="agreed"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
              />
              <label htmlFor="agreed">
                I agree all statements in{" "}
                <Link to="/terms-and-conditions" className="reg-terms-link">
                  Terms of service
                </Link>
              </label>
            </div>
            {errors.agreed && <p className="reg-error">{errors.agreed}</p>}
            {generalError ? <p className="reg-error">{generalError}</p> : null}

            <button
              type="submit"
              className="reg-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Register"}
            </button>

            <div className="reg-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="reg-google-btn"
              onClick={() => handleOAuthLogin("google")}
            >
              <svg className="reg-google-icon" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.5 1 24 1 14.8 1 7.1 6.7 3.9 14.6l7 5.4C12.5 13.7 17.8 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.9 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.4 10.3l7.5-5.7z"
                />
                <path
                  fill="#34A853"
                  d="M24 47c5.5 0 10.1-1.8 13.5-4.9l-7.4-5.7c-2 1.3-4.4 2.1-6.1 2.1-6.2 0-11.5-4.2-13.4-9.9l-7.5 5.7C7.1 41.3 14.8 47 24 47z"
                />
                <path fill="none" d="M1 1h46v46H1z" />
              </svg>
              Login with Google
            </button>

            <button
              type="button"
              className="reg-social-btn reg-apple-btn"
              onClick={() => handleOAuthLogin("apple")}
            >
              <FaApple className="reg-social-icon" />
              Login with Apple
            </button>
          </form>
        </div>

        <div className="reg-right">
          <div className="reg-img-wrap">
            <img
              src={houseImg}
              alt="Real estate illustration"
              className="reg-house-img"
            />
          </div>
          <Link to="/login" className="reg-member-link">
            I am already member
          </Link>
        </div>
      </div>
    </div>
  );
}
