import { useEffect, useState } from "react";
import api from "../api";

function AdminUsers({ onBack }) {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/admin/users");

      setUsers(response.data);

    } catch (err) {

      console.error(
        "Failed to load users:",
        err
      );

      setError(
        err.response?.data ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }
  };


  const deleteUser = async (user) => {

    const confirmed =
      window.confirm(
        `Delete ${user.name || user.username}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(user.id);

      await api.delete(
        `/admin/users/${user.id}`
      );

      setUsers(
        previous =>
          previous.filter(
            item =>
              item.id !== user.id
          )
      );

    } catch (err) {

      alert(
        err.response?.data ||
        "Failed to delete user"
      );

    } finally {

      setDeleting(null);

    }
  };


  const filteredUsers =
    users.filter(user => {

      const value =
        search.toLowerCase();

      return (
        user.name
          ?.toLowerCase()
          .includes(value) ||

        user.username
          ?.toLowerCase()
          .includes(value) ||

        user.email
          ?.toLowerCase()
          .includes(value)
      );

    });


  if (loading) {

    return (
      <div className="admin-section-page">

        <div className="admin-section-loading">
          Loading users...
        </div>

      </div>
    );
  }


  return (
    <div className="admin-section-page">

      {/* HEADER */}

      <div className="admin-section-header">

        <div>

          <span className="admin-section-label">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage SocialPulse users and accounts.
          </p>

        </div>


        <button
          className="admin-back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </div>


      {/* SEARCH */}

      <div className="admin-users-toolbar">

        <div className="admin-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by name, username or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="admin-user-count">

          <strong>
            {filteredUsers.length}
          </strong>

          <span>
            users
          </span>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="admin-section-error">
          {error}
        </div>

      )}


      {/* TABLE */}

      <div className="admin-users-card">

        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Role
                </th>

                <th>
                  Location
                </th>

                <th>
                  Joined
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="admin-table-empty"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                filteredUsers.map(user => (

                  <tr key={user.id}>

                    <td>

                      <div className="admin-user-cell">

                        <div className="admin-user-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div>

                          <strong>
                            {user.name ||
                              "Unnamed User"}
                          </strong>

                          <span>
                            @{user.username}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {user.email}
                    </td>


                    <td>

                      <span
                        className={
                          user.role === "ADMIN"
                            ? "admin-role-badge"
                            : "user-role-badge"
                        }
                      >
                        {user.role || "USER"}
                      </span>

                    </td>


                    <td>

                      {user.state ||
                        user.country ||
                        "—"}

                    </td>


                    <td>

                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"}

                    </td>


                    <td>

                      <button
                        className="admin-delete-user"
                        disabled={
                          deleting === user.id
                        }
                        onClick={() =>
                          deleteUser(user)
                        }
                      >
                        {deleting === user.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;