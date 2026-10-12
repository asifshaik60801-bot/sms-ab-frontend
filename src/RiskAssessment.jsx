import { useEffect, useState } from "react";
import api from "./api.js";

function RiskAssessment({ onRiskCreated }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      const response = await api.get("/api/security-events");
      setEvents(response.data);
    } catch (error) {
      console.error("Event loading error:", error);
      setError("Unable to load security events.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const calculateRisk = async () => {
    if (!selectedEvent) {
      setError("Please select a security event.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setRisk(null);

    try {
      const response = await api.post(
        `/api/risk-assessments/${selectedEvent}`
      );

      setRisk(response.data);
      setMessage("Risk assessment created successfully!");
        if (onRiskCreated) {
            onRiskCreated();
        }
    } catch (error) {
      console.error("Risk assessment error:", error);

      if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Unable to create risk assessment."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">

      <div className="panel-header">
        <div>
          <h2>🎯 Risk Assessment</h2>
          <p>
            Analyze security events and calculate their risk level
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

      <div className="form-group">

        <label>Select Security Event</label>

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="role-select"
        >

          <option value="">
            Select an event
          </option>

          {events.map((event) => (
            <option
              key={event.id}
              value={event.id}
            >
              #{event.id} - {event.eventType} - {event.severity}
            </option>
          ))}

        </select>

      </div>

      <button
        className="refresh-button"
        onClick={calculateRisk}
        disabled={loading}
      >
        {loading
          ? "Calculating..."
          : "🎯 Calculate Risk"}
      </button>

      {risk && (
        <div className="risk-result">

          <h3>Risk Assessment Result</h3>

          <div className="risk-details">

            <div>
              <span>Event ID</span>
              <strong>
                {risk.securityEventId || selectedEvent}
              </strong>
            </div>

            <div>
              <span>Risk Score</span>
              <strong>
                {risk.riskScore}
              </strong>
            </div>

            <div>
              <span>Risk Level</span>
              <strong>
                {risk.riskLevel}
              </strong>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default RiskAssessment;