"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  valor: number;
  formato: "moeda" | "numero";
  /** Texto pronto para quando o valor não deve aparecer exato (modo faixa) */
  textoFixo?: string;
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const numero = new Intl.NumberFormat("pt-BR");

/** Conta de zero até o valor quando aparece na tela, uma vez só. */
export function Contador({ valor, formato, textoFixo }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);
  const fmt = formato === "moeda" ? moeda : numero;

  useEffect(() => {
    const el = ref.current;
    if (!el || textoFixo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtual(0);
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const duracao = 1800;
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          const suave = 1 - Math.pow(2, -10 * t);
          setAtual(Math.round(valor * (t === 1 ? 1 : suave)));
          if (t < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor, textoFixo]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">{textoFixo ?? fmt.format(atual)}</span>
      <span className="sr-only">{textoFixo ?? fmt.format(valor)}</span>
    </span>
  );
}
