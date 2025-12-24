"use client";

import { useEffect, useState } from "react";
import ui from "@/styles/ui.module.css";
import t from "@/styles/adminTables.module.css";
import { apiJson } from "@/lib/apiClient";

const ALL_ROLES = ["Admin", "Editor", "Viewer"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchUsers() {
    setLoading(true);
    setError("");

    try {
      const data = await apiJson("/admin/users/");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateRoles(userId, roles) {
    try {
      await apiJson(`/admin/users/${userId}/`, {
        method: "PATCH",
        body: JSON.stringify({ roles }),
      });
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement des utilisateurs…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={ui.pageNarrow}>
        <div className={ui.panel}>
          <span className={ui.error}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageWide}>
        <header className={ui.hero}>
          <h1 className={ui.title}>Utilisateurs & rôles</h1>
          <p className={ui.subtitle}>
            Gérez les rôles des utilisateurs enregistrés.
          </p>
        </header>

        <div className={ui.panel}>
          <div className={t.tableWrapper}>
            <table className={t.table}>
              <thead>
                <tr>
                  <th className={t.th}>Username</th>
                  <th className={t.th}>Email</th>
                  <th className={t.th}>Rôle</th>
                  <th className={t.th}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={t.tr}>
                    <td className={t.td}>{user.username}</td>
                    <td className={t.td}>{user.email || "—"}</td>
                    <td className={t.td}>
                      <div className={t.roleSelectWrapper}>
                        <select
                          className={ui.input}
                          value={user.roles_display?.[0] || "Viewer"}
                          onChange={(e) => updateRoles(user.id, [e.target.value])}
                        >
                          {ALL_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className={`${t.td} ${t.statusDim}`}>
                      {user.is_superuser ? "Superuser" : user.is_staff ? "Staff" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}