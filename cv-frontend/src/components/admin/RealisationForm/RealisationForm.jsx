"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/RealisationForm.module.css";
import ui from "@/styles/ui.module.css"

export default function RealisationForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
  loading = false,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
  const [content, setContent] = useState(initialData.content || "");
  const normalizeStack = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") return value;
    return "";
  };
  const [stack, setStack] = useState(normalizeStack(initialData.stack));
  const [type, setType] = useState(initialData.type || "web");
  const [status, setStatus] = useState(initialData.status || "draft");

  const [error, setError] = useState("");

  // If initialData changes (edit page after fetch), sync the form.
  useEffect(() => {
    setTitle(initialData.title || "");
    setExcerpt(initialData.excerpt || "");
    setContent(initialData.content || "");
    setStack(normalizeStack(initialData.stack));
    setType(initialData.type || "web");
    setStatus(initialData.status || "draft");
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Le titre, le résumé et le contenu sont obligatoires.");
      return;
    }

    if (excerpt.trim().length < 20) {
      setError("Le résumé doit contenir au moins 20 caractères.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setError("Aucune action de soumission n'est configurée.");
      return;
    }

    onSubmit({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      stack: stack.trim(),
      type,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span>Titre</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Résumé (affiché sur la page publique)</span>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          placeholder="Résumé court du projet (page liste / home)"
          required
        />
      </label>

      <label className={styles.field}>
        <span>Stack (technos, séparées par des virgules)</span>
        <input
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="Django, Next.js, PostgreSQL, Docker"
        />
      </label>

      <label className={styles.field}>
        <span>Contenu</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="web">Web</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Statut</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button type="submit" disabled={loading} className={ui.primaryButton}>
          {loading ? "Enregistrement…" : submitLabel}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}