"use client";

import { useEffect, useState } from "react";

/** Painel técnico, só com `?diag` no endereço: mostra por que o 3D ligou ou não neste aparelho. */
export function Diagnostico() {
  const [linhas, setLinhas] = useState<[string, string][] | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(location.search).has("diag")) return;
    let renderizador = "sem WebGL";
    try {
      const ctx = (document.createElement("canvas").getContext("webgl2") ||
        document.createElement("canvas").getContext("webgl")) as WebGLRenderingContext | null;
      if (ctx) {
        const ext = ctx.getExtension("WEBGL_debug_renderer_info");
        renderizador = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
      }
    } catch {
      renderizador = "erro ao criar WebGL";
    }
    // FPS medido de verdade nesta página (quadros por segundo do navegador)
    let quadros = 0;
    let fps = 0;
    let inicio = performance.now();
    let raf = 0;
    const contar = (t: number) => {
      quadros++;
      if (t - inicio >= 1000) {
        fps = Math.round((quadros * 1000) / (t - inicio));
        quadros = 0;
        inicio = t;
      }
      raf = requestAnimationFrame(contar);
    };
    raf = requestAnimationFrame(contar);
    const atualizar = () => {
      setLinhas([
        ["Modo", document.documentElement.dataset.fita ?? "carregando"],
        ["Menos movimento (sistema)", window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "LIGADO" : "desligado"],
        ["Placa de vídeo (WebGL)", renderizador],
        ["Tela", `${innerWidth}×${innerHeight} @${devicePixelRatio}x`],
        ["Quadros por segundo", String(fps)],
      ]);
    };
    atualizar();
    const id = setInterval(atualizar, 1000);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!linhas) return null;
  return (
    <aside
      aria-label="Diagnóstico"
      className="fixed left-4 top-20 z-[80] max-w-sm rounded-xl border border-destaque bg-fundo p-4 font-mono text-xs text-forte"
    >
      <ul className="space-y-1">
        {linhas.map(([k, v]) => (
          <li key={k}>
            <span className="text-apagado">{k}:</span> {v}
          </li>
        ))}
      </ul>
    </aside>
  );
}
