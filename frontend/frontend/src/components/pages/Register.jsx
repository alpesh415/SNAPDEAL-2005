

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    try {
      setLoading(true);

      await api.auth.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Registration successful! Please login.");

      navigate("/login");
      return;
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.icon}>
          <i className="bi bi-person-plus"></i>
        </div>

        <h2 style={styles.title}>Create Account</h2>

        <p style={styles.subtitle}>
          Join Snapdeal and start shopping
        </p>

        <form onSubmit={submit}>

          <label style={styles.label}>
            Full Name

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your name"
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Email Address

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Password

            <div style={styles.passwordBox}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                style={styles.passwordInput}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={styles.eye}
              >
                <i
                  className={
                    showPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </label>

          <label style={styles.label}>
            Confirm Password

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              style={styles.input}
              required
            />
          </label>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "78vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    background:
      "linear-gradient(135deg,#fff0f4,#f5f5f5,#ffe7ef)",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,.12)",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff0f4",
    color: "#e40046",
    display: "grid",
    placeItems: "center",
    fontSize: "26px",
    margin: "0 auto 15px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    height: "46px",
    marginTop: "7px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "0 13px",
    fontSize: "14px",
    outline: "none",
  },

  passwordBox: {
    display: "flex",
    alignItems: "center",
    marginTop: "7px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    height: "46px",
  },

  passwordInput: {
    width: "100%",
    height: "100%",
    border: 0,
    outline: "none",
    padding: "0 13px",
  },

  eye: {
    border: 0,
    background: "transparent",
    padding: "10px",
    color: "#777",
    cursor: "pointer",
  },

  button: {
    width: "100%",
    height: "48px",
    border: 0,
    borderRadius: "8px",
    background: "#e40046",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "5px",
  },

  loginText: {
    textAlign: "center",
    marginTop: "22px",
    color: "#777",
    fontSize: "14px",
  },

  link: {
    color: "#e40046",
    fontWeight: 700,
    textDecoration: "none",
  },
};

export default Register;