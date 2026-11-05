import { describe, expect, it } from "vitest";
import { ESTADOS, poseLamina, poseNaFase, type Pose } from "./fita";

const vp = { w: 10, h: 6 };
const N = 120;
const todas = (estado: (typeof ESTADOS)[number]) =>
  Array.from({ length: N }, (_, i) => poseLamina(estado, i, N, vp));

const centro = (ps: Pose[]) =>
  [0, 1, 2].map((k) => ps.reduce((s, p) => s + p.p[k], 0) / ps.length) as [number, number, number];

const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe("poseLamina", () => {
  it("anel: todas as lâminas ficam à mesma distância do centro", () => {
    const ps = todas("anel");
    const c = centro(ps);
    const d0 = dist(ps[0].p, c);
    for (const p of ps) expect(dist(p.p, c)).toBeCloseTo(d0, 4);
  });

  it("colunaDireita fica toda à direita do centro da tela", () => {
    for (const p of todas("colunaDireita")) expect(p.p[0]).toBeGreaterThan(0);
  });

  it("colunaEsquerda fica toda à esquerda do centro da tela", () => {
    for (const p of todas("colunaEsquerda")) expect(p.p[0]).toBeLessThan(0);
  });

  it("tunel: lâminas em volta do eixo z, a distância constante dele", () => {
    const ps = todas("tunel");
    const r0 = Math.hypot(ps[0].p[0], ps[0].p[1]);
    expect(r0).toBeGreaterThan(1);
    for (const p of ps) expect(Math.hypot(p.p[0], p.p[1])).toBeCloseTo(r0, 4);
  });

  it("quaternions são unitários em todos os estados", () => {
    for (const e of ESTADOS)
      for (const p of todas(e)) expect(Math.hypot(...p.q)).toBeCloseTo(1, 5);
  });
});

describe("poseNaFase", () => {
  it("fase inteira devolve exatamente o estado correspondente", () => {
    expect(poseNaFase(2, 7, N, vp)).toEqual(poseLamina(ESTADOS[2], 7, N, vp));
  });

  it("fase intermediária fica no meio do caminho entre os dois estados", () => {
    const a = poseLamina(ESTADOS[1], 7, N, vp);
    const b = poseLamina(ESTADOS[2], 7, N, vp);
    const m = poseNaFase(1.5, 7, N, vp);
    for (let k = 0; k < 3; k++) expect(m.p[k]).toBeCloseTo((a.p[k] + b.p[k]) / 2, 5);
    expect(Math.hypot(...m.q)).toBeCloseTo(1, 5);
  });

  it("fase fora do intervalo é limitada aos estados das pontas", () => {
    expect(poseNaFase(-3, 0, N, vp)).toEqual(poseLamina(ESTADOS[0], 0, N, vp));
    expect(poseNaFase(99, 0, N, vp)).toEqual(poseLamina(ESTADOS[ESTADOS.length - 1], 0, N, vp));
  });
});

describe("escalaLamina", () => {
  it("lâminas ficam menores em tela estreita, exceto no túnel", async () => {
    const { escalaLamina } = await import("./fita");
    expect(escalaLamina("colunaDireita", { w: 3, h: 6 })).toBeLessThan(escalaLamina("colunaDireita", { w: 10, h: 6 }));
    expect(escalaLamina("tunel", { w: 3, h: 6 })).toBe(1);
  });
});
