import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save logged-in user temporarily
      localStorage.setItem(
  "SecureXUser",
  JSON.stringify(response.data)
);

localStorage.setItem(
  "secureXToken",
  response.data.token
);

onLogin(response.data);
      onLogin(response.data);

    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Invalid email or password"
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-logo">
          🛡️
        </div>

        <h1>🛡️ SecureX</h1>

        <p className="login-subtitle">
          Cybersecurity Monitoring & Incident Response Platform
        </p>

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-description">
            Sign in to access your security dashboard
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <div className="register-link">
            <span>Don't have an account?</span>

            <button onClick={onShowRegister}>
              Create Account
            </button>
          </div>

        </div>

        <p className="security-text">
          🔒 Secure access to CyberSentinel
        </p>

      </div>

    </div>
  );
}

export default Login;