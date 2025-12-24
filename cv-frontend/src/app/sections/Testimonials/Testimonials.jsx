"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TestimonialsSection from "@/components/Testimonials/TestimonialsSection";
import { fetchPublicTestimonials } from "@/features/testimonials/testimonials.api";
import { mapPublicTestimonials } from "@/features/testimonials/testimonials.mapper";
import styles from "@/styles/Testimonials.module.css";
import ui from "@/styles/ui.module.css";
import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPublicTestimonials()
      .then((data) => setItems(mapPublicTestimonials(data)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading || error) return null;

  if (items.length === 0) {
    return (
      <section className={styles.testimonials}>
        <div className={`${ui.container} ${styles.inner}`}>
          <p className={styles.empty}>Aucun témoignage pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className={styles.testimonials}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={`${ui.container} ${styles.inner}`}
        variants={fadeInUpContainer}
      >
        <motion.p className={styles.kicker} variants={fadeInUpItem}>
          Témoignages
        </motion.p>

        <motion.h2 className={styles.title} variants={fadeInUpItem}>
          Ce que disent les clients après la mise en production
        </motion.h2>

        <motion.p className={styles.intro} variants={fadeInUpItem}>
          Quelques retours de personnes qui utilisent au quotidien les outils
          et sites développés par PyTechSolutions.
        </motion.p>

        <TestimonialsSection items={items} />
      </motion.div>
    </motion.section>
  );
}