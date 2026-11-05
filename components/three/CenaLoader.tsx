"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Cena = dynamic(() => import("./Cena"), { ssr: false });

function temWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Monta o 3D só no navegador, depois do texto, e só se houver WebGL.
 * Com movimento reduzido, a fita fica parada e restrita ao topo da página.
 */
export function CenaLoader() {
  const [config, setConfig] = useState<{ movel: boolean; animar: boolean } | null>(null);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    if (!temWebGL()) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const movel = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const iniciar = () => setConfig({ movel, animar: !reduzido });
    // Espera o navegador ficar livre para não atrasar o primeiro conteúdo
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(iniciar, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(iniciar, 300);
    return () => clearTimeout(t);
  }, []);

  if (!config) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none inset-x-0 top-0 z-0 h-svh transition-opacity duration-1000 ease-suave ${
        config.animar ? "fixed" : "absolute"
      } ${pronta ? "opacity-100" : "opacity-0"}`}
    >
      <Cena movel={config.movel} animar={config.animar} aoCarregar={() => setPronta(true)} />
    </div>
  );
}
