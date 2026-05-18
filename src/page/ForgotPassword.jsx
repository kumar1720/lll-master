import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import "../assets/css/Login.css";
import houseImg from "../assets/img/feature-property/fp-1.jpg";
import { forgotPassword, getApiSuccessMessage } from "../utils/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      setSuccess("");
      return;
    }

    if (!emailValid) {
      setError("Enter a valid email");
      setSuccess("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await forgotPassword({ email });
      setSuccess(
        getApiSuccessMessage(
          response,
          "Password reset instructions have been sent to your email.",
        ),
      );
    } catch (requestError) {
      setSuccess("");
      setError(
        requestError.message || "Unable to send a password reset request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Forgot password</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <p className="login-helper-text">
              Enter the email linked to your account and we will help you reset
              your password.
            </p>

            <div className={`login-field ${error ? "has-error" : ""}`}>
              <FaEnvelope className="login-field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                autoComplete="email"
              />
              {emailValid && <FaCheckCircle className="login-field-check" />}
            </div>
            {error ? <p className="login-error">{error}</p> : null}
            {success ? <p className="login-success">{success}</p> : null}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="login-signup-text">
              Remembered your password?{" "}
              <Link to="/login" className="login-create-link">
                Go back to login
              </Link>
            </p>
          </form>
        </div>

        <div className="login-right">
          <div className="login-img-wrap">
            <img
              src={houseImg}
              alt="Real estate illustration"
              className="login-house-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
