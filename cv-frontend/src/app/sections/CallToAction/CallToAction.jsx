"use client"

import { motion } from "framer-motion"
import Link from "next/link"

import styles from "./CallToAction.module.css"
import ui from "@/styles/ui.module.css";
import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants"

export default function CallToAction() {
    return (
        <motion.section 
        className={styles.ctaSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4}}
        >
            <motion.div 
            className={styles.inner}
            variants={fadeInUpContainer}
            >
                <motion.p
                className={styles.kicker}
                variants={fadeInUpItem}
                >
                    Et maintenant ?
                </motion.p>
                <motion.h2 
                className={styles.title}
                variants={fadeInUpItem}
                >
                    Parlons de votre projet.
                </motion.h2>
                <motion.p 
                className={styles.text}
                variants={fadeInUpItem}
                >
                    Vous avez une idée à clarifier, un outil interne à construire, un site à moderniser ou des tâches à automatiser&nbsp;? Expliquez-moi votre contexte en quelques lignes, et nous verrons ensemble comment PyTechSolutions peut vous aider concrètement.
                </motion.p>
                <motion.div 
                className={styles.actions}
                variants={fadeInUpItem}
                >
                    <Link href="/contact" className={`${ui.button} ${styles.primaryButton}`}>
                    Discuter de mon projet</Link>
                    <Link href="/realisations" className={`${ui.button} ${ui.buttonGhost} ${styles.secondaryLink}`}>
                    Voir quelques réalisations
                    </Link>
                </motion.div>
                <motion.p className={styles.note} variants={fadeInUpItem}>
                    Pas besoin d'avoir un cahier des charges parfait&nbsp;: un besoin, un contexte, quelques exemples suffisent pour commencer. 
                </motion.p>
            </motion.div>
        </motion.section>
    )
}