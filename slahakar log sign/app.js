// app.js - use module type in script tag
// Defensive DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Panel toggle
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  if (sign_up_btn && sign_in_btn && container) {
    sign_up_btn.addEventListener("click", () => container.classList.add("sign-up-mode"));
    sign_in_btn.addEventListener("click", () => container.classList.remove("sign-up-mode"));
  }

  // Form elements
  const professionSelect = document.getElementById("profession");
  const otherField = document.getElementById("otherField");
  const otherInput = document.getElementById("otherInput");

  if (!professionSelect || !otherField || !otherInput) {
    console.error("Missing profession elements in DOM:", { professionSelect, otherField, otherInput });
  } else {
    professionSelect.addEventListener("change", () => {
      if (professionSelect.value === "Other") {
        otherField.style.display = "grid"; // matches .input-field grid layout
        otherInput.required = true;
      } else {
        otherField.style.display = "none";
        otherInput.value = "";
        otherInput.required = false;
      }
    });
  }

  // Password visibility toggles (works for all .pass-toggle)
  document.querySelectorAll(".pass-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".password-field");
      if (!parent) return;
      const input = parent.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) icon.classList.toggle("fa-eye-slash");
    });
  });

  // Simple validators
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // password: min 8, 1 uppercase, 1 lowercase, 1 number (adjust to your policy)
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // forms
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");

  const signinErrors = document.getElementById("signin-errors");
  const signupErrors = document.getElementById("signup-errors");

  function showErrors(container, list) {
    container.innerHTML = "";
    if (!list || list.length === 0) return;
    const ul = document.createElement("ul");
    list.forEach(msg => {
      const li = document.createElement("li");
      li.textContent = msg;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function validateSigninForm() {
    const errors = [];
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;

    if (!email) errors.push("Email is required.");
    else if (!emailRegex.test(email)) errors.push("Enter a valid email.");

    if (!password) errors.push("Password is required.");

    showErrors(signinErrors, errors);
    return errors.length === 0;
  }

  function validateSignupForm() {
    const errors = [];
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const profession = document.getElementById("profession").value;
    const other = document.getElementById("otherInput").value.trim();

    if (!username) errors.push("Username is required.");
    if (!email) errors.push("Email is required.");
    else if (!emailRegex.test(email)) errors.push("Enter a valid email.");

    if (!password) errors.push("Password is required.");
    else if (!strongPasswordRegex.test(password)) {
      errors.push("Password must be at least 8 characters, include upper and lower case letters and a number.");
    }

    if (!confirm) errors.push("Confirm your password.");
    else if (password !== confirm) errors.push("Passwords do not match.");

    if (!profession) errors.push("Please choose a profession.");
    if (profession === "Other" && !other) errors.push("Please specify your profession.");

    showErrors(signupErrors, errors);
    return errors.length === 0;
  }

  // Accessibility: live-validate fields on blur
  ["signup-email", "signin-email"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => {
      const parent = el.closest(".input-field");
      if (!parent) return;
      if (emailRegex.test(el.value.trim())) {
        parent.classList.remove("invalid");
        parent.classList.add("valid");
      } else {
        parent.classList.add("invalid");
        parent.classList.remove("valid");
      }
    });
  });

  // Submit handlers - replace URLs with your API endpoints
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      signinErrors.innerHTML = "";

      if (!validateSigninForm()) return;

      const payload = {
        email: document.getElementById("signin-email").value.trim(),
        password: document.getElementById("signin-password").value,
        remember: document.getElementById("remember").checked
      };

      try {
        // Example fetch to your login API
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        });

        if (!res.ok) {
          const data = await res.json().catch(()=>({message:"Server error"}));
          showErrors(signinErrors, [data.message || "Login failed."]);
          return;
        }

        const data = await res.json();
        // handle tokens/session here: redirect to dashboard etc.
        // e.g., window.location.href = "/dashboard";
        alert("Login success — replace this with redirect.");
      } catch (err) {
        console.error(err);
        showErrors(signinErrors, ["Network error — try again later."]);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      signupErrors.innerHTML = "";

      if (!validateSignupForm()) return;

      const payload = {
        username: document.getElementById("signup-username").value.trim(),
        email: document.getElementById("signup-email").value.trim(),
        password: document.getElementById("signup-password").value,
        profession: document.getElementById("profession").value,
        otherProfession: document.getElementById("otherInput").value.trim()
      };

      try {
        // Example fetch to your register API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const data = await res.json().catch(()=>({message:"Server error"}));
          showErrors(signupErrors, [data.message || "Registration failed."]);
          return;
        }

        const data = await res.json();
        alert("Registration successful — check your email to verify account.");
        // Optionally switch to sign-in mode automatically:
        container.classList.remove("sign-up-mode");
      } catch (err) {
        console.error(err);
        showErrors(signupErrors, ["Network error — try again later."]);
      }
    });
  }
});
