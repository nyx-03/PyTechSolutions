"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/TestimonialForm.module.css";
import ui from "@/styles/ui.module.css";

const EMPTY_VALUE = "";

function normalizeInputValue(value) {
  if (value === null || typeof value === "undefined") return EMPTY_VALUE;
  return String(value);
}

export default function TestimonialForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [authorName, setAuthorName] = useState(normalizeInputValue(initialData.author_name));
  const [authorRole, setAuthorRole] = useState(normalizeInputValue(initialData.author_role));
  const [company, setCompany] = useState(normalizeInputValue(initialData.company));
  const [quote, setQuote] = useState(normalizeInputValue(initialData.quote));
  const [rating, setRating] = useState(normalizeInputValue(initialData.rating));
  const [sortOrder, setSortOrder] = useState(normalizeInputValue(initialData.sort_order));
  const [isPublished, setIsPublished] = useState(!!initialData.is_published);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthorName(normalizeInputValue(initialData.author_name));
    setAuthorRole(normalizeInputValue(initialData.author_role));
    setCompany(normalizeInputValue(initialData.company));
    setQuote(normalizeInputValue(initialData.quote));
    setRating(normalizeInputValue(initialData.rating));
    setSortOrder(normalizeInputValue(initialData.sort_order));
    setIsPublished(!!initialData.is_published);
  }, [initialData]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = authorName.trim();
    const trimmedQuote = quote.trim();

    if (!trimmedName || !trimmedQuote) {
      setError("Le nom de l'auteur et le témoignage sont obligatoires.");
      return;
    }

    let ratingValue = null;
    if (rating !== "") {
      const parsedRating = Number(rating);
      if (!Number.isFinite(parsedRating) || !Number.isInteger(parsedRating)) {
        setError("La note doit être un nombre entier.");
        return;
      }
      if (parsedRating < 1 || parsedRating > 5) {
        setError("La note doit être comprise entre 1 et 5.");
        return;
      }
      ratingValue = parsedRating;
    }

    let sortOrderValue = null;
    if (sortOrder !== "") {
      const parsedOrder = Number(sortOrder);
      if (!Number.isFinite(parsedOrder) || !Number.isInteger(parsedOrder)) {
        setError("L'ordre doit être un nombre entier.");
        return;
      }
      sortOrderValue = parsedOrder;
    }

    if (typeof onSubmit !== "function") {
      setError("Aucune action de soumission n'est configurée.");
      return;
    }

    onSubmit({
      author_name: trimmedName,
      author_role: authorRole.trim(),
      company: company.trim(),
      quote: trimmedQuote,
      rating: ratingValue,
      is_published: isPublished,
      sort_order: sortOrderValue,
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Auteur</span>
        <input
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Poste</span>
        <input
          value={authorRole}
          onChange={(event) => setAuthorRole(event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Entreprise</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Témoignage</span>
        <textarea
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          rows={6}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Note (1 à 5)</span>
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Ordre d'affichage</span>
          <input
            type="number"
            step="1"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </label>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
        />
        <span className={styles.label}>Publié</span>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button type="submit" disabled={loading} className={ui.primaryButton}>
          {loading ? "Enregistrement…" : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={ui.secondaryButton}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
