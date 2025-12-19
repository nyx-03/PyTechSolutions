"use client";

import { useEffect, useState } from "react";

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
    return <p>Chargement des utilisateurs…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Utilisateurs & rôles</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Username</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Rôle</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <td>{user.username}</td>
              <td>{user.email || "—"}</td>
              <td>
                <select
                  value={user.roles_display?.[0] || "Viewer"}
                  onChange={(e) => updateRoles(user.id, [e.target.value])}
                >
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ opacity: 0.6 }}>
                {user.is_superuser ? "Superuser" : user.is_staff ? "Staff" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}