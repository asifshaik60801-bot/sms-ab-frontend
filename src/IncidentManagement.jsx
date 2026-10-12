
import { useEffect, useState } from "react";
import api from "./api.js";

function IncidentManagement() {
  const [incidents, setIncidents] = useState([]);

  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("HIGH");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadIncidents = async () => {
    try {
      const response = await api.get("/api/incidents");
      setIncidents(response.data);
      setError("");
    } catch (error) {
      console.error("Incident loading error:", error);
      setError("Unable to load incidents.");
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const createIncident = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title || !description || !assignedTo) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/incidents", {
        title,
        severity,
        description,
        assignedTo,
        status: "OPEN"
      });

      setMessage("Incident created successfully!");

      setTitle("");
      setSeverity("HIGH");
      setDescription("");
      setAssignedTo("");

      await loadIncidents();
    } catch (error) {
      console.error("Incident creation error:", error);

      if (error.response?.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Unable to create incident."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setMessage("");
      setError("");

      await api.put(`/api/incidents/${id}`, {
        status
      });

      setMessage(`Incident #${id} updated to ${status}.`);

      await loadIncidents();
    } catch (error) {
      console.error("Incident update error:", error);
      setError("Unable to update incident.");
    }
  };

  const getSeverityClass = (value) => {
    return `incident-severity ${
      value?.toLowerCase() || "low"
    }`;
  };

  const getStatusClass = (value) => {
    return `incident-status ${
      value?.toLowerCase() || "open"
    }`;
  };

  return (
    <section className="panel incident-response-panel">

      {/* HEADER */}
      <div className="panel-header incident-panel-header">

        <div>
          <div className="incident-kicker">
            SOC / INCIDENT RESPONSE
          </div>

          <h2>🔥 Incident Response</h2>

          <p>
            Create, investigate and resolve security incidents
          </p>
        </div>

        <div className="incident-header-right">

          <div className="incident-live">
            <span className="incident-live-dot"></span>
            RESPONSE CENTER
          </div>

          <button
            className="refresh-button incident-refresh-btn"
            onClick={loadIncidents}
          >
            ↻ Refresh
          </button>

        </div>

      </div>


      {/* MESSAGES */}

      {message && (
        <div className="incident-success">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="incident-error">
          <span>⚠</span>
          {error}
        </div>
      )}


      {/* CREATE INCIDENT */}

      <div className="incident-create-box">

        <div className="incident-create-header">

          <div>
            <span className="create-icon">＋</span>

            <div>
              <h3>Create Security Incident</h3>

              <p>
                Register a new incident for investigation
              </p>
            </div>
          </div>

          <span className="create-label">
            NEW INCIDENT
          </span>

        </div>


        <form onSubmit={createIncident}>

          <div className="incident-form-grid">

            {/* TITLE */}
            <div className="form-group incident-form-group">

              <label>
                INCIDENT TITLE
              </label>

              <input
                type="text"
                placeholder="Example: Suspicious Login Investigation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>


            {/* SEVERITY */}
            <div className="form-group incident-form-group">

              <label>
                SEVERITY
              </label>

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value)
                }
                className="incident-select"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

            </div>


            {/* ASSIGNED TO */}
            <div className="form-group incident-form-group">

              <label>
                ASSIGNED TO
              </label>

              <input
                type="text"
                placeholder="Example: Security Team"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
              />

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group incident-form-group">

            <label>
              INCIDENT DESCRIPTION
            </label>

            <textarea
              rows="4"
              placeholder="Describe the incident, affected systems and investigation details..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>


          {/* SUBMIT */}

          <div className="incident-form-footer">

            <div className="incident-form-note">
              <span>●</span>
              Incident will be created with OPEN status
            </div>

            <button
              type="submit"
              className="create-incident-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Incident..."
                : "🔥 Create Incident"}
            </button>

          </div>

        </form>

      </div>


      {/* CURRENT INCIDENTS */}

      <div className="incident-list">

        <div className="incident-list-header">

          <div>
            <div className="incident-list-kicker">
              ACTIVE CASES
            </div>

            <h3>Current Incidents</h3>
          </div>

          <div className="incident-count">
            <strong>{incidents.length}</strong>
            <span>CASES</span>
          </div>

        </div>


        {incidents.length === 0 ? (

          <div className="incident-empty">

            <div className="incident-empty-icon">
              ✓
            </div>

            <h3>No Active Incidents</h3>

            <p>
              Security incidents will appear here when created.
            </p>

          </div>

        ) : (

          <div className="table-container incident-table-container">

            <table className="incident-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>INCIDENT</th>
                  <th>SEVERITY</th>
                  <th>STATUS</th>
                  <th>ASSIGNED TO</th>
                  <th>ACTION</th>
                </tr>

              </thead>

              <tbody>

                {incidents.map((incident) => (

                  <tr key={incident.id}>

                    {/* ID */}
                    <td className="incident-id">
                      #{incident.id}
                    </td>


                    {/* TITLE */}
                    <td>

                      <div className="incident-title-cell">

                        <div className="incident-title-icon">
                          ⚠
                        </div>

                        <div>

                          <div className="incident-title">
                            {incident.title}
                          </div>

                          <div className="incident-subtitle">
                            Security incident
                          </div>

                        </div>

                      </div>

                    </td>


                    {/* SEVERITY */}
                    <td>

                      <span
                        className={getSeverityClass(
                          incident.severity
                        )}
                      >
                        <span className="incident-dot"></span>

                        {incident.severity}
                      </span>

                    </td>


                    {/* STATUS */}
                    <td>

                      <span
                        className={getStatusClass(
                          incident.status
                        )}
                      >
                        <span className="incident-dot"></span>

                        {incident.status}
                      </span>

                    </td>


                    {/* ASSIGNED */}
                    <td>

                      <div className="incident-assignee">

                        <div className="assignee-avatar">
                          {(incident.assignedTo || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {incident.assignedTo || "-"}
                        </span>

                      </div>

                    </td>


                    {/* ACTION */}
                    <td>

                      {incident.status !== "RESOLVED" ? (

                        <select
                          className="incident-status-select"
                          value={incident.status}
                          onChange={(e) =>
                            updateStatus(
                              incident.id,
                              e.target.value
                            )
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

                      ) : (

                        <span className="resolved-label">
                          ✓ RESOLVED
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* FOOTER */}

      {incidents.length > 0 && (

        <div className="incident-footer">

          <span>
            ● INCIDENT RESPONSE ACTIVE
          </span>

          <span>
            {incidents.filter(
              (i) => i.status !== "RESOLVED"
            ).length} ACTIVE CASES
          </span>

        </div>

      )}

    </section>
  );
}

export default IncidentManagement;

