"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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
    return <p>Chargement…</p>;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginTop: 0 }}>Supprimer la réalisation</h1>

      <p>
        Tu es sur le point de supprimer définitivement la réalisation :
      </p>

      <p style={{ fontWeight: 700 }}>
        “{title}”
      </p>

      <p style={{ color: "#ff6b6b" }}>
        Cette action est irréversible.
      </p>

      {error && (
        <div style={{ padding: 12, border: "1px solid rgba(255,0,0,0.4)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Suppression…" : "Confirmer la suppression"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/realisations")}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
