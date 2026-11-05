"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { InstancedMesh, Mesh, MeshStandardMaterial, Object3D, Quaternion } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ESTADOS, escalaLamina, poseLamina } from "@/lib/fita";
import { faseAtual, scrollState } from "@/lib/scroll-state";
import { quadroLento } from "@/lib/desempenho";

const FASE_MAX = ESTADOS.length - 1;
/** Quadros forçados no início, com o canvas invisível, para medir se esta máquina aguenta o 3D */
const AQUECIMENTO = 30;
/** Primeiros quadros do aquecimento descartados da medição (compilação, upload de texturas) */
const DESCARTE = 2;

type Props = { quantidade: number; aoLento?: () => void; aoPronto: () => void };

/**
 * Renderização sob demanda: só desenha quando a fase do scroll ou o ponteiro mudam.
 * Com a página parada, a GPU fica livre (custo zero) e os cliques respondem na hora.
 */
export function Fita({ quantidade, aoLento, aoPronto }: Props) {
  const malha = useRef<InstancedMesh>(null);
  const esfera = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const vw = useThree((s) => s.viewport.width);
  const vh = useThree((s) => s.viewport.height);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  const fase = useRef(faseAtual());
  const rot = useRef({ x: 0, y: 0 });
  const aquecimento = useRef(AQUECIMENTO);
  const tempos = useRef<number[]>([]);
  const ultimo = useRef(0);
  /** O quadro anterior pediu este? Então o intervalo entre eles é o custo real de um quadro. */
  const continuo = useRef(false);

  // 1 segmento de arredondamento: 108 triângulos por lâmina (antes 300)
  const geometria = useMemo(() => new RoundedBoxGeometry(0.045, 1.05, 0.5, 1, 0.015), []);

  // Poses de cada estado pré-calculadas: [x, y, z, qx, qy, qz, qw] por lâmina
  const cache = useMemo(() => {
    const vp = { w: vw, h: vh };
    return ESTADOS.map((estado) => {
      const arr = new Float32Array(quantidade * 7);
      for (let i = 0; i < quantidade; i++) {
        const { p, q } = poseLamina(estado, i, quantidade, vp);
        arr.set([...p, ...q], i * 7);
      }
      return arr;
    });
  }, [vw, vh, quantidade]);

  const escalas = useMemo(() => ESTADOS.map((e) => escalaLamina(e, { w: vw, h: vh })), [vw, vh]);
  const aux = useMemo(() => ({ o: new Object3D(), qa: new Quaternion(), qb: new Quaternion() }), []);

  // Compila todos os shaders (inclusive o da esfera) antes da rolagem, não no meio dela
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);

  // Laço barato (sem GPU): só pede um quadro quando há algo para mover
  useEffect(() => {
    let id = 0;
    const vigiar = () => {
      const p = scrollState.ponteiro;
      const mexeu =
        Math.abs(faseAtual() - fase.current) > 0.0005 ||
        Math.abs(p.x * 0.08 - rot.current.y) > 0.0005 ||
        Math.abs(p.y * 0.05 - rot.current.x) > 0.0005;
      if (mexeu || aquecimento.current > 0) invalidate();
      id = requestAnimationFrame(vigiar);
    };
    id = requestAnimationFrame(vigiar);
    return () => cancelAnimationFrame(id);
  }, [invalidate]);

  const aplicar = (f: number) => {
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
    const esc = escalas[k] + (escalas[k + 1] - escalas[k]) * e;

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
      o.scale.setScalar(esc);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    m.rotation.set(rot.current.x, rot.current.y, 0);

    if (material.current) {
      // Na seção de projetos a coluna recua para os cards ficarem em primeiro plano
      const recuo = Math.max(0, 1 - Math.abs(f - 3));
      // Em tela em pé o texto passa por cima da coluna: escurece mais nas seções de leitura
      const leitura = vw < vh ? Math.min(1, Math.max(0, f - 1)) * Math.min(1, Math.max(0, 4 - f)) : 0;
      material.current.envMapIntensity = 1.3 - 0.8 * recuo;
      material.current.color.setScalar((1 - 0.6 * recuo) * (1 - 0.5 * leitura));
    }

    const s = esfera.current;
    if (s) {
      const v = Math.max(0, Math.min(1, (f - (FASE_MAX - 0.4)) / 0.4));
      s.scale.setScalar(Math.max(v * v, 0.0001));
      s.position.z = -8 + scrollState.cta * 4;
    }
  };

  const pixel = useMemo(() => new Uint8Array(4), []);

  /** Desenha e espera a GPU terminar (lendo 1 pixel). Devolve o custo real do quadro em ms. */
  const desenharMedindo = (state: { gl: typeof gl; scene: typeof scene; camera: typeof camera }) => {
    const t0 = performance.now();
    state.gl.render(state.scene, state.camera);
    const ctx = state.gl.getContext();
    ctx.readPixels(0, 0, 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, pixel);
    return performance.now() - t0;
  };

  // Prioridade 1: este useFrame faz a renderização (o R3F deixa de renderizar sozinho)
  useFrame((state, delta) => {
    // Aquecimento: estado mais pesado (túnel colado na câmera), canvas ainda invisível,
    // medindo o custo REAL de cada quadro (CPU + GPU)
    if (aquecimento.current > 0) {
      aquecimento.current--;
      aplicar(FASE_MAX);
      const custo = desenharMedindo(state);
      if (aoLento && aquecimento.current < AQUECIMENTO - DESCARTE) {
        tempos.current.push(custo);
        if (quadroLento(tempos.current)) return aoLento();
      }
      if (aquecimento.current > 0) return state.invalidate();
      // Passou no teste: daqui em diante só desenha quando algo muda
      tempos.current = [];
      aoPronto();
    }

    // Vigia contínua (rede de segurança): intervalo entre quadros seguidos
    const agora = performance.now();
    const intervalo = agora - ultimo.current;
    if (aoLento && continuo.current && intervalo < 3000) {
      tempos.current.push(intervalo);
      if (tempos.current.length > 30) tempos.current.shift();
      if (quadroLento(tempos.current)) return aoLento();
    }
    ultimo.current = agora;

    const dt = Math.min(delta, 0.05);
    const alvo = faseAtual();
    fase.current += (alvo - fase.current) * Math.min(1, dt * 6);
    if (Math.abs(alvo - fase.current) < 0.0005) fase.current = alvo;
    const p = scrollState.ponteiro;
    rot.current.y += (p.x * 0.08 - rot.current.y) * Math.min(1, dt * 4);
    rot.current.x += (p.y * 0.05 - rot.current.x) * Math.min(1, dt * 4);
    aplicar(Math.max(0, Math.min(FASE_MAX, fase.current)));
    state.gl.render(state.scene, state.camera);
    // Ainda convergindo: pede o próximo quadro
    continuo.current = fase.current !== alvo;
    if (continuo.current) state.invalidate();
  }, 1);

  return (
    <>
      <instancedMesh ref={malha} args={[geometria, undefined, quantidade]} frustumCulled={false}>
        <meshStandardMaterial ref={material} color="#ffffff" metalness={1} roughness={0.14} envMapIntensity={1.3} />
      </instancedMesh>
      <mesh ref={esfera} position={[0, 0, -8]} scale={0.0001} frustumCulled={false}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.32} envMapIntensity={1.2} />
      </mesh>
    </>
  );
}
