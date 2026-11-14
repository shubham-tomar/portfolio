"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { navLinks, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

/** A square bar hanging from the top of the page, divided into cells. */
export function Header() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-page/85 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="site-bar">
          <Link href="/" className="site-bar-name">
            <span className="site-bar-mark" aria-hidden="true" />
            {site.name}
          </Link>

          <nav className="hidden md:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="site-bar-cell site-bar-link"
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && (
                    // One marker shared by all links, so it slides between them.
                    <motion.span
                      layoutId="nav-marker"
                      className="site-bar-marker"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex">
            <ThemeToggle />
            <button
              type="button"
              className="site-bar-cell w-14 justify-center md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="square"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="site-menu md:hidden" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-menu-link"
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
