import Link from "next/link";
import styles from "@/styles/Realisations.module.css";
import ui from "@/styles/ui.module.css";
import { getRealisations } from "@/lib/apiClient";

function Tag({ children }) {
  return (
    <span className={styles.tag}>
      {children}
    </span>
  );
}

function ProjectCard({ project }) {
  const slug = project.slug || "";
  let tags = [];
  if (Array.isArray(project.tags)) {
    tags = project.tags;
  } else if (Array.isArray(project.stack)) {
    tags = project.stack;
  } else if (typeof project.stack === "string") {
    tags = project.stack.split(",").map((t) => t.trim());
  }

  const title = project.title || project.name;
  const description = project.description || project.content || "";

  return (
    <article
      id={slug || undefined}
      className={styles.card}
    >
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {title}
        </h2>
        <p className={styles.cardDescription}>
          {description}
        </p>
      </header>

      <div className={styles.tagList}>
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {slug && (
        <div className={styles.cardLink}>
          <Link href={`/realisations/${slug}`} className={styles.cardAction}>
            Voir les détails
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </article>
  );
}

export default async function RealisationsPage() {
  let projects = [];
  try {
    projects = await getRealisations();
  } catch (e) {
    projects = [];
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Réalisations
        </h1>
        <p className={styles.subtitle}>
          Une sélection de projets (outils, sites, applications) conçus avec une
          approche orientée produit : clarté, performance, maintenabilité.
        </p>
      </section>

      <section
        aria-label="Liste des projets"
        className={styles.grid}
      >
        {projects.length === 0 ? (
          <p className={styles.empty}>Aucune réalisation pour le moment.</p>
        ) : (
          projects.map((p) => (
            <ProjectCard key={p.slug || p.id || p.title} project={p} />
          ))
        )}
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Un besoin similaire ?</h2>
        <p className={styles.ctaText}>
          Discutons de ton contexte et des objectifs : audit, développement,
          refonte, ou accompagnement.
        </p>
        <Link href="/contact" className={ui.primaryButton}>
          Me contacter
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}