
import { useState } from "react";
import api from "./api.js";

function AlertDetails({ alert, onClose, onUpdated }) {
  const [status, setStatus] = useState(alert.status || "OPEN");
  const [loading, setLoading] = useState(false);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateStatus = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.put(`/api/alerts/${alert.id}`, {
        title: alert.title,
        severity: alert.severity,
        source: alert.source,
        description: alert.description,
        status: status
      });

      setMessage("Alert status updated successfully.");

      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      console.error("Alert status update error:", err);
      setError("Unable to update alert.");
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
        title: `${alert.title} Incident`,
        description:
          `Incident created from Alert #${alert.id}. ` +
          `${alert.description || "No additional description available."}`,
        severity: alert.severity,
        status: "OPEN",
        assignedTo: "Security Team"
      });

      setMessage(
        `Incident created successfully from Alert #${alert.id}.`
      );
    } catch (err) {
      console.error("Incident creation error:", err);
      setError("Unable to create incident from this alert.");
    } finally {
      setIncidentLoading(false);
    }
  };

  return (
    <section className="panel investigation-panel">

      <div className="panel-header">
        <div>
          <h2>🚨 Alert Investigation</h2>
          <p>Detailed security alert investigation</p>
        </div>

        <button className="secondary-button" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      <div className="investigation-grid">

        <div className="investigation-item">
          <span>Alert ID</span>
          <strong>#{alert.id}</strong>
        </div>

        <div className="investigation-item">
          <span>Alert Title</span>
          <strong>{alert.title}</strong>
        </div>

        <div className="investigation-item">
          <span>Severity</span>
          <strong
            className={`severity ${alert.severity?.toLowerCase()}`}
          >
            {alert.severity}
          </strong>
        </div>

        <div className="investigation-item">
          <span>Source</span>
          <strong>{alert.source || "-"}</strong>
        </div>

        <div className="investigation-item">
          <span>Current Status</span>
          <strong>{alert.status || "OPEN"}</strong>
        </div>

        <div className="investigation-item">
          <span>Created At</span>
          <strong>
            {alert.createdAt
              ? new Date(alert.createdAt).toLocaleString()
              : "-"}
          </strong>
        </div>

      </div>

      <div className="investigation-description">
        <h3>Alert Description</h3>

        <p>
          {alert.description || "No description available."}
        </p>
      </div>

      <div className="investigation-actions">

        <h3>🔄 Alert Investigation Action</h3>

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
              {loading
                ? "Updating..."
                : "Update Alert"}
            </button>
          </div>

        </div>

        <div className="incident-action">

          <h3>🔥 Incident Response</h3>

          <p>
            Create an incident from this alert for further
            investigation and response.
          </p>

          <button
            className="incident-button"
            onClick={createIncident}
            disabled={incidentLoading}
          >
            {incidentLoading
              ? "Creating Incident..."
              : "🔥 Create Incident"}
          </button>

        </div>

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

      </div>

    </section>
  );
}

export default AlertDetails;
