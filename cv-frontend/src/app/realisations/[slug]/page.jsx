import { notFound } from "next/navigation";
import { getRealisation } from "@/lib/apiClient";
import ui from "@/styles/ui.module.css";
import styles from "@/styles/Realisations.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ params may be a Promise in your Next version
  try {
    const item = await getRealisation(slug);
    return {
      title: `${item.title} – Réalisations`,
      description:
        item.description || item.content?.slice(0, 140) || "Réalisation",
    };
  } catch {
    return { title: "Réalisation introuvable" };
  }
}

export default async function RealisationDetailPage({ params }) {
  const { slug } = await params; // ✅ unwrap params
  let item;

  try {
    item = await getRealisation(slug);
  } catch {
    notFound();
  }

  const tags = Array.isArray(item.tags)
    ? item.tags
    : Array.isArray(item.stack)
    ? item.stack
    : typeof item.stack === "string"
    ? item.stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <section className={`${ui.page} ${ui.pageNarrow}`}>
      <header className={styles.detailHeader}>
        <p className={styles.kicker}>{item.type || "Projet"}</p>
        <h1 className={styles.detailTitle}>{item.title}</h1>
        {item.description && (
          <p className={styles.detailSubtitle}>{item.description}</p>
        )}
      </header>

      <article className={styles.detailContent}>
        {item.content && <p className={styles.text}>{item.content}</p>}

        {tags.length > 0 && (
          <ul className={styles.tagList}>
            {tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        {item.result && (
          <div className={styles.resultBox}>
            <strong>Résultat</strong>
            <p>{item.result}</p>
          </div>
        )}
      </article>
    </section>
  );
}