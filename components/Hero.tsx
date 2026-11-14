"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import profile from "@/public/assets/images/dp.jpg";
import { keywords, site, socials } from "@/lib/site";
import { SocialIcon } from "./SocialIcon";

/* ---------- keyword wall ---------- */

const ROW_COUNT = 19;

// Small seeded PRNG so server and client shuffle every row identically.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const wallRows = Array.from({ length: ROW_COUNT }, (_, row) => {
  const random = mulberry32(row + 1);
  const words = [...keywords];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  const line = words.join(" • ");
  // Four copies: the CSS drift shifts by exactly one copy, so the loop is seamless.
  return [line, line, line, line].join(" • ");
});

/* ---------- social icons on an arc around the photo ---------- */

// Angles in degrees (0 = right, 180 = left), mirrored around the photo's left edge.
const ICON_ANGLES = [228, 197, 163, 132];
const ORBIT_RADIUS = 61; // % of the photo box, so it scales with the photo

const orbit = socials.map((social, i) => {
  const rad = (ICON_ANGLES[i] * Math.PI) / 180;
  return {
    ...social,
    left: `${(50 + ORBIT_RADIUS * Math.cos(rad)).toFixed(2)}%`,
    top: `${(50 + ORBIT_RADIUS * Math.sin(rad)).toFixed(2)}%`,
  };
});

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // The reveal patch eases after the cursor instead of snapping to it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let started = false;
    let frame = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      // Set on the section so the keyword wall and the glow behind it share them.
      section.style.setProperty("--cursor-x", `${pos.x.toFixed(1)}px`);
      section.style.setProperty("--cursor-y", `${pos.y.toFixed(1)}px`);
      const settled =
        Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) < 0.5;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!started) {
        started = true;
        pos.x = target.x;
        pos.y = target.y;
      }
      run();
    };
    const onLeave = () => {
      const rect = section.getBoundingClientRect();
      target.x = rect.width / 2;
      target.y = rect.height / 2;
      run();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero group relative overflow-hidden py-16"
    >
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="hero-wall pointer-events-none absolute inset-0 flex flex-col items-center justify-around"
      >
        {wallRows.map((row, i) => (
          <p
            key={i}
            className="wall-row w-max shrink-0 text-xs whitespace-nowrap sm:text-sm"
            style={{ "--drift": `${150 + (i % 5) * 22}s` } as React.CSSProperties}
          >
            {row}
          </p>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 px-4 sm:px-6 lg:flex-row">
        <div className="mb-8 w-full text-center lg:mb-0 lg:w-1/2 lg:text-left">
          <motion.h1
            className="mb-5 text-3xl leading-[1.1] text-ink sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
          >
            Hi, I&apos;m {site.name}
          </motion.h1>
          <motion.p
            className="text-lg text-muted sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
          >
            {site.tagline}
          </motion.p>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="relative size-48 sm:size-64 md:size-80">
            <motion.div
              className="relative size-full overflow-hidden rounded-full border-4 border-line bg-surface"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <Image
                src={profile}
                alt={site.name}
                fill
                priority
                sizes="(min-width: 768px) 320px, (min-width: 640px) 256px, 192px"
                className="object-cover object-[50%_30%]"
              />
            </motion.div>

            {orbit.map((social, i) => (
              <span
                key={social.name}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: social.left, top: social.top }}
              >
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="block rounded-full border border-line bg-surface p-2 text-ink transition-[color,border-color,box-shadow] duration-300 hover:border-accent hover:text-accent hover:shadow-lg sm:p-3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                    delay: 0.45 + i * 0.1,
                  }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SocialIcon name={social.icon} className="size-4 sm:size-5" />
                </motion.a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
