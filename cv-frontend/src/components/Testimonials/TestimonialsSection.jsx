

"use client";

import { useState } from "react";
import TestimonialCard from "./TestimonialCard";
import styles from "@/styles/Testimonials.module.css";
import ui from "@/styles/ui.module.css";

export default function TestimonialsSection({ items }) {
  const [active, setActive] = useState(0);

  if (!items || items.length === 0) return null;

  return (
    <section className={styles.testimonials}>
      <div className={`${ui.container} ${styles.inner}`}>
        <header className={styles.header}>
          <h2 className={styles.title}>Ils nous ont fait confiance</h2>
          <p className={styles.subtitle}>
            Ce que nos clients disent de notre accompagnement.
          </p>
        </header>

        {/* Desktop grid */}
        <div className={styles.grid}>
          {items.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className={styles.carousel}>
          <TestimonialCard testimonial={items[active]} />

          <div className={styles.dots}>
            {items.map((_, i) => (
              <button
                key={i}
                className={i === active ? styles.dotActive : styles.dot}
                onClick={() => setActive(i)}
                aria-label={`Afficher le témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}