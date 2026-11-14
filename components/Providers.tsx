"use client";

import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // "user" drops transform animations for visitors who ask for reduced motion.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
