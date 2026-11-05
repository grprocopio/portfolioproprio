"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Texto com uma palavra entre asteriscos para o itálico. Ex.: "um *exemplo* aqui" */
  texto: string;
  className?: string;
};

/**
 * Cada palavra começa apagada e acende, na ordem de leitura,
 * quando cruza uma linha a 70% da altura da tela.
 */
export function RevelarPalavras({ texto, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [acesas, setAcesas] = useState(0);
  const palavras = texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-palavra]"));
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const linha = window.innerHeight * 0.7;
      let n = 0;
      for (const s of spans) {
        if (s.getBoundingClientRect().top < linha) n++;
        else break;
      }
      setAcesas((atual) => (atual === n ? atual : n));
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [palavras.length]);

  return (
    <p ref={ref} className={className}>
      {palavras.map((p, i) => {
        const italico = p.startsWith("*");
        const limpa = p.replace(/\*/g, "");
        const conteudo = italico ? <em>{limpa}</em> : limpa;
        return (
          <span key={i}>
            <span
              data-palavra
              className="transition-opacity duration-500 ease-suave"
              style={{ opacity: i < acesas ? 1 : 0.28 }}
            >
              {conteudo}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
