"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { apiJson } from "@/lib/apiClient";
import AdminTable from "@/components/admin/AdminTable/AdminTable";

import ui from "@/styles/ui.module.css";
import tableStyles from "@/styles/adminTables.module.css";

const ADMIN_TESTIMONIALS_ENDPOINT = "/testimonials/admin/";

function formatBoolLabel(value) {
  return value ? "Oui" : "Non";
}

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
        key: "company",
        label: "Entreprise",
        render: (r) => r.company || "—",
      },
      {
        key: "is_published",
        label: "Publié",
        className: tableStyles.status,
        render: (r) => (
          <span className={r.is_published ? "" : tableStyles.statusDim}>
            {formatBoolLabel(!!r.is_published)}
          </span>
        ),
      },
      {
        key: "rating",
        label: "Note",
        className: tableStyles.status,
        render: (r) => (r.rating ? `${r.rating}/5` : "—"),
      },
      {
        key: "sort_order",
        label: "Ordre",
        className: tableStyles.status,
        render: (r) => (Number.isFinite(r.sort_order) ? r.sort_order : "—"),
      },
    ],
    []
  );

  const header = (
    <div className={ui.headerRow}>
      <div>
        <h1 className={ui.title}>Témoignages</h1>
        <p className={ui.subtitle}>
          Crée, publie et organise les témoignages affichés sur la page d’accueil.
        </p>
      </div>

      <Link className={ui.primaryButton} href="/admin/testimonials/new">
        Nouveau témoignage
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className={ui.page}>
        <div className={ui.pageWide}>
          {header}
          <div className={ui.panel}>
            <p className={ui.text}>Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={ui.page}>
        <div className={ui.pageWide}>
          {header}
          <div className={ui.panel}>
            <p className={ui.error}>Impossible de charger les témoignages.</p>
            <button className={ui.secondaryButton} onClick={load}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.page}>
      <div className={ui.pageWide}>
        {header}

        <div className={ui.panel}>
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
        </div>
      </div>
    </div>
  );
}