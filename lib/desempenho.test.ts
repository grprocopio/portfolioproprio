import { describe, expect, it } from "vitest";
import { quadroLento } from "./desempenho";

const rep = (v: number, n: number) => Array.from({ length: n }, () => v);

describe("quadroLento", () => {
  it("poucas amostras ainda não decidem nada", () => {
    expect(quadroLento(rep(200, 4))).toBe(false);
  });

  it("máquina muito lenta é detectada cedo, com 5 quadros", () => {
    expect(quadroLento(rep(120, 5))).toBe(true);
  });

  it("com poucas amostras, lentidão moderada ainda espera mais dados", () => {
    expect(quadroLento(rep(33, 10))).toBe(false);
  });

  it("60 fps estáveis não é lento", () => {
    expect(quadroLento(rep(16.7, 30))).toBe(false);
  });

  it("um engasgo isolado não derruba o 3D", () => {
    expect(quadroLento([...rep(16.7, 28), 400, 380])).toBe(false);
  });

  it("abaixo de ~35 fps de forma consistente é lento", () => {
    expect(quadroLento(rep(33, 30))).toBe(true);
  });
});
