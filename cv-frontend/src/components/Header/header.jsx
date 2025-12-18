"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import styles from "./Header.module.css";

export default function Header() {
  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/contact", label: "Contact" },
  ];

  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const mobileVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Barre principale */}
      <div className={styles.headerRow}>
        <div className={styles.brand}>
          <motion.div
            whileHover={{ rotate: 3, scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={styles.logoWrapper}
          >
            <Image
              src="/logo.webp"
              alt="Logo de PyTechSolutions"
              width={40}
              height={40}
              priority
            />
          </motion.div>
          <motion.span
            className={styles.brandName}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            PyTechSolutions
          </motion.span>
        </div>

        {/* Navigation desktop */}
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <div key={link.href} className={styles.navItem}>
                <Link
                  href={link.href}
                  className={isActive ? styles.navLinkActive : styles.navLink}
                >
                  <motion.span
                    whileHover={{ y: -1, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>

                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className={styles.navUnderline}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Burger mobile */}
        <button
          type="button"
          className={`${styles.mobileToggle} ${
            isMobileOpen ? styles.mobileToggleOpen : ""
          }`}
          onClick={toggleMobile}
          aria-label="Ouvrir ou fermer la navigation"
          aria-expanded={isMobileOpen}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      <motion.nav
        className={styles.navMobile}
        initial={false}
        animate={isMobileOpen ? "open" : "closed"}
        variants={mobileVariants}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className={styles.navMobileInner}>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive ? styles.navMobileLinkActive : styles.navMobileLink
                }
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </motion.header>
  );
}