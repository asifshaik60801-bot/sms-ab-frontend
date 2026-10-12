
import { useState } from "react";
import api from "./api.js";

function SecurityEventDetails({ event, onClose, onUpdated }) {
  const [status, setStatus] = useState(event.status || "OPEN");
  const [loading, setLoading] = useState(false);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateStatus = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.put(`/api/security-events/${event.id}`, {
        eventType: event.eventType,
        severity: event.severity,
        source: event.source,
        description: event.description,
        status: status
      });

      setMessage("Security event status updated successfully.");

      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError("Unable to update security event.");
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async () => {
    setIncidentLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/api/incidents", {
        title: `${event.eventType} Incident`,
        description:
          `Security incident created from Event #${event.id}. ` +
          `${event.description || "No additional description available."}`,
        severity: event.severity,
        status: "OPEN",
        assignedTo: "Security Team"
      });

      setMessage(
        `Incident created successfully from Security Event #${event.id}.`
      );
    } catch (err) {
      console.error("Incident creation error:", err);
      setError("Unable to create incident from this security event.");
    } finally {
      setIncidentLoading(false);
    }
  };

  return (
    <section className="panel investigation-panel">

      <div className="panel-header">
        <div>
          <h2>🔍 Event Investigation</h2>
          <p>Detailed security event investigation</p>
        </div>

        <button className="secondary-button" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      <div className="investigation-grid">

        <div className="investigation-item">
          <span>Event ID</span>
          <strong>#{event.id}</strong>
        </div>

        <div className="investigation-item">
          <span>Event Type</span>
          <strong>{event.eventType}</strong>
        </div>

        <div className="investigation-item">
          <span>Severity</span>
          <strong className={`severity ${event.severity?.toLowerCase()}`}>
            {event.severity}
          </strong>
        </div>

        <div className="investigation-item">
          <span>Source</span>
          <strong>{event.source || "-"}</strong>
        </div>

        <div className="investigation-item">
          <span>Current Status</span>
          <strong>{event.status || "OPEN"}</strong>
        </div>

        <div className="investigation-item">
          <span>Detected At</span>
          <strong>
            {event.timestamp
              ? new Date(event.timestamp).toLocaleString()
              : "-"}
          </strong>
        </div>

      </div>

      <div className="investigation-description">
        <h3>Event Description</h3>
        <p>{event.description || "No description available."}</p>
      </div>

      <div className="investigation-actions">

        <h3>Investigation Action</h3>

        <div className="form-row">

          <div className="form-group">
            <label>Update Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="form-group investigation-button">
            <button
              className="primary-button"
              onClick={updateStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Investigation"}
            </button>
          </div>

        </div>

        <div className="incident-action">
          <h3>🚨 Incident Response</h3>

          <p>
            Create an incident ticket from this security event for further
            investigation and response.
          </p>

          <button
            className="incident-button"
            onClick={createIncident}
            disabled={incidentLoading}
          >
            {incidentLoading
              ? "Creating Incident..."
              : "🚨 Create Incident"}
          </button>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

      </div>

    </section>
  );
}

export default SecurityEventDetails;
