"use client";

import { useEffect, useRef, useState } from "react";

type Props = { valor: number; formato: "moeda" | "numero" };

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const numero = new Intl.NumberFormat("pt-BR");

/**
 * Na primeira vez que aparece na tela, conta de zero até o valor.
 * Depois, quando o valor muda (novo pagamento, edição), vai direto do valor antigo ao novo,
 * sem voltar a zero nem esperar o cartão reaparecer: o número na tela está sempre certo.
 */
export function Contador({ valor, formato }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);
  const mostrado = useRef(valor);
  const jaContou = useRef(false);
  const fmt = formato === "moeda" ? moeda : numero;

  useEffect(() => {
    let raf = 0;
    const animar = (de: number, ate: number, duracao: number) => {
      cancelAnimationFrame(raf);
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / duracao);
        const suave = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        mostrado.current = de + (ate - de) * suave;
        setAtual(Math.round(mostrado.current));
        if (t < 1) raf = requestAnimationFrame(passo);
      };
      raf = requestAnimationFrame(passo);
    };

    if (jaContou.current) {
      animar(mostrado.current, valor, 700);
      return () => cancelAnimationFrame(raf);
    }

    const el = ref.current;
    if (!el) return;
    mostrado.current = 0;
    setAtual(0);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        jaContou.current = true;
        animar(0, valor, 1800);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">{fmt.format(atual)}</span>
      <span className="sr-only">{fmt.format(valor)}</span>
    </span>
  );
}
