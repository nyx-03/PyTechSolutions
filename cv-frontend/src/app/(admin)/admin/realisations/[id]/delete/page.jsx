"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ui from "@/styles/ui.module.css";
import styles from "@/styles/adminPages.module.css";
import { apiFetch, apiJson } from "@/lib/apiClient";

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
        const data = await apiJson(`/admin/realisations/${id}/`);
        setTitle(data?.title || "");
      } catch (err) {
        setError(err?.message || "Impossible de charger la réalisation");
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
      const res = await apiFetch(`/admin/realisations/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Suppression refusée (permissions ?)");
      }

      router.push("/admin/realisations");
    } catch (err) {
      setError(err?.message || "Suppression refusée (permissions ?)");
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
          <div className={ui.headerRow}>
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

          <p className={`${ui.text} ${styles.strong}`}>
            “{title}”
          </p>

          <p className={ui.error}>
            Cette action est irréversible.
          </p>

          <div className={styles.actionsRow}>
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
