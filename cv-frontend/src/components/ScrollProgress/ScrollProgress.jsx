import styles from "./ScrollProgress.module.css";

export default function ScrollProgress({
  activeIndex,
  total,
  labels = [],
  onSelectSection,
}) {
  const progress = total > 0 ? ((activeIndex + 1) / total) * 100 : 0;
  const currentLabel = labels[activeIndex] ?? "";

  return (
    <div className={styles.wrapper}>
      {/* Nom / label de la section active */}
      <div className={styles.currentLabel}>
        <span className={styles.currentIndex}>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className={styles.currentName}>{currentLabel}</span>
      </div>

      {/* Barre verticale + steps cliquables */}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ "--progress": `${progress}%` }}
        />

        <div className={styles.steps}>
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={styles.stepItem}
              onClick={() =>
                onSelectSection && onSelectSection(index)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSection && onSelectSection(index);
                }
              }}
            >
              <div
                className={`${styles.stepDot} ${
                  index === activeIndex ? styles.stepDotActive : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Compteur numérique (optionnel, mais je le laisse) */}
      <div className={styles.counter}>
        <span className={styles.current}>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className={styles.sep}>/</span>
        <span className={styles.total}>
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}