"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import styles from "@/styles/Testimonials.module.css";
import ui from "@/styles/ui.module.css";

export default function TestimonialsSection({ items = [] }) {
  const [active, setActive] = useState(0);

  const intervalRef = useRef(null);
  const pointerStartX = useRef(null);
  const isPausedRef = useRef(false);

  const AUTO_DELAY = 6000; // ms
  const SWIPE_THRESHOLD = 50; // px

  const hasItems = Array.isArray(items) && items.length > 0;

  const total = useMemo(() => (hasItems ? items.length : 0), [hasItems, items.length]);

  useEffect(() => {
    if (!hasItems) return;
    if (active > items.length - 1) setActive(0);
  }, [hasItems, items.length, active]);

  useEffect(() => {
    if (!hasItems || total <= 1) return;

    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setActive((i) => (i + 1) % total);
        }
      }, AUTO_DELAY);
    };

    const stop = () => clearInterval(intervalRef.current);

    const onVisibility = () => {
      isPausedRef.current = document.hidden;
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hasItems, total]);

  const goPrev = () => {
    if (total <= 1) return;
    setActive((i) => (i - 1 + total) % total);
    resetTimer();
  };

  const goNext = () => {
    if (total <= 1) return;
    setActive((i) => (i + 1) % total);
    resetTimer();
  };

  const onKeyDown = (e) => {
    if (total <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const pause = () => {
    isPausedRef.current = true;
  };

  const resume = () => {
    isPausedRef.current = false;
  };

  const resetTimer = () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setActive((i) => (i + 1) % total);
      }
    }, AUTO_DELAY);
  };

  const onPointerDown = (e) => {
    pointerStartX.current = e.clientX;
    pause();
  };

  const onPointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? goNext() : goPrev();
    }

    resume();
    resetTimer();
  };

  return (
    <section
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className={`${ui.container} ${styles.inner}`}>
        <header className={styles.header}>
          <h2 id="testimonials-title" className={styles.title}>
            Ils nous ont fait confiance
          </h2>
          <p className={styles.subtitle}>
            Ce que nos clients disent de notre accompagnement.
          </p>
        </header>

        {!hasItems && (
          <p className={styles.empty} aria-live="polite">
            Aucun témoignage pour le moment.
          </p>
        )}

        {hasItems && (
          <>
            {/* Testimonials carousel (default on all breakpoints) */}
            <div
              className={styles.carousel}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {items.length > 1 && (
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={goPrev}
                  aria-label="Témoignage précédent"
                >
                  ‹
                </button>
              )}

              <div className={styles.cardWrapper}>
                <TestimonialCard testimonial={items[active]} />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={goNext}
                  aria-label="Témoignage suivant"
                >
                  ›
                </button>
              )}

              {items.length > 1 && (
                <div
                  className={styles.dots}
                  role="tablist"
                  aria-label="Navigation des témoignages"
                >
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-current={i === active}
                      className={i === active ? styles.dotActive : styles.dot}
                      onClick={() => setActive(i)}
                      aria-label={`Afficher le témoignage ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}