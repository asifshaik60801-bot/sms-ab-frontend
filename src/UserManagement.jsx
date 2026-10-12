
import { useEffect, useState } from "react";
import api from "./api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
      setError("");
    } catch (error) {
      console.error("User API error:", error);
      setError("Unable to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      setUpdatingId(id);

      await api.put(
        `/api/users/${id}/role?role=${role}`
      );

      await loadUsers();
    } catch (error) {
      console.error("Role update error:", error);
      alert("Unable to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleClass = (role) => {
    return `user-role ${role?.toLowerCase() || "viewer"}`;
  };

  return (
    <section className="panel user-management-panel">

      {/* HEADER */}
      <div className="panel-header user-management-header">

        <div>
          <div className="user-management-kicker">
            ADMINISTRATION / ACCESS CONTROL
          </div>

          <h2>👥 User Management</h2>

          <p>
            Manage CyberSentinel user roles and access permissions
          </p>
        </div>

        <div className="user-count">
          <span className="user-count-dot"></span>
          {users.length} USERS
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="user-management-error">
          <span>⚠</span>
          {error}
        </div>
      )}

      {/* EMPTY */}
      {users.length === 0 ? (

        <div className="user-management-empty">

          <div className="user-empty-icon">
            👥
          </div>

          <h3>No Users Found</h3>

          <p>
            Registered CyberSentinel users will appear here.
          </p>

        </div>

      ) : (

        /* TABLE */
        <div className="table-container user-table-container">

          <table className="user-management-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>EMAIL</th>
                <th>CURRENT ROLE</th>
                <th>CHANGE ROLE</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  {/* ID */}
                  <td className="user-id">
                    #{user.id}
                  </td>

                  {/* NAME */}
                  <td>
                    <div className="managed-user">

                      <div className="managed-user-avatar">
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="managed-user-name">
                        {user.name || "Unknown"}
                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td>
                    <span className="managed-user-email">
                      {user.email || "-"}
                    </span>
                  </td>

                  {/* CURRENT ROLE */}
                  <td>
                    <span className={getRoleClass(user.role)}>
                      <span className="role-status-dot"></span>
                      {user.role}
                    </span>
                  </td>

                  {/* CHANGE ROLE */}
                  <td>

                    <div className="role-control">

                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          updateRole(
                            user.id,
                            e.target.value
                          )
                        }
                        className="role-select"
                      >

                        <option value="VIEWER">
                          VIEWER
                        </option>

                        <option value="ANALYST">
                          ANALYST
                        </option>

                        <option value="ADMIN">
                          ADMIN
                        </option>

                      </select>

                      {updatingId === user.id && (
                        <span className="role-updating">
                          Updating...
                        </span>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* FOOTER */}
      {users.length > 0 && (
        <div className="user-management-footer">

          <span>
            ● ACCESS CONTROL ACTIVE
          </span>

          <span>
            ADMINISTRATOR ONLY
          </span>

        </div>
      )}

    </section>
  );
}

export default UserManagement;

