"use client";

import { motion } from "motion/react";
import type { ComponentType, ReactNode } from "react";

type Tag = "div" | "p" | "h1" | "h2" | "h3" | "li" | "nav" | "span" | "img";

type Props = {
  children?: ReactNode;
  as?: Tag;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
} & Record<string, unknown>;

/** Entra na tela uma vez, deslizando e aparecendo (curva do template). */
export function FadeIn({ children, as = "div", delay = 0, duration = 0.7, x = 0, y = 30, className, ...resto }: Props) {
  // Componente do Motion para a tag pedida (motion.div, motion.p, motion.h1...)
  const Comp = motion[as] as unknown as ComponentType<Record<string, unknown>>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...resto}
    >
      {children}
    </Comp>
  );
}
