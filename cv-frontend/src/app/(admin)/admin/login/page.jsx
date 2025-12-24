"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ui from "@/styles/ui.module.css";
import auth from "@/styles/auth.module.css";
import { apiFetch } from "@/lib/apiClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.detail || "Identifiants invalides ou accès refusé.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError("Impossible de contacter l’API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${ui.pageNarrow} ${auth.page}`}>
      <div className={auth.header}>
        <h1 className={ui.title}>Connexion admin</h1>
      </div>

      <div className={ui.panel}>
        <form onSubmit={handleSubmit} className={auth.form}>
          <label className={auth.field}>
            <span className={ui.text}>Username</span>
            <input
              className={ui.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
          </label>

          <label className={auth.field}>
            <span className={ui.text}>Password</span>
            <input
              className={ui.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </label>

          {error && (
            <div className={auth.helper}>
              <span className={ui.error}>{error}</span>
            </div>
          )}

          <div className={auth.actions}>
            <button type="submit" className={ui.primaryButton} disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </div>

          <p className={`${ui.text} ${auth.note}`}>
            Note : l’authentification utilise des cookies sécurisés HttpOnly (aucun token stocké côté navigateur).
          </p>
        </form>
      </div>
    </div>
  );
}