import Link from "next/link";
import styles from "./realisations.module.css";
import ui from "@/styles/ui.module.css";

const PROJECTS = [
  {
    title: "PyTechSolutions — Site vitrine", 
    description:
      "Site vitrine moderne avec scroll narratif, sections modulaires et animations (Next.js + Framer Motion).",
    tags: ["Next.js", "UI/UX", "Framer Motion"],
    href: "/realisations#pytechsolutions",
  },
  {
    title: "CV Manager", 
    description:
      "Outil desktop pour créer et exporter des CV/lettres avec templates, styles et export PDF.",
    tags: ["Python", "PySide6", "PDF"],
    href: "/realisations#cv-manager",
  },
  {
    title: "Entreprise-Radar", 
    description:
      "Prospection et exploration d'entreprises via données Sirene/INSEE : recherche, cache, et normalisation.",
    tags: ["Django", "API", "Data"],
    href: "/realisations#entreprise-radar",
  },
  {
    title: "Zip Manager", 
    description:
      "Application de compression/décompression avec workers, presets et backend 7zip, orientée performance.",
    tags: ["Python", "Workers", "7zip"],
    href: "/realisations#zip-manager",
  },
];

function Tag({ children }) {
  return (
    <span className={styles.tag}>
      {children}
    </span>
  );
}

function ProjectCard({ project }) {
  return (
    <article
      id={
        project.href.includes("#")
          ? project.href.split("#")[1]
          : undefined
      }
      className={styles.card}
    >
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {project.title}
        </h2>
        <p className={styles.cardDescription}>
          {project.description}
        </p>
      </header>

      <div className={styles.tagList}>
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className={styles.cardLink}>
        <Link href={project.href} className={styles.cardAction}>
          Voir les détails
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function RealisationsPage() {
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
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
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