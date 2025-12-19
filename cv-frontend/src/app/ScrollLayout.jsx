"use client";

import { useEffect, useRef, useState } from "react";
import ScrollProgress from "@/components/ScrollProgress/ScrollProgress";
import styles from "@/components/ScrollProgress/ScrollProgress.module.css"

const SECTION_LABELS = [
  "Accueil",
  "À propos",
  "Expertises",
  "Réalisations",
  "Témoignages",
  "Engagements",
  "Contact",
  "Footer"
];

export default function ScrollLayout({ children }) {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  useEffect(() => {
    document.body.classList.add("scroll-layout");
    return () => document.body.classList.remove("scroll-layout");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll("section"));
    sectionRefs.current = sections;
    setTotalSections(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSelectSection = (index) => {
    const container = containerRef.current;
    const target = sectionRefs.current[index];
    if (!container || !target) return;

    // Scroll doux vers la section
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const labels = SECTION_LABELS.slice(0, totalSections);

  return (
    <>
      <main ref={containerRef} className={styles.fullpage}>
        {children}
      </main>

      {totalSections > 0 && (
        <ScrollProgress
          activeIndex={activeIndex}
          total={totalSections}
          labels={labels}
          onSelectSection={handleSelectSection}
        />
      )}
    </>
  );
}