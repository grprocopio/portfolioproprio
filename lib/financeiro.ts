/** Uma parcela recebida. `data` em AAAA-MM-DD. */
export type Pagamento = { id: string; valor: number; data: string };

/** Um projeto vendido. `valor` é o total combinado; `data` (AAAA-MM-DD) é o dia da venda. */
export type Projeto = {
  id: string;
  cliente: string;
  nome: string;
  link?: string;
  valor: number;
  data: string;
  pagamentos: Pagamento[];
  /** ISO 8601 */
  criadoEm: string;
};

export type Situacao = "pago" | "parcial" | "pendente";

const centavos = (v: number) => Math.round(v * 100) / 100;

export const recebido = (p: Projeto) => centavos(p.pagamentos.reduce((s, x) => s + x.valor, 0));

export const falta = (p: Projeto) => centavos(Math.max(0, p.valor - recebido(p)));

export function situacao(p: Projeto): Situacao {
  const r = recebido(p);
  // Meio centavo de folga: parcelas arredondadas não deixam um projeto quitado como "parcial"
  if (r >= p.valor - 0.005) return "pago";
  return r > 0 ? "parcial" : "pendente";
}

export type Resumo = { faturamento: number; recebido: number; aReceber: number; ticketMedio: number; quantidade: number };

export function resumo(ps: Projeto[]): Resumo {
  const faturamento = centavos(ps.reduce((s, p) => s + p.valor, 0));
  return {
    faturamento,
    recebido: centavos(ps.reduce((s, p) => s + recebido(p), 0)),
    aReceber: centavos(ps.reduce((s, p) => s + falta(p), 0)),
    ticketMedio: ps.length ? centavos(faturamento / ps.length) : 0,
    quantidade: ps.length,
  };
}

function mesAnterior(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, "0")}`;
}

/** Recebido em cada um dos últimos `quantos` meses, terminando no mês de `hoje` (AAAA-MM-DD). */
export function recebidoPorMes(ps: Projeto[], hoje: string, quantos = 12): { mes: string; valor: number }[] {
  const somas = new Map<string, number>();
  for (const p of ps) for (const x of p.pagamentos) somas.set(x.data.slice(0, 7), (somas.get(x.data.slice(0, 7)) ?? 0) + x.valor);
  const meses: string[] = [];
  let m = hoje.slice(0, 7);
  for (let i = 0; i < quantos; i++) {
    meses.unshift(m);
    m = mesAnterior(m);
  }
  return meses.map((mes) => ({ mes, valor: centavos(somas.get(mes) ?? 0) }));
}

/** Projeto da versão anterior do site (só link e valor, sem cliente nem pagamentos) */
export type ProjetoAntigo = { id: string; link: string; nome: string; valor: number; criadoEm: string };

/** Projeto da versão anterior vira projeto pago no dia em que foi cadastrado. */
export function migrarAntigo(g: ProjetoAntigo): Projeto {
  const dia = g.criadoEm.slice(0, 10);
  return {
    id: g.id,
    cliente: g.nome,
    nome: g.nome,
    link: g.link,
    valor: g.valor,
    data: dia,
    pagamentos: [{ id: `${g.id}-pago`, valor: g.valor, data: dia }],
    criadoEm: g.criadoEm,
  };
}
