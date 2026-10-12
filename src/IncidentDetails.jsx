
import { useState } from "react";
import api from "./api.js";

function IncidentDetails({ incident, onClose, onUpdated }) {

  const [status, setStatus] = useState(
    incident.status || "OPEN"
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateStatus = async () => {

    setLoading(true);
    setMessage("");
    setError("");

    try {

      await api.put(`/api/incidents/${incident.id}`, {

        title: incident.title,

        description:
          incident.description || "",

        severity:
          incident.severity || "MEDIUM",

        status: status,

        assignedTo:
          incident.assignedTo || "Security Team"

      });

      setMessage(
        "Incident status updated successfully."
      );

      if (onUpdated) {
        onUpdated();
      }

    } catch (err) {

      console.error(
        "Incident update error:",
        err
      );

      console.error(
        "Server response:",
        err.response?.data
      );

      setError(
        "Unable to update incident."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <section className="panel investigation-panel">

      <div className="panel-header">

        <div>

          <h2>🔥 Incident Investigation</h2>

          <p>
            Investigate and manage security incidents
          </p>

        </div>

        <button
          className="secondary-button"
          onClick={onClose}
        >
          ✕ Close
        </button>

      </div>


      <div className="investigation-grid">

        <div className="investigation-item">
          <span>Incident ID</span>
          <strong>#{incident.id}</strong>
        </div>

        <div className="investigation-item">
          <span>Incident Title</span>
          <strong>{incident.title}</strong>
        </div>

        <div className="investigation-item">
          <span>Severity</span>

          <strong
            className={`severity ${
              incident.severity?.toLowerCase()
            }`}
          >
            {incident.severity || "MEDIUM"}
          </strong>
        </div>

        <div className="investigation-item">
          <span>Assigned To</span>

          <strong>
            {incident.assignedTo || "-"}
          </strong>
        </div>

        <div className="investigation-item">
          <span>Current Status</span>

          <strong>
            {incident.status || "OPEN"}
          </strong>
        </div>

        <div className="investigation-item">
          <span>Created At</span>

          <strong>
            {incident.createdAt
              ? new Date(
                  incident.createdAt
                ).toLocaleString()
              : "-"
            }
          </strong>
        </div>

      </div>


      <div className="investigation-description">

        <h3>Incident Description</h3>

        <p>
          {incident.description ||
            "No description available."
          }
        </p>

      </div>


      <div className="investigation-actions">

        <h3>
          🔄 Incident Response Action
        </h3>


        <div className="form-row">

          <div className="form-group">

            <label>
              Update Incident Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option value="OPEN">
                OPEN
              </option>

              <option value="INVESTIGATING">
                INVESTIGATING
              </option>

              <option value="RESOLVED">
                RESOLVED
              </option>

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
                : "Update Incident"
              }

            </button>

          </div>

        </div>


        <div className="incident-action">

          <h3>
            🛡️ Response Workflow
          </h3>

          <p>
            Track the incident from detection
            through investigation and final resolution.
          </p>

          <div className="incident-workflow">

            <span
              className={
                status === "OPEN"
                  ? "workflow-step active"
                  : "workflow-step"
              }
            >
              🚨 Detected
            </span>

            <span>→</span>

            <span
              className={
                status === "INVESTIGATING"
                  ? "workflow-step active"
                  : "workflow-step"
              }
            >
              🔍 Investigating
            </span>

            <span>→</span>

            <span
              className={
                status === "RESOLVED"
                  ? "workflow-step active"
                  : "workflow-step"
              }
            >
              ✅ Resolved
            </span>

          </div>

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

export default IncidentDetails;

