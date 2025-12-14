"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className={`${styles.hero} bg-first`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.div
        className={styles.orbit}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -15, 15, 0],
          rotate: 360,
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className={styles.orbitCore} />
      </motion.div>

      <motion.div className={styles.heroInner} variants={fadeInUpContainer}>
        <motion.p className={styles.tagline} variants={fadeInUpItem}>
          Studio de développement
        </motion.p>

        <motion.h1 className={styles.title} variants={fadeInUpItem}>
          Construisons des outils qui font vraiment avancer votre business
        </motion.h1>

        <motion.p className={styles.description} variants={fadeInUpItem}>
          PyTechSolutions conçoit des applications web, API et automatisations
          sur mesure, avec des approches claire, moderne et orientée résultats.
          Un studio tech qui parle votre langage, pas seulement celui des
          machines.
        </motion.p>

        <motion.div className={styles.chips} variants={fadeInUpItem}>
          <div className={styles.chip}>
            <span className={styles.chipDot} />
            <span>Studio indépendant</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipDot} />
            <span>Python · Django · Next.js</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipDot} />
            <span>Automatisation & outils sur mesure</span>
          </div>
        </motion.div>

        <motion.div className={styles.actions} variants={fadeInUpItem}>
          <Link href="/contact" className={styles.primaryButton}>
            <motion.span
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              Contactez-moi
            </motion.span>
          </Link>

          <Link href="/realisations" className={styles.secondaryButton}>
            <motion.span
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              Voir les réalisations
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <span>Scroll</span>
        <div className={styles.scrollLine}>
          <motion.span
            className={styles.scrollDot}
            animate={{ y: [0, 24, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}