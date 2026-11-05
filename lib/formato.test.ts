import { describe, expect, it } from "vitest";
import { dataValida, lerValorBR, nomeDoLink, normalizarLink } from "./formato";

describe("lerValorBR", () => {
  it("aceita os jeitos comuns de escrever um valor em reais", () => {
    expect(lerValorBR("4850")).toBe(4850);
    expect(lerValorBR("4.850")).toBe(4850);
    expect(lerValorBR("4.850,00")).toBe(4850);
    expect(lerValorBR("R$ 4.850,50")).toBe(4850.5);
    expect(lerValorBR("R$4850,5")).toBe(4850.5);
    expect(lerValorBR(" 12.380 ")).toBe(12380);
    expect(lerValorBR("1.250.000,00")).toBe(1250000);
  });

  it("ponto com 1 ou 2 casas é decimal", () => {
    expect(lerValorBR("4850.5")).toBe(4850.5);
    expect(lerValorBR("99.90")).toBe(99.9);
  });

  it("recusa vazio, zero, negativo e texto", () => {
    expect(lerValorBR("")).toBeNull();
    expect(lerValorBR("0")).toBeNull();
    expect(lerValorBR("-300")).toBeNull();
    expect(lerValorBR("mil reais")).toBeNull();
  });
});

describe("normalizarLink", () => {
  it("completa o https e tira a barra final", () => {
    expect(normalizarLink("meusite.vercel.app/")).toBe("https://meusite.vercel.app");
    expect(normalizarLink("  https://padariasol.com.br/cardapio ")).toBe("https://padariasol.com.br/cardapio");
  });

  it("recusa o que não é endereço de site", () => {
    expect(normalizarLink("")).toBeNull();
    expect(normalizarLink("meu site")).toBeNull();
    expect(normalizarLink("localhost")).toBeNull();
    expect(normalizarLink("javascript:alert(1)")).toBeNull();
  });
});

describe("nomeDoLink", () => {
  it("projeto na Vercel vira nome legível", () => {
    expect(nomeDoLink("https://clinica-vertebra.vercel.app")).toBe("Clinica Vertebra");
  });

  it("domínio próprio fica como está, sem www", () => {
    expect(nomeDoLink("https://www.padariasol.com.br/cardapio")).toBe("padariasol.com.br");
  });
});

describe("dataValida", () => {
  it("aceita AAAA-MM-DD de um dia que existe", () => {
    expect(dataValida("2026-11-05")).toBe(true);
    expect(dataValida("2024-02-29")).toBe(true);
  });

  it("recusa formatos errados e dias que não existem", () => {
    expect(dataValida("")).toBe(false);
    expect(dataValida("05/11/2026")).toBe(false);
    expect(dataValida("2026-02-30")).toBe(false);
    expect(dataValida("2026-13-01")).toBe(false);
  });
});

describe("printUrl", () => {
  it("gera o print do site com o endereço codificado", async () => {
    const { printUrl } = await import("./formato");
    const u = printUrl("https://a.com/x?y=1");
    expect(u).toContain(encodeURIComponent("https://a.com/x?y=1"));
    expect(u).toContain("screenshot=true");
  });
});
