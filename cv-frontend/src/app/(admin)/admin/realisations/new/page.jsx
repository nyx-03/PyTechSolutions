"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

export default function NewRealisationPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("web");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          title,
          content,
          type,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Création refusée (permissions ?)");
      }

      router.push("/admin/realisations");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Nouvelle réalisation</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Titre</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Contenu</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="web">Web</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Statut</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        {error && (
          <div style={{ padding: 12, border: "1px solid rgba(255,0,0,0.4)" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Création…" : "Créer"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/realisations")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
