"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Petit helper: base URL API (à remplacer par env si tu veux)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // On laisse toujours l’accès à /admin/login
    if (pathname?.includes("/admin/login")) {
      setIsReady(true);
      return;
    }

    const access = getAccessToken();
    if (!access) {
      router.replace("/admin/login");
      return;
    }

    // Vérifie le token via /api/auth/me/
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          router.replace("/admin/login");
          return;
        }

        setIsReady(true);
      } catch (e) {
        router.replace("/admin/login");
      }
    })();
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>Admin</h1>
        <p style={{ opacity: 0.8 }}>Vérification de la session…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "260px 1fr" }}>
      <aside
        style={{
          padding: 16,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>PyTechSolutions Admin</div>

        <nav style={{ display: "grid", gap: 8 }}>
          <a href="/admin" style={{ textDecoration: "none" }}>Dashboard</a>
          <a href="/admin/users" style={{ textDecoration: "none" }}>Utilisateurs & rôles</a>
          <a href="/admin/realisations" style={{ textDecoration: "none" }}>Réalisations</a>
        </nav>

        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            onClick={() => {
              // logout côté front pour l’instant (on branchera API logout après)
              sessionStorage.removeItem("access_token");
              sessionStorage.removeItem("refresh_token");
              router.replace("/admin/login");
            }}
            style={{
              marginTop: 12,
              padding: "10px 12px",
              width: "100%",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}