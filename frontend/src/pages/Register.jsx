import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const API_URL = "http://localhost:8080/api/auth";

function Register({ onLogin, onBack }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password
        }
      );

      console.log("Registration response:", response.data);

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      // Go to login after successful registration
      setTimeout(() => {
        if (onLogin) {
          onLogin();
        }
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Registration failed. Please check the server and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* BACK BUTTON */}
        <button
          type="button"
          className="register-back-button"
          onClick={onBack || onLogin}
        >
          <span className="back-arrow">←</span>
          Back
        </button>

        {/* LOGO */}
        <div className="register-logo-icon">
          ✦
        </div>

        <h1>
          Social<span>Pulse</span>
        </h1>

        <p className="register-tagline">
          Connect. Share. Engage.
        </p>

        <h2>Create Account</h2>

        <p className="register-subtitle">
          Join the SocialPulse community
        </p>

        <form onSubmit={handleRegister}>

          {/* FULL NAME */}
          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* USERNAME */}
          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="register-success">
              {success}
            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="login-link">
          Already have an account?

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>
        </div>

      </div>

    </div>
  );
}

export default Register;