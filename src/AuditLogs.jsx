
import { useEffect, useState } from "react";
import api from "./api.js";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      const response = await api.get("/api/audit-logs");

      setLogs(response.data);
      setError("");
    } catch (error) {
      console.error("Audit log error:", error);
      setError("Unable to load audit logs.");
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <section className="panel audit-logs-panel">

      {/* HEADER */}
      <div className="panel-header audit-panel-header">
        <div>
          <div className="audit-kicker">SECURITY MONITORING</div>

          <h2>📋 Security Audit Logs</h2>

          <p>
            Track important security and administrative actions
          </p>
        </div>

        <button
          className="refresh-button audit-refresh-btn"
          onClick={loadLogs}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="audit-error">
          <span>⚠</span>
          {error}
        </div>
      )}

      {/* EMPTY */}
      {logs.length === 0 ? (

        <div className="audit-empty">
          <div className="audit-empty-icon">▤</div>

          <h3>No Audit Logs Found</h3>

          <p>
            Security and administrative activities will appear here.
          </p>
        </div>

      ) : (

        /* TABLE */
        <div className="table-container audit-table-container">

          <table className="audit-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>User</th>
                <th>Description</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>

              {logs
                .slice()
                .reverse()
                .map((log) => {

                  const action =
                    log.action?.toUpperCase() || "UNKNOWN";

                  const actionClass =
                    action.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <tr key={log.id}>

                      {/* ID */}
                      <td className="audit-id">
                        #{log.id}
                      </td>

                      {/* ACTION */}
                      <td>
                        <span
                          className={`audit-action ${actionClass}`}
                        >
                          <span className="action-dot"></span>
                          {action}
                        </span>
                      </td>

                      {/* USER */}
                      <td>
                        <div className="audit-user">

                          <div className="audit-user-avatar">
                            {(log.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {log.username || "Unknown"}
                          </span>

                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="audit-description">
                        {log.description || "-"}
                      </td>

                      {/* IP */}
                      <td>
                        <span className="audit-ip">
                          {log.ipAddress || "-"}
                        </span>
                      </td>

                      {/* TIMESTAMP */}
                      <td>
                        <span className="audit-time">
                          {log.timestamp
                            ? new Date(
                                log.timestamp
                              ).toLocaleString()
                            : "-"}
                        </span>
                      </td>

                    </tr>
                  );
                })}

            </tbody>

          </table>

        </div>
      )}

      {/* FOOTER */}
      {logs.length > 0 && (
        <div className="audit-footer">
          <span>
            ● {logs.length} audit {logs.length === 1 ? "entry" : "entries"}
          </span>

          <span>
            LIVE SECURITY RECORD
          </span>
        </div>
      )}

    </section>
  );
}

export default AuditLogs;

