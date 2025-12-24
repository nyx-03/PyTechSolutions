"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ui from "@/styles/ui.module.css";
import layout from "@/styles/adminLayout.module.css";
import { apiFetch } from "@/lib/apiClient";

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

    const verifySession = async () => {
      try {
        // 1) Try /me with cookies
        let res = await apiFetch("/auth/me/");

        // 2) If unauthorized, try to refresh then retry /me once
        if (res.status === 401) {
          const r = await apiFetch("/auth/refresh/", { method: "POST" });

          if (r.ok) {
            res = await apiFetch("/auth/me/");
          }
        }

        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }

        setIsReady(true);
      } catch (e) {
        router.replace("/admin/login");
      }
    };

    verifySession();
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
    <div className={layout.shell}>
      <aside className={ui.panel}>
        <div className={layout.brand}>
          PyTechSolutions Admin
        </div>

        <nav className={layout.nav}>
          <Link href="/admin" className={ui.secondaryButton}>
            Dashboard
          </Link>
          <Link href="/admin/users" className={ui.secondaryButton}>
            Utilisateurs & rôles
          </Link>
          <Link href="/admin/realisations" className={ui.secondaryButton}>
            Réalisations
          </Link>
          <Link href="/admin/testimonials" className={ui.secondaryButton}>
            Témoignages
          </Link>
        </nav>

        <div className={layout.logout}>
          <button
            type="button"
            className={ui.primaryButton}
            onClick={async () => {
              try {
                await apiFetch("/auth/logout/", { method: "POST" });
              } finally {
                router.replace("/admin/login");
              }
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
