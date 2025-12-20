"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ui from "@/styles/ui.module.css";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

export default function DeleteRealisationPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRealisation() {
      try {
        const res = await fetch(`${API_BASE}/admin/realisations/${id}/`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Impossible de charger la réalisation");
        }

        const data = await res.json();
        setTitle(data.title || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRealisation();
  }, [id]);

  async function handleDelete() {
    setError("");
    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Suppression refusée (permissions ?)");
      }

      router.push("/admin/realisations");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement…</p>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 className={ui.title}>Supprimer la réalisation</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/realisations")}
            >
              Retour
            </button>
          </div>
        </header>

        {error && (
          <div className={ui.panel}>
            <div className={ui.error}>{error}</div>
          </div>
        )}

        <div className={ui.panel}>
          <p className={ui.text}>
            Tu es sur le point de supprimer définitivement la réalisation suivante :
          </p>

          <p className={ui.text} style={{ fontWeight: 700 }}>
            “{title}”
          </p>

          <p className={ui.error}>
            Cette action est irréversible.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              type="button"
              className={ui.primaryButton}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Suppression…" : "Confirmer la suppression"}
            </button>

            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/realisations")}
              disabled={deleting}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
