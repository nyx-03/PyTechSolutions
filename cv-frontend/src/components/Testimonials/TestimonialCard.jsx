

import styles from "@/styles/Testimonials.module.css";

export default function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  const { name, role, company, quote } = testimonial;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.avatar} aria-hidden="true" />
        <div className={styles.author}>
          <strong className={styles.name}>{name}</strong>
          {(role || company) && (
            <span className={styles.role}>
              {role}{role && company ? " · " : ""}{company}
            </span>
          )}
        </div>
      </div>

      <blockquote className={styles.quote}>“{quote}”</blockquote>
    </article>
  );
}