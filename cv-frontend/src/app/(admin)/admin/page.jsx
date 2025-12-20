import ui from "@/styles/ui.module.css";
import layout from "@/styles/adminLayout.module.css";
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className={ui.page}>
      <div className={ui.pageNarrow}>
        <h1 className={ui.title}>Dashboard</h1>
        <p className={`${ui.text} ${layout.intro}`}>
          Bienvenue dans le panneau d’administration. Ici seront branchées les
          statistiques, les actions rapides et les liens de gestion.
        </p>

        <div className={layout.dashboardGrid}>
          <div className={ui.panel}>
            <h2 className={ui.sectionTitle}>Gestion</h2>
            <ul className={layout.linkList}>
              <li>
                <Link href="/admin/users" className={ui.secondaryButton}>
                  Utilisateurs & rôles
                </Link>
              </li>
              <li>
                <Link href="/admin/realisations" className={ui.secondaryButton}>
                  Réalisations
                </Link>
              </li>
            </ul>
          </div>

          <div className={ui.panelSoft + " " + ui.panel}>
            <h2 className={ui.sectionTitle}>À venir</h2>
            <p className={`${ui.text} ${layout.intro}`}>
              Statistiques, contenus éditoriaux, médias, logs, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}