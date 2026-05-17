import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import "../assets/css/Login.css";
import houseImg from "../assets/img/feature-property/fp-1.jpg";
import { getApiSuccessMessage, resetPassword } from "../utils/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    token: searchParams.get("token") || "",
    email: searchParams.get("email") || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    [form.email],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.token.trim()) nextErrors.token = "Reset token is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!emailValid) nextErrors.email = "Enter a valid email";
    if (!form.password) nextErrors.password = "New password is required";
    else if (form.password.length < 6) nextErrors.password = "Min 6 characters";
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match";
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
      setErrors({});
      const response = await resetPassword({
        token: form.token,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        password_confirmation: form.confirmPassword,
      });
      setSuccess(
        getApiSuccessMessage(
          response,
          "Your password has been reset. Please log in with your new password.",
        ),
      );

      window.setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (requestError) {
      setSuccess("");
      setErrors({
        general:
          requestError.message || "Unable to reset your password right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Reset password</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <p className="login-helper-text">
              Use the reset token from your email and choose a new password.
            </p>

            <div className={`login-field ${errors.token ? "has-error" : ""}`}>
              <FaKey className="login-field-icon" />
              <input
                type="text"
                name="token"
                placeholder="Reset token"
                value={form.token}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {errors.token ? <p className="login-error">{errors.token}</p> : null}

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
            </div>
            {errors.email ? <p className="login-error">{errors.email}</p> : null}

            <div className={`login-field ${errors.password ? "has-error" : ""}`}>
              <FaLock className="login-field-icon" />
              <input
                type="password"
                name="password"
                placeholder="New password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.password ? (
              <p className="login-error">{errors.password}</p>
            ) : null}

            <div
              className={`login-field ${errors.confirmPassword ? "has-error" : ""}`}
            >
              <FaLock className="login-field-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword ? (
              <p className="login-error">{errors.confirmPassword}</p>
            ) : null}

            {errors.general ? (
              <p className="login-error">{errors.general}</p>
            ) : null}
            {success ? <p className="login-success">{success}</p> : null}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Reset Password"}
            </button>

            <p className="login-signup-text">
              Need a new reset email?{" "}
              <Link to="/forgot-password" className="login-create-link">
                Request one
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
