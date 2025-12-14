"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  const containerVariantes = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      className={styles.footer}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div className={styles.footerInner} variants={containerVariantes}>
        <motion.div className={styles.footerBrand} variants={itemVariants}>
          <span className={styles.footerBrandName}>PyTechSolutions</span>
          <p className={styles.footerTagline}>
            Développement sur mesure, automatisation et solutions modernes.
          </p>
        </motion.div>

        {/* Bloc centre : navigation */}
        <motion.nav className={styles.footerNav} variants={itemVariants}>
          <Link href="/">Accueil</Link>
          <Link href="/realisations">Réalisations</Link>
          <Link href="/cv">CV</Link>
          <Link href="/contact">Contact</Link>
        </motion.nav>

        {/* Bloc droite : socials / contact */}
        <motion.div className={styles.footerMeta} variants={itemVariants}>
          <div className={styles.socials}>
            <motion.a
              href="https://www.linkedin.com/..."
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              LinkedIn
            </motion.a>
            <motion.a 
            href="mailto:contact@pytechsolutions.fr"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15}}
            >
              contact@pytechsolutions.fr
            </motion.a>
          </div>
          <p className={styles.footerCopy}>
            © {year} PyTechSolutions. Tous droits réservés.
          </p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
