"use client"

import { motion } from "framer-motion"

import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants";
import styles from "./Expertises.module.css";

const EXPERTISES = [
  {
    category: "Backend & APIs",
    title: "Des fondations solides pour vos outils",
    text: "Conception et développement de backends robustes, sécurisés et pensés pour évoluer avec votre activité.",
    points: [
      "APIs REST avec Django / Django REST Framework",
      "Architecture et modèle de données adaptés à votre métier",
      "Sécurité, permissions et performance prises en compte dès le départ",
    ],
    stack: "Python · Django · PostgreSQL",
  },
  {
    category: "Interfaces web modernes",
    title: "Des interfaces claires, rapides et agréables",
    text: "Création de sites et applications web avec une vraie attention portée à l'expérience utilisateur",
    points: [
      "Next.js pour des interfaces rapides et SEO-friendly",
      "Animation subtiles (Framer Motion) pour un rendu moderne",
      "Intégration soignée de votre identité visuelle",
    ],
    stack: "Next.js · React · Framer Motion",
  },
  {
    category: "Automatisation & outils sur mesure",
    title: "Gagner du temps sans changer tout votre système",
    text: "Mise en place d'automatisation ciblées et d'outils internes qui vous font gagner des heures chaque semaine.",
    points: [
      "Scripts Python pour vos tâches récurrentes",
      "Connecteurs entre vos outils (CRM, facturation, e-commerce...)",
      "Dashboard ou mini-interfaces pour piloter vos données",
    ],
    stack: "Python · APIs · Intégration tierces",
  },
];

export default function Expertises() {
  return (
    <motion.section 
    className={styles.expertises}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div 
      className={styles.inner}
      variants={fadeInUpContainer}
      >
        <motion.p 
        className={styles.kicker}
        variants={fadeInUpItem}
        >
            Expertises
        </motion.p>
        <motion.h2
         className={styles.title}
         variants={fadeInUpItem}>Ce que nous construisons pour vous</motion.h2>
        <motion.p className={styles.intro}
        variants={fadeInUpItem}>
          PytechSolutions se concentre sur quelques domaines clés: des backends
          solides, des interfaces modernes et des automatisations fluides. Pas
          de promesses floues, juste des solutions concrètes.
        </motion.p>
        <div className={styles.grid}>
            {EXPERTISES.map((item) => (
                <motion.article key={item.category} className={styles.card}
                variants={fadeInUpItem}
                whileHover={{ y: -4, scale: 1.02}}
                transition={{ type: "spring", stiffness: 260, damping: 20}}>
                    <span className={styles.category}>{item.category}</span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.text}>{item.text}</p>
                    <ul className={styles.list}>
                        {item.points.map((point, index) => (
                        <li key={index}>{point}
                        </li>
                    ))}
                    </ul>
                    <p className={styles.stack}>{item.stack}</p>
                </motion.article>
            ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
