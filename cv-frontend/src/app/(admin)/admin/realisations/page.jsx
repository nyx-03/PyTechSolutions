"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ui from "@/styles/ui.module.css";
import t from "@/styles/adminTables.module.css";
import { apiJson } from "@/lib/apiClient";

export default function AdminRealisationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRealisations() {
    setLoading(true);
    setError("");

    try {
      const data = await apiJson("/admin/realisations/");
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRealisations();
  }, []);

  if (loading) {
    return (
      <div className={ui.pageNarrow}>
        <p className={ui.text}>Chargement des réalisations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={ui.pageNarrow}>
        <div className={ui.panel}>
          <span className={ui.error}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageWide}>
        <header className={ui.hero}>
          <div className={ui.headerRow}>
            <div>
              <h1 className={ui.title}>Réalisations</h1>
              <p className={ui.subtitle}>
                Gérez, créez et modifiez les réalisations.
              </p>
            </div>

            <button
              type="button"
              className={ui.primaryButton}
              onClick={() => router.push("/admin/realisations/new")}
            >
              + Nouvelle réalisation
            </button>
          </div>
        </header>

        <div className={ui.panel}>
          <div className={t.tableWrapper}>
            <table className={t.table}>
              <thead>
                <tr>
                  <th className={t.th}>Titre</th>
                  <th className={t.th}>Type</th>
                  <th className={t.th}>Statut</th>
                  <th className={t.th} />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={t.tr}>
                    <td className={t.td}>{item.title}</td>
                    <td className={t.td}>{item.type}</td>
                    <td className={t.td}>{item.status}</td>
                    <td className={`${t.td} ${t.actions}`}>
                      <div className={t.actionsInner}>
                        <button
                          type="button"
                          className={ui.secondaryButton}
                          onClick={() => router.push(`/admin/realisations/${item.id}/edit`)}
                        >
                          Éditer
                        </button>

                        <button
                          type="button"
                          className={ui.secondaryButton}
                          onClick={() => router.push(`/admin/realisations/${item.id}/delete`)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}