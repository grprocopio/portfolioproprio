"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Distância (px) além da borda em que o efeito começa */
  alcance?: number;
  /** Quanto maior, mais sutil o deslocamento */
  forca?: number;
  className?: string;
};

/** Efeito magnético: o elemento segue o mouse quando o cursor chega perto. */
export function Ima({ children, alcance = 150, forca = 3, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let quadro = 0;
    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const perto =
          e.clientX > r.left - alcance &&
          e.clientX < r.right + alcance &&
          e.clientY > r.top - alcance &&
          e.clientY < r.bottom + alcance;
        setAtivo(perto);
        setPos(perto ? { x: (e.clientX - cx) / forca, y: (e.clientY - cy) / forca } : { x: 0, y: 0 });
      });
    };
    window.addEventListener("pointermove", aoMover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", aoMover);
      cancelAnimationFrame(quadro);
    };
  }, [alcance, forca]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: ativo ? "transform 0.3s ease-out" : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
