"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm/TestimonialForm";
import ui from "@/styles/ui.module.css";
import { apiJson } from "@/lib/apiClient";

const ADMIN_TESTIMONIALS_ENDPOINT = "/testimonials/admin/";

function formatApiError(err, fallback) {
  const payload = err?.payload;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return err?.message || fallback;
  }

  if (payload.detail) {
    return String(payload.detail);
  }

  const firstKey = Object.keys(payload)[0];
  if (!firstKey) return err?.message || fallback;

  const raw = payload[firstKey];
  const firstMsg = Array.isArray(raw) ? raw[0] : raw;
  return `${firstKey}: ${String(firstMsg)}`;
}

export default function NewTestimonialPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goBack = () => router.push("/admin/testimonials");

  async function handleCreate(payload) {
    setError("");
    setLoading(true);

    try {
      await apiJson(ADMIN_TESTIMONIALS_ENDPOINT, {
        method: "POST",
        body: payload,
      });

      goBack();
    } catch (err) {
      setError(formatApiError(err, "Création refusée (permissions ?)"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <header className={ui.hero}>
          <div className={ui.headerRow}>
            <h1 className={ui.title}>Nouveau témoignage</h1>
            <button
              type="button"
              className={ui.secondaryButton}
              onClick={goBack}
            >
              Retour
            </button>
          </div>
          <p className={ui.text}>
            Renseigne les informations ci-dessous pour publier un nouveau témoignage.
          </p>
        </header>

        {error && (
          <div className={ui.panel}>
            <div className={ui.error}>{error}</div>
          </div>
        )}

        <div className={ui.panel}>
          <TestimonialForm
            onSubmit={handleCreate}
            onCancel={goBack}
            submitLabel="Créer"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
