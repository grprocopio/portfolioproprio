"use client";

import { useEffect, useRef } from "react";

/** Pontinhos de luz: posição inicial, profundidade (z) e tamanho fixos, gerados com semente */
const PONTOS = (() => {
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 30 }, () => ({ x: r(), y: r(), z: r() }));
})();

const fract = (v: number) => v - Math.floor(v);

/**
 * Céu noturno atrás do site (adaptado do céu do prompt "Driftlab", em versão noite):
 * nuvens que deslizam devagar com o tempo e com a rolagem, e pontinhos de luz subindo.
 * Só transform/opacity (camadas na GPU, sem WebGL): leve em qualquer aparelho.
 */
export function CeuNoturno() {
  const nuvens = useRef<HTMLDivElement>(null);
  const pontos = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let rolagem = 0;
    let suave = 0;
    const lerRolagem = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      rolagem = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };
    lerRolagem();
    suave = rolagem;
    addEventListener("scroll", lerRolagem, { passive: true });
    addEventListener("resize", lerRolagem);

    const quadro = (ms: number) => {
      const t = ms / 1000;
      suave += (rolagem - suave) * 0.1;
      const h = innerHeight;
      // Largura de uma "volta" da textura (2048×1152 cobrindo a altura da tela)
      const ladrilho = Math.max(innerWidth, (h * 2048) / 1152);
      const desloc = fract(suave * 0.05 + t * 0.0022) * ladrilho;
      if (nuvens.current) {
        nuvens.current.style.backgroundSize = `${ladrilho}px 100%`;
        // Duas voltas de largura: o deslize nunca chega ao fim da faixa
        nuvens.current.style.width = `${ladrilho * 2}px`;
        nuvens.current.style.transform = `translate3d(${-desloc}px,0,0)`;
      }
      const escala = h / 900;
      PONTOS.forEach((p, i) => {
        const el = pontos.current[i];
        if (!el) return;
        const y = fract(p.y + t * 0.012 * (0.4 + p.z));
        const x = fract(p.x + suave * 0.004 * 4) + 0.015 * Math.sin(t * 0.2 + p.z * 9);
        const tam = (5 + p.z * 24) * escala;
        el.style.transform = `translate3d(${x * innerWidth}px,${(1 - y) * (h + 60) - 30}px,0)`;
        el.style.width = el.style.height = `${tam}px`;
      });
      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", lerRolagem);
      removeEventListener("resize", lerRolagem);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-fundo">
      <div
        ref={nuvens}
        className="absolute inset-y-0 left-0 w-[200vw]"
        style={{ backgroundImage: "url(/ceu-noite.webp)", backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", willChange: "transform" }}
      />
      {PONTOS.map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            pontos.current[i] = el;
          }}
          className="absolute left-0 top-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgb(255 255 255 / 0.62) 0%, rgb(255 255 255 / 0) 70%)", willChange: "transform" }}
        />
      ))}
    </div>
  );
}
