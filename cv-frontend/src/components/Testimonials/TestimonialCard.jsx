import styles from "@/styles/Testimonials.module.css";

/**
 * TestimonialCard
 * ----------------
 * Composant de présentation d’un témoignage.
 * - 100% présentatif (aucun fetch, aucune logique métier)
 * - API normalisée autour de l’objet `testimonial`
 */
export default function TestimonialCard({ testimonial }) {
  if (!testimonial || !testimonial.quote) return null;

  const {
    name = "Client",
    role,
    company,
    quote,
  } = testimonial;

  const authorMeta = [role, company].filter(Boolean).join(" · ");

  return (
    <article
      className={styles.card}
      aria-label={`Témoignage de ${name}`}
    >
      {/* En-tête auteur */}
      <header className={styles.cardTop}>
        <div
          className={styles.avatar}
          aria-hidden="true"
        />
        <div className={styles.author}>
          <strong className={styles.name}>{name}</strong>
          {authorMeta && (
            <span className={styles.role}>{authorMeta}</span>
          )}
        </div>
      </header>

      {/* Contenu */}
      <blockquote className={styles.quote}>
        “{quote}”
        <cite className="sr-only">{name}</cite>
      </blockquote>
    </article>
  );
}