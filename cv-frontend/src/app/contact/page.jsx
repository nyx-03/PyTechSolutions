"use client";

import { useState } from "react";
import styles from "@/styles/contact.module.css";
import ui from "@/styles/ui.module.css"
import { apiJson } from "@/lib/apiClient";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const hasErrors =
    errors && typeof errors === "object" && !Array.isArray(errors) && Object.keys(errors).length > 0;

  const renderErr = (val) => {
    if (!val) return null;
    if (Array.isArray(val)) return val.join(" ");
    return String(val);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    try {
      await apiJson("/contact/", {
        method: "POST",
        body: form,
      });

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      if (err?.status === 400 && err?.payload) {
        const data = err.payload;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setErrors(data);
        } else {
          setErrors({ detail: data });
        }
      }
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.subtitle}>
          Un projet, une question, un besoin ponctuel ou long terme ?
          Utilise le formulaire ci-dessous ou contacte-moi directement.
        </p>
      </section>

      <section className={styles.layout}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Coordonnées</h2>
          <p className={styles.infoLine}>📍 Malbuisson / France</p>
          <p className={styles.infoLine}>
            📧 <a href="mailto:contact@pytechsolutions.fr">contact@pytechsolutions.fr</a>
          </p>
          <p className={styles.infoLineLast}>⏱️ Réponse sous 24–48h ouvrées</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.sectionTitle}>Formulaire de contact</h2>

          <input
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{renderErr(errors.name)}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{renderErr(errors.email)}</p>}

          <input
            name="subject"
            placeholder="Sujet (optionnel)"
            value={form.subject}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.subject && <p className={styles.error}>{renderErr(errors.subject)}</p>}

          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
          {errors.message && <p className={styles.error}>{renderErr(errors.message)}</p>}

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            hidden
            tabIndex={-1}
            autoComplete="off"
          />

          {(errors.detail || errors.non_field_errors) && (
            <p className={styles.error}>
              {renderErr(errors.detail || errors.non_field_errors)}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className={ui.primaryButton}
          >
            {status === "loading" ? "Envoi…" : "Envoyer le message"}
          </button>

          {status === "success" && (
            <p className={styles.success}>Message envoyé avec succès ✔</p>
          )}
          {status === "error" && !hasErrors && (
            <p className={styles.error}>Une erreur est survenue. Merci de réessayer.</p>
          )}
        </form>
      </section>
    </main>
  );
}