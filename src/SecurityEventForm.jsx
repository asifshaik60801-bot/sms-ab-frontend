import { useState } from "react";
import api from "./api.js";

function SecurityEventForm({ onEventCreated }) {

  const [eventType, setEventType] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!eventType || !source || !description) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {

      const response = await api.post(
        "/api/security-events",
        {
          eventType,
          severity,
          source,
          description
        }
      );

      console.log("Security event created:", response.data);

      setMessage(
        "Security event created successfully!"
      );

      // Clear form
      setEventType("");
      setSeverity("LOW");
      setSource("");
      setDescription("");

      // Refresh dashboard
      if (onEventCreated) {
        onEventCreated();
      }

    } catch (error) {

      console.error(
        "Security event creation error:",
        error
      );

      if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Unable to create security event."
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <section className="panel">

      <div className="panel-header">

        <div>

          <h2>🛡️ Create Security Event</h2>

          <p>
            Report and monitor suspicious security activity
          </p>

        </div>

      </div>

      {message && (
        <div className="success-message">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-row">

          <div className="form-group">

            <label>Event Type</label>

            <select
              value={eventType}
              onChange={(e) =>
                setEventType(e.target.value)
              }
              className="role-select"
            >

              <option value="">
                Select Event Type
              </option>

              <option value="SUSPICIOUS_LOGIN">
                Suspicious Login
              </option>

              <option value="BRUTE_FORCE">
                Brute Force Attack
              </option>

              <option value="MALWARE_DETECTED">
                Malware Detected
              </option>

              <option value="UNAUTHORIZED_ACCESS">
                Unauthorized Access
              </option>

              <option value="DATA_BREACH">
                Data Breach
              </option>

              <option value="PORT_SCAN">
                Port Scan
              </option>

              <option value="PHISHING_ATTEMPT">
                Phishing Attempt
              </option>

              <option value="SUSPICIOUS_IP">
                Suspicious IP
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>Severity</label>

            <select
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value)
              }
              className="role-select"
            >

              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

              <option value="CRITICAL">
                CRITICAL
              </option>

            </select>

          </div>

        </div>


        <div className="form-group">

          <label>Source</label>

          <input
            type="text"
            placeholder="Example: 192.168.1.50"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
          />

        </div>


        <div className="form-group">

          <label>Description</label>

          <textarea
            placeholder="Describe the security event..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="4"
          />

        </div>


        <button
          type="submit"
          className="refresh-button"
          disabled={loading}
        >

          {loading
            ? "Creating Event..."
            : "🚨 Create Security Event"}

        </button>

      </form>

    </section>

  );
}

export default SecurityEventForm;