import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.auth.resetPassword({
        email: email.trim(),
        newPassword,
      });

      alert("Password changed successfully! Please login.");

      navigate("/login");
    } catch (err) {
      alert(err.message || "Could not change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.iconCircle}>
          <i className="bi bi-shield-lock"></i>
        </div>

        <h2 style={styles.title}>
          Reset Password
        </h2>

        <p style={styles.subtitle}>
          Create a new password for your account
        </p>

        <form onSubmit={resetPassword}>

          
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address
            </label>

            <div style={styles.inputWrapper}>
              <i
                className="bi bi-envelope"
                style={styles.icon}
              ></i>

              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

        
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              New Password
            </label>

            <div style={styles.inputWrapper}>
              <i
                className="bi bi-lock"
                style={styles.icon}
              ></i>

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                style={styles.input}
                required
              />

              <button
                type="button"
                style={styles.eyeButton}
                onClick={() =>
                  setShowNewPassword(!showNewPassword)
                }
              >
                <i
                  className={
                    showNewPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </div>

         
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Confirm New Password
            </label>

            <div style={styles.inputWrapper}>
              <i
                className="bi bi-lock-fill"
                style={styles.icon}
              ></i>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                style={styles.input}
                required
              />

              <button
                type="button"
                style={styles.eyeButton}
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <i
                  className={
                    showConfirmPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </div>

         
          <button
            type="submit"
            style={styles.resetButton}
            disabled={loading}
          >
            <i className="bi bi-check-circle"></i>
            &nbsp; {loading ? "UPDATING..." : "RESET PASSWORD"}
          </button>
        </form>

        <div style={styles.back}>
          <Link
            to="/login"
            style={styles.backLink}
          >
            <i className="bi bi-arrow-left"></i>
            &nbsp; Back to Login
          </Link>
        </div>

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
      "linear-gradient(135deg, #fff0f4, #f5f5f5, #ffe8ef)",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,.12)",
  },

  iconCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#fff0f4",
    color: "#e40046",
    display: "grid",
    placeItems: "center",
    fontSize: "28px",
    margin: "0 auto 18px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    fontSize: "28px",
    fontWeight: "750",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: "14px",
    marginBottom: "28px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#444",
  },

  inputWrapper: {
    height: "48px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "9px",
  },

  icon: {
    color: "#999",
    marginLeft: "14px",
    marginRight: "10px",
  },

  input: {
    width: "100%",
    height: "100%",
    border: "0",
    outline: "none",
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

  resetButton: {
    width: "100%",
    height: "48px",
    border: "0",
    borderRadius: "9px",
    background: "#e40046",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "5px",
  },

  back: {
    textAlign: "center",
    marginTop: "25px",
  },

  backLink: {
    color: "#e40046",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default ForgotPassword;