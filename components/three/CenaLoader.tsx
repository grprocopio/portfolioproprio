"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { MotivoQueda } from "./Cena";

const Cena = dynamic(() => import("./Cena"), { ssr: false });

type Modo = { tipo: "3d"; movel: boolean; forcar: boolean } | { tipo: "imagem"; motivo: string };

/**
 * Sonda o WebGL num contexto descartável, ANTES de montar a cena:
 * criar a cena num computador sem aceleração já trava a página por segundos.
 */
function sondarWebGL(): "ok" | "sem-webgl" | "software" {
  try {
    const c = document.createElement("canvas");
    const ctx = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!ctx) return "sem-webgl";
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    const nome = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(nome) ? "software" : "ok";
  } catch {
    return "sem-webgl";
  }
}

/** Fita parada (imagem pré-renderizada da própria cena), atrás do topo da página. Custo de GPU zero. */
function FitaImagem() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh overflow-hidden">
      <picture>
        <source media="(orientation: portrait)" srcSet="/fita-anel-retrato.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fita-anel.webp" alt="" decoding="async" className="h-full w-full object-cover" />
      </picture>
    </div>
  );
}

/**
 * Decide como mostrar a fita:
 * 3D só quando a máquina aguenta (GPU de verdade e quadros rápidos no aquecimento);
 * senão, imagem estática. Movimento reduzido e falta de WebGL também usam a imagem.
 * `?fita=3d` força o 3D (para testes).
 */
export function CenaLoader() {
  const [modo, setModo] = useState<Modo | null>(null);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    const forcar = new URLSearchParams(location.search).get("fita") === "3d";
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = sondarWebGL();
    if (!forcar && (reduzido || webgl !== "ok")) {
      setModo({ tipo: "imagem", motivo: reduzido ? "movimento-reduzido" : webgl });
      return;
    }
    const movel = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const iniciar = () => setModo({ tipo: "3d", movel, forcar });
    // Espera o navegador ficar livre para não atrasar o primeiro conteúdo
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(iniciar, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(iniciar, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (modo) document.documentElement.dataset.fita = modo.tipo === "3d" ? "3d" : `imagem:${modo.motivo}`;
  }, [modo]);

  // A imagem vem já no HTML do servidor: o topo nunca fica vazio enquanto o 3D é testado
  if (!modo || modo.tipo === "imagem") return <FitaImagem />;

  return (
    <>
    <FitaImagem />
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-svh transition-opacity duration-1000 ease-suave ${
        pronta ? "opacity-100" : "opacity-0"
      }`}
    >
      <Cena
        movel={modo.movel}
        forcar={modo.forcar}
        aoCarregar={() => setPronta(true)}
        aoFalhar={(m: MotivoQueda) => setModo({ tipo: "imagem", motivo: m })}
      />
    </div>
    </>
  );
}
