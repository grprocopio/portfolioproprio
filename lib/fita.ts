import { Euler, Matrix4, Quaternion, Vector3 } from "three";

/**
 * Geometria da fita cromada: N lâminas finas distribuídas ao longo de uma curva.
 * Cada estado é uma curva diferente; o scroll interpola entre eles.
 * Eixos locais da lâmina: X = tangente (espessura), Y = radial (comprimento), Z = largura.
 */

export type Estado = "anel" | "anelPerto" | "colunaDireita" | "colunaEsquerda" | "tunel";
export const ESTADOS: readonly Estado[] = ["anel", "anelPerto", "colunaDireita", "colunaEsquerda", "tunel"];

export type Viewport = { w: number; h: number };
export type Pose = { p: [number, number, number]; q: [number, number, number, number] };

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const _m = new Matrix4();
const _q = new Quaternion();

function pose(ponto: Vector3, tangente: Vector3, radial: Vector3): Pose {
  const x = tangente.clone().normalize();
  const y = radial.clone().sub(x.clone().multiplyScalar(radial.dot(x))).normalize();
  const z = new Vector3().crossVectors(x, y);
  _m.makeBasis(x, y, z);
  _q.setFromRotationMatrix(_m).normalize();
  return { p: [ponto.x, ponto.y, ponto.z], q: [_q.x, _q.y, _q.z, _q.w] };
}

function anel(i: number, n: number, vp: Viewport, perto: boolean): Pose {
  const retrato = vp.w < vp.h;
  const R = retrato ? vp.w * 0.8 : clamp(Math.min(vp.w * 0.62, vp.h * 0.7), 1.6, 4.5);
  const a = (i / n) * TAU;
  const rot = perto ? new Euler(-0.35, 0.65, 0.4) : new Euler(-1.12, 0, 0.08);
  const centro = perto ? new Vector3(0, -vp.h * 0.12, 2.6) : new Vector3(0, -vp.h * (retrato ? 0.5 : 0.6), -1.2);
  const ponto = new Vector3(R * Math.cos(a), R * Math.sin(a), 0).applyEuler(rot).add(centro);
  const tangente = new Vector3(-Math.sin(a), Math.cos(a), 0).applyEuler(rot);
  const radial = new Vector3(Math.cos(a), Math.sin(a), 0).applyEuler(rot);
  return pose(ponto, tangente, radial);
}

function coluna(i: number, n: number, vp: Viewport, lado: 1 | -1): Pose {
  const voltas = 4.5;
  const H = vp.h * 1.7;
  const r = clamp(vp.w * 0.085, 0.5, 1.2);
  // Em tela em pé a coluna fica na borda, meio fora da tela, para não cobrir o texto
  const retrato = vp.w < vp.h;
  const cx = lado === 1 ? vp.w * (retrato ? 0.48 : 0.27) : -vp.w * (retrato ? 0.48 : 0.06);
  const t = i / n;
  const w = voltas * TAU;
  const ang = t * w;
  const ponto = new Vector3(cx + r * Math.cos(ang), (t - 0.5) * H, r * Math.sin(ang));
  const tangente = new Vector3(-r * Math.sin(ang) * w, H, r * Math.cos(ang) * w);
  const radial = new Vector3(Math.cos(ang), 0, Math.sin(ang));
  return pose(ponto, tangente, radial);
}

function tunel(i: number, n: number): Pose {
  const voltas = 6;
  const r = 2.4;
  const z0 = -26;
  const L = 34;
  const t = i / n;
  const w = voltas * TAU;
  const ang = t * w;
  const ponto = new Vector3(r * Math.cos(ang), r * Math.sin(ang), z0 + t * L);
  const tangente = new Vector3(-r * Math.sin(ang) * w, r * Math.cos(ang) * w, L);
  const radial = new Vector3(Math.cos(ang), Math.sin(ang), 0);
  return pose(ponto, tangente, radial);
}

/** Tamanho relativo da lâmina: menor em telas estreitas (o túnel envolve a câmera, então não muda) */
export function escalaLamina(estado: Estado, vp: Viewport): number {
  return estado === "tunel" ? 1 : clamp(vp.w / 10, 0.45, 1);
}

export function poseLamina(estado: Estado, i: number, n: number, vp: Viewport): Pose {
  switch (estado) {
    case "anel":
      return anel(i, n, vp, false);
    case "anelPerto":
      return anel(i, n, vp, true);
    case "colunaDireita":
      return coluna(i, n, vp, 1);
    case "colunaEsquerda":
      return coluna(i, n, vp, -1);
    case "tunel":
      return tunel(i, n);
  }
}

/** Interpola posição (lerp) e rotação (slerp) entre estados vizinhos. `fase` vai de 0 a ESTADOS.length - 1. */
export function interpolar(a: Pose, b: Pose, t: number): Pose {
  const qa = new Quaternion(...a.q);
  const qb = new Quaternion(...b.q);
  qa.slerp(qb, t).normalize();
  return {
    p: [a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t, a.p[2] + (b.p[2] - a.p[2]) * t],
    q: [qa.x, qa.y, qa.z, qa.w],
  };
}

export function poseNaFase(fase: number, i: number, n: number, vp: Viewport): Pose {
  const f = clamp(fase, 0, ESTADOS.length - 1);
  const k = Math.floor(f);
  const t = f - k;
  if (t === 0) return poseLamina(ESTADOS[k], i, n, vp);
  return interpolar(poseLamina(ESTADOS[k], i, n, vp), poseLamina(ESTADOS[k + 1], i, n, vp), t);
}
