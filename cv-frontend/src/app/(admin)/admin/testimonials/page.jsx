"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { apiJson } from "@/lib/apiClient";
import AdminTable from "@/components/admin/AdminTable/AdminTable";

import ui from "@/styles/ui.module.css";
import tableStyles from "@/styles/adminTables.module.css";

const ADMIN_TESTIMONIALS_ENDPOINT = "/testimonials/admin/";

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiJson(ADMIN_TESTIMONIALS_ENDPOINT, { method: "GET" });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "author_name",
        label: "Auteur",
        render: (r) => r.author_name || "—",
      },
      {
        key: "quote",
        label: "Témoignage",
        className: tableStyles.truncate,
        render: (r) => (
          <span className={tableStyles.truncate} title={r.quote || ""}>
            {r.quote || "—"}
          </span>
        ),
      },
      {
        key: "sort_order",
        label: "Ordre",
        className: tableStyles.status,
        render: (r) => (Number.isFinite(r.sort_order) ? r.sort_order : "—"),
      },
      {
        key: "is_published",
        label: "Statut",
        className: tableStyles.status,
        render: (r) => (
          <span className={r.is_published ? "" : tableStyles.statusDim}>
            {r.is_published ? "Publié" : "Brouillon"}
          </span>
        ),
      },
    ],
    []
  );

  const header = (
    <div className={ui.headerRow}>
      <div>
        <h1 className={ui.title}>Témoignages</h1>
        <p className={ui.subtitle}>
          Gère les témoignages affichés sur la page d’accueil.
        </p>
      </div>

      <Link className={ui.primaryButton} href="/admin/testimonials/new">
        Nouveau témoignage
      </Link>
    </div>
  );

  return (
    <div className={ui.page}>
      <div className={ui.pageWide}>
        {header}

        <div className={ui.panel}>
          {loading ? (
            <p className={ui.text}>Chargement…</p>
          ) : error ? (
            <>
              <p className={ui.error}>Impossible de charger les témoignages.</p>
              <button className={ui.secondaryButton} onClick={load}>
                Réessayer
              </button>
            </>
          ) : rows.length === 0 ? (
            <p className={ui.text}>Aucun témoignage pour le moment.</p>
          ) : (
            <AdminTable
              columns={columns}
              rows={rows}
              rowKey={(r) => r.id}
              renderActions={(r) => (
                <>
                  <Link
                    className={ui.secondaryButton}
                    href={`/admin/testimonials/${r.id}/edit`}
                  >
                    Modifier
                  </Link>
                  <Link
                    className={ui.secondaryButton}
                    href={`/admin/testimonials/${r.id}/delete`}
                  >
                    Supprimer
                  </Link>
                </>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}