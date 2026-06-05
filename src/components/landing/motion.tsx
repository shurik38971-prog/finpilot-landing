"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export function MotionDiv({
  children,
  className,
  animate,
}: {
  children: ReactNode;
  className?: string;
  animate?: Record<string, number | number[]>;
}) {
  return (
    <motion.div
      className={className}
      animate={animate}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
