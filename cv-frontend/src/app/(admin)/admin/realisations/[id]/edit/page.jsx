"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RealisationForm from "@/components/admin/RealisationForm/RealisationForm";
import ui from "@/styles/ui.module.css";
import { apiJson } from "@/lib/apiClient";

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
        const data = await apiJson(`/admin/realisations/${id}/`);

        setInitialData({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "web",
          status: data.status || "draft",
        });
      } catch (err) {
        setError(err?.message || "Impossible de charger la réalisation");
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
      await apiJson(`/admin/realisations/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      router.push("/admin/realisations");
    } catch (err) {
      const payload = err?.payload;
      if (payload && typeof payload === "object" && !Array.isArray(payload) && !payload.detail) {
        const firstKey = Object.keys(payload)[0];
        const firstMsg = Array.isArray(payload[firstKey]) ? payload[firstKey][0] : String(payload[firstKey]);
        setError(`${firstKey}: ${firstMsg}`);
      } else {
        setError(err?.message || "Mise à jour refusée (permissions ?)");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement de la réalisation…</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Réalisation introuvable.</p>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div className={ui.headerRow}>
            <h1 className={ui.title}>Éditer la réalisation</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/realisations")}
            >
              Retour
            </button>
          </div>
          <p className={ui.text}>
            Modifie les informations ci-dessous puis enregistre les changements.
          </p>
        </header>

        {error && (
          <div className={ui.panel}>
            <div className={ui.error}>{error}</div>
          </div>
        )}

        <div className={ui.panel}>
          <RealisationForm
            initialData={initialData}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/admin/realisations")}
            submitLabel="Enregistrer"
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
