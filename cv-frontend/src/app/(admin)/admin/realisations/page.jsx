"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

export default function AdminRealisationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRealisations() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Impossible de charger les réalisations");
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRealisations();
  }, []);

  if (loading) {
    return <p>Chargement des réalisations…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginTop: 0 }}>Réalisations</h1>

        <button
          type="button"
          onClick={() => router.push("/admin/realisations/new")}
        >
          + Nouvelle réalisation
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Titre</th>
            <th style={{ textAlign: "left" }}>Type</th>
            <th style={{ textAlign: "left" }}>Statut</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.status}</td>
              <td style={{ textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/realisations/${item.id}/edit`)}
                  style={{ marginRight: 8 }}
                >
                  Éditer
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/admin/realisations/${item.id}/delete`)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}