"use client";

import { useState } from "react";
import styles from "./contact.module.css";
import ui from "@/styles/ui.module.css"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Frontend-only placeholder (API will be connected later)
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulate request
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
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
          <p style={{ marginBottom: 6 }}>📍 Malbuisson / France</p>
          <p style={{ marginBottom: 6 }}>
            📧 <a href="mailto:contact@pytechsolutions.fr">contact@pytechsolutions.fr</a>
          </p>
          <p style={{ marginBottom: 0 }}>⏱️ Réponse sous 24–48h ouvrées</p>
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

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            name="subject"
            placeholder="Sujet (optionnel)"
            value={form.subject}
            onChange={handleChange}
            className={styles.input}
          />

          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className={styles.textarea}
          />

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
          {status === "error" && (
            <p className={styles.error}>
              Merci de remplir les champs obligatoires.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}