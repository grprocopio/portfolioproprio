"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import { Fita } from "./Fita";

type Props = { movel: boolean; animar: boolean; aoCarregar: () => void };

/** Estúdio só com painéis brancos: reflexo puramente em preto e branco */
function Estudio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#000000"]} />
      {/* Faixa larga no teto: brilho principal das bordas */}
      <Lightformer form="rect" intensity={3} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 3, 1]} />
      {/* Faixas verticais assimétricas, como softboxes de estúdio */}
      <Lightformer form="rect" intensity={4} position={[-7, 1.5, 2]} rotation-y={Math.PI / 2} scale={[1.2, 10, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[7, -0.5, -1]} rotation-y={-Math.PI / 2} scale={[0.6, 7, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[4.5, 2, 6]} rotation-y={-Math.PI / 4} scale={[0.5, 6, 1]} />
      {/* Painel suave atrás da câmera: ilumina o túnel e a esfera */}
      <Lightformer form="rect" intensity={0.9} position={[-1.5, 2.5, 12]} rotation-y={Math.PI} scale={[9, 2.5, 1]} />
      <Lightformer form="rect" intensity={0.5} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={[10, 1, 1]} />
    </Environment>
  );
}

export default function Cena({ movel, animar, aoCarregar }: Props) {
  const [dpr, setDpr] = useState(movel ? 1.25 : 1.75);

  return (
    <Canvas
      dpr={dpr}
      frameloop={animar ? "always" : "demand"}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: !movel, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0a0a");
        aoCarregar();
      }}
    >
      <fog attach="fog" args={["#0a0a0a", 12, 30]} />
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(movel ? 1.5 : 2)} flipflops={2} />
      <Estudio />
      <Fita quantidade={movel ? 150 : 320} animar={animar} />
    </Canvas>
  );
}
