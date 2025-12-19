"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RealisationForm from "@/components/admin/RealisationForm/RealisationForm";

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

  const [initialData, setInitialData] = useState(null);
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
        setInitialData({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "web",
          status: data.status || "draft",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRealisation();
  }, [id]);

  async function handleUpdate(payload) {
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
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

  if (!initialData) {
    return <p>Réalisation introuvable.</p>;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Éditer la réalisation</h1>

      {error && (
        <div style={{ padding: 12, border: "1px solid rgba(255,0,0,0.4)" }}>
          {error}
        </div>
      )}

      <RealisationForm
        initialData={initialData}
        onSubmit={handleUpdate}
        onCancel={() => router.push("/admin/realisations")}
        submitLabel="Enregistrer"
        loading={saving}
      />
    </div>
  );
}
