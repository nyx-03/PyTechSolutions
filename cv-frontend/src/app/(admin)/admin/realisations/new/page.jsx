"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RealisationForm from "@/components/admin/RealisationForm/RealisationForm";
import ui from "@/styles/ui.module.css";
import { apiJson } from "@/lib/apiClient";

export default function NewRealisationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(payload) {
    setError("");
    setLoading(true);

    try {
      await apiJson("/admin/realisations/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/admin/realisations");
    } catch (err) {
      // Try to extract DRF field errors if present
      const payload = err?.payload;
      if (payload && typeof payload === "object" && !Array.isArray(payload) && !payload.detail) {
        const firstKey = Object.keys(payload)[0];
        const firstMsg = Array.isArray(payload[firstKey]) ? payload[firstKey][0] : String(payload[firstKey]);
        setError(`${firstKey}: ${firstMsg}`);
      } else {
        setError(err?.message || "Création refusée (permissions ?)");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div className={ui.headerRow}>
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
