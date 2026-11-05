import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { sair } from "@/app/acoes";
import { CeuNoturno } from "@/components/CeuNoturno";
import { Contador } from "@/components/Contador";
import { Grafico } from "@/components/crm/Grafico";
import { ListaProjetos } from "@/components/crm/ListaProjetos";
import { cartao } from "@/components/crm/estilos";
import { armazem } from "@/lib/armazem";
import { exigirSessao } from "@/lib/auth";
import { recebidoPorMes, resumo, type Projeto } from "@/lib/financeiro";

// Dados do banco a cada visita, sempre atrás da senha
export const dynamic = "force-dynamic";

async function carregar(): Promise<{ bancoOk: boolean; projetos: Projeto[]; erro: boolean }> {
  const b = armazem();
  if (!b) return { bancoOk: false, projetos: [], erro: false };
  try {
    const projetos = (await b.listar()).sort((x, y) => y.data.localeCompare(x.data) || y.criadoEm.localeCompare(x.criadoEm));
    return { bancoOk: true, projetos, erro: false };
  } catch {
    return { bancoOk: true, projetos: [], erro: true };
  }
}

export default async function Painel() {
  await exigirSessao();
  const { bancoOk, projetos, erro } = await carregar();
  const hoje = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  const r = resumo(projetos);
  const meses = recebidoPorMes(projetos, hoje, 12);
  const noMes = meses[meses.length - 1].valor;
  const dataLonga = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" }).format(new Date());

  const indicadores = [
    { rotulo: "Recebido", valor: r.recebido, detalhe: <>Este mês: <Contador valor={noMes} formato="moeda" /></> },
    { rotulo: "A receber", valor: r.aReceber, detalhe: <>De {projetos.filter((p) => p.valor > p.pagamentos.reduce((s, x) => s + x.valor, 0) + 0.005).length} projetos</> },
    { rotulo: "Faturamento", valor: r.faturamento, detalhe: <>{r.quantidade === 1 ? "1 projeto vendido" : `${r.quantidade} projetos vendidos`}</> },
    { rotulo: "Ticket médio", valor: r.ticketMedio, detalhe: <>Por projeto</> },
  ];

  return (
    <>
      <CeuNoturno />
      <main id="conteudo" className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 md:pt-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-claro/30 bg-[#1a1a24] md:size-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/personagem.webp" alt="" width={706} height={978} className="h-auto w-full translate-y-1 scale-[1.9] object-cover object-top" style={{ transformOrigin: "50% 12%" }} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">Olá, Guilherme</h1>
              <p className="text-sm font-light text-claro/80 first-letter:uppercase">{dataLonga}</p>
            </div>
          </div>
          <form action={sair}>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-claro/25 px-4 py-2 text-xs font-medium uppercase tracking-widest text-claro transition-colors hover:bg-claro/10">
              <SignOutIcon className="size-4" aria-hidden="true" /> Sair
            </button>
          </form>
        </header>

        {!bancoOk && (
          <p className={`${cartao} mt-8 p-6 text-sm font-light leading-relaxed text-claro`}>
            <strong className="font-medium text-white">O banco ainda não está conectado.</strong> Na Vercel, em Storage, conecte o Upstash Redis a este projeto e faça um novo deploy.
          </p>
        )}
        {erro && <p className={`${cartao} mt-8 p-6 text-sm text-[#ff8fa6]`}>Não consegui ler os projetos agora. Recarregue a página em alguns segundos.</p>}

        <section aria-label="Resumo financeiro" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {indicadores.map((i, k) => (
            <div key={i.rotulo} className={`${cartao} p-5 ${k === 0 ? "border-[#d94bc8]/40" : ""}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-claro/80">{i.rotulo}</p>
              <p className="hero-heading mt-2 font-black leading-none tracking-tight" style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)" }}>
                <Contador valor={i.valor} formato="moeda" />
              </p>
              <p className="mt-2 text-xs font-light text-claro/80">{i.detalhe}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="titulo-grafico" className={`${cartao} mt-3 p-5 sm:p-6`}>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="titulo-grafico" className="text-sm font-medium uppercase tracking-widest text-white">
              Recebido por mês
            </h2>
            <p className="text-xs font-light text-claro/80">Últimos 12 meses · o mês atual em destaque</p>
          </div>
          <Grafico meses={meses} />
        </section>

        <ListaProjetos projetos={projetos} bancoOk={bancoOk} />
      </main>
    </>
  );
}
