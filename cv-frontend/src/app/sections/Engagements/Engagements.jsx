"use client";

import { motion } from "framer-motion";
import styles from "@/styles/Engagements.module.css";
import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants";

const ENGAGEMENTS = [
  {
    title: "Transparence & pédagogie",
    text: "Vous savez toujours où en est votre projet, ce qui est fait, ce qui reste à faire et pourquoi. Les décisions techniques sont expliquées clairement, sans jargon inutile.",
  },
  {
    title: "Rigueur & fiabilité",
    text: "Architecture réfléchie, code structuré, contrôles qualité. L'objectif : des outils stables, compréhensibles et qui tiennent dans le temps, même si le projet évolue.",
  },
  {
    title: "Performance & maintenabilité",
    text: "Des choix techniques assumés (Python, Django, Next.js) pour des applications performantes, maintenanbles et évolutives, plutôt que des effets de mode difficiles à suivre. ",
  },
  {
    title: "Accompagnement & écoute",
    text: "On ne parle pas seulement de fonctionnalités, mais aussi de votre contexte, de vos contraintes et de vos priorités. Le projet est construit avec vous, pas à côté de vous.",
  },
];

export default function Engagements() {
  return (
    <motion.section
      className={styles.engagements}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.inner} variants={fadeInUpContainer}>
        <motion.p className={styles.kicker} variants={fadeInUpItem}>
          Engagements
        </motion.p>
        <motion.h2 className={styles.title} variants={fadeInUpItem}>
          ce que vous pouvez attendre de PyTechSolutions.
        </motion.h2>
        <motion.p className={styles.intro} variants={fadeInUpItem}>
          Travailler avec un studio indépendant, c'est avant tout une relation
          directe, claire et basée sur la confiance. Voici quelques principes
          qui guident chaque projet.
        </motion.p>

        <div className={styles.grid}>
            {ENGAGEMENTS.map((item) => (
                <motion.article
                key={item.title}
                className={styles.card}
                variants={fadeInUpItem}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "sping", stiffness: 260, damping: 22 }}
                >
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.text}>{item.text}</p>
                </motion.article>
            ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
