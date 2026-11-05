import { describe, expect, it } from "vitest";
import { amostrarTexto, aleatorio, formaEspiral, formaNome, formaNuvem, formaTunel, FORMAS } from "./particulas";

const vp = { w: 10, h: 6 };
const N = 2000;

const pontos = (a: Float32Array) => Array.from({ length: a.length / 3 }, (_, i) => [a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]);
const finito = (a: Float32Array) => Array.from(a).every(Number.isFinite);

describe("amostrarTexto", () => {
  it("devolve só os pixels preenchidos, normalizados com centro em zero", () => {
    // 4x2: só o pixel (3,0) preenchido
    const alfa = new Uint8ClampedArray(4 * 2 * 4);
    alfa[(0 * 4 + 3) * 4 + 3] = 255;
    const ps = amostrarTexto(alfa, 4, 2, 1);
    expect(ps).toHaveLength(1);
    expect(ps[0].x).toBeGreaterThan(0);
    expect(ps[0].y).toBeGreaterThan(0); // linha de cima vira y positivo
  });

  it("imagem vazia não tem pontos", () => {
    expect(amostrarTexto(new Uint8ClampedArray(16 * 4), 4, 4, 1)).toEqual([]);
  });
});

describe("formas", () => {
  const texto = Array.from({ length: 500 }, (_, i) => ({ x: (i / 500 - 0.5) * 4, y: ((i % 7) / 7 - 0.5) * 0.6 }));

  it("toda forma tem 3 números finitos por partícula", () => {
    for (const f of [formaNome(texto, N, vp, aleatorio(1)), formaEspiral(N, vp, aleatorio(1)), formaNuvem(N, vp, aleatorio(1)), formaTunel(N, aleatorio(1))]) {
      expect(f).toHaveLength(N * 3);
      expect(finito(f)).toBe(true);
    }
  });

  it("o nome cabe na largura da tela", () => {
    for (const [x] of pontos(formaNome(texto, N, vp, aleatorio(2)))) expect(Math.abs(x)).toBeLessThanOrEqual(vp.w / 2);
  });

  it("sem pixels de texto, o nome vira uma nuvem e não quebra", () => {
    const f = formaNome([], N, vp, aleatorio(3));
    expect(f).toHaveLength(N * 3);
    expect(finito(f)).toBe(true);
  });

  it("a espiral fica à direita do centro da tela", () => {
    const xs = pontos(formaEspiral(N, vp, aleatorio(4))).map((p) => p[0]);
    expect(xs.reduce((a, b) => a + b, 0) / xs.length).toBeGreaterThan(0);
  });

  it("o túnel envolve o eixo z e tem uma esfera no centro", () => {
    const ps = pontos(formaTunel(N, aleatorio(5)));
    const raio = ps.map(([x, y]) => Math.hypot(x, y));
    const paredes = raio.filter((r) => r > 1.8).length;
    const esfera = ps.filter(([x, y, z]) => Math.hypot(x, y, z + 6) < 1.4).length;
    expect(paredes / ps.length).toBeGreaterThan(0.7);
    expect(esfera).toBeGreaterThan(0);
  });

  it("mesma semente gera a mesma forma (sem pular entre recarregamentos)", () => {
    expect(formaNuvem(N, vp, aleatorio(9))).toEqual(formaNuvem(N, vp, aleatorio(9)));
  });

  it("a ordem das formas segue a página", () => {
    expect(FORMAS).toEqual(["nome", "espiral", "nuvem", "tunel"]);
  });
});
