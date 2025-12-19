"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "./Realisations.module.css";
import ui from "@/styles/ui.module.css";
import {
  fadeInUpContainer,
  fadeInUpItem,
} from "@/lib/animations/variants";

const PROJECTS = [
  {
    type: "Outil interne",
    name: "Site PyTechSolutions",
    description:
      "Site vitrine et base technique pour présenter les services, les références et le CV dynamique de PyTechSolutions.",
    stack: "Python · Django · Next.js",
    status: "En production",
    result:
      "Un socle clair pour présenter les offres et centraliser les futurs modules (blog, espace client, outils internes).",
  },
  {
    type: "Site client",
    name: "La Voix Éclatante de l’Âme",
    description:
      "Site sur mesure pour une praticienne, avec mise en avant de l’univers, des offres et d’un système de prise de contact optimisé.",
    stack: "Python · Django · Wagtail",
    status: "En ligne",
    result:
      "Un site plus professionnel, mieux structuré et plus rassurant pour les clientes, avec davantage de demandes entrantes.",
  },
  {
    type: "Site client",
    name: "L’Étoile d’Éli",
    description:
      "Site vitrine pour une activité d’accompagnement, avec une structure simple mais évolutive.",
    stack: "Python · Django · Wagtail",
    status: "En ligne",
    result:
      "Une présence en ligne cohérente, facilement administrable, prête à accueillir de futurs contenus et offres.",
  },
];

export default function Realisations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = PROJECTS.length;
  const current = PROJECTS[activeIndex];

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
      id="realisations"
      className={styles.realisations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.inner} variants={fadeInUpContainer}>
        <motion.p className={styles.kicker} variants={fadeInUpItem}>
          Réalisations
        </motion.p>

        <motion.h2 className={styles.title} variants={fadeInUpItem}>
          Des projets concrets, pas seulement des idées
        </motion.h2>

        <motion.p className={styles.intro} variants={fadeInUpItem}>
          Quelques exemples de projets sur lesquels PyTechSolutions a travaillé.
          L’objectif reste toujours le même&nbsp;: des solutions utiles,
          maintenables et adaptées à la réalité du terrain.
        </motion.p>

        {/* Carousel */}
        <motion.div className={styles.carousel} variants={fadeInUpItem}>
          <button
            type="button"
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Projet précédent"
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
                <span className={styles.type}>{current.type}</span>
                <h3 className={styles.cardTitle}>{current.name}</h3>

                <p className={styles.description}>{current.description}</p>

                {current.result && (
                  <div className={styles.resultBlock}>
                    <p className={styles.resultLabel}>Impact</p>
                    <p className={styles.result}>{current.result}</p>
                  </div>
                )}

                <div className={styles.meta}>
                  <span className={styles.stack}>{current.stack}</span>
                  <span className={styles.status}>{current.status}</span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Projet suivant"
          >
            ›
          </button>
        </motion.div>

        {/* Dots */}
        <motion.div className={styles.dotsNav} variants={fadeInUpItem}>
          {PROJECTS.map((project, index) => (
            <button
              key={project.name}
              type="button"
              className={`${styles.dot} ${
                index === activeIndex ? styles.dotActive : ""
              }`}
              onClick={() => handleSelect(index)}
              aria-label={`Aller au projet ${project.name}`}
            />
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div className={styles.footer} variants={fadeInUpItem}>
          <p>
            Vous souhaitez voir comment ces approches pourraient s&apos;adapter
            à votre activité&nbsp;?
          </p>
          <Link
            href="/contact"
            className={ui.primaryButton}
          >
            Discuter de mon projet
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}