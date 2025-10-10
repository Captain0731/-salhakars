import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);
  const [showPassword, setShowPassword] = useState({
    signinPassword: false,
    signupPassword: false,
    confirmPassword: false
  });

  // Form data
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
    otherProfession: ""
  });

  const [errors, setErrors] = useState({
    signin: [],
    signup: []
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validateSigninForm = () => {
    const newErrors = [];
    
    if (!signinData.email) {
      newErrors.push("Email is required.");
    } else if (!emailRegex.test(signinData.email)) {
      newErrors.push("Enter a valid email.");
    }

    if (!signinData.password) {
      newErrors.push("Password is required.");
    }

    return newErrors;
  };

  const validateSignupForm = () => {
    const newErrors = [];

    if (!signupData.username) newErrors.push("Username is required.");
    
    if (!signupData.email) {
      newErrors.push("Email is required.");
    } else if (!emailRegex.test(signupData.email)) {
      newErrors.push("Enter a valid email.");
    }

    if (!signupData.password) {
      newErrors.push("Password is required.");
    } else if (!strongPasswordRegex.test(signupData.password)) {
      newErrors.push("Password must be at least 8 characters, include upper and lower case letters and a number.");
    }

    if (!signupData.confirmPassword) {
      newErrors.push("Confirm your password.");
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (!signupData.profession) {
      newErrors.push("Please choose a profession.");
    }

    if (signupData.profession === "Other" && !signupData.otherProfession) {
      newErrors.push("Please specify your profession.");
    }

    return newErrors;
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSigninForm();
    
    if (validationErrors.length > 0) {
      setErrors({ ...errors, signin: validationErrors });
      return;
    }

    setErrors({ ...errors, signin: [] });

    try {
      // Replace with your actual API endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Server error" }));
        setErrors({ ...errors, signin: [data.message || "Login failed."] });
        return;
      }

      // On success, navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      // For now, just navigate to dashboard for demo purposes
      navigate("/dashboard");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm();
    
    if (validationErrors.length > 0) {
      setErrors({ ...errors, signup: validationErrors });
      return;
    }

    setErrors({ ...errors, signup: [] });

    try {
      // Replace with your actual API endpoint
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Server error" }));
        setErrors({ ...errors, signup: [data.message || "Registration failed."] });
        return;
      }

      alert("Registration successful! Please sign in.");
      setIsSignUpMode(false);
    } catch (err) {
      console.error(err);
      setErrors({ ...errors, signup: ["Network error — try again later."] });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  useEffect(() => {
    setShowOtherField(signupData.profession === "Other");
  }, [signupData.profession]);

  return (
    <div className={`login-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* SIGN IN FORM */}
          <form onSubmit={handleSigninSubmit} className="sign-in-form">
            <h2 className="title">Sign in</h2>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={signinData.email}
                onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                required
              />
            </div>

            <div className="input-field password-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword.signinPassword ? "text" : "password"}
                placeholder="Password"
                value={signinData.password}
                onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => togglePasswordVisibility("signinPassword")}
              >
                <i className={`fas ${showPassword.signinPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="form-row spaced">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={signinData.remember}
                  onChange={(e) => setSigninData({ ...signinData, remember: e.target.checked })}
                />
                {" "}Remember me
              </label>
              <a className="link" href="#">Forgot?</a>
            </div>

            {errors.signin.length > 0 && (
              <div className="form-errors">
                <ul>
                  {errors.signin.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* SIGN UP FORM */}
          <form onSubmit={handleSignupSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
              />
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>

            <div className="input-field password-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword.signupPassword ? "text" : "password"}
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => togglePasswordVisibility("signupPassword")}
              >
                <i className={`fas ${showPassword.signupPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="input-field password-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                <i className={`fas ${showPassword.confirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="input-field select-container">
              <i className="fas fa-briefcase"></i>
              <select
                value={signupData.profession}
                onChange={(e) => setSignupData({ ...signupData, profession: e.target.value })}
                required
              >
                <option value="" disabled>Profession</option>
                <option value="student">Student</option>
                <option value="lawyer">Lawyer</option>
                <option value="lawfirm">Lawfirm</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {showOtherField && (
              <div className="input-field">
                <i className="fas fa-edit"></i>
                <input
                  type="text"
                  placeholder="Specify your profession"
                  value={signupData.otherProfession}
                  onChange={(e) => setSignupData({ ...signupData, otherProfession: e.target.value })}
                />
              </div>
            )}

            {errors.signup.length > 0 && (
              <div className="form-errors">
                <ul>
                  {errors.signup.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <input type="submit" value="Sign up" className="btn" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Join our community and access comprehensive legal resources and AI-powered tools!</p>
            <button className="btn transparent " onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <div className="image-placeholder">
            <img src="/logo.png" alt="सलाहकार Logo" className="w-72 h-auto object-contain" />
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome back! Sign in to continue your legal research journey.</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <div className="image-placeholder">
            <img src="/logo.png" alt="सलाहकार Logo" className="w-72 h-auto object-contain" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

        .login-container {
          position: relative;
          width: 100%;
          background-color: #fff;
          min-height: 100vh;
          overflow: hidden;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0rem 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        form.sign-in-form {
          z-index: 2;
        }

        .title {
          font-size: 2.2rem;
          color: #444;
          margin-bottom: 10px;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 15% 85%;
          padding: 0 0.4rem;
          position: relative;
          transition: box-shadow 0.3s;
        }

        .input-field:focus-within {
          box-shadow: 0 0 0 2px #000000;
        }

        .input-field i {
          text-align: center;
          line-height: 55px;
          color: #acacac;
          transition: 0.5s;
          font-size: 1.1rem;
        }

        .input-field input,
        .input-field select {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }

        .input-field input {
          padding-right: 1rem;
        }

        .input-field select {
          width: 100%;
          padding: 0 1rem 0 0.5rem;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          cursor: pointer;
        }

        .input-field input::placeholder {
          color: #aaa;
          font-weight: 500;
        }

        .password-field {
          grid-template-columns: 15% 70% 15%;
        }

        .pass-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin: 0;
          line-height: 55px;
          font-size: 1.1rem;
          color: #acacac;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 380px;
          margin: 10px 0;
          font-size: 0.9rem;
        }

        .link {
          color: #0b0b0b;
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        .form-errors {
          width: 100%;
          max-width: 380px;
          margin: 0 0 10px;
          padding: 10px;
          background: #ffcdd2;
          border-radius: 8px;
          color: #c62828;
          font-size: 0.9rem;
        }

        .form-errors ul {
          list-style-position: inside;
          padding-left: 5px;
        }

        .btn {
          width: 150px;
          background-color: #000000;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
        }

        .btn:hover {
          background-color: #4d84e2;
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .login-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background-image: linear-gradient(-45deg, #000000 0%, #282828 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .image-placeholder {
          width: 100%;
          transition: transform 1.1s ease-in-out;
          transition-delay: 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
        }

        .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
        }

        .btn.transparent {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .right-panel .image-placeholder,
        .right-panel .content {
          transform: translateX(800px);
        }

        .select-container::after {
          content: "\\f078";
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          color: #acacac;
          pointer-events: none;
        }

        /* ANIMATION */
        .login-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .login-container.sign-up-mode .left-panel .image-placeholder,
        .login-container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .login-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .login-container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .login-container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .login-container.sign-up-mode .right-panel .image-placeholder,
        .login-container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .login-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .login-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        @media (max-width: 870px) {
          .login-container {
            min-height: 800px;
            height: 100vh;
          }
          
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .login-container.sign-up-mode .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 3 / 4;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .image-placeholder {
            width: 200px;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.6s;
          }

          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }

          .panel h3 {
            font-size: 1.2rem;
          }

          .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }

          .btn.transparent {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }

          .login-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .login-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }

          .login-container.sign-up-mode .left-panel .image-placeholder,
          .login-container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }

          .login-container.sign-up-mode .right-panel .image-placeholder,
          .login-container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }

          .right-panel .image-placeholder,
          .right-panel .content {
            transform: translateY(300px);
          }

          .login-container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          form {
            padding: 0 1.5rem;
          }

          .image-placeholder {
            display: none;
          }
          
          .panel .content {
            padding: 0.5rem 1rem;
          }
          
          .login-container {
            padding: 1.5rem;
          }

          .login-container:before {
            bottom: 72%;
            left: 50%;
          }

          .login-container.sign-up-mode:before {
            bottom: 28%;
            left: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

