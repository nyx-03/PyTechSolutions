"use client";

import { useEffect, useState } from "react";
import ui from "@/styles/ui.module.css";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

const ALL_ROLES = ["Admin", "Editor", "Viewer"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchUsers() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/admin/users/`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Impossible de charger les utilisateurs");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateRoles(userId, roles) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ roles }),
      });

      if (!res.ok) {
        throw new Error("Échec de la mise à jour des rôles");
      }

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
        <h1 className={ui.title}>Utilisateurs & rôles</h1>
        <p className={ui.text} style={{ marginTop: 8 }}>
          Gérez les rôles des utilisateurs enregistrés.
        </p>

        <div className={ui.panel} style={{ marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Username</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Email</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Rôle</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <td style={{ padding: "10px 12px" }}>{user.username}</td>
                  <td style={{ padding: "10px 12px" }}>{user.email || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ minWidth: 180 }}>
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
                  <td style={{ padding: "10px 12px", opacity: 0.7 }}>
                    {user.is_superuser ? "Superuser" : user.is_staff ? "Staff" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}