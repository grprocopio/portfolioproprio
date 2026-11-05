"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { InstancedMesh, Mesh, MeshStandardMaterial, Object3D, Quaternion } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ESTADOS, escalaLamina, poseLamina } from "@/lib/fita";
import { faseAtual, scrollState } from "@/lib/scroll-state";

const FASE_MAX = ESTADOS.length - 1;

type Props = { quantidade: number; animar: boolean };

export function Fita({ quantidade, animar }: Props) {
  const malha = useRef<InstancedMesh>(null);
  const esfera = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const viewport = useThree((s) => s.viewport.getCurrentViewport(s.camera, [0, 0, 0], s.size));
  const fase = useRef(0);

  const geometria = useMemo(() => new RoundedBoxGeometry(0.045, 1.05, 0.5, 2, 0.015), []);

  // Poses de cada estado pré-calculadas: [x, y, z, qx, qy, qz, qw] por lâmina
  const cache = useMemo(() => {
    const vp = { w: viewport.width, h: viewport.height };
    return ESTADOS.map((estado) => {
      const arr = new Float32Array(quantidade * 7);
      for (let i = 0; i < quantidade; i++) {
        const { p, q } = poseLamina(estado, i, quantidade, vp);
        arr.set([...p, ...q], i * 7);
      }
      return arr;
    });
  }, [viewport.width, viewport.height, quantidade]);

  const escalas = useMemo(
    () => ESTADOS.map((e) => escalaLamina(e, { w: viewport.width, h: viewport.height })),
    [viewport.width, viewport.height],
  );

  const aux = useMemo(() => ({ o: new Object3D(), qa: new Quaternion(), qb: new Quaternion() }), []);

  const aplicar = (f: number, tempo: number) => {
    const m = malha.current;
    if (!m) return;
    const k = Math.min(Math.floor(f), FASE_MAX - 1);
    const t = Math.min(1, f - k);
    // Suaviza a passagem entre estados para não parecer mecânica
    const e = t * t * (3 - 2 * t);
    const A = cache[k];
    const B = cache[k + 1];
    const { o, qa, qb } = aux;
    const noTunel = Math.max(0, f - (FASE_MAX - 1));
    const avanco = noTunel * scrollState.cta * 10;

    for (let i = 0; i < quantidade; i++) {
      const j = i * 7;
      o.position.set(
        A[j] + (B[j] - A[j]) * e,
        A[j + 1] + (B[j + 1] - A[j + 1]) * e,
        A[j + 2] + (B[j + 2] - A[j + 2]) * e + avanco,
      );
      qa.set(A[j + 3], A[j + 4], A[j + 5], A[j + 6]);
      qb.set(B[j + 3], B[j + 4], B[j + 5], B[j + 6]);
      o.quaternion.slerpQuaternions(qa, qb, e);
      // Leve ondulação ao longo da fita, como uma mola respirando
      const onda = 1 + Math.sin(tempo * 1.2 + i * 0.18) * 0.06;
      const esc = escalas[k] + (escalas[k + 1] - escalas[k]) * e;
      o.scale.set(esc, onda * esc, esc);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    // Na seção de projetos a coluna recua para os cards ficarem em primeiro plano
    if (material.current) {
      const recuo = Math.max(0, 1 - Math.abs(f - 3));
      material.current.envMapIntensity = 1.3 - 0.8 * recuo;
      material.current.color.setScalar(1 - 0.6 * recuo);
    }
    m.rotation.y = Math.sin(tempo * 0.25) * 0.06 + scrollState.ponteiro.x * 0.08;
    m.rotation.x = scrollState.ponteiro.y * 0.05;

    const s = esfera.current;
    if (s) {
      const v = Math.max(0, Math.min(1, (f - (FASE_MAX - 0.4)) / 0.4));
      s.scale.setScalar(v * v);
      s.visible = v > 0.001;
      s.position.z = -8 + scrollState.cta * 4;
    }
  };

  useLayoutEffect(() => {
    aplicar(animar ? faseAtual() : 0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache]);

  useFrame((estado, delta) => {
    if (!animar) return;
    const alvo = faseAtual();
    fase.current += (alvo - fase.current) * Math.min(1, delta * 5);
    aplicar(Math.max(0, Math.min(FASE_MAX, fase.current)), estado.clock.elapsedTime);
  });

  return (
    <>
      <instancedMesh ref={malha} args={[geometria, undefined, quantidade]} frustumCulled={false}>
        <meshStandardMaterial ref={material} color="#ffffff" metalness={1} roughness={0.14} envMapIntensity={1.3} />
      </instancedMesh>
      <mesh ref={esfera} position={[0, 0, -8]} scale={0} visible={false}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.32} envMapIntensity={1.2} />
      </mesh>
    </>
  );
}
