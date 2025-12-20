"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ui from "@/styles/ui.module.css";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

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
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.detail || "Identifiants invalides.");
        return;
      }

      // Stockage simple (on passera en cookie HttpOnly ensuite)
      sessionStorage.setItem("access_token", data.access);
      sessionStorage.setItem("refresh_token", data.refresh);

      router.replace("/admin");
    } catch (err) {
      setError("Impossible de contacter l’API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.pageNarrow}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className={ui.title}>Connexion admin</h1>
      </div>

      <div className={ui.panel} style={{ marginTop: 16, maxWidth: 520 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
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

          <label style={{ display: "grid", gap: 6 }}>
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
            <div style={{ marginTop: 4 }}>
              <span className={ui.error}>{error}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className={ui.primaryButton} disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </div>

          <p className={ui.text} style={{ marginTop: 12, opacity: 0.8 }}>
            Note : on stocke temporairement les tokens en sessionStorage. Ensuite on passera au refresh token en cookie HttpOnly.
          </p>
        </form>
      </div>
    </div>
  );
}