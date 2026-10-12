import { useMemo, useState } from "react";

function SecurityEventExplorer({ events, onSelectEvent }) {

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredEvents = useMemo(() => {

    return events.filter((event) => {

      const searchText = search.toLowerCase();

      const matchesSearch =
        event.eventType?.toLowerCase().includes(searchText) ||
        event.source?.toLowerCase().includes(searchText) ||
        event.description?.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "ALL" ||
        event.severity === severityFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        event.status === statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });

  }, [events, search, severityFilter, statusFilter]);

  return (
    <section className="panel">

      <div className="panel-header">

        <div>
          <h2>🔎 Security Event Explorer</h2>

          <p>
            Search and investigate detected security events
          </p>
        </div>

        <span className="status-badge">
          {filteredEvents.length} Results
        </span>

      </div>

      <div className="event-filters">

        <div className="form-group">

          <label>Search Events</label>

          <input
            type="text"
            placeholder="Search event, IP, description..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="form-group">

          <label>Severity</label>

          <select
            className="role-select"
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >

            <option value="ALL">
              ALL
            </option>

            <option value="CRITICAL">
              CRITICAL
            </option>

            <option value="HIGH">
              HIGH
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="LOW">
              LOW
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Status</label>

          <select
            className="role-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="ALL">
              ALL
            </option>

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

      </div>

      {filteredEvents.length === 0 ? (

        <p className="empty">
          No matching security events found.
        </p>

      ) : (

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Event Type</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Description</th>
                <th>Status</th>
                <th>Time</th>
              </tr>

            </thead>

            <tbody>

              {filteredEvents.map((event) => (

                <tr
                  key={event.id}
                    className="event-row"
                  onClick={() => onSelectEvent(event)}
                >

                  <td>
                    #{event.id}
                  </td>

                  <td>
                    <strong>
                      {event.eventType}
                    </strong>
                  </td>

                  <td>

                    <span
                      className={`severity ${
                        event.severity?.toLowerCase()
                      }`}
                    >
                      {event.severity}
                    </span>

                  </td>

                  <td>
                    {event.source || "-"}
                  </td>

                  <td>
                    {event.description || "-"}
                  </td>

                  <td>

                    <span className="status-badge">
                      {event.status || "OPEN"}
                    </span>

                  </td>

                  <td>
                    {event.timestamp
                      ? new Date(
                          event.timestamp
                        ).toLocaleString()
                      : "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default SecurityEventExplorer;