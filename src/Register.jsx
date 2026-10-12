import { useState } from "react";
import "./Login.css";
import api from "./api.js";

function Register({ onRegisterSuccess, onShowLogin }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (e) => {
e.preventDefault();


setError("");
setSuccess("");

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

if (password.length < 6) {
  setError("Password must contain at least 6 characters.");
  return;
}

setLoading(true);

try {
  await api.post("/api/auth/register", {
    name,
    email,
    password,
  });

  setSuccess("Account created successfully! You can now log in.");

  setName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
} catch (error) {
  console.error("Registration error:", error);

  if (error.response) {
    setError(
      typeof error.response.data === "string"
        ? error.response.data
        : error.response.status === 409
        ? "An account with this email may already exist."
        : "Registration failed. Please check your details and try again."
    );
  } else {
    setError("Unable to connect to the server. Please try again.");
  }
} finally {
  setLoading(false);
}


};

return ( <div className="login-page"> <div className="login-container"> <div className="login-logo">🛡️</div>

```
    <h1>SecureX</h1>

    <p className="login-subtitle">
      Cybersecurity Monitoring & Incident Response Platform
    </p>

    <div className="login-card">
      <h2>Create Account</h2>

      <p className="login-description">
        Register to access SecureX
      </p>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="register-name">Full Name</label>

          <input
            id="register-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>

          <input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>

          <input
            id="register-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>

          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="register-link">
        <span>Already have an account?</span>

        <button type="button" onClick={onShowLogin}>
          Sign In
        </button>
      </div>
    </div>

    <p className="security-text">
      🔒 Your account is protected by SecureX
    </p>
  </div>
</div>

);
}

export default Register;
