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

export default function EditRealisationPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("web");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRealisation() {
      setError("");
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
        setContent(data.content || "");
        setType(data.type || "web");
        setStatus(data.status || "draft");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRealisation();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/${id}/`, {
        method: "PATCH",
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
        throw new Error(data?.detail || "Mise à jour refusée (permissions ?)");
      }

      router.push("/admin/realisations");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Chargement de la réalisation…</p>;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Éditer la réalisation</h1>

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
          <button type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
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
