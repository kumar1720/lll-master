import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaApple, FaCheckCircle, FaEnvelope, FaLock } from "react-icons/fa";
import "../assets/css/Login.css";
import houseImg from "../assets/img/feature-property/fp-1.jpg";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginGoogle, loginApple } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [emailValid, setEmailValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
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

    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!emailValid) nextErrors.email = "Enter a valid email";

    if (!form.password) nextErrors.password = "Password is required";

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
      await login(form);
      navigate(location.state?.from?.pathname || "/profile", { replace: true });
    } catch (requestError) {
      setGeneralError(requestError.message || "Unable to log you in right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    const loginAction = provider === "google" ? loginGoogle : loginApple;

    try {
      setSubmitting(true);
      setGeneralError("");

      await loginAction({
        provider,
        redirect_uri: window.location.origin,
        source: "web",
      });

      navigate(location.state?.from?.pathname || "/profile", { replace: true });
    } catch (requestError) {
      setGeneralError(
        requestError.message || `Unable to log you in with ${provider}.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Sign in</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className={`login-field ${errors.email ? "has-error" : ""}`}>
              <FaEnvelope className="login-field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {emailValid && <FaCheckCircle className="login-field-check" />}
            </div>
            {errors.email && <p className="login-error">{errors.email}</p>}

            <div
              className={`login-field ${errors.password ? "has-error" : ""}`}
            >
              <FaLock className="login-field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="login-error">{errors.password}</p>}

            <p className="login-signup-text">
              Don't have an account?{" "}
              <Link to="/register" className="login-create-link">
                Create one
              </Link>
            </p>
            <p className="login-signup-text">
              Forgot your password?{" "}
              <Link to="/forgot-password" className="login-create-link">
                Reset it
              </Link>
            </p>
            {generalError ? <p className="login-error">{generalError}</p> : null}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="login-google-btn"
              disabled={submitting}
              onClick={() => handleOAuthLogin("google")}
            >
              <svg className="login-google-icon" viewBox="0 0 48 48">
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
              className="login-social-btn login-apple-btn"
              disabled={submitting}
              onClick={() => handleOAuthLogin("apple")}
            >
              <FaApple className="login-social-icon" />
              Login with Apple
            </button>
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
