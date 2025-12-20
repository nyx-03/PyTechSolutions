"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ui from "@/styles/ui.module.css";

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
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement des réalisations…</p>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className={ui.title}>Réalisations</h1>

          <button
            type="button"
            className={ui.primaryButton}
            onClick={() => router.push("/admin/realisations/new")}
          >
            + Nouvelle réalisation
          </button>
        </div>

        <div className={ui.panel} style={{ marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Titre</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Type</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Statut</th>
                <th style={{ padding: "10px 12px" }} />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <td style={{ padding: "10px 12px" }}>{item.title}</td>
                  <td style={{ padding: "10px 12px" }}>{item.type}</td>
                  <td style={{ padding: "10px 12px" }}>{item.status}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <button
                        type="button"
                        className={ui.secondaryButton}
                        onClick={() => router.push(`/admin/realisations/${item.id}/edit`)}
                        style={{ marginRight: 8 }}
                      >
                        Éditer
                      </button>

                      <button
                        type="button"
                        className={ui.secondaryButton}
                        onClick={() => router.push(`/admin/realisations/${item.id}/delete`)}
                      >
                        Supprimer
                      </button>
                    </div>
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