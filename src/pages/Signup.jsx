import React, { useState } from "react";
// optional if you want to reuse your CSS file
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    otp: "",
    password: "",
    confirmPassword: "",
    profession: "",
    otherProfession: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOTP = async () => {
    if (!formData.phone_number) {
      setError("Enter phone number first");
      return;
    }
    setError("");
    setMessage("Sending OTP...");
    try {
      const res = await fetch("/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: formData.phone_number }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage(`OTP sent to ${formData.phone_number}`);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Network error while sending OTP");
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp) {
      setError("Enter OTP first");
      return;
    }
    setError("");
    setMessage("Verifying OTP...");
    try {
      const res = await fetch("/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          code: formData.otp,
        }),
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setOtpVerified(true);
        setMessage("✅ Phone verified successfully!");
      } else {
        setError("Invalid or expired OTP");
      }
    } catch {
      setError("Network error while verifying OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your phone number first.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("Creating account...");

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          profession:
            formData.profession === "Other"
              ? formData.otherProfession
              : formData.profession,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("User created successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch {
      setError("Network error during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" id="auth-container" aria-live="polite">
      <div className="forms-container">
        <div className="signin-signup">
          <form id="signup-form" className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign up</h2>

            {error && <div className="form-errors">{error}</div>}
            {message && <div className="form-success">{message}</div>}

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                name="phone_number"
                placeholder="+91XXXXXXXXXX"
                required
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-row" style={{ maxWidth: 380, marginTop: -5 }}>
              <button
                type="button"
                className="btn"
                onClick={sendOTP}
                disabled={loading}
              >
                Send OTP
              </button>
            </div>

            {otpSent && (
              <>
                <div className="input-field" id="otp-field">
                  <i className="fas fa-key"></i>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row" id="verify-otp-row">
                  <button
                    type="button"
                    className="btn"
                    onClick={verifyOTP}
                    disabled={loading}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            <div className="input-field password-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-field password-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="input-field select-container">
              <i className="fas fa-briefcase"></i>
              <select
                name="profession"
                required
                value={formData.profession}
                onChange={handleChange}
              >
                <option value="">Profession</option>
                <option value="student">Student</option>
                <option value="lawyer">Lawyer</option>
                <option value="lawfirm">Lawfirm</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.profession === "Other" && (
              <div className="input-field">
                <i className="fas fa-edit"></i>
                <input
                  type="text"
                  name="otherProfession"
                  placeholder="Specify your profession"
                  value={formData.otherProfession}
                  onChange={handleChange}
                />
              </div>
            )}

            <input
              id="signup-submit"
              type="submit"
              className="btn"
              value={loading ? "Processing..." : "Sign up"}
              disabled={!otpVerified || loading}
            />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>Join us and explore your legal tools in one place.</p>
            <button
              className="btn transparent"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
          <img
            src="/logo1.png"
            className="image"
            alt="Login illustration"
            style={{
              width: 500,
              paddingRight: 90,
              paddingBottom: 90,
            }}
          />
        </div>
      </div>
    </div>
  );
}

