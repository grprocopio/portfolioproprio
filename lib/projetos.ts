import type { ModoValores } from "@/data/site";

export type Depoimento = { texto: string; autor?: string };

export type Projeto = {
  nome: string;
  cliente?: string;
  exibir_cliente: boolean;
  tipo: string;
  valor: number;
  /** AAAA-MM */
  data: string;
  prazo: string;
  stack: string[];
  link: string;
  imagem: string;
  repositorio?: string;
  depoimento?: Depoimento;
  descricao?: string;
  /** Marca projetos fictícios usados enquanto os dados reais não chegam */
  exemplo?: boolean;
};

export type ProjetoPublico = Omit<Projeto, "exibir_cliente"> & { id: string };

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Remove tudo que identifica o cliente quando ele não autorizou aparecer. */
export function paraPublico(ps: Projeto[]): ProjetoPublico[] {
  return ps.map(({ exibir_cliente, cliente, depoimento, ...resto }) => ({
    ...resto,
    id: slug(resto.nome),
    ...(exibir_cliente && cliente ? { cliente } : {}),
    ...(depoimento
      ? { depoimento: exibir_cliente ? depoimento : { texto: depoimento.texto } }
      : {}),
  }));
}

export type Resumo = {
  total: number;
  quantidade: number;
  ticketMedio: number;
  porMes: { mes: string; valor: number }[];
};

function proximoMes(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
}

export function resumo(ps: Pick<Projeto, "valor" | "data">[]): Resumo {
  if (ps.length === 0) return { total: 0, quantidade: 0, ticketMedio: 0, porMes: [] };
  const total = ps.reduce((s, p) => s + p.valor, 0);
  const somas = new Map<string, number>();
  for (const p of ps) {
    const mes = p.data.slice(0, 7);
    somas.set(mes, (somas.get(mes) ?? 0) + p.valor);
  }
  const meses = [...somas.keys()].sort();
  const porMes: Resumo["porMes"] = [];
  for (let m = meses[0]; m <= meses[meses.length - 1]; m = proximoMes(m)) {
    porMes.push({ mes: m, valor: somas.get(m) ?? 0 });
  }
  return { total, quantidade: ps.length, ticketMedio: Math.round(total / ps.length), porMes };
}

const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const FAIXAS: [number, string][] = [
  [5000, "até R$ 5 mil"],
  [10000, "R$ 5 a 10 mil"],
  [20000, "R$ 10 a 20 mil"],
  [50000, "R$ 20 a 50 mil"],
];

export function formatarValor(v: number, modo: ModoValores): string {
  if (modo === "exato") return real.format(v);
  const faixa = FAIXAS.find(([limite]) => v <= limite);
  return faixa ? faixa[1] : "acima de R$ 50 mil";
}

export function formatarTotal(v: number, modo: ModoValores): string {
  if (modo === "exato") return real.format(v);
  return `mais de R$ ${Math.floor(v / 10000) * 10} mil`;
}

export function tipos(ps: Pick<Projeto, "tipo">[]): string[] {
  return [...new Set(ps.map((p) => p.tipo))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export const mesPorExtenso = (mes: string) => {
  const [a, m] = mes.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(a, m - 1, 1));
};

export const nomeMes = (mes: string) => {
  const [a, m] = mes.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit" }).format(new Date(a, m - 1, 1));
};

