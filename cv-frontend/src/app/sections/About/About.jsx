"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { fadeInUpContainer, fadeInUpItem, slideInLeft, slideInRight } from "@/lib/animations/variants";
import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <motion.section
      className={`${styles.about} bg-second`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.aboutInner} variants={fadeInUpContainer}>
        <motion.p className={styles.kicker} variants={fadeInUpItem}>
          À propos
        </motion.p>
        <motion.h2 className={styles.title} variants={fadeInUpItem}>
          PyTechSolutions & son fondateur
        </motion.h2>
        <motion.p className={styles.intro} variants={fadeInUpItem}>
          PyTechSolutions est un studio de développement indépendant, fondé par
          un développeur passionné par le sur-mesure, l'automatisation et les
          outils qui ont un impact concret sur le quotidien des équipes.
        </motion.p>
        <div className={styles.grid}>
          <motion.div
            className={styles.founderCard}
            variants={slideInLeft}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
          >
            <div className={styles.founderAvatar}>
              <Image
                src="/portrait.jpeg"
                alt="Fondateur de PyTechSolutions"
                width={80}
                height={80}
              />
            </div>
            <div className={styles.founderInfo}>
              <h3 className={styles.founderName}>Ragon Ludovic</h3>
              <p className={styles.founderRole}>
                Fondateur & développeur full-stack
              </p>
              <p className={styles.founderText}>
                Spécialisé en Python, Django, Next.js et automatisations,
                j'accompagne les entreprises dans la création d'outils utiles,
                maintenables et évolutifs.
              </p>
            </div>
          </motion.div>

          <motion.div className={styles.content} variants={slideInRight}>
            <p>
              Mon rôle n'est pas seulement de "coder ce que vous demandez", mais
              de vous aider à clarifier votre besoin, prioriser les
              fonctionnalités et faire les bons choix techniques pour votre
              contexte.
            </p>
            <ul className={styles.bullets}>
              <li>
                <span>Profil hybride :</span> technique, produit et business.
              </li>
              <li>
                <span>Langage clair :</span> pas de jargon inutile, des
                décisions expliquées.
              </li>
              <li>
                <span>Approche long terme :</span> code maintenable, évolutif et
                documenté juste ce qu'il faut.
              </li>
              <li>
                <span>Collaboration simple :</span> échanges réguliers, retours
                rapides, organisation adaptée à votre rythme.
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
