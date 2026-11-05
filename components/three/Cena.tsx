"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { WebGLRenderer } from "three";
import { Fita } from "./Fita";

export type MotivoQueda = "software" | "lento";

type Props = { movel: boolean; forcar: boolean; aoCarregar: () => void; aoFalhar: (m: MotivoQueda) => void };

/** Estúdio só com painéis brancos: reflexo puramente em preto e branco */
function Estudio() {
  return (
    <Environment resolution={128} frames={1}>
      <color attach="background" args={["#000000"]} />
      {/* Faixa larga no teto: brilho principal das bordas */}
      <Lightformer form="rect" intensity={3} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 3, 1]} />
      {/* Faixas verticais assimétricas, como softboxes de estúdio */}
      <Lightformer form="rect" intensity={4} position={[-7, 1.5, 2]} rotation-y={Math.PI / 2} scale={[1.2, 10, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[7, -0.5, -1]} rotation-y={-Math.PI / 2} scale={[0.6, 7, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[4.5, 2, 6]} rotation-y={-Math.PI / 4} scale={[0.5, 6, 1]} />
      {/* Painel atrás da câmera, fora do eixo: ilumina o túnel sem desenhar formas no centro da esfera */}
      <Lightformer form="rect" intensity={1.1} position={[-6, -3.5, 11]} rotation-y={Math.PI * 0.85} rotation-z={0.6} scale={[7, 1.6, 1]} />
      <Lightformer form="rect" intensity={0.5} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={[10, 1, 1]} />
    </Environment>
  );
}

/** WebGL desenhado pela CPU (aceleração desligada ou driver bloqueado): 3D nunca fica fluido */
function porSoftware(gl: WebGLRenderer) {
  const ctx = gl.getContext();
  const ext = ctx.getExtension("WEBGL_debug_renderer_info");
  const nome = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
  return /swiftshader|llvmpipe|software|basic render/i.test(nome);
}

export default function Cena({ movel, forcar, aoCarregar, aoFalhar }: Props) {
  // Resolução fixa desde o início: trocar no meio da rolagem realoca o canvas e engasga
  const dpr = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, movel ? 1.25 : 1.5);

  return (
    <Canvas
      dpr={dpr}
      frameloop="demand"
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: !movel, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => {
        if (!forcar && porSoftware(gl)) return aoFalhar("software");
        gl.setClearColor("#0a0a0a");
      }}
    >
      <fog attach="fog" args={["#0a0a0a", 12, 30]} />
      <Estudio />
      <Fita quantidade={movel ? 150 : 320} aoLento={forcar ? undefined : () => aoFalhar("lento")} aoPronto={aoCarregar} />
    </Canvas>
  );
}
