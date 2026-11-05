import { describe, expect, it } from "vitest";
import { formatarTotal, formatarValor, paraPublico, resumo, tipos, type Projeto } from "./projetos";

const base: Projeto = {
  nome: "Site A",
  cliente: "Padaria Secreta Ltda",
  exibir_cliente: false,
  tipo: "Site institucional",
  valor: 4800,
  data: "2025-03",
  prazo: "3 semanas",
  stack: ["Next.js"],
  link: "https://exemplo.com",
  imagem: "",
  depoimento: { texto: "Ótimo trabalho.", autor: "Marta, dona da Padaria Secreta" },
};

const sem = (s: string) => s.replace(/\s/g, " ");

describe("paraPublico", () => {
  it("remove o cliente e o autor do depoimento quando exibir_cliente é false", () => {
    const [p] = paraPublico([base]);
    expect(p.cliente).toBeUndefined();
    expect(p.depoimento?.autor).toBeUndefined();
    expect(JSON.stringify(p)).not.toContain("Padaria Secreta");
  });

  it("mantém o cliente quando exibir_cliente é true", () => {
    const [p] = paraPublico([{ ...base, exibir_cliente: true }]);
    expect(p.cliente).toBe("Padaria Secreta Ltda");
    expect(p.depoimento?.autor).toBe("Marta, dona da Padaria Secreta");
  });

  it("gera um id estável a partir do nome", () => {
    expect(paraPublico([{ ...base, nome: "Loja Água Viva" }])[0].id).toBe("loja-agua-viva");
  });
});

describe("resumo", () => {
  it("lista vazia dá tudo zerado", () => {
    expect(resumo([])).toEqual({ total: 0, quantidade: 0, ticketMedio: 0, porMes: [] });
  });

  it("soma, conta e calcula o ticket médio arredondado", () => {
    const r = resumo([base, { ...base, valor: 7350, data: "2025-01" }, { ...base, valor: 1000, data: "2025-03" }]);
    expect(r.total).toBe(13150);
    expect(r.quantidade).toBe(3);
    expect(r.ticketMedio).toBe(4383);
  });

  it("agrupa por mês em ordem e preenche meses sem venda com zero", () => {
    const r = resumo([base, { ...base, valor: 7350, data: "2025-01" }, { ...base, valor: 1000, data: "2025-03" }]);
    expect(r.porMes).toEqual([
      { mes: "2025-01", valor: 7350 },
      { mes: "2025-02", valor: 0 },
      { mes: "2025-03", valor: 5800 },
    ]);
  });
});

describe("formatação de valores", () => {
  it("modo exato mostra reais sem centavos", () => {
    expect(sem(formatarValor(12450, "exato"))).toBe("R$ 12.450");
  });

  it("modo faixa mostra uma faixa", () => {
    expect(formatarValor(3200, "faixa")).toBe("até R$ 5 mil");
    expect(formatarValor(12450, "faixa")).toBe("R$ 10 a 20 mil");
    expect(formatarValor(72000, "faixa")).toBe("acima de R$ 50 mil");
  });

  it("total em faixa arredonda para baixo em dezenas de mil", () => {
    expect(formatarTotal(87430, "faixa")).toBe("mais de R$ 80 mil");
    expect(sem(formatarTotal(87430, "exato"))).toBe("R$ 87.430");
  });
});

describe("tipos", () => {
  it("lista tipos únicos em ordem alfabética", () => {
    expect(tipos([base, { ...base, tipo: "E-commerce" }, base])).toEqual(["E-commerce", "Site institucional"]);
  });
});
