"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ui from "@/styles/ui.module.css";
import styles from "@/styles/adminPages.module.css";
import { apiFetch, apiJson } from "@/lib/apiClient";

const ADMIN_TESTIMONIALS_ENDPOINT = "/testimonials/admin/";

export default function DeleteTestimonialPage() {
  const router = useRouter();
  const { id } = useParams();

  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const data = await apiJson(`${ADMIN_TESTIMONIALS_ENDPOINT}${id}/`, {
          method: "GET",
        });
        const labelParts = [data?.author_name, data?.company].filter(Boolean);
        setLabel(labelParts.join(" · ") || "Témoignage");
      } catch (err) {
        setError(err?.message || "Impossible de charger le témoignage");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTestimonial();
  }, [id]);

  async function handleDelete() {
    setError("");
    setDeleting(true);

    try {
      const res = await apiFetch(`${ADMIN_TESTIMONIALS_ENDPOINT}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Suppression refusée (permissions ?)");
      }

      router.push("/admin/testimonials");
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
            <h1 className={ui.title}>Supprimer le témoignage</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/testimonials")}
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
            Tu es sur le point de supprimer définitivement le témoignage suivant :
          </p>

          <p className={`${ui.text} ${styles.strong}`}>
            “{label}”
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
              onClick={() => router.push("/admin/testimonials")}
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
