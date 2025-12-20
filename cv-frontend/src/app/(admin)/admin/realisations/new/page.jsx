"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RealisationForm from "@/components/admin/RealisationForm/RealisationForm";
import ui from "@/styles/ui.module.css";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(payload) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/realisations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        // DRF often returns field errors as an object: {field: ["msg"]}
        if (data && typeof data === "object" && !Array.isArray(data) && !data.detail) {
          const firstKey = Object.keys(data)[0];
          const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : String(data[firstKey]);
          throw new Error(`${firstKey}: ${firstMsg}`);
        }

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
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 className={ui.title}>Nouvelle réalisation</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/realisations")}
            >
              Retour
            </button>
          </div>
          <p className={ui.text}>
            Remplis les informations ci-dessous puis valide pour créer une nouvelle réalisation.
          </p>
        </header>

        {error && (
          <div className={ui.panel}>
            <div className={ui.error}>{error}</div>
          </div>
        )}

        <div className={ui.panel}>
          <RealisationForm
            onSubmit={handleCreate}
            onCancel={() => router.push("/admin/realisations")}
            submitLabel="Créer"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
