"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Testimonials.module.css";
import {
  fadeInUpContainer,
  fadeInUpItem,
} from "@/lib/animations/variants";

const TESTIMONIALS = [
  {
    name: "Flavie",
    company: "La Voix Éclatante de l’Âme",
    role: "Accompagnement & coaching vocal",
    project: "Refonte du site & réservation en ligne",
    quote:
      "Ludo a su traduire mon univers en une interface claire et fluide. J’ai enfin un site qui me ressemble et que mes clientes trouvent simple à utiliser.",
    stack: "Django · Wagtail · UI sur mesure",
  },
  {
    name: "Client PME",
    company: "Entreprise B2B",
    role: "Responsable d’activité",
    project: "Outil de suivi d’activité & prospection",
    quote:
      "On est passé d’Excel éparpillés à un outil centralisé. On sait exactement où on en est dans la prospection, sans y passer nos soirées.",
    stack: "Python · Django · PostgreSQL",
  },
  {
    name: "Usage interne",
    company: "PyTechSolutions",
    role: "Outils internes & automatisations",
    project: "Scripts & dashboards sur mesure",
    quote:
      "Les automatisations développées font gagner plusieurs heures par semaine. Moins de tâches répétitives, plus de temps pour les décisions importantes.",
    stack: "Python · APIs tierces · Automatisation",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  return (
    <motion.section
      className={styles.testimonials}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.inner} variants={fadeInUpContainer}>
        {/* En-tête */}
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

        {/* Carousel */}
        <motion.div className={styles.carousel} variants={fadeInUpItem}>
          <button
            type="button"
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Témoignage précédent"
          >
            ‹
          </button>

          <div className={styles.cardWrapper}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeIndex}
                className={styles.card}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Barre “fenêtre” */}
                <div className={styles.cardTop}>
                  <div className={styles.dots}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className={styles.cardProject}>{current.project}</span>
                </div>

                {/* Zone “console” */}
                <div className={styles.console}>
                  <p className={styles.consoleLine}>
                    <span className={styles.prompt}>client@prod:</span>
                    <span className={styles.command}> feedback</span>
                  </p>
                  <p className={styles.quote}>
                    <span className={styles.quotePrefix}>&gt;</span>
                    {current.quote}
                  </p>
                </div>

                {/* Meta en bas */}
                <div className={styles.cardFooter}>
                  <div className={styles.person}>
                    <div className={styles.avatar}>
                      <span>{current.name.charAt(0)}</span>
                    </div>
                    <div className={styles.personInfo}>
                      <h3 className={styles.name}>{current.name}</h3>
                      <span className={styles.role}>
                        {current.company} · {current.role}
                      </span>
                    </div>
                  </div>
                  <span className={styles.stack}>{current.stack}</span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Témoignage suivant"
          >
            ›
          </button>
        </motion.div>

        {/* Indicateurs (dots) */}
        <motion.div className={styles.dotsNav} variants={fadeInUpItem}>
          {TESTIMONIALS.map((t, index) => (
            <button
              key={t.name + t.company}
              type="button"
              className={`${styles.dot} ${
                index === activeIndex ? styles.dotActive : ""
              }`}
              onClick={() => handleSelect(index)}
              aria-label={`Aller au témoignage de ${t.name}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}