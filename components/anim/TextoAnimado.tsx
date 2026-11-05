"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Letra({ c, progresso, inicio, fim }: { c: string; progresso: MotionValue<number>; inicio: number; fim: number }) {
  const opacidade = useTransform(progresso, [inicio, fim], [0.2, 1]);
  return (
    <span className="relative">
      {/* Espaço reservado invisível: mantém a quebra de linha estável */}
      <span className="invisible">{c}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity: opacidade }}>
        {c}
      </motion.span>
    </span>
  );
}

/** Cada letra vai de 20% a 100% de opacidade conforme o parágrafo atravessa a tela. */
export function TextoAnimado({ texto, className = "" }: { texto: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const letras = texto.split("");
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {letras.map((c, i) => (
          <Letra key={i} c={c} progresso={scrollYProgress} inicio={i / letras.length} fim={(i + 1) / letras.length} />
        ))}
      </span>
    </p>
  );
}
