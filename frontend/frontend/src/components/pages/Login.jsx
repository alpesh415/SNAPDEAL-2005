



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await api.auth.login({ email, password });

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      alert(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginWrapper}>

        {/* Left Section */}
        <div style={styles.leftSection}>
          <div style={styles.logoBox}>
            <div style={styles.logoShape}></div>
            <span style={styles.logoText}>snapdeal</span>
          </div>

          <h1 style={styles.welcomeTitle}>
            Shop Smarter.
            <br />
            Live Better.
          </h1>

          <p style={styles.welcomeText}>
            Discover amazing products, exciting deals and
            great offers every day.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span>✓</span>
              <p>Thousands of products</p>
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              <p>Best deals & discounts</p>
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              <p>Fast & secure shopping</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <div style={styles.iconCircle}>
            <i className="bi bi-person"></i>
          </div>

          <h2 style={styles.title}>Welcome Back!</h2>

          <p style={styles.subtitle}>
            Login to continue shopping
          </p>

          <form onSubmit={submit}>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <i
                  className="bi bi-envelope"
                  style={styles.inputIcon}
                ></i>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <div style={styles.passwordHeader}>
                <label style={styles.label}>
                  Password
                </label>

                {/* Forgot Password */}
                <Link
                  to="/forgot-password"
                  style={styles.forgotPassword}
                >
                  Forgot Password?
                </Link>
              </div>

              <div style={styles.inputWrapper}>
                <i
                  className="bi bi-lock"
                  style={styles.inputIcon}
                ></i>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eyeButton}
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={styles.loginButton}
              disabled={loading}
            >
              <i className="bi bi-box-arrow-in-right"></i>
              &nbsp; {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          <div style={styles.divider}>
            <span>OR</span>
          </div>

          <p style={styles.registerText}>
            New to Snapdeal?{" "}
            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <style>
        {`
          input:focus {
            outline: none !important;
          }

          @media (max-width: 768px) {
            .login-left-section {
              display: none !important;
            }

            .login-wrapper {
              justify-content: center !important;
            }

            .login-card {
              max-width: 430px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "78vh",
    background:
      "linear-gradient(135deg, #fff0f4 0%, #f5f5f5 50%, #ffe8ef 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "45px 20px",
  },

  loginWrapper: {
    width: "100%",
    maxWidth: "950px",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
  },

  leftSection: {
    width: "48%",
    background:
      "linear-gradient(145deg, #e40046, #b9003a)",
    color: "#fff",
    padding: "50px 45px",
    borderRadius: "18px 0 0 18px",
    boxShadow: "0 15px 40px rgba(228,0,70,.18)",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "55px",
  },

  logoShape: {
    width: "28px",
    height: "28px",
    background: "#fff",
    borderRadius: "6px",
    transform: "skew(-10deg)",
    marginRight: "7px",
  },

  logoText: {
    fontSize: "27px",
    fontWeight: "800",
  },

  welcomeTitle: {
    fontSize: "38px",
    lineHeight: "1.15",
    fontWeight: "800",
    marginBottom: "18px",
  },

  welcomeText: {
    fontSize: "16px",
    lineHeight: "1.7",
    opacity: 0.9,
    maxWidth: "350px",
  },

  features: {
    marginTop: "35px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
  },

  card: {
    width: "52%",
    maxWidth: "480px",
    background: "#fff",
    padding: "38px 40px",
    borderRadius: "0 18px 18px 0",
    boxShadow: "0 15px 40px rgba(0,0,0,.10)",
  },

  iconCircle: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#fff0f4",
    color: "#e40046",
    display: "grid",
    placeItems: "center",
    fontSize: "25px",
    margin: "0 auto 15px",
  },

  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "750",
    margin: "0",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "28px",
    fontSize: "14px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  passwordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "8px",
  },

  forgotPassword: {
    color: "#e40046",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    marginBottom: "8px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "9px",
    height: "48px",
    transition: "0.2s",
  },

  inputIcon: {
    color: "#999",
    marginLeft: "14px",
    marginRight: "10px",
  },

  input: {
    width: "100%",
    height: "100%",
    border: "0",
    padding: "0 10px 0 0",
    fontSize: "14px",
    background: "transparent",
  },

  eyeButton: {
    border: "0",
    background: "transparent",
    color: "#777",
    padding: "10px 14px",
    cursor: "pointer",
  },

  loginButton: {
    width: "100%",
    height: "48px",
    border: "0",
    borderRadius: "9px",
    background: "#e40046",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    marginTop: "5px",
    cursor: "pointer",
  },

  divider: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "25px 0",
    color: "#aaa",
    fontSize: "12px",
  },

  registerText: {
    textAlign: "center",
    color: "#777",
    fontSize: "14px",
    margin: "0",
  },

  registerLink: {
    color: "#e40046",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Login;