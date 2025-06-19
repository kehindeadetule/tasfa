"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fadeIn" | "fadeInUp";
  delay?: number;
}

export default function AnimatedSection({
  children,
  animation = "fadeIn",
  delay = 0,
}: AnimatedSectionProps) {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.div
      initial={variants[animation].initial}
      whileInView={variants[animation].animate}
      viewport={{
        once: false,
        margin: "-50px",
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
