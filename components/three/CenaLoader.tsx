"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { amostrarTexto, type Ponto2D } from "@/lib/particulas";

const Cena = dynamic(() => import("./Cena"), { ssr: false });

type Modo = { tipo: "3d"; movel: boolean; texto: Ponto2D[] } | { tipo: "estatico"; motivo: string };

function temWebGL() {
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2") || c.getContext("webgl");
    (ctx as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(ctx);
  } catch {
    return false;
  }
}

/** Desenha o nome com a fonte do site num canvas e devolve os pixels preenchidos. */
async function amostrarNome(palavra: string): Promise<Ponto2D[]> {
  const familia = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() || "sans-serif";
  const W = 1600;
  const H = 300;
  let tamanho = 220;
  const fonte = (t: number) => `800 ${t}px ${familia}`;
  try {
    await document.fonts.load(fonte(tamanho), palavra);
  } catch {
    // Sem a fonte, o canvas usa a sans padrão: o nome continua legível
  }
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  (ctx as CanvasRenderingContext2D & { fontStretch?: string }).fontStretch = "expanded";
  ctx.font = fonte(tamanho);
  const largura = ctx.measureText(palavra).width;
  if (largura > W * 0.94) {
    tamanho = Math.floor((tamanho * W * 0.94) / largura);
    ctx.font = fonte(tamanho);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(palavra, W / 2, H / 2);
  return amostrarTexto(ctx.getImageData(0, 0, W, H).data, W, H, 2);
}

/**
 * Partículas sempre ligadas (decisão do usuário): não há teste de desempenho nem respeito a
 * "menos movimento". A única exceção é navegador sem WebGL, onde é impossível desenhar o 3D:
 * fica o nome estático com brilho, que já vem no HTML.
 */
export function CenaLoader({ palavra }: { palavra: string }) {
  const [modo, setModo] = useState<Modo | null>(null);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    let cancelado = false;
    if (!temWebGL()) {
      setModo({ tipo: "estatico", motivo: "sem-webgl" });
      return;
    }
    const movel = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    amostrarNome(palavra).then((texto) => {
      if (!cancelado) setModo({ tipo: "3d", movel, texto });
    });
    return () => {
      cancelado = true;
    };
  }, [palavra]);

  useEffect(() => {
    const raiz = document.documentElement;
    if (!modo) return;
    raiz.dataset.fita = modo.tipo === "3d" ? (pronta ? "3d" : "testando") : `estatico:${modo.motivo}`;
  }, [modo, pronta]);

  if (!modo || modo.tipo === "estatico") return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh transition-opacity duration-1000 ease-suave ${
        pronta ? "opacity-100" : "opacity-0"
      }`}
    >
      <Cena
        movel={modo.movel}
        texto={modo.texto}
        aoCarregar={() => setPronta(true)}
      />
    </div>
  );
}
