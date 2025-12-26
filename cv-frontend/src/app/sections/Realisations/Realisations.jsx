"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import styles from "@/styles/Realisations.module.css";
import ui from "@/styles/ui.module.css";
import { fadeInUpContainer, fadeInUpItem } from "@/lib/animations/variants";
import { getRealisations } from "@/lib/apiClient";

export default function Realisations() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRealisations({ limit: 4 })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <motion.section
      id="realisations"
      className={styles.realisationsSection}
      aria-labelledby="realisations-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={styles.bgGlow} aria-hidden="true" />

      <motion.div
        className={`${ui.container} ${styles.realisationsInner}`}
        variants={fadeInUpContainer}
      >
        <div className={styles.sectionHeader}>
          <motion.p className={styles.sectionKicker} variants={fadeInUpItem}>
            Réalisations
          </motion.p>
          <motion.h2
            id="realisations-title"
            className={styles.sectionTitle}
            variants={fadeInUpItem}
          >
            Des projets concrets, pas seulement des idées
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} variants={fadeInUpItem}>
            Quelques exemples de projets sur lesquels PyTechSolutions a
            travaillé. L’objectif reste toujours le même&nbsp;: des solutions
            utiles, maintenables et adaptées à la réalité du terrain.
          </motion.p>
        </div>

        <div className={styles.projectList}>
          {loading ? (
            <p>Chargement des réalisations…</p>
          ) : projects.length === 0 ? (
            <p>Aucune réalisation pour le moment.</p>
          ) : (
            projects.map((project, index) => (
              <motion.article
                key={project.title}
                className={styles.projectItem}
                variants={fadeInUpItem}
              >
                <div className={styles.projectHeader}>
                  <span className={styles.projectIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.projectType}>{project.type || "Projet"}</span>
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>

                {project.result && (
                  <div className={styles.projectResult}>
                    <p className={styles.resultLabel}>Impact</p>
                    <p className={styles.resultText}>{project.result}</p>
                  </div>
                )}

                <div className={styles.projectMeta}>
                  <span className={styles.projectStack}>{project.stack || ""}</span>
                  <span className={styles.projectStatus}>{project.status}</span>
                </div>
              </motion.article>
            ))
          )}
        </div>

        <motion.div className={styles.footer} variants={fadeInUpItem}>
          <p className={styles.footerText}>
            Vous souhaitez voir comment ces approches pourraient s&apos;adapter
            à votre activité&nbsp;?
          </p>
          <Link href="/contact" className={ui.primaryButton}>
            Discuter de mon projet
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
