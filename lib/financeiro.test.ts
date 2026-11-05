import { describe, expect, it } from "vitest";
import { falta, recebido, recebidoPorMes, resumo, situacao, type Projeto } from "./financeiro";

const p = (valor: number, pagos: [number, string][] = [], data = "2026-03-10"): Projeto => ({
  id: String(Math.random()),
  cliente: "Cliente",
  nome: "Site",
  valor,
  data,
  pagamentos: pagos.map(([v, d], i) => ({ id: String(i), valor: v, data: d })),
  criadoEm: "2026-03-10T00:00:00.000Z",
});

describe("pagamentos de um projeto", () => {
  it("recebido soma as parcelas e falta é o resto, nunca negativo", () => {
    const x = p(5000, [[2000, "2026-03-10"], [1000.5, "2026-04-10"]]);
    expect(recebido(x)).toBe(3000.5);
    expect(falta(x)).toBe(1999.5);
    expect(falta(p(1000, [[1200, "2026-03-10"]]))).toBe(0);
  });

  it("situação: pendente, parcial e pago", () => {
    expect(situacao(p(5000))).toBe("pendente");
    expect(situacao(p(5000, [[100, "2026-03-10"]]))).toBe("parcial");
    expect(situacao(p(5000, [[5000, "2026-03-10"]]))).toBe("pago");
    // centavos de arredondamento não deixam um projeto quitado como "parcial"
    expect(situacao(p(100, [[33.33, "2026-03-10"], [33.33, "2026-03-11"], [33.34, "2026-03-12"]]))).toBe("pago");
  });
});

describe("resumo", () => {
  it("sem projetos, tudo zerado", () => {
    expect(resumo([])).toEqual({ faturamento: 0, recebido: 0, aReceber: 0, ticketMedio: 0, quantidade: 0 });
  });

  it("totais de faturamento, recebido, a receber e ticket médio", () => {
    const r = resumo([p(5000, [[2000, "2026-03-10"]]), p(3000, [[3000, "2026-04-02"]]), p(1000)]);
    expect(r).toEqual({ faturamento: 9000, recebido: 5000, aReceber: 4000, ticketMedio: 3000, quantidade: 3 });
  });
});

describe("recebidoPorMes", () => {
  it("últimos N meses até o mês atual, com zero nos meses sem pagamento", () => {
    const ps = [p(5000, [[2000, "2026-03-10"], [1000, "2026-05-01"]]), p(800, [[800, "2026-05-20"]])];
    expect(recebidoPorMes(ps, "2026-05-15", 4)).toEqual([
      { mes: "2026-02", valor: 0 },
      { mes: "2026-03", valor: 2000 },
      { mes: "2026-04", valor: 0 },
      { mes: "2026-05", valor: 1800 },
    ]);
  });

  it("atravessa a virada do ano", () => {
    expect(recebidoPorMes([], "2026-01-05", 3).map((m) => m.mes)).toEqual(["2025-11", "2025-12", "2026-01"]);
  });
});

describe("migrarAntigo", () => {
  it("projeto da versão anterior vira projeto pago no dia do cadastro", async () => {
    const { migrarAntigo, situacao } = await import("./financeiro");
    const p = migrarAntigo({ id: "a1", link: "https://x.vercel.app", nome: "Loja X", valor: 3200, criadoEm: "2026-10-02T14:00:00.000Z" });
    expect(p).toMatchObject({ id: "a1", cliente: "Loja X", nome: "Loja X", link: "https://x.vercel.app", valor: 3200, data: "2026-10-02" });
    expect(situacao(p)).toBe("pago");
  });
});
