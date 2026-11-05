"use client";

import { Canvas } from "@react-three/fiber";
import type { Ponto2D } from "@/lib/particulas";
import { Particulas } from "./Particulas";

type Props = { movel: boolean; texto: Ponto2D[]; aoCarregar: () => void };

export default function Cena({ movel, texto, aoCarregar }: Props) {
  // Resolução fixa desde o início (trocar no meio da rolagem realoca o canvas e engasga)
  const dpr = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, movel ? 1.5 : 1.75);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
      // Partículas aditivas não precisam de antialias nem de buffer de profundidade
      gl={{ antialias: false, depth: false, stencil: false, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#050816")}
    >
      <Particulas
        quantidade={movel ? 9000 : 22000}
        texto={texto}
        aoPronto={aoCarregar}
      />
    </Canvas>
  );
}
