"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm/TestimonialForm";
import ui from "@/styles/ui.module.css";
import { apiJson } from "@/lib/apiClient";

const ADMIN_TESTIMONIALS_ENDPOINT = "/testimonials/admin/";

function formatApiError(err, fallback) {
  const payload = err?.payload;
  if (payload && typeof payload === "object" && !Array.isArray(payload) && !payload.detail) {
    const firstKey = Object.keys(payload)[0];
    const firstMsg = Array.isArray(payload[firstKey]) ? payload[firstKey][0] : String(payload[firstKey]);
    return `${firstKey}: ${firstMsg}`;
  }
  return err?.message || fallback;
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTestimonial() {
      setError("");
      try {
        const data = await apiJson(`${ADMIN_TESTIMONIALS_ENDPOINT}${id}/`, {
          method: "GET",
        });

        setInitialData({
          author_name: data.author_name || "",
          author_role: data.author_role || "",
          company: data.company || "",
          quote: data.quote || "",
          rating: data.rating ?? "",
          sort_order: Number.isFinite(data.sort_order) ? data.sort_order : "",
          is_published: !!data.is_published,
        });
      } catch (err) {
        setError(err?.message || "Impossible de charger le témoignage");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTestimonial();
  }, [id]);

  async function handleUpdate(payload) {
    setError("");
    setSaving(true);

    try {
      await apiJson(`${ADMIN_TESTIMONIALS_ENDPOINT}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      router.push("/admin/testimonials");
    } catch (err) {
      setError(formatApiError(err, "Mise à jour refusée (permissions ?)"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement du témoignage…</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Témoignage introuvable.</p>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div className={ui.headerRow}>
            <h1 className={ui.title}>Éditer le témoignage</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={() => router.push("/admin/testimonials")}
            >
              Retour
            </button>
          </div>
          <p className={ui.text}>
            Mets à jour les informations ci-dessous puis enregistre les changements.
          </p>
        </header>

        {error && (
          <div className={ui.panel}>
            <div className={ui.error}>{error}</div>
          </div>
        )}

        <div className={ui.panel}>
          <TestimonialForm
            initialData={initialData}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/admin/testimonials")}
            submitLabel="Enregistrer"
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
