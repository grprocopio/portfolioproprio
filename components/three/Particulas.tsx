"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial } from "three";
import { aleatorio, formaEspiral, formaNome, formaNuvem, formaTunel, FORMAS, type Ponto2D } from "@/lib/particulas";
import { faseAtual, scrollState } from "@/lib/scroll-state";

const FASE_MAX = FORMAS.length - 1;
const FOV = 35;

const vertex = /* glsl */ `
attribute vec3 aNome;
attribute vec3 aEspiral;
attribute vec3 aNuvem;
attribute vec3 aTunel;
attribute vec4 aRnd;
uniform float uFase;
uniform float uTempo;
uniform float uCta;
uniform float uTam;
uniform float uEscala;
varying float vBrilho;
varying float vAlfa;

vec3 forma(float k) {
  if (k < 0.5) return aNome;
  if (k < 1.5) return aEspiral;
  if (k < 2.5) return aNuvem;
  return aTunel;
}

void main() {
  float k = floor(clamp(uFase, 0.0, 2.999));
  float t = clamp(uFase - k, 0.0, 1.0);
  // Cada partícula parte num momento diferente: o nome "se desfaz" em vez de deslizar inteiro
  float tl = smoothstep(0.0, 1.0, clamp(t * 1.6 - aRnd.x * 0.6, 0.0, 1.0));
  vec3 p = mix(forma(k), forma(k + 1.0), tl);
  // No meio do caminho, as partículas se espalham num arco e voltam a se juntar
  p += (aRnd.yzw - 0.5) * 1.8 * sin(tl * 3.14159);
  // Respiração contínua, bem leve
  p += 0.035 * vec3(
    sin(uTempo * 0.9 + aRnd.x * 40.0),
    cos(uTempo * 0.7 + aRnd.y * 40.0),
    sin(uTempo * 0.8 + aRnd.z * 40.0)
  );
  // Dentro do túnel, a câmera avança
  p.z += clamp(uFase - 2.0, 0.0, 1.0) * uCta * 9.0;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float profundidade = max(-mv.z, 0.1);
  gl_PointSize = uTam * (0.55 + aRnd.w * 0.9) * uEscala / profundidade;
  vBrilho = aRnd.w;
  // Some ao longe (névoa) e quando passa colado na câmera
  vAlfa = smoothstep(32.0, 8.0, profundidade) * smoothstep(0.4, 2.0, profundidade);
}
`;

const fragment = /* glsl */ `
uniform vec3 uCorA;
uniform vec3 uCorB;
uniform float uIntensidade;
varying float vBrilho;
varying float vAlfa;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float nucleo = pow(1.0 - d, 1.8);
  // Maioria índigo; algumas partículas e o centro de cada uma puxam para o branco
  vec3 cor = mix(uCorA, uCorB, smoothstep(0.82, 1.0, vBrilho) * 0.8 + pow(1.0 - d, 6.0) * 0.5);
  gl_FragColor = vec4(cor, nucleo * vAlfa * uIntensidade);
}
`;

type Props = { quantidade: number; texto: Ponto2D[]; aoPronto: () => void };

/**
 * Nuvem de partículas: um único THREE.Points (1 chamada de desenho).
 * As 4 formas ficam em atributos; a mistura entre elas é feita no shader,
 * então a CPU só atualiza 4 números por quadro.
 */
export function Particulas({ quantidade, texto, aoPronto }: Props) {
  const pontos = useRef<Points>(null);
  const vw = useThree((s) => s.viewport.width);
  const vh = useThree((s) => s.viewport.height);
  const alturaPx = useThree((s) => s.size.height);
  const dpr = useThree((s) => s.viewport.dpr);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  const fase = useRef(faseAtual());
  const rot = useRef({ x: 0, y: 0 });
  const pronto = useRef(false);

  const geometria = useMemo(() => {
    const vp = { w: vw, h: vh };
    const g = new BufferGeometry();
    const nome = formaNome(texto, quantidade, vp, aleatorio(11));
    g.setAttribute("position", new BufferAttribute(nome, 3));
    g.setAttribute("aNome", new BufferAttribute(nome, 3));
    g.setAttribute("aEspiral", new BufferAttribute(formaEspiral(quantidade, vp, aleatorio(22)), 3));
    g.setAttribute("aNuvem", new BufferAttribute(formaNuvem(quantidade, vp, aleatorio(33)), 3));
    g.setAttribute("aTunel", new BufferAttribute(formaTunel(quantidade, aleatorio(44)), 3));
    const r = aleatorio(55);
    const rnd = new Float32Array(quantidade * 4);
    for (let i = 0; i < rnd.length; i++) rnd[i] = r();
    g.setAttribute("aRnd", new BufferAttribute(rnd, 4));
    return g;
  }, [vw, vh, quantidade, texto]);

  useEffect(() => () => geometria.dispose(), [geometria]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uFase: { value: 0 },
          uTempo: { value: 0 },
          uCta: { value: 0 },
          uTam: { value: 0.03 },
          uEscala: { value: 1 },
          uIntensidade: { value: 1 },
          uCorA: { value: new Color("#4B5BFF") },
          uCorB: { value: new Color("#DCE2FF") },
        },
      }),
    [],
  );

  // Tamanho em pixels de 1 unidade do mundo a 1 unidade da câmera
  useEffect(() => {
    material.uniforms.uEscala.value = (alturaPx * dpr) / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));
    // Tela estreita: pontos menores, senão as letras do nome viram borrões
    material.uniforms.uTam.value = 0.026 * Math.min(1, Math.max(0.5, vw / 10));
  }, [alturaPx, dpr, vw, material]);

  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);

  useFrame((state, delta) => {
    const u = material.uniforms;

    // Primeiro quadro desenhado: mostra a cena (sem teste de desempenho: animação sempre ligada)
    if (!pronto.current) {
      pronto.current = true;
      aoPronto();
    }

    const dt = Math.min(delta, 0.05);
    fase.current += (faseAtual() - fase.current) * Math.min(1, dt * 5);
    const f = Math.max(0, Math.min(FASE_MAX, fase.current));
    u.uFase.value = f;
    u.uTempo.value = state.clock.elapsedTime;
    u.uCta.value = scrollState.cta;
    // Na seção de projetos a nuvem recua para os cards ficarem em primeiro plano
    // Em tela em pé o texto passa por cima das partículas: apaga mais nas seções de leitura
    const leitura = vw < vh ? Math.min(1, Math.max(0, f - 0.6)) * Math.min(1, Math.max(0, 2.6 - f)) : 0;
    u.uIntensidade.value = (1 - 0.55 * Math.max(0, 1 - Math.abs(f - 2))) * (1 - 0.5 * leitura);

    const p = scrollState.ponteiro;
    rot.current.y += (p.x * 0.12 - rot.current.y) * Math.min(1, dt * 3);
    rot.current.x += (p.y * 0.06 - rot.current.x) * Math.min(1, dt * 3);
    if (pontos.current) pontos.current.rotation.set(rot.current.x, rot.current.y, 0);
    state.gl.render(state.scene, state.camera);
  }, 1);

  return <points ref={pontos} geometry={geometria} material={material} frustumCulled={false} />;
}
