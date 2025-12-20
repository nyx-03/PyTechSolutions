"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ui from "@/styles/ui.module.css";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE)
  : "http://localhost:8000/api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Always allow access to /admin/login
    if (pathname?.includes("/admin/login")) {
      setIsReady(true);
      return;
    }

    const access = getAccessToken();
    if (!access) {
      router.replace("/admin/login");
      return;
    }

    // Verify token via /api/auth/me/
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me/`, {
          headers: { Authorization: `Bearer ${access}` },
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
      <div className={ui.pageNarrow}>
        <h1 className={ui.title}>Admin</h1>
        <p className={ui.text}>Vérification de la session…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
      }}
    >
      <aside className={ui.panel}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
          PyTechSolutions Admin
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <Link href="/admin" className={ui.secondaryButton}>
            Dashboard
          </Link>
          <Link href="/admin/users" className={ui.secondaryButton}>
            Utilisateurs & rôles
          </Link>
          <Link href="/admin/realisations" className={ui.secondaryButton}>
            Réalisations
          </Link>
        </nav>

        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            className={ui.primaryButton}
            onClick={() => {
              sessionStorage.removeItem("access_token");
              sessionStorage.removeItem("refresh_token");
              router.replace("/admin/login");
            }}
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className={ui.page}>{children}</main>
    </div>
  );
}